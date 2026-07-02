// read the discovery file (Windows path shown)
using System.Net.Http.Json;
using System.Text.Json;

var path = Path.Combine(
    Environment.GetEnvironmentVariable("APPDATA")!, "viewbus", "local-api.json");
using var file = JsonDocument.Parse(File.ReadAllText(path));
var http = new HttpClient
{
    BaseAddress = new Uri($"http://127.0.0.1:{file.RootElement.GetProperty("port").GetInt32()}"),
};
http.DefaultRequestHeaders.Authorization =
    new("Bearer", file.RootElement.GetProperty("token").GetString());
//---
var status = await http.GetFromJsonAsync<JsonElement>("/v1/status");
//---
var search = await http.GetFromJsonAsync<JsonElement>("/v1/search?q=orders&limit=10");
var results = search.GetProperty("results");
//---
var id = results[0].GetProperty("id").GetString();
await http.PostAsJsonAsync("/v1/focus", new { id });
