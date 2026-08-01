# SPIMARIMMO × House of Yellow
## Pixel-Accurate Foundation Recovery, Functional CMS/CRM POC, SPIMAR Adaptation, and Claude Code Master Execution Plan

**Version:** 1.0  
**Date:** 31 July 2026  
**Owner:** Samney  
**Execution environment:** Claude Code  
**Primary model:** Claude Fable 5  
**Permitted fallback:** Claude Opus 5 only when Fable 5 is genuinely unavailable  
**Status:** `READY_FOR_REPOSITORY_EXECUTION`

---

## 1. Mission

The current Next.js implementation is a useful first implementation, but it is not
accepted as a finished House of Yellow reconstruction. It is visually close at a
general level while still missing the precision, component geometry, typography,
responsive composition, motion behavior, state coverage, and micro-details required
for a high-fidelity foundation.

This mission has four outcomes:

1. Repair and converge the existing implementation until it faithfully reproduces
   the current public House of Yellow experience across routes, viewports, states,
   interactions, and motion.
2. Preserve that work as a reusable visual and engineering foundation rather than
   mixing SPIMAR content into it prematurely.
3. Build a deliberately lightweight but fully operational CMS and CRM proof of
   concept with real authentication, persistence, publishing, lead capture,
   permissions, workflow, and end-to-end tests.
4. Adapt the accepted foundation into the SPIMARIMMO B2B platform defined by the
   official strategy, UX, content, technical, and quality specifications.

The final SPIMAR product is not a reskinned agency portfolio. House of Yellow controls
the quality benchmark, editorial rhythm, craft, motion discipline, and attention to
detail. SPIMAR documentation controls the business model, audiences, information
architecture, content hierarchy, conversion logic, evidence rules, event lifecycle,
CMS model, CRM model, and multilingual requirements.

---

## 2. Definition of success

The mission is successful only when all four gates pass:

```text
REFERENCE_PARITY_ACCEPTED=true
CMS_POC_ACCEPTED=true
CRM_POC_ACCEPTED=true
SPIMAR_PRODUCT_ACCEPTED=true
```

The release candidate may then be marked:

```text
MASTER_AUDIT_RESULT=GO
RELEASE_CANDIDATE=true
```

A successful build, a polished homepage, a completed component library, a CMS
dashboard shell, or a lead form that displays a success toast is not completion.

### 2.1 What “100%” means in this project

`100% accepted` means that 100% of required routes, states, viewports, flows, roles,
tests, and evidence rows pass. No material difference may remain unexplained.

Literal byte-identical browser screenshots are not a valid universal target because
font rasterization, operating systems, browser engines, video frames, live clocks,
social feeds, and consent state can vary. These regions must be normalized or
precisely masked. Everything stable must be measured.

Reference-parity acceptance requires:

- no missing public route, section, component, asset, content block, or interaction;
- no unexplained visual difference;
- exact fonts and intended font weights;
- matching text wrapping at controlled reference viewports;
- stable layout geometry within 2 CSS pixels, with a 1-pixel target;
- no material color, crop, radius, border, alignment, or layering mismatch;
- SSIM of at least `0.995` for normalized static captures;
- no more than `0.5%` differing static pixels after a documented anti-alias tolerance;
- no section-level hotspot containing a material visual error;
- motion timing within 50 ms and sampled transform geometry within 2 CSS pixels;
- 100% required interaction-state coverage;
- 100% required responsive-state coverage;
- 100% required validation rows green.

Dynamic masks may cover only genuinely unstable regions. A difficult section may not
be hidden behind a large mask.

---

## 3. Authority and conflict resolution

Use the following authority by responsibility.

| Responsibility | Controlling source |
|---|---|
| Current repository state | Repository files, Git state, executed commands, rendered application |
| House of Yellow visual and behavioral fidelity | Current public `https://houseofyellow.nl/` evidence captured during this mission |
| House of Yellow route and CMS reconstruction scope | `HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md` plus fresh route discovery |
| Claude Code workflow bootstrap | `CLAUDE-CODE-PUBLIC-SKILLS-WORKFLOW-BOOTSTRAP.md` |
| SPIMAR business and conversion logic | Official SPIMAR assignment and strategy documents |
| SPIMAR homepage and user journeys | `00-MAIN-DELIVERABLES.md`, the official UX/content PDF, and the experience specifications |
| SPIMAR platform architecture | Technical architecture and digital-platform audit |
| Performance, security, privacy, SEO, and analytics | SPIMAR quality architecture |
| This recovery mission, phase gates, and final audit | This document |

When two sources appear to conflict:

1. classify whether the conflict concerns fidelity, product logic, implementation
   state, or production policy;
2. follow the controlling source for that responsibility;
3. record the conflict and decision in `docs/claude-code/DECISIONS.md`;
4. never silently choose the easier requirement.

The live reference controls the internal House of Yellow parity build. It does not
override SPIMAR’s exhibitor-first strategy.

---

## 4. Non-negotiable product rules

### 4.1 Foundation separation

Maintain two explicit product modes or branches:

- `reference-foundation`: the verified House of Yellow reconstruction used for
  parity and reusable-system extraction;
- `spimar-product`: the SPIMAR adaptation driven by SPIMAR content, assets, IA,
  design decisions, CRM workflows, and event logic.

Do not gradually replace House of Yellow copy inside the parity implementation while
parity work is still unfinished. That destroys the ability to compare like for like.

The public SPIMAR release must not contain House of Yellow branding, copy, project
claims, client data, production hotlinks, or unrelated agency assets. Reference
assets are used only where authorized and only for the internal parity foundation.

### 4.2 Repair the current implementation

Preserve working code and fix the implementation in place. Do not restart from an
empty repository merely because rebuilding feels easier.

A larger refactor is permitted only when evidence proves that the current structure
prevents:

- route completeness;
- visual convergence;
- correct responsive behavior;
- safe GSAP lifecycle management;
- CMS-driven content;
- accessibility;
- performance;
- maintainability;
- or reliable testing.

Record the proof, migration path, and affected files before starting such a refactor.

### 4.3 No invented SPIMAR claims

Never invent:

- event dates or venues;
- attendance or capacity;
- leads, appointments, reservations, or sales;
- satisfaction or renewal rates;
- exhibitor packages, inclusions, availability, or prices;
- developer, bank, media, sponsor, or institutional relationships;
- case-study outcomes;
- testimonial identity or quotations;
- rights to an image, video, logo, document, or personal story.

Unknown facts use governed draft placeholders in the CMS. Unverified claims are not
published on the public site.

### 4.4 Business hierarchy

The global SPIMAR site is an exhibitor-first B2B commercial platform.

Its guiding question is:

> Why should a Moroccan property developer invest several tens of thousands of
> dirhams to exhibit with SPIMARIMMO?

The visitor journey is essential but secondary on the parent homepage. Country and
city event experiences may prioritize visitor registration when the route and
campaign context require it.

The commercial narrative is:

```text
PROMISE → DESTINATION → PROOF → METHOD → ROI → CONVERSION
```

The proof rule is:

```text
ACTION + PROOF = TRUST
```

### 4.5 Functional means functional

CMS and CRM screens may not be static mockups. Every visible action must either:

- complete a real authorized operation;
- show a truthful validation, permission, or failure state;
- or be visibly disabled and documented as outside the accepted POC scope.

No fake success messages. No hard-coded dashboard numbers represented as live data.
No client-only authorization. No public service-role secret.

---

## 5. Required repository control plane

Preserve and update the previous Claude Code control system:

```text
docs/claude-code/
  MASTER.md
  STATUS.md
  QUEUE.md
  DECISIONS.md
  ASSUMPTIONS.md
  BLOCKERS.md
  VALIDATION-MATRIX.md
  SESSION-HANDOFF.md
  BOOTSTRAP-REPORT.md
  PUBLIC-SKILLS-LOCK.md
  RECOVERY-BASELINE.md
  PARITY-SCORECARD.md
  CMS-CRM-ACCEPTANCE.md
  SPIMAR-TRACEABILITY.md
  MASTER-AUDIT-REPORT.md
```

Also create:

```text
docs/recovery/
  CURRENT-IMPLEMENTATION-AUDIT.md
  REFERENCE-ROUTE-INVENTORY.md
  REFERENCE-STATE-INVENTORY.md
  REFERENCE-ASSET-MANIFEST.md
  VISUAL-GAP-REGISTER.md
  MOTION-GAP-REGISTER.md
  RESPONSIVE-GAP-REGISTER.md
  KNOWN-DIFFERENCES.md

docs/spimar/
  PRODUCT-REQUIREMENTS-MAP.md
  CONTENT-EVIDENCE-REGISTER.md
  CMS-CONTENT-MODEL.md
  CRM-LIFECYCLE.md
  EVENT-LIFECYCLE.md
  TENANT-DOMAIN-MODEL.md
  DATA-MODEL.md
  API-CONTRACTS.md
  ROLE-PERMISSION-MATRIX.md

qa/
  reference/
  implementation/
  overlays/
  diff/
  motion/
  cms/
  crm/
  spimar/
  master-audit/
```

No task is complete without an evidence path in `QUEUE.md` and
`VALIDATION-MATRIX.md`.

---

## 6. Master phase plan

## Phase 0 — Safe recovery baseline

### Objective

Understand the actual implementation before changing it and preserve the user’s work.

### Required actions

1. Resolve the repository root and inspect `AGENTS.md`, `CLAUDE.md`, `.claude/`,
   hosting configuration, package files, environment templates, CI, migrations,
   tests, and documentation.
2. Record branch, commit, remotes with secrets redacted, and dirty worktree state.
3. Do not discard or hide existing changes.
4. Confirm whether Session 0 already passed:
   - `WORKFLOW_READY=true`;
   - public-skills lock exists;
   - installed skills match recorded hashes;
   - project settings and rules load.
5. If Session 0 is complete, verify it without reinstalling or rewriting the
   toolchain.
6. If Session 0 is incomplete or drifted, run the existing bootstrap exactly as
   required before implementation.
7. Install the current repository’s dependencies with its existing package manager.
8. Run the existing typecheck, lint, unit tests, integration tests, E2E tests, and
   production build.
9. Start the application and capture every currently implemented route at the
   required viewports.
10. Record:
    - working features;
    - missing routes;
    - visual regressions;
    - console and network failures;
    - incomplete data paths;
    - hard-coded content;
    - mocked CMS/CRM behavior;
    - failing tests;
    - architectural risks.

### Exit condition

`RECOVERY_BASELINE_COMPLETE=true` with reproducible commands, baseline screenshots,
and no destructive change.

---

## Phase 1 — Fresh House of Yellow evidence capture

### Objective

Create a new comparison corpus from the live authorized reference. Do not assume the
July 30 audit is still complete.

### Required public route minimum

```text
/
/made-by-yellow/
/culture/
/how-we-roll/
/connect/
/cookies/
/project/[every-discovered-public-slug]/
/404
```

The prior evidence found 21 project routes. Fresh discovery must confirm the current
count, additions, removals, redirects, canonicals, and 404 behavior.

### Required viewports

```text
1920 × 1080
1440 × 900
1280 × 800
1024 × 768
768 × 1024
430 × 932
390 × 844
360 × 800
```

Also inspect fluid behavior between named widths.

### Required state capture

- initial viewport and full page;
- header before and after scroll;
- desktop and mobile navigation open/closed;
- Connect CTA states;
- custom cursor states;
- WhatsApp control;
- hero video loading, poster, play, pause, and offscreen behavior;
- project filters, reset, grid, and list;
- project hover/video behavior;
- route transitions;
- text reveals and counters;
- consent banner and preference panel;
- contact form idle, focus, invalid, submitting, success, and server failure;
- keyboard focus;
- reduced motion;
- footer interactions;
- 404;
- loading and media-failure states.

### Evidence format

Capture:

- full-page screenshots;
- section screenshots;
- computed layout measurements;
- font and asset evidence;
- motion recordings;
- animation timelines;
- state inventory;
- exact capture metadata: URL, viewport, DPR, browser, timestamp, consent state,
  scroll position, and animation position.

### Exit condition

`REFERENCE_CORPUS_COMPLETE=true` and every comparison target has a stable reference
or a documented dynamic-region rule.

---

## Phase 2 — Current implementation gap audit

### Objective

Compare the existing implementation against the new reference corpus before editing.

### Gap classes

| Severity | Meaning |
|---|---|
| `P0` | Missing route, broken flow, incorrect public behavior, security/data issue |
| `P1` | Major geometry, responsive, typography, asset, motion, or content mismatch |
| `P2` | Noticeable component/state/micro-interaction inconsistency |
| `P3` | Minor polish or browser-specific raster difference |

### Required comparison dimensions

- route and section completeness;
- content and text wrapping;
- font file, weight, size, line height, and letter spacing;
- page background and section color;
- max width, grid, gaps, padding, margins, and offsets;
- component dimensions and radii;
- media source, aspect ratio, crop, focal point, poster, and playback;
- z-index and sticky/fixed behavior;
- hover, focus, active, disabled, loading, error, and success;
- scroll trigger, start/end, pinning, scrub, stagger, ease, and duration;
- page transition lifecycle;
- mobile recomposition rather than simple stacking;
- accessibility and reduced-motion behavior;
- browser-specific differences;
- console, network, hydration, and animation cleanup errors.

### Required output

For every mismatch record:

- ID;
- route;
- viewport/browser;
- component/section;
- expected evidence;
- observed implementation;
- visual or behavioral impact;
- root cause;
- proposed correction;
- affected files;
- dependency;
- verification method;
- before/after evidence.

### Exit condition

`PARITY_BACKLOG_FROZEN=true`. No visual repair begins from memory or general
impression.

---

## Phase 3 — Design and motion system convergence

### Objective

Correct the reusable foundations before fixing individual pages repeatedly.

### Visual foundations

At minimum verify and encode:

- exact self-hosted Poppins font files and weights used by the reference;
- canvas, ink, yellow, and every additional observed color;
- fluid typography and actual mobile overrides;
- spacing and container system;
- grid and breakpoint behavior;
- borders, radii, opacity, shadows, masks, blend modes, and z-index;
- icon and cursor geometry;
- media ratios and art-directed crops;
- accessible focus styling;
- CSS logical properties where future RTL reuse matters.

Previously observed anchors such as `#EEEEEE`, `#1D1D1B`, and `#F2EFA3` are
starting evidence only. Reconfirm them against the current reference and rendered
context.

### Motion foundations

Define one clear ownership system:

- GSAP and `@gsap/react` for complex timelines and scroll choreography;
- ScrollTrigger for verified scroll relationships;
- Lenis only if fresh evidence confirms it remains part of the interaction;
- native CSS for simple hover/focus transitions;
- no duplicate animation libraries for the same job;
- route-aware cleanup;
- no orphaned ScrollTriggers;
- no hydration-dependent initial flash;
- deterministic reduced-motion alternatives.

Document every meaningful animation as:

```yaml
id:
route:
target:
trigger:
initial:
final:
duration:
delay:
ease:
stagger:
scroll_start:
scroll_end:
pin:
scrub:
desktop:
mobile:
reduced_motion:
evidence:
```

### Exit condition

Global tokens and motion primitives reproduce the reference foundation on one
representative route before mass page fixes.

---

## Phase 4 — Global shell parity

Repair and verify:

- desktop header;
- centered mark/logo;
- navigation typography and spacing;
- Connect CTA geometry and repeated-text interaction;
- sticky state and dark/light section adaptation;
- mobile menu composition and animation;
- office/contact content in the menu;
- custom cursor and contextual labels;
- sticky WhatsApp control;
- route transitions;
- page loading/reveal;
- cookie consent and preference management;
- footer composition, social/contact information, sitemap, copyright, cookie link,
  and final CTA;
- focus order, keyboard behavior, scroll locking, and return focus.

### Exit condition

The shell passes on every required viewport and browser before route-specific work is
accepted.

---

## Phase 5 — Route-by-route reference convergence

Execute in this order:

1. Homepage.
2. Made by Yellow index.
3. One representative project detail.
4. Remaining project records and pages.
5. Culture.
6. How We Roll.
7. Connect.
8. Cookies and preference management.
9. 404 and global failure states.

For every route:

1. match structure and content;
2. match geometry;
3. match typography and wrapping;
4. match assets and media behavior;
5. match motion;
6. match interaction states;
7. match responsive transformations;
8. verify accessibility;
9. capture normalized comparison;
10. correct differences and repeat.

Do not postpone all visual comparison until the end.

### Reference gate

Set `REFERENCE_PARITY_ACCEPTED=true` only when:

- all discovered public routes are implemented;
- all required route/state/viewport rows pass;
- all required assets are local or use an approved production provider;
- no production hotlinks remain;
- static-diff thresholds pass;
- motion evidence passes;
- no material console/network error remains;
- `KNOWN-DIFFERENCES.md` contains no unaccepted material difference.

---

## Phase 6 — CMS and CRM POC architecture

### Objective

Build the smallest system that truthfully demonstrates the complete SPIMAR content
and lead workflow.

### Architectural decision

Use the existing Next.js application and Supabase/PostgreSQL for the POC:

- Supabase Auth for staff identity;
- a structured CMS admin UI, not raw table editing;
- PostgreSQL/Supabase for operational CRM data;
- Supabase Storage or the existing authorized media provider for assets;
- Next.js server actions/route handlers for validated writes;
- RLS plus server-side authorization;
- repository interfaces so the POC editorial store can later be replaced by the
  audited existing WordPress/WPGraphQL CMS without rewriting public components.

Maintain explicit boundaries:

```text
ContentRepository
MediaRepository
LeadRepository
AppointmentRepository
IntegrationQueue
```

The POC may use one Supabase project, but CMS content and CRM personal data must have
separate tables, policies, permissions, retention rules, and access paths.

### POC exclusions

The following are not required for this POC unless already implemented and stable:

- billing and invoicing;
- full event ERP;
- QR check-in;
- partner portal;
- complex marketing automation;
- WhatsApp Business API automation;
- full sales forecasting;
- production data migration;
- multi-organization SaaS billing.

These exclusions do not permit fake UI. Omitted modules must not appear operational.

---

## Phase 7 — Functional CMS POC

### Roles

- `super_admin`;
- `content_editor`;
- `translator`;
- `sales_manager`;
- `sales_agent`;
- `analyst`.

No public registration or public customer login.

### Required CMS modules

- dashboard with truthful publication and content-completeness data;
- sites/tenants and domains;
- locales;
- pages and controlled page sections;
- events and venues;
- event lifecycle;
- exhibitor packages;
- partners/developers/banks/sponsors;
- case studies;
- testimonials;
- metrics with definition, period, source, evidence status, and approval;
- media with alt text, rights, focal point, captions, and usage;
- resources and document versions;
- articles/insights;
- FAQs;
- navigation, footer, contact, and global settings;
- SEO and social metadata;
- translations;
- draft preview;
- revisions and audit history.

### Publishing states

```text
Draft → In review → Approved → Scheduled → Published → Archived
```

Publishing rules:

- unique route and slug validation;
- publication requires mandatory content for the selected block;
- unverified metric, package, testimonial, or case-study claims block publication;
- preview is protected;
- scheduled publication is testable;
- affected public pages revalidate after publish;
- safe deletion refuses assets/content still in use;
- restore or revision history exists for critical content;
- permission checks exist in UI, server, and database policy.

### Event lifecycle

```text
Draft
→ Review
→ Scheduled
→ Exhibitor sales open
→ Visitor registration open
→ Live
→ Ended
→ Recap / waitlist
→ Archived
```

Invalid combinations block publication. The card, page, form, metadata, CTA, email,
and CRM association must read the same event state.

### CMS acceptance journey

A permitted editor can:

1. sign in;
2. create an event draft;
3. add localized content and media;
4. see missing-evidence warnings;
5. submit for review;
6. publish when requirements pass;
7. see the correct public page;
8. edit and republish;
9. verify targeted cache revalidation;
10. inspect revision/audit history;
11. archive the event;
12. see the public page move to recap/waitlist behavior.

Set `CMS_POC_ACCEPTED=true` only when this journey passes for FR, EN, and Arabic/RTL
content where required by SPIMAR.

---

## Phase 8 — Functional CRM POC

### Required entities

```text
organizations
contacts
leads
lead_event_interests
lead_assignments
lead_stage_history
form_submissions
consents
campaign_attribution
activities
notes
tasks
appointments
resource_deliveries
integration_jobs
audit_events
```

### Lead stages

```text
New
→ Deduplicated
→ Marketing qualified
→ Sales review
→ Sales qualified
→ Meeting scheduled
→ Meeting completed
→ Proposal requested
→ Proposal sent
→ Negotiation
→ Won / Lost / Nurture
→ Exhibitor onboarding
```

Every transition records:

- actor;
- timestamp;
- previous and new stage;
- reason;
- tenant;
- event;
- source/campaign;
- owner;
- next action;
- audit entry.

### Required public acquisition flows

- brochure request;
- exhibitor enquiry;
- proposal request;
- meeting request/booking;
- visitor registration;
- contact request;
- WhatsApp click with configured destination and attribution.

### Form transaction

```text
normalize
→ server validate
→ validate tenant/event/form state
→ rate and bot controls
→ idempotency
→ contact deduplication
→ lead/submission creation
→ consent and attribution storage
→ owner/queue assignment
→ notification/resource job
→ truthful localized response
```

### Required CRM behavior

- every successful submission is persisted;
- duplicate form retries do not create uncontrolled duplicates;
- tenant, locale, event, UTM, referrer, CTA position, and notice version survive;
- each lead has an owner or a visible unassigned queue;
- sales roles can search and filter authorized records;
- an authorized user can assign, change stage, add a note, create a task, and record
  a meeting;
- unauthorized roles cannot view or mutate CRM personal data;
- failures appear in an operational queue;
- retryable notification/resource jobs can be retried safely;
- exports are restricted and audited;
- analytics never receive names, emails, phone numbers, messages, or CRM notes.

### Appointment POC

Provide a minimal native appointment workflow:

- staff-configured available slots;
- timezone-aware public selection;
- capacity and collision protection;
- pending/confirmed/cancelled/completed states;
- lead/event association;
- admin management;
- localized confirmation.

External calendar synchronization is an adapter and may remain blocked by missing
provider credentials, but the native POC journey must work.

### Email and resource delivery

Implement a provider adapter:

- deterministic test adapter for automated tests;
- configured sandbox/transactional provider for staging acceptance;
- retryable integration job;
- delivery status and error visibility;
- no secret in client code or logs.

Do not mark external delivery accepted without executing a real sandbox delivery.

### CRM acceptance journey

1. A public user opens an edition-specific exhibitor page.
2. Source, campaign, tenant, locale, and event are captured.
3. The user requests a brochure.
4. The submission is server validated and deduplicated.
5. Consent and attribution are stored.
6. The correct resource is delivered.
7. The lead appears in the correct CRM queue.
8. A sales manager assigns the lead.
9. A sales agent qualifies it and schedules a meeting.
10. The stage and audit history update.
11. A proposal request can be recorded.
12. Permission, duplicate, failure, and retry tests pass.

Set `CRM_POC_ACCEPTED=true` only when the complete journey passes.

---

## Phase 9 — SPIMAR product adaptation

### Objective

Transform the accepted reference-quality foundation into the SPIMAR B2B commercial
platform without importing the agency portfolio’s information architecture.

### Visual direction

Preserve:

- cinematic media confidence;
- large editorial typography;
- asymmetric composition;
- disciplined section rhythm;
- exact spacing and alignment;
- strong dark/light contrast;
- crafted motion;
- intentional negative space;
- non-generic interaction;
- high-quality responsive recomposition.

Adapt:

- authentic SPIMAR yellow and controlled supporting palette;
- documentary exhibition imagery;
- modern-depth B2B treatment;
- controlled rounded geometry where approved;
- proof modules;
- event opportunity cards;
- conversion forms;
- source/date/evidence labels;
- Arabic RTL.

Reject:

- generic SaaS dashboards on the public site;
- repeated equal cards for every section;
- oversized rounded “AI template” surfaces;
- decorative gradients without brand or content function;
- luxury-real-estate clichés;
- visitor-first homepage hierarchy;
- invented performance data;
- copying House of Yellow content into the SPIMAR release.

### Global homepage contract

Implement the approved B2B sequence:

1. global header and exhibitor action;
2. cinematic B2B promise;
3. high-visibility country/city event opportunities;
4. verified proof bar;
5. why exhibit;
6. featured case study or approved method/report fallback;
7. before/during/after method;
8. 360° visibility system;
9. MRE demand intelligence with dated sources;
10. trusted developers, banks, institutions, and partners;
11. video testimonials;
12. real event gallery;
13. Standard/Premium/Sponsor comparison;
14. resources;
15. exhibitor FAQ;
16. insights;
17. about/team/media confidence;
18. qualified final conversion;
19. complete footer.

Country/city cards must appear within the first three major content chapters and may
not be reduced to a small agenda.

### Required SPIMAR route family

```text
/[locale]
/[locale]/events
/[locale]/events/[eventSlug]
/[locale]/exhibit
/[locale]/offers
/[locale]/case-studies
/[locale]/case-studies/[slug]
/[locale]/resources
/[locale]/resources/[slug]
/[locale]/insights
/[locale]/insights/[slug]
/[locale]/visitors
/[locale]/about
/[locale]/contact
/[locale]/privacy
/[locale]/terms
```

The final sitemap is controlled by the SPIMAR information architecture and current
content availability.

### Local event page states

- upcoming;
- exhibitor sales open;
- visitor registration open;
- live;
- ended;
- recap/waitlist;
- archived;
- cancelled/rescheduled when operationally required.

Each event page supports the correct:

- date/timezone;
- venue;
- real media;
- program;
- exhibitors;
- proof;
- brochure/resource;
- exhibitor action;
- visitor action;
- SEO metadata;
- structured data;
- expired-state behavior.

### Languages

Support:

- French;
- English;
- Arabic with true RTL.

Requirements:

- explicit locale URLs;
- correct `lang` and `dir`;
- localized navigation, forms, errors, consent, metadata, structured data, and
  resources;
- locale-preserving navigation;
- logical CSS properties;
- no mixed-direction layout bugs;
- no automatic publication of incomplete translations;
- no string concatenation that breaks Arabic grammar.

Set `SPIMAR_PRODUCT_ACCEPTED=true` only when the product requirements traceability
matrix is complete and the public experience passes desktop, mobile, and RTL QA.

---

## Phase 10 — Multi-tenant platform POC

### Required topology

```text
Main domain + wildcard subdomains
→ deployment/CDN
→ one Next.js App Router application
→ normalized host resolver
→ tenant + locale + event resolver
→ shared page renderer
→ content repository
→ operational CRM database
```

### Required behavior

- `spimarimmo.com` resolves the global platform;
- approved country/city subdomains resolve configured tenants;
- aliases redirect to one canonical host;
- unknown/inactive hosts return a controlled state;
- new tenant configuration does not require duplicated page code;
- tenant, locale, legal profile, analytics profile, contacts, and events are data;
- representative global and local routes render server-side;
- cache invalidation is scoped by site, page, event, and locale;
- preview bypasses the public cache safely;
- forms preserve tenant and event;
- event expiry changes page and form behavior consistently.

This is a POC. Do not mutate production DNS or deploy wildcard domains without
explicit authorization.

---

## Phase 11 — Quality convergence

### Required automated gates

- strict TypeScript;
- lint;
- formatting;
- unit tests;
- integration tests;
- database migration validation;
- RLS positive and negative tests;
- Playwright E2E;
- route/locale/tenant smoke tests;
- accessibility checks;
- link validation;
- metadata and structured-data validation;
- security-header validation;
- visual regression;
- production build.

### Accessibility

Target WCAG 2.2 AA:

- semantic structure;
- correct heading hierarchy;
- full keyboard access;
- visible, unobscured focus;
- correct menu/dialog focus management;
- labels, descriptions, and accessible errors;
- sufficient contrast;
- text zoom/reflow;
- reduced motion;
- captions and transcripts;
- accurate alternative text;
- status not communicated by color alone;
- primary controls use a 44 × 44 CSS-pixel product target.

No critical or serious automated accessibility violations may remain. Critical
journeys also require manual keyboard and screen-reader checks.

### SPIMAR performance targets

At the 75th percentile after production measurement:

| Metric | Target |
|---|---:|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

Initial implementation budgets:

- critical client JavaScript at or below 170 KB gzip on the global homepage;
- initial mobile transfer excluding optional video at or below 1.5 MB;
- mobile hero poster target at or below 250 KB;
- desktop hero poster target at or below 450 KB;
- no constrained/mobile hero-video preload;
- no autoplay audio;
- no layout shift from media;
- noncritical video and galleries lazy loaded.

If measured evidence requires a justified budget change, record it. Do not silently
remove the gate.

### Security

- all writes server validated;
- RLS on exposed tables;
- authorization enforced server-side;
- rate limits and bot controls;
- idempotency on public submissions;
- least-privilege keys;
- no service-role key in client bundles;
- secure session cookies;
- safe redirect validation;
- content security policy and security headers;
- private preview;
- audit logs;
- restricted exports;
- no sensitive data in URLs, analytics, or ordinary logs;
- no public production source maps.

---

## Phase 12 — Post-implementation master audit

This phase begins only after Claude Code believes implementation is complete.

### Rule

Do not mark the project complete and then write a narrative review. Freeze a release
candidate and attempt to disprove its completeness.

### Audit sequence

1. Freeze the candidate SHA and dependency lockfile.
2. Create a clean verification environment without destroying the working tree.
3. Install from the lockfile.
4. Rebuild the database from migrations.
5. Load deterministic seed data.
6. Run typecheck, lint, tests, and production build.
7. Start the release build.
8. Execute the complete route, locale, tenant, viewport, browser, and state matrix.
9. Execute all authentication and permission-negative tests.
10. Execute the CMS publishing journey.
11. Execute the CRM acquisition-to-qualified-lead journey.
12. Execute duplicate, idempotency, notification failure, and retry tests.
13. Execute event-expiry and recap-state tests.
14. Execute visual and motion regression against the accepted foundation.
15. Execute SPIMAR visual QA against the latest approved visual specifications.
16. Execute accessibility, performance, SEO, structured-data, and security checks.
17. Inspect browser console, server logs, network failures, and integration queue.
18. Verify environment documentation and secret names.
19. Verify a fresh session can resume from control documents.
20. Produce an evidence-backed `GO` or `NO-GO`.

### Defect loop

When the audit finds a defect:

1. add it to the queue with severity and evidence;
2. change the affected accepted gate back to false;
3. fix the root cause;
4. rerun the focused test;
5. rerun every dependent regression suite;
6. update the evidence;
7. continue the audit from the affected checkpoint.

Do not waive a defect because the implementation phase was previously marked done.

### Mandatory final evidence

- release candidate SHA;
- commands executed and exit results;
- route coverage;
- browser/viewport coverage;
- visual-diff summary;
- motion comparison summary;
- CMS acceptance evidence;
- CRM acceptance evidence;
- role/RLS evidence;
- locale/RTL evidence;
- accessibility result;
- performance result;
- security result;
- remaining blockers;
- known differences;
- final gate values;
- `GO` or `NO-GO`.

`MASTER_AUDIT_RESULT=GO` requires:

```text
REFERENCE_PARITY_ACCEPTED=true
CMS_POC_ACCEPTED=true
CRM_POC_ACCEPTED=true
SPIMAR_PRODUCT_ACCEPTED=true
TYPECHECK=PASS
LINT=PASS
TESTS=PASS
BUILD=PASS
ACCESSIBILITY=PASS
SECURITY=PASS
VISUAL_REGRESSION=PASS
KNOWN_MATERIAL_DIFFERENCES=0
```

---

## 7. Dependency-aware execution queue

Claude Code must expand these epics into small tasks with acceptance criteria,
verification commands, affected routes, and evidence paths.

| ID | Objective | Depends on |
|---|---|---|
| `REC-000` | Repository and workflow baseline | — |
| `REC-010` | Fresh reference route/state/asset discovery | `REC-000` |
| `REC-020` | Current implementation capture | `REC-000` |
| `REC-030` | Frozen visual/motion/responsive gap registers | `REC-010`, `REC-020` |
| `REC-040` | Design-token and typography convergence | `REC-030` |
| `REC-050` | Motion and transition convergence | `REC-030` |
| `REC-060` | Global shell convergence | `REC-040`, `REC-050` |
| `REC-070` | Homepage convergence | `REC-060` |
| `REC-080` | Work index and representative project convergence | `REC-060` |
| `REC-090` | Remaining public route convergence | `REC-070`, `REC-080` |
| `REC-100` | Responsive/browser/accessibility convergence | `REC-090` |
| `REC-110` | Reference visual-regression gate | `REC-100` |
| `OPS-120` | CMS/CRM data model, migrations, seed, and RLS | `REC-040` |
| `CMS-130` | Auth, roles, CMS CRUD, preview, and publishing | `OPS-120` |
| `CMS-140` | Translation, evidence, media, revision, and event lifecycle | `CMS-130` |
| `CRM-150` | Public form transaction and lead creation | `OPS-120` |
| `CRM-160` | CRM queues, pipeline, assignment, activities, and tasks | `CRM-150` |
| `CRM-170` | Appointment, delivery adapter, failures, and retries | `CRM-160` |
| `SPI-180` | SPIMAR requirements/content traceability | `REC-110`, `CMS-140`, `CRM-170` |
| `SPI-190` | SPIMAR design tokens and component adaptation | `SPI-180` |
| `SPI-200` | Global homepage implementation | `SPI-190` |
| `SPI-210` | Event, exhibitor, visitor, case-study, resource, and contact routes | `SPI-200` |
| `SPI-220` | Tenant/host/event lifecycle integration | `SPI-210` |
| `SPI-230` | FR/EN/Arabic RTL implementation | `SPI-220` |
| `QA-240` | Full SPIMAR quality convergence | `SPI-230` |
| `AUD-250` | Post-implementation master audit | `QA-240` |
| `REL-260` | Release-candidate handoff | `AUD-250` |

The public reference foundation and the CMS/CRM data foundation may proceed in
carefully bounded parallel work only when they do not edit overlapping files or
invalidate comparison evidence. One primary session owns integration consistency.

---

## 8. Stop conditions and authority boundaries

Continue through ordinary implementation difficulty. Pause only for a genuine
blocker such as:

- repository or required specification is missing;
- authorization to use a required protected asset is unclear;
- an external account must be authenticated;
- required provider credentials are unavailable for the final integration test;
- a production system, DNS record, database, or deployment would be mutated without
  explicit authorization;
- a commercial or content choice has materially different public outcomes and no
  governing source;
- required SPIMAR facts or evidence are missing for publication.

When blocked:

1. finish all safe independent work;
2. write the blocker and evidence to `BLOCKERS.md`;
3. state the smallest decision or access needed;
4. recommend one safe option;
5. do not invent a value or silently reduce scope.

Local implementation, local database migrations, automated tests, and staging-safe
fixtures are authorized by this mission. Commit, push, production deployment,
production DNS, production data migration, external messages, and paid service
activation require their applicable authorization.

---

## 9. Required Claude Code working behavior

- Read this document completely before editing.
- Read the existing bootstrap and House of Yellow master prompt completely.
- Read the controlling SPIMAR documents completely.
- Use repository evidence, not chat memory, for implementation state.
- Do not stop after planning.
- Do not stop after the homepage.
- Do not stop after visual parity while CMS/CRM is incomplete.
- Do not stop after creating an admin dashboard.
- Do not claim tests passed unless the commands ran.
- Do not mark acceptance without evidence.
- Keep work in small, verifiable slices.
- Run focused validation after every slice.
- Run dependent regression before closing an epic.
- Preserve unrelated user work.
- Do not use destructive Git operations.
- Do not expose secrets.
- Update `STATUS.md`, `QUEUE.md`, `VALIDATION-MATRIX.md`, and
  `SESSION-HANDOFF.md` before ending every session.

---

## 10. Final Claude Code response contract

Lead with the real completed outcome.

Report:

1. current release candidate and gate values;
2. repaired House of Yellow routes and states;
3. visual-difference results by route and viewport;
4. motion and interaction results;
5. CMS modules and tested publishing journey;
6. CRM modules and tested lead journey;
7. SPIMAR routes, locales, event states, and tenant behavior;
8. typecheck, lint, test, build, accessibility, performance, security, and SEO
   results;
9. unresolved differences and blockers;
10. exact local commands;
11. exact next action;
12. whether the master audit is `GO` or `NO-GO`.

Never describe a partial POC or untested integration as complete.

---

## 11. Claude Code kickoff prompt

Copy the following into Claude Code at the repository root after placing this file,
the existing House of Yellow master prompt, the Session 0 bootstrap, and the SPIMAR
specification package in the repository:

```text
Read SPIMAR_HOY_PARITY_RECOVERY_CMS_CRM_MASTER_PLAN.md completely before taking any
action.

Treat it as the authoritative recovery, implementation, integration, acceptance,
and post-implementation audit contract.

Also read completely:
- CLAUDE-CODE-PUBLIC-SKILLS-WORKFLOW-BOOTSTRAP.md
- HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md
- the SPIMAR 00-MAIN-DELIVERABLES.md entry point;
- the official SPIMAR UX/content specification PDF;
- the SPIMAR technical, quality, homepage, exhibitor-journey, and platform-audit
  documents referenced by the entry point.

Use Claude Fable 5 as the primary model. Use Claude Opus 5 only if Fable 5 is
genuinely unavailable, and record the fallback.

Start with REC-000.

First preserve and audit the current repository. Verify the existing Session 0
workflow without reinstalling it when WORKFLOW_READY=true and the public-skills lock
still matches. Do not discard existing implementation work. Capture a reproducible
baseline before editing.

Then:
1. build a fresh House of Yellow reference corpus;
2. compare the current implementation route by route and state by state;
3. freeze the gap register;
4. converge the existing implementation to the measured reference;
5. pass the reference parity gate;
6. build and verify the functional CMS and CRM POC;
7. adapt the accepted foundation to the SPIMAR product requirements;
8. implement the multi-tenant, event-lifecycle, multilingual, and RTL contracts;
9. run the post-implementation master audit;
10. return GO only when every mandatory gate passes.

Do not stop after planning, documentation, a successful build, the homepage, a
polished frontend, or an admin shell.

Do not claim “100%,” “pixel-perfect,” “functional,” or “complete” without the
required visual, behavioral, database, permission, E2E, and master-audit evidence.

Do not push, deploy, change production DNS, mutate production data, or activate paid
external services without explicit authorization.

Before ending every session, update:
- docs/claude-code/STATUS.md
- docs/claude-code/QUEUE.md
- docs/claude-code/DECISIONS.md
- docs/claude-code/ASSUMPTIONS.md
- docs/claude-code/BLOCKERS.md
- docs/claude-code/VALIDATION-MATRIX.md
- docs/claude-code/SESSION-HANDOFF.md

Begin now with a concise repository-status update and REC-000. Continue
autonomously through all safe work until a genuine blocker or full completion.
```

---

## 12. First execution checkpoint expected from Claude

Claude Code’s first meaningful checkpoint must contain:

```text
ACTIVE ITEM: REC-000
WORKFLOW READY: true | false
REPOSITORY BASELINE: complete | incomplete
CURRENT BUILD: pass | fail
CURRENT TESTS: pass | fail | absent
CURRENT ROUTE COVERAGE: measured value
CURRENT REFERENCE PARITY: measured value
CMS STATUS: functional | partial | mock | absent
CRM STATUS: functional | partial | mock | absent
BLOCKERS: exact list
NEXT TASK: one queue item
```

It must include evidence paths and executed commands. General statements such as
“the implementation is close” or “the CMS is ready” are not acceptable.
