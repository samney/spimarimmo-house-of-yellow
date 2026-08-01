---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: foundation-handoff-and-adaptation
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 02 — Foundation Handoff and Adaptation

## Intent

The reference-clone programme is closed as a means, not as the final product. Phase 1 uses its verified engineering foundation while ending further investment in perfect House of Yellow parity.

Historical anchor:

- PR #8 / `ENG-014C` merged on 1 August 2026 through merge commit `17b697430a55fa3a5835c9c25fef927301b9ec87`.
- The final implementation-entry `main` SHA must be re-read from the repository after the control-plane closeout and accelerated `ENG-015` handoff.
- The Phase 1 kickoff record must capture that SHA, build, deployment, route inventory, test inventory, and known limitations.

## Deferred parity work

The following is not falsely marked passed:

- raw whole-page House of Yellow `<=2%` parity;
- reference non-hero video/media parity;
- exact House of Yellow motion parity;
- the historic global-shell height discrepancy.

These are classified as:

```text
DEFERRED_FROM_REFERENCE_PARITY
ABSORBED_INTO_SPIMAR_NATIVE_IMPLEMENTATION
```

The SPIMAR implementation must solve media delivery, motion, shell geometry, and responsive quality against the approved SPIMAR design contracts—not by recreating reference-brand content.

## Preserve / adapt / replace / remove / defer

| Foundation area                                            | Classification         | Phase 1 action                                                                                 |
| ---------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| Next.js App Router foundation                              | Keep                   | retain working route/render/build patterns; harden only where requirements demand              |
| TypeScript and test infrastructure                         | Keep                   | maintain strictness, improve coverage, preserve clean build                                    |
| Editorial grid and responsive scaffolding                  | Adapt                  | map to SPIMAR tokens, mobile composition, and true RTL                                         |
| Media planes, crop and poster behavior                     | Adapt                  | use SPIMAR media records, derivatives, focal points, rights, fallbacks, and reduced-data rules |
| GSAP/scroll orchestration                                  | Adapt                  | preserve craft; replace timing and choreography with SPIMAR motion contracts                   |
| Navigation/footer primitives                               | Replace/Adapt          | retain accessible behavior; implement SPIMAR global/local IA and content                       |
| Reference typography                                       | Replace or relicense   | use approved Latin/Arabic families and verified weights                                        |
| Reference colors                                           | Replace                | use SPIMAR Gold `#EFC337`, Black `#000000`, and controlled neutrals/semantics                  |
| House of Yellow routes and portfolio semantics             | Remove                 | no agency portfolio IA in production SPIMAR                                                    |
| House of Yellow copy, clients, contacts, analytics, claims | Remove                 | repository and runtime residue scan must return zero                                           |
| House of Yellow media                                      | Remove from production | retain only internal evidence where authorized; no public hotlinks                             |
| Search                                                     | Defer                  | excluded from Release 1 unless the approved route/content inventory changes                    |
| Payments, private portals, QR/check-in                     | Defer                  | later product phase                                                                            |

## Kickoff freeze record

Before SPIMAR code changes:

- record `origin/main`, branch, clean/dirty state, lockfile hash, Node/package-manager versions;
- run installation, lint, TypeScript, unit, browser, route, migration/media validation, and production build;
- capture existing route and component inventories;
- preserve retained reference evidence without repackaging it;
- create `docs/spimar-phase-1/FOUNDATION-BASELINE.md` in the repository;
- tag or otherwise record the recovery point according to repository policy;
- confirm no other session edits the same working tree.

## Transformation entry gate

Implementation may start when:

```text
FOUNDATION_BASELINE_FROZEN=true
ENTRY_SHA_RECORDED=true
CURRENT_BUILD=PASS
CURRENT_TESTS=PASS
UNEXPECTED_TRACKED_CHANGES=0
SPIMAR_PHASE_1_BRANCH_READY=true
```

This gate is deliberately bounded. It does not reopen reference parity.
