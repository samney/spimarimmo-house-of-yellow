# House of Yellow — End-to-End Pixel-Accurate Reconstruction

## Execution environment — Claude Code

This specification is a master execution prompt for **Claude Code**. Claude Code is responsible for the complete repository workflow: research, architecture, implementation, asset handling, backend integration, localization, testing, visual regression, documentation, and delivery.

Model-selection rules:

* Use the highest-capability, highest-accuracy Claude model available in the current Claude Code installation.
* Prefer the current **Opus-tier model** for reverse engineering, architectural decisions, implementation, debugging, and final QA.
* Do not hard-code an old model version into the repository or workflow. Resolve the strongest currently available model when the session begins.
* Use extended reasoning or the strongest supported thinking mode for high-impact architecture, security, data-model, animation, and fidelity decisions.
* If Claude Code supports specialized subagents, use them only for bounded parallel work such as route discovery, asset cataloguing, accessibility review, or visual-difference analysis. The primary Claude Code session remains responsible for final decisions and repository consistency.

Claude Code must work directly in the new repository. Do not merely explain what should be built, return isolated snippets, or stop at a plan. Create and modify the actual files, execute the required commands, inspect the rendered result, fix failures, and maintain an auditable project state until completion or a genuine blocker.

### Claude Code operating contract

At the start of the first session:

1. Confirm the repository root and inspect any existing files.
2. Create the implementation-control documents listed below.
3. Record the confirmed project configuration and unresolved blockers.
4. Perform route and evidence discovery before finalizing architecture.
5. Produce the initial architecture and implementation queue.
6. Begin implementation automatically after the evidence baseline is sufficient.

Maintain these control files throughout execution:

```text
docs/claude-code/
  MASTER.md
  STATUS.md
  QUEUE.md
  DECISIONS.md
  ASSUMPTIONS.md
  BLOCKERS.md
  VALIDATION-MATRIX.md
  SESSION-HANDOFF.md
```

Control-file responsibilities:

* `MASTER.md`: immutable mission, scope, constraints, quality bar, and definition of done.
* `STATUS.md`: current phase, completed work, active work, known failures, and next safe action.
* `QUEUE.md`: ordered implementation tasks with identifiers, dependencies, acceptance criteria, and status.
* `DECISIONS.md`: architecture and product decisions with evidence, alternatives, and consequences.
* `ASSUMPTIONS.md`: all unverified assumptions, each marked for validation or acceptance.
* `BLOCKERS.md`: missing access, credentials, assets, approvals, or decisions that genuinely prevent progress.
* `VALIDATION-MATRIX.md`: every route, locale, viewport, browser, interaction, accessibility check, and visual-difference result.
* `SESSION-HANDOFF.md`: concise restart instructions so a new Claude Code session can continue without reconstructing context.

Update `STATUS.md`, `QUEUE.md`, and `SESSION-HANDOFF.md` before ending any Claude Code session. Never rely on chat context as the only source of project state.

## Role

Act as a senior digital-experience architect, web reverse-engineering engineer, UX auditor, design-system specialist, creative frontend engineer, GSAP animation expert, Next.js architect, backend engineer, accessibility reviewer, performance engineer, and visual-regression QA specialist.

Your mission inside Claude Code is to audit, understand, document, reconstruct, implement, and validate the complete House of Yellow website with the highest technically achievable visual and behavioral fidelity.

Do not stop after creating an audit or implementation plan. Continue through research, design-system extraction, architecture, implementation, backend integration, localization, testing, visual comparison, and final documentation unless a genuine blocker requires user input.

## Authorization

This is an authorized reconstruction project.

The supplied and publicly accessible House of Yellow assets—including logos, fonts, images, videos, illustrations, and icons—may be used for this project.

Use the original authorized assets before considering replacements.

Do not:

* Bypass authentication or access restrictions
* Attempt to obtain private source code
* Access private APIs without authorization
* Circumvent anti-bot or security controls
* Copy private customer or personal information
* Hotlink production assets from the original website

Public assets may be collected, catalogued, stored locally, optimized, and served from the new project.

## Confirmed project configuration

### Target website

`https://houseofyellow.nl/`

### Required scope

Audit and reconstruct all publicly accessible pages, routes, projects, interactions, responsive variants, overlays, navigation states, consent interfaces, and error states.

Known minimum scope includes:

* Home
* Made by Yellow
* Culture
* How We Roll
* Connect
* All project/case-study pages
* Project filters
* Project grid and list views
* Mobile navigation
* Contact form
* WhatsApp CTA
* Instagram/social content presentation
* Cookie consent
* Cookie preference management
* Footer and global navigation
* 404 page
* SEO metadata
* Sitemap and robots configuration

This list is not exhaustive. Perform a complete route discovery before finalizing the scope.

### Repository

Create a completely new production-ready project.

Do not assume an existing architecture or component system.

Claude Code owns the repository initialization and all implementation work. Keep every source file, migration, test, QA artifact, and project document inside the repository, except temporary browser or build artifacts that are intentionally excluded from version control.

### Preferred implementation stack

Use the following baseline:

* Next.js with App Router
* React
* TypeScript in strict mode
* Tailwind CSS
* CSS custom properties for extracted design tokens
* GSAP
* GSAP ScrollTrigger
* `@gsap/react`
* `next-intl` for localization
* `next/image` or an equivalent optimized media pipeline
* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage
* Zod
* React Hook Form
* Playwright
* Axe accessibility testing
* Visual screenshot comparison
* ESLint
* Prettier
* Production deployment compatibility with Vercel

Additional technology may be introduced only when evidence or project requirements justify it.

Decision rules:

* Use GSAP for timelines, scroll choreography, text reveals, pinned sections, image transitions, menus, page transitions, counters, and complex motion.
* Use Lenis only if the reference demonstrates custom smooth scrolling.
* Use Three.js or React Three Fiber only if WebGL or 3D rendering is confirmed.
* Use native CSS transitions for simple hover and focus states.
* Avoid using multiple animation libraries for the same responsibility.
* Do not add Framer Motion unless it solves an isolated requirement better than GSAP.
* Use shadcn/ui only inside the private CMS when helpful.
* Do not use shadcn/ui components on the public website if they alter the reference design.
* Do not introduce generic templates, default component styling, or visual effects that do not exist in the reference.
* Preserve progressive enhancement and provide fallbacks for motion-heavy experiences.

The final stack must support the reference website’s motion quality, media delivery, responsive behavior, accessibility, performance, localization, CMS, and backend requirements.

### Target browsers

Support all actively maintained modern browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Apple Safari on macOS
* Safari on iPhone and iPad
* Chrome on Android
* Samsung Internet

Test the current and previous major stable versions where practical.

Deprecated browsers such as Internet Explorer are excluded.

Provide graceful degradation when a browser does not support an enhancement such as WebGL, advanced blending, or a specific animation capability.

### Required viewports

Capture and validate at minimum:

* Large desktop: `1920 × 1080`
* Desktop: `1440 × 900`
* Small desktop: `1280 × 800`
* Tablet landscape: `1024 × 768`
* Tablet portrait: `768 × 1024`
* Mobile: `430 × 932`
* Mobile: `390 × 844`
* Small mobile: `360 × 800`

Also inspect fluid behavior between these widths. Do not optimize exclusively for the named screenshots.

### Languages

Implement:

* English
* French

Localization rules:

* Preserve the original English content accurately.
* Create a professional French translation that preserves the brand’s confident, energetic, creative tone.
* Do not use literal translations that sound unnatural in French.
* Keep project, client, and brand names unchanged.
* Localize navigation, buttons, forms, validation, cookie consent, SEO metadata, accessibility labels, and system messages.
* English is the default locale.
* Preserve the original English route structure where practical.
* Use `/fr/...` for French routes.
* Add a language switcher matching the visual direction of the reference.
* Add correct `hreflang`, canonical URLs, localized metadata, and localized sitemap entries.
* Prevent locale switching from sending users back to the homepage when an equivalent localized route exists.
* Store translations in the CMS rather than duplicating entire page implementations.

### Authorized assets

Use the same authorized original assets first:

* Logos
* Fonts
* Images
* Videos
* Posters
* Icons
* Illustrations
* Textures
* Graphic elements
* Social media assets

For every asset:

* Identify its source URL
* Record its original dimensions
* Record its format
* Record its use locations
* Download it locally
* Avoid unnecessary recompression
* Preserve transparency and color accuracy
* Create optimized responsive variants when appropriate
* Preserve correct focal points and cropping
* Add appropriate alternative text
* Avoid production hotlinking

Create a complete asset manifest.

## Authentication requirements

The reference website does not appear to contain a public customer-account system. Therefore, do not add public registration or public login.

Create a protected private CMS at:

`/admin`

Use Supabase Auth for authorized staff.

Required roles:

* Super Admin
* Content Editor
* Translator

### Super Admin permissions

* Manage users and roles
* Manage all content
* Manage projects
* Manage pages
* Manage media
* Manage translations
* Manage SEO
* Manage global settings
* View and manage contact submissions
* Publish and unpublish content

### Content Editor permissions

* Create and edit pages
* Create and edit projects
* Upload and manage media
* Edit English content
* Manage categories and project metadata
* Save drafts
* Preview changes
* Publish content if permission is granted

### Translator permissions

* View the original English content
* Edit French translations
* Save translation drafts
* Preview localized pages
* View translation-completion status
* Cannot manage users or system configuration

Authentication requirements:

* No public registration
* Secure email/password authentication
* Password-reset flow
* Protected admin routes
* Server-side authorization
* Role-based access control
* Secure session handling
* Rate limiting
* Audit fields for created by, updated by, created at, and updated at
* Row-Level Security in Supabase
* No exposure of service-role secrets to the browser

The CMS must be functional but visually separate from the pixel-accurate public reconstruction.

## Functional backend requirements

Create a functional backend using Supabase and Next.js server capabilities.

### CMS modules

Implement management for:

* Pages
* Page sections
* Projects and case studies
* Project categories
* Project tags
* Industries
* Project metrics
* Project credits
* Related projects
* Images
* Videos
* Video poster images
* Navigation
* Footer
* Contact information
* Office locations
* Social links
* Global CTAs
* SEO metadata
* Open Graph content
* English content
* French translations
* Cookie-policy content
* Global website settings

### Publishing workflow

Support:

* Draft
* Scheduled
* Published
* Archived

Include:

* Content preview
* Publication timestamps
* Slug management
* Unique-slug validation
* Translation status
* Related-content selection
* Automatic cache revalidation
* Safe deletion rules
* Confirmation before destructive actions

### Contact system

Reconstruct the public contact experience and make it functional.

Required fields should be based on the reference and confirmed during the audit.

Implement:

* Name
* Email address
* Message
* Client-side validation
* Server-side validation
* Loading state
* Success state
* Error state
* Spam protection
* Honeypot protection
* Rate limiting
* Secure storage of submissions
* Email notification to administrators
* Optional confirmation email to the sender
* Privacy and consent handling
* Accessible error messages

Do not expose email-provider or database secrets to the client.

### Media system

Support:

* Image upload
* Video upload
* External video URLs when needed
* Poster frames
* Alternative text
* Captions
* Focal-point configuration
* Responsive image variants
* Media metadata
* Media replacement
* Reuse across multiple projects
* Safe deletion validation

Large production video files may use a dedicated provider if Supabase Storage is not appropriate. Evaluate Cloudflare Stream, Mux, or another suitable provider only when justified by performance, transformation, or bandwidth needs.

## Primary outcome

Create a production-quality reconstruction matching the original website in:

* Information architecture
* Content hierarchy
* Art direction
* Typography
* Text wrapping
* Grid behavior
* Container dimensions
* Component geometry
* Spacing
* Alignment
* Colors
* Gradients
* Image treatment
* Video behavior
* Icons
* Borders
* Radii
* Shadows
* Masks
* Blend modes
* Cursor behavior
* Hover interactions
* Scroll choreography
* Page transitions
* Responsive behavior
* Navigation behavior
* Loading states
* Cookie-consent behavior
* Contact-form behavior
* Accessibility behavior

Fidelity is the priority.

Do not modernize, simplify, redesign, or “improve” the public interface unless explicitly requested.

## Evidence classifications

Classify findings as:

* `Observed`: directly confirmed from rendered output, public markup, network evidence, screenshots, or authorized assets.
* `Inferred`: strongly suggested by public evidence but not directly confirmed.
* `Unknown`: cannot be determined through authorized inspection.

Never represent inferred technologies as confirmed.

For every technology finding, record:

* Technology
* Category
* Supporting evidence
* Confidence level
* Whether it must be replicated
* Chosen equivalent in the new stack

The goal is to reproduce external behavior, not blindly copy an implementation that may be outdated.

## Pre-audit evidence already collected for Claude Code

The following evidence was collected from the live public website on July 30, 2026. Treat it as an initial evidence package, not as a substitute for Claude Code’s own final verification. Recheck any evidence that may have changed before implementation.

### Evidence confidence

* Everything explicitly marked `Observed` below was confirmed from the rendered public site, its public DOM, public styles, or public asset references.
* Items marked `Inferred` are architectural recommendations or likely behavior that still requires validation.
* Asset URLs and video signatures can change. Re-discover the current authorized source before downloading.
* The supplied authorization allows original public assets to be collected and stored locally. Production hotlinking remains prohibited.

### Observed global visual foundation

| Token | Observed value | Usage |
| --- | --- | --- |
| Canvas / paper | `#EEEEEE` | Default page background |
| Ink | `#1D1D1B` | Primary dark background and text |
| Yellow | `#F2EFA3` | Brand accent, light-on-dark text, CTA surfaces |
| Primary typeface | `Poppins-font` | Global interface and editorial typography |
| Body weight | `400` | Default copy |
| Medium weight | `500` | Navigation, headings, buttons |
| Available weights | `300`, `400`, `500`, `600`, `700` | Confirmed public font files |

Observed public font sources:

```text
/wp-content/themes/hoy/assets/fonts/Poppins-Light.woff2
/wp-content/themes/hoy/assets/fonts/Poppins-Regular.woff2
/wp-content/themes/hoy/assets/fonts/Poppins-Medium.woff2
/wp-content/themes/hoy/assets/fonts/Poppins-SemiBold.woff2
/wp-content/themes/hoy/assets/fonts/Poppins-Bold.woff2
```

Observed desktop typography at a `1363 × 936` browser viewport:

| Role | Observed size | Line height | Weight |
| --- | ---: | ---: | ---: |
| Base text | approximately `10.22px` / `0.75vw` | `1.4` | `400` |
| Supporting text | approximately `11.93px` / `0.875vw` | `1.4` | `400` |
| Small editorial title | approximately `20.45px` / `1.5vw` | `24.53px` / `1.8vw` | `400` |
| Large editorial heading, smaller variant | approximately `39.19px` / `2.875vw` | `43.89px` | `500` |
| Large editorial heading | approximately `51.11px` / `3.75vw` | `57.25px` | `500` |

These values are viewport-relative in the reference. Claude Code must determine the actual clamping and mobile overrides rather than copying desktop `vw` values blindly.

### Observed global interaction and layout behavior

* Fixed desktop header with left navigation, centered House of Yellow mark, social links, and rounded Connect CTA.
* Header observed at `z-index: 12`.
* Sticky WhatsApp control observed at `z-index: 10`.
* Custom cursor observed at `z-index: 20`, with Play, Video, and other context states.
* Consent interface observed at `z-index: 99999`.
* Smooth-scrolling state exposed through the HTML classes `lenis` and `lenis-smooth`.
* Page-transition state exposed through `swup-enabled`.
* Fullscreen hero video uses a native `<video>` element with autoplay-style behavior, muted playback, inline playback, loop behavior, and custom play/pause overlays.
* Editorial copy is frequently split into individual characters for reveal animation.
* The project overview supports grid and list views, filters, reset behavior, responsive media tiles, and hover-triggered video behavior.
* The visual direction is intentionally minimal but cinematic: large video surfaces, asymmetric spacing, restrained typography, no generic card chrome, and strong contrast between ink, paper, and yellow sections.
* Reference homepage section geometry at `1363px` wide included an approximately `937px` hero, a `1654px` yellow introduction/work section, a long dark services section, and a final dark CTA section. These are evidence anchors, not hard-coded production heights.

### Observed public technologies

| Technology | Classification | Evidence | Replication decision |
| --- | --- | --- | --- |
| WordPress | `Observed` | Public `/wp-content/` asset paths and theme assets | Do not reproduce; replace with Next.js and Supabase |
| Custom `hoy` theme | `Observed` | Public theme asset paths | Reproduce external behavior only |
| Poppins local webfonts | `Observed` | Public `@font-face` declarations | Download, self-host, and preload selectively |
| Lenis | `Observed` | `lenis` and `lenis-smooth` HTML state | Use only after motion verification confirms it is required |
| Swup | `Observed` | `swup-enabled` HTML state | Recreate transitions with a Next.js-compatible approach; do not add Swup automatically |
| Vimeo progressive media | `Observed` | Public native-video playback references | Download authorized media locally or use a justified production video provider |
| Complianz consent | `Observed` | Public consent DOM and CSS | Rebuild behavior natively; do not reproduce WordPress dependency |
| Autoptimize | `Observed` | Public stylesheet path | Do not reproduce; use framework-native optimization |
| GSAP | `Unknown from current evidence` | Motion behavior suggests timeline-based animation, but the initial evidence did not conclusively identify the library | GSAP remains the selected implementation system because it matches the required behavior |

### Observed homepage content architecture

1. Fixed global header and sticky WhatsApp control.
2. Fullscreen cinematic video hero.
3. `Welcome!` editorial introduction.
4. Primary statement: creative content agency moving at the speed of the client’s ambition.
5. Supporting copy covering short-form social content through full brand documentaries and feature-length work.
6. Yellow `Who are we?` statement section.
7. Connect and Culture calls to action.
8. `The works` introduction and three featured projects.
9. Client-logo presentation / marquee.
10. `Beyond the Screen` section with mobile-content positioning.
11. Animated metrics for countries, followers, impressions, and engagements.
12. `How we roll` summary and process CTA.
13. Video, photography, and animation service narratives.
14. Large `Let’s connect` closing statement.
15. Global footer, social/contact details, sitemap, copyright, cookies, and consent management.

### Observed primary page structures

#### Made by Yellow

* Complete project index.
* Project-category filters.
* Reset-filter control.
* Grid and list presentation modes.
* Animated video thumbnails.
* Project metadata: year, sector, category, views, and delivery time.
* Closing Culture CTA and global footer.

#### Culture

* `Our Culture` hero statement.
* Team composition narrative combining young creators and experienced professionals.
* Discipline sections for Creative, 3D Animator, Editor, 2D Animator, and Director.
* Team/member content including Vinal Hindocha.
* `For who?` section positioning the studio for bold brands.
* Connect CTA, featured work, and footer.

#### How We Roll

* `This is how we roll` introduction.
* `Fast. Smart. With flavour.` positioning.
* Phase 1 — The Blueprint: Concept & Storytelling, Visualizing the Narrative, Pre-Production Mastery.
* Phase 2 — The Studio: Precision Setup, Dynamic Filming, Quality Assurance.
* Phase 3 — The Polish: Crafting the Narrative, Sonic Excellence, Visual Perfection.
* `Ready to go?` closing CTA.

#### Connect

* `Let’s connect` editorial introduction.
* Live or animated local-time presentation for Eindhoven, Dubai, and Miami.
* Email and phone details.
* WhatsApp CTA.
* Contact form with Name, Email address, and Your message.
* Loading, success, and error states.
* Instagram/social content presentation.
* Featured work and global footer.

#### Project detail template

* Project title and editorial summary.
* Year, sector, and service/category metadata.
* Cinematic hero media.
* Metrics such as impressions, followers, countries, and engagements.
* `The Client`, `The Process`, and `The Project` narrative sections.
* Production credits / thanks.
* Next-project navigation.
* Shared header, WhatsApp control, footer, cookie behavior, and motion system.

### Complete route inventory discovered

#### Core public routes

```text
/
/made-by-yellow/
/culture/
/how-we-roll/
/connect/
/cookies/
```

#### Discovered project routes

| # | Route | Project | Year | Sector | Primary category | Views | Delivery |
| ---: | --- | --- | --- | --- | --- | ---: | --- |
| 1 | `/project/oceanco-leviathan/` | Oceanco – Leviathan | `'26` | Luxury & yachting | Corporate | `7.100.000` | `2 wks production + 2 wks post` |
| 2 | `/project/la-fuente-x-amg/` | La Fuente x AMG | `'26` | Music | Artists | `5.800.000` | `1 week pre-production + 2 shoot days` |
| 3 | `/project/broederliefde-rotterdam-ahoy/` | Broederliefde – Rotterdam Ahoy | `'26` | Live music event | Events | `1.900.000` | `8 days` |
| 4 | `/project/srg-international-reeses/` | SRG International – Reeses | `'26` | FMCG brands | Launches | `3.500.000` | `6 days` |
| 5 | `/project/klibansky-superman/` | Klibansky – Superman | `'26` | Art | Commercials | `2.800.000` | `3 days` |
| 6 | `/project/xxl-nutrition-festival-activations/` | XXL Nutrition – Festival Activations | `'26` | Sport nutrition | Commercials | `2.600.000` | `3 days` |
| 7 | `/project/qbuzz-smiley-campaign/` | Qbuzz – Smiley Campaign | `'26` | Public transport | Social campaigns | `2.200.000` | `2 weeks` |
| 8 | `/project/porsche-employer-branding/` | Porsche Employer Branding | `'23` | Automotive | Employer branding | `3.600.000` | `10 days` |
| 9 | `/project/glow-eindhoven-light-festival/` | GLOW Eindhoven Light Festival | `'21–'25` | Light festival | Aftermovies | `9.500.000` | `9 days` |
| 10 | `/project/de-hollandse-100-lymphco/` | De Hollandse 100 – Lymph&Co | `'26` | Sport event | Events | `1.100.000` | `2 days` |
| 11 | `/project/streetgasm/` | StreetGasm | `'25` | Automotive | Aftermovies | `1.600.000` | `6 days` |
| 12 | `/project/de-klerk-employer-branding/` | De Klerk – Employer Branding | `'24` | Green environments | Employer branding | `1.400.000` | `3–4 weeks` |
| 13 | `/project/buddha-to-buddha-los-angeles/` | Buddha to Buddha – Los Angeles | `'25` | Lifestyle | Commercials | `1.300.000` | `5 days` |
| 14 | `/project/the-space-dubai/` | The Space Dubai | `'22` | Event venue | Commercials | `1.200.000` | `6 days` |
| 15 | `/project/htc/` | HTC | `'25` | Campus | Corporate | `950.000` | `5 days` |
| 16 | `/project/salvia-bioelectronics/` | Salvia BioElectronics | `'25` | Medtech | Commercials | `780.000` | `6 days` |
| 17 | `/project/ansu-fati-arriba-nutrition/` | Ansu Fati – Arriba Nutrition | `'22` | Brand ambassador | Commercials | `5.200.000` | `3 days` |
| 18 | `/project/eiffel-employer-branding/` | Eiffel Employer Branding | `'23` | Employer Branding | Employer branding | `2.100.000` | `9 days` |
| 19 | `/project/tmc-fundamentals/` | TMC FUNdamentals | `'24–'25` | High-tech consultancy | Social campaigns | `1.800.000` | `Ongoing / 4 days` |
| 20 | `/project/hotek-brand-video/` | HOTEK Brand Video | `'23` | Access control solutions | Commercials | `2.400.000` | `6 days` |
| 21 | `/project/madunia-brand-launch/` | Madunia Brand Launch | `'24` | Restaurant | Launches | `3.200.000` | `8 days` |

Claude Code must still verify sitemap, robots, canonical variations, redirects, hidden legal routes, and the 404 response before freezing the final route inventory.

### Observed initial asset evidence

* Homepage hero video was observed as Vimeo progressive playback ID `1202811863` at `1080p`.
* Initial featured-project media used playback IDs including `1196251477`, `1204605394`, and `1194133383`.
* Public project-poster references included:

```text
/wp-content/uploads/2026/05/Comp-3_11_33-600x439.jpg
/wp-content/uploads/2026/05/Comp-3_11_36-600x439.jpg
/wp-content/uploads/2026/05/Comp-1_26_7-600x800.jpg
```

* Public client-logo SVGs were observed under `/wp-content/uploads/2026/06/`, including brands such as XXL Nutrition, Team Eiffel, SuperOffice, StreetGasm, SRG International, Qbuzz, PSV, La Fuente, KPN, Joseph Klibansky, HOTEK, High Tech Campus, GLOW Eindhoven, De Klerk, Buddha to Buddha, Broederliefde, Philips Hue, TMC, Lymph&Co, and others.

Claude Code must create the final asset manifest from fresh public evidence, download assets locally, record dimensions and use locations, and eliminate all production hotlinks.

## Recommended production repository blueprint

Claude Code may refine this structure when evidence requires it, but any deviation must be recorded in `DECISIONS.md`.

```text
app/
  [locale]/
    (public)/
      page.tsx
      made-by-yellow/page.tsx
      culture/page.tsx
      how-we-roll/page.tsx
      connect/page.tsx
      cookies/page.tsx
      project/[slug]/page.tsx
      layout.tsx
    not-found.tsx
  admin/
    login/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    (protected)/
      page.tsx
      pages/
      projects/
      media/
      navigation/
      translations/
      seo/
      submissions/
      users/
      settings/
    layout.tsx
  api/
    contact/route.ts
    preview/route.ts
    revalidate/route.ts
  layout.tsx
components/
  public/
    global/
    home/
    projects/
    culture/
    process/
    connect/
    consent/
  admin/
  motion/
  ui/
features/
  auth/
  content/
  projects/
  media/
  translations/
  contact/
  seo/
lib/
  animations/
  env/
  i18n/
  media/
  security/
  seo/
  supabase/
  validation/
messages/
  en.json
  fr.json
public/
  fonts/
  images/
  videos/
  icons/
supabase/
  migrations/
  seed.sql
tests/
  e2e/
  accessibility/
  visual/
  unit/
docs/
  audit/
  design-system/
  architecture/
  qa/
  claude-code/
qa/
  reference/
  implementation/
  overlays/
  diff/
  recordings/
```

## Recommended Supabase domain model

The final schema must be justified in `DATA-MODEL.md` and implemented through versioned migrations.

### Identity and authorization

* `profiles`
* `roles`
* `profile_roles`
* `audit_logs`

### Page content

* `pages`
* `page_translations`
* `page_sections`
* `page_section_translations`
* `content_revisions`

### Project content

* `projects`
* `project_translations`
* `project_categories`
* `project_category_translations`
* `project_category_links`
* `project_tags`
* `project_tag_links`
* `industries`
* `project_metrics`
* `project_credits`
* `project_relations`

### Media

* `media_assets`
* `media_variants`
* `media_usages`

### Global configuration

* `navigation_items`
* `navigation_item_translations`
* `footer_groups`
* `social_links`
* `office_locations`
* `global_settings`
* `seo_entries`

### Operations

* `contact_submissions`
* `publication_jobs`
* `webhook_events`

Every content table must include stable identifiers, status, audit timestamps, ownership fields, and safe deletion semantics where appropriate. Every localized entity must have explicit locale constraints and translation-completion state.

## Role-permission baseline

| Capability | Super Admin | Content Editor | Translator |
| --- | :---: | :---: | :---: |
| Manage users and roles | Yes | No | No |
| Manage global settings | Yes | No | No |
| Create and edit English pages/projects | Yes | Yes | Read only |
| Edit French translations | Yes | Optional | Yes |
| Manage media | Yes | Yes | Read only |
| Manage SEO | Yes | Yes | Translation fields only |
| Save drafts | Yes | Yes | Yes |
| Publish | Yes | Permission controlled | No |
| View contact submissions | Yes | Optional | No |
| Delete content | Yes | Restricted | No |

RLS, server-side authorization, and UI visibility must all enforce the same permission model. Client-side hiding alone is never authorization.

## Environment contract

Create `.env.example` with names only and safe explanations. Never commit real secrets.

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DATABASE_URL=
CONTACT_NOTIFICATION_TO=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=
CONTACT_RATE_LIMIT_SECRET=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
PREVIEW_SECRET=
REVALIDATION_SECRET=
```

If the final provider choice changes these names, update `.env.example`, validation code, setup documentation, and deployment documentation together.

## Initial Claude Code execution queue

Claude Code must expand these epics into dependency-aware tasks in `QUEUE.md`. Each task requires acceptance criteria, verification commands, affected routes, and evidence paths.

| Epic | Objective | Completion evidence |
| --- | --- | --- |
| `HOY-000` | Bootstrap control plane and repository quality gates | Control files, strict TypeScript, lint, formatting, test and build scripts |
| `HOY-010` | Complete live-site discovery | Final route, content, asset, technology, and state inventories |
| `HOY-020` | Capture reference evidence | Required screenshots, motion recordings, and dynamic-region register |
| `HOY-030` | Extract design and motion systems | Tokens, typography, components, responsive rules, and motion timelines |
| `HOY-040` | Implement data model and migrations | Reviewed schema, migrations, seed data, and RLS tests |
| `HOY-050` | Build global public shell | Header, menu, footer, WhatsApp, consent, transitions, cursor, accessibility |
| `HOY-060` | Build English homepage | Complete responsive homepage with approved original assets and motion |
| `HOY-070` | Build project index | All projects, filter states, grid/list behavior, responsive interactions |
| `HOY-080` | Build project template | CMS-driven template and all 21 discovered project records |
| `HOY-090` | Build Culture and How We Roll | All observed content, media, responsive behavior, and transitions |
| `HOY-100` | Build Connect | Time zones, contact methods, form, validation, spam protection, notifications |
| `HOY-110` | Implement localization | English and professional French content, routes, metadata, switcher, fallbacks |
| `HOY-120` | Build authentication and CMS | `/admin`, roles, permissions, CRUD, previews, publishing, media, translations |
| `HOY-130` | Implement SEO and platform metadata | Metadata, OG, structured data, sitemap, robots, canonicals, hreflang, 404 |
| `HOY-140` | Accessibility and performance pass | Automated and manual a11y evidence, Lighthouse/performance report, fixes |
| `HOY-150` | Visual-regression convergence | Reference and implementation captures, overlays, diffs, known-differences register |
| `HOY-160` | Production readiness | Passing build/tests, setup/deployment docs, CMS guide, final validation matrix |

## Implementation sequencing rules for Claude Code

1. Do not freeze architecture before route and media evidence is sufficient.
2. Do not start with the CMS UI. First prove the public design system and content model on the homepage and one project page.
3. Implement global tokens, fonts, page shell, media primitives, and animation lifecycle before duplicating page sections.
4. Implement the data model before mass-entering project content.
5. Build one representative project detail page and validate it before importing all 21 projects.
6. Add French only after English content structures are stable, but design the schema and routing for both locales from the beginning.
7. Build the admin around the actual content model, not a generic dashboard template.
8. Run visual comparison continuously; do not postpone all fidelity work to the end.
9. Treat missing Supabase, email, anti-spam, or deployment credentials as explicit blockers. Continue all work that can be safely completed with documented environment contracts and local substitutes.
10. Never lower the fidelity target silently because a section is difficult. Log the difference, explain the cause, and keep it in the queue until resolved or explicitly accepted.

## Definition of repository-ready handoff

The project is ready for another Claude Code session only when:

* `STATUS.md` accurately describes the current repository.
* `QUEUE.md` identifies exactly one next executable task or clearly states the blocker.
* `SESSION-HANDOFF.md` contains the commands and files needed to resume.
* All unverified claims are recorded in `ASSUMPTIONS.md`.
* All missing credentials, assets, or approvals are recorded in `BLOCKERS.md`.
* The repository builds or the exact failing gate is documented.
* No completed task lacks verification evidence.

## Phase 1 — Complete route discovery

Discover all public routes using:

* Global navigation
* Footer navigation
* Internal links
* Sitemap
* Robots file
* Project listings
* Project relations
* Pagination
* Filters
* Locale routes
* Legal and cookie links
* Metadata and structured data

For each page, document:

* URL
* Page type
* Purpose
* Template
* Sections
* Components
* Content
* Assets
* Interactive states
* Responsive behavior
* SEO metadata
* Related routes
* Localization requirements

Create:

* `docs/audit/ROUTE-INVENTORY.md`
* `docs/audit/CONTENT-INVENTORY.md`
* `docs/audit/ASSET-MANIFEST.md`

Do not assume that the main navigation represents every public page.

## Phase 2 — Visual evidence capture

Capture reference evidence for every page and major state.

Include:

* Full-page screenshots
* Initial viewport
* Individual sections
* Open and closed navigation
* Desktop and mobile menus
* Project filter open and closed
* Grid view
* List view
* Hovered project items
* Project detail pages
* Video play and pause states
* Contact-form states
* Cookie banner
* Cookie preferences
* Footer interactions
* Loading states
* 404 page
* Responsive transformations
* Reduced-motion mode

When animations cannot be documented with screenshots, record video and create a motion timeline.

Store captures in:

```text
qa/
  reference/
    desktop/
    tablet/
    mobile/
  implementation/
  overlays/
  diff/
  recordings/
```

## Phase 3 — UX and technical audit

Analyze:

* Business purpose
* Target audience
* Main conversion journey
* Navigation architecture
* Project-discovery experience
* Content hierarchy
* Motion as part of the UX
* CTA strategy
* Contact journey
* Responsive prioritization
* Accessibility
* Performance
* SEO
* Consent handling

Inspect publicly observable technical evidence:

* HTML structure
* Public stylesheets
* Public scripts
* Response headers
* Rendering strategy
* Public APIs
* Fonts
* Image delivery
* Video delivery
* Caching
* CDN behavior
* Analytics
* Consent tools
* Structured data
* Public security headers

Create:

* `docs/audit/UX-AUDIT.md`
* `docs/audit/TECHNICAL-FORENSICS.md`
* `docs/audit/ACCESSIBILITY-AUDIT.md`
* `docs/audit/PERFORMANCE-AUDIT.md`

Keep reconstruction requirements separate from optional improvement recommendations.

## Phase 4 — Design-system extraction

Extract and document:

### Visual foundations

* Exact color values
* Font families and font files
* Font weights
* Font sizes
* Line heights
* Letter spacing
* Text casing
* Spacing scale
* Container widths
* Grid columns
* Grid gaps
* Breakpoints
* Borders
* Radii
* Shadows
* Blur
* Opacity
* Blend modes
* Z-index layers
* Icon dimensions
* Image ratios
* Video ratios
* Cursor states

### Motion system

For every meaningful animation, document:

* Target element
* Trigger
* Initial state
* Final state
* Duration
* Delay
* Easing
* Stagger
* Scroll relationship
* Pinning behavior
* Scrub behavior
* Mobile behavior
* Reduced-motion behavior

Inspect specifically:

* Initial page reveal
* Route transitions
* Menu transitions
* Repeated CTA text
* Project cards
* Grid/list transitions
* Image reveals
* Video behavior
* Text reveals
* Counters
* Marquees
* Sticky sections
* Scroll-based transformations
* Footer animation
* Custom cursor behavior

Create:

* `docs/design-system/DESIGN-SYSTEM.md`
* `docs/design-system/COMPONENT-INVENTORY.md`
* `docs/design-system/MOTION-SYSTEM.md`

Convert confirmed values into reusable CSS variables and Tailwind theme tokens.

## Phase 5 — Architecture

Design the new system around:

* Next.js App Router
* Server Components by default
* Client Components only where interactivity requires them
* Reusable page-section components
* CMS-driven project pages
* Locale-aware routing
* Structured project data
* Optimized media
* GSAP lifecycle safety
* Code splitting
* Lazy loading
* Cache revalidation
* Secure server actions or route handlers
* Accessible progressive enhancement

Do not make the entire application a client component.

Create:

* `docs/architecture/FRONTEND-ARCHITECTURE.md`
* `docs/architecture/BACKEND-ARCHITECTURE.md`
* `docs/architecture/DATA-MODEL.md`
* `docs/architecture/IMPLEMENTATION-PLAN.md`
* `docs/architecture/CLAUDE-CODE-EXECUTION-PLAN.md`

Map every reference page and section to:

* Route
* Component
* CMS content
* Assets
* Animations
* Responsive rules
* States
* Validation screenshots

## Phase 6 — Implementation

Implement the complete public website and private CMS.

Public-site rules:

* Match observed geometry before adding secondary polish.
* Use the original authorized assets.
* Match text wrapping.
* Match video crops and poster frames.
* Match responsive transformations.
* Implement every meaningful state.
* Preserve keyboard accessibility.
* Avoid layout shift.
* Avoid horizontal overflow.
* Avoid generic template patterns.
* Do not add unobserved visual decoration.
* Do not introduce a different aesthetic.
* Do not sacrifice visual fidelity through excessive component abstraction.

CMS rules:

* Keep the admin system maintainable and accessible.
* Do not apply the experimental public-site motion system to the CMS.
* Protect all admin routes and operations.
* Validate every write on the server.
* Implement loading, empty, error, success, and permission-denied states.

## Phase 7 — Performance and accessibility

Target:

* Smooth animation on modern desktop and mobile devices
* Minimal layout shift
* Fast initial content rendering
* Lazy-loaded noncritical video
* Responsive images
* Correct video poster usage
* Font preloading only when justified
* Route-level code splitting
* No unnecessary JavaScript
* No animation memory leaks
* Respect for `prefers-reduced-motion`
* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible forms
* Sufficient contrast
* Accurate alternative text

Measure performance with Lighthouse or equivalent tooling.

Do not damage visual fidelity merely to reach a perfect synthetic score. Document any necessary trade-offs.

## Phase 8 — Visual validation

For every route and required viewport:

1. Capture the reference.
2. Capture the reconstruction.
3. Normalize viewport, browser, zoom, device-pixel ratio, content, and scroll position.
4. Freeze animations at comparable states.
5. Produce a side-by-side comparison.
6. Produce a transparent overlay.
7. Produce a pixel-difference image.
8. Identify differences by section.
9. Correct the highest-impact differences.
10. Repeat until acceptance criteria pass.

Mask only genuinely dynamic regions such as:

* Live social feeds
* Current local times
* Third-party embeds
* Randomized content
* Video frames
* Dynamic analytics values

Document every exclusion.

## Acceptance criteria

A page is complete only when:

* All content and sections exist.
* Correct original assets are used.
* Typography and text wrapping match.
* Stable layout geometry is within approximately two pixels.
* Responsive layouts match at every required viewport.
* Image and video crops match.
* Colors, borders, shadows, and visual treatments match.
* Animations reproduce the observed behavior.
* Interactive states work.
* English and French versions work.
* Keyboard navigation works.
* Reduced-motion mode works.
* The contact system works.
* The CMS works.
* Role permissions work.
* Type checking passes.
* Linting passes.
* Automated tests pass.
* Production build passes.
* No material console errors remain.
* No unexplained visual differences remain.
* Static screenshot difference is below `1%`, excluding documented dynamic areas.

Do not claim “pixel-perfect,” “100% accurate,” or “complete” without visual-difference evidence.

## Required deliverables

Deliver:

* Complete source code
* Production-ready Next.js application
* English public website
* French public website
* Private admin CMS
* Supabase database schema
* Supabase migrations
* Supabase RLS policies
* Seed data
* Asset manifest
* Route inventory
* UX audit
* Technical forensic audit
* Accessibility audit
* Performance audit
* Design system
* Component inventory
* Motion system
* Frontend architecture
* Backend architecture
* Data model
* Implementation plan
* Reference screenshots
* Reconstruction screenshots
* Overlay images
* Pixel-difference images
* Visual QA report
* Known-differences register
* Environment-variable template
* Local setup instructions
* Deployment instructions
* CMS administrator guide
* Claude Code control files
* Claude Code session-handoff document
* Task queue with completed acceptance evidence
* Architecture decision log
* Assumptions and blockers register

## Working behavior

Before the first Claude Code tool action, provide a short update naming the first audit step.

Continue autonomously through all safe, in-scope research, documentation, implementation, and validation work.

Claude Code execution rules:

* Use Plan Mode for initial architecture and for changes that materially affect security, data modelling, routing, localization, or the animation system.
* Convert the approved plan into concrete repository tasks and then execute them; do not remain indefinitely in planning.
* Prefer small, verifiable implementation slices while preserving the full end-to-end objective.
* Run relevant type checks, linting, tests, builds, and visual checks after each meaningful slice.
* Fix failures before expanding scope when the failure invalidates later work.
* Keep commits logically scoped and messages descriptive when version-control actions are authorized.
* Never overwrite unrelated user work.
* Never delete or replace assets, migrations, content, or configuration without first confirming the exact target and impact.
* When context becomes large, update the control files and continue from them instead of compressing critical evidence into memory.
* Do not ask the user to repeat information already recorded in the repository.
* Do not claim that work was tested when the corresponding command or browser validation was not executed.

Do not stop after:

* Explaining the site
* Producing a route list
* Producing a design system
* Producing mockups
* Generating a plan
* Building only the homepage

Pause only if:

* Required access is missing
* A required original asset cannot be obtained
* Authorization is unclear
* A destructive external action is required
* A decision would materially change the requested product

When a blocker occurs, ask for the smallest missing decision.

## Final response

Lead with the actual completed outcome.

Report:

1. Implemented public routes
2. Implemented CMS functionality
3. English and French localization status
4. Validation performed
5. Visual-difference results by viewport
6. Browser-test results
7. Accessibility and performance results
8. Remaining differences
9. Files and documentation created
10. Exact commands for local execution, testing, and deployment

Do not describe incomplete work as complete.

## Claude Code kickoff command

Give Claude Code this file at the root of the new repository and start the first session with:

```text
Read HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md completely before taking action.

Treat it as the authoritative product, architecture, implementation, and QA specification.

Use the highest-capability Claude model currently available in Claude Code, preferring the current Opus-tier model and the strongest supported reasoning mode.

Begin with HOY-000 and HOY-010. Create the Claude Code control files, validate the supplied pre-audit evidence against the live authorized reference, produce the dependency-aware queue, and then continue autonomously into implementation.

Do not stop after planning or documentation.
Do not implement only the homepage.
Do not claim completion without executed validation evidence.
Do not discard or weaken any requirement without recording a justified decision.

Before ending the session, update STATUS.md, QUEUE.md, DECISIONS.md, ASSUMPTIONS.md, BLOCKERS.md, VALIDATION-MATRIX.md, and SESSION-HANDOFF.md.

Return:
1. the current phase,
2. work completed,
3. commands and checks executed,
4. evidence created,
5. blockers,
6. the exact next task.
```

This kickoff message is intentionally short because the full project truth lives in this file and in the repository control documents Claude Code will create.
