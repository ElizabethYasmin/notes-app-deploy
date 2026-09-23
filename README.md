# Notes App — Full Stack Implementation Exercise

A notes app where you can create, edit, archive and tag your notes. Built as a Single Page
Application: an independent React frontend talking to a layered Spring Boot REST API, with
data persisted in PostgreSQL via JPA/Hibernate (no mocks, no in-memory storage).

- **Phase 1** — create, edit, delete, archive/unarchive notes; list active/archived notes.
- **Phase 2** — tag notes with categories and filter by category.
- **Extra** — real user accounts (register/login), notes and categories scoped per user,
  live sync across open sessions of the same user (WebSocket/STOMP), and a fully
  containerized one-command setup.

## Live demo

- Frontend: https://delightful-pastelito-180611.netlify.app
- Backend: https://notes-backend-1tnf.onrender.com

There is no seeded user — register your own account from the live frontend before logging in.

> The backend runs on Render's free tier, which spins the service down after periods of
> inactivity. The first request after it's been idle can take up to ~50 seconds while it wakes
> back up; subsequent requests are fast until it goes idle again.

## Requirements

| Tool | Version used |
|---|---|
| Java (JDK) | 21 (OpenJDK 21.0.10) |
| Maven | 3.9.16 (via the included `mvnw` wrapper — no local install needed) |
| Node.js | 25.8.1 |
| npm | 11.11.0 |
| PostgreSQL | 16 |
| Docker | 29.7.2 |
| Docker Compose | 5.5.0 (works with both the `docker compose` v2 plugin and the standalone `docker-compose` v1 binary) |

You don't need Java, Maven or PostgreSQL installed locally if you run the app via Docker (see below).

## Run everything with one command (recommended)

No Java, Maven, Node or PostgreSQL installation required — only Docker.

```bash
./run.sh
```

This builds the backend image, starts PostgreSQL and the backend, and waits for the database
to be healthy before starting the API. The backend is available at `http://localhost:8080`.

To also run the frontend against it, in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the API URL from `frontend/.env` (`VITE_API_URL`), already pointed at
`http://localhost:8080/api` for local development.

## Running without Docker

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

By default this uses Spring Boot's Docker Compose integration (`backend/compose.yaml`) to
start a local PostgreSQL container automatically — you still need Docker installed for this,
but not for building/running the Java app itself. Liquibase creates the schema automatically
on startup; there is no manual DB setup step.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Login

There is no seeded/default user — register your own account from the app (`/register`), then
log in (`/login`) with the same username and password. Every user's notes and categories are
private to that account.

Authentication uses HTTP Basic under the hood: the frontend stores the credentials for the
current session (`sessionStorage`) and attaches them to every API request, including the
WebSocket connection used for live sync.

## Project structure

```
backend/    Spring Boot REST API (Controller → Service → Repository), PostgreSQL via
            JPA/Hibernate, schema managed by Liquibase.
frontend/   React + TypeScript SPA (Vite), built as an isolated app with its own
            package.json.
compose.yaml  Orchestrates the backend + PostgreSQL for the one-command run.
run.sh        Single entry point to start the whole stack.
```

## Notes on the extra features

- **Real-time sync**: two open sessions of the *same* logged-in user see each other's changes
  instantly (WebSocket/STOMP). Different users never see each other's data.
- **Per-user data**: notes and categories belong to the user that created them; trying to
  access another user's note or category returns 404, never leaking whether it exists.
- **Live deployment**: backend on Render (Docker + managed Postgres), frontend on Netlify —
  see [Live demo](#live-demo) above. Also verified locally via `./run.sh` plus manual
  end-to-end testing (register → login → create/tag/filter/archive notes) against the fully
  containerized stack.
