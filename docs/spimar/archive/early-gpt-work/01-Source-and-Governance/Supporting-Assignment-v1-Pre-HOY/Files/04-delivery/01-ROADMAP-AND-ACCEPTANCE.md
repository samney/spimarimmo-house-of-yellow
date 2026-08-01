# Delivery Roadmap and Acceptance Criteria

**Status:** `PROPOSED_FOR_REVIEW`

## Phase 0 — Official alignment

**Outputs**

- normalized brief;
- recap/reset;
- source register;
- decision log;
- executive summary.

**Exit**

- CTO confirms audience priority, conversion and domain model.

## Phase 1 — Evidence and commercial discovery

**Work**

- stakeholder interviews;
- active event portfolio;
- package and price logic;
- metric definitions;
- case-study candidates;
- visitor qualification method;
- lead/reporting process;
- asset and rights audit.

**Exit**

- P0 evidence pack has owners and approved inputs.

## Phase 2 — Information architecture and UX

**Work**

- global and local sitemaps;
- homepage hierarchy;
- event-card states;
- exhibitor funnel;
- visitor flow;
- forms and confirmation;
- desktop/mobile/RTL low-fidelity screens;
- content-state coverage.

**Exit**

- representative decision-makers can locate proof, choose an event and complete the
  correct action without assistance.

## Phase 3 — Content strategy and copy

**Work**

- claim/evidence mapping;
- FR source copy;
- EN and AR localization;
- case studies;
- packages;
- FAQs;
- resources;
- editorial/SEO plan;
- legal/privacy review.

**Exit**

- every critical screen has realistic, approved content.

## Phase 4 — High-fidelity design

**Work**

- desktop key screens;
- laptop/tablet behavior;
- mobile recomposition;
- Arabic/RTL key screens;
- event-card family;
- forms and states;
- design tokens;
- motion prototype;
- visual regression baseline.

**Exit**

- visual direction is approved as modern, sophisticated, detailed and non-luxury;
- every major responsive/state requirement is represented.

## Phase 5 — Technical foundation

**Work**

- new repository;
- Next.js/TypeScript/Tailwind foundation;
- tenant and locale resolver;
- CMS adapter;
- component system;
- preview and revalidation;
- database schema/RLS;
- environments and CI.

**Exit**

- one sample event renders on main domain and subdomain in FR/EN/AR.

## Phase 6 — Product implementation

**Work**

- global B2B homepage and pages;
- local event pages;
- visitor and exhibitor forms;
- CRM/email/calendar;
- resources/blog;
- event lifecycle;
- analytics;
- CMS workflows.

**Exit**

- end-to-end exhibitor and visitor journeys pass in staging.

## Phase 7 — Migration and hardening

**Work**

- content migration;
- domain/redirect map;
- media optimization;
- SEO metadata/structured data;
- accessibility;
- performance;
- security/privacy;
- monitoring;
- stakeholder training.

**Exit**

- release candidate passes the acceptance matrix.

## Phase 8 — Launch and optimization

**Work**

- staged domain rollout;
- live form/integration checks;
- indexing and analytics checks;
- RUM monitoring;
- campaign observation;
- conversion review;
- backlog prioritization.

**Exit**

- stable production;
- no P0 defects;
- ownership and reporting cadence active.

## Acceptance matrix

| Area | Minimum acceptance |
|---|---|
| Strategy | Exhibitor is unmistakably primary on global B2B routes |
| Events | Active/upcoming cards are prominent and accurate |
| Proof | Every public metric/case/logo has approval |
| Exhibitor UX | Brochure, enquiry and meeting actions complete correctly |
| Visitor UX | Local registration and confirmation complete correctly |
| Responsive | 320 px through wide desktop, with intentional layouts |
| RTL | Arabic content, forms, focus and motion are correct |
| Accessibility | WCAG 2.2 AA critical journeys |
| Performance | LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 target at p75 |
| SEO | Canonical, `hreflang`, sitemap and event metadata valid |
| Security | Server validation, rate limit, RLS, secrets and headers verified |
| Privacy | Approved notices, consent, retention and preference flow |
| Analytics | Primary/secondary conversions measurable without PII |
| Operations | Event automatically transitions to completed/recap state |
| Integrations | Failed email/CRM jobs visible and retryable |
| Content | No stale venue/date/brochure/offer in sampled hosts |

## Launch test matrix

Sample at minimum:

- main domain FR, EN and AR;
- one active European subdomain;
- one active North American subdomain;
- one active Gulf subdomain;
- one coming-soon event;
- one completed event;
- exhibitor brochure;
- exhibitor enquiry;
- meeting booking;
- visitor registration;
- expired resource;
- reduced motion;
- keyboard-only;
- mobile slow network;
- alternate-domain redirect.

## Post-launch review cadence

### Daily during launch/campaign start

- uptime;
- forms/integrations;
- active event facts;
- campaign attribution;
- error spikes.

### Weekly

- conversion funnel;
- lead response;
- content/SEO issues;
- performance;
- audience qualification.

### After every edition

- final metrics;
- case-study opportunity;
- lead handover;
- satisfaction;
- archive/recap;
- package and UX improvements;
- renewal pipeline.

