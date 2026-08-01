---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: phase-1-source-identity
depends_on:
  - ../../claude-code/DECISIONS.md
supersedes: []
replaced_by: null
---

# Phase 1 Source Manifest

Hashes are SHA-256 values measured at accepted baseline `main@e048fdde7bdf52992ff258870147bf70c64295e9`.

| Source                                          | Repository path                                                                                        | SHA-256                                                            | Role                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------ |
| Original strategic/UX/content specification PDF | `official-specifications/01-Source-and-Governance/SPIMARIMMO_Specifications_Strategie_UX_Contenus.pdf` | `f22d61670a0cd1e589cd11b57757b278d0ffb4cb80b7882fc3659df8ae9ab978` | Approved strategy/content source                 |
| High-end redesigned specification PDF           | `archive/document-redesign/SPIMARIMMO_Specifications_Strategie_UX_Contenus_Redesign.pdf`               | `3c9b05460838cfebb74b3f1d032bb7f2db6d92ed7dba5cea952a1f57ef516bd9` | Presentation/editorial rendering of the strategy |
| Editable redesigned presentation                | `archive/document-redesign/SPIMARIMMO_Specifications_Strategie_UX_Contenus_Redesign.pptx`              | `82f3c646b5e2998d956554f4104630d35092828b18decaf07a1de704e801a54e` | Editable source for the redesigned document      |
| Product requirements document                   | `official-specifications/03-PRD-and-Requirements/01-SPIMARIMMO-PRODUCT-REQUIREMENTS-DOCUMENT.md`       | `44f3ccaea4fa090cad1f9eec2f062079c588dd26743be25e8a7995153662ae68` | Product behavior and acceptance                  |
| Canonical 50-surface route inventory            | `official-specifications/04-Sitemap-and-Content-Model/02-ROUTE-AND-PAGE-INVENTORY.md`                  | `aaaa4fafbe71c0e51f3d40fb355e3f2a77c1b2ce418226ac758c61d49c2c259e` | Route authority                                  |
| Canonical 17-template/state matrix              | `official-specifications/04-Sitemap-and-Content-Model/03-TEMPLATE-AND-STATE-MATRIX.md`                 | `a84eecb2f889bf788eca8629ded5670e3fe633dfef73c448bdcce7d19af8a13d` | Template and deterministic-state authority       |
| Wireframe traceability                          | `official-specifications/05-UX-Flows-and-Wireframes/09-WIREFRAME-TRACEABILITY-MATRIX.md`               | `bd5180f779a06075c91867fb0bf2797030821dffc97d68fd283c6bffb0d9df6e` | 48 UX targets and 144-state trace                |
| Selected identity foundation                    | `official-specifications/06-Visual-Identity/04-PROVISIONAL-VISUAL-FOUNDATIONS.md`                      | `36304a6206c44e439c0338174524df7751d71ad8332c7bca4364f25aa3457c2f` | `IDT-01A`, black/gold identity                   |
| Design-system coverage                          | `official-specifications/07-Design-System/08-DESIGN-SYSTEM-COVERAGE-AND-TRACEABILITY.md`               | `913301ade9b04e973e022874ac2756791b05ad72bbde6c988264d6fb04057793` | Component/design coverage                        |
| HIF screen/state register                       | `official-specifications/08-High-Fidelity-UI/02-HIGH-FIDELITY-SCREEN-AND-STATE-REGISTER.md`            | `474ec493a0d130a7a539d0a7e2b05a9305555442b6263d5fa60d86ee22dbc7e3` | `HIF-001` through `HIF-048`                      |
| Machine-readable implementation contract        | `official-specifications/10-Technical-Architecture-and-Handoff/12-IMPLEMENTATION-CONTRACT.yaml`        | `4bf9099449065c77cede7cf7fb901365e8184a5c64690507d92ec23e18800aef` | Technical contract                               |
| Accepted foundation closure                     | `parity-history/08-ENG-015-ACCELERATED-FOUNDATION-CLOSURE.md`                                          | `34fa273233e4ca5a6a5a889dc011079d2cdb8f6af2b8ca7c401bd418b18e11b7` | Transformation baseline limitations              |

The transient `SPIMAR-Transformation-Phase-1.zip` used to transfer the initial 22-file package had SHA-256 `ad04e47a63582135ab795f8b4292ce0b420f8727d3ef8b8a710e775a28f538aa`. It is provenance only. The normalized repository Markdown is authoritative.

The live House of Yellow website is an informational craft reference. Reproducible implementation decisions use the frozen baseline, repository evidence, and approved SPIMAR contracts - not mutable live-site content.
