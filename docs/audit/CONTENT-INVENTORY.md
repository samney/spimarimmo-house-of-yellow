# Content Inventory — houseofyellow.nl

Initial pass 2026-07-30 (DOM extraction). Deep per-section copy capture + all 21 project narratives happen with HOY-020 visual evidence. All `Observed`.

## Global shell (every page)
- **Header**: left nav `Home / Made by Yellow / Culture / How we roll`; centered "House Of Yellow" logo link; right: LinkedIn (`linkedin.com/company/houseofyellow`), Instagram (`instagram.com/hoy`), rounded `Connect` CTA (repeated-text hover: 11 stacked "Connect" spans in two animation groups).
- **Sticky WhatsApp** control → `api.whatsapp.com/send/?phone=31620002644`.
- **Custom cursor** overlay with repeated-label states `Play` and `Video` (5 stacked spans each); dark-section variant via `removeDarkCursor`.
- **Footer** (contentinfo): `Office` — Hertogstraat 38, 5611 PB, Eindhoven, The Netherlands; `Contact` — +31 6 20 00 26 44, info@houseofyellow.nl; `Sitemap` — Made by Yellow / Culture / How we roll / Connect; `Join the movement` — "Let's shape the future — frame by frame."; bottom row `© 2026 House Of Yellow` + `Cookies` link.
- **Consent**: Complianz opt-in banner + "Manage Consent" preference center (categories incl. Statistics, Marketing; contains EN + NL strings; links to `/cookies/` anchors).

## `/` Home
Title `HOY | House Of Yellow`. Hero: fullscreen Vimeo `1202811863` @1080p (muted/loop/inline, `playVideoOnScroll initVideoOnScroll`). 13 `<video>` elements total; lazy ones gain src on scroll. Featured-work videos: `1196251477` (540p, poster `Comp-3_11_33-600x439.jpg`), `1204605394` (540p, poster `Comp-3_11_36-600x439.jpg`), `1194133383` (720p). Meta description: "We're a creative content agency that moves at the speed of your ambition. From idea to production and beyond. Where speed meets craftsmanship." Section architecture per master-prompt pre-audit (15 sections) — to re-verify section-by-section in HOY-020.

## `/made-by-yellow/`
Title `Made by Yellow - HOY | House Of Yellow`. All 21 projects in one grid, each card: year ('21–'26), title, `Views` count, `Delivery time` (values match master-prompt table exactly, verified 2026-07-30 — the sitemap `lastmod` today did NOT change the project set). Filters: 8 categories — `Artists, Corporate, Events, Employer branding, Commercials, Aftermovies, Launches, Social campaigns`; `+ filter works` toggle control; `Reset filters` (repeated-text animation); `Grid` / `List` view toggle. Closing section `[ 01 ] Who we are`: SplitText char-split H1 "A mix of top-of-their-game creators, thinkers and makers. Built on craft, driven by culture, and focused on work that actually lands. This is House of Yellow." + `Culture` CTA button.

## `/culture/`
Title `Culture - HOY`. Blocks: `headerCultureBlock`, `cultureItemBlock` ×2, `cultureQuoteBlock`, `cultureQuoteAnimationBlock`, `cultureWorkBlock` (featured work). H1 statements: "At House of Yellow, we mix hungry young creators with seasoned pros who've seen it all. That combo? …we make them work. We speak the language of culture…"; "Bold. Original. Built for brands who want to lead, not follow. All under one roof. All for the bold." Vimeo: `1188020746`, `1188018691`, `1151544155`, `1194133383` + lazy. Discipline sections (Creative, 3D Animator, Editor, 2D Animator, Director) and team content (Vinal Hindocha) from pre-audit still to be located precisely in HOY-020.

## `/how-we-roll/`
Title `How we roll - HOY`. Blocks: `headerHowWeRollBlock`, `projectTwoImagesBlock` ×2, `howWeRollTitleBlock`, `howWeRollTextItemsBlock`, `numBlockIndex`, `howWeRollDividerAnimationBlock`, `cultureQuoteAnimationBlock howWeRoll removeDarkCursor`. H1s: intro "Behind every story we create lies a method: listen first, co-create boldly, and deliver with precision. Flexible, fast, …"; `Phase 1: The Blueprint – Strategize & Design`; `Phase 2: The Studio – Capture & Create`; `Phase 3: The Polish – Edit & Elevate`; closing "Working with House of Yellow feels like having an in-house team, but with outsider firepower. You'll see it. You'll feel …". NOTE: live phase subtitle wording differs from master-prompt pre-audit ("Strategize & Design" vs "Concept & Storytelling" etc.) — live site wins; sub-item copy capture in HOY-020. Vimeo: `1196251479`, `1188108650`, `1188112895`, `1188108680` + lazy.

## `/connect/`
Title `Connect - HOY`. Blocks: `contactBlock`, `cultureWorkBlock`. H1: "Your move. Whether you've got a wild idea, a tight deadline or just want to explore what's possible we're all ears. Drop …". Live clocks (ticking seconds): `Eindhoven (CEST)`, `Dubai (GMT+4)`, `Miami (GMT-5)` — dynamic region for visual diff. Contact: tel, mailto, WhatsApp (two URL variants observed). Form: Contact Form 7 id 6 — visible fields `nameVisitor` (text), `email` (email), `message` (textarea), submit; hidden reCAPTCHA response field. Instagram feed: Smash Balloon (31 `sbi` elements). Footer + featured work follow.

## `/project/{slug}/` template (sampled: oceanco-leviathan)
Title `{Project} - HOY | House Of Yellow`. Blocks in order: `headerProjectBlock` (H1 title), `projectStatsBlock` (metrics: Impressions 4.800.000, Followers +36.000, Countries 24, Engagements 310.000 — animated counters), `projectTitleQuoteBlock`, `projectTwoImagesBlock` (plain/`text`/`sqaures` [sic] variants), `projectTextBlock` (H1s: `The Client`, `The Process`, `The Project`), `projectFullWidthLoopBlock`, `projectCreditsBlock` (H1 `Big thank you to:`), `projectRelatedBlock` (next project → la-fuente-x-amg). Vimeo: `1196251480`, `1196251479`, `1196251508`, `1196251502` + lazy. Note the theme's own typo class `sqaures` — replicate geometry, not the typo.

## `/cookies/`
Title `Cookies - HOY | House Of Yellow`. Complianz policy document (`#cmplz-document`), "last updated on 7 October 2025", EEA/UK scope. Structure: H1 `Cookies`; office address + contact paragraphs; numbered H2 sections `1. Introduction`, `2. What are cookies?`, `3. What are scripts?`, `4. What is a web beacon?`, `5. Cookies` (H3 `5.1 Technical or functional cookies`, `5.2 Statistics cookies`), `6. Placed cookies` (H3 `Miscellaneous` with H4 `Usage` / `Sharing data` / `Purpose pending investigation`), `7. Consent` (H3 `7.1 Manage your consent settings` — embedded live consent-preference widget `#cmplz-manage-consent-container` with per-category opt-in toggles: functional, preferences, statistics, marketing), `8. Enabling/disabling and deleting cookies`, `9. Your rights with respect to personal data`, `10. Contact details`. ~18 body paragraphs, no tables. Full verbatim copy capture with HOY-020.

## 404
Status 404 verified. Rendered page content capture pending (HOY-020, clean profile).

## Remaining for HOY-010/020
Per-project content for the other 20 projects; homepage 15-section copy pass; culture discipline/team details; cookies page copy; 404 render; metadata table for all routes (titles observed pattern: `{Page} - HOY | House Of Yellow`).
