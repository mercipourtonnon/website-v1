# RichTextEditor

Formatted prose, written in place, with only the marks you allow.

The `rich-text-editor` component type of the config.

## Don't

- The toolbar vocabulary is closed — `bold`, `italic`, `strike`, `heading`, `list`, `ordered-list`, `code-block`, `blockquote`, `link`, `image`, `table`, `horizontal-rule` — so a typo is refused when the config is decoded rather than dropped silently at mount.
