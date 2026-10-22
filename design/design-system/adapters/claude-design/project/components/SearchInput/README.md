# SearchInput

Search within the page, or filter a bound list as you type.

The `search-input` component type of the config.

## Don't

- A box declaring neither, or both, is refused at load.
- `scope: subscribers`, where a sibling named this box's id, was removed in 0.39 and is refused at load, naming `publishes`.

## Anatomy

- `search-input`
- `input-group`
- `input-group-control`
- `input-group-addon`
