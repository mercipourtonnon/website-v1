# Sheet

A Sheet: a panel that slides in from an edge and keeps the page visible behind it.

The `sheet` component type of the config.

## Do

- Give a sheet a `dataSource` and it becomes record-bound: it fetches one record, renders a control per field, and — unless you turn editing off — saves back through the record API.

## Don't

- A sheet bound to a system detail endpoint whose read is refused or fails says the same, without Retry: a refused read is not asked again.
- `operation: create` is refused when the config is read, because a footer has no form to fill and acts on a record that already exists; put a form in a dialog instead.
- A `visibleWhen.field` the sheet's table does not have is refused when the config is read.
- These shapes are refused when the app boots, each because the failure would otherwise be silent:

## Anatomy

- `overlay-frame`
- `sheet-overlay`
- `sheet-content`
- `sheet-header`
- `sheet-title`
- `sheet-description`
