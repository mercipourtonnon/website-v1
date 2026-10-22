# Breadcrumb

A Breadcrumb: where the reader is, as a path they can climb back up.

The `breadcrumb` component type of the config.

## Don't

- Declaring `breadcrumbItems` and `derive` together is refused at startup — there is no defensible precedence between an authored trail and a derived one.
- `home` on an enumerated trail is refused at startup, because such a trail already states its own first item.
- Like `labels`, `unlinked` requires `derive` and is refused at startup without it — on an enumerated trail, leave `href` off the item instead.

## Anatomy

- `breadcrumb`
- `breadcrumb-list`
- `breadcrumb-item`
- `breadcrumb-link`
- `breadcrumb-separator`
- `breadcrumb-page`
