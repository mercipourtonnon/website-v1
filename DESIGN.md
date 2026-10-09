# mercipourtonnon — Design System

> The design system of mercipourtonnon, as it actually ships. Use these tokens and rules as written — they are this app’s, not your defaults. Everything listed is what the running app emits; anything declared and discarded is named at the end.

## Principles

- Authenticité — design sincère et transparent, pas de surenchère visuelle ni de promesses exagérées.
- Respect et accessibilité — hiérarchie claire, contrastes élevés, espaces généreux pour tou·tes.
- Dialogue et ouverture — un ton chaleureux qui invite à l'échange plutôt qu'à la performance.
- Simplicité engagée — épuré sans être froid, chaleureux sans être infantilisant ; associatif assumé, loin des codes startup et corporate.

## Logo

- Mark: `/logo.svg` (accessible name: "Merci pour ton non")
- Never: Ne jamais recolorer le logo : chaque mot garde sa couleur (pourpre merci, orange pour, mauve ton, cyan non).
- Never: Ne jamais l'étirer, le tourner ou lui ajouter des effets.
- Never: Le poser uniquement sur fond blanc, fond coloré clair ou fond sombre.

## Voice

- Address the reader as: tu
- Personality: Bienveillant mais pas moralisateur., Pédagogue mais pas condescendant., Engagé mais pas militant., Accessible mais pas simpliste.
- Prefer: Tutoyer systématiquement et utiliser l'écriture inclusive (·e, ·es).
- Prefer: Vocabulaire : consentement, limites, authenticité, écoute, co-construction ; poser ses limites, accueillir le non, explorer, construire ensemble.
- Prefer: Formuler comme une invitation : « Rejoins-nous pour explorer… », « Cet atelier t'invite à… », « Ensemble, on construit… ».
- Prefer: Privilégier la clarté à l'effet de style.
- Avoid: Jargon corporate : solution, optimisation, performance, ROI, levier.
- Avoid: Ton marketing : révolutionnaire, unique, certifiant, garantie, « maximisez votre potentiel », « devenez un expert ».
- Avoid: Vocabulaire thérapeutique : guérison, trauma, diagnostic.
- Avoid: Vouvoiement, ton moralisateur, promesses de résultat.

## Colour tokens

| Token | Value | Usage | Pairs with |
| --- | --- | --- | --- |
| background | oklch(0.985 0 0) |  |  |
| background-subtle | oklch(0.965 0 0) |  |  |
| background-raised | oklch(0.995 0 0) |  |  |
| background-overlay | oklch(0.995 0 0) |  |  |
| background-inset | oklch(0.952 0 0) |  |  |
| foreground | oklch(0.14 0 0) |  |  |
| foreground-muted | oklch(0.445 0 0) |  |  |
| foreground-subtle | oklch(0.54 0 0) |  |  |
| foreground-disabled | oklch(0.71 0 0) |  |  |
| foreground-inverse | oklch(0.985 0 0) |  |  |
| border | oklch(0.92 0 0) |  |  |
| ring | oklch(0.205 0 0) |  |  |
| primary | oklch(0.205 0 0) |  |  |
| primary-hover | oklch(0.272 0 0) |  |  |
| primary-active | oklch(0.14 0 0) |  |  |
| primary-foreground | oklch(0.985 0 0) |  |  |
| primary-subtle | oklch(0.965 0 0) |  |  |
| primary-subtle-foreground | oklch(0.205 0 0) |  |  |
| success | oklch(0.45 0 0) |  |  |
| warning | oklch(0.72 0 0) |  |  |
| error | #c13520 |  |  |
| info | #398ad6 |  |  |
| pourpre | #F5004F | Émotion, authenticité, découverte. Témoignages, sections émotionnelles. Jamais en fond de grande section : utiliser pourpre-light. | pourpre-light |
| pourpre-hover | #D10042 |  |  |
| pourpre-light | #FFF0F5 |  |  |
| pourpre-lighter | #FFE0EA |  |  |
| orange | #FFAF00 | Action, engagement, chaleur. Boutons d'inscription, CTAs principaux, liens actifs — en fond, toujours avec un texte bleu-fonce (8,8:1), jamais blanc (1,8:1). Jamais pour une action contradictoire (annuler ET confirmer). | orange-light |
| orange-hover | #E69E00 |  |  |
| orange-light | #FFF8E6 |  |  |
| orange-lighter | #FFF0D1 |  |  |
| orange-ink | #8F5200 | Version texte de l'orange : petits libellés, liens et sur-titres orange sur fond blanc ou clair. L'orange vif n'est jamais du texte (1,8:1). | orange-light |
| orange-vif | #FF7000 | Variante chaude, en opposition au violet. Accent ponctuel uniquement. | orange-vif-light |
| orange-vif-light | #FFF4E6 |  |  |
| mauve | #7B01FE | Exploration, apprentissage, créativité. Sections pédagogiques, titres secondaires, invitations à la réflexion. | mauve-light |
| mauve-hover | #6A01DB |  |  |
| mauve-light | #F3E6FF |  |  |
| mauve-lighter | #E6D1FF |  |  |
| cyan | #12A19D | Validation, calme, ressources. Confirmations, ressources, sections factuelles. Pas en petit texte sur fond blanc (contraste) : utiliser cyan-ink. | cyan-light |
| cyan-hover | #0F8A87 |  |  |
| cyan-light | #E6F9F8 |  |  |
| cyan-lighter | #D1F2F0 |  |  |
| cyan-ink | #0B6E6B | Version texte du cyan : libellés, liens et titres de cartes cyan sur fond blanc ou cyan-light. | cyan-light |
| bleu-fonce | #130077 | Texte principal et titres ; remplace le noir partout. | pourpre-light |
| bleu-fonce-light | #E6E0FF |  |  |
| bleu-fonce-50 | #130077 |  |  |
| bleu-fonce-70 | #130077 |  |  |

## Type scale

Each step emits `--text-{step}` and a matching `text-{step}` utility that carries its leading, weight and tracking.

| Step | Utility | Size | Leading | Weight | Tracking | Face |
| --- | --- | --- | --- | --- | --- | --- |
| display | text-display | 4.5rem | 0.95 |  |  | Bely Display, Archivo Black, cursive |
| h1 | text-h1 | 3.25rem | 1 |  |  | Bely Display, Archivo Black, cursive |
| h2 | text-h2 | 2.375rem | 1.1 |  |  | Bely Display, Archivo Black, cursive |
| h3 | text-h3 | 1.75rem | 1.15 |  |  | Bely Display, Archivo Black, cursive |
| h4 | text-h4 | 1.375rem | 1.25 |  |  | Bely Display, Archivo Black, cursive |
| lead | text-lead | 1.25rem | 1.6 | 400 |  | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| body | text-body | 1.0625rem | 1.7 | 400 |  | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| bodySmall | text-bodySmall | 0.9375rem | 1.6 | 400 |  | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| caption | text-caption | 0.875rem | 1.5 | 400 |  | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| overline | text-overline | 0.8125rem | 1.4 | 800 | 0.06em | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |

## Spacing tokens

| Token | Value |
| --- | --- |
| section | 6rem |
| section-sm | 4rem |
| block | 3rem |

## Radius tokens

| Token | Value |
| --- | --- |
| none | 0px |
| sm | 2px |
| base | 4px |
| md | 6px |
| lg | 8px |
| xl | 12px |
| full | 9999px |
| control | 0.75rem |
| card | 1.5rem |
| media | 2rem |
| pill | 9999px |

## Breakpoint tokens

| Token | Value |
| --- | --- |
| sm | 40rem |
| md | 48rem |
| lg | 64rem |
| xl | 80rem |
| 2xl | 96rem |

## Font families

| Token | Stack |
| --- | --- |
| sans | IBM Plex Sans Variable, IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif |
| mono | JetBrains Mono Variable, JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace |
| title | Bely Display, Archivo Black, cursive |
| body | Neue Machina, Space Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |

## Duration tokens

| Token | Value |
| --- | --- |
| fast | 120ms |
| base | 180ms |
| slow | 260ms |

## Motion

| Curve | Value |
| --- | --- |
| default | cubic-bezier(0.2, 0, 0, 1) |
| enter | cubic-bezier(0, 0, 0.2, 1) |
| exit | cubic-bezier(0.4, 0, 1, 1) |

## Shadow

The elevation this app ships. `inherited` steps come from the platform; `declared` ones were chosen in this config.

| Step | Value | Provenance |
| --- | --- | --- |
| sm | 0 1px 2px rgb(0 0 0 / 0.08) | inherited |
| md | 0 4px 12px rgb(0 0 0 / 0.06) | inherited |
| lg | 0 8px 24px rgb(0 0 0 / 0.12) | inherited |
| card | 0 1px 2px rgb(19 0 119 / 0.04), 0 12px 32px -12px rgb(19 0 119 / 0.14) | declared |
| raised | 0 2px 4px rgb(19 0 119 / 0.05), 0 24px 48px -16px rgb(19 0 119 / 0.22) | declared |

## Imagery

- Icons: lucide — every icon in the app comes from this set, and no other.
- Des photos de vrais ateliers, jamais d'illustrations génériques ; mieux vaut attendre une vraie photo qu'un visuel qui ne nous représente pas.
- Les couleurs de marque sont réservées aux éléments stratégiques : logo, titres, boutons, icônes.
- Hiérarchie : icônes colorées pour les concepts et actions, photos authentiques pour les personnes.
- Photography: Tout visuel est consenti : accord explicite avant d'utiliser une photo de personne identifiable.
- Photography: Moments spontanés ; mains, gestes, interactions non verbales, expressions sincères.
- Photography: Lumière naturelle, tons chauds ; proximité, cercles, petits groupes.
- Photography: Représentation variée des âges, origines, corps et genres.
- Photography: À éviter : stock lisse, esthétique corporate, postures figées, groupes homogènes, éclairage dur.
- Pattern: Icônes Lucide (trait 2px, 16/24/32–48px) dans les 4 couleurs de marque, pour l'humain et les émotions (heart, ear, shield, hands) — jamais d'emojis, pas de look SaaS.
- Pattern: Cercles qui se chevauchent (rencontres, co-construction) en fond subtil.
- Pattern: Lignes ondulées (fluidité, respect des limites) en filigrane très léger.
- Pattern: Formes géométriques colorées et dégradés clairs (pourpre-light, orange-light, mauve-light, cyan-light) comme fonds ; jamais les teintes vives en fond de section.
- Pattern: Photos en cadre arrondi (rounded-media) avec un cercle de couleur de marque décalé derrière ; jamais en pleine largeur façon stock, jamais de flou ni de blob animé.
- Pattern: Une couleur d'accent par section, choisie selon son rôle (colorRoles) ; fonds de section en blanc ou en une seule teinte -light.

## Catalogue

Every component type this build ships. A row carrying a reason is NOT drawn — write it and it renders nothing.

| Type | Category | Variants | Not drawn because |
| --- | --- | --- | --- |
| alert | interactive | default, destructive, warning, info, success |  |
| badge | interactive | default, secondary, destructive, outline |  |
| button | interactive | default, destructive, outline, secondary, ghost, link, fab |  |
| button-group | interactive |  |  |
| link | interactive |  |  |
| theme-toggle | interactive |  |  |
| checkbox | form-controls |  |  |
| code-editor | form-controls |  |  |
| date-picker | form-controls |  |  |
| date-range-picker | form-controls |  |  |
| field | form-controls |  |  |
| input | form-controls |  |  |
| input-group | form-controls |  |  |
| radio-group | form-controls |  |  |
| rating | form-controls |  | rating ships in this build and has no specimen in the catalogue yet, so there is nothing here to draw it from. |
| record-picker | form-controls |  | Searches a table of yours and links the row it finds. This page is bound to no table — and binding it to one of yours is what the confidentiality bound forbids — so there are no candidates for it to offer. Its states, its paging and its create path are drawn as authored option sections on its own page. |
| rich-text-editor | form-controls |  |  |
| select | form-controls |  |  |
| signature-pad | form-controls |  | A well to sign in, or a name to type, under the statement being agreed to. Pressing Sign uploads the mark and writes it onto the record the page is bound to, so the pad is a write path of its own, and a read-only console may carry none. Once signed it reads "Signed by … on …" from that record. See it on a data-bound page. |
| slider | form-controls |  |  |
| switch | form-controls |  |  |
| textarea | form-controls |  |  |
| toggle | form-controls |  |  |
| toggle-group | form-controls |  |  |
| calendar | data |  |  |
| chart | data |  |  |
| filter-bar | data |  |  |
| form | data |  | Renders a live submit control — over the fields you declare on it, or writing a record back to the table it binds; a preview frame may carry no write path (ADR-022 A3 clause 2). |
| gallery | data |  |  |
| graph | data |  | Places the nodes of a bound graph into ordered columns and draws the edges between them. The only graph this instance can read is your own access map, and binding a preview frame to it is what the confidentiality bound forbids; the platform’s specimen fixture publishes rows rather than nodes and edges, so there is no path for it to lay out here. |
| kanban | data |  |  |
| kpi | data |  |  |
| list | data |  |  |
| map | data |  | Places one pin per record at its location, with a list of the same pins a keyboard can use. It needs a geolocation field on a table of yours, and this console reads none of yours; the platform’s specimen rows carry no location, so there is nothing to pin. See it on a data-bound page. |
| matrix | data |  | Crosses two sets of nodes from a bound graph and marks each intersection an edge connects, so an absent pair stays a visible empty cell. It reads the same envelope the map next door does and meets the same wall: your own access map is the one graph this instance holds, and a fixture of flat rows gives it no two sets to cross. |
| table | data |  |  |
| tree | data |  | Nests the records of one table under their parents and opens them branch by branch. The hierarchy lives in a relationship that points back at the same table, and the platform’s specimen rows are flat, with no parent to nest under; your own tables are what this console may not read. See it on a data-bound page. |
| card | layout |  |  |
| container | layout |  |  |
| flex | layout |  |  |
| grid | layout |  |  |
| sidebar | layout |  |  |
| split-pane | layout |  |  |
| audio | content |  |  |
| code | content |  |  |
| file-preview | content |  | Shows a stored file inline: an image with zoom, a PDF in its viewer, anything else as a download. Every face is drawn from a file signed for the reader, and the only files this instance holds are in your buckets, which this console may not read. See it on a data-bound page. |
| icon | content |  |  |
| iframe | content |  | Not drawn here, and this is a refusal rather than a gap: this console renders every specimen flat, in one document, because a design system inside a nested scrolling document is not one a reader can read. Drawing an iframe specimen would put the frame back. Look at the page you embedded it on. |
| image | content | default, avatar, thumbnail, hero |  |
| kbd | content |  |  |
| qr-code | content |  |  |
| search-input | content |  |  |
| text | content |  |  |
| toc | content |  |  |
| video | content |  |  |
| accordion | display |  |  |
| avatar | display |  |  |
| description-list | display |  |  |
| empty-state | display |  |  |
| list-item | display |  |  |
| marquee | display |  |  |
| record-field | display |  | Draws ONE field of the record the page it sits on is bound to. This page is bound to no record — and binding it to one of yours is what the confidentiality bound forbids — so there is nothing for it to read. The field CONTROLS it draws from are in the composed form below. |
| scroll-area | display |  |  |
| stepper | display |  |  |
| swatch | display |  |  |
| tabs | display |  |  |
| timeline | display |  |  |
| breadcrumb | navigation |  |  |
| command-palette | navigation |  |  |
| context-menu | navigation |  |  |
| dropdown-menu | navigation |  |  |
| menubar | navigation |  |  |
| navigation-menu | navigation |  |  |
| pagination | navigation |  |  |
| alert-dialog | overlays |  | Opens as a blocking confirmation that holds focus until it is answered, so there is nothing of it to draw until a reader has already been interrupted. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| dialog | overlays |  | Opens as a modal panel over the whole page and makes the rest of the document inert while it is open, so it has no resting appearance to document. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| drawer | overlays |  | Slides in from an edge and covers the page for as long as it is open, so it would cover the kit rather than sit in it. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| hover-card | overlays |  |  |
| popover | overlays |  |  |
| toast | overlays |  |  |
| tooltip | overlays |  |  |
| progress | feedback | bar, circle, steps |  |
| skeleton | feedback | text, circular, rectangular |  |
| spinner | feedback |  |  |
| divider | structural |  |  |
| spacer | structural |  |  |
| comments | specialty |  | Hydrates a comment composer — a form with a live submit control that posts a comment onto a record. A read-only console may carry no write path, so it is named here rather than drawn. It renders on your own pages. |
| field-specimen | specialty |  | Has no appearance of its own: it draws whatever control the fieldType you name gets, so a card here would document one field type instead of this component. The field types are all drawn, in every state, in the field catalogue. |
| file-upload | specialty |  |  |
| language-switcher | specialty |  | Draws the languages an app declares in languages[]. This console’s own surface app declares none — it carries your design system and deliberately nothing else — so the component has no list to draw. It renders on your pages. |
| number-input | specialty |  |  |
| preview | specialty |  |  |
| reorderable-list | specialty |  |  |
| specimen | specialty |  | A frame around a drawn component and the config that produced it. It refuses to hold another one — each level would print the level below, with no bottom — so it cannot be drawn inside this page. Every card here is one. |
| time-picker | specialty |  |  |
| ai-chat | ai |  |  |

## Values kept outside the token tree

These are applied by the app but have no faithful DTCG form, so they are carried verbatim.

| Declaration | Value |
| --- | --- |
| design.typeScale.overline.letterSpacing | 0.06em |
| design.typeScale.families.title.transform | lowercase |
| design.typeScale.families.title.letterSpacing | 0.05em |
| design.typeScale.families.title.url | /assets/site.css |
| design.elevation.card | 0 1px 2px rgb(19 0 119 / 0.04), 0 12px 32px -12px rgb(19 0 119 / 0.14) |
| design.elevation.raised | 0 2px 4px rgb(19 0 119 / 0.05), 0 24px 48px -16px rgb(19 0 119 / 0.22) |
