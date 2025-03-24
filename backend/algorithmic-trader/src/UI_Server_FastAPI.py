from fastapi import FastAPI, Depends, Request, HTTPException
from pydantic import BaseModel
import couchdb
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi
from typing import List, Dict
import requests

load_dotenv()

API_KEY = os.environ.get("ALPACA_API_KEY", os.getenv("ALPACA_API_KEY"))
API_SECRET = os.environ.get("ALPACA_API_SECRET", os.getenv("ALPACA_API_SECRET"))
api = tradeapi.REST(API_KEY, API_SECRET, base_url="https://paper-api.alpaca.markets")

# for local testing
# COUCHDB_URL = "http://admin:admin@127.0.0.1:5984"
# for deployment
COUCHDB_URL = "http://database:5984"

DB_NAME = "_users"
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


def get_user_from_cookie(request: Request):
    """Extracts the user ID from the AuthSession cookie."""
    auth_cookie = request.cookies.get("AuthSession")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Query CouchDB for the session info
    headers = {"Cookie": f"AuthSession={auth_cookie}"}
    response = requests.get(f"{COUCHDB_URL}/_session", headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session")

    session_data = response.json()
    if not session_data.get("ok"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_id = session_data["userCtx"]["name"]
    return user_id


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "FastAPI with Docker!"}


@app.post("/update-account-history")
async def update_account_history(request: Request, user_id: str = Depends(get_user_from_cookie)):
    """Updates the user's account value history based on their owned stocks."""
    try:
        couchdb_user_id = f"org.couchdb.user:{user_id}"
        user_doc = db.get(couchdb_user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

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
            total_value = 0
            day = datetime.now() - timedelta(days=6-x)
            formatted_day = day.strftime("%Y-%m-%d")

            if(formatted_day in existing_account_history):
                historical_data_point = {"timestamp": formatted_day, "value": existing_account_history[formatted_day]}
                historical_data.append(historical_data_point)
                continue # don't need to recalculate if already in account_value_history

            for stock,value in transactions.items():
                for transaction in value:
                    if(datetime.fromisoformat(transaction["timestamp"]) < day and transaction["type"] == "Buy"):
                        total_value += closing_prices.loc[formatted_day, stock] * transaction["quantity"]
                    elif(datetime.fromisoformat(transaction["timestamp"]) < day and transaction["type"] == "Sell"):
                        total_value -= closing_prices.loc[formatted_day, stock] * transaction["quantity"]
            
            latest_buying_power = -1000000
            for moneys in buying_power:
                if(datetime.fromisoformat(moneys[1]) < day):
                    latest_buying_power = moneys[0]
            if(latest_buying_power == -1000000):
                total_value += 100000 #no buying power set, before account was created
            else:
                total_value += latest_buying_power
            
            historical_data_point = {"timestamp": formatted_day, "value": total_value}
            historical_data.append(historical_data_point)

        #last data point is current value
        total_value = 0
        day = datetime.now()
        formatted_day = day.strftime("%Y-%m-%d")
        current_values = get_stock_prices(transactions.keys())
        for stock,value in transactions.items():
                for transaction in value:
                    if(transaction["type"] == "Buy"):
                        total_value += current_values[stock] * transaction["quantity"]
                    elif(transaction["type"] == "Sell"):
                        total_value -= current_values[stock] * transaction["quantity"]

        latest_buying_power = -1000000
        for moneys in buying_power:
            if(datetime.fromisoformat(moneys[1]) < day):
                latest_buying_power = moneys[0]
        if(latest_buying_power == -1000000):
            total_value += 100000 #no buying power set, before account was created
        else:
            total_value += latest_buying_power
        
        historical_data_point = {"timestamp": formatted_day, "value": total_value}
        historical_data.append(historical_data_point)

        user_doc["account_value_history"] = historical_data
        db.save(user_doc)

        return {"message": "Account history updated", "new_value": historical_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/buy")
async def buy_order(request: Request, stock: str, quantity: float, user_id: str = Depends(get_user_from_cookie)):
    try:
        couchdb_user_id = f"org.couchdb.user:{user_id}"
        user_doc = db.get(couchdb_user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        transactions = user_doc.get("transactions", {})
        stock_prices = get_stock_prices([stock])

        current_time = datetime.now().isoformat()

        new_transaction = {"type": "Buy", "quantity": quantity, "price": stock_prices.get(stock, 0), "timestamp": current_time}
        if stock not in transactions:
            transactions[stock] = []
        transactions[stock].append(new_transaction)
        user_doc["transactions"] = transactions

        new_buying_power = user_doc.get("buying_power", [[100000, "dummy"]])[-1][0] - (stock_prices.get(stock, 0) * quantity)
        user_doc["buying_power"].append([new_buying_power, current_time]) 
        db.save(user_doc)

        return {"message": "Bought stock", "transaction": new_transaction}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sell")
async def sell_order(request: Request, stock: str, quantity: float, user_id: str = Depends(get_user_from_cookie)):
    try:
        couchdb_user_id = f"org.couchdb.user:{user_id}"
        user_doc = db.get(couchdb_user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        transactions = user_doc.get("transactions", {})
        stock_prices = get_stock_prices([stock])

        current_time = datetime.now().isoformat()

        new_transaction = {"type": "Sell", "quantity": quantity, "price": stock_prices.get(stock, 0), "timestamp": current_time}
        if stock not in transactions:
            transactions[stock] = []
        transactions[stock].append(new_transaction)
        user_doc["transactions"] = transactions

        new_buying_power = user_doc.get("buying_power", [[100000, "dummy"]])[-1][0] + (stock_prices.get(stock, 0) * quantity)
        user_doc["buying_power"].append([new_buying_power, current_time]) 
        db.save(user_doc)

        return {"message": "Sold stock", "transaction": new_transaction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
