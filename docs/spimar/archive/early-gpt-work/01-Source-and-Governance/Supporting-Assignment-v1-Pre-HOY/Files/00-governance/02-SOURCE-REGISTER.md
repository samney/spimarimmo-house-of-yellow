# Evidence and Source Register

**Status:** `ACTIVE`  
**Research snapshot:** 29 July 2026

## 1. Evidence classes

| Class | Meaning | Publication rule |
|---|---|---|
| `A — Verified` | Current public or supplied primary evidence | May be used with source/date |
| `B — Client supplied` | Internal SPIMAR data, document or statement | Requires owner approval |
| `C — Inferred` | Reasoned recommendation or public-site inference | Label internally; do not publish as fact |
| `D — Placeholder` | Required content not yet supplied | Never publish as final |

## 2. Authoritative project input

| Source | Class | Use |
|---|---:|---|
| CTO assignment received 29 July 2026 | B | Product objective, sections, audiences and conversion priority |
| User clarifications in the SPIMAR project | B | Main-domain/subdomain model, languages, fresh Next.js build, responsive quality and preferred design reference |

## 3. SPIMAR ecosystem

| Source | Snapshot finding |
|---|---|
| [spimarimmo.com](https://spimarimmo.com/) | Parent platform, visitor-led Arabic content, attendance CTA and linked country network |
| [france.spimarimmo.com](https://france.spimarimmo.com/) | Thin Paris page; 2023 copyright visible in snapshot |
| [canada.spimarimmo.com](https://canada.spimarimmo.com/) | Montréal 1–3 May 2026 content still visible after the event |
| [allemagne.spimarimmo.com](https://allemagne.spimarimmo.com/) | Thin Frankfurt page; 2023 copyright visible |
| [clarkom.com](https://clarkom.com/) | Organizer/agency context |

The earlier technical audit identified Gatsby/Netlify, shared headless WordPress and
WPGraphQL. Reconfirm these implementation details before migration.

## 4. Direct and adjacent event references

| Reference | Relevant pattern | Avoid copying |
|---|---|---|
| [Morocco Property Expo](https://www.moroccopropertyexpo.com/) | Dual visitor/exhibitor actions, expected-volume proof, role-specific forms | Unverified numbers, content and brand assets |
| [Future Real Estate Expo](https://futurerealestateexpo.com/) | Developer network, investment destinations, exhibitor CTA | Outdated event copy and undifferentiated long forms |
| [Cityscape Global](https://cityscapeglobal.com/) | Stand enquiry, brochure, commercial scale, buyer seniority, partner and testimonial proof | Brand system, copy, imagery and event claims |
| [WellExpo Digital Conference](https://wellexpo.qodeinteractive.com/digital-conference/) | Contemporary editorial composition, contrast rhythm, typography and motion grammar | Theme code, branded media, conference-specific IA |

## 5. Official MRE and market context

### Current scale

- The Moroccan government MRE portal reports more than **6.1 million** MRE
  worldwide and more than **MAD 122 billion** transferred by MRE through the end
  of December 2025.
- The Office des Changes reports **MAD 122.023 billion** in MRE transfers in
  2025, up 2.6% from 2024. The report marks the figures provisional.

Sources:

- [MRE government portal](https://www.mre.gov.ma/)
- [Office des Changes — IMEE December 2025](https://www.oc.gov.ma/sites/default/files/2026-01/IMEE%20D%C3%A9c%202025.pdf)

These figures demonstrate diaspora scale and economic connection. They do not, by
themselves, prove residential-property purchase intent or SPIMAR ROI.

### Investment and return context

The HCP/UNFPA study published in December 2022, using the 2018–2019 National
International Migration Survey, reports:

- 2.9% of current migrants in the surveyed definition said they had completed
  investment projects in Morocco;
- the proportion rose with age and migration duration;
- among return migrants' investments, broad real estate including construction
  and non-agricultural land represented 17.3%;
- the study identifies capital, administrative complexity, incentives and
  experience among investment barriers.

Source:

- [HCP — Déterminants des transferts et des investissements des migrants marocains à l'étranger](https://www.mre.gov.ma/sites/default/files/2025-06/D%C3%A9terminants%20des%20transferts%20et%20des%20investissements%20des%20migrants%20marocains%20%C3%A0%20l%27%C3%A9tranger.pdf)

Use with its date, scope and limitations. It is not a direct measure of the reasons
SPIMAR visitors purchase homes.

## 6. Technical primary sources

| Topic | Source |
|---|---|
| Multi-tenant Next.js | [Next.js multi-tenant guide](https://nextjs.org/docs/app/guides/multi-tenant) |
| Host interception and routing | [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) |
| Internationalization | [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization) |
| Metadata and sitemaps | [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [sitemaps](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) |
| Database access control | [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| International SEO | [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| Canonical URLs | [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) |
| Core Web Vitals | [web.dev thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) |
| Accessibility | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) |

## 7. Required first-party evidence

The following cannot be responsibly reconstructed from public pages:

- number of exhibitions by year and country;
- verified visitor registrations and physical check-ins;
- visitor qualification criteria;
- participating developer count;
- lead count and deduplication rules;
- appointments completed;
- sales/reservations attributed to exhibitions;
- satisfaction methodology and sample size;
- campaign reach, spend and channel mix;
- package inclusions and prices;
- developer renewal rate;
- approved quotes, logos, photos and video rights;
- CRM response times and post-event follow-up process.

Each item must receive an owner, source file, reporting period and approval status.

## 8. Citation rule for the production website

Every public statistic must record:

```yaml
metric_name:
value:
unit:
period:
market:
definition:
source:
source_owner:
verified_on:
approved_by:
publication_status:
```

If the source or definition is missing, the metric remains hidden rather than
rendered as a placeholder.

