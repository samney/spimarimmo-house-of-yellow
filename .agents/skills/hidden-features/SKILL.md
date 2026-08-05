---
name: hidden-features
description: Use when hiding, un-hiding, or staging any feature behind a flag, and during any security review, role-gating change, or access audit. Enforces the rule that hiding UI is never a security control, and keeps the hidden-feature registry honest.
allowed-tools: Read, Grep, Glob
---

# Hidden features — process and security guard

## The rule this skill exists to enforce

**Hiding a feature from the UI is NOT a security control. The UI is not a security
boundary.**

A feature that is merely absent from navigation is still reachable by direct URL, by a
crafted request to its server action or route handler, and by anyone reading the client
bundle. In SPIMAR the real gates are, in this order:

1. **Row-Level Security** on the table — required on every table from the first migration
   (`.claude/rules/data-security.md`).
2. **Server-side authorization** in the server action / route handler / `lib/supabase/`
   helper, validated with Zod.
3. **Route and navigation visibility** — a usability affordance, never authorization.

RLS, server-side authorization, and UI visibility must enforce the **same** role model
(Super Admin / Content Editor / Translator). If they disagree, that is a P0 finding.

## When this applies

- Hiding a feature (removing UI while keeping the implementation).
- Un-hiding or re-enabling a previously hidden feature.
- Any security review, access audit, or role-gating change.
- Building a feature that ships staged or behind a flag.
- Anything touching `CMS-080` (auth, roles, CMS lifecycle) or `OPS-070` (RLS, tenant
  boundaries).

Under `AGENTS.md` these are **always-review** changes: any permission boundary requires an
independent review before merge regardless of gate position.

## Checklist when hiding a feature

1. Confirm the server-side gate exists **before** removing the UI. Removing navigation
   without a server gate converts a visible feature into a hidden vulnerability.
2. Verify RLS policy covers the table for every role, including the anon key — which reads
   published content only.
3. Confirm the service-role key is server-only: never bundled, never logged, never surfaced
   in an error.
4. Grep for remaining reachability: route handlers, server actions, sitemap entries,
   `next-intl` message keys, and any link that still resolves.
5. Record the hidden feature in the registry (below) with: what is hidden, why, the server
   gate that actually protects it, the roles that may reach it, and the condition for
   un-hiding.

## Checklist when un-hiding

1. Re-verify the server gate and RLS policy still hold — they may have drifted.
2. Confirm the feature's acceptance evidence exists in
   `docs/claude-code/VALIDATION-MATRIX.md` with real artifacts.
3. Confirm no accepted limitation or blocker in `docs/claude-code/BLOCKERS.md` covers it.
4. Update the registry entry rather than deleting it — the history is the audit trail.

## Registry

SPIMAR has **no hidden-feature registry yet** — the CMS/CRM role surface does not exist
before `OPS-070`/`CMS-080`. The first feature that ships hidden must create
`docs/claude-code/HIDDEN-FEATURES.md` and record itself there, and that creation is a
`DECISIONS.md` entry.

Do not invent a registry path or claim one exists. Until it is created, this file's
status is `TBD` by design.

## Never

- Never present UI hiding as a security measure in evidence, a PR description, or a
  validation-matrix cell.
- Never hide a feature to make a failing gate pass — that is weakening a check, forbidden
  by `.claude/rules/testing-and-validation.md`.
- Never rely on `next/link` absence, CSS `display:none`, or a client-side role check as the
  gate.
