# SPIMAR TRACEABILITY

Updated: 2026-08-01
Authority: `D-016`. Canonical Phase 1 backlog scheme is `TRF-000`–`TRF-090`,
defined in `docs/SPIMAR-Transformation-Phase-1/17-IMPLEMENTATION-BACKLOG.md`.

## Scheme migration — `SPI-*` is retired

`SPI-000`–`SPI-060` were provisional placeholders in `QUEUE.md`, activated under
`D-015` only because no other scheme existed at that moment. The Phase 1 package
supersedes them. **Do not use `SPI-*` identifiers again.**

| Retired   | Replaced by                              | Notes                                                     |
| --------- | ---------------------------------------- | --------------------------------------------------------- |
| `SPI-000` | `TRF-000`–`TRF-005`                      | baseline freeze, residue inventory, neutralization        |
| `SPI-010` | `TRF-002`–`TRF-004`                      | neutralize reference product, extract neutral primitives  |
| `SPI-020` | `TRF-020`–`TRF-021`                      | domain types, repository interfaces, fixtures             |
| `SPI-030` | `TRF-010`–`TRF-019`                      | tokens, typography, three modes, motion, RTL shell        |
| `SPI-040` | `TRF-015`–`TRF-017`, `TRF-024`–`TRF-026` | global/local shell, host/locale resolver, metadata        |
| `SPI-050` | `TRF-030`–`TRF-033`                      | homepage, 19-chapter B2B narrative                        |
| `SPI-060` | `TRF-034`–`TRF-039`                      | remaining public route families                           |
| `OPS-070` | `TRF-051`–`TRF-052`, `TRF-060`           | schema, migrations, roles, RLS, tenant boundaries         |
| `CMS-080` | `TRF-050`–`TRF-059`                      | CMS lifecycle, media, translations, audit                 |
| `CRM-090` | `TRF-060`–`TRF-070`                      | forms, leads, assignment, appointments, delivery, retries |
| `LOC-100` | `TRF-080`                                | FR/EN/AR and true RTL convergence                         |
| `QA-110`  | `TRF-081`–`TRF-087`                      | a11y, performance, SEO, security, analytics, regression   |
| `AUD-120` | `TRF-088`–`TRF-089`                      | release candidate freeze and cold master audit            |
| `REL-130` | `TRF-090`                                | owner release decision and post-launch monitoring         |

Earlier references to `PAR-P1-004` under `ENG-014E` now resolve to `TRF-015`–`TRF-017`
(global shell) and remain **unmet, not closed**.

## Epic → stage → gate

| Epic                                   | TRF range           | Stage           | Exit gate                                           |
| -------------------------------------- | ------------------- | --------------- | --------------------------------------------------- |
| A — Baseline and neutralization        | `TRF-000`–`TRF-005` | `P1.0`–`P1.1`   | `GATE-0 BASELINE`, `GATE-1 NEUTRAL`                 |
| B — Design system and experience shell | `TRF-010`–`TRF-019` | `P1.2`          | `GATE-2 SHELL`                                      |
| C — Content, media, route foundation   | `TRF-020`–`TRF-027` | `P1.3`–`P1.4`   | `GATE-3 CONTENT`, `GATE-4 ROUTES`                   |
| D — Public website                     | `TRF-030`–`TRF-040` | `P1.5`–`P1.7`   | `GATE-5 HOME`, `GATE-6 EXHIBITOR`, `GATE-7 VISITOR` |
| E — CMS                                | `TRF-050`–`TRF-059` | `P1.8`          | `GATE-8 CMS`                                        |
| F — CRM and forms                      | `TRF-060`–`TRF-070` | `P1.9`          | `GATE-9 CRM`                                        |
| G — Quality, release, operations       | `TRF-080`–`TRF-090` | `P1.10`–`P1.12` | `GATE-10 QUALITY`, `GATE-11 RC`, `GATE-12 RELEASE`  |

## Current status

| ID         | Status    | Evidence                                                                                                             |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| `TRF-000`  | `DONE`    | `docs/spimar-phase-1/FOUNDATION-BASELINE.md`; entry SHA `e048fdd`, tag `hoy-clone-baseline-eng-015`, all gates green |
| `TRF-001`  | `DONE`    | this file, `FOUNDATION-BASELINE.md`, `D-016`, updated `.claude/rules/`, control-plane refresh                        |
| `TRF-002`  | `NEXT`    | not started — residue baseline measured in `FOUNDATION-BASELINE.md`                                                  |
| `TRF-003`+ | `PENDING` | —                                                                                                                    |

## Non-negotiable trace rows

Each must land with the stated evidence before Phase 1 can close.

| Decision                                               | Evidence destination                                     |
| ------------------------------------------------------ | -------------------------------------------------------- |
| Events appear within the first three homepage chapters | homepage desktop/mobile/RTL captures plus DOM/route test |
| Exhibitor and visitor states remain distinct           | event-state and form E2E matrix                          |
| No invented proof or content                           | content-evidence register and publish validation         |
| House of Yellow residue is zero in public output       | repository and runtime residue scan                      |
| One system, three design modes                         | component evidence plus public/CMS/CRM visual QA         |
| CMS is functional                                      | complete CMS acceptance journey                          |
| CRM is functional                                      | complete CRM acceptance journey                          |
| FR/EN/AR with true RTL                                 | route, content, form, dashboard, SEO and visual matrix   |
| Durable outcome semantics                              | transaction/outbox/provider/recovery tests               |
| No PII leakage                                         | analytics, log, client-bundle and privacy audit          |
| Release is evidence-backed                             | exact candidate SHA and cold master-audit report         |

## Superseded execution assumptions

Perfect House of Yellow parity is not a delivery target · `ENG-014D` and
`ENG-014E` are not active clone phases · the public site is not visitor-first ·
WellExpo is not the implementation template · generated screens are not source
specifications · a static CMS/CRM dashboard is not an accepted POC · a green
build alone is not a release decision.

## Gate protocol

Every stage supplies: immutable base and head SHAs; exact changed-file list;
requirement and state IDs covered; validation commands with exit codes;
browser/viewport/locale evidence where relevant; remaining blockers and known
differences; rollback boundary; reviewer verdict. `D-009` two-pass review is in
force for all Phase 1 work — its `ENG-015` relaxation has expired.
