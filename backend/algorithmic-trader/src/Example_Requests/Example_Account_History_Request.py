import requests

url = "http://localhost:5984/_session"
data = {"name": "my_username", "password": "mypassword"}
session = requests.Session()

response = session.post(url, json=data)
print(response.json())  # Should return {"ok": true, "name": "my_username", "roles": []}

url = "http://127.0.0.1:8000/update-account-history"

response = session.post(url, cookies=session.cookies.get_dict())
print(response.json())
print(response.status_code)
