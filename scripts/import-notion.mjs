#!/usr/bin/env node
// Import unique depuis Notion vers l'espace bénévole (Sovrium) :
//
//   1. 👯 Membres  → un compte invité (rôle `member`, email d'invitation envoyé
//      par Sovrium) + une ligne `members` validée, avec la photo ré-uploadée et
//      le lien vers la fiche `facilitators` quand le nom correspond.
//      Si BREVO_API_KEY et BREVO_LIST_BENEVOLES_ID sont définies, la personne est
//      aussi ajoutée à la liste Brevo des bénévoles (create-contact idempotent).
//   2. Évènements → les événements À VENIR dont le Type n'est pas « Atelier
//      Niveau 1 » (ceux-là vivent dans `workshops`), créés en `draft` : la
//      coordination complète l'intention, le programme et les infos pratiques
//      puis publie.
//
// Usage :
//   node scripts/import-notion.mjs --dry-run   # lit Notion (et Sovrium si accessible), n'écrit rien
//   node scripts/import-notion.mjs             # invite, crée les fiches et les événements
//
// Variables (environnement, sinon lues dans le .env à la racine du dépôt) :
//   NOTION_API_KEY            intégration Notion ayant accès aux deux bases
//   SOVRIUM_BASE_URL          ex. https://staging.mercipourtonnon.fr (défaut http://localhost:3000)
//   SOVRIUM_ADMIN_API_KEY     clé API d'un compte admin (header x-api-key ; exige auth.apiKeys: true)
//     — ou, à défaut —
//   SOVRIUM_ADMIN_EMAIL / SOVRIUM_ADMIN_PASSWORD   session d'un compte admin
//   BREVO_API_KEY, BREVO_LIST_BENEVOLES_ID          facultatives (liste Brevo)
//
// Idempotent : une personne dont l'email a déjà un compte n'est pas réinvitée ;
// une fiche `members` existante (même compte ou même email) est ignorée ; un
// événement existant (même titre, même jour) est ignoré. Relancer est sans risque.
// Les données personnelles ne sont jamais imprimées en entier (emails masqués).

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────
const MEMBERS_DATA_SOURCE = '274e4124-84a2-80a4-a461-000bc00de900'; // 👯 Membres
const EVENTS_DATA_SOURCE = '1ace4124-84a2-8075-9034-000bc214c4e6'; // Évènements
const NOTION_VERSION = '2025-09-03';
const NOTION_LEGACY_VERSION = '2022-06-28'; // repli : endpoint databases/:id/query
const EXCLUDED_EVENT_TYPE = 'Atelier Niveau 1';
const EVENT_TYPES = [
  'Séance de réflexion',
  "Réunion mensuelle de l'équipe",
  'Formation',
  'Réunion écosystème',
  'Réunion de travail',
  'Stand',
];

// Notion property → champ `members`. Les noms Notion utilisent l'apostrophe
// typographique (’) : la comparaison se fait sur les noms normalisés.
const MEMBER_TEXT_FIELDS = {
  Pronom: 'pronoun',
  'Pourquoi je souhaite contribuer à Merci pour ton non': 'why',
  'Mes intentions': 'intentions',
  'Mes envies': 'wishes',
  'Mes peurs': 'fears',
  'Mes ressources': 'resources',
  'Mes compétences': 'skills',
  "Ce que je n'aime pas": 'dislikes',
  "Comment j'aime travailler": 'work_style',
  'Mes créneaux favoris dans la semaine pour des réunions': 'preferred_slots',
};

// ── Env ───────────────────────────────────────────────────────────────────
function loadEnv() {
  const file = join(__dirname, '..', '.env');
  const fromFile = {};
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m) fromFile[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
  return (name) => process.env[name] || fromFile[name] || '';
}
const env = loadEnv();

// ── Helpers ───────────────────────────────────────────────────────────────
const norm = (s) => String(s || '').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const maskEmail = (e) => {
  const [user, domain] = String(e || '').split('@');
  return domain ? `${user.slice(0, 1)}***@${domain}` : '(sans email)';
};
const plain = (richText) => (Array.isArray(richText) ? richText.map((t) => t.plain_text || '').join('').trim() : '');

// Lit une propriété Notion par son nom normalisé.
function prop(page, name) {
  const wanted = norm(name);
  for (const [key, value] of Object.entries(page.properties || {})) {
    if (norm(key) === wanted) return value;
  }
  return undefined;
}
function propText(page, name) {
  const p = prop(page, name);
  if (!p) return '';
  switch (p.type) {
    case 'title':
      return plain(p.title);
    case 'rich_text':
      return plain(p.rich_text);
    case 'email':
      return String(p.email || '').trim();
    case 'phone_number':
      return String(p.phone_number || '').trim();
    case 'select':
      return p.select ? norm(p.select.name) : '';
    default:
      return '';
  }
}

// Instant UTC (ISO) d'une heure murale Europe/Paris.
function parisToUtc(date, time = '00:00') {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const lastSundayUtc = (month) => {
    const lastDay = new Date(Date.UTC(y, month + 1, 0));
    return Date.UTC(y, month, lastDay.getUTCDate() - lastDay.getUTCDay(), 1);
  };
  const asWinter = Date.UTC(y, m - 1, d, hh, mm) - 60 * 60000;
  const summer = asWinter >= lastSundayUtc(2) && asWinter < lastSundayUtc(9);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - (summer ? 120 : 60) * 60000).toISOString();
}
// Date Notion ("2026-11-05" ou "2026-11-05T18:30:00.000+01:00") → ISO UTC.
function notionDateToUtc(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parisToUtc(value);
  const t = Date.parse(value);
  return Number.isNaN(t) ? '' : new Date(t).toISOString();
}
const parisDay = (iso) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));

// ── Notion ────────────────────────────────────────────────────────────────
async function notionQuery(dataSourceId) {
  const key = env('NOTION_API_KEY');
  if (!key) throw new Error('NOTION_API_KEY manquante (environnement ou .env).');
  const pages = [];
  let cursor;
  let legacy = false;
  do {
    const body = JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) });
    const url = legacy
      ? `https://api.notion.com/v1/databases/${dataSourceId}/query`
      : `https://api.notion.com/v1/data_sources/${dataSourceId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Notion-Version': legacy ? NOTION_LEGACY_VERSION : NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok && !legacy && (res.status === 400 || res.status === 404) && pages.length === 0) {
      console.warn(`ℹ️  data_sources/${dataSourceId} → ${res.status}, repli sur databases/:id/query`);
      legacy = true;
      continue;
    }
    if (!res.ok) throw new Error(`Notion ${res.status} sur ${dataSourceId} : ${(await res.text()).slice(0, 200)}`);
    const json = await res.json();
    pages.push(...(json.results || []));
    cursor = json.has_more ? json.next_cursor : undefined;
  } while (cursor);
  return pages.filter((p) => !p.in_trash && !p.archived);
}

// ── Sovrium ───────────────────────────────────────────────────────────────
function sovriumClient() {
  const base = (env('SOVRIUM_BASE_URL') || 'http://localhost:3000').replace(/\/+$/, '');
  const apiKey = env('SOVRIUM_ADMIN_API_KEY');
  const email = env('SOVRIUM_ADMIN_EMAIL');
  const password = env('SOVRIUM_ADMIN_PASSWORD');
  let cookie = '';
  const configured = Boolean(apiKey || (email && password));

  async function headers(extra = {}) {
    if (apiKey) return { 'x-api-key': apiKey, origin: base, ...extra };
    if (!cookie) {
      const res = await fetch(`${base}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', origin: base },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`Connexion admin Sovrium refusée (${res.status}).`);
      cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ');
    }
    return { cookie, origin: base, ...extra };
  }

  async function call(method, path, body) {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: await headers(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Sovrium ${method} ${path} → ${res.status} ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : null;
  }

  async function listAll(table) {
    const rows = [];
    for (let page = 1; ; page += 1) {
      const json = await call('GET', `/api/tables/${table}/records?limit=100&page=${page}`);
      rows.push(...(json.records || []));
      if (!json.pagination || !json.pagination.hasNextPage) break;
    }
    return rows;
  }

  async function findUserByEmail(address) {
    const q = new URLSearchParams({ searchField: 'email', searchValue: address, limit: '10' });
    const json = await call('GET', `/api/auth/admin/list-users?${q}`);
    return (json.users || []).find((u) => String(u.email).toLowerCase() === address.toLowerCase()) || null;
  }

  async function uploadFromUrl(url, filename) {
    const file = await fetch(url);
    if (!file.ok) throw new Error(`téléchargement de la photo impossible (${file.status})`);
    const type = file.headers.get('content-type') || 'application/octet-stream';
    const form = new FormData();
    form.append('file', new Blob([await file.arrayBuffer()], { type }), filename);
    const res = await fetch(`${base}/api/buckets/system/files`, { method: 'POST', headers: await headers(), body: form });
    if (!res.ok) throw new Error(`upload de la photo refusé (${res.status})`);
    return (await res.json()).key;
  }

  return { base, configured, call, listAll, findUserByEmail, uploadFromUrl };
}

// ── Brevo (facultatif) ────────────────────────────────────────────────────
async function brevoAddToList(email, name) {
  const key = env('BREVO_API_KEY');
  const listId = Number(env('BREVO_LIST_BENEVOLES_ID'));
  if (!key || !Number.isInteger(listId) || listId <= 0) return { skipped: true };
  const parts = name.split(/\s+/);
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: { FIRSTNAME: parts[0] || '', LASTNAME: parts.slice(1).join(' ') },
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status} ${(await res.text()).slice(0, 150)}`);
  const text = await res.text();
  return { id: text ? String(JSON.parse(text).id || '') : '' };
}

// ── Members ───────────────────────────────────────────────────────────────
function toMember(page) {
  const name = propText(page, 'Prénom & Nom');
  const email = propText(page, 'Email').toLowerCase();
  const fields = { display_name: name, contact_email: email, phone: propText(page, 'Téléphone') };
  for (const [notionName, field] of Object.entries(MEMBER_TEXT_FIELDS)) fields[field] = propText(page, notionName);
  const rights =
    prop(page, "Droit à l'image sur les réseaux sociaux et le site de MPTN") || prop(page, "Droit à l'image");
  fields.image_rights = Boolean(rights && rights.checkbox);
  const files = prop(page, 'Photo de profil');
  const first = files && Array.isArray(files.files) ? files.files[0] : undefined;
  const photo = first ? { url: first.type === 'external' ? first.external.url : first.file.url, name: first.name || 'photo' } : null;
  for (const k of Object.keys(fields)) if (fields[k] === '') delete fields[k];
  return { notionId: page.id, name, email, fields, photo };
}

async function importMembers(sovrium, dryRun, stats) {
  const pages = await notionQuery(MEMBERS_DATA_SOURCE);
  const people = pages.map(toMember);
  stats.members.read = people.length;
  console.log(`\n── Membres : ${people.length} fiches Notion ─────────────────────`);

  let existing = [];
  let facilitators = [];
  if (sovrium.configured) {
    existing = await sovrium.listAll('members');
    facilitators = await sovrium.listAll('facilitators');
  } else {
    console.log('ℹ️  Sovrium non configuré : les doublons ne sont pas vérifiés (dry-run Notion seul).');
  }
  const byEmail = new Map(existing.filter((r) => r.fields.contact_email).map((r) => [String(r.fields.contact_email).toLowerCase(), r]));
  const byAccount = new Map(existing.filter((r) => r.fields.account).map((r) => [String(r.fields.account), r]));
  const facilitatorByName = new Map(facilitators.map((f) => [norm(f.fields.display_name).toLowerCase(), f.id]));

  for (const person of people) {
    const label = `${person.name || '(sans nom)'} <${maskEmail(person.email)}>`;
    if (!person.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(person.email)) {
      console.log(`⚠️  ${label} — nom ou email manquant, ignoré·e`);
      stats.members.invalid += 1;
      continue;
    }
    if (byEmail.has(person.email)) {
      console.log(`⏭️  ${label} — fiche déjà présente`);
      stats.members.skipped += 1;
      continue;
    }
    const facilitatorId = facilitatorByName.get(norm(person.name).toLowerCase());
    if (dryRun) {
      console.log(
        `🌵 ${label} — inviterait (member) + fiche validée` +
          `${person.photo ? ' + photo' : ''}${facilitatorId ? ` + lien facilitateur·ice #${facilitatorId}` : ''}` +
          ` (${Object.keys(person.fields).length} champs)`,
      );
      stats.members.toCreate += 1;
      continue;
    }
    try {
      let user = await sovrium.findUserByEmail(person.email);
      if (!user) {
        const invited = await sovrium.call('POST', '/api/auth/admin/invite-user', {
          email: person.email,
          name: person.name,
          role: 'member',
        });
        user = invited.user;
        stats.members.invited += 1;
      }
      if (byAccount.has(String(user.id))) {
        console.log(`⏭️  ${label} — le compte a déjà une fiche`);
        stats.members.skipped += 1;
        continue;
      }
      const fields = { ...person.fields, account: user.id, status: 'validated', validated_at: new Date().toISOString() };
      if (facilitatorId) fields.facilitator = facilitatorId;
      if (person.photo) {
        try {
          fields.photo = await sovrium.uploadFromUrl(person.photo.url, person.photo.name);
        } catch (err) {
          console.warn(`   ⚠️  photo non importée : ${err.message}`);
        }
      }
      try {
        const brevo = await brevoAddToList(person.email, person.name);
        if (brevo.id) fields.brevo_contact_id = brevo.id;
        if (!brevo.skipped) stats.members.brevo += 1;
      } catch (err) {
        console.warn(`   ⚠️  Brevo : ${err.message}`);
      }
      const row = await sovrium.call('POST', '/api/tables/members/records', { fields });
      byEmail.set(person.email, row);
      byAccount.set(String(user.id), row);
      console.log(`✅ ${label} — fiche #${row.id}`);
      stats.members.created += 1;
    } catch (err) {
      console.error(`❌ ${label} : ${err.message}`);
      stats.members.failed += 1;
    }
  }
}

// ── Events ────────────────────────────────────────────────────────────────
async function importEvents(sovrium, dryRun, stats) {
  const pages = await notionQuery(EVENTS_DATA_SOURCE);
  stats.events.read = pages.length;
  const now = Date.now();
  const candidates = [];
  for (const page of pages) {
    const type = propText(page, 'Type');
    const date = prop(page, 'Date');
    const startsAt = notionDateToUtc(date && date.date ? date.date.start : '');
    if (!startsAt || Date.parse(startsAt) < now) {
      stats.events.past += 1;
      continue;
    }
    if (type === norm(EXCLUDED_EVENT_TYPE)) {
      stats.events.workshops += 1;
      continue;
    }
    candidates.push({
      title: propText(page, 'Nom') || '(sans titre)',
      type: EVENT_TYPES.includes(type) ? type : 'Réunion de travail',
      typeWasUnknown: !EVENT_TYPES.includes(type),
      starts_at: startsAt,
      ends_at: notionDateToUtc(date.date.end || ''),
    });
  }
  console.log(`\n── Évènements : ${pages.length} lus, ${candidates.length} à venir hors ateliers ──`);

  const existing = sovrium.configured ? await sovrium.listAll('events') : [];
  const seen = new Set(existing.map((e) => `${norm(e.fields.title).toLowerCase()}|${e.fields.starts_at ? parisDay(e.fields.starts_at) : ''}`));

  for (const ev of candidates) {
    const label = `${parisDay(ev.starts_at)} ${ev.title} [${ev.type}${ev.typeWasUnknown ? ' — type Notion vide ou inconnu' : ''}]`;
    const key = `${norm(ev.title).toLowerCase()}|${parisDay(ev.starts_at)}`;
    if (seen.has(key)) {
      console.log(`⏭️  ${label} — déjà présent`);
      stats.events.skipped += 1;
      continue;
    }
    if (dryRun) {
      console.log(`🌵 ${label} — créerait un brouillon`);
      stats.events.toCreate += 1;
      continue;
    }
    try {
      const fields = { title: ev.title, type: ev.type, starts_at: ev.starts_at, status: 'draft' };
      if (ev.ends_at) fields.ends_at = ev.ends_at;
      const row = await sovrium.call('POST', '/api/tables/events/records', { fields });
      seen.add(key);
      console.log(`✅ ${label} — brouillon #${row.id}`);
      stats.events.created += 1;
    } catch (err) {
      console.error(`❌ ${label} : ${err.message}`);
      stats.events.failed += 1;
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const sovrium = sovriumClient();
  console.log(dryRun ? "🌵 DRY-RUN — aucun appel d'écriture" : `🖊️  Import vers ${sovrium.base}`);
  if (!dryRun && !sovrium.configured) {
    throw new Error('SOVRIUM_ADMIN_API_KEY, ou SOVRIUM_ADMIN_EMAIL + SOVRIUM_ADMIN_PASSWORD, requis hors dry-run.');
  }
  const stats = {
    members: { read: 0, invalid: 0, skipped: 0, toCreate: 0, invited: 0, created: 0, brevo: 0, failed: 0 },
    events: { read: 0, past: 0, workshops: 0, skipped: 0, toCreate: 0, created: 0, failed: 0 },
  };
  await importMembers(sovrium, dryRun, stats);
  await importEvents(sovrium, dryRun, stats);

  console.log('\n── Récapitulatif ──────────────────────────────────');
  console.log('membres    :', JSON.stringify(stats.members));
  console.log('évènements :', JSON.stringify(stats.events));
  if (!dryRun && stats.members.brevo === 0 && stats.members.created > 0) {
    console.log('\n⚠️  BREVO_API_KEY / BREVO_LIST_BENEVOLES_ID absentes : ajoute les bénévoles importé·es à la liste Brevo à la main.');
  }
  if (stats.members.failed || stats.events.failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
