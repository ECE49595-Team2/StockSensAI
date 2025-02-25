from fastapi import FastAPI
from Account_History import get_portfolio_history
from trading_script import buy_stock, sell_stock
from pydantic import BaseModel


class PortfolioHistoryData(BaseModel):
    period: str
    timeframe: str


class BuySellData(BaseModel):
    ticker: str
    quantity: float


app = FastAPI()


@app.get("/algorithmic_trader")
def read_root():
    return {"message": "FastAPI with Docker!"}


@app.post("/algorithmic_trader/portfolio_history")
def post_portfolio_history(data: PortfolioHistoryData):
    response = {
        "period": data.period,
        "timeframe": data.timeframe,
        "data_points": get_portfolio_history(data.period, data.timeframe)
    }
    return response


@app.post("/algorithmic_trader/buy")
def buy_order(data: BuySellData):
    response = {
        "ticker": data.ticker,
        "quantity": data.quantity,
        "order": buy_stock(data.ticker, data.quantity)
    }
    return response


@app.post("/algorithmic_trader/sell")
def sell_order(data: BuySellData):
    response = {
        "ticker": data.ticker,
        "quantity": data.quantity,
        "order": sell_stock(data.ticker, data.quantity)
    }
    return response
