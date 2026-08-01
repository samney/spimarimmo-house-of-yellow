---
status: active
owner: samney
version: 1.0
last_reviewed: 2026-08-01
canonical_for: cms-crm-and-release-acceptance-terminology
depends_on:
  - ../transformation-phase-1/15-QA-ACCEPTANCE-AND-LAUNCH.md
supersedes: []
replaced_by: null
---

# Acceptance Levels

A functional proof of capability is not production integration and neither is release readiness.

| Level                             | Meaning                                                                                                                         | Required evidence                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `CAPABILITY_ACCEPTED`             | End-to-end behavior works against deterministic repositories/adapters with real persistence, permissions, failure, and recovery | Automated and browser acceptance journey          |
| `PRODUCTION_INTEGRATION_ACCEPTED` | Selected CMS/CRM/email/calendar providers, schemas, mappings, auth, migration, sandbox/staging, retries, and ownership pass     | ADR, integration tests, staging evidence, runbook |
| `RELEASE_READY`                   | Production content/legal/privacy/roles/providers/monitoring/backup/rollback and owner sign-off pass                             | Cold audit and release evidence                   |

Use these exact flags:

```text
CMS_CAPABILITY_ACCEPTED=true
CMS_PRODUCTION_INTEGRATION_ACCEPTED=true
CMS_RELEASE_READY=true
CRM_CAPABILITY_ACCEPTED=true
CRM_PRODUCTION_INTEGRATION_ACCEPTED=true
CRM_RELEASE_READY=true
```

Historical `CMS_POC_ACCEPTED` and `CRM_POC_ACCEPTED` language maps only to `CAPABILITY_ACCEPTED`; it must never imply provider integration or release readiness.
