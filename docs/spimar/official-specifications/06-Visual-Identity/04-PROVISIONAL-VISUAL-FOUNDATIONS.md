# SPIMARIMMO Controlled Visual Foundations

**Document ID:** `SPM-VF-001`  
**Status:** `BLACK_GOLD_DIRECTION_CONFIRMED_OTHER_FOUNDATIONS_PROVISIONAL`  
**Date:** 31 July 2026  
**Recommended territory:** `IDT-01A — Signal with Moroccan editorial depth`

## 1. Purpose and limit

This document defines the smallest coherent visual foundation needed to compare identity territories and prepare Phase 07. It is not the final design-token file. The digital black/gold direction is confirmed; typography, derived scales, dimensions, motion, and component tokens remain provisional.

Values marked `candidate` require Gate 6 approval, source-brand confirmation, contrast testing, font licensing, responsive proof, and real-content testing before becoming production tokens. The live-site digital anchors `#EFC337` and `#000000` are not competing candidates.

## 2. Color foundation

### 2.1 Permanent brand roles

| Controlled role | Value | Intended use | Restriction |
|---|---|---|---|
| `brand.gold.500` | `#EFC337` | Primary CTA, active edition, orientation marker, selected state | Canonical current-site digital gold; pair with black text |
| `brand.black.1000` | `#000000` | Main dark stage, strongest text, dark interaction state | Canonical brand black |
| `brand.gold.deep` | `#675313` | Legacy deep-gold support, dark link/accent on light, optional hover field | Do not use as regular text on gold; `4.44:1` misses the `4.5:1` normal-text threshold |
| `neutral.graphite.800` | `#444444` | Secondary dark stage and utility surfaces | Supporting neutral, not a new brand color |
| `neutral.gray.600` | `#5A5959` | Secondary structure on dark/light contexts after testing | Validate at actual size and surface |
| `neutral.gray.500` | `#878787` | Muted metadata | Not for small normal text on white without a stronger token |
| `neutral.gray.300` | `#CCCCCC` | Dividers and inactive structure | Never the sole status indicator |
| `neutral.white.0` | `#FFFFFF` | Reading surface and text on black/graphite | Supporting neutral; avoid card-wall layouts |

Core contrast checks:

- black on SPIMAR Gold: `12.53:1` — approved pairing;
- white on SPIMAR Gold: `1.68:1` — prohibited for text;
- white on black: `21:1` — approved pairing;
- white on Graphite `#444444`: `9.74:1` — approved pairing.

Interaction default: gold surface with black content. Hover/pressed may invert to black with gold content. Phase 07 must add a visible focus treatment that survives black, gold, white, and media contexts.

### 2.2 Semantic colors

Success, warning, error, and information are product semantics, not edition or brand colors. Phase 07 must test their text, surface, border, focus, dark/light, and color-vision behavior.

Rules:

- gold never means automatic success;
- green never means “available” without a text/shape label;
- red is reserved for destructive/error meaning, not campaign decoration;
- cancelled, postponed, closed, waitlist, completed, and coming-soon each require explicit wording and non-color treatment;
- partner colors cannot override the SPIMAR identity or form/lifecycle semantics.
- editions and audience paths do not receive independent chromatic themes.

### 2.3 Section rhythm

Use light/dark changes to express content mode:

| Mode | Default use |
|---|---|
| Black/media stage | Hero, documentary film, featured case, event atmosphere, final commercial close |
| White editorial | Opportunity, destinations, method, articles, practical information |
| Clean evidence | Proof definitions, offers, forms, resources, legal/operational content |
| Gold signal | Small, decisive orientation/action areas; never a full-page default |

## 3. Typography

### 3.1 Candidate family system

The production system should use no more than two primary font families.

| Role | Candidate | Use | Status |
|---|---|---|---|
| Display Latin | `Barlow Condensed` or a licensed equivalent | City, edition, campaign display, major section markers | `CANDIDATE` |
| Multilingual body/UI | `Alexandria` or an approved bilingual equivalent | French, English, Arabic UI/body, forms, metadata | `CANDIDATE` |
| Arabic display | Heavy/condensed-feeling weight from the approved Arabic family | Script-composed hero and chapter display | `CANDIDATE`; never simulate Latin condensation |

If optical testing shows that one bilingual family can carry display and reading roles without becoming generic, prefer one-family simplicity. If the existing brand owns licensed fonts, they must be tested before replacement.

### 3.2 Typographic behavior

- Display typography supplies event-poster authority, not luxury editorial elegance.
- Body/UI prioritizes comprehension and long-form multilingual reading.
- Metadata is compact but never becomes decorative microtext.
- City and date can scale dramatically, but remain real text and reflow safely.
- Headline line breaks are art-directed per language and breakpoint.
- Arabic uses authentic weights, punctuation, numerals, and shaping; no simulated italic.
- Mixed-direction data—URLs, phone numbers, event codes, and Latin brand names—uses isolated direction runs.
- Tabular numerals are recommended for dates, comparisons, and evidence only if the approved font supports them.

### 3.3 Working hierarchy

Phase 07 should derive responsive tokens from content tests rather than copying reference measurements. The hierarchy must include:

- campaign display;
- chapter display;
- section heading;
- card/row heading;
- lead;
- body;
- UI label;
- evidence/source metadata;
- form help/error;
- legal/caption.

No critical label may fall below an accessible readable size to preserve a poster composition.

## 4. Grid and composition

### 4.1 Structural grid

| Range | Provisional structure | Behavior |
|---|---|---|
| Wide desktop | 12 columns | Asymmetric editorial compositions; wide media may escape the text measure |
| Laptop/tablet landscape | 8 columns | Reduce overlap; preserve edition/proof/action hierarchy |
| Tablet portrait | 6 or content-driven columns | Replace hover and wide comparison with touch/readable alternatives |
| Mobile | 4 columns | Recompose: city/date, proposition, action, media, proof; do not merely stack desktop |

Container width, gutters, section spacing, and breakpoints are Phase 07 tokens and must be derived from real copy, approved media, and the neutral foundation after parity approval.

### 4.2 Composition grammar

- Use hard alignment, rules, fields, image planes, and typography rather than card chrome.
- Every major section needs a distinct silhouette serving its content job.
- Maintain one dominant focal point per decision moment.
- Place evidence adjacent to its promise or mechanism.
- Keep the event rail and country card system visually signature without hiding lifecycle states.
- Use intentional negative space, but never leave desktop feeling unfinished.
- Forms and legal content use calm, high-reading surfaces rather than campaign theatrics.

## 5. Shape and surface language

- Primary buttons: compact, decisive, slightly softened corners; not capsules.
- Cards: only where content is a bounded object; otherwise use rows, planes, and dividers.
- Image corners: mostly square or subtly softened; crop quality matters more than radius.
- Borders: hairline structural rules with strong alignment.
- Shadows: rare and functional; never a decorative depth stack.
- Gradients: not a default brand device; allowed only when media readability cannot be solved through crop/surface composition.
- Decorative geometry: abstract lines may express route, sequence, or edition network only when they carry orientation.

## 6. Iconography and information graphics

### Iconography

- one consistent outline family with accessible stroke behavior;
- icons support labels and never replace ambiguous text;
- do not mirror documentary media, logos, play icons, or universally directional controls incorrectly in RTL;
- arrows follow logical direction only where the interaction actually reverses;
- event-status symbols pair shape and label with color.

### Information graphics

- route maps, timelines, before/during/after, offer comparisons, and evidence definitions must be built from real data;
- no fake charts or decorative metrics;
- source, period, definition, caveat, and owner are part of the graphic anatomy;
- comparisons keep identical capabilities aligned across offers;
- mobile receives a readable non-horizontal alternative.

## 7. Photography and video

### 7.1 Content roles

| Role | Required subject | Typical placement |
|---|---|---|
| Event scale | Real exhibition environment, booths, people, signage | Hero, edition, gallery |
| Decision interaction | Developer/visitor/adviser around project, model, plan, or discussion | Proof, method, testimonial |
| Moroccan opportunity | Real development, city, architecture, and place | Destination, event, visitor orientation |
| Commercial artifact | Campaign output, report, media placement, booth/activation detail | Method, case, offer, resource |
| Portrait | Approved speaker, adviser, developer, visitor | Testimonial, about, editorial |

### 7.2 Crop system

- establish focal points in CMS rather than relying on center-crop;
- create desktop landscape, square/detail, portrait, and mobile-poster derivatives;
- avoid text over uncontrolled facial or architectural detail;
- use captions where identity, place, edition, or time matters;
- media absence must produce an intentional typographic/poster composition, not a blank dark field.

### 7.3 Authenticity

AI/generated imagery is limited to internal mood exploration. Production proof requires rights-cleared real media. A conceptual image cannot imply that an event, crowd, project, partner, or outcome existed.

## 8. Motion principles

| Principle | Contract |
|---|---|
| Meaning first | Critical proposition, edition, date, state, and action are readable before motion completes |
| Physical but controlled | Image planes, type fields, and section markers may move; text reading does not depend on movement |
| Context continuity | Route, host, locale, event, and audience transitions remain orienting |
| Evidence restraint | Verified metrics may count once; definitions and caveats are static and readable |
| Media resilience | Every video has poster, captions where applicable, error fallback, and reduced-motion alternative |
| Mobile economy | Remove non-essential overlap/parallax; retain hierarchy and action clarity |
| Reduced motion | Replace spatial movement with immediate state changes or restrained opacity only where safe |
| No hijacking | No mandatory scroll lock, long intro gate, or continuous text parallax |

Exact duration, easing, stagger, and scroll thresholds are Phase 07/09 decisions. They must not be copied from House of Yellow before the reference gate passes.

## 9. Multilingual and RTL identity

- Brand recognition cannot depend on a left-anchored composition.
- Navigation, content order, form order, focus, and directional controls use logical properties.
- The `SPIMARIMMO` wordmark is not mirrored; its relationship to Arabic text is composed separately.
- City/date blocks must accommodate Arabic city names and month formats without shrinking to illegibility.
- Latin abbreviations and URLs are direction-isolated inside Arabic sentences.
- Photographs are not mirrored.
- Decorative route lines reverse only when they represent reading progression, not geography.
- Headline equivalence is semantic, not word-count equivalence.
- A fluent Arabic design/editorial review remains mandatory.

## 10. Accessibility requirements entering Phase 07

- WCAG 2.2 AA target;
- visible focus in white, black, gold, and media contexts;
- primary actions approximately 44 × 44 CSS px where practical;
- text contrast tested at actual size/weight;
- gold-filled controls use black text; white text on `#EFC337` is prohibited;
- no state, audience, availability, or proof meaning encoded by color alone;
- zoom and reflow without sticky obstruction;
- keyboard and screen-reader parity for every interactive media/event component;
- captions, transcripts, alt text, posters, and pause control for media;
- reduced-motion parity.

## 11. Phase 07 handoff rule

After Gate 6, Phase 07 must:

1. convert the approved roles into semantic tokens;
2. test every token across light/dark/brand/media surfaces;
3. define component anatomy and states from approved `UXF` targets;
4. validate French, English, Arabic RTL, long content, and missing media;
5. preserve the identity invariants and operational-state truth;
6. keep all reference-derived implementation measurements blocked until the House of Yellow parity gate passes.
