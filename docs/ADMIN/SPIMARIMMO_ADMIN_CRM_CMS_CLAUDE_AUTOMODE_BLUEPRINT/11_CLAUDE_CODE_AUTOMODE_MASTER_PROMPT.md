# MASTER CLAUDE CODE PROMPT — SPIMAR CONTROL
## End-to-End Admin / CRM / CMS Implementation in Auto Mode

You are working inside the existing SPIMARIMMO repository.

Your mission is to build the complete authenticated **SPIMAR Control** application — Admin, CRM, Events, CMS, Analytics and Settings — on top of the existing Next.js, Supabase, RLS, Edge Function and design-system foundations.

This is not a greenfield rewrite.

You must inspect before modifying, preserve healthy architecture, connect the existing backend contracts to real browser journeys, and implement the approved UI/UX direction contained in this package.

---

# 1. Mandatory reading order

Read these files before implementation:

```text
00_README.md
01_PRODUCT_ARCHITECTURE_AND_SITEMAP.md
02_USER_JOURNEYS_AND_END_TO_END_FLOWS.md
03_PUBLIC_FUNNEL_TO_CMS_CRM_MAPPING.md
04_UI_UX_SCREEN_INVENTORY.md
05_ADMIN_DESIGN_SYSTEM_ARCHITECTURE.md
06_DATA_DOMAINS_ROLES_AND_PERMISSIONS.md
07_IMPLEMENTATION_ROADMAP_AND_ACCEPTANCE.md
08_EXISTING_MASTER_DESIGN_SYSTEM.md
09_UI_ITERATION_01_DASHBOARD_BRIEF.md
10_UI_ITERATION_01_DASHBOARD.png
11_CLAUDE_CODE_AUTOMODE_MASTER_PROMPT.md
12_AUTOMODE_EXECUTION_QUEUE.md
13_DEFINITION_OF_DONE_CHECKLIST.md
14_SCREEN_TO_ROUTE_COMPONENT_DATA_MATRIX.md
15_VISUAL_IMPLEMENTATION_RULES.md
```

Also inspect every `VISUAL_*.png` file. These visuals are the approved north-star references for the product family.

---

# 2. Non-negotiable product direction

The public website is the beginning of the commercial funnel.

The authenticated platform must continue that funnel through:

```text
Public CTA
→ versioned form
→ consent
→ attribution
→ durable submission
→ deduplication
→ contact and organization
→ lead
→ assignment
→ task
→ meeting
→ proposal
→ won
→ exhibitor onboarding
→ event participation
→ reporting
→ verified evidence
→ CMS publication
```

Admin, CRM and CMS are not separate products. They are one operating system sharing:

- identity
- sites
- locales
- events
- organizations
- contacts
- media
- resources
- evidence
- permissions
- audit history
- analytics

---

# 3. Existing backend integration

Do not rebuild the backend from scratch.

Inspect and integrate:

```text
supabase/migrations/
supabase/functions/
supabase/tests/
lib/backend/seams.ts
docs/backend/
qa/backend/
```

The existing backend already contains contracts for:

- identity and roles
- sites, domains and locales
- pages and sections
- translations
- media
- events and venues
- packages
- partners
- metrics and evidence
- resources and versions
- organizations and contacts
- leads and stage history
- submissions and consent
- attribution
- tasks
- appointments
- deliveries
- integration jobs
- RLS and audit events

The application UI must consume normalized service interfaces. Do not couple React components directly to raw Supabase response shapes.

---

# 4. Visual implementation rules

Use the reference images to derive:

- shell proportions
- global rail
- contextual sidebar
- command bar
- card hierarchy
- table density
- form spacing
- status treatment
- editor layout
- responsive transformations

Do not copy accidental image-generation errors or inconsistent text.

The visual hierarchy and system are authoritative; generated sample facts are not.

Use controlled SPIMAR black, warm whites, soft neutral surfaces and muted gold accents.

Avoid:

- generic shadcn composition
- all-black admin
- gold glow
- gradients except subtle approved CTA treatments
- excessive pill usage
- repeated identical cards
- arbitrary colors
- decorative motion
- desktop-only workflows

---

# 5. Auto-mode working protocol

Work continuously through `12_AUTOMODE_EXECUTION_QUEUE.md`.

For every task:

1. mark it `IN_PROGRESS`;
2. inspect all relevant code and docs;
3. write a short implementation plan;
4. implement the smallest complete vertical slice;
5. run relevant checks;
6. fix failures;
7. collect evidence;
8. update the queue and checklist;
9. commit with the task ID;
10. continue to the next unblocked task.

Do not stop after scaffolding.

Do not mark a task complete when only static mock data exists unless the task explicitly permits fixtures.

Do not skip error, loading, empty, permission, responsive or RTL states.

---

# 6. Required implementation order

## Wave 0 — Audit and contract alignment

- repository audit
- route inventory
- backend readiness audit
- design token extraction
- dependency and environment validation
- architecture decision log

## Wave 1 — Design system and shell

- admin tokens
- primitives
- shell
- navigation
- command palette
- responsive shell
- accessibility foundations

## Wave 2 — Authentication and permissions

- login
- invite
- reset
- session expiry
- protected routes
- role-aware navigation
- access denied
- onboarding

## Wave 3 — First vertical slice

Implement first:

```text
Public exhibitor enquiry
→ acquisition boundary
→ CRM lead
→ assignment
→ task
→ lead list
→ lead detail
```

This slice must use the real backend contract and pass browser tests.

## Wave 4 — CRM

- saved views
- leads
- organizations
- contacts
- pipeline
- activities
- notes
- tasks
- appointments
- imports and exports
- won-to-onboarding

## Wave 5 — Events

- events list
- event overview
- lifecycle
- venue
- packages
- applications
- exhibitors
- registrations
- appointments
- reporting
- closeout

## Wave 6 — CMS

- CMS overview
- pages
- section editor
- preview
- revisions
- translations
- media
- resources
- articles
- case studies
- testimonials
- metrics and evidence
- navigation
- forms
- SEO
- publishing

## Wave 7 — Analytics and settings

- acquisition
- conversion
- commercial
- event
- content
- evidence health
- team
- roles
- integrations
- locales
- legal
- consent
- retention
- audit

## Wave 8 — hardening

- accessibility
- visual regression
- role journeys
- RTL
- responsive
- security
- observability
- release runbook

---

# 7. Quality gates

At task and wave boundaries run the relevant subset of:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:routes
pnpm test:e2e
pnpm verify:backend
pnpm build
```

Add tests where the existing suite does not cover new behavior.

A green static build does not prove the product journey. Browser tests are mandatory for all critical flows.

---

# 8. Required evidence

For each major screen and journey, collect:

- desktop screenshot
- tablet screenshot
- mobile screenshot
- loading state
- empty state
- permission-restricted state where applicable
- error state
- browser-test result
- accessibility result

Use deterministic fixtures only for development and visual testing. Never present fixtures as production truth.

---

# 9. Completion conditions

The mission is complete only when:

- authenticated admin routes exist;
- public forms create durable backend records;
- CRM workflows use real contracts;
- CMS publishes governed content;
- roles and RLS align;
- all primary visual references are represented;
- mobile and RTL journeys work;
- all required tests pass;
- queue and checklist contain no incomplete release-blocking tasks;
- implementation documentation and runbooks are current.

Start by auditing the repository and updating the execution queue. Then proceed without waiting for another prompt unless a genuine business decision is impossible to infer from the supplied package.
