# Graph

Nodes in ordered columns with the edges between them: the things the system read `dataSource` names, laid out left to right by kind, so an operator can follow a path rather than look a pair up.

The `graph` component type of the config.

## When to use

Reach for it when the question is _how_ something is reached rather than _whether_ it is — a path a reader can follow with a finger, through whatever stands in the middle.

## Do

- Reach for a `matrix` when the answer is a lookup, and for a `chart` when the answer is a quantity: no `chartType` draws nodes and edges, because every one of them plots a value against an axis.
