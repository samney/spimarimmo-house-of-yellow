# Typography, Grid, Responsive and RTL System

**Document ID:** `SPM-DS-LYT-001`  
**Status:** `COMPLETE_FOR_GATE_7_WITH_FONT_APPROVAL_OPEN`  
**Date:** 31 July 2026

## 1. Composition modes

The selected identity uses three governed modes inside one system:

| Mode | Controlling territory | Primary surfaces |
|---|---|---|
| Signal | `IDT-01` | Hero, global/local shell, event discovery, city/date, campaign, conversion close |
| Editorial place | `IDT-02` | Destination, visitor orientation, people, property, city network, long-form narrative |
| Evidence | `IDT-03` | Proof, case, method, offers, resources, sources, definitions, reporting |

Modes change hierarchy and composition, not navigation, state semantics, brand color, or component ownership.

## 2. Typography contract

### 2.1 Role assignment

| Content role | Latin behavior | Arabic behavior |
|---|---|---|
| City/edition campaign | Condensed, uppercase permitted, tight tracking | Script-authentic heavy display, normal Arabic shaping, no forced uppercase/condensation |
| Page proposition | Strong sentence case, deliberately broken lines | Semantic line breaks with added line height and independent width |
| Section heading | Clear decision language | Equivalent hierarchy, not equivalent word count |
| UI and forms | Neutral multilingual family | Same family or optically matched Arabic face; clear shaping and numerals |
| Evidence metadata | Compact but readable; tabular figures where supported | Direction-isolated dates, codes, URLs, and Latin names |

### 2.2 Reading measures

- primary narrative: `48–68ch`;
- dense legal/editorial: `60–75ch` with stronger vertical rhythm;
- hero proposition: controlled by semantic line grouping, not a generic character maximum;
- evidence source/caveat: kept adjacent to the claim and never reduced below the approved metadata role;
- form labels/help/errors: full width when needed; never truncated to preserve symmetry.

### 2.3 Line-breaking rules

- art-direct campaign and H1 line breaks per locale and breakpoint;
- prohibit isolated city/date fragments and orphaned single-word CTA lines where feasible;
- never solve translation length by shrinking below role minimums;
- allow components to expand vertically;
- keep non-breaking units only where they improve meaning: date ranges, currency values, measurement units, and short event codes;
- isolate bidirectional runs with semantic markup (`bdi`, `dir`, locale-aware formatters).

## 3. Layout grid

| Context | Columns | Gutter | Behavior |
|---|---:|---:|---|
| Wide desktop ≥ 1600 | 12 | fluid `48–72px` | Asymmetric editorial spans; full-bleed media permitted |
| Desktop 1280–1599 | 12 | fluid `32–56px` | Primary production reference |
| Laptop 1024–1279 | 8 | `28–40px` | Remove fragile overlap; retain proof/action adjacency |
| Tablet 768–1023 | 6 | `24–32px` | Touch-first; comparison and rails transform |
| Mobile 320–767 | 4 | `20–24px` | Native vertical composition; one dominant decision at a time |

The content container has a working maximum of `1440px`; media planes may intentionally exceed it. Text measures remain narrower. Breakpoints are content-failure boundaries, not device-brand labels.

## 4. Responsive transformation rules

| Pattern | Wide behavior | Narrow behavior |
|---|---|---|
| Hero | Copy/media can share or layer; city/date is dominant | State → city/date → proposition → action → poster/media |
| Event rail | Multi-card horizontal/controlled rail | One-card reading sequence or horizontal snap only with visible controls and keyboard parity |
| Audience paths | Equal side-by-side panels when both are active | Stack by current task/state; both remain discoverable |
| Proof | Claim and evidence can share a grid | Source/caveat follows its claim immediately |
| Offer comparison | Equal capability columns | Each offer repeats the identical ordered capability taxonomy; no squeezed table |
| Method | Before/during/after editorial sequence | Vertical numbered sequence with artifacts attached to each stage |
| Forms | Context and form can share columns | Context/outcome first, then fields, consent, action, recovery |
| Navigation | Full global/local systems | Controlled drawer; current context and both audience entries preserved |
| Sticky action | Optional contextual action | At most one; only after original action leaves view; never covers errors/legal/focus |

No content, disclaimer, state, audience path, or recovery action is removed merely to fit a smaller width.

## 5. RTL layout contract

### 5.1 Logical behavior

- set document `dir="rtl"` for Arabic routes;
- use logical CSS properties for spacing, position, border, and alignment;
- DOM, keyboard, screen-reader, and visual reading orders must agree;
- compose Arabic campaign blocks independently; do not reverse a Latin screenshot;
- do not mirror the SPIMARIMMO wordmark, photography, video, partner marks, maps, or geography;
- reverse arrows only when they encode reading/interaction direction;
- keep play, external-link, download, location, and universal media controls semantically stable.

### 5.2 Mixed-direction content

Direction-isolate:

- `SPIMARIMMO` and partner names;
- URLs and email addresses;
- phone numbers;
- event codes;
- Latin venue names;
- dates/times/numeral runs when locale output requires it.

The design must be tested with realistic Arabic headings, multi-line errors, consent text, date ranges, and French/Latin proper nouns—not lorem ipsum.

## 6. Locale and host resilience

| Condition | Required response |
|---|---|
| Locale is production-complete | Publish explicit locale URL with correct `lang`, `dir`, canonical, and reciprocal equivalence |
| Optional module translation missing | Suppress the module cleanly when approved; never mix critical languages silently |
| Critical meaning missing | Keep route unpublished or show an explicitly approved fallback state |
| Local host has adapted contact/practical data | Preserve global component contract; resolve content from host-aware records |
| Arabic editorial review incomplete | Mark preview as not publishable; do not treat visual RTL QA as language approval |

## 7. Vertical rhythm

Each section has one dominant job:

1. orientation/context;
2. answer or proposition;
3. evidence/mechanism;
4. next action or safe alternative.

Use section spacing for chapter changes, module spacing for related decisions, and cluster spacing for labels/details. Repeated equal card stacks are rejected when rows, rules, or media planes explain hierarchy more clearly.

## 8. Density modes

| Density | Use | Constraints |
|---|---|---|
| Expressive | Hero, edition, campaign | One focal point; minimal metadata; action and state always visible |
| Standard | Events, destinations, visitor, company | Balanced media, copy, facts, and action |
| Dense evidence | Proof, offers, resources, legal | Strong labels/rules; no tiny text, dashboard card wall, or hidden definitions |
| Transactional | Forms, confirmation, recovery | Calm reading surface; no overlapping campaign motion |

## 9. Responsive acceptance matrix

Every component and template is reviewed at:

- `320px` narrow mobile;
- `390px` common mobile;
- `768px` tablet threshold;
- `1024px` laptop/tablet landscape;
- `1280px` desktop;
- `1600px` wide desktop;
- 200% browser zoom and WCAG reflow scenarios;
- French LTR, English LTR, and Arabic RTL fixtures;
- reduced-motion and missing-media states.

Acceptance requires no horizontal reading dependency, clipped content, hidden focus, covered errors, inaccessible hover-only information, or contradictory reordered state.

