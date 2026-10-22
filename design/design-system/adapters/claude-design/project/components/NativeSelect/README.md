# NativeSelect

One choice in a native select, the browser's own dropdown, with no script to load.

The `native-select` component type of the config.

## Do

- Keep `select` on a marketing page or a public form, where the control carries your design.

## Don't

- `searchable`, `searchPlaceholder` and `allowCustomValue` are refused (type-ahead is [`combobox`](#combobox)), and so is an option `icon`, which an `<option>` element cannot paint.

## Anatomy

- `native-select-wrapper`
- `native-select`
- `native-select-option`
- `native-select-icon`
