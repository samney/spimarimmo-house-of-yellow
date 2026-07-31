# VALIDATION MATRIX

Dimensions per route: 8 viewports (1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844, 360×800) × locales (EN, FR) × checks (content ✚ interaction ✚ accessibility ✚ performance ✚ visual-diff ✚ regression). Cells hold evidence paths, never bare "pass".

Status legend: `—` not started · `REF` reference captured · `IMPL` built · `VAL(path)` validated with evidence.

**Ref-capture column update 2026-07-30:** ALL public routes below (including 404) = `REF` at all 8 viewports — `qa/reference/{desktop,tablet,mobile}/<slug>--<WxH>--{top,full}.{png|jpg}` (disk-only per D-006; regenerate with `node qa/capture-reference.mjs`). Interaction/consent/reduced-motion states in `qa/reference/states/`; motion evidence in `qa/recordings/`.

| Route                                          | Ref capture | EN impl | FR impl | Interaction | A11y | Perf | Visual diff | Notes                            |
| ---------------------------------------------- | ----------- | ------- | ------- | ----------- | ---- | ---- | ----------- | -------------------------------- |
| `/` (Home)                                     | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/made-by-yellow/`                             | —           | —       | —       | —           | —    | —    | —           | grid/list/filter states          |
| `/culture/`                                    | REF         | IMPL    | shell   | —           | —    | —    | —           | `qa/implementation/culture2--*`  |
| `/how-we-roll/`                                | REF         | IMPL    | shell   | —           | —    | —    | —           | `qa/implementation/hwr2--*`      |
| `/connect/`                                    | —           | —       | —       | —           | —    | —    | —           | form + times masked (dynamic)    |
| `/cookies/`                                    | —           | —       | —       | —           | —    | —    | —           |                                  |
| 404                                            | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/oceanco-leviathan/`                  | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/la-fuente-x-amg/`                    | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/broederliefde-rotterdam-ahoy/`       | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/srg-international-reeses/`           | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/klibansky-superman/`                 | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/xxl-nutrition-festival-activations/` | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/qbuzz-smiley-campaign/`              | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/porsche-employer-branding/`          | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/glow-eindhoven-light-festival/`      | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/de-hollandse-100-lymphco/`           | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/streetgasm/`                         | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/de-klerk-employer-branding/`         | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/buddha-to-buddha-los-angeles/`       | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/the-space-dubai/`                    | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/htc/`                                | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/salvia-bioelectronics/`              | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/ansu-fati-arriba-nutrition/`         | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/eiffel-employer-branding/`           | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/tmc-fundamentals/`                   | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/hotek-brand-video/`                  | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/project/madunia-brand-launch/`               | —           | —       | —       | —           | —    | —    | —           |                                  |
| `/admin` (CMS, per module)                     | n/a         | —       | n/a     | —           | —    | —    | n/a         | functional validation, not pixel |

Route list is provisional until HOY-010 freezes the inventory (sitemap/robots/redirects/legal routes still to verify). Global states (nav open/closed, consent banner/preferences, WhatsApp, cursor, reduced-motion, transitions) are validated per-route and summarized here when rows gain evidence.

## Dynamic-region register (visual-diff exclusions)

To be populated in HOY-020: live local times (Connect), video frames, social feeds, any randomized content. Every exclusion documented with a mask rationale.
