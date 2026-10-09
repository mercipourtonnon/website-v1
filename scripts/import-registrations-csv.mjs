#!/usr/bin/env node
// Importe dans `registrations` les participant·es d'une séance depuis l'export
// CSV « Liste des participants » de HelloAsso Billetterie Plus. Sert une seule
// fois : pour le 17 octobre 2026, dernière date restée sur Billetterie Plus
// (les dates HelloAsso v5 sont synchronisées par sync-workshop-registrations).
//
// L'export contient des données personnelles : il reste hors du dépôt
// (.gitignore) et ce script n'en imprime aucun nom.
//
// Usage :
//   node scripts/import-registrations-csv.mjs <export.csv> --seance 2026-10-17 --workshop 2026-10-17-14h --dry-run
//   node scripts/import-registrations-csv.mjs <export.csv> --seance 2026-10-17 --workshop 2026-10-17-14h
//
// Options :
//   --seance    début de la colonne « Séance » à garder (ex. 2026-10-17 ou "2026-10-17 14:00")
//   --workshop  slug de la ligne `workshops` à laquelle rattacher les personnes
//   --base-url  instance Sovrium (défaut : BASE_URL, sinon http://localhost:3000)
//   --dry-run   n'écrit rien, imprime le décompte
// Connexion : AUTH_ADMIN_EMAIL / AUTH_ADMIN_PASSWORD (lus dans l'environnement ou le .env).
//
// Idempotent : upsert sur external_id (« import-<n° de billet> »), donc relancer
// le script met à jour les mêmes lignes. Il n'écrit jamais `attendance` ni `notes` :
// un pointage déjà fait le jour J n'est pas écrasé.

import { readFileSync, existsSync } from 'node:fs';

// ── Arguments ─────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const file = argv.find((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && argv[i - 1] !== '--dry-run'));
const seance = flag('seance');
const workshopSlug = flag('workshop');
const dryRun = argv.includes('--dry-run');
if (!file || !seance || !workshopSlug) {
  console.error('Usage : node scripts/import-registrations-csv.mjs <export.csv> --seance <AAAA-MM-JJ> --workshop <slug> [--base-url URL] [--dry-run]');
  process.exit(1);
}

// .env (sans écraser l'environnement existant)
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
}
const baseUrl = (flag('base-url') || process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

// ── CSV (séparateur « ; », guillemets doublés) ────────────────────────────
function parseCsv(text, sep = ';') {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim() !== ''));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const euros = (v) => Number(String(v || '0').replace(/\s/g, '').replace(',', '.')) || 0;
const column = (row, start) => {
  const key = Object.keys(row).find((k) => k.startsWith(start));
  return key ? row[key] : '';
};

const rows = parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''));
const kept = rows.filter((r) => (r['Séance'] || '').startsWith(seance));

const records = kept.map((r) => {
  const refunded = euros(r['Montant remboursé']) > 0;
  const status = r['Valide'] === 'Oui' ? 'valid' : refunded ? 'refunded' : 'cancelled';
  const paid = status === 'valid' ? Math.max(0, euros(r['Prix']) - euros(r['Montant remboursé'])) : 0;
  // Case cochée = « 1 ». Non cochée = pas de consentement.
  const photo = column(r, "J'autorise") === '1' ? 'yes' : 'no';
  return {
    fields: {
      external_id: `import-${r['Billet']}`,
      order_id: r['Commande'],
      first_name: r['Prénom'] || r['Prénom acheteur'],
      last_name: r['Nom'] || r['Nom acheteur'],
      participant_email: r['Email'] || r['Email acheteur'],
      amount_paid: Math.round(paid * 100) / 100,
      status,
      source: 'import',
      photo_consent: photo,
      synced_at: new Date().toISOString(),
    },
  };
});

const count = (s) => records.filter((r) => r.fields.status === s).length;
const total = records.reduce((sum, r) => sum + r.fields.amount_paid, 0);
console.log(`Séance « ${seance} » : ${records.length} billet(s) — ${count('valid')} valide(s), ${count('cancelled')} annulé(s), ${count('refunded')} remboursé(s), ${total.toFixed(2)} € en ligne.`);
if (records.some((r) => !r.fields.external_id || r.fields.external_id === 'import-')) {
  console.error('Billet sans numéro dans l\'export : abandon.');
  process.exit(1);
}
if (dryRun || records.length === 0) {
  console.log(dryRun ? 'Dry run : rien n\'a été écrit.' : 'Aucune ligne pour cette séance.');
  process.exit(0);
}

// ── Écriture via l'API Records ────────────────────────────────────────────
const email = process.env.AUTH_ADMIN_EMAIL;
const password = process.env.AUTH_ADMIN_PASSWORD;
if (!email || !password) {
  console.error('AUTH_ADMIN_EMAIL / AUTH_ADMIN_PASSWORD manquants.');
  process.exit(1);
}
const headers = { 'content-type': 'application/json', origin: baseUrl };
const signIn = await fetch(`${baseUrl}/api/auth/sign-in/email`, { method: 'POST', headers, body: JSON.stringify({ email, password }) });
if (!signIn.ok) throw new Error(`Connexion refusée (${signIn.status}).`);
const cookie = (signIn.headers.getSetCookie?.() ?? [signIn.headers.get('set-cookie')]).map((c) => c.split(';')[0]).join('; ');
const authed = { ...headers, cookie };

const lookup = await fetch(`${baseUrl}/api/tables/workshops/records?filter[slug]=${encodeURIComponent(workshopSlug)}&limit=5`, { headers: authed });
const found = (await lookup.json()).records?.filter((w) => w.fields?.slug === workshopSlug) ?? [];
if (found.length !== 1) throw new Error(`Atelier « ${workshopSlug} » introuvable (${found.length} résultat).`);
const workshopId = String(found[0].id);

let created = 0;
let updated = 0;
for (let i = 0; i < records.length; i += 100) {
  const batch = records.slice(i, i + 100).map((r) => ({ fields: { ...r.fields, workshop: workshopId } }));
  const res = await fetch(`${baseUrl}/api/tables/registrations/records/upsert`, {
    method: 'POST',
    headers: authed,
    body: JSON.stringify({ records: batch, fieldsToMergeOn: ['external_id'] }),
  });
  if (!res.ok) throw new Error(`Upsert refusé (${res.status}) : ${await res.text()}`);
  const out = await res.json();
  created += out.created ?? 0;
  updated += out.updated ?? 0;
}
console.log(`Importé dans « ${workshopSlug} » : ${created} créée(s), ${updated} mise(s) à jour.`);
