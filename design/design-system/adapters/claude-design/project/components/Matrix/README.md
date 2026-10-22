# Matrix

Two sets of things crossed, each intersection a glyph rather than a word: rows and columns are nodes of the graph `dataSource` names, and a cell is the edge between them.

The `matrix` component type of the config.

## When to use

Reach for it when the question is _which of these reach which of those, and how strongly_ — permissions across roles, features across plans, coverage across teams.

## Do

- Reach for a `table` instead when the cells are values a reader needs to read word by word.
