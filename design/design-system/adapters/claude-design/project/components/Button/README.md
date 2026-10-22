# Button

One action, stated as a verb. A link when href is set, a button otherwise.

The `button` component type of the config.

## Don't

- A button has no form, so its `onSuccess.type` can only be `navigate`, and its `onError` only a `toast`; anything else is refused when the configuration is read.
- It applies to a `button` placed on a record of a table — in a list's row template, or in a single-record container or a page bound to one record — and is refused at startup outside any record binding; the same pair is accepted by a button field and by a table's row actions.
- The record must be a row of a declared table: a `disabledWhen` on a button or row action whose rows come from a `system` source or a `collection` page, one in the page `layout`, and one inside a template placed from `app.components` would never be judged, so each is refused at startup too.
- `disabledReason`, which accepts `$record.<field>` and a `$t:` key, shows in a tooltip on hover and on focus and is announced as the button's description; without it the button is disabled with no explanation, and a `disabledReason` without `disabledWhen` is refused.
- An automation a disabled control would start is refused with 409 `ACTION_DISABLED` and the reason when the press names its record; a hidden one answers 404, as an absent one does.
- It is refused at startup anywhere else.
- What a control cannot do is refused rather than ignored.
- A button, a table row action or a menu item has no form, so its `onSuccess.type` can only be `navigate`, and the keys that describe a form — `preserveFields`, `title`, `message`, `actions`, `showSummary`, `redirect` — are refused there.
- An `onSuccess.navigate` naming another site (`https://…`) is refused on every control — a button, a row action, a menu item, an endpoint form, a file upload and a form alike — because an answered action moves the reader within the app; a link sends them elsewhere.

## Variants

- `default`
- `destructive`
- `outline`
- `secondary`
- `ghost`
- `link`
- `fab`

## Anatomy

- `button`
