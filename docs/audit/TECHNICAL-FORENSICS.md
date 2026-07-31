# Technical Forensics — houseofyellow.nl

Verified live 2026-07-30 via Playwright (Chromium, viewport 895×965 during DOM probes). All items `Observed` unless noted.

## Capture-environment caveat
A local ad-blocker proxy (`https://127.0.0.1:26514/` — cosmetic.css, scriptlets.js) injects stylesheets/scripts into every page and blocks Google Tag Manager (403). All console "errors" observed so far are attributable to it, not the site. **Visual-evidence captures (HOY-020) must be taken with content blocking disabled for houseofyellow.nl, or from a clean browser profile**, and re-checked for console cleanliness.

## Platform
| Technology | Evidence | Replication decision |
|---|---|---|
| WordPress 7.0.2 | `meta[name=generator]` | Replace with Next.js + Supabase |
| Custom `hoy` theme | `/wp-content/themes/hoy/` asset paths | Reproduce external behavior only |
| Autoptimize | `/wp-content/cache/autoptimize/` CSS+JS bundles (1 CSS, ~25 JS singles) | Framework-native optimization instead |
| Yoast SEO | robots.txt block, sitemap XSL, og/canonical meta | Next.js Metadata API equivalent |

## Frontend libraries — all now `Observed` (upgraded from pre-audit "Unknown/Inferred")
| Library | Evidence | Decision |
|---|---|---|
| **GSAP core** | `themes/hoy/libjs/gsap/gsap.min.js` | Use GSAP (confirmed, not just chosen) |
| **ScrollTrigger** | `gsap/ScrollTrigger.min.js` | Use |
| **SplitText** | `gsap/SplitText.min.js`; char-split headings observed in DOM (each letter wrapped) | Use `@gsap/react` + SplitText (now freely licensed) |
| **MorphSVGPlugin** | `gsap/MorphSVGPlugin.min.js` | Identify which SVG morphs use it (likely logo/menu); replicate |
| **Lenis** | `html.lenis.lenis-smooth` classes | Use Lenis — evidence requirement met |
| **Swup** (+ GA + Head plugins) | `libjs/swup/swup.min.js`, `SwupGaPlugin`, `SwupHeadPlugin`, `html.swup-enabled` | Recreate page transitions with Next.js App Router conventions (View Transitions / GSAP), NOT Swup |
| hammer.js | `libjs/hammer.min.js` | Touch gestures (likely project carousel/swipe); replicate with native pointer events |
| jQuery 1.10.2 | Google CDN | Do not replicate |

## Third-party services
| Service | Evidence | Decision |
|---|---|---|
| GA4 `G-S3H8K0LKF4` (anonymize_ip) via gtag | inline dataLayer bootstrap + gtag.js | Consent-gated analytics slot in rebuild (owner decides final ID) |
| Complianz GDPR 7.5.0 | banner v35, policy id 34, `consenttype: optin`, region `eu`, categories statistics+marketing, cookie expiry 365 d, body classes `cmplz-*`, REST `wp-json/complianz/v1/`, link `/cookies/` | Rebuild consent natively (banner + preference center + category gating); consent dialog includes NL strings — verify intended locales in HOY-020 |
| Contact Form 7 (form id 6) + **reCAPTCHA** | form action `#wpcf7-f6-o1`, hidden `_wpcf7_recaptcha_response` field; fields `nameVisitor` (text), `email` (email), `message` (textarea), submit | Rebuild with RHF + Zod + server action; spam protection via Turnstile/honeypot per master prompt (record deviation from reCAPTCHA in DECISIONS when implemented) |
| Smash Balloon Instagram Feed | `plugins/instagram-feed/sbi-scripts.min.js`, `sbiajaxurl` admin-ajax, 31 `sbi`-class elements on /connect/ | Present curated Instagram content natively (no WP plugin); source strategy decided in HOY-100 |
| Vimeo progressive delivery | `player.vimeo.com/progressive_redirect/playback/{id}/rendition/{res}` with signed URLs | Download authorized media locally / justified provider (master prompt) |
| WhatsApp CTA | `api.whatsapp.com/send/?phone=31620002644` | Replicate |

## Fonts
Preloaded: Poppins Medium, Regular, SemiBold (`themes/hoy/assets/fonts/*.woff2`); Light + Bold declared in pre-audit @font-face (verify in HOY-030). `font-family: Poppins-font, sans-serif`.

## Measured base metrics
- `body` background `rgb(238,238,238)` = `#EEEEEE` ✓ matches pre-audit token.
- `body` font-size at 895 px-wide viewport: `9.94px` (≈1.111 vw at this width; pre-audit measured 10.22px/0.75vw at 1363px — **the vw ratio differs by breakpoint; full clamp curve must be measured across widths in HOY-030**).
- Header/nav/CTA use repeated-text hover animations (11× "Connect", 5× cursor labels "Play"/"Video") — marquee-style stacked spans.
- Custom-cursor DOM exists globally (Play/Video repeated-label groups); `removeDarkCursor` class variants appear on dark sections.

## SEO/meta (homepage)
- Canonical `https://houseofyellow.nl/`; `og:locale en_US`; site-wide meta description ("We're a creative content agency…") reused on subpages (observed on /made-by-yellow/, /culture/); OG image `2026/05/share-image.jpg` 1200×675. **No hreflang** (single-locale site).
- 404: unknown paths return HTTP 404 (fetch-verified). Rendered 404 page capture pending (ad-blocker interfered with first navigation attempt).

## HTTP behavior
All 27 canonical routes return 200 (no redirects under `redirect: manual`). No extra routes found in homepage nav/footer beyond sitemap + `/cookies/` anchors (`#cmplz-manage-consent-container` etc.).
