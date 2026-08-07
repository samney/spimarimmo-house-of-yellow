# Operating Mode — current phase and workflow

Single onboarding document. Read this, then work; open other documents only
when the task needs them.

## Current phase — Release (started 2026-08-06)

Goal, in order:

1. **Website to 100%** against the owner checklist (`docs/pdf/Plan.md`) and
   the stabilization master
   (`docs/claude-code/SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md`).
2. **Deploy** the finished website (Vercel; note: the canonical domain
   currently serves a legacy site — release is a cutover the owner triggers).
3. **Admin completion**: SPIMAR Control (CRM/CMS) continues on the SAME
   branch — Wave 4 slice 1 is already on it; `docs/admin-control/` holds the
   queue and plans.

## ONE branch, ONE checkout — absolute rule

- Branch: **`finalization/design-system-product-release`**. All work — website
  AND admin — lands here in scoped commits. `main` stays as the deployed-legacy
  baseline until cutover. Every historical branch tip is preserved under
  `archive/20260806/*` tags on origin; branches other than these two are
  disposable.
- One checkout, one writer. A second Claude session or a manual
  `git checkout/reset` in the working folder is what destroyed work twice on
  2026-08-06 (see D-042). The owner views work via `next start` or GitHub,
  never by switching the tree.
- The owner runs the site with:
  `SPIMAR_DEMO_CONTENT=1 SPIMAR_ALLOW_DEMO=1 npx next start -p 3000`
  (production build required first: `pnpm build`).

## The owner checklist protocol

`docs/pdf/Plan.md` (committed on the branch) is the owner's remark list and
the authority for public-UI intent. Conventions from D-026 apply: staged
`"#"` links for not-yet-validated destinations, owner-authorized placeholder
data disclaimed in place, no demo badges on the public face. Owner remarks in
session supersede the file; fold them back into it.

## Identity rule — the design system scales, it is never bypassed

Every new implementation must carry the site's identity:

- Colors/type/spacing/radii bind to the L2 tokens in `app/globals.css` — the
  unit-test token ratchet enforces this (raw colour calls fail the build;
  derive with `var(--…)` or `color-mix(… var(--…) …)`).
- Reuse the established vocabularies before inventing: pill buttons
  (`.button`, `.salcCta`, outro bands), raised cards (`--surface-raised` +
  `--border-subtle` + `--radius-lg`), gold eyebrows, month/fact rails, the
  PageHeader (label-only, no chapter numbers on child pages), dialog chrome
  (scrim + trap + Escape + focus return).
- When a genuinely new pattern is needed, add it to
  `docs/claude-code/DESIGN-CONTRACT.md` in the same PR — that is how the
  system scales. A one-off style that lives only in one component is drift.
- **The design system is LOCKED (D-043).** `DESIGN-CONTRACT.md` is the
  Lock-Contract: tokens, anatomy, buttons, accent family, the full motion
  system and the design-from-identity protocol. New routes and features are
  designed FROM it — reuse verbatim, then compose from vocabulary, and only
  then extend the contract itself.

## The contracts (load per task, not per session)

| Task touches…  | Read                                                               |
| -------------- | ------------------------------------------------------------------ |
| Public UI      | `docs/claude-code/DESIGN-CONTRACT.md` + `docs/pdf/Plan.md`         |
| Any code       | `docs/claude-code/ENGINEERING-CONTRACT.md`                         |
| Admin/CRM/CMS  | `docs/admin-control/` (HANDOFF, QUEUE, ADR, DASHBOARD-SCOPE)       |
| Release/deploy | `docs/claude-code/SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md` |
| Past decisions | `docs/claude-code/DECISIONS.md` (append-only)                      |

## Session workflow

1. One bounded item (owner remark, Plan.md line, or admin queue item).
2. Implement on the contracts; reuse seams and vocabularies.
3. Gate: `tsc --noEmit`, ESLint, Prettier, `pnpm test`, `pnpm build`, full
   Playwright. Never commit red; never weaken a gate.
4. Scoped commit with real results in the message; push.
5. Rebuild so the owner's `next start` shows the state; tell the owner.

## Honesty rules (unchanged, non-negotiable)

No invented figures/dates/prices/partners outside D-026's disclaimed
placeholders; no fake actions; success only after durable writes; server-side
Zod + honeypot + rate limit on public forms; RLS on every table; never read
or print real `.env` values.
