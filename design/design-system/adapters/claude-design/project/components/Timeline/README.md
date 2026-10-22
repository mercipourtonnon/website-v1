# Timeline

Events on a line: declared in the config, or every record of a table between two dates.

The `timeline` component type of the config.

## Don't

- The change is one ordinary record update, so the table's field rules, automations and webhooks apply; the bar moves at once and goes back if the update is refused.
- **`children` and `dataSource` are mutually exclusive.** A timeline declaring both is refused at validation.

## Anatomy

- `timeline`
- `timeline-item`
- `timeline-marker`
- `timeline-connector`
