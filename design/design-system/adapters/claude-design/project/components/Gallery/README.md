# Gallery

Records as cards with an image, in a responsive grid.

The `gallery` component type of the config.

## Don't

- One walkable track is its own type, [`carousel`](#carousel); `layout: carousel` is refused with a message naming it.
- Any other action is refused when the config is decoded.
- `layout` is refused (a `carousel` is always one track), and `gridColumns` and `featured` are refused because they belong to a grid, which stays a `gallery`.
- A `gallery` with `layout: carousel` is refused with a message naming `carousel`.

## Anatomy

- `card`
- `skeleton`
