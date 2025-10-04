# SaaS MVP (Easypanel Opción 1) — n8n + Web
Mini web (Express) que llama a un webhook de n8n y muestra “hola mundo”. Preparado para Easypanel con **dos apps** (web y n8n) y **subdominios**.

## Bot de clima para Chile
Se agregó un flujo de n8n (`workflow/telegram-clima-chile.json`) que expone un bot de Telegram capaz de responder, en **voz**, las consultas de clima para cualquier ciudad, comuna o región de Chile. El bot admite mensajes de texto y notas de voz, consulta fuentes abiertas del Gobierno de Chile y responde utilizando servicios de voz libres.

### Requisitos
- Credenciales de un bot de Telegram (`BOT_TOKEN`).
- Servicio de _speech-to-text_ abierto (por ejemplo [`whisper-asr-webservice`](https://github.com/ahmetoner/whisper-asr-webservice)) expuesto como API REST (`STT_SERVICE_URL`).
- Servicio de _text-to-speech_ abierto (por ejemplo [`Mycroft Mimic3`](https://github.com/MycroftAI/mimic3) con la imagen `synesthesiam/mimic3`) expuesto como API REST (`TTS_SERVICE_URL`).
- Acceso a las API abiertas:
  - [Climatología](https://api.gael.cloud/general/public/clima) con datos de la Dirección Meteorológica de Chile.
  - [Alertas SENAPRED](https://www.senapred.cl/) vía `https://api.senapred.cl/v1/alerts`.

### Puesta en marcha
1. Levanta los servicios de STT y TTS (ejemplo con Docker):
   ```bash
   docker run -d --name mimic3 -p 59125:59125 synesthesiam/mimic3:latest
   docker run -d --name whisper -p 5000:5000 ghcr.io/ahmetoner/whisper-asr-webservice:latest
   ```
2. Configura en n8n las credenciales necesarias:
   - **Telegram**: crea el credential con tu token y agrega la variable `TELEGRAM_BOT_TOKEN` en n8n con el mismo valor para permitir la descarga de audios.
   - **Variables** `STT_SERVICE_URL=http://whisper:5000` y `TTS_SERVICE_URL=http://mimic3:59125` (ajusta según tu despliegue). Puedes definir opcionalmente `TTS_VOICE` para personalizar la voz de salida.
3. Importa y activa el workflow `workflow/telegram-clima-chile.json` desde n8n.
4. Conversa con tu bot en Telegram. Puedes enviar texto, notas de voz o tu ubicación para recibir el resumen hablado de temperatura, humedad, viento y alertas vigentes.

> **Nota:** el workflow queda desactivado por defecto. Actívalo luego de configurar los servicios.

## Local
```
docker compose up -d --build
# Web:  http://localhost:8080
# n8n:  http://localhost:5678  (importa n8n/workflows/holamundo.json y ACTÍVALO)
```
Probar webhook: `curl -X POST http://127.0.0.1:5678/webhook/holamundo`

Example web: `https://agente01-demo.njglfo.easypanel.host`

## Easypanel (UI)
- App **n8n**: imagen `n8nio/n8n:latest`, puerto interno `5678`, dominio propio
- App **demo**: Dockerfile desde carpeta `web/`, puerto interno `8080`, dominio propio
- Importa y **activa** el workflow.

Lee `docs/EASYPANEL_UI.md` y pega los `.env` de `docs/`.
