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

The Light column is the default scheme; the Dark column is what the app paints under `.dark`.

| Token | Light | Dark | Usage | Pairs with |
| --- | --- | --- | --- | --- |
| background | oklch(1 0 0) | oklch(0.145 0 0) |  |  |
| foreground | oklch(0.145 0 0) | oklch(0.985 0 0) |  |  |
| card | oklch(1 0 0) | oklch(0.205 0 0) |  |  |
| card-foreground | oklch(0.145 0 0) | oklch(0.985 0 0) |  |  |
| popover | oklch(1 0 0) | oklch(0.205 0 0) |  |  |
| popover-foreground | oklch(0.145 0 0) | oklch(0.985 0 0) |  |  |
| primary | #130077 | #130077 |  |  |
| primary-foreground | #FFFFFF | #FFFFFF |  |  |
| secondary | oklch(0.97 0 0) | oklch(0.269 0 0) |  |  |
| secondary-foreground | oklch(0.205 0 0) | oklch(0.985 0 0) |  |  |
| muted | oklch(0.97 0 0) | oklch(0.269 0 0) |  |  |
| muted-foreground | oklch(0.52 0 0) | oklch(0.708 0 0) |  |  |
| accent | oklch(0.97 0 0) | oklch(0.269 0 0) |  |  |
| accent-foreground | oklch(0.205 0 0) | oklch(0.985 0 0) |  |  |
| destructive | oklch(0.5 0.245 27.325) | oklch(0.704 0.191 22.216) |  |  |
| border | oklch(0.922 0 0) | oklch(1 0 0 / 0.1) |  |  |
| input | oklch(0.65 0 0) | oklch(1 0 0 / 0.4) |  |  |
| ring | oklch(0.708 0 0) | oklch(0.556 0 0) |  |  |
| pourpre | #F5004F | #F5004F | Émotion, authenticité, découverte. Témoignages, sections émotionnelles. Jamais en fond de grande section : utiliser pourpre-light. | pourpre-light |
| pourpre-hover | #D10042 | #D10042 |  |  |
| pourpre-light | #FFF0F5 | #FFF0F5 |  |  |
| pourpre-lighter | #FFE0EA | #FFE0EA |  |  |
| orange | #FFAF00 | #FFAF00 | Action, engagement, chaleur. Boutons d'inscription, CTAs principaux, liens actifs — en fond, toujours avec un texte bleu-fonce (8,8:1), jamais blanc (1,8:1). Jamais pour une action contradictoire (annuler ET confirmer). | orange-light |
| orange-hover | #E69E00 | #E69E00 |  |  |
| orange-light | #FFF8E6 | #FFF8E6 |  |  |
| orange-lighter | #FFF0D1 | #FFF0D1 |  |  |
| orange-ink | #8F5200 | #8F5200 | Version texte de l'orange : petits libellés, liens et sur-titres orange sur fond blanc ou clair. L'orange vif n'est jamais du texte (1,8:1). | orange-light |
| orange-vif | #FF7000 | #FF7000 | Variante chaude, en opposition au violet. Accent ponctuel uniquement. | orange-vif-light |
| orange-vif-light | #FFF4E6 | #FFF4E6 |  |  |
| mauve | #7B01FE | #7B01FE | Exploration, apprentissage, créativité. Sections pédagogiques, titres secondaires, invitations à la réflexion. | mauve-light |
| mauve-hover | #6A01DB | #6A01DB |  |  |
| mauve-light | #F3E6FF | #F3E6FF |  |  |
| mauve-lighter | #E6D1FF | #E6D1FF |  |  |
| cyan | #12A19D | #12A19D | Validation, calme, ressources. Confirmations, ressources, sections factuelles. Pas en petit texte sur fond blanc (contraste) : utiliser cyan-ink. | cyan-light |
| cyan-hover | #0F8A87 | #0F8A87 |  |  |
| cyan-light | #E6F9F8 | #E6F9F8 |  |  |
| cyan-lighter | #D1F2F0 | #D1F2F0 |  |  |
| cyan-ink | #0B6E6B | #0B6E6B | Version texte du cyan : libellés, liens et titres de cartes cyan sur fond blanc ou cyan-light. | cyan-light |
| bleu-fonce | #130077 | #130077 | Texte principal et titres ; remplace le noir partout. | pourpre-light |
| bleu-fonce-light | #E6E0FF | #E6E0FF |  |  |
| bleu-fonce-50 | #130077 | #130077 |  |  |
| bleu-fonce-70 | #130077 | #130077 |  |  |
| primary-hover | #24109A | #24109A |  |  |
| primary-active | #0C004F | #0C004F |  |  |
| primary-fg | #FFFFFF | #FFFFFF |  |  |
| primary-subtle | #E6E0FF | #E6E0FF |  |  |
| primary-subtle-fg | #130077 | #130077 |  |  |
| warning | #8F5200 | #8F5200 |  |  |
| warning-fg | #130077 | #130077 |  |  |
| warning-foreground | #FFFFFF | #FFFFFF |  |  |
| warning-bg | #FFF8E6 | #FFF8E6 |  |  |
| warning-border | #FFAF00 | #FFAF00 |  |  |
| success | #0B6E6B | #0B6E6B |  |  |
| success-fg | #130077 | #130077 |  |  |
| success-foreground | #FFFFFF | #FFFFFF |  |  |
| success-bg | #E6F9F8 | #E6F9F8 |  |  |
| success-border | #12A19D | #12A19D |  |  |

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
| band | 6rem |
| band-sm | 4rem |
| block | 3rem |

## Radius tokens

| Token | Value |
| --- | --- |
| none | 0px |
| sm | 0.375rem |
| base | 4px |
| md | 0.5rem |
| lg | 0.625rem |
| xl | 0.875rem |
| 2xl | 1.125rem |
| 3xl | 1.375rem |
| 4xl | 1.625rem |
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
| sans | Geist Variable, sans-serif |
| mono | Geist Mono Variable, monospace |
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
| badge | interactive | default, secondary, destructive, outline, ghost, link, success, warning, info |  |
| button | interactive | default, destructive, outline, secondary, ghost, link, fab |  |
| button-group | interactive |  |  |
| link | interactive |  |  |
| theme-toggle | interactive |  |  |
| calendar | form-controls |  |  |
| checkbox | form-controls |  |  |
| code-editor | form-controls |  |  |
| combobox | form-controls |  |  |
| date-picker | form-controls |  |  |
| date-range-picker | form-controls |  |  |
| field | form-controls |  |  |
| input | form-controls |  |  |
| input-group | form-controls |  |  |
| input-otp | form-controls |  |  |
| label | form-controls |  |  |
| native-select | form-controls |  |  |
| radio-group | form-controls |  |  |
| rating | form-controls |  |  |
| record-picker | form-controls |  | Searches a table of yours and links the row it finds. This page is bound to no table — and binding it to one of yours is what the confidentiality bound forbids — so there are no candidates for it to offer. Its states, its paging and its create path are drawn as authored option sections on its own page. |
| rich-text-editor | form-controls |  |  |
| select | form-controls |  |  |
| signature-pad | form-controls |  | A well to sign in, or a name to type, under the statement being agreed to. Pressing Sign uploads the mark and writes it onto the record the page is bound to, so the pad is a write path of its own, and a read-only console may carry none. Once signed it reads "Signed by … on …" from that record. See it on a data-bound page. |
| slider | form-controls |  |  |
| switch | form-controls |  |  |
| textarea | form-controls |  |  |
| toggle | form-controls | default, outline |  |
| toggle-group | form-controls | default, outline |  |
| carousel | data |  |  |
| chart | data |  |  |
| event-calendar | data |  |  |
| filter-bar | data |  |  |
| form | data |  | Renders a live submit control — over the fields you declare on it, or writing a record back to the table it binds; a preview frame may carry no write path (ADR-022 A3 clause 2). |
| gallery | data |  |  |
| graph | data |  |  |
| kanban | data |  |  |
| kpi | data |  |  |
| list | data |  |  |
| map | data |  |  |
| matrix | data |  |  |
| questionnaire | data |  | Submits each answer through the form it names; a preview frame may carry no write path (ADR-022 A3 clause 2). |
| table | data |  |  |
| tree | data |  |  |
| aspect-ratio | layout |  |  |
| card | layout |  |  |
| container | layout |  |  |
| flex | layout |  |  |
| grid | layout |  |  |
| message-scroller | layout |  |  |
| resizable | layout |  |  |
| sidebar | layout |  |  |
| attachment | content |  |  |
| audio | content |  |  |
| code | content | default, destructive |  |
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
| bubble | display |  |  |
| collapsible | display |  |  |
| description-list | display |  |  |
| empty | display |  |  |
| item | display | default, outline, muted |  |
| marker | display | default, border, separator |  |
| marquee | display |  |  |
| message | display |  |  |
| record-field | display |  | Draws ONE field of the record the page it sits on is bound to. This page is bound to no record — and binding it to one of yours is what the confidentiality bound forbids — so there is nothing for it to read. The field CONTROLS it draws from are in the composed form below. |
| scroll-area | display |  |  |
| stepper | display |  |  |
| swatch | display |  |  |
| tabs | display | default, line |  |
| timeline | display |  |  |
| breadcrumb | navigation |  |  |
| command | navigation |  |  |
| context-menu | navigation |  |  |
| dropdown-menu | navigation |  |  |
| menubar | navigation |  |  |
| navigation-menu | navigation |  |  |
| pagination | navigation |  |  |
| alert-dialog | overlays |  | Opens as a blocking confirmation that holds focus until it is answered, so there is nothing of it to draw until a reader has already been interrupted. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| dialog | overlays |  | Opens as a modal panel over the whole page and makes the rest of the document inert while it is open, so it has no resting appearance to document. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| drawer | overlays |  | Rises from the bottom edge over the page for as long as it is open, so it would cover the kit rather than sit in it. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| hover-card | overlays |  |  |
| popover | overlays |  |  |
| sheet | overlays |  | Slides in from an edge and covers the page for as long as it is open, so it would cover the kit rather than sit in it. It portals outside this preview’s theme scope, so an opened one resolves the console’s tokens rather than yours. Look at it on the page you put it on. |
| toast | overlays | success, error, warning, info, loading |  |
| tooltip | overlays |  |  |
| progress | feedback | bar, circle, steps |  |
| skeleton | feedback | text, circular, rectangular |  |
| spinner | feedback |  |  |
| separator | structural |  |  |
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
