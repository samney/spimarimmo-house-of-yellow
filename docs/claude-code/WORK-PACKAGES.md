---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-02
canonical_for: trf-work-package-execution-state
depends_on:
  - ../spimar/governance/DELIVERY-MAP.md
  - ../spimar/transformation-phase-1/17-IMPLEMENTATION-BACKLOG.md
supersedes: []
replaced_by: null
---

# WORK PACKAGES — `TRF-*` execution state

Updated: 2026-08-02

This register holds **mutable execution state only**. It deliberately does not
restate two things that already have canonical owners:

- deliverable definitions live in
  [`17-IMPLEMENTATION-BACKLOG.md`](../spimar/transformation-phase-1/17-IMPLEMENTATION-BACKLOG.md);
- stage, queue and gate **dependencies** live in
  [`DELIVERY-MAP.md`](../spimar/governance/DELIVERY-MAP.md).

The labels below are short handles for scanning, not specifications. Where a
label and doc 17 differ, doc 17 wins.

`SPI-*` remains the repository queue in [`QUEUE.md`](QUEUE.md). `TRF-*` are
bounded work packages nested inside it — **not** a competing or replacement
identifier scheme (`D-016` § 5).

Statuses: `PENDING` · `IN PROGRESS` · `PR REVIEW` · `DONE` · `BLOCKED` ·
`SUPERSEDED`.

## Epic A — Baseline and neutralization

| TRF       | Status      | SPI       | Stage  | Exit gate | Depends on | Branch / PR                                               | Evidence                                                                 |
| --------- | ----------- | --------- | ------ | --------- | ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `TRF-000` | `DONE`      | `SPI-000` | `P1.0` | `GATE-0`  | —          | PR #12, merged `d1e96548feafab6bef11bffeca8d759f4ac60f4f` | [`FOUNDATION-BASELINE.md`](../spimar-phase-1/FOUNDATION-BASELINE.md)     |
| `TRF-001` | `DONE`      | `SPI-000` | `P1.0` | `GATE-0`  | `TRF-000`  | PR #14, merged `477f5ae31c1e0135122010148e868fc96bb8f7eb` | this file and [`GATES.md`](GATES.md)                                     |
| `TRF-002` | `DONE`      | `SPI-010` | `P1.1` | `GATE-1`  | `TRF-000`  | PR #17, merged `8dbfca92d96a4059561b2cdbf174a6bf00a6225f` | [`RESIDUE-INVENTORY.md`](../spimar-phase-1/RESIDUE-INVENTORY.md)         |
| `TRF-003` | `DONE`      | `SPI-010` | `P1.1` | `GATE-1`  | `TRF-002`  | PR #18, merged `3675c0206c0f819e9af0760763627934be7de304` | [`NEUTRAL-PRIMITIVES.md`](../spimar-phase-1/NEUTRAL-PRIMITIVES.md)       |
| `TRF-004` | `DONE`      | `SPI-010` | `P1.1` | `GATE-1`  | `TRF-003`  | PR #19, merged `452c411c7003c699377011cc08eee2191427731b` | [`NEUTRALIZATION.md`](../spimar-phase-1/NEUTRALIZATION.md)               |
| `TRF-005` | `PR REVIEW` | `SPI-010` | `P1.1` | `GATE-1`  | `TRF-004`  | `claude/spi-010-trf-005-recovery-verification`            | [`RECOVERY-VERIFICATION.md`](../spimar-phase-1/RECOVERY-VERIFICATION.md) |

Labels: `002` residue inventory · `003` extract neutral primitives ·
`004` remove/quarantine reference-brand residue · `005` verify recovery/rollback.

## Epic B — Design system and experience shell

Stage `P1.2`, queue owner `SPI-030`, exit `GATE-2 SYSTEM`. May run in parallel
with `P1.3` after `P1.1`, under the file-ownership map in
[`FOUNDATION-BASELINE.md`](../spimar-phase-1/FOUNDATION-BASELINE.md) § 9.

| TRF       | Status    | Depends on      | Label                                             |
| --------- | --------- | --------------- | ------------------------------------------------- |
| `TRF-010` | `PENDING` | `TRF-003`       | token layers                                      |
| `TRF-011` | `PENDING` | `TRF-010`       | Latin/Arabic typography and loading               |
| `TRF-012` | `PENDING` | `TRF-010`       | public editorial layout and responsive primitives |
| `TRF-013` | `PENDING` | `TRF-010`       | CMS editorial density mode                        |
| `TRF-014` | `PENDING` | `TRF-010`       | CRM operational density mode                      |
| `TRF-015` | `PENDING` | `TRF-011`–`012` | global header, menu, locale, CTA, focus/scroll    |
| `TRF-016` | `PENDING` | `TRF-015`       | local-event shell and context switching           |
| `TRF-017` | `PENDING` | `TRF-015`       | footer, legal/preferences, contact/WhatsApp       |
| `TRF-018` | `PENDING` | `TRF-012`       | motion primitives, cleanup, reduced motion        |
| `TRF-019` | `PENDING` | `TRF-011`–`018` | design-system visual/a11y/responsive/RTL gate     |

## Epic C — Content, media, and route foundation

Stages `P1.3` (`SPI-020`, `TRF-020`–`023`, exit `GATE-3 CONTENT`) and `P1.4`
(`SPI-040`, `TRF-024`–`027`, exit `GATE-4 ROUTES`).

| TRF       | Status    | Stage  | Depends on       | Label                                                |
| --------- | --------- | ------ | ---------------- | ---------------------------------------------------- |
| `TRF-020` | `PENDING` | `P1.3` | `TRF-001`        | domain types                                         |
| `TRF-021` | `PENDING` | `P1.3` | `TRF-020`        | repository interfaces and deterministic fixtures     |
| `TRF-022` | `PENDING` | `P1.3` | `TRF-020`        | media records, rights, focal points, fallbacks       |
| `TRF-023` | `PENDING` | `P1.3` | `TRF-022`        | SPIMAR asset/source/readiness register               |
| `TRF-024` | `PENDING` | `P1.4` | `TRF-021`        | host/tenant/locale resolver, canonical redirects     |
| `TRF-025` | `PENDING` | `P1.4` | `TRF-019`, `024` | canonical route/template families, system states     |
| `TRF-026` | `PENDING` | `P1.4` | `TRF-025`        | metadata, hreflang, sitemap, robots, structured data |
| `TRF-027` | `PENDING` | `P1.4` | `TRF-022`–`026`  | route/state/content readiness gate                   |

## Epic D — Public website

Stages `P1.5` (`GATE-5 HOME`), `P1.6` (`GATE-6 EXHIBITOR`), `P1.7`
(`GATE-7 VISITOR`); queue owners `SPI-050` and `SPI-060`.

| TRF       | Status    | Stage  | Depends on       | Label                                          |
| --------- | --------- | ------ | ---------------- | ---------------------------------------------- |
| `TRF-030` | `PENDING` | `P1.5` | `TRF-019`, `027` | homepage chapters 1–4                          |
| `TRF-031` | `PENDING` | `P1.5` | `TRF-030`        | homepage chapters 5–8                          |
| `TRF-032` | `PENDING` | `P1.5` | `TRF-031`        | homepage chapters 9–12                         |
| `TRF-033` | `PENDING` | `P1.5` | `TRF-032`        | homepage chapters 13–19                        |
| `TRF-034` | `PENDING` | `P1.6` | `TRF-027`        | event discovery, filters, empty/archive states |
| `TRF-035` | `PENDING` | `P1.6` | `TRF-034`        | destination and canonical event templates      |
| `TRF-036` | `PENDING` | `P1.6` | `TRF-035`        | programme, exhibitors, practical, gallery      |
| `TRF-037` | `PENDING` | `P1.6` | `TRF-027`        | exhibit, offers, proof/case, resources, about  |
| `TRF-038` | `PENDING` | `P1.7` | `TRF-035`        | visitor landing and preregistration            |
| `TRF-039` | `PENDING` | `P1.7` | `TRF-017`, `027` | legal, consent, confirmations, 404/500         |
| `TRF-040` | `PENDING` | `P1.7` | `TRF-030`–`039`  | public-site integrated visual/locale gate      |

## Epic E — CMS

Stage `P1.8`, queue owner `CMS-080`, exit `GATE-8 CMS`.

| TRF       | Status    | Depends on       | Label                                        |
| --------- | --------- | ---------------- | -------------------------------------------- |
| `TRF-050` | `PENDING` | `TRF-021`        | CMS ADR and provider-neutral content adapter |
| `TRF-051` | `PENDING` | `TRF-050`        | auth, tenant roles, permissions, audit       |
| `TRF-052` | `PENDING` | `TRF-050`–`051`  | content schema and migrations                |
| `TRF-053` | `PENDING` | `TRF-013`, `052` | CMS shell, inventories, filters, dashboards  |
| `TRF-054` | `PENDING` | `TRF-053`        | structured editors and relation validation   |
| `TRF-055` | `PENDING` | `TRF-022`, `054` | media library, rights, derivatives, alt text |
| `TRF-056` | `PENDING` | `TRF-054`        | locale matrix, stale translation, Arabic RTL |
| `TRF-057` | `PENDING` | `TRF-054`–`056`  | review, approvals, revisions, scheduling     |
| `TRF-058` | `PENDING` | `TRF-025`, `057` | preview, publish, targeted revalidation      |
| `TRF-059` | `PENDING` | `TRF-051`–`058`  | CMS acceptance journey and evidence          |

## Epic F — CRM and forms

Stage `P1.9`, queue owners `OPS-070` and `CRM-090`, exit `GATE-9 CRM`.

| TRF       | Status    | Depends on             | Label                                           |
| --------- | --------- | ---------------------- | ----------------------------------------------- |
| `TRF-060` | `PENDING` | `TRF-051`              | operational schema, migrations, RLS             |
| `TRF-061` | `PENDING` | `TRF-019`, `060`       | typed form contracts and accessible components  |
| `TRF-062` | `PENDING` | `TRF-061`              | durable idempotent submission, duplicate detect |
| `TRF-063` | `PENDING` | `TRF-062`              | transactional outbox, retries, dead letters     |
| `TRF-064` | `PENDING` | `TRF-035`–`039`, `063` | brochure, enquiry, proposal, meeting flows      |
| `TRF-065` | `PENDING` | `TRF-014`, `060`       | CRM shell, queues, filters, SLA, assignment     |
| `TRF-066` | `PENDING` | `TRF-065`              | lead workspace, timeline, stage, tasks          |
| `TRF-067` | `PENDING` | `TRF-066`              | appointment slots, timezone, capacity           |
| `TRF-068` | `PENDING` | `TRF-063`, `067`       | adapter status and retry center                 |
| `TRF-069` | `PENDING` | `TRF-066`              | restricted exports, merge, retention            |
| `TRF-070` | `PENDING` | `TRF-062`–`069`        | CRM acceptance journey and evidence             |

## Epic G — Quality, release, and operations

Stages `P1.10` (`GATE-10 QUALITY`), `P1.11` (`GATE-11 RC`), `P1.12`
(`GATE-12 RELEASE`); queue owners `LOC-100`, `QA-110`, `AUD-120`, `REL-130`.

| TRF       | Status    | Stage   | Depends on              | Label                                     |
| --------- | --------- | ------- | ----------------------- | ----------------------------------------- |
| `TRF-080` | `PENDING` | `P1.10` | `TRF-040`, `059`, `070` | FR/EN/AR and RTL full-matrix convergence  |
| `TRF-081` | `PENDING` | `P1.10` | `TRF-080`               | accessibility automation and manual audit |
| `TRF-082` | `PENDING` | `P1.10` | `TRF-040`, `055`        | performance, media and JS budgets         |
| `TRF-083` | `PENDING` | `P1.10` | `TRF-040`, `058`        | SEO, indexation, structured data          |
| `TRF-084` | `PENDING` | `P1.10` | `TRF-059`, `070`        | security, privacy, roles, RLS, headers    |
| `TRF-085` | `PENDING` | `P1.10` | `TRF-040`, `070`        | analytics taxonomy and no-PII check       |
| `TRF-086` | `PENDING` | `P1.10` | `TRF-082`–`085`         | monitoring, alerts, runbooks, rollback    |
| `TRF-087` | `PENDING` | `P1.10` | `TRF-080`–`086`         | full visual/state/browser regression      |
| `TRF-088` | `PENDING` | `P1.11` | `TRF-087`               | freeze release candidate, cold audit      |
| `TRF-089` | `PENDING` | `P1.12` | `TRF-088`               | defect loop and regression reruns         |
| `TRF-090` | `PENDING` | `P1.12` | `TRF-088`–`089`         | owner release decision, post-launch       |

## Accepted-limitation destinations

The `ENG-015` limitations `L1`–`L9` remain open and are owned by the work
packages below. None may be closed without evidence at its owning gate. Source
of record:
[`08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`](../spimar/parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md).

| Limitation                              | Queue owner                      | Likely work packages   |
| --------------------------------------- | -------------------------------- | ---------------------- |
| `L1` whole-page ≤2% unmet, `PAR-P1-004` | `SPI-040`                        | `TRF-024`–`027`        |
| `L2` no reference media, 0 assets       | `CMS-080`                        | `TRF-022`–`023`, `055` |
| `L3` global-shell overflow at 390px     | `SPI-040`                        | `TRF-012`, `025`       |
| `L4` French structural only             | `LOC-100`                        | `TRF-080`              |
| `L5` font preload warnings              | `SPI-030`, `QA-110`              | `TRF-011`, `082`       |
| `L6` motion choreography incomplete     | `SPI-030`                        | `TRF-018`              |
| `L7` one ESLint warning                 | `CRM-090`                        | `TRF-061`              |
| `L8` no automated axe pass              | `QA-110`                         | `TRF-081`              |
| `L9` `MIG-1`/`MIG-2`/`MIG-3` open       | see [`BLOCKERS.md`](BLOCKERS.md) | —                      |
