#!/usr/bin/env node
// Crée les nouveaux ateliers "Merci pour ton non" dans HelloAsso Billetterie Plus,
// en se basant sur l'événement existant du 16 juillet 2026 (lu au préalable via l'API standard).
//
// Ce que le script fait, par date (tout en `draft`, non public) :
//   1. POST /events                → l'événement (crée aussi un "shop principal" isMain)
//   2. POST /events/:id/sellingItems → un tarif "Prix libre" (basePrice 0) sur le shop principal
//   3. POST /events/:id/forms + PATCH /events/:id { formId } → le formulaire d'inscription (6 questions)
//
// ⚠️ Limite de l'API Billetterie Plus : elle n'expose AUCUN champ de date d'événement
//    (`start`/`end` sont en lecture seule). Les 6 dates/heures sont donc à saisir À LA MAIN
//    dans le dashboard. Elles figurent quand même dans le titre + le récapitulatif ci-dessous.
//
// Usage :
//   node scripts/create-billetterie-plus-events.mjs --dry-run   # n'écrit rien, imprime les payloads
//   node scripts/create-billetterie-plus-events.mjs             # crée les événements en brouillon
//
// Idempotent : un événement dont le `slug` existe déjà est ignoré (skip).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────
const ORGANIZER_ID = '6a578cf16a7a3ea9488bbf75'; // "Merci pour ton non" (Billetterie Plus)
const API_BASE = `https://api.plusbilletterie.helloasso.com/v1/organizers/${ORGANIZER_ID}`;
const CAPACITY = 15;

// Lieu commun à tous les ateliers (repris du 16 juillet).
const PLACE = {
  name: 'La Plage Digitale',
  timezone: 'Europe/Paris',
  geometry: { type: 'point', coordinates: [7.7551093, 48.5765594] },
  addressComponents: { street: '13 rue Jacques Peirotes', city: 'Strasbourg', postalCode: '67000', country: 'FR' },
};

// Texte de référence de l'atelier (repris du 16 juillet), réutilisable dans buildEventContent.
const REFERENCE_DESCRIPTION =
  'Un atelier de 3h pour explorer le consentement dans un cadre bienveillant et participatif. ' +
  'Apprends à dire non, à poser tes limites et à construire des relations plus authentiques. ' +
  '15 places, prix libre — tu donnes ce que tu veux/peux.';

// Les 6 nouvelles dates programmées (source : Notion "Dates d'ateliers", vue Programmées).
// Offset horaire : CEST (+02:00) jusqu'au 25 oct. 2026, CET (+01:00) ensuite.
const ATELIERS = [
  { key: '19-septembre-2026', dateLabel: 'samedi 19 septembre 2026 à 14h',  start: '2026-09-19T14:00:00+02:00', end: '2026-09-19T17:00:00+02:00', facilitators: ['Dilara Simsek', 'Thomas Jeanneau'] },
  { key: '6-octobre-2026',    dateLabel: 'mardi 6 octobre 2026 à 18h30',    start: '2026-10-06T18:30:00+02:00', end: '2026-10-06T21:30:00+02:00', facilitators: ['Mathilde Brière', 'Thomas Jeanneau'] },
  { key: '17-octobre-2026',   dateLabel: 'samedi 17 octobre 2026 à 14h',    start: '2026-10-17T14:00:00+02:00', end: '2026-10-17T17:00:00+02:00', facilitators: ['Morgane', 'Thomas Jeanneau'] },
  { key: '28-novembre-2026',  dateLabel: 'samedi 28 novembre 2026 à 14h',   start: '2026-11-28T14:00:00+01:00', end: '2026-11-28T17:00:00+01:00', facilitators: ['Morgane', 'Mathilde Brière'] },
  { key: '12-decembre-2026',  dateLabel: 'samedi 12 décembre 2026 à 14h',   start: '2026-12-12T14:00:00+01:00', end: '2026-12-12T17:00:00+01:00', facilitators: ['Dilara Simsek', 'Mathilde Brière'] },
  { key: '17-decembre-2026',  dateLabel: 'jeudi 17 décembre 2026 à 18h30',  start: '2026-12-17T18:30:00+01:00', end: '2026-12-17T21:30:00+01:00', facilitators: ['Morgane', 'Thomas Jeanneau'] },
];

// Formulaire d'inscription — les 6 questions reprises du 16 juillet.
const REGISTRATION_FIELDS = [
  { name: 'Email', type: 'text', optional: false, visibility: 'visible', status: 'enabled', rule: { type: 'email' } },
  { name: "Numéro de téléphone (pour te prévenir en cas d'imprévu ou d'information importante avant l'atelier)", type: 'text', optional: false, visibility: 'visible', status: 'enabled', rule: { type: 'phone' } },
  { name: "Comment j'ai entendu parler de cet événement", type: 'text', optional: false, visibility: 'visible', status: 'enabled' },
  { name: "Qu'est-ce qui me motive, me donne envie de participer ?", type: 'text', optional: false, visibility: 'visible', status: 'enabled' },
  { name: "J'autorise l'association à me photographier/filmer lors de l'événement et à utiliser ces images sur ses supports de communication. Consentement retirable à tout moment : mercipourtonnon@gmail.com", type: 'choice', optional: false, visibility: 'visible', status: 'enabled', options: ['Oui', 'Non'] },
  { name: 'Veux-tu nous laisser un petit mot ?', type: 'text', optional: true, visibility: 'visible', status: 'enabled' },
];

// Joint une liste de noms en français : ["A"] → "A" ; ["A","B"] → "A et B" ;
// ["A","B","C"] → "A, B et C".
function joinNames(names) {
  if (names.length <= 1) return names[0] || '';
  return `${names.slice(0, -1).join(', ')} et ${names[names.length - 1]}`;
}

// Compose le contenu public d'un atelier (titre + descriptions), en créditant
// les facilitateur·ices dans la description longue.
// Renvoie { name, shortDescription, description }.
function buildEventContent(atelier) {
  const name = `Atelier de consentement - Niveau 1 - ${atelier.dateLabel}`;
  const shortDescription = 'Atelier de consentement Niveau 1 — 3h, prix libre, 15 places.';
  const credit = `Facilité par ${joinNames(atelier.facilitators)}.`;
  const description = `${REFERENCE_DESCRIPTION}\n\n${credit}`;
  return { name, shortDescription, description };
}

// ── HTTP helper ──────────────────────────────────────────────────────────────
function loadApiKey() {
  const env = readFileSync(join(__dirname, '..', '.env'), 'utf8');
  const line = env.split('\n').find((l) => l.startsWith('HELLOASSO_BILLETERIE_PLUS_API_KEY='));
  if (!line) throw new Error('HELLOASSO_BILLETERIE_PLUS_API_KEY manquante dans .env');
  return line.slice(line.indexOf('=') + 1).trim();
}
const API_KEY = loadApiKey();

async function api(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'X-API-KEY': API_KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} → HTTP ${res.status}: ${text}`);
  return data;
}

// ── Création d'un atelier ────────────────────────────────────────────────────
async function createOne(atelier, { dryRun }) {
  const slug = `atelier-de-consentement-${atelier.key}`;
  const content = buildEventContent(atelier);

  const eventPayload = {
    ...content,
    slug,
    type: 'workshop',
    timezone: 'Europe/Paris',
    status: 'draft',
    feesMode: 'client',
    maxCount: CAPACITY,
    place: PLACE,
  };

  if (dryRun) {
    console.log(`\n── [DRY-RUN] ${slug} ─────────────────────────────`);
    console.log('event     :', JSON.stringify(eventPayload, null, 2));
    console.log('sellingItem: { name:"Prix libre", steps:[{basePrice:0}], status:"enabled", maxCount:15 } sur shop principal');
    console.log(`form       : "Formulaire d'inscription" (${REGISTRATION_FIELDS.length} questions)`);
    console.log(`⚠️ date à saisir à la main : ${atelier.start} → ${atelier.end}`);
    return { slug, status: 'dry-run' };
  }

  // Idempotence : ne pas recréer un slug déjà présent.
  const existing = await api('GET', `/events?limit=100`);
  if ((existing.data || []).some((e) => e.slug === slug)) {
    console.log(`⏭️  ${slug} existe déjà — ignoré`);
    return { slug, status: 'skipped' };
  }

  // 1) L'événement (+ shop principal auto-créé).
  const event = await api('POST', '/events', eventPayload);

  // 2) Tarif "Prix libre" (basePrice 0) sur le shop principal.
  const shops = await api('GET', `/events/${event._id}/shops`);
  const mainShop = (shops.data || []).find((s) => s.isMain) || (shops.data || [])[0];
  await api('POST', `/events/${event._id}/sellingItems`, {
    name: 'Prix libre',
    status: 'enabled',
    maxCount: CAPACITY,
    shopIds: [mainShop._id],
    steps: [{ basePrice: 0, title: 'Prix libre' }],
  });

  // 3) Formulaire d'inscription, rattaché à l'événement.
  const form = await api('POST', `/events/${event._id}/forms`, {
    name: "Formulaire d'inscription",
    displayName: 'Inscription',
    fields: REGISTRATION_FIELDS,
  });
  await api('PATCH', `/events/${event._id}`, { formId: form._id });

  console.log(`✅ ${slug} créé (draft) — id ${event._id}`);
  return { slug, status: 'created', id: event._id };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(dryRun ? '🌵 DRY-RUN — aucun appel d\'écriture' : '🖊️  Création des événements (draft)…');

  const results = [];
  for (const atelier of ATELIERS) {
    try {
      results.push(await createOne(atelier, { dryRun }));
    } catch (err) {
      console.error(`❌ ${atelier.key}: ${err.message}`);
      results.push({ slug: atelier.key, status: 'error', error: err.message });
    }
  }

  console.log('\n── Récapitulatif ──────────────────────────────────');
  for (const r of results) console.log(`${r.status.padEnd(8)} ${r.slug}${r.id ? '  ' + r.id : ''}`);
  console.log('\n⚠️  Rappel : saisir les dates/heures dans le dashboard Billetterie Plus (l\'API ne les pose pas).');
}

main().catch((e) => { console.error(e); process.exit(1); });
