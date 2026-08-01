# Testing, Acceptance, and Release Plan

**Document ID:** `SPM-TECH-TEST-001`  
**Status:** `TEST_CONTRACT_APPROVED_EXECUTION_PHASE_11`

## 1. Evidence principle

Gate 10 approves what must be tested; Phase 11 supplies executable evidence from the real repository, browsers, devices, assistive technology, providers and deployment environments.

Every test links to one or more `PRD -> RT/TPL -> JRN -> UXF/HIF -> DSC/MOT -> implementation story` identifiers. Generated fixtures and screenshots are evidence only when their source, environment, viewport/locale/state and result are recorded.

## 2. Test layers

| Layer | Scope |
|---|---|
| Static | formatting, type safety, lint, forbidden imports/boundaries, configuration schemas |
| Unit/property | state derivation, lifecycle/action precedence, locale formatting, mappings, validation, retry classifiers |
| Component | semantics, focus/keyboard, errors/status, variants, RTL, reduced motion, missing/long content |
| Repository/adapter contract | CMS normalization, database transactions, CRM/mail/scheduler/webhook contracts |
| Integration | durable submission/outbox/jobs, cache revalidation, preview, authorization, migrations |
| E2E | six public journeys plus all critical negative/provider states across representative hosts/locales |
| Accessibility | automated plus keyboard, zoom/reflow, representative screen reader and Arabic RTL review |
| Visual | approved `HIF/UXF` compositions/states across viewports; intentional-difference review |
| Performance | bundle/weight/Lighthouse/media/poster/motion and RUM readiness |
| Security/privacy | host isolation, access/RLS, headers/CSP, abuse/idempotency, webhook replay, PII/log/cache/URL leakage |
| Migration/SEO | data reconciliation, redirects, canonical/hreflang/sitemap/robots/structured data |
| Operations | monitoring/alerts, provider outage, backup/restore, rollback, incident runbooks |

## 3. Critical executable cases

| ID | Case | Pass condition |
|---|---|---|
| `Q10-001` | Unknown/inactive host | Safe state; no other host content or config leaks |
| `Q10-002` | Explicit FR/EN/AR routes | Correct canonical, alternates, `lang/dir`, content and safe unavailable-locale behavior |
| `Q10-003` | Event state property matrix | All lifecycle × sales × registration combinations derive approved labels/actions or reject invalid publication |
| `Q10-004` | Cancelled/postponed event | Exception precedes promotion; invalid actions suppressed; approved alternative exists |
| `Q10-005` | Missing hero media | Poster/type fallback preserves hierarchy/action and stays within budget |
| `Q10-006` | Reduced motion | Content/tasks complete; prohibited spatial/campaign motion absent |
| `Q10-007` | Exhibitor durable submission | One canonical record/context/consent/outbox transaction; no stand-reserved claim |
| `Q10-008` | Duplicate/retry | Same idempotent operation does not create uncontrolled duplicates |
| `Q10-009` | CRM/email outage | Durable success remains; jobs retry/alert; honest provider status/fallback |
| `Q10-010` | Meeting provider | Booking displayed only after verified provider acceptance; failure becomes lead fallback |
| `Q10-011` | Visitor states | Open/waitlist/full/closed produce deterministic form/action/confirmation without ticket promise |
| `Q10-012` | Resource version/delivery | Correct locale/version; expired/replaced/broken/delayed states handled |
| `Q10-013` | Invalid/expired confirmation | No enumeration or PII; safe route re-entry |
| `Q10-014` | Cross-host submission tamper | Server resolves canonical context and rejects mismatched identifiers |
| `Q10-015` | Preview | Correct draft host/locale/state; protected/noindex; no analytics or production side effects |
| `Q10-016` | Content webhook replay | Authenticated, idempotent, targeted invalidation; duplicate safe |
| `Q10-017` | Arabic form | Logical order, mixed-data isolation, validation/focus/status parity |
| `Q10-018` | Keyboard/screen reader | Shell, drawer, forms, status and recovery are operable/announced |
| `Q10-019` | Analytics privacy | Taxonomy complete; no direct PII or sensitive free text |
| `Q10-020` | Security headers/CSP | Expected headers pass on every production host without breaking required assets/providers |
| `Q10-021` | Performance budgets | Representative parent/local/Arabic pages meet approved bundle/weight/lab gates |
| `Q10-022` | Rights/expiry | Withdrawn/expired proof/media/partner/resource disappears or uses approved fallback everywhere |
| `Q10-023` | Migration reconciliation | Counts/relations/locale/status and sampled semantics match approved source/mapping |
| `Q10-024` | Redirect/SEO | No loops/chains; canonical/hreflang/sitemap/robots/structured data correct |
| `Q10-025` | Backup/restore/rollback | Rehearsal completes within approved RTO/RPO and in-flight jobs remain safe |

The 16 `QA09` cases remain required; `Q10` adds implementation, data, security, integration and operations evidence.

## 4. Coverage matrix minimum

| Dimension | Minimum release coverage |
|---|---|
| Hosts | Global parent + representative `L1` + representative `LM` + unknown/inactive |
| Locales | Every launched locale; FR/EN/AR architectural smoke even when not all are launched |
| Viewports | Agreed wide desktop, laptop, tablet, small mobile; reflow/zoom |
| Input | Keyboard, pointer, touch; representative screen reader |
| Preferences | Default, reduced motion, consent accept/deny/preferences |
| Event states | Normal lifecycle plus postponed/cancelled and independent audience availability |
| Provider states | Ready, delayed, unavailable, retrying, failed, manual fallback |
| Media/content | Full, partial, long, missing, expired, withdrawn, stale |

Exact supported browser/device versions are recorded from analytics/business needs under `OPEN-112`; they are not invented here.

## 5. Severity and release rule

| Severity | Meaning | Release rule |
|---|---|---|
| P0 | Data loss/leak, cross-host exposure, impossible/false conversion, inaccessible critical path, security/rights/legal blocker, site unavailable | Must fix; no release |
| P1 | Major journey/state/locale/device/provider failure with no adequate fallback | Must fix or owner-approved narrow scope removal; no silent waiver |
| P2 | Material quality issue with viable workaround | Owner decision with deadline and monitoring |
| P3 | Minor polish/documentation issue | Backlog with owner |

## 6. Release candidate gate

- repository baseline and intended changes reviewed;
- migrations and rollback rehearsed;
- route/template/state/locale/host matrix passes;
- all applicable `Q10`, `QA09` and PRD acceptance conditions pass;
- production content, evidence, offers, legal, contacts and media are approved;
- providers pass sandbox then controlled production smoke tests;
- accessibility/performance/security/SEO/privacy gates pass;
- monitoring, alerts, dashboards, backups and runbooks are active and owned;
- no P0/P1 findings, blocking console/network errors, or House of Yellow residue;
- release notes, known differences and rollback decision are signed.

## 7. Launch verification

Immediately verify canonical hosts/locales, critical pages, forms and provider results, robots/canonical/sitemaps, analytics ingestion, media, headers, certificates/DNS, error rates, queue age and Core Web Vitals. Maintain a rollback decision window and named incident channel/owners.

