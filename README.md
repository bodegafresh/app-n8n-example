# SaaS MVP — n8n + Web “Hola Mundo”

Proyecto base para validar un SaaS con **n8n** y una **mini web** (Node/Express) que llama a un **webhook** y muestra la respuesta.

## Estructura
```
.
├── docker-compose.yml      # entorno local (puertos 8080 y 5678)
├── stack.yml               # despliegue en Swarm/Easypanel por sub-path
├── Makefile                # comandos útiles
├── .env.example            # variables para stack (copiar a .env y editar)
├── n8n/
│   └── workflows/holamundo.json  # workflow para importar
└── web/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    ├── public/index.html
    └── .dockerignore
```

## Requisitos
- Docker 24+ y Docker Compose plugin
- (Opcional) Docker Swarm si usas `stack.yml` con Easypanel

---

## Ejecución local (rápido)
1. Levanta todo:
   ```bash
   make up           # o: docker compose up -d --build
   ```
2. Abre:
   - Web: http://localhost:8080
   - n8n: http://localhost:5678
3. Importa el workflow **n8n/workflows/holamundo.json** en n8n y **actívalo**.
4. Prueba:
   - En el navegador, pulsa el botón de la web.
   - O por CLI:
     ```bash
     curl -X POST http://127.0.0.1:5678/webhook/holamundo
     ```

> Si ves `hola mundo`, estás OK.

---

## Despliegue en Hostinger + Easypanel (sub-paths)
Tienes dos formas. La más simple es **UI**; la más portable es **Swarm stack**.

### Opción A — UI de Easypanel (simple)
1. Crea 2 Apps en tu proyecto:
   - **web** (Dockerfile): puerto interno `8080`.
   - **n8n** (Imagen `n8nio/n8n:latest`): puerto interno `5678` con ENV:
     - `N8N_PATH=/n8n/`
     - `N8N_PROTOCOL=https`
     - `N8N_HOST=<TU_HOST>` (ej. `agente01-evolution.njglfo.easypanel.host`)
     - `N8N_EDITOR_BASE_URL=https://<TU_HOST>/n8n/`
     - `WEBHOOK_URL=https://<TU_HOST>/n8n/`
2. En **Dominios** de cada app (mismo host):
   - **web** → *Path prefix* `/demo` + **Strip prefix ON**
   - **n8n** → *Path prefix* `/n8n` + **Strip prefix OFF**
3. Importa el workflow y **actívalo** en `https://<TU_HOST>/n8n/`.

### Opción B — Swarm Stack con Traefik (avanzado)
1. Copia `.env.example` a `.env` y edítalo:
   ```ini
   EP_NETWORK=easypanel-agente01
   APP_HOST=<TU_HOST>
   WEB_IMAGE=local/hola-web:latest
   N8N_PATH=/n8n/
   N8N_PROTOCOL=https
   N8N_HOST=<TU_HOST>
   N8N_EDITOR_BASE_URL=https://<TU_HOST>/n8n/
   WEBHOOK_URL=https://<TU_HOST>/n8n/
   ```
2. Construye la imagen del web y despliega:
   ```bash
   make build-web-image
   docker swarm init || true
   make stack-up
   ```
3. Abre:
   - Web: `https://<TU_HOST>/demo`
   - n8n: `https://<TU_HOST>/n8n` (importa/activa workflow).

> En Swarm no se exponen puertos: Traefik enruta por dominio y sub-path.

---

## Seguridad mínima
- Protege `/n8n` (Basic Auth o IP allowlist) si lo dejas público.
- Una vez en producción, evita publicar el editor de n8n por puerto directo.

---

## Comandos útiles
```bash
make up        # compose local
make down
make logs      # logs de todos los servicios

make build-web-image   # build de imagen para stack (WEB_IMAGE)
make stack-up          # docker stack deploy -c stack.yml saas-mvp
make stack-rm          # eliminar el stack
```
