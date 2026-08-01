# SPIMARIMMO Canonical Sitemap and Navigation

**Document ID:** `SPM-SM-001`  
**Version:** 1.0  
**Status:** `APPROVED_AT_GATE_3`  
**Date:** 31 July 2026

---

## 1. Architecture decision

SPIMARIMMO uses one host-aware application and one shared semantic content model.

- The **global parent host** is the exhibitor-first commercial authority, network directory, proof library, resource authority, and company source.
- An approved **local market/event host** is the primary localized event experience when the organization keeps subdomains.
- Every event has exactly one `canonical_public_url` and one route family. A global directory card links to that URL rather than publishing a duplicate event detail.
- Exhibitor and visitor paths remain distinct through page regions, child routes, CTAs, forms, and analytics context—not through duplicated canonical event records.
- Exact production hosts remain blocked by `OPEN-103`; placeholders in this document are semantic patterns, not DNS commitments.

This implements `SHL-002`, `SHL-003`, `SHL-008`, `SHL-009`, `EVT-004`, `EVT-018`, and `LOC-001`–`LOC-013`.

## 2. Host and locale model

### 2.1 Host classes

| Code | Host class | Responsibility |
|---|---|---|
| `G` | Global parent | Network positioning, all destinations/events, exhibitor value, proof, offers, resources, corporate/legal authority |
| `L1` | Local host with one active edition | Event overview at locale root; event children for programme, exhibitors, practical information, registration, and exhibitor enquiry |
| `LM` | Local host with multiple active editions | Local market directory at locale root; stable event slug below it |
| `P` | Preview/staging | Controlled editorial/design preview; authenticated where possible; always `noindex` |

### 2.2 Locale contract

Every published public locale has an explicit prefix:

```text
/{locale}/...

locale = fr | en | ar
```

- `fr`, `en`, and `ar` are architectural capabilities; each host declares which are production complete.
- Arabic uses `lang="ar"`, real `dir="rtl"`, logical properties, and dedicated content/visual QA.
- Locale switching resolves the same semantic route/content ID when an approved equivalent exists.
- An incomplete equivalent is unavailable or uses a specifically approved fallback; the site never silently mixes critical languages.
- Host root `/` may resolve a saved user preference or show an approved language chooser. It must not force an IP-only redirect.
- `x-default` is used only if an approved neutral selector or global fallback actually exists.

## 3. Global canonical sitemap

The following is the semantic French route proposal. English and Arabic slugs may be localized while retaining the same route IDs.

```text
GLOBAL_HOST
└── /{locale}
    ├── /                                      # global exhibitor-first homepage
    ├── /salons                                # all destinations and events
    │   ├── /{destination}
    │   └── /{destination}/{event}             # only when G owns canonical event
    │       ├── /programme
    │       ├── /exposants
    │       ├── /informations-pratiques
    │       ├── /galerie
    │       ├── /inscription
    │       └── /devenir-exposant
    ├── /exposer
    │   ├── /pourquoi-spimarimmo
    │   ├── /methode
    │   ├── /visibilite
    │   └── /offres
    ├── /preuves
    │   ├── /resultats
    │   ├── /etudes-de-cas
    │   │   └── /{case-study}
    │   ├── /temoignages
    │   └── /galerie
    ├── /ressources
    │   └── /{resource}
    ├── /insights
    │   ├── /themes/{topic}
    │   └── /{article}
    ├── /visiteurs
    ├── /devenir-exposant
    ├── /rendez-vous
    ├── /a-propos
    ├── /equipe
    ├── /partenaires-et-medias
    ├── /presse
    ├── /contact
    ├── /mentions-legales
    ├── /confidentialite
    ├── /cookies
    └── /accessibilite
```

### 3.1 Consolidation decisions

- There is no separate `/visiteurs/salons` event-detail universe. The visitor hub finds canonical events and carries `audience=visitor` as interaction context, not as a duplicate indexable page.
- Programme, approved exhibitors, practical information, gallery, visitor registration, and exhibitor enquiry are event children because they have different jobs, lifecycle states, and sharing needs.
- Resource types are filters/taxonomy, not separate thin directories by default. Each approved resource has one presentation/detail route.
- `Marché MRE` is initially an editorial topic/pillar under Insights, not an unsupported standalone market-statistics microsite.
- Team, press, partners/media, and accessibility routes publish only when content depth and ownership meet the inventory gate; otherwise they remain sections or footer contacts without thin pages.

## 4. Local host sitemap

### 4.1 One active event (`L1`)

```text
LOCAL_HOST
└── /{locale}
    ├── /                                      # canonical event overview
    ├── /programme
    ├── /exposants
    ├── /informations-pratiques
    ├── /galerie
    ├── /inscription
    ├── /devenir-exposant
    ├── /ressources/{resource}
    ├── /faq
    ├── /contact
    └── /legal/*                               # local overrides or global canonical links
```

### 4.2 Multiple active events (`LM`)

```text
LOCAL_HOST
└── /{locale}
    ├── /                                      # market/country event directory
    └── /salons/{event}
        ├── /
        ├── /programme
        ├── /exposants
        ├── /informations-pratiques
        ├── /galerie
        ├── /inscription
        └── /devenir-exposant
```

The event template and child-template contracts are identical across `G`, `L1`, and `LM`. Host configuration changes path ownership; it does not fork application code.

## 5. Canonical event ownership

Each event record must include:

- canonical host ID;
- stable event ID and edition ID;
- localized slug map;
- canonical public URL per released locale;
- destination and venue relations;
- lifecycle, exhibitor-sales, and visitor-registration state;
- redirect aliases from any former route/host;
- locale completeness and indexation state.

Rules:

1. Directory cards always resolve the event’s configured canonical URL.
2. A duplicate legacy/global event URL redirects only when destination equivalence is confirmed.
3. Lifecycle changes never change the canonical event URL.
4. A date correction does not create a new slug.
5. A new edition receives a new edition record and URL; it may inherit controlled destination/event-series data, not previous outcomes.
6. Completed substantial events remain indexable and link to the next relevant edition.
7. Cancelled/postponed pages remain available when users need authoritative status information.

## 6. Primary navigation

### 6.1 Global desktop header

| Item | Destination | Navigation content |
|---|---|---|
| `Salons` | `RT-EVT-INDEX` | Featured/upcoming events, destinations, archive access |
| `Exposer` | `RT-EXP-HUB` | Why SPIMARIMMO, method, visibility, offers |
| `Preuves` | `RT-PRF-HUB` | Results, case studies, testimonials, real gallery |
| `Ressources` | `RT-RES-HUB` | Brochures, guides, calendar, reports, insights |
| `Visiteurs` | `RT-VIS-HUB` | Find an event, understand, prepare, pre-register |
| Primary CTA `Devenir exposant` | `RT-CONV-EXHIBIT` | Qualified commercial request with context |

Utility navigation: locale, contact, press/media when published, and cookie preferences. Search is absent for Release 1.

### 6.2 Global mobile navigation

The menu uses three clear groups:

1. `Salons` — destinations/current events/archives.
2. `Exposants` — value, method, visibility, offers, proof, resources.
3. `Visiteurs` — event discovery, programme/exhibitors/practical information, registration.

The primary exhibitor CTA remains reachable but must not obscure content or compete with a visitor registration action on event routes. Only one persistent bottom action region may be active.

### 6.3 Local event navigation

| Item | Visibility rule |
|---|---|
| `Le salon` | Always on a published event |
| `Programme` | Published when approved items exist; otherwise an honest pending section on overview |
| `Exposants` | Published when approved participation exists |
| `Infos pratiques` | Published when verified venue/access content exists |
| `Galerie` | Published when approved documentary media exists |
| `Exposer` | Visible when exhibitor-sales state permits or as a next-edition/contact route |
| `S’inscrire` | Primary visitor action only when visitor-registration state is `open` or `waitlist` |

## 7. Footer architecture

Global footer groups:

- Salons and destinations;
- Exposer;
- Preuves;
- Visiteurs;
- Resources and insights;
- Company, team, press/media, and contact;
- Legal, privacy, cookies, accessibility, and preferences;
- locale/country selection and approved social profiles;
- organizer relationship and current legal/company details when approved.

Local footer adds event contact and local practical links while retaining the controlling legal/privacy destination.

## 8. Breadcrumb rules

- Destination: `Accueil > Salons > Destination`.
- Event: `Accueil > Salons > Destination > Edition`.
- Event child: `Accueil > Salons > Destination > Edition > Programme`.
- Case: `Accueil > Preuves > Études de cas > Case`.
- Resource: `Accueil > Ressources > Resource`.
- Article: `Accueil > Insights > Article`.

Breadcrumb labels are localized; underlying IDs remain stable. Parent/subdomain crossings must not fabricate a hierarchy that conflicts with canonical ownership.

## 9. Filters and findability

| Directory | Initial controls | Activation rule |
|---|---|---|
| Events | destination, lifecycle/current/archive; year when archive grows | Always allow current/archive separation; add filters only when they reduce real choice |
| Proof/cases | event, destination, year, proof type | Activate when at least two useful values exist in a facet |
| Resources | audience, type, topic, destination/event, language, year | Same useful-facet rule |
| Insights | topic, audience, destination/event, year | Same useful-facet rule |

Filtered/query URLs are non-indexable by default and canonicalize to the unfiltered directory unless SEO approves a content-rich topic/destination landing page.

## 10. Navigation acceptance

The sitemap passes Phase 03 navigation review when:

- every active event is reachable within one interaction from the global homepage event chapter;
- every nested public page has a deterministic parent and exit route;
- every event has one canonical public URL family;
- exhibitors and visitors never share an ambiguous form or CTA label;
- locale switching retains equivalent meaning;
- mobile exposes both audiences without two competing persistent action bars;
- inactive hosts cannot render another market’s content;
- the sitemap remains valid when proof, prices, programme, exhibitors, gallery, or a future event is unavailable.
