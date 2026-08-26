# Changeset Recipe

How to refresh module objects offline with `OutSystems.Cli`. The schema is **undocumented** —
`ParseChangeSet` lives in the external `OutSystems.ModelExtensions.ChangeSet` assembly, and what is
written here was derived from its error messages and then probed end to end against a real OML.

A reader should be able to construct a valid changeset from this file alone.

## The three verbs

```bash
CLI="dotnet run --project C:/Repos/OutSystems.Cli/src/OutSystems.AI.Cli -c Release --"

printf 'Root { Scripts { Name Description } }' | $CLI oml query "<in.oml>" -
$CLI oml apply-changeset "<in.oml>" "<out.oml>" "<changeset.json>"
$CLI oml validate "<out.oml>"
```

`apply-changeset` takes a **separate output path**, so it is inherently non-destructive to its input.
That is what makes "run against a copy" cheap: keep the module owner's export untouched, apply onto a
new file, and re-apply from scratch on every generator iteration.

## Schema

```json
{
  "version": "1",
  "changes": [
    {
      "action": "addOrReplace",
      "target": "<parent GlobalKey>",
      "add":    { "collection": "<collection name>" },
      "spec":   { "key": "<object GlobalKey>", "type_": "<IType>", "...": "..." }
    }
  ]
}
```

Both `GlobalKey` values come from the run's own `oml query`. Never from this file, never from a
previous run.

## Three traps

Each was found by hitting it:

1. **`version` is required, and must be a string.** A JSON number throws
   `requires an element of type 'String'`.
2. **`action` is required.** Omitting it throws `Invalid ChangeSet format: missing action element`.
3. **`add` is required even for a pure property change** — a change that replaces only a
   `Description` or a `StyleSheet` still needs the `add` element naming the collection.

And a fourth thing that is not a parse error but a data-loss bug: **`addOrReplace` is full-replace.**
Every property the object had and the `spec` omits is wiped, which for a Script means it comes back
renamed (`Script1`) with no `RuntimePath` and no `Folder`. Echo back the object's complete queried
metadata in every `spec`.

## Scripts: safe **only with `RequiredScripts` echoed**. Block stylesheets: DESTRUCTIVE.

Full-replace reaches child collections on **both** object types. It bit twice in one run: once on the
blocks, and once on Scripts, where a spec of six scalar fields silently dropped
`GridFramework`'s 15 `RequiredScripts`. The grid then failed at runtime because the Wijmo files no
longer loaded before it, and `oml validate` reported nothing at all — load order is not a model
constraint.

`RequiredScripts` is a **plain array of script `GlobalKey` strings**. Note that two key spaces coexist:
`GlobalKey` is the `<eSpace key>*<object key>` form used for every cross-reference, while `Key` returns
a plain GUID. Query `GlobalKey` when resolving a reference and `Key` when addressing the object itself.
Echo the queried array verbatim: the refresh replaces content, never identity, so the keys stay valid.

**The lesson that generalises past this one field:** do not verify a replace against a hand-picked list
of properties you happened to think of — that is what missed the blocks and then missed this. Verify
with `oml diff` (below), which reports everything that moved.

| Probe              | `target`                          | `add.collection` | `spec.type_`   | Result                                                                                                     |
| ------------------ | --------------------------------- | ---------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| Script property    | the **eSpace** `GlobalKey`        | `Scripts`        | `IScript`      | Applied over all 64. Script count still 66, no rename, dependencies preserved — with `Name`, `Public`, `RuntimePath`, `Folder`, `Description` **and `RequiredScripts`** all echoed back. Omit `RequiredScripts` and `GridFramework` silently loses its 15 dependencies. |
| Block `StyleSheet` | the **flow** `GlobalKey`          | `Nodes`          | `IMobileBlock` | Applied. `WijmoCSS.StyleSheet` replaced; every flow's node count unchanged.                                 |

**The block row above is a trap, and the probe that produced it asked the wrong question.** "Every
flow's node count unchanged" measures the container, not the payload: the block survives, its contents
do not. Measured on `5.20261.52`, applying `addOrReplace` to both blocks with a spec of
`{ key, type_, Name, StyleSheet }`:

| Block             | Before                                    | After                                             |
| ----------------- | ----------------------------------------- | ------------------------------------------------- |
| `Structures/Grid` | `Public=true`, 4 widgets, description set  | `Public=false`, **0 widgets**, description `null` |
| `Styles/WijmoCSS` | `Public=false`, 1 widget, description set  | `Public=false`, **0 widgets**, description `null` |

`Grid` losing `Public=true` alone breaks the component — that flag is what lets consumers drop the
block on a screen. And `oml validate` reports **zero errors** on the wreckage; the only signal is 12
new `UnusedUserAction` warnings (`CreateDataGrid`, `InitGrid`, `SetGridData`, `DestroyDataGrid`, …),
because the actions the gutted block used to call are now referenced by nothing.

This is full-replace reaching one level deeper than the Script case. For a Script, echoing four scalar
properties *is* a complete spec. A block's state includes **child collections** that a flat spec cannot
carry, so echoing `Public` and `Description` as well would not save it — the widgets would still go.

**Therefore the changeset covers 64 objects, not 66.** Refreshing `WijmoCSS.StyleSheet` — and `Grid`
if the upgrade changed `styles/Grid.css` — is a **manual Service Studio step**, reported as a named
follow-up. Include a block change only if a future run finds a non-destructive mechanism (a different
`action` verb, or a spec that carries `Widgets`) *and* proves it against the block-integrity
assertions below.

The asymmetry, still true for Scripts: a Script's `target` is the **eSpace**. A block's would be the
**flow that contains it**, with the block as the `spec`.

## What each object's `spec` carries

Per `module-inventory.md`:

Every Script spec echoes **six** properties from the live query — `Name`, `Public`, `RuntimePath`,
`Folder`, `Description`, `RequiredScripts` — plus the new `JavaScript`. All six, every object, always.

**Strip the UTF-8 BOM from every file copied out of the archive.** All 63 archive `.min.js` files start
with one; the module's script content has never carried any. Copying it in leaves a stray `U+FEFF` at
the head of all 63 scripts — the only content-level difference between a scripted refresh and the
hand-made upgrades that preceded it, and a plausible cause of runtime failures once the platform
concatenates the scripts, because a `U+FEFF` between two IIFEs can suppress the statement boundary and
change what the next function's parameter binds to. `plan.md` already knew to drop the BOM when copying
`wijmo.css`; the rule is the same for every vendored copy. One line:
`s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s`.

Note the consequence for assertions: comparing module content against the archive *as read* passes
happily with the BOM on both sides. Compare against the archive **with its BOM stripped**, and assert
separately that no stored script begins with `U+FEFF`.

- **13 runtime scripts** — `JavaScript` = the matching `*.min.js` from the archive; `Description` =
  `File: <file> - Version: <build string>`.
- **50 culture scripts** — `JavaScript` = the matching `cultures/*.min.js`; `Description` =
  `Script with the culture files - Wijmo library version <build string>`.
- **1 wrapper script** — `GridFramework` = `dist/GridFramework.js`; `Description` unchanged. This is the
  one object with a non-empty `RequiredScripts`: **15 entries** — the 13 Wijmo runtime scripts plus
  `JsZIP` and `GridAuxFeature`. (`GridAuxFeature` itself requires `WijmoJS`, but it is never replaced,
  so its dependency is never at risk.)
- **0 block stylesheets** — excluded by the section above. `WijmoCSS` and `Grid` are refreshed by hand.

Runtime source filenames need no hardcoded table: **the module's own `Description` names its source
file** (`File: wijmo.grid.grouppanel.min.js - Version: <build>`), so parse it rather than maintaining a
mapping. Culture object names are de-hyphenated — see `module-inventory.md`.

## Validation gate

`oml validate` prints a JSON array of messages, each with `Type`, `Id` and `OwnerPath`. It is not a
summary line — count it yourself.

The gate is **set-based**, not count-based:

```
errors == 0  &&  no warning in the output whose (Type, Id, OwnerPath) is absent from the baseline
```

**Compare the set, never the total.** Two ways a count gate gets it wrong, both observed:

- **It fails a clean run.** On `5.20261.52` the baseline was 10 warnings and the output had 9: the
  refresh *removed* a pre-existing `Script_SyntaxErrors` on `GridFramework` ("has syntax errors. Using
  it in your app might cause runtime errors"), because the newly built bundle parses where the module's
  old copy did not. `warnings == baseline` would have rejected a strictly better module.
- **It passes a swap.** One warning gone and one new leaves the total unchanged, which is exactly the
  regression the gate exists to catch.

Report disappeared warnings too — they are evidence for the ADR, not noise.

**Re-measure the baseline on this run's input OML.** Do not carry a recorded number or set forward: it
belongs to one specific export, and a different clone can legitimately differ. And a plain "0 errors"
check is no substitute at all — the block-stylesheet damage above produced **zero errors**.

The reference baseline, for orientation only: `{Error: 0, Warning: 10}` = 7 `UnusedElement`,
2 `InvalidResourceURL_Offline` (base64 image URLs in `Structures/Grid`'s stylesheet), and
1 `Script_SyntaxErrors` on `GridFramework`.

## Full assertion set after apply

Write these as a re-runnable script, not a checklist walked by hand. The generator will need more than
one iteration and every iteration must be re-checked in full.

### `oml diff` first — it is the only assertion that sees what you forgot

```bash
<cli> oml diff <input.oml> <output.oml>
```

It prints a structural tree of everything that moved, property by property and child object by child
object. On a correct 64-script refresh it reports exactly: 64 `(Object Script)` entries, `JavaScript`
changed 64 times, `Description` changed 63 times, `HasSyntaxErrors` once, and — besides container
folders — **nothing else**. No blocks. No `Required Script` lines.

Run it before the property assertions, not after. Both destructive defects found in ROU-12860 were
invisible to a hand-picked field list and glaring here: the block damage showed as changed
`(Object MobileBlock)` nodes, and the lost dependencies as
`(Object Required Script) WijmoJS [RemovedFromForeign]` and fourteen siblings. A field list can only
check what its author thought of; `diff` reports what actually happened.

| Assertion                        | Expected                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| **`oml diff` input → output**    | **64 Scripts; `JavaScript` ×64, `Description` ×63; no block, no `Required Script`, no other property** |
| `GridFramework.RequiredScripts`  | **15 entries, resolving to the same names as the input**                  |
| total `RequiredScripts` in module | **unchanged** (16 on the reference module)                               |
| `changes` length                 | **64**                                                                   |
| no change targets                | `GridAuxFeature` or `JsZIP`                                              |
| `oml validate`                   | `errors == 0` and **no warning absent from the baseline set**             |
| module `Scripts` count           | unchanged (the module's own count, not the changeset's)                   |
| scripts whose content changed    | exactly 64, by content hash — an empty changeset passes every other row   |
| the 63 Wijmo `Description`s      | all name the new build string                                            |
| `GridAuxFeature`, `JsZIP`        | content hash identical to the input                                      |
| `GridFramework`                  | contains **both** version strings written in Phase 5                     |
| node count per flow              | unchanged, flow by flow                                                  |
| **every block: `Public`**        | **unchanged** — `Structures/Grid` in particular must stay `true`          |
| **every block: widget count**    | **unchanged** — `Grid` 4, `WijmoCSS` 1                                    |
| **every block: `Description`**   | **unchanged and non-`null`**                                              |
| **every block: `StyleSheet`**    | hash unchanged, since the changeset no longer touches them                |

The four block rows are the ones that were missing when this route was believed safe. Assert them even
though the changeset does not target blocks — they are cheap, and they are what turns "I did not touch
it" from an intention into a measurement.

Compare maps **order-independently**. `oml query` does not return flows in a stable order, so a naive
`JSON.stringify` comparison of two per-flow maps reports a difference that is not there. Sort the keys
first.

Also worth knowing when writing these: **8 blocks carry a `StyleSheet` property**, not 2 —
`Structures/Grid`, `Styles/WijmoCSS`, `Pagination/ButtonList` and the five `Grid_Events/*` blocks. Only
the first two are upgrade targets; the rest must come through unchanged.

## If one changeset is too large

The probes proved the mechanism for one Script and one block stylesheet; they did not prove it for 66
objects carrying roughly 1.5 MB of minified JavaScript embedded in JSON. No size or encoding limit on
`ParseChangeSet` is known.

If the single pass fails, the symptom tells you where to go. A parse or size error means **split the
changeset**: `apply-changeset` chains cleanly, because one run's output is a valid input to the next,
so N smaller runs are equivalent to one large one. Never respond by trimming the object set — a
partially refreshed module produces false results in Phase 9, in whichever direction.

And never hand-edit the OML. Fix the generator and re-run.

## Ruled out, so no run retries them

- `OutSystems.Cli` has **no** command that fetches a module from an environment. Every `oml` verb takes
  a local file.
- It has **no** O11 support: its README targets ODC, and its `odc publish` is a stub with the one
  working line commented out. The publish half is manual by necessity, which is also why this
  procedure needs no credentials.
- A **protected** export cannot be loaded at all — the platform refuses in
  `CheckOpenPermissions` with `Load is not allowed for this module`, and the CLI supplies no key.
  Protection is key-based rather than absolute, so the fix is to ask the module owner (this team) for
  an unprotected export. Retrying is futile.
