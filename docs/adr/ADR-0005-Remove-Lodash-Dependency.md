# ADR-0005: Remove Lodash Dependency

## Status

Accepted

## Context

The OutSystems Data Grid TypeScript codebase depended on [Lodash](https://lodash.com/) (`lodash@4.18.1`) as a `devDependency`, with its type definitions provided by `@types/lodash`. Lodash was never bundled into the shipped `dist/GridFramework.js` — it was globally available at runtime by being loaded by the OutSystems Datagrid module. The library was referenced in the project via the `_` global in 13 files across 23 call sites.

The dependency introduced two distinct risks:

1. **Security exposure.** Lodash has accumulated a history of high-severity CVEs (prototype pollution, ReDoS). Each new Lodash vulnerability required triage and version-pinning work even though the functions actually used in this codebase are all straightforwardly replaceable with native JavaScript.
2. **Unnecessary surface area.** All 9 Lodash functions used (`_.chunk`, `_.cloneDeep`, `_.get`, `_.set`, `_.isObject`, `_.omit`, `_.findLast`, `_.toArray`, `_.isEqualWith`) have direct, idiomatic native equivalents available in ES2020+, which is the compilation target of this project.

## Decision Drivers

-   Eliminate the Lodash CVE attack surface permanently rather than tracking versions reactively.
-   Reduce the number of external dependencies the project needs to maintain.
-   Avoid shipping a third-party library global (`_`) whose presence at runtime depended on OutSystems module configuration outside this repository.
-   All Lodash functions in use were replaceable with native JavaScript or small, self-contained utility functions requiring no new dependencies.

## Considered Options

-   **Option 1: Keep Lodash and Upgrade it to the latest version.**

    -   Pros: Zero refactoring effort, no risk of behavioural divergence.
    -   Cons: Does not address the security surface; still requires runtime presence of a global; keeps a dependency that adds no capability over native ES2019.

-   **Option 2: Replace Lodash with a lighter-weight alternative (e.g., `lodash-es`, `just-*` micro-packages).**

    -   Pros: Smaller bundle, better tree-shaking.
    -   Cons: Still introduces an external dependency and a global variable requirement; the functions needed are available natively.

-   **Option 3: Remove Lodash entirely and replace all usages with native JavaScript and small utility functions.**
    -   Pros: No external dependency, no CVE surface, no runtime global required, fully self-contained.
    -   Cons: Requires touching 13 files; some replacements (nested path access, deep clone) need new utility functions.

## Decision Outcome

Chosen option: **"Option 3"**, because it permanently removes the dependency and its security surface without sacrificing any capability — every Lodash function in use has a direct, well-understood native equivalent.

Positive consequences:

-   `lodash` and `@types/lodash` removed from `package.json` `devDependencies`.
-   No Lodash CVEs can affect this codebase going forward.
-   The runtime no longer requires Lodash to be present as an OutSystems module resource.
-   Four reusable utility functions (`GetByPath`, `SetByPath`, `DeepClone`, `Omit`) added to `OSFramework.DataGrid.Helper` (`src/OSFramework/DataGrid/Helper/Utils.ts`), typed without `any`.
-   TypeScript target upgraded from `ES2019` to `ES2020`, enabling native emission of `?.` optional chaining and `??` nullish coalescing — used to simplify `GetByPath` and `SetByPath` respectively.
-   `Omit` includes a null guard (`if (!obj) return {}`) for defensive safety when called with an uninitialised row.
-   Incidental improvement: `BatchArray`, `addRow` (interface + implementations), and `IDataSource.addRow` had incorrect `JSON` type annotations (referring to the global `JSON` object interface, not a plain data object). These were corrected to `object[]` during the migration.

Negative consequences:

-   `DeepClone` calls `structuredClone()` and falls back to `JSON.parse(JSON.stringify())` if it throws (e.g. if a non-transferable value such as a function were passed). The fallback loses `Date` precision (serialised to ISO strings) and drops `undefined` properties. All current cloning sites operate on plain OutSystems JSON data rows, so the fallback is never exercised in practice — but callers must not pass non-serialisable objects.

## Replacement Map

| Lodash function | Native / utility replacement                  | Locations changed                                                                        |
| --------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `_.chunk`       | `Array.from` with slice math                  | `Helper/Utils.ts`                                                                        |
| `_.cloneDeep`   | `Helper.DeepClone` (`structuredClone`)        | `AbstractDataSource.ts`, `ActionColumn.ts`, `ImageColumn.ts`, `ClickEvent.ts`, `Rows.ts` |
| `_.get`         | `Helper.GetByPath` (dot-notation reducer)     | `AbstractDataSource.ts`, `RowMetadata.ts`, `FlexGrid.ts`                                 |
| `_.set`         | `Helper.SetByPath` (dot-notation writer)      | `AbstractDataSource.ts`                                                                  |
| `_.isObject`    | `typeof x === 'object' && x !== null`         | `AbstractDataSource.ts`, `ValidationMark.ts`                                             |
| `_.omit`        | `Helper.Omit` (`Object.fromEntries` + filter) | `AbstractDataSource.ts`, `Rows.ts`                                                       |
| `_.findLast`    | `arr.slice().reverse().find()`                | `ColumnManager.ts`, `GridManager.ts`                                                     |
| `_.toArray`     | `Array.from`                                  | `AbstractColumn.ts`                                                                      |
| `_.isEqualWith` | Inline custom comparison                      | `DirtyMark.ts`                                                                           |

## Links

-   Jira: [ROU-10907](https://outsystemsrd.atlassian.net/browse/ROU-10907)
-   `src/OSFramework/DataGrid/Helper/Utils.ts` — new utility functions `GetByPath`, `SetByPath`, `DeepClone`, `Omit`; `BatchArray` signature corrected.
-   `src/OSFramework/DataGrid/Interface/IDataSource.ts` — `addRow` signature corrected from `JSON[]` to `object[]`.
-   `src/OSFramework/DataGrid/Grid/AbstractDataSource.ts` — 8 Lodash call sites replaced.
-   `src/Providers/DataGrid/Wijmo/Grid/ProviderDataSource.ts` — `addRow` signature corrected.
-   `package.json` — `lodash` and `@types/lodash` removed.

## Date

2026-06-02 (initial); 2026-06-08 (ES2020 target upgrade, `DeepClone` fallback, `Omit` null guard)
