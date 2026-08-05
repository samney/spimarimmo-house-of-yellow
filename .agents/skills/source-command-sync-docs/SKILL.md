---
name: "source-command-sync-docs"
description: "Reconcile control documents against verified repository state"
---

# source-command-sync-docs

Use this skill when the user asks to run the migrated source command `sync-docs`.

## Command Template

# /sync-docs — Sync documentation

Reconcile documentation with **verified** repository state. This command defines NO policy
of its own — the canonical sources are:

- **Repository checkpoint and current state:** `docs/claude-code/STATUS.md`
- **Execution order and item lifecycle:** `docs/claude-code/QUEUE.md` — `STATUS.md` and
  `QUEUE.md` are SEPARATE canonical responsibilities; reconcile them, never merge them
- **Decisions and supersessions:** `docs/claude-code/DECISIONS.md`,
  `docs/spimar/DECISION-SUPERSESSION.md`
- **Open blockers:** `docs/claude-code/BLOCKERS.md`
- **Evidence:** `docs/claude-code/VALIDATION-MATRIX.md`
- **Lifecycle, DRY policy, registry:** `docs/spimar/governance/DOCUMENT-CONTROL.md`,
  `docs/spimar/governance/DOCUMENT-REGISTRY.md`
- **Dependency graph:** `docs/spimar/governance/DELIVERY-MAP.md`
- **Toolchain provenance:** `docs/claude-code/TOOLING-MATRIX.md`,
  `docs/claude-code/PUBLIC-SKILLS-LOCK.md`

## Steps

1. Diff documentation claims against **verified evidence** — `git log`, real gate output,
   `gh pr view`, live checks — never against memory or optimism.
2. Reconcile `STATUS.md` against `QUEUE.md`: every item status, PR number, and SHA must
   agree between them and match GitHub.
3. Verify every SHA, PR number, workflow run ID, and deployment ID actually resolves.
   A SHA that does not resolve is a finding, not a typo to silently correct.
4. Verify every `VALIDATION-MATRIX.md` pass has an artifact that exists on disk or a URL.
5. Update the active `TRF-*` package files rather than duplicating their content elsewhere.
6. **Flag, do not silently fix,** contradictions between canonical documents. A
   contradiction between two authoritative files is an owner decision, not an edit.
7. Update the `Updated:` date on every document actually touched.

## Rules

- Record only what actually happened.
- One fact, one home. `STATUS.md`, `QUEUE.md`, and the `TRF-*` files must not restate each
  other's detail.
- Never convert a disclosed limitation into a closed item. `D-014` / `PAR-P1-004` are
  preserved, not closed; the whole-page ≤2% criterion did not pass.
- Never record `ENG-014D` or `ENG-014E` as completed — they were superseded and
  transferred under `D-015`, never implemented.
- Archive files are immutable evidence. Never edit `docs/spimar/archive/**` to make a
  current document consistent.
- Unknown information stays `TBD` or `UNRESOLVED`.
