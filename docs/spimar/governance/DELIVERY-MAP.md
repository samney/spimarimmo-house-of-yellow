---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: stage-spi-trf-gate-dependencies
depends_on:
  - ../transformation-phase-1/17-IMPLEMENTATION-BACKLOG.md
supersedes: []
replaced_by: null
---

# Unified Delivery Map

`SPI-*` identifiers are queue phases. `TRF-*` identifiers are bounded work packages nested inside them. `P1.*` identifies the delivery stage and `GATE-*` its acceptance boundary. These are one graph, not competing roadmaps.

| Stage                                               | Queue owner          | Work packages   | Entry                                                     | Exit               |
| --------------------------------------------------- | -------------------- | --------------- | --------------------------------------------------------- | ------------------ |
| `P1.0` Foundation freeze and planning contract      | `SPI-000`            | `TRF-000`-`001` | `ENG-015`                                                 | `GATE-0 BASELINE`  |
| `P1.1` Neutralize reference product                 | `SPI-010`            | `TRF-002`-`005` | `P1.0`                                                    | `GATE-1 NEUTRAL`   |
| `P1.2` Brand and cross-product design system        | `SPI-030`            | `TRF-010`-`019` | `P1.1`; may run parallel with `P1.3` under file ownership | `GATE-2 SYSTEM`    |
| `P1.3` Product/content/media domain foundation      | `SPI-020`            | `TRF-020`-`023` | `P1.1`; may run parallel with `P1.2` under file ownership | `GATE-3 CONTENT`   |
| `P1.4` Host, locale, routes, metadata, shared shell | `SPI-040`            | `TRF-024`-`027` | `P1.2` and `P1.3`                                         | `GATE-4 ROUTES`    |
| `P1.5` Homepage                                     | `SPI-050`            | `TRF-030`-`033` | `P1.4`                                                    | `GATE-5 HOME`      |
| `P1.6` Event and exhibitor routes                   | `SPI-060`            | `TRF-034`-`037` | `P1.4`                                                    | `GATE-6 EXHIBITOR` |
| `P1.7` Visitor, forms, legal, and recovery          | `SPI-060`            | `TRF-038`-`040` | `P1.4`; coordinate with `P1.6`                            | `GATE-7 VISITOR`   |
| `P1.8` CMS editorial product                        | `CMS-080`            | `TRF-050`-`059` | `P1.3` and `P1.4`                                         | `GATE-8 CMS`       |
| `P1.9` Operational data and lightweight CRM         | `OPS-070`, `CRM-090` | `TRF-060`-`070` | `P1.6`-`P1.8`                                             | `GATE-9 CRM`       |
| `P1.10` Locale and quality convergence              | `LOC-100`, `QA-110`  | `TRF-080`-`087` | Continuous; closes after public/CMS/CRM                   | `GATE-10 QUALITY`  |
| `P1.11` Release candidate and cold audit            | `AUD-120`            | `TRF-088`       | All prior gates                                           | `GATE-11 RC`       |
| `P1.12` Defect closure and release                  | `REL-130`            | `TRF-089`-`090` | `P1.11`                                                   | `GATE-12 RELEASE`  |

Only `docs/claude-code/QUEUE.md` records current status. This map controls dependency meaning. Parallel work starts after `P1.1`, uses isolated worktrees, and assigns every shared file to one owner.
