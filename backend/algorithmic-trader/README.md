# Swagger documentation is hosted here https://app.swaggerhub.com/apis/purdue-847/fast-api/0.4.0
# Instructions for how to run UI_Server_FastAPI.py locally
- Install docker
- Make sure you are in the backend/algorithmic-trader directory
- Open a terminal and run the following command: docker build -t my-fastest-app .
- After this is finished run the following command: docker run -p 8000:8000 my-fastest-app
- To view swagger documentation go to http://localhost:8000/docs
- You should be able to see the different endpoints
- To test each endpoint, click try it out and fill out the json body with the necessary parameters for each endpoint

# How to add your own strategies
- Navigate to the Strategies directory
- Make a new python file
- Follow a similar structure to Simple_Moving_Average.py. Namely, you must have a class name(Strategy) for the backtesting framework with methods init and next.
- If only backtesting, this is all you need. You can then import the class into Run_Backtester.py and replace SMACross on line 30 with the name of your class. 
- If you want to integrate the new strategy into the app, you will need to define another method that uses the API to buy and sell stocks in a similar way to run_SMA in Simple_Moving_Average.py. Currently, the API will only select the run_SMA function when starting a strategy, so you will also need to modify this endpoint to select between multiple strategies. This is left as future work for the project.