# Resizable

Resizable panels: two side by side, with a draggable handle between them.

The `resizable` component type of the config.

## Don't

- It was named `split-pane`; a config still writing `type: split-pane` is refused with a message naming `resizable`, and renaming the `type` is the whole migration.

## Anatomy

- `card`
