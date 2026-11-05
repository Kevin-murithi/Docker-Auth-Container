# Next.js + MongoDB Auth Template — Dockerized

A production-ready, containerized authentication starter built with **Next.js 16**, **MongoDB**, and **Mongoose**. Fully orchestrated with **Docker Compose**, automated with **GitHub Actions**, and deployable with a single command.

![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Docker Architecture](#docker-architecture)
- [Available Commands](#available-commands)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [What This Project Teaches](#what-this-project-teaches)
- [License](#license)

---

## Overview

This project demonstrates how to take a full-stack Next.js application with a MongoDB backend and containerize it for production using Docker best practices. It covers:

- **Multi-stage Docker builds** for minimal image size
- **Non-root container execution** for runtime security
- **Named volumes** for data persistence
- **Custom bridge networks** for container isolation
- **Health checks and dependency ordering** in Docker Compose
- **Lazy environment variable loading** to separate build-time from runtime
- **GitHub Actions CI/CD** for automated builds and registry publishing

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router, Turbopack) |
| **Backend** | Next.js API Routes (Server-side) |
| **Database** | MongoDB 7 (via Mongoose) |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Registry** | GitHub Container Registry (GHCR) |
| **Runtime** | Node.js 20 Alpine |

---

## Project Structure

```
nextTemplate/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── app/
│   ├── api/
│   │   ├── auth/                  # Auth API routes
│   │   └── health/
│   │       └── route.js           # Health check endpoint
│   ├── auth/
│   │   ├── login/
│   │   └── reset-password/        # Uses Suspense boundary
│   └── ...
├── lib/
│   └── mongodb.js                 # Lazy Mongoose connection
├── public/                        # Static assets
├── scripts/
│   └── check-stack.sh             # Stack health verification script
├── .dockerignore                  # Excludes node_modules, .env, .git
├── .env                           # Local secrets (git-ignored)
├── .env.example                   # Committed template
├── .gitignore
├── docker-compose.yml             # Multi-service orchestration
├── Dockerfile                     # Multi-stage build
├── next.config.js                 # With output: 'standalone'
├── package.json
└── README.md
```

---

## Prerequisites

Before running this project, ensure you have:

- **Docker Desktop** (v4.30+ recommended) — [Download](https://www.docker.com/products/docker-desktop)
- **Node.js 20+** — [Download](https://nodejs.org/) (only for local development outside Docker)
- **Git** — for cloning the repository

Verify your installation:

```bash
docker --version          # Docker version 24.x or higher
docker compose version    # Docker Compose version v2.x or higher
node --version            # v20.x or higher
```

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Create Your Environment File

```bash
cp .env.example .env
```

Then edit `.env` with your values:

```env
MONGODB_URI=mongodb://db:27017/your_db_name
JWT_SECRET=change_me_to_a_long_random_secret
```

> **Critical:** The hostname in `MONGODB_URI` must match the service name in `docker-compose.yml` (in this case, `db`), **not** `localhost` or `127.0.0.1`. Containers on a Docker network resolve each other by service name.

### 3. Build and Launch

```bash
docker compose up -d --build
```

### 4. Verify the Stack

```bash
docker compose ps
```

Expected output:

```
NAME       IMAGE                  STATUS         PORTS
auth-web   nexttemplate-web       Up             0.0.0.0:3000->3000/tcp
mongo-db   mongo:7                Up (healthy)   27017/tcp
```

Or use the health-check script:

```bash
chmod +x scripts/check-stack.sh
./scripts/check-stack.sh
```

### 5. Open the App

Visit **http://localhost:3000** in your browser.

---

## Environment Variables

All environment variables are defined in `.env` (git-ignored) and referenced in `docker-compose.yml` via the `${VAR}` syntax.

| Variable | Required | Description | Example |
|---|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string using service name | `mongodb://db:27017/mydb` |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens | `a_long_random_string` |
| `NEXTAUTH_SECRET` | Conditional | Required if using NextAuth.js | `another_long_string` |
| `NEXTAUTH_URL` | Conditional | Base URL for NextAuth callbacks | `http://localhost:3000` |
| `EMAIL_USER` | Conditional | SMTP username (for password reset) | `you@gmail.com` |
| `EMAIL_PASS` | Conditional | SMTP password / app password | `xxxx xxxx xxxx xxxx` |

**Never commit your `.env` file.** Only commit `.env.example` with placeholder values.

---

## Docker Architecture

### Multi-Stage Build

The `Dockerfile` uses a **three-stage build** to minimize image size:

```
┌─────────────────────────────────────────────────────────┐
│ STAGE 1: deps (node:20-alpine)                          │
│   - Copies package.json + package-lock.json             │
│   - Runs npm ci                                         │
│   - Cached layer: only rebuilds when deps change        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 2: builder (node:20-alpine)                       │
│   - Copies node_modules from Stage 1                    │
│   - Copies all source code                              │
│   - Runs npm run build (Turbopack)                      │
│   - Outputs .next/standalone + .next/static             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ STAGE 3: runner (node:20-alpine)                        │
│   - Fresh minimal image                                 │
│   - Copies only the compiled output from Stage 2        │
│   - Creates non-root user (nextjs:nodejs)               │
│   - Runs `node server.js` as nextjs                     │
│   - Final size: ~150-250 MB                             │
└─────────────────────────────────────────────────────────┘
```

**Result:** A production image ~5-8x smaller than a naive `node:latest` build.

### Compose Services & Behavior

| Service | Role | Notes |
|---|---|---|
| `web` | Next.js application | Built from local `Dockerfile`, exposed on `3000` |
| `db` | MongoDB 7 | Persists to the `mongo-data` named volume |

**Key behaviors configured in `docker-compose.yml`:**

- **`depends_on: condition: service_healthy`** — The `web` container won't start until MongoDB's health check passes, preventing connection errors during startup.
- **`restart: unless-stopped`** — Both containers auto-restart on crash or system reboot.
- **Named volume `mongo-data`** — Data persists even if you delete the Mongo container.
- **Custom network `auth-net`** — Both containers can resolve each other by service name (`db`, `web`).

### Container Security

- **Non-root user:** The Next.js process runs as `nextjs` (UID 1001), not `root`.
- **No secrets in images:** `.env` is excluded via `.dockerignore`.
- **Minimal attack surface:** Alpine base + only compiled artifacts in the final image.

---

## Available Commands

### Docker Compose

| Command | Description |
|---|---|
| `docker compose up -d` | Start all services in the background |
| `docker compose up -d --build` | Rebuild images and start |
| `docker compose down` | Stop and remove containers (keeps volumes) |
| `docker compose down -v` | Stop and remove containers **and** volumes |
| `docker compose ps` | Show container status |
| `docker compose logs -f web` | Tail app logs |
| `docker compose logs -f db` | Tail MongoDB logs |
| `docker compose restart web` | Restart just the app |
| `docker compose exec web sh` | Open a shell in the app container |
| `docker compose exec db mongosh` | Open the MongoDB shell |

### Health Check Script

```bash
./scripts/check-stack.sh
```

Verifies:
1. Both containers are running
2. MongoDB responds to ping
3. The app serves HTTP traffic
4. The named volume is mounted
5. The `/api/health` endpoint returns 200

### Manual (Without Compose)

```bash
# Build image
docker build -t my-auth-app:v1 .

# Create network and volume
docker network create auth-net
docker volume create mongo-data

# Start MongoDB
docker run -d --name mongo-db --network auth-net \
  -v mongo-data:/data/db mongo:7

# Start the app (note: uses service name `mongo-db`, not localhost)
docker run -d --name auth-web --network auth-net \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://mongo-db:27017/your_db_name" \
  -e JWT_SECRET="your_secret" \
  my-auth-app:v1

# Cleanup
docker rm -f auth-web mongo-db
docker network rm auth-net
```

---

## CI/CD Pipeline

The GitHub Actions pipeline in `.github/workflows/ci.yml` runs on every push and pull request to `main` and `develop`:

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    build     │ → │ docker-build │ → │  smoke-test  │ → │   publish    │
│              │   │              │   │              │   │ (main only)  │
│ npm ci       │   │ Build image  │   │ docker       │   │ Push to GHCR │
│ npm run lint │   │ with cache   │   │ compose up   │   │ Multi-tag    │
│ npm run build│   │              │   │ hit /health  │   │ SHA + latest │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

### Jobs Overview

| Job | Trigger | Purpose |
|---|---|---|
| **build** | Every push / PR | Fast failure — catches code errors before Docker |
| **docker-build** | After `build` | Verifies the Dockerfile builds successfully |
| **smoke-test** | After `docker-build` | Launches the full Compose stack and hits `/api/health` |
| **publish** | Only on `main` | Pushes to `ghcr.io/USERNAME/REPO` with SHA + `latest` tags |

### Published Image

After the first successful `publish`, your image is available at:

```
ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO:latest
ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO:sha-abc1234
```

Pull it anywhere:

```bash
docker pull ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO:latest
```

> By default, GHCR packages are private. To make them public: GitHub profile → **Packages** → select the package → **Package settings** → **Change visibility** → Public.

---

## Production Deployment

### Deployment Options

| Platform | Notes |
|---|---|
| **Any VPS (DigitalOcean, AWS EC2, Linode)** | Install Docker, clone repo, `docker compose up -d` |
| **Docker Swarm** | Convert `docker-compose.yml` to a stack file, deploy with `docker stack deploy` |
| **Kubernetes** | Convert Compose to K8s manifests (use Kompose) |
| **Managed Containers** | AWS ECS, Google Cloud Run, Azure Container Apps — use GHCR image |

### Production Checklist

Before deploying to production:

- [ ] `.env` values are real secrets (not placeholders)
- [ ] `JWT_SECRET` is at least 32 random bytes
- [ ] MongoDB is either a managed service (Atlas) or has authentication enabled
- [ ] Reverse proxy (Nginx / Traefik / Caddy) is configured for HTTPS
- [ ] Domain is configured to point at the server
- [ ] `restart: unless-stopped` is set in Compose
- [ ] Logging is configured (Docker logs → log aggregator)
- [ ] Backups are configured for the `mongo-data` volume
- [ ] Firewall blocks port 27017 externally (only 80/443 should be public)

### Example VPS Deployment

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Create production .env
nano .env

# Launch
docker compose up -d --build

# Verify
docker compose ps
./scripts/check-stack.sh
```

---

## Troubleshooting

### Error: `EADDRINUSE: port 3000 is already allocated`

Another process or container is using port 3000.

```bash
docker ps | grep 3000
docker stop <container-id>
```

Or change the host port in `docker-compose.yml` to `"3001:3000"` and access at `localhost:3001`.

### Error: `MongooseServerSelectionError: ECONNREFUSED ::1:27017`

Your `MONGODB_URI` uses `localhost` or `127.0.0.1` instead of the service name.

**Fix:** In `.env`, change the URI to use the `db` service hostname:

```env
MONGODB_URI=mongodb://db:27017/your_db_name
```

### Error: `Conflict. The container name "/mongo-db" is already in use`

A leftover container (often from a previous manual `docker run`) is blocking the name.

```bash
docker rm -f mongo-db auth-web
docker compose up -d
```

### Error: `additional privileges requested: pass "--allow=fs.read=Dockerfile"`

Known bug in **Docker Compose v5.5.1/v5.6.0** + **Buildx v0.37.2+**.

**Fix (Windows CMD):**
```cmd
set BUILDX_BAKE_ENTITLEMENTS_FS=0
docker compose up -d
```

**Fix (PowerShell):**
```powershell
$env:BUILDX_BAKE_ENTITLEMENTS_FS=0; docker compose up -d
```

**Fix (Linux/macOS):**
```bash
BUILDX_BAKE_ENTITLEMENTS_FS=0 docker compose up -d
```

### Error: `useSearchParams() should be wrapped in a suspense boundary`

Your page uses `useSearchParams()` but isn't wrapped in `<Suspense>`. Split the component so the hook lives in a child, and the page export wraps it in `<Suspense>` with a fallback. See `app/auth/reset-password/page.js` for the reference pattern.

### Error: `MONGODB_URI is not defined in environment variables` (during build)

Your MongoDB connection is being read at module load time, which runs during the Next.js build (when no env vars exist).

**Fix:** Move `process.env.MONGODB_URI` inside the `connectDB()` function in `lib/mongodb.js`, not at the top of the module. See the existing implementation for the exact pattern.

### Error: `.next/standalone not found`

Your `next.config.js` is missing `output: 'standalone'`. Add it under the config object:

```javascript
const nextConfig = {
  output: 'standalone',
};
```

### App crashes immediately with `ECONNREFUSED` on startup

MongoDB isn't ready yet when the app starts. Your `depends_on` with `service_healthy` should prevent this, but if the health check fails:

```bash
docker compose logs db      # Check Mongo is actually healthy
docker compose restart web  # Manually restart the app
```

### Container builds slowly

Check `.dockerignore` includes `node_modules`, `.next`, `.git`, `.env`. Also verify `package-lock.json` exists — `npm ci` requires it.

---

## What This Project Teaches

This repository is a learning artifact covering every concept in a modern Docker workflow:

| Concept | Where It's Applied |
|---|---|
| **Multi-stage builds** | `Dockerfile` (deps → builder → runner) |
| **Layer caching** | `COPY package.json` before `COPY . .` |
| **Image optimization** | Alpine base + standalone output + `.dockerignore` |
| **Non-root containers** | `USER nextjs` in the runner stage |
| **Build-time vs runtime env** | Lazy `MONGODB_URI` loading in `lib/mongodb.js` |
| **Named volumes** | `mongo-data` volume mounted at `/data/db` |
| **Bind mounts** (dev) | Optional dev override for hot reload |
| **Custom networks** | `auth-net` bridge network |
| **Service discovery** | `db` hostname resolves within `auth-net` |
| **Health checks** | `mongosh ping` in the `db` service |
| **Dependency ordering** | `depends_on: condition: service_healthy` |
| **Docker Compose** | Full stack orchestration in one file |
| **Registry publishing** | GHCR push via GitHub Actions |
| **Image tagging** | SHA + `latest` tags via `docker/metadata-action` |
| **CI/CD automation** | 4-job pipeline with smoke tests |
| **Container security** | Non-root user + `.dockerignore` + Alpine base |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-thing`)
3. Commit your changes (`git commit -m 'feat: add amazing thing'`)
4. Push to the branch (`git push origin feature/amazing-thing`)
5. Open a Pull Request

The CI pipeline will automatically run tests on your PR.

---

## License

MIT License — see `LICENSE` file for details.