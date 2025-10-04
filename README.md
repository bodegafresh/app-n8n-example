# SaaS MVP (Easypanel Opción 1) — n8n + Web
Mini web (Express) que llama a un webhook de n8n y muestra “hola mundo”. Preparado para Easypanel con **dos apps** (web y n8n) y **subdominios**.

## Bot de clima para Telegram (Chile)

Se incluye un workflow listo para importar en n8n (`workflow/telegram_clima_chile.json`) que crea un bot de Telegram capaz de:

- Recibir consultas escritas **o por voz** sobre el clima en cualquier ciudad/comuna/región de Chile.
- Transcribir audios usando modelos abiertos de Hugging Face (Whisper).
- Consultar datos meteorológicos y alertas usando APIs públicas del Gobierno de Chile (`apis.digital.gob.cl` para georreferenciar comunas y `api.gael.cloud/general/public/clima` para datos de la Dirección Meteorológica de Chile, además de `api.senapred.cl/alertas` para emergencias).
- Responder con un resumen en texto **y** un mensaje de voz generado con modelos TTS abiertos (Hugging Face `facebook/mms-tts-esp`).

> **Importante:** Debes crear el bot desde [@BotFather](https://t.me/BotFather) y obtener un token válido. Además necesitarás un token gratuito de Hugging Face para invocar las APIs de inferencia (modelo de transcripción y TTS).

### Variables de entorno requeridas en n8n

Configura estas variables en la instancia de n8n (por ejemplo añadiéndolas al `.env` o en Easypanel):

| Variable | Descripción |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Token del bot entregado por BotFather. Se usa para descargar los audios recibidos. |
| `HF_TOKEN` | Token personal de Hugging Face (permite invocar las inferencias gratuitas). |
| `HF_ASR_URL` *(opcional)* | URL del modelo de transcripción. Por defecto se usa `https://api-inference.huggingface.co/models/openai/whisper-small`. |
| `HF_TTS_URL` *(opcional)* | URL del modelo de texto a voz. Por defecto se usa `https://api-inference.huggingface.co/models/facebook/mms-tts-esp`. |

### Pasos para activar el bot

1. Levanta los servicios (`docker compose up -d`) y accede a la interfaz de n8n.
2. Crea las credenciales de Telegram Bot API (para el envío de mensajes) e introduce el token provisto por BotFather.
3. Importa el workflow `workflow/telegram_clima_chile.json` y asigna las credenciales de Telegram a los nodos correspondientes (`Telegram Trigger`, envíos de mensajes/audio y obtención de archivos).
4. Verifica que las variables de entorno estén disponibles (en **Settings → Environment Variables** de n8n puedes confirmarlo con un nodo Function `{{$env.VARIABLE}}`).
5. Activa el workflow. Telegram entregará un webhook único que debes registrar mediante `setWebhook` (n8n lo hace automáticamente al activar el workflow de disparo).
6. Prueba el bot enviando un texto o nota de voz indicando una ciudad/comuna/región. El bot responderá con el resumen en texto y un audio sintetizado en español.

### ¿Cómo funciona el workflow?

1. **Trigger de Telegram:** recibe cualquier mensaje y detecta si incluye audio (`voice`).
2. **Entrada de texto:** se usa directamente como consulta.
3. **Entrada de voz:** se descarga el archivo `.ogg`, se envía al modelo Whisper (Hugging Face) para obtener la transcripción en texto.
4. **Normalización geográfica:** con el texto resultante se consulta la API de División Política Administrativa (`apis.digital.gob.cl/dpa/comunas`) y se selecciona la mejor coincidencia.
5. **Datos meteorológicos:** se descargan los registros públicos de `api.gael.cloud/general/public/clima` y se filtra la estación más cercana a la comuna/ región. En paralelo se consultan alertas vigentes en `api.senapred.cl/alertas` para la región.
6. **Construcción de respuesta:** se arma un resumen con condición, temperatura (°C), humedad, viento y alertas relevantes.
7. **Entrega al usuario:** se envía el resumen por texto y se genera un audio con el modelo `facebook/mms-tts-esp`, que se envía como mensaje de voz/audio a Telegram.

> Todos los servicios utilizados son abiertos: datasets del Gobierno de Chile para geodatos y clima, y modelos open-source servidos desde Hugging Face (es posible auto hospedarlos si prefieres evitar llamadas externas).

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
