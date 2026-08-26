---
description: Upgrade Wijmo to a new build for the Reactive Data Grid, end to end — assets, OutSystems module refresh, ADR, Confluence, Jira, draft PR.
argument-hint: '[TASK_ID] [ARCHIVE_PATH]'
---

# Upgrade Wijmo Version

Run the **`upgrade-wijmo-version` skill** (`.claude/skills/upgrade-wijmo-version/SKILL.md`) from its
Phase 0, passing the arguments below.

| Argument       | Required | Example                          | Notes                                                                                              |
| -------------- | -------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `TASK_ID`      | Yes      | `ROU-12860`                      | Jira task. Ask once if missing. The target build string and version description are read from it.   |
| `ARCHIVE_PATH` | No       | `C:/Downloads/wijmo-5.20261.52`  | Extracted Wijmo distribution archive. If absent, the skill offers to download the ticket attachment. |

The skill is the single source of truth for this procedure: the phase sequence, the safety
guardrails, the run-log format and the reference data all live there, and none of them are restated
here. Do not perform any upgrade step from this file.
