# SPIMARIMMO Official Product Workspace

> **2026-08-01 execution checkpoint:** the detailed gate narrative below preserves the 31 July specification state. Current repository status is controlled by `docs/claude-code/STATUS.md`: repository access is resolved, P0 repair and ENG-014A/014B are merged, and the active order is MIG-000 → OPS-001 → ENG-014C.

**Owner:** Samney  
**Workspace version:** 3.0  
**Reconciled on:** 31 July 2026  
**Current state:** Gate 10 approved with implementation-entry conditions; Phase 11 read-only engineering intake started; the House of Yellow repository and `main` branch are registered, but source access, immutable commit/build identity, and P0 parity repair still block code changes

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
| Product foundation and IA | `APPROVED_WORKING_BASELINE` | Release boundary, locale/host architecture, CMS reversibility, conversion semantics, pricing, and search defaults now control the PRD |
| PRD | `APPROVED_AT_GATE_2` | The Release 1 behavior, quality, operations, acceptance, and traceability contract controls downstream work |
| Sitemap and template inventory | `APPROVED_AT_GATE_3` | Canonical hosts/locales, navigation, routes, templates, states, indexation, search, and migration assumptions control downstream UX |
| UX journeys and conversion planning | `APPROVED_AT_GATE_4` | Six public journeys, five operational blueprints, and context/conversion/measurement rules control the wireframes |
| Deterministic wireframes | `APPROVED_WITH_CONDITIONS_AT_GATE_5` | 48 stable targets and 144 states control identity work; moderated validation remains required |
| Visual exploration | `PRODUCED_NOT_APPROVED` | Forty-four images exist across inconsistent waves; latest masters are references, not source design |
| Visual identity | `APPROVED_AT_GATE_6` | `IDT-01A — Signal with Moroccan editorial depth` and the black/gold digital identity control downstream design |
| Design system | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_7` | Tokens, 58 component responsibilities, states, responsive/RTL/accessibility, motion/media, content resilience, implementation governance, and traceability control Phase 08 |
| High-fidelity full-site UI | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_8` | All 48 `HIF`/`UXF` targets and 144 state labels control the prototype and handoff layers |
| Prototype, motion and mockups | `APPROVED_WITH_CARRIED_CONDITIONS_AT_GATE_9` | Six prototype contracts, 24 motion contracts, 12 presentation scenes, 16 critical QA cases, and the reviewable prototype control Phase 10/11 behavior |
| Technical architecture and handoff | `APPROVED_AT_GATE_10_WITH_ENTRY_CONDITIONS` | Architecture, schemas, provider boundaries, convergence/migration, tests, 57-task queue, Claude Code handoff, and machine-readable contract control Phase 11 |
| House of Yellow foundation | `REPO_IDENTIFIED_ACCESS_BLOCKED_PARITY_FAILED_P0` | Repository URL, `main` branch, deployment and environment names are registered; source access, commit/build identity, missing media/fallback and staging indexing still block approval |
| CMS/CRM | `SPECIFIED_AT_POC_LEVEL` | Functional POC plan exists; production CMS choice and operational integrations remain open |
| SPIMAR implementation | `READ_ONLY_INTAKE_AUTHORIZED_CODE_CHANGES_BLOCKED` | `ENG-001`–`004` intake is authorized; clone changes wait for source access, immutable identity and the reference-foundation parity gate |

## 4. Two coordinated work tracks

### Track A — SPIMAR product definition

Source audit -> product foundation/IA -> PRD -> sitemap -> UX journeys -> deterministic wireframes -> identity adaptation -> design system -> high-fidelity UI -> engineering handoff.

### Track B — House of Yellow reference foundation

Freeze current clone -> deploy private staging -> capture reference evidence -> audit discrepancies -> converge parity -> extract reusable tokens/components/motion -> approve foundation.

The tracks may run in parallel, but they meet at one gate:

> House of Yellow foundation accepted + SPIMAR identity/design system approved -> neutral implementation mapping and SPIMAR adaptation.

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

Gate 10 is approved. The active step is Phase 11 Stage 0 read-only engineering intake:

1. grant the connected GitHub workflow access to `samney/spimarimmo-house-of-yellow`, or supply an exact local checkout/archive of `main`;
2. record the immutable `main` commit and the Vercel deployment/build identity;
3. inspect repository instructions, package manager, Next.js/tooling versions, route tree, assets, environment reads, tests and deployment configuration;
4. produce the factual `M0` baseline and exact `ENG-001`–`004` evidence;
5. keep all repository edits blocked until the intake is complete and the approved parity-repair sequence is confirmed.

The Phase 11 intake record is under `11-Implementation-and-QA/`. The approved Phase 10 package remains the controlling engineering contract.

## 7. External dependency

The House of Yellow deployment is registered at `https://spimarimmo-house-of-yellow.vercel.app/`. Repository `https://github.com/samney/spimarimmo-house-of-yellow`, branch `main`, and the environment-variable names are registered. On 31 July 2026 the connected GitHub workflow returned repository-not-found and the local fallback had no usable GitHub authentication, so the immutable commit, build identity, source structure and environment reads remain unverified. The initial live comparison still confirms missing local video assets across sampled routes, no hero poster fallback, and incomplete staging indexing metadata.

The controlling register is `90-House-of-Yellow-Reference-Foundation/00-DEPLOYMENT-AND-PARITY-REGISTER.md`. The clone is not accepted for SPIMAR adaptation until P0 defects and the full route/state/viewport parity gate pass.
