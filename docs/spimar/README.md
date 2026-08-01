---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: spimar-documentation-entry
depends_on:
  - ../claude-code/DECISIONS.md
supersedes:
  - SPIMAR_HOY_PARITY_RECOVERY_CMS_CRM_MASTER_PLAN.md
replaced_by: null
---

# SPIMARIMMO Documentation

## Start here

1. Read [`governance/DOCUMENT-CONTROL.md`](governance/DOCUMENT-CONTROL.md).
2. Read [`governance/SOURCE-MANIFEST.md`](governance/SOURCE-MANIFEST.md).
3. Read [`transformation-phase-1/00-START-HERE.md`](transformation-phase-1/00-START-HERE.md) and the numbered package in order.
4. Use [`governance/DELIVERY-MAP.md`](governance/DELIVERY-MAP.md) as the only Stage-to-queue-to-work-package dependency map.
5. Use `docs/claude-code/QUEUE.md` and `STATUS.md` for the current runtime checkpoint.

## Canonical layers

| Layer                          | Location                   | Purpose                                                                                        |
| ------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------- |
| Active implementation contract | `transformation-phase-1/`  | SPIMAR public website, shared design system, CMS, CRM, content/media, delivery, QA, and launch |
| Governance                     | `governance/`              | Sources, lifecycle, terminology, dependencies, acceptance levels, and PDF traceability         |
| Approved source contracts      | `official-specifications/` | Frozen product/UX/identity/design/HIF/architecture requirements                                |
| Foundation handoff             | `parity-history/`          | Accepted House of Yellow baseline and disclosed limitations                                    |
| Supporting evidence            | `supporting-audits/`       | Research that informs but does not override approved contracts                                 |
| Archive                        | `archive/`                 | Historical material that cannot control current implementation                                 |

The earlier parity-first master plan is preserved once under `archive/early-gpt-work/90-House-of-Yellow-Reference-Foundation/`. Its duplicate active-root copy is removed because `D-015` superseded its execution order.
