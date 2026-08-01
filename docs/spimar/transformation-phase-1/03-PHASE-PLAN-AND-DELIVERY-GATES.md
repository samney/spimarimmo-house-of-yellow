---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: phase-plan-and-delivery-gates
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 03 — Phase Plan and Delivery Gates

## Delivery topology

Use one integration branch and isolated worktrees:

```text
claude/spimar-transformation-phase-1
  <- claude/spimar-experience-shell
  <- claude/spimar-media-content
  <- bounded feature branches created from the integration baseline
```

No two sessions modify the same files or run in the same working directory. Shared-component ownership is assigned before implementation.

## Phase 1 sequence

[`../governance/DELIVERY-MAP.md`](../governance/DELIVERY-MAP.md) is the sole dependency graph for `P1.*`, `SPI-*`, `TRF-*`, and `GATE-*` identifiers. This document controls delivery topology, parallel ownership, and gate protocol only.

The critical sequencing rule is:

```text
P1.0 baseline -> P1.1 neutralization
              -> P1.2 design system || P1.3 content/media domain
              -> P1.4 integrated routes/shell
              -> public + CMS + CRM -> quality -> release
```

`P1.2` and `P1.3` may run in parallel only after `P1.1`, in isolated worktrees with non-overlapping file ownership.

## Initial parallel tracks

### Track A — Experience shell

Owns:

- design tokens and typography;
- global/local headers, menus, footers, transitions, cursor/hover behavior;
- responsive shell, layout primitives, motion, reduced motion, and RTL-ready CSS;
- component visual states.

Must not own CMS tables, CRM schema, content fixtures, or asset metadata.

### Track B — Content and media

Owns:

- SPIMAR content records and locale fields;
- event, proof, offer, resource, case, partner, testimonial, and media fixtures;
- responsive media derivatives, posters, focal points, rights, source, alt text, failure behavior;
- CMS-facing content contracts.

Must not change global-shell composition without Track A approval.

### Integration ownership

One primary integration session owns:

- route layouts and repository interfaces;
- shared type merges;
- resolving cross-track conflicts;
- full validation and evidence;
- release branch integrity.

## Gate protocol

Each stage must provide:

1. immutable base and head SHAs;
2. exact changed-file list;
3. requirements and state IDs covered;
4. validation commands with exit codes;
5. browser/viewport/locale evidence where relevant;
6. remaining blockers and known differences;
7. rollback boundary;
8. reviewer verdict.

Documentation approval is not runtime acceptance. A stage is complete only when its implementation and evidence pass.
