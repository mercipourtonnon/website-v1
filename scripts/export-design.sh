#!/usr/bin/env bash
# Export the design system, the native page drawings and the interactive
# public site into design/, as one folder that works from any base path
# (published as a multi-file Claude Artifact).
#
#   bash scripts/export-design.sh
#
# Environment: DESIGN_EXPORT_PORT (default 4420) for the throwaway server.
#
# design/index.html (the hub) is hand-written and kept; design/design-system/
# and design/site/ are regenerated from app.yaml on every run.
#
# Needs: sovrium (~/.sovrium/bin), python3, node + npm (Playwright is
# installed once into ~/.cache/mercipourtonnon-export).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PATH="$HOME/.sovrium/bin:$PATH"
OUT=design
PORT="${DESIGN_EXPORT_PORT:-4420}"
PW_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/mercipourtonnon-export"
PW_VERSION=1.58.2

rm -rf "$OUT/design-system" "$OUT/site" "$OUT/pages"

# ── 1. Design system: brief, DTCG tokens, theme CSS, kit, page drawings ────
# --pages draws every page of the app, node by node (pages/<name>.page.html,
# <name>.tree.json, node-map.json) plus the design-tool adapters.
# Sovrium 0.41 workaround (sovrium/sovrium#439): --pages aborts the
# whole bundle on a page that answers a redirect instead of a document, which
# /espace/arrivee does (auth.landingPath: it sends each role to its landing
# page and draws nothing). It is left out with --page; drop the filter once
# the fix ships.
PAGE_ARGS=()
for f in config/pages/*.yaml; do
  name="$(sed -n 's/^name: *//p' "$f" | head -1)"
  [ "$name" = espace-arrivee ] && continue
  PAGE_ARGS+=(--page "$name")
done
sovrium design-system app.yaml --format bundle --pages "${PAGE_ARGS[@]}" --output "$OUT/design-system" 2>&1 \
  | grep -v -e 'Invalid DOM property' -e 'React does not recognize' -e 'empty string ("") was passed' || true
[ -f "$OUT/design-system/manifest.json" ] || { echo "design-system bundle failed" >&2; exit 1; }
# The dark palette is tokens/dark.tokens.json (since 0.41 identical to
# `--format json --mode dark`, so no separate export).

# ── 2. Interactive site: mirror a throwaway server ─────────────────────────
# Sovrium 0.41 workaround (sovrium/sovrium#433): `sovrium build` references
# /assets/islands/*.js but never writes them, so a static build is not
# interactive. The site is mirrored from `sovrium start` instead.
#
# The server runs from a staging copy of the config (no .env: never the
# project's secrets) on a fresh data dir (never .sovrium/), with placeholder
# values for the declared env and HelloAsso pointed at a closed local port.
if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "port $PORT is busy; set DESIGN_EXPORT_PORT" >&2
  exit 1
fi
STAGE="$(mktemp -d "${TMPDIR:-/tmp}/mpton-export.XXXXXX")"
SERVER_PID=""
cleanup() {
  if [ -n "$SERVER_PID" ]; then kill "$SERVER_PID" 2>/dev/null || true; wait "$SERVER_PID" 2>/dev/null || true; fi
  rm -rf "$STAGE"
}
trap cleanup EXIT
mkdir -p "$STAGE/app" "$STAGE/data"
cp -R app.yaml config public seed library "$STAGE/app/"

(
  cd "$STAGE/app"
  unset DATABASE_URL STORAGE_PROVIDER EMAIL_PROVIDER AI_PROVIDER BROWSER_PROVIDER
  export NODE_ENV=production PORT BASE_URL="http://localhost:$PORT" SOVRIUM_DATA_DIR="$STAGE/data"
  export HELLOASSO_CLIENT_ID=placeholder HELLOASSO_CLIENT_SECRET=placeholder HELLOASSO_ORGANIZATION_SLUG=placeholder
  export HELLOASSO_API_BASE_URL=http://127.0.0.1:9 HELLOASSO_TOKEN_URL=http://127.0.0.1:9/token
  export HELLOASSO_CONTACT_EMAIL=contact@example.org HELLOASSO_ACCOUNT_EMAIL=placeholder@example.org
  export HELLOASSO_ACCOUNT_PASSWORD=placeholder BREVO_API_KEY=placeholder BREVO_LIST_BENEVOLES_ID=1
  export BREVO_SENDER_EMAIL=noreply@example.org BREVO_SENDER_NAME=Apercu WHATSAPP_COMMUNITY_URL=https://example.org/whatsapp
  exec sovrium start app.yaml >"$STAGE/server.log" 2>&1
) &
SERVER_PID=$!
for _ in $(seq 1 60); do
  curl -sf -o /dev/null "http://localhost:$PORT/" && break
  kill -0 "$SERVER_PID" 2>/dev/null || { cat "$STAGE/server.log" >&2; exit 1; }
  sleep 1
done
(cd "$STAGE/app" && SOVRIUM_DATA_DIR="$STAGE/data" sovrium seed app.yaml >/dev/null)

# Every /ateliers/:slug the seed publishes, linked from a page or not.
SLUG_ROUTES=$(curl -sf "http://localhost:$PORT/api/tables/workshops/records" \
  | python3 -I -c 'import json,sys; print(" ".join("/ateliers/"+r["fields"]["slug"] for r in json.load(sys.stdin)["records"] if r["fields"].get("status")=="published"))')

if [ ! -d "$PW_DIR/node_modules/playwright" ]; then
  mkdir -p "$PW_DIR"
  npm install --prefix "$PW_DIR" --no-save --silent "playwright@$PW_VERSION"
fi
"$PW_DIR/node_modules/.bin/playwright" install chromium >/dev/null
# shellcheck disable=SC2086 # one word per route
# Plus the built-in invitation page a visitor reaches from an invitation
# email (skipped by the mirror if it redirects or answers non-200).
PLAYWRIGHT_DIR="$PW_DIR" node scripts/mirror-site.mjs "http://localhost:$PORT" "$OUT/site" \
  $SLUG_ROUTES /accept-invitation

kill "$SERVER_PID" 2>/dev/null || true
wait "$SERVER_PID" 2>/dev/null || true
SERVER_PID=""

# ── 3. Offline behaviour + relative URLs ───────────────────────────────────
cp scripts/design-preview.js "$OUT/site/preview.js"
rm -f "$OUT/site/routes.json"
python3 -I scripts/relativize-design.py "$OUT"

# ── 4. Counts (an artifact takes at most 500 files) ────────────────────────
total=$(find "$OUT" -type f | wc -l | tr -d ' ')
publish=$(find "$OUT" -type f -not -path "$OUT/design-system/adapters/*" | wc -l | tr -d ' ')
echo "Exported: $total files, $(du -sh "$OUT" | cut -f1); to publish (without design-system/adapters/): $publish files"
