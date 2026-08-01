# SEO, Performance, Security, Privacy and Analytics

**Status:** `PROPOSED_QUALITY_CONTRACT`

## 1. Quality objective

The website must support campaign conversion and long-term authority without making
visual polish dependent on heavy JavaScript, inaccessible motion or ungoverned tracking.

## 2. SEO model

### Global search themes

- international Moroccan property exhibitions;
- exhibit Moroccan property projects internationally;
- access MRE property buyers;
- Moroccan diaspora real-estate market;
- SPIMAR exhibitions and case studies.

### Local search themes

- Moroccan property exhibition in `[city/country]`;
- meet Moroccan property developers in `[city]`;
- buy/invest in Moroccan property from `[country]`;
- Moroccan property financing event;
- edition-specific brand and venue queries.

Content must answer real intent rather than repeat keyword lists.

## 3. International SEO

- unique URL per locale;
- self-referencing canonical;
- reciprocal fully qualified `hreflang`;
- `x-default` only after destination strategy is approved;
- visible language/country links;
- no forced IP redirection;
- equivalent critical content across desktop/mobile;
- locale-specific titles/descriptions;
- canonical consolidation of duplicate domains;
- separate sitemaps by host/locale/content type when useful.

## 4. Structured data

Use valid JSON-LD where applicable:

- `Organization`;
- `Event`;
- `Place`;
- `BreadcrumbList`;
- `Article`;
- `VideoObject`;
- `Person`;
- `FAQPage` only when content and current eligibility rules justify it.

Expected attendance, package price and other non-schema claims must not be inserted into
structured data unless accurate and supported.

## 5. Past-event SEO

Completed events:

- remain accessible when they contain useful proof;
- switch from registration to recap/waitlist;
- display final dates/status;
- link to the next relevant edition;
- preserve media and exhibitors where rights allow;
- avoid duplicate thin archives;
- redirect only when there is a genuinely equivalent replacement.

## 6. Core Web Vitals targets

At the 75th percentile, segmented by mobile and desktop:

| Metric | Target |
|---|---:|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

These are current “good” thresholds documented by web.dev. Track real-user data after
launch; Lighthouse alone is not enough.

## 7. Performance budgets

Proposed initial release budgets:

- critical client JavaScript: ≤ 170 KB gzip on the global homepage;
- initial mobile transfer excluding optional video: ≤ 1.5 MB;
- mobile hero poster: ≤ 250 KB target;
- desktop hero poster: ≤ 450 KB target;
- no hero video preload on constrained/mobile contexts;
- no autoplay audio;
- maximum two production font families with subsetted weights;
- third-party scripts require an owner and measured value;
- reserve media dimensions to prevent layout shift.

Budgets may be adjusted after measured prototypes, not ignored.

## 8. Video strategy

- render useful poster and content before video;
- use `preload="none"` or `metadata` based on test;
- art-directed mobile source;
- pause when offscreen;
- respect data-saving and reduced-motion preferences;
- keep controls for meaningful content;
- captions/transcript for spoken content;
- do not make LCP depend on downloading a large video.

## 9. Accessibility

Target WCAG 2.2 AA:

- semantic landmarks/headings;
- keyboard navigation;
- visible focus;
- focus not obscured by sticky UI;
- logical reading/focus order;
- form labels, descriptions and errors;
- sufficient contrast;
- text reflow and zoom;
- reduced motion;
- captions/transcripts;
- alt text;
- non-color status indicators;
- 24 × 24 CSS px minimum target requirement where applicable, with a 44 × 44 product
  standard for primary controls.

Test French, English and Arabic/RTL with real content.

## 10. Application security

- server-side schema validation;
- output encoding;
- strict security headers;
- Content Security Policy;
- HTTPS/HSTS;
- least-privilege CMS and database roles;
- Row Level Security;
- rate limiting;
- bot/spam protection;
- idempotency;
- dependency and secret scanning;
- audit logs;
- protected exports;
- signed/expiring private asset URLs;
- backups and tested recovery;
- no sensitive data in URLs or analytics.

## 11. Privacy

The final implementation requires review against applicable Moroccan data-protection
requirements and, where relevant, European/UK rules for residents and marketing.
This document is not legal advice.

Minimum product controls:

- data minimization;
- clear purpose at collection;
- separate necessary processing from optional marketing;
- versioned consent/notice;
- source/event/recipient scope;
- access, correction, deletion and objection workflow;
- retention schedule;
- processor/vendor register;
- cross-border-transfer review;
- cookie preference control;
- no pre-checked optional consent;
- stop direct marketing when a valid objection/opt-out is recorded.

## 12. Analytics architecture

### Business events

```text
exhibitor_cta_clicked
event_card_selected
brochure_requested
brochure_downloaded
case_study_opened
package_compared
exhibitor_enquiry_submitted
meeting_booked
visitor_registration_submitted
resource_downloaded
locale_changed
country_changed
form_error
```

### Required dimensions

- page/route;
- tenant/host;
- event ID;
- locale;
- audience path;
- source/medium/campaign;
- CTA position;
- content version;
- device class;
- consent state where required.

### Prohibited analytics data

- full name;
- email;
- phone;
- free-text message;
- precise budget when it could identify a person;
- documents;
- CRM notes.

## 13. Attribution

Persist:

- first known source;
- latest source;
- UTM values;
- referrer;
- landing host/page;
- event;
- conversion action;
- timestamp;
- consent/notice version.

Define attribution windows separately for:

- brochure;
- enquiry;
- meeting;
- contract;
- visitor registration;
- event attendance;
- post-event opportunity/sale.

## 14. Monitoring and alerts

Alert on:

- host unavailable;
- certificate/DNS issue;
- form-error spike;
- notification/CRM queue failure;
- zero submissions during active campaign;
- event still marked live after end date;
- missing venue/date on active event;
- broken brochure;
- Core Web Vitals regression;
- indexing/canonical/hreflang anomalies;
- stale legal or package version.

## 15. CI/CD quality gates

- typecheck and lint;
- unit/integration tests;
- representative host/locale smoke tests;
- accessibility checks;
- link validation;
- structured-data validation;
- Lighthouse/bundle budget;
- security-header test;
- database migration validation;
- visual regression for key desktop/mobile/RTL screens.

## 16. Release acceptance

- Correct canonical and `hreflang` on sampled hosts/locales.
- Valid event structured data.
- No expired live event state.
- Core Web Vitals budgets pass in lab and RUM is active.
- Keyboard and screen-reader critical journeys pass.
- Forms are server validated, rate limited and observable.
- Consent and retention decisions are approved.
- Analytics records conversions without personal data.

