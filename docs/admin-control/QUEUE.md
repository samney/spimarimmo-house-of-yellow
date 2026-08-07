# SPIMAR Control — live execution queue

Mirror of `12_AUTOMODE_EXECUTION_QUEUE.md` carrying real state. Statuses:
`TODO` · `IN_PROGRESS` · `BLOCKED` · `DONE` · `VERIFIED`.

`VERIFIED` requires test or browser evidence. `DONE` means implemented and
gate-checked but not yet browser-evidenced. Nothing here is marked from
intention.

---

## WAVE 0 — AUDIT AND ALIGNMENT

| ID                                                | Status   | Evidence                                                          |
| ------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| ADM-000 Repository tree and route audit           | VERIFIED | [`WAVE-0-AUDIT.md`](./WAVE-0-AUDIT.md) §ADM-000, findings R-1/R-2 |
| ADM-001 Current public implementation audit       | VERIFIED | §ADM-001, finding P-1                                             |
| ADM-002 Backend migrations, RLS and Edge audit    | VERIFIED | §ADM-002, findings B-1/B-2; `qa/backend/db/results/`              |
| ADM-003 Hosted Supabase readiness gap report      | VERIFIED | §ADM-003 — hosted stages not started, credentials absent          |
| ADM-004 Existing design-token and primitive audit | VERIFIED | §ADM-004, findings D-1/D-2                                        |
| ADM-005 Auth and session architecture decision    | VERIFIED | [`ADR.md`](./ADR.md) ADR-A4                                       |
| ADM-006 Provider-neutral repository adapter plan  | VERIFIED | §ADM-006 + ADR-A5                                                 |
| ADM-007 Route, entity and permission alignment    | VERIFIED | §ADM-007 alignment table                                          |
| ADM-008 Establish admin ADR log                   | VERIFIED | [`ADR.md`](./ADR.md) — A1…A6                                      |
| ADM-009 Freeze implementation sequence            | VERIFIED | §ADM-008/009 — order frozen 0 → 1 → 2 → 3                         |

**Exit gate: PASSED.** No unknown critical backend dependency (B-1/B-2 assigned
to Wave 3); route conflict resolved by ADR-A1; role mismatch resolved by ADR-A4.

---

## WAVE 1 — DESIGN SYSTEM

Token layer: `styles/tokens/admin.css`. Components: `styles/admin/control.css`
plus `components/admin/**`. Evidence: `qa/control/*.png`.

| ID                                                   | Status                                                |
| ---------------------------------------------------- | ----------------------------------------------------- |
| ADM-010 SPIMAR semantic color tokens                 | VERIFIED                                              |
| ADM-011 Admin surface and elevation tokens           | VERIFIED                                              |
| ADM-012 Admin typography and numeric system          | VERIFIED                                              |
| ADM-013 Spacing, grid and radius tokens              | VERIFIED                                              |
| ADM-014 Buttons and icon buttons                     | VERIFIED                                              |
| ADM-015 Inputs, select, textarea and validation      | VERIFIED                                              |
| ADM-016 Checkbox and segmented controls              | DONE — radio/switch not yet needed by a screen        |
| ADM-017 Badge and status system                      | VERIFIED                                              |
| ADM-018 Tooltip, popover and command items           | VERIFIED — palette command items                      |
| ADM-019 Dialog, drawer and confirmation patterns     | DONE — scrim + raised dialog shipped with the palette |
| ADM-020 Tables and entity rows                       | VERIFIED — incl. mobile card transformation           |
| ADM-021 Cards, metrics and chart containers          | DONE — charts not yet required                        |
| ADM-022 Skeleton, empty, error and permission states | VERIFIED                                              |
| ADM-023 RTL and reduced-motion foundations           | VERIFIED — RTL asserted in `control-evidence.spec.ts` |
| ADM-024 Component laboratory / documentation         | TODO                                                  |
| ADM-025 Visual regression baseline                   | DONE — captures committed; diffing not yet wired      |

## WAVE 2 — SHELL, AUTH AND ONBOARDING

| ID                                             | Status                                                   |
| ---------------------------------------------- | -------------------------------------------------------- |
| ADM-030 Admin route group and protected layout | VERIFIED — `app/[locale]/(admin)/admin/**`               |
| ADM-031 Global rail                            | VERIFIED                                                 |
| ADM-032 Contextual sidebar                     | VERIFIED                                                 |
| ADM-033 Command bar                            | VERIFIED                                                 |
| ADM-034 Command palette                        | VERIFIED — Ctrl/Cmd+K, permission-filtered search        |
| ADM-035 Site and event switchers               | DONE — one site is provisioned; the control states it    |
| ADM-036 Notification panel                     | VERIFIED — honest empty state, no source connected (P-2) |
| ADM-037 Mobile shell                           | VERIFIED — captures at 390 with zero page overflow       |
| ADM-038 Login                                  | VERIFIED                                                 |
| ADM-041 Session expiry                         | VERIFIED — expired is distinguished and explained        |
| ADM-039/040/042 Reset, invite, MFA             | BLOCKED on P-1 — need an identity provider               |
| ADM-043 Role-aware route guard                 | VERIFIED — `lib/admin/session.ts`                        |
| ADM-044 Access denied                          | VERIFIED — names the missing permission                  |
| ADM-045 First-run onboarding                   | VERIFIED — states real counts and what is NOT connected  |
| ADM-046 Auth browser journey suite             | VERIFIED — `control-auth.spec.ts` 6/6 + `integration`    |

## WAVE 3 — PUBLIC ACQUISITION VERTICAL SLICE

| ID                                                | Status                                                     |
| ------------------------------------------------- | ---------------------------------------------------------- |
| ADM-050 Form-definition repository adapter        | VERIFIED — `lib/spimar/exhibitor-form.ts`, versioned       |
| ADM-051 Public exhibitor form connected to schema | VERIFIED — the shipped form at `/exposer/devenir-exposant` |
| ADM-052 Consent version capture                   | VERIFIED — notice version stored per submission            |
| ADM-053 Attribution context capture               | VERIFIED — captured at submission, never inferred          |
| ADM-054 Idempotent durable submission             | VERIFIED — replay returns the original records             |
| ADM-055 Contact and organization deduplication    | VERIFIED                                                   |
| ADM-056 Lead creation or duplicate linkage        | VERIFIED — disposition returned, never inferred            |
| ADM-057 Queue and owner assignment                | VERIFIED — written in the same transaction (ADR-A5)        |
| ADM-058 Initial activity and follow-up task       | VERIFIED — same transaction                                |
| ADM-059 Durable acknowledgement screen            | VERIFIED — speaks only about the stored record             |
| ADM-060 Public reference status screen            | VERIFIED — `/suivi`, coarse status, no PII                 |
| ADM-061 Full exhibitor enquiry browser test       | VERIFIED — `exhibitor-slice.spec.ts` 3/3                   |
| ADM-062 Negative and retry cases                  | VERIFIED — invalid, consent-refused, unknown reference     |

**Exit gate: PASSED.**

| Criterion                                     | Evidence                                                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Public form creates correct records           | `exhibitor-slice.spec.ts` walks form → lead → assignment → task                                                                        |
| Duplicate retries do not create duplicates    | replay + dedupe cases in the contract suite and the journey                                                                            |
| Consent and attribution are stored            | asserted on the lead detail page                                                                                                       |
| UI never reports provider success prematurely | acknowledgement states no e-mail was sent (P-2)                                                                                        |
| RLS verified in browser context               | **NOT MET** — no hosted database (P-1). The adapter passes 24/24 against the real migrations in PGlite, which is not hosted authority. |

## WAVE 4 — CRM

Scope is `D-041` / `DASHBOARD-SCOPE.md`, not the blueprint's full 26 tasks:
build what the website actually produces. Slice 1 shipped 2026-08-06.

> **CORRECTED 2026-08-07.** The table below previously carried invented task
> IDs — `ADM-070 Leads list`, `ADM-074 Pipeline board`, `ADM-078 Filtered
export` and others — written without reading
> `12_AUTOMODE_EXECUTION_QUEUE.md`. Only `ADM-076` and `ADM-077` were right;
> six of eight rows pointed at the wrong task. Since commits reference task IDs,
> that corrupted the trail. The IDs below are the blueprint's own.

All 26 Wave 4 IDs, so nothing is silently dropped. `deferred` rows are `D-041`
decisions, not oversights.

| ID      | Blueprint item                    | Status   | Evidence / reason                                                                                                                                                                        |
| ------- | --------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADM-070 | Overview dashboard data contract  | done     | `OverviewRepository.getOverview()` — one shape, 7 contract tests incl. the no-invented-comparison rule, probe-verified                                                                   |
| ADM-071 | Overview dashboard implementation | done     | brief §5–§7 composition on measured data; unavailable slot stated on screen; `overview-dashboard.spec.ts` 3/3; evidence at 1440/768/390                                                  |
| ADM-072 | My Day                            | todo     | —                                                                                                                                                                                        |
| ADM-073 | Activity stream                   | done     | `/admin/activity`                                                                                                                                                                        |
| ADM-074 | Team tasks                        | done     | `/admin/tasks`                                                                                                                                                                           |
| ADM-075 | Leads list                        | done     | `/admin/crm/leads`, five URL-driven views with counts                                                                                                                                    |
| ADM-076 | Saved views                       | done     | 5 contract tests + `crm-leads.spec.ts` save / replay / delete                                                                                                                            |
| ADM-077 | Lead preview drawer               | done     | `crm-leads.spec.ts` open, tablist, Escape, deep link, axe, 390                                                                                                                           |
| ADM-078 | Lead detail                       | done     | `/admin/crm/leads/[id]` — message, source, follow-up, consent, contact                                                                                                                   |
| ADM-079 | Activity timeline                 | done     | `LeadWorkspace.tsx`; `integration.spec.ts` asserts the audit trail                                                                                                                       |
| ADM-080 | Notes                             | done     | same, append-only                                                                                                                                                                        |
| ADM-081 | Tasks (lead-level)                | done     | list + complete on the detail and the tasks screen; completion writes lead history                                                                                                       |
| ADM-082 | Appointments                      | deferred | `D-041` — no booking surface exists to produce one                                                                                                                                       |
| ADM-083 | Attribution view                  | done     | captured at submission, rendered on the detail page                                                                                                                                      |
| ADM-084 | Consent view                      | done     | consent shown against its stored definition                                                                                                                                              |
| ADM-085 | Assignment                        | done     | written in the acquisition transaction (`ADR-A5`) and editable                                                                                                                           |
| ADM-086 | Stage transitions                 | done     | `integration.spec.ts` drives stage, assignment and note                                                                                                                                  |
| ADM-087 | Lost reason                       | blocked  | needs a `Lead` field + both adapters + a contract test — a slice of its own                                                                                                              |
| ADM-088 | Organizations list and detail     | done     | read model on the dedupe key; 6 contract tests, scope probe-verified; `crm-directory.spec.ts` 3/3; evidence 1440/768/390                                                                 |
| ADM-089 | Contacts list and detail          | done     | same slice — latest-consent rule; base64url route keys (raw e-mails 404ed via the proxy asset rule)                                                                                      |
| ADM-090 | Pipeline board                    | done     | `/admin/crm/pipeline`                                                                                                                                                                    |
| ADM-091 | Opportunity detail                | deferred | `D-041` — no opportunity model distinct from the lead today                                                                                                                              |
| ADM-092 | Won → exhibitor onboarding        | done     | won writes the 6-task checklist in the repository (ADR-A5 pattern), idempotent, probe-verified; `crm-onboarding.spec.ts` 2/2                                                             |
| ADM-093 | CRM export with audit             | done     | append-only log written BEFORE the CSV is released (500 otherwise); filters snapshot, never the rows; visible to `crm.export` holders on /admin/activity; `crm-export-audit.spec.ts` 2/2 |
| ADM-094 | CRM role browser tests            | partial  | assigned-scope deep link covered; full role matrix not                                                                                                                                   |
| ADM-095 | Mobile CRM workflow               | partial  | 390 no-overflow asserted on desk and drawer; no end-to-end mobile journey                                                                                                                |

**Honest omissions from `VISUAL_04`, unchanged:** no Pays column or filter
(`Lead` has no country field), no trend %, CA potentiel, conversion rate or
sparklines (no monetary or period data exists), no avatars (`P-1`), no
pagination until volume demands it.

**Found while building slice 1:** the console had never been scanned by Axe —
`accessibility.spec.ts` covers public routes only. The first scan, run with the
drawer open, failed `color-contrast` across the whole shell: `--text-tertiary`
measured 3.65:1 on white and 3.30:1 on `--surface-1` while carrying a comment
claiming it cleared 4.5:1. The text ramp is now one step darker with both
remaining steps verified against the darkest surface they sit on.

## WAVES 5–8

Deferred by `D-041`, not merely unstarted. Wave 5 event operations, Wave 7
analytics, appointments and integration health have no producer: the public
site has no application, registration, booking or payment flow. Lift them from
the blueprint when a flow feeds them.

---

## Carried blockers

| ID    | Blocker                                   | Effect                                                               |
| ----- | ----------------------------------------- | -------------------------------------------------------------------- |
| P-1   | No hosted Supabase project or credentials | No hosted verification; console auth stays env-credential (ADR-A4)   |
| P-2   | No email/CRM provider connected           | Delivery is never reported as success; `integration_jobs` queue only |
| LEG-1 | SPIMAR legal text not authored            | Consent notices render from the schema when seeded, never invented   |
