# SPIMARIMMO Official Product Workspace

**Owner:** Samney  
**Workspace version:** 2.0  
**Reconciled on:** 31 July 2026  
**Current state:** official kickoff established; product definition gate active; House of Yellow parity deployment pending

## 1. Purpose

This workspace is the clean control layer for the SPIMARIMMO project. It does not erase the earlier work. It separates authoritative inputs, approved decisions, useful explorations, implementation references, and historical material so the product can continue from one trustworthy source of truth.

The product mission is:

> Transform SPIMARIMMO into an exhibitor-first B2B commercial and credibility platform that proves the value of its international property exhibitions, qualifies commercial opportunities, and supports a separate visitor discovery and registration journey.

The controlling commercial question remains:

> Why should a Moroccan property developer invest several tens of thousands of dirhams to exhibit with SPIMARIMMO?

## 2. Read these files first

1. `00-START-HERE.md` — orientation, state, and reading order.
2. `00-Project-Control/01-SOURCE-HIERARCHY.md` — which source controls which decision.
3. `00-Project-Control/02-WORKSPACE-AUDIT.md` — what exists, what is duplicated, and what is missing.
4. `00-Project-Control/03-DECISION-AND-CONFLICT-REGISTER.md` — approved, superseded, provisional, and open decisions.
5. `00-Project-Control/04-DELIVERABLES-REGISTER.md` — every important artifact and its status.
6. `00-Project-Control/05-EXECUTION-ROADMAP.md` — active tracks, gates, and next work.

## 3. Current truth in one view

| Area | Current status | Meaning |
|---|---|---|
| CTO strategic specification | `AUTHORITATIVE` | Controls the product problem, audience hierarchy, conversion narrative, evidence rule, homepage intent, and delivery constraints |
| Workspace/source audit | `COMPLETED` | Existing Library material, packages, duplicates, and visual waves have been inventoried and reconciled |
| Product foundation and IA | `DRAFT_READY_FOR_GATE` | Strong Phase 1 package exists; it still requires reconciliation of locales, domains, CMS, and release boundary |
| PRD | `NOT_STARTED` | Begins only after the product-foundation gate is approved |
| Sitemap and template inventory | `PARTIAL_PROPOSALS_EXIST` | Earlier sitemaps are useful inputs, not the final page contract |
| UX flows and wireframes | `PARTIAL_EXPLORATION_ONLY` | Earlier flows and generated screens cannot replace deterministic wireframes |
| Visual exploration | `PRODUCED_NOT_APPROVED` | Forty-four images exist across inconsistent waves; latest masters are references, not source design |
| House of Yellow foundation | `PARITY_VALIDATION_PENDING` | Selected visual, motion, interaction, and implementation-quality foundation; staging evidence is still required |
| CMS/CRM | `SPECIFIED_AT_POC_LEVEL` | Functional POC plan exists; production CMS choice and operational integrations remain open |
| SPIMAR implementation | `NOT_AUTHORIZED_TO_START` | Product structure and foundation parity must pass their gates first |

## 4. Two coordinated work tracks

### Track A — SPIMAR product definition

Source audit -> product foundation/IA -> PRD -> sitemap -> UX journeys -> deterministic wireframes -> identity adaptation -> design system -> high-fidelity UI -> engineering handoff.

### Track B — House of Yellow reference foundation

Freeze current clone -> deploy private staging -> capture reference evidence -> audit discrepancies -> converge parity -> extract reusable tokens/components/motion -> approve foundation.

The tracks may run in parallel, but they meet at one gate:

> House of Yellow foundation accepted + SPIMAR UX structure approved -> SPIMAR visual-system adaptation.

SPIMAR content must not be mixed into the clone while parity is still being measured.

## 5. Canonical directory

```text
SPIMARIMMO-Official-Project/
  00-START-HERE.md
  00-Project-Control/
  01-Source-and-Governance/
  02-Product-Foundation-and-IA/
  03-PRD-and-Requirements/
  04-Sitemap-and-Content-Model/
  05-UX-Flows-and-Wireframes/
  06-Visual-Identity/
  07-Design-System/
  08-High-Fidelity-UI/
  09-Prototype-Motion-and-Mockups/
  10-Technical-Architecture-and-Handoff/
  11-Implementation-and-QA/
  12-Launch-and-Optimization/
  90-House-of-Yellow-Reference-Foundation/
  99-Archive-and-Explorations/
```

## 6. Immediate active gate

The next official product step is not another visual screen. It is the Product Foundation Gate:

1. confirm the launch/release boundary;
2. reconcile FR/EN/AR platform support with the first content-release sequence;
3. confirm parent-domain and localized-subdomain responsibility;
4. define what “reserve a stand” means operationally;
5. confirm the visitor pre-registration depth;
6. keep production CMS selection open while permitting a bounded Supabase CMS/CRM POC;
7. confirm pricing visibility and site-search scope.

Once this gate passes, Phase 02 produces the complete PRD.

## 7. External dependency

The House of Yellow implementation repository is not part of the document packages reviewed here. When the private staging version is ready, register:

- staging URL;
- repository location;
- branch and commit;
- deployment date;
- protected/authenticated routes;
- environment limitations;
- parity audit evidence path.

Until then, the clone remains a pending dependency, not an accepted foundation.
