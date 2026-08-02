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

Statuses: `OPEN` · `IN REVIEW` · `PASSED` · `PASSED (OWNER ACCEPTED)` · `BLOCKED`.
Verdicts: `APPROVED_FOR_OWNER_MERGE` · `CHANGES_REQUESTED` ·
`OWNER_ACCEPTED_WITHOUT_INDEPENDENT_REVIEW` · `—` (not yet run).

`PASSED (OWNER ACCEPTED)` means the owner accepted the gate on merged evidence
**without** an independent review pass. It is deliberately distinct from
`PASSED`, so a reader can never mistake an accepted gate for a reviewed one.
Each use requires its own owner decision and sets no precedent for later gates.

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

| Gate               | Stage   | Queue owner          | TRF range       | Status                    | Verdict                                               | Evidence                                                                                                                                                                                                                                                                   |
| ------------------ | ------- | -------------------- | --------------- | ------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GATE-0 BASELINE`  | `P1.0`  | `SPI-000`            | `TRF-000`–`001` | `PASSED (OWNER ACCEPTED)` | `OWNER_ACCEPTED_WITHOUT_INDEPENDENT_REVIEW` (`D-020`) | [`FOUNDATION-BASELINE.md`](../spimar-phase-1/FOUNDATION-BASELINE.md), [`VALIDATION-MATRIX.md`](VALIDATION-MATRIX.md)                                                                                                                                                       |
| `GATE-1 NEUTRAL`   | `P1.1`  | `SPI-010`            | `TRF-002`–`005` | `IN REVIEW`               | `—`                                                   | [`RESIDUE-INVENTORY.md`](../spimar-phase-1/RESIDUE-INVENTORY.md), [`NEUTRAL-PRIMITIVES.md`](../spimar-phase-1/NEUTRAL-PRIMITIVES.md), [`NEUTRALIZATION.md`](../spimar-phase-1/NEUTRALIZATION.md), [`RECOVERY-VERIFICATION.md`](../spimar-phase-1/RECOVERY-VERIFICATION.md) |
| `GATE-2 SYSTEM`    | `P1.2`  | `SPI-030`            | `TRF-010`–`019` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-3 CONTENT`   | `P1.3`  | `SPI-020`            | `TRF-020`–`023` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-4 ROUTES`    | `P1.4`  | `SPI-040`            | `TRF-024`–`027` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-5 HOME`      | `P1.5`  | `SPI-050`            | `TRF-030`–`033` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-6 EXHIBITOR` | `P1.6`  | `SPI-060`            | `TRF-034`–`037` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-7 VISITOR`   | `P1.7`  | `SPI-060`            | `TRF-038`–`040` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-8 CMS`       | `P1.8`  | `CMS-080`            | `TRF-050`–`059` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-9 CRM`       | `P1.9`  | `OPS-070`, `CRM-090` | `TRF-060`–`070` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-10 QUALITY`  | `P1.10` | `LOC-100`, `QA-110`  | `TRF-080`–`087` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-11 RC`       | `P1.11` | `AUD-120`            | `TRF-088`       | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |
| `GATE-12 RELEASE`  | `P1.12` | `REL-130`            | `TRF-089`–`090` | `OPEN`                    | `—`                                                   | —                                                                                                                                                                                                                                                                          |

## `GATE-0 BASELINE` — current gate

| Item             | State                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Entry            | `ENG-015` (Stage A closed under `D-015`)                              |
| Covered packages | `TRF-000` `DONE`; `TRF-001` `DONE`                                    |
| Entry SHA        | `643b912f2ff8bd128f857481a2f2427544b5c1c9`                            |
| `TRF-000` merge  | `d1e96548feafab6bef11bffeca8d759f4ac60f4f` (PR #12)                   |
| `TRF-001` merge  | `477f5ae31c1e0135122010148e868fc96bb8f7eb` (PR #14)                   |
| Required checks  | green on both PRs                                                     |
| Review status    | **no independent review was run**                                     |
| Verdict          | `OWNER_ACCEPTED_WITHOUT_INDEPENDENT_REVIEW` under `D-020`, 2026-08-02 |
| Exit             | `PASSED (OWNER ACCEPTED)` — `P1.1` is open and `TRF-002` is eligible  |

**Disclosed gap.** `D-018` requires a fresh-session independent review at every
gate. The session that wrote `TRF-000` and `TRF-001` was disqualified from
reviewing them, and no fresh session was run. The owner accepted the gate on
merged evidence instead. The self-review that stood in did find and fix two real
defects in `TRF-000`, which shows review of this work had value; what a fresh
reviewer would have caught beyond that is unknown. `D-020` is specific to
`GATE-0` and sets no precedent — `GATE-1` onward still require an independent
review, and the always-review exception list is unaffected.

Open items carried into this gate: accepted limitations `L1`–`L9`, blockers
`MIG-1`/`MIG-2`/`MIG-3`, `PAR-P1-004`, and the disclosed absence of a
GitHub-native review record on PR #11. None is closed by `GATE-0`.

## `GATE-1 NEUTRAL` — eligible, review outstanding

Covers `TRF-002` (PR #17), `TRF-003` (PR #18), `TRF-004` (PR #19) and `TRF-005`.
All four are merged or in review with green required checks.

**This gate requires a fresh-session independent review and has not had one.**
`D-020` accepted `GATE-0` without a review and set no precedent. `GATE-1` carries
materially more risk and must not be accepted the same way by default:

- 102 files and 11,482 lines deleted, including 32 third-party trademarks;
- three gates re-pointed and one gate assertion removed outright
  (`validate-media.mjs` legacy-map cross-check);
- two E2E specs deleted — genuine coverage reduction;
- a self-reported `TRF-003` defect (neutrality judged by brand-token count,
  which missed content-module coupling);
- a self-reported `TRF-002` overstatement about `CONTACT_NOTIFY_TO`.

A reviewer should verify each of those independently rather than accept the
implementation session's own account of them.
