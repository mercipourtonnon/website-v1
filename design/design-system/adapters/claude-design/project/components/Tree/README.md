# Tree

The records of one table nested under their parents, opened branch by branch.

The `tree` component type of the config.

## Don't

- A batch update is judged as if all its moves had landed, so two moves that close a loop only together are refused, and the whole batch with them.
