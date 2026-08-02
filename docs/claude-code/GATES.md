---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: gate-execution-state-and-review-verdicts
depends_on:
  - ../spimar/governance/DELIVERY-MAP.md
  - ../spimar/transformation-phase-1/03-PHASE-PLAN-AND-DELIVERY-GATES.md
  - DECISIONS.md
supersedes: []
replaced_by: null
---

# GATES — `GATE-*` execution state and review verdicts

Updated: 2026-08-02

This is the ledger that makes `D-018` enforceable. Under `D-018` independent
review runs **per gate**, not per work package, so a gate is the point where
accumulated work is actually inspected. Without a ledger there is nowhere to
record that inspection, and "gate-level review" would mean no review at all.

Gate identities and stage mapping are owned by
[`DELIVERY-MAP.md`](../spimar/governance/DELIVERY-MAP.md). Per-item evidence
lives in [`VALIDATION-MATRIX.md`](VALIDATION-MATRIX.md). Work-package state
lives in [`WORK-PACKAGES.md`](WORK-PACKAGES.md).

Statuses: `OPEN` · `IN REVIEW` · `PASSED` · `BLOCKED`.
Verdicts: `APPROVED_FOR_OWNER_MERGE` · `CHANGES_REQUESTED` · `—` (not yet run).

## Gate protocol

Every gate submission must provide all eight items from
[`03-PHASE-PLAN-AND-DELIVERY-GATES.md`](../spimar/transformation-phase-1/03-PHASE-PLAN-AND-DELIVERY-GATES.md)
§ "Gate protocol":

1. immutable base and head SHAs;
2. exact changed-file list;
3. requirements and state IDs covered;
4. validation commands with exit codes;
5. browser/viewport/locale evidence where relevant;
6. remaining blockers and known differences;
7. rollback boundary;
8. reviewer verdict.

A gate is `PASSED` only when its implementation **and** its evidence pass.
Documentation approval is not runtime acceptance. Never mark a gate `PASSED`
without artifacts, and never close an accepted limitation without evidence at
its owning gate.

## Review rule (`D-018`)

- Independent review runs once per gate, covering every `TRF-*` merged since
  the previous gate.
- Between gates, a bounded PR merges on green required checks plus explicit
  owner approval.
- The always-review exceptions in `CLAUDE.md` § "Review discipline" —
  auth/roles/RLS, migrations and destructive data operations, CRM
  durability/consent/retention/PII, dependency and lockfile changes, CI and
  deployment configuration, and the release candidate — still require a fresh
  independent review before merge regardless of gate position. Record each such
  review in the affected gate's row.

## Gate ledger

| Gate               | Stage   | Queue owner          | TRF range       | Status | Verdict | Evidence                                                                                                             |
| ------------------ | ------- | -------------------- | --------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `GATE-0 BASELINE`  | `P1.0`  | `SPI-000`            | `TRF-000`–`001` | `OPEN` | `—`     | [`FOUNDATION-BASELINE.md`](../spimar-phase-1/FOUNDATION-BASELINE.md), [`VALIDATION-MATRIX.md`](VALIDATION-MATRIX.md) |
| `GATE-1 NEUTRAL`   | `P1.1`  | `SPI-010`            | `TRF-002`–`005` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-2 SYSTEM`    | `P1.2`  | `SPI-030`            | `TRF-010`–`019` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-3 CONTENT`   | `P1.3`  | `SPI-020`            | `TRF-020`–`023` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-4 ROUTES`    | `P1.4`  | `SPI-040`            | `TRF-024`–`027` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-5 HOME`      | `P1.5`  | `SPI-050`            | `TRF-030`–`033` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-6 EXHIBITOR` | `P1.6`  | `SPI-060`            | `TRF-034`–`037` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-7 VISITOR`   | `P1.7`  | `SPI-060`            | `TRF-038`–`040` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-8 CMS`       | `P1.8`  | `CMS-080`            | `TRF-050`–`059` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-9 CRM`       | `P1.9`  | `OPS-070`, `CRM-090` | `TRF-060`–`070` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-10 QUALITY`  | `P1.10` | `LOC-100`, `QA-110`  | `TRF-080`–`087` | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-11 RC`       | `P1.11` | `AUD-120`            | `TRF-088`       | `OPEN` | `—`     | —                                                                                                                    |
| `GATE-12 RELEASE`  | `P1.12` | `REL-130`            | `TRF-089`–`090` | `OPEN` | `—`     | —                                                                                                                    |

## `GATE-0 BASELINE` — current gate

| Item                | State                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Entry               | `ENG-015` (Stage A closed under `D-015`)                                                                    |
| Covered packages    | `TRF-000` `DONE`; `TRF-001` `IN PROGRESS`                                                                   |
| Entry SHA           | `643b912f2ff8bd128f857481a2f2427544b5c1c9`                                                                  |
| `TRF-000` merge     | `d1e96548feafab6bef11bffeca8d759f4ac60f4f` (PR #12)                                                         |
| Review status       | not yet run — due once `TRF-001` merges                                                                     |
| Reviewer constraint | must be a **fresh session**; neither `TRF-000` nor `TRF-001` may be reviewed by the session that wrote them |
| Exit condition      | both packages merged, gate review recorded here with a verdict, then `P1.1` opens                           |

Open items carried into this gate: accepted limitations `L1`–`L9`, blockers
`MIG-1`/`MIG-2`/`MIG-3`, `PAR-P1-004`, and the disclosed absence of a
GitHub-native review record on PR #11. None is closed by `GATE-0`.
