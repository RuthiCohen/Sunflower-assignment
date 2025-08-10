# Leaderboard — README

## Overview

This **Leaderboard** project contain this stack:

- **Server:** Node.js (using Fastify) API on port `3000`
- **Client:** Front‑end using React served by **NGINX** on port `80` (mapped to my host `3033`)
- **Postgres:** database (internal Docker network)
- **Redis:** cache for optimization (mapped to `6379`)

The **client** uses an NGINX proxy so that browser requests to `/api/...` are forwarded to the server at `server:3000`.

---

## Prerequisites

- Docker & Docker Compose
- Free ports on your host:
  - `3000` (API)
  - `3033` for the client
  - `6379` (Redis)

---

## Quick Start

```bash
# From the project root (where docker-compose.yml lives)

# Clean slate (removes containers, networks, and volumes)
docker compose down -v

# Build all images fresh
docker compose build --no-cache

# Start all services in the background
docker compose up -d

# See what is running
docker compose ps
```

Open:

- API health: http://localhost:3000/healthz
- Client app: http://localhost:3033/

---

## Services & Ports

| Service    | Host:Container Port | What it does                |
| ---------- | ------------------- | --------------------------- |
| `server`   | `3000:3000`         | Node Fastify API            |
| `client`   | `3033:80`           | NGINX serving the front‑end |
| `redis`    | `6379:6379`         | Redis cache                 |
| `postgres` | internal only       | Postgres (Docker network)   |

---

## NGINX proxy (client -> server)

The client image includes an NGINX config that forwards `/api/...` to the server:

In `docker-compose.yml`, make sure the client maps **host 3033 -> container 80**:

```yaml
client:
  build:
    context: ./client
  depends_on:
    - server
  ports:
    - "3033:80"
```

---

## Health Checks & Smoke Tests (cURL)

```bash
# Server directly
curl http://localhost:3000/healthz
curl http://localhost:3000/leaderboard/top/5

# Through the client (via NGINX proxy -> server)
curl -I http://localhost:3033                 # Should show: Server: nginx
curl http://localhost:3033/api/healthz        # {"ok": true}
curl http://localhost:3033/api/leaderboard/top/5
```

---

## Postgres: connect and check tables

```bash
# Open a psql shell inside the postgres container
docker compose exec -it postgres psql -U ruti -d leaderboard

# In psql:
\dt                                -- list tables
SELECT COUNT(*) FROM users;        -- check rows
SELECT * FROM users LIMIT 5;

# exit psql
\q
```

**Postgressql seeding:** The project contains a JavaScript seeder in path `server/models/seed.js`, and it **won’t** be executed automatically by Postgres.

Run it from the server container, e.g.:

```bash
docker compose exec server node ./models/seed.js
```

---

## Logs & Debugging

```bash
# Tail logs
docker compose logs -f server
docker compose logs -f client
docker compose logs -f postgres
docker compose logs -f redis

# Inspect the effective NGINX config inside the client container
docker exec -it <client-container-name> sh -c 'nginx -T | sed -n "1,220p"'
docker exec -it <client-container-name> sh -c 'cat /etc/nginx/conf.d/default.conf'
```

Get the container name:

```bash
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"
```

---

## Quick Start

```bash
# From the project root (where docker-compose.yml lives)

# Optional: clean slate (removes containers, networks, and volumes)
docker compose down -v

# Build all images fresh
docker compose build --no-cache

# Start all services in the background
docker compose up -d

# See what is running
docker compose ps
```

---

## Stop, Reset, Rebuild

```bash
# Stop all
docker compose down

# Stop and remove volumes (DB/cache reset)
docker compose down -v

# Rebuild only the client (e.g., after changing NGINX or front‑end)
docker compose build client --no-cache
docker compose up -d client
```

---
## Verification & API Tests

In the terminal set:
```bash
SERVER=http://localhost:3000
CLIENT=http://localhost:3033
```

and then:

- Health checks
```bash
curl $SERVER/healthz
curl -I $CLIENT                
curl $CLIENT/api/healthz     
```

- List users
```bash
curl $SERVER/users
curl $CLIENT/api/users
```

- Create a user
```bash
curl -X POST $SERVER/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User 1","image_url":"https://example.com/img.jpg"}'

curl -X POST $CLIENT/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User 2","image_url":"https://example.com/img2.jpg"}'
```

- Update user’s score
```bash
curl -X PUT $SERVER/users/<ID>/score \
  -H "Content-Type: application/json" \
  -d '{"score": 999}'

curl -X PUT $CLIENT/api/users/<ID>/score \
  -H "Content-Type: application/json" \
  -d '{"score": 555}'
```

- Leaderboard:
```bash
curl $SERVER/leaderboard/top/5
curl $CLIENT/api/leaderboard/top/5
```

- User with context (rank):
```bash
curl $SERVER/leaderboard/user/<ID>
curl $CLIENT/api/leaderboard/user/<ID>
```