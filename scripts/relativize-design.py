#!/usr/bin/env python3
"""Rewrite root-absolute URLs in the design/ export so it works from any base path.

Usage: python3 -I scripts/relativize-design.py design

- design/site/ (mirrored from a running server by scripts/mirror-site.mjs):
  "/x" becomes a path relative to the file. A route ("/nos-ateliers") maps to
  its "nos-ateliers.html", "/" to "index.html". A route that was not mirrored
  (the auth-gated /espace/*, /api/*) becomes "#" plus data-unexported, which
  site/preview.js answers with a notice. The same is done to the hrefs inside
  island props (the navigation menu) and to data-island-entry.
  External scripts and stylesheets are dropped (an artifact loads scripts from
  its own origin only), so is the analytics beacon, and site/preview.js is
  linked from every page.
- design/design-system/components/*.html: the kit's sample links ("/docs",
  "/pricing") point nowhere and become "#".
- design/design-system/pages/*.page.html (the native page drawings of
  Sovrium 0.41 `--pages`): a route links to the drawing of the page serving
  it; an asset ("/pictures/...") points at its copy in design/site/, copied
  there from public/ when the mirror did not need it.
Protocol-relative ("//host") and absolute ("https://") URLs are left alone.
"""
import json
import os
import re
import shutil
import sys

ATTR_RE = re.compile(r'\b(href|src|srcset|poster|action|data-src|data-island-entry)="([^"]*)"')
CSS_URL_RE = re.compile(r'url\((["\']?)(/[^/"\')][^"\')]*)\1\)')
# Inside data-island-props JSON (HTML-escaped): "href":"/route", "redirectUrl":"/route".
PROPS_URL_RE = re.compile(r'(&quot;(?:href|redirectUrl)&quot;:&quot;)(/[^&]*)(&quot;)')


def split_suffix(url):
    m = re.match(r'([^?#]*)(.*)', url)
    return m.group(1), m.group(2)


def rel_prefix(root, file_dir):
    p = os.path.relpath(root, file_dir)
    return '' if p == '.' else p + '/'


def rewrite_attrs(text, resolve, mark_unexported=False):
    """Apply resolve(url) -> (new_url, ok) to every URL attribute, srcset included."""
    def attr(m):
        name, value = m.group(1), m.group(2)
        if name == 'srcset':
            parts = []
            for item in value.split(','):
                bits = item.strip().split(None, 1)
                if bits:
                    parts.append(' '.join([resolve(bits[0])[0]] + bits[1:]))
            return f'{name}="{", ".join(parts)}"'
        url, ok = resolve(value)
        out = f'{name}="{url}"'
        if mark_unexported and not ok:
            out += f' data-unexported="{value}"'
        return out
    return ATTR_RE.sub(attr, text)


def make_site_resolver(site, file_dir):
    prefix = rel_prefix(site, file_dir)

    def resolve(url):
        if not url.startswith('/') or url.startswith('//'):
            return url, True
        path, suffix = split_suffix(url)
        if path in ('', '/'):
            return prefix + 'index.html' + suffix, True
        target = path.strip('/')
        disk = os.path.join(site, target)
        if os.path.isfile(disk):
            return prefix + target + suffix, True
        if os.path.isfile(disk + '.html'):
            return prefix + target + '.html' + suffix, True
        return '#', False
    return resolve


# The inline analytics beacon posts to /api/analytics/* on every load; a static
# preview has no server behind it, so the beacon is dropped.
ANALYTICS_RE = re.compile(r'[ \t]*<script>(?:(?!</script>).)*?/api/analytics/(?:(?!</script>).)*</script>\s*\n?', re.S)
# An artifact loads scripts from its own origin (or cdnjs/jsdelivr/unpkg) only.
# The Brevo newsletter (sibforms.com main.js + sib-styles.css) is the only
# external one: without it brevo-embed.js still draws the form, and preview.js
# answers its submit. dns-prefetch/preconnect hints to outside hosts go too.
EXTERNAL_TAG_RE = re.compile(
    r'[ \t]*<script\b[^>]*\bsrc="https?://(?!cdnjs\.cloudflare\.com/|cdn\.jsdelivr\.net/|unpkg\.com/)[^"]*"[^>]*>\s*</script>\s*\n?'
    r'|[ \t]*<link\b(?=[^>]*\brel="(?:stylesheet|preconnect|dns-prefetch)")(?=[^>]*\bhref="https?://)[^>]*/?>\s*\n?'
)
# Pre-0.27 @font-face fallbacks: .eot is not a servable artifact type.
EOT_SRC_RE = re.compile(r'\s*src:\s*url\([^)]*\.eot[^)]*\);')
EOT_ITEM_RE = re.compile(r'url\([^)]*\.eot\?[^)]*\)\s*format\(["\']embedded-opentype["\']\),\s*')


def rewrite_css(text, resolve):
    text = EOT_SRC_RE.sub('', text)
    text = EOT_ITEM_RE.sub('', text)

    def url(m):
        q, value = m.group(1), m.group(2)
        new, ok = resolve(value)
        return f'url({q}{new if ok else value}{q})'
    return CSS_URL_RE.sub(url, text)


def rewrite_site_html(text, resolve, preview_src):
    text = ANALYTICS_RE.sub('', text)
    text = EXTERNAL_TAG_RE.sub('', text)
    text = rewrite_attrs(text, resolve, mark_unexported=True)
    text = PROPS_URL_RE.sub(lambda m: m.group(1) + resolve(m.group(2))[0] + m.group(3), text)
    text = rewrite_css(text, resolve)
    if 'preview.js' not in text:
        text = text.replace('</head>', f'<script src="{preview_src}"></script>\n</head>', 1)
    return text


def link_stylesheet_before(text, href, anchor):
    if href in text or anchor not in text:
        return text
    return text.replace(anchor, f'<link rel="stylesheet" href="{href}">\n{anchor}', 1)


def route_matchers(node_map):
    """[(regex, drawing file)] from the drawings' node map, literal routes first."""
    with open(node_map, encoding='utf-8') as fh:
        pages = json.load(fh)['pages']
    out = []
    for page in pages:
        parts = [('[^/]+' if seg.startswith(':') else re.escape(seg)) for seg in page['path'].strip('/').split('/')]
        regex = re.compile('^/' + '/'.join(p for p in parts if p) + '/?$')
        out.append((':' in page['path'], regex, page['name'] + '.page.html'))
    out.sort(key=lambda x: x[0])
    return [(regex, f) for _p, regex, f in out]


def relativize_drawings(design, root):
    pages = os.path.join(design, 'design-system', 'pages')
    site = os.path.join(design, 'site')
    node_map = os.path.join(pages, 'node-map.json')
    if not os.path.isfile(node_map):
        return 0
    matchers = route_matchers(node_map)
    public = os.path.join(root, 'public')
    to_site = rel_prefix(site, pages)

    def resolve(url):
        if not url.startswith('/') or url.startswith('//'):
            return url, True
        path, suffix = split_suffix(url)
        target = path.strip('/')
        if '.' in os.path.basename(target):  # an asset: served from the mirrored site
            disk = os.path.join(site, target)
            src = os.path.join(public, target)
            if not os.path.isfile(disk) and os.path.isfile(src):
                os.makedirs(os.path.dirname(disk), exist_ok=True)
                shutil.copyfile(src, disk)
            return (to_site + target + suffix, True) if os.path.isfile(disk) else ('#', False)
        for regex, drawing in matchers:
            if regex.match(path or '/'):
                return drawing + suffix, True
        return '#', False

    changed = 0
    for name in sorted(os.listdir(pages)):
        if not name.endswith('.page.html'):
            continue
        path = os.path.join(pages, name)
        with open(path, encoding='utf-8') as fh:
            text = fh.read()
        new = rewrite_attrs(text, resolve)
        new = link_stylesheet_before(new, '../css/brand-fonts.css', '<link rel="stylesheet" href="pages.css">')
        if new != text:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new)
            changed += 1
    return changed


# Sovrium 0.41 workaround (sovrium/sovrium#434): the design-system bundle names
# the brand families (Bely Display, Neue Machina) but ships only Geist, so the
# kit and the page drawings fall back. Copy the @font-face rules from the
# mirrored site.css into design-system/css/brand-fonts.css (pointing at
# site/fonts/) and link it from every kit page (and, above, every drawing).
def write_brand_fonts(design):
    site_css = os.path.join(design, 'site', 'assets', 'site.css')
    if not os.path.isfile(site_css):
        return
    with open(site_css, encoding='utf-8') as fh:
        faces = re.findall(r'@font-face\s*{[^}]*}', fh.read())
    css = '/* Brand @font-face rules, copied from site/assets/site.css (Sovrium 0.41, sovrium/sovrium#434 workaround). */\n'
    css += '\n'.join(re.sub(r'url\("(?:\.\./)+fonts/', 'url("../../site/fonts/', f) for f in faces) + '\n'
    with open(os.path.join(design, 'design-system', 'css', 'brand-fonts.css'), 'w', encoding='utf-8') as fh:
        fh.write(css)
    kit = os.path.join(design, 'design-system', 'components')
    for name in os.listdir(kit):
        if name.endswith('.html'):
            path = os.path.join(kit, name)
            with open(path, encoding='utf-8') as fh:
                text = fh.read()
            new = link_stylesheet_before(text, '../css/brand-fonts.css', '<link rel="stylesheet" href="kit.css">')
            if new != text:
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(new)


def main(design, root):
    site = os.path.join(design, 'site')
    kit = os.path.join(design, 'design-system', 'components')
    changed = 0
    for dirpath, _dirs, files in os.walk(site):
        for name in files:
            if not name.endswith(('.html', '.css')):
                continue
            path = os.path.join(dirpath, name)
            with open(path, encoding='utf-8') as fh:
                text = fh.read()
            resolve = make_site_resolver(site, dirpath)
            if name.endswith('.html'):
                new = rewrite_site_html(text, resolve, rel_prefix(site, dirpath) + 'preview.js')
            else:
                new = rewrite_css(text, resolve)
            if new != text:
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(new)
                changed += 1
    # brevo-embed.js injects the newsletter markup (a link to /mentions-legales)
    # into pages that all sit at the site root.
    embed = os.path.join(site, 'assets', 'brevo-embed.js')
    if os.path.isfile(embed):
        with open(embed, encoding='utf-8') as fh:
            text = fh.read()
        new = rewrite_attrs(text, make_site_resolver(site, site))
        if new != text:
            with open(embed, 'w', encoding='utf-8') as fh:
                fh.write(new)
            changed += 1
    kit_resolve = lambda u: ('#', False) if u.startswith('/') and not u.startswith('//') else (u, True)
    for name in os.listdir(kit):
        if name.endswith('.html'):
            path = os.path.join(kit, name)
            with open(path, encoding='utf-8') as fh:
                text = fh.read()
            new = rewrite_attrs(text, kit_resolve)
            if new != text:
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(new)
                changed += 1
    write_brand_fonts(design)
    changed += relativize_drawings(design, root)
    print(f'relativized {changed} files')


if __name__ == '__main__':
    design = sys.argv[1] if len(sys.argv) > 1 else 'design'
    main(design, os.path.dirname(os.path.abspath(design)))
