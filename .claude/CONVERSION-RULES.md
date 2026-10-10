# HTML → Sovrium YAML conversion rules (temporary working doc)

Verified against Sovrium v0.10.0 on this machine. Follow these EXACTLY.

## Component vocabulary (only these — anything else fails validation)
Valid types include: `container`, `flex`, `grid`, `card`, `hero`, `text`, `icon`,
`image`, `video`, `iframe`, `button`, `badge`, `link`, `divider`, `spacer`, `list`,
`list-item`, `customHTML`.
- FORBIDDEN (island components — banned because they broke in the old static build;
  production is now server-hosted on Sovrium Cloud, so re-check against the current
  Sovrium before lifting the ban): `accordion`, `tabs`,
  `dialog`, `drawer`, `tooltip`, `popover`, `select`, `navigation-menu`, `carousel`,
  `dropdown-menu`, `hover-card`, `toast`, `command`, `modal`.
- There is NO `heading` type. Headings = `type: text` + `element: h1`/`h2`/`h3`/`h4`.
- Paragraphs/spans = `type: text` + `element: p` / `element: span`. Default element is span-like.
- `type: container` + `element: section|nav|footer|header|main|div` for structural tags.

## Mapping rules
- Copy Tailwind classes from the old HTML verbatim into `props.className`.
  Custom theme colors (pourpre, orange, orange-vif, mauve, cyan, bleu-fonce, + -light /
  -lighter / -hover variants) are available as utilities (bg-*, text-*, border-*).
- **Opacity modifiers on custom colors (`text-bleu-fonce/70`) work on text/containers.
  On `link` components use the dedicated tokens `text-bleu-fonce-50` / `text-bleu-fonce-70`.**
- **`link` components do NOT inherit text color** (Sovrium injects a default color class).
  Every `type: link` MUST carry an explicit `text-*` color class in className matching
  what the old element visually had (look at its parent if the old <a> had no color class).
  Links also get `hover:underline` injected — if the original had no underline on hover and
  it visually matters, that's acceptable for now (note it in your report).
- `<a>` → `type: link`, props: `href`, optional `target`, `rel`, `aria-label`, className.
  Link text = `content`; or `children` for wrapped images/icons.
- `<img>` → `type: image`, props: `src`, `alt`, `className`. **Asset paths change:
  `./public/x` or `/public/x` → `/x`** (public/ is served at the site root).
- `<i data-lucide="NAME">` → `type: icon`, props: `name: NAME`, `className` (keep size classes
  like `w-5 h-5`). Icons render server-side; do NOT add the lucide CDN script.
- `<button>` → `type: button`, `label` for plain text (or children), props.className.
- Accordion/FAQ rows → question `type: button` with
  `interactions: { click: { toggleElement: '#some-id' } }`, answer `type: container` with
  `props: { id: some-id, style: { display: none } }`. IDs must start with a letter.
- Scroll-reveal (testimonials etc.) → on the revealed component:
  `interactions: { scroll: { animation: fadeInUp, threshold: 0.1, once: true } }`.
- Anchors/ids: keep `props: { id: ... }` on sections for anchor links (e.g. `id: atelier`).
- Inline styles → `props.style: { background: '...', ... }` (YAML map, camelCase keys).
- HTML entities: write real characters (é, ·, —, ©) directly in YAML strings.
- French text content: copy VERBATIM. Never paraphrase, never translate.
- `&copy;` → `©`, `&amp;` → `&`.
- Comments in YAML (`# Section: ...`) to mark the original HTML section boundaries.

## Templates
Reusable templates live in `config/components/*.yaml` and are referenced as:
```yaml
- component: site-footer        # no vars
- component: my-card            # with vars
  vars: { title: '...', color: 'pourpre' }
```
Template files: `name: <kebab>`, then a normal component definition where `$varName`
placeholders may appear in props/content.

## Page meta (minimal during transcription — full SEO comes later)
Keep the existing stub `meta:` block (lang/title/noindex) untouched unless told otherwise.

## Validation loop (MUST pass before you finish)
```bash
cd /Users/thomasjeanneau/Codes/mercipourtonnon
sovrium validate app.yaml
```
Fix every error. Do NOT edit app.yaml, config/theme.yaml, or files outside your assigned page
file (and any new component template files explicitly assigned to you).

## Visual check references
The old site pages are the .html files at the repo root. The dev server may be running on
:3000 (touch app.yaml to force a reload after edits — the watcher only watches app.yaml).
