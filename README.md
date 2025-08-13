# SaaS MVP (Easypanel Opción 1) — n8n + Web
Mini web (Express) que llama a un webhook de n8n y muestra “hola mundo”. Preparado para Easypanel con **dos apps** (web y n8n) y **subdominios**.

## Local
```
docker compose up -d --build
# Web:  http://localhost:8080
# n8n:  http://localhost:5678  (importa n8n/workflows/holamundo.json y ACTÍVALO)
```
Probar webhook: `curl -X POST http://127.0.0.1:5678/webhook/holamundo`

## Easypanel (UI)
- App **n8n**: imagen `n8nio/n8n:latest`, puerto interno `5678`, dominio propio
- App **demo**: Dockerfile desde carpeta `web/`, puerto interno `8080`, dominio propio
- Importa y **activa** el workflow.

Lee `docs/EASYPANEL_UI.md` y pega los `.env` de `docs/`.
