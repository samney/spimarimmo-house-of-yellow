---
description: Persist verified session state into the SPIMAR control plane
---

# /checkpoint — Save progress

Persist the current work state. This command defines NO state of its own — the canonical
sources are:

- **Repository checkpoint, current state, next safe action:** `docs/claude-code/STATUS.md`
- **Execution order and item lifecycle:** `docs/claude-code/QUEUE.md`
- **Accepted decisions:** `docs/claude-code/DECISIONS.md`
- **Open blockers:** `docs/claude-code/BLOCKERS.md`
- **Evidence and gate results:** `docs/claude-code/VALIDATION-MATRIX.md`
- **Lifecycle and DRY policy:** `docs/spimar/governance/DOCUMENT-CONTROL.md`
- **Operating contract:** `CLAUDE.md`

## Steps

1. Update `STATUS.md` only where facts actually changed — the `Updated:` date, the
   repository checkpoint (base SHA, final SHA, PR number, post-merge gate run and
   deployment IDs), `Current state`, and `Next safe action`.
2. Update `QUEUE.md` in the **same change** if any item changed status. `STATUS.md` and
   `QUEUE.md` must never contradict each other.
3. Add a `DECISIONS.md` entry if an architectural or governance decision was made this
   session. Add to `BLOCKERS.md` if something became blocked.
4. Record evidence in `VALIDATION-MATRIX.md` only with an artifact path or URL attached.
5. Output a ≤10-line summary: what was done, what is next.

## Rules

- **Never invent completions.** Record only what verifiably happened this session, with the
  exact commands run and their real exit status.
- A skipped, blocked, or timed-out command is **not** a pass (`VALIDATION-MATRIX.md`).
- Never mark a gate or matrix cell passed without artifacts.
- One fact, one home. Do not restate `QUEUE.md` detail inside `STATUS.md` or vice versa;
  update only the control documents whose facts changed (`CLAUDE.md`).
- Never record a superseded item as passed. `ENG-014D` and `ENG-014E` were never
  implemented and must never be recorded as completed.
- Unknown information stays `TBD` or `UNRESOLVED`.
