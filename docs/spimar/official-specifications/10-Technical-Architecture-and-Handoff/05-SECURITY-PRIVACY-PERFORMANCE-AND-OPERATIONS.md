# Security, Privacy, Performance, and Operations

**Document ID:** `SPM-TECH-QA-001`  
**Status:** `CONTROL_BASELINE_APPROVED_EXECUTABLE_EVIDENCE_PENDING`

## 1. Environment model

| Environment | Data/providers | Indexing | Primary use |
|---|---|---|---|
| Local/development | Synthetic fixtures; local/test adapters | Never public | Engineering and unit/integration work |
| Preview | Synthetic fixtures; provider sinks/test accounts | `noindex, nofollow`; protected where possible | Pull-request review and visual QA |
| Staging | Sanitized/migration rehearsal data; sandbox providers | `noindex, nofollow`; access controlled | E2E, integration, migration, release rehearsal |
| Production | Approved real content/data/providers | Route-specific canonical/index rules | Public service |

Production effects are disabled by default outside production. Environment identity is visible to operators and encoded in telemetry/release evidence.

## 2. Threat-control baseline

| Area | Required controls |
|---|---|
| Host/tenant isolation | Allowlisted host registry, context-bound reads/writes, negative cross-host tests, safe unknown-host state |
| Input/output | Server schema validation, normalization, output encoding, upload/content restrictions |
| Forms/abuse | Rate limits, bot/spam defense, honeypot/risk signals where approved, idempotency, size limits, anomaly alerts |
| Authentication/admin | Strong provider/admin authentication, secure sessions, least privilege, protected privileged roles |
| Secrets | Server-only secret manager, environment scope, rotation, leak scanning, no client/log/source exposure |
| Integrations | Authenticated replay-safe webhooks, allowlists, scoped credentials, provider contract tests |
| Browser | HTTPS, HSTS, CSP, frame policy, MIME sniffing protection, referrer and permissions policies appropriate to features |
| Data | Encryption in transit/at rest, authorization/RLS-equivalent controls, protected exports, audited access |
| Supply chain | Lockfile, dependency/config/secret scanning, controlled upgrades, build provenance |
| Recovery | Tested backups, restore, rollback, incident contacts and evidence |

Security header values are implemented and validated against the actual asset/provider set. CSP is not weakened with broad wildcards to make an integration work.

## 3. Privacy by design

- collect only fields tied to a documented purpose;
- separate necessary processing from optional marketing consent;
- store consent/notice version with the submission;
- define controller, recipients, processors, transfers, retention, rights, objections and suppression before activation;
- exclude personal/sensitive values from URLs, analytics, public caches and routine logs;
- make exports role/purpose-scoped and protected;
- implement access, correction, deletion/anonymization, objection, withdrawal and suppression workflows;
- do not share visitor data with exhibitors without a separately approved purpose, notice and operational contract.

This package is a technical control plan, not legal advice. Legal/privacy approval is a launch blocker.

## 4. Performance budgets

| Budget | Gate |
|---|---:|
| Homepage critical client JavaScript | `<= 170 KB gzip` |
| Initial mobile transfer excluding optional video | `<= 1.5 MB` |
| Mobile hero poster | target `<= 250 KB` |
| Desktop hero poster | target `<= 450 KB` |
| Production font families | maximum 2 with subsetted weights |
| Core Web Vitals target at p75 | LCP `<= 2.5 s`, INP `<= 200 ms`, CLS `<= 0.1` |

Controls:

- critical text/actions render on the server;
- no hero video is LCP or aggressively preloaded on constrained/mobile contexts;
- explicit responsive image sizes and art-directed crops;
- lazy non-critical media/galleries/third-party scripts;
- reserve media/component geometry to avoid layout shift;
- limit client islands and measure bundle cost per story;
- honor reduced motion without feature/content loss;
- segment real-user metrics by device, host/market, route family and locale where volume permits.

Budget changes require measured evidence and a recorded decision.

## 5. Accessibility engineering

- semantic HTML and native controls by default;
- deterministic keyboard order, visible focus, focus containment/return for dialogs/drawers;
- error summary linked to invalid fields and status announcements;
- zoom/reflow to 400%, large text and long-content tests;
- appropriate `lang`, `dir`, mixed-script isolation and Arabic RTL behavior;
- media controls, captions/transcripts where required, posters and reduced motion;
- color/contrast and non-color state cues;
- representative screen-reader testing in released locales;
- automated checks support but never replace manual review.

## 6. Observability

| Signal | Minimum dimensions | Alert examples |
|---|---|---|
| Runtime/render | environment, release, host, locale, route/template | error spike, render failure, unknown host |
| Forms | purpose, host, locale, route, result class; no PII | validation spike, durable write failure, unexpected zero submissions |
| Jobs/providers | adapter, operation, state, attempt, age | queue age, terminal failures, auth/config failure |
| Content | object type, host, locale, publish/state result | invalid event state, stale/expired proof/resource/media |
| Performance | route family, device, host, locale, release | budget/CWV regression |
| Availability | host, route family, region | uptime/latency/certificate/DNS issue |
| Analytics | taxonomy/version, ingestion state | schema rejection, ingestion drop |

Every alert has severity, owner, response route, runbook and closure evidence. Logs/traces use correlation IDs and sanitized structured fields.

## 7. Reliability and recovery

- website form durability does not depend on CRM/mail/calendar availability;
- jobs expose queued, processing, succeeded, retrying and terminal failure;
- releases are backward-compatible with in-flight jobs and staged database changes;
- backups and restore are rehearsed with recorded recovery evidence;
- deployments support fast rollback; destructive migrations use expand/migrate/contract sequencing;
- launch requires agreed availability, RTO and RPO from the CTO/engineering owner (`OPEN-112`).

## 8. CI/CD quality gates

Applicable changes must pass:

1. format/lint/type/build;
2. unit and state/property tests;
3. component and accessibility tests;
4. repository/provider contract tests;
5. migration/schema checks;
6. route/link/metadata/structured-data tests;
7. host/locale/RTL/reduced-motion smoke tests;
8. E2E conversion and provider-failure tests;
9. visual regression against approved target coverage;
10. performance budgets;
11. security headers, dependency, configuration and secret scans;
12. staging deployment health and rollback evidence for release candidates.

No snapshot approval may override a semantic, state, accessibility, privacy, or conversion-truth failure.

## 9. Runbook set required before launch

- failed/zero submissions;
- CRM/email/resource/scheduler outage and replay;
- wrong event state/date/CTA;
- broken or rights-withdrawn media/resource;
- content rollback and emergency unpublish;
- host/DNS/certificate/canonical incident;
- privacy request, consent propagation and export incident;
- credential exposure/rotation;
- deployment rollback and database restore;
- analytics/CWV regression.

