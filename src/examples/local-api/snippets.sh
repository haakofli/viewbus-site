# read the discovery file (Windows path shown)
PORT=$(jq -r .port "$APPDATA/viewbus/local-api.json")
TOKEN=$(jq -r .token "$APPDATA/viewbus/local-api.json")
BASE="http://127.0.0.1:$PORT"
AUTH="Authorization: Bearer $TOKEN"
#---
curl -H "$AUTH" "$BASE/v1/status"
#---
curl -H "$AUTH" "$BASE/v1/search?q=orders&limit=10"
#---
curl -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"id":"/subscriptions/…/queues/orders-dead"}' \
  "$BASE/v1/focus"
