# 10 — CMS Implementation

## Goal

Give the SPIMARIMMO team a real editorial control plane for events, proof, media, locales, resources, pages, and legal content. A database console or static dashboard is not the CMS.

## Architecture decision

Public rendering depends on typed `ContentRepository` and `MediaRepository` interfaces, not directly on a vendor schema.

The current WordPress/WPGraphQL stack must be audited for content quality, permissions, preview, localization, and API reliability. A Supabase-backed POC is allowed behind the same interfaces. The production choice remains an ADR until evidence supports it.

## Roles

| Role | Core permissions |
|---|---|
| Administrator | manage users, roles, tenants, configuration, and emergency withdrawal |
| Content manager | create/edit/relate content, manage schedule and archive within scope |
| Reviewer/publisher | approve, request changes, publish, withdraw, and verify output |
| Translator | edit assigned locale fields without changing source approval |
| Media manager | manage assets, rights, derivatives, metadata, and allowed usage |
| Analyst/read-only | inspect content, health, and audit without mutation |

Permissions are server-enforced and tenant-scoped. Critical publication and role actions are audited.

## CMS modules

1. Dashboard: readiness, upcoming events, stale/expired proof, missing translations, broken resources, review queue.
2. Pages/blocks: typed composition with guardrails and preview.
3. Events/destinations: lifecycle and audience availability axes.
4. Offers: capabilities, applicability, visibility, and availability.
5. Proof/cases/testimonials/partners: source, approval, permission, expiry, withdrawal.
6. Resources/insights: versions, locale, relations, access/delivery, metadata.
7. Media: rights, focal points, derivatives, alt/captions/transcripts, placement.
8. Navigation/footer/contact/legal: host and locale configuration.
9. Locales: translation matrix, stale-source detection, review, completeness.
10. Users/roles/audit: scoped access and traceability.

## Editorial workflow

```text
CREATE -> VALIDATE -> REVIEW -> APPROVE -> PREVIEW -> PUBLISH -> VERIFY -> REVISE/ARCHIVE/WITHDRAW
```

- draft previews are protected and never indexed;
- validation includes required fields, relations, sources, rights, locale, event-state consistency, and SEO;
- publishing creates a revision, audit record, and targeted cache revalidation;
- public verification confirms route, content, metadata, locale, and media;
- withdrawal removes proof/media from every placement without erasing history;
- concurrent editing and version conflicts have a safe resolution path.

## Dashboard design requirements

The CMS uses the shared SPIMARIMMO design system in `CMS_EDITORIAL` mode:

- medium density and stable workspace navigation;
- content readiness and source status ahead of decorative media;
- side-by-side desktop/mobile/RTL preview;
- clear draft/review/approved/published/expired semantics;
- compare revisions and translation state;
- keyboard-accessible inventory, filters, forms, dialogs, and actions;
- restrained motion that clarifies save, review, publish, and revalidation states.

## Acceptance journey

1. Administrator creates scoped users.
2. Editor creates an event and related destination, proof, media, resource, and page content.
3. Translator completes FR/EN/AR fields; incomplete locale remains unpublished.
4. Reviewer sees source/rights/readiness, requests a correction, then approves.
5. Editor previews desktop, mobile, and RTL.
6. Publisher publishes.
7. Targeted revalidation updates the correct host/route/locale.
8. Public output is verified.
9. A revision is created and compared.
10. A proof/media item is withdrawn from all placements.
11. Permission-negative, conflict, failure, audit, and recovery tests pass.

Set `CMS_POC_ACCEPTED=true` only when this journey passes with retained evidence.

