# SPIMARIMMO Template and State Matrix

**Document ID:** `SPM-TSM-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_3`  
**Date:** 31 July 2026

---

## 1. Purpose

This document converts the sitemap into reusable page families and deterministic behavior. It prevents three common failures:

1. creating one-off layouts for every route;
2. designing only ideal populated screens;
3. using a single mixed event status to control unrelated exhibitor and visitor actions.

The templates define information responsibility, not final visual styling. House of Yellow may later supply approved neutral layout, media, motion, and interaction primitives after its separate parity gate.

## 2. Template catalog

| Template ID | Family | Routes | Required composition | Primary risks |
|---|---|---|---|---|
| `TPL-01` | Global commercial homepage | `RT-HOME` | Promise/CTA; event opportunities within first three chapters; proof; method; market context; offers; resources; final action | Long-page density, unsupported proof, hero-media/performance |
| `TPL-02` | Collection/directory | events index | Title/context; current/archive separation; useful filters; cards; empty/invalid-filter recovery | Filter bloat, fake dates, completed-as-upcoming |
| `TPL-03` | Destination/market | destination detail, local multi-event home | Destination promise; current/future/past editions; approved market context/proof; next action | Thin doorway pages, duplicated event facts |
| `TPL-04` | Canonical event overview | event detail, local single-event home | Event state/facts; audience paths; proof; programme/exhibitor previews; venue; resources; contextual actions | Contradictory CTA/state, stale facts, mixed audiences |
| `TPL-05` | Event supporting detail | programme, exhibitors, practical info, event gallery | Event identity/status; specialized content; change notice; registration/action context | Premature empty routes, stale operational details |
| `TPL-06` | Exhibitor editorial landing | exhibitor hub, why, method, visibility | Decision-role promise; objections; mechanism; evidence; relevant events; progressive CTA | Generic agency copy, proof separated from claim |
| `TPL-07` | Proof collection/hub | proof hub/results/cases/testimonials/global gallery | Scope/definitions; governed evidence; filters when useful; related action | Misleading aggregation, expired rights, expected/actual confusion |
| `TPL-08` | Case study detail | case detail | Objective; context; delivery; approved outcomes; caveat; quote/media; related action | Invented causality, rights/client approval |
| `TPL-09` | Offer comparison | offers | Applicability; equal capability taxonomy; availability; price mode; terms; event/package persistence | Hidden fees, unapproved inclusions, mobile table failure |
| `TPL-10A` | Resource library | resource index | Types/topics/audience; active resources; filters; related commercial/event routes | Expired/broken assets, empty type pages |
| `TPL-10B` | Resource presentation | resource detail | Summary/preview; version/applicability; access rule; source/owner; related next step | Direct uncontextualized download, false delivery |
| `TPL-11A` | Editorial index | insights | Useful current articles; topics; optional filters; event/resource/offer links | Empty blog shell, outdated market content |
| `TPL-11B` | Topic/pillar landing | topic | Curated introduction; substantial related content; sources/evidence when needed | Thin taxonomy page, keyword duplication |
| `TPL-11C` | Article detail | article | Answer; author/reviewer; sources/dates; related content; commercial/event next step | Unsourced claims, dead-end organic traffic |
| `TPL-12` | Visitor hub | visitor hub | Find event; why visit; preparation; approved event cards; clear route to canonical event/registration | Visitor dominance on global B2B site or leakage into exhibitor form |
| `TPL-13` | Institutional/trust | about/team/partners/press | Approved identity/history/people/relationships/resources/contact | Unsupported corporate claims, expired logos/people data |
| `TPL-14` | Conversion/form | exhibitor, registration, meeting, contact | Value/context; purpose/recipient/privacy; accessible form; availability; fallback | Success before durability, long forms, lost context |
| `TPL-15` | Confirmation/status/locale | confirmations and locale root | Real state; safe facts; next step; retry/fallback; no personal URL data | False booking/delivery, cache/privacy leakage |
| `TPL-16` | Legal/policy | legal/privacy/cookies/accessibility | Version/effective date; controller/owner; structured sections; preferences/contact | Stale or copied legal meaning |
| `TPL-17` | System/recovery | 404/500/maintenance | Localized explanation; recovery actions; event/home/contact fallback | Dead end, technical leakage, untracked failure |

## 3. Universal page-state contract

Every public template must define the applicable states below before high-fidelity design.

| State ID | State | Required behavior |
|---|---|---|
| `ST-DEFAULT` | Approved content available | Complete semantic structure, correct actions, metadata, analytics, and locale |
| `ST-PARTIAL` | Optional module absent | Preserve narrative coherence; remove module/claim cleanly; never fill with invented copy/data |
| `ST-EMPTY` | Collection has no publishable items | Explain absence, clear invalid filters, and provide a safe parent/alternative; do not publish thin page when avoidable |
| `ST-LOADING` | Client-only interactive subset loading | Keep server-rendered critical content; use non-shifting accessible progress for the subset |
| `ST-REVALIDATING` | Content refresh in progress | Continue last valid content where safe; do not show contradictory mixed versions |
| `ST-RECOVERABLE-ERROR` | Optional/provider action failed | Preserve user context/non-sensitive values; explain retry/fallback; log safe failure class |
| `ST-TERMINAL-ERROR` | Page/action cannot continue safely | No false success; provide alternate contact/route and correlation support without exposing internals |
| `ST-UNAVAILABLE` | Action/content intentionally unavailable | State why at the appropriate level and show an approved alternative |
| `ST-NOT-FOUND` | Unknown/unpublished route/object | Localized 404; no object existence/privacy leakage; relevant directory/home recovery |
| `ST-PREVIEW` | Draft/editorial preview | Correct host/locale/state, visible preview context, protected/noindex, no production analytics/conversion side effects |
| `ST-REDUCED-MOTION` | User prefers reduced motion | Remove non-essential parallax/reveal/scrub/autoplay; retain content and controls |
| `ST-RTL` | Arabic | Real logical RTL composition, reading/focus order, localized validation/data, no mirrored brand/media artifacts |

## 4. Event state precedence

Public event behavior is derived in this order:

1. **Safety/exception state** — cancelled or postponed overrides normal conversion promotion.
2. **Lifecycle validity** — dates/timezone and lifecycle must be a valid combination.
3. **Audience-specific availability** — exhibitor-sales and visitor-registration states control their own actions only.
4. **Content readiness** — programme, participant, venue, proof, media, offers, and resources publish independently when approved.
5. **Locale readiness** — a route is public only for production-complete locales.

No page or component may manually contradict the derived result.

## 5. Event lifecycle matrix

| Lifecycle | Event overview | Discovery/order | Copy tense/metrics | Child routes | Default alternative |
|---|---|---|---|---|---|
| `announced_undated` | Show destination/proposition and explicit date pending | Future announcements after dated opportunities | No fabricated date/countdown; forecast only when approved | Programme/practical usually withheld; enquiry/waitlist may exist | Notify/contact/brochure |
| `scheduled` | Full validated dates/timezone and appropriate actions | Featured/open/upcoming order | Expected values explicitly labelled | Publish each child only when ready | Relevant event/next action |
| `live` | Live status with verified current times and updates | Current/live placement without hiding scheduled priorities | Current/expected distinction remains | Programme/practical/updates prominent | On-site practical/contact |
| `completed` | Results/recap/proof and next edition | Archive/completed after current events | Approved actuals or explicit unavailable results | Gallery/cases may become primary; invalid future actions removed | Next relevant edition |
| `archived` | Historical record when substantial; otherwise consolidation/redirect review | Archive only | Historical context and actuals only | Keep useful approved children; remove obsolete actions | Destination/event series |
| `postponed` | Prominent status and update date; retain authoritative URL | Excluded from normal dated ordering unless specifically labelled | No old countdown; facts explicitly provisional | Programme/registration actions suppressed or reviewed | Updates/contact/alternative event |
| `cancelled` | Authoritative cancellation and approved next step | Excluded from opportunity ordering | No availability/promotion language | Invalid forms/actions closed; useful notice retained | Contact/refund info if applicable/other event |

`draft` never renders publicly except controlled preview.

## 6. Exhibitor-sales state matrix

| State | Exhibitor CTA | Form behavior | Offer behavior | Card label |
|---|---|---|---|---|
| `planned` | Brochure/contact/interest only | No inventory implication | Global/proposal context only | `Ouverture prochaine` only when approved |
| `open` | `Devenir exposant` / `Demander une proposition` | Event context retained and durable submission | Approved applicable versions shown | `Demandes exposants ouvertes` |
| `limited` | High-intent enquiry with honest limited status | Same form; no guaranteed inventory | Availability caveat/confirmed options | `Disponibilités limitées` |
| `sold_out` | Waitlist/next edition/contact if operationally approved | Stand request closed or converted to explicit waitlist | Sold-out package/event state | `Complet exposants` |
| `closed` | Next edition/brochure/contact | No active stand request | Historical/non-actionable offers hidden | `Demandes closes` |

Exhibitor-sales state never closes visitor registration by itself.

## 7. Visitor-registration state matrix

| State | Visitor CTA | Form behavior | Confirmation behavior | Card label |
|---|---|---|---|---|
| `planned` | Preparation/updates only | Registration unavailable | None | `Inscriptions prochainement` when approved |
| `open` | `S’inscrire` | Short event-specific form | On-screen + transactional acknowledgement with verified facts | `Inscriptions ouvertes` |
| `waitlist` | `Rejoindre la liste d’attente` | Explicit purpose/outcome; no admission promise | Waitlist status and real next step | `Liste d’attente` |
| `full` | Updates/alternative event | Closed; optional approved waitlist only | No guaranteed admission | `Complet visiteurs` |
| `closed` | Practical info/next event | Closed with explanation | Existing confirmations remain valid according to operations | `Inscriptions closes` |

Visitor-registration state never closes exhibitor sales by itself.

## 8. Template-specific state matrix

| Template | Mandatory non-default states for wireframes |
|---|---|
| `TPL-01` | No hero video (poster), no approved trust metric, no future event, no case/testimonial, offers hidden, reduced motion, mobile, Arabic RTL |
| `TPL-02` | No current events, archive only, invalid/no filter results, undated announcements, cancelled/postponed card, mobile filters |
| `TPL-03` | One event only, multiple events, future market with no date, historical-only destination, no approved market statistic |
| `TPL-04` | Every lifecycle above; exhibitor open/closed independent of visitor open/closed; no programme/exhibitors/gallery; missing venue; reduced motion/RTL |
| `TPL-05` | Pending/empty programme, withdrawn exhibitor, changed programme item, venue change, no gallery rights, registration closed |
| `TPL-06` | Evidence pending, long/short content, no approved artifact, contextual CTA unavailable |
| `TPL-07` | No publishable proof, expired/withdrawn item, filters with zero results, expected vs actual, transcript/media fallback |
| `TPL-08` | No video, partial approved outcomes, attribution caveat, withdrawn client permission, related event unavailable |
| `TPL-09` | Proposal-only pricing, public pricing, included/optional/unavailable/pending/withdrawn, limited/sold-out/closed, mobile comparison, no recommended plan |
| `TPL-10A/B` | Ungated/gated, expired/replaced/broken file, delivery delayed, locale unavailable, no related content |
| `TPL-11A/B/C` | Sparse inventory, missing topic threshold, outdated statistic review, long citation/source list, no media |
| `TPL-12` | No current event, registration planned/waitlist/full/closed, visitor content pending, mobile/RTL |
| `TPL-13` | No approved team/partner/press inventory, missing portrait/logo, expired relationship, long legal name/content |
| `TPL-14` | All form states in PRD §9.7, scheduler unavailable, integration delayed, duplicate linked, rate limited, action closed, RTL validation |
| `TPL-15` | Durable success/integration delayed/provider-confirmed booking/fallback/expired browser state/invalid direct access |
| `TPL-16` | Long content, table/list, updated version notice, preference tool unavailable fallback, RTL |
| `TPL-17` | 404, 500, offline/provider issue, host inactive, localized recovery, no leaking tenant data |

## 9. Form-state contract

All `TPL-14` instances implement:

```text
idle
focused/touched
invalid
submitting
submitted
duplicate-linked
integration-delayed
recoverable-error
terminal-error
rate-limited
consent-required
unavailable/closed
```

Rules:

- server validation is authoritative;
- visible summary and field errors are linked programmatically;
- first invalid field receives focus after submission;
- non-sensitive values survive recoverable errors;
- success follows durable storage, not a client click or third-party timeout;
- provider failure creates an honest fallback and retryable operational job;
- confirmation copy states the real next step and does not invent an SLA.

## 10. Responsive, accessibility, and motion contract

Every template needs intentional variants for:

| Context | Required design response |
|---|---|
| Wide desktop | Editorial composition may layer media/content while preserving semantic/focus order |
| Laptop | Reduce overlap and density without removing meaning or actions |
| Tablet | Touch-safe two/one-column transformation; no hover-only facts |
| Mobile | Native vertical hierarchy, art-directed media, one contextual persistent action at most |
| RTL | Logical inline/block order, readable numerals/dates, intentional alignment, unchanged media truth |
| Reduced motion | Static poster/initial state, no essential scroll-bound understanding, user-controlled media |
| Zoom/reflow | No clipping, horizontal reading requirement, or sticky overlay covering focus/content |

Target-size, contrast, focus, semantic, caption/transcript, and screen-reader requirements map to `ACC-001`–`ACC-012`. Hero/video and client-JavaScript behavior map to `PER-001`–`PER-010`.

## 11. House of Yellow foundation boundary

After parity approval, the reference implementation may contribute:

- typography mechanics and fluid scales;
- grid/container/layout primitives;
- rounded control geometry and interaction states;
- media planes, masks, art direction, and poster behavior;
- header/footer transition patterns;
- motion timing/easing/reveal patterns;
- responsive composition techniques;
- accessible reduced-motion variants.

It may not contribute House of Yellow navigation, branding, claims, project taxonomy, agency copy, contact data, or page inventory. SPIMAR route/template/state IDs remain controlling.

## 12. Template acceptance

Gate 3 passes when:

- every route in `SPM-RTI-001` maps to exactly one primary template;
- every template has ideal, partial/empty, error/unavailable, responsive, RTL, and accessibility expectations;
- event CTAs can be derived without contradictory state combinations;
- no template depends on invented event/proof/offer/content;
- confirmation and preview/system surfaces are non-indexable and privacy safe;
- the wireframe phase can enumerate screens without reopening the sitemap.
