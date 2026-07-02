// read the discovery file (Windows path shown) — inside an async fn
use serde_json::{json, Value};

let path = format!(r"{}\viewbus\local-api.json", std::env::var("APPDATA")?);
let d: Value = serde_json::from_str(&std::fs::read_to_string(path)?)?;
let base = format!("http://127.0.0.1:{}", d["port"]);
let token = d["token"].as_str().unwrap();
let http = reqwest::Client::new();
//---
let status: Value = http.get(format!("{base}/v1/status"))
    .bearer_auth(token).send().await?.json().await?;
//---
let search: Value = http.get(format!("{base}/v1/search?q=orders&limit=10"))
    .bearer_auth(token).send().await?.json().await?;
let results = search["results"].as_array().unwrap();
//---
http.post(format!("{base}/v1/focus"))
    .bearer_auth(token)
    .json(&json!({ "id": results[0]["id"] }))
    .send().await?;
