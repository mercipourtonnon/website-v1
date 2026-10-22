#!/usr/bin/env bash
#
# Deploy the app to Sovrium Cloud (https://cloud.sovrium.com).
#
# `sovrium deploy` validates the config, bundles it exactly as `sovrium bundle`
# does (resolved config as JSON, public/ and seed/ — never .env), uploads the
# archive and follows the deployment until it is live. Deploying unchanged
# content again is a no-op: the cloud answers with the deployment it has.
#
# Prerequisite (once per machine): `sovrium login` — approve the code in the
# browser; the API key is kept in ~/.sovrium/credentials.json. In CI, sign in
# with `sovrium login --api-key "$SOVRIUM_API_KEY"` instead (no browser).
#
# Production environment values (BASE_URL=https://mercipourtonnon.fr, the
# encryption secret, HelloAsso/Brevo credentials…) are set on the cloud, never
# in the bundle: `$env.NAME` references stay references.
#
# Usage:  bash scripts/deploy.sh [--no-wait]
#   SOVRIUM_APP   hosted app slug (default: mercipourtonnon)
#   SOVRIUM_HOST  cloud origin    (default: https://cloud.sovrium.com)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

command -v sovrium >/dev/null || { echo "sovrium not on PATH — install it first."; exit 1; }

HOST="${SOVRIUM_HOST:-https://cloud.sovrium.com}"
APP="${SOVRIUM_APP:-mercipourtonnon}"

if ! sovrium login --status >/dev/null 2>&1; then
  echo "Not signed in to a Sovrium cloud — run 'sovrium login' first."
  exit 1
fi

echo "▸ Validating configuration…"
sovrium validate app.yaml

echo "▸ Deploying '$APP' to ${HOST}…"
sovrium deploy app.yaml --host "$HOST" --app "$APP" "$@"
