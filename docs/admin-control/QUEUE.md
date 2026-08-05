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

| ID                                                   | Status |
| ---------------------------------------------------- | ------ |
| ADM-010 SPIMAR semantic color tokens                 | TODO   |
| ADM-011 Admin surface and elevation tokens           | TODO   |
| ADM-012 Admin typography and numeric system          | TODO   |
| ADM-013 Spacing, grid and radius tokens              | TODO   |
| ADM-014 Buttons and icon buttons                     | TODO   |
| ADM-015 Inputs, select, textarea and validation      | TODO   |
| ADM-016 Checkbox, radio, switch, segmented controls  | TODO   |
| ADM-017 Badge and status system                      | TODO   |
| ADM-018 Tooltip, popover and command items           | TODO   |
| ADM-019 Dialog, drawer and confirmation patterns     | TODO   |
| ADM-020 Tables and entity rows                       | TODO   |
| ADM-021 Cards, metrics and chart containers          | TODO   |
| ADM-022 Skeleton, empty, error and permission states | TODO   |
| ADM-023 RTL and reduced-motion foundations           | TODO   |
| ADM-024 Component laboratory / documentation         | TODO   |
| ADM-025 Visual regression baseline                   | TODO   |

## WAVE 2 — SHELL, AUTH AND ONBOARDING

ADM-030 … ADM-046: TODO.

## WAVE 3 — PUBLIC ACQUISITION VERTICAL SLICE

ADM-050 … ADM-062: TODO.

## WAVES 4–8

TODO. Not started; not scheduled ahead of the Wave 3 exit gate.

---

## Carried blockers

| ID    | Blocker                                   | Effect                                                               |
| ----- | ----------------------------------------- | -------------------------------------------------------------------- |
| P-1   | No hosted Supabase project or credentials | No hosted verification; console auth stays env-credential (ADR-A4)   |
| P-2   | No email/CRM provider connected           | Delivery is never reported as success; `integration_jobs` queue only |
| LEG-1 | SPIMAR legal text not authored            | Consent notices render from the schema when seeded, never invented   |
