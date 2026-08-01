# Content, Copy, Media, and Asset Readiness

**Document ID:** `SPM-HIF-CONTENT-001`  
**Status:** `VISUAL_SYSTEM_COMPLETE_PRODUCTION_CONTENT_PENDING`

## 1. Truth labels

Every content element used during design or preview is assigned one status:

| Status | Meaning | Publication rule |
|---|---|---|
| `APPROVED_SOURCE` | Exact fact/copy is approved by its owner | May publish within locale/period/host scope |
| `CONTROLLED_FIXTURE` | Realistic shape used to test design | Must be replaced before production |
| `PENDING_APPROVAL` | Supplied but not yet approved | Preview only, visibly flagged |
| `UNAVAILABLE` | Required input does not exist | Use defined empty/fallback behavior |
| `WITHDRAWN_OR_EXPIRED` | Permission, validity, or currency ended | Suppress from public UI and use approved recovery |

No fixture may become a claim merely because it appears polished.

## 2. Copy hierarchy

### Homepage first viewport

Required shapes:

- one exhibitor-first commercial proposition;
- one short explanatory sentence;
- one primary qualified-request action;
- one event-discovery action;
- one approved proof/trust signal or its intentional absence;
- early event opportunity with city, date state, and availability.

### Event

- approved event name and destination;
- date or explicit undated status;
- venue/access facts only when verified;
- lifecycle and each audience availability state;
- separate action labels and outcomes;
- programme, exhibitor, gallery, and practical content readiness;
- update owner/time for changed facts.

### Proof/cases

- objective and context;
- SPIMAR delivery scope;
- approved outcome;
- definition, period, source, caveat, applicability;
- permission and expiry status;
- related event/action.

### Forms

- request meaning;
- recipient/purpose;
- fields and optionality;
- consent and privacy notice;
- success definition;
- provider-independent fallback;
- expected response only when an SLA is approved.

## 3. Prohibited inventions

Do not invent or visually imply:

- visitor numbers, leads, conversion rates, ROI, reach, sales, or satisfaction;
- public stand/package prices;
- live availability or a reserved stand without operational truth;
- admission/ticket issuance from pre-registration;
- partner/exhibitor participation;
- real case outcomes or testimonials;
- cities, dates, venues, speakers, programme items, or future editions not approved;
- production photography generated to look documentary.

## 4. Media readiness matrix

| Media role | Minimum production package | Fallback |
|---|---|---|
| Event hero video | rights, owner, poster, desktop/mobile crop, captions/transcript, focal point, expiry | typographic city/date poster |
| Event photography | rights, edition/date/place caption, alt, crop variants, focal point | typographic poster or collapsed media module |
| Moroccan property/place | rights, verified location/context, alt, crop variants | editorial place label/geometry; no fake project image |
| Portrait/testimonial | identity and quote permission, role validity, alt, expiry | text-only approved quote or suppress |
| Partner/exhibitor logo | relationship approval, usage permission, validity window, accessible name | suppress; never use a generic logo wall |
| Case artifact | client approval, source/period, redaction, owner | described artifact state or suppress |

## 5. Brand and font inputs

Before production implementation:

- supply vector SPIMARIMMO logo masters and safe-area/minimum-size rules;
- approve the Arabic wordmark/lockup relationship;
- confirm print/spot references separately from digital `#EFC337`;
- license and provide the selected Latin display and multilingual UI/body fonts;
- test French, English, Arabic, numerals, punctuation, diacritics, and mixed-direction data;
- preserve a system-font fallback that does not cause broken layout or invisible content.

## 6. Content readiness gate

A page may be called production-ready only when its required objects are `APPROVED_SOURCE` or its approved fallback is intentionally active. `CONTROLLED_FIXTURE` is sufficient for Phase 08 review but never for launch.
