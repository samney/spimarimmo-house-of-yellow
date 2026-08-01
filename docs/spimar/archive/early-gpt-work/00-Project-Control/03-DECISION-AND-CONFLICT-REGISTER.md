# SPIMARIMMO Decision and Conflict Register

**Status:** active  
**Rule:** approved decisions control; provisional decisions require a gate; superseded decisions remain traceable

## 1. Approved decisions

| ID | Decision | Status | Consequence |
|---|---|---|---|
| DEC-001 | The CTO PDF is the initial product authority | `APPROVED` | Conflicting exploratory work cannot override its B2B logic |
| DEC-002 | The parent experience is exhibitor-first | `APPROVED` | Value, proof, ROI, and exhibitor action dominate the homepage |
| DEC-003 | Exhibitor and visitor journeys remain separate | `APPROVED` | Separate content, forms, CTA logic, and analytics |
| DEC-004 | Country/city event cards appear near the top | `APPROVED` | They must be within the first three major homepage chapters |
| DEC-005 | No public metric, outcome, quote, logo, or date is invented | `APPROVED` | Unverified content stays hidden or explicitly draft-only |
| DEC-006 | Real event proof uses authorized real media | `APPROVED` | Generated imagery cannot masquerade as documentary evidence |
| DEC-007 | Mobile is a complete intentional composition | `APPROVED` | Mobile/desktop/RTL require dedicated states and QA |
| DEC-008 | House of Yellow is the visual, motion, interaction, and implementation-quality foundation | `APPROVED_DIRECTION` | Parity must be measured before SPIMAR adaptation |
| DEC-009 | House of Yellow content and brand do not ship in SPIMAR | `APPROVED` | The foundation is extracted and adapted, not reskinned |
| DEC-010 | Earlier generated screens are reference material only | `APPROVED` | Deterministic wireframes and design system still required |
| DEC-011 | The original workspace is preserved | `APPROVED` | Reorganization is additive/non-destructive; history remains recoverable |

## 2. Reconciled conflicts

| Conflict | Resolution | State |
|---|---|---|
| WellExpo vs House of Yellow | House of Yellow controls implementation craft and parity. WellExpo remains a secondary composition reference. Cityscape remains a commercial-conversion benchmark. | `RESOLVED` |
| Generated screen vs implementation source | Generated screens may inform hierarchy and art direction but cannot define exact components, states, motion, or responsive rules. | `RESOLVED` |
| Product pipeline vs early CMS/CRM POC | Run two bounded tracks. Product PRD/UX remains gated; CMS/CRM POC may validate architecture without fixing the final production CMS or public SPIMAR UI. | `RESOLVED` |
| Homepage proof bar vs event-card priority | Hero -> country/city event opportunities -> verified proof/value sequence. A small trust signal may exist above the fold, but full event cards stay within the first three chapters. | `RESOLVED` |
| “Reserve a stand” as transaction vs lead | Until inventory, pricing, contract, and payment mechanics are approved, it means a qualified commercial request. | `PROVISIONAL_DEFAULT` |
| WordPress reuse vs Supabase CMS | Supabase may power a bounded structured POC. Production CMS remains an ADR after the current WordPress/WPGraphQL audit. Public components use repository interfaces. | `RESOLVED_AS_REVERSIBLE` |

## 3. Superseded decisions

| Earlier decision/direction | New state | Reason |
|---|---|---|
| Visitor-first global homepage | `SUPERSEDED` | Conflicts with CTO B2B commercial objective |
| WellExpo as the primary implementation template | `SUPERSEDED` | House of Yellow is the selected foundation |
| Turquoise/dark architectural concept as production direction | `REJECTED_HISTORY` | Founder rejected the direction and implementation consistency |
| Existing flat `/SPIMAR` folder as active source of truth | `SUPERSEDED` | No authority or phase separation |
| Old execution queues as current | `SUPERSEDED` | Replaced by the reconciled two-track roadmap |
| Immediate high-fidelity generation before UX approval | `SUPERSEDED` | Structure and deterministic wireframes must precede final UI |

## 4. Open decisions for the Product Foundation Gate

| ID | Decision needed | Recommended position | Owner |
|---|---|---|---|
| OPEN-001 | Launch product boundary | Marketing + exhibitor lead generation + visitor pre-registration; no payment/private portal for first release | Samney + CTO |
| OPEN-002 | Locale architecture and release sequence | Keep FR/EN/AR + true RTL in the platform; decide which locales contain production-complete content at first release | Samney + content/CTO |
| OPEN-003 | Parent domain and localized subdomains | One host-aware application; parent is global B2B, approved subdomains are localized event products | CTO/engineering |
| OPEN-004 | Visitor registration depth | Short consent-based registration first; QR/ticketing/appointments later unless required | Operations + marketing |
| OPEN-005 | Event lifecycle | Approve draft, announced/undated, sales open, registration open, upcoming, live, completed/recap, postponed, cancelled, archived | Operations + CTO |
| OPEN-006 | Production CMS | Audit existing WordPress/WPGraphQL; compare retain/replace against structured requirements | CTO + content owner |
| OPEN-007 | CRM destination and lead SLA | Define owner, queue, stages, deduplication, response SLA, and provider integrations | Commercial + marketing |
| OPEN-008 | Offer/pricing visibility | Support consultation-only and public modes; publish nothing until approved | Commercial + finance/legal |
| OPEN-009 | Site search | Defer until final content volume and migration demonstrate need | Product/SEO |
| OPEN-010 | Public brand naming | Use SPIMARIMMO consistently until approved otherwise | Brand owner |

## 5. House of Yellow Foundation Gate

The foundation is accepted only when the following are registered and passed:

- private staging URL;
- frozen branch and commit;
- current public-reference capture date;
- route inventory;
- desktop/tablet/mobile state coverage;
- typography, spacing, geometry, media, motion, and responsive discrepancy register;
- visual-regression evidence;
- accessibility and reduced-motion review;
- console/network/build health;
- explicit known differences.

Deployment alone does not close this gate.

## 6. Decision protocol

Every new decision must include:

- ID and date;
- context and source;
- options considered;
- decision and owner;
- status;
- affected documents/screens/code;
- consequences and follow-up.
