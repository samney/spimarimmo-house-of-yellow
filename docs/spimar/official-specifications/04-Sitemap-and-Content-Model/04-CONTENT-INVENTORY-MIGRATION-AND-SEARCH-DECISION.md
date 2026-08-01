# Content Inventory, Migration, and Search Decision

**Document ID:** `SPM-CIM-001`  
**Version:** 1.0  
**Status:** `COMPLETE_DRAFT_WITH_OWNED_CONTENT_BLOCKERS`  
**Date:** 31 July 2026

---

## 1. Phase 03 content conclusion

The content **model and page shapes** are sufficiently defined for journeys and wireframes. The production **content inventory is not yet complete enough** to authorize final page publication or high-fidelity truth claims.

This distinction is deliberate:

- structural readiness answers what the product must support;
- content readiness answers whether a real page/locale can publish;
- migration readiness answers where legacy URLs/records go;
- none of these permits invented dates, venues, proof, partners, prices, outcomes, or rights.

## 2. Structured content-to-surface inventory

| Content object | Primary surfaces | Required Release 1 state | Current readiness | Owner/input |
|---|---|---|---|---|
| Destination | Homepage, events index, destination detail, event | Stable ID, localized name/slug, geography, market context, active editions | `MODEL_READY / REAL_PORTFOLIO_PENDING` | CTO + event operations |
| Event/edition | Cards, event family, forms, metadata, confirmations | Canonical host/URL, locale completeness, dates/timezone, lifecycle and two availability axes | `MODEL_READY / FACTS_PENDING` | Event operations |
| Venue | Event/practical/confirmation | Verified address/access/accessibility/map data | `MODEL_READY / RECORDS_PENDING` | Event operations |
| Exhibitor/developer | Event participants, cases, testimonials, proof | Approved identity, public profile, rights, relationship type | `MODEL_READY / APPROVAL_PACK_PENDING` | Commercial + legal/rights |
| Event participation | Event exhibitor list, logo claims, cases | Edition-specific status and public approval | `MODEL_READY / RECORDS_PENDING` | Event operations + commercial |
| Offer/package | Offers, event, enquiry | Version, applicability, capabilities, availability, pricing mode, terms approval | `MODEL_READY / PUBLIC_VERSION_PENDING` | Commercial + finance/legal |
| Metric/evidence | Homepage, proof, event, case, method | Definition, expected/actual, scope, period, source, methodology, owner, approval, expiry | `MODEL_READY / VERIFIED_SET_PENDING` | Evidence/data owners |
| Campaign proof | Method, visibility, case, event | Artifact, campaign phase, event/client context, measured outcome, rights | `MODEL_READY / ARTIFACTS_PENDING` | Marketing + evidence/rights |
| Case study | Homepage, proof index/detail, event | Objective, delivery, approved results/caveat, related records, client approval | `MODEL_READY / APPROVED_CASES_PENDING` | Commercial + client/legal |
| Testimonial | Homepage, proof, case | Identity/role/context/language/transcript/captions/permission | `MODEL_READY / RIGHTS_PENDING` | Marketing + legal/rights |
| Gallery/media asset | Hero, event, proof, case | Origin/context, rights, derivatives, alt/caption, documentary/illustrative label | `MODEL_READY / MEDIA_SHORTLIST_PENDING` | Marketing + legal/rights |
| Resource/download | Resource hub/detail, event, conversions | Locale/version/file/access rule/owner/effective-expiry/replacement | `MODEL_READY / ACTIVE_FILES_PENDING` | Marketing/content |
| Article/editorial | Insights/topic/article | Author/reviewer/dates/sources/SEO/relations/status | `MODEL_READY / EDITORIAL_PLAN_PENDING` | Editorial/SEO |
| Programme item | Event programme/overview | Valid schedule/timezone/status/person/room/updates | `MODEL_READY / OPERATIONS_PENDING` | Event operations |
| Person | Team, programme, article, testimonial | Role/context/bio/media/contact rule/approval | `MODEL_READY / APPROVAL_PENDING` | HR/brand/event owner |
| Partner/media organization | Homepage, partners, press, event | Relationship type/context/rights/active period | `MODEL_READY / APPROVAL_PENDING` | Executive/marketing/legal |
| FAQ | Homepage/event/exhibitor/visitor/resource | Audience/topic/answer/reviewer/effective period | `MODEL_READY / ANSWERS_PENDING` | Business + legal/content |
| Controlled page | All editorial landing pages | Route/template/module variants/locale/SEO/publication state | `MODEL_READY` | Product/content |
| Legal/consent document | Forms/legal/footer/preferences | Controller, purpose, locale, version, effective date, approval | `MODEL_READY / LEGAL_REVIEW_PENDING` | Legal/privacy |
| Conversion form config | Exhibitor, visitor, meeting, resource, contact | Purpose, fields, recipients, event/context, consent/notice, availability | `MODEL_READY / OPERATIONS_PENDING` | Commercial/operations/privacy |

Operational records—contacts, organizations, leads, registrations, consent, attribution, assignments, appointment references, integration jobs, communications, and audit events—remain outside the public CMS and map to PRD §§9–13.

## 3. Page publication readiness tiers

| Tier | Meaning | Permitted use |
|---|---|---|
| `R0 — Shape only` | Template/object contract exists; no representative approved content | Sitemap, journeys, schematic wireframes with explicit placeholders |
| `R1 — Representative controlled content` | Realistic approved or clearly redacted fixture covers long/short/empty states | Deterministic wireframes, component/content QA |
| `R2 — Locale-complete draft` | All required content/assets exist for one route/locale and have owners | Editorial preview and high-fidelity design |
| `R3 — Approved for publication` | Evidence, rights, legal, business, SEO, and operational approvals passed | Staging/production release candidate |
| `R4 — Live and monitored` | Public route is canonical, measured, owned, and freshness checks are active | Production |

Phase 03 establishes `R0` for all route families. No route is claimed `R2+` without a separate inventory record.

## 4. Minimum representative content pack before wireframe completion

Phase 04/05 needs controlled examples for:

- one scheduled event with exhibitor sales open and visitor registration planned;
- one scheduled event with exhibitor sales closed and visitor registration open;
- one completed event with actual proof or explicit unavailable results;
- one postponed/cancelled event;
- one destination with several editions and one with a single/undated announcement;
- one case, metric, testimonial, gallery collection, and campaign artifact with approval metadata;
- one proposal-only offer and all capability states;
- one gated and one ungated resource, including expired/broken behavior;
- one long article with citations and one topic/index empty state;
- FR, EN, and Arabic/RTL samples with long labels, dates, phone, validation, and missing-translation behavior;
- all form states, including delayed integration and unavailable scheduler.

These may be approved fixtures; they must not be mistaken for public claims.

## 5. Legacy/migration evidence required

Before redirect or canonical decisions are finalized, collect:

1. crawl/export of every current SPIMARIMMO host and subdomain;
2. URL, status, title, canonical, `hreflang`, indexability, traffic/backlink importance, and last meaningful update;
3. WordPress post types, taxonomies, languages, media, forms, users/roles, plugins, and WPGraphQL exposure;
4. active campaigns and inbound links that depend on legacy paths;
5. DNS inventory and ownership for production/alias hosts;
6. existing event IDs, slugs, dates, venue data, exhibitors, programme, galleries, leads/forms, and consent versions;
7. duplicate/thin/stale/unsafe content classification;
8. legal/rights/retention constraints on retained or migrated material.

`SPM-SM-001` is the destination architecture; it is not proof of the legacy source inventory.

## 6. Redirect/migration decision classes

| Class | Rule |
|---|---|
| `MIG-KEEP` | Preserve URL when it is already canonical, meaningful, and compatible |
| `MIG-301` | Permanent redirect only to a genuinely equivalent canonical route, retaining safe path/campaign context |
| `MIG-MERGE` | Consolidate duplicates/thin variants into a substantial equivalent page with documented mapping |
| `MIG-ARCHIVE` | Preserve a valuable completed event/history page with corrected lifecycle and next-edition links |
| `MIG-410` | Remove content with no safe equivalent or legal/right to retain; use only after SEO/business review |
| `MIG-NOINDEX` | Keep necessary low-value/system content available but out of search |
| `MIG-BLOCKED` | Do not migrate until rights, privacy, data quality, or ownership is resolved |

Do not redirect every removed URL to the homepage. Do not redirect a completed event to a future event unless user intent and content equivalence are defensible.

## 7. Migration sheet contract

The implementation handoff must eventually include one row per legacy URL with:

```text
legacy_url
legacy_host
http_status
indexation
canonical
locale
content_type
content_owner
traffic_backlink_priority
quality_freshness
rights_privacy_state
destination_route_id
destination_content_id
migration_class
redirect_target
redirect_reason
reviewer
test_status
```

## 8. Public search decision

### Decision

`NO PUBLIC SITE SEARCH IN RELEASE 1`.

The current evidence supports clear navigation, event directories, topic/resource collections, related-content links, and conditional filters. It does not yet prove that users need a site-wide search layer or that the launch inventory is large/clean enough to make search useful.

This closes `OPEN-113` for Release 1 as `DEFERRED_BY_EVIDENCE` and implements `RES-012`.

### Why

- Events are first-class and navigable by destination/lifecycle.
- Proof, resources, and insights have clear collections and relations.
- The production content inventory and migration crawl are not available.
- Search would add indexing, relevance, typo, locale, analytics, empty-result, privacy, and maintenance work without a demonstrated user job.

### Reconsideration gate

Search may be proposed only when at least one is demonstrated:

- substantial clean inventory that navigation/facets cannot serve;
- validated stakeholder/user tasks involving known-item retrieval across domains;
- legacy search/query or support evidence showing repeated findability failure;
- an approved multi-market editorial volume and maintenance owner.

A proposal must define indexed object types, locale behavior, ranking, permissions, analytics, no-result recovery, performance, and operating owner before it changes the PRD.

## 9. Filter activation decision

Filters are conditional and local to a directory. A facet appears only when:

- at least two meaningful public values exist;
- the value taxonomy is approved and understandable;
- each result remains accurate under lifecycle/locale/rights rules;
- zero-result recovery is designed;
- filtered pages follow the canonical/indexation policy.

No organization is labelled `Premium`, no event audience is classified, and no proof is grouped by outcome unless objective taxonomies are approved.

## 10. Content/migration gate result

| Review | Result |
|---|---|
| Route and content-object coverage | `PASS_STRUCTURALLY` |
| Production content inventory | `OWNED_BLOCKER` |
| Legacy URL/DNS/WP inventory | `OWNED_BLOCKER` |
| Redirect map | `BLOCKED_BY_LEGACY_INVENTORY` |
| Public search | `DEFERRED_BY_EVIDENCE` |
| Conditional directory filters | `APPROVED_WITH_USEFULNESS_RULE` |
| Phase 04/05 representative fixtures | `REQUIRED_NEXT` |

