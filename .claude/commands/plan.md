---
description: Plan a bounded SPIMAR work package before writing any code
---

# /plan — Plan a bounded work package

Design an implementation plan before touching code. This command defines NO scope of its
own — the canonical sources are:

- **Contract, authority order, branch/PR discipline:** `CLAUDE.md`
- **Execution order and the single active item:** `docs/claude-code/QUEUE.md`
- **Current repository checkpoint and next safe action:** `docs/claude-code/STATUS.md`
- **Accepted decisions and supersessions:** `docs/claude-code/DECISIONS.md`,
  `docs/spimar/DECISION-SUPERSESSION.md`
- **Open blockers:** `docs/claude-code/BLOCKERS.md`
- **Stage/SPI/TRF/Gate dependency graph:** `docs/spimar/governance/DELIVERY-MAP.md`
- **Phase 1 strategy contract:** `docs/spimar/transformation-phase-1/00-START-HERE.md`
- **Evidence obligations:** `docs/claude-code/VALIDATION-MATRIX.md`

## Steps

1. Read `CLAUDE.md` and the required reading order it specifies. Do not skip it because the
   task "looks small" — the authority order decides what wins when documents disagree.
2. Identify the **single active item** from `QUEUE.md` and the **next safe action** from
   `STATUS.md`. If the requested work is not that item, say so and stop.
3. Confirm the item's gate in `docs/spimar/governance/DELIVERY-MAP.md` and which
   `TRF-*` package it belongs to.
4. Explore the existing code before designing. Read the nearest existing analogue
   (an existing route, server action, or component) and name the pattern to mirror.
5. Draft the plan:
   - every file created or modified, with its path;
   - for each file, what changes and which existing file it mirrors;
   - the gates from `VALIDATION-MATRIX.md` that will evidence it;
   - risks, and any deviation from `.claude/rules/*` flagged explicitly.
6. Output a numbered task list with file paths.

## Rules

- Never write implementation code during `/plan` — research and design only.
- Always name the existing pattern to mirror; never invent a new one silently.
- Never expand beyond the single active queue item. "Never start a later item early"
  (`QUEUE.md`) is binding.
- Any architectural deviation is a `DECISIONS.md` entry on the day it is made — note in the
  plan that the entry is required, and why.
- Unknown information is `TBD` or `UNRESOLVED`. Never invent a SHA, a measurement, or a
  specification reference.
