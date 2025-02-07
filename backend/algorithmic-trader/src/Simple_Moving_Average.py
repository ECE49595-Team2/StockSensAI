import alpaca_trade_api as tradeapi
import pandas as pd
import numpy as np
import time
import datetime
import os
from dotenv import load_dotenv
import matplotlib.pyplot as plt

load_dotenv()

# Alpaca API keys
API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")
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

def execute_trade(symbol, signal):
    position = api.get_position(symbol)
    qty = abs(int(float(position.qty))) if position else 0

    if signal == 1:  # Buy
        if qty == 0:  # Only buy if no existing position
            api.submit_order(symbol=symbol, qty=1, side="buy", type="market", time_in_force="gtc")
            print(f"Bought {symbol}")

    elif signal == -1:  # Sell
        if qty > 0:  # Only sell if currently holding the stock
            api.submit_order(symbol=symbol, qty=qty, side="sell", type="market", time_in_force="gtc")
            print(f"Sold {symbol}")

def run_strategy(symbol):
    while True:
        df = get_historical_data(symbol)
        df = calculate_moving_averages(df)
        df = generate_signals(df)

        latest_signal = df["Signal"].iloc[-1]
        execute_trade(symbol, latest_signal)

        time.sleep(60)  # Wait before checking again

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
    #SMA_visualizer()
    
