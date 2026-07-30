# QUEUE — House of Yellow delivery queue

Statuses: `PENDING` · `IN PROGRESS` · `BLOCKED` · `DONE (evidence)`. Never `DONE` without evidence paths. Dependencies must be `DONE` first unless a safe partial is recorded.

## HOY-000 — Bootstrap control plane and repository quality gates — **DONE (evidence below)**

Depends: — (Session 0 gate passed)
Tasks: git repo (done, Session 0); control files (done, Session 0); Next.js + TS strict + Tailwind + ESLint + Prettier scaffold; pnpm pinned; `.nvmrc`/`engines`; `.gitignore`; `.env.example` per environment contract; test runners (`@playwright/test`, unit runner) wired; scripts: `dev/build/lint/typecheck/test`; initial commit.
Acceptance evidence (2026-07-30): `pnpm run typecheck` → clean exit; `pnpm run lint` → clean exit; `pnpm run format` applied; `pnpm run build` → Next.js 16.2.12 production build succeeded, routes `/` and `/_not-found` prerendered static. Control files present under `docs/claude-code/`. Initial commit `8426f59` (43 files). Stack deps installed: gsap 3.15, @gsap/react 2.1, next-intl 4.13, zod 4.4, react-hook-form 7.83, @supabase/supabase-js 2.111, @supabase/ssr 0.12; dev: prettier 3.9, vitest 4.1, @playwright/test 1.62, @axe-core/playwright 4.12.

## HOY-010 — Complete live-site discovery — **IN PROGRESS**

Depends: HOY-000
Tasks: crawl houseofyellow.nl via Playwright MCP: nav, footer, sitemap.xml, robots.txt, all 21+ project routes, cookies/legal, 404 behavior, redirects, canonical/hreflang; verify pre-audit evidence (routes table, fonts, tokens, tech stack); technology re-verification (lenis/swup classes, Vimeo IDs, Complianz).
Acceptance: `docs/audit/ROUTE-INVENTORY.md`, `CONTENT-INVENTORY.md`, `ASSET-MANIFEST.md` (initial), `TECHNICAL-FORENSICS.md` (initial); every route responds & documented.

## HOY-020 — Capture reference evidence — **DONE (evidence below)**

Depends: HOY-010
Acceptance evidence (2026-07-30): full matrix 28 routes × 8 viewports × {top, full-page} in `qa/reference/{desktop,tablet,mobile}` (1920/1440/1280/1024 as PNG, 768/430/390/360 as JPEG per D-006; 470+ files, 0 capture errors in final runs); interaction states in `qa/reference/states/` (consent banner d+m, contact-form validation d+m, list view d+m, filters open d+m, filters applied (mobile), nav open (mobile), reduced-motion home); 5 motion recordings in `qa/recordings/` (load+scroll, page transition, works hover/filter/list, project scroll, mobile nav); `capture-manifest.json` with per-page video IDs/posters/bg-images/console errors for 4 viewports; dynamic-region register `docs/audit/DYNAMIC-REGIONS.md` (9 regions). Notes: consent "preferences dialog" does not exist as a separate state (in-banner toggles + /cookies/ widget — verified); captures are disk-only per D-006 and regenerable via committed scripts.

## HOY-030 — Extract design and motion systems — **DONE (evidence below)**

Depends: HOY-020
Acceptance evidence (2026-07-30): `docs/design-system/DESIGN-SYSTEM.md` (colors by frequency, 3-regime linear vw type system verified via 12-width probe `qa/typography-probe.json`, breakpoints 1080/580, vw radii, z-ladder, letter/line values, CSS transition system), `MOTION-SYSTEM.md` (verbatim Lenis config, GSAP vocabulary from 24 theme JS bundles, set-piece list, reduced-motion policy), `COMPONENT-INVENTORY.md` (per-route component map). Tokens implemented in `app/globals.css` (6 @font-face incl. icomoon, CSS vars, Tailwind @theme, regime media queries) + `layout.tsx` preloads; fonts downloaded to `public/fonts/`. Gates passed at commit 8cc2f4e. Note: fine-grained per-animation timeline parameters (exact durations per set piece) are refined against `qa/recordings/` during each set piece's implementation (HOY-050+), per the continuous-fidelity rule.

## HOY-040 — Implement data model and migrations — PENDING

Depends: HOY-030 (content shapes known)
Tasks: schema per master-prompt domain model (identity, pages, projects, media, global config, operations); versioned migrations; RLS on all tables; seed data; `docs/architecture/DATA-MODEL.md`; RLS tests.
Acceptance: migrations apply cleanly on local Supabase; RLS test evidence; DATA-MODEL.md justifies every table.

## HOY-050 — Build global public shell — **IN PROGRESS (core built + verified)**

Depends: HOY-030
Built 2026-07-30 (verified against reference via local prod-server screenshots `qa/implementation/shell2--*`):
- next-intl routing skeleton (EN default `/`, FR `/fr/...`), middleware, `app/[locale]/(public)` structure, `/en` + `/fr` prerender.
- `SiteHeader` (fixed z-12, exact reference markup classes, HOY logo + HOUSE/OF/YELLOW wordmark SVGs verbatim, icomoon social glyphs, uppercase yellow Connect pill w/ reference .button rule + marquee hover, light-variant support, hamburger + full-screen mobile menu w/ Office/Contact cols).
- `SiteFooter` — fixed yellow reveal-on-scroll (reference rule) w/ ResizeObserver-measured page margin; stacked 150×150 logo, 4 columns, bottom row.
- `WhatsAppButton` (3.75vw circle at reference position), `CustomCursor` (z-20, quickTo-follow, Play/Video marquee states, dark-section inversion, pointer-fine only), `ConsentBanner` (Complianz-equivalent opt-in: Accept/Deny/View preferences, 4 categories, localStorage + `hoy:consent` event; locale-consistent EN strings), `SmoothScroll` (verbatim reference Lenis config + ScrollTrigger ticker), reusable `Marquee` (reference DOM structure, CSS loop first pass).
- All reduced-motion aware. Gates pass (typecheck/lint/build).
Remaining before DONE: page-transition choreography (from `qa/recordings/page-transition-*`), GSAP marquee refinement to exact px/s speeds, axe run + keyboard-focus evidence, per-viewport visual diff vs reference (converges during HOY-060 when real content sits behind the chrome).

## HOY-060 — Build English homepage — **IN PROGRESS (all 4 reference blocks built + verified)**

Depends: HOY-050; HOY-040 for content-driven sections
Built 2026-07-30 (commit d227e7b; evidence `qa/implementation/home3--*` vs reference captures): hero (local video, verbatim letter SVGs, exact content positions), yellow about/work block (grain, editorial reveals, CTA pills, 3 featured projects w/ downloaded media, 32-logo marquee), dark services block (Beyond the Screen, phone tiles, animated counters, How-we-roll intro, items 05–07), closing block. SplitText char reveals + counters + scroll-light header. All copy extracted verbatim from live DOM. Gates pass.
Remaining before DONE: hero letter entrance/scroll animation + bottomContent parallax paths; phone tiles need the real looping videos (only stills downloaded — signed URLs to fetch); video play/pause overlay controls; project-tile hover state ("TAKE A LOOK" + video-on-hover behavior); verify metric finals + section index numbers against reference captures; smallTitle "Beyond the Screen" line copy verify; per-viewport pixel-diff convergence (<1%) across all 8 viewports; axe pass.

## HOY-070 — Build project index (Made by Yellow) — **IN PROGRESS (core built + verified)**

Depends: HOY-060 patterns
Built 2026-07-31 (commit 9aeca2a; evidence `qa/implementation/works--*`): all 21 projects in masonry grid (reference landscape/portrait orientations), autoplaying local video tiles (all 21 videos downloaded, 63MB), hover tags + "Take a look" chip, 8-category multi-select filters + Reset (marquee), Grid/List toggle (verbatim reference SVGs), list view rows, fixed blurred filter dock, "[ 01 ] Who we are" closing + Culture pill. Canonical dataset in `lib/content/projects.ts` (future Supabase seed). Gates pass.
Remaining before DONE: per-project full tag sets (only primary + 3 verified multi-tag sets; audit each detail page in HOY-080), grid/list morph + filter re-flow animation timing from `works-hover-filter-list--desktop.webm`, filter-state screenshots at all viewports, hover-video pause-others behavior verification, pixel-diff convergence, axe pass.

## HOY-080 — Build project template + all 21 projects — PENDING

Depends: HOY-070, HOY-040
Tasks: CMS-driven detail template (hero media, metadata, metrics, Client/Process/Project narratives, credits, next-project nav); validate one representative page fully; then import all 21 project records + assets.
Acceptance: all 21 routes render from CMS data with evidence.

## HOY-090 — Build Culture and How We Roll — PENDING

Depends: HOY-050
Acceptance: all observed content/sections/motion for both routes, validated at all viewports.

## HOY-100 — Build Connect — PENDING

Depends: HOY-050
Tasks: editorial intro, Eindhoven/Dubai/Miami local times, email/phone, WhatsApp CTA, contact form (Zod + RHF, client+server validation, honeypot, rate limiting, storage, notification), loading/success/error states, Instagram/social presentation, featured work.
Acceptance: working submissions stored + notified (or env-blocked with contract documented); all states evidenced.

## HOY-110 — Implement localization — PENDING

Depends: stable EN structures (HOY-060…100)
Tasks: next-intl wiring, `/fr/...` routes, professional French translations (brand-faithful tone), language switcher, localized metadata/sitemap/hreflang, no homepage-reset on switch, translations in CMS.
Acceptance: every public route works in FR with evidence; switcher preserves location.

## HOY-120 — Build authentication and CMS — PENDING

Depends: HOY-040; content models proven on public pages
Tasks: `/admin` Supabase Auth (email/password, reset), roles Super Admin/Content Editor/Translator, RBAC server-side + RLS parity, CRUD for all CMS modules, drafts/scheduled/published/archived, preview, revalidation, media library, translation workflows, audit fields, rate limiting.
Acceptance: role-permission matrix tests pass; all module CRUD evidenced.

## HOY-130 — SEO and platform metadata — PENDING

Depends: routes complete
Tasks: per-route metadata, OG, structured data, canonical, hreflang, localized sitemap, robots, 404 fidelity.
Acceptance: metadata audit per route recorded; sitemap/robots served correctly.

## HOY-140 — Accessibility and performance pass — PENDING

Depends: HOY-060…130
Acceptance: Axe + manual keyboard evidence per route; Lighthouse report; fixes applied; trade-offs in DECISIONS.md; `docs/audit/ACCESSIBILITY-AUDIT.md` + `PERFORMANCE-AUDIT.md`.

## HOY-150 — Visual-regression convergence — PENDING

Depends: continuous from HOY-060; final pass after HOY-140
Acceptance: reference vs implementation captures, overlays, pixel diffs for every route × viewport; static diff < 1% excluding documented dynamic regions; known-differences register.

## HOY-160 — Production readiness — PENDING

Depends: all prior
Acceptance: passing build + full test suite; setup/deployment docs; CMS admin guide; `.env.example` final; final VALIDATION-MATRIX complete; handoff docs current.
