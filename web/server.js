import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Normaliza envs
const N8N_BASE = process.env.N8N_INTERNAL_URL || "http://n8n:5678";
const N8N = N8N_BASE.replace(/\/$/, "");
const WEBHOOK_PATH = process.env.N8N_WEBHOOK || "/webhook/holamundo";

app.use(express.static("public"));
app.use(express.json()); // <-- importante para leer {mensaje}

app.post("/api/hola", async (req, res) => {
  try {
    const mensaje = (req.body?.mensaje ?? "").toString();
    const r = await fetch(`${N8N}${WEBHOOK_PATH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje }),
    });

    const text = await r.text();
    if (!r.ok) {
      return res.status(500).type("text/plain").send(`n8n error ${r.status}: ${text}`);
    }
    res.type("text/plain").send(text);
  } catch (e) {
    res.status(500).type("text/plain").send("Error llamando a n8n: " + e.message);
  }
});

app.listen(PORT, () => console.log(`[config] N8N=${N8N} WEBHOOK_PATH=${WEBHOOK_PATH}\nWeb :${PORT}`));
