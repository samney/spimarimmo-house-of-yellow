# House of Yellow Reference Foundation — Deployment and Parity Register

**Track:** B — Reference foundation  
**Status:** `STAGING_REGISTERED / REPO_IDENTIFIED_ACCESS_BLOCKED / PARITY_FAILED_P0`  
**Review date:** 31 July 2026  
**Reference:** [houseofyellow.nl](https://houseofyellow.nl/)  
**Deployed clone:** [spimarimmo-house-of-yellow.vercel.app](https://spimarimmo-house-of-yellow.vercel.app/)

---

## 1. Deployment record

| Field | Value | State |
|---|---|---|
| Staging URL | `https://spimarimmo-house-of-yellow.vercel.app/` | `CONFIRMED_LIVE` |
| Deployment platform | Vercel preview/public URL | `OBSERVED` |
| Review viewport | 1363 × 936 CSS px, DPR 1 | `INITIAL_DESKTOP_ONLY` |
| Repository path/URL | `https://github.com/samney/spimarimmo-house-of-yellow` | `REGISTERED_ACCESS_BLOCKED` |
| Branch | `main` | `REGISTERED_UNVERIFIED` |
| Commit SHA/tag | Not supplied | `REQUIRED` |
| Deployment date/build ID | Not supplied; URL reviewed 31 July 2026 | `REQUIRED` |
| Access protection | No sign-in/password wall observed | `REVIEW_REQUIRED` |
| Indexing protection | No page-level robots metadata observed; response-header state not yet verified | `P0_REVIEW_REQUIRED` |
| Authenticated routes | None observed/supplied | `OPEN` |
| Environment contract | Names supplied for site URL, Supabase, contact/email, rate limit, optional Turnstile, preview and revalidation; values intentionally absent | `REGISTERED_UNVERIFIED_AGAINST_SOURCE` |
| Repository access check | Connected GitHub workflow returned repository-not-found; local fallback had no usable GitHub authentication | `BLOCKED` |
| Environment limitations | Local video paths resolve to application 404 in the reviewed deployment | `P0_CONFIRMED` |

## 2. Initial route inventory

The following deployed internal routes were observed from live navigation and rendered page content:

| Route | Rendered title/result | Initial state |
|---|---|---|
| `/` | `HOY \| House Of Yellow` | Renders; hero media missing |
| `/made-by-yellow` | `Made by Yellow - HOY \| House Of Yellow` | Renders; all observed videos unloaded |
| `/culture` | `Culture - HOY \| House Of Yellow` | Renders; all observed videos unloaded |
| `/how-we-roll` | `How we roll - HOY \| House Of Yellow` | Renders; all observed videos unloaded |
| `/connect` | `Connect - HOY \| House Of Yellow` | Renders; all observed videos unloaded |
| `/project/oceanco-leviathan` | Project page | Renders; observed videos unloaded |
| `/project/la-fuente-x-amg` | Project page | Renders; observed videos unloaded |
| `/project/broederliefde-rotterdam-ahoy` | Project page | Renders; observed videos unloaded |
| `/cookies` | Cookies | Renders; copy still references the original production domain |

This is only the link-discovered first pass. It is not a complete route/state/viewport corpus.

## 3. Confirmed blocking discrepancies

| ID | Severity | Area | Evidence | Required correction/acceptance |
|---|---:|---|---|---|
| `REF-P0-001` | P0 | Media assets | Clone hero video is configured as `/videos/home-hero-1202811863-1080p.mp4`; direct navigation returns the clone’s 404 page. Page videos across reviewed routes remained `readyState: 0` and paused. The original homepage’s primary videos reached `readyState: 4` and played muted. | Restore/correct every media asset URL or approved delivery pipeline; automated asset/link checks must fail the build on missing media. |
| `REF-P0-002` | P0 | Hero/fallback | After consent dismissal, the clone shows a flat dark hero with the logo and copy. The configured hero video has no poster, so media failure removes the intended full-bleed visual composition. | Provide valid media plus optimized desktop/mobile posters; hero must remain intentional on denial, failure, constrained network, and reduced motion. |
| `REF-P0-003` | P0 | Preview indexing safety | Reviewed clone pages exposed no page-level `robots` meta and no canonical. The deployment is a public Vercel URL, not the final site. Response-header `X-Robots-Tag` remains unverified. | Enforce staging `noindex, nofollow` through response headers and/or metadata; add canonical only according to the staging policy; verify with automated checks. |
| `REF-P1-001` | P1 | SEO parity | The original homepage exposes its production canonical and index/follow robots metadata; the clone pages reviewed expose neither canonical nor robots metadata. | Define clone-parity metadata separately from staging noindex; final neutral foundation must support per-route canonical/social/robots configuration. |
| `REF-P1-002` | P1 | External identity/safety | Clone content, social links, WhatsApp, phone, email, office details, and cookie policy remain House of Yellow data. This is expected during parity but unsafe as a SPIMAR adaptation source if not isolated. | Keep the baseline frozen; neutralization must replace all identity/contact/legal/analytics data before SPIMAR work or public promotion. |
| `REF-P1-003` | P1 | Consent/media behavior | Denying the visible consent dialog left all reviewed clone videos unloaded; meaningful core composition depended on those videos and lacked fallback. | Classify essential/local media correctly; consent denial must not break the page’s core visual/content fallback. |
| `REF-P1-004` | P1 | Release evidence | Repository URL, `main` branch and names-only environment contract are registered, but source access, immutable commit, build ID and protection evidence remain missing. | Grant source access and supply immutable source/deployment identity before discrepancies are assigned or closed. |

## 4. What currently passes

- The deployment resolves and the reviewed public routes render HTML content.
- Global header, logo placement, dark palette, yellow action treatment, large editorial typography, footer, and core page narratives are recognizably aligned with the reference direction.
- No broken `<img>` elements were observed in the sampled desktop routes.
- No application-origin console error was observed in the sample; reported console errors came from the cloud-browser extension and are excluded from the site verdict.
- The clone includes a visible consent-management dialog and a custom 404 surface.

These passes do not compensate for the missing media, because media/motion is a central part of the selected foundation.

## 5. Required full parity audit

Before foundation approval, produce:

1. immutable branch/commit/deployment record;
2. fresh route inventory including every project/detail and error route;
3. original and clone captures at agreed wide desktop, laptop, tablet, mobile, and reduced-motion states;
4. typography/line-wrap, grid, spacing, geometry/radius, media crop, overlay, and responsive comparison;
5. intro/loading, header, hover, cursor, scroll, transition, video-control, and page-transition comparison;
6. keyboard, focus, semantic, contrast, caption/transcript, and reduced-motion review;
7. asset/route/link, console/runtime, network, build, performance, and metadata checks;
8. cookie accept/deny/preferences behavior;
9. explicit intended-difference register;
10. visual-regression evidence after each P0/P1 correction.

## 6. Gate status

| Foundation gate | Status |
|---|---|
| B0 repository safety baseline | `PARTIAL — REPOSITORY/BRANCH/ENV NAMES SUPPLIED; ACCESS/COMMIT/BUILD BLOCKED` |
| B1 staging deployment | `PARTIAL_PASS — URL LIVE; IDENTITY/NOINDEX INCOMPLETE` |
| B2 reference corpus | `STARTED — INITIAL DESKTOP SAMPLE ONLY` |
| B3 gap audit | `STARTED — P0 MEDIA/INDEXING DEFECTS CONFIRMED` |
| B4 parity convergence | `BLOCKED_BY_P0` |
| B5 neutral foundation extraction | `BLOCKED_BY_B4` |

**Current verdict:** `DO_NOT_APPROVE_FOR_SPIMAR_ADAPTATION`.

Claude Code can begin with `REF-P0-001` through `REF-P0-003` while the official SPIMAR product track continues through UX planning.
