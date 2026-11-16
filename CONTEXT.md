# OutSystems Data Grid

The browser-side grid wrapper around the Wijmo FlexGrid library, plus the .NET extension that
prepares server-side data for it. This glossary fixes the terms used when talking about the grid, its
third-party library, and the artifacts an upgrade touches.

## Language

### The third-party library

**Wijmo**:
The third-party FlexGrid library the provider layer wraps. Vendor is MESCIUS (formerly GrapeCity).
_Avoid_: FlexGrid on its own (that is one control within Wijmo), GrapeCity

**Build string**:
The exact Wijmo build identifier, e.g. `5.20261.52`. The only value that uniquely identifies a
release; every asset carries it in a file header.
_Avoid_: version, version number

**Version description**:
The human-readable release label that pairs a marketing name with a build string, e.g.
`2026v1-Hotfix Wijmo - Build 5.20261.52`.
_Avoid_: version name, release name

**Wijmo bundle**:
One distributable unit of the Wijmo library, e.g. `wijmo.grid`, `wijmo.xlsx`, `wijmo.input`. Ships as
a `.min.js` runtime file and a matching `.d.ts`.
_Avoid_: module, Wijmo module, script

**Culture script**:
The per-language localization file for a Wijmo bundle, e.g. `wijmo.culture.pt.min.js`. There are 50.
_Avoid_: language file, locale file, translation

### Where assets come from

**Distribution archive**:
The Wijmo release ZIP obtained from the vendor or the Jira ticket attachment. The only source for the
global-flavor type definitions, the unminified stylesheet, and the minified runtime.
_Avoid_: zip, download, release package

**npm package**:
The `wijmo` entry in `package.json`. Declares the dependency so tooling and SCA scans can see it; it
is not a source for any file the repository or the OutSystems module carries.
_Avoid_: module, npm module, dependency package

**Vendored types**:
The global-namespace `.d.ts` set tracked under `src/@types/wijmo-<build string>/`. Copied verbatim
from the distribution archive, never authored.
_Avoid_: typings, type defs, @types

### The OutSystems side

**OutSystems module**:
An OutSystems eSpace, exported as an `.oml` file. The one that carries the grid's runtime assets is
`OutSystemsDataGrid`.
_Avoid_: module on its own, espace, app

**Per-branch module**:
A hand-made clone of the OutSystems module, named after a task branch, used to validate a change
before it reaches the released module.
_Avoid_: branch module, test module, dev module

**Changeset**:
A JSON document describing object replacements to apply to an OutSystems module offline, via the
OutSystems CLI.
_Avoid_: patch, diff, migration

**Reactive Data Grid**:
The Data Grid component for Reactive Web, built from this repository.
_Avoid_: Data Grid on its own when Web is also in play, DataGrid Reactive

**Web Data Grid**:
The separate Data Grid component for Traditional Web, built from `outsystems-datagrid-web`. Tracks
its own, much older Wijmo build string.
_Avoid_: DataGrid Web, Traditional Grid

### Documentation targets

**SBOM row**:
The row naming this component's Wijmo build string in the Confluence software bill of materials for
external libraries.
_Avoid_: version table, libraries page entry

**Upgrade runbook**:
The team-facing procedure for performing a Wijmo upgrade. There must be exactly one.
_Avoid_: upgrade page, how-to, guide
