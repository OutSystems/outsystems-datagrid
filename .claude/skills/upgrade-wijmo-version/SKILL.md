---
name: upgrade-wijmo-version
description: >-
  Upgrades the Wijmo build behind the Reactive Data Grid end to end — distribution-archive gate,
  vendored types and stylesheet, version constants, OutSystems module refresh via changeset, ADR and
  run log, Confluence SBOM and record page, Jira enrichment, draft PR. Use when asked to update or
  upgrade Wijmo, to adopt a new Wijmo build or release (e.g. "2026v1-Hotfix", "5.20261.52"), or when
  running /upgrade-wijmo-version against a Wijmo upgrade ticket.
---

# Upgrade Wijmo Version

The upgrade runbook for the **Reactive Data Grid**. Sixteen steps, numbered 0 to 14 with a gate at
8b, from the distribution archive through the draft PR to the documentation trail. Terms used here are fixed in
[`CONTEXT.md`](../../../CONTEXT.md) — *build string*, *version description*, *distribution archive*,
*vendored types*, *per-branch module*, *changeset*, *SBOM row*.

This procedure covers more ground than ROU-12860's AC22 asked for. AC22 predates the discovery that
the OutSystems module must be refreshed before anything can be validated at all; phases 8, 8b and 9
are that surplus, and it is deliberate.

## When to Use

- A ticket asks to update or upgrade Wijmo to a named build (`5.20261.52`) or release
  (`2026v1-Hotfix`).
- A new Wijmo release should be adopted in this repository.
- A Wijmo asset in the `OutSystemsDataGrid` module has to be refreshed to match a build string.

## When NOT to Use

- The **Web Data Grid** (`outsystems-datagrid-web`, Traditional Web, its own much older build
  string). Its assets, its module and its own SBOM row are outside this procedure entirely.
- Grid feature or bugfix work that leaves the Wijmo build string alone.
- Routine bumps of other dependencies, including dependabot PRs that do not touch `wijmo`.

## Guardrails

In force for the whole run, not only where a phase repeats them.

**Staging and git**

- Stage every path by name. `git add -A` is banned in this repository. `specs/` is permanently
  untracked here and is never staged; `.claude/settings.local.json` is never staged.
- Branch from an up-to-date `dev` and commit only on the task branch.
- Sign every commit (`git commit -S`). Confirm a signing key in Phase 1 and abort there if none is
  configured.
- `package-lock.json` and `dist/**` are gitignored, so neither appears in the diff and CI resolves
  dependencies fresh from `package.json` on every install. That is why the dependency is pinned
  exactly, with no caret.

**Vendored files**

- Copy vendored files from the distribution archive; never author or hand-edit one. The archive is
  the only source for all three asset classes — the global-flavor `.d.ts` set, the unminified
  stylesheet, and the module's minified runtime.
- The npm package ships the ES-module `.d.ts` flavor and no `.min.js` at all. When the archive is
  missing, stop and ask for it. Copying `node_modules/wijmo/*.d.ts` breaks the build; hand-converting
  module-flavor definitions to global flavor is forbidden.
- Expect a SonarQube finding on a refreshed vendored stylesheet — the `5.20261.50` refresh produced
  one, raised with the vendor as WJM-37650. Treat it as a consequence of replacing a vendored file
  and raise it upstream. Leave the vendored file exactly as the archive shipped it.

**Version tooling**

- `gulp updateVersion` / `gtaSetVersion` builds its search strings from
  `gulp/DefaultSpecs.js: info.version` and calls `String.replace` with no match assertion. It
  silently no-ops on `README.md`, and on `Constants.ts` whenever `OSDataGridVersion` has drifted from
  `DefaultSpecs`. Grep both files after running it; never assume either was updated.
- Compute the ADR number as the **lowest free number**, from the set actually present in
  `ls docs/adr/` — not the highest plus one, and never a file count. Both wrong answers are live here:
  the directory holds two files numbered `ADR-0005`, so counting is off by one; and a number can be
  *reserved* by being skipped when a later ADR is authored first, so highest-plus-one orphans the gap
  permanently. ROU-12860 hit exactly that — `ADR-0007` was left free for the upgrade while `ADR-0008`
  recorded the automation. Check the `Readme.md` log too: a number can have a file and no row, or a
  row and no file.

**Module work**

- `oml apply-changeset` reads an input and writes a separate output. Run it against a scratchpad copy
  and never write to the module owner's file.
- `addOrReplace` is full-replace: every `spec` echoes back the object's complete queried metadata. An
  omitted property is wiped and the object silently renamed.
- Read every `GlobalKey` and `Folder` from a live `oml query` on this run's module. Recorded knowledge
  is object *names* and *shapes*; a hardcoded key targets the wrong object or nothing at all.
- Verify file sets **by name**. The archive also ships `wijmo.angular*`, `wijmo.react*` and
  `wijmo.vue*` bundles, so a count-based assertion mismeasures while reporting success.
- Reconcile the live module inventory against
  [`references/module-inventory.md`](references/module-inventory.md) before generating anything, and
  stop on any mismatch. A differently-cloned module can carry a renamed script or a missing language,
  and the generator would cover it quietly.
- `GridAuxFeature` and `JsZIP` stay untouched, and the changeset asserts their absence explicitly.
  `JsZIP` stays pinned at its own version; if the archive ships a newer JSZip, raise it as its own
  ticket rather than upgrading a shared dependency inside a Wijmo upgrade.
- A protected OML fails at load with `Load is not allowed for this module` — the platform refusing,
  not the CLI failing. Request an unprotected export from the module owner; retrying achieves nothing.
- **The unprotected export is a working copy, not the publish artifact.** The module that actually
  ships is the protected one, so publishing the unprotected export wholesale would strip its
  protection and carry across every incidental difference between the two, not just the upgrade. The
  refreshed changes go back by **merge onto the protected module**, so only the intended diff lands.

**Validation**

- This repository cannot render a grid. `npm run dev` serves a landing page that lists
  `dist/GridFramework.js` and loads no Wijmo runtime. Every behavioural check runs against a published
  OutSystems module.
- Capture the pre-upgrade baseline before the publish. It is unrecoverable afterwards, and the
  comparative checks are the ones runs skip. A comparative check with no recorded baseline is
  reported `UNVERIFIED`, never "unchanged".

**Outward-facing actions**

- Hard gates, each needing explicit confirmation: the module publish (Phase 8b), the Confluence
  runbook rewrite (Phase 12), any push, PR creation, and undraft.
- No credentials at any point. The publish is manual, so never request, echo, log or persist a
  credential or token, and never place one in a command-line argument.
- Address Confluence by **page ID** only. The space keys quoted in tickets are unreliable; the page
  IDs are not.

**Bookkeeping**

- Every phase emits its run-log line, including the ones that did nothing.
- On a failed step: stop the phase, report, and ask. Improvised recovery around a broken phase is the
  one outcome this procedure exists to prevent.
- **Continuous improvement.** When a run finds this file wrong, incomplete, or silent about a failure
  mode, edit it — and its reference files — in the same run: symptom, root cause, verified fix. Stage
  that edit with the upgrade.
- **After any such edit, re-read the file from disk.** The copy the harness injected when the skill
  was invoked is a snapshot and does not refresh, so a run that keeps following the injected text
  silently ignores its own correction. The file on disk is authoritative.

## Run Log

One line per phase, emitted as the phase closes and appended to the upgrade's ADR in Phase 10:

```
Phase <n>  <name>  <EXECUTED|GATED|PARTIAL|SKIPPED|UNVERIFIED>  <evidence>
```

| State        | Meaning                                                                             |
| ------------ | ----------------------------------------------------------------------------------- |
| `EXECUTED`   | The exit assertion passed against evidence produced on this run.                     |
| `GATED`      | Stopped at a hard gate awaiting a human. Name who was asked and for what.            |
| `PARTIAL`    | Some exit assertions passed, others did not. Name which, individually.               |
| `SKIPPED`    | Not run. State why, and who owns it now.                                             |
| `UNVERIFIED` | Ran, but the evidence needed to judge the result does not exist.                     |

The four non-`EXECUTED` states are the point of the log: they keep a skipped or vacuous phase visible
instead of letting a successful upgrade absorb it. Each one carries a reason and an owner by Phase 14.

## Reference Files

| File                                                             | Holds                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`module-inventory.md`](references/module-inventory.md)           | The 66 module objects by name and shape, and the two that are never touched. |
| [`changeset-recipe.md`](references/changeset-recipe.md)           | The undocumented changeset schema, its three traps, and the validation gate. |
| [`workaround-inventory.md`](references/workaround-inventory.md)   | The 6 Wijmo workaround sites — two of which no keyword grep finds.          |
| [`confluence-and-jira.md`](references/confluence-and-jira.md)     | Page IDs, SBOM rules, the child-page template, the Jira block shape.        |

---

## Phase 0 — Arguments

**Entry**: invoked with zero to two positional arguments.

- `TASK_ID` is required. Validate against `[A-Z][A-Z0-9]*-\d+`; ask once if missing.
- **Derive** the build string and the version description from the ticket rather than asking. Read
  the ticket summary and description: `[DataGrid] - Update version - release 2026v1-Hotfix - Build
  5.20261.52` yields build string `5.20261.52` and version description
  `2026v1-Hotfix Wijmo - Build 5.20261.52` — the `<release label> Wijmo - Build <build string>` shape
  every predecessor used. Echo both and get confirmation before using either.
- `ARCHIVE_PATH` is optional. If absent, offer to download the ticket's `wijmo-<build>.zip`
  attachment (~165 MB) and ask before starting the download.
- Consistency: the build inside the version description equals the build string, and
  `npm view wijmo@<build string> version` resolves to that same build.

**Exit**: `TASK_ID` valid; the build string and version description each quote the **ticket text they
were read from**, and the operator confirmed them; npm resolves; the archive path is known or the
download is agreed. Values the operator supplied instead of the ticket are marked as such — a value
that was asked for was not derived, and Phase 5 writes it into a shipped constant.

**Log**: the four resolved values, each with its provenance.

## Phase 1 — Prerequisites

**Entry**: Phase 0 closed.

Report anything missing rather than working around it:

- `git`; `gh auth status` authenticated; `node` / `npm` (`package.json` pins the toolchain through
  `volta`).
- Signed commits: `git config user.signingkey` and `git config commit.gpgsign`. **No key ⇒ abort
  here**, before anything is edited.
- `dotnet --version` reports 8 or above.
- An `OutSystems.Cli` checkout. **Resolve its location; never assume one.** Nothing guarantees the
  operator has it, or has it where a previous run did, so take the first hit of:

  1. `$OUTSYSTEMS_CLI` or `$OUTSYSTEMS_CLI_HOME`, if either is already set in the environment;
  2. a directory named `OutSystems.Cli` **beside this repository's own checkout** — resolve the
     parent from `git rev-parse --show-toplevel` rather than writing an absolute path;
  3. otherwise **ask the operator for the path** and stop until they answer. If they have no
     checkout, it is cloned from `https://github.com/OutSystems/OutSystems.Cli` — a full clone with
     LFS objects, which is a several-minute step and their call to make, not this run's.

  Verify the resolved directory is a real checkout (`$OUTSYSTEMS_CLI/src/OutSystems.AI.Cli` exists)
  before accepting it, then **export it as `OUTSYSTEMS_CLI` for the rest of the run**. Every `oml`
  command in this skill and its reference files is written against that variable; a literal path
  pasted into a command is a defect, because it silently binds the procedure to one machine.

  Then check the checkout is **non-shallow** (`git rev-parse --is-shallow-repository` → `false`;
  `git fetch --unshallow` first, because Nerdbank.GitVersioning rejects shallow clones), that its LFS
  objects are **real rather than pointer stubs** (`git lfs ls-files` lists them and their on-disk
  sizes are not ~130 B), and that it builds:
  `dotnet build "$OUTSYSTEMS_CLI/src/OutSystems.AI.Cli/OutSystems.AI.Cli.csproj" -c Release`.

**Exit**: every check reports a version or an explicit OK. `OUTSYSTEMS_CLI` points at a verified
checkout. Nothing is deferred to "later in the run".

**Log**: the tool versions, the resolved `OUTSYSTEMS_CLI` path **and which of the three rules resolved
it**, and the CLI build result.

## Phase 2 — Asset-source gate

**Entry**: Phase 1 green. Nothing in the repository has been edited yet — and nothing is, until this
phase passes.

The archive is the only source (see the vendored-files guardrails). Extract into the scratchpad only.

**Layout, measured on `5.20261.52`.** The zip contains a single top-level `wijmo-<build string>/`
directory, so `$A` below is that inner directory, not the extraction target. Under it, the files this
procedure needs sit in **three** places, not one:

| Needed                                    | Archive path                    |
| ----------------------------------------- | ------------------------------- |
| 45 of the 47 vendored root `.d.ts`, all `.min.js`, `cultures/` | `$A/Dist/controls`   |
| `wijmo.meta.d.ts` — global flavor         | `$A/Dist/interop/meta`          |
| unminified `wijmo.css`                    | `$A/Dist/styles`                |

`wijmo.interop.grid.d.ts` is the 47th and is **not in the archive in global flavor at all** — only
under `NpmImages/*`, in the same ES-module flavor npm ships. See Phase 4 step 3.

**`unzip`'s `*` does not cross `/`** on Git Bash, so `"$A/Dist/controls/*"` silently omits
`cultures/`. Name each subdirectory explicitly:

```bash
unzip -q -o "$Z" "wijmo-<build>/Dist/controls/*" "wijmo-<build>/Dist/controls/cultures/*" \
                 "wijmo-<build>/Dist/interop/meta/*" "wijmo-<build>/Dist/styles/*"
```

Verify all three asset classes, **by name**, using the lists in
[`references/module-inventory.md`](references/module-inventory.md):

```bash
A="<extracted>/wijmo-<build string>"                # the versioned dir INSIDE the zip
V=src/@types/wijmo-<old build>                      # the set currently vendored

grep -rl "declare module wijmo" "$A/Dist/controls" | wc -l         # global flavor, many files
grep -rl "^import .* from 'wijmo/" "$A/Dist/controls" | grep -v interop | wc -l   # 0: no ES flavor

# every vendored root .d.ts is accounted for, against the UNION of its three sources.
# One-way, because the archive ships far more than we vendor. This, not the count above,
# is the real global-flavor gate — and it must come back EMPTY, with no lines to
# "learn to ignore".
comm -23 <(ls -1 "$V"/*.d.ts | xargs -n1 basename | sort) \
         <( { ls -1 "$A/Dist/controls"/*.d.ts
              ls -1 "$A/Dist/interop/meta"/*.d.ts
              ls -1 node_modules/wijmo/wijmo.interop.grid.d.ts; } \
            | xargs -n1 basename | sort -u )

wc -l "$A/Dist/styles/wijmo.css"                    # thousands of lines, not ~13 (unminified)

# the 13 runtime bundles, by name. Echo the count checked so the loop cannot pass
# silently on a short list.
NAMES="<the 13 names from module-inventory.md>"
for f in $NAMES; do
  test -f "$A/Dist/controls/$f.min.js" || echo "MISSING: $f.min.js"
done
echo "names checked: $(echo $NAMES | wc -w)"        # must be 13

# the release's new properties are declared in the ARCHIVE's own types, not only in npm's
grep -n "<each new property from the ticket's API Updates>" "$A/Dist/controls/wijmo.grid.d.ts"

# culture-language parity, both directions — must print nothing
comm -3 <(ls -1 "$V"/cultures/*.d.ts | xargs -n1 basename \
            | sed 's/wijmo\.culture\.//; s/\.d\.ts//' | sort) \
        <(ls -1 "$A/Dist/controls/cultures"/*.min.js | xargs -n1 basename \
            | sed 's/wijmo\.culture\.//; s/\.min\.js//' | sort)

find "$A" -iname "*jszip*" | head              # does the archive carry its own JSZip?
```

**Exit**: 13 runtime names checked and all located; the vendored root `.d.ts` diff empty; both culture
diffs empty; the unminified stylesheet found; every new property the ticket names declared in the
archive's own `.d.ts`; the JSZip question answered either way. Any gap stops the run and escalates to
the ticket reporter.

**Log**: the three asset classes with the assertion that located each, the property declarations
confirmed, plus the JSZip answer.

## Phase 3 — Branch

**Entry**: Phase 2 green.

`git fetch origin`, then create `<TASK_ID>` from `origin/dev`. Never commit on `dev`.

**Exit**: `git rev-parse --abbrev-ref HEAD` is `<TASK_ID>`, and its merge-base is the current
`origin/dev`.

**Log**: branch name and base commit.

## Phase 4 — Dependency and vendored assets

**Entry**: Phase 3 green.

1. `npm install wijmo@<build string> --save-exact --save-dev` — exact, no caret. Then
   `rm -rf node_modules && npm install` and read the installed manifest back. On Windows `npm install`
   can die with a libuv assertion leaving `node_modules` empty: rerun and re-verify the printed
   version.
2. Create `src/@types/wijmo-<build string>/` from the archive, copying **only what is currently
   vendored** — the same root `.d.ts` set plus `cultures/`, not the whole archive. The root set comes
   from **two** archive directories: `Dist/controls` for 45 of them, and `Dist/interop/meta` for
   `wijmo.meta.d.ts`. Copying only from `Dist/controls` drops `wijmo.meta.d.ts` and breaks the
   entry-set parity. Remove the old directory with `git rm` so the rename is reviewable.
3. `wijmo.interop.grid.d.ts` — the 47th root file, and the exception. **The archive carries no
   global-flavor copy**: its only copies live under `NpmImages/*` in the same ES-module flavor as npm.
   So take `node_modules/wijmo/wijmo.interop.grid.d.ts`, verbatim, no hand edits, and record in the
   ADR that it stays ES-module flavor. That is not a defect: a `.d.ts` with top-level
   `import`/`export` is a module, contributes no globals, and this file is referenced nowhere in
   `src/` — it compiles and goes unused. Do not go looking for a global version; there isn't one.
4. Replace `styles/wijmo.css` with the archive's unminified `Dist/styles/wijmo.css`, formatted with
   the repo's own Prettier config so the diff is reviewable, and with the leading UTF-8 BOM dropped to
   match the previous file. `styles/Grid.css` is not touched here.
5. **Fail fast**: `npx tsc --noEmit -p tsconfig.json`.

**Exit**: installed manifest reports the build string; a **two-way name diff** of the new vendored
directory against its predecessor is empty, root files and `cultures/` alike — a count would pass on a
set that swapped one file for another; every root `.d.ts` header names the new build string; all but
`wijmo.interop.grid.d.ts` are global flavor; the old directory is gone; `styles/wijmo.css` header
names the new build string; `tsc --noEmit` is clean. A flood of `Cannot find namespace 'wijmo'` here
means step 2 copied the wrong flavor — fix the source, never the call sites.

**Log**: the pinned version, the vendored entry count, the interop source chosen, the `tsc` result.

## Phase 5 — Version strings

**Entry**: Phase 4 green.

- `src/OSFramework/DataGrid/Constants.ts`: `WijmoFlexGridVersion` = the version description, keeping
  the established `'<release label> Wijmo - Build <build string>'` shape.
- Same file: `OSDataGridVersion` = `gulp/DefaultSpecs.js: info.version` (which equals
  `package.json: version`). This closes a drift, it does not increment a release — and it restores the
  release bot's ability to find and replace that literal (see the version-tooling guardrails).
- Sweep the old build string across, and only across: `CLAUDE.md`, `ARCHITECTURE.md` (including its
  `Last Updated` line), `package.json`, `Constants.ts`, `styles/wijmo.css`, `src/@types/`.
  **Historical documents are excluded by design** — `docs/adr/**` records past decisions, its
  `Readme.md` rows name the builds they were about, and `specs/**` is a record of past tickets.
  Rewriting any of them would falsify the history.

**Exit**: a grep for the old build string over the swept files prints nothing; a grep for the new one
finds it in each; `docs/adr/` and prior `specs/` are unchanged.

**Log**: both constants, and the swept file list.

## Phase 6 — Release review

**Entry**: Phase 5 green. Offline analysis; independent of Phase 4.

**Both lists are enumerated from a source outside this run** — otherwise a run that enumerates nothing
gives a verdict on nothing and the exit passes. Write both counts down before deciding anything: the
number of entries in the ticket's *API Updates* and *Breaking Changes* sections, and the number of
workaround sites the grep returns.

1. **New-release opt-in / opt-out.** For every property the release's *API Updates* section adds to
   a control this component uses, record an explicit adopt-or-decline decision with its reason. A
   fixed provider option lands in `FlexGridConfig.getProviderConfig()` with a one-line rationale
   comment beside its siblings, and its scalar type on `Types.IGridProviderConfigs` — members
   alphabetical, which lint enforces. Prefer a literal over a computed value: the assembly loop
   strips `undefined`.
   `_getProviderConfig()` returns `unknown` and the bag is never checked against Wijmo's types, so a
   green build says nothing about whether the option exists or is honoured. Its evidence is Phase 9.
2. **Workaround inventory.** Take the site list from
   [`references/workaround-inventory.md`](references/workaround-inventory.md) — **not** from a keyword
   grep, which finds only 4 of the 6 sites and misses the two most upgrade-sensitive ones. Cross-check
   each against the release's changelog ids and give it a kept-or-removed verdict with a written
   justification. Removing a workaround is its own ticket unless this one says otherwise; a verdict
   that depends on the refreshed DOM stays provisional until Phase 9.

**Exit**: the verdict count **equals** the *API Updates* entry count, and every *Breaking Changes*
entry has an impact assessment — including the ones assessed as not applicable, named rather than
omitted. Every site in `workaround-inventory.md` has a verdict, and
`grep -rn "workaround\|Workaround" src --include=*.ts` — run as a *supplement*, to catch sites the
inventory does not yet list — surfaces nothing new. Nothing under `src/Providers/` changed and no
`OutSystems.GridAPI` surface was added (NFR2, NFR5) — `git diff --name-only` proves it.

**Log**: the two source counts, the adopted / declined and kept / removed splits against them, and any
provisional verdict by name.

## Phase 7 — Build gate

**Entry**: Phases 4-6 green.

`npm run build` exits 0 with **no errors and no warnings at all** — `CONTRIBUTING.md` sets that
absolute bar, and it is the checkable one: "no *new* diagnostics" needs a pre-change build nobody
captured. Then `git status --short` to confirm the `lintfix` step touched nothing outside this
upgrade's paths.

Two things this gate does **not** cover, so neither is evidence of anything:

- **`styles/`** — `createProduction` is `cleanOldFiles` + `transpileProd`, and nothing in the build
  reads the stylesheet.
- **the provider option bag** — untyped at the boundary (Phase 6).

Expect the SonarQube stylesheet finding (see the vendored-files guardrails). For `5.20261.52`, Mescius
marks WJM-37650 as fixed in `2026v1-HF`: check whether the finding is gone and carry the answer into
Phase 12.

**The exit code is not evidence the bundle exists — assert the artifact.** This gate used to pass on a
build that emitted nothing: `cleanOldFiles` piped `gulp.src('./dist/*')` into `gulp-clean` without
returning the stream and called `cb()` at once, so gulp started the transpile with the delete still
pending. The TypeScript compile is synchronous and blocks the event loop for seconds, starving the
glob's `readdir`; when it finally ran it listed `dist/` *after* the compile had written the bundle and
unlinked exactly the fresh files. Not a flaky race — reliably scheduled after the write, which is why
it looked like the build simply produced nothing.

Fixed in ROU-12860 by returning the stream. If a future run finds `dist/` empty behind a green build,
check that `cleanOldFiles` still returns it: that one missing `return` is the regression tell, and the
symptom is indistinguishable from a compile failure until you notice `npx tsc --noEmit` is clean.
A `cleanOldFiles` that completes in well under a millisecond did not wait for its stream.

**Exit**: exit code 0 with an empty error and warning list; **`dist/GridFramework.js` exists**, is
within a plausible size of its recorded value, and contains both version strings written in Phase 5;
working tree shows only intended paths.

**Log**: the exit code, and whether the SonarQube stylesheet finding appeared.

## Phase 8 — Module script refresh

**Entry**: Phase 7 green, `dist/GridFramework.js` built. Read
[`references/module-inventory.md`](references/module-inventory.md) and
[`references/changeset-recipe.md`](references/changeset-recipe.md) before starting.

1. **Request the per-branch module.** `OutSystemsDataGrid_<TASK_ID without the hyphen>`, created by a
   hand clone of the base module, exported **unprotected**. Nothing in the pipeline produces it.
2. **Copy it into the scratchpad and check the copy is faithful** (`sha256sum` both). All later work
   runs on the copy.
3. **Reconcile the live inventory.** `oml query` the module's `Scripts` and its `MobileFlows` /
   `Nodes`, and diff the names two-way against the recorded inventory. **Any mismatch stops the
   phase.**
4. **Generate one changeset** covering the **64 scripts** — 13 runtime, 50 cultures, `GridFramework` —
   each `spec` echoing all six queried properties, **`RequiredScripts` included**, each `Description`
   rewritten to name the new build string, and **the archive's UTF-8 BOM stripped from every file**.
   Two traps here, both silent: omitting `RequiredScripts` costs `GridFramework` its 15 dependencies on
   the Wijmo runtime, and keeping the BOM leaves a stray `U+FEFF` at the head of all 63 scripts. Neither
   shows up in `oml validate`; both break the grid at load. Assert that no change targets `GridAuxFeature` or `JsZIP`. **The two block stylesheets
   are not in the changeset**: `addOrReplace` on a block wipes its widgets, resets `Public` and nulls
   its `Description` with zero validation errors to show for it. They are a manual Service Studio step
   (Phase 14).
5. **Apply to a copy and validate.** `oml apply-changeset <in> <out> <changeset>`, then the assertion
   set in `changeset-recipe.md`, written as a re-runnable script — the generator will need iterations
   and each one must be re-checked in full. If the single pass fails on a parse or size error, split
   the changeset: `apply-changeset` chains, because one run's output is a valid input to the next.
   Never respond by trimming the object set.
6. **Deliver the output where the operator can reach it.** `apply-changeset` writes a *separate* file,
   so the module owner's export is never modified — which also means **the refreshed module is not the
   file they handed over**, and saying "done" while the only copy sits in a session scratchpad hands
   them nothing. Copy the validated output next to their original under a name that carries the new
   build (`OutSystemsDataGrid_<TASK>_<build string>.oml`), verify the copy by hash, and re-run
   `oml validate` **on the delivered file** rather than trusting the one you validated upstream. Then
   name both paths explicitly when reporting.

**Exit**: every assertion below. Two things they are built to defeat: an **empty changeset**, which
satisfies validate, unchanged counts and byte-identity perfectly by doing nothing; and **collateral
damage to a property nobody thought to check**, which is how this phase shipped a gutted block and a
dependency-less `GridFramework` on its first real run.

- **`oml diff` between input and output reports only the intended change** — 64 `(Object Script)`
  entries, `JavaScript` ×64, `Description` ×63, and no block, no `Required Script`, no other property.
  Run this first: it is the only assertion that reports what you did not think to look for.
- `GridFramework.RequiredScripts` still holds its 15 entries, resolving to the same names as the input,
  and the module's total `RequiredScripts` count is unchanged.
- **No stored script begins with `U+FEFF`**, and the runtime scripts equal the archive files *with the
  archive's BOM stripped*. Comparing against the archive as-read passes with the BOM on both sides,
  which is how it got in.
- `changes` length **is** 64, and its target names diff empty against the reconciled inventory.
- **63** objects in the output name the new build string in their `Description` — a count, not a
  "for each", which is vacuous over an empty set.
- Exactly 64 scripts differ from the input **by content hash**, and no others.
- `oml validate` reports `errors == 0` and **no warning whose `(Type, Id, OwnerPath)` is absent from
  the baseline set** — set-based, because a count both fails a run that removed a stale warning and
  passes a swap. Disappeared warnings are reported, not ignored.
- The module's own script count is unchanged; per-flow node counts are unchanged.
- `GridAuxFeature` and `JsZIP` hash identical to the input.
- **Every block keeps its `Public`, its widget count and its `Description`** — `Structures/Grid` still
  `Public=true` with 4 widgets. Nothing in the changeset targets a block, which is exactly why this is
  asserted rather than assumed.
- `GridFramework` in the output carries both new version strings from Phase 5.
- The delivered file sits outside the scratchpad, hashes equal to the validated output, and passes
  `oml validate` in place. The owner's original is byte-unchanged.

**Log**: the `changes` count and the 63-description count as measured, the validate result against its
measured baseline, and the two untouched objects confirmed identical.

## Phase 8b — Baseline capture and publish handoff

**Entry**: Phase 8 green. **Nothing is published before step 1.**

1. **Capture the pre-upgrade baseline.** It is unrecoverable once the module is republished, and the
   comparative checks in Phase 9 are void without it. Record, into a named evidence folder: the
   metadata a spreadsheet export writes, a decimal column's rendering of a typed and a pasted
   excess-precision value, the filter panel's button DOM and appearance, plus one observation per
   comparative item in the release's *Breaking Changes* section.
   A live "before" beats snapshots: the public sample runs the released build, and the predecessor
   record page used exactly that for its side-by-side. Confirm with the module owner which is
   available.
2. **Hard gate — merge onto the protected module, then publish.** Do not publish the validated
   unprotected OML directly (see the module-work guardrails). Hand it over as the *source of the
   change*, to be merged onto the protected module so protection survives and only the upgrade's diff
   lands. A three-way merge is the mechanism — Service Studio's, or `oml merge <base> <ours> <theirs>
   -o <out>`, which writes an output only when there are no conflicts; the common ancestor is the
   pre-upgrade export the run started from. Then a Service Studio 1-Click Publish. **Stop until the
   owner confirms it succeeded.** No API publish, therefore no credentials at any point.
3. **Refresh the per-branch sample apps** so they consume the republished module, and confirm which
   sample and screen Phase 9 will use, with its URL. Their conventional names are in
   `confluence-and-jira.md`. A sample still bound to the previous module makes every Phase 9 result
   meaningless in an unknown direction — which is what the runtime gate exists to catch.

**Exit**: the evidence folder covers every comparative item; explicit publish confirmation received;
the environment URL and sample-screen path are known.

**Log**: `GATED` until the publish is confirmed; then the evidence-folder path and the sample URL. If
the baseline was missed, say so here — Phase 9 will report `UNVERIFIED`, not "unchanged".

## Phase 9 — Manual validation

**Entry**: Phase 8b confirmed. Everything here runs in a browser against the refreshed module.

**Runtime gate, first and non-negotiable.** In the browser console on the sample screen:

```js
OSFramework.DataGrid.Constants.WijmoFlexGridVersion;                      // the version description
wijmo.grid.FlexGrid.prototype.hasOwnProperty('<the release's new property>');  // must be true
```

The second line is the only reliable proof the **Wijmo runtime itself** is on the new build — for
`5.20261.52` the property is `preventCut`. On `false`, stop: the module is partially refreshed and
every result below would be meaningless in an unknown direction.

**Do the offline half first — much of this phase does not need a browser.** Two classes of check are
provable by comparing the old and new runtime scripts, which are both in hand (the pre-upgrade export
and the refreshed module):

- **A breaking change that removes a default** shows up as the literal disappearing. On `5.20261.52`,
  `WijmoXlsxJS` went from one occurrence of `<Company>…(e.company || "GrapeCity, Inc.")` to zero —
  which proves the before *and* the after from the vendor's own code, more firmly than a screenshot,
  and needs no captured baseline at all.
- **A workaround that hooks a vendor internal** is only as safe as that internal. Grep both runtimes
  for each hook and compare counts: `_eTip` (tooltip), `getClipString` (CSV export),
  `reApplyFilterOnUpdate`, `cloneFrozenCells`, `itemsEdited`. Equal counts mean the hook survived; a
  count dropping to zero means a workaround has gone quietly inert, since most are guarded by an
  `if` that simply stops firing.

Then the browser half. **Every item names an action, an observable, and the exact expected string where
one exists** — a checklist that says "check tooltips" cannot be executed or disputed:

| AC   | Action                                                                 | Expected observable                                                                 |
| ---- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| AC13 | Click a column header twice; open a column filter and Apply; drag a column into the group panel; double-click a cell, type, Enter | Sorts ascending then descending; rows filter; rows group under headers; the value commits and `OnCellValueChange` fires |
| AC14 | Bind a source containing a `null` or primitive row                      | Valid rows render, and the console reads exactly `[DataGrid] Dropped N non-object row(s) from data source.` |
| AC15 | Group a text column, export CSV, open the file in a text editor         | No `<b>` or `</b>` anywhere; group header rows read as plain text                    |
| AC16 | Hover a cell with a tooltip; then hover a cell failing validation        | Tooltip appears with the standard class; the invalid one carries the error-validation styling |

Add one row per intent-specific change this upgrade made on purpose, phrased the same way.

Write each result into the evidence folder as it happens; re-running browser checks is expensive and
Phase 10 consumes them.

Any comparative item whose Phase 8b baseline is missing is reported `UNVERIFIED`.

**Loop back if this phase edits `styles/Grid.css`.** The refreshed stylesheet can move the DOM under
our own overrides, so this is the phase that changes them — and the moment it does, the module's `Grid`
block stylesheet is stale and every result gathered after that point was measured against the old CSS.
Re-run Phase 8 for that single object, republish, and re-check whatever the change could affect.
Shipping the repository's `Grid.css` against a module carrying the previous one is the silent failure
this loopback exists to stop.

**Exit**: the runtime gate returned `true`; every checklist item has a recorded result; every
provisional Phase 6 verdict is now final; if `styles/Grid.css` changed, the module carries the changed
copy and the affected checks were re-run against it.

**Log**: the gate result, and the pass / `UNVERIFIED` split with each `UNVERIFIED` item named.

## Phase 10 — ADR and run log

**Entry**: Phase 9 closed. The ADR records verified outcomes, not intentions.

- Compute the next ADR number (see the version-tooling guardrails) and author
  `docs/adr/ADR-<NNNN>-Wijmo-Upgrade-<release label>.md` from `ADR-0000-Title-of-ADR.md`, status
  `Accepted`. Cover: the build move and its ticket; the exact-pin rationale; each new-property
  decision from Phase 6; the archive-sourcing constraint; the module refresh with its inventory,
  schema traps and validation gate; the `wijmo.interop.grid.d.ts` disposition; the breaking-change
  assessment with Phase 9 evidence; the workaround table with verdicts; and what was **not** run
  here, named.
- Add one row to `docs/adr/Readme.md`, columns padded to the surrounding table. Do not renumber or
  edit existing rows.
- Append the complete run log under an execution-record heading.

**Exit**: the ADR exists and is `Accepted`; the log row is present and aligned; the run log has one
line per phase 0-14 with no unexplained non-`EXECUTED` state.

**Log**: the ADR number and the run-log line count.

## Phase 11 — Commit and PR

**Entry**: Phases 4-10 closed. This runs **before** the two documentation phases, which both need
the PR link.

- Stage by name: `package.json`, the new `src/@types/wijmo-<build string>/`, the old directory's
  deletion, `Constants.ts`, any provider-config files Phase 6 changed, `styles/wijmo.css`,
  `styles/Grid.css` if Phase 9 changed it, `ARCHITECTURE.md`, `CLAUDE.md`, `docs/adr/`, any
  build-tooling fix the run had to make to get a green gate, and any edit the continuous-improvement
  clause made to this skill or its references. Never `.claude/settings.local.json`; never `specs/`.
- Signed commit, `<TASK_ID>: <subject>`.
- **Hard gate** before pushing.
- Draft PR against `dev`: same title, satisfying `^([A-Z][A-Z0-9]*-\d+(:)?\s\w)`, with at least one of
  `feature` / `bug` / `bugfix` / `dependencies` / `dependency` / `chore`; body following
  `.github/pull_request_template.md` and naming the module refresh, the archive-sourcing constraint,
  each new-property decision, and the out-of-scope items. Tick *requires changes in OutSystems*.
- **Hard gate** before creating the PR, and again before undrafting. It stays a draft until
  validation is confirmed green.

**Exit**: `git status --short` shows nothing unintended; `git log -1 --show-signature` confirms the
signature; `gh pr view --json isDraft,title,labels` matches the rules above.

**Log**: the commit SHA, the PR number, and its draft state.

## Phase 12 — Confluence

**Entry**: Phase 11 closed, so the PR link exists. All targets, rules and templates are in
[`references/confluence-and-jira.md`](references/confluence-and-jira.md). Page IDs only.

- **SBOM row**: the Data Grid **Reactive** row of the two; **replace** the value with the version
  description. The Web Data Grid row is untouched.
- **Child page**: create `Wijmo update v<old build> to v<new build>` under the runbook, following the
  precedent template. Fill the derivable sections; leave the operator's sections as visible
  placeholders rather than guesses.
  The PR link comes from Phase 11, which is why that phase now runs first: an earlier ordering had
  this page written before the PR existed, leaving a placeholder someone had to remember to fill.
- **Reported issues**: derive the candidate list — rows whose status names this release, intersected
  with the release's changelog ids — and hand it to the operator. Do not write verdicts.
- **First run only, hard gate**: replace the runbook body with a pointer to this skill, keeping the
  child-page index. It is a shared team page whose original author has left. Confirm before editing.

**Exit**: the child page renders; the Reactive SBOM value is the version description and the Web row
is unchanged; no page carries a procedure that competes with this skill.

**Log**: page IDs written, and every section left to the operator, by name.

## Phase 13 — Jira enrichment

**Entry**: Phase 12 green, and the PR from Phase 11 exists — `/enrich-jira-task` needs its link.

**Delegate to `/enrich-jira-task`.** That command already owns this job and does it better than a
hand-rolled write: it locates the ticket's existing **What I Did** slots by heading text and injects
into them as ADF via `acli jira workitem edit --from-json`, so the Context, Changelog, Acceptance
Criteria and DoD panels — and their smartlinks — are untouched. It also gates on assignee and
`In Progress` status, marks the section as generated, and is idempotent on re-runs.

```
/enrich-jira-task <TASK_ID> <sample app URL>
```

Two of its defaults assume a different repository and need overriding here: it diffs against
`origin/main` where this repo uses **`origin/dev`**, and it derives *Points of Impact* from
`src/scripts/Components/**`, which does not exist here — for a Wijmo upgrade the honest value is
`All Grid functionalities`, as every predecessor page has said.

Automated-test runs and test-case outcomes belong to the operator; leave them as placeholders rather
than filling them from assumption. Do not hand-write the block, and do not settle for a comment: the
MCP `editJiraIssue` replaces the whole `description` field, which is why the surgical ADF route exists.

**Exit**: every derivable bullet carries a real link or value; every non-derivable one is a visible
placeholder.

**Log**: which bullets were filled and which were left.

## Phase 14 — Final checklist

**Entry**: Phase 13 closed.

Report these as named manual follow-ups, each with an owner — they are outside this skill and are
lost if they are not said out loud:

- **The two block stylesheets, by hand in Service Studio.** `Styles/WijmoCSS` takes the refreshed
  `styles/wijmo.css`; `Structures/Grid` takes `styles/Grid.css` **only if this upgrade changed it**.
  Not scriptable — see `changeset-recipe.md`. Until this is done the module carries the previous
  Wijmo stylesheet, so Phase 9's filter-panel and rendering checks are measuring the old CSS.
- **Sample-app refresh**, if Phase 8b step 3 did not already cover it. Validation runs against the
  per-branch sample apps, which this skill does not touch. URLs in `confluence-and-jira.md`.
- **RPM board** entries, if the release fixed anything a customer reported.
- **Third-Party Tools registry** (`engineering.outsystems.net/ThirdPartyTools/`) once the component
  reaches production.
- **External regression suite** — the WebdriverIO/Cucumber suite in `outsystems-datagrid-tests`, and
  its test-case spreadsheet. Not run here; its outcome gates the PR undraft.
- **Release notes** draft, calling out any breaking change.
- **The child page's operator sections** — fixed issues, new issues found, RPMs, automated-test runs.
- **The module release publish**, as distinct from the per-branch publish in Phase 8b.

Then restate the run log in full, and for each non-`EXECUTED` line give its reason and its owner.

**Exit**: every follow-up has an owner; no run-log line is unexplained.

**Log**: `Phase 14 Final checklist EXECUTED <count> follow-ups reported, <count> non-EXECUTED lines
explained`.
