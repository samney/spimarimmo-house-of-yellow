# SPIMARIMMO — Part 11: Complete Mobile Homepage Assembly

**Version:** 1.0  
**Updated:** 31 July 2026  
**Status:** `VISUAL_ASSEMBLY_FOR_REVIEW`  
**Direction:** `MODERN_DEPTH_B2B_PERFORMANCE`  
**Reference width:** `748px` review canvas  
**Primary audience:** Moroccan property-developer decision-makers  
**Primary job:** Validate the complete exhibitor-first mobile narrative before
Arabic/RTL adaptation and deterministic source design

## 1. Deliverables

1. [Complete mobile homepage master](01-mobile-homepage-complete-master.png)
2. [Mobile consistency review board](02-mobile-homepage-review-board.png)
3. Canonical mobile chapter references:
   - [Header, hero, proof and editions](sections/01-header-hero-proof-events.png)
   - [Why exhibit and operating method](sections/02-why-exhibit-method.png)
   - [Key figures and MRE market](sections/03-key-figures-mre-market.png)
   - [Visibility system and promoter trust](sections/04-visibility-trust.png)
   - [Case studies and executive voices](sections/05-case-studies-testimonials.png)
   - [Exhibitor packages and comparison](sections/06-exhibitor-packages-comparison.png)
   - [Gallery and real-event proof](sections/07-gallery-event-proof.png)
   - [Resources, insights and FAQ](sections/08-resources-insights-faq.png)
   - [Qualified request, contact and footer](sections/09-final-conversion-contact-footer.png)

The master is a content-preserving, normalized-width assembly of the latest mobile
chapter explorations. Intermediate global sticky bars were removed from the static
long-form image so the page does not appear to contain nine separate sticky actions.
The production experience uses one global sticky action governed by Section 7.

The images are references for hierarchy, responsive intent and stakeholder review.
They are not deterministic source designs, approved public content, implementation
screenshots or evidence that placeholder information exists.

## 2. Controlling sources and authority

Part 11 carries forward:

1. the official CTO brief;
2. the approved exhibitor-first homepage hierarchy;
3. the Part 10 desktop order and consistency decisions;
4. the detailed behavior contracts in Parts 05–09;
5. the evidence, media and claim-safety rules in the canonical workspace.

The following remain explicitly prohibited:

- visitor-first parent-site conversion;
- invented events, dates, venues, availability or prices;
- fabricated attendance, lead, opportunity, reservation or sales figures;
- unauthorized developer, partner or institutional logos;
- invented case-study outcomes, quotes or testimonial identities;
- generated scenes presented as documentary SPIMAR evidence;
- a compressed desktop layout presented as a mobile solution.

## 3. Complete mobile homepage order

| Part | Mobile chapter | Primary decision job | Controlling reference |
|---:|---|---|---|
| 01 | Header, promise, proof strip and international editions | Establish audience, proposition, market reach and primary action above the fold | `sections/01-header-hero-proof-events.png` |
| 02 | Why exhibit and before/during/after method | Answer initial objections and reveal operational support without a dense desktop timeline | `sections/02-why-exhibit-method.png` |
| 03 | Measurement framework and MRE intelligence | Establish evidence discipline and explain demand motivations with readable mobile disclosure | `sections/03-key-figures-mre-market.png` |
| 04 | Visibility lifecycle and promoter trust | Translate activity into exhibitor value while keeping every unapproved logo visibly provisional | `sections/04-visibility-trust.png` |
| 05 | Case studies and executive video voices | Move from broad promise to traceable proof, attribution and attributable executive voice | `sections/05-case-studies-testimonials.png` |
| 06 | Packages, comparison and proposal path | Support package-fit evaluation without a squeezed comparison matrix or commercial invention | `sections/06-exhibitor-packages-comparison.png` |
| 07 | Gallery and real-event proof | Show documentary execution, provenance and media detail through a touch-first gallery | `sections/07-gallery-event-proof.png` |
| 08 | Resources, insights and exhibitor FAQ | Support evaluation and objection resolution through progressive disclosure | `sections/08-resources-insights-faq.png` |
| 09 | Qualified request, trust close and footer | Capture an edition-aware request without implying reservation, price or CRM completion | `sections/09-final-conversion-contact-footer.png` |

The mobile narrative is:

```text
Commercial promise
→ edition discovery
→ reasons to exhibit
→ operating method
→ measurement discipline
→ MRE market intelligence
→ visibility and trust
→ traceable proof
→ package fit
→ documentary evidence
→ resources and objections
→ qualified request
```

## 4. Corrections made in Part 11

The older iteration-03 mobile set was useful for direction but did not fully match
the latest desktop narrative. Part 11 corrects that gap.

1. Replaced the compressed Part 02–04 sheet with dedicated mobile chapters.
2. Restored the governed six-metric model from Part 03; every unresolved value is
   an em dash rather than an invented number.
3. Restored the methodology, source and validation states required for market
   evidence.
4. Rebuilt the desktop radial MRE model as a readable vertical disclosure path.
5. Rebuilt the desktop visibility columns as a vertical three-stage mobile
   stepper.
6. Added a dedicated promoter-trust carousel with the explicit label
   `DÉMONSTRATION — LOGOS À VALIDER`.
7. Retained the newer Parts 05–09 mobile compositions and their governing
   specifications.
8. Removed repeated intermediate global sticky actions from the static assembly.
9. Preserved one header, one primary exhibitor journey and one final footer.
10. Normalized all chapter references to a common `748px` review width.

## 5. Mobile foundation

### 5.1 Target viewport family

The deterministic design must be validated at minimum at:

| Class | Reference width | Requirement |
|---|---:|---|
| Compact mobile | `320–359px` | No horizontal page scroll; labels may wrap intentionally |
| Standard mobile | `360–393px` | Primary design target |
| Large mobile | `394–430px` | Preserve readable line length rather than stretching components |
| Small tablet | `600–767px` | Increase content width selectively; do not jump directly to desktop compositions |

The `748px` image is a high-density review canvas, not a CSS viewport. Production
measurements must be defined in CSS pixels and tested on real devices.

### 5.2 Layout rules

- Page inline padding: start with `20px`; allow `24px` on wider mobile.
- Primary vertical section spacing: start with `64–88px`.
- Component gaps: use a deliberate `8/12/16/20/24/32px` rhythm.
- Reading measure: keep body copy near `30–42` characters per line when practical.
- Full-bleed documentary media may escape the content column only when controls,
  captions and source status remain inside the safe area.
- Horizontal carousels must expose a controlled next-card peek without creating
  accidental page overflow.
- Section height follows content; no chapter receives a fixed image-derived height.

### 5.3 Typography direction

| Role | Mobile direction |
|---|---|
| Hero heading | Approximately `36–48px`, compact line height, no orphaned final word where copy permits |
| Section heading | Approximately `30–40px`, responsive to translated length |
| Subheading | Approximately `22–28px` |
| Body | `16–18px` with at least `1.45` line height |
| Metadata | `13–15px`, never used for essential instructions |
| Button label | `15–17px`, semibold and action-specific |

These are starting ranges. Font selection, exact metrics and language-specific
optical corrections remain part of the deterministic design-system phase.

### 5.4 Geometry and surfaces

- Cards and media: controlled `14–20px` radii.
- Buttons: rounded rectangles; do not turn every action into a capsule.
- Touch rows: clear bounded surfaces or dividers with a visible affordance.
- Borders: neutral hairlines; yellow is reserved for priority, selection or status.
- Shadows: subtle surface separation only.
- Dark stages: near black and graphite, not glossy black gradients.
- Light stages: warm white and pale neutral, not high-glare pure white.

## 6. Chapter-specific mobile behavior

### 6.1 Part 01 — hero and editions

- The compact header exposes the SPIMAR identity, locale and menu.
- The exhibitor promise and primary CTA appear before decorative media.
- `Devenir exposant` and `Télécharger la brochure` remain distinct actions.
- Proof values remain placeholders until the metric definition and source are
  approved.
- Event cards use horizontal discovery with a visible next-card affordance.
- Each edition must expose lifecycle, city/country and exhibitor/visitor routes.
- Hero video must have a static poster and must not autoplay when data-saving,
  reduced-motion or constrained-network conditions apply.

### 6.2 Part 02 — why exhibit and method

- Four benefits use touch-safe rows or a two-column layout only when copy remains
  readable.
- `Selon l’offre` is a dependency state, not a confirmed inclusion.
- The before/during/after system becomes a vertical accordion or stepper.
- One phase may be expanded; the phase labels and summaries remain visible.
- Opening a phase must not unexpectedly scroll the heading off-screen.
- The CTA opens the detailed exhibitor-support route, not an implied package order.

### 6.3 Part 03 — measurement and MRE intelligence

- Metric cards use a two-column mobile grid when width permits.
- An em dash means unavailable or unvalidated; it is never replaced with `0`.
- Methodology and source access remain adjacent to the figures.
- The MRE motivation model becomes a vertical disclosure list rather than a
  miniature radial diagram.
- Filters may scroll horizontally, but every filter remains keyboard and
  screen-reader operable.
- The market resource must show its version and approval state before download.

### 6.4 Part 04 — visibility and trust

- Before, during and after appear as a connected vertical lifecycle.
- Each stage exposes capability, status and illustrative media without guaranteeing
  delivery outside the selected offer.
- Promoter logos use a swipeable carousel with pagination and a next-card peek.
- A logo placeholder is never visually treated as a real approved partner.
- Generated interview, stand or reporting scenes remain illustrative only.

### 6.5 Part 05 — case studies and video voices

The [Part 05 specification](../iteration-04-part-05-proof/00-PART-05-SPECIFICATION.md)
remains authoritative.

- Metrics use a readable two-column grid.
- Attribution becomes a vertical stepper.
- Testimonial cards show one primary voice plus a controlled next-card preview.
- Captions, transcript access, consent and approval status are required.
- A video poster or generated person is not testimonial evidence.

### 6.6 Part 06 — packages and comparison

The [Part 06 specification](../iteration-05-part-06-offers/00-PART-06-SPECIFICATION.md)
remains authoritative.

- Package tabs select one focused plan at a time.
- Comparison categories use grouped disclosure rather than a three-column squeeze.
- Unknown inclusion, price and availability states remain explicit.
- The proposal flow is edition-aware and does not imply a reservation.
- Optional sponsorship inventory remains unavailable until commercial approval.

### 6.7 Part 07 — gallery and event proof

The [Part 07 specification](../iteration-06-part-07-gallery/00-PART-07-SPECIFICATION.md)
remains authoritative.

- Country, edition and media filters remain horizontally discoverable.
- One dominant media surface leads the chapter.
- Metadata is stacked below media and never hidden behind playback controls.
- The lightbox/player supports close, next, previous, captions and transcript.
- Media without provenance, consent or rights approval cannot enter the public
  proof gallery.

### 6.8 Part 08 — resources and FAQ

The [Part 08 specification](../iteration-07-part-08-resources/00-PART-08-SPECIFICATION.md)
remains authoritative.

- One featured resource may expand; supporting documents use touch-safe rows.
- File existence, approval, publication and successful delivery remain separate
  states.
- Insight cards expose source and date before acting as market guidance.
- FAQ disclosure preserves question context and focus after expansion.
- Progressive profiling must remain proportional to the requested resource.

### 6.9 Part 09 — enquiry and footer

The [Part 09 specification](../iteration-08-part-09-conversion/00-PART-09-SPECIFICATION.md)
remains authoritative.

- The enquiry path follows edition → objective → contact.
- Fields use persistent labels, appropriate input modes and autofill semantics.
- Consent is explicit and separate from optional marketing permission.
- A successful state appears only after durable server acceptance.
- CRM delivery, assignment, contact, proposal and reservation are downstream states.
- The footer groups exhibitor, visitor, corporate and resource links without
  becoming a dense sitemap wall.

## 7. Header, menu and global sticky action

### 7.1 Header

- One global header exists at the beginning of the page.
- It becomes compact after the hero but must not obscure in-page anchor targets.
- Locale and menu controls remain touch-safe and named for assistive technology.
- Opening the menu traps focus, prevents background scroll and restores focus to the
  trigger when closed.

### 7.2 Mobile menu

The menu prioritizes:

1. Salons;
2. Exposer;
3. Pourquoi SPIMAR;
4. Études de cas;
5. Ressources;
6. Devenir exposant;
7. separate visitor and corporate routes;
8. locale selection.

The visitor route is visible but does not replace the exhibitor conversion.

### 7.3 Sticky exhibitor action

Production uses one sticky exhibitor action, not one action per chapter.

- It may appear after the user scrolls beyond the hero actions.
- It must preserve safe-area insets.
- It hides while an input has focus or the virtual keyboard is open.
- It must not cover gallery controls, consent text, validation errors, submit
  feedback or footer links.
- It may collapse when the final enquiry section enters the viewport.
- Its wording remains `Parler à l’équipe exposants` until commercial copy review.
- Activating it opens the qualified contact path; it does not confirm a stand.

The static long-form master omits intermediate sticky instances because a static
image cannot accurately represent viewport-persistent behavior.

## 8. Core interaction contracts

### Accordions

- Use a real button with `aria-expanded` and an associated region.
- Preserve focus and prevent layout jumps.
- Do not require all panels to close before another opens unless user testing
  supports that behavior.

### Carousels

- Swipe is supplementary; previous/next controls and pagination remain available.
- Announce the current item without repeatedly interrupting screen readers.
- Pause automated movement; preferably avoid autoplay entirely.
- Keep card order, focus order and visual order identical.

### Video

- No audio autoplay.
- Provide poster, duration, captions, transcript and full-screen support.
- Do not require playback to understand the commercial argument.
- Respect reduced motion, data saving and constrained connections.

### Filters and tabs

- Selected state cannot depend on yellow alone.
- Preserve a meaningful results count only when the underlying data is real.
- Update the URL when filter state is valuable for sharing or return navigation.

### Forms

- Use server-side validation in addition to client feedback.
- Preserve valid values after recoverable errors.
- Scroll and focus the error summary without hiding the offending field.
- Prevent duplicate submission while making recovery possible.
- Never place contact values or free text in analytics payloads.

## 9. Responsive adaptation beyond the reference canvas

The mobile composition must not jump directly to the Part 10 desktop layout.

| Range | Adaptation |
|---|---|
| `320–359px` | One-column cards, reduced padding, wrapped filters, full-width actions |
| `360–430px` | Standard Part 11 composition |
| `431–599px` | Wider media and selected two-column grids where copy still fits |
| `600–767px` | Small-tablet composition with selective two-column chapters |
| `768–1023px` | Dedicated tablet rules; do not reuse either endpoint blindly |
| `1024px+` | Transition to the Part 10 desktop system |

No breakpoint may change the meaning, order, evidence status or conversion truth of a
component.

## 10. Accessibility contract

The deterministic implementation retains the WCAG 2.2 AA target.

- minimum practical touch target: `44 × 44px`;
- visible focus on light, dark and yellow surfaces;
- semantic headings and landmarks;
- no information encoded by color, icon or animation alone;
- correct accessible names for menus, filters, media, carousels and icon actions;
- keyboard and switch-access support;
- captions and transcripts for published video;
- text alternatives describing the commercial purpose of documentary images;
- error summary, inline error and recovery guidance;
- content order that remains logical without CSS;
- zoom to `200%` without loss of information or horizontal page scroll;
- reflow at `320px`;
- reduced-motion support;
- no motion required for comprehension.

## 11. Mobile performance and media

### Performance targets

- Mobile Core Web Vitals must pass field thresholds at the 75th percentile.
- Hero and above-the-fold event content receive the first loading priority.
- Below-the-fold chapter media is lazy-loaded.
- The page must not download nine full-resolution video assets on initial load.
- Reserve media dimensions to prevent cumulative layout shift.
- Use responsive image sources and modern formats with a supported fallback.
- Defer non-critical carousel, analytics and video-player code.

### Media publication

Every public proof asset requires:

- canonical asset identity;
- event and edition relation;
- capture date and location;
- photographer or production source;
- consent and rights status;
- approval owner;
- alt text or transcript;
- derivative and crop rules;
- expiry or revocation handling where applicable.

Generated imagery in these reference screens is demonstration material only.

## 12. Content and evidence safeguards

The following state meanings are preserved across the full mobile page:

| State | Meaning |
|---|---|
| `—` | Value is unavailable or not yet validated |
| `À confirmer` | Operational owner must provide and approve the fact |
| `Données en cours de validation` | Source, period, definition or owner remains incomplete |
| `Selon l’offre` | Capability depends on an approved package; inclusion is not confirmed |
| `LOGOS À VALIDER` | No displayed mark is authorized as a public partner claim |
| `Contenu à valider` | Resource or editorial content cannot yet be published |

Registration, verified profile, check-in, interaction, accepted lead, opportunity,
reservation and attributed sale remain separate funnel stages.

## 13. Analytics continuity

The mobile page uses the canonical event taxonomy and adds only interaction detail:

- menu open, close and destination;
- hero exhibitor CTA;
- brochure start, validation and delivery;
- edition impression, selection and audience route;
- accordion open by chapter and item;
- carousel previous, next and item open;
- methodology and evidence-definition access;
- case-study open and testimonial playback;
- package selection, comparison and proposal start;
- gallery filter, media open and playback;
- resource request and FAQ topic;
- qualified-request start, validation error and durable acceptance;
- locale and audience-route change;
- sticky exhibitor action impression and activation.

Analytics must not contain names, emails, phone numbers, company-entered free text or
other form values.

## 14. Visual and functional QA

### Static-reference QA completed

- Nine chapters exist in the same order as Part 10.
- Parts 02–04 were recomposed specifically for mobile.
- All chapter references use the same `748px` review width.
- Intermediate duplicate sticky actions were removed.
- One header and one final conversion/footer close frame the master.
- The latest Parts 05–09 replace the older compressed mobile close.
- Unknown metrics, packages, logos, resources and outcomes remain visibly gated.
- The review board exposes every chapter for fast consistency review.

### Deterministic QA still required

- real-device review on Android and iOS;
- compact-width and text-zoom review;
- keyboard, switch and screen-reader testing;
- menu, focus trap and focus restoration;
- carousel and accordion state testing;
- video captions, transcript and reduced-data behavior;
- form input mode, autofill, validation, submission and recovery;
- sticky action with safe areas and virtual keyboards;
- FR, EN and Arabic/RTL copy expansion;
- tablet and intermediate breakpoint review;
- throttled network and low-memory behavior;
- Core Web Vitals field validation.

## 15. Generation and assembly provenance

The built-in image workflow used the `ui-mockup` use case for three missing
mobile-native chapters.

### Final prompt set

1. **Part 02:** translate the authoritative desktop why-exhibit and operating-method
   chapter into a warm-white benefit system and dark vertical three-stage method;
   preserve `Selon l’offre`; exclude header, footer, global sticky action, invented
   metrics and guaranteed ROI.
2. **Part 03:** translate the authoritative measurement and MRE chapter into six
   two-column metric placeholders, methodology/source access, vertical MRE
   disclosures and a governed resource card; use em dashes for all values; exclude
   invented research, sources and figures.
3. **Part 04:** translate the authoritative visibility and trust chapter into a
   vertical before/during/after service lifecycle and a swipeable promoter
   placeholder carousel; include `DÉMONSTRATION — LOGOS À VALIDER`; exclude real
   logos, partner names and campaign claims.

Common prompt constraints:

```text
High-fidelity 2026 mobile B2B property-expo UI; SPIMAR yellow, near black and warm
white; controlled 14–20px radii; touch-safe controls; documentary media treated as
illustrative; no squeezed desktop layout; no visitor-first hierarchy; no fabricated
metrics, prices, events, logos, partners, testimonials or ROI; no 2016 WordPress
event-template styling.
```

The remaining chapter references were normalized and assembled deterministically
from the already approved visual-exploration files. No generative model was used to
blend or rewrite the complete long-form master.

## 16. Known limitations

- Image-generated text may contain visual inaccuracies.
- Exact type metrics, spacing, line breaks and component dimensions are not source
  specifications.
- Static images cannot prove focus, semantics, touch behavior, data loading, error
  recovery or responsive interpolation.
- The long master cannot represent a viewport-persistent sticky action accurately.
- Generated media cannot be published as real-event proof.
- The mobile assembly does not constitute stakeholder approval.

## 17. Acceptance result

| Review area | Result | Qualification |
|---|---|---|
| Same narrative as desktop | `PASS` | All nine chapters remain in the Part 10 order |
| Mobile-native recomposition | `PASS` | Dense desktop structures become steppers, disclosures, tabs and carousels |
| Exhibitor-first conversion | `PASS` | Primary promise and actions remain B2B |
| International-event visibility | `PASS` | Edition discovery remains in Part 01 |
| CTA consistency | `PASS_WITH_COPY_GATE` | One hierarchy exists; final commercial wording is pending |
| Claim safety | `PASS_WITH_CONTENT_GATE` | Unknowns remain visible; real inputs are missing |
| Production content | `BLOCKED` | Requires validated SPIMAR data, media and approvals |
| Deterministic source UI | `BLOCKED` | Requires wireframes, tokens and component specifications |
| Functional accessibility | `NOT_TESTABLE_IN_STATIC_IMAGES` | Must be implemented and tested |
| Stakeholder approval | `PENDING` | Founder, CTO, commercial and marketing review required |

Part 11 closes the **mobile visual-assembly** step. It does not approve the design
for production.

## 18. Next step

The next visual-production step is:

> **Part 12 — Complete Arabic/RTL Homepage Adaptation**

It must adapt the current desktop and mobile narratives rather than merely
right-aligning text. Navigation, sequence, media direction, iconography, controls,
forms, numbers and mixed-direction content require independent RTL review.

The next official product gate remains:

> Approve the sitemap, homepage hierarchy, exhibitor funnel and evidence slots,
> then produce deterministic low-fidelity desktop/mobile/RTL wireframes.
