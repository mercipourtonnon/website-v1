#!/usr/bin/env node
// Mirror the public site of a running Sovrium server into a static folder.
//
//   node scripts/mirror-site.mjs <base-url> <out-dir> [extra-route ...]
//
// Why not `sovrium build`: on Sovrium 0.41 the static build references
// /assets/islands/*.js but never writes them (sovrium/sovrium#433), so the
// built pages are not interactive. A running server serves every chunk, so we
// drive it with a real browser (Playwright) and keep what it loads, including
// the island chunks a page only imports after an interaction.
//
// 1. Routes: discovered by following same-origin links from "/", plus the
//    extra routes given (the /ateliers/:slug pages from the seed). Private and
//    API routes are never visited: /espace/*, /_admin*, /api/*.
// 2. Each route is loaded at 1280px and 375px, scrolled to the bottom (scroll
//    animations, lazy images), its menus hovered and toggled, and the command
//    palette opened; every same-origin GET answer is saved.
// 3. A static pass then fetches what the HTML and CSS reference but the
//    browser did not request (favicons, the web manifest, srcset candidates).
//
// Output is the raw server markup with root-absolute URLs;
// scripts/relativize-design.py makes it work under any base path.
// Needs the `playwright` package: export-design.sh installs it in a cache dir
// and names that dir in PLAYWRIGHT_DIR (ESM ignores NODE_PATH).
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(process.env.PLAYWRIGHT_DIR ? path.join(process.env.PLAYWRIGHT_DIR, 'noop.js') : import.meta.url);
const { chromium } = require('playwright');

const [base, outDir, ...extra] = process.argv.slice(2);
if (!base || !outDir) {
  console.error('usage: mirror-site.mjs <base-url> <out-dir> [extra-route ...]');
  process.exit(2);
}
const origin = new URL(base).origin;
const PRIVATE = /^\/(espace(\/|$)|_admin|api\/|\.well-known\/)/;
// Artifact-servable types only (no .eot: the old @font-face fallback).
const ALLOWED = /\.(html|css|js|mjs|json|md|txt|svg|png|jpe?g|webp|avif|ico|woff2?|ttf|otf|mp3|webm|mp4|pdf|webmanifest)$/i;

const routes = new Set(['/', ...extra]);
const done = new Set();
const saved = new Map(); // url path -> file path

function fileFor(urlPath, isDocument) {
  if (isDocument) return urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '').replace(/\/$/, '') + '.html';
  return decodeURIComponent(urlPath.replace(/^\//, ''));
}

async function save(urlPath, body, isDocument) {
  const rel = fileFor(urlPath, isDocument);
  if (!isDocument && !ALLOWED.test(rel)) return;
  const dest = path.join(outDir, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, body);
  saved.set(urlPath, rel);
}

function linksIn(html) {
  const out = [];
  for (const m of html.matchAll(/\bhref="([^"]*)"/g)) {
    let u;
    try { u = new URL(m[1].replace(/&amp;/g, '&'), origin + '/'); } catch { continue; }
    if (u.origin !== origin) continue;
    const p = u.pathname;
    if (PRIVATE.test(p) || /\.[a-z0-9]+$/i.test(p) || p.startsWith('/assets/')) continue;
    out.push(p.replace(/\/$/, '') || '/');
  }
  return out;
}

async function exercise(page, width) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  const tryAll = async (selector, action) => {
    for (const el of await page.$$(selector)) {
      try { if (await el.isVisible()) await action(el); } catch { /* detached or covered: ignore */ }
    }
  };
  if (width >= 1024) {
    await tryAll('header nav button, [data-island="navigation-menu"] button', (el) => el.hover({ timeout: 800 }));
  } else {
    await tryAll('button[aria-controls], button[aria-expanded]', async (el) => {
      await el.click({ timeout: 800 });
      await page.waitForTimeout(80);
      await page.keyboard.press('Escape');
    });
  }
  await tryAll('summary, .faq-q', (el) => el.click({ timeout: 800 }));
  // The command palette is a deferred island: its chunk loads on first open.
  for (const key of ['Control+k', 'Meta+k']) {
    await page.keyboard.press(key).catch(() => {});
    await page.waitForTimeout(150);
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForLoadState('networkidle').catch(() => {});
}

const browser = await chromium.launch();
try {
  for (const width of [1280, 375]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    const pending = [];
    page.on('response', (res) => {
      const req = res.request();
      const u = new URL(res.url());
      if (u.origin !== origin || req.method() !== 'GET' || res.status() !== 200) return;
      if (PRIVATE.test(u.pathname) || req.resourceType() === 'document') return;
      if (saved.has(u.pathname)) return;
      pending.push(res.body().then((b) => save(u.pathname, b, false)).catch(() => {}));
    });
    const queue = [...routes];
    const seen = new Set();
    while (queue.length) {
      const route = queue.shift();
      if (seen.has(route)) continue;
      seen.add(route);
      const res = await page.goto(origin + route, { waitUntil: 'networkidle' });
      const finalPath = new URL(page.url()).pathname;
      if (!res || res.status() !== 200 || finalPath.replace(/\/$/, '') !== route.replace(/\/$/, '')) {
        console.warn(`skip ${route} (status ${res && res.status()}, landed on ${finalPath})`);
        continue;
      }
      if (!done.has(route)) {
        // The server markup, not the hydrated DOM: islands hydrate it again.
        const html = await res.text();
        await save(route, html, true);
        done.add(route);
        for (const l of linksIn(html)) if (!seen.has(l)) { routes.add(l); queue.push(l); }
      }
      await exercise(page, width);
    }
    await Promise.all(pending);
    await ctx.close();
  }
} finally {
  await browser.close();
}

// Static pass: what the markup references but the browser never asked for.
const REF = /\b(?:href|src|data-src|poster|data-island-entry)="(\/[^/"][^"]*)"|\bsrcset="([^"]*)"|url\((["']?)(\/[^/"')][^"')]*)\3\)/g;
async function staticPass() {
  let added = 0;
  for (const rel of [...saved.values()]) {
    if (!/\.(html|css|webmanifest)$/.test(rel)) continue;
    const text = await readFile(path.join(outDir, rel), 'utf8');
    const urls = [];
    for (const m of text.matchAll(REF)) {
      if (m[1]) urls.push(m[1]);
      if (m[2]) for (const c of m[2].split(',')) { const u = c.trim().split(/\s+/)[0]; if (u.startsWith('/')) urls.push(u); }
      if (m[4]) urls.push(m[4]);
    }
    if (rel.endsWith('.webmanifest')) for (const m of text.matchAll(/"src"\s*:\s*"([^"]+)"/g)) urls.push(new URL(m[1], origin + '/' + rel).pathname);
    for (const raw of urls) {
      const p = raw.replace(/&amp;/g, '&').split(/[?#]/)[0];
      if (saved.has(p) || PRIVATE.test(p) || !ALLOWED.test(p)) continue;
      const res = await fetch(origin + p);
      if (!res.ok) continue;
      await save(p, Buffer.from(await res.arrayBuffer()), false);
      added++;
    }
  }
  return added;
}
while ((await staticPass()) > 0) { /* repeat until nothing new (CSS -> fonts) */ }

const pages = [...done].sort();
await writeFile(path.join(outDir, 'routes.json'), JSON.stringify(pages, null, 2) + '\n');
console.log(`mirrored ${pages.length} pages, ${saved.size - pages.length} assets`);
if (!existsSync(path.join(outDir, 'index.html'))) process.exit(1);
