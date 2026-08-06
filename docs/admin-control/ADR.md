# SPIMAR Control — architecture decision record

Decisions taken while executing the blueprint package. Each records the conflict
that forced it, the alternatives, and the consequence. Blueprint-vs-repository
conflicts are resolved here rather than silently.

---

## ADR-A1 — The console moves under `app/[locale]/(admin)/admin/…`

**Context.** Blueprint file 01 §3 and the whole route matrix in file 14 assume a
locale-prefixed admin (`/[locale]/admin/crm/leads`). The repository ships
`app/admin/…` with `admin` explicitly excluded from the `next-intl` matcher in
`proxy.ts`, so the console has no locale segment at all. Every approved visual
renders a French interface; the shipped console is English-only strings.

**Alternatives.** (a) Keep `/admin` and add locale later — every route moves
twice and the interface stays monolingual through Waves 3–7, contradicting the
package's "French, English and Arabic are first-class" decision. (b) Keep
`/admin` permanently and treat file 14 as advisory — diverges from the frozen
route matrix that every later task references. (c) Relocate now, before more
screens exist.

**Decision.** (c). The console moves to `app/[locale]/(admin)/admin/…`, `admin`
is removed from the proxy exclusion, and the admin layout stops rendering its
own `<html>`/`<body>` because `[locale]/layout.tsx` already owns the document.
Route-group `(admin)` keeps the segment out of the URL, exactly as `(public)`
does.

**Consequence.** Admin URLs become `/admin/…` in French (default locale, no
prefix) and `/en/admin/…` in English — no user-visible change for the French
operator, and localization becomes a message-catalogue task rather than another
route migration. The `/admin/leads/export` route handler keeps working because
route handlers are matched before the i18n rewrite.

---

## ADR-A2 — The admin surface is rebuilt on the blueprint's own token layer

**Context.** PR #27 shipped an admin design system with a black navigation
spine, `2px` radii and everything bound to the public L2 semantics. The
blueprint specifies a different surface: a warm neutral `#e9e5e2` environment, a
large floating rounded application shell, a `32 / 22 / 16 / 12 / 8` px radius
hierarchy, exactly two shadows, and a fixed px type and spacing scale. Blueprint
file 05 §1 explicitly forbids styling the admin from the reference namespace.

**Alternatives.** (a) Keep the shipped system and treat the visuals as
inspiration — rejects the approved direction the owner supplied. (b) Merge both
— produces a surface that is neither, and the review rule in file 15 rejects
"diverges from the visual family without documented reason". (c) Replace the
admin L3 layer with the blueprint's, keeping the L1 brand primitives.

**Decision.** (c). `app/admin/admin.css` is replaced by
`styles/tokens/admin.css` plus component styles. Only brand _primitives_ (gold,
ink, black, paper, Poppins) are inherited from L1. The admin never binds to the
public `vw` scales — an operator's table row must not resize with the viewport.

**Consequence.** The PR #27 console is re-skinned, not rebuilt: markup and
server logic survive, class names change. The public site is untouched.

---

## ADR-A3 — Gold is `#efc337`, the accepted public value

**Context.** Blueprint file 05 §2 writes `--spimar-gold: #c9972f`. The accepted
public token is `#efc337`. Both blueprint files 05 and 08 instruct that final
brand values be extracted from the accepted public design system.

**Decision.** `#efc337` is the brand gold. `#c9972f` is treated as an
illustrative placeholder in the specification text, not a value to ship. The
deeper `--spimar-gold-deep: #d4a91f` covers the cases where the visuals show a
bronzed gold (primary button fill, active rail tile).

**Consequence.** Gold-on-white text fails WCAG AA at these values, so gold is
never used as a text colour on light surfaces. It is used as fill, indicator,
underline and focus ring, with ink text on top — which is what the visuals
actually show.

---

## ADR-A4 — Roles stay boolean for now; the permission vocabulary is introduced honestly

**Context.** The schema models six roles (`super_admin`, `content_editor`,
`translator`, `sales_manager`, `sales_agent`, `analyst`), 19 permission codes
and a capability-profile axis. The application ships two roles (`admin`,
`editor`) with boolean helpers, backed by env credentials because Supabase Auth
is unreachable (P-1).

**Alternatives.** (a) Implement the full six-role model against env credentials
— invents an identity system that cannot be verified against the RLS it is
supposed to mirror, and the blueprint's own rule is that frontend affordances
and backend policies must agree. (b) Keep two booleans and hard-code them at
call sites — blocks Wave 4+, where navigation and actions must be
permission-driven.

**Decision.** A single `lib/admin/permissions.ts` module becomes the only
authority the UI consults. It exposes the **canonical permission codes** and
derives them, for now, from the two shipped roles. When Supabase Auth lands, the
derivation is replaced by a real grant lookup and no call site changes.

**Consequence.** Navigation, actions and route guards are written against
permission codes from Wave 2 onward. The mapping is documented as an
approximation, never presented as the real grant model.

---

## ADR-A5 — Assignment and follow-up task are written by the adapter, not by a new migration

**Context.** `app_private.acquire_lead_v1` writes eleven record kinds but leaves
`queue_key = 'unassigned'` and creates neither `lead_assignments` nor `tasks`.
Blueprint file 03 §3 and queue items ADM-057/058 require both. The migration is
tested by 29 pgTAP suites and the master prompt forbids rebuilding the backend.

**Alternatives.** (a) Add a migration that extends the acquisition function —
mutates a contract 29 suites and four Edge Functions depend on. (b) Trigger —
hides an operational policy (who gets assigned) inside the database, where it
cannot see the console's own routing rules.

**Decision.** The acquisition adapter calls `acquire_lead_edge_v1` and then
writes the assignment and the follow-up task **inside the same transaction**, so
the slice is still durable-or-nothing.

**Consequence.** No migration changes. The assignment policy lives in
application code where it is testable and changeable, and the Edge Function path
keeps its existing behaviour unchanged.

---

## ADR-A6 — Arabic stays structurally supported, not advertised

**Context.** The package lists Arabic as a first-class locale. `i18n/routing.ts`
enables `fr` and `en` only, and `supabase/seed.sql` seeds `ar` with
`enabled = false`. The licensed Arabic typeface is not available.

**Decision.** Every admin surface is authored RTL-correct from the start
(logical properties only, no physical `left`/`right`, `dir`-aware icons), and
Arabic is **not** added to the locale list until the typeface exists. Enabling a
locale the product cannot typeset would be an unvalidated claim of readiness.

**Consequence.** The DoD "RTL" line is satisfiable by evidence — the layout is
verified under `dir="rtl"` — while the locale list stays honest. Adding `ar`
later is a one-line routing change.
