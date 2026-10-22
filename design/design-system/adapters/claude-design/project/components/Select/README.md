# Select

One choice among many in a select, folded until opened.

The `select` component type of the config.

## Don't

- `searchable`, `searchPlaceholder` and `allowCustomValue` are refused on a `select`, each with a message naming `combobox`, and `native` with one naming `native-select`.
- `options` and `dataSource` are **mutually exclusive** — both answer "what are the choices", so declaring the two together is refused at startup.
- The table-backed and endpoint-backed forms are alternatives, not a pair: a binding declaring both `table` and `system` is refused at startup.
- Both keys are required, and the field must be one of the three choice types; a table or field the app does not declare, or a field of another type, is refused at startup.

## Anatomy

- `native-select-wrapper`
- `native-select`
- `native-select-option`
- `native-select-icon`
