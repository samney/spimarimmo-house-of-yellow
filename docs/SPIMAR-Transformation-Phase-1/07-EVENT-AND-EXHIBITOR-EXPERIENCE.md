# 07 — Event and Exhibitor Experience

## One event truth

One canonical event object controls event cards, destination pages, event detail, forms, resources, email, metadata, structured data, CRM context, and expiry behavior.

## Independent state axes

| Axis | States |
|---|---|
| Lifecycle | draft, announced, scheduled, live, completed, archived, postponed, cancelled |
| Exhibitor sales | planned, open, limited, sold out, closed |
| Visitor registration | planned, open, waitlist, full, closed |
| Provider readiness | ready, delayed, unavailable |

Precedence rules:

- cancelled/postponed overrides obsolete action;
- ended/archived never displays open registration from stale content;
- durable submission may succeed while CRM/email/calendar is delayed;
- meeting is confirmed only after accepted capacity/provider result;
- event state changes update page, form, metadata, resource, and CRM behavior consistently.

## Event discovery

Filters may include destination, status, audience availability, and period. Required states:

- current/upcoming;
- destination context;
- archive/recap;
- postponed/cancelled;
- zero result with useful reset;
- incomplete content and unavailable media.

## Event page composition

1. Local hero: destination, event, date/timezone, venue, state.
2. Split exhibitor/visitor actions derived from availability.
3. Verified proof and event history.
4. Programme.
5. Exhibitors present, when approved.
6. Practical information and access.
7. Real media gallery/video.
8. Brochure/resource.
9. Exhibitor method and offers.
10. Visitor preregistration.
11. FAQ, contact, alternatives, and next event.
12. SEO, structured data, expiry/recap state.

## Exhibitor decision journey

```text
ORIENT -> SELECT -> EVALUATE -> COMPARE -> COMMIT -> MEET
```

- orient by role and objective;
- select event/destination;
- evaluate proof and method;
- compare approved offers and applicability;
- request brochure, proposal, or stand conversation;
- schedule a qualified meeting.

The commitment ladder is progressive:

```text
view -> resource -> enquiry -> proposal request -> meeting
```

Each step preserves tenant, locale, event, offer, source, campaign, referrer, CTA placement, consent notice, and correlation ID.

## Offers

Standard, Premium, and Sponsor are capability groupings—not promises of price or availability. Public fields require commercial/legal approval. Proposal-only, limited, sold-out, and closed states must be supported.

## Acceptance

- the same event state appears consistently across all surfaces;
- no invented date, venue, capacity, exhibitor, price, or result;
- role-based exhibitor objections are answered before high-commitment forms;
- every action reaches a durable, recoverable outcome;
- event expiry, cancellation, sold-out, provider delay, and resource failure are tested;
- mobile and RTL retain two clear audience paths.

