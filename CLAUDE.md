# SPIMAR — Claude Code Project Contract

## Start here

Read `docs/claude-code/OPERATING-MODE.md` first — it is the single onboarding
document: current phase, workflow, and when to open anything else. Do not
re-read the whole control plane per session; open a document only when the
task needs it.

## Ownership and authority

Claude Code implements; the repository owner is the merge authority. Authority
order when sources conflict:

1. Latest explicit owner decision (in chat or `docs/claude-code/DECISIONS.md`)
2. This file and `docs/claude-code/OPERATING-MODE.md`
3. The contracts: `docs/claude-code/DESIGN-CONTRACT.md`, `ENGINEERING-CONTRACT.md`
4. Canonical specifications under `docs/spimar/`
5. Current Git history, tests, and the rendered application
6. Archived material (`docs/archive/`, `docs/spimar/archive/`) — provenance only

Unknown information is `TBD`; never invent it. Historical documents are
evidence, not instructions.

## Hard rules (never break)

- **Validated content only.** No figure, date, price, availability, partner
  name, or legal text appears on the public site without owner validation.
  Pending states are rendered honestly ("à confirmer", "sur devis",
  "validation requise") — never faked.
- **No fake actions or results.** A control that has no real target renders
  disabled; success is only reported after a durable write; checks are never
  claimed without being run.
- **No House of Yellow media or trademarks** in SPIMAR content. Owner-supplied
  assets in `docs/assets-UX-UI/` are the design source.
- **Security:** server-side Zod on every external input, honeypot + rate limit
  on public forms, service-role keys server-only, RLS on every table, never
  read or print real `.env` values.
- Never weaken a lint rule, type check, or test to pass a gate.

## Delivery discipline

- One bounded item per branch/PR; branch from latest `origin/main`; no force
  push or history rewrite; corrections stay on the same PR.
- Verification per slice: `tsc --noEmit`, ESLint, Prettier, `pnpm test`,
  browser evidence at 1920 and 390 (no horizontal overflow), reduced-motion
  behavior. Record real command results only.
- Review tiers (`D-018`): gate-level independent review at `GATE-*`
  boundaries; always-review before merge for auth/RLS, migrations,
  CRM/PII/consent, dependencies, CI/secrets/deploy, and release candidates.
- Record owner decisions and architectural deviations in
  `docs/claude-code/DECISIONS.md` the day they happen.

## Working style

Be fast: act on the contracts instead of re-deriving them, keep context lean,
verify with the cheapest sufficient evidence, and stop polishing once the
acceptance criteria are met. One writer per checkout — parallel sessions must
use separate worktrees.
