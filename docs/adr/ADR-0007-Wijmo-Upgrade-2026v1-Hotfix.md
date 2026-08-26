# ADR-0007: Wijmo Upgrade to 2026v1-Hotfix (Build 5.20261.52)

## Status

Accepted

## Context

ROU-12860 moves the Wijmo FlexGrid provider from `2026v1` (Build `5.20261.50`, ADR-0002) to
`2026v1-Hotfix` (Build `5.20261.52`). The release carries nine new API properties, three breaking
changes, and one property this component wants: `preventCut`, which opts out of Wijmo's new
<kbd>Ctrl</kbd>+<kbd>X</kbd> handling.

This is also the first upgrade performed through the `upgrade-wijmo-version` skill rather than by
hand (ADR-0008). That matters here because the run exposed defects in what the procedure believed
about the OutSystems module, and this record carries them.

## Decision Drivers

-   The declared dependency and the vendored types had already diverged silently, and nothing in the
    build detects it.
-   The repository cannot render a grid, so every behavioural claim must come from a published module
    or from the runtime files themselves.
-   `oml validate` reporting zero errors is not evidence that a module refresh worked.
-   Behaviour must be unchanged except where the ticket intends otherwise.

## Considered Options

-   **Caret range (`^5.20261.50`), as ADR-0002 chose**
    -   Pros: picks up patch releases without a code change.
    -   Cons: `package-lock.json` is gitignored, so CI resolves fresh on every install. Under the
        caret, CI was *already* installing `5.20261.52` against vendored `5.20261.50` types — the
        divergence this ADR exists to close.
-   **Exact pin (`5.20261.52`)** — chosen.
    -   Pros: the declared dependency, the vendored types and the module runtime name one build.
    -   Cons: patch releases need a deliberate change, which is the point.
-   **Adopt the release's new properties** — rejected except `preventCut`; see below.
-   **Enable Wijmo's new cut handling** — rejected. The grid has no cut hook, so cut-cleared cells
    would bypass validation marks, `OnCellValueChange` and undo/redo.

## Decision Outcome

**Exact-pin `wijmo` at `5.20261.52`**, refresh the vendored types and stylesheet from the
distribution archive, correct both version constants, opt out of cut handling with `preventCut: true`,
and refresh the module's 64 Wijmo scripts by changeset with the two block stylesheets done by hand.

### Asset sourcing — the archive is the only source

The npm package ships the ES-module `.d.ts` flavour and no `.min.js` at all, so it is evidence for the
declared dependency and the source of nothing. Three asset classes come from the archive, and they sit
in **three** directories, not one:

| Asset                                   | Source                                          |
| --------------------------------------- | ----------------------------------------------- |
| 45 of the 47 vendored root `.d.ts`      | `Dist/controls`                                 |
| `wijmo.meta.d.ts` (global flavour)      | `Dist/interop/meta`                             |
| 50 culture `.d.ts`                      | `Dist/controls/cultures`                        |
| unminified `wijmo.css`                  | `Dist/styles`                                   |
| 13 + 50 `.min.js` for the module        | `Dist/controls` and `Dist/controls/cultures`    |

`wijmo.interop.grid.d.ts` is the exception: the archive carries **no global-flavour copy anywhere**,
only ES-module copies under `NpmImages/*`. It was taken from npm verbatim and stays ES-module flavour.
That is not a defect — a `.d.ts` with top-level `import`/`export` is a module, contributes no globals,
and this file is referenced nowhere in `src/`. It compiles and goes unused.

**The archive's 63 `.min.js` files carry a UTF-8 BOM; the module's script content never has.** Copying
it in left a stray `U+FEFF` at the head of all 63 scripts and the grid failed at load with
`e._registerModule is not a function`. Strip the BOM on copy. `_registerModule` exists in both builds,
so this was never an API change.

### Version constants

`WijmoFlexGridVersion` becomes `2026v1-Hotfix Wijmo - Build 5.20261.52`. `OSDataGridVersion` is
corrected from `2.23.1` to `2.24.0`, closing a drift against `package.json` and `gulp/DefaultSpecs.js`.
That drift was not cosmetic: `gulp gtaSetVersion` builds its search string from `DefaultSpecs` and calls
`String.replace` with no match assertion, so it had been silently failing to update `Constants.ts` on
every release and would have continued to.

### New-release review — nine properties, one adopted

`preventCut: true` is set in `FlexGridConfig.getProviderConfig()` with `preventCut: boolean` on
`IGridProviderConfigs`. The other eight are declined on codebase evidence: `stickyGroupHeaders` and
`newItemIndex`/`insertAt` are behavioural changes the ticket does not ask for, and
`searchDuringComposition`, `customFilter`, `customHighlight`, `boxPlotData`, `treeColumnIndex` and
`truncate` touch controls this component does not use — a reference census returns zero for
AutoComplete, MultiSelect, MultiSelectListBox, TreeGrid, BoxWhisker and ComboBox.

`truncate` deserves its own line: leaving it unset is what keeps AC11's rounding behaviour, and setting
it would have adopted the breaking change rather than absorbing it.

### Breaking changes

| Change                                                  | Assessment                                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| XLSX default `company` removed (WJM-37633)               | **Observable, no code change.** `Export.ts` never sets `company`. Proven from the runtimes: `WijmoXlsxJS` at `.50` carries `<Company>…(e.company \|\| "GrapeCity, Inc.")` once, at `.52` zero times. Exports now leave Company empty. |
| `InputNumber` truncation unified for typing and paste (WJM-22911) | **No impact.** `truncate` is set nowhere in `src/`, so default rounding applies; typed and pasted `1.2345` both render `1.23`. |
| Angular minimum raised to `20.3.18` (WJM-37615)          | **Not applicable.** Plain TypeScript with Gulp; no Angular wrapper anywhere in the build. |

### Module refresh — what the procedure got wrong

The changeset covers **64 scripts**, not the 66 objects originally planned, and every `spec` echoes six
properties plus the new content. Three defects surfaced, and all three passed `oml validate` with zero
errors:

1. **`addOrReplace` on a block destroys it.** Applied to `Styles/WijmoCSS` and `Structures/Grid`, it
   wiped every widget, reset `Public` to false and nulled `Description` — `Grid` losing `Public=true`
   is what stops consumers placing it on a screen. The only signal was 12 new `UnusedUserAction`
   warnings, because the gutted block no longer called `CreateDataGrid`, `InitGrid` and the rest. Both
   block stylesheets are therefore **manual Service Studio steps**.
2. **`addOrReplace` on a Script wipes `RequiredScripts`.** `GridFramework` declares 15 dependencies —
   the 13 Wijmo runtime scripts plus `JsZIP` and `GridAuxFeature` — and losing them broke load order at
   runtime with nothing in validation to show for it. Echo the array; it is a plain list of script
   `GlobalKey` strings.
3. **The BOM**, above.

The lesson generalises past all three: **a replace verified against a hand-picked list of properties
only checks what its author thought of.** `oml diff` between input and output reports what actually
moved, and both destructive defects would have been glaring in it — the blocks as changed
`(Object MobileBlock)` nodes, the dependencies as `(Object Required Script) … [RemovedFromForeign]`.
It is now the first assertion of the module phase.

Two further rules the run established. The validation gate compares the warning **set**, not the count:
the refresh legitimately *removed* a pre-existing `Script_SyntaxErrors` on `GridFramework`, so
`warnings == baseline` would have rejected a better module, and a count also passes a one-out-one-in
swap. And the unprotected export is a working copy, not the publish artifact — the shipping module is
protected, so the refreshed changes go back by three-way merge onto it.

### Workaround review — six sites, six kept

| Site                                            | Verdict | Justification                                                                 |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| `ToolTip.ts` (~:118), ROU-4207                   | Kept    | No tooltip entry in the changelog. Hook `_eTip` present in both builds, 14 occurrences each. |
| `GroupPanel.ts` (~:119), WJM-35579               | Kept    | Absent from the changelog; tracker row reads `Closed (Nothing will be done)`.  |
| `Export.ts` (~:61), same family                  | Kept    | Same id. `getClipString` present in both, 6 occurrences each.                  |
| `FlexGrid.ts` `_safari14workaround`              | Kept    | Browser defect, not a Wijmo one. Supported-browser matrix unchanged.           |
| `AbstractDataSource.ts` (~:341), ROU-12689       | Kept    | No `CollectionView` proxy change in the changelog; the one `CollectionView` entry (WJM-37533) is unrelated to item proxying. |
| `styles/Grid.css` (~:921-958)                    | Kept    | Filter-panel wrapper selector still matches the refreshed DOM. `styles/Grid.css` unchanged, so the module's `Grid` block needed no refresh. |

Two of these six are invisible to a keyword grep — the `CollectionView` guard and the CSS override
describe themselves in prose without the word "workaround" — so the inventory is a named list, not a
search result.

### Validation

The runtime gate passed: `wijmo.grid.FlexGrid.prototype.hasOwnProperty('preventCut')` returned `true`,
which is the only reliable proof the Wijmo runtime itself is on the new build rather than just our
wrapper. `GetActiveGrid().provider.preventCut` returned `true` — the only available proof the option
reached the constructor, since `_getProviderConfig()` returns `unknown` and the option bag is never
type-checked, so a green build says nothing about it.

Ctrl+X is inert; Ctrl+C/Ctrl+V still raise validation marks and `OnCellValueChange`; decimal columns
round as before; filter buttons render correctly; and the regression surface — render, sort, filter,
group, edit, non-object rows, grouped CSV export, tooltips — behaved as expected.

The pre-upgrade baseline was the live public sample, which stays on the released build for the length
of the upgrade. Two comparative checks turned out not to need it: a removed default and a vendor
internal are both provable by diffing the two runtime files.

### Not done here

The external WebdriverIO/Cucumber suite in `outsystems-datagrid-tests` and its test-case spreadsheet
were not run. The Third-Party Tools registry, the RPM board and the release-notes draft are outside
this change. The module's *release* publish is a follow-up; what happened here was a per-branch merge
and publish for validation.

## Links

-   [ROU-12860](https://outsystemsrd.atlassian.net/browse/ROU-12860) — this upgrade; predecessor
    [ROU-12689](https://outsystemsrd.atlassian.net/browse/ROU-12689)
-   [ADR-0002](./ADR-0002-Wijmo-Upgrade-2026v1.md) — the `5.20261.50` upgrade, and the caret this one
    reverses
-   [ADR-0006](./ADR-0006-Roll-Back-Incompatible-TypeDoc-Dependency-Bump.md) — the absent-lockfile
    consequence behind the exact pin
-   [ADR-0008](./ADR-0008-Wijmo-Upgrade-Automation-Shape.md) — the shape of the automation this run
    exercised
-   WJM-37524 (`preventCut`), WJM-37633 (XLSX `company`), WJM-22911 (`InputNumber` truncation),
    WJM-37615 (Angular minimum), WJM-37650 (the SonarQube stylesheet finding, marked fixed in
    `2026v1-HF`)
-   Wijmo FlexGrid API: <https://developer.mescius.com/wijmo/api/classes/Wijmo_Grid.Flexgrid.html>

## Date

2026-08-26

---

## Execution record

First run of the `upgrade-wijmo-version` skill (ADR-0008). One line per phase, with the evidence that
closed it. The four non-`EXECUTED` states exist so a skipped or vacuous phase stays visible instead of
being absorbed into a successful upgrade.

```
Phase 0   Arguments             EXECUTED   Build 5.20261.52 and "2026v1-Hotfix Wijmo - Build 5.20261.52"
                                          read from the ticket summary; npm resolves; archive already on
                                          disk, byte-identical in size to Jira attachment 714103.
Phase 1   Prerequisites         EXECUTED   git 2.49.0; node 24.13.1 / npm 11.18.0 (= volta pins); dotnet
                                          9.0.317; signing key set; gh authenticated; OutSystems.Cli
                                          non-shallow, LFS real, Release build runs.
Phase 2   Asset-source gate     EXECUTED   47 vendored root .d.ts accounted for across three sources;
                                          13 runtime bundles located by name; culture parity empty both
                                          ways (50/50); preventCut declared in the archive's own
                                          wijmo.grid.d.ts:3222; archive ships no JSZip.
Phase 3   Branch                EXECUTED   ROU-12860, 0 ahead / 0 behind origin/dev (50c1224).
Phase 4   Dependency + assets   EXECUTED   Exact pin; two-way name diff old->new empty (47 root + 50
                                          cultures); every root header on 5.20261.52; 46/47 global
                                          flavour; wijmo.css 4394 lines; tsc --noEmit clean.
Phase 5   Version strings       EXECUTED   Both constants corrected; swept CLAUDE.md (3) and
                                          ARCHITECTURE.md (2); docs/adr and specs untouched.
Phase 6   Release review        EXECUTED   9 API Updates -> 1 adopted, 8 declined on codebase evidence;
                                          3 breaking changes assessed; 6 workaround sites, 5 kept and 1
                                          provisional; NFR2/NFR5 clean.
Phase 7   Build gate            EXECUTED   npm run build exit 0, zero diagnostics. Required fixing
                                          gulpfile.js first: cleanOldFiles deleted the bundle it had
                                          just built (commit 966b102).
Phase 8   Module refresh        EXECUTED   Inventory reconciled exactly (66 scripts, 0 missing, 0 extra).
                                          64-script changeset applied to a copy; oml diff reports only
                                          JavaScript x64, Description x63, HasSyntaxErrors x1.
                                          Scope corrected from 66 to 64 mid-phase.
Phase 8m  Manual stylesheet     EXECUTED   Styles/WijmoCSS refreshed by hand; full re-verification after
                                          the Service Studio round trip.
Phase 8b  Baseline + publish    EXECUTED   Baseline = the live public sample. Delivered by three-way
                                          merge onto the protected module, not by publishing the
                                          unprotected export; both sample apps refreshed.
Phase 9   Manual validation     EXECUTED   Two failed attempts first, both root-caused (RequiredScripts,
                                          BOM). Runtime gate true; provider.preventCut true; AC7-AC11
                                          and AC13-AC16 as expected; AC10 proven from the runtime files;
                                          all six workaround verdicts final.
Phase 10  ADR + run log         EXECUTED   ADR-0007 (lowest free number, not highest+1); Readme row
                                          added and aligned; this record appended.
Phase 11  Commit + PR           EXECUTED   Two signed commits (966b102 gulpfile fix, 9391a9a upgrade),
                                          114 paths staged by name. Draft PR #528 against dev, labels
                                          dependencies + chore, title matching the required regex.
                                          Neither .claude/settings.local.json nor specs/ was staged.
Phase 12  Confluence            EXECUTED   SBOM row replaced on 2745598610 (Reactive row only; verified
                                          by re-fetch that exactly one cell moved). Child page 6719996097
                                          created. Runbook 3058631508 body replaced by a pointer to the
                                          skill after an explicit hard-gate confirmation, child index and
                                          License Update links kept, previous procedure preserved in page
                                          history. Reported-issues candidate list handed over, not
                                          decided: WJM-37650 only, and its id is absent from the release
                                          changelog even though its Status names 2026v1-HF.
Phase 13  Jira enrichment       PARTIAL    Content posted as comment 1601169 and later updated with the
                                          PR link. The description's "What I Did" template is still
                                          empty: it should have been filled with /enrich-jira-task,
                                          which injects ADF surgically. Owner: task owner. Finding 20.
Phase 14  Final checklist       EXECUTED   Follow-ups below, each with an owner.
```

### What the run changed in the procedure

Seventeen corrections, made in the same run rather than deferred. Three share a root and are the ones
worth remembering, because in every case `oml validate` stayed green while the module was broken:
`addOrReplace` destroying blocks, the same verb wiping `RequiredScripts`, and the archive's BOM riding
into all 63 scripts. What they have in common is that each was verified against a hand-picked list of
properties rather than against the previous state. `oml diff` is now the first assertion of the module
phase, and it would have caught all three.

A second theme recurred four times: **compare by name or set, never by count** — archive file sets,
the workaround inventory, the validation warning gate, and the ADR numbering rule that would have
orphaned `ADR-0007` by taking highest-plus-one.

The full record, including the two findings that were operator-reported rather than self-detected,
is in the ticket's working notes.

### Manual follow-ups, with owners

Not done by this change. Each is named here because a follow-up that is not written down is a
follow-up that does not happen.

| # | Follow-up                                                                                          | Owner        |
| - | -------------------------------------------------------------------------------------------------- | ------------ |
| 1 | **External regression suite** — the WebdriverIO/Cucumber suite in `outsystems-datagrid-tests`, and its test-case spreadsheet. Its outcome is what takes PR #528 out of draft. | Task owner   |
| 2 | **The Jira description's "What I Did" template** — content is in comment 1601169; fill the block itself with `/enrich-jira-task`. | Task owner   |
| 3 | **The child page's operator sections** — `Fixed Issues`, `New issues found`, the RPMs and the automated-test runs, all left as visible placeholders. | Task owner   |
| 4 | **Reported-issues page (3353313306)** — WJM-37650 is the only candidate, and its Status names `2026v1-HF` while the id is absent from the release changelog. Needs a human verdict. | Task owner   |
| 5 | **RPM board** — likely N/A, since no reported issue was fixed in this release.                      | Task owner   |
| 6 | **Third-Party Tools registry** (`engineering.outsystems.net/ThirdPartyTools/`) — once the component reaches production. | Task owner   |
| 7 | **Release-notes draft**, calling out the XLSX `Company` change as the one user-visible difference.   | Task owner   |
| 8 | **The module's release publish**, as distinct from the per-branch merge and publish done for validation. | Module owner |
| 9 | **Does CI lose the gulp race?** `azure-pipelines.yml` publishes `dist/GridFramework.js`; before the `cleanOldFiles` fix it may have been publishing an empty directory. Open a past build's artifact and check. **Not investigated.** | Unassigned   |
| 10 | **Duplicate `ADR-0005`** — two files carry that number, and `ADR-0005-Remove-Lodash-Dependency.md` has no row in the ADR log. Pre-existing; flagged in PR #528, worth a separate chore. | Unassigned   |

Items 9 and 10 are the two with no owner. Item 9 is the one worth chasing: it is a live question about
what CI has been publishing, raised by this ticket and not answered by it.
