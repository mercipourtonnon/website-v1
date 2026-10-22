# Combobox

One choice found by typing into a combobox, from a list that narrows with each keystroke.

The `combobox` component type of the config.

## Don't

- `chips` requires `multiple: true` and is refused without it, and on a `select`.
- `searchable` and `native` are refused (the browser's own control is `native-select`).

## Anatomy

- `native-select-wrapper`
- `native-select`
- `native-select-option`
- `native-select-icon`
