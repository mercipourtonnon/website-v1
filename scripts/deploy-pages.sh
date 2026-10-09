#!/usr/bin/env bash
#
# Local deploy for GitHub Pages ("Deploy from a branch" mode).
#
# Builds the static site with the locally-installed `sovrium` binary and
# publishes dist/ to the `gh-pages` branch (served at the repo root). Used
# instead of the CI build while sovrium.com/install is unavailable.
#
# One-time GitHub setting (cannot be scripted without repo-admin token):
#   Settings → Pages → Build and deployment → Source: "Deploy from a branch"
#   → Branch: gh-pages  /(root)  → Save.
#
# Usage:  bash scripts/deploy-pages.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

command -v sovrium >/dev/null || { echo "sovrium not on PATH — install it first."; exit 1; }

echo "▸ Building static site (production)…"
rm -rf dist
NODE_ENV=production \
SOVRIUM_DEPLOYMENT=github-pages \
SOVRIUM_BASE_URL=https://mercipourtonnon.fr \
SOVRIUM_GENERATE_SITEMAP=true \
SOVRIUM_GENERATE_ROBOTS=true \
  sovrium build app.yaml

echo "▸ Post-processing dist/…"
# Since Sovrium 0.33 the exporter emits real .js assets (no more .js.html rename).
# `auth` (for /_admin) makes the build emit OAuth discovery files and an
# invitation page pointing at localhost — meaningless on static hosting.
rm -rf dist/.well-known dist/accept-invitation.html
find dist -name ".DS_Store" -delete
rm -f dist/.gitkeep
# Pages "deploy from branch" runs Jekyll unless told not to; keep CNAME bound.
touch dist/.nojekyll
[ -f CNAME ] && cp CNAME dist/CNAME

echo "▸ Publishing to gh-pages…"
# Idempotency: a previous run leaves a local gh-pages branch behind, which
# makes the orphan checkout below fail ("a branch named 'gh-pages' already
# exists"). Drop it first — the canonical copy lives on the remote.
git branch -D gh-pages 2>/dev/null || true
WT="$(mktemp -d)"
git worktree remove --force "$WT" 2>/dev/null || true
git worktree add --detach "$WT" >/dev/null
(
  cd "$WT"
  git checkout --orphan gh-pages
  find . -maxdepth 1 ! -name . ! -name .git -exec rm -rf {} +
  cp -R "$REPO_ROOT/dist/." .
  git add -A
  git commit -q -m "Deploy static site (built locally with sovrium build)"
  # No -u: avoid recreating a local tracking branch that blocks the next run.
  git push -f origin gh-pages
)
git worktree remove --force "$WT"
git worktree prune
# The orphan checkout created a local gh-pages ref in the main repo — clear it.
git branch -D gh-pages 2>/dev/null || true

echo "✓ Deployed. Pages will refresh in ~1 min (source must be gh-pages /root)."
