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
| ADM-018 Tooltip, popover and command items           | TODO — arrives with ADM-034                           |
| ADM-019 Dialog, drawer and confirmation patterns     | TODO — arrives with ADM-077                           |
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
| ADM-034 Command palette                        | TODO — the search control is disabled and says so        |
| ADM-035 Site and event switchers               | DONE — one site is provisioned; the control states it    |
| ADM-036 Notification panel                     | VERIFIED — honest empty state, no source connected (P-2) |
| ADM-037 Mobile shell                           | VERIFIED — captures at 390 with zero page overflow       |
| ADM-038 Login                                  | VERIFIED                                                 |
| ADM-039/040/041/042 Reset, invite, expiry, MFA | BLOCKED on P-1 — needs Supabase Auth                     |
| ADM-043 Role-aware route guard                 | VERIFIED — `lib/admin/session.ts`                        |
| ADM-044 Access denied                          | VERIFIED — names the missing permission                  |
| ADM-045 First-run onboarding                   | TODO                                                     |
| ADM-046 Auth browser journey suite             | VERIFIED — `integration.spec.ts`                         |

## WAVE 3 — PUBLIC ACQUISITION VERTICAL SLICE

| ID                                                | Status                                                 |
| ------------------------------------------------- | ------------------------------------------------------ |
| ADM-050 Form-definition repository adapter        | VERIFIED — `lib/spimar/exhibitor-form.ts`, versioned   |
| ADM-051 Public exhibitor form connected to schema | VERIFIED — `/exposer`                                  |
| ADM-052 Consent version capture                   | VERIFIED — notice version stored per submission        |
| ADM-053 Attribution context capture               | VERIFIED — captured at submission, never inferred      |
| ADM-054 Idempotent durable submission             | VERIFIED — replay returns the original records         |
| ADM-055 Contact and organization deduplication    | VERIFIED                                               |
| ADM-056 Lead creation or duplicate linkage        | VERIFIED — disposition returned, never inferred        |
| ADM-057 Queue and owner assignment                | VERIFIED — written in the same transaction (ADR-A5)    |
| ADM-058 Initial activity and follow-up task       | VERIFIED — same transaction                            |
| ADM-059 Durable acknowledgement screen            | VERIFIED — speaks only about the stored record         |
| ADM-060 Public reference status screen            | VERIFIED — `/suivi`, coarse status, no PII             |
| ADM-061 Full exhibitor enquiry browser test       | VERIFIED — `exhibitor-slice.spec.ts` 4/4               |
| ADM-062 Negative and retry cases                  | VERIFIED — invalid, consent-refused, unknown reference |

**Exit gate: PASSED.**

| Criterion                                     | Evidence                                                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Public form creates correct records           | `exhibitor-slice.spec.ts` walks form → lead → assignment → task                                                                        |
| Duplicate retries do not create duplicates    | replay + dedupe cases in the contract suite and the journey                                                                            |
| Consent and attribution are stored            | asserted on the lead detail page                                                                                                       |
| UI never reports provider success prematurely | acknowledgement states no e-mail was sent (P-2)                                                                                        |
| RLS verified in browser context               | **NOT MET** — no hosted database (P-1). The adapter passes 24/24 against the real migrations in PGlite, which is not hosted authority. |

## WAVES 4–8

TODO. Not started; not scheduled ahead of the Wave 3 review.

---

## Carried blockers

| ID    | Blocker                                   | Effect                                                               |
| ----- | ----------------------------------------- | -------------------------------------------------------------------- |
| P-1   | No hosted Supabase project or credentials | No hosted verification; console auth stays env-credential (ADR-A4)   |
| P-2   | No email/CRM provider connected           | Delivery is never reported as success; `integration_jobs` queue only |
| LEG-1 | SPIMAR legal text not authored            | Consent notices render from the schema when seeded, never invented   |
