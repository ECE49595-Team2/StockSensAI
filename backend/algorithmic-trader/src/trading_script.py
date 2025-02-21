# simple script to interact with alpaca and pull some account info

from alpaca.trading.client import TradingClient
import pandas as pd
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce
from dotenv import load_dotenv
import os

load_dotenv()


def read_secret(secret_name):
    return os.environ.get(secret_name.upper(), os.getenv(secret_name.upper()))


ALPACA_API_KEY = read_secret("alpaca_api_key")
ALPACA_API_SECRET = read_secret("alpaca_api_secret")

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


def buy_stock(ticker, quantity):
    order_data = MarketOrderRequest(
            symbol=ticker,
            qty=quantity,
            side=OrderSide.BUY,
            time_in_force=TimeInForce.DAY)

    market_order = trading_client.submit_order(order_data=order_data)
    return market_order


def sell_stock(ticker, quantity):
    order_data = MarketOrderRequest(
            symbol=ticker,
            qty=quantity,
            side=OrderSide.SELL,
            time_in_force=TimeInForce.DAY)

    market_order = trading_client.submit_order(order_data=order_data)
    return market_order
