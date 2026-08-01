# Component Architecture and Contracts

**Document ID:** `SPM-DS-CMP-001`  
**Status:** `COMPLETE_FOR_GATE_7`  
**Date:** 31 July 2026

## 1. Component doctrine

A SPIMAR component exists when it owns a repeatable responsibility, state contract, accessibility behavior, or structured content relationship. Visual similarity alone does not justify a component.

Rules:

- composition belongs to templates; behavior and bounded responsibility belong to components;
- one component may expose controlled variants, never arbitrary theme/color/layout props;
- event state is derived from canonical lifecycle and audience availability inputs, not manually styled labels;
- links navigate; buttons perform actions; neither substitutes for the other;
- every interactive component defines keyboard, focus, disabled, loading, error, RTL, and reduced-motion behavior where applicable;
- components render controlled absence honestly instead of inventing placeholder content;
- public components never receive raw HTML or unvalidated external URLs without an explicit safe-content contract.

## 2. Component catalog

### 2.1 Shell and navigation

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-SHL-001` | `GlobalHeader` | Parent identity, primary navigation, locale, exhibitor CTA, visitor entry | light, dark/media, compact, mobile trigger, RTL |
| `DSC-SHL-002` | `LocalEventHeader` | Canonical event identity, local navigation, lifecycle and audience availability | scheduled/live/completed/exception, mobile, RTL |
| `DSC-SHL-003` | `MobileNavigationDrawer` | Full navigation and audience actions with focus containment/return | global/local, LTR/RTL |
| `DSC-SHL-004` | `LocaleControl` | Expose real locale equivalents without forced redirect | full/compact, unavailable locale, RTL |
| `DSC-SHL-005` | `Breadcrumbs` | Nested orientation and structured-data parity | light/dark, overflow-safe, RTL |
| `DSC-SHL-006` | `GlobalFooter` | Audience, contact, company, legal, locale, social routes | full/compact, host-aware, RTL |
| `DSC-SHL-007` | `PreviewBanner` | Make protected draft/host/locale/state preview unmistakable | draft, scheduled, expired |

### 2.2 Actions and orientation

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-ACT-001` | `Button` | Primary, secondary, quiet, and destructive actions | link/button semantics, icon-leading/trailing, loading, disabled, full-width mobile |
| `DSC-ACT-002` | `TextLink` | In-flow navigation with clear destination | inline, standalone, external, download |
| `DSC-ACT-003` | `ContextualStickyAction` | Preserve one relevant action after its source leaves view | exhibitor/visitor/contact; suppressed on conflicts |
| `DSC-ACT-004` | `AudiencePathPanel` | Separate exhibitor and visitor questions/actions over shared event truth | both/open, one closed, both unavailable, mobile |
| `DSC-ACT-005` | `SectionIndex` | Orient long editorial/evidence content | active/current, mobile disclosure, RTL |

### 2.3 Status and feedback

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-STS-001` | `LifecycleNotice` | Announced, live, completed, archived, postponed, or cancelled truth | inline, page-level exception, card-level |
| `DSC-STS-002` | `AudienceAvailability` | Exhibitor-sales or visitor-registration state | planned/open/limited/waitlist/full/sold-out/closed |
| `DSC-STS-003` | `ProviderStatus` | Delivery, CRM, email, scheduler, or resource state | ready/delayed/unavailable/retry/manual fallback |
| `DSC-STS-004` | `UpdateStamp` | Source owner, publication/review date, and freshness | standard/stale/review-pending |
| `DSC-STS-005` | `StateNotice` | General information, success, warning, error, or unavailable state | inline/section/page; action optional |

### 2.4 Event and destination

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-EVT-001` | `EventCard` | City, event identity, date/state, audience availability, relevant action | dated/undated/live/completed/postponed/cancelled; missing media; RTL |
| `DSC-EVT-002` | `EventRail` | Prioritized current/future event opportunities | controlled rail/grid/list, empty, reduced motion |
| `DSC-EVT-003` | `DestinationCard` | Market/place context and related edition availability | current/future/history-only/no statistic |
| `DSC-EVT-004` | `EventFactStrip` | Verified date, venue, city, timezone, and update context | complete/partial/changed, mobile/RTL |
| `DSC-EVT-005` | `EventAudiencePanel` | Shared event facts with independent exhibitor/visitor next steps | independent availability matrix |
| `DSC-EVT-006` | `ProgrammeItem` | Time, title, participant, location, and change state | scheduled/changed/cancelled/TBC |
| `DSC-EVT-007` | `ParticipantRow` | Approved exhibitor/speaker/partner identity and role | media/no-media/withdrawn |
| `DSC-EVT-008` | `PracticalInfoGroup` | Venue, access, accessibility, time, map/contact detail | complete/changed/missing accessibility data |

### 2.5 Brand, media, and campaign

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-BRD-001` | `CampaignHero` | Five-second event/property/trust/Morocco signal and truthful action | media/poster/type-only, parent/local, mobile, RTL, reduced motion |
| `DSC-BRD-002` | `CityEditionMark` | City, edition, date, and lifecycle as reusable identity grammar | Latin/Arabic, dated/undated, compact/display |
| `DSC-MED-001` | `MediaPlane` | Art-directed image/video/poster with focal point and fallback | landscape/portrait/square/campaign; missing/withdrawn |
| `DSC-MED-002` | `VideoPlayer` | Consent-aware, controllable documentary/campaign video | poster, playing, paused, captions, error, reduced motion |
| `DSC-MED-003` | `MediaCaption` | Context, date, edition, rights/editorial meaning | short/extended/source-linked |
| `DSC-MED-004` | `Gallery` | Rights-cleared media collection with accessible controls | grid/detail, empty, withdrawn, reduced motion |

### 2.6 Proof, method, case, and offers

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-PRF-001` | `ProofBlock` | Claim/mechanism next to definition, source, period, caveat, and action | qualitative/quantitative/expected/actual/pending |
| `DSC-PRF-002` | `EvidenceMetric` | One approved measure with unit, scope, source, period, and status | expected/actual/range/unavailable |
| `DSC-PRF-003` | `CaseCard` | Objective, intervention, approved outcome status, context | result/no-result/media/no-media/permission withdrawn |
| `DSC-PRF-004` | `Testimonial` | Approved quote, attribution, role, organization, date/context | portrait/no portrait/withdrawn |
| `DSC-PRF-005` | `MethodSequence` | Before/during/after responsibilities and artifacts | full/partial/no approved artifact/mobile |
| `DSC-OFR-001` | `OfferComparison` | Equal capability taxonomy and applicability across offers | proposal/public price/no recommended plan/mobile |
| `DSC-OFR-002` | `CapabilityRow` | Included, optional, unavailable, pending, or terms-required capability | all commercial states; label + symbol |
| `DSC-OFR-003` | `OfferSummary` | Package identity, applicability, commercial state, next action | open/limited/sold-out/closed/proposal-only |
| `DSC-PRF-006` | `PartnerMarks` | Approved organizations with context and active-period rules | compact/full/empty/expired; never anonymous placeholder wall |

### 2.7 Resources and editorial

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-CNT-001` | `ResourceCard` | Type, audience, locale, version, access, applicability | ungated/gated/replaced/expired/broken/locale unavailable |
| `DSC-CNT-002` | `ResourceAccessPanel` | Explain access/delivery outcome before action | direct/request/delayed/unavailable |
| `DSC-CNT-003` | `ArticleCard` | Topic, answer promise, author/reviewer, date, related path | media/no-media/stale-review |
| `DSC-CNT-004` | `ArticleMeta` | Author, reviewer, source, publication/update date | standard/updated/review-pending |
| `DSC-CNT-005` | `SourceList` | Sources, definitions, dates, and caveats | short/long/grouped, RTL |
| `DSC-CNT-006` | `Disclosure` | FAQ, detail, or definition expansion | default/open/disabled; keyboard and reduced motion |

### 2.8 Forms and conversion outcomes

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-FRM-001` | `FormShell` | Audience, purpose, recipient, context, privacy, form, and real outcome | brochure/exhibitor/visitor/meeting/contact |
| `DSC-FRM-002` | `Field` | Label, control, optional/required, help, error, retained value | text/email/tel/textarea/select/date; LTR/RTL mixed data |
| `DSC-FRM-003` | `ChoiceGroup` | Semantic radio/checkbox selection with descriptions | single/multiple/invalid/disabled |
| `DSC-FRM-004` | `ConsentField` | Purpose-specific acknowledgement and optional marketing consent | required/optional/versioned/invalid |
| `DSC-FRM-005` | `ErrorSummary` | Submission-level errors linked to invalid controls | single/multiple/server/rate-limit |
| `DSC-FRM-006` | `SubmissionStatus` | Submitting, durable success, duplicate-linked, delayed, or error truth | every PRD form state |
| `DSC-FRM-007` | `ConfirmationPanel` | State exactly what succeeded, what did not, and next step | enquiry/registration/resource/meeting/provider-delayed |
| `DSC-FRM-008` | `ProviderFallback` | Alternate form/phone/email/manual route without false provider success | scheduler/email/CRM/resource/WhatsApp unavailable |

### 2.9 System and recovery

| ID | Component | Responsibility | Required variants |
|---|---|---|---|
| `DSC-SYS-001` | `EmptyState` | Explain valid absence and offer a relevant safe next step | collection/filter/content/locale |
| `DSC-SYS-002` | `ErrorRecovery` | Localized safe failure without internal, personal, provider, or tenant leakage | recoverable/terminal/404/500/offline/host inactive |
| `DSC-SYS-003` | `LoadingPlaceholder` | Reserve space for client-only subsets without hiding server-rendered critical content | list/media/action; reduced motion |
| `DSC-SYS-004` | `ProtectedPreviewFrame` | Prevent production effects and reveal draft host/locale/state | active/expired/unauthorized |

## 3. Component anatomy contracts

### 3.1 `EventCard`

Required anatomy:

1. canonical event link;
2. city/country and edition identity;
3. lifecycle/date label;
4. exhibitor availability;
5. visitor availability;
6. approved media or purposeful type-only fallback;
7. one context-derived primary destination/action;
8. accessible name containing enough event/state context.

No authoring prop may directly force a green/open or red/closed style.

### 3.2 `ProofBlock`

Required anatomy:

1. claim or mechanism;
2. expected/actual/qualitative status;
3. value/unit when approved;
4. definition and scope;
5. source and period;
6. caveat/approval status;
7. relevant case/event/offer/action.

If items 2–6 are incomplete, the component suppresses quantitative display or uses an explicitly approved qualitative mode.

### 3.3 `FormShell`

Required anatomy:

1. retained host/event/offer/resource/audience context;
2. purpose, recipient category, and real outcome;
3. privacy summary and linked notice;
4. minimal fields;
5. consent/acknowledgement;
6. submit and progress state;
7. error summary and field errors;
8. durable outcome and provider state;
9. approved fallback.

Client submission or third-party success never defines durable success.

## 4. Variant governance

Allowed variant axes are finite and semantic:

- `surface`: light, dark, media, gold;
- `density`: expressive, standard, dense, transactional;
- `direction`: LTR, RTL—normally inherited, not passed manually;
- `size`: only where the content responsibility truly changes;
- `state`: derived lifecycle/availability/provider/form state;
- `media`: image, video, poster, type-only fallback;
- `host`: global or local event shell;
- `audience`: exhibitor or visitor when the component responsibility requires it.

Rejected generic axes include arbitrary color, arbitrary radius, arbitrary shadow, arbitrary alignment, and `isFancy`/`featured` without a content/state definition.

## 5. Composition boundary

Templates own:

- chapter order;
- grid spans and responsive transformation;
- which approved modules appear;
- content relationships and adjacent proof/action;
- dark/light/editorial rhythm.

Components own:

- anatomy;
- semantic variants;
- interaction and state behavior;
- accessibility;
- token consumption;
- content validation and safe absence.

This boundary prevents page-specific component forks and prevents the component library from becoming a page builder with unlimited visual freedom.

