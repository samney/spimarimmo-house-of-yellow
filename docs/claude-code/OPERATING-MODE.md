# Operating Mode — current phase and workflow

Single onboarding document. Read this, then work; open other documents only
when the task needs them.

## Current phase — Phase 2 (started 2026-08-04)

Phase 1 (House of Yellow foundation, parity, transformation groundwork,
homepage sections 01–13, backend seams + Supabase port) is closed; its plans
and evidence live in `docs/archive/phase-1/` and `docs/spimar/`. Control
documents dated before 2026-08-04 describe Phase 1 state.

Phase 2 goals, in order:

1. **System quality**: lean docs, fast sessions, consistent output. The
   contracts below are the instrument — follow them instead of re-deriving
   patterns, and keep them updated the moment a pattern changes.
2. **Product build-out** on the SPIMAR base: remaining routes, CMS/CRM
   integration on the existing seams, content validation flows, QA matrix.

## The contracts (load per task, not per session)

| Task touches…            | Read                                      |
| ------------------------ | ----------------------------------------- |
| Public UI                | `docs/claude-code/DESIGN-CONTRACT.md`     |
| Any code                 | `docs/claude-code/ENGINEERING-CONTRACT.md` |
| Product scope/copy       | `docs/spimar/` canonical specs, section mocks in `docs/assets-UX-UI/` |
| Backend/data             | `docs/backend/`, `lib/spimar/`, `lib/contact/` |
| Past decisions           | `docs/claude-code/DECISIONS.md` (append-only) |

`.claude/rules/` holds the always-loaded short rules; the contracts carry the
detail. If a rule and a contract disagree, the newest owner decision wins —
then fix the stale document in the same PR.

## Session workflow

1. Take one bounded item (owner request or `QUEUE.md`).
2. Understand the target: mock, spec, or issue — before writing code.
3. Implement following the contracts; reuse existing patterns and seams.
4. Verify: `tsc --noEmit`, ESLint, Prettier, `pnpm test`, browser evidence at
   1920/390, reduced motion when motion changed. Cheapest sufficient evidence;
   do not re-verify what did not change.
5. Record: decision entries if anything deviated; update only control
   documents whose facts changed.
6. Commit scoped work with a clear message; the owner merges.

## Anti-drift guards

- Copy comes from `messages/*.json` (FR+EN together), never hard-coded.
- New UI binds only L2 tokens (`app/globals.css`); no new hex values outside
  a declared L3 block.
- Pending/unvalidated content uses the honest-state patterns already shipped
  (badges, "à confirmer", disabled controls) — never invented data.
- Undesigned states (a control whose target screen has no mock) are omitted
  and reported, not invented.
- Before claiming done: re-read the ask, run the gates, state what was
  verified and what was not.

## Speed guards

- Do not re-read the full control plane or full specs per session.
- Prefer targeted file reads over broad sweeps; delegate noisy searches.
- One writer per checkout; parallel sessions use separate worktrees.
- Heavy evidence (screenshots, videos) goes to the PR/session output, not the
  repository, unless a gate requires a committed artifact.
