# STATUS

Updated: 2026-07-30 (Session 0)

- **Active phase:** Product execution — implementation
- **Active queue items:** `HOY-080` all 21 project routes live (commit 024fb18, 2026-07-31); `HOY-050/060/070` cores built — polish registers per item in QUEUE.md. `HOY-000`–`HOY-030` DONE.
- **Updated:** 2026-07-31
- **Public routes now implemented:** `/`, `/made-by-yellow`, all 21 `/project/[slug]` — EN + FR shells. Missing: `/culture`, `/how-we-roll`, `/connect`, `/cookies`, 404 page.
- **Next safe action:** HOY-090 (Culture + How We Roll — same extract→build→verify loop; content partially captured already) or HOY-100 (Connect — needs form backend decisions, see BLOCKERS P-2) or HOY-040 (formalize data model from lib/content shapes into Supabase migrations).
- **Model:** Claude Fable 5 (`claude-fable-5`), Claude Code 2.1.220
- **Repository:** fresh git repo initialized 2026-07-30; scaffold committed
- **Last verified commit:** `8426f59` — HOY-000 bootstrap + scaffold; typecheck/lint/format/build all passing at this commit
- **Setup gate:** `WORKFLOW_READY=true` (see `SETUP-VALIDATION.md`)
- **Known failures:** none
- **HOY-010 progress:** route inventory frozen (27 routes, all 200; 404 verified); tech stack re-verified live — GSAP/ScrollTrigger/SplitText/MorphSVG, Lenis, Swup, Complianz, CF7+reCAPTCHA, Smash Balloon IG, GA4, WP 7.0.2 all now `Observed`; content inventory (initial) + asset manifest (initial) written; global shell, index filters (8 categories + grid/list), project template blocks, Connect form/clocks documented.
- **Capture caveat:** local ad-blocker proxy (127.0.0.1:26514) injects CSS into pages — HOY-020 captures need a clean profile (see TECHNICAL-FORENSICS).
- **HOY-030 progress (2026-07-30):** full 452 KB theme CSS captured (Autoptimize inlines it — extracted via DOM); design tokens extracted with evidence: 2 breakpoints (1080/580), color frequencies, 3-regime linear vw type system (verified by 12-width computed probe → `qa/typography-probe.json`), z-index ladder, vw radius scale, CSS transition system (0.45s + 150ms stagger ladder); GSAP vocabulary + verbatim Lenis config extracted from 24 theme JS bundles; icomoon icon font discovered + downloaded; tokens implemented in `app/globals.css` (@font-face, CSS vars, Tailwind @theme) + layout.tsx font preloads mirroring reference. Reference has NO real reduced-motion support — our fallback is a recorded intentional addition.
- **Next safe action:** when the HOY-020 matrix completes — run `node qa/record-motion.mjs`, review capture-manifest for errors, retry missed states (consent-preferences dialog, desktop filter-open), fill VALIDATION-MATRIX ref column, commit evidence; then map motion timelines from recordings into MOTION-SYSTEM.md; then HOY-040 (data model) or HOY-050 (shell) — shell can start immediately, it depends only on HOY-030.
