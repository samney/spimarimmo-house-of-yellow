# 07 — IMPLEMENTATION ROADMAP AND ACCEPTANCE

## 1. Current-state reality

The repository already contains:

- Next.js 16
- React 19
- TypeScript
- Tailwind 4
- next-intl
- French, English and Arabic locale foundations
- Supabase client dependencies
- schema migrations
- RLS policies
- Edge Function contracts
- provider-neutral backend seams
- backend validation harness

The repository does not yet contain:

- hosted Supabase readiness
- connected public forms
- connected CMS rendering
- authenticated admin UI
- complete browser journeys
- provider integration verification

The implementation must bridge these layers rather than rebuild the backend from zero.

---

## 2. Delivery strategy

### Phase ADM-000 — Architecture freeze

Deliver:

- product architecture
- sitemap
- journey maps
- screen inventory
- role map
- entity map
- design direction
- implementation boundaries

Exit criteria:

- no unresolved top-level modules
- public-to-CRM mapping approved
- CMS ownership approved
- route architecture approved

---

### Phase ADM-010 — Admin design-system foundation

Deliver:

- SPIMAR semantic tokens
- admin token layer
- typography
- spacing
- radii
- surfaces
- controls
- status system
- tables
- drawers
- dialogs
- empty/error/loading states
- component lab

Exit criteria:

- responsive
- RTL
- reduced motion
- keyboard accessible
- visual regression baseline

---

### Phase ADM-020 — Authentication and application shell

Deliver:

- login
- reset
- invite
- MFA
- protected routes
- session handling
- permission-aware navigation
- rail
- sidebar
- command bar
- mobile shell
- site and event context

Exit criteria:

- role-aware routes
- session expiry behavior
- 403 and disabled-account states
- keyboard navigation
- mobile shell approved

---

### Phase ADM-030 — Hosted backend readiness

Deliver:

- hosted Supabase project configuration
- migration application
- auth configuration
- storage configuration
- RLS verification
- Edge Function deployment
- environment contract
- provider health checks
- staging seed

Exit criteria:

- hosted tests pass
- no service-role leakage
- RLS positive and negative browser checks
- storage rights and media path verified

---

### Phase ADM-040 — Public acquisition integration

Deliver:

- versioned public forms
- lead-acquisition connection
- idempotency
- consent capture
- attribution
- dedupe
- durable acknowledgement
- resource delivery
- appointment request
- public status reference

Exit criteria:

- public form creates correct records
- duplicates link correctly
- consent is stored
- delivery failure is not reported as success
- full Playwright journey evidence

---

### Phase ADM-050 — CRM core

Deliver:

- leads list
- saved views
- lead detail
- timeline
- assignments
- stage transitions
- organizations
- contacts
- tasks
- appointments
- pipeline
- exports with audit

Exit criteria:

- sales manager and sales agent access tested
- stage invariants enforced
- assigned-record restrictions verified
- mobile lead workflow usable

---

### Phase ADM-060 — Events workspace

Deliver:

- event list
- event detail
- lifecycle controls
- venue
- packages
- applications
- exhibitors
- registrations
- appointments
- reporting
- post-event closeout

Exit criteria:

- independent lifecycle and availability axes
- package evidence rules
- public event preview
- cancel/postpone flows
- event reports generate governed evidence candidates

---

### Phase ADM-070 — CMS core

Deliver:

- pages
- sections
- translations
- preview
- publication workflow
- revisions
- media library
- navigation
- SEO
- forms
- resources
- articles
- FAQs

Exit criteria:

- public renderer reads approved content
- version history works
- scheduled publication works
- preview is permission protected
- RTL preview passes

---

### Phase ADM-080 — Proof and content modules

Deliver:

- metrics
- evidence queue
- partners
- case studies
- testimonials
- media rights
- package approvals

Exit criteria:

- unverified evidence cannot publish
- expiring rights are surfaced
- source and period shown near public metrics
- rejection and resubmission workflow complete

---

### Phase ADM-090 — Analytics

Deliver:

- acquisition
- conversion
- commercial
- event
- website
- content
- locale
- evidence health
- report export

Exit criteria:

- analysts see aggregate non-PII data
- attribution definitions documented
- dashboard values trace to source records
- date and event filters consistent

---

### Phase ADM-100 — Settings and governance

Deliver:

- workspace
- sites
- domains
- locales
- users
- roles
- permission overrides
- integrations
- legal
- consent
- retention
- audit
- notification preferences

Exit criteria:

- dangerous settings require confirmation
- role changes audited
- canonical domain behavior verified
- locale direction verified
- consent versions immutable after use

---

### Phase ADM-110 — Hardening and release

Deliver:

- accessibility review
- security review
- performance
- browser matrix
- mobile QA
- visual regression
- backup and restore procedure
- observability
- release checklist
- operational runbooks

Exit criteria:

- no critical accessibility issues
- no critical security findings
- all role journeys pass
- all funnel journeys pass
- rollback tested
- monitoring active

---

## 3. First implementation slice

The best vertical slice is:

> Public exhibitor enquiry → durable submission → CRM lead → assignment → task → lead detail

This slice proves:

- auth
- shell
- permissions
- public form
- acquisition boundary
- database
- RLS
- CRM list
- CRM detail
- timeline
- task
- attribution
- consent
- browser journey

It provides more architectural confidence than building a visual dashboard first.

---

## 4. First UI design sequence

Design and validate:

1. Login
2. Overview
3. Leads list
4. Lead detail
5. Pipeline
6. Event overview
7. CMS page list
8. CMS editor
9. Evidence review
10. Team and roles
11. Mobile lead detail

The overview remains the visual north star, but the leads flow is the first functional vertical slice.

---

## 5. Acceptance principles

### Product

- public actions are traceable
- staff always understand the next action
- CMS and CRM share context
- event data is not duplicated across modules
- every claim has governance
- every workflow has clear completion state

### UX

- no generic template look
- no dead-end success pages
- no hidden critical actions
- no ambiguous status
- no desktop-only workflow
- no permissions surprise
- no silent merge or overwrite

### Engineering

- no direct vendor response shapes in UI
- server-side authorization
- RLS
- schema validation
- idempotent public mutation
- audit trail
- optimistic concurrency
- URL-based list state
- automated browser journeys
- no invented production data

---

## 6. Required test journeys

### Authentication

- invited user accepts
- disabled user denied
- expired session recovers
- MFA challenge

### CRM

- new exhibitor lead
- duplicate submission
- assignment
- stage transition
- loss reason
- won to onboarding
- sales-agent restriction
- export audit

### CMS

- create page
- edit section
- translate
- attach media
- submit review
- approve
- schedule
- publish
- restore revision
- block unverified metric

### Events

- create event
- schedule
- open exhibitor sales
- open visitor registration
- postpone
- complete
- publish report

### Consent

- capture
- withdraw
- suppress
- retain
- anonymize

### Responsive

- mobile lead workflow
- mobile task completion
- tablet CMS editing
- Arabic RTL preview

---

## 7. Definition of done

A feature is complete only when:

- UX states are designed
- permissions are defined
- data contract exists
- loading, empty and error states exist
- desktop, tablet and mobile work
- keyboard access works
- RTL is checked
- audit behavior is defined
- analytics event is defined
- unit and integration tests pass
- browser journey passes
- documentation is updated
