# Carousel

A Carousel: slides on one track, moved through one at a time with arrows, dots or a swipe.

The `carousel` component type of the config.

## Don't

- `layout` is refused (a `carousel` is always one track), and `gridColumns` and `featured` are refused because they belong to a grid, which stays a `gallery`.
- A `gallery` with `layout: carousel` is refused with a message naming `carousel`.

## Anatomy

- `card`
- `skeleton`
