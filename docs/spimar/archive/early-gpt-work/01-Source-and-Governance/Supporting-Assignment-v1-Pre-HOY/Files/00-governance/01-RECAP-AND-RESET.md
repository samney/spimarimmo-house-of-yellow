# Previous Work Recap and Official Reset

**Status:** `APPROVED_BASELINE`  
**Reset date:** 29 July 2026

## 1. What was completed before the official brief

The earlier work established:

- a B2B2C business-model analysis for SPIMAR and Clarkom;
- a public audit of the main domain and country-site network;
- a multi-subdomain Next.js platform proposal;
- visitor-oriented UX and conversion research;
- international competitor and visual-reference research;
- multilingual French, English and Arabic/RTL requirements;
- responsive desktop, tablet and mobile principles;
- a content and asset production workflow;
- several generative visual explorations;
- a deep deconstruction of the WellExpo Digital Conference reference;
- an execution queue for strategy, visual production and Claude Code.

The previous workspace remains available at `../spimar-workspace/`.

## 2. Why the reset is required

The old source of truth treated free visitor registration as the principal
conversion. The CTO brief makes the paying B2B customer the primary audience.

That changes:

- the homepage promise;
- the order of information;
- the navigation;
- the proof requirements;
- the calls to action;
- the content model;
- the CRM funnel;
- analytics;
- the meaning of case studies and testimonials;
- the relationship between the global site and event subdomains.

The reset is strategic, not cosmetic.

## 3. Decision reconciliation

| Previous decision or output | New status | Treatment |
|---|---|---|
| SPIMAR is a B2B2C event and lead-generation platform | `PRESERVED` | Still correct |
| Visitor registration is the primary global conversion | `SUPERSEDED` | Exhibitor commercial conversion is now primary |
| `spimarimmo.com` is the global parent platform | `PRESERVED` | Global B2B trust, proof and event network |
| Country subdomains are localized editions | `PRESERVED` | Served by one shared application and CMS model |
| French, English and Arabic/RTL at launch | `PRESERVED` | Additional market languages remain extensible |
| Clean Next.js implementation from scratch | `PRESERVED` | New frontend; reuse/migrate validated content only |
| Mobile-first means mobile-only focus | `REJECTED` | Desktop and mobile are both primary design surfaces |
| Responsive system across mobile/tablet/laptop/desktop | `PRESERVED` | Deliberate compositions at every range |
| Generic dark-luxury visual directions | `REJECTED` | Must not return |
| Dark-yellow iteration 03 | `REJECTED` | Not an implementation reference |
| WellExpo design grammar | `PRESERVED_AS_REFERENCE` | Visual/motion reference, not the product IA |
| Iteration 04 screens | `EXPLORATORY_ONLY` | Useful visual learning; not approved under the new brief |
| Immediate Higgsfield production | `BLOCKED` | Requires new B2B UX and asset slots |
| Immediate Claude Code implementation | `BLOCKED` | Requires approved strategy, UX, design and content |

## 4. What the earlier audit already proved

Public inspection found a fragmented web estate:

- one global site plus multiple country subdomains and historical domains;
- Gatsby/React static delivery on Netlify;
- shared headless WordPress/WPGraphQL infrastructure;
- inconsistent analytics and forms;
- stale event states;
- duplicated or conflicting country-domain content;
- thin localized pages;
- missing centralized publishing and lead governance.

The technology was not the only problem. Operational consistency, content
lifecycle, evidence quality and lead handling were more important.

## 5. Live-site facts reconfirmed on 29 July 2026

- The parent homepage is predominantly Arabic and visitor-oriented.
- Its main hero action is attendance registration.
- It links to UAE, Canada, France, Netherlands, Belgium, Germany and USA editions.
- Canada still presents the 1–3 May 2026 Montréal event with a zero countdown.
- France and Germany expose very thin pages with 2023 copyright text.
- The visible parent experience does not currently build an exhibitor ROI case.

These observations are snapshots, not permanent facts. Re-test at delivery.

## 6. What remains useful from the WellExpo work

Preserve:

- bold contemporary event identity;
- one dominant idea per editorial moment;
- large typographic contrast;
- asymmetrical grid;
- documentary photography in strong planes and masks;
- technical event labels;
- controlled light/dark rhythm;
- purposeful motion and persistent orientation.

Do not preserve:

- full-page slide behavior as the only page structure;
- content hierarchy designed for visitors;
- any reference brand assets, copy or proprietary code;
- motion that blocks reading, accessibility or SEO;
- layouts unable to contain the CTO's deeper B2B evidence.

## 7. New controlling product statement

> SPIMARIMMO is the international commercial platform through which Moroccan
> property developers access qualified MRE and investor audiences, supported by
> integrated marketing, exhibition operations, appointment generation and
> post-event reporting.

## 8. New phase gates

1. Validate official requirements and evidence gaps.
2. Approve B2B strategy and information architecture.
3. Collect verified numbers, cases, logos, media and package details.
4. Create low-fidelity desktop and mobile B2B flows.
5. Create high-fidelity reference-led screens.
6. Approve the design system and motion rules.
7. Produce only the missing approved media assets.
8. Prepare Claude Code implementation package.
9. Build, migrate, test and launch.

## 9. Historical workspace policy

- Do not delete the former workspace.
- Do not silently merge its content into this baseline.
- Reference it when a past finding remains useful.
- Record every adopted decision in the new decision log.
- Treat all prior generated screens as unapproved until explicitly re-evaluated.

