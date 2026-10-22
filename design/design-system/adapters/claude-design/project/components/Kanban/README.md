# Kanban

Records as cards in columns, one column per value of a select field.

The `kanban` component type of the config.

## Don't

- Any other action is refused when the config is decoded — put richer behaviour on the drawer's footer actions instead.
- The lane field is checked against the bound table, so a typo is refused by `sovrium validate` rather than drawing one lane per record.

## Anatomy

- `kanban-column`
- `skeleton`
