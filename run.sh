#!/usr/bin/env bash
set -euo pipefail

# Runs the whole app (Postgres + backend) in Docker.
# No local Java, Maven or Postgres install is required.
#
# Usage: ./run.sh

cd "$(dirname "$0")"

if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker-compose"
else
  echo "Error: neither 'docker compose' nor 'docker-compose' was found. Install Docker Desktop (or the Compose plugin) and try again." >&2
  exit 1
fi

echo "Starting the app with: $DOCKER_COMPOSE up --build"
$DOCKER_COMPOSE up --build
