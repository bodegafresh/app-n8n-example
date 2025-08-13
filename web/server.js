import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Normaliza envs
const N8N_BASE = process.env.N8N_INTERNAL_URL || "http://n8n:5678";
const N8N = N8N_BASE.replace(/\/$/, "");          // quita / final si viene
const WEBHOOK_PATH = process.env.N8N_WEBHOOK || "/webhook/holamundo";

console.log("[config] N8N:", N8N, "WEBHOOK_PATH:", WEBHOOK_PATH);

app.use(express.static("public"));


app.get("/api/hola", async (_req, res) => {
  try {
    const r = await fetch(`${N8N}${WEBHOOK_PATH}`, { method: "POST" });
    const text = await r.text();
    if (!r.ok) return res.status(500).type("text/plain").send(`n8n error ${r.status}: ${text}`);
    res.type("text/plain").send(text); 
  } catch (e) {
    res.status(500).type("text/plain").send("Error llamando a n8n: " + e.message);
  }
});

app.listen(PORT, () => console.log(`Web escuchando en :${PORT}`));
