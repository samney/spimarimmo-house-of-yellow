# SPIMARIMMO Source Hierarchy

**Status:** active  
**Purpose:** prevent documents from silently overriding one another

## 1. Authority by responsibility

| Responsibility | Controlling source | Authority |
|---|---|---|
| Business objective and commercial question | CTO `SPIMARIMMO_Specifications_Strategie_UX_Contenus.pdf` | `AUTHORITATIVE` |
| Audience hierarchy and dual exhibitor/visitor model | CTO PDF plus explicit approved decisions | `AUTHORITATIVE` |
| Evidence, claim, and unknown-data rules | CTO PDF | `AUTHORITATIVE` |
| Product operating model, phase gates, and deliverable sequence | Reconciled 13-phase Master Product Production Plan plus this control layer | `CONTROLLING_PROCESS` |
| Product objects, taxonomy, governance, and IA foundation | Phase 01 Product Foundation and IA, after Gate 1 decisions | `DRAFT_CONTROLLING_AFTER_APPROVAL` |
| SPIMAR business research and platform audit | SPIMAR/Clarkom audit and current verified technical evidence | `SUPPORTING_EVIDENCE` |
| House of Yellow visual/behavioral fidelity | Freshly captured public reference evidence and deployed clone comparison | `CONTROLLING_FOR_REFERENCE_PARITY` |
| House of Yellow reconstruction scope and QA | House of Yellow master prompt and parity-recovery plan | `CONTROLLING_FOR_REFERENCE_TRACK` |
| SPIMAR visual adaptation | Approved SPIMAR IA and design decisions applied through the accepted House of Yellow foundation | `FUTURE_CONTROLLING_OUTPUT` |
| Current implementation state | Repository, deployed build, executed tests, and captured evidence | `RUNTIME_TRUTH` |
| Earlier generated screens | Visual exploration archive | `REFERENCE_ONLY` |
| Earlier pre-reset queues, wireframes, and decisions | Historical archive | `HISTORY_ONLY` |

## 2. Precedence rule

When two sources disagree:

1. identify whether the conflict concerns product logic, business fact, visual fidelity, implementation state, or process;
2. use the controlling source for that responsibility;
3. preserve the weaker source as evidence;
4. record the decision in the conflict register;
5. never silently choose the easier interpretation.

## 3. Canonical input classes

### Class A — authoritative source

- CTO strategic/UX/content PDF.
- Explicit later decisions from the owner or CTO that clearly supersede a source clause.
- Verified repository/deployment evidence for implementation facts.

### Class B — approved project decision

- Exhibitor-first parent experience.
- Separate visitor experience.
- Event cards near the top of the homepage.
- Evidence before claims.
- Authentic event media for documentary proof.
- House of Yellow as the visual, motion, interaction, and implementation-quality foundation.
- Earlier generated screens remain references, not deterministic UI.

### Class C — proposed production definition

- Phase 01 content objects and taxonomies.
- Expanded event lifecycle.
- CMS/CRM POC architecture.
- Multi-tenant host resolver.
- Detailed route family.
- Analytics taxonomy and editorial workflows.

These become controlling only after their approval gate.

### Class D — reference or exploration

- The 44 generated SPIMAR UI/UX images.
- WellExpo, Cityscape, and other benchmark patterns.
- The redesigned PDF/PPTX.
- Early mobile-first and dark-direction studies.

### Class E — archive

- Superseded execution queues.
- Earlier visitor-first or generic real-estate direction.
- Duplicate ZIP packages and exported packages.
- Rejected directions and unsupported claims.

## 4. Important source corrections

1. The older official package states that WellExpo is the main visual reference. This is superseded: House of Yellow now controls the implementation-quality foundation; WellExpo remains a secondary event-composition reference.
2. The earlier generated full-site screens are not the final design system. They remain evidence of content hierarchy, useful modules, and preferred mood.
3. The source-only Phase 01 recommendation of “French first” does not erase the earlier approved FR/EN/AR architecture. Platform locale support and launch content sequence are separate decisions.
4. The Supabase CMS/CRM POC does not automatically decide the production editorial CMS. A repository adapter keeps the production CMS decision reversible.
5. A deployed clone does not become accepted merely because it builds successfully. Route, state, viewport, motion, accessibility, and visual-regression evidence are required.

## 5. Naming rule

Use `SPIMARIMMO` as the public product name in official documents and UI until the owner approves a shorter public form. `SPIMAR` may be used informally for the project/workspace.
