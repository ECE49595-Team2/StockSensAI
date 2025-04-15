# import requests
# import datetime
# import os
# from dotenv import load_dotenv
# import matplotlib.pyplot as plt
# import matplotlib.ticker as mticker

# load_dotenv()


# def read_secret(secret_name):
#     return os.environ.get(secret_name.upper(), os.getenv(secret_name.upper()))


# API_KEY = read_secret("alpaca_api_key")
# API_SECRET = read_secret("alpaca_api_secret")
# BASE_URL = "https://paper-api.alpaca.markets"  # Use paper trading for testing


# # Get portfolio history
# def get_portfolio_history(period, timeFrame):
#     url = f"{BASE_URL}/v2/account/portfolio/history"
#     headers = {
#         "APCA-API-KEY-ID": API_KEY,
#         "APCA-API-SECRET-KEY": API_SECRET
#     }

#     params = {
#         "period": period,  # Options: 1D, 1W, 1M, 3M, 6M, 1Y, all
#         "timeframe": timeFrame,  # Options: 1Min, 5Min, 15Min, 1H, 1D
#         "extended_hours": "false"
#     }

#     response = requests.get(url, headers=headers, params=params)

#     if response.status_code == 200:
#         return response.json()
#     else:
#         print(f"Error: {response.status_code}, {response.text}")
#         return None


# # Plot portfolio history
# def plot_portfolio(period="1M", timeFrame="1D"):
#     data = get_portfolio_history(period, timeFrame)
#     if data:
#         timestamps = data["timestamp"]
#         equity_values = data["equity"]

#         # Convert timestamps to datetime
#         dates = [datetime.datetime.fromtimestamp(t) for t in timestamps]

#         # Plot trend line
#         plt.figure(figsize=(10, 5))
#         plt.plot(dates, equity_values, marker='o', linestyle='-')
#         plt.xlabel("Date")
#         plt.ylabel("Portfolio Value ($)")
#         plt.title("Portfolio Value Over Time")
#         plt.grid(True)
#         # format y axis to not default to scientific notation
#         plt.gca().yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{int(x):,}"))
#         plt.show()
#     else:
#         print("Failed to retrieve portfolio history.")


# # Run the plot function
# plot_portfolio("1W", "1D")
