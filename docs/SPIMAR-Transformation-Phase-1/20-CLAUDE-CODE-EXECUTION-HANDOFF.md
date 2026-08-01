# 20 — Claude Code Execution Handoff

## Repository

Expected active checkout:

```text
C:\work\spimar
```

The repository, current `origin/main`, worktree state, instructions, and runtime evidence must be verified at kickoff. Do not assume a dated SHA from this package is still current.

## Master kickoff prompt

```text
You are implementing SPIMARIMMO Transformation Phase 1 in the existing repository.

Before editing, read every Markdown file in the SPIMAR-Transformation-Phase-1
package in numeric order. Treat the package as the controlling Phase 1 scope,
architecture, design-system, CMS/CRM, governance, backlog, acceptance, and handoff
contract. Repository/runtime evidence controls current implementation facts.

PRODUCT DECISION

- Transform the frozen House of Yellow engineering foundation into SPIMARIMMO.
- Do not reopen ENG-014D or ENG-014E as standalone reference-parity phases.
- Do not pursue perfect House of Yellow parity.
- Preserve useful engineering craft and neutral primitives.
- Remove all House of Yellow brand, content, claims, contacts, analytics IDs,
  production hotlinks, and unrelated assets from public SPIMAR output.
- SPIMARIMMO controls business logic, IA, brand, content, states, conversion,
  CMS, CRM, locales, accessibility, security, and quality.

DESIGN-SYSTEM DECISION

Build one scalable SPIMARIMMO design system with three contextual modes:

1. PUBLIC_EDITORIAL — immersive, editorial, media-led, persuasive.
2. CMS_EDITORIAL — calm, structured, review/publishing focused.
3. CRM_OPERATIONAL — dense, fast, queue/table/workspace focused.

Share tokens, typography, icon language, semantic states, accessibility, and
interaction rules, but do not force equal visual density. Components must reflect
content context: event, proof, offer, case, resource, form, CMS record, and CRM lead
each have different information priorities. Avoid generic repeated cards and avoid
turning the public website into a SaaS dashboard.

FIRST ACTION: TRF-000

1. Confirm the correct repository and read AGENTS.md, CLAUDE.md and project rules.
2. Fetch origin without mutating user work.
3. Record current branch, exact origin/main SHA, remotes, status, lockfile/toolchain,
   deployment identity, route/component/test inventories, and known limitations.
4. Preserve unexpected tracked and untracked work. Do not reset, clean, or discard.
5. Run the existing install, lint, typecheck, unit, browser, route, migration/media,
   and production-build gates using repository commands.
6. Create the Phase 1 repository control plane and FOUNDATION-BASELINE.md.
7. Return the factual baseline before implementation.

EXECUTION MODEL

- One integration branch: claude/spimar-transformation-phase-1.
- Isolated worktrees for claude/spimar-experience-shell and
  claude/spimar-media-content.
- No two sessions in the same worktree.
- Assign shared-file ownership before parallel work.
- A single integration owner merges bounded slices and runs full regression.
- Use TRF IDs from 17-IMPLEMENTATION-BACKLOG.md.
- Prefer vertical slices with implementation, content/state, tests, and evidence.

NON-NEGOTIABLES

- Exhibitor-first corporate hierarchy; visitor path remains distinct.
- Events within the first three major homepage chapters.
- Black #000000 and SPIMAR Gold #EFC337 identity anchors.
- FR/EN/AR architecture with true RTL.
- No invented facts, claims, metrics, dates, partners, media rights, prices, or
  outcomes.
- CMS and CRM controls must perform real authorized operations or be visibly
  unavailable.
- Durable submission, CRM sync, resource delivery, booking, and business outcome
  are separate states.
- Public components depend on typed repository interfaces, not provider schemas.
- All writes are server-validated; roles/RLS/idempotency/audit/recovery are tested.
- No PII in analytics, URLs, ordinary logs, or client error payloads.
- Do not push, deploy production, alter DNS, activate paid providers, or mutate
  production data without explicit authorization.
- Do not use destructive Git operations or overwrite unrelated user work.

QUALITY

Run focused validation after every slice and dependent regression before closure.
Test public, CMS, and CRM modes across required routes, states, roles, locales,
viewports, RTL, keyboard, reduced motion, providers, failures, and recovery.
Visual acceptance targets the approved SPIMAR design/HIF contracts, not reference
brand content.

CONTROL PLANE

Before ending every session, update MASTER, STATUS, QUEUE, DECISIONS, ASSUMPTIONS,
BLOCKERS, VALIDATION-MATRIX, SPIMAR-TRACEABILITY, and SESSION-HANDOFF with exact
SHAs, commands/exit codes, evidence paths, blockers, and next eligible task.

Do not stop after planning, tokens, the homepage, static dashboards, a green build,
or a partial POC. Continue through safe bounded work until a genuine blocker or the
assigned slice is fully implemented and evidenced.

Begin now with TRF-000 only. Report the baseline and proposed file-ownership map
before starting parallel transformation work.
```

## Required first response

```text
ACTIVE ITEM: TRF-000
REPOSITORY: verified path and remote
ORIGIN/MAIN: full SHA
WORKTREE: clean | expected changes | unexpected changes
BASELINE BUILD: pass | fail
BASELINE TESTS: exact executed results
ROUTES/COMPONENTS: measured inventory
REFERENCE LIMITATIONS: registered, not reopened
PHASE 1 CONTROL PLANE: ready | incomplete
PARALLEL FILE OWNERSHIP: proposed map
BLOCKERS: exact list
NEXT ACTION: one bounded item
```

## Strategy-to-code handoff rule

Do not paste partial prompts from this folder into multiple active sessions independently. The primary session reads the complete package, creates the baseline and ownership map, then generates bounded prompts for isolated worktrees.

