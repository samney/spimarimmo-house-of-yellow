# Asset manifest

Use the WebP files in `assets/runtime/` and `assets/reused/` at runtime. PNG files in `assets/generated-masters/` are edit/archive masters.

## New generated assets

| ID | Runtime file | Used in | Default crop |
|---|---|---|---|
| `country_france` | `assets/runtime/country-france-paris.webp` | Tab 02 France card and phone carousel | `object-position: 50% 50%` |
| `country_canada` | `assets/runtime/country-canada-montreal.webp` | Tab 02 Canada card and phone carousel | `object-position: 50% 48%` |
| `country_belgium` | `assets/runtime/country-belgium-brussels.webp` | Tab 02 Belgium card and phone carousel | `object-position: 46% 50%` |
| `country_uk` | `assets/runtime/country-uk-london.webp` | Tab 02 Royaume-Uni card and phone carousel | `object-position: 50% 50%` |
| `country_uae` | `assets/runtime/country-uae-abu-dhabi.webp` | Tab 02 Émirats card and phone carousel | `object-position: 48% 50%` |
| `stand_plan` | `assets/runtime/stand-plan-topdown.webp` | Tab 04 stand plan card and phone preview | `object-position: 50% 50%` |

These images intentionally contain no flags, captions, logos, interface chrome or readable text. Add those in code.

## Approved reused assets

| ID | File | Placement |
|---|---|---|
| `property_hero` | `assets/reused/campaign-property-hero.webp` | Tab 01 project thumbnail; Tab 03 Instagram/emailing/feed; Tab 04 communication kit/report |
| `property_interior` | `assets/reused/show-apartment-interior.webp` | Tab 01 interior thumbnail; Tab 03 influence card |
| `property_night` | `assets/reused/project-ocean-view.webp` | Tab 01 third project thumbnail; Tab 03 final feed cell; Tab 04 tall communication visual |
| `property_wide` | `assets/reused/project-riviera-bay.webp` | Tab 03 phone hero and other wide property crops |
| `consultation` | `assets/reused/investor-consultation.webp` | Tab 03 consultation/feed frame |
| `event_crowd` | `assets/reused/affluence.webp` | Tab 03 audience/feed frame |
| `conference` | `assets/reused/conference-marche-mre.webp` | Tab 03 YouTube/video card |

## Per-tab placement map

### 01 — Clientèle qualifiée

- Phone project row: `property_hero`, `property_interior`, `property_night`.
- Formulaire, Profil qualifié, Intention, Rendez-vous and Critères: code-native HTML/CSS.
- Avatar silhouettes, check marks, progress bars and mini charts: SVG/CSS; no bitmap.

### 02 — Présence internationale

- Country cards and phone carousel: the five `country_*` files.
- World map and luminous routes: inline SVG with accessible decorative semantics.
- Country flags: existing SVG flag library or small code-native flag component. Do not generate raster flags.

### 03 — Campagnes massives

- Instagram and Emailing: `property_hero`.
- Phone feed: `property_wide`, `event_crowd`, `consultation`, `property_night`.
- YouTube: `conference`.
- Presse: `property_hero`.
- Influence: `property_interior`.
- Social controls, post chrome, press layout, charts and coverage map: code-native.

### 04 — Accompagnement complet

- Plan du stand: `stand_plan`.
- Kit communication and report: `property_hero` plus `property_night` where a secondary crop is needed.
- Brief, appointment list, support checklist, progress statuses, document sheets and report charts: code-native.

## Image rendering rules

- Use `<Image fill sizes>` when the repository uses Next.js; otherwise use `<img>` with explicit intrinsic dimensions `1672 × 941` for generated files.
- Use `object-fit: cover`; never stretch.
- Cards own clipping and radius. Do not bake card radius into the asset.
- Provide meaningful alt text only when the photograph adds information. Duplicate phone/carousel instances should use `alt=""`.
- Never put French copy or metrics inside raster images.

