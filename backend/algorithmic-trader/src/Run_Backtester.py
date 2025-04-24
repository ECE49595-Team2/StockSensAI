from backtesting import Backtest
import warnings
import yfinance as yf
from Strategies.Simple_Moving_Average import SMACross
import matplotlib.pyplot as plt
import pandas as pd


def get_data(symbol):
    """Fetch historical stock data from yfinance API."""
    stock = yf.Ticker(symbol)
    data = stock.history(period="5Y")
    return data


def run_backtest(data, strategy_class, cash=10_000, commission=0.001):
    bt = Backtest(data, strategy_class, cash=cash, commission=commission)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=UserWarning)
        return bt.run()
    

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
