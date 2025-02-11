# simple script to interact with alpaca and pull some account info

from alpaca.trading.client import TradingClient
import pandas as pd
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from dotenv import load_dotenv
import os

load_dotenv()

# get keys from .env file. Requires python-dotenv and alpaca account with generated key and secret
ALPACA_API_KEY = os.getenv("API_KEY")
ALPACA_API_SECRET = os.getenv("API_SECRET")

trading_client = TradingClient(
    api_key=ALPACA_API_KEY,
    secret_key=ALPACA_API_SECRET,
    paper=True
)


# helper from https://medium.com/@trademamba/alpaca-algorithmic-trading-api-in-python-part-1-getting-started-with-paper-trading-efbff8992836
class Util:
    @staticmethod
    def to_dataframe(data):
        if isinstance(data, list):
            return pd.DataFrame([item.__dict__ for item in data])
        return pd.DataFrame(data, columns=['tag', 'value']).set_index('tag')


print("ACCOUNT INFO:\n", Util.to_dataframe(trading_client.get_account()), "\n")

positions = trading_client.get_all_positions()

print("POSITIONS:\n", Util.to_dataframe(positions), "\n")

order_data = MarketOrderRequest(
        symbol='NVDA',
        qty=0.5,
        side=OrderSide.BUY,
        time_in_force=TimeInForce.DAY)

# market_order = trading_client.submit_order(order_data=order_data)

orders = trading_client.get_orders()

print("ORDERS:\n", Util.to_dataframe(orders))
