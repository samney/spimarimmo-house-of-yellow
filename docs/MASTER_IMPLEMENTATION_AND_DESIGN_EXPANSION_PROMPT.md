# SPIMARIMMO — MASTER IMPLEMENTATION AND DESIGN-EXPANSION PROMPT

You are acting as the lead product engineer, UX architect, design-system guardian, motion designer and technical implementation owner for the SPIMARIMMO website.

You are working inside an existing repository that already contains a carefully implemented and accepted foundation based on the visual system, interaction principles and component language of House of Yellow.

This is not a new website project.

This is not permission to redesign the existing website.

Your mission is to expand the current implementation into the complete SPIMARIMMO B2B platform described by the project specification PDF, while preserving and extending the accepted design-system foundation.

---

# 1. Primary mission

Transform the existing website foundation into a complete, polished and conversion-oriented SPIMARIMMO website that:

* Targets Moroccan real-estate developers and exhibitors first.
* Presents SPIMARIMMO as the reference partner for international real-estate exhibitions.
* Makes countries, cities and upcoming salon editions tangible.
* Connects every commercial promise to visible proof.
* Explains the exhibitor journey before, during and after each event.
* Supports country and salon detail pages.
* Supports the current CMS, CRM and localization architecture.
* Remains visually and behaviorally consistent with the accepted House of Yellow-inspired foundation.
* Introduces new section explorations only by extending existing primitives.
* Never becomes a generic real-estate, SaaS, conference or AI-generated template.

The expected result is:

> A complete SPIMARIMMO B2B platform built from the existing House of Yellow design DNA: the same editorial confidence, typography, spacing, media treatment, interaction quality and motion language, expanded with SPIMARIMMO’s content, events, proof system, exhibitor journey, CMS data and conversion flows.

---

# 2. Do not start from scratch

The current repository is the primary visual and technical source of truth.

Before changing anything:

1. Inspect the entire repository.
2. Read all existing project documentation.
3. Inspect the current Git branch and working-tree state.
4. Identify all existing accepted components and primitives.
5. Identify the current CMS, CRM, localization and content structures.
6. Run the existing validation suite.
7. Start the current application.
8. Inspect the implementation at desktop and mobile sizes.
9. Capture baseline screenshots before making material visual changes.
10. Identify which work is already complete, partial, experimental or obsolete.

Do not delete, replace or broadly refactor accepted implementation merely because another architecture appears cleaner.

Do not overwrite unrelated user changes.

Do not use destructive Git commands.

Do not reset the repository.

Do not push, merge or open a pull request unless explicitly instructed.

---

# 3. Required inputs

Locate and read the complete specification file:

`SPIMARIMMO_Specifications_Strategie_UX_Contenus.pdf`

Search the repository and available workspace if its exact path differs.

Also inspect:

* Existing Markdown documentation
* Design-system documentation
* Implementation reports
* Existing screenshots and visual evidence
* Existing content files
* Current CMS schema
* Current CRM integration
* Existing localization files
* Existing event and project data
* Current deployed implementation if its URL is documented
* Existing visual-regression or browser tests

If the PDF is missing or unreadable, stop and report the exact blocker. Do not invent its contents.

---

# 4. Source-of-truth hierarchy

Use this authority order when sources conflict.

## 4.1 Current accepted repository implementation

Controls:

* Design language
* Typography
* Grid
* Containers
* Spacing
* Colours
* Borders
* Radius system
* Header and navigation
* Media treatment
* Motion language
* Cursor behavior
* Buttons
* Pills
* Responsive behavior
* Reusable primitives
* Loading and fallback behavior

## 4.2 SPIMARIMMO PDF specification

Controls:

* Business objective
* Audience
* Information architecture
* Page structure
* Section order
* Required content
* Required data
* Conversion hierarchy
* Exhibitor journey
* Salon lifecycle
* Proof requirements
* Page relationships
* CMS content requirements

## 4.3 Approved SPIMARIMMO explorations

Controls:

* How an existing primitive may be expanded
* Section-specific hierarchy
* Landmark and destination visual language
* Black, ivory and gold brand adaptation
* B2B conversion treatment

Explorations are directional references, not permission to replace the existing foundation.

## 4.4 CMS and verified business data

Controls:

* Dates
* Venues
* Capacity
* Visitor counts
* Event status
* Countries
* Cities
* Partners
* Exhibitors
* Brochures
* Media
* Case-study results
* Contact information

Never invent business data to complete a visual design.

---

# 5. Core preservation contract

The existing foundation must remain visibly recognizable after expansion.

Preserve:

* Existing font families and font-loading strategy
* Existing type scale unless a documented extension is required
* Existing container widths
* Existing grid behavior
* Existing spacing rhythm
* Existing card proportions
* Existing project-media behavior
* Existing header architecture
* Existing logo position
* Existing navigation behavior
* Existing button and pill primitives
* Existing page transitions
* Existing scroll behavior
* Existing motion timing and easing
* Existing cursor interactions
* Existing image and video fallbacks
* Existing responsive conventions
* Existing accessibility behavior
* Existing reduced-motion support

A new section must reuse or extend existing primitives before creating a new component family.

Do not create a parallel design system.

Do not introduce a new visual language for each section.

Do not add new fonts.

Do not add new arbitrary colours.

Do not add arbitrary spacing, shadows or border radii when tokens already exist.

Do not replace accepted bespoke components with generic component-library equivalents.

Do not install a new UI library unless an objective technical requirement cannot be met with the current stack.

---

# 6. Anti-generic and anti-slop constraints

Reject any implementation that resembles a generic:

* SaaS landing page
* Conference template
* Real-estate WordPress template
* Shadcn dashboard
* AI-generated card grid
* Corporate brochure site
* Tourism carousel

Explicitly avoid:

* Repetitive icon-plus-heading-plus-paragraph cards
* Excessive floating white cards
* Random gradients
* Glassmorphism
* Neon colours
* Generic blue or green themes
* Decorative charts without meaningful data
* Fake statistics
* Fake partner logos
* Fake testimonials
* Invented dates
* Invented venues
* Invented visitor numbers
* Generic stock photography
* Inconsistent corner radii
* Random one-off animation effects
* Large sections disconnected from the established page rhythm
* Rebuilding the header for each page
* Hardcoded content that belongs in the CMS
* Desktop-only compositions
* Hover-only access to essential information
* Placeholder text visible in production

Every new section must be traceable to at least one accepted existing primitive.

If a proposed section could be copied unchanged into any unrelated expo website, it is too generic and must be redesigned within the established foundation.

---

# 7. B2B content and conversion contract

The primary audience is:

* Moroccan real-estate developers
* Commercial directors
* Marketing directors
* Project owners
* Potential exhibitors
* Sponsors and strategic partners

The primary business question is:

> Why should a Moroccan real-estate developer invest tens of thousands of dirhams to exhibit with SPIMARIMMO?

Every major section must contribute to answering that question.

Primary conversion:

`Devenir exposant`

Secondary conversion:

`Télécharger la brochure`

Visitor conversion remains available but visually subordinate and clearly separated.

The approved core promise is:

`Le partenaire de référence des promoteurs immobiliers marocains à l’international`

Approved supporting message:

`SPIMARIMMO organise des salons dédiés aux MRE et aux investisseurs internationaux, pour rencontrer une clientèle qualifiée prête à concrétiser son projet.`

Preserve the currently accepted hero composition. Adjust content and conversion hierarchy without replacing the visual foundation.

---

# 8. Required homepage narrative

Use the PDF as the final authority, but the expected top-down homepage progression is:

1. Hero B2B
2. Salons par pays
3. Bande de preuves
4. Pourquoi exposer ?
5. Notre méthode
6. Pourquoi les MRE achètent au Maroc
7. Visibilité 360
8. Promoteurs de confiance
9. Études de cas
10. Témoignages vidéo
11. Offres exposants
12. Galerie
13. Ressources et blog
14. FAQ et contact

The commercial progression is:

`PROMESSE → DESTINATIONS → PREUVE → MÉTHODE → MARCHÉ → ROI → CONVERSION`

Do not implement the homepage as fourteen unrelated content blocks.

Transitions between sections must preserve a continuous editorial narrative.

---

# 9. Mandatory PDF implementation matrix

Before major implementation, create:

`docs/implementation/SPIMARIMMO-PDF-IMPLEMENTATION-MATRIX.md`

For every section, record:

| Field               | Requirement                                     |
| ------------------- | ----------------------------------------------- |
| Section             | PDF section name                                |
| Business question   | What objection it answers                       |
| Primary audience    | Exhibitor, visitor or both                      |
| Promise             | Main message                                    |
| Required proof      | Data, media, case study or testimonial          |
| Existing primitive  | Current component being reused                  |
| Required extension  | New behavior or content                         |
| CMS data            | Fields and relationships                        |
| Primary CTA         | Expected action                                 |
| Secondary CTA       | Alternative action                              |
| States              | Loading, missing data, upcoming, live, archived |
| Desktop behavior    | Composition and interaction                     |
| Mobile behavior     | Responsive transformation                       |
| Accessibility       | Keyboard, semantics and reduced motion          |
| Acceptance criteria | Objective completion rules                      |

This file must describe the implementation, not propose a new design system.

---

# 10. Existing primitive inventory

Create:

`docs/implementation/SPIMARIMMO-FOUNDATION-CONTRACT.md`

Document:

* Existing typography tokens
* Colour tokens
* Spacing tokens
* Layout and container primitives
* Buttons
* Pills
* Links
* Media frames
* Project cards
* Decorative devices
* Motion utilities
* Scroll utilities
* Navigation
* Header
* Footer
* Forms
* Video behavior
* Image fallbacks
* Mobile adaptations
* Accessibility utilities

For each primitive, classify it as:

* Preserve unchanged
* Extend carefully
* Deprecated
* Experimental
* Missing

Do not stop after writing documentation. Continue directly into implementation after the baseline is understood.

---

# 11. Section-to-primitive mapping

Create:

`docs/implementation/SPIMARIMMO-SECTION-MAPPING.md`

Use the following direction unless repository evidence or the PDF requires a more accurate mapping.

## Hero B2B

Reuse the existing hero composition, media behavior, header relationship and motion choreography.

Extend:

* Approved B2B copy
* Exhibitor-first CTA hierarchy
* Brochure action
* Trust signal
* Poster fallback
* Verified content source

Do not redesign the hero from scratch.

## Salons par pays

This section must directly extend the existing House of Yellow-inspired “The works” project system.

Preserve:

* Editorial introduction
* Section index
* Decorative outlined device
* Three-card rhythm
* Existing media proportions
* Category pills
* Project titles below media
* Hover media behavior
* Existing bottom hover-action treatment
* Mobile project behavior

Adapt:

* Project → salon edition
* Category → country and event status
* Project title → city and country
* Project metadata → date, venue, status and audience
* “Take a look” → “Découvrir le salon”
* Supporting conversion → “Devenir exposant”
* Project decorative treatment → destination landmark line art

The event entity is a city or edition, not only a country.

A country may contain multiple events, such as Montréal and Laval.

Country navigation may filter or group editions, but each card represents a specific salon edition.

Required event states:

* Reservations open
* Upcoming
* In progress
* Completed
* Archived

Unknown data must be hidden or represented through an honest state such as:

* Date bientôt annoncée
* Ouverture prochaine
* Résultats en cours de validation

Never display invented values.

## Proof strip

Reuse existing counter, number, horizontal-band or scroll-linked metric primitives.

Every number requires:

* Value
* Label
* Period
* Source
* Verification state

Hide unverified metrics in production.

## Pourquoi exposer ?

Reuse an existing editorial card or content-sequence primitive.

Present the four benefit pillars:

* Clientèle qualifiée
* Présence internationale
* Campagnes de communication
* Accompagnement complet

Every benefit must connect to proof or method.

## Notre méthode

Reuse the existing narrative or “How we roll” system.

Present:

* Before the salon
* During the salon
* After the salon

Use motion to reveal progression, not decorative effects.

## Compréhension MRE

Create an editorial, sourced market-insight composition using existing typography and layout primitives.

Statistics require:

* Source
* Date
* Geography
* Context

No unsourced number may appear.

## Visibilité 360

Use the existing media and process language.

Show how communication, acquisition, qualification and follow-up work together.

## Promoteurs de confiance

Reuse existing logo, client or partner primitives.

Logos must be CMS-managed and must include usage rights or approval state if the CMS supports it.

## Études de cas

Extend the project-card and project-detail architecture.

Required case-study structure:

* Initial objective
* Context
* SPIMARIMMO action
* Audience or leads
* Commercial result
* Testimonial
* Media
* Related salon

Do not invent ROI.

## Testimonials and gallery

Reuse cinematic image and video behavior.

Include poster fallbacks, accessible controls and reduced-motion behavior.

## Offers

Build a focused offer-comparison composition using existing typography, borders, pills and CTA primitives.

Do not default to generic SaaS pricing cards.

## Resources

Reuse editorial/project listing behavior for:

* Brochures
* Exhibitor guides
* Calendars
* Salon plans
* Articles
* Market reports

## FAQ and contact

Use a restrained accordion and conversion panel.

Keep forms short and traceable.

---

# 12. Salon detail pages

Every salon or destination must have a living, shareable and conversion-oriented page.

Required content:

* Country
* City
* Edition
* Date
* Venue or hotel
* Event status
* Visitors expected or verified
* Edition history
* Photos
* Video
* Programme
* Exhibitors
* Brochure
* Practical information
* Exhibitor CTA
* Visitor CTA where relevant
* Related case studies
* Related resources

Lifecycle behavior:

## Upcoming

Show:

* Opening status
* Validated date if available
* Commercial objective
* Exhibitor conversion
* Notification or brochure action

## In progress

Show:

* Programme
* Access
* Hours
* Contacts
* Live practical information

## Completed

Show:

* Verified results
* Photos
* Video
* Report
* Exhibitors
* Testimonials
* Next edition

Use the existing project-detail page architecture where possible.

---

# 13. CMS and data requirements

Inspect the current CMS before changing its architecture.

Do not create a second CMS or parallel content layer.

Extend the existing schemas only where required.

Expected event fields may include:

* `id`
* `slug`
* `countryCode`
* `country`
* `city`
* `edition`
* `locale`
* `status`
* `commercialPriority`
* `startDate`
* `endDate`
* `venue`
* `expectedVisitors`
* `verifiedVisitors`
* `editionCount`
* `exhibitorCount`
* `heroMedia`
* `cardMedia`
* `posterImage`
* `landmarkGraphic`
* `brochure`
* `programme`
* `gallery`
* `video`
* `exhibitors`
* `caseStudies`
* `visitorCta`
* `exhibitorCta`
* `published`
* `verificationState`

Adapt these fields to the existing schema instead of duplicating equivalent concepts.

All uncertain fields must be optional and state-aware.

The frontend must not break when optional data is absent.

---

# 14. CRM and lead tracking

Inspect and preserve the existing CRM integration.

Every conversion should capture, where legally and technically appropriate:

* Lead type
* Exhibitor or visitor intent
* Salon or destination
* CTA origin
* Page
* Locale
* Campaign parameters
* Consent
* Submission timestamp
* CRM status

Do not transmit real user data during automated tests.

Use mocks, test endpoints or documented safe development behavior.

Do not add a new external CRM provider without explicit approval.

---

# 15. Localization

Preserve the existing localization architecture.

French is the primary source language for this implementation.

The architecture must remain ready for:

* English
* Arabic
* RTL rendering

Do not hardcode French strings directly into reusable components if the repository already uses localization files.

Do not produce unreviewed translations merely to make locale routes appear complete.

Preserve correct French accents and punctuation.

---

# 16. Implementation workflow for every section

For each section:

1. Read the relevant PDF section.
2. Identify the business objection being answered.
3. Identify the existing primitive that should be reused.
4. Record the mapping.
5. Inspect existing content and CMS data.
6. Define required component states.
7. Implement the desktop composition.
8. Implement the mobile transformation.
9. Implement keyboard and reduced-motion behavior.
10. Add or update tests.
11. Run type checking.
12. Run linting.
13. Run relevant unit tests.
14. Run the production build.
15. Inspect the section in the browser.
16. Capture desktop and mobile screenshots.
17. Compare the result with the accepted foundation.
18. Correct generic or inconsistent details.
19. Commit a clean checkpoint if commits are authorized by the current workflow.
20. Continue to the next section.

Do not implement all sections in one uncontrolled code generation pass.

Do not stop after producing a plan.

---

# 17. Execution waves

## Wave 0 — Baseline and foundation freeze

Deliver:

* Repository audit
* Baseline validation results
* Baseline screenshots
* Foundation contract
* PDF implementation matrix
* Section mapping
* Risk register
* Ordered implementation queue

No broad visual changes in this wave.

## Wave 1 — First-screen commercial foundation

Implement and validate:

* Header preservation
* Hero B2B content and CTA hierarchy
* Hero media/poster resilience
* Initial trust treatment
* Responsive first screen

## Wave 2 — Salons par pays

Implement the approved extension of “The works”:

* Event data model
* Country and city relationships
* Status-aware cards
* Existing project-card preservation
* Destination imagery
* Landmark graphic layer
* Salon discovery CTA
* Exhibitor CTA
* Desktop and mobile country navigation
* Salon detail routing
* Missing-data states
* CMS integration
* Tests and screenshot evidence

This wave is the clearest proof that the website is being expanded rather than redesigned.

## Wave 3 — Proof and benefits

Implement:

* Proof strip
* Pourquoi exposer
* Notre méthode

## Wave 4 — Market and visibility

Implement:

* MRE market understanding
* Visibility 360
* Sourced statistics

## Wave 5 — Social proof

Implement:

* Trusted developers
* Case studies
* Video testimonials
* Gallery

## Wave 6 — Offers and conversion

Implement:

* Exhibitor offers
* Resources
* FAQ
* Contact and lead flows

## Wave 7 — Detail pages and integration hardening

Complete:

* Salon detail pages
* Case-study pages
* Resource pages
* CMS workflows
* CRM attribution
* Localization structure
* SEO metadata
* Structured data
* Performance
* Accessibility
* Visual regression

Proceed through waves without asking for broad confirmation unless a stop condition is reached.

At minimum, complete the baseline and the first currently incomplete implementation wave during this working session.

---

# 18. Responsive requirements

Validate at minimum:

* 320px
* 375px
* 390px
* 768px
* 1024px
* 1440px
* 1920px

If the screenshot tooling supports it, capture a final 3840×2160 desktop presentation screenshot.

Requirements:

* No horizontal overflow
* No clipped text
* No inaccessible controls
* No hover-only essential content
* No broken card proportions
* No overlapping motion layers
* No unreadably small metadata
* No layout shift caused by media
* No broken RTL-capable structure
* Touch targets remain usable
* Carousels remain keyboard accessible
* Reduced-motion mode remains coherent

On mobile, preserve the project-section character through an intentional transformation such as scroll snap or the existing mobile project behavior. Do not simply stack oversized desktop cards.

---

# 19. Motion requirements

Use the existing motion system and dependencies.

Do not install another animation library unless essential.

Motion should support:

* Hierarchy
* Discovery
* State change
* Media transition
* Narrative progression
* CTA feedback

Avoid:

* Random entrance animations
* Excessive parallax
* Continuous distracting motion
* Different easing for every component
* Animating essential text into unreadable states
* Motion that breaks reduced-motion preferences

---

# 20. Accessibility

Meet or exceed the accessibility quality of the existing foundation.

Verify:

* Semantic headings
* Landmarks
* Keyboard navigation
* Visible focus
* Button and link semantics
* Alternative text
* Media controls
* Form labels
* Error messaging
* Colour contrast
* Reduced motion
* Screen-reader announcements where needed
* Accessible carousel controls
* Logical DOM order
* No interaction available only through pointer hover

---

# 21. Performance and resilience

Preserve or improve:

* Image optimization
* Video poster fallback
* Lazy loading
* Route-level code splitting
* Font loading
* Layout stability
* Caching behavior
* Error handling
* CMS failure states
* Empty states
* Media failure states

Do not autoplay heavy video on constrained mobile connections unless current behavior already handles it safely.

Do not allow missing CMS media to break the layout.

---

# 22. Validation requirements

Detect the package manager and available scripts from the repository.

Run all relevant existing checks, including when available:

* Formatting
* ESLint
* TypeScript
* Unit tests
* Component tests
* Browser tests
* Accessibility tests
* Content validation
* Media validation
* Production build
* Route generation
* Visual regression

Do not claim success if a required check was skipped.

Distinguish:

* Existing baseline failures
* Failures introduced by this work
* Environment-specific failures
* Non-blocking warnings

No new TypeScript errors are acceptable.

No new lint errors are acceptable.

No broken production route is acceptable.

No browser-console error caused by this work is acceptable.

---

# 23. Git safety

Before editing:

* Run `git status`.
* Record the current branch.
* Record the current commit.
* Identify unrelated changes.
* Preserve all unrelated work.

Use a dedicated branch if the current workflow permits:

`feature/spimarimmo-top-down-expansion`

If already on an authorized task branch, continue there.

Prefer small, intentional checkpoints organised by implementation wave.

Do not:

* Force push
* Rewrite published history
* Reset hard
* Delete user files
* Remove existing evidence
* Merge automatically
* Push automatically
* Open a PR automatically

---

# 24. Stop conditions

Stop and report the exact blocker only when:

* The PDF cannot be found or read.
* The repository cannot build at baseline and the cause blocks safe work.
* Required business data would need to be invented.
* Current uncommitted changes directly conflict with the required files.
* A destructive migration is required.
* A new paid service or credential is required.
* The current CMS or CRM architecture cannot be safely identified.
* Two authoritative sources conflict in a way that materially changes the product.

Do not stop for minor implementation decisions.

Make safe, reversible decisions when possible and document them.

---

# 25. Required progress reporting

At the end of each wave, report:

* Wave completed
* Sections implemented
* Existing primitives reused
* New extensions created
* Files changed
* CMS changes
* CRM changes
* Tests added
* Validation results
* Screenshot evidence
* Known limitations
* Exact next wave

Keep the report factual.

Do not describe incomplete work as finished.

---

# 26. Final acceptance criteria

The mission is successful only when:

* The existing foundation remains recognizable.
* The website no longer feels like a content-swapped clone.
* The site clearly targets exhibitors first.
* The homepage follows the PDF’s commercial narrative.
* Salons are visible, comparable and actionable.
* Each salon can have a complete detail page.
* Promises connect to proof.
* Unknown data is never invented.
* The CMS manages dynamic content.
* CRM attribution is preserved.
* Desktop and mobile experiences are complete.
* Motion remains consistent.
* Accessibility remains complete.
* Production build passes.
* No generic parallel design system has been introduced.
* New sections feel designed by the same team that created the foundation.

---

# 27. Begin now

Start immediately.

Your first actions must be:

1. Inspect Git state.
2. Inspect repository structure.
3. Locate and read the PDF completely.
4. Read existing project documentation.
5. Detect the stack, CMS, CRM and localization architecture.
6. Run baseline validation.
7. Start the application.
8. Capture baseline desktop and mobile states.
9. Create the foundation contract and PDF implementation matrix.
10. Identify the first incomplete implementation wave.
11. Begin implementing it.
12. Validate it before proceeding.

Do not respond with only a proposed plan.

Do not redesign the website.

Do not replace accepted work.

Audit, map, implement, validate and continue.
