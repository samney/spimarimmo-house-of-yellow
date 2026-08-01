# Design Direction and Responsive System

**Status:** `PROPOSED_DIRECTION — NOT YET VISUALLY APPROVED`  
**Controlling reference:** WellExpo Digital Conference design grammar  
**Product context:** International Moroccan property exhibitions  
**Character:** Modern, sophisticated, detailed and event-led—not luxury

## 1. Design objective

Create a contemporary B2B event platform with enough depth to persuade developer
executives and enough energy to express a live international exhibition.

The visual system should feel:

- bold;
- structured;
- digital;
- credible;
- dynamic;
- international;
- unmistakably property/event related;
- Moroccan through brand and content, not clichés.

## 2. Reference translation

### Closely adopt

- oversized typographic moments;
- asymmetrical editorial grids;
- alternating dark and light scenes;
- layered documentary images;
- technical labels and section indexes;
- strong contrast between display, metadata and body copy;
- purposeful negative space;
- distinctive section silhouettes;
- staggered, controlled motion;
- persistent orientation.

### Adapt for SPIMAR

- conference story becomes exhibitor value and real-estate event proof;
- speaker/schedule modules become case studies, editions, method and packages;
- mint becomes SPIMAR yellow;
- documentary SPIMAR media replaces reference imagery;
- the long B2B content model uses semantic document scrolling;
- event cards become a signature editorial system.

### Do not copy

- WellExpo brand, logo, copy, imagery or proprietary code;
- conference-specific content;
- Slider Revolution implementation;
- layouts that do not support the official brief;
- motion that traps scrolling or hides content.

## 3. Visual territory

> **Modern international property-expo operating system**

Not:

- luxury property brochure;
- institutional corporate template;
- generic rounded-card SaaS page;
- dark fintech dashboard;
- property-search marketplace;
- decorative Moroccan tourism page.

## 4. Color foundation

The current website's observed yellow is the starting brand cue and must be confirmed
against source brand files.

| Role | Proposed token |
|---|---|
| Brand/action yellow | `#EFC337` |
| Yellow hover | `#F7D55F` |
| Yellow pressed | `#D7AA20` |
| Near black | `#080909` |
| Graphite | `#121313` |
| Elevated graphite | `#1A1B1B` |
| Warm white | `#F7F5EE` |
| Light canvas | `#EFEDE7` |
| Muted dark text | `#77766F` |
| Muted light text | `#B8B7B1` |

Rules:

- yellow communicates action, status and event energy;
- it must not look metallic or “gold luxury”;
- dark sections dominate evidence, film and event atmosphere;
- controlled light sections improve reading, rhythm and long-form clarity;
- semantic success/error colors require accessibility testing.

## 5. Typography

### Latin

- display/interface candidate: Poppins;
- technical metadata candidate: Rubik Italic or IBM Plex Mono;
- body may use Poppins or a more reading-focused neutral sans after visual testing.

### Arabic

- candidates: Alexandria or IBM Plex Sans Arabic;
- weights and x-height must visually balance the Latin system;
- Arabic headlines are composed, not mechanically mirrored;
- no simulated italic for Arabic.

### Hierarchy

- hero display: `clamp(3.5rem, 8vw, 9.5rem)` subject to copy length;
- chapter title: `clamp(2.25rem, 5vw, 5.5rem)`;
- section title: `clamp(1.75rem, 3vw, 3.25rem)`;
- body: 16–20 px depending on use;
- metadata: 12–14 px with controlled tracking.

All final tokens require multilingual visual testing.

## 6. Grid and spacing

### Desktop

- 12-column grid;
- maximum content canvas around 1320–1440 px;
- wide media may escape the text container;
- 88–160 px section spacing depending on chapter;
- hard alignment lines and intentional overlaps.

### Tablet

- 8-column grid;
- reduced overlap;
- content order remains semantic;
- navigation collapses before copy becomes crowded.

### Mobile

- 4-column grid;
- 20–24 px horizontal page padding;
- 64–96 px section spacing;
- normal document flow;
- layered desktop planes become safe stacks;
- no critical content revealed only through gestures.

## 7. Signature section compositions

Use a controlled library, not one repeated card component:

1. Film-led statement.
2. Featured event plus supporting edition rail.
3. Dark split proof/outcome.
4. Oversized metric field.
5. Masked image/typographic chapter.
6. Before/during/after timeline.
7. Case-study editorial spread.
8. Logo/evidence wall.
9. Video testimonial stage.
10. Structured package comparison.
11. Resource/download panel.
12. Conversion close.

## 8. Exhibition-card design

Country cards are a defining brand component.

### Featured card

- large documentary or destination media;
- city/country in oversized type;
- date/status as technical metadata;
- short market value;
- exhibitor availability;
- two clearly labelled actions;
- active-state visual accent.

### Supporting card

- strong city identifier;
- status/date;
- one relevant image;
- one contextual action at a time;
- no tiny text overlay on uncontrolled photography.

### States

Use shape, label and copy—not color alone—to distinguish:

- open;
- coming soon;
- live;
- completed;
- waitlist;
- sold out.

## 9. Cards, borders and shape language

- prefer editorial planes, rows and grids over floating rounded cards;
- use small or zero radii unless content requires a card;
- use hairline borders and solid surfaces;
- avoid glassmorphism;
- avoid generic gradients;
- avoid decorative shadows;
- yellow shapes and architectural grids remain behind content;
- imagery uses hard, deliberate crops.

## 10. Motion system

### Purpose

- establish hierarchy;
- connect sections;
- reveal evidence;
- communicate event energy;
- preserve orientation.

### Patterns

- 500–800 ms major entrances;
- 150–300 ms stagger;
- image-plane reveal;
- section-index/progress update;
- restrained type movement;
- counting only for verified metrics;
- horizontal edition movement with explicit controls.

### Restrictions

- no scroll hijacking;
- no mandatory scene snap on mobile;
- no animation required to read critical content;
- no continuous parallax on text;
- respect `prefers-reduced-motion`;
- pause background film when appropriate.

Desktop scroll snapping may be explored only as progressive enhancement for selected
top chapters, not the whole long page.

## 11. Photography and video direction

Prioritize:

- live exhibition scale;
- serious developer/visitor meetings;
- property model and project presentation;
- check-in and audience flow;
- conference and expert moments;
- content capture and press;
- Moroccan projects and cities;
- international host-city context.

Avoid:

- stock handshakes;
- empty luxury interiors as primary story;
- invented crowds;
- excessive skyline composites;
- AI-generated proof;
- media without visible property/event context.

## 12. Responsive product rule

“Mobile-first” is an engineering and validation approach, not a mobile-only design
priority.

- Desktop is a primary B2B decision environment.
- Mobile is a primary campaign and lead-capture environment.
- Tablet/laptop receive intentional intermediate compositions.
- Content, evidence and metadata remain equivalent across devices.
- Forms and CTAs are touch-safe and keyboard accessible.

## 13. Accessibility

- WCAG 2.2 AA target;
- product standard of at least 44 × 44 CSS px for primary controls where practical;
- visible focus;
- semantic heading order;
- accessible video controls/captions;
- sufficient contrast;
- no information encoded only by color;
- RTL reading and focus order;
- reduced motion;
- accessible carousel alternatives.

## 14. High-fidelity review set

The next visual exploration must contain:

1. Desktop hero and first proof transition.
2. Desktop featured-edition/country-card system.
3. Desktop “Why exhibit?” and case-study chapter.
4. Desktop method and market-insight chapter.
5. Desktop package/final-conversion chapter.
6. Mobile hero and featured edition.
7. Mobile objection/proof flow.
8. Mobile package/form flow.
9. One Arabic/RTL desktop key screen.
10. One Arabic/RTL mobile key screen.

## 15. Visual acceptance criteria

- Reads as a Moroccan international property exhibition within seconds.
- Exhibitor value is stronger than visitor registration.
- Event cards are a major designed surface.
- Modern sophistication comes from composition and craft, not luxury styling.
- Every screen has a clean hierarchy and realistic content density.
- Desktop is detailed and authoritative.
- Mobile is genuinely recomposed and usable.
- Yellow feels native and energetic.
- Real evidence and campaign atmosphere are visibly distinct.

