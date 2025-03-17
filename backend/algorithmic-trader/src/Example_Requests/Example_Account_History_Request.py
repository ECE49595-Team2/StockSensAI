import requests

url = "http://127.0.0.1:8000/update-account-history"
cookies = {"AuthSession": "ea77414dc0d5aa37e41826361a00017e"}  # Set user_id as a cookie
#params = {"stock": "AAPL", "quantity": 5}

response = requests.post(url, cookies=cookies)
print(response.json())
print(response.status_code)
