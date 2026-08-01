---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: qa-acceptance-and-launch
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 15 — QA, Acceptance, and Launch

## Acceptance gates

```text
FOUNDATION_BASELINE_FROZEN=true
SPIMAR_DESIGN_SYSTEM_ACCEPTED=true
SPIMAR_PUBLIC_PRODUCT_ACCEPTED=true
CMS_CAPABILITY_ACCEPTED=true
CMS_PRODUCTION_INTEGRATION_ACCEPTED=true
CMS_RELEASE_READY=true
CRM_CAPABILITY_ACCEPTED=true
CRM_PRODUCTION_INTEGRATION_ACCEPTED=true
CRM_RELEASE_READY=true
QUALITY_ACCEPTED=true
MASTER_AUDIT_RESULT=GO
```

The acceptance levels and required evidence are defined once in [`../governance/ACCEPTANCE-LEVELS.md`](../governance/ACCEPTANCE-LEVELS.md).

Reference House of Yellow whole-page parity is not a Phase 1 release gate. Visual acceptance compares the implementation to approved SPIMARIMMO HIF/design-system contracts and explicitly registered responsive states.

## Automated gates

- deterministic dependency install;
- strict TypeScript;
- lint and formatting baseline protection;
- unit and component tests;
- integration and database migration tests;
- RLS and role/permission positive and negative tests;
- route/host/locale/event-state smoke tests;
- Playwright public/CMS/CRM journeys;
- accessibility automation;
- link, asset, metadata, robots, sitemap, hreflang, and structured-data checks;
- security-header and secret/client-bundle checks;
- visual regression and reduced-motion checks;
- production build and clean-start run.

## Coverage matrix

Required public viewport anchors:

```text
1920x1080, 1440x900, 1280x800, 1024x768,
768x1024, 430x932, 390x844, 360x800
```

Also test fluid widths, text zoom, landscape/mobile edge cases, and target browsers.

Dimensions:

- global/local hosts;
- FR/EN/AR and LTR/RTL;
- desktop/tablet/mobile;
- default/hover/focus/active/disabled/loading/success/error/delayed/closed;
- event lifecycle and audience-availability axes;
- anonymous/editor/reviewer/publisher/translator/media/admin/sales-manager/sales-agent/read-only;
- normal/reduced motion and ordinary/constrained media;
- provider ready/delayed/unavailable;
- consent states and cookie preferences.

The approved 48 UX/HIF targets and 144 controlled states remain traceability inputs. Phase 1 maps them to implemented routes/components or records an approved supersession.

## Critical E2E journeys

1. Corporate visitor discovers an event and starts an exhibitor path.
2. Exhibitor requests a versioned brochure; lead is durable, attributed, assigned, delivered/recoverable.
3. Exhibitor requests a meeting; capacity/provider outcomes remain honest.
4. Visitor discovers an event and preregisters through open/waitlist/closed variants.
5. Editor creates and localizes an event/content set; reviewer approves; publisher previews and publishes.
6. Proof/media is withdrawn from all public placements.
7. Sales manager triages and assigns; agent qualifies, tasks, meets, and advances stage.
8. Duplicate submission does not create duplicate operational outcomes.
9. Provider failure enters retry/dead-letter and remains visible without false failure of durable submission.
10. Permission-negative attempts fail without data leakage.

## Visual QA

- verify token, type, layout, media, spacing, crop, layering, content resilience, and motion against approved SPIMARIMMO contracts;
- inspect public, CMS, and CRM modes separately;
- prevent generic card repetition and dashboard-style public pages;
- prevent cinematic public styling from reducing dashboard efficiency;
- capture representative desktop/mobile/RTL states with deterministic fixtures;
- document dynamic-region normalization; do not mask material errors.

## Cold master audit

1. Freeze candidate SHA and lockfile.
2. Verify in a clean environment/worktree.
3. Install from lockfile and rebuild database from migrations.
4. Load deterministic fixtures.
5. Run every automated gate.
6. Run public/CMS/CRM critical journeys.
7. Inspect roles, RLS, duplicates, idempotency, retries, expiry, cancellation, withdrawal, and recovery.
8. Inspect browser console, server logs, network, queue, and monitoring.
9. Verify content/readiness, rights, locales, legal, and providers.
10. Produce evidence-backed `GO` or `NO-GO`.

Defects reopen dependent gates. A previous green result is not a waiver.

## Launch sequence

- content and legal freeze;
- production backup/rollback confirmation;
- migration dry run and reviewed release plan;
- DNS/canonical/redirect/sitemap/robots verification;
- smoke test public, CMS, CRM, forms, providers, and analytics;
- staged rollout when supported;
- post-launch monitoring window and named incident owners;
- 24-hour/7-day content, lead, error, performance, and integration review;
- backlog optimization only after release acceptance.
