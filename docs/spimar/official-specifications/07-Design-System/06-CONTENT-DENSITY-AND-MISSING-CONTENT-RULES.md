# Content Density and Missing-Content Rules

**Document ID:** `SPM-DS-CNT-001`  
**Status:** `COMPLETE_FOR_GATE_7_REAL_CONTENT_STILL_REQUIRED`  
**Date:** 31 July 2026

## 1. Principle

The design system must remain credible with real, long, short, missing, pending, expired, withdrawn, and untranslated content. It cannot depend on ideal placeholder copy or a fully populated media library.

The system distinguishes:

- required truth: without it the object/route cannot publish;
- conditional content: shown only when approved and applicable;
- supporting content: safely removable without changing the core decision;
- controlled fallback: an intentional alternative, never invented filler.

## 2. Content-shape contracts

These are authoring targets, not truncation rules. Components expand when approved content legitimately exceeds them.

| Content | Preferred shape | Failure response |
|---|---|---|
| Campaign/hero line | One proposition with one clear audience/action | Re-edit per locale; do not shrink into microtype |
| Event card title | Canonical city/edition identity, normally 1–3 lines | Expand card/list; no ellipsis on distinguishing words |
| Date/state | Locale-aware, explicit, short | Use undated/planned state rather than fake date |
| CTA | Verb + real outcome | Wider/wrapped control; never shorten into misleading action |
| Proof value | Value + unit + definition + scope + period/source | Suppress quantitative display or use approved qualitative evidence |
| Offer capability | One aligned capability concept | Use disclosure for terms, not hidden tooltip-only meaning |
| Form label | Persistent, direct label | Wrap; placeholder never replaces label |
| Error | What happened + how to recover | Allow multiple lines and summary; do not expose internals |
| Resource title | Specific artifact and applicability | Wrap; include version/locale separately |
| Legal/consent | Full approved meaning | Calm reading layout; never truncate or hide behind inaccessible affordance |

## 3. Missing-content matrix

| Missing/blocked input | Required design response | Prohibited response |
|---|---|---|
| Hero video | Approved poster; otherwise city/date/type-led hero | Blank dark hero or unrelated stock video |
| Poster and video | Purposeful signal composition with facts and action | Gradient/abstract filler implying media exists |
| Event date | `Date à confirmer`/approved equivalent and planned path | Invented countdown/date |
| Venue/access | Explicit pending/changed state; suppress unsafe directions | Unverified map or address |
| Metrics/results | Remove number; show approved mechanism/deliverable if available | Placeholder metric, `0`, or unsourced qualitative superlative |
| Case/testimonial | Use method/approved evidence; omit module if needed | Fabricated quote, logo, person, outcome |
| Partner marks | Omit wall and retain owned trust/method content | Anonymous/grayed fake logos |
| Price | Proposal-only mode and equal capability comparison | Fake `Contact us` price column or invented range |
| Programme | Pending state on canonical event; withhold thin child route if needed | Empty schedule grid implying a programme exists |
| Participants | Approved records only; meaningful empty/pending state | Unapproved logo/portrait/name |
| Gallery rights | Type-led recap/context or suppress gallery route/module | Generated crowd as documentary proof |
| Resource file | Replaced/expired/broken state and approved alternative | Download action that 404s or false delivery success |
| Locale copy | Withhold route/module or approved fallback | Silent critical-language mixing |
| Provider | Durable local state plus delayed/manual fallback | Generic success page or lost submission context |

## 4. Event content readiness

Minimum publishable event overview:

1. canonical identity and destination;
2. valid lifecycle;
3. verified date state and timezone where dated;
4. verified venue state;
5. independent exhibitor and visitor availability;
6. proposition and intended audience;
7. current update owner/date;
8. at least one safe next action or explicit no-action alternative;
9. locale completeness and metadata.

Programme, exhibitors, gallery, proof, resources, and offers publish independently when their records and rights are ready. Their absence does not create duplicated event pages.

## 5. Evidence readiness

Quantitative evidence publishes only when all fields are approved:

- measure/value and unit;
- expected versus actual classification;
- definition and calculation method;
- scope/population;
- period/date;
- source owner;
- caveat/limitations;
- approval and expiry/review state;
- related event/case/offer where applicable.

Gold marks orientation or action; it never implies that evidence is verified.

## 6. Offer readiness

Every offer uses the same capability taxonomy. A capability state is one of:

`included · optional · unavailable · pending confirmation · withdrawn · terms required`.

Price mode is one of:

`proposal only · public fixed · public from/range with approved terms`.

No package is marked “recommended” without an approved suitability rule and supporting explanation. Event sales state can close or limit an offer without changing historical/evergreen offer definitions.

## 7. Localization resilience

- author content per locale; do not mechanically preserve Latin line count;
- translate meaning, outcome, consent, and state—not only labels;
- localize date/time/number/phone presentation;
- isolate Latin brand/proper-name runs in Arabic;
- preview and QA longest realistic French and Arabic fixtures;
- record each host’s production-complete locale set;
- Arabic publication requires fluent editorial review plus RTL visual QA.

## 8. Density and repetition controls

Reject:

- more cards when a structured row, list, table, or editorial plane is clearer;
- repeating the same claim in hero, proof bar, cards, and final CTA;
- logo quantity as a substitute for evidence;
- multiple large gold fields competing on one viewport;
- three simultaneous sticky/floating actions;
- pill labels around ordinary metadata;
- tiny captions used to compensate for weak hierarchy;
- decorative dashboard summaries on marketing pages.

Prefer:

- one dominant question per chapter;
- claim/mechanism/evidence/action adjacency;
- alternating signal, editorial, evidence, and transactional modes;
- structured lists and dividers for dense facts;
- a single contextual next action plus safe alternatives;
- removal of unapproved modules over filler.

## 9. CMS authoring controls

The CMS exposes controlled variants and structured fields, not arbitrary visual styling. Authoring validation should detect:

- missing required event facts;
- contradictory lifecycle/date/availability combinations;
- missing proof definition/source/period;
- expired rights or relationships;
- broken/expired resources;
- untranslated critical meaning;
- missing poster/fallback;
- unsupported public price/partner/result;
- excessive heading/CTA lengths requiring editorial review;
- inaccessible alt/caption/transcript omissions.

Warnings inform safe preview; P0 truth/rights/accessibility failures block publication.

## 10. Content QA fixtures

Phase 08 and implementation stories must include:

- long French proposition and CTA;
- real Arabic RTL headline, consent, error, date range, and mixed Latin venue/phone values;
- undated, postponed, cancelled, live, completed, and archived events;
- exhibitor open while visitor closed and the inverse;
- no hero media, no metrics, no partners, no testimonials, no price;
- long source/caveat set;
- broken/replaced/expired resource;
- provider-delayed submission and unavailable scheduler;
- 404/500/inactive host without tenant leakage.

