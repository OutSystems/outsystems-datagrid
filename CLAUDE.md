# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

OutSystems Data Grid wraps Wijmo FlexGrid to deliver enterprise-grade spreadsheet functionality in OutSystems Reactive Web applications. The repository contains TypeScript code (browser-side grid wrapper) and a .NET extension (server-side data preparation).

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the five architectural tenets and external integrations table.

See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for branch naming (`ROU-12345`), PR requirements (2 approvals, label-based validation), and code standards.

## Quick Command Reference

| Command            | Purpose                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `npm run setup`    | Install dependencies and start development mode                       |
| `npm run build`    | Production build + lintfix + lint (must pass without errors/warnings) |
| `npm run dev`      | Start development mode with browser-sync on port 3000                 |
| `npm run lint`     | Check TypeScript code style (ESLint)                                  |
| `npm run lintfix`  | Auto-fix ESLint issues                                                |
| `npm run prettier` | Format all JS/TS/CSS files                                            |
| `npm run docs`     | Generate TypeDoc documentation                                        |

## Repository Structure

```
src/
├── OSFramework/DataGrid/    - Provider-agnostic abstractions (interfaces, events, features)
├── Providers/DataGrid/Wijmo/ - Wijmo-specific implementations
├── OutSystems/GridAPI/       - Public JavaScript API for OutSystems apps
└── @types/wijmo-5.20252.44/  - Wijmo type definitions

extension/DataGridUtils/
├── Source/NET/               - .NET extension implementation (edit here)
├── Templates/NET/            - Auto-generated Integration Studio stubs (do not edit)
└── tests/                    - Standalone .NET test project

gulp/                         - Build orchestration tasks
dist/                         - Compiled output (GridFramework.js)
docs/adr/                     - Architecture Decision Records
```

Run `find src/OSFramework/DataGrid -type f -name "*.ts"` to explore framework layer files.
Run `find src/Providers/DataGrid/Wijmo -type f -name "*.ts"` to explore Wijmo provider files.

## TypeScript Architecture

**Namespace-based layer boundaries:** The codebase compiles all TypeScript to a single AMD module (`dist/GridFramework.js`) without ES6 imports. Namespace hierarchy enforces layer separation:

- `OutSystems.GridAPI` - Public API layer; orchestrates grid lifecycle
- `OSFramework.DataGrid` - Framework abstractions; provider-agnostic contracts
- `Providers.DataGrid.Wijmo` - Wijmo-specific implementations

See [ARCHITECTURE.md](./ARCHITECTURE.md) T1 (provider abstraction through interfaces) and T2 (namespace-based layer enforcement).

**Feature composition:** Grid capabilities (export, pagination, filtering, sorting, sanitization) are implemented as composable feature objects aggregated by `OSFramework.DataGrid.Feature.ExposedFeatures` rather than extending grid classes. See [ARCHITECTURE.md](./ARCHITECTURE.md) T3.

**Key patterns:**

- Factory: `Providers.DataGrid.Wijmo.Grid.GridFactory.MakeGrid` creates concrete grid instances
- Abstract base classes: `OSFramework.DataGrid.Column.AbstractColumn` defines column behavior independent of provider
- Interface contracts: `OSFramework.DataGrid.Grid.IGrid` defines grid API without provider knowledge

## .NET Extension Context

The DataGridUtils extension converts OutSystems entities/structures to JSON with embedded metadata.

**Key files under `extension/DataGridUtils/Source/NET/`:**

- `Interface.cs` - Public API (`IssDataGridUtils.MssConvertData2JSON`)
- `DataGridUtils.cs` - Implementation; bundles data + metadata into `{"data": ..., "metadata": ...}`
- `ObtainMetadata.cs` - Reflection-based schema extraction
- `temp_ardoJSON.cs` - Forked JSON serializer with smart ISO 8601 dates

**Testing:** Run tests from `extension/tests/DataGridUtils.Tests.csproj` (console app with mock OutSystems types).

**Conventions:**

- OutSystems fields use `ss` prefix (simple), `ssEN` (entity), `ssST` (structure) — stripped in JSON output
- `Byte[]` fields excluded from data and metadata
- DateTime format: `1900-01-01 00:00:00` → empty string, date-only → `yyyy-MM-dd`, full → UTC ISO 8601

See `.cursor/rules/project-context.mdc` for detailed extension context.

## Code Style (Enforced by ESLint)

**Naming conventions:**

- Exported functions/classes: `StrictPascalCase`
- Interfaces: `IStrictPascalCase` or `IUPPER_CASE` (prefix with `I`)
- Private properties/methods: `_strictCamelCase` (leading underscore required)
- Public/protected properties/methods: `strictCamelCase` (no underscore)

**Member ordering in classes:** signature → private fields → protected fields → public fields → constructor → private methods → protected methods → public methods → abstract methods (alphabetically within each category)

**Formatting:** Tabs (width 4), single quotes, semicolons required, 120 char line width.

Run `npm run lintfix` to auto-fix style issues before committing.

## Wijmo Provider Context

This codebase wraps Wijmo FlexGrid (external library). Key Wijmo capabilities leveraged:

- **Virtual rendering** - Fast display of large datasets via row/column virtualization
- **Multi-panel architecture** - Separate panels for data cells, column headers, row headers, footers
- **itemsSource/collectionView** - Data binding with currency tracking and editing support
- **Selection API** - Cell ranges, row selection via `selection`, `selectedItems`, `selectedRows`
- **Editing lifecycle** - `startEditing`, `finishEditing`, `itemValidator` for validation
- **Clipboard operations** - `getClipString`, `copied`, `pasted` events

When modifying provider layer code (`src/Providers/DataGrid/Wijmo/`), consult Wijmo FlexGrid documentation at https://developer.mescius.com/wijmo/api/classes/Wijmo_Grid.Flexgrid.html for API details.

## Important Context

**Security boundaries:** Input sanitization occurs at two distinct points:

1. When data enters grid from OutSystems - HTML escaping (`OSFramework.DataGrid.Helper.Sanitize`)
2. When data exits via clipboard/export - CSV injection prevention (`Providers.DataGrid.Wijmo.Features.CellDataSanitizer`)

The cell data sanitizer feature can be controlled at runtime via the public API:

- `OutSystems.GridAPI.Security.EnableCellDataSanitizer(gridID)` - Enable CSV injection protection
- `OutSystems.GridAPI.Security.DisableCellDataSanitizer(gridID)` - Disable CSV injection protection

See [ARCHITECTURE.md](./ARCHITECTURE.md) T5 (security through sanitization layers) for defense-in-depth rationale.

**Data transformation strategy:** Complex data preparation (OutSystems records → JSON with metadata) happens server-side via .NET extension before reaching browser. Client-side code focuses on presentation logic. See [ARCHITECTURE.md](./ARCHITECTURE.md) T4.

**Branch strategy:** Work on `dev` branch. Create feature branches named `ROU-12345` (JIRA ticket ID). Commits must include ticket ID: `ROU-12345: Add feature description`.

**PR requirements:** Title format `ROU-12345: Description`, must have label (`feature`/`bug`/`chore`), 1 approval required. See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for complete PR process and label requirements.

**ADRs available:** See `docs/adr/` for Architecture Decision Records. Currently documented: ADR-0001 (Extension .NET Upgrade).

**Test automation:** The grid has a separate test repository at https://github.com/OutSystems/outsystems-datagrid-tests (WebdriverIO + Cucumber for browser testing). It's checked out locally at `../outsystems-datagrid-tests`. See [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for testing context.

## Development Workflow

1. Check out branch from `dev`: `git checkout -b ROU-12345`
2. Make changes to TypeScript (`src/`) or .NET (`extension/DataGridUtils/Source/NET/`)
3. For TypeScript: Run `npm run build` (must pass without errors/warnings)
4. For .NET: Open `DataGridUtils.sln` in `extension/DataGridUtils/Source/NET/` with Visual Studio, build targeting .NET Framework 4.7.2
5. Test locally (TypeScript: `npm run dev` starts browser-sync; .NET: run console tests)
6. Create PR to `dev` with JIRA ticket ID in title

**Do not modify:**

- `extension/DataGridUtils/Templates/NET/` - Auto-generated by Integration Studio
- Wijmo library files in `@types/wijmo-5.20252.44/`

## Useful Resources

- **Living documentation:** https://outsystemsui.outsystems.com/OutSystemsDataGridSample/
- **Forge component - O11:** https://www.outsystems.com/forge/component-overview/9764/outsystems-data-grid-o11
- **Forge component - ODC:** https://www.outsystems.com/forge/component-overview/15929/outsystems-data-grid-odc
- **Sample app:** https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive
- **Video tutorial:** https://www.youtube.com/watch?v=OFXOPrkRlrI
