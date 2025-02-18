import alpaca_trade_api as tradeapi
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import os

load_dotenv()


def read_secret(secret_name):
    return os.environ.get(secret_name.upper(), os.getenv(secret_name.upper()))


API_KEY = read_secret("alpaca_api_key")
API_SECRET = read_secret("alpaca_api_secret")
BASE_URL = "https://paper-api.alpaca.markets"  # Use paper trading for testing

# Initialize Alpaca API
api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')


# Fetch historical data from Alpaca
def get_data(symbol, start_date, end_date, timeframe='1Day'):
    """Fetch historical stock data from Alpaca API."""
    barset = api.get_bars(symbol, timeframe, start=start_date, end=end_date, feed="iex").df

    if barset.empty:
        print("No data returned. Check your API access or symbol.")

    return barset


# Simple Moving Average Strategy (Same as before)
def sma_strategy(df, short_window=20, long_window=50):
    df['SMA_short'] = df['close'].rolling(window=short_window).mean()
    df['SMA_long'] = df['close'].rolling(window=long_window).mean()

    df['Signal'] = 0
    df['Signal'][short_window:] = (df['SMA_short'][short_window:] > df['SMA_long'][short_window:]).astype(int)
    df['Position'] = df['Signal'].diff()

    return df


# Backtest the strategy (same logic)
def backtest(df, initial_cash=100000):
    portfolio = pd.DataFrame(index=df.index)
    portfolio['Cash'] = initial_cash
    portfolio['Position'] = 0
    portfolio['Total'] = initial_cash

    for i in range(1, len(df)):
        # Carry forward previous values if no trade occurs
        portfolio['Position'][i] = portfolio['Position'][i-1]
        portfolio['Cash'][i] = portfolio['Cash'][i-1]

        if df['Position'][i] == 1 and portfolio['Cash'][i] > 0:  # Buy signal
            portfolio['Position'][i] = portfolio['Cash'][i] / df['close'][i]
            portfolio['Cash'][i] = 0

        elif df['Position'][i] == -1 and portfolio['Position'][i-1] > 0:  # Sell signal
            portfolio['Cash'][i] = portfolio['Position'][i-1] * df['close'][i]
            portfolio['Position'][i] = 0

        # Update total portfolio value
        portfolio['Total'][i] = portfolio['Cash'][i] + (portfolio['Position'][i] * df['close'][i])

    return portfolio


# Visualize the results
def plot_results(df, portfolio):
    plt.figure(figsize=(12, 6))

    plt.subplot(2, 1, 1)
    plt.plot(df['close'], label="Close Price")
    plt.plot(df['SMA_short'], label="Short-Term SMA", alpha=0.7)
    plt.plot(df['SMA_long'], label="Long-Term SMA", alpha=0.7)
    plt.legend(loc="best")
    plt.title("Stock Price and Moving Averages")

    plt.subplot(2, 1, 2)
    plt.plot(portfolio['Total'], label="Portfolio Value", color='green')
    plt.legend(loc="best")
    plt.title("Portfolio Value Over Time")

    plt.tight_layout()
    plt.show()


# Example usage with Alpaca data
symbol = "AAPL"
start_date = "2020-01-01"
end_date = "2023-01-01"

df = get_data(symbol, start_date, end_date)
df = sma_strategy(df)
portfolio = backtest(df)
plot_results(df, portfolio)
