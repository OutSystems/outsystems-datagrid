# Plan: Structured Logging System for OutSystems DataGrid

## Context

The grid currently has no consistent logging mechanism — scattered `console.log/error/warn` calls exist throughout the provider layer, and `LogMessage.ts` has only a stub `LogWarningMessage`. A recent modification removed the `warningMessage` constant from `LogMessage.ts`, breaking 20 references. This plan introduces a level-based logging system (none/error/info/debug) that persists via `localStorage`, replaces all bare `console.*` calls, and ensures every public `OutSystems.GridAPI.*` function is covered by entry/exit tracing.

The logging namespace is `OutSystems.UI.GridLogging` — specific to the DataGrid component, avoiding versioning conflicts with other components (e.g. `OutSystems.UI.MapsLogging`). The code will later be replicated across component repos via an automated process, out of scope here.

See also: `docs/adr/ADR-0004-Structured-Logging-System.md`

---

## Architecture

Two files under `src/OutSystems/UI/GridLogging/`:

```
src/OutSystems/UI/GridLogging/
    ILogger.ts      ← LogLevel enum + ILogger interface
    LoggingAPI.ts   ← Public API; cached level, unified Log function
```

**Performance design:** `activeLevel` is cached in a module-level variable, initialised once from `localStorage` at load time and updated synchronously by `SetLogLevel()`. Every guard is a single integer comparison — zero I/O in the default `None` state. `highResTimestamp()` and `extraParams` spreading are only reached after the guard passes, so their cost is never paid when logging is inactive.

**Unified `Log` function:** always receives the full debug-level parameters (name + `...extraParams`), but the output adapts to the active level — extra params are only emitted at `Debug`, keeping lower levels lean.

| Active level | Output for any `Log(level, name, ...extra)` call |
|---|---|
| None  | nothing |
| Error | `[ts] [ERROR] name` — no extra params |
| Info  | `[ts] [LEVEL] name` — no extra params |
| Debug | `[ts] [LEVEL] name` + extra params object |

**localStorage key:** `'outsystems-grid-logLevel'`

**Public API:** `OutSystems.UI.GridLogging.*`

**DataGrid integration:** `MeasurePerformance` in `Auxiliary.ts` calls `LogEntry`/`LogExit` (full entry/exit/duration for 13 functions). The remaining 83 public `OutSystems.GridAPI.*` functions each get a `Log(LogLevel.Info, "Name", {params})` call inserted at the top of their body.

---

## Files to Create

### 1. `src/OutSystems/UI/GridLogging/ILogger.ts`

```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.UI.GridLogging {
    export enum LogLevel {
        None = 0,
        Error = 1,
        Info = 2,
        Debug = 3,
    }

    export interface ILogger {
        log(level: LogLevel, name: string, ...extraParams: unknown[]): void;
        logEntry(functionName: string, args: unknown[]): void;
        logExit(functionName: string, result: unknown, durationMs: number): void;
    }
}
```

### 2. `src/OutSystems/UI/GridLogging/LoggingAPI.ts`

```typescript
/// <reference path="ILogger.ts" />
/**
 * Logging API for the OutSystems DataGrid component.
 * Log level is persisted in localStorage so it survives page refreshes.
 *
 * Usage:
 *   OutSystems.UI.GridLogging.SetLogLevel(OutSystems.UI.GridLogging.LogLevel.Debug);
 *   OutSystems.UI.GridLogging.Log(OutSystems.UI.GridLogging.LogLevel.Info, "Grid.Init");
 *   OutSystems.UI.GridLogging.Log(OutSystems.UI.GridLogging.LogLevel.Debug, "Grid.Init", { gridID, configs });
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.UI.GridLogging {
    const STORAGE_KEY = "outsystems-grid-logLevel";

    // Cached for performance: avoids a localStorage read on every log call.
    // Safe because OutSystems.UI.GridLogging is component-specific — only one
    // bundle containing this code is ever loaded per page.
    let activeLevel: LogLevel = (parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "0", 10) ||
        LogLevel.None) as LogLevel;

    /**
     * High-resolution ISO 8601 timestamp with microsecond precision.
     * Uses performance.timeOrigin + performance.now() to produce a sortable
     * wall-clock string that can distinguish events within the same millisecond.
     * Example: "2026-05-12T10:23:45.123456Z"
     */
    function highResTimestamp(): string {
        const t = performance.timeOrigin + performance.now();
        const subMs = Math.floor((t % 1) * 1000)
            .toString()
            .padStart(3, "0");
        return new Date(t).toISOString().replace("Z", `${subMs}Z`);
    }

    /** Returns the currently active log level. */
    export function GetLogLevel(): LogLevel {
        return activeLevel;
    }

    /**
     * Sets the log level, updates the in-memory cache, and persists to localStorage.
     *
     *   None  (0) – silent (default)
     *   Error (1) – errors only: timestamp + name
     *   Info  (2) – errors + informational: timestamp + name
     *   Debug (3) – all messages: timestamp + name + extra params
     */
    export function SetLogLevel(level: LogLevel): void {
        activeLevel = level;
        window.localStorage.setItem(STORAGE_KEY, String(level));
    }

    /**
     * Unified log function. Always call with the full debug-level context
     * (name + extraParams); the active level determines how much is emitted.
     *
     *   None/level too low  → nothing (single integer comparison, exits immediately)
     *   Error or Info active → timestamp + name only
     *   Debug active         → timestamp + name + all extraParams
     */
    export function Log(level: LogLevel, name: string, ...extraParams: unknown[]): void {
        if (activeLevel < level) return;

        const ts = highResTimestamp();
        const label = `[${ts}] [${LogLevel[level]}] ${name}`;
        const extra = activeLevel >= LogLevel.Debug ? extraParams : [];

        if (level === LogLevel.Error) {
            console.error(label, ...extra);
        } else if (level === LogLevel.Info) {
            console.info(label, ...extra);
        } else {
            console.debug(label, ...extra);
        }
    }

    /**
     * Logs function entry with its arguments. Delegates to Log at Debug level.
     * Called by MeasurePerformance — do not call directly.
     */
    export function LogEntry(functionName: string, args: unknown[]): void {
        Log(LogLevel.Debug, `→ ${functionName}`, { args });
    }

    /**
     * Logs function exit with return value and wall-clock duration. Delegates to Log.
     * Called by MeasurePerformance — do not call directly.
     */
    export function LogExit(functionName: string, result: unknown, durationMs: number): void {
        Log(LogLevel.Debug, `← ${functionName}`, { result, duration: `${durationMs.toFixed(3)}ms` });
    }
}
```

---

## Files to Modify

### `src/OSFramework/DataGrid/Helper/LogMessage.ts`
Restore the removed `warningMessage` constant (breaking 20 references). Deprecation warnings remain `console.warn` unconditionally — they must always appear regardless of log level.

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.DataGrid.Helper {
    export const warningMessage = "This API is deprecated please use the new api";

    export function LogWarningMessage(message: string): void {
        console.warn(message);
    }
}
```

### `src/OutSystems/GridAPI/Auxiliary.ts` — `MeasurePerformance`
Add `LogEntry`/`LogExit` to capture every wrapped public-API call with arguments, return value, and wall-clock duration:

```typescript
export function MeasurePerformance<T extends (...args: any[]) => any>(functionName: string, fn: T): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
        OutSystems.GridAPI.Performance.SetMark(functionName);
        OutSystems.UI.GridLogging.LogEntry(functionName, args);

        const startTime = performance.now();
        const result = fn(...args);
        const durationMs = performance.now() - startTime;

        OutSystems.GridAPI.Performance.SetMark(`${functionName}-end`);
        OutSystems.GridAPI.Performance.GetMeasure(`@datagrid-${functionName}`, functionName, `${functionName}-end`);
        OutSystems.UI?.GridLogging.LogExit(functionName, result, durationMs);

        return result;
    }) as T;
}
```

### `src/OutSystems/GridAPI/Security.ts` — migrate to `MeasurePerformance`
Both functions currently use the manual `SetMark`/`GetMeasure` pattern and are invisible to logging. Wrap them with `MeasurePerformance` instead (same pattern as the rest of GridAPI):

```typescript
namespace OutSystems.GridAPI.Security {
    export const DisableCellDataSanitizer = Auxiliary.MeasurePerformance(
        "Security.DisableCellDataSanitizer",
        (gridID: string): void => {
            GridManager.GetGridById(gridID).features.cellDataSanitizer.disableCellDataSanitizer();
        }
    );

    export const EnableCellDataSanitizer = Auxiliary.MeasurePerformance(
        "Security.EnableCellDataSanitizer",
        (gridID: string): void => {
            GridManager.GetGridById(gridID).features.cellDataSanitizer.enableCellDataSanitizer();
        }
    );
}
```

### `src/OutSystems/GridAPI/GridManager.ts` — migrate `GetChangesInGrid` to `MeasurePerformance`
`GetChangesInGrid` still uses the manual `SetMark`/`GetMeasure` pattern. Wrap it:

```typescript
export const GetChangesInGrid = OutSystems.GridAPI.Auxiliary.MeasurePerformance(
    "GridManager.GetChangesInGrid",
    (gridID: string): string => {
        return Auxiliary.CreateApiResponse({
            gridID,
            errorCode: OSFramework.DataGrid.Enum.ErrorCodes.API_FailedGetChangedLines,
            callback: () => JSON.stringify(GetGridById(gridID).getChangesMade()),
            hasValue: true,
        });
    }
);
```

### Complete `OutSystems.GridAPI.*` Function Inventory

Every public function in `OutSystems.GridAPI.*` is covered. There are three coverage categories:

**Category A — Already covered** (no per-file changes): Functions wrapped with `MeasurePerformance` today automatically get full entry/exit/duration tracing once `Auxiliary.ts` is updated. 10 functions in `GridManager.ts`:

| Function | File |
|---|---|
| `GridManager.CreateGrid` | GridManager.ts |
| `GridManager.GetGridById` | GridManager.ts |
| `GridManager.InitializeGrid` | GridManager.ts |
| `GridManager.MarkChangesAsSaved` | GridManager.ts |
| `GridManager.MarkChangesAsSavedByKey` | GridManager.ts |
| `GridManager.SetGridData` | GridManager.ts |
| `GridManager.RemoveGrid` | GridManager.ts |
| `GridManager.ChangeProperty` | GridManager.ts |
| `GridManager.ClearChanges` | GridManager.ts |
| `GridManager.DestroyGrid` | GridManager.ts |

**Category B — Migrated to `MeasurePerformance`** (full entry/exit/duration after migration): 3 functions explicitly refactored in this plan:

| Function | File |
|---|---|
| `GridManager.GetChangesInGrid` | GridManager.ts |
| `Security.DisableCellDataSanitizer` | Security.ts |
| `Security.EnableCellDataSanitizer` | Security.ts |

**Category C — Direct `Log` call added at entry** (`LogLevel.Info`, params as `extraParams`): All remaining public functions. The pattern is:

```typescript
export function FunctionName(param1: T1, param2: T2): ReturnType {
    OutSystems.UI.GridLogging.Log(
        OutSystems.UI.GridLogging.LogLevel.Info,
        "Namespace.FunctionName",
        { param1, param2 }
    );
    // existing body unchanged
}
```

Complete list by file (~83 functions):

**`GetVersion.ts` (2)**
- `GetVersion()`
- `GetWijmoFlexGridVersion()`

**`Cells.ts` (4)**
- `SetValidationStatus(gridID, rowIndex, columnID, isValid, errorMessage)`
- `ValidateCell(gridID, rowIndex, columnID, triggerOnCellValueChange)`
- `ValidateRow(gridID, rowIndex)`
- `SetCellData(gridID, rowIndex, columnID, value, showDirtyMark, triggerOnCellValueChange)`

**`ColumnFreeze.ts` (3)**
- `Freeze(gridID, n?)`
- `IsFrozen(gridID)`
- `Unfreeze(gridID)`

**`ColumnManager.ts` (9)**
- `AddColumnsToGroupPanel(gridID, ListOfColumnIDs, focusOnGrid)`
- `CreateColumn(columnID, type, configs, editorConfig)`
- `GetColumnById(columnID)`
- `ChangeProperty(columnID, propertyName, propertyValue)`
- `DestroyColumn(columnID)`
- `RemoveColumnsFromGroupPanel(gridID, ListOfColumnIDs, focusOnGrid)`
- `SetColumnAggregate(gridID, columnID, aggregate)`
- `MergeColumnCells(gridID, columnID, allowMerge)`
- `SetColumnHeader(gridID, columnID, header)`

**`ColumnPicker.ts` (1)**
- `SetColumnVisibility(gridID, showHiddenColumns)`

**`ConditionalFormat.ts` (3)**
- `AddConditionalFormat(gridID, binding, rules)`
- `SetNumberAggregateConditionalFormatting(gridID, columnID, conditionalFormat)`
- `RemoveConditionalFormat(gridID, binding)`

**`ContextMenu.ts` (5)**
- `GetGridByMenuId(menuItemId, lookUpDOM)`
- `AddItem(menuItemId, label, enabled, clickEvent)`
- `AddSeparator(menuItemId)`
- `ChangeProperty(menuItemId, propertyName, propertyValue)`
- `RemoveItem(menuItemId)`

**`Export.ts` (1)**
- `CustomizeExportingMessage(gridID, exportingMessage, showMessage)`

**`Filter.ts` (8)**
- `HasResults(gridID)`
- `Search(gridID, searchedValue)`
- `Activate(gridID, columnID)`
- `Clear(gridID, columnID, triggerOnFiltersChange, focusOnGrid)`
- `Deactivate(gridID, columnID)`
- `ByCondition(gridID, columnID, values, focusOnGrid)`
- `ByValue(gridID, columnID, values, focusOnGrid)`
- `SetColumnFilterOptions(gridID, columnID, options, maxVisibleOptions)`

**`GridManager.ts` (3 without MeasurePerformance or migration)**
- `GetAllGridIdsInPage()`
- `GetActiveGrid()`
- `SetDateSample(date)`

**`Language.ts` (3)**
- `AddSupportedLanguage(language, filePath)`
- `HaveLanguagesBeenSet()`
- `SetLanguage(language)`

**`Pagination.ts` (14)**
- `ChangePageSize(gridID, n)`
- `CreatePageButtons(gridID, phID, buttonQuantity)`
- `GetCurrentPage(gridID)`
- `MoveToFirstPage(gridID)`
- `MoveToLastPage(gridID)`
- `MoveToNextPage(gridID)`
- `MoveToPage(gridID, n)`
- `MoveToPreviousPage(gridID)`
- `RegisterCurrentPageLabel(gridID, phID)`
- `RegisterPageCountLabel(gridID, phID)`
- `RegisterPageSizeLabel(gridID, phID)`
- `RegisterRowEndLabel(gridID, phID)`
- `RegisterRowStartLabel(gridID, phID)`
- `RegisterRowTotalLabel(gridID, phID)`

**`Rows.ts` (12)**
- `AddClass(gridID, rowNumber, className)`
- `AddRows(gridID, numberOfRows)`
- `GetRowData(gridID, rowNumber)`
- `GetRowNumberByKey(gridID, key)`
- `RemoveAllClasses(gridID, rowNumber)`
- `RemoveClass(gridID, rowNumber, className)`
- `RemoveRowsByNumberOrKey(gridID, rowNumbers, rowKeys)`
- `RemoveRows(gridID)`
- `UpdateAddedRowKey(gridID, currentRowId, newKey)`
- `UpdateStartingRowHeader(gridID, startIndex)`
- `SetValidationStatusByKey(gridID, rowKey, columnID, isValid, errorMessage)`
- `ToggleRowDragging(gridID, allowRowDragging)`

**`Search.ts` (1)**
- `SearchData(gridID, searchID, promptMessage, highlightResults)`

**`Selection.ts` (12)**
- `GetAllSelections(gridID)`
- `GetAllSelectionsData(gridID)`
- `GetCheckedRowsData(gridID)`
- `GetSelectedRowsCount(gridID)`
- `GetSelectedRowsData(gridID)`
- `GetSelectionAverage(gridID)`
- `GetSelectionCount(gridID)`
- `GetSelectionMax(gridID)`
- `GetSelectionMin(gridID)`
- `GetSelectionSum(gridID)`
- `HasSelectedRows(gridID)`
- `SetRowAsSelected(gridID, rowsIndex, isSelected)`

**`Sort.ts` (3)**
- `Clear(gridID)`
- `ColumnSort(gridID, columnID, sorting)`
- `SetUnsortState(gridID, hasUnsortState)`

**`Styling.ts` (5)**
- `SetCellCssClass(gridID, columnID, rowIndex, className)`
- `SetColumnCssClass(gridID, columnID, cssClass, applyToHeader)`
- `RemoveAllCssClassesFromCell(gridID, columnID, rowIndex)`
- `RemoveColumnCssClass(gridID, columnID, cssClass)`
- `SetColumnWordWrap(gridID, columnID, wordWrapValue, dynamicHeight)`

**`View.ts` (3)**
- `GetViewLayout(gridID)`
- `SetViewLayout(gridID, config)`
- `GetColumnsOrder(gridID)`

**Coverage summary**: 96 public `OutSystems.GridAPI.*` functions total — 10 automatic (Category A), 3 migrated (Category B), 83 direct-log (Category C).

---

### Replace all bare `console.*` calls in provider and framework layers

Every `console.log`, `console.error`, and `console.warn` (outside `LogMessage.ts`) is replaced with `OutSystems.UI.GridLogging.Log(...)`. Mapping:

| Original | Replacement level |
|---|---|
| `console.log(...)` | `LogLevel.Debug` |
| `console.warn(...)` | `LogLevel.Info` |
| `console.error(...)` | `LogLevel.Error` |

Files to update (9 files, ~15 call sites):

| File | Calls |
|---|---|
| `src/OSFramework/DataGrid/Grid/AbstractGrid.ts` | `console.log` × 2, `console.error` × 1 |
| `src/OSFramework/DataGrid/Grid/AbstractDataSource.ts` | `console.warn` × 1 |
| `src/Providers/DataGrid/Wijmo/Grid/FlexGrid.ts` | `console.log` × 2 |
| `src/Providers/DataGrid/Wijmo/Columns/AbstractProviderColumn.ts` | `console.log` × 1, `console.error` × 1 |
| `src/Providers/DataGrid/Wijmo/Columns/AbstractProviderColumnEditor.ts` | `console.log` × 1 |
| `src/Providers/DataGrid/Wijmo/Columns/DropdownColumn.ts` | `console.log` × 1 |
| `src/Providers/DataGrid/Wijmo/Columns/GroupColumn.ts` | `console.error` × 1 |
| `src/Providers/DataGrid/Wijmo/Columns/NumberColumn.ts` | `console.warn` × 2 |
| `src/Providers/DataGrid/Wijmo/Features/ContextMenu.ts` | `console.error` × 2, `console.log` × 1 |

Each replacement includes a descriptive `name` (e.g. `"AbstractGrid.removeColumn"`) and passes the original message/variables as `extraParams` so they appear at Debug level.

Example:
```typescript
// Before
console.log(`Constructor grid '${this.uniqueId}'`);

// After
OutSystems.UI.GridLogging.Log(
    OutSystems.UI.GridLogging.LogLevel.Debug,
    "AbstractGrid.constructor",
    { uniqueId: this.uniqueId }
);
```

### Add `Log(LogLevel.Debug, ...)` to all class methods

Every concrete method in every class gets a `Log(LogLevel.Debug, "ClassName.methodName", {params})` call at entry. This covers both the framework layer (`OSFramework.DataGrid.*`) and the provider layer (`Providers.DataGrid.Wijmo.*`). Performance internal classes (`AbstractPerformance`, `PerformanceProdMode`, `PerformanceDebugMode`) are excluded — logging inside the logging/perf infrastructure would cause infinite recursion.

**Implementation pattern:**
```typescript
public someMethod(param1: T1, param2: T2): ReturnType {
    OutSystems.UI.GridLogging.Log(
        OutSystems.UI.GridLogging.LogLevel.Debug,
        "ClassName.someMethod",
        { param1, param2 }
    );
    // existing body unchanged
}
```

Private methods with event-handler signatures (`_xxxHandler`, `_onXxx`) receive the same treatment but with their event arg params.

---

#### `src/OSFramework/DataGrid/Column/AbstractColumn.ts` — class `AbstractColumn`
| Method | Visibility |
|---|---|
| `_findParentGroup` | private |
| `_preBuild` | protected |
| `setConditionalFormat` | protected |
| `build` | public |
| `changeProperty` | public |
| `dispose` | public |
| `equalsToID` | public |
| `getProviderConfig` | public |
| `indexPosition` | public |
| `refresh` | public |

#### `src/OSFramework/DataGrid/Grid/AbstractDataSource.ts` — class `AbstractDataSource`
| Method | Visibility |
|---|---|
| `_entriesToMap` | private |
| `_formatData` | private |
| `_getRowByKey` | private |
| `_getTypeMap` | private |
| `_setKeyBinding` | private |
| `_converter` | protected |
| `_getChangesString` | protected |
| `_parseNewItem` | protected |
| `addRow` | public |
| `flatten` | public |
| `getData` | public |
| `getMetadata` | public |
| `getRowNumberByKey` | public |
| `removeRow` | public |
| `setData` | public |
| `toOSFormat` | public |
| `trimSecondsFromDate` | public |
| `updateAddedRowKey` | public |

#### `src/OSFramework/DataGrid/Grid/AbstractGrid.ts` — class `AbstractGrid`
| Method | Visibility |
|---|---|
| `_autoGenCol` | private |
| `_buildColumnsAndTriggerInitializedEvent` | private |
| `_checkForNewColumns` | private |
| `_createObjectFromString` | private |
| `_getKey` | private |
| `_validateBinding` | private |
| `_validateBindings` | private |
| `finishBuild` | protected |
| `addColumn` | public |
| `build` | public |
| `dispose` | public |
| `equalsToID` | public |
| `getColumn` | public |
| `getColumnByIndex` | public |
| `getColumns` | public |
| `getColumnsKeyType` | public |
| `getData` | public |
| `getStructureFromColumnBindings` | public |
| `hasColumn` | public |
| `hasColumnsDefined` | public |
| `hasResults` | public |
| `removeColumn` | public |
| `setData` | public |

#### `src/OSFramework/DataGrid/Event/AbstractEventsManager.ts` — class `AbstractEventsManager`
| Method | Visibility |
|---|---|
| `addHandler` | public |
| `hasHandlers` | public |
| `removeHandler` | public |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/AbstractEvent.ts` — class `AbstractEvent`
| Method | Visibility |
|---|---|
| `addHandler` | public |
| `hasHandlers` | public |
| `removeHandler` | public |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Grid/GridEventsManager.ts` — class `GridEventsManager`
| Method | Visibility |
|---|---|
| `getInstanceOfEventType` | protected |
| `addHandler` | public |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Grid/ValidatingAction.ts` — class `ValidatingAction`
| Method | Visibility |
|---|---|
| `addHandler` | public |
| `hasHandlers` | public |
| `removeHandler` | public |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Column/ColumnEventsManager.ts` — class `ColumnEventsManager`
| Method | Visibility |
|---|---|
| `getInstanceOfEventType` | protected |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Feature/ContextMenuEventManager.ts` — class `ContextMenuEventManager`
| Method | Visibility |
|---|---|
| `getInstanceOfEventType` | protected |
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Grid/AbstractGridEvent.ts` — class `AbstractGridEvent`
| Method | Visibility |
|---|---|
| `trigger` | public |

#### `src/OSFramework/DataGrid/Event/Column/AbstractColumnEvent.ts` — class `AbstractColumnEvent`
| Method | Visibility |
|---|---|
| `trigger` | public |

#### `src/OSFramework/DataGrid/Feature/Auxiliar/RowStyleClassInfo.ts` — class `RowStyleClassInfo`
| Method | Visibility |
|---|---|
| `_addClassName` | private |
| `_handleClassNames` | private |
| `_removeClassName` | private |
| `addClass` | public |
| `removeAllClasses` | public |
| `removeClass` | public |

#### `src/OSFramework/DataGrid/Feature/Auxiliar/CellStyleInfo.ts` — class `CellStyleInfo`
| Method | Visibility |
|---|---|
| `addClass` | public |
| `getCssClassesByBinding` | public |
| `hasCssClass` | public |
| `removeAllClasses` | public |
| `removeClass` | public |

#### `src/OSFramework/DataGrid/Configuration/Column/ColumnConfig.ts` — class `ColumnConfig`
| Method | Visibility |
|---|---|
| `getProviderConfig` | public |
| `updateConfig` | public |

#### `src/OSFramework/DataGrid/Configuration/Column/ColumnConfigGroup.ts` — class `ColumnConfigGroup`
| Method | Visibility |
|---|---|
| `getProviderConfig` | public |
| `updateConfig` | public |

#### `src/OSFramework/DataGrid/Configuration/Grid/FlexGridConfig.ts` — class `FlexGridConfig`
| Method | Visibility |
|---|---|
| `getProviderConfig` | public |

---

#### `src/Providers/DataGrid/Wijmo/Grid/FlexGrid.ts` — class `FlexGrid`
| Method | Visibility |
|---|---|
| `_safari14workaround` | private |
| `_buildColumns` | private |
| `_clearDataSourceByKeys` | private |
| `_getProviderConfig` | private |
| `_updateColumnWidth` | private |
| `addColumn` | public |
| `build` | public |
| `buildFeatures` | public |
| `changeColumnProperty` | public |
| `changeProperty` | public |
| `clearAllChanges` | public |
| `clearAllChangesByRowKeys` | public |
| `clearChanges` | public |
| `dispose` | public |
| `getChangesMade` | public |
| `getViewLayout` | public |
| `setCellError` | public |
| `setViewLayout` | public |

#### `src/Providers/DataGrid/Wijmo/Grid/ProviderDataSource.ts` — class `ProviderDataSource`
| Method | Visibility |
|---|---|
| `_getDirtyEditedItems` | private |
| `addRow` | public |
| `build` | public |
| `clear` | public |
| `flatten` | public |
| `getProviderDataSource` | public |
| `hasResults` | public |
| `search` | public |
| `setData` | public |

#### `src/Providers/DataGrid/Wijmo/Grid/RowMetadata.ts` — class `RowMetadata`
| Method | Visibility |
|---|---|
| `_getRowMetadataByRowKey` | private |
| `_getRowMetadataByRowNumber` | private |
| `_getRowMetadataInRow` | private |
| `_hasMetadataByRow` | private |
| `_hasMetadataByRowKey` | private |
| `_hasMetadataByRowNumber` | private |
| `clear` | public |
| `clearByRow` | public |
| `clearProperty` | public |
| `clearPropertyByRow` | public |
| `clearPropertyByRowKey` | public |
| `clearPropertyByRowNumber` | public |
| `getMetadataByRowKey` | public |
| `getMetadataByRowNumber` | public |
| `getMetadataInRow` | public |
| `getRowIndexByKey` | public |
| `hasOwnPropertyByRow` | public |
| `hasOwnPropertyByRowKey` | public |
| `hasOwnPropertyByRowNumber` | public |
| `setMetadataByRow` | public |
| `setMetadataByRowKey` | public |
| `setMetadataByRowNumber` | public |

---

#### `src/Providers/DataGrid/Wijmo/Columns/AbstractProviderColumn.ts` — class `AbstractProviderColumn`
| Method | Visibility |
|---|---|
| `_getVisibility` | protected |
| `applyConfigs` | public |
| `build` | public |
| `dispose` | public |

#### `src/Providers/DataGrid/Wijmo/Columns/AbstractProviderColumnEditor.ts` — class `AbstractProviderColumnEditor`
| Method | Visibility |
|---|---|
| `applyConfigs` | public |
| `build` | public |
| `changeProperty` | public |
| `dispose` | public |

#### `src/Providers/DataGrid/Wijmo/Columns/ActionColumn.ts` — class `ActionColumn`
| Method | Visibility |
|---|---|
| `getProviderConfig` | public |
| `handleActionEvent` | public |

#### `src/Providers/DataGrid/Wijmo/Columns/CalculatedColumn.ts` — class `CalculatedColumn`
| Method | Visibility |
|---|---|
| `_setDecimalPlaces` | private |
| `_setFormat` | private |
| `build` | public |
| `changeProperty` | public |

#### Concrete column classes
| Class | File | Methods |
|---|---|---|
| `CheckboxColumn` | CheckboxColumn.ts | (inherits AbstractProviderColumn) |
| `CurrencyColumn` | CurrencyColumn.ts | `_setFormat` (protected), `changeProperty` (public) |
| `DateColumn` | DateColumn.ts | `build` (public), `changeProperty` (public) |
| `DateTimeColumn` | DateTimeColumn.ts | `build` (public), `changeProperty` (public) |
| `DropdownColumn` | DropdownColumn.ts | `applyState`, `close`, `shouldAddAsChildAction`, `_parentCellValueChangeHandler`, `_parentHandler`, `applyConfigs`, `build`, `changeDisplayValues`, `changeProperty` |
| `GroupColumn` | GroupColumn.ts | `_getCollapsedToBinding`, `addChild`, `applyConfigs`, `dispose`, `getProviderConfig`, `removeChild` |
| `ImageColumn` | ImageColumn.ts | `getProviderConfig`, `handleActionEvent` |
| `NumberColumn` | NumberColumn.ts | `_setEditorFormat`, `_setMaxValue`, `_setMinValue`, `_setFormat` (protected), `build`, `changeProperty` |
| `TextColumn` | TextColumn.ts | (inherits AbstractProviderColumn) |

---

#### Feature classes under `src/Providers/DataGrid/Wijmo/Features/`

| Class | File | Public methods |
|---|---|---|
| `AutoRowNumber` | AutoRowNumber.ts | `build`, `setStartIndex`, `setState` |
| `CalculatedField` | CalculatedField.ts | `addFormula`, `build`, `removeFormula` |
| `CellData` | CellData.ts | `build`, `setCellData` |
| `CellDataSanitizer` | CellDataSanitizer.ts | `build`, `disableCellDataSanitizer`, `enableCellDataSanitizer`, `escapeCsvInjection` |
| `CellStyle` | CellStyle.ts | `addClass`, `build`, `clear`, `getMetadata`, `hasMetadata`, `removeAllClasses`, `removeClass` |
| `ClickEvent` | ClickEvent.ts | `build`, `dispose`, `removeCellClickEvent`, `setCellClickEvent` |
| `Column` | Column.ts | `build`, `getColumnsOrder`, `setColumnHeader` |
| `ColumnAggregate` | ColumnAggregate.ts | `addClass`, `build`, `dispose`, `removeClass`, `setConditionalFormat`, `setState` |
| `ColumnCellMerging` | ColumnCellMerging.ts | `build`, `mergeColumnCells` |
| `ColumnFilter` | ColumnFilter.ts | `applyState`, `close`, `activate`, `build`, `byCondition`, `byValue`, `changeFilterType`, `clear`, `deactivate`, `dispose`, `getViewLayout`, `setColumnFilterOptions`, `setState`, `setViewLayout`, `validateAction` |
| `ColumnFreeze` | ColumnFreeze.ts | `build`, `byActiveSelection`, `bySelection`, `firstColumn`, `getViewLayout`, `leftColumns`, `setViewLayout`, `unfreeze` |
| `ColumnPicker` | ColumnPicker.ts | `applyState`, `close`, `getMergedRange`, `build`, `dispose`, `handleColumnPickerChangeEvent`, `setShowHiddenColumns` |
| `ColumnResize` | ColumnResize.ts | `build`, `setState` |
| `ColumnSort` | ColumnSort.ts | `applyState`, `close`, `build`, `clear`, `getViewLayout`, `isColumnSorted`, `setState`, `setUnsortState`, `setViewLayout`, `sortColumn`, `validateAction` |
| `ConditionalFormat` | ConditionalFormat.ts | `addAggregateRules`, `addRules`, `build`, `removeRules` |
| `ContextMenu` | ContextMenu.ts | `addMenuItem`, `addMenuItemSeparator`, `build`, `changeProperty`, `dispose`, `removeMenuItem` |
| `DirtyMark` | DirtyMark.ts | `build`, `clear`, `clearByRowKeys`, `clearPropertyInRow`, `clearPropertyInRowByKey`, `getMetadata`, `getOldValue`, `hasMetadata`, `isRowDirty`, `saveOriginalValue` |
| `Export` | Export.ts | `build`, `customizeExportingMessage`, `exportFormatItem`, `exportToClipboard`, `exportToCsv`, `exportToExcel` |
| `FeatureBuilder` | FeatureBuilder.ts | `build` (×2), `dispose` |
| `GridReorder` | GridReorder.ts | `build`, `setState`, `toggleRowDragging` |
| `GroupPanel` | GroupPanel.ts | `applyState`, `close`, `addColumnsToGroupPanel`, `build`, `columnInGroupPanel`, `dispose`, `getViewLayout`, `removeColumnsFromGroupPanel`, `setAggregate`, `setViewLayout`, `validateAction` |
| `Pagination` | Pagination.ts | `applyState`, `close`, `build`, `changePageSize`, `createPageButtons`, `dispose`, `executeAction`, `getValueByLabel`, `moveToFirstPage`, `moveToLastPage`, `moveToNextPage`, `moveToPage`, `moveToPreviousPage`, `registerLabel` |
| `RowHeader` | RowHeader.ts | `build` |
| `Rows` | Rows.ts | `applyState` (×2), `addClass`, `addNewRows`, `build`, `clear`, `getMetadata`, `getRowData`, `hasMetadata`, `removeAllClasses`, `removeClass`, `removeRowsByNumberOrKey`, `removeSelectedRows` |
| `Search` | Search.ts | `build`, `dispose`, `searchData` |
| `Selection` | Selection.ts | `build`, `clear`, `contains`, `equalizeSelection`, `getActiveCell`, `getAllSelections`, `getAllSelectionsData`, `getCheckedRowsData`, `getMetadata`, `getProviderAllSelections`, `getSelectedRows`, `getSelectedRowsCount`, `getSelectedRowsCountByCellRange`, `getSelectedRowsData`, `getSelectionAverage`, `getSelectionCellCount`, `getSelectionCount`, `getSelectionMaxMin`, `getSelectionSum`, `hasCheckedRows`, `hasMetadata`, `hasSelectedRows`, `hasValidSelection`, `selectAndFocusFirstCell`, `setRowAsSelected`, `setState` |
| `Styling` | Styling.ts | `addColumnCssClass`, `build`, `changeRowHeight`, `removeColumnCssClass`, `setColumnWordWrap` |
| `TabNavigation` | TabNavigation.ts | `build`, `setState` |
| `ToolTip` | ToolTip.ts | `build`, `dispose`, `setColumnGroupHeaderTooltip` |
| `UndoStack` | UndoStack.ts | `build`, `clear`, `pushAction`, `redoAll`, `startAction`, `undoAll` |
| `ValidationMark` | ValidationMark.ts | `build`, `clear`, `clearByRowKeys`, `errorMessage`, `getMetadataByRow`, `getMetadataByRowKey`, `getMetadataByRowNumber`, `hasMetadataByRow`, `hasMetadataByRowKey`, `hasMetadataByRowNumber`, `isInvalid`, `isInvalidRow`, `isInvalidRowByKey`, `setCellStatus`, `setCellStatusByKey`, `setRowStatus`, `setRowStatusByNumber`, `validateCell`, `validateRow` |
| `View` | View.ts | `build`, `getViewLayout`, `setViewLayout` |

**Private event-handler methods** (all files above): included — same `Log(LogLevel.Debug, ...)` pattern, with handler params as `extraParams`.

**Total class methods across all files**: ~350+

---

## Log Level Behaviour Summary

| Active level | Guard cost | `name` shown | `extraParams` shown |
|---|---|---|---|
| None  | 1 int compare, return | — | — |
| Error | 1 int compare, return (for Info/Debug calls) | Error only | never |
| Info  | 1 int compare, return (for Debug calls) | Error + Info | never |
| Debug | passes guard | all levels | always |

Timestamp format: `[2026-05-12T10:23:45.123456Z] [LEVEL] name`
(6 decimal places = microsecond-range precision via `performance.timeOrigin + performance.now()`)

---

## Verification

1. `npm run build` — must pass (restoring `warningMessage` fixes the compile)
2. In a browser console:
   ```js
   OutSystems.UI.GridLogging.GetLogLevel();      // → 0 (None, default)
   OutSystems.UI.GridLogging.SetLogLevel(1);     // Error
   // Trigger an error path → [ts] [Error] name (no extra params)
   OutSystems.UI.GridLogging.SetLogLevel(3);     // Debug
   // Trigger any grid API call → entry/exit lines with args + duration appear
   location.reload();
   OutSystems.UI.GridLogging.GetLogLevel();      // → 3 (persisted)
   OutSystems.UI.GridLogging.Log(2, "test");              // → [ts] [Info] test
   OutSystems.UI.GridLogging.Log(2, "test", { id: 1 });   // → [ts] [Info] test {id:1}
   OutSystems.UI.GridLogging.SetLogLevel(0);     // back to silent
   ```
3. Confirm `localStorage.getItem('outsystems-grid-logLevel')` persists across reload.
4. Confirm no bare `console.log/warn/error` remain in `src/` outside `LogMessage.ts` (grep check).
