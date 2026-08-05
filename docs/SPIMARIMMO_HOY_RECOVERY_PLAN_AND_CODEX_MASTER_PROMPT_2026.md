# SPIMARIMMO — House of Yellow Foundation Recovery Plan

**Document type:** Recovery strategy, implementation plan, and Codex execution prompt  
**Status:** Ready for engineering intake  
**Date:** 4 August 2026  
**Project workspace:** `C:\work\spimar`  
**Authoritative specification:** `C:\work\spimar\docs\SPIMARIMMO_Dossier_Implementation_End_to_End_2026.pdf`

---

## 1. Executive decision

The current SPIMARIMMO website contains much of the required business content and many of the sections defined by the specification. However, during expansion, the website lost the strong House of Yellow presentation foundation that had previously been accepted.

The solution is **not**:

- a new website from an empty repository;
- a superficial CSS reskin of the current homepage;
- deleting completed SPIMARIMMO functionality;
- copying the House of Yellow section order;
- adding more isolated, section-specific visual treatments;
- merging the current generic presentation wholesale into the accepted clone.

The solution is a controlled **presentation-system recovery and section normalization**:

> The current implementation is the functional donor.  
> The accepted House of Yellow clone is the presentation foundation.  
> The SPIMARIMMO PDF is the authority for information architecture, section order, content, and journeys.  
> SPIMARIMMO owns the final brand identity.

The project must preserve completed functionality while rebuilding its presentation through one consistent design system.

---

## 2. Mission objectives

1. Recover the composition, typography, grid, media presence, motion, spacing, and interaction quality of the accepted House of Yellow foundation.
2. Preserve completed SPIMARIMMO sections, content, forms, CMS/CRM connections, localization, routes, and validated behavior.
3. Reorder the homepage exactly according to the `01–09` sequence in the implementation PDF.
4. Repair inconsistent, confusing, weak, or visually generic sections.
5. Replace section-level styling decisions with shared tokens, primitives, and patterns.
6. Maintain an exhibitor-first B2B journey while keeping the visitor journey separate and accessible.
7. Validate desktop, tablet, mobile, accessibility, performance, motion, and functional behavior before production.

---

## 3. Source hierarchy and conflict resolution

When two sources disagree, use the following authority order.

| Responsibility | Controlling source |
|---|---|
| Business objective and commercial question | SPIMARIMMO implementation PDF and approved CTO brief |
| Homepage sequence and information architecture | `SPIMARIMMO_Dossier_Implementation_End_to_End_2026.pdf` |
| Exhibitor/visitor journey hierarchy | PDF and approved exhibitor-first decisions |
| Current functional behavior | Current repository, executed application, CMS/CRM contracts, and tests |
| House of Yellow visual and behavioral grammar | Accepted clone evidence and current `https://houseofyellow.nl/` reference |
| SPIMARIMMO brand identity | Approved SPIMAR logo, black/gold direction, authentic media, and approved copy |
| Claims and metrics | Verified business data only |

### 3.1 Non-negotiable interpretation

- The PDF controls **what appears, why it appears, and in which order**.
- House of Yellow controls **how the experience feels and behaves**.
- SPIMARIMMO controls **logo, color, voice, content, media, and business identity**.
- The current codebase controls **what functionality already exists and must be preserved**.
- House of Yellow must not override the official `01–09` homepage order.
- The current homepage order must not override the PDF.
- Existing generic UI must not silently override the accepted visual direction.

---

## 4. Repository recovery model

Previous project evidence identifies:

- `e048fdde` as the frozen visual reference snapshot;
- `3675c020` as the strongest known reconstruction base before the presentation architecture was damaged;
- the current project HEAD as the donor for later SPIMARIMMO sections and functionality;
- the generic replacement introduced after the accepted clone as unsuitable for the final presentation baseline.

These references must be verified in the repository before use. Never assume a commit exists.

### 4.1 Required branch model

```text
reference-foundation
  Purpose: verified House of Yellow presentation behavior and visual evidence

current-product-donor
  Purpose: current SPIMAR content, sections, CMS/CRM, forms, routes, and business logic

recovery/hoy-spimar-foundation
  Purpose: controlled reconstruction and final integration
```

The recovery branch should be created from `3675c020` only after verifying:

- the commit exists;
- the working tree is clean;
- repository instructions have been read;
- the current donor HEAD has been recorded;
- no uncommitted user work would be lost.

Do not reset, force checkout, delete branches, overwrite user changes, push, merge, or deploy during recovery intake.

---

## 5. Official homepage sequence

The final homepage must follow the PDF sequence exactly.

| Order | Official group | Required content | Intended outcome |
|---|---|---|---|
| `01` | **Promesse + Éditions** | Hero, exhibitor promise, primary/secondary CTA, upcoming editions and country event cards | Establish value and show immediate international opportunity |
| `02` | **Pourquoi + Méthode** | Why exhibit, objection handling, complete before/during/after method | Explain what SPIMAR does and reduce investment uncertainty |
| `03` | **Mesure + MRE** | Verified key figures, market context, reasons MRE buy or invest | Demonstrate demand and commercial potential |
| `04` | **Visibilité + Confiance** | Visibility 360, campaigns, support, trusted promoters and partners | Prove distribution capacity and credibility |
| `05` | **Cas + Voix** | Case studies, outcomes, interviews, video testimonials | Replace marketing claims with business evidence |
| `06` | **Offres + Comparaison** | Standard, Premium, Sponsor, package details and comparison | Help an exhibitor evaluate and select an offer |
| `07` | **Galerie + Preuve** | Authentic photos/videos of stands, visitors, conferences, networking and event activity | Make the experience tangible and credible |
| `08` | **Ressources + FAQ** | Brochure, guide, calendar, plans, checklist, blog/resources and exhibitor FAQ | Support evaluation and remove final objections |
| `09` | **Demande + Footer** | Become an exhibitor, meeting request, brochure action, contact and footer | Complete the B2B conversion journey |

### 5.1 Expanded section content

#### 01 — Promesse + Éditions

- Cinematic hero using authentic event media.
- Approved exhibitor-first value proposition.
- Primary CTA: `Devenir exposant`.
- Secondary CTA: `Télécharger la brochure`.
- Upcoming event cards placed high on the homepage.
- Country, city, date, venue/status, and event detail access.
- No visitor-registration CTA competing with the exhibitor CTA in the hero.

#### 02 — Pourquoi + Méthode

- Qualified clientele.
- International presence.
- Marketing distribution.
- Full exhibitor support.
- Before the event.
- During the event.
- After the event.
- Clear connection between services and exhibitor outcomes.

#### 03 — Mesure + MRE

- Verified event, visitor, exhibitor, country, lead, or satisfaction metrics.
- No placeholder metrics in accepted states.
- Reasons MRE buy: principal residence, secondary residence, return to Morocco, retirement, investment, and family transmission.
- Evidence must precede interpretation.

#### 04 — Visibilité + Confiance

- Before-event campaigns.
- During-event content and coverage.
- After-event reporting and lead delivery.
- Trusted promoters.
- Institutional, media, banking, and operational partners when verified.
- One coherent visibility interaction model; avoid unrelated nested tabs.

#### 05 — Cas + Voix

- Case-study objective.
- Actions delivered.
- Verified results.
- Authentic photography/video.
- Commercial, marketing, or executive testimonial.
- Related case-study navigation.

#### 06 — Offres + Comparaison

- Standard, Premium, and Sponsor offers.
- Surface, stand, visibility, conferences, campaigns, interviews, placement, and networking comparison.
- Clear differences and recommendation logic.
- One primary action per offer.
- Mobile comparison must remain readable without destructive horizontal overflow.

#### 07 — Galerie + Preuve

- Authentic media only.
- Stands, attendance, appointments, conferences, interviews, activations, and networking.
- Media categorized without turning the section into a generic stock gallery.
- Video poster and error fallback required.

#### 08 — Ressources + FAQ

- Brochure.
- Exhibitor guide.
- Calendar.
- Event plans.
- Checklist.
- Relevant insights and SEO resources.
- Accessible FAQ with clear answers and keyboard support.

#### 09 — Demande + Footer

- Exhibitor request form.
- Meeting request when available.
- Brochure download.
- Clear consent and privacy behavior.
- Contact details.
- Exhibitor, visitor, event, resources, press, legal, and locale navigation.
- Strong editorial ending consistent with the recovered foundation.

---

## 6. Functional-to-visual section mapping

The mapping must be based on UX purpose, not superficial visual similarity.

| PDF group | House of Yellow pattern to reinterpret | Preserve from SPIMAR | Rebuild or normalize |
|---|---|---|---|
| `01` Promesse + Éditions | Cinematic introduction plus work-index preview | Approved copy, event data, media, CTA targets | Hero composition, typography, header, event-card rhythm, motion |
| `02` Pourquoi + Méthode | Editorial statement plus staged “How we roll” sequence | Arguments and before/during/after content | Progressive narrative, hierarchy, process behavior |
| `03` Mesure + MRE | Large project metrics plus immersive editorial story | Verified metrics and market content | Evidence hierarchy, pacing, data presentation |
| `04` Visibilité + Confiance | “Beyond the Screen” media system plus trust wall | Visibility categories, partner data, logos | Tabs, media framing, transitions, trust composition |
| `05` Cas + Voix | Project-detail storytelling | Cases, results, quotes, videos | Case-study shell, outcome hierarchy, next-case navigation |
| `06` Offres + Comparaison | Structured indexed content | Package data and conversion actions | Offer selection, comparison UX, responsive presentation |
| `07` Galerie + Preuve | Media constellation and work gallery | Authentic photos and videos | Gallery choreography, filters, loading and fallback states |
| `08` Ressources + FAQ | Editorial index and staged information | Resources, downloads, FAQ content | Resource cards, taxonomy, accordion behavior |
| `09` Demande + Footer | Large Connect CTA and typographic footer | Forms, contact, legal, routes | Conversion composition, focus states, footer rhythm |

The final website must not display House of Yellow naming, proprietary copy, yellow identity, or unrelated agency content. Recover the system and quality, not the other company’s identity.

---

## 7. Design-system architecture

### 7.1 Layer 1 — Foundation

- Color tokens.
- Typography families and scales.
- Spacing scale.
- Container widths.
- Page grid.
- Breakpoints.
- Media aspect ratios.
- Z-index layers.
- Motion duration and easing.
- Focus, selection, and reduced-motion behavior.

### 7.2 Layer 2 — Visual primitives

- `PageShell`
- `SectionContainer`
- `SectionIndex`
- `SectionHeading`
- `Eyebrow`
- `DisplayText`
- `BodyText`
- `PrimaryAction`
- `SecondaryAction`
- `TextLink`
- `MediaFrame`
- `VideoFrame`
- `ImageFrame`
- `Divider`
- `LogoMark`
- `GrainOverlay`
- `Reveal`

### 7.3 Layer 3 — UX patterns

- `EditorialSplit`
- `MediaStage`
- `WorkIndex`
- `FilterOverlay`
- `GridListSwitch`
- `EvidenceMetrics`
- `ProcessSequence`
- `TabNarrative`
- `CaseStudyTeaser`
- `ComparisonMatrix`
- `MediaGallery`
- `ResourceIndex`
- `FAQAccordion`
- `ConversionPanel`
- `EditorialFooter`

### 7.4 Layer 4 — SPIMAR business modules

- `HeroPromise`
- `UpcomingEditions`
- `WhyExhibit`
- `SpimarMethod`
- `ImpactMetrics`
- `MREMarket`
- `Visibility360`
- `TrustedPartners`
- `CaseStudies`
- `VideoVoices`
- `ExhibitorOffers`
- `EventGallery`
- `Resources`
- `ExhibitorFAQ`
- `ExhibitorRequest`
- `SiteFooter`

Business modules should compose shared primitives and patterns. They must not introduce arbitrary colors, button families, container widths, typography scales, radii, shadows, or animations.

---

## 8. Visual direction

Recover the following qualities from the accepted foundation:

- strong editorial hierarchy;
- large, deliberate typography;
- asymmetrical but controlled composition;
- authentic media as a structural element;
- cinematic transitions;
- disciplined spacing and negative space;
- repeated section-index language;
- clear grid alignment;
- motion that supports meaning;
- high-impact but restrained conversion moments;
- meaningful desktop and mobile compositions.

Apply them through the SPIMAR identity:

- black and warm near-black surfaces;
- warm off-white text and backgrounds where appropriate;
- controlled SPIMAR gold accents;
- approved SPIMAR logo treatment;
- authentic event imagery and video;
- modern, sophisticated, non-generic typography;
- minimal, intentional radius usage;
- no generic SaaS dashboard card language on the public marketing site.

### 8.1 Visual anti-patterns

Reject:

- random gradients;
- excessive gold glow;
- unrelated card styles between sections;
- arbitrary pill-shaped controls;
- multiple button languages;
- excessive rounded containers;
- stock-photo filler;
- decorative motion without UX purpose;
- identical card grids for every type of content;
- condensed text that harms readability;
- desktop layouts simply stacked on mobile;
- visual novelty that weakens the exhibitor journey.

---

## 9. UX requirements

### 9.1 Audience priority

The homepage is primarily a B2B sales experience for:

- real-estate developers;
- commercial directors;
- marketing directors;
- executive decision-makers;
- exhibitor teams evaluating international events.

The visitor journey remains available but must not compete with the exhibitor funnel.

### 9.2 CTA taxonomy

Use distinct actions with distinct funnels:

| Action | Purpose | Expected destination |
|---|---|---|
| `Devenir exposant` | Commercial lead | Exhibitor request or meeting flow |
| `Télécharger la brochure` | Evaluation support | Gated or direct validated brochure flow |
| `Voir les éditions` | Event exploration | Editions index or event anchors |
| `Découvrir une étude de cas` | Evidence | Case-study detail |
| `S’inscrire comme visiteur` | Visitor journey | Separate visitor registration flow |

Do not use the same form for unrelated intentions without preserving lead-source context.

### 9.3 Content rules

- Evidence before claims.
- No invented metrics.
- No duplicated arguments across multiple groups.
- No important content hidden behind unclear interactions.
- No nested tabs unless usability evidence requires them.
- One section must have one primary communication objective.
- Every CTA must have a working destination, owner, success state, and analytics event.

---

## 10. Section audit classification

Every current section must receive one status before implementation.

| Status | Meaning | Action |
|---|---|---|
| `A — Preserve` | UX and implementation are already strong | Keep and move into official order; normalize only shared tokens |
| `B — Reskin` | Structure and behavior work | Recompose styling with recovered primitives |
| `C — Recompose` | Content/functionality work but hierarchy or UX is weak | Preserve data and logic; rebuild presentation and interaction |
| `D — Consolidate` | Repetitive or competing content exists | Merge into the correct `01–09` group without losing approved content |
| `E — Repair` | Broken behavior, responsive issue, media failure, or accessibility defect | Repair before visual acceptance |

### 10.1 Required inventory fields

```text
Route
Section/component name
DOM anchor
Business purpose
Primary audience
Current position
Required PDF group 01–09
Data source
CMS dependency
CRM/form dependency
Analytics dependency
Locale dependency
Media dependency
Current UX issue
Current visual issue
Classification A–E
Target design-system pattern
Desktop evidence
Mobile evidence
Acceptance criteria
Migration risk
```

---

## 11. Safe reordering strategy

Reordering must happen at the page-composition level rather than by copying and rewriting large blocks.

The target composition is conceptually:

```ts
const HOME_SECTION_ORDER = [
  "promise-editions",
  "why-method",
  "metrics-mre",
  "visibility-trust",
  "cases-voices",
  "offers-comparison",
  "gallery-proof",
  "resources-faq",
  "request-footer",
] as const;
```

The exact code must follow the repository’s existing architecture. Do not add a runtime section registry when static composition is simpler and safer.

During reordering preserve:

- CMS document IDs and query contracts;
- CRM endpoint and payload contracts;
- form names, validation, success, error, loading, and retry behavior;
- analytics event names and lead-source attribution;
- navigation and anchor IDs;
- locale keys for French, English, and Arabic;
- RTL behavior;
- structured data and metadata;
- image/video references and poster fallbacks;
- accessibility relationships;
- responsive behavior;
- route contracts and deep links.

---

## 12. Execution phases

### Phase 0 — Read-only engineering intake

**Goal:** establish facts before editing.

Actions:

1. Read repository instructions, documentation, and package scripts.
2. Record current branch, current HEAD, worktree state, remotes, package manager, runtime, and build commands.
3. Verify `3675c020` and `e048fdde`.
4. Identify the actual deployment source and build identity where possible.
5. Inventory routes, sections, shared components, styles, CMS, CRM, forms, localization, media, tests, and configuration.
6. Capture current homepage screenshots at required viewports.
7. Capture reference evidence from the accepted clone/current House of Yellow behavior.
8. Produce the recovery documents before edits.

Required outputs:

```text
docs/recovery/00-BASELINE.md
docs/recovery/01-ROUTE-AND-SECTION-INVENTORY.md
docs/recovery/02-HOMEPAGE-MAPPING-01-09.md
docs/recovery/03-DESIGN-SYSTEM-DRIFT.md
docs/recovery/04-RECOVERY-BACKLOG.md
docs/recovery/05-ACCEPTANCE-REGISTER.md
```

### Phase 1 — Foundation reconstruction

1. Create the recovery branch from the verified reconstruction base.
2. Restore or reconstruct the global typography, grid, containers, media rules, section indexes, controls, motion, grain, navigation, and footer foundation.
3. Remove only presentation duplication proven unnecessary.
4. Do not port business sections yet unless required to validate a primitive.
5. Validate the foundation in isolation and through representative slices.

### Phase 2 — Global shell

1. Header and navigation.
2. Locale behavior.
3. Page background and global overlays.
4. Scroll and transition infrastructure.
5. Global focus and reduced-motion behavior.
6. Footer framework.

### Phase 3 — Homepage migration in official order

Migrate one group at a time:

```text
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09
```

For each group:

```text
Audit
→ map donor functionality
→ compose with recovered patterns
→ preserve integration contracts
→ desktop QA
→ tablet QA
→ mobile QA
→ accessibility QA
→ functional QA
→ visual acceptance
→ local commit
```

Do not continue past a failed blocking gate.

### Phase 4 — Secondary routes

- Edition/country pages.
- Case-study pages.
- Resource/blog pages.
- Exhibitor conversion routes.
- Visitor routes.
- About/contact/legal pages.
- CMS preview and error states.

### Phase 5 — Final integration and release candidate

1. Full route regression.
2. Cross-locale verification.
3. Cross-browser checks.
4. Visual regression.
5. Accessibility audit.
6. Performance audit.
7. Media resilience audit.
8. Forms and CRM validation.
9. SEO and metadata validation.
10. Produce a release-candidate report.

No merge, push, or production deployment without explicit owner approval.

---

## 13. Implementation order by risk

| Priority | Work | Reason |
|---|---|---|
| `P0` | Repository identity, baseline, broken media, routing, forms, and build health | Visual work is unreliable without a healthy baseline |
| `P1` | Tokens, grid, typography, header, navigation, motion, footer | All sections depend on the global foundation |
| `P2` | `01` Promesse + Éditions | Highest-impact conversion and event-discovery area |
| `P3` | `02–04` Why, method, measures, MRE, visibility, trust | Core commercial persuasion sequence |
| `P4` | `05–07` Cases, voices, offers, comparison, gallery | Evidence and evaluation sequence |
| `P5` | `08–09` Resources, FAQ, request, footer | Objection handling and conversion completion |
| `P6` | Secondary routes and polish | Complete system consistency after homepage acceptance |

---

## 14. Acceptance gates

### 14.1 Functional gate

- Routes resolve correctly.
- Navigation and anchors work.
- Forms validate and submit correctly.
- CRM attribution remains correct.
- CMS content renders correctly.
- Filters, tabs, accordions, galleries, and comparisons behave correctly.
- Loading, empty, error, success, and retry states exist where required.

### 14.2 Visual gate

- One coherent design language across all `01–09` groups.
- Correct typography hierarchy.
- Consistent section indexes.
- Shared container and alignment logic.
- Authentic media presentation.
- No generic or isolated section styling.
- No unintended overflow, clipping, collision, or layout shift.
- Approved desktop and mobile screenshots.

### 14.3 Responsive gate

Minimum evidence:

- desktop `1920 × 1080`;
- desktop `1440 × 900`;
- tablet `1024 × 1366`;
- mobile `390 × 844`;
- narrow mobile `360 × 800`.

Mobile must be intentionally composed. It must not be a mechanically stacked desktop layout.

### 14.4 Accessibility gate

- Semantic landmarks and heading order.
- Keyboard operation.
- Visible focus states.
- Logical tab order.
- Contrast compliance.
- Form labels and errors.
- Dialog focus management.
- Accessible tabs and accordions.
- Reduced-motion behavior.
- Meaningful alt text or correct decorative treatment.

### 14.5 Motion gate

- Motion supports hierarchy or interaction.
- No scroll hijacking that blocks content.
- No duplicated animation systems.
- No unnecessary continuous motion.
- Reduced-motion mode remains complete and usable.
- Transitions remain smooth on realistic mobile hardware.

### 14.6 Performance gate

Use the PDF budgets as release criteria:

| Metric | Maximum target |
|---|---:|
| LCP p75 | `2.5 s` |
| INP p75 | `200 ms` |
| CLS | `0.10` |
| Homepage JavaScript gzip | `170 KB` |
| Initial mobile transfer | `1.5 MB` |

Media and motion are not exempt from mobile budgets.

### 14.7 Content and evidence gate

- No invented facts or metrics.
- No unapproved placeholder copy in release candidates.
- No duplicated sections.
- Event cards remain prominent.
- Exhibitor journey remains primary.
- Visitor journey remains separate and accessible.
- French, English, and Arabic content does not break composition.

---

## 15. Definition of done

The recovery is complete only when:

1. The homepage follows official sections `01–09` exactly.
2. The House of Yellow presentation grammar is recognizable in quality, rhythm, media, typography, and interaction without importing House of Yellow branding.
3. SPIMAR identity is coherent across every route.
4. Existing business functionality is preserved or deliberately improved with evidence.
5. Every current section has a recorded disposition: preserve, reskin, recompose, consolidate, repair, or remove with approval.
6. Desktop, tablet, and mobile evidence has been accepted.
7. Forms, CMS, CRM, analytics, localization, SEO, media, and accessibility pass validation.
8. Performance budgets pass or every exception is documented and approved.
9. No production deployment has occurred without owner approval.

---

# Codex Master Prompt

Copy the complete prompt below into Codex from the project workspace.

```text
You are the lead senior frontend engineer, design-systems architect, UX engineer,
motion engineer, accessibility specialist, and technical recovery owner for the
SPIMARIMMO website.

WORKSPACE
C:\work\spimar

PRIMARY SPECIFICATION
C:\work\spimar\docs\SPIMARIMMO_Dossier_Implementation_End_to_End_2026.pdf

REFERENCE WEBSITE
https://houseofyellow.nl/

MISSION
Recover the accepted House of Yellow presentation foundation in the current
SPIMARIMMO website while preserving the completed SPIMARIMMO business sections,
CMS/CRM integrations, forms, routes, localization, content, and validated
behavior. Reorder the homepage according to the exact 01–09 sequence defined in
the PDF. Repair inconsistent UX, weak implementation, generic styling, broken
responsive behavior, media failures, accessibility defects, and design-system
drift.

This is a controlled presentation-system recovery, not a new website, not a
generic redesign, and not a superficial CSS reskin.

CORE OPERATING MODEL
- Current implementation = functional donor.
- Accepted House of Yellow clone = presentation foundation.
- SPIMARIMMO PDF = authority for information architecture, content, hierarchy,
  homepage sequence, and business journeys.
- SPIMARIMMO identity = final logo, black/gold direction, copy, and authentic
  media.

KNOWN RECOVERY REFERENCES — VERIFY BEFORE USING
- e048fdde: frozen visual reference snapshot.
- 3675c020: strongest known reconstruction base before presentation regression.
- Current HEAD: donor for later SPIMAR sections and functional implementation.

Never assume these commits exist. Verify them with read-only Git commands.
If either reference is missing or represents something different, do not guess.
Document the evidence and propose the safest alternative.

SOURCE AUTHORITY
1. Repository reality and executed behavior determine current implementation.
2. The PDF controls business purpose, IA, section order, and journeys.
3. Accepted clone/current House of Yellow evidence controls visual and motion
   grammar.
4. Approved SPIMAR assets and copy control final identity.
5. Only verified data may support claims or metrics.

OFFICIAL HOMEPAGE ORDER — NON-NEGOTIABLE
01 Promesse + Éditions
02 Pourquoi + Méthode
03 Mesure + MRE
04 Visibilité + Confiance
05 Cas + Voix
06 Offres + Comparaison
07 Galerie + Preuve
08 Ressources + FAQ
09 Demande + Footer

CONTENT INTENT BY GROUP
01: cinematic exhibitor-first hero, Devenir exposant, Télécharger la brochure,
    and prominent upcoming country/event editions.
02: reasons to exhibit plus the before/during/after SPIMAR method.
03: verified impact measures plus the MRE market and purchasing motivations.
04: visibility 360 plus trusted promoters, partners, and credibility evidence.
05: business case studies plus authentic executive/commercial/marketing voices.
06: Standard, Premium, and Sponsor offers plus a clear comparison experience.
07: authentic event gallery plus tangible proof of stands, attendance,
    conferences, appointments, interviews, and networking.
08: brochure, guide, calendar, plans, checklist, resources/blog, and exhibitor FAQ.
09: exhibitor request, meeting/brochure actions, contact, legal, and editorial footer.

AUDIENCE AND JOURNEY RULES
- The homepage is exhibitor-first and acts as a B2B commercial experience.
- Upcoming event/country cards must remain high on the homepage.
- The visitor journey must be separate but accessible.
- Evidence must appear before promotional claims.
- Devenir exposant, Télécharger la brochure, and S’inscrire comme visiteur are
  different funnels and must preserve distinct intent and analytics attribution.
- Do not invent metrics, testimonials, partners, dates, or outcomes.

VISUAL DIRECTION
Recover the accepted foundation’s:
- editorial typography;
- controlled asymmetric composition;
- disciplined grid and negative space;
- authentic media-led storytelling;
- section indexing;
- layered cinematic presentation;
- purposeful motion;
- strong project/index patterns;
- polished desktop and intentionally authored mobile layouts.

Apply these through SPIMAR identity:
- black and warm near-black;
- warm off-white;
- controlled SPIMAR gold accents;
- approved SPIMAR logo;
- authentic SPIMAR media;
- modern sophisticated typography;
- restrained radius and effects.

Do not retain House of Yellow names, copy, logos, yellow identity, contact data,
or unrelated agency content. Recover the design-system grammar and quality, not
the other brand’s identity.

REJECT
- generic Tailwind/shadcn marketing-page composition;
- random gradients or gold glow;
- one-off component styles;
- arbitrary pills, radii, colors, shadows, or animations;
- identical card grids for unrelated content;
- stock placeholders in accepted UI;
- desktop layouts mechanically stacked on mobile;
- decorative motion without UX purpose;
- nested tabs that hide important content;
- wholesale merging of generic presentation commits;
- destructive Git operations;
- production deployment during this mission.

SAFETY RULES
1. Begin read-only.
2. Read AGENTS.md, repository instructions, docs, package scripts, and relevant
   local skills before editing.
3. Preserve unrelated and uncommitted user work.
4. If the worktree is dirty, do not stash, reset, clean, or overwrite it. Stop
   mutation, document the conflicting paths, and report the blocker.
5. Do not use git reset --hard, git clean, force push, branch deletion, or
   destructive checkout.
6. Record the current branch and donor HEAD before creating a recovery branch.
7. Do not merge, push, open a PR, or deploy unless explicitly requested later.
8. Use the package manager identified by the lockfile.
9. Use existing project dependencies and patterns unless evidence proves a new
   dependency is necessary. Do not install packages without documenting why.

PHASE 0 — READ-ONLY INTAKE
Perform and document:
- repository root and instructions;
- git status, branch, HEAD, remotes, and recent history;
- verification of e048fdde and 3675c020;
- package manager, framework, runtime, scripts, and build configuration;
- routes and layouts;
- homepage section/component tree;
- design tokens and global styles;
- animation libraries and motion primitives;
- CMS schemas, queries, and preview behavior;
- CRM endpoints, form payloads, validation, and lead-source attribution;
- locale structure for FR/EN/AR and RTL;
- media inventory, remote/local dependencies, poster/error fallbacks;
- tests, Storybook/design lab if present, Playwright, linting, type checks;
- current production/staging deployment identity where evidence is available.

Capture fresh evidence of the current homepage and reference behavior at:
- 1920x1080
- 1440x900
- 1024x1366
- 390x844
- 360x800

Do not hide difficult sections with broad screenshot masks.

CREATE THESE INTAKE DOCUMENTS BEFORE IMPLEMENTATION
docs/recovery/00-BASELINE.md
docs/recovery/01-ROUTE-AND-SECTION-INVENTORY.md
docs/recovery/02-HOMEPAGE-MAPPING-01-09.md
docs/recovery/03-DESIGN-SYSTEM-DRIFT.md
docs/recovery/04-RECOVERY-BACKLOG.md
docs/recovery/05-ACCEPTANCE-REGISTER.md

SECTION INVENTORY FIELDS
- route;
- component and anchor;
- business purpose and primary audience;
- current order and required 01–09 group;
- data/CMS/CRM/form/analytics/locale/media dependencies;
- current UX and visual defects;
- target design-system pattern;
- desktop/mobile evidence;
- migration risk;
- acceptance criteria;
- classification.

CLASSIFY EVERY SECTION
A — Preserve: implementation and UX are strong.
B — Reskin: structure works; migrate to recovered primitives.
C — Recompose: preserve content/data/logic; rebuild hierarchy and interaction.
D — Consolidate: merge duplicated or competing content into its correct group.
E — Repair: fix broken behavior, responsive layout, media, or accessibility first.

Do not delete or merge approved content without recording its destination and
reason. Every current section must have an explicit disposition.

RECOVERY BRANCH
After intake, and only with a clean worktree and verified commit:
- record CURRENT_DONOR_HEAD in 00-BASELINE.md;
- create recovery/hoy-spimar-foundation from 3675c020;
- use the current donor HEAD as a source of business functionality;
- port functionality selectively and dependency-aware;
- do not merge current page presentation wholesale;
- do not rewrite functioning CMS/CRM/form logic merely for stylistic preference.

DESIGN-SYSTEM LAYERS
Layer 1 Foundation:
color, typography, spacing, containers, grid, breakpoints, media ratios, z-index,
motion duration/easing, focus and reduced motion.

Layer 2 Primitives:
PageShell, SectionContainer, SectionIndex, SectionHeading, typography primitives,
actions, links, MediaFrame, VideoFrame, Divider, GrainOverlay, Reveal.

Layer 3 Patterns:
EditorialSplit, MediaStage, WorkIndex, FilterOverlay, GridListSwitch,
EvidenceMetrics, ProcessSequence, TabNarrative, CaseStudyTeaser,
ComparisonMatrix, MediaGallery, ResourceIndex, FAQAccordion, ConversionPanel,
EditorialFooter.

Layer 4 SPIMAR modules:
HeroPromise, UpcomingEditions, WhyExhibit, SpimarMethod, ImpactMetrics, MREMarket,
Visibility360, TrustedPartners, CaseStudies, VideoVoices, ExhibitorOffers,
EventGallery, Resources, ExhibitorFAQ, ExhibitorRequest, SiteFooter.

Reuse existing naming when it is already clear. Do not rename the entire codebase
for cosmetic consistency.

SAFE REORDERING
Reorder at the homepage composition level, preserving component boundaries and
integration contracts. The conceptual order is:

const HOME_SECTION_ORDER = [
  "promise-editions",
  "why-method",
  "metrics-mre",
  "visibility-trust",
  "cases-voices",
  "offers-comparison",
  "gallery-proof",
  "resources-faq",
  "request-footer",
] as const;

Follow the repository architecture; do not add a runtime registry if static
composition is simpler.

PRESERVE DURING PORTING
- CMS IDs, schemas, queries, preview, and caching contracts;
- CRM endpoints and payload shape;
- form names, validation, errors, success, loading, and retry behavior;
- analytics events and lead-source attribution;
- anchors, navigation, routes, and deep links;
- FR/EN/AR locale keys and RTL;
- metadata and structured data;
- media paths, aspect rules, posters, and failure fallbacks;
- accessibility semantics and relationships;
- responsive behavior that already passes.

IMPLEMENTATION ORDER
1. Foundation tokens, typography, grid, media, and motion.
2. Global shell: header, menu, locale behavior, page transitions, focus behavior,
   footer framework.
3. Homepage groups in exact order: 01, 02, 03, 04, 05, 06, 07, 08, 09.
4. Secondary routes.
5. Full integration and release-candidate validation.

FOR EACH HOMEPAGE GROUP
Audit → map donor behavior → implement with recovered patterns → validate
integrations → desktop QA → tablet QA → mobile QA → accessibility QA →
functional QA → visual-regression evidence → local commit.

Do not proceed through a blocking failure.

VALIDATION
Run the repository’s actual commands for:
- formatting;
- linting;
- type checking;
- unit/integration tests;
- production build;
- Playwright/browser tests;
- visual regression;
- accessibility checks;
- route and form smoke tests.

Validate loading, empty, error, success, retry, reduced-motion, keyboard, RTL,
long-content, missing-media, and narrow-mobile states.

PERFORMANCE RELEASE BUDGETS
- LCP p75 <= 2.5 seconds
- INP p75 <= 200 ms
- CLS <= 0.10
- homepage JS gzip <= 170 KB
- initial mobile transfer <= 1.5 MB

Media and motion are not exempt.

REPORTING FORMAT
After Phase 0, report:
1. exact repository and donor identity;
2. whether e048fdde and 3675c020 are valid and what they contain;
3. build/test health;
4. route and section inventory summary;
5. mapping of every current section into 01–09;
6. A–E classification totals;
7. critical UX/design-system defects;
8. CMS/CRM/form/media risks;
9. proposed file-level implementation sequence;
10. blockers and decisions requiring owner input.

During implementation, keep docs/recovery/05-ACCEPTANCE-REGISTER.md current.
Commit locally in small, intentional phases with clear messages. Do not push.

FINAL HANDOFF
Provide:
- summary of preserved, reworked, consolidated, repaired, and removed items;
- exact files changed;
- commits created;
- commands run and results;
- desktop/mobile evidence paths;
- performance and accessibility results;
- remaining risks;
- explicit statement that no push, merge, or deployment occurred.

START NOW
Begin with Phase 0 read-only intake. Do not edit application code until the
baseline, section inventory, 01–09 mapping, design-system drift report, recovery
backlog, and acceptance register have been created from evidence.
```

---

## 16. Recommended first Codex session outcome

The first Codex session should stop after Phase 0 if any of the following is true:

- dirty working tree overlaps recovery files;
- `3675c020` or `e048fdde` cannot be verified;
- the deployed version cannot be tied to a commit;
- the current donor branch is ambiguous;
- the PDF cannot be read;
- CMS/CRM secrets or environments required for safe validation are unavailable;
- existing functionality cannot be mapped without a product decision.

Otherwise, Codex may create the recovery branch and start Phase 1 while continuing to respect the no-push/no-merge/no-deploy boundary.

---

## 17. Owner review checklist

Before approving implementation, confirm:

- [ ] Current donor HEAD is recorded.
- [ ] Visual reference and reconstruction commits are verified.
- [ ] Every homepage section is mapped to `01–09`.
- [ ] Event editions appear in group `01`.
- [ ] Exhibitor journey remains primary.
- [ ] Visitor journey remains separate.
- [ ] No important functionality is scheduled for deletion.
- [ ] Duplicated sections have a documented consolidation destination.
- [ ] Design-system primitives and patterns are defined before section migration.
- [ ] Mobile evidence is required for every group.
- [ ] FR/EN/AR and RTL are included.
- [ ] Forms, CRM, analytics, CMS, and media contracts are protected.
- [ ] Performance budgets are treated as acceptance criteria.
- [ ] Production remains unchanged until explicit approval.

