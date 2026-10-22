# Calendar

A calendar: a month of days to pick one date, a range, or several, inline on the page.

The `calendar` component type of the config.

## Don't

- It was named `calendar`; a config still writing `type: calendar` is refused with a message naming `event-calendar`, and renaming the `type` is the whole migration.
- An event takes one colour, from one option, so `colorField` must name a `single-select`: a `multi-select` is refused when the config is read, naming the field.
