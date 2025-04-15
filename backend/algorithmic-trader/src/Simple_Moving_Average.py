import alpaca_trade_api as tradeapi
import time
import datetime
import os
from dotenv import load_dotenv
import matplotlib.pyplot as plt
from alpaca_trade_api.rest import APIError
import requests

load_dotenv()


def read_secret(secret_name):
    return os.environ.get(secret_name.upper(), os.getenv(secret_name.upper()))


API_KEY = read_secret("alpaca_api_key")
API_SECRET = read_secret("alpaca_api_secret")
BASE_URL = "https://paper-api.alpaca.markets"  # Use paper trading for testing

# Create Alpaca API client
api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')


def get_historical_data(symbol, timeframe="1Day", days=100):
    """Fetch historical stock data from Alpaca API."""
    end_date = datetime.datetime.now().strftime('%Y-%m-%d')  # Convert to 'YYYY-MM-DD'
    start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).strftime('%Y-%m-%d')

    barset = api.get_bars(symbol, timeframe, start=start_date, end=end_date, feed="iex").df
    if barset.empty:
        print("No data returned. Check your API access or symbol.")
    return barset


def calculate_moving_averages(df, short_window=20, long_window=50):
    df["SMA_Short"] = df["close"].rolling(window=short_window).mean()
    df["SMA_Long"] = df["close"].rolling(window=long_window).mean()
    return df


def generate_signals(df):
    df["Signal"] = 0
    df.loc[df["SMA_Short"] > df["SMA_Long"], "Signal"] = 1  # Buy
    df.loc[df["SMA_Short"] < df["SMA_Long"], "Signal"] = -1  # Sell
    return df


def execute_trade(symbol, signal, portfolio_id):
    try:
        session = requests.Session()
        url = "http://127.0.0.1:8000/get_positions"
        params = {"portfolio_id": portfolio_id,"symbol": symbol}

        response = session.get(url, cookies=session.cookies.get_dict(), params=params)
        qty = response.json()["qty"]
    except APIError:
        qty = 0

    if signal == 1:  # Buy
        if qty == 0:  # Only buy if no existing position
            session = requests.Session()
            url = "http://127.0.0.1:8000/buy"
            params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": qty}

            response = session.post(url, cookies=session.cookies.get_dict(), params=params)

    elif signal == -1:  # Sell
        if qty > 0:  # Only sell if currently holding the stock
            session = requests.Session()
            url = "http://127.0.0.1:8000/sell"
            params = {"portfolio_id": portfolio_id, "symbol": symbol, "quantity": qty}

            response = session.post(url, cookies=session.cookies.get_dict(), params=params)


def run_strategy(symbol, portfolio_id):
    df = get_historical_data(symbol)
    df = calculate_moving_averages(df)
    df = generate_signals(df)

    latest_signal = df["Signal"].iloc[-1]
    execute_trade(symbol, latest_signal, portfolio_id)


def SMA_visualizer():
    symbol = "AAPL"  # You can change this to any stock ticker
    df = get_historical_data(symbol)
    print(df)

    # Calculate moving averages
    df = calculate_moving_averages(df)

    # Plot stock price & moving averages
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df["close"], label="Closing Price", color="black", linewidth=1.5)
    plt.plot(df.index, df["SMA_Short"], label="20-Day SMA", color="blue", linestyle="dashed")
    plt.plot(df.index, df["SMA_Long"], label="50-Day SMA", color="red", linestyle="dashed")

    # Formatting the plot
    plt.xlabel("Date")
    plt.ylabel("Price ($)")
    plt.title(f"{symbol} Stock Price with Moving Averages")
    plt.legend()
    plt.grid(True)

    # Show plot
    plt.show()


if __name__ == "__main__":
    run_strategy("AAPL")
