# QUEUE — Claude-Owned SPIMAR Delivery

Statuses: `PENDING` · `IN PROGRESS` · `BLOCKED` · `PR REVIEW` · `DONE (merged evidence)`.

## Migration and reference-foundation closure

| ID | Status | Objective | Depends on |
|---|---|---|---|
| `ENG-014B` | `DONE (PR #4 / 4ee1131)` | Work-index constellation, Grid/List, filters, responsive and browser-state convergence | — |
| `MIG-000` | `DONE (PR #5 / a8847a5)` | Repository-native specifications, decisions, history, manifests and Claude control plane | `ENG-014B` |
| `OPS-001` | `DONE (PR #6 / f57a87f)` | Add GitHub Actions quality gates for validation, test, typecheck, lint, build, routes and browser discovery | `MIG-000` |
| `ENG-014C` | `DONE (PR #8 / 17b6974)` | Converge all 21 project-page block orders, hero placement, statistics, spacing and media rhythm | `OPS-001` |
| `ENG-014D` | `SUPERSEDED / TRANSFERRED (D-015)` | Non-hero reference media and fallbacks — **never implemented, never passed**; requirements moved to the SPIMAR content/media phase | `ENG-014C` |
| `ENG-014E` | `SUPERSEDED / TRANSFERRED (D-015)` | Motion, responsive, accessibility and visual convergence — **never implemented, never passed**; requirements moved to `TRF-010`–`TRF-019` and `TRF-081`–`TRF-087`. `PAR-P1-004` is preserved, not closed, and transfers to `TRF-015`–`TRF-017` | `ENG-014C` |
| `ENG-015` | `DONE (PR #10 / e048fdd)` | Accelerated final foundation acceptance under `D-015`: authoritative gates, live smoke review, accepted-limitation register, baseline tag `hoy-clone-baseline-eng-015`, Stage A closed | `ENG-014C` |

Post-OPS-001 control-plane hardening (no ticket ID): merged through PR #7 at
`b1854dc4a1f7b3e6c53c1af4660e85a98061b4cb`; post-merge Quality Gates run
`30694095590` and Vercel deployment `3tHix34QF8dM51kDFWKBgVtWpz2q` passed.

`ENG-014C` is merged and closed through PR #8 at
`17b697430a55fa3a5835c9c25fef927301b9ec87`, with the exact reviewed head
`5358df14cd0ab514739290d56b8fad9b0d313339` preserved as the second parent of the
merge commit; post-merge Quality Gates run `30715826793` and Vercel deployment
`DBpXw5W9uC36Vbbr3cVzuFSx7YjP` passed. Its control-plane closeout merged through
PR #9 at `6961705e657c1fa65f71a5a8099c9e77f6c89cba`.

**Stage A is closed under `D-015`.** `ENG-014D` and `ENG-014E` are superseded and
transferred — they were never implemented and must never be recorded as passed.
`ENG-015` accepted the foundation through an accelerated closure; its accepted
limitations are enumerated in
`docs/spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`. Phase 1
execution follows the `TRF-*` backlog below.

`ENG-014C` is accepted against project-composition parity under `D-014`. Its raw
whole-page scroll-height criterion (≤2%) is an **authorized unmet exception**,
never a passed measurement, caused by the pre-existing unchanged shared global
shell. Under `D-015` this exception is **carried forward unresolved** as an
accepted limitation of the foundation and transfers to `TRF-015`–`TRF-017`, where the
global shell is replaced rather than re-measured against House of Yellow. It is
still not a passed measurement.

**Measurement erratum (2026-08-01, post-merge).** This entry previously recorded
the exception as "3.3–6.3% delta, a constant +203px desktop / +193px mobile".
Re-measured from `qa/eng014c/parity-matrix.json`, the correct figures are:
delta range **3.18%–6.25%** (rounded **3.2–6.3%**, not 3.3–6.3%); desktop excess
**203px on 20 records and 202px on 1** — not a constant 203px; mobile excess
**194px on 18 records and 195px on 3 — never 193px**. The `D-014` authorization,
scope and ownership are unchanged.

## SPIMAR Transformation Phase 1

Canonical backlog: `TRF-000`–`TRF-090`, defined in
`docs/SPIMAR-Transformation-Phase-1/17-IMPLEMENTATION-BACKLOG.md` and adopted by
`D-016`. The former `SPI-*` / `OPS-070` / `CMS-080` / `CRM-090` / `LOC-100` /
`QA-110` / `AUD-120` / `REL-130` placeholders are **retired**; the mapping is in
`docs/claude-code/SPIMAR-TRACEABILITY.md`.

| Epic | IDs | Status | Objective | Exit gate |
|---|---|---|---|---|
| A | `TRF-000`–`TRF-005` | `TRF-000` `DONE`, `TRF-001` `DONE`, `TRF-002` **next** | Baseline freeze, residue inventory, neutral primitives, reference-residue removal, rollback verification | `GATE-0`, `GATE-1` |
| B | `TRF-010`–`TRF-019` | `PENDING` | Token layers, Latin/Arabic typography, three contextual modes, global/local shell, footer, motion, RTL | `GATE-2` |
| C | `TRF-020`–`TRF-027` | `PENDING` | Domain types, repository interfaces, media records and rights, asset register, host/locale resolver, route scaffolding, metadata | `GATE-3`, `GATE-4` |
| D | `TRF-030`–`TRF-040` | `PENDING` | Homepage 19-chapter narrative, event/exhibitor experience, visitor experience, legal and recovery states | `GATE-5`–`GATE-7` |
| E | `TRF-050`–`TRF-059` | `PENDING` | CMS: roles, schema, editors, media library, locale matrix, review, publish, revalidation | `GATE-8` |
| F | `TRF-060`–`TRF-070` | `PENDING` | CRM: operational schema and RLS, durable submissions, outbox, lead workspace, appointments, exports | `GATE-9` |
| G | `TRF-080`–`TRF-090` | `PENDING` | FR/EN/AR and RTL, a11y, performance, SEO, security, analytics, observability, regression, release | `GATE-10`–`GATE-12` |

Active item: **`TRF-002`** — inventory House of Yellow brand, content, media and
analytics residue. The measured residue baseline is in
`docs/spimar-phase-1/FOUNDATION-BASELINE.md`.

Delivery topology: integration branch `claude/spimar-transformation-phase-1`,
with isolated worktrees `claude/spimar-experience-shell` and
`claude/spimar-media-content`. No two sessions in the same worktree; assign
shared-file ownership before parallel work.

Expand only the active item into bounded tasks. Never start a later item early.

`ENG-014D` and `ENG-014E` requirements arrive here under `D-015`: media delivery
into `TRF-022`–`TRF-023` and `TRF-055`, animation and responsive-shell
convergence into `TRF-012`, `TRF-015`–`TRF-018`, and the cross-cutting
accessibility, browser and regression sweep into `TRF-081`–`TRF-087`.

