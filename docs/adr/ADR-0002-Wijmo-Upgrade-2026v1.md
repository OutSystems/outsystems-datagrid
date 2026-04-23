# ADR-0002: Wijmo Upgrade to 2026v1 (Build 5.20261.50)

## Status

Accepted

## Context

The OutSystems Data Grid wraps Wijmo FlexGrid (see [ARCHITECTURE.md](../../ARCHITECTURE.md) T2 — Provider Isolation). The codebase was pinned to Wijmo `2025v2.1` (Build `5.20252.44`), with vendored type definitions under `src/@types/wijmo-5.20252.44/`. MESCIUS has released `2026v1` (Build `5.20261.50`), which brings bug fixes, new APIs, and updated type definitions across the grid, chart, input, PDF, and XLSX modules.

Keeping the provider on a current release reduces long-term drift, unblocks consumers that need recent Wijmo features, and ensures the vendored TypeScript definitions stay aligned with the runtime shipped by OutSystems.

## Decision Drivers

- Maintain alignment with the upstream Wijmo release cadence to benefit from bug fixes and security updates.
- Keep vendored `.d.ts` files in sync with the Wijmo runtime used at execution time — mismatched types silently mask API breakage.
- Avoid accumulating multiple major versions of technical debt between upgrades.
- Track the installed version explicitly via `package.json` so tooling (and Dependabot / SCA scans) can see the dependency.

## Considered Options

- Option 1: Stay on `5.20252.44`.
    - Pros: Zero upgrade effort, no regression risk.
    - Cons: Falls further behind upstream; consumers miss fixes; future upgrade becomes larger.
- Option 2: Upgrade to `2026v1` (Build `5.20261.50`) and refresh the vendored type definitions only.
    - Pros: Small, focused change; isolated to the provider layer and types; easy to review.
    - Cons: Does not declare `wijmo` as an npm dependency, so the version remains implicit.
- Option 3: Upgrade to `2026v1`, refresh vendored types, **and** add `wijmo` as an explicit `devDependency` in `package.json`.
    - Pros: Addresses drift, makes the version explicit for tooling and humans, single source of truth.
    - Cons: Slightly larger diff, but all changes are mechanical type refreshes.

## Decision Outcome

Chosen option: **"Option 3"**, because it keeps the provider current while also making the Wijmo version a first-class, declared dependency.

Positive consequences:

- `src/OSFramework/DataGrid/Constants.WijmoFlexGridVersion` now reports `"2026v1 Wijmo - Build 5.20261.50"`, so the runtime version badge matches what is shipped.
- Vendored type definitions moved from `src/@types/wijmo-5.20252.44/` to `src/@types/wijmo-5.20261.50/`, keeping compile-time types aligned with the Wijmo runtime.
- `styles/wijmo.css` refreshed to match the new release.
- `wijmo: ^5.20261.50` added as a `devDependency` in `package.json`, giving tooling and contributors a visible record of the version in use.
- Provider-layer code (`src/Providers/DataGrid/Wijmo/`) continues to compile unchanged against the new types, confirming the public surface we consume is backward compatible for this release.

Negative consequences:

- Contributors working with stale branches will need to re-resolve imports that reference the old `wijmo-5.20252.44` type path.
- Any future deviation between the installed `wijmo` package and the vendored `.d.ts` files must be kept in lock-step on each upgrade.
- **Hidden tightening of the `trackChanges` contract.** `CollectionView` in 5.20261.50 wraps every bound item in a `Proxy` (change tracking switched from clone-and-diff to live-proxy, as evidenced by the new `_storeTrackChanges`, `_stopTrackChanges`, `_restoreTrackChanges` members on the type surface). Non-object items in `sourceCollection` (primitives, `null`, array holes) that 5.20252.44 silently rendered as empty cells now throw `TypeError: Cannot create proxy with a non-object as target or handler` at bind time. Any upstream consumer that was implicitly relying on the forgiving behaviour will surface as a regression after the upgrade — see follow-up below.

## Follow-up — ROU-12689 regression

Post-upgrade, the `ServerPagination` sample started throwing at every page change. Root cause investigation ([ROU-12689-server-pagination-regression.md](../ROU-12689-server-pagination-regression.md)) concluded:

1. The error surfaces in Wijmo's new proxy path (`_addBoundRow → _createItemProxy → new Proxy(item, handler)`), but the malformed data feeding it originates server-side in the `.NET` extension.
2. [`extension/DataGridUtils/Source/NET/temp_ardoJSON.cs`](../../extension/DataGridUtils/Source/NET/temp_ardoJSON.cs) carried a long-standing order-sensitive flatten heuristic in its `IOSList` branch that inspected only the *first* `ss`-field of aggregate rows. The .NET Framework 4.7.2 recompile introduced by [ADR-0001](ADR-0001-Extension-Dotnet-Upgrade-And-Improvements.md) flipped `Type.GetFields()` reflection order on multi-entity aggregate rows, which caused the heuristic to start collapsing those rows to a list of scalars.
3. Under 5.20252.44 the corrupted payload rendered as blank cells; under 5.20261.50 it throws at bind time.

Fixes landed with this ADR's rollout window:

- **`extension/DataGridUtils/Source/NET/temp_ardoJSON.cs`** — flatten now requires *exactly one* `ss`-field on the row AND *exactly one* attribute on its inner record. Order-independent; preserves the legacy `[{ssENX: X}]` one-wrapper contract.
- **`extension/tests/ConvertData2JSONTests.cs`** — three regression tests pin the behaviour for both ss-field declaration orderings plus the legacy single-wrapper shape.
- **`src/OSFramework/DataGrid/Grid/AbstractDataSource.ts`** — defensive filter in `setData` drops non-object rows and emits `console.warn`, restoring the pre-upgrade "tolerate garbage, render empty" contract for any third-party consumer that feeds malformed data into the grid.

The Wijmo upgrade itself is not reverted or softened — its stricter bind-time validation is a net positive and surfaces data-shape problems that used to hide behind blank cells.

## Links

- `package.json` — added `wijmo ^5.20261.50` as a `devDependency`.
- `src/OSFramework/DataGrid/Constants.ts` — updated `WijmoFlexGridVersion` string.
- `src/@types/wijmo-5.20261.50/` — refreshed vendored Wijmo type definitions (replaces `src/@types/wijmo-5.20252.44/`).
- `styles/wijmo.css` — refreshed Wijmo stylesheet.
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — T2 Provider Isolation, external integrations table.
- [ROU-12689-server-pagination-regression.md](../ROU-12689-server-pagination-regression.md) — full investigation and fix rationale.
- [ADR-0001](ADR-0001-Extension-Dotnet-Upgrade-And-Improvements.md) — .NET 4.7.2 retarget that flipped the reflection ordering and exposed the latent extension bug.

## Date

2026-04-19 (original); 2026-04-23 (follow-up for ROU-12689)
