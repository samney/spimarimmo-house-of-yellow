# SPIMAR Control — Wave 0 audit (ADM-000 … ADM-009)

Audit of the repository against the
`SPIMARIMMO_ADMIN_CRM_CMS_CLAUDE_AUTOMODE_BLUEPRINT` package, performed before
any Wave 1 code. Everything below is observed from the tree at the branch point
`46247f7`, not assumed.

---

## ADM-000 — Repository tree and route audit

Authenticated surface as shipped:

```
app/admin/                     layout.tsx, admin.css
  login/  page.tsx             env-credential sign-in
  page.tsx                     dashboard (tally board, pipeline rail, system panel)
  pages/ events/ destinations/ media/     CMS collections
  leads/ leads/[id]/ leads/export/        CRM desk + CSV
  pipeline/                    stage board
```

Public surface is `app/[locale]/(public)/…` with `next-intl`, `fr` default at
`/` and `en` at `/en/…` (`i18n/routing.ts`).

**Finding R-1 (blocking for ADM-030).** `proxy.ts` excludes `admin` from the
i18n matcher: `"/((?!api|admin|_next|_vercel|.*\\..*).*)"`. The admin surface is
therefore _deliberately outside_ locale routing today, while the blueprint
(file 01 §3, file 14) mandates `app/[locale]/(admin)/admin/…`. Every approved
visual renders a French interface; the shipped console is English-only.

**Finding R-2.** `app/[locale]/layout.tsx` and `app/admin/layout.tsx` each render
their own `<html>`/`<body>`. Nesting admin under `[locale]` requires the admin
layout to stop rendering the document shell.

## ADM-001 — Current public implementation audit

`submitEnquiry` (`app/actions/enquiry.ts`) enforces honeypot → rate limit →
Zod → durable write → result, and returns `duplicate` honestly rather than a
false success. It writes through `AdminSeams.crm` to the **local JSONL store**,
not to the canonical acquisition contract. There is no versioned form
definition, no consent-definition capture and no attribution record.

**Finding P-1.** The public funnel does not yet produce the record set the
blueprint requires (file 03 §3): submission, consent, contact, organization,
lead, event interest, campaign attribution, assignment, activity, follow-up
task, integration job. This is precisely Wave 3.

## ADM-002 — Backend migrations, RLS and Edge Function audit

43 migrations, 90 public tables, 100% RLS-enabled, 205 policies, 4 Edge
Functions, 29 pgTAP suites — all green in `qa/backend/db/results/`
(`productionAuthority: false`). The acquisition contract already exists:

- `public.acquire_lead_edge_v1(...)` → rate limit → `app_private.acquire_lead_v1(...)`
- Dispositions: `accepted` · `deduplicated` · `idempotent_replay` · `rate_limited`
- Writes, in order: organizations → contacts → leads → form_submissions →
  consents → campaign_attribution → lead_event_interests → activities →
  (resource_deliveries) → integration_jobs ×2
- Both are `security definer` and require service context.

**Finding B-1 (drives ADM-057/058).** `acquire_lead_v1` stops at
`queue_key = 'unassigned'`. It writes **no** `lead_assignments` row and **no**
`tasks` row, both of which the blueprint requires. The tables exist. The gap is
caller-side, so it is closed in the adapter rather than by rewriting a tested
migration.

**Finding B-2.** The enum `public.acquisition_kind` contains
`exhibitor_enquiry`; `lead_stage` carries the full 14-state machine. The
application's R1 `LeadStage` union (5 states) is a different, narrower
vocabulary.

## ADM-003 — Hosted Supabase readiness gap report

| Stage                                     | State                                  |
| ----------------------------------------- | -------------------------------------- |
| Schema + Edge implemented                 | done, evidenced against PGlite         |
| Postgres adapters for the canonical seams | done (PR #28), 19/19 contract tests    |
| Hosted Supabase project                   | **not started — no credentials (P-1)** |
| Edge Functions deployed                   | **not started**                        |
| Email/CRM provider                        | **not connected (P-2)**                |

Nothing in Waves 0–3 may claim hosted verification. PGlite is not production
authority, and every generated report says so.

## ADM-004 — Existing design-token and primitive audit

`app/globals.css` carries the accepted L1/L2 token architecture. The public
scale is **viewport-relative** (`--text-*`, `--space-*`, `--radius-*` in `vw`).
`app/admin/admin.css` (PR #27) defines an L3 admin layer bound to those L2
semantics, but with `--admin-radius: 2px` and a black "spine" navigation.

**Finding D-1 (resolved in ADR-A2).** The blueprint specifies a materially
different admin surface: warm neutral `#e9e5e2` environment, a large floating
rounded shell, a 32/22/16/12/8px radius hierarchy and a fixed **px** scale.
These are two different design systems; they must not be merged by accident.

**Finding D-2 (resolved in ADR-A3).** Blueprint file 05 writes
`--spimar-gold: #c9972f`; the accepted public token is `#efc337`. Both blueprint
files instruct extraction from the accepted public system, so the public value
wins and `#c9972f` is an illustrative placeholder.

## ADM-005 — Auth and session architecture decision

Shipped: signed HTTP-only cookie over env-supplied credentials, no default
account, two roles (`admin`, `editor`). The schema models six roles and 19
permission codes with a second capability-profile axis.

See **ADR-A4**.

## ADM-006 — Provider-neutral repository adapter plan

`lib/backend/seams.ts` (canonical) and `lib/backend/admin-seams.ts` (R1 console)
are the two declared seams; `lib/spimar/repositories/` holds file and Postgres
implementations behind one composition root. Wave 3 adds a **third** seam —
acquisition — expressed on the canonical vocabulary, because the exhibitor
enquiry writes canonical records, not R1 ones.

## ADM-007 — Route, entity and permission alignment report

| Blueprint expects                   | Repository has            | Action                  |
| ----------------------------------- | ------------------------- | ----------------------- |
| `/[locale]/admin/…`                 | `/admin/…`, i18n-excluded | ADR-A1, done in ADM-030 |
| 6 roles / 19 permissions            | 2 roles, boolean helpers  | ADR-A4, staged          |
| `crm/leads`, `crm/pipeline`         | `leads`, `pipeline`       | moved in ADM-030        |
| versioned form definitions          | hard-coded Zod schema     | Wave 3 (ADM-050/051)    |
| `lead_assignments`, `tasks` written | not written               | Wave 3 (ADM-057/058)    |

## ADM-008 / ADM-009 — ADR log and frozen sequence

Decisions are recorded in [`ADR.md`](./ADR.md). The execution order is frozen as
the blueprint's own wave order: 0 → 1 → 2 → 3, with Wave 3 as the first
functional proof. The live queue mirror is [`QUEUE.md`](./QUEUE.md).

---

## Wave 0 exit gate

| Criterion                              | State                                     |
| -------------------------------------- | ----------------------------------------- |
| No unknown critical backend dependency | met — B-1/B-2 identified and assigned     |
| No conflicting route architecture      | met — resolved by ADR-A1                  |
| No unresolved role model mismatch      | met — resolved by ADR-A4                  |
| Initial checks pass                    | met — see the evidence line in `QUEUE.md` |
