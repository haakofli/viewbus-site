# read the discovery file (Windows path shown)
import json, os, requests

info = json.load(open(os.path.join(os.environ["APPDATA"], "viewbus", "local-api.json")))
base = f"http://127.0.0.1:{info['port']}"
headers = {"Authorization": f"Bearer {info['token']}"}
#---
status = requests.get(f"{base}/v1/status", headers=headers).json()
#---
results = requests.get(
    f"{base}/v1/search",
    headers=headers,
    params={"q": "orders", "limit": 10},
).json()["results"]
#---
requests.post(f"{base}/v1/focus", headers=headers, json={"id": results[0]["id"]})
