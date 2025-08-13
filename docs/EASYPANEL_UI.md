# Easypanel — Opción 1 (dos apps)

## n8n (subdominio dedicado)
- Tipo: Imagen Docker → `n8nio/n8n:latest`
- Puerto interno: `5678`
- Dominio: tu subdominio de n8n (raíz `/`, Strip OFF)
- Volumen: `/home/node/.n8n`
- Variables: ver `env.n8n.root.example` (recomendado) **o** `env.n8n.subpath.example`

## demo (mini web)
- Tipo: Dockerfile (desde GitHub o subida)
- Ruta de compilación: `web`
- Puerto interno: `8080`
- Dominio: subdominio de demo (raíz `/`)
- Variables: ver `env.demo.example`

## Pasos
1) Despliega **n8n** con las variables del ejemplo que elijas.  
2) Despliega **demo** con `N8N_INTERNAL_URL` apuntando a n8n.  
3) Entra a n8n, **importa** `n8n/workflows/holamundo.json` y pulsa **Activate**.  
4) Abre la web → botón → debe responder *hola mundo*.
