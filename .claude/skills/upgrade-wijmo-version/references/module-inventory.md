# Module Asset Inventory — `OutSystemsDataGrid`

The objects a Wijmo upgrade replaces inside the OutSystems module, by **name and shape**. Measured
with `oml query` against a real unprotected export at build `5.20261.50`.

**No `GlobalKey` or `Folder` value appears in this file, and none may be added.** Those identifiers
are per-module: a value recorded from one export would silently target the wrong object — or nothing
at all — in the next per-branch module. Read them from a live `oml query` on every run, and use this
file only to know *what to look for* and *what to assert*.

Reconcile this list against the live module before generating a changeset, and stop on any mismatch.
A differently-cloned module can legitimately carry a renamed script or a missing language, and a
generator that is not reconciled first would cover 49 cultures and report success.

---

## Wijmo runtime scripts — 13

All in one folder, all **minified**. `Description` format:
`File: <file> - Version: <build string>`.

All 63 archive `.min.js` files carry a UTF-8 BOM that the module's stored content never has. Strip it
on copy — see `changeset-recipe.md`.

The sizes are the `5.20261.50` values, recorded as a **pre-flight magnitude check only** — if the
archive's replacement for one of these is wildly off (`wijmo.grid.min.js` at 40 KB rather than
~366 KB), the wrong file was picked. They are **not** expected to match after an upgrade, and no
assertion compares them for equality.

| Script (`Scripts` collection) | Source file                    | Size at `5.20261.50` |
| ----------------------------- | ------------------------------ | -------------------- |
| `WijmoJS`                     | `wijmo.min.js`                 | 168 066 B            |
| `WijmoGridJS`                 | `wijmo.grid.min.js`            | 366 455 B            |
| `WijmoInputJS`                | `wijmo.input.min.js`           | 278 538 B            |
| `WijmoXlsxJS`                 | `wijmo.xlsx.min.js`            | 199 831 B            |
| `WijmoNavJS`                  | `wijmo.nav.min.js`             |  69 156 B            |
| `WijmoGridFilterJS`           | `wijmo.grid.filter.min.js`     |  67 271 B            |
| `WijmoGridXlsxJS`             | `wijmo.grid.xlsx.min.js`       |  33 289 B            |
| `WijmoUndoStackJS`            | `wijmo.undo.min.js`            |  27 668 B            |
| `WijmoGroupPanelJS`           | `wijmo.grid.grouppanel.min.js` |  18 227 B            |
| `WijmoGridSelectorJS`         | `wijmo.grid.selector.min.js`   |  11 432 B            |
| `WijmoGridSearchJS`           | `wijmo.grid.search.min.js`     |   9 077 B            |
| `WijmoTouchJS`                | `wijmo.touch.min.js`           |   6 558 B            |
| `WijmoGridCellMakerJS`        | `wijmo.grid.cellmaker.min.js`  |   6 217 B            |

**Why a code-derived list is wrong.** `WijmoTouchJS` and `WijmoNavJS` are not derivable from this
repository's source. A namespace census over `src/OSFramework`, `src/Providers` and `src/OutSystems`
yields ten bundles and misses both: they are transitive dependencies of `wijmo.input`'s dropdowns and
menus, referenced by the runtime and never by our code. This inventory is authoritative; a census is
not.

## Culture scripts — 50

Named `wijmo_culture_<lang>_min` with **the hyphen removed from the language tag**, one folder,
~11-17 KB each. `Description` format:
`Script with the culture files - Wijmo library version <build string>`.

The de-hyphenation is the mapping trap: the archive file is `wijmo.culture.en-CA.min.js` but the module
object is `wijmo_culture_enCA_min`, so a generator that substitutes the language tag verbatim finds
nothing for the 11 hyphenated languages (`ar-AE`, `ar-SA`, `de-CH`, `en-CA`, `en-GB`, `es-419`,
`es-MX`, `fr-CA`, `mn-MN`, `zh-HK`, `zh-TW`) and silently covers only the other 39. Map with
`'wijmo_culture_' + lang.replace(/-/g, '') + '_min'`, and reconcile by name before generating.

`ar-AE`, `ar-SA`, `bg`, `ca`, `cs`, `da`, `de`, `de-CH`, `el`, `en`, `en-CA`, `en-GB`, `es`, `es-419`,
`es-MX`, `et`, `eu`, `fi`, `fr`, `fr-CA`, `gl`, `he`, `hi`, `hr`, `hu`, `id`, `it`, `ja`, `kk`, `ko`,
`lt`, `lv`, `mn-MN`, `nl`, `no`, `pl`, `pt`, `ro`, `ru`, `sk`, `sl`, `sr`, `sv`, `th`, `tr`, `uk`,
`vi`, `zh`, `zh-HK`, `zh-TW`.

**This set is exactly the set vendored under `src/@types/wijmo-<build string>/cultures/`** — 50 in
each, verified with a two-way set difference that came back empty in both directions. So there are no
per-language mapping decisions to make: the module's culture scripts and the repository's culture
types cover the same languages, and the archive must supply both for all 50. Assert the parity
against the archive (Phase 2), re-assert it against the live module (Phase 8), and **fail loudly**
rather than skipping if any single language is absent from either side.

## Wrapper script — 1

`GridFramework` — `dist/GridFramework.js`, non-minified, 583 562 B at `5.20261.50`. Its `Description`
carries no build string and is left as it is. In scope because nothing delivers it automatically: the
pipeline's Deploy stage only runs on PR builds and posts to an endpoint that may no longer exist.

It is also a free cross-check on the repository work — after the changeset, the output copy must
contain **both** version strings Phase 5 wrote. If only one changed, that isolates which edit was
missed.

**It is the one replaced object with dependencies: `RequiredScripts` holds 15 entries** — the 13 Wijmo
runtime scripts plus `JsZIP` and `GridAuxFeature`. They declare the load order the grid needs, and a
changeset that does not echo them wipes the list, breaking the component at runtime with no validation
signal. See `changeset-recipe.md`. (`GridAuxFeature` requires `WijmoJS`, but it is never replaced, so
its dependency is never at risk.)

## Block stylesheets — 2

Neither CSS file is a resource or a theme: `WebThemes` and `Resources` are both empty. Both are the
`StyleSheet` property of a `MobileBlock`, and the changeset targets the **flow**, not the block (see
`changeset-recipe.md`).

| Block      | Flow         | Content     | Size at `5.20261.50` |
| ---------- | ------------ | ----------- | -------------------- |
| `WijmoCSS` | `Styles`     | `wijmo.css` | 102 549 chars        |
| `Grid`     | `Structures` | `Grid.css`  |  53 977 chars        |

`WijmoCSS` takes the archive's refreshed stylesheet. `Grid` takes this repository's `styles/Grid.css`
— ours, not the vendor's, and it only needs replacing when the upgrade changed it.

**Neither can be refreshed by changeset.** `addOrReplace` on a block wipes its widgets, resets
`Public` and nulls its `Description`, with zero validation errors to show for it — measured, see
`changeset-recipe.md`. Both are **manual Service Studio steps**, and `Grid` is usually not needed at
all: it only changes when the upgrade edited `styles/Grid.css`, which most upgrades do not.

Their integrity is still asserted after every changeset, precisely because nothing is supposed to touch
them: `Grid` stays `Public=true` with 4 widgets, `WijmoCSS` has 1 widget, and both keep their
descriptions.

## Never touched — 2

| Script          | What it is                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------ |
| `GridAuxFeature` | Obfuscated. `Description`: "OutSystems Data Grid license script."                          |
| `JsZIP`          | `File: jszip.js version 3.10.1` — a dependency of `wijmo.xlsx`, carrying its own version.   |

Both must be **byte-identical** in the changeset output, and the generator asserts that no change
targets either — explicitly, not merely by omitting them.

**The risk in leaving `JsZIP` alone, stated so it is not rediscovered.** `wijmo.xlsx.min.js` uses
JSZip. An upgrade replaces the former while pinning the latter, so if a new Wijmo build expects a
newer JSZip API, spreadsheet export breaks at runtime — not at build time, and not in `oml validate`.
Only the manual export check in Phase 9 would catch it. Phase 2 therefore asks whether the archive
ships its own JSZip and how its version compares; a newer one is raised as its own ticket, never
adopted quietly inside a Wijmo upgrade.

**Measured on `5.20261.52`: the archive ships no JSZip at all** — a case-insensitive search of the
whole 165 MB zip for `*jszip*` returns nothing. So there is no version to compare and nothing to
raise; `JsZIP` stays at `3.10.1` because the vendor never offered an alternative. Re-run the search
each upgrade rather than carrying this answer forward.

---

## Two counts of 66, asserted separately

These collide confusingly and are not evidence of each other:

| Bucket                                                            | Count |
| ----------------------------------------------------------------- | ----- |
| Scripts in the module, total                                      |    66 |
| — replaced (13 runtime + 50 cultures + `GridFramework`)           |    64 |
| — never touched (`GridAuxFeature`, `JsZIP`)                       |     2 |
| **Objects the changeset carries**                                 | **64** |
| Block stylesheets, refreshed **by hand**                          |     2 |

So the module holds **66** Scripts while the changeset carries **64** objects. Assert each
independently: the module's script count must be **unchanged** at 66 after the apply, while the
changeset's change count must **be** 64, and exactly 64 scripts must differ by content hash. Treating
any one as proof of another hides a whole class of generator bug — an empty changeset satisfies
"count unchanged" perfectly.

An earlier version of this file said the changeset carries 66, counting the two block stylesheets. That
route turned out to destroy the blocks; the 64/66 split above is the measured one.

And per the guardrails: verify every set **by name**, never by count. The archive ships
`wijmo.angular*`, `wijmo.react*` and `wijmo.vue*` bundles that inflate any count while every name
above could still be missing.
