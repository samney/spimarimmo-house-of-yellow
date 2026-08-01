---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: definition-of-done
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 19 — Definition of Done

## Work-item DoD

A task is done only when:

- requirement/task IDs and affected routes/components/data are declared;
- implementation is complete with no fake control or invented content;
- typecheck, lint, relevant unit/integration/E2E/build gates pass;
- desktop/mobile/RTL/keyboard/reduced-motion states are verified when relevant;
- security, privacy, permissions, analytics, and error behavior are addressed;
- evidence is stored at the declared path;
- docs/control plane and handoff are current;
- review findings are resolved or explicitly accepted by the accountable owner;
- change is merged and verified on the integration/main target.

## Design-system DoD

- public, CMS, and CRM contextual modes are tokenized and documented;
- content-aware component selection is demonstrated;
- no unapproved one-off token/style drift;
- all component states, responsive behavior, RTL, accessibility, and reduced motion pass;
- dashboard tables/forms/queues are usable at operational density;
- public routes retain editorial depth and do not become generic dashboards.

## Public-product DoD

- approved route/state inventory implemented;
- 19-chapter homepage and early event opportunities pass;
- event/exhibitor/visitor journeys are distinct and coherent;
- no unsupported claims or reference residue;
- media has rights, derivatives, poster, accessibility, and failure behavior;
- metadata/indexation/structured data/analytics align with public truth;
- critical conversion reaches durable outcomes.

## CMS DoD

- roles and tenant scope enforced server-side;
- content objects and relations are structured;
- source/evidence/media rights/locale readiness are visible;
- preview, review, publish, revisions, archive/withdrawal, audit, revalidation work;
- permission, conflict, incomplete-translation, publish-failure, and recovery tests pass;
- full CMS acceptance journey passes.

## CRM DoD

- public transactions are durable, idempotent, deduplicated, consented, and attributed;
- queue, assignment, stage, SLA, activity, task, appointment, and next action work;
- provider outcomes, retry, dead letter, and recovery are visible;
- permissions, export restrictions, duplicate merge, and audit pass;
- full CRM acceptance journey passes.

## Release DoD

- all acceptance flags are true;
- clean-environment cold audit passes;
- production content/legal/provider/DNS approvals are present;
- rollback, incident, backup/restore, monitoring, and owners are ready;
- no critical/high unresolved defect or unaccepted material visual difference;
- exact candidate SHA and evidence are recorded;
- owner issues a formal GO.

## Forbidden completion shortcuts

Do not call the work complete because:

- a screen looks polished;
- a build succeeds;
- tests were listed but not executed;
- a dashboard renders hard-coded data;
- a form shows a client-side success message;
- a mock provider adapter passed without required sandbox verification;
- one locale or viewport works;
- known missing content is hidden without a readiness decision;
- a branch exists but is not merged and verified.
