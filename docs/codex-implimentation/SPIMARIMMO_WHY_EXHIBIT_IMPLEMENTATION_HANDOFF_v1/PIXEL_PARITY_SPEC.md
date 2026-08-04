# Pixel parity specification

## Target and authority

The four PNGs in `reference-screens/` are the visual authority for this section at **1536 × 1024**. Existing repository architecture, tokens, fonts and shared primitives remain engineering authority. If a real route or approved fact differs from a screenshot placeholder, preserve truth and document the intentional delta.

Pixel parity means close geometry, hierarchy, typography, color, crop, rhythm and state behavior. It does not mean using the screenshot as a background or embedding interface text in images.

## Desktop composition at 1536 × 1024

- Section canvas: warm off-white, approximately `#f4f0e9`; use the repository token if equivalent.
- Outer horizontal inset: `50px` at the target viewport.
- Eyebrow top: about `38px`; gold, compact uppercase/number style.
- H2 left/top: about `50px / 78px`; single line; approximately `76–82px`, weight 700–800, line-height `0.98`.
- Subtitle: about `50px / 176px`; approximately `21px`, line-height `1.35`.
- Tab rail: `x=50`, `y=223`, width about `1422px`, height `69px`; four equal tracks with `3–4px` gap.
- Active tab: warm gold gradient, white label, gold dot centered just below its lower edge. Inactive: transparent/off-white with `1px` restrained gold border.
- Evidence stage starts near `y=314` and ends near `y=1008`.
- Copy column: `x≈52`, width `310–330px`; benefit number around `72px`; heading around `43–47px`; body `18–19px`; underlined CTA.
- Central phone: `x≈648`, `y≈314`, width `363–366px`, height `692–696px`; black shell, radius about `54px` and subtle grounded shadow.
- Side evidence cards occupy the corridor between the copy and phone and the corridor between phone and right edge. They are visually connected with fine gold paths and nodes.
- Bottom proof statement aligns near `x=53`, `y=930`.

Treat these as first-pass measurements. Validate with screenshots and tune named CSS variables rather than scattering unrelated magic numbers.

## Required component model

Use one data-driven tree; do not duplicate four large JSX structures.

```text
WhyExhibitSection
├── WhyExhibitHeader
├── BenefitTabs (ARIA tablist)
└── BenefitStage
    ├── BenefitCopy
    ├── EvidenceCanvas
    │   ├── EvidenceConnectors (SVG)
    │   ├── EvidenceCard[]
    │   └── EvidencePhone
    │       └── PhoneScene selected by scene kind
    └── BenefitFootnote
```

Recommended data shape:

```ts
type BenefitId = 'qualified' | 'international' | 'campaigns' | 'support';

type Benefit = {
  id: BenefitId;
  number: '01' | '02' | '03' | '04';
  tabLabel: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  proofLine: string;
  scene: 'qualification' | 'international' | 'campaigns' | 'support';
  evidence: EvidenceCardData[];
};
```

Separate content/data, types, scene components and scoped styles. Reuse a single `EvidenceCard` shell with variants; scene internals may differ because their semantics differ.

## Phone construction

Build the phone in CSS/HTML, not as an image.

- Stable outer dimensions and aspect ratio across all tabs.
- Black layered frame, thin metallic edge, internal highlight, camera island and screen clipping.
- The screen is a semantic component. Use the mapped photographs only inside media slots.
- Keep all labels, pills, rows, maps, stats and CTA text as DOM/SVG.
- Use a local coordinate system inside the phone; the shell must not jump between tab changes.

## Connectors and evidence cards

- Put connector paths in one absolute SVG layer behind cards and phone.
- Anchor paths to named data points or stable normalized coordinates, not viewport-specific DOM measurements.
- Stroke around `1px`, warm gold at restrained opacity; use round nodes at junctions.
- Cards use warm paper, `1px` gold border, subtle shadow, `10–14px` radius and small rotations matching each reference.
- Card text remains DOM text. Images occupy explicit media rectangles.

## State, URL and interaction

- Default state: tab 01.
- Support deterministic deep-linking via `?benefit=qualified|international|campaigns|support` without a full page reload.
- Clicking a tab updates state and the query string with history semantics consistent with the repository.
- Arrow Left/Right, Home and End navigate the tablist; Enter/Space activates when needed.
- Focus must be visible and must not alter layout.
- Preserve active state across responsive transitions.

## Motion

- Active-tab fill/indicator: `220–280ms` ease-out.
- Stage change: outgoing opacity/translate `120–160ms`, incoming `240–320ms`; do not animate the section height.
- Evidence cards may stagger by `30–45ms`; phone shell remains fixed while screen content crossfades.
- Connector paths may draw with stroke dash animation after the cards settle.
- Respect `prefers-reduced-motion`; reduced mode must switch instantly with no parallax or path drawing.

## Responsive behavior

### 1280px and wider

Maintain the reference composition. Scale within a max-width wrapper only after validating the 1536px target.

### 768–1279px

- Allow the title to wrap naturally.
- Keep the four tabs as a compact 2 × 2 grid or horizontally scrollable segmented row, chosen to match existing project patterns.
- Move copy above the evidence canvas.
- Keep the phone central; reduce side-card count or place cards in shallow side rails without illegible scaling.

### Below 768px

- Single-column reading order: header, scrollable tabs, copy, phone, evidence card carousel, proof line.
- Phone width: `min(88vw, 365px)`.
- No connector spaghetti or overlapping cards. Hide decorative desktop paths.
- Minimum touch target `44 × 44px`; no horizontal page overflow.

## Typography and tokens

- Use the actual repository fonts and inspect their computed metrics before tuning sizes.
- Introduce section-scoped variables such as `--why-gold`, `--why-paper`, `--why-ink`, `--why-phone`, `--why-stage-w`, and geometry variables.
- Do not globally change brand gold to solve this one section.
- Avoid tracking hacks and line breaks inserted only for one browser. Explicit `<br>` is acceptable only where the reference clearly requires a controlled headline break and responsive CSS removes it when necessary.

## Accessibility

- Correct `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` and roving `tabindex` behavior.
- Decorative connectors, charts and duplicated thumbnails are hidden from assistive technology.
- CTA destinations must exist or be explicitly marked pending; do not invent a route.
- Color is not the only active-state signal: number, fill, indicator and ARIA state must agree.
- Maintain WCAG AA contrast and keyboard usability.

## Visual parity workflow

1. Add a dev-only visual route that can select a deterministic benefit query. It must return `notFound()` or equivalent in production.
2. Render at exactly `1536 × 1024`, device scale factor 1, fixed fonts loaded, animations disabled.
3. Capture each of the four benefit states.
4. Produce reference, actual and diff images for the whole section and these regions: header, tab rail, copy, phone, left cards and right cards.
5. Fix in this order: macro geometry, typography, component dimensions, image crop, colors/borders, shadows, connector paths, micro-spacing, motion.
6. Initial acceptance: major boundaries within `4px`, repeated row heights within `2px`, text baselines within `3px`, no missing/extra component, correct image and crop in every slot.
7. Report remaining differences honestly. A global near-zero pixel ratio is not meaningful when photography, font rasterization or OS rendering differs; use per-region evidence.

## Prohibited shortcuts

- No screenshot background.
- No screenshot crops containing UI/text.
- No duplicated per-tab section trees.
- No canvas recreation of the entire interface.
- No invented metrics, company facts, case-study numbers or destinations.
- No absolute positioning relative to the browser viewport; absolute positioning is allowed only inside the bounded evidence canvas.
- No stopping after a plan or after tab 01 when the task is to implement all four tabs.

