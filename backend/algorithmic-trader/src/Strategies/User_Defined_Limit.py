from backtesting import Strategy
import pandas as pd
import yfinance as yf
import numpy as np
import requests


# Helper functions
def get_stock_prices(symbols):
    """Fetch the latest stock prices from yfinance API."""
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


# Main function to run in start_strategy endpoint
def run_Limit(portfolio_id, symbol, buy_thresh, sell_thresh):
    session = requests.Session()
    url = "http://127.0.0.1:8000/get_positions"
    params = {"portfolio_id": portfolio_id,"symbol": symbol}
    response = session.get(url, cookies=session.cookies.get_dict(), params=params)
    qty = response.json()["qty"]

    url = "http://127.0.0.1:8000/get_buying_power"
    params = {"portfolio_id": portfolio_id}
    response = session.get(url, cookies=session.cookies.get_dict(), params=params)
    buying_power = response.json()["buying_power"]

    current_price = get_stock_prices([symbol])

    if current_price.get(symbol, 100000) < buy_thresh and qty == 0:
        amount_to_buy = int(buying_power / current_price.get(symbol, 100000))
        url = "http://127.0.0.1:8000/buy"
        params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": amount_to_buy}
        response = session.post(url, cookies=session.cookies.get_dict(), params=params)

    elif current_price.get(symbol, 0) > sell_thresh and qty > 0:
        url = "http://127.0.0.1:8000/sell"
        params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": qty}
        response = session.post(url, cookies=session.cookies.get_dict(), params=params)


# Backtesting Class
class Limit(Strategy):
    buy_limit = 0.02
    sell_limit = 0.02

    def init(self):
        pass


    def next(self):
        if self.data.Close[-1] < self.buy_limit:
            self.buy()

        elif self.data.Close[-1] > self.sell_limit:
            self.sell()