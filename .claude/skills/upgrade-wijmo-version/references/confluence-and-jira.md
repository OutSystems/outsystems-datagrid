# Confluence and Jira Targets

## Address pages by ID only

| Page ID      | Title                                    | Role                                                     |
| ------------ | ---------------------------------------- | -------------------------------------------------------- |
| `3058631508` | Wijmo Updates                            | The upgrade runbook **and** the index of per-upgrade pages |
| `2745598610` | External Libraries in UI Components      | The SBOM                                                  |
| `3353313306` | Issues reported to the provider libs     | Issues raised with the vendor, with a status per issue     |

All three live in space **`RDMBLVS`** ("R&D - Web & Mobile Apps - Value Stream").

**The space keys quoted in tickets are wrong.** ROU-12860 places the SBOM in `RDOO` and the
reported-issues page in both `RDOO` and `RDMBVS`. Those links resolve only because Confluence
tolerates a stale space key in the path. Look pages up by ID; never construct a URL from a
ticket-quoted space key, and never search by title expecting one space.

---

## SBOM row (`2745598610`)

The page's main table has columns **Asset | Library | Version | Licence | Components**. Two rows name
Wijmo:

| Asset                                     | Touch it?                                    |
| ----------------------------------------- | -------------------------------------------- |
| `OutSystems Data Grid (Reactive)`         | **Yes** — this is the row an upgrade updates. |
| `OutSystems Data Grid Web (Traditional)`  | **No.** Different component, its own build.   |

**The update API takes the whole page body, so a one-cell edit is a full-body rewrite.** This page
carries 28 rows owned by other teams, plus a Team Forks table, inline-comment annotations, a user
mention and per-column widths. Fetch with `contentFormat: "html"` — it round-trips faithfully, verified
— change only the target value, and **re-fetch and diff afterwards** to prove exactly one cell moved.
Page history is the recovery route if it did not. Never edit this page through `markdown`, which is
lossy.

Rules:

- **Replace** the Version value with the version description, e.g.
  `2026v1-Hotfix Wijmo - Build 5.20261.52`. One value, not a history.
- **Do not copy the Charts rows' behaviour.** `OutSystems Charts (Reactive)` accumulates one line per
  release in a single cell. The Data Grid rows never have, and matching Charts here would silently
  change what the row means.
- Leave `Licence` and `Components` alone. The library link points at the vendor's download page and
  carries no build string.
- The page's own note ("once the new components are released into production we need to update this
  information at `engineering.outsystems.net/ThirdPartyTools/`") is a **separate, manual** follow-up.
  It is reported in Phase 14, not performed.

## Reported issues (`3353313306`)

Section **"Wijmo Flexgrid - Reported Issues/Requests"**, a table of
**Issue ID | Title | Description | Status**, where Status names the release a fix landed in
(`2026v1-HF`, `Solved in v5.20251.34`, `Closed`, …).

Derive a **candidate list** and stop there: rows whose Status names the release being adopted,
intersected with the release's changelog ids. Hand that list to the operator. Deciding whether a
reported issue is genuinely fixed needs the reproduction sample, and a wrong verdict here removes a
workaround that customers depend on — so this skill never writes a status.

One row is worth knowing about in advance: **WJM-37650** ("Compilation issue with an SCSS file", the
SonarQube duplicated-CSS finding on `wijmo.css`) is marked fixed in `2026v1-HF`. Phase 7 records
whether the finding actually disappeared; that answer belongs in this row.

## Child page (under `3058631508`)

Ten predecessors, back to 2023, titled `Wijmo update v<old build> to v<new build>` — most recently
`Wijmo update v5.20252.44 to v5.20261.50` (page `6242140231`, ROU-12689), which is the template
source. Nothing needs inventing.

### Section-by-section split

Every section of the precedent page, and who fills it:

| Section                                        | Source                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Jira Task → <link>`                           | **Auto** — from `TASK_ID`.                                                                          |
| *Updated the page 3353313306…*                 | **Operator** — the candidate list above is provided; the verdicts are theirs.                        |
| *Updated the page 2745598610*                  | **Auto** — the SBOM row, done in Phase 12.                                                          |
| *Updated the RPMs*                             | **Operator** — the RPM board is outside this skill. `N/A` is a legitimate answer and the precedent's. |
| **Code** → PR                                  | **Auto** — the draft PR from Phase 11.                                                                |
| **Code** → OutSystems → Module                 | **Auto** — the module refreshed, and what changed in it, from the Phase 8 log.                       |
| **Points of Impact**                           | **Auto** — `All Grid functionalities`, as every predecessor. Narrow it only on evidence.             |
| **Samples** → Screens                          | **Auto** — the conventional URLs below.                                                             |
| **Automated Tests** → PR + pipeline runs       | **Operator** — a different repository and pipeline; not run here.                                    |
| **Test Cases**                                 | **Auto template, operator outcome** — the regression walk below; pass/fail is theirs.               |
| `### ✅ Fixed Issues`                          | **Operator, always.** `_None_` is the precedent's answer and a valid one.                            |
| `### ⚠️ New issues found:`                     | **Operator, always** — needs screenshots and vendor ticket ids. Phase 7's SonarQube answer feeds it. |

Leave every operator section present as a visible placeholder. An absent section reads as "nothing to
report"; a placeholder reads as "not yet done".

### Test-case template

The precedent's single test case, which generalises:

> **Test Case 1 — Regression**
> - Open the automation sample app, exercise its screens, confirm everything is as expected.
> - Open the `Overview` screen of the sample app, exercise its screens, confirm everything is as
>   expected.

## Sample-app URL conventions

Validation runs against two **per-branch sample apps**, both hand-made clones. This skill does not
touch either — they are a named manual follow-up (Phase 14) — but it emits their URLs into the child
page so the gap is explicit rather than discovered during validation.

With `<TASK>` = the task id with its hyphen removed (`ROU-12860` → `ROU12860`):

```
https://outsystemsui-dev.outsystemsenterprise.com/OSDataGridAutomation_<TASK>
https://outsystemsui-dev.outsystemsenterprise.com/OutSystemsDataGridSample_<TASK>/Overview
```

And the **pre-upgrade baseline** for Phase 8b — the public sample, which runs the released build and
therefore stays on the old one for the length of the upgrade:

```
https://outsystemsui.outsystems.com/OutSystemsDataGridSample/
```

The precedent page used exactly that for its before/after comparison, and ROU-12860 chose it over
snapshots. A live "before" beats a folder of screenshots, and it survives the republish that destroys
a snapshot-based baseline. Confirm it is still on the old build before relying on it — its version is
readable from `OSFramework.DataGrid.Constants.WijmoFlexGridVersion` in the browser console, which is
the same one-liner Phase 9 uses on the refreshed side.

## Runbook rewrite (`3058631508`) — first run only

The parent page is both a runbook and the child index. Its body is a seven-step manual procedure last
touched in October 2024: its author has left, its download link points at a retired domain, and its
asset step describes a module folder layout that no longer matches the module.

Replace the body with a pointer to this skill, keeping the child-page index intact and keeping the
License Update links at the foot. Leave the child pages themselves untouched — they are the historical
record.

**Hard gate.** This is a write to a shared team page whose original author has left. Confirm before
editing, and do it once — later runs only add a child page.

## Jira "What I Did" block

The ticket ships this block empty in its description. Fill it in place, keeping its exact shape:

```markdown
**What I Did**

* **Code**:
    * PR →
    * OutSystems →
* **Points of Impact**:
* **Samples**:
    * Screens →
* **Automated Tests**:
    * PR →
* **Test Cases**:
    * Test Case 1
    * Test Case N
```

Auto: `Code` (the PR link, and the module refreshed), `Points of Impact`, `Samples` (the two URLs
above). Operator: `Automated Tests` and the `Test Cases` outcomes — leave them as placeholders rather
than filling them from assumption.

**Fill it with `/enrich-jira-task`, which injects into these slots surgically.** It finds the panel by
its `What I Did` heading, walks to each slot by heading text, and writes ADF through
`acli jira workitem edit --from-json`. Every other panel survives, smartlinks included.

The wrong turns, both taken on the first run and both recorded so they are not taken again:

- **Do not rewrite the `description` field.** The MCP `editJiraIssue` accepts only the whole field, and
  a markdown round trip degrades the ticket's smartlinks to plain URLs — damaging the reporter's text
  to add your own.
- **Do not settle for a comment either.** It is lossless and additive, which makes it tempting, but it
  leaves the template empty and the convention unmet. The constraint that makes a full rewrite
  unacceptable does not make a comment correct; it makes surgical ADF injection correct.

The PR link exists by the time this phase runs: Phase 11 creates it, ahead of both documentation
phases, precisely so neither has to leave a placeholder.

The ticket's own acceptance criteria also name the RPM board, the Third-Party Tools registry, the
test-case spreadsheet and the release-notes draft. None is performed here; all four are reported in
Phase 14.
