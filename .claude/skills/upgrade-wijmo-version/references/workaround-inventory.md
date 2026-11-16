# Workaround Inventory

Every place this repository works around Wijmo behaviour. An upgrade re-validates each one against
the new release's changelog and records a kept-or-removed verdict with a justification.

**A keyword grep does not find this list, and must not be used to build it.** Measured on
`5.20261.50`: `grep -rn "workaround\|Workaround" src --include=*.ts` returns 6 lines covering only
**4** of the 6 sites. The two it misses are the two most sensitive to a Wijmo upgrade — the
`CollectionView` proxy guard and the filter-button CSS override — because both are described in prose
without ever using the word. Same lesson as the module inventory: a code-derived list is wrong, and
this file is authoritative.

Re-derive the list by reading these locations, then check for genuinely new sites with the grep as a
*supplement*, never as the source.

| # | Site                                                        | Guards against                                                                 | Vendor id / origin |
| - | ----------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------ |
| 1 | `Providers/.../Features/ToolTip.ts` (~:118)                  | Tooltip rendering; the workaround Wijmo supplied for our report                 | ROU-4207           |
| 2 | `Providers/.../Features/GroupPanel.ts` (~:119)               | HTML tags and encoded symbols in CSV export with grouped columns               | WJM-35579          |
| 3 | `Providers/.../Features/Export.ts` (~:61)                    | Same family — HTML tags exported in CSV with grouped columns (`_stripHtmlBoldTag`) | WJM-35579          |
| 4 | `Providers/.../Grid/FlexGrid.ts` (`_safari14workaround`)      | Safari 14 rendering defect. Three grep hits — doc comment, method, call site — but **one** workaround | Safari 14      |
| 5 | `OSFramework/.../Grid/AbstractDataSource.ts` (~:341-347)      | **No keyword.** `CollectionView` proxy-wraps every bound item since Wijmo 2026v1, so a `null`/primitive row throws `Cannot create proxy with a non-object as target or handler` at bind time. Filters them out to keep the pre-2026v1 forgiving contract | ROU-12689          |
| 6 | `styles/Grid.css` (~:921-958)                                | **No keyword.** Filter panel's Apply/Clear/Cancel buttons gained an extra wrapper `<div>` in Wijmo 5.2026v1 for a11y; the override restores their size and spacing | Wijmo 5.2026v1 a11y change |

## Static evidence: does the hook still exist?

Sites 1-5 hook a vendor internal or API. Each verdict gains real evidence — not just "absent from the
changelog" — by grepping the old and new runtime scripts and comparing occurrence counts. A count
falling to zero means the workaround has gone quietly inert, because most are guarded by an `if` that
simply stops firing.

| Hook                    | Lives in            | `5.20261.50` | `5.20261.52` |
| ----------------------- | ------------------- | ------------ | ------------ |
| `_eTip`                 | `WijmoJS`           | 14           | 14           |
| `getClipString`         | `WijmoGridJS`       | 6            | 6            |
| `reApplyFilterOnUpdate` | `WijmoGridFilterJS` | 2            | 2            |
| `cloneFrozenCells`      | `WijmoGridJS`       | 1            | 1            |
| `itemsEdited`           | `WijmoJS`           | 1            | 1            |

Run this before the browser work. It costs nothing, it is repeatable, and it catches the failure mode
a behavioural check misses: a workaround that no longer does anything while everything still *looks*
fine.

## How each verdict is reached

- **1-3** are behavioural workarounds with a vendor id. Check that id against the release's changelog:
  a fix means the workaround is a removal candidate, and its removal is its own ticket unless this one
  says otherwise.
- **4** is a browser defect, not a Wijmo one. It changes only if the supported-browser matrix changes,
  so a Wijmo upgrade keeps it by default and says so rather than staying silent.
- **5** is version-coupled in the direction that matters: it exists *because* of a 2026v1 change, so a
  later build could either keep that proxy behaviour (keep the guard) or revert it (the guard becomes
  dead code that still costs a `filter` on every bind). Neither is visible from a build — check the
  changelog for `CollectionView`, and confirm on the refreshed module in Phase 9.
- **6** is the only verdict that **cannot** be settled offline. Whether the selector still matches
  depends on the refreshed stylesheet's DOM, so it stays provisional through Phase 6 and is decided in
  Phase 9 with before/after evidence. If Phase 9 edits this file, the module's `Grid` block stylesheet
  goes stale — see Phase 9's loopback.

## Verdicts recorded on `5.20261.52` (ROU-12860)

Changelog ids in that release: WJM-37517, 35377, 37691, 37615, 37215, 37596, 37523, 37524, 35181,
37533, 33508, 37518, 22911, 37515, 37633.

| # | Verdict                | Justification                                                                        |
| - | ---------------------- | ------------------------------------------------------------------------------------ |
| 1 | **Kept**               | ROU-4207 / no tooltip entry in the changelog.                                         |
| 2 | **Kept**               | WJM-35579 is absent from the changelog, and its tracker row reads `Closed (Nothing will be done)`. |
| 3 | **Kept**               | Same id, same reason.                                                                 |
| 4 | **Kept**               | Browser defect; the supported-browser matrix did not change in this ticket.            |
| 5 | **Kept**               | No `CollectionView` proxy change in the changelog. The one `CollectionView` entry (WJM-37533, `newItemIndex` / `insertAt`) is unrelated to item proxying. |
| 6 | **Provisional → Phase 9** | Needs the refreshed filter-panel DOM. Note the predecessor upgrade *introduced* this override for the same reason. |
