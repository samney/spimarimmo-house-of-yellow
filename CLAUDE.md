# House of Yellow — Project Instructions

## Source of truth

`HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md` (SHA-256 `ADA7E41EB38DE80599C3408B8A5E70CF56040E90BC34AE340CC0D207EA9BC4E2`) is the authoritative product, architecture, and QA specification. Never edit it. If a skill or tool recommendation conflicts with it, the master prompt wins — record the conflict in `docs/claude-code/DECISIONS.md`.

## Every session must

1. Read `docs/claude-code/STATUS.md`, `QUEUE.md`, `DECISIONS.md`, `ASSUMPTIONS.md`, `BLOCKERS.md`, and `VALIDATION-MATRIX.md` before acting.
2. Work only on the active queue item in `QUEUE.md` (HOY-000 … HOY-160) unless the owner redirects.
3. Update `STATUS.md`, `QUEUE.md`, and `SESSION-HANDOFF.md` before stopping.

## Model

Primary: **Claude Fable 5**. Only automatic fallback: **Claude Opus 5** (record the reason in `BOOTSTRAP-REPORT.md`). Never silently fall back to a smaller model.

## Skills and tooling

Only the audited public skills recorded in `docs/claude-code/PUBLIC-SKILLS-LOCK.md` are allowed. Do not author new skills or install unaudited ones. Rules in `.claude/rules/` apply to all work.

## Non-negotiables

- Preserve existing work; no destructive Git commands (`reset --hard`, `push --force`, history rewrites, deletions of untracked work).
- No push, PR, deploy, or production mutation without explicit owner authorization.
- Never print or commit secrets; `.env.example` carries names only.
- Validation is full-scope: every route × viewport × locale, plus accessibility, security, and regression evidence, tracked in `VALIDATION-MATRIX.md`.
- Never mark a queue item complete without recorded evidence.

## Completion goal

Continue implementing the master prompt from the active HOY queue item until every required route, system, content state, responsive state, integration, test, and acceptance criterion in the master prompt and `VALIDATION-MATRIX.md` is complete with recorded evidence, or until `BLOCKERS.md` contains a genuine blocker requiring the owner's decision or access. A plan, scaffold, homepage-only build, successful compile, or partial demo is not completion. Leave a precise session handoff before any stop.
