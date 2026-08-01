---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: quality-security-analytics-and-operations
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 14 — Quality, Security, Analytics, and Operations

## Performance budgets

Target 75th percentile:

| Metric                                           |           Target |
| ------------------------------------------------ | ---------------: |
| LCP                                              |       `<= 2.5 s` |
| INP                                              |      `<= 200 ms` |
| CLS                                              |        `<= 0.10` |
| Critical homepage JavaScript                     | `<= 170 KB gzip` |
| Initial mobile transfer excluding optional video |      `<= 1.5 MB` |
| Mobile hero poster                               |      `<= 250 KB` |
| Desktop hero poster                              |      `<= 450 KB` |

If evidence requires a budget change, record an ADR and impact. Do not silently remove the gate.

## Accessibility

Target WCAG 2.2 AA:

- semantic landmarks and heading hierarchy;
- keyboard access and visible unobscured focus;
- menu/dialog focus trap, return, escape, and scroll lock;
- labels, instructions, accessible errors, status announcements;
- contrast, zoom/reflow, reduced motion, target sizes;
- alt text, captions, transcripts, and decorative-media handling;
- status not communicated by color alone;
- CMS tables/forms and CRM queues/workspaces included—not only the public site.

No critical or serious automated violation remains. Critical journeys require manual keyboard and screen-reader checks.

## Security and privacy

- WAF/DDoS, rate limiting, bot controls, CSP, security headers;
- server-side validation and authorization;
- MFA/strong auth for privileged operations;
- tenant-scoped roles and RLS;
- least-privilege keys and secure sessions;
- idempotency and duplicate controls;
- audit for publication, consent, assignment, export, permission, and destructive actions;
- encrypted backup/restore process and retention decisions;
- safe redirects/uploads and restricted source maps;
- purpose, notice version, minimization, withdrawal, export/deletion, and partner-sharing rules;
- no PII in analytics, URLs, ordinary logs, or client errors.

## Analytics taxonomy

| Layer      | Examples                                             | Truth rule                   |
| ---------- | ---------------------------------------------------- | ---------------------------- |
| Discovery  | event selected, destination filtered, locale changed | stable IDs, no PII           |
| Evidence   | proof viewed, case opened, source opened             | no identity inference        |
| Conversion | form started/error/durably submitted                 | separate durable outcome     |
| Delivery   | resource delivered, meeting booked                   | provider outcome is distinct |
| CRM        | assigned, qualified, meeting, proposal, won/lost     | server-side governed events  |
| Recovery   | integration delayed, dead letter, media fallback     | safe failure class only      |

The funnel is:

```text
spend/source -> session -> durable lead -> qualified -> meeting/attendance -> opportunity
```

Business outcome definitions and attribution windows require owner approval.

## Observability

Monitor:

- DNS/TLS, uptime, latency, Web Vitals, server/client errors;
- forms, webhooks, queue age, retry/dead-letter volume, DB/provider health;
- broken images/video/resources, missing posters, cache/revalidation failures;
- stale year/date, ended event still open, country mismatch, missing legal/canonical;
- CMS publication failures, translation gaps, expired proof/rights;
- CRM SLA aging, unassigned leads, duplicate rate, provider delay.

Every alert has severity, owner, runbook, response target, and safe correlation data.

## Operational readiness

- protected staging and production;
- branch/PR checks and reviewed migrations;
- environment variable names documented without values;
- release, rollback, incident, data restore, provider outage, and content withdrawal runbooks;
- dependency and security update policy;
- dashboard access and alert ownership assigned across CTO/PM/Engineer/operations.
