# Table

A Data Table: the records of a table as a grid — sorting, filtering, grouping, selection, paging — or the rows you write in the config.

The `table` component type of the config.

## Do

- Use a `sheet` with `dataSource.system` and its own `recordFields`, opened with `onRowClick: { action: openSheet, component }`.
- Use it for a summary grid — the latest orders on a dashboard — whose rows are edited elsewhere.

## Don't

- Bind it to a table or to a read endpoint with `dataSource`, or omit the binding and it draws the `tableHeaders` and `tableRows` you author; declaring both is refused.
- A `toolbar` or a `search` key on a `table` is refused at load, naming that replacement, and a refresh button becomes `dataSource.refreshMode`.
- **`rowExpand` and `onRowClick` cannot both be declared.** A row has one click, and two answers to what it does is a config whose halves cannot both apply — so it is refused rather than one silently winning.
- A rule with neither is refused.
- `tableColumns` belongs to written tables only: declared beside a `dataSource` it is refused, as `tableRows` is.
- When a bulk action or a row action is refused because the reader's writes were too many, the grid shows a toast saying so and in how many seconds to retry, in the page's language, whatever `onError` declares; the rows, the selection and the buttons stay as they were.
- A grid must start with at least one field column drawn, or the config is refused when it loads.
- Naming the same field at two levels is refused at validation: every record in a group already shares the value that group was formed on, so a repeated level puts exactly one sub-group inside each group and partitions nothing.
- The view owns the filter, the sort, the grouping and the visible fields, so a view-bound grid may not repeat them: a `dataSource.filter`, `dataSource.sort` or `dataSource.fields` beside `view` is refused when the config loads, with a message naming the view.
- No page size may exceed 100, the rows per page the records API serves: a larger `pageSize` or `pageSizeOptions` entry is refused at validation, naming the number and the ceiling, rather than failing the first time a reader picks it.

## Anatomy

- `table-container`
- `table`
- `table-header`
- `table-row`
- `table-head`
- `table-body`
- `table-cell`
