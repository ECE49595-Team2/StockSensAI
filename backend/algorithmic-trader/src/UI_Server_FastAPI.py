from fastapi import FastAPI, Depends, Request, HTTPException
from pydantic import BaseModel
import couchdb
from datetime import datetime
import os
from dotenv import load_dotenv
import alpaca_trade_api as tradeapi
from typing import List, Dict

load_dotenv()


def read_secret(secret_name):
    return os.environ.get(secret_name.upper(), os.getenv(secret_name.upper()))


API_KEY = os.environ.get("ALPACA_API_KEY", os.getenv("ALPACA_API_KEY"))
API_SECRET = os.environ.get("ALPACA_API_SECRET", os.getenv("ALPACA_API_SECRET"))
api = tradeapi.REST(API_KEY, API_SECRET, base_url="https://paper-api.alpaca.markets")

COUCHDB_URL = "http://admin:admin@127.0.0.1:5984"
DB_NAME = "users"
server = couchdb.Server(COUCHDB_URL)
if DB_NAME not in server:
    db = server.create(DB_NAME)
else:
    db = server[DB_NAME]


class AccountValueEntry(BaseModel):
    timestamp: str
    value: float


class UserDocument(BaseModel):
    _id: str
    stocks_owned: Dict[str, float]  # Example: {"AAPL": 5, "TSLA": 2}
    account_value_history: List[AccountValueEntry]
    buying_power: float
    creation_date: str


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
    """Extracts the user ID from the authentication cookie."""
    auth_cookie = request.cookies.get("AuthSession")
    if not auth_cookie:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = auth_cookie  
    return user_id


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "FastAPI with Docker!"}


@app.post("/update-account-history")
async def update_account_history(request: Request, user_id: str = Depends(get_user_from_cookie)):
    """Updates the user's account value history based on their owned stocks."""
    try:
        user_doc = db.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        stocks_owned = user_doc.get("stocks_owned", {})
        stock_prices = get_stock_prices(list(stocks_owned.keys()))
        total_value = user_doc.get("buying_power", 0) + sum(stock_prices.get(symbol, 0) * qty for symbol, qty in stocks_owned.items())
        current_time = datetime.now().isoformat() 
        entry = {
            "timestamp": current_time,
            "value": total_value
        }
        user_doc.setdefault("account_value_history", []).append(entry)
        db[user_id] = user_doc

        return {"message": "Account history updated", "new_value": total_value}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/buy")
async def buy_order(request: Request, stock: str, quantity: float, user_id: str = Depends(get_user_from_cookie)):
    try:
        user_doc = db.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        stocks_owned = user_doc.get("stocks_owned", {})
        stocks_owned[stock] = stocks_owned.get(stock, 0) + quantity
        user_doc["stocks_owned"] = stocks_owned
        stock_prices = get_stock_prices([stock])
        new_buying_power = user_doc.get("buying_power", 100000) - (stock_prices.get(stock, 0) * quantity)
        user_doc["buying_power"] = new_buying_power 
        db[user_id] = user_doc

        return {"message": "Bought stock", "new_stock_quantity": stocks_owned[stock]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sell")
async def sell_order(request: Request, stock: str, quantity: float, user_id: str = Depends(get_user_from_cookie)):
    try:
        user_doc = db.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        stocks_owned = user_doc.get("stocks_owned", {})
        stocks_owned[stock] = max(stocks_owned.get(stock, 0) - quantity, 0)
        user_doc["stocks_owned"] = stocks_owned
        stock_prices = get_stock_prices([stock])
        new_buying_power = user_doc.get("buying_power", 100000) + (stock_prices.get(stock, 0) * quantity)
        user_doc["buying_power"] = new_buying_power 
        db[user_id] = user_doc

        return {"message": "Sold stock", "new_stock_quantity": stocks_owned[stock]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
