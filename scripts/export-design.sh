#!/usr/bin/env bash
# Export the design system and the static pages into design/, as one folder
# that works from any base path (published as a multi-file Claude Artifact).
#
#   bash scripts/export-design.sh
#
# design/index.html (the hub) is hand-written and kept; design/design-system/
# and design/pages/ are regenerated from app.yaml on every run.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PATH="$HOME/.sovrium/bin:$PATH"
OUT=design

rm -rf "$OUT/design-system" "$OUT/pages"

# 1. Design system: brief, DTCG tokens, theme CSS, rendered component kit.
sovrium design-system app.yaml --format bundle --output "$OUT/design-system"
# The dark palette as its own DTCG file (the bundle's tokens/ uses other names).
sovrium design-system app.yaml --format json --mode dark --output "$OUT/design-system/tokens.dark.json"

# 2. Static pages (public/ assets are copied alongside: fonts, pictures, logos).
SOVRIUM_OUTPUT_DIR="$OUT/pages" sovrium build app.yaml

# 3. Drop what does not belong in a preview.
rm -rf "$OUT/pages/banners" # legacy social-banner sources, broken refs (../../output.css)
rm -rf "$OUT/pages/.well-known" "$OUT/pages/.gitkeep" # OAuth discovery docs, placeholder
rm -f "$OUT/pages/README.md" "$OUT/pages/robots.txt" "$OUT/pages/sitemap.xml" "$OUT/pages/CNAME"

# 4. Root-absolute URLs -> relative, so the folder works under any base path.
python3 -I scripts/relativize-design.py "$OUT"

echo "Exported: $(find "$OUT" -type f | wc -l | tr -d ' ') files, $(du -sh "$OUT" | cut -f1)"
