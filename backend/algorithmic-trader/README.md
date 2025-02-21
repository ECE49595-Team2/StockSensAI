# Instructions for how to run UI_Server_FastAPI.py locally
- Install docker
- Make sure you are in the backend/algorithmic-trader directory
- Open a terminal and run the following command: docker build -t my-fastest-app .
- After this is finished run the following command: docker run -p 8000:8000 my-fastest-app
- To view swagger documentation go to http://localhost:8000/docs
- You should be able to see the different endpoints
- To test each endpoint, click try it out and fill out the json body with the necessary parameters for each endpoint