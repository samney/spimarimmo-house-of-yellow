# SPIMARIMMO ADMIN — CRM / CMS
## Master UI/UX Direction, Design System & Product Blueprint

**Working product name:** SPIMAR Control  
**Document version:** 1.0  
**Date:** 2026-08-05  
**Status:** Foundation / Direction Lock  
**Primary objective:** Define a cohesive, scalable, high-end admin experience for the SPIMARIMMO CRM and CMS, fully aligned with the public website’s visual identity while remaining operational, readable, and efficient.

---

# 1. Executive Summary

SPIMAR Control is the internal operating system for SPIMARIMMO.

It must bring together:

- CRM operations
- exhibitor management
- lead qualification
- events and editions
- appointments and follow-ups
- website content management
- media and translations
- analytics and reporting
- operational alerts and tasks

The product should feel like a calm, modern, editorial command center—not a generic enterprise dashboard and not a direct clone of the visual reference.

The direction is built from two sources:

1. **The existing SPIMARIMMO public website direction**
   - black and gold identity
   - sophisticated typography
   - clean hierarchy
   - high-end visual rhythm
   - premium but contemporary positioning

2. **The attached dashboard reference**
   - layered application shell
   - soft neutral environment
   - bento-style cards
   - strong information hierarchy
   - compact controls
   - restrained charts
   - dense but breathable layouts

The result should be recognizably SPIMARIMMO while remaining highly usable for daily work.

---

# 2. Product Vision

## 2.1 North-star statement

> A calm, elegant and highly precise operating system for managing exhibitors, leads, events, content and commercial performance.

## 2.2 Product qualities

The product should feel:

- precise
- fresh
- architectural
- calm
- efficient
- contemporary
- premium without being luxurious
- data-rich without feeling crowded
- consistent without becoming repetitive

## 2.3 Product anti-goals

The admin must not become:

- a generic shadcn dashboard
- a black interface with excessive gold
- a collection of disconnected cards
- an old-style enterprise back office
- a visual clone of the reference
- a CMS and CRM that feel like separate products
- a dashboard overloaded with charts
- a mobile interface that merely shrinks desktop tables

---

# 3. Relationship With the Public Website

The public website and admin should belong to the same brand family, but they serve different purposes.

## Public website

- expressive
- cinematic
- brand-forward
- spacious
- narrative
- animated
- marketing-oriented

## Admin platform

- operational
- compact
- data-oriented
- calm
- fast
- structured
- predictable

## Shared visual DNA

The admin should inherit:

- the same brand gold
- the same core black
- the same typography family where appropriate
- the same visual discipline
- the same spacing logic
- the same button and control philosophy
- the same restrained premium feel

## Deliberate differences

The admin should use:

- more neutral surfaces
- tighter spacing
- higher information density
- smaller typography
- more visible structure
- reduced animation
- stronger accessibility
- persistent navigation

---

# 4. Reverse-Engineering the Reference

The reference succeeds because of its system, not because of a single visual trick.

## 4.1 Application shell

The interface is composed of layered zones:

1. warm neutral background
2. large rounded application shell
3. thin global navigation rail
4. contextual navigation sidebar
5. top command bar
6. main working canvas
7. modular content cards

This creates depth without relying on heavy shadows.

## 4.2 Information hierarchy

The reference uses four levels:

1. page objective or primary metric
2. important operational indicators
3. analytical content
4. metadata and actions

Typography carries most of the hierarchy.

## 4.3 Card language

Cards are intentionally varied:

- white surface cards
- soft grey analytical panels
- black emphasis cards
- small metric tiles
- large chart containers
- contextual pills
- lightweight status cards

The variation prevents visual monotony.

## 4.4 Controls

Controls are compact and close to the content they affect:

- filters
- date range
- segmented controls
- tabs
- status pills
- user chips
- contextual actions

## 4.5 Data visualization

Charts are restrained:

- one dominant accent color
- muted comparison values
- minimal axes
- direct annotations
- neutral backgrounds
- clear numeric summaries
- no decorative rainbow palettes

---

# 5. Design Principles

## 5.1 Calm density

The dashboard may contain a lot of information, but the screen should remain calm.

Achieve this through:

- clear grouping
- generous internal card padding
- consistent alignment
- restrained color
- limited visible borders
- strong typography
- intentional empty space

## 5.2 Progressive disclosure

Show the essential information first.

More detail should appear through:

- drawers
- expandable rows
- tooltips
- drill-down pages
- filters
- secondary tabs

## 5.3 One clear action per context

Each page should have one obvious primary action.

Examples:

- New lead
- Add exhibitor
- Create event
- Publish page
- Add media

## 5.4 Semantic color

Color must communicate meaning.

Gold is reserved for:

- active state
- selected state
- confirmed value
- important progress
- highlighted insight
- key commercial metric

Red, green and blue are used only for status semantics.

## 5.5 Consistency without sameness

All screens must feel related, but cards should not all look identical.

The system should provide a limited set of card archetypes and allow purposeful variation.

## 5.6 Operational speed

The UI should minimize repeated clicks.

Support:

- keyboard command palette
- quick creation
- inline editing where safe
- persistent filters
- saved views
- bulk actions
- recently viewed entities
- context-aware actions

---

# 6. Brand and Color System

The final tokens must reuse the exact brand colors from the website implementation.

## 6.1 Foundation tokens

```css
:root {
  --admin-bg: #e9e5e2;
  --admin-shell: #f5f3f1;

  --surface-0: #ffffff;
  --surface-1: #f7f6f4;
  --surface-2: #efedea;
  --surface-inverse: #151515;

  --text-primary: #171717;
  --text-secondary: #6d6964;
  --text-tertiary: #9b9690;
  --text-inverse: #ffffff;

  --border-soft: #e6e2de;
  --border-strong: #d5d0ca;

  --brand-gold: var(--spimar-gold);
  --brand-gold-soft: color-mix(
    in srgb,
    var(--spimar-gold) 12%,
    white
  );

  --success: #4f7d59;
  --warning: #b47a2d;
  --danger: #bd4f4f;
  --info: #526f91;
}
```

## 6.2 Recommended usage balance

- 70% warm whites and neutral surfaces
- 20% black typography and emphasis
- 10% gold accents and active states

## 6.3 Gold usage rules

Use gold for:

- active navigation indicator
- selected segmented control
- progress highlight
- confirmed commercial value
- important chart line
- primary action
- focus ring

Do not use gold for:

- every icon
- every border
- every heading
- large backgrounds
- decorative gradients
- multiple chart series

---

# 7. Typography

## 7.1 Typography layers

### Brand display typeface

Use the current SPIMARIMMO brand typeface for:

- page titles
- major numeric values
- editorial CMS previews
- strategic section headings

### Operational interface typeface

Use the existing neutral sans-serif for:

- navigation
- tables
- forms
- buttons
- labels
- filters
- metadata
- tooltips

## 7.2 Scale

```text
Display page title        40–48px / 0.98–1.05
Primary metric            32–40px
Section heading           20–24px
Card heading              15–17px
Body                      14–15px
Interface label           12–13px
Metadata                  11–12px
```

## 7.3 Numeric content

All financial and analytical values should use tabular numerals:

```css
font-variant-numeric: tabular-nums;
```

---

# 8. Spacing, Radius and Elevation

## 8.1 Spacing system

Use an 8-point base system:

```text
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64
```

## 8.2 Radius hierarchy

```css
--radius-shell: 32px;
--radius-panel: 22px;
--radius-card: 16px;
--radius-control: 12px;
--radius-small: 8px;
--radius-pill: 999px;
```

## 8.3 Elevation

```css
--shadow-shell:
  0 24px 70px rgba(20, 16, 12, 0.08),
  0 2px 10px rgba(20, 16, 12, 0.04);

--shadow-card:
  0 5px 18px rgba(20, 16, 12, 0.035);
```

Use shadows sparingly. Surface contrast and spacing should do most of the work.

---

# 9. Grid and Layout

## 9.1 Grid

- desktop: 12 columns
- tablet: 8 columns
- mobile: 4 columns

## 9.2 Main shell

Desktop structure:

```text
Global rail:          64–72px
Context sidebar:      220–260px
Top command bar:      56–64px
Main content:         flexible
Outer shell radius:   28–32px
```

## 9.3 Content width

Avoid overly wide text and tables.

- main dashboard may be fluid
- detail pages should use a comfortable maximum width
- editor screens may use split layouts
- forms should rarely span the entire viewport

## 9.4 Card spacing

- card gap: 12–16px
- section gap: 24–32px
- internal card padding: 16–24px

---

# 10. Information Architecture

## 10.1 Global navigation rail

1. Overview
2. CRM
3. Events
4. CMS
5. Analytics
6. Notifications
7. Settings

## 10.2 Contextual sidebar

### Overview

- Dashboard
- Activity
- Tasks
- Notifications

### CRM

- Leads
- Companies
- Exhibitors
- Contacts
- Opportunities
- Pipeline
- Appointments
- Follow-ups

### Events

- All exhibitions
- Countries
- Editions
- Exhibitor applications
- Booth packages
- Meetings
- Registrations

### CMS

- Pages
- Sections
- Events content
- Media library
- Navigation
- Forms
- Testimonials
- Partners
- SEO
- Redirects
- Translations

### Analytics

- Commercial performance
- Lead acquisition
- Exhibitor conversion
- Event performance
- Website performance
- Content performance
- Reports

---

# 11. Application Shell

## 11.1 Global rail

The global rail provides fast switching between major workspaces.

Requirements:

- icon + tooltip
- gold active indicator
- persistent location
- compact notification badges
- bottom settings and user access
- keyboard shortcuts

## 11.2 Context sidebar

The contextual sidebar changes according to the selected workspace.

Requirements:

- clear section title
- grouped navigation
- collapsible subsections
- visible active item
- optional item counts
- saved views
- recent entities

## 11.3 Command bar

The command bar provides:

- global search
- command palette
- recent entities
- quick create
- current event selector
- date range
- user menu
- notifications

Suggested placeholder:

> Rechercher un exposant, un lead, une page ou un événement…

## 11.4 Primary action

The primary action changes by context.

Examples:

- New lead
- Add exhibitor
- Create event
- Create page
- Upload media

---

# 12. North-Star Dashboard

## 12.1 Page title

**Vue d’ensemble**

Supporting copy:

> Pilotez les prospects, exposants, événements et contenus SPIMARIMMO depuis un seul espace.

## 12.2 Main metric

**Opportunités commerciales**

Example:

```text
2 480 000 MAD
+12.8% sur la période précédente
```

Below the metric, show pipeline distribution:

- Nouveau
- Qualifié
- Proposition
- Négociation
- Confirmé

## 12.3 Top insight cards

### Leads qualifiés

```text
128
+18 cette semaine
```

### Meilleure opportunité

```text
420 000 MAD
Promoteur / événement
```

Use black emphasis treatment.

### Exposants confirmés

```text
37 / 52
71%
```

### Prochain salon

```text
Paris
22 jours restants
```

## 12.4 Main cards

### Commercial pipeline

- estimated value
- monthly progression
- confirmed vs pending
- distribution by stage
- event filter
- owner filter

### Lead acquisition channels

- Contact form
- Brochure download
- WhatsApp
- LinkedIn
- Referral
- Direct outreach

### Event performance

- leads
- exhibitors
- meetings
- commercial value
- conversion rate
- comparison by city or edition

### Active opportunities

Columns:

- Company
- Contact
- Event
- Estimated value
- Stage
- Owner
- Next action
- Last activity

### CMS activity

- recently edited pages
- draft content
- pending translations
- missing SEO metadata
- scheduled publications

### Tasks requiring attention

Examples:

- 7 leads without follow-up
- 3 applications awaiting review
- 2 pages missing French translation
- 4 exhibitors missing documents
- 1 event page scheduled for publication

---

# 13. Component System

## 13.1 Structural components

- `AdminShell`
- `GlobalNavigationRail`
- `ContextSidebar`
- `CommandBar`
- `PageHeader`
- `DashboardGrid`
- `SectionHeader`
- `PageToolbar`
- `SplitPane`
- `DetailDrawer`

## 13.2 Data components

- `MetricCard`
- `InsightCard`
- `EmphasisCard`
- `ChartCard`
- `ProgressSummary`
- `DataTable`
- `EntityRow`
- `EntityCard`
- `ActivityFeed`
- `TrendIndicator`
- `Timeline`
- `PipelineStage`
- `KpiStrip`

## 13.3 Controls

- `FilterButton`
- `FilterBar`
- `DateRangeSelector`
- `SegmentedControl`
- `SearchCommand`
- `EntitySelector`
- `StatusBadge`
- `UserChip`
- `ActionMenu`
- `SavedViewSelector`
- `BulkActionBar`

## 13.4 Feedback

- `EmptyState`
- `Skeleton`
- `Toast`
- `InlineAlert`
- `ConfirmationDialog`
- `ErrorState`
- `PermissionState`
- `OfflineState`

## 13.5 Naming rule

Component names must describe meaning, not appearance.

Avoid:

- `PinkCard`
- `BlackWidget`
- `DashboardBox`
- `FancyPanel`

Prefer:

- `MetricCard`
- `OpportunitySummary`
- `EventPerformanceCard`
- `EntityStatus`

---

# 14. CRM Screen Direction

## 14.1 Leads list

The lead list must support:

- saved views
- filters
- search
- sorting
- bulk actions
- stage changes
- owner assignment
- next follow-up
- fast preview drawer

## 14.2 Lead row

Example structure:

```text
Atlas Développement
Yassine Amrani · Directeur commercial

Paris 2027          Qualifié
240 000 MAD         Sara B.
Suivi demain
```

## 14.3 Lead detail

Recommended layout:

- left: core company and contact information
- center: activity timeline
- right: opportunity value, stage, owner, next action
- bottom or drawer: documents, notes, appointments, history

## 14.4 Pipeline

The pipeline should support:

- stages by business process
- drag and drop
- total value by column
- owner filter
- event filter
- priority indicator
- overdue follow-up marker

---

# 15. CMS Screen Direction

## 15.1 CMS home

Show:

- pages needing attention
- draft count
- scheduled content
- translation gaps
- SEO issues
- recently published content
- media usage

## 15.2 Page editor

Recommended desktop structure:

- left: page structure / sections
- center: live content canvas
- right: settings and metadata
- top: preview, locale, status, publish

## 15.3 Content sections

Each section should be modular and reusable.

Examples:

- Hero
- Text block
- Metrics
- Events
- Countries
- Testimonials
- Partners
- CTA
- Media gallery
- FAQ
- Contact form

## 15.4 Publishing workflow

Statuses:

- Draft
- In review
- Approved
- Scheduled
- Published
- Archived

## 15.5 Localization

Support:

- French
- English
- Arabic
- locale completion state
- missing field indicators
- source locale comparison
- translation review status

---

# 16. Tables

Tables must be clean and operational.

## 16.1 Row height

- compact: 44–48px
- standard: 52–56px

## 16.2 Behavior

- sticky header
- clear selection state
- row hover
- contextual action menu
- optional row expansion
- column preferences
- saved views
- pagination or infinite loading
- preserved filter state

## 16.3 Visual rules

- soft row dividers
- no heavy grid lines
- primary information first
- secondary metadata below or muted
- status pills
- numeric alignment
- restrained density

## 16.4 Mobile behavior

Do not force every table into horizontal scrolling.

Use:

- cards
- stacked rows
- progressive disclosure
- mobile-specific priority fields
- bottom sheets for actions

---

# 17. Forms

## 17.1 Form philosophy

Forms should feel simple even when the workflow is complex.

## 17.2 Rules

- one clear label per field
- helper text only when necessary
- inline validation
- visible required fields
- clear section grouping
- predictable tab order
- save state feedback
- draft persistence
- destructive actions separated

## 17.3 Long forms

Use:

- step navigation
- collapsible sections
- sticky summary
- progress indicator
- autosave
- explicit final submit

---

# 18. Charts and Analytics

## 18.1 Chart palette

Use:

- gold for primary series
- black or dark grey for emphasis
- light grey for comparison
- semantic colors only for status

## 18.2 Chart rules

- no unnecessary legends
- direct labels where possible
- minimal axis lines
- clear period comparison
- value summary above chart
- accessible tooltips
- tabular numerals
- meaningful empty states

## 18.3 Recommended chart types

- line chart for performance over time
- stacked bar for stage distribution
- horizontal bars for acquisition channels
- donut only for a small number of categories
- table + sparkline for entity comparison
- funnel for conversion
- timeline for event milestones

---

# 19. Motion and Interaction

## 19.1 Timing

- micro interaction: 120–160ms
- panel transition: 180–240ms
- drawer or command palette: 220–320ms
- chart entrance: 300–450ms

## 19.2 Motion rules

- cards move no more than 1–2px on hover
- active navigation uses a sliding indicator
- filters update without page reload
- drawers are preferred over modal overload
- charts animate only once on first load
- reduced motion is fully supported

## 19.3 Loading

Use:

- structural skeletons
- row skeletons
- chart placeholders
- progressive content loading

Avoid full-page spinners whenever possible.

---

# 20. Responsive Behavior

## 20.1 Desktop

- full rail
- full contextual sidebar
- 12-column dashboard
- multi-panel layouts
- persistent filters

## 20.2 Tablet

- compact sidebar
- 8-column dashboard
- optional overlay navigation
- reduced card spans
- simplified tables

## 20.3 Mobile

- bottom or compact navigation
- stacked cards
- top-level actions remain visible
- filters open in bottom sheet
- tables become entity cards
- details open as full-screen sheets
- charts simplify
- no desktop layout shrinking

---

# 21. Accessibility

Minimum requirements:

- WCAG AA contrast
- visible keyboard focus
- full keyboard navigation
- semantic headings
- accessible form labels
- screen-reader chart summaries
- reduced-motion support
- touch targets at least 44px
- no status communicated by color alone
- table headers and relationships properly marked
- accessible dialogs and drawers

---

# 22. States

Every component and page must define:

- default
- hover
- focus
- active
- selected
- loading
- empty
- error
- disabled
- permission restricted
- offline
- partial data
- stale data

No page is considered complete without these states.

---

# 23. Roles and Permissions

Initial role model:

- Super Admin
- CEO / Executive
- CTO / Technical Admin
- Commercial Manager
- Sales Agent
- Event Manager
- Content Editor
- Translator
- Read-only Analyst

Permissions must control:

- visible navigation
- available actions
- editable fields
- publishing rights
- export rights
- financial data visibility
- user management

---

# 24. Design and Engineering Workflow

## Phase 00 — Audit and extraction

- audit current website design tokens
- extract exact brand colors
- identify typography
- map current admin code
- identify CRM and CMS entities
- define roles and permissions
- freeze information architecture

## Phase 01 — Design-system foundation

- tokens
- typography
- spacing
- radii
- surfaces
- buttons
- inputs
- badges
- navigation
- tables
- drawers
- feedback states
- component laboratory

## Phase 02 — Application shell

- global rail
- contextual sidebar
- command bar
- responsive shell
- permissions-aware navigation
- loading states
- empty states

## Phase 03 — Overview dashboard

- commercial summary
- lead channels
- event performance
- pipeline
- tasks
- CMS activity
- responsive composition

## Phase 04 — CRM

- lead list
- lead detail
- companies
- exhibitors
- contacts
- pipeline
- tasks
- appointments

## Phase 05 — Events

- event list
- event detail
- editions
- applications
- packages
- meetings
- registrations

## Phase 06 — CMS

- page index
- page editor
- media library
- navigation
- SEO
- localization
- publishing workflow

## Phase 07 — Analytics

- commercial performance
- acquisition
- conversion
- event analytics
- website analytics
- reporting

## Phase 08 — QA and hardening

- accessibility
- responsive
- real-content stress tests
- performance
- visual regression
- keyboard behavior
- permissions
- empty and error states

---

# 25. Acceptance Criteria

The design direction is accepted only when:

- the admin feels visually related to the public website
- the reference influence is visible in structure, not copied branding
- gold is used selectively
- the application shell feels distinctive
- the dashboard remains calm with real data
- CRM and CMS share one consistent system
- all primary workflows are clear
- tables remain readable
- mobile is intentionally designed
- accessibility is built in
- empty, loading and error states exist
- components are reusable and semantic
- there is no obvious template look
- visual hierarchy remains strong at every density level

---

# 26. Iteration Strategy

## Iteration 01 — North-star dashboard

Goal:

Establish the full visual grammar through one high-fidelity desktop screen.

Must include:

- global rail
- contextual sidebar
- command bar
- page title
- primary opportunity metric
- top insight cards
- commercial pipeline
- lead sources
- event performance
- active opportunities
- tasks requiring attention
- CMS activity

## Iteration 02 — CRM leads

Goal:

Validate the system under operational density.

Must include:

- saved views
- advanced filters
- lead table
- status system
- quick preview drawer
- bulk actions
- responsive behavior

## Iteration 03 — CMS editor

Goal:

Validate the system for content creation.

Must include:

- section tree
- live content canvas
- settings panel
- locale controls
- publishing workflow
- preview behavior

## Iteration 04 — Mobile system

Goal:

Confirm that the system is not desktop-only.

Must include:

- compact navigation
- mobile dashboard
- entity cards
- bottom sheets
- responsive chart behavior
- full-screen detail views

---

# 27. Final Direction Lock

The reference provides:

- the shell
- the modular rhythm
- the density
- the control language
- the chart discipline

SPIMARIMMO provides:

- the brand
- the gold accent
- the editorial identity
- the business context
- the content hierarchy
- the premium positioning

The admin product must be the controlled meeting point between both.

The objective is not to create another dashboard.

The objective is to create the internal operating system of SPIMARIMMO.
