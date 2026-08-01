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

- `ENG-014B` (PR #4), `MIG-000` (PR #5), `OPS-001` (PR #6), control-plane hardening (PR #7) and `ENG-014C` (PR #8) are merged.
- Current canonical `main`: `17b697430a55fa3a5835c9c25fef927301b9ec87`.
- Remaining clone convergence: `ENG-014D → ENG-014E → ENG-015`. `ENG-014D` is the next eligible item and has not started.
- Hero remains poster-only through `ENG-015`.
- Do not introduce SPIMAR identity, copy, IA, CMS, CRM or localization into clone-convergence work.
- After `ENG-015`, tag/freeze the accepted baseline and begin the top-down SPIMAR transformation from the approved specifications.

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

