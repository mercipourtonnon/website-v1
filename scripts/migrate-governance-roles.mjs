#!/usr/bin/env node
// Moves existing accounts and rows to the governance roles (2026-10):
//
//   role coordination  → role gardien   (Cercle Gardien)
//   role facilitateur  → role coeur     (Cercle Cœur) + « facilitation » ticked
//                        on their members row and the group:facilitation membership
//   role member        → unchanged      (Cercle Abeilles)
//
// and rewrites the technical editor_role column of rows created before:
//   events, news                                 coordination → coeur
//   members, workshop_proposals, event_participations  coordination → gardien
//
// Run it right AFTER deploying the new config: the roles `coeur` and `gardien`
// must exist for set-role to accept them, and until it runs, former
// coordination and facilitateur accounts match no grant.
//
// Usage (an admin account, never a gardien: set-role needs the built-in plane):
//   BASE_URL=https://mercipourtonnon.fr ADMIN_EMAIL=… ADMIN_PASSWORD=… \
//     node scripts/migrate-governance-roles.mjs --dry-run   # prints, writes nothing
//   … node scripts/migrate-governance-roles.mjs             # applies
//
// Idempotent: a second run finds nothing left to change.

const DRY = process.argv.includes('--dry-run');
const BASE = String(process.env.BASE_URL || '').replace(/\/+$/, '');
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!BASE || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('BASE_URL, ADMIN_EMAIL et ADMIN_PASSWORD sont requis.');
  process.exit(1);
}

const ROLE_MAP = { coordination: 'gardien', facilitateur: 'coeur' };
const EDITOR_ROLE = { events: 'coeur', news: 'coeur', members: 'gardien', workshop_proposals: 'gardien', event_participations: 'gardien' };

let cookie = '';
async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Origin: BASE, ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${text.slice(0, 200)}`);
  return data;
}
const write = (method, path, body) => (DRY ? Promise.resolve(null) : api(method, path, body));

async function allRecords(table) {
  const out = [];
  for (let page = 1; ; page++) {
    const data = await api('GET', `/api/tables/${table}/records?limit=100&page=${page}`);
    out.push(...data.records);
    if (!data.pagination?.hasNextPage) return out;
  }
}

await api('POST', '/api/auth/sign-in/email', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
console.log(DRY ? '— essai à blanc, rien n’est écrit —' : '— migration —');

// 1. Accounts.
const users = (await api('GET', '/api/auth/admin/list-users?limit=1000')).users;
const members = await allRecords('members');
const teams = (await api('GET', '/api/auth/organization/list-teams')).teams;
const facilitation = teams.find((t) => t.name === 'facilitation');
if (!facilitation) throw new Error('Groupe « facilitation » introuvable : la nouvelle config est-elle déployée ?');

for (const user of users) {
  const target = ROLE_MAP[user.role];
  if (!target) continue;
  console.log(`${user.email} : ${user.role} → ${target}`);
  await write('POST', '/api/auth/admin/set-role', { userId: user.id, role: target });
  if (user.role !== 'facilitateur') continue;

  const row = members.find((m) => String(m.fields.account?.id ?? m.fields.account) === user.id);
  const roles = new Set(row?.fields.volunteer_roles ?? []);
  if (row && !roles.has('facilitation')) {
    console.log(`  fiche ${row.id} : + facilitation`);
    await write('PATCH', `/api/tables/members/records/${row.id}`, { fields: { volunteer_roles: [...roles, 'facilitation'] } });
  } else if (!row) {
    console.log('  pas de fiche bénévole : groupe ajouté sans case cochée');
  }
  try {
    await write('POST', '/api/auth/organization/add-team-member', {
      teamId: facilitation.id,
      userId: user.id,
      organizationId: facilitation.organizationId,
    });
  } catch (error) {
    if (!/already/i.test(String(error))) throw error;
  }
}

// 2. editor_role on rows created before.
for (const [table, value] of Object.entries(EDITOR_ROLE)) {
  const stale = (await allRecords(table)).filter((r) => r.fields.editor_role !== value);
  if (stale.length) console.log(`${table} : ${stale.length} ligne(s) editor_role → ${value}`);
  for (const r of stale) await write('PATCH', `/api/tables/${table}/records/${r.id}`, { fields: { editor_role: value } });
}
console.log('Terminé.');
