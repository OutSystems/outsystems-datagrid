# ADR-0006: Roll Back Incompatible TypeDoc Dependency Bump to Restore `npm install`

## Status

Accepted

## Context

CI (`Build TypeScript Project / build-n-test`) began failing at the **Install dependencies** step with an `npm error code ERESOLVE` ("unable to resolve dependency tree"):

```
npm error While resolving: outsystems-datagrid@2.23.1
npm error Found: typescript@4.9.5
npm error Could not resolve dependency:
npm error peer typescript@"5.0.x || 5.1.x || ... || 6.0.x" from typedoc@0.28.19
```

An earlier automated dependency bump (commit `af11b3b`, "Bump the minor-and-patch group") raised `typedoc` from `^0.23.28` to `^0.28.19` and `typedoc-umlclass` from `^0.7.1` to `^0.10.2` in `package.json`. `typedoc@0.28` declares a peer dependency on `typescript@>=5.0`, but the project is pinned to `typescript@^4.9.5`. The same bump also broke `typedoc-plugin-merge-modules@4.1.0`, whose peer requirement is `typedoc 0.23.x || 0.24.x`.

Because `package-lock.json` is **gitignored** in this repository (`.gitignore` line 8), CI resolves the dependency tree fresh from `package.json` on every `npm install`. There was therefore no committed lockfile to pin a working resolution, and every PR that ran `npm install` failed — this was a pre-existing break on `dev`, surfaced (not caused) by subsequent PRs.

`typedoc` and its plugins are **dev-only** tooling used by `npm run docs`; they are not part of the shipped runtime bundle.

## Decision Drivers

-   `npm install` must succeed in CI without `--force` / `--legacy-peer-deps` so the build, lint, and tests can run.
-   The project intends to remain on its pinned `typescript@^4.9.5` for this change; a TypeScript major upgrade is out of scope for an accessibility bug fix and warrants its own validation.
-   The fix must restore a mutually-coherent set of doc tooling (typedoc + merge-modules + umlclass).

## Considered Options

-   **Revert TypeDoc to the last TypeScript-4.9-compatible versions (chosen)** — Set `typedoc` back to `^0.23.28` and `typedoc-umlclass` back to `^0.7.1`; leave `typedoc-plugin-merge-modules` at `^4.1.0`.

    -   Pros: restores the exact previously-working, peer-coherent set (`typedoc@0.23.28` peer accepts `4.9.x`; both plugins target `0.23.x`); dev-only tooling, so no runtime impact; smallest possible change; unblocks CI immediately.
    -   Cons: stays on an older TypeDoc line; a future TypeScript upgrade will need to re-bump TypeDoc and its plugins together.

-   **Upgrade TypeScript to `^5.x`** — Bump the compiler to satisfy `typedoc@0.28`'s peer.

    -   Pros: keeps TypeDoc current; aligns with the broader ecosystem direction.
    -   Cons: large blast radius — TS 4.9 → 5.x can surface new compile errors and changes transpilation of the AMD `outFile` build; unrelated to this PR's purpose; needs its own dedicated validation and review.

-   **Add `legacy-peer-deps=true` to `.npmrc`** — Make npm ignore the peer conflict.
    -   Pros: one-line, unblocks CI immediately.
    -   Cons: ships a knowingly-inconsistent dependency tree and masks future real conflicts; a band-aid, not a fix.

## Decision Outcome

Chosen option: revert `typedoc` to `^0.23.28` and `typedoc-umlclass` to `^0.7.1`, keeping `typescript@^4.9.5` and `typedoc-plugin-merge-modules@^4.1.0`. This is the last set proven coherent by the prior lockfile state (`typedoc@0.23.28` peer `typescript 4.6.x–5.0.x`; both plugins peer `typedoc 0.23.x || 0.24.x`).

Because `package-lock.json` is gitignored, only `package.json` was changed; CI resolves the corrected tree on the next `npm install`. Verified locally that `npm install` succeeds with no `ERESOLVE`, `npm install --dry-run` reports "up to date", and `npm run build` passes. The same commands behave identically on Windows and macOS — no platform-specific steps are required.

Positive consequences:

-   `npm install` resolves cleanly; CI `build-n-test` and all downstream checks pass.
-   No runtime impact (doc-generation tooling only).

Negative consequences:

-   TypeDoc remains on the `0.23` line until a future, separately-validated TypeScript upgrade re-aligns the doc tooling.
-   Dependabot may re-propose the TypeDoc bump; it should not be merged without a corresponding TypeScript upgrade (and, ideally, a committed lockfile or grouped peer-aware update).

## Links

-   `package.json` — `typedoc` `^0.28.19` → `^0.23.28`, `typedoc-umlclass` `^0.10.2` → `^0.7.1`.
-   Offending bump: commit `af11b3b` ("Bump the minor-and-patch group across 1 directory with 2 updates", PR #495).
-   `.gitignore` line 8 — `package-lock.json` is not tracked.
-   Jira ticket: ROU-12848. PR #508.

## Date

2026-06-06
