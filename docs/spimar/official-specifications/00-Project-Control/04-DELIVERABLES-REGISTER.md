# SPIMARIMMO Deliverables Register

> **2026-08-01 execution checkpoint:** historical access-blocked and ENG intake states in this register are superseded for live execution by `docs/claude-code/STATUS.md`, `QUEUE.md`, and `docs/migration/MIGRATION-COVERAGE.md`. The approved product, design and architecture statuses remain controlling.

**Status:** active  
**Legend:** `AUTHORITATIVE`, `APPROVED`, `DRAFT`, `REFERENCE`, `SUPERSEDED`, `MISSING`, `BLOCKED`

## 1. Product-control deliverables

| Deliverable | Current artifact | Status | Next action |
|---|---|---|---|
| Workspace entry point | `00-START-HERE.md` | `APPROVED_CONTROL` | Keep current after every phase gate |
| Source hierarchy | `01-SOURCE-HIERARCHY.md` | `APPROVED_CONTROL` | Record later explicit owner/CTO overrides |
| Workspace audit | `02-WORKSPACE-AUDIT.md` | `COMPLETED` | Update when repository/staging is attached |
| Decision/conflict register | `03-DECISION-AND-CONFLICT-REGISTER.md` | `ACTIVE` | Gate 10 approval and Phase 11 access blocker recorded |
| Deliverables register | This file | `ACTIVE` | Update status and canonical path continuously |
| Execution roadmap | `05-EXECUTION-ROADMAP.md` | `ACTIVE` | Advance only when exit gates pass |

## 2. Strategy and product definition

| Deliverable | Existing foundation | Status | Canonical treatment |
|---|---|---|---|
| CTO strategic source | 20-page PDF | `AUTHORITATIVE` | Store under Source and Governance |
| Source audit | Phase 00 audit | `COMPLETED` | Retain and cross-link to this wider workspace audit |
| Product vision/scope | Phase 01 foundation | `APPROVED_WORKING_BASELINE` | Validate owned operational facts without reopening the release boundary silently |
| Audience/JTBD model | Phase 01 + official strategy docs | `APPROVED_WORKING_BASELINE` | Validate language and evidence with commercial/marketing/operations interviews |
| Information architecture | Phase 01 object model + earlier IA | `APPROVED_FOR_PRD` | Convert route/page surface in Phase 03 |
| PRD | `03-PRD-and-Requirements/01-SPIMARIMMO-PRODUCT-REQUIREMENTS-DOCUMENT.md` | `APPROVED_AT_GATE_2` | Controls all downstream product behavior |
| Requirement traceability | `03-PRD-and-Requirements/02-REQUIREMENTS-TRACEABILITY-MATRIX.md` | `APPROVED_AT_GATE_2` | Extend with wireframe, component, backlog, and test evidence in later phases |
| Phase 02 gate | `03-PRD-and-Requirements/03-GATE-2-REVIEW.md` | `APPROVED` | No action unless a material PRD change is requested |

## 3. Site and UX deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Canonical sitemap/navigation | `04-Sitemap-and-Content-Model/01-CANONICAL-SITEMAP-AND-NAVIGATION.md` | `APPROVED_AT_GATE_3` | Controls downstream UX navigation and route ownership |
| Route/page inventory | `04-Sitemap-and-Content-Model/02-ROUTE-AND-PAGE-INVENTORY.md` | `APPROVED_AT_GATE_3` | Controls the full-site route and wireframe scope |
| Template/state matrix | `04-Sitemap-and-Content-Model/03-TEMPLATE-AND-STATE-MATRIX.md` | `APPROVED_AT_GATE_3` | Controls journey and frame state coverage |
| Content/migration/search decision | `04-Sitemap-and-Content-Model/04-CONTENT-INVENTORY-MIGRATION-AND-SEARCH-DECISION.md` | `STRUCTURE_READY_INPUTS_BLOCKED` | Collect real content inventory, legacy crawl, DNS/WP export, and representative fixtures |
| Phase 03 gate | `04-Sitemap-and-Content-Model/05-PHASE-03-TRACEABILITY-AND-GATE-3-REVIEW.md` | `APPROVED` | No action unless a material sitemap/route change is requested |
| Content model | Phase 01/02 object model + Phase 03 content-to-surface inventory | `APPROVED_STRUCTURE / REAL_CONTENT_PENDING` | Convert to logical schema after content/WordPress audit |
| UX strategy/decision model | `05-UX-Flows-and-Wireframes/01-UX-STRATEGY-AND-DECISION-MODEL.md` | `APPROVED_AT_GATE_4` | Controls downstream structure and actions |
| Public journeys | `05-UX-Flows-and-Wireframes/02-CRITICAL-PUBLIC-JOURNEYS.md` | `APPROVED_AT_GATE_4` | Six public paths control wireframe and future interaction behavior |
| Operational/editorial journeys | `05-UX-Flows-and-Wireframes/03-OPERATIONAL-AND-EDITORIAL-JOURNEYS.md` | `APPROVED_AT_GATE_4` | Provider-neutral capability/state contract controls wireframes |
| Navigation/conversion/measurement map | `05-UX-Flows-and-Wireframes/04-NAVIGATION-CONVERSION-AND-MEASUREMENT-MAP.md` | `APPROVED_AT_GATE_4` | Controls cross-route context, outcome, consent, and analytics behavior |
| Page-level UX/wireframe brief | `05-UX-Flows-and-Wireframes/05-PAGE-LEVEL-UX-PLAN-AND-WIREFRAME-BRIEF.md` | `APPROVED_AT_GATE_4` | Controlling production brief for 48 deterministic targets |
| Phase 04 gate | `05-UX-Flows-and-Wireframes/06-PHASE-04-TRACEABILITY-AND-GATE-4-REVIEW.md` | `APPROVED` | No action unless a material journey/scope change is requested |
| Phase 05 wireframe atlas | `05-UX-Flows-and-Wireframes/07-SPIMARIMMO-WIREFRAME-ATLAS.html` | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | Preserve 48 targets and 144 states; reopen affected targets for later P0/P1 findings |
| Phase 05 wireframe system | `05-UX-Flows-and-Wireframes/08-PHASE-05-WIREFRAME-SYSTEM.md` | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | Controls structural grammar, state precedence, responsive transformations, and annotations |
| Wireframe traceability | `05-UX-Flows-and-Wireframes/09-WIREFRAME-TRACEABILITY-MATRIX.md` | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | Extend later with component, high-fidelity, backlog, and test evidence |
| Moderated validation plan | `05-UX-Flows-and-Wireframes/10-MODERATED-WIREFRAME-VALIDATION-PLAN.md` | `READY_TO_RUN` | Recruit representative roles and run before user-validation claim/final high-fidelity approval |
| Phase 05 gate | `05-UX-Flows-and-Wireframes/11-PHASE-05-TRACEABILITY-AND-GATE-5-REVIEW.md` | `APPROVED_WITH_CONDITIONS` | Run moderated validation before user-validated/final high-fidelity approval |
| Earlier user journeys | Historical exhibitor/visitor journey docs | `SUPERSEDED_REFERENCE` | Retain for evidence; canonical Phase 04 journeys control |
| Conversion funnel | Phase 04 navigation/conversion/measurement map | `APPROVED_AT_GATE_4` | Preserve exact outcome and measurement semantics downstream |
| Low-/mid-fidelity wireframes | Phase 05 atlas and system | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | Preserve as the identity/design-system structural contract |
| Responsive/RTL wireframes | Phase 05 atlas target/forced compositions | `COMPLETE_FOR_STRUCTURAL_REVIEW` | Validate with target/mobile/Arabic participants before high-fidelity approval |

## 4. Visual deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Visual explorations | 44 PNG files | `PRODUCED_NOT_APPROVED` | Archive by iteration and annotate keep/reject lessons |
| Complete desktop/mobile masters | Part 10/11 images/specs | `STRONG_REFERENCE_NOT_APPROVED` | Use for content coverage, not component measurements |
| Arabic/RTL master | Part 12 specification in latest package | `REFERENCE_NOT_VALIDATED` | Rebuild after locale/content and design-system decisions |
| House of Yellow parity baseline | `90-House-of-Yellow-Reference-Foundation/00-DEPLOYMENT-AND-PARITY-REGISTER.md` | `REPO_IDENTIFIED_ACCESS_BLOCKED_PARITY_FAILED_P0` | Grant source access, freeze commit/build, then restore media/fallback, enforce staging noindex and run full parity audit |
| SPIMAR brand strategy | `06-Visual-Identity/01-BRAND-STRATEGY-AND-POSITIONING-TRANSLATION.md` | `APPROVED_AT_GATE_6` | Controls the Phase 07/08 brand behavior and invariants |
| SPIMAR visual asset audit | `06-Visual-Identity/02-VISUAL-ASSET-AUDIT-AND-CONSTRAINTS.md` | `COMPLETE_WITH_DIGITAL_PALETTE_CONFIRMED` | Supply vector logo, print/spot color masters, font constraints, and rights-cleared media |
| SPIMAR art-direction territories | `06-Visual-Identity/03-ART-DIRECTION-TERRITORIES.md` | `IDT-01A_SELECTED_AT_GATE_6` | Use Signal as master, Cities as editorial support, and Proof as evidence mode |
| SPIMAR visual foundations | `06-Visual-Identity/04-PROVISIONAL-VISUAL-FOUNDATIONS.md` | `SUPERSEDED_BY_PHASE_07_TOKENS` | Retain as Gate 6 rationale; Phase 07 token foundation now controls |
| Representative identity applications | `06-Visual-Identity/05-REPRESENTATIVE-APPLICATIONS-AND-RTL-CHECK.md` + review surface | `APPROVED_FOR_SYSTEM_PRODUCTION_AT_GATE_6` | Use as representative identity reference in Phase 08 |
| Phase 06 gate | `06-Visual-Identity/06-GATE-6-REVIEW.md` | `APPROVED_IDT_01A` | No action unless identity direction is materially reopened |
| Design-system overview | `07-Design-System/00-README.md` | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_7` | Controls Phase 08 and downstream implementation |
| Design tokens | `07-Design-System/01-DESIGN-TOKENS-FOUNDATION.md` | `COMPLETE_FOR_GATE_7_WITH_OWNED_INPUTS` | Approve semantic roles; retain source fonts/logo/print values as conditions |
| Type/grid/responsive/RTL | `07-Design-System/02-TYPOGRAPHY-GRID-RESPONSIVE-RTL.md` | `COMPLETE_FOR_GATE_7` | Validate production fonts and Arabic editorial fixtures later |
| Component contracts | `07-Design-System/03-COMPONENT-ARCHITECTURE-AND-CONTRACTS.md` | `COMPLETE_FOR_GATE_7` | Controls 58 component responsibilities and finite variants |
| State/accessibility matrix | `07-Design-System/04-COMPONENT-STATE-AND-ACCESSIBILITY-MATRIX.md` | `COMPLETE_FOR_GATE_7` | Run manual accessibility evidence during Phase 08/implementation |
| Motion/media/interaction | `07-Design-System/05-MOTION-MEDIA-AND-INTERACTION-SYSTEM.md` | `COMPLETE_FOR_GATE_7` | Keep timings independent until reference parity passes |
| Content resilience | `07-Design-System/06-CONTENT-DENSITY-AND-MISSING-CONTENT-RULES.md` | `COMPLETE_FOR_GATE_7_REAL_CONTENT_PENDING` | Replace fixtures with approved source content as it arrives |
| Implementation governance | `07-Design-System/07-IMPLEMENTATION-MAPPING-AND-GOVERNANCE.md` | `COMPLETE_FOR_GATE_7_REPO_MAPPING_PENDING` | Map into repository only after repository identity and downstream authorization |
| Design-system traceability | `07-Design-System/08-DESIGN-SYSTEM-COVERAGE-AND-TRACEABILITY.md` | `PASS_17_TEMPLATES_48_UXF_11_BRI` | Extend with high-fidelity and executable-test evidence |
| Phase 07 gate | `07-Design-System/09-GATE-7-REVIEW.md` | `APPROVED_WITH_CARRIED_CONDITIONS` | No action unless a Gate 7 reopening condition occurs |
| High-fidelity overview | `08-High-Fidelity-UI/00-README.md` | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_8` | Controls Phase 09/10 without authorizing clone adaptation |
| High-fidelity production system | `08-High-Fidelity-UI/01-HIGH-FIDELITY-PRODUCTION-SYSTEM.md` | `COMPLETE_FOR_GATE_8` | Controls visual grammar and page treatment |
| High-fidelity screen/state register | `08-High-Fidelity-UI/02-HIGH-FIDELITY-SCREEN-AND-STATE-REGISTER.md` | `PASS_48_HIF_144_STATES` | Preserve one-to-one `HIF`/`UXF` traceability |
| Content/media readiness | `08-High-Fidelity-UI/03-CONTENT-COPY-MEDIA-AND-ASSET-READINESS.md` | `COMPLETE_REAL_INPUTS_PENDING` | Replace fixtures and posters only with approved sources/assets |
| Responsive/RTL/accessibility/visual QA | `08-High-Fidelity-UI/04-RESPONSIVE-RTL-ACCESSIBILITY-AND-VISUAL-QA.md` | `DESIGN_CONTRACT_COMPLETE_EXECUTABLE_EVIDENCE_PENDING` | Use in prototype, implementation, and QA |
| Clone convergence map | `08-High-Fidelity-UI/05-CLONE-CONVERGENCE-AND-ADAPTATION-MAP.md` | `STRATEGY_LOCKED_REPO_MAPPING_BLOCKED` | Inspect actual repo after parity and produce source-path mapping |
| Phase 08 gate | `08-High-Fidelity-UI/06-PHASE-08-TRACEABILITY-AND-GATE-8-REVIEW.md` | `APPROVED_WITH_CARRIED_CONDITIONS` | No action unless a Gate 8 reopening condition occurs |
| High-fidelity atlas | `08-High-Fidelity-UI/07-SPIMARIMMO-HIGH-FIDELITY-ATLAS.html` | `PASS_48_HIF_144_STATES` | Review all targets/modes/states; fixtures are not final content |
| Phase 09 overview | `09-Prototype-Motion-and-Mockups/00-README.md` | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_9` | Controls Phase 10/11 behavior; retain moderated/runtime evidence conditions |
| Prototype scope/journeys | `09-Prototype-Motion-and-Mockups/01-PROTOTYPE-SCOPE-AND-JOURNEY-CONTRACT.md` | `PASS_6_PRT_CONTRACTS` | Preserve scope during Phase 10 mapping |
| Motion/interaction specification | `09-Prototype-Motion-and-Mockups/02-MOTION-AND-INTERACTION-SPECIFICATION.md` | `PASS_24_MOT_CONTRACTS` | Translate to component stories and executable tests in Phase 10/11 |
| Presentation mockups/script | `09-Prototype-Motion-and-Mockups/03-PRESENTATION-MOCKUP-AND-REVIEW-SCRIPT.md` | `PASS_12_SCENES` | Use for founder/CTO/commercial/content/engineering review |
| Prototype validation/QA | `09-Prototype-Motion-and-Mockups/04-PROTOTYPE-VALIDATION-AND-QA-PLAN.md` | `READY_TO_RUN_16_CRITICAL_CASES` | Execute design review and moderated sessions; retain honest evidence labels |
| Phase 09 gate | `09-Prototype-Motion-and-Mockups/05-PHASE-09-TRACEABILITY-AND-GATE-9-REVIEW.md` | `APPROVED_WITH_CARRIED_CONDITIONS` | No action unless a material interaction/motion finding reopens it |
| Critical-journey prototype | `09-Prototype-Motion-and-Mockups/06-SPIMARIMMO-CRITICAL-JOURNEY-PROTOTYPE.html` | `STRUCTURE_AND_SCRIPT_VALIDATED` | Review included journeys, scenarios and modes; fixtures are not production content |
| Phase 09 structural validation | `09-Prototype-Motion-and-Mockups/07-PHASE-09-STRUCTURAL-VALIDATION.md` | `PASS_WITH_RUNTIME_EVIDENCE_CARRIED` | Retain browser/device/AT/runtime checks for Phase 10/11 |

## 5. Technical and delivery deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Digital-platform audit | SPIMAR/Clarkom audit | `SUPPORTING_STRONG` | Revalidate current stack before migration decision |
| Phase 10 overview | `10-Technical-Architecture-and-Handoff/00-README.md` | `APPROVED_AT_GATE_10_WITH_ENTRY_CONDITIONS` | Controls the bounded Phase 11 intake and later implementation |
| Technical architecture and ADRs | `10-Technical-Architecture-and-Handoff/01-SYSTEM-ARCHITECTURE-AND-ADRS.md` | `COMPLETE_PROVIDER_AND_REPO_INPUTS_PENDING` | Controls target layers, hosts/locales, rendering/cache and 12 ADRs |
| Domain/data/state schema | `10-Technical-Architecture-and-Handoff/02-DOMAIN-DATA-AND-STATE-SCHEMAS.md` | `LOGICAL_SCHEMA_APPROVED_PHYSICAL_REPO_GATED` | Convert to physical migrations only after operational-store ADR |
| CMS/editorial architecture | `10-Technical-Architecture-and-Handoff/03-CMS-EDITORIAL-AND-CONTENT-DELIVERY-ARCHITECTURE.md` | `PROVIDER_NEUTRAL_CMS_ADR_PENDING` | Audit WordPress/WPGraphQL and record `ADR-004` retain/replace result |
| CRM/conversion/providers | `10-Technical-Architecture-and-Handoff/04-CONVERSION-CRM-AND-PROVIDER-INTEGRATION-ARCHITECTURE.md` | `NORMALIZED_CONTRACT_PROVIDER_INPUTS_PENDING` | Activate only after mapping, owner, SLA, privacy and provider gates |
| Quality/operations architecture | `10-Technical-Architecture-and-Handoff/05-SECURITY-PRIVACY-PERFORMANCE-AND-OPERATIONS.md` | `CONTROL_BASELINE_EXECUTABLE_EVIDENCE_PENDING` | Implement/test in Phase 11 and retain legal/RTO/RPO conditions |
| Clone convergence/migration | `10-Technical-Architecture-and-Handoff/06-CLONE-CONVERGENCE-REPOSITORY-AND-MIGRATION-PLAN.md` | `PLAN_APPROVED_INTAKE_ACCESS_BLOCKED` | Complete `M0` after GitHub access or an exact local checkout is available |
| Test/release plan | `10-Technical-Architecture-and-Handoff/07-TESTING-ACCEPTANCE-AND-RELEASE-PLAN.md` | `TEST_CONTRACT_COMPLETE` | Execute 25 `Q10` plus upstream test contracts in Phase 11 |
| Engineering queue | `10-Technical-Architecture-and-Handoff/08-ENGINEERING-BACKLOG-AND-EXECUTION-QUEUE.md` | `APPROVED_57_TASKS_STAGE_0_ACCESS_BLOCKED` | Execute only `ENG-001`–`004` after source access; later tasks remain gated |
| Claude Code workflow | `10-Technical-Architecture-and-Handoff/09-CLAUDE-CODE-MASTER-HANDOFF.md` | `STAGE_0_AUTHORIZED_ACCESS_BLOCKED` | Use Stage 0 first; do not authorize edits during intake |
| Phase 10 gate | `10-Technical-Architecture-and-Handoff/10-PHASE-10-TRACEABILITY-AND-GATE-10-REVIEW.md` | `APPROVED_WITH_IMPLEMENTATION_ENTRY_CONDITIONS` | Gate closed; retain parity/repository/provider conditions |
| Phase 10 validation/contract | `10-Technical-Architecture-and-Handoff/11-PHASE-10-STRUCTURAL-VALIDATION.md` + `12-IMPLEMENTATION-CONTRACT.yaml` | `PASS` | Keep synchronized with approved architecture changes |
| Phase 11 overview | `11-Implementation-and-QA/00-README.md` | `READ_ONLY_INTAKE_STARTED_ACCESS_BLOCKED` | Resolve repository access, then complete `ENG-001`–`004` |
| Phase 11 engineering intake | `11-Implementation-and-QA/01-ENGINEERING-INTAKE-STATUS.md` | `PARTIAL_INPUTS_REGISTERED_SOURCE_UNVERIFIED` | Freeze commit/build and produce the factual `M0` baseline |
| Implementation repository | `https://github.com/samney/spimarimmo-house-of-yellow` (`main`) | `IDENTIFIED_ACCESS_BLOCKED` | Grant the connected GitHub workflow access or supply an exact local checkout/archive |
| QA and acceptance | Plans and gates exist | `PARTIAL` | Attach executable route/state/test matrices to repository |
| Launch/monitoring | Planning only | `MISSING_LATER` | Define after release candidate exists |

## 6. Archive policy

- Never delete rejected or superseded work solely because it is not current.
- Move it to `99-Archive-and-Explorations` with its original name and status.
- Keep ZIP exports as immutable snapshots.
- Prefer canonical individual files for active work.
- Do not maintain two active copies of the same master document.
