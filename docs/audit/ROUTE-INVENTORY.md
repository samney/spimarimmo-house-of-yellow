# Route Inventory — houseofyellow.nl

Verified live: 2026-07-30 via Playwright (Chromium). Classification: `Observed` unless noted.

## Discovery sources checked
- `robots.txt` — Yoast block; `User-agent: *`, `Disallow:` (nothing disallowed); sitemap pointer to `/sitemap_index.xml`. Observed 2026-07-30.
- `sitemap_index.xml` — Yoast; exactly 2 child sitemaps: `page-sitemap.xml` (lastmod 2026-07-30 07:40Z), `project-sitemap.xml` (lastmod 2026-07-21 10:20Z).
- Navigation/footer/internal-link crawl — pending (HOY-010 continuation) to catch any unlisted routes.

## Core routes (page-sitemap.xml, 6 URLs — matches master-prompt pre-audit exactly)
| Route | Sitemap lastmod | Status |
|---|---|---|
| `/` | 2026-06-19 | Loaded OK, title `HOY | House Of Yellow` (2 console errors to investigate in forensics) |
| `/connect/` | 2026-03-17 | in sitemap; load-verify pending |
| `/cookies/` | 2026-04-15 | in sitemap; load-verify pending |
| `/culture/` | 2026-06-05 | in sitemap; load-verify pending |
| `/how-we-roll/` | 2026-06-11 | in sitemap; load-verify pending |
| `/made-by-yellow/` | **2026-07-30 07:40Z** (modified today — recheck content vs pre-audit) | in sitemap; load-verify pending |

## Project routes (project-sitemap.xml, 21 URLs)
Exactly the 21 slugs in the master prompt's pre-audit table — no additions, no removals:
`xxl-nutrition-festival-activations`, `qbuzz-smiley-campaign`, `buddha-to-buddha-los-angeles`, `de-hollandse-100-lymphco`, `streetgasm`, `htc`, `salvia-bioelectronics`, `porsche-employer-branding`, `the-space-dubai`, `glow-eindhoven-light-festival`, `hotek-brand-video`, `madunia-brand-launch`, `broederliefde-rotterdam-ahoy`, `de-klerk-employer-branding`, `tmc-fundamentals`, `eiffel-employer-branding`, `klibansky-superman`, `srg-international-reeses`, `ansu-fati-arriba-nutrition`, `oceanco-leviathan`, `la-fuente-x-amg` (lastmod 2026-07-21 — newest project).

## Error routes
- Unknown URL (`/this-route-does-not-exist-hoy-audit/`) → server responds with an HTTP error status; Chromium reported `ERR_HTTP_RESPONSE_CODE_FAILURE` at `domcontentloaded`, i.e. a 4xx with a response body still to capture. Action: capture the rendered 404 page + exact status code with a response-inspecting request in HOY-020 (`Inferred`: WordPress themes normally serve a themed 404 with status 404).

## Notes
- No legal/privacy routes beyond `/cookies/` appear in the sitemaps. Footer crawl must confirm none are unlisted.
- No locale-prefixed routes exist on the reference (single-language EN site); FR routes are a new-build requirement, not a reference behavior.
- `made-by-yellow` was modified the morning of this audit — pre-audit content evidence for that page must be re-verified before implementation (tracked as A-1 in ASSUMPTIONS.md).
