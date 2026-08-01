# CMS, Editorial, and Content Delivery Architecture

**Document ID:** `SPM-TECH-CMS-001`  
**Status:** `PROVIDER_NEUTRAL_CONTRACT_APPROVED_CMS_ADR_PENDING_AUDIT`

## 1. Boundary

The CMS owns governed editorial truth and publication workflow. It does not own website submissions, CRM stages, provider delivery status, or the complete sales pipeline.

Public components consume normalized domain views from `ContentRepository`. They never import WordPress, WPGraphQL, Supabase, or another vendor response type directly.

## 2. Editorial workflow

```text
draft -> in_review -> changes_requested -> approved -> scheduled/published -> expired/withdrawn/archived
```

Required roles are contributor, editor, evidence reviewer, translator, publisher, administrator, with legal/brand/media approval capabilities assigned where needed. Separation of duties and exact role combinations are confirmed in the provider audit.

Publication blocking checks include:

- required host/locale/template fields;
- route/slug/canonical uniqueness;
- event state/date/CTA validity;
- critical fact equivalence across released locales;
- proof source/definition/period/owner/approval;
- offer version/applicability/terms/public-price mode;
- media origin/rights/territory/use/period/alt/poster;
- resource version/file/access/expiry/replacement;
- legal/consent version and effective date;
- relation integrity and valid next action;
- SEO/social metadata and noindex rules.

## 3. Localization

- content has a stable language-neutral identity and explicit locale variants;
- each host declares which locales are production-complete;
- translation status is visible per field/record/locale;
- critical event, offer, proof, and legal facts are locked or compared automatically;
- missing translations do not silently mix languages;
- slugs are localized while canonical relations remain stable;
- Arabic content receives fluent editorial and RTL review, not mechanical mirroring only.

## 4. Preview

Preview tokens/links are short-lived or authenticated and bind to host, locale, record/version, route, and requested state. Preview must:

- render the real approved template/component system;
- show a persistent non-production banner;
- send `noindex` and no public canonical leakage;
- disable public analytics and all production conversion side effects;
- use provider sinks/test accounts for any explicitly enabled test action;
- expire/revoke safely and avoid personal data in the URL.

## 5. Content delivery and revalidation

1. CMS emits an authenticated, replay-safe webhook with stable record/version identity.
2. Application resolves affected host/locale/routes from relations.
3. It invalidates targeted object and route-family tags.
4. Rebuild/revalidation result is observable; repeated webhook events are idempotent.
5. Publication anomalies open an operational alert without exposing unpublished content.

The system does not purge every host/locale for one local edit unless dependency resolution proves it necessary.

## 6. Media pipeline

Media records—not raw URLs—control delivery. Required behavior:

- original kept outside public transformation where appropriate;
- responsive image derivatives and art-directed crops;
- separate mobile/desktop poster sources when required;
- video captions/transcript/control/reduced-motion behavior;
- focal point and crop preview;
- rights expiry and withdrawal invalidates every affected surface;
- missing/failed asset renders the approved poster/type fallback;
- automated link/asset checks fail on production-critical missing media.

## 7. CMS retain/replace decision (`ADR-004`)

The existing WordPress/WPGraphQL option passes only if evidence confirms:

| Gate | Required evidence |
|---|---|
| Schema fit | Canonical entities, relations, versions, localization, state validation, preview |
| Editorial fit | Roles, review/approval, scheduled publish, audit, recovery |
| Delivery fit | Stable IDs, authenticated webhooks, targeted revalidation, acceptable query performance |
| Security | Supported versions/plugins, least privilege, admin hardening, backups, incident ownership |
| Operations | Environments, migrations/config-as-code where possible, monitoring, restore rehearsal |
| Cost/ownership | Named owner, licensing/hosting/maintenance cost, vendor/plugin exit risk |

Decision outcomes:

- `RETAIN_AND_HARDEN`: keep WordPress/WPGraphQL and implement the adapter;
- `RETAIN_FOR_MIGRATION_WINDOW`: read legacy content while a replacement is prepared;
- `REPLACE`: migrate to an approved structured CMS behind the same repository;
- `BOUNDED_POC_ONLY`: use Supabase or another tool for validation without declaring it production CMS.

## 8. Content fixtures and migration

- fixtures are labeled non-production and contain no invented public claims;
- source content retains legacy ID/URL, owner, status, locale, evidence and rights provenance;
- migration rejects/queues invalid content instead of auto-publishing it;
- redirects are generated from approved legacy-to-canonical mappings;
- delta/freeze/cutover procedures prevent content divergence;
- counts and semantic samples are reconciled before and after import.

## 9. CMS activation blockers

- current WordPress/WPGraphQL inventory and security/ownership audit;
- exact content/locale/event inventory;
- production CMS owner and access model;
- approved media storage/transformation provider and rights workflow;
- backup/restore and environment plan;
- production-complete locale sequence by host.

