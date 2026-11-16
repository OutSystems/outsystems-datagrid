# ADR-0004: Fix Column-Group Index Collision in ValidationMark Cell Edit Handler

## Status

Accepted

## Context

Wijmo FlexGrid maintains data columns and column groups in **separate internal arrays**, each using its own zero-based index sequence. A `ColumnGroup` at position 0 in the groups array and a regular `Column` at position 0 in the columns array therefore share the same `index` value, but they refer to entirely different things.

On the OutSystems side, `grid.getColumns()` returns all column-like objects — both `ColumnType.Group` entries and real data columns — in a single mixed array. The `ValidationMark._cellEditEndedHandler` was resolving which OS column was edited by doing:

```typescript
const OSColumn = this._grid.getColumns().find((item) => item.provider.index === column.index);
```

Without pre-filtering, a `ColumnType.Group` entry could satisfy `provider.index === column.index` before the actual data column was reached, causing `OSColumn` to be resolved as a group instead of the edited column. The group's `uniqueId` was then passed to `_triggerEventsFromColumn`, which retrieved the group via `getColumn()` and called `_handleOnCellChangeEvent` on it. Accessing `column.hasEvents` on a group column delegates to the `columnEvents` getter, which is explicitly unsupported and throws:

```
Uncaught Error: The column Group does not support events
    at get columnEvents (GridFramework.js)
    at get hasEvents (GridFramework.js)
    at ValidationMark._handleOnCellChangeEvent (GridFramework.js)
    at ValidationMark._triggerEventsFromColumn (GridFramework.js)
    at ValidationMark._cellEditEndedHandler (GridFramework.js)
```

This exception surfaced in the browser console on every cell edit in grids that contained column groups, and silently prevented the `OnCellValueChange` event from reaching the OutSystems application.

## Decision Drivers

-   Grids that use column groups must fire validation and `OnCellValueChange` events correctly on cell edits.
-   The column lookup must be stable regardless of how many groups or columns are present and in what order `getColumns()` returns them.
-   The fix must not change the contract for grids without groups.

## Considered Options

-   **Filter out groups before the index lookup (chosen)** — Add `.filter((item) => item.columnType !== ColumnType.Group)` before `.find()`, then guard the trigger call with `if (OSColumn !== undefined)`.

    -   Pros: minimal change, directly addresses the ambiguity at its source, no impact on undo/redo paths or other call sites. The same fix, is to be applied in all the undo/redo handlers (`_undoActionHandler`, `_redoActionHandler`).
    -   Cons: none known.

-   **Look up by column binding instead of index** — Resolve the OS column via `column.binding` rather than `column.index`.
    -   Pros: avoids the specific index-sharing collision between column groups and data columns, and may better reflect the data field being edited.
    -   Cons: requires verifying that bindings are always populated, consistent across all column types and call sites, and unique enough for this lookup to be reliable. In some configurations, multiple columns may share the same binding, so this is a broader refactor out of scope for this fix.

## Decision Outcome

The `.filter()` guard was applied in `_cellEditEndedHandler` so only non-Group columns participate in the index comparison. An explicit `if (OSColumn !== undefined)` check was added before accessing `.uniqueId`, preventing a runtime exception if the lookup still yields no match for any other unforeseen reason.

Positive consequences:

-   `OnCellValueChange` and mandatory-field validation events fire correctly in grids that contain column groups.
-   No behavioral change for grids without column groups.

Negative consequences:

-   None identified.

## Links

-   `src/Providers/DataGrid/Wijmo/Features/ValidationMark.ts` — `_cellEditEndedHandler` method, lines 42–60.
-   Jira ticket: ROU-12739.

## Date

2026-05-12
