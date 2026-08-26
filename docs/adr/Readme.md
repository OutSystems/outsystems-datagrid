# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for this project.
ADRs are short documents that capture important architectural decisions, along with their context and consequences.

## Purpose

-   To document significant architectural decisions.
-   To provide context for why decisions were made.
-   To help onboard new team members.
-   To facilitate future architectural discussions and evolution.
-   To provide context to AI-powered development assistants.

## Format

Each ADR should follow the template in `ADR-0000-Title-of-ADR.md`.

## Process

1.  **Propose:** Copy `ADR-0000-Title-of-ADR.md` to a new file named `NNNN-title-of-adr.md`, where `NNNN` is the next sequential number and the rest is a dash-separated, lowercase version of the title.
2.  **Discuss:** Fill out the ADR and discuss it with the team.
3.  **Decide:** Once a decision is reached, update the status in the ADR (e.g., "Accepted", "Rejected", "Superseded").
4.  **Commit:** Commit the ADR to the repository.

## ADR Log

| ADR Number | Title                                                                | Status   | Date       |
| :--------- | :------------------------------------------------------------------- | :------- | :--------- |
| ADR-0000   | Template for ADRs                                                    | Meta     | 2026-02-04 |
| ADR-0001   | Extension .NET Upgrade and Improvements                              | Accepted | 2026-02-24 |
| ADR-0002   | Wijmo Upgrade to 2026v1 (Build 5.20261.50)                           | Accepted | 2026-04-19 |
| ADR-0003   | Fix Date Serialization Order-of-Operations in UTC Conversion         | Accepted | 2026-05-11 |
| ADR-0004   | Fix Column-Group Index Collision in ValidationMark Cell Edit Handler | Accepted | 2026-05-12 |
| ADR-0005   | Fix Broken ARIA Reference on Column Headers (describedById Misuse)   | Accepted | 2026-06-06 |
| ADR-0006   | Roll Back Incompatible TypeDoc Dependency Bump                       | Accepted | 2026-06-06 |
| ADR-0007   | Wijmo Upgrade to 2026v1-Hotfix (Build 5.20261.52)                    | Accepted | 2026-08-26 |
| ADR-0008   | Shape of the Wijmo Upgrade Automation                                | Accepted | 2026-08-25 |
