from fastapi import FastAPI
from Account_History import get_portfolio_history
from pydantic import BaseModel


class PortfolioHistoryData(BaseModel):
    period: str
    timeframe: str


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
