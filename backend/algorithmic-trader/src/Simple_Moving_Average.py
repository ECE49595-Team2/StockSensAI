import matplotlib.pyplot as plt
from backtesting import Backtest, Strategy
import pandas as pd
import yfinance as yf
import numpy as np
import warnings
import requests
import matplotlib.pyplot as plt


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


def moving_average(arr, window):
    result = np.full_like(arr, fill_value=np.nan, dtype=np.float64)
    for i in range(window - 1, len(arr)):
        result[i] = np.mean(arr[i - window + 1:i + 1])
    return result


def get_data(symbol):
    """Fetch historical stock data from yfinance API."""
    stock = yf.Ticker(symbol)
    data = stock.history(period="5Y")
    return data


# Main function to run in start_strategy endpoint
def run_SMA(portfolio_id, symbol):
    df = get_data(symbol)
    sma_short = moving_average(df["Close"], 20)
    sma_long = moving_average(df["Close"], 50)
    i = len(df) - 1
    if pd.isna(sma_short[i]) or pd.isna(sma_long[i]):
        return  # Skip if SMAs are not yet available

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

    if sma_short[i] > sma_long[i] and qty == 0:
        amount_to_buy = int(buying_power / current_price)
        url = "http://127.0.0.1:8000/buy"
        params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": amount_to_buy}
        response = session.post(url, cookies=session.cookies.get_dict(), params=params)

    elif sma_short[i] < sma_long[i] and qty > 0:
        url = "http://127.0.0.1:8000/sell"
        params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": qty}
        response = session.post(url, cookies=session.cookies.get_dict(), params=params)


# Backtesting Class
class SMACross(Strategy):
    sma1 = 20
    sma2 = 50

    def init(self):
        self.sma_short = self.I(moving_average, self.data.Close, self.sma1)
        self.sma_long = self.I(moving_average, self.data.Close, self.sma2)


    def next(self):
        i = len(self.data) - 1
        if pd.isna(self.sma_short[i]) or pd.isna(self.sma_long[i]):
            return  # Skip if SMAs are not yet available
        if self.sma_short[i] > self.sma_long[i] and not self.position:
            self.buy()
        elif self.sma_short[i] < self.sma_long[i] and self.position.is_long:
            self.sell()



if __name__ == "__main__":
    df = get_data("AAPL")
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

    # Plot it
    plt.figure(figsize=(10, 5))
    plt.plot(equity.index, equity.values)
    plt.title('Portfolio Value Over Time')
    plt.xlabel('Time')
    plt.ylabel('Equity ($)')
    plt.grid(True)
    plt.tight_layout()
    plt.show()
