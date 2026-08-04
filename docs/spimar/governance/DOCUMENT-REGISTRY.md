---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: documentation-folder-lifecycle
depends_on:
  - DOCUMENT-CONTROL.md
supersedes: []
replaced_by: null
---

# Document Registry

| Path                                   | Status                   | Canonical responsibility                                                            | Mutation rule                                      |
| -------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| `docs/spimar/transformation-phase-1/`  | `ACTIVE`                 | Current end-to-end transformation contract                                          | Decision-backed changes only                       |
| `docs/spimar/governance/`              | `ACTIVE`                 | Documentation lifecycle, source traceability, dependencies, terminology, acceptance | Keep synchronized with active contract             |
| `docs/claude-code/`                    | `ACTIVE_DYNAMIC`         | Current execution and evidence state                                                | Update affected files only                         |
| `docs/spimar-phase-1/`                 | `FROZEN_EVIDENCE`        | Phase 1 execution freeze records (`TRF-000` foundation baseline)                    | Append correction; never rewrite a frozen baseline |
| `docs/spimar/official-specifications/` | `FROZEN_APPROVED_SOURCE` | Product, UX, identity, HIF, and technical contracts                                 | Reopen the smallest affected contract by decision  |
| `docs/spimar/parity-history/`          | `FROZEN_EVIDENCE`        | House of Yellow foundation history and limitations                                  | Append correction; never rewrite accepted evidence |
| `docs/spimar/supporting-audits/`       | `SUPPORTING`             | Business and UX research                                                            | Does not override active contracts                 |
| `docs/spimar/archive/`                 | `ARCHIVED`               | Superseded/rejected/provenance material                                             | Immutable and non-executable                       |
| `docs/audit/`                          | `FROZEN_REFERENCE`       | Reference-site audit; target of future accessibility audit records                  | Informational after `ENG-015`                      |
| `docs/assets-UX-UI/`                   | `ACTIVE_RESOURCE`        | Approved SPIMAR section designs and owner-supplied media assets                     | Owner adds; sections consume                       |
| `docs/backend/`                        | `ACTIVE`                 | Ported backend inventory and canonical corrections (`D-021`)                        | Update with backend changes                        |
| `docs/archive/phase-1/`                | `ARCHIVED`               | Past-phase plans and evidence (agency 360 specs, foundation freeze, migration, implementation, design-system, master prompt) | Immutable; superseded by the active phase          |

Known duplicate resolved by this normalization: the active-root copy of `SPIMAR_HOY_PARITY_RECOVERY_CMS_CRM_MASTER_PLAN.md` was byte-identical to its archived copy and is removed from the active root.

Owner cleanup (2026-08-04): deprecated distribution artifacts were deleted (`0001-*.patch`, `SPIMAR-Transformation-Phase-1-v1.1.zip`, `docs/codex-implimentation/`, `docs/refrence UIUX/`, superseded agency mockup PNGs), and past-phase working folders moved under `docs/archive/phase-1/` — `spimar-phase-1/` → `foundation/`, `migration/`, `implementation/`, `design-system/`, `360 agenyc docs work` (Markdown only) → `agency-360/`. Historical references to the old paths in frozen control documents remain valid as provenance; the files live at the archived paths. Deleted material stays recoverable from Git history.
