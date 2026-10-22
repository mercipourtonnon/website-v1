Colours have two themes, Light and Dark; every token in `tokens.json` says what it is for.

## Principles

- Authenticité — design sincère et transparent, pas de surenchère visuelle ni de promesses exagérées.
- Respect et accessibilité — hiérarchie claire, contrastes élevés, espaces généreux pour tou·tes.
- Dialogue et ouverture — un ton chaleureux qui invite à l'échange plutôt qu'à la performance.
- Simplicité engagée — épuré sans être froid, chaleureux sans être infantilisant ; associatif assumé, loin des codes startup et corporate.

## Voice

Personality: Bienveillant mais pas moralisateur., Pédagogue mais pas condescendant., Engagé mais pas militant., Accessible mais pas simpliste..
Address the reader as "tu".

Prefer:

- Tutoyer systématiquement et utiliser l'écriture inclusive (·e, ·es).
- Vocabulaire : consentement, limites, authenticité, écoute, co-construction ; poser ses limites, accueillir le non, explorer, construire ensemble.
- Formuler comme une invitation : « Rejoins-nous pour explorer… », « Cet atelier t'invite à… », « Ensemble, on construit… ».
- Privilégier la clarté à l'effet de style.

Avoid:

- Jargon corporate : solution, optimisation, performance, ROI, levier.
- Ton marketing : révolutionnaire, unique, certifiant, garantie, « maximisez votre potentiel », « devenez un expert ».
- Vocabulaire thérapeutique : guérison, trauma, diagnostic.
- Vouvoiement, ton moralisateur, promesses de résultat.

## Colour roles

| Token | Usage | Pairs with |
| --- | --- | --- |
| `pourpre` | Émotion, authenticité, découverte. Témoignages, sections émotionnelles. Jamais en fond de grande section : utiliser pourpre-light. | `pourpre-light` |
| `orange` | Action, engagement, chaleur. Boutons d'inscription, CTAs principaux, liens actifs — en fond, toujours avec un texte bleu-fonce (8,8:1), jamais blanc (1,8:1). Jamais pour une action contradictoire (annuler ET confirmer). | `orange-light` |
| `orange-ink` | Version texte de l'orange : petits libellés, liens et sur-titres orange sur fond blanc ou clair. L'orange vif n'est jamais du texte (1,8:1). | `orange-light` |
| `orange-vif` | Variante chaude, en opposition au violet. Accent ponctuel uniquement. | `orange-vif-light` |
| `mauve` | Exploration, apprentissage, créativité. Sections pédagogiques, titres secondaires, invitations à la réflexion. | `mauve-light` |
| `cyan` | Validation, calme, ressources. Confirmations, ressources, sections factuelles. Pas en petit texte sur fond blanc (contraste) : utiliser cyan-ink. | `cyan-light` |
| `cyan-ink` | Version texte du cyan : libellés, liens et titres de cartes cyan sur fond blanc ou cyan-light. | `cyan-light` |
| `bleu-fonce` | Texte principal et titres ; remplace le noir partout. | `pourpre-light` |

## Components

- **Alert**: A message the reader must see before going on, set in an alert: what changed, what it costs, what to do.
- **Badge**: A Badge: a short status word pinned to a thing, never a sentence.
- **Button**: One action, stated as a verb. A link when href is set, a button otherwise.
- **ButtonGroup**: A Button Group: several exclusive actions of equal weight, joined so they read as one control.
- **Link**: Navigation inside a run of text, underlined so it reads as a link at a glance.
- **ThemeToggle**: The one control that flips the colour scheme and remembers the choice.
- **Calendar**: A calendar: a month of days to pick one date, a range, or several, inline on the page.
- **Checkbox**: A yes or no the reader sets in a checkbox, with room for several in a list.
- **CodeEditor**: Source text the reader edits, highlighted by language and indented to your width.
- **Combobox**: One choice found by typing into a combobox, from a list that narrows with each keystroke.
- **DatePicker**: A Date Picker: a calendar date, typed or picked, in the reader's locale.
- **DateRangePicker**: A period rather than a date: two months side by side, and presets that resolve against today.
- **Field**: A labelled control with its help and its error, laid out the same way in every field.
- **Input**: A single line of text, typed by the reader into an input.
- **InputGroup**: One input with a fixed prefix, suffix or action fused to its edge, in one input group.
- **InputOtp**: A short verification code typed into an input OTP, one character per box, pasted or autofilled.
- **Label**: The label of one form control, wired to it so a click on the name focuses the control.
- **NativeSelect**: One choice in a native select, the browser's own dropdown, with no script to load.
- **RadioGroup**: One choice among a few in a radio group, all visible at once.
- **Rating**: A row of stars that reads a rating, and writes a whole one inside a form.
- **RichTextEditor**: Formatted prose, written in place, with only the marks you allow.
- **Select**: One choice among many in a select, folded until opened.
- **Slider**: A number in a range, dragged along a slider rather than typed.
- **Switch**: A setting that applies as soon as its switch flips.
- **Textarea**: Several lines of text in a textarea, growing with what is written.
- **Toggle**: A pressed or released toggle that holds its state.
- **ToggleGroup**: A toggle group: a row of toggles where one, or several, stay pressed.
- **Carousel**: A Carousel: slides on one track, moved through one at a time with arrows, dots or a swipe.
- **Chart**: A Chart over rows: bars, lines, areas or a donut, one series per colour.
- **EventCalendar**: Records on a month or week grid, placed by their date field.
- **FilterBar**: One set of conditions, published to every data component bound to the same channel.
- **Gallery**: Records as cards with an image, in a responsive grid.
- **Graph**: Nodes in ordered columns with the edges between them: the things the system read `dataSource` names, laid out left to right by kind, so an operator can follow a path rather than look a pair up.
- **Kanban**: Records as cards in columns, one column per value of a select field.
- **Kpi**: One number that matters, with its label and its movement.
- **List**: Records as rows with a title, a subtitle and a trailing value.
- **Map**: Records placed as pins at their location, with a list twin a keyboard can use.
- **Matrix**: Two sets of things crossed, each intersection a glyph rather than a word: rows and columns are nodes of the graph `dataSource` names, and a cell is the edge between them.
- **Table**: A Data Table: the records of a table as a grid — sorting, filtering, grouping, selection, paging — or the rows you write in the config.
- **Tree**: The records of one table nested under their parents, opened branch by branch.
- **AspectRatio**: An aspect ratio frame: one image, video or map held at a fixed width-to-height shape, whatever the screen.
- **Card**: A Card: a bounded surface for one thing, on the page background.
- **Container**: A box that gives its children padding and a width.
- **Flex**: Children in a row or a column, spaced by one gap.
- **Grid**: Children in equal columns, collapsing to one on a narrow screen.
- **MessageScroller**: A message scroller: the scroll frame of a conversation, opening at the latest turn and keeping its place.
- **Resizable**: Resizable panels: two side by side, with a draggable handle between them.
- **Sidebar**: The Sidebar: the left rail of grouped navigation, with an active entry.
- **Attachment**: An attachment chip: one file drawn by its icon or thumbnail, its name and size, and a way to open it.
- **Audio**: An audio file with play, progress and duration.
- **Code**: A Code Block: source text in a monospace frame, highlighted by language, with a copy button.
- **Icon**: One glyph from the app's icon set, sized and coloured by the text around it.
- **Image**: A picture with its alt text, lazy unless it is above the fold.
- **Kbd**: The keys a reader is meant to press, drawn as Kbd keycaps.
- **QrCode**: A value drawn as a scannable code.
- **SearchInput**: Search within the page, or filter a bound list as you type.
- **Text**: Typography: a run of prose at one step of the type scale.
- **Toc**: The headings of the page as a list that follows the reader.
- **Video**: A video file with a poster, play and progress.
- **Accordion**: An Accordion: stacked sections that open one at a time.
- **Avatar**: An Avatar: a person or a thing as a small round mark — a picture, initials, or nothing at all.
- **Bubble**: A Bubble: the surface of one chat turn, set to its side of the thread.
- **Collapsible**: A collapsible region behind one trigger, shown or hidden in place, with no siblings to close.
- **DescriptionList**: Pairs of a term and its detail, read down rather than across.
- **Empty**: An Empty state: what a view says when it has nothing to show, and what to do about it.
- **Item**: An Item: one row of a list — a leading mark, a title, a subtitle, a trailing value.
- **Marker**: A marker line inside a thread or a list: a status, a system note, a labelled break.
- **Marquee**: A strip of logos or words that scrolls sideways.
- **Message**: A message: one turn of a conversation — who said it, when, on which side — around the bubble that holds it.
- **ScrollArea**: A Scroll Area: a region that scrolls inside the page with a thin scrollbar.
- **Stepper**: One task split into ordered steps, each a body of its own, with a rail that shows progress.
- **Swatch**: One colour drawn as a filled square with its value and its name.
- **Tabs**: Tabs: a short list of views, one visible at a time.
- **Timeline**: Events on a line: declared in the config, or every record of a table between two dates.
- **Breadcrumb**: A Breadcrumb: where the reader is, as a path they can climb back up.
- **Command**: A Command palette: search everything from anywhere, opened with a keyboard shortcut.
- **ContextMenu**: A Context Menu of actions on the thing under the pointer, opened on right click.
- **DropdownMenu**: A Dropdown Menu of actions gathered behind one button, opened on click.
- **Menubar**: A Menubar: a row of menus, as in a desktop application.
- **NavigationMenu**: A Navigation Menu: the top navigation of a site, with menus that open on hover.
- **Pagination**: Pagination: move between the pages of a long list.
- **AlertDialog**: An Alert Dialog asking the reader to confirm an action that loses data.
- **Dialog**: A Dialog holding a focused task over the page, dismissed by the overlay or a button.
- **Drawer**: A drawer: a panel that rises from the bottom edge and is dragged down to dismiss.
- **HoverCard**: A Hover Card: a preview that opens when the pointer rests on a name.
- **Popover**: A Popover: a small panel anchored to its trigger, opened on click.
- **Sheet**: A Sheet: a panel that slides in from an edge and keeps the page visible behind it.
- **Toast**: A Toast, drawn by Sonner: a short confirmation that leaves on its own.
- **Tooltip**: A Tooltip: one line of help on hover or focus.
- **Progress**: A Progress bar: how far a known task has run.
- **Skeleton**: A Skeleton: the shape of content that is still loading.
- **Spinner**: A Spinner: waiting, when nothing else can be shown.
- **Separator**: A Separator: a hairline between two things that are not the same thing.
- **Spacer**: Empty room, sized from the spacing ladder.
- **FileUpload**: Files into a bucket, dropped or picked.
- **NumberInput**: A number, typed or stepped one unit at a time.
- **Preview**: One option of one type, drawn at the value you name, so a setting can be seen rather than described.
- **ReorderableList**: Rows the reader can drag into a new order.
- **TimePicker**: A time of day, typed or picked.
- **AiChat**: A thread with an agent declared in agents[].
