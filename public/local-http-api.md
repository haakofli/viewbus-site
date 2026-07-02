# viewbus Local HTTP API (`/v1`)

Draft developer reference for the local HTTP API that viewbus exposes for
external tools — Flow Launcher, Raycast, Alfred, PowerToys, VS Code extensions,
scripts, anything that speaks HTTP. This is the raw content for a future
`viewbus.app` dev-docs page; not styled yet.

> **Status:** ships in viewbus via [`haakofli/viewbus#19`]. Confirm a given
> install supports it by calling `GET /v1/status` (below). Requires the desktop
> app to be **running**.

---

## What it is

While viewbus is running it serves a small, read-plus-focus HTTP API on a
**loopback** port (`127.0.0.1`). A plugin can:

- **search** the resource index the app has already discovered (queues, topics,
  subscriptions) — fast, no Azure round-trip; and
- **focus** a resource — tell the running app to jump to it in the UI.

It only exists while the app is open, so a failed connection *is* the "viewbus
is closed" signal — no separate liveness check needed.

## 1. Discover the port + token

The server binds an OS-assigned port and, on startup, writes a discovery file:

| OS | Path |
|---|---|
| Windows | `%APPDATA%\viewbus\local-api.json` |
| macOS | `~/Library/Application Support/viewbus/local-api.json` |
| Linux | `~/.local/share/viewbus/local-api.json` |

```json
{ "version": 1, "port": 51763, "token": "6f1c…(64 hex chars)" }
```

Read this file to learn the `port` and the per-launch bearer `token`. The file
is rewritten every launch (the port changes). If the file is missing or the
port refuses connections, treat viewbus as **not running**.

## 2. Authenticate every request

Send the token as a bearer header:

```
Authorization: Bearer <token>
```

Two extra rules the server enforces (they exist because *any* web page can
reach `127.0.0.1`):

- **Do not send an `Origin` header.** Requests carrying one are rejected with
  `403` — this blocks browsers/websites from silently calling the API. Native
  clients (curl, a plugin runtime) don't send `Origin`, so you don't have to do
  anything.
- The `Host` header must be loopback (`127.0.0.1` / `localhost` / `::1`). This
  is automatic when you connect to `127.0.0.1:<port>`.

A web page can't read the discovery file, so it can't obtain the token — the
token + `Origin` rule together keep the API local-only.

## 3. Endpoints

Base URL: `http://127.0.0.1:<port>`

### `GET /v1/status`

Confirm you're talking to viewbus and feature-detect.

```json
{ "app": "viewbus", "apiVersion": 1, "version": "0.8.x", "hasSelection": true }
```

- `apiVersion` — the API contract major version (this document = `1`).
- `version` — the viewbus app version.
- `hasSelection` — `true` only when both an Azure tenant and a subscription are
  selected in the app (searches still work without it; manual connections are
  always visible).

### `GET /v1/search?q=<term>&limit=<n>`

Fuzzy-search the indexed resources. `q` is required; `limit` defaults to `20`
(max `50`).

```json
{
  "results": [
    {
      "id": "/subscriptions/…/queues/orders-dead",
      "displayName": "orders-dead",
      "path": "Prod / rg-msg / ns-orders / orders-dead",
      "resourceType": "queue",
      "azureSubscription": "Prod",
      "activeCount": 128,
      "deadLetterCount": 4,
      "lastIndexed": "2026-07-01T09:12:03Z"
    }
  ]
}
```

Field notes:

- `id` — **opaque**. Show `displayName`/`path`; pass `id` back to `/v1/focus`.
  Don't parse it.
- `resourceType` — one of `subscription`, `resource_group`, `namespace`,
  `queue`, `topic`, `topic_subscription`. (Search returns leaf kinds — queues,
  topics, subscriptions.)
- `azureSubscription` — the Azure subscription name, or `null` for manual
  (connection-string) connections.
- `activeCount` / `deadLetterCount` — message counts, **last-indexed, not
  live**. viewbus refreshes these lazily when you interact with a resource, not
  on a timer. Use `lastIndexed` (ISO-8601) to judge freshness. Either may be
  `null` (e.g. topics/namespaces carry no count, or a resource hasn't been
  indexed yet).

### `POST /v1/focus`

Bring viewbus to the front and navigate to a resource.

Request body:

```json
{ "id": "/subscriptions/…/queues/orders-dead" }
```

Responses:

```json
{ "ok": true }
```

```
404  { "error": { "code": "not_found", "message": "no resource with that id" } }
```

Pass an `id` you got from `/v1/search`.

## Errors

Every error uses one shape and an HTTP status that matches the code:

```json
{ "error": { "code": "unauthorized", "message": "invalid token" } }
```

| `code` | HTTP | Meaning |
|---|---|---|
| `bad_request` | 400 | Missing `q`, malformed body, etc. |
| `unauthorized` | 401 | Missing or wrong bearer token |
| `forbidden` | 403 | `Origin` header present, or non-loopback `Host` |
| `not_found` | 404 | Unknown endpoint, or `/v1/focus` id doesn't exist |
| `internal` | 500 | Unexpected server-side error |

## End-to-end example

```js
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// 1. discover
const file = path.join(process.env.APPDATA, "viewbus", "local-api.json"); // Windows
const { port, token } = JSON.parse(await readFile(file, "utf8"));
const base = `http://127.0.0.1:${port}`;
const headers = { Authorization: `Bearer ${token}` };

// 2. is viewbus running + is this the API?
const status = await fetch(`${base}/v1/status`, { headers }).then(r => r.json());
if (status.app !== "viewbus") throw new Error("not viewbus");

// 3. search
const { results } = await fetch(
  `${base}/v1/search?q=${encodeURIComponent("orders")}&limit=10`,
  { headers },
).then(r => r.json());

// 4. focus the first hit
await fetch(`${base}/v1/focus`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ id: results[0].id }),
});
```

curl equivalents:

```sh
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:$PORT/v1/status
curl -H "Authorization: Bearer $TOKEN" "http://127.0.0.1:$PORT/v1/search?q=orders"
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"id":"…"}' http://127.0.0.1:$PORT/v1/focus
```

## Enabling / disabling

On by default. To turn it off, set `localApi.enabled` to `false` in the
viewbus settings file (`<config_dir>/viewbus/settings.json`) and restart —
the server won't start and no discovery file is written.

## Stability

`/v1` is a **public contract**: fields and endpoints may be **added** over
time, but existing ones are never removed, renamed, or repurposed. Any breaking
change would ship under a new path (`/v2`) with `/v1` kept during a deprecation
window. Build against the fields you need and ignore unknown ones.

---

*Internal implementation reference (private repo): `viewbus`
→ `docs/wiki/integrations/external-plugins.md` (Surface 4).*
