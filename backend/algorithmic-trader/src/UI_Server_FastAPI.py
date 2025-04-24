from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import couchdb
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import List, Dict
from apscheduler.schedulers.background import BackgroundScheduler
from Strategies.Simple_Moving_Average import run_SMA, SMACross
import uuid
import yfinance as yf
from backtesting import Backtest
import warnings
import pandas as pd

load_dotenv()

# for local testing
# COUCHDB_URL = "http://admin:admin@127.0.0.1:5984"
# for deployment
COUCH_DB_USER = os.environ.get("COUCHDB_USER", os.getenv("COUCHDB_USER"))
COUCH_DB_PASSWORD = os.environ.get("COUCHDB_PASSWORD", os.getenv("COUCHDB_PASSWORD"))
COUCHDB_URL = f"http://{COUCH_DB_USER}:{COUCH_DB_PASSWORD}@database:5984"

DB_NAME = "portfolio"
server = couchdb.Server(COUCHDB_URL)
if DB_NAME not in server:
    db = server.create(DB_NAME)
else:
    db = server[DB_NAME]


class AccountValueEntry(BaseModel):
    timestamp: str
    value: float


class Trade(BaseModel):
    type: str  # "buy" or "sell"
    quantity: float
    price: float
    timestamp: datetime


class UserDocument(BaseModel):
    _id: str
    transactions: Dict[str, List[Trade]]
    account_value_history: List[AccountValueEntry]
    buying_power: List[List[float | str]] # buying power at certain timestamp. Changes if user buys or sells stock


def get_stock_prices(symbols):
    """Fetch the latest stock prices from Alpaca API."""
    prices = {}
    
    for symbol in symbols:
        try:
            stock = yf.Ticker(symbol)
            data = stock.history(period='1d')
            current_price = data['Close'].iloc[-1]
            prices[symbol] = current_price
        except Exception as e:
            print(f"Error fetching price for {symbol}: {e}")
            prices[symbol] = None  # Handle missing prices gracefully

    return prices


def get_num_days(period):
    days = 0
    if(period == "7d"):
        days = 7
    elif(period == "1mo"):
        days = 30
    elif(period == "3mo"):
        days = 90
    elif(period == "1y"):
        days = 365
    elif(period == "5y"):
        days = 365 * 5
    return days


def get_data(symbol):
    """Fetch historical stock data from yfinance API."""
    stock = yf.Ticker(symbol)
    data = stock.history(period="5Y")
    return data


app = FastAPI()
scheduler = BackgroundScheduler()
scheduler.start()
jobs = {}


@app.get("/")
def read_root():
    return {"message": "FastAPI with Docker!"}


@app.post("/start_strategy")
def start_strategy(portfolio_id: str, symbol: str):
    """Start a new strategy"""
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        strategy = user_doc.get("strategy_id", "")
        if(strategy != ""):
            raise HTTPException(status_code=400, detail="A strategy is already running")
        strategy_id = str(uuid.uuid4())
        user_doc["strategy_id"] = strategy_id
        db.save(user_doc)
        
        job = scheduler.add_job(run_SMA, "interval", seconds=60, args=[portfolio_id, symbol], id=strategy_id)
        jobs[strategy_id] = job
        return {"message": f"Started strategy {strategy_id} for portfolio {portfolio_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/stop_strategy")
def stop_strategy(portfolio_id: str):
    """Stop a running strategy"""
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        strategy_id = user_doc.get("strategy_id", "")
        if(strategy_id == ""):
            raise HTTPException(status_code=400, detail="No strategy is running in this portfolio")
        job = jobs.pop(strategy_id, None)
        user_doc["strategy_id"] = ""
        db.save(user_doc)
        if job:
            job.remove()
            return {"message": f"Stopped strategy {strategy_id}"}
        else:
            raise HTTPException(status_code=500, detail="Strategy_id unable to be found in dict, this should not happen")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get_positions")
def get_stock_position(portfolio_id: str, symbol: str):
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        positions = user_doc.get("positions", {})
        if(symbol in positions):
            return {"qty": positions[symbol]}
        return {"qty": 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/get_buying_power")
def buying_power(portfolio_id: str):
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        buying_power = user_doc.get("buying_power")
        if(not buying_power):
            return {"buying_power": 100000}
        else:
            return {"buying_power": buying_power[-1][0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/get_strategy_backtester")    
def strategy_backtester(symbol: str):
    try:
        df = get_data(symbol)
        df = df.reset_index()
        # Keep only required columns for Backtest
        df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)
        bt = Backtest(df, SMACross, cash=100000, commission=.002)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", category=UserWarning)
            result = bt.run()
        print(result)
        equity = result['_equity_curve']['Equity']
        retval = []
        for i in range(len(equity.values)):
            retval.append({"Index": equity.index[i], "Value": equity.values[i]})
        return {"Data": retval}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/update-account-history")
async def update_account_history(portfolio_id: str, period = "7d"):
    """Updates the user's account value history based on their owned stocks."""
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        VALID_PERIODS = {"7d", "1mo", "3mo", "1y", "5y"}
        if(period not in VALID_PERIODS):
            raise HTTPException(status_code=400, detail="Period is invalid")

        transactions = user_doc.get("transactions", {})
        buying_power = user_doc.get("buying_power", [])
        existing_account_history = {entry["timestamp"]: entry["value"] for entry in user_doc.get("account_value_history", [])}
        historical_data = []
        total_value = 0

        if transactions:
            closing_prices = {}
            # Loop through the stock symbols
            for symbol in transactions.keys():
                # Fetch data for the past 7 days for each symbol
                stock = yf.Ticker(symbol)
                data = stock.history(period=period)
                # Store the data in the dictionary with the symbol as the key
                closing_prices[symbol] = data
        else:
            closing_prices = {}

        days = get_num_days(period)

        for x in range(days):
            no_data = False
            invalid = False
            total_value = 0
            day = datetime.combine((datetime.now() - timedelta(days=days - 1 - x)).date(), datetime.max.time())
            formatted_day = day.strftime("%Y-%m-%d")

            if(formatted_day in existing_account_history and x != days - 1):
                historical_data_point = {"timestamp": formatted_day, "value": existing_account_history[formatted_day]}
                historical_data.append(historical_data_point)
                continue # don't need to recalculate if already in account_value_history

            for stock,value in transactions.items():
                for transaction in value:
                    price = closing_prices[stock].loc[formatted_day, "Close"] if formatted_day in closing_prices[stock].index else None
                    if(price is not None):
                        if(datetime.fromisoformat(transaction["timestamp"]) <= day and transaction["type"] == "Buy"):
                            total_value += closing_prices[stock].loc[formatted_day, "Close"] * transaction["quantity"]
                        elif(datetime.fromisoformat(transaction["timestamp"]) <= day and transaction["type"] == "Sell"):
                            total_value -= closing_prices[stock].loc[formatted_day, "Close"] * transaction["quantity"]
                    else:
                        no_data = True
                        break

                if(no_data):
                    if(x >= 1 and len(historical_data) == x):
                        total_value = historical_data[x-1]["value"] #default to previous values
                    else:
                        invalid = True
                    break
            
            latest_buying_power = -1000000
            for moneys in buying_power:
                if(datetime.fromisoformat(moneys[1]) <= day):
                    latest_buying_power = moneys[0]
            if(latest_buying_power == -1000000):
                if(no_data == False):
                    total_value += 100000 #no buying power set, before account was created
            else:
                if(no_data == False):
                    total_value += latest_buying_power
            if(invalid == False):
                historical_data_point = {"timestamp": formatted_day, "value": total_value}
                historical_data.append(historical_data_point)

        user_doc["account_value_history"] = historical_data
        db.save(user_doc)

        return {"message": "Account history updated", "new_value": historical_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/buy")
async def buy_order(portfolio_id: str, symbol: str, quantity: float):
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        transactions = user_doc.get("transactions", {})
        stock_prices = get_stock_prices([symbol])
        positions = user_doc.get("positions", {})

        current_time = datetime.now().isoformat()

        new_transaction = {"type": "Buy", "quantity": quantity, "price": stock_prices.get(symbol, 0), "timestamp": current_time}
        if symbol not in transactions:
            transactions[symbol] = []
        transactions[symbol].append(new_transaction)
        user_doc["transactions"] = transactions

        positions[symbol] = positions.get(symbol, 0) + quantity
        user_doc["positions"] = positions

        buying_power = user_doc.get("buying_power")
        temp_buying_power = 0
        if not buying_power:
            temp_buying_power = 100000
        else:
            temp_buying_power = buying_power[-1][0]
        new_buying_power = temp_buying_power - (stock_prices.get(symbol, 0) * quantity)
        new_buying_list = user_doc.get("buying_power", {})
        if(new_buying_power < 0):
            raise HTTPException(status_code=400, detail="Not enough buying power to buy quantity of stock")
        if(new_buying_list):
            user_doc["buying_power"].append([new_buying_power, current_time])
        else:
            user_doc["buying_power"] = [[new_buying_power, current_time]]
        db.save(user_doc)

        return {"message": "Bought stock", "transaction": new_transaction}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sell")
async def sell_order(portfolio_id: str, symbol: str, quantity: float):
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        transactions = user_doc.get("transactions", {})
        stock_prices = get_stock_prices([symbol])
        positions = user_doc.get("positions", {})

        current_time = datetime.now().isoformat()

        if(symbol not in positions):
            raise HTTPException(status_code=400, detail="Cannot sell stock not in portfolio")
        elif(positions[symbol] < quantity):
            raise HTTPException(status_code=400, detail="Cannot sell more stock than owned")

        new_transaction = {"type": "Sell", "quantity": quantity, "price": stock_prices.get(symbol, 0), "timestamp": current_time}
        if symbol not in transactions:
            transactions[symbol] = []
        transactions[symbol].append(new_transaction)
        user_doc["transactions"] = transactions

        positions[symbol] -= quantity
        if(positions[symbol] == 0):
            position = positions.pop(symbol, None)
            if(position):
                position.remove()
        user_doc["positions"] = positions

        buying_power = user_doc.get("buying_power")
        temp_buying_power = 0
        if not buying_power:
            temp_buying_power = 100000
        else:
            temp_buying_power = buying_power[-1][0]

        new_buying_power = temp_buying_power + (stock_prices.get(symbol, 0) * quantity)
        user_doc["buying_power"].append([new_buying_power, current_time]) 
        db.save(user_doc)

        return {"message": "Sold stock", "transaction": new_transaction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/single_day_performance")
async def single_day(portfolio_id: str):
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        positions = user_doc.get("positions", {})
        current_values = get_stock_prices(positions.keys())
        return_value = []
        for symbol, value in positions.items():
            # have to use yahoo finance to get today's opening price
            stock = yf.Ticker(symbol)
            hist = stock.history(period='1d')  # Fetch 1 day's worth of data
            # Get the opening price for today
            open_price = hist['Open'].iloc[0]
            gain = ((current_values[symbol] - open_price) / open_price) * 100
            new_entry = {"ticker": symbol, "count": value, "gain": gain}
            return_value.append(new_entry)
        return {"positions": return_value}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
