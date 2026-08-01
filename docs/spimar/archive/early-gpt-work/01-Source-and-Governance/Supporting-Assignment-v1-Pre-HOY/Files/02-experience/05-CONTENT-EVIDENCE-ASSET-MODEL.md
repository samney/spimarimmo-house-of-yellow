# Content, Evidence and Asset Model

**Status:** `ACTIVE_COLLECTION_SPEC`

## 1. Content principle

Every public claim belongs to one of four types:

- brand promise;
- operational description;
- verified result;
- market research.

The CMS and review process must prevent one type from masquerading as another.

## 2. Core content entities

```text
Site / Tenant
Locale
Event
Venue
Market
Exhibitor
Partner
Package
Case Study
Testimonial
Metric
Campaign
Resource
Article
FAQ
Media Asset
Person
Lead Form Configuration
Legal Document
```

## 3. Event content contract

```yaml
event:
  id:
  internal_name:
  country:
  city:
  canonical_host:
  locales:
  status:
  exhibitor_sales_status:
  visitor_registration_status:
  start_at:
  end_at:
  timezone:
  venue:
  hero_copy:
  hero_media:
  expected_metrics:
  final_metrics:
  exhibitors:
  programme:
  brochures:
  contacts:
  seo:
  legal:
```

Expected and final metrics must be separate fields.

## 4. Metric content contract

```yaml
metric:
  label:
  value:
  unit:
  definition:
  event_or_period:
  expected_or_actual:
  source_type:
  source_file:
  owner:
  verified_on:
  approved_by:
  sample_size:
  methodology_note:
  publish_from:
  publish_until:
```

## 5. Case-study evidence pack

Required:

- written client authorization;
- objective and starting context;
- package and SPIMAR intervention;
- results with definitions;
- reporting period;
- attribution method;
- approved quote;
- person/name/role approval;
- logo rights;
- photo/video rights;
- final locale translations;
- review/expiry date.

## 6. Testimonial record

```yaml
testimonial:
  person:
  role:
  company:
  event:
  format: video | text
  original_language:
  approved_transcript:
  translations:
  caption_file:
  consent_release:
  approved_channels:
  valid_until:
```

## 7. Asset inventory

### Brand

- master logo and monochrome variants;
- verified yellow and supporting palette;
- typography licenses;
- event/country marks;
- partner/organizer lockups;
- iconography.

### Documentary event proof

- hero-capable event footage;
- exhibition wide shots;
- stands and projects;
- visitor flow;
- meetings and consultations;
- conferences;
- executive testimonials;
- interviews;
- press coverage;
- check-in/attendance evidence.

### Commercial enablement

- exhibitor brochure;
- package comparison;
- stand plans;
- guide and checklist;
- sample event report;
- case-study PDFs;
- event calendar;
- sponsorship inventory.

### Market content

- approved MRE research;
- first-party visitor insights;
- city/project imagery;
- financing/legal expert material;
- charts with source data.

## 8. Media roles

| Role | Allowed source | Purpose |
|---|---|---|
| Documentary proof | Real approved SPIMAR media only | Prove past execution |
| Current event facts | Approved current-event media/data | Inform and convert |
| Campaign atmosphere | Licensed or generated media | Create visual direction |
| Property imagery | Developer-supplied/licensed | Represent verified projects |
| Editorial illustration | Original/generated | Explain concepts |

Generated images must never imply a real crowd, partner, result or event that did not
exist.

## 9. Hero video requirements

- real footage preferred;
- clear rights for web, advertising and localization;
- 16:9/ultrawide desktop master;
- 4:5 or 9:16 mobile-safe edit;
- 8–15 second web loop;
- no critical message embedded only in the video;
- poster images;
- subtitles/transcript for meaningful speech;
- muted autoplay only where appropriate;
- pause/reduced-motion behavior;
- compressed derivatives and quality checks.

## 10. Photography selection score

Score 1–5:

- authenticity;
- event-scale clarity;
- property-industry relevance;
- human interaction;
- brand visibility;
- composition/crop flexibility;
- resolution;
- rights completeness;
- locale appropriateness.

Only assets meeting minimum rights and authenticity conditions proceed.

## 11. Content governance roles

| Role | Responsibility |
|---|---|
| Business owner | Approves claims, offers and event priority |
| Commercial owner | Approves packages, case studies and response process |
| Event owner | Approves dates, venue, programme and operational facts |
| Marketing owner | Approves campaign, brand, media and editorial content |
| Data owner | Defines metrics and supplies evidence |
| Legal/privacy reviewer | Approves forms, rights, terms and public claims |
| Publisher | Schedules and publishes approved content |

One person may hold several roles, but approval responsibility must remain explicit.

## 12. Translation governance

- source locale identified per item;
- critical facts are locked across translations;
- dates, metrics and legal copy cannot drift;
- Arabic reviewed by a fluent human;
- RTL visual QA performed;
- localized URLs and metadata;
- translation status visible in CMS;
- no event published with missing critical locale fields.

## 13. Publication states

```text
Draft
→ Content review
→ Evidence review
→ Translation
→ Legal/privacy review
→ Approved
→ Scheduled
→ Published
→ Superseded/Archived
```

## 14. Immediate collection request

Priority `P0`:

- logo source files and brand guide;
- full event calendar;
- commercial brochures and packages;
- verified metrics and definitions;
- three strongest case candidates;
- three video testimonial candidates;
- developer/partner logo permissions;
- best real event footage and photos;
- lead form and CRM destination;
- current legal/privacy documents.

Priority `P1`:

- stand plans;
- campaign examples;
- sample report;
- team biographies;
- press coverage;
- FAQ answers;
- article inventory.

## 15. Acceptance criteria

- Every public number resolves to an approved metric record.
- Every logo/media asset has rights status.
- Expected and historical metrics cannot be confused.
- Event facts remain identical across page, card, form, email and metadata.
- Translations preserve meaning and evidence.
- Expired brochures/resources are automatically withdrawn or replaced.

