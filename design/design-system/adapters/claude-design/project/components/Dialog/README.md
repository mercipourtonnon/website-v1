# Dialog

A Dialog holding a focused task over the page, dismissed by the overlay or a button.

The `dialog` component type of the config.

## Don't

- `component` must name a `dialog` declared on the same page; an id no dialog carries is refused when the config loads.
- **Migrating from `modal`.** The `modal` component type has been removed, and a config still naming it is refused at startup with a message pointing here.

## Anatomy

- `overlay-frame`
- `dialog-overlay`
- `dialog-content`
- `dialog-header`
- `dialog-title`
- `dialog-description`
