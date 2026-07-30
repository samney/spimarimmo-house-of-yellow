# Asset Manifest — houseofyellow.nl (initial)

Initial catalogue 2026-07-30 from live DOM. Status legend: `catalogued` (URL + usage known) → `downloaded` → `optimized`. Nothing downloaded yet; downloads happen in HOY-020/030 with dimensions recorded at save time. All URLs are authorized public assets; production hotlinking prohibited.

## Fonts (self-host in `public/fonts/`)
| File | Source | Preloaded | Status |
|---|---|---|---|
| Poppins-Light.woff2 | `/wp-content/themes/hoy/assets/fonts/` | no (pre-audit) | catalogued |
| Poppins-Regular.woff2 | same | yes | catalogued |
| Poppins-Medium.woff2 | same | yes | catalogued |
| Poppins-SemiBold.woff2 | same | yes | catalogued |
| Poppins-Bold.woff2 | same | no (pre-audit) | catalogued |

License note: Poppins is OFL (Google Fonts); self-hosting authorized both by project authorization and OFL.

## Video (Vimeo progressive, signed URLs — re-resolve at download time)
| Playback ID | Rendition seen | Used on | Poster | Status |
|---|---|---|---|---|
| 1202811863 | 1080p | Home hero | — | catalogued |
| 1196251477 | 540p | Home featured (works) | Comp-3_11_33-600x439.jpg | catalogued |
| 1204605394 | 540p | Home featured (works) | Comp-3_11_36-600x439.jpg | catalogued |
| 1194133383 | 720p | Home + Culture (shared featured-work block) | — | catalogued |
| 1188020746 | ? | Culture | — | catalogued |
| 1188018691 | ? | Culture | — | catalogued |
| 1151544155 | ? | Culture | — | catalogued |
| 1196251479 | ? | How We Roll + Oceanco project | — | catalogued |
| 1188108650 / 1188112895 / 1188108680 | ? | How We Roll | — | catalogued |
| 1196251480 / 1196251508 / 1196251502 | ? | Oceanco – Leviathan project | — | catalogued |

Lazy `<video>` elements gain `src` on scroll — per-page scroll-through required to enumerate the rest (HOY-020, per project page).

## Images
- Posters under `/wp-content/uploads/2026/05/` (e.g. `Comp-3_11_33-600x439.jpg`, `Comp-1_26_7-600x800.jpg` from pre-audit).
- Client-logo SVGs under `/wp-content/uploads/2026/06/` (≈20 brands per pre-audit: XXL Nutrition, Team Eiffel, SuperOffice, StreetGasm, SRG International, Qbuzz, PSV, La Fuente, KPN, Joseph Klibansky, HOTEK, High Tech Campus, GLOW Eindhoven, De Klerk, Buddha to Buddha, Broederliefde, Philips Hue, TMC, Lymph&Co, …) — exact file list to be captured from the homepage marquee DOM in HOY-020.
- OG share image `/wp-content/uploads/2026/05/share-image.jpg` (1200×675) — catalogued.
- `img` tags returned empty on culture/project probes → imagery is largely video + CSS backgrounds; background-image extraction needed in HOY-020.

## Icons/graphics
- Logo mark + social icons: inline SVG in header (extract markup in HOY-030; MorphSVGPlugin present — check for logo/menu morph animations).
