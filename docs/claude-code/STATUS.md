# STATUS

Updated: 2026-07-30 (Session 0)

- **Active phase:** Product execution — implementation
- **Active queue items:** `HOY-070` core built + verified (commit 9aeca2a, 2026-07-31); `HOY-060` and `HOY-050` core built with polish registers in QUEUE.md. `HOY-000`–`HOY-030` DONE.
- **Updated:** 2026-07-31
- **Next safe action:** HOY-080 — project detail template (extract one detail page's full structure/copy, e.g. oceanco-leviathan, build CMS-shaped template, validate, then populate all 21 from per-page extraction, which also completes the per-project tag audit). Alternatively HOY-040 (data model — `lib/content/projects.ts` now defines the project shape to formalize).
- **Model:** Claude Fable 5 (`claude-fable-5`), Claude Code 2.1.220
- **Repository:** fresh git repo initialized 2026-07-30; scaffold committed
- **Last verified commit:** `8426f59` — HOY-000 bootstrap + scaffold; typecheck/lint/format/build all passing at this commit
- **Setup gate:** `WORKFLOW_READY=true` (see `SETUP-VALIDATION.md`)
- **Known failures:** none
- **HOY-010 progress:** route inventory frozen (27 routes, all 200; 404 verified); tech stack re-verified live — GSAP/ScrollTrigger/SplitText/MorphSVG, Lenis, Swup, Complianz, CF7+reCAPTCHA, Smash Balloon IG, GA4, WP 7.0.2 all now `Observed`; content inventory (initial) + asset manifest (initial) written; global shell, index filters (8 categories + grid/list), project template blocks, Connect form/clocks documented.
- **Capture caveat:** local ad-blocker proxy (127.0.0.1:26514) injects CSS into pages — HOY-020 captures need a clean profile (see TECHNICAL-FORENSICS).
- **HOY-030 progress (2026-07-30):** full 452 KB theme CSS captured (Autoptimize inlines it — extracted via DOM); design tokens extracted with evidence: 2 breakpoints (1080/580), color frequencies, 3-regime linear vw type system (verified by 12-width computed probe → `qa/typography-probe.json`), z-index ladder, vw radius scale, CSS transition system (0.45s + 150ms stagger ladder); GSAP vocabulary + verbatim Lenis config extracted from 24 theme JS bundles; icomoon icon font discovered + downloaded; tokens implemented in `app/globals.css` (@font-face, CSS vars, Tailwind @theme) + layout.tsx font preloads mirroring reference. Reference has NO real reduced-motion support — our fallback is a recorded intentional addition.
- **Next safe action:** when the HOY-020 matrix completes — run `node qa/record-motion.mjs`, review capture-manifest for errors, retry missed states (consent-preferences dialog, desktop filter-open), fill VALIDATION-MATRIX ref column, commit evidence; then map motion timelines from recordings into MOTION-SYSTEM.md; then HOY-040 (data model) or HOY-050 (shell) — shell can start immediately, it depends only on HOY-030.
