# Spimar Immo — WellExpo Reference Deconstruction

**Status:** Controlling reference for creative iteration 04  
**Reference:** https://wellexpo.qodeinteractive.com/digital-conference/  
**Reviewed:** 29 July 2026  
**Target:** `spimarimmo.com` global homepage and reusable localized event system

## 1. Direction Reset

The previous Spimar explorations are rejected as controlling creative directions.
They were too close to generic luxury real-estate and generated marketing layouts.

The WellExpo Digital Conference reference establishes the correct territory:

- modern rather than luxurious;
- editorial rather than card-heavy;
- sophisticated through composition rather than decoration;
- event-led rather than property-catalogue-led;
- bold, graphic and energetic;
- detailed without becoming dense;
- photographic without relying on full-bleed cinematic clichés;
- interactive without sacrificing hierarchy.

The Spimar adaptation must reproduce this design grammar closely while using original
Spimar branding, copy, photography, data and implementation.

## 2. What Was Observed on the Live Reference

The reference is a six-scene full-viewport experience powered by a vertical Slider
Revolution composition. Each scene occupies the complete browser viewport and changes
the header treatment between light and dark.

### Persistent shell

- Transparent 100 px desktop header.
- Logo aligned 40 px from the left edge.
- Compact uppercase navigation using 13 px semibold type.
- Utility controls on the right.
- 50 × 50 px menu control with a restrained glow.
- Six-step vertical progress navigation centered on the right.
- Small lower-left scroll instruction and arrow.
- Main content is vertically centered inside each viewport.

### Six visual scenes

| Scene | Reference composition                                      | Design purpose                                     |
| ----- | ---------------------------------------------------------- | -------------------------------------------------- |
| 01    | Oversized word over a wide photograph, countdown below     | Immediate event energy and urgency                 |
| 02    | Dark split layout: large image left, title/copy/CTA right  | Explain the experience and convert                 |
| 03    | Large letter-shaped photo mask, huge title and CTA         | Editorial identity and speaker/story focus         |
| 04    | Dark testimonial with small portrait and perspective grids | Social proof without generic testimonial cards     |
| 05    | Two overlapping images and compact title panel             | Visual storytelling and event atmosphere           |
| 06    | Dark image-plus-schedule list                              | Structured event information with strong hierarchy |

### Observed design tokens

| Token                                | Reference value or behavior                      |
| ------------------------------------ | ------------------------------------------------ |
| Primary display face                 | Poppins                                          |
| Secondary metadata face              | Rubik italic                                     |
| Body base                            | 14 px / 25 px                                    |
| Main hero display                    | Up to 180 px desktop, 700 weight, tight tracking |
| Section title                        | About 40 px / 45 px, 700 weight                  |
| Schedule title                       | 18 px, 700 weight                                |
| Metadata label                       | 14 px, italic, approximately 2 px tracking       |
| Navigation                           | 13 px, 600 weight, uppercase                     |
| Main mint accent                     | `rgb(80, 214, 174)` / `#50D6AE`                  |
| Main backgrounds                     | Pure white and near-black                        |
| Muted dark text                      | `rgb(40, 40, 40)`                                |
| Muted schedule text                  | About `rgb(131, 131, 131)`                       |
| Desktop reference viewport inspected | 1363 × 936 px                                    |
| Main content width                   | Approximately 1200–1300 px                       |
| Header height                        | 100 px                                           |
| Slide count                          | 6                                                |

### Motion behavior

- Vertical wheel input advances one full scene.
- Scene background switches light/dark with the content.
- Elements enter independently rather than as one flattened group.
- Text commonly moves 50 px horizontally or vertically.
- Major media can enter from ±100% of its width.
- Typical entrance duration is 500–800 ms.
- Decorative elements use slower 800–1500 ms scale or position entrances.
- Common easings include Expo Out and Power 4 Out.
- Staggers generally begin around 150–400 ms.
- Navigation, scroll cue and shell remain spatial anchors during scene changes.
- Decorative shapes respond more slowly than content, producing depth.

## 3. Why the Reference Feels Polished

The polish does not come from luxury signals. It comes from a strict composition system:

1. One dominant message per viewport.
2. Large contrast between headline, metadata and body copy.
3. Purposeful asymmetry instead of centered template layouts.
4. Photography is cropped into defined planes or masks.
5. Decorative shapes sit behind content and never compete with it.
6. Light and dark scenes create a clear narrative rhythm.
7. Small technical labels give the identity a digital-event character.
8. Repeated anchors make experimental compositions easy to navigate.
9. Every scene has a distinct silhouette.
10. Empty space is actively composed, not left over.

## 4. Spimar Visual Translation

### Core territory

> **A contemporary international Moroccan property expo.**

The website should feel like a living event identity and international platform—not a
luxury property brochure, a dashboard, or a generic conference template.

### Brand color translation

WellExpo's mint accent will be replaced by Spimar yellow:

- Primary yellow: `#EFC337`.
- Hover yellow: `#F7D55F`.
- Pressed yellow: `#D7AA20`.
- Near black: `#080909`.
- Graphite: `#121313`.
- Elevated graphite: `#1A1B1B`.
- Warm white: `#F7F5EE`.
- Muted light text: `#B8B7B1`.
- Hairline on dark: `rgba(255,255,255,.14)`.
- Hairline on light: `rgba(8,9,9,.14)`.

Yellow must read as event energy and brand recognition. It must not be presented as
metallic gold or paired with luxury clichés.

### Typography

#### Latin

- Display and interface: Poppins.
- Weights: 400, 500, 600, 700 and 800.
- Technical labels: Rubik italic or IBM Plex Mono italic.
- Large titles use tight tracking and short line lengths.
- Body text remains neutral and highly readable.

#### Arabic

- Primary Arabic: IBM Plex Sans Arabic or Alexandria.
- Heavy display weight should match the visual mass of Poppins 700/800.
- Technical labels should be translated naturally, not simulated with Latin syntax.
- RTL reverses composition logic, progress placement where appropriate, and directional motion.

### Photography

Use four distinct image roles:

1. **Event energy:** real exhibitions, conversations, booths and visitors.
2. **Property opportunity:** Moroccan architecture and verified developments.
3. **Professional exchange:** developer, adviser and visitor interactions.
4. **Global context:** destination cities and Moroccan diaspora audiences.

Generated media may create campaign atmosphere. Real past-event proof, partner presence
and attendance evidence must use authentic media only.

### Graphic language

- Large cropped letters such as `S`, `M`, or city initials containing photography.
- Yellow organic geometry used behind—not over—critical text.
- Fine perspective-grid planes referencing architecture, mapping and international networks.
- Sparse micro-dots, coordinates and route lines.
- Square or rectangular imagery with deliberate overlaps.
- Hard editorial crops; avoid excessive rounded cards.
- No glassmorphism.
- No metallic gradients.
- No generic glowing dashboard grids.
- No property-search UI in the global hero.

## 5. New Global Homepage Narrative

The main domain is the global brand and event network. Local subdomains remain focused
registration experiences.

### Chapter 01 — Global event statement

**Reference type:** oversized word + wide image + event facts.

- Oversized message: `Morocco.` or `SPIMAR.`
- Supporting line: Moroccan property opportunities, presented around the world.
- Wide real event photograph crossing behind the display word.
- Featured next edition shown below with city, date and venue.
- Primary CTA: View the next edition.
- Secondary action: Explore all destinations.
- A compact countdown is used only when the date is confirmed and meaningful.

### Chapter 02 — What Spimar enables

**Reference type:** dark split image/text scene.

- Left: real consultation or exhibition image.
- Right metadata: `<the_spimar_experience />`.
- Title: Meet the people behind your property plan.
- Concise value proposition for visitors.
- CTA: Why attend?
- Perspective grid creates international/architectural depth.

### Chapter 03 — International editions

**Reference type:** masked letter plus oversized editorial title.

- Large `W` or `S` mask containing a city/event montage.
- Title: One network. Multiple cities.
- Featured destinations: Paris, Brussels, Montréal and other confirmed markets.
- CTA routes visitors into the correct localized edition.
- The section must explain that each edition belongs to the Spimar network.

### Chapter 04 — Proof from previous editions

**Reference type:** dark testimonial/proof scene.

- Large visitor or partner quote.
- Real portrait or documentary event crop.
- Verified attribution.
- Small proof metrics may accompany the quote when approved.
- The content must communicate trust, not decoration.

### Chapter 05 — Inside the expo

**Reference type:** overlapping image story.

- One large image showing exhibition scale.
- One smaller foreground image showing a real conversation or property presentation.
- Editorial title: Compare. Ask. Decide.
- Small yellow shape and architectural grid connect the two media planes.

### Chapter 06 — Upcoming editions

**Reference type:** dark image-plus-schedule list.

- Left: featured destination or event image.
- Right: structured edition rows.
- Each row contains city, country, date/status and action.
- Featured/current edition receives the strongest treatment.
- Upcoming, announced and archive states are visually distinct.

### Chapter 07 — Audience paths

Use the same editorial grammar rather than generic cards:

- Visitors and buyers.
- Property developers.
- Banks and financing partners.
- Institutional and media partners.

Each path receives a short outcome, image role and contextual action.

### Chapter 08 — Final conversion

- Large final statement.
- Featured edition facts.
- Register or select an edition.
- WhatsApp remains secondary.
- Legal consent and privacy language remain readable.

## 6. Responsive Behavior

The reference provides different layer coordinates and dimensions at large desktop,
desktop/laptop, tablet and mobile breakpoints. Spimar must preserve that intentional
recomposition while using a more maintainable implementation.

### Breakpoints

- Large desktop: 1440 px and above.
- Desktop/laptop: 1024–1439 px.
- Tablet: 768–1023 px.
- Mobile: 320–767 px.

### Desktop

- Optional scene snap for the first six editorial chapters.
- 90–100 px transparent/sticky header.
- Maximum working canvas around 1280–1320 px.
- Two-column and overlapping compositions.
- Vertical progress navigation.
- Controlled parallax on decorative layers only.

### Tablet

- Preserve asymmetry with reduced overlap.
- Navigation collapses earlier than text becomes crowded.
- Display titles use `clamp()` rather than abrupt sizes.
- Image masks are simplified where necessary.

### Mobile

- Normal document scrolling; do not force full-screen wheel-slider behavior.
- Sticky compact header and thumb-reachable primary action.
- One dominant visual and one message per section.
- Overlaps become safe stacked compositions.
- Display titles wrap intentionally and never clip translated content.
- Horizontal edition list may become a swipeable snap list.
- Progress dots become section count or are omitted when they reduce usability.
- No motion required to reveal critical information.
- Arabic/RTL is composed separately, not mirrored blindly.

## 7. Interaction Contract

- Header adapts between light and dark sections.
- Main CTA always has a visible label and minimum 44 px touch height.
- Scene transitions respect `prefers-reduced-motion`.
- Scroll progress never becomes the only navigation method.
- All content remains in semantic DOM order.
- Focus order follows reading order despite visual overlaps.
- Hover states enhance, but never hide, primary information.
- Image masks retain descriptive alternative text through accessible source images.

## 8. Modern Implementation

Do not copy the WordPress theme code or rebuild Slider Revolution.

Recommended implementation:

- Next.js App Router and TypeScript.
- CSS Grid for scene composition.
- CSS custom properties for the design tokens.
- Framer Motion or GSAP only for orchestrated scene entrances.
- Intersection Observer for active-section state.
- CSS `scroll-snap` as desktop progressive enhancement.
- Native scrolling on mobile.
- `next/image` with art-directed desktop/mobile crops.
- Server-rendered content from the CMS.
- Locale-aware routes and true RTL support.
- A single global platform with CMS-driven localized event editions.

## 9. Acceptance Criteria for the Next Visual Iteration

The next generated screens are acceptable only if:

- they immediately read as an international Moroccan real-estate exhibition;
- the layout visibly inherits the WellExpo editorial grammar;
- the result is modern and sophisticated, not luxurious;
- Spimar yellow is energetic, not gold;
- the hierarchy presents one dominant idea per chapter;
- the global-domain and localized-edition relationship is clear;
- desktop has strong asymmetrical editorial composition;
- mobile is recomposed and fully usable;
- photography is assigned a clear evidence or atmosphere role;
- the page avoids repetitive card grids;
- all text is readable and realistically implementable;
- no unverified event facts, partners or statistics are invented.

## 10. Creative Production Decision

The next visual batch will not continue iteration 03. It will begin a new reference-led
iteration:

1. Desktop global hero and next-edition transition.
2. Desktop dark experience chapter.
3. Desktop international-editions chapter.
4. Desktop event-proof and schedule chapters.
5. Mobile hero plus first transition.
6. Mobile event directory and registration continuation.

Only after these screens are approved will the full design system, Higgsfield prompt
batch and Claude Code implementation specification be finalized.
