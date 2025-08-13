import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;
const N8N = (process.env.N8N_INTERNAL_URL || "http://n8n:5678").replace(/\/$/, "");

app.use(express.static("public"));

app.get("/api/hola", async (_req, res) => {
  try {
    console.log(`${N8N}${N8N_WEBHOOK}`)
    const r = await fetch("https://agente01-n8n.njglfo.easypanel.host/webhook-test/holamundo", { method: "POST" });
    //const r = await fetch(`${N8N}${N8N_WEBHOOK}`, { method: "POST" });
    const text = await r.text();
    res.type("text/plain").send(text);
  } catch (e) {
    res.status(500).send("Error llamando a n8n: " + e.message);
  }
});

app.listen(PORT, () => console.log(`Web escuchando en :${PORT}`));
