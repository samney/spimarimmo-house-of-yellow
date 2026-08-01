---
status: active
owner: samney
version: 1.1
last_reviewed: 2026-08-01
canonical_for: multilingual-rtl-and-seo
depends_on:
  - ../governance/SOURCE-MANIFEST.md
supersedes: []
replaced_by: null
---

# 13 — Multilingual, RTL, and SEO

## Language contract

Platform support:

- French;
- English;
- Arabic with true RTL.

Production completeness may vary by approved host/release sequence, but incomplete translations never publish silently.

## Locale behavior

- explicit locale URLs;
- correct `lang` and `dir` on every page;
- locale-preserving navigation and forms;
- locale-specific metadata, structured data, resources, legal text, errors, email, and confirmation;
- canonical/hreflang consistency;
- deterministic fallback only for explicitly allowed non-public admin fields;
- source-locale revisions mark affected translations stale;
- translation review and approval are independent.

## RTL implementation

- use CSS logical properties for spacing, alignment, inset, borders, and transforms where semantics mirror;
- do not mechanically mirror logos, media, numerals, playback controls, charts, or meaningful directional icons;
- review navigation, breadcrumbs, filters, carousels, forms, validation summary, tables, timelines, and dialogs;
- preserve logical keyboard/focus order;
- test mixed Arabic/Latin/numeric content;
- avoid string concatenation that breaks Arabic grammar;
- provide Arabic-aware truncation, wrapping, and content limits.

## SEO architecture

- server-render published pages where appropriate;
- index only approved, complete, canonical pages;
- staging/preview/private/status surfaces are noindex;
- sitemaps are host/locale aware and exclude drafts/expired unapproved content;
- structured data uses the same event/article/breadcrumb truth as the page;
- redirects preserve canonical event history without duplicate pages;
- event date/status changes update structured data and indexation;
- resources/articles link to relevant event, destination, offer, or proof;
- metadata never contains unapproved claims.

## Content SEO

Approved territories may include:

- Moroccan property market;
- MRE and diaspora investment intent;
- destinations and event guides;
- investment/fiscal topics reviewed by qualified owners;
- exhibitor preparation and visibility;
- interviews, cases, methods, and market sources.

No article is published solely to create volume. Every item needs audience job, source/reviewer, update/expiry policy, and conversion relationship.

## Acceptance matrix

For representative and critical routes, verify:

- FR/EN/AR content and navigation;
- desktop/mobile and zoom/reflow;
- LTR/RTL layout and focus order;
- form labels/errors/consent/confirmation;
- metadata, canonical, hreflang, robots, sitemap, and structured data;
- locale/event context persists into CRM and provider jobs;
- no incomplete locale or stale translation is accidentally public.
