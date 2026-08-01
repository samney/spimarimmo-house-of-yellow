# 09 — Content, Evidence, and Media

## Content architecture

Core structured objects:

- site/tenant and locale;
- page and reusable block;
- destination and event;
- exhibitor and partner/institution;
- offer and capability;
- proof metric and evidence source;
- case study and testimonial;
- resource and article/insight;
- team/contact/legal profile;
- media asset and derivative;
- form definition and consent notice.

Content is structured enough for reuse and governance without making editorial work depend on raw database tables.

## Evidence anatomy

Every sensitive proof item supports:

```text
definition + value + period + source + scope + caveat + owner + approval + expiry + withdrawal
```

Requirements:

- distinguish preregistrations, attendance, appointments, leads, opportunities, and attributed sales;
- show period and source near material public metrics;
- retain approved source evidence and reviewer history;
- allow withdrawal from every public placement;
- never turn a placeholder into a published claim;
- never invent partners, logos, quotes, dates, capacities, prices, or results.

## Media record

Each asset requires:

- stable ID and content owner;
- source and rights/consent status;
- capture date/event/destination when relevant;
- media type, width, height, duration, aspect ratio;
- focal point and art-directed crops;
- responsive derivatives and format;
- poster/thumbnail;
- locale-specific alt text/caption/transcript;
- allowed placements and audience;
- publication, expiry, withdrawal, and replacement state.

## Delivery behavior

- responsive `srcset`/sizes and AVIF/WebP where appropriate;
- immutable versioned URLs;
- no layout shift;
- noncritical media lazy-loaded;
- video never blocks the primary action;
- no mobile/constrained-network hero video preload;
- poster and visible failure alternative for every video;
- pause/offscreen and reduced-motion behavior;
- captions/transcripts where speech carries information;
- safe CDN/provider boundary; no unauthorized production hotlinks.

## Relationship to deferred reference media

The historical House of Yellow media manifest contained fallback-only mappings. Phase 1 does not activate or reproduce those assets. It replaces the mapping with authorized SPIMARIMMO assets and a production-ready media model.

## Content readiness

Use explicit states:

```text
DRAFT -> IN_REVIEW -> APPROVED -> SCHEDULED -> PUBLISHED -> EXPIRED/WITHDRAWN/ARCHIVED
```

Translation readiness is independent per locale. A published French record must not cause incomplete English or Arabic content to publish.

## Owner content package

Required before final production acceptance:

- verified event dates, timezones, venues, and statuses;
- approved event photos/video and rights;
- approved metrics, definitions, periods, and sources;
- partner/exhibitor logos and permissions;
- case studies and testimonials with consent;
- offer capability, availability, pricing policy, tax/conditions where public;
- brochures, guides, calendars, plans, and versions;
- contacts, legal notices, privacy/cookie text, and data-processing decisions;
- translations and reviewers.

## Acceptance

- every public content component maps to a governed object or honest fallback;
- no broken asset, missing poster, ambiguous metric, or expired CTA;
- media budgets and accessibility pass;
- public residue scan finds no House of Yellow content/assets/analytics IDs;
- CMS can create, review, localize, publish, revise, withdraw, and audit these objects.

