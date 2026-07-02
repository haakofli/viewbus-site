// read the discovery file (Windows path shown)
import { readFile } from "node:fs/promises";

const { port, token } = JSON.parse(
  await readFile(`${process.env.APPDATA}/viewbus/local-api.json`, "utf8"),
);
const base = `http://127.0.0.1:${port}`;
const headers = { Authorization: `Bearer ${token}` };
//---
const status = await fetch(`${base}/v1/status`, { headers }).then((r) => r.json());
//---
const { results } = await fetch(
  `${base}/v1/search?q=orders&limit=10`,
  { headers },
).then((r) => r.json());
//---
await fetch(`${base}/v1/focus`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ id: results[0].id }),
});
