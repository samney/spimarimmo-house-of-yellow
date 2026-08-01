# SPIMARIMMO Deliverables Register

**Status:** active  
**Legend:** `AUTHORITATIVE`, `APPROVED`, `DRAFT`, `REFERENCE`, `SUPERSEDED`, `MISSING`, `BLOCKED`

## 1. Product-control deliverables

| Deliverable | Current artifact | Status | Next action |
|---|---|---|---|
| Workspace entry point | `00-START-HERE.md` | `APPROVED_CONTROL` | Keep current after every phase gate |
| Source hierarchy | `01-SOURCE-HIERARCHY.md` | `APPROVED_CONTROL` | Record later explicit owner/CTO overrides |
| Workspace audit | `02-WORKSPACE-AUDIT.md` | `COMPLETED` | Update when repository/staging is attached |
| Decision/conflict register | `03-DECISION-AND-CONFLICT-REGISTER.md` | `ACTIVE` | Close Product Foundation Gate decisions |
| Deliverables register | This file | `ACTIVE` | Update status and canonical path continuously |
| Execution roadmap | `05-EXECUTION-ROADMAP.md` | `ACTIVE` | Advance only when exit gates pass |

## 2. Strategy and product definition

| Deliverable | Existing foundation | Status | Canonical treatment |
|---|---|---|---|
| CTO strategic source | 20-page PDF | `AUTHORITATIVE` | Store under Source and Governance |
| Source audit | Phase 00 audit | `COMPLETED` | Retain and cross-link to this wider workspace audit |
| Product vision/scope | Phase 01 foundation | `DRAFT_READY_FOR_GATE` | Reconcile domains, locales, CMS, and release boundary |
| Audience/JTBD model | Phase 01 + official strategy docs | `DRAFT_READY_FOR_GATE` | Validate with commercial/marketing/operations interviews |
| Information architecture | Phase 01 object model + earlier IA | `DRAFT_READY_FOR_GATE` | Freeze after Gate 1 |
| PRD | None | `MISSING_NEXT` | Produce Phase 02 after Gate 1 |
| Requirement traceability | Partial across source audit/plans | `PARTIAL` | Make complete inside PRD |

## 3. Site and UX deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Sitemap | Earlier global/local proposals | `REFERENCE` | Produce canonical route/page/template inventory in Phase 03 |
| Content model | 17 conceptual objects + older CMS entities | `DRAFT` | Convert to logical schema and ownership rules |
| User journeys | Earlier exhibitor/visitor journey docs | `REFERENCE_STRONG` | Revalidate against PRD and operational process |
| Conversion funnel | Source + earlier strategy | `DRAFT_STRONG` | Add exact lead states, owners, and measurement contract |
| Low-/mid-fidelity wireframes | Old partial wireframes and generated compositions | `SUPERSEDED_REFERENCE` | Build deterministic full-site wireframes after sitemap approval |
| Responsive/RTL wireframes | Generated mobile/Arabic masters | `REFERENCE_ONLY` | Create real responsive and RTL states in Phase 05 |

## 4. Visual deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Visual explorations | 44 PNG files | `PRODUCED_NOT_APPROVED` | Archive by iteration and annotate keep/reject lessons |
| Complete desktop/mobile masters | Part 10/11 images/specs | `STRONG_REFERENCE_NOT_APPROVED` | Use for content coverage, not component measurements |
| Arabic/RTL master | Part 12 specification in latest package | `REFERENCE_NOT_VALIDATED` | Rebuild after locale/content and design-system decisions |
| House of Yellow parity baseline | External implementation | `BLOCKED_DEPLOYMENT_EVIDENCE` | Register staging URL/commit and run parity audit |
| SPIMAR visual identity adaptation | None approved | `MISSING` | Begin after wireframe and foundation gates |
| Design system | No deterministic approved system | `MISSING` | Extract neutral foundation, then adapt SPIMAR tokens/components |
| High-fidelity full-site UI | Generated references only | `MISSING` | Produce after identity/design-system approval |
| Prototype/motion/mockups | House of Yellow motion intent + static screens | `MISSING` | Produce from approved UI/system |

## 5. Technical and delivery deliverables

| Deliverable | Existing foundation | Status | Next action |
|---|---|---|---|
| Digital-platform audit | SPIMAR/Clarkom audit | `SUPPORTING_STRONG` | Revalidate current stack before migration decision |
| Technical architecture | Earlier Next.js multi-tenant proposal | `PROPOSED` | Convert to ADRs after PRD and CMS audit |
| CMS model | Earlier entities + Supabase POC plan | `PROPOSED_POC` | Build bounded POC; keep production CMS reversible |
| CRM model | Detailed POC lifecycle plan | `PROPOSED_POC` | Validate commercial stages, owners, consent, and SLA |
| Claude Code workflow | Master prompt + bootstrap | `READY_FOR_REPOSITORY_CHECK` | Verify inside actual repository, do not reinstall blindly |
| Implementation repository | External/not reviewed here | `PENDING_INPUT` | Add repo path, branch, commit, and deployment record |
| QA and acceptance | Plans and gates exist | `PARTIAL` | Attach executable route/state/test matrices to repository |
| Launch/monitoring | Planning only | `MISSING_LATER` | Define after release candidate exists |

## 6. Archive policy

- Never delete rejected or superseded work solely because it is not current.
- Move it to `99-Archive-and-Explorations` with its original name and status.
- Keep ZIP exports as immutable snapshots.
- Prefer canonical individual files for active work.
- Do not maintain two active copies of the same master document.
