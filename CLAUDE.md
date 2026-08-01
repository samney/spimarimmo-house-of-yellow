# SPIMAR — Claude Code Project Contract

## Ownership

Claude Code is the sole source-code implementer from `ENG-014C` onward. GPT/Codex artifacts are specifications, review findings, or historical evidence only. The repository owner is the merge authority.

## Required reading order

1. `docs/claude-code/MASTER.md`
2. `docs/claude-code/STATUS.md`
3. `docs/claude-code/QUEUE.md`
4. `docs/claude-code/DECISIONS.md`
5. `docs/claude-code/BLOCKERS.md`
6. `docs/spimar/IMPLEMENTATION-ORDER.md`
7. `docs/spimar/DECISION-SUPERSESSION.md`
8. `docs/claude-code/VALIDATION-MATRIX.md`
9. `docs/migration/MIGRATION-COVERAGE.md`
10. Specification files linked by the active queue item

Update `STATUS.md`, `QUEUE.md`, `VALIDATION-MATRIX.md`, and `SESSION-HANDOFF.md` before ending a work session.

## Authority order

1. Latest explicit repository-owner decision
2. This file and current `docs/claude-code/`
3. Accepted decision/conflict registers
4. Canonical files under `docs/spimar/official-specifications/`
5. Current Git history, tests, rendered application and accepted evidence
6. Supporting audits and evidence
7. Superseded/rejected/archive material

Historical chats and archives are provenance, not automatic authority. Unknown information is `TBD` or `UNRESOLVED`; never invent it.

## Current execution boundary

- Stage A is **closed**. `ENG-014B` (PR #4), `MIG-000` (PR #5), `OPS-001` (PR #6), control-plane hardening (PR #7), `ENG-014C` (PR #8), the ENG-014C control-plane closeout (PR #9) and `ENG-015` (PR #10) are merged.
- `ENG-014D` and `ENG-014E` are **SUPERSEDED / TRANSFERRED** under `D-015` — never completed, never passed. Their requirements moved to the SPIMAR phases.
- The House of Yellow foundation is accepted for transformation with the limitations recorded in `docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. The whole-page ≤2% criterion did **not** pass; `D-014` and `PAR-P1-004` are preserved, not closed.
- Active item: `SPI-000` — SPIMAR Transformation Phase 1 (brand, UX architecture, global experience). Do not continue polishing the House of Yellow clone.
- `D-013` is in effect: no historical patch may be applied. `D-012` has expired by its own terms, which does not authorize enabling video — media activation is a SPIMAR decision and `lib/media/video-manifest.json` still declares 0 deployable assets.
- Do not reconstruct or source House of Yellow media. SPIMAR-owned content replaces reference content.
- Current canonical `main`: `e048fdde7bdf52992ff258870147bf70c64295e9`, tagged `hoy-clone-baseline-eng-015` as the accepted foundation baseline.

## Branch and PR discipline

- One bounded queue item per branch and PR.
- Every branch starts from latest approved `origin/main`.
- No next item before the previous PR is independently reviewed and owner-merged.
- Corrections remain on the same PR.
- No force push, history rewrite, destructive reset, unrelated refactor or silent architecture change.
- Record base SHA, final SHA, changed files, commands, results, deployment, screenshots, measurements, console/network failures and known differences.

## Review discipline

1. Implementation session changes code and produces evidence.
2. Fresh Claude session independently reviews the real diff, tests, screenshots and deployment.
3. Owner merges only after an explicit approval.

## Historical artifacts

Archive files are immutable evidence. Do not apply a historical patch unless the active pre-freeze contract explicitly authorizes it. After `ENG-015`, no historical patch may be applied.

