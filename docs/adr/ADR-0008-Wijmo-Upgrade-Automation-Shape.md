# ADR-0008: Shape of the Wijmo Upgrade Automation

## Status

Accepted

## Context

Wijmo upgrades happen three or four times a year and touch assets that live in four different places:
this repository (npm dependency, vendored types, stylesheet, version constants), the
`OutSystemsDataGrid` OutSystems module (63 Wijmo scripts plus two block stylesheets), Confluence (a
software bill of materials row and a per-upgrade record page), and Jira. The procedure has never been
encoded anywhere executable. What existed instead was a Confluence upgrade runbook last touched in
October 2024, whose author has left, whose download link points at a retired domain, and whose asset
step describes a module folder layout that no longer matches the module.

ROU-12860 asked for "a command similar to the one created for OS Charts to handle future updates".
The Charts repository is therefore the reference implementation, and it turned out to carry two
overlapping artifacts: a 759-line slash command (`.claude/commands/upgrade-highcharts-version.md`)
covering code, OML, docs PRs, Confluence and Jira, and a 77-line skill
(`.claude/skills/update-highcharts-version/SKILL.md`) covering a narrower code-only process. Neither
references the other, and they have diverged. Porting that structure without deciding what to keep
would import the divergence along with the useful parts.

Two measurements constrain what "parity with Charts" can mean here:

- The public documentation repositories carry no Wijmo build string. `docs-product-internal`
  (`src/ref/ui-patterns/mobile/data-grid-api-ref.md`) and `docs-next`
  (`src/eap/reference/data-grid-ref.md`) describe the component as "built on top of Mescius Data
  Grid" behind an unversioned link. The Charts equivalents do carry versions
  (`OutSystems uses Highcharts 12.6.0…` in two files, three occurrences).
- Full asset manipulation is scriptable, but validation is not: this repository cannot render a grid,
  so every behavioural check runs against a published OutSystems module.

## Decision Drivers

-   One source of truth for the procedure — the failure this repository is already living with, twice
    over (a stale Confluence runbook, and the Charts command/skill split).
-   A phase that cannot do anything must not be able to report success.
-   Guardrails must be in force without anyone choosing to load them.
-   Long-lived reference data (a 66-object inventory, an undocumented changeset schema) must not
    consume context on runs that never reach the phase needing it.
-   `AC21` requires a file at `.claude/commands/upgrade-wijmo-version.md` with YAML frontmatter.

## Considered Options

-   **Option 1 — Single slash command, structurally a copy of the Charts command**
    -   Pros: satisfies AC21 literally with no indirection; one file to read; closest to the letter
        of the Jira request.
    -   Cons: a ~15-phase procedure in one file loads the module inventory and changeset schema on
        every run, including runs that stop at the asset gate; invites the same blind port of the two
        docs-PR phases.
-   **Option 2 — Skill only, with reference files**
    -   Pros: progressive disclosure; model-invocable; the natural home for a long procedure.
    -   Cons: leaves AC21 unsatisfied; no discoverable typed entry point for a procedure people
        invoke deliberately rather than incidentally.
-   **Option 3 — Skill as the single source of truth, plus a thin delegating command**
    -   Pros: satisfies AC21; keeps one procedure definition; gives both a typed entry point
        (`/upgrade-wijmo-version`) and on-demand loading of bulk reference data.
    -   Cons: two files where a reader might expect one; the indirection needs explaining — which is
        what this record is for.
-   **Option 4 — Port the Charts phase list wholesale, including the two documentation PRs**
    -   Pros: literal parity; nothing to justify.
    -   Cons: two phases that clone a repository, search for a build string that does not exist,
        change nothing, and pass.

## Decision Outcome

Chosen option: **Option 3**, with the Charts documentation-PR phases deliberately omitted
(Option 4 rejected on the measurement above).

Concretely:

-   `.claude/skills/upgrade-wijmo-version/SKILL.md` holds the phase sequence, the safety guardrails,
    and the run-log format. Guardrails live here, never in a reference file: a guardrail that is only
    read when someone goes looking for it does not guard.
-   `.claude/skills/upgrade-wijmo-version/references/` holds bulk invariant *data* only — the module
    asset inventory, the changeset recipe, and the Confluence/Jira targets and templates.
-   `.claude/commands/upgrade-wijmo-version.md` carries frontmatter and delegates. It defines no
    procedure of its own.
-   Scope covers the Reactive Data Grid only. The Web Data Grid (`outsystems-datagrid-web`,
    Traditional Web, maintenance only, four years behind on Wijmo) is named in the skill's
    "when not to use" so a run neither adopts it silently nor edits its adjacent SBOM row by mistake.
-   The Confluence upgrade runbook becomes a pointer to this skill, and each upgrade adds a child
    page following the convention already established by ten predecessor pages. Sections that cannot
    be derived — RPMs, automated-test runs, `Fixed Issues`, `New issues found` — are left as
    placeholders for the task owner.
-   Every phase emits a run-log line (`EXECUTED` / `GATED` / `PARTIAL` / `SKIPPED` / `UNVERIFIED`)
    with its evidence, appended to the upgrade's own ADR.

Positive consequences:

-   The procedure exists in exactly one place, and the two documents that previously competed to be
    that place now point at it.
-   A skipped or vacuous phase is visible in the run log instead of being absorbed into a successful
    upgrade, which is what gives the continuous-improvement clause something to act on.
-   Runs that fail at the asset-source gate never load the module inventory or changeset schema.
-   The omitted documentation phases are omitted on record. If Data Grid documentation ever starts
    naming a build string, the reason to add them back is written down.

Negative consequences:

-   Two files must stay in sync in one narrow respect: the command's `argument-hint` and the skill's
    Phase 0. This is the residual cost of satisfying AC21 without duplicating the procedure.
-   The skill is authored before it has ever run. It is written from findings that were measured
    rather than assumed, and ROU-12860 is its first execution, but until that run completes the
    procedure is unexercised.
-   Reference data recorded here — object names, the validation warning baseline, page identifiers —
    can drift from the systems it describes. The skill mitigates this by reconciling the live module
    inventory against the recorded one and stopping on mismatch, but no such check exists for the
    Confluence targets.

## Links

-   [ROU-12860](https://outsystemsrd.atlassian.net/browse/ROU-12860) — the ticket requesting the
    automation; predecessor [ROU-12689](https://outsystemsrd.atlassian.net/browse/ROU-12689)
-   [ADR-0002](./ADR-0002-Wijmo-Upgrade-2026v1.md) — the previous Wijmo upgrade, performed manually
-   [ADR-0006](./ADR-0006-Roll-Back-Incompatible-TypeDoc-Dependency-Bump.md) — the absent-lockfile
    consequence behind the exact-pin step
-   [CONTEXT.md](../../CONTEXT.md) — vocabulary this skill is written in
-   Reference implementation: `outsystems-charts` — `.claude/commands/upgrade-highcharts-version.md`
    and `.claude/skills/update-highcharts-version/SKILL.md`
-   Confluence: [Wijmo Updates](https://outsystemsrd.atlassian.net/wiki/spaces/RDMBLVS/pages/3058631508/Wijmo+Updates)
    (upgrade runbook and per-upgrade index),
    [External Libraries in UI Components](https://outsystemsrd.atlassian.net/wiki/spaces/RDMBLVS/pages/2745598610/External+Libraries+in+UI+Components)
    (SBOM)

## Date

2026-08-25
