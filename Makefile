include .env

.PHONY: up down logs build-web-image stack-up stack-rm

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

build-web-image:
	docker build -t $(WEB_IMAGE) ./web

stack-up:
	docker stack deploy -c stack.yml saas-mvp

stack-rm:
	docker stack rm saas-mvp
