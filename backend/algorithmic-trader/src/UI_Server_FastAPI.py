from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import couchdb
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi
from typing import List, Dict
from apscheduler.schedulers.background import BackgroundScheduler
from Simple_Moving_Average import run_strategy
import uuid

load_dotenv()

API_KEY = os.environ.get("ALPACA_API_KEY", os.getenv("ALPACA_API_KEY"))
API_SECRET = os.environ.get("ALPACA_API_SECRET", os.getenv("ALPACA_API_SECRET"))
api = tradeapi.REST(API_KEY, API_SECRET, base_url="https://paper-api.alpaca.markets")

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
            trade = api.get_latest_trade(symbol)
            prices[symbol] = trade.price
        except Exception as e:
            print(f"Error fetching price for {symbol}: {e}")
            prices[symbol] = None  # Handle missing prices gracefully

    return prices


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
        
        job = scheduler.add_job(run_strategy, "interval", seconds=60, args=[symbol, portfolio_id], id=strategy_id)
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


@app.post("/update-account-history")
async def update_account_history(portfolio_id: str):
    """Updates the user's account value history based on their owned stocks."""
    try:
        user_doc = db.get(portfolio_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="Portfolio not found")

        transactions = user_doc.get("transactions", {})
        buying_power = user_doc.get("buying_power", [])
        existing_account_history = {entry["timestamp"]: entry["value"] for entry in user_doc.get("account_value_history", [])}
        historical_data = []
        total_value = 0

        start_date = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")  # 7 days ago
        end_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")  # Yesterday

        if transactions:
            stock_list = list(transactions.keys())
            bars = api.get_bars(stock_list, tradeapi.rest.TimeFrame.Day, start=start_date, end=end_date).df

            if len(stock_list) == 1:
                # Only one stock, reshape manually
                stock = stock_list[0]
                closing_prices = bars["close"].to_frame().rename(columns={"close": stock})
                closing_prices.index = closing_prices.index.strftime("%Y-%m-%d")
            else:
                # Multiple stocks
                closing_prices = bars.reset_index().pivot(index="timestamp", columns="symbol", values="close")
                closing_prices.index = closing_prices.index.strftime("%Y-%m-%d")
        else:
            closing_prices = {}

        for x in range(6):
            weekend = False
            total_value = 0
            day = datetime.now() - timedelta(days=6-x)
            formatted_day = day.strftime("%Y-%m-%d")

            if(formatted_day in existing_account_history):
                historical_data_point = {"timestamp": formatted_day, "value": existing_account_history[formatted_day]}
                historical_data.append(historical_data_point)
                continue # don't need to recalculate if already in account_value_history

            for stock,value in transactions.items():
                for transaction in value:
                    price = closing_prices.loc[formatted_day, stock] if formatted_day in closing_prices.index else None
                    if(price is not None):
                        if(datetime.fromisoformat(transaction["timestamp"]) < day and transaction["type"] == "Buy"):
                            total_value += closing_prices.loc[formatted_day, stock] * transaction["quantity"]
                        elif(datetime.fromisoformat(transaction["timestamp"]) < day and transaction["type"] == "Sell"):
                            total_value -= closing_prices.loc[formatted_day, stock] * transaction["quantity"]
                    else:
                        total_value = historical_data[x-1]["value"] #default to previous values
                        weekend = True
            
            latest_buying_power = -1000000
            for moneys in buying_power:
                if(datetime.fromisoformat(moneys[1]) < day):
                    latest_buying_power = moneys[0]
            if(latest_buying_power == -1000000):
                if(weekend == False):
                    total_value += 100000 #no buying power set, before account was created
            else:
                if(weekend == False):
                    total_value += latest_buying_power
            
            historical_data_point = {"timestamp": formatted_day, "value": total_value}
            historical_data.append(historical_data_point)

        weekend = False
        #last data point is current value
        total_value = 0
        day = datetime.now()
        formatted_day = day.strftime("%Y-%m-%d")
        current_values = get_stock_prices(transactions.keys())
        for stock,value in transactions.items():
                for transaction in value:
                    price = current_values[stock] if stock in current_values else None
                    if(price is not None):
                        if(transaction["type"] == "Buy"):
                            total_value += current_values[stock] * transaction["quantity"]
                        elif(transaction["type"] == "Sell"):
                            total_value -= current_values[stock] * transaction["quantity"]
                    else:
                        total_value = historical_data[x-1]["value"]
                        weekend = True

        latest_buying_power = -1000000
        for moneys in buying_power:
            if(datetime.fromisoformat(moneys[1]) < day):
                latest_buying_power = moneys[0]
        if(latest_buying_power == -1000000):
            if(weekend == False):
                total_value += 100000 #no buying power set, before account was created
        else:
            if(weekend == False):
                total_value += latest_buying_power
        
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

        new_buying_power = user_doc.get("buying_power", [[100000, "dummy"]])[-1][0] - (stock_prices.get(symbol, 0) * quantity)
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
        user_doc["positions"] = positions

        new_buying_power = user_doc.get("buying_power", [[100000, "dummy"]])[-1][0] + (stock_prices.get(symbol, 0) * quantity)
        user_doc["buying_power"].append([new_buying_power, current_time]) 
        db.save(user_doc)

        return {"message": "Sold stock", "transaction": new_transaction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
