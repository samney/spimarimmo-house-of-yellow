# Wave 4 — slice 1 plan

Planned 2026-08-06, deferred the same day: the owner prioritized public-site
completion first (D-041). Execute this when CRM work kicks off. Researched at
head `3b63c04`; **re-verified at head `9e87938`** — see §"Verified" at the end.
Scope authority is `D-041` / `DASHBOARD-SCOPE.md`.

**Slice:** ADM-076 saved views + ADM-077 lead preview drawer, one screen
(`/admin/crm/leads`), reference `VISUAL_04_CRM_LEADS_LIST.png`. ADM-070/071/
073/074/075 already exist from console v1 — the §8.3 gap list starts here.

## Patterns to mirror (all existing)

- URL-driven list state: `?view=` in `app/[locale]/(admin)/admin/crm/leads/page.tsx`.
- Seam → file adapter → contract test: `lib/backend/admin-seams.ts` →
  `file-admin-repository.ts` → `file-store.ts` → `admin-seams.contract.test.ts`.
- Dialog chrome (scrim, Escape, focus return): `components/admin/CommandPalette.tsx` (ADM-019).
- Admin server actions: `app/actions/cms.ts` (`updateLeadAction`) — Zod +
  permission guard + actor from session.

## Changes

1. `lib/backend/admin-seams.ts` — `SavedLeadView` type + `CrmRepository.
listSavedViews(owner) / saveSavedView(input, actor) / deleteSavedView(id, actor)`.
   Per-owner views. File adapter only; **no migration** (P-1).
2. `lib/spimar/repositories/file-store.ts` — `saved-views` jsonl collection.
3. `lib/spimar/repositories/file-admin-repository.ts` — wire the methods.
4. `admin-seams.contract.test.ts` — save / list-scoped-to-owner / rename /
   delete round-trip, audit fields.
5. `app/actions/cms.ts` (or sibling) — `saveLeadView` / `deleteLeadView`.
6. Leads page — URL params `?view=&stage=&kind=&owner=&event=&q=` (all real
   `Lead` fields), server-side filtering, Réinitialiser as plain link, saved
   views next to built-ins, "Enregistrer la vue" form, drawer on `?lead=<id>`
   (lead + `listAcquisitions`).
7. `components/admin/LeadPreviewDrawer.tsx` — client island for interaction
   only (Escape/scrim close navigates back, focus restore); content rendered
   server-side. Aperçu/Activité as accessible tablist; "Voir le lead complet"
   → detail route.
8. `tests/e2e/crm-leads.spec.ts` (imports `./fixtures`) — enquiry → sign-in →
   filter → save view → reapply → drawer open/tab/Escape → `?lead=` deep link
   → axe with drawer open → 390 no overflow. Assigned-scope user deep-linking
   an out-of-scope lead gets the permission/absent state, not data.
9. `docs/admin-control/QUEUE.md` — add Wave 4 table with honest statuses.

## Honest omissions from VISUAL_04 (report, never fake)

Pays column/filter (no country field on `Lead`); trend %, CA potentiel,
conversion, sparklines (no monetary/period data exists); avatars (P-1);
pagination (defer until volume demands).

## Verified at head `9e87938` (2026-08-06)

Read against the live code, not re-derived. The plan stands; four points are
now pinned down.

**Confirmed.**

- `app/[locale]/(admin)/admin/crm/leads/page.tsx` takes
  `searchParams: Promise<{ view?: string }>` and already URL-drives `?view=`
  with five built-ins (`all`, `unassigned`, `open`, `won`, `lost`), each
  rendering its own count and `aria-current`. Saved views slot beside these —
  do not replace them.
- Every filter the plan proposes maps to a real field on `Lead`
  (`lib/spimar/types.ts`): `stage` (`LeadStage`), `kind` (`LeadKind`),
  `owner` → `assignee`, `event` → `eventSlug`, and `q` over
  `name`/`email`/`organisation`/`message`. Nothing invented.
- `CrmRepository.listAcquisitions(leadId)` exists and is documented to return
  an honest empty list for leads predating the acquisition path — the drawer's
  Activité tab must render that emptiness, not hide the tab.
- The no-country omission is real: `Lead` has `locale` and `sourcePath` but no
  country field.
- The assigned-scope guard the E2E test must exercise already exists —
  `isAssignedScopeOnly(actor)` filters to `lead.assignee === session.email` and
  renders a notice counting the hidden rows.

**Two gaps the plan did not name.**

1. **Lost reason has no home.** `updateLead` accepts only
   `Partial<Pick<Lead, "stage" | "assignee">>`, and `Lead` has no lost-reason
   field. The `DASHBOARD-SCOPE.md` line "stage transitions with lost reason"
   is therefore a **later** slice: it needs a `Lead` field, both adapters, and
   a contract test. Do not smuggle it into slice 1.
2. **Export ignores the active view.** The header posts a bare
   `GET /admin/crm/leads/export` with no parameters, so filtering the list then
   exporting silently returns everything. Once filters land this becomes a
   correctness bug, not a nicety — carry the same query string into the export
   form, or the button lies about what it exports.
