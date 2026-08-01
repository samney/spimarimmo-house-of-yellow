---
status: active
owner: samney
version: 2.0
last_reviewed: 2026-08-01
canonical_for: claude-code-phase-1-bootloader
depends_on:
  - ../governance/DOCUMENT-CONTROL.md
  - ../governance/SOURCE-MANIFEST.md
  - ../governance/DELIVERY-MAP.md
supersedes:
  - version 1.1 repeated master prompt
replaced_by: null
---

# 20 - Claude Code Execution Handoff

This file is a bootloader, not a second copy of the strategy.

## Repository

Expected owner checkout: `C:\work\spimar`.

Before editing, verify the repository, remote, branch, exact `origin/main`, worktree state, package manager, runtime, and current deployment. Never treat a dated SHA in documentation as current without verification.

## Required reading

1. `CLAUDE.md` and its current control-plane reading order.
2. `docs/spimar/governance/DOCUMENT-CONTROL.md`.
3. `docs/spimar/governance/SOURCE-MANIFEST.md`.
4. `docs/spimar/governance/DELIVERY-MAP.md`.
5. `docs/spimar/governance/ACCEPTANCE-LEVELS.md`.
6. `00-START-HERE.md`, `17-IMPLEMENTATION-BACKLOG.md`, `19-DEFINITION-OF-DONE.md`, and `21-TRACEABILITY-MATRIX.md`.
7. Only the numbered domain documents required by the active `TRF-*` work package.

## Start boundary

After this documentation package is reviewed and owner-merged, Claude Code starts:

```text
SPI-000 / P1.0 / TRF-000
```

Do not start application implementation from this documentation PR. Create `claude/spimar-transformation-phase-1` from the latest approved `origin/main`, then run the factual baseline and return it before neutralization or UI work.

## Execution rules

- `SPI-*` is the queue; `TRF-*` is the bounded work package; the unified delivery map controls dependencies.
- One bounded work package per branch/PR unless the integration contract explicitly groups non-overlapping slices.
- Parallel work starts only where the delivery map permits it, in isolated worktrees with a written file-ownership map.
- Claude Code remains the sole source-code implementer; Codex artifacts remain specifications/reviews.
- Repository/runtime evidence controls current implementation facts.
- No production deploy, DNS/provider activation, paid service, or production-data mutation without explicit owner authorization.
- Update only control documents whose facts changed.

## Required first response

```text
ACTIVE: SPI-000 / P1.0 / TRF-000
REPOSITORY: verified path and remote
ORIGIN_MAIN: full SHA
WORKTREE: clean | expected changes | unexpected changes
BASELINE_GATES: exact commands and results
INVENTORY: routes, components, tests, media, locales
FOUNDATION_LIMITATIONS: registered, not reopened
FILE_OWNERSHIP: proposed map
BLOCKERS: exact list
NEXT: one bounded action
```

The primary session produces bounded prompts for any later isolated worktrees. Do not paste the full strategy into multiple active sessions.
