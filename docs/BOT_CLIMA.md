# Bot de clima para Chile con n8n

Este documento complementa al `README` y describe los servicios abiertos utilizados por el workflow `workflow/telegram-clima-chile.json`.

## Fuentes de datos
- **Dirección Meteorológica de Chile** vía `https://api.gael.cloud/general/public/clima`. Entrega temperatura, humedad, viento e iconografía para estaciones a lo largo del país.
- **SENAPRED** vía `https://api.senapred.cl/v1/alerts`. Se filtran las alertas activas para mencionar eventos meteorológicos vigentes.

## Servicios de voz
- **STT (Speech-to-Text):** Se recomienda [`ghcr.io/ahmetoner/whisper-asr-webservice`](https://github.com/ahmetoner/whisper-asr-webservice), que expone Whisper en una API REST abierta. Endpoint usado: `POST /asr` con multipart `audio_file` y query `language=es`.
- **TTS (Text-to-Speech):** Se recomienda [`synesthesiam/mimic3`](https://github.com/MycroftAI/mimic3). Endpoint usado: `POST /api/tts` con cuerpo JSON `{ "text": "...", "voice": "..." }` devolviendo audio WAV/OGG.

Configura en n8n las variables de entorno:

```
STT_SERVICE_URL=http://whisper:5000
TTS_SERVICE_URL=http://mimic3:59125
TTS_VOICE=es_ES/carlfm   # opcional
TELEGRAM_BOT_TOKEN=123456:ABCDEF
```

## Flujo
1. **Telegram Trigger** recibe texto, voz o ubicación.
2. Las notas de voz se descargan desde la API de Telegram, se transcriben con Whisper y se unifican con los mensajes de texto.
3. Se consulta el catálogo meteorológico y se busca la estación que más se acerca al nombre recibido o a las coordenadas.
4. Se consultan las alertas activas de SENAPRED y se filtran por región.
5. Se genera un resumen y se sintetiza la voz con Mimic3 para responder con una nota de voz y texto descriptivo.

## Recomendaciones
- Ajusta `TTS_VOICE` a una voz en español disponible en Mimic3 (`mimic3-voices --list`).
- Añade lógica en n8n para manejar límites de rate-limit en caso de alto volumen (nodos `Wait` o `Rate Limit`).
- Puedes ampliar las fuentes de datos sumando estaciones propias via `HTTP Request`.
