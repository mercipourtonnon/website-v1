#!/usr/bin/env python3
"""Rewrite root-absolute URLs in the design/ export so it works from any base path.

Usage: python3 -I scripts/relativize-design.py design

- design/pages/**.html and **.css: "/x" becomes a path relative to the file.
  A page route ("/nos-ateliers") maps to its emitted "nos-ateliers.html";
  "/" maps to "index.html". A route that was not exported (auth-gated /espace/*,
  data-bound /ateliers/:slug, /api/*) becomes "#" plus data-unexported.
- design/design-system/**.html: the kit's sample links ("/docs", "/pricing")
  point nowhere in a preview and become "#".
Protocol-relative ("//host") and absolute ("https://") URLs are left alone.
"""
import os
import re
import sys

ATTR_RE = re.compile(r'\b(href|src|srcset|poster|action|data-src)="([^"]*)"')
CSS_URL_RE = re.compile(r'url\((["\']?)(/[^/"\')][^"\')]*)\1\)')


def split_suffix(url):
    m = re.match(r'([^?#]*)(.*)', url)
    return m.group(1), m.group(2)


def make_resolver(root, file_dir):
    def resolve(url):
        if not url.startswith('/') or url.startswith('//'):
            return url, True
        path, suffix = split_suffix(url)
        rel_prefix = os.path.relpath(root, file_dir)
        rel_prefix = '' if rel_prefix == '.' else rel_prefix + '/'
        if path in ('', '/'):
            return rel_prefix + 'index.html' + suffix, True
        target = path.lstrip('/')
        disk = os.path.join(root, target)
        if os.path.isfile(disk):
            return rel_prefix + target + suffix, True
        if os.path.isfile(disk.rstrip('/') + '.html'):
            return rel_prefix + target.rstrip('/') + '.html' + suffix, True
        return '#', False
    return resolve


# Sovrium 0.40 workaround (sovrium/sovrium#433): `sovrium build` references
# /assets/islands/*.js but never writes them. A <script>/<link> pointing at a
# local asset that is not on disk is dropped rather than left to 404.
MISSING_TAG_RE = re.compile(
    r'[ \t]*<script\b[^>]*\bsrc="(/[^/"][^"]*)"[^>]*>\s*</script>\s*\n?'
    r'|[ \t]*<link\b[^>]*\bhref="(/[^/"][^"]*)"[^>]*/?>\s*\n?'
)


def drop_missing_tags(text, root):
    def drop(m):
        url = m.group(1) or m.group(2)
        path, _suffix = split_suffix(url)
        return m.group(0) if os.path.exists(os.path.join(root, path.lstrip('/'))) else ''
    return MISSING_TAG_RE.sub(drop, text)


# The inline analytics beacon posts to /api/analytics/* on every load; a static
# preview has no server behind it, so the beacon is dropped.
ANALYTICS_RE = re.compile(r'[ \t]*<script>(?:(?!</script>).)*?/api/analytics/(?:(?!</script>).)*</script>\s*\n?', re.S)


def rewrite_html(text, resolve):
    text = ANALYTICS_RE.sub('', text)

    def attr(m):
        name, value = m.group(1), m.group(2)
        if name == 'srcset':
            parts = []
            for item in value.split(','):
                bits = item.strip().split(None, 1)
                if not bits:
                    continue
                url, _ok = resolve(bits[0])
                parts.append(' '.join([url] + bits[1:]))
            return f'{name}="{", ".join(parts)}"'
        url, ok = resolve(value)
        out = f'{name}="{url}"'
        if not ok:
            out += f' data-unexported="{value}"'
        return out

    text = ATTR_RE.sub(attr, text)
    return rewrite_css(text, resolve)


def rewrite_css(text, resolve):
    def url(m):
        q, value = m.group(1), m.group(2)
        new, ok = resolve(value)
        return f'url({q}{new if ok else value}{q})'
    return CSS_URL_RE.sub(url, text)


# Sovrium 0.40 workaround (sovrium/sovrium#434): the design-system bundle names
# the brand families (Bely Display, Neue Machina) but ships only Geist, so the
# kit falls back. Copy the @font-face rules from the built site.css into
# design-system/css/brand-fonts.css (pointing at pages/fonts/) and link it
# from every kit page.
def link_brand_fonts(design):
    site_css = os.path.join(design, 'pages', 'assets', 'site.css')
    if not os.path.isfile(site_css):
        return
    with open(site_css, encoding='utf-8') as fh:
        faces = re.findall(r'@font-face\s*{[^}]*}', fh.read())
    css = '/* Brand @font-face rules, copied from pages/assets/site.css (sovrium#434 workaround). */\n'
    css += '\n'.join(f.replace('url("/fonts/', 'url("../../pages/fonts/').replace('url("../fonts/', 'url("../../pages/fonts/') for f in faces) + '\n'
    with open(os.path.join(design, 'design-system', 'css', 'brand-fonts.css'), 'w', encoding='utf-8') as fh:
        fh.write(css)
    kit = os.path.join(design, 'design-system', 'components')
    for name in os.listdir(kit):
        if not name.endswith('.html'):
            continue
        path = os.path.join(kit, name)
        with open(path, encoding='utf-8') as fh:
            text = fh.read()
        if 'brand-fonts.css' in text:
            continue
        text = text.replace('<link rel="stylesheet" href="kit.css">',
                            '<link rel="stylesheet" href="../css/brand-fonts.css">\n<link rel="stylesheet" href="kit.css">', 1)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(text)


def main(design):
    pages = os.path.join(design, 'pages')
    kit = os.path.join(design, 'design-system')
    changed = 0
    for base, rewrite_kind in ((pages, 'pages'), (kit, 'kit')):
        for dirpath, _dirs, files in os.walk(base):
            for name in files:
                if not name.endswith(('.html', '.css')):
                    continue
                path = os.path.join(dirpath, name)
                with open(path, encoding='utf-8') as fh:
                    text = fh.read()
                if rewrite_kind == 'pages':
                    resolve = make_resolver(pages, dirpath)
                    new = rewrite_html(drop_missing_tags(text, pages), resolve) if name.endswith('.html') else rewrite_css(text, resolve)
                else:
                    if not name.endswith('.html'):
                        continue
                    new = ATTR_RE.sub(
                        lambda m: f'{m.group(1)}="#"' if m.group(2).startswith('/') and not m.group(2).startswith('//') else m.group(0),
                        text,
                    )
                if new != text:
                    with open(path, 'w', encoding='utf-8') as fh:
                        fh.write(new)
                    changed += 1
    link_brand_fonts(design)
    print(f'relativized {changed} files')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'design')
