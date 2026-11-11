# ADR-0009: Wijmo Upgrade to 2026v2-MAJOR (Build 5.20262.60)

## Status

Accepted

## Context

ROU-13118 moves the Wijmo FlexGrid provider from `2026v1-Hotfix` (Build `5.20261.52`, ADR-0007) to
`2026v2-MAJOR` (Build `5.20262.60`), and the component from `2.24.1` to `2.25.0`.

It is a major release by name, but almost nothing in it reaches FlexGrid. The headline additions are
a new `FlexScheduler` control, a new `MultiLineComboBox`, and accessibility work for FlexChart and
OLAP. The component uses none of them. The release also carries fifteen bug fixes and one breaking
change, so the question this record answers is whether any of it changes what the grid does.

This is the second run of the `upgrade-wijmo-version` skill (ADR-0008). The ticket also asked for the
skill to gain an optional step for a Wijmo product license update. That step was added, and is
described below without its procedure.

## Decision Drivers

-   The declared dependency, the vendored types and the module runtime must name one build (ADR-0007).
-   The repository cannot render a grid, so every behavioural claim must come from a published module
    or from the runtime files themselves.
-   Behaviour must be unchanged except where the release itself changes it, and any such change must
    be named rather than absorbed.
-   Nothing that helps reverse-engineer the product license may be written down anywhere.

## Considered Options

-   **Upgrade with no source change beyond versions, assets and constants** — chosen.
    -   Pros: the release's API additions touch no control this component uses, so there is nothing to
        opt into, and no workaround became removable.
    -   Cons: the one observed behaviour change (typed decimal rounding, below) is absorbed rather than
        controlled. It moves toward consistency, so absorbing it is the right call, but it must be
        announced.
-   **Adopt any of the four API Updates** — rejected; none applies (see below).
-   **Pin `InputNumber` behaviour to the old typed result** — rejected. The old result disagreed with
    paste and with the standalone `InputNumber`, so restoring it would preserve an inconsistency.

## Decision Outcome

**Exact-pin `wijmo` at `5.20262.60`**, refresh the vendored types and stylesheet from the
distribution archive, set both version constants, refresh the module's 64 Wijmo scripts by changeset
with the `WijmoCSS` block stylesheet done by hand, and change no grid source.

### Dependency and assets

`wijmo` is pinned exactly at `5.20262.60` in `devDependencies`. The reasoning is ADR-0007's:
`package-lock.json` is gitignored, so a range would let CI drift away from the vendored types.

All assets come from the distribution archive. The npm package ships the ES-module `.d.ts` flavour
and no `.min.js`.

| Asset                                   | Source                                       |
| --------------------------------------- | -------------------------------------------- |
| 45 of the 47 vendored root `.d.ts`      | `Dist/controls`                              |
| `wijmo.meta.d.ts` (global flavour)      | `Dist/interop/meta`                          |
| 50 culture `.d.ts`                      | `Dist/controls/cultures`                     |
| unminified `wijmo.css` (5 489 lines)    | `Dist/styles`, BOM removed                   |
| 13 + 50 `.min.js` for the module        | `Dist/controls`, `Dist/controls/cultures`    |

`wijmo.interop.grid.d.ts` again comes from npm verbatim and stays ES-module flavour. The archive has
no global-flavour copy, and the file is referenced nowhere in `src/`. The new
`src/@types/wijmo-5.20262.60/` has the same file names as its predecessor in both directions, 47 root
files plus 50 cultures. The archive ships no JSZip, so `JsZIP` stays at `3.10.1`.

### Version constants

`WijmoFlexGridVersion` becomes `2026v2-MAJOR Wijmo - Build 5.20262.60`. `OSDataGridVersion`,
`package.json` and `gulp/DefaultSpecs.js` become `2.25.0`, set through `gulp gtaSetVersion`. They
were already aligned, so the tool's silent-no-op failure mode (ADR-0007) did not trigger. Its
`README.md` target holds no version heading, so the no-op there is expected.

### New-release review — four API Updates, none adopted

The counts come from the archive's own `ChangeLog.txt`. The ticket's copy was a curated subset: it
listed no *API Updates* or *Bug fixes* section and said "There are no breaking changes in FlexGrid,
CSS, or licensing". Counting from the ticket would have produced zero verdicts.

| API Update                                         | Decision     | Reason                                     |
| -------------------------------------------------- | ------------ | ------------------------------------------ |
| `MultiLineComboBox.inputType` (WJM-37520)          | Not adopted  | Control not used by this component.         |
| FlexChart `ariaLabel`, `focusMode`, … (WJM-37881)  | Not adopted  | FlexChart not used.                         |
| OLAP keyboard and live-region APIs (WJM-37882)     | Not adopted  | OLAP not used.                              |
| FlexScheduler APIs (WJM-37630)                     | Not adopted  | FlexScheduler not used.                     |

Nothing touches FlexGrid, so `FlexGridConfig.getProviderConfig()` is unchanged.

### Breaking changes

| Change                                                         | Assessment                                                       |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Angular wrapper peer dependency raised to `>=20.3.27` (WJM-38021) | **Not applicable.** Plain TypeScript with Gulp; no Angular wrapper. |

### Bug fixes that reach the grid

Absorbed, with no code change: `getCellData` during `cellEditEnding` with `getError` (WJM-37903),
`aria-colindex` no longer counting hidden columns (WJM-38172), the sortable-header announcement
(WJM-38185), the filter search status message (WJM-38186), and caret selection after a synchronous
`select`/`focus`/`startEditing` (WJM-38215).

### WJM-37697 — fixed, and verified

WJM-37697 is the one issue the ticket planned for this version: non-leaf `ColumnGroup`s kept a stale
`index`/`visibleIndex`. **It is fixed in `5.20262.60`.** The fix was verified three ways, not taken
from the changelog:

-   **Vendor code.** `5.20262.60` adds `ColumnGroup.prototype._setList`. It resets `_idx` and
    `_idxVis` to `-1` when a group is detached from the columns list. `5.20261.52` has no such
    override.
-   **Published runtimes.** The override is present in the per-branch module's published
    `WijmoGridJS` and absent from the baseline's.
-   **Reproduction.** The test follows the order `AbstractProviderColumn.build()` uses: insert an
    empty group into `columnGroups`, so it is briefly a leaf column; attach two children with
    `new ColumnGroup(config, parent)`; then add another top-level column.

| After the group gains children     | `5.20261.52`                          | `5.20262.60` |
| ---------------------------------- | ------------------------------------- | ------------ |
| group `index` / `visibleIndex`     | `0` / `0` (stale)                     | `-1` / `-1`  |
| collides with a leaf column        | yes, the first child (`index` `0`)    | no           |

The old result is the collision behind ADR-0004. There, the column lookup sometimes resolved the
edited cell to a group, and `OnCellValueChange` threw "The column Group does not support events".

**No workaround to remove.** ADR-0004 filtered groups out before the index lookup. ROU-12831 then
moved every Wijmo-to-OutSystems column lookup to name matching, so the component no longer depends
on a group's index. Both stay, as defensive code. The remaining `ColumnType.Group` check
(`ValidationMark.ts`, row validation) skips groups because a group cannot be validated, not because
of this defect.

The automation app's `Column_Group` screen does **not** reproduce the stale index on either build.
Its group reports `-1` on load and after collapse and expand, because the component's load order on
that screen never leaves a group briefly as a leaf. The defect only shows in the build order above.
The screen is still the user-level regression check: on `5.20262.60`, editing a cell inside its
group fires `OnCellValueChange` with no error. Test Case 3 in the ticket combines both, the screen
steps and the console reproduction.

### Observed behaviour change — typed decimal rounding

A live "before" was available: the base automation app, confirmed from its published `WijmoJS` to run
`5.20261.52` with component `2.24.0`. The same probe ran on it and on the per-branch app.

| Check                                                | `5.20261.52`        | `5.20262.60`  |
| ---------------------------------------------------- | ------------------- | ------------- |
| XLSX `docProps` (Company, Application, AppVersion)   | `""`, `wijmo.xlsx`, `1.0` | identical |
| Paste `98.7654321` into an `n2` column               | `98.77`             | `98.77`       |
| Standalone `InputNumber` (`n2`), type `12.3456789`   | `12.35`             | `12.35`       |
| Filter-panel buttons (size, colours, border, font)   | 65×34 px …          | identical     |
| **Type `12.3456789` into an `n2` grid cell**         | **`12.34`** (3 runs) | **`12.35`** (3 runs) |

On `5.20261.52`, typing into a grid cell cut the extra digits, while paste and the standalone
`InputNumber` rounded them. On `5.20262.60` all three round. That is a user-visible change, and it
moves toward consistency. The release notes must call it out.

The cause is **not isolated**. A method-by-method diff of the two runtimes shows `InputNumber`
unchanged apart from a `isNumberNaN`/`isNumberFinite` refactor, `Globalize` number format/parse
identical, and the grid's `_keypress` identical. `startEditing` differs only in its new textarea
support. The most plausible candidate is the caret fix WJM-38215; that is unconfirmed. One old-build
run could not be measured, so "3 runs" on the old build counts only the valid ones.

### Module refresh

The per-branch module first arrived as a protected export, which `oml` cannot load. A fresh
unprotected export was supplied. The skill now probes the module in Phase 1 so this surfaces before
any repository edit.

The 66 live scripts matched the recorded inventory by name in both directions. One changeset of 64
scripts (13 runtime, 50 cultures, `GridFramework`) applied in a single pass. `oml diff` reported
exactly `JavaScript` ×64, `Description` ×63 and `HasSyntaxErrors` ×1, with no block and no
`Required Script` touched. All 66 post-apply assertions passed:

-   `GridAuxFeature` and `JsZIP` hash-identical;
-   no stored script begins with a BOM;
-   `GridFramework` keeps its 15 `RequiredScripts`;
-   every block keeps its `Public`, widget count, `Description` and stylesheet.

`oml validate` went from 0 errors / 10 warnings to 0 / 9. No new warning appeared, and the old
`Script_SyntaxErrors` on `GridFramework` went away.

One assertion needed correcting. The platform stores script content with CRLF normalised to LF, and
`dist/GridFramework.js` carried one raw `\r` from a CRLF working copy of `CalculatedField.ts`, so a
strict hash against `dist/` failed. It matches once CRLF is normalised to LF.
`references/changeset-recipe.md` records this.

The refreshed module was merged onto the protected module and published by the module owner. The
`WijmoCSS` block stylesheet was refreshed by hand. `styles/Grid.css` is unchanged, so the `Grid`
block needed nothing.

**The publish carried exactly the refresh.** All 66 published scripts hash-match the refreshed
module, and none matches the pre-upgrade export. The published `WijmoCSS` stylesheet equals the
repository's `styles/wijmo.css`. The published `Grid` stylesheet equals `styles/Grid.css` apart from
the `-servicestudio-*` properties Service Studio adds.

### Workaround review — six sites, six kept

| Site                                            | Verdict | Justification                                                                 |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `ToolTip.ts` (~:118), ROU-4207                   | Kept    | No tooltip entry in the changelog. `_eTip` present in both builds, 14 occurrences each. |
| `GroupPanel.ts` (~:119), WJM-35579               | Kept    | Absent from the changelog. `getClipString` 6 occurrences in both builds.        |
| `Export.ts` (~:61), same family                  | Kept    | Same id. Grouped CSV export verified free of `<b>` on the new build.           |
| `FlexGrid.ts` `_safari14workaround`              | Kept    | Browser defect; supported-browser matrix unchanged.                            |
| `AbstractDataSource.ts` (~:341), ROU-12689       | Kept    | No `CollectionView` proxy change in the changelog; the guard still drops non-object rows with the expected warning. |
| `styles/Grid.css` (~:921-958)                    | Kept    | The vendor's filter-editor button markup is identical between builds, so the override's selector still matches. Measured: every button matches it, keeps `min-width: 61px`, and Apply carries the primary colour. |

`reApplyFilterOnUpdate` (2), `cloneFrozenCells` (1) and `itemsEdited` (1) also kept their occurrence
counts, so no workaround went inert.

### Validation

Runtime gate, on the published per-branch sample:

-   `wijmo.getVersion()` returned `5.20262.60`;
-   `wijmo.input.MultiLineComboBox` exists, which proves `WijmoInputJS` is the new bundle too;
-   both version constants read as set above.

This release added no FlexGrid property, so the property probe ADR-0007 used was not available. The
skill now documents this fallback.

No Wijmo license banner appeared, and the console held no Wijmo license message.

AC13 (sort, filter, edit with `OnCellValueChange`), AC14 (the exact non-object-row warning), AC15
(grouped CSV without HTML) and AC16 (standard and validation-error tooltips) all passed. Grouping
was exercised through the group-panel API. The drag gesture itself could not be automated headless
and is **unverified**.

### License update — added to the skill, skipped in this run

The skill gains an optional, hard-gated Phase 8a for upgrades that need a new Wijmo product license.
It points to the internal runbook and nowhere else describes the procedure. The operator performs
it by hand in Service Studio. Verification never looks at the license: it compares `GridAuxFeature`
by hash only and confirms that no Wijmo license banner or console message appears.

This run did not need it, since the release notes state no licensing change. The published
`GridAuxFeature` is hash-identical to the pre-upgrade export.

### Not done here

-   The external WebdriverIO/Cucumber suite in `outsystems-datagrid-tests` and its test-case
    spreadsheet were not run.
-   The SonarQube stylesheet finding (WJM-37650) was not checked locally; the PR's CI answers it.
-   The root cause of the typed-rounding change is not isolated, and the group-panel drag gesture is
    unverified.
-   The module's *release* publish is a follow-up. What happened here was a per-branch merge and
    publish for validation.

## Links

-   [ADR-0007](./ADR-0007-Wijmo-Upgrade-2026v1-Hotfix.md) — the `5.20261.52` upgrade and the exact-pin
    rationale
-   [ADR-0008](./ADR-0008-Wijmo-Upgrade-Automation-Shape.md) — the shape of the automation this run
    exercised
-   [ADR-0004](./ADR-0004-ValidationMark-Column-Group-Index-Collision-Fix.md) — the column-group lookup
    nearest to WJM-37697
-   WJM-37697 (non-leaf `ColumnGroup` index), WJM-38021 (Angular peer dependency), WJM-38215 (caret
    selection), WJM-37650 (SonarQube stylesheet finding)
-   Release post: <https://developer.mescius.com/blogs/wijmo-2026-v2-has-landed>
-   Wijmo FlexGrid API: <https://developer.mescius.com/wijmo/api/classes/Wijmo_Grid.Flexgrid.html>

## Date

2026-11-10

---

## Execution record

Second run of the `upgrade-wijmo-version` skill (ADR-0008). One line per phase, with the evidence that
closed it.

```
Phase 0   Arguments             EXECUTED   Build 5.20262.60 from the ticket summary "[DataGrid] - Update
                                          version - release 2026v2-MAJOR - Build 5.20262.60"; version
                                          description "2026v2-MAJOR Wijmo - Build 5.20262.60" confirmed by
                                          the operator; npm resolves 5.20262.60 (latest); archive on disk.
Phase 1   Prerequisites         EXECUTED   git 2.49.0; node 24.13.1 / npm 11.18.0; dotnet 9.0.320; signing
                                          key set; gh authenticated. OUTSYSTEMS_CLI resolved by rule 2
                                          (sibling of the repository); non-shallow, LFS real, Release
                                          build 0 errors.
Phase 2   Asset-source gate     EXECUTED   47 vendored root .d.ts accounted for across three sources; 13
                                          runtime bundles located by name; culture parity empty both ways
                                          (50/50); MultiLineComboBox.inputType declared in the archive's
                                          wijmo.input.d.ts; archive ships no JSZip.
Phase 3   Branch                EXECUTED   ROU-13118 reused: clean, HEAD == merge-base == origin/dev 5fc928d.
Phase 4   Dependency + assets   EXECUTED   Exact pin, manifest reads 5.20262.60 after a clean install;
                                          two-way name diff empty (47 + 50); root headers on 5.20262.60;
                                          46/47 global flavour; wijmo.css 5489 lines; tsc --noEmit clean.
Phase 5   Version strings       EXECUTED   2.25.0 and "2026v2-MAJOR Wijmo - Build 5.20262.60"; swept
                                          CLAUDE.md (3), ARCHITECTURE.md (2 + Last Updated); old-build grep
                                          over swept files empty; docs/adr and specs untouched.
Phase 6   Release review        EXECUTED   Counted from the archive ChangeLog.txt: 4 API Updates -> 0
                                          adopted, 4 not applicable; 1 breaking change, not applicable;
                                          6 workaround sites, 5 kept and 1 provisional; hook counts equal
                                          to 5.20261.52; NFR2/NFR5 clean (no src/Providers or GridAPI change).
Phase 7   Build gate            EXECUTED   npm run build exit 0, zero diagnostics; dist/GridFramework.js
                                          585 825 B with both version strings. SonarQube WJM-37650 not
                                          checkable locally; carried to the PR's CI.
Phase 8   Module refresh        EXECUTED   First export protected, so the run stopped and an unprotected
                                          re-export was supplied. Inventory 66/66 by name; 64-script
                                          changeset in one pass; oml diff JavaScript x64, Description x63,
                                          HasSyntaxErrors x1; 66/66 assertions pass; validate 0/10 -> 0/9,
                                          no new warning; delivered beside the owner's file and
                                          re-validated in place.
Phase 8a  License update        SKIPPED    Optional phase added by this run. Not needed: the release states
                                          no licensing change. GridAuxFeature hash-identical; license-banner
                                          check in Phase 9 passed.
Phase 8b  Baseline + publish    EXECUTED   Merged onto the protected module and published by the module
                                          owner; WijmoCSS stylesheet refreshed by hand. Baseline = the live
                                          base automation app, confirmed on 5.20261.52 / 2.24.0.
Phase 9   Manual validation     PARTIAL    Publish fidelity 66/66 by hash; runtime gate and license check
                                          pass; AC13-AC16 pass; site #6 final (kept); comparative checks run
                                          against the live baseline: identical except typed decimal
                                          rounding (12.34 -> 12.35). UNVERIFIED: the group-panel drag
                                          gesture (not automatable headless) and the root cause of the
                                          rounding change. Owner: task owner, by hand in a real browser.
Phase 10  ADR + run log         EXECUTED   ADR-0009, the lowest free number (0000-0008 taken; 0005 used
                                          twice, pre-existing). Readme row added and aligned.
Phase 11  Commit + PR           EXECUTED   Signed commit 366b94e, paths staged by name (97 type-file renames
                                          + 12 files); draft PR #537 against dev, labels dependencies +
                                          chore, title matching the required regex.
Phase 12  Confluence            PENDING    Not reached when this record was written; this line is updated
                                          when the phase closes.
Phase 13  Jira enrichment       EXECUTED   "What I Did" filled in place via /enrich-jira-task after the
                                          operator confirmed the preview; other panels unchanged. Test Case 3
                                          (WJM-37697) added later; the operator's own Test Case 2 kept. Left
                                          as a placeholder: the Automated Tests PR (external suite not run).
Phase 14  Final checklist       PENDING    As Phase 12.
```

### What the run changed in the procedure

-   **Phase 8a, license update.** Optional and hard-gated. It points to the internal runbook and
    contains no procedure. The phase also adds a guardrail against recording license material
    anywhere, a license-banner check in Phase 9, and a Phase 14 follow-up.
-   **Phase 1 probes the module.** A protected export is now caught before any repository edit, not
    at Phase 8.
-   **Phase 6 counts from the archive's changelog**, because the ticket's copy can be a subset that
    omits whole sections.
-   **Phase 9 proves the publish by hash.** The published static scripts and stylesheets are compared
    with the refreshed module and the repository, which proves the merge introduced no drift.
-   **Phase 9 has a runtime-gate fallback** for releases that add no FlexGrid property.
-   **Browser automation notes for Phase 9:** run a separate headless Chrome; use the group-panel
    API, since drag-and-drop cannot be automated; send only scalar fields in AC14 payloads; save the
    XLSX asynchronously; type values with real keystrokes and repeat any that differ; confirm a live
    baseline's build before using it.
-   **Module refresh notes:** compare `GridFramework` against `dist/` with CRLF normalised; parse
    `oml diff` as JSON; keep helper scripts in files; hash script content in memory.
-   **Smaller corrections:** Phases 2-4 (the owning bundle's `.d.ts`, no culture banners) and the
    rule for reusing an existing task branch.

### Manual follow-ups, with owners

| # | Follow-up                                                                                          | Owner        | Status |
| - | -------------------------------------------------------------------------------------------------- | ------------ | ------ |
| 1 | **External regression suite** — `outsystems-datagrid-tests` and its test-case spreadsheet. Its outcome gates the PR undraft. | Task owner   | Open   |
| 2 | **Release-notes draft**, calling out typed decimal rounding (`12.3456789` in an `n2` cell now stores `12.35`, as paste already did). | Task owner   | Open   |
| 3 | **Confirm the rounding change and the group-panel drag by hand** in a real browser on both sample apps. | Task owner   | Open   |
| 4 | **SonarQube WJM-37650** — check whether the stylesheet finding reappears on the PR.                  | Task owner   | Open   |
| 5 | **The module's release publish**, as distinct from the per-branch publish done for validation.     | Module owner | Open   |
| 6 | **Third-Party Tools registry** (`engineering.outsystems.net/ThirdPartyTools/`) once the component reaches production. | Task owner   | Open   |
| 7 | **Duplicate `ADR-0005`** — pre-existing, carried from ADR-0007's follow-ups.                        | Unassigned   | Open   |
