---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: visitor-experience
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 08 — Visitor Experience

## Role in the product

The visitor experience supports event attractiveness and demand quality. It remains a complete, useful path, but it does not displace the B2B exhibitor proposition on the corporate homepage.

## Visitor journey

```text
FIND -> UNDERSTAND -> DISCOVER -> PREREGISTER -> PREPARE -> PARTICIPATE
```

1. Find a city, country, or relevant edition.
2. Understand date, venue, programme, access, and event state.
3. Discover approved exhibitors, conferences, and practical value.
4. Complete a short consent-based preregistration when open.
5. Receive truthful confirmation, updates, and preparation information.
6. Continue to post-event recap or next-edition alternatives.

## Release 1 form boundary

Collect only fields justified by registration and disclosed follow-up. Potential qualification data such as city of residence, project type, purchase horizon, indicative budget, and geography requires explicit purpose, minimization, policy approval, and consent.

Do not include by default:

- ticket payment;
- QR ticket/check-in;
- complex matchmaking;
- a private visitor portal;
- silent sharing with exhibitors;
- marketing consent bundled with necessary registration processing.

## State behavior

| Registration state        | Public behavior                                                            |
| ------------------------- | -------------------------------------------------------------------------- |
| planned                   | explain when information will be available; offer updates only if approved |
| open                      | show short preregistration and accurate confirmation                       |
| waitlist                  | explain capacity and waitlist outcome                                      |
| full                      | remove registration promise; show alternatives                             |
| closed                    | show practical/recap/next-event path                                       |
| event postponed/cancelled | override registration CTA and display controlled recovery                  |
| provider delayed          | keep durable submission success distinct from email/CRM delay              |

## Confirmation contract

The confirmation surface must distinguish:

- record stored;
- email acknowledgement queued/delivered/delayed;
- registration status;
- event change risk and contact path;
- marketing-consent status;
- next practical step.

## Acceptance

- visitor navigation remains clear from global and event contexts;
- form is short, accessible, localized, durable, idempotent, and recoverable;
- no contradictory event/registration states;
- no PII in URLs, analytics, or ordinary logs;
- Arabic RTL, mobile, keyboard, zoom, error, duplicate, delayed-provider, closed, and cancellation states pass.
