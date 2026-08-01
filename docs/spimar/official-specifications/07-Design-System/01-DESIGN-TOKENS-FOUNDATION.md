# SPIMARIMMO Design Tokens Foundation

**Document ID:** `SPM-DS-TKN-001`  
**Version:** 1.0  
**Status:** `COMPLETE_FOR_GATE_7_WITH_OWNED_INPUTS`  
**Date:** 31 July 2026

## 1. Token architecture

The system uses three layers so brand changes do not leak into component code:

| Layer | Example | Responsibility |
|---|---|---|
| Primitive | `color.brand.gold.500` | Raw brand or neutral value; never describes a component |
| Semantic | `color.action.primary.surface` | Meaning within a context such as action, text, surface, border, or status |
| Component | `button.primary.surface.default` | Component-only alias when a semantic role is insufficient |

Rules:

- components consume semantic or component tokens, never raw hex values;
- content authors cannot choose arbitrary colors, spacing, radii, or motion values;
- host, edition, audience, and locale do not create new brand themes;
- light/dark/media modes change semantic aliases, not the permanent black/gold identity;
- token changes require contrast, responsive, RTL, and regression evidence.

## 2. Color primitives

### 2.1 Permanent brand anchors

| Token | Value | Status | Use |
|---|---:|---|---|
| `color.brand.gold.500` | `#EFC337` | `LOCKED_DIGITAL` | Primary action, active edition, orientation signal, selected emphasis |
| `color.brand.black.1000` | `#000000` | `LOCKED_DIGITAL` | Main ink, dark stage, strongest inverse state |
| `color.neutral.white.0` | `#FFFFFF` | `APPROVED_SUPPORT` | Reading surface and content on black/graphite |

SPIMAR Gold is a warm yellow-gold, not metallic luxury gold. Metallic gradients, foil simulations, glow, and glossy gold effects are prohibited.

### 2.2 Derived neutral scale

| Token | Value | Primary role |
|---|---:|---|
| `color.neutral.950` | `#161616` | Elevated black surface; long dark sections |
| `color.neutral.900` | `#242424` | Dark utility/media surface |
| `color.neutral.800` | `#444444` | Graphite surface or strong secondary text |
| `color.neutral.700` | `#595959` | Secondary text on white (`7.00:1`) |
| `color.neutral.600` | `#6B6B6B` | Supporting text on white (`5.33:1`) |
| `color.neutral.500` | `#737373` | Minimum normal-text gray on white (`4.74:1`) |
| `color.neutral.300` | `#CFCFCF` | Dividers and disabled structure; never body text |
| `color.neutral.200` | `#E2E2E2` | Quiet rules and input boundaries |
| `color.neutral.100` | `#F1F1F1` | Subtle neutral field |
| `color.neutral.050` | `#F7F7F2` | Warm-neutral editorial canvas |

`#878787` remains an observed legacy gray but is not approved for small text on white (`3.59:1`).

### 2.3 Gold support scale

Only `gold.500` is a permanent brand master. Derived values support surfaces or accessible text without becoming alternate gold identities.

| Token | Value | Restriction |
|---|---:|---|
| `color.brand.gold.050` | `#FFF9E8` | Quiet highlighted surface only |
| `color.brand.gold.100` | `#FFF2C2` | Selected/background emphasis only |
| `color.brand.gold.300` | `#F6D76D` | Large non-text marks only |
| `color.brand.gold.500` | `#EFC337` | Canonical gold; black content required |
| `color.brand.gold.700` | `#8A6A00` | Accessible gold-family text on white (`5.07:1`) |

White text on `gold.500` is prohibited (`1.68:1`). Black on `gold.500` is approved (`12.53:1`).

## 3. Semantic color aliases

### 3.1 Surfaces and text

| Token | Light/editorial mode | Dark/media mode |
|---|---|---|
| `color.surface.canvas` | `neutral.050` | `brand.black.1000` |
| `color.surface.reading` | `neutral.white.0` | `neutral.950` |
| `color.surface.quiet` | `neutral.100` | `neutral.900` |
| `color.surface.inverse` | `brand.black.1000` | `neutral.white.0` |
| `color.text.primary` | `brand.black.1000` | `neutral.white.0` |
| `color.text.secondary` | `neutral.700` | `neutral.300` |
| `color.text.muted` | `neutral.600` | `neutral.300` |
| `color.border.default` | `neutral.300` | `neutral.800` |
| `color.border.strong` | `brand.black.1000` | `neutral.white.0` |

### 3.2 Action roles

| Role | Default | Hover | Pressed | Disabled |
|---|---|---|---|---|
| Primary surface | `gold.500` | `black.1000` | `neutral.950` | `neutral.200` |
| Primary content | `black.1000` | `gold.500` | `gold.500` | `neutral.600` |
| Secondary surface | transparent | `neutral.100` / `neutral.900` | mode-appropriate quiet surface | transparent |
| Secondary content/border | current primary text | current primary text | current primary text | muted structure |
| Destructive surface/content | semantic error pair | darker error role | darker error role | neutral disabled pair |

Disabled controls never retain gold, because gold signals an available high-emphasis action.

### 3.3 Bounded semantic feedback

These hues never identify an edition, audience, section, or campaign.

| Meaning | Strong/text | Quiet surface | Non-color companion |
|---|---:|---:|---|
| Success | `#166534` | `#ECFDF3` | Check icon + explicit success label |
| Warning/delay | `#7A4D00` | `#FFF6DE` | Alert icon + time/state wording |
| Error/destructive | `#B42318` | `#FEF3F2` | Error icon + actionable error text |
| Information | `#1D4ED8` | `#EFF6FF` | Information icon + descriptive label |

Each strong/surface pair exceeds `6:1` contrast. Event lifecycle and availability must still use explicit words; semantic feedback colors cannot replace them.

## 4. Focus system

Focus is context-aware and always visible:

| Context | Inner separation | Outer focus | Minimum thickness |
|---|---|---|---|
| White/light | White | Black | 2 px + 3 px |
| Black/dark | Black | Gold | 2 px + 3 px |
| Gold | Gold | Black | 2 px + 3 px |
| Media/unknown | Black | Gold | 2 px + 3 px |

Focus uses `:focus-visible`; keyboard focus is never removed. Sticky headers/actions must scroll or offset so focused content remains unobscured.

## 5. Typography tokens

### 5.1 Families

| Token | Working value | Status |
|---|---|---|
| `font.family.display.latin` | `Barlow Condensed`, controlled fallback | `PRODUCTION_CANDIDATE` |
| `font.family.text.multilingual` | `Alexandria`, controlled fallback | `PRODUCTION_CANDIDATE` |
| `font.family.display.arabic` | `Alexandria`, script-appropriate heavy weight | `PRODUCTION_CANDIDATE` |
| `font.family.mono` | system monospace | Technical IDs only; not brand expression |

If source brand fonts are later supplied, they enter a controlled optical/license/performance comparison. No font is silently swapped in code.

### 5.2 Fluid type roles

| Token | Working range | Line height | Use |
|---|---|---:|---|
| `font.size.campaign` | `clamp(4rem, 9.5vw, 9rem)` | `0.84–0.90` | Latin city/edition campaign field |
| `font.size.campaign-ar` | `clamp(3.25rem, 7.5vw, 7rem)` | `1.02–1.12` | Arabic campaign display; never simulated condensation |
| `font.size.display` | `clamp(3rem, 6vw, 6rem)` | `0.92–1.00` | Chapter display |
| `font.size.h1` | `clamp(2.625rem, 4.5vw, 4.5rem)` | `0.98–1.06` | Page proposition |
| `font.size.h2` | `clamp(2rem, 3.2vw, 3.25rem)` | `1.05–1.12` | Section decision heading |
| `font.size.h3` | `clamp(1.5rem, 2vw, 2.25rem)` | `1.12–1.20` | Module heading |
| `font.size.lead` | `clamp(1.125rem, 1.5vw, 1.5rem)` | `1.35–1.50` | Introductory explanation |
| `font.size.body-lg` | `1.125rem` | `1.55` | High-value readable narrative |
| `font.size.body` | `1rem` | `1.55` | Default body/UI |
| `font.size.small` | `0.875rem` | `1.45` | Secondary metadata/help |
| `font.size.meta` | `0.75rem` | `1.40` | Sources/technical metadata only; never primary action or legal meaning |

Arabic roles may use larger line height and different line breaks while preserving semantic rank.

## 6. Spacing and sizing

### 6.1 Base spacing scale

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160` CSS px.

Named aliases:

| Token | Value | Use |
|---|---:|---|
| `space.control-inline` | 16 px | Button/field horizontal content |
| `space.control-block` | 12 px | Button/field vertical content |
| `space.cluster` | 24 px | Related content cluster |
| `space.module` | 40–64 px responsive | Major module separation |
| `space.section` | `clamp(72px, 9vw, 160px)` | Primary chapter rhythm |
| `space.page-gutter` | `clamp(20px, 4vw, 72px)` | Page inline gutter |

Spacing follows logical block/inline properties. RTL never uses hard-coded left/right margin tokens.

### 6.2 Control sizing

- minimum primary control target: `44 × 44px`;
- standard field/control block size: `48px` minimum;
- compact controls are limited to low-risk utilities and still meet applicable WCAG target spacing;
- labels, errors, and legal consent never rely on placeholder text.

## 7. Shape, border, and elevation

| Token | Value | Use |
|---|---:|---|
| `radius.none` | 0 | Editorial rules/media when composition requires |
| `radius.xs` | 4 px | Status labels and compact metadata fields |
| `radius.sm` | 8 px | Small controls, media details |
| `radius.md` | 12 px | Primary controls, form fields, bounded content |
| `radius.lg` | 16 px | Large bounded panels only |
| `radius.full` | 999 px | Avatars/progress only; never default button/card shape |
| `border.hairline` | 1 px | Structural rules |
| `border.emphasis` | 2 px | Selected/current/focus-support states |

Elevation is rare:

- `elevation.none`: default;
- `elevation.raised`: mobile drawer, menu, or media control only;
- `elevation.overlay`: modal/critical overlay only.

Cards do not receive decorative shadows merely to create depth. Depth comes primarily from section rhythm, media planes, contrast, and hierarchy.

## 8. Motion and layer primitives

| Token | Value | Use |
|---|---:|---|
| `duration.instant` | 0 ms | Reduced-motion state or direct semantic update |
| `duration.fast` | 120 ms | Hover/press feedback |
| `duration.standard` | 220 ms | Drawer/control state |
| `duration.deliberate` | 360 ms | Section/media transition |
| `duration.campaign` | 650 ms maximum | One-time high-level reveal; never required for meaning |
| `ease.standard` | `cubic-bezier(.2,.8,.2,1)` | General UI |
| `ease.out` | `cubic-bezier(.16,1,.3,1)` | Enter/reveal |
| `ease.in` | `cubic-bezier(.4,0,1,1)` | Exit |

Layer order:

`base 0 → raised 10 → header 20 → sticky 30 → overlay 40 → modal 50 → status/toast 60 → skip-link 70`.

No component may invent a higher layer. Native top-layer behavior is preferred for dialogs/popovers where supported.

## 9. Media primitives and budgets

| Role | Contract |
|---|---|
| Hero poster | Mobile target ≤ 250 KB; desktop target ≤ 450 KB |
| Responsive still | Explicit dimensions, modern format, CMS focal point, density-aware sources |
| Video | Poster required; lazy/deferred where non-critical; controls/captions/transcript as applicable |
| Ratios | `16:9`, `4:3`, `1:1`, `3:4` approved base crops; special campaign crops require art direction |
| Failure | Poster first; intentional typographic edition fallback if poster is also unavailable |

Hero video never determines LCP and never blocks the proposition, event state, or action.

## 10. Token acceptance checks

A token change passes only when:

- black/gold identity remains recognizable;
- required contrast passes at actual size, weight, state, and surface;
- French, English, and Arabic fixtures preserve hierarchy;
- mobile, zoom/reflow, and RTL remain stable;
- no unsupported lifecycle, availability, success, or proof meaning is introduced;
- visual regression covers light, dark, gold, media, focus, disabled, and error contexts;
- the change is expressed once in the token source and not patched per component.

