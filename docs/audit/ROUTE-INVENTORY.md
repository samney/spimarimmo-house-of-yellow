# Route Inventory — houseofyellow.nl

Verified live: 2026-07-30 via Playwright (Chromium). Classification: `Observed` unless noted.

## Discovery sources checked
- `robots.txt` — Yoast block; `User-agent: *`, `Disallow:` (nothing disallowed); sitemap pointer to `/sitemap_index.xml`. Observed 2026-07-30.
- `sitemap_index.xml` — Yoast; exactly 2 child sitemaps: `page-sitemap.xml` (lastmod 2026-07-30 07:40Z), `project-sitemap.xml` (lastmod 2026-07-21 10:20Z).
- Navigation/footer/internal-link crawl — pending (HOY-010 continuation) to catch any unlisted routes.

## Core routes (page-sitemap.xml, 6 URLs — matches master-prompt pre-audit exactly)
| Route | Sitemap lastmod | Status (verified 2026-07-30) |
|---|---|---|
| `/` | 2026-06-19 | **200**, loaded, title `HOY | House Of Yellow`; console errors = local ad-blocker only |
| `/connect/` | 2026-03-17 | **200**, loaded, `Connect - HOY | House Of Yellow`; CF7 form + live clocks + Instagram feed |
| `/cookies/` | 2026-04-15 | **200** (fetch-verified); Complianz policy page, full render capture pending |
| `/culture/` | 2026-06-05 | **200**, loaded, `Culture - HOY | House Of Yellow` |
| `/how-we-roll/` | 2026-06-11 | **200**, loaded, `How we roll - HOY | House Of Yellow` |
| `/made-by-yellow/` | 2026-07-30 07:40Z | **200**, loaded, `Made by Yellow - HOY | House Of Yellow`; today's modification did NOT change the 21-project set (verified against pre-audit table) |

## Project routes (project-sitemap.xml, 21 URLs)
Exactly the 21 slugs in the master prompt's pre-audit table — no additions, no removals:
`xxl-nutrition-festival-activations`, `qbuzz-smiley-campaign`, `buddha-to-buddha-los-angeles`, `de-hollandse-100-lymphco`, `streetgasm`, `htc`, `salvia-bioelectronics`, `porsche-employer-branding`, `the-space-dubai`, `glow-eindhoven-light-festival`, `hotek-brand-video`, `madunia-brand-launch`, `broederliefde-rotterdam-ahoy`, `de-klerk-employer-branding`, `tmc-fundamentals`, `eiffel-employer-branding`, `klibansky-superman`, `srg-international-reeses`, `ansu-fati-arriba-nutrition`, `oceanco-leviathan`, `la-fuente-x-amg` (lastmod 2026-07-21 — newest project).

## Error routes
- Unknown URLs return **HTTP 404** (fetch-verified 2026-07-30, `redirect: manual` — no redirect). The earlier `ERR_HTTP_RESPONSE_CODE_FAILURE` navigation abort was caused by the local ad-blocker proxy (see TECHNICAL-FORENSICS capture caveat). Rendered 404 page capture pending in HOY-020 with a clean profile.
- All 27 canonical routes fetch-verified **200** with no redirects.
- Homepage nav/footer internal-link crawl found no routes beyond the sitemap set (only `/cookies/` consent anchors).

## Notes
- No legal/privacy routes beyond `/cookies/` appear in the sitemaps. Footer crawl must confirm none are unlisted.
- No locale-prefixed routes exist on the reference (single-language EN site); FR routes are a new-build requirement, not a reference behavior.
- `made-by-yellow` was modified the morning of this audit — pre-audit content evidence for that page must be re-verified before implementation (tracked as A-1 in ASSUMPTIONS.md).
