# 05 — ADMIN DESIGN SYSTEM ARCHITECTURE

## 1. Design-system strategy

The admin design system must be related to the public SPIMARIMMO system but independently optimized for operational work.

Use three token layers:

```text
Foundation tokens
  ↓
SPIMAR brand semantic tokens
  ↓
Admin component tokens
```

Do not style the admin directly with the current `--hoy-*` reference namespace.

---

## 2. Token architecture

### Foundation

- raw color values
- font families
- spacing
- radii
- shadows
- durations
- z-index

### Semantic

- background
- surface
- text
- border
- brand
- success
- warning
- danger
- information
- focus
- selection

### Component

- button background
- input border
- table row height
- sidebar width
- card padding
- chart grid
- badge colors
- drawer width

Example:

```css
:root {
  --spimar-ink: #171717;
  --spimar-gold: #c9972f;
  --spimar-paper: #f7f5f2;

  --admin-bg: #e9e5e2;
  --admin-shell: #f5f3f1;
  --surface-primary: #ffffff;
  --surface-secondary: #f7f6f4;
  --surface-inverse: var(--spimar-ink);

  --text-primary: #171717;
  --text-secondary: #6d6964;
  --text-tertiary: #99938d;
  --text-inverse: #ffffff;

  --border-subtle: #e7e3df;
  --border-strong: #d6d0ca;
  --focus-ring: var(--spimar-gold);
}
```

Final brand values must be extracted from the accepted public design system.

---

## 3. Visual direction

### Personality

- calm
- fresh
- precise
- warm
- architectural
- quietly premium
- highly readable

### Balance

- 70% warm neutral surfaces
- 20% black text and emphasis
- 10% gold and semantic accents

### Avoid

- all-black admin
- gold gradients
- glow
- repeated identical cards
- heavy shadows
- arbitrary chart colors
- decorative motion
- generic template composition

---

## 4. Layout system

### Desktop shell

```text
Global rail          64–72px
Context sidebar      220–260px
Top command bar      56–64px
Main content         flexible
Outer radius         28–32px
```

### Grid

- desktop: 12 columns
- tablet: 8 columns
- mobile: 4 columns

### Spacing

```text
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64
```

### Radius

```text
Shell       32px
Panel       22px
Card        16px
Control     10–12px
Small       8px
Pill        999px
```

---

## 5. Typography

Use a dual-layer typography system.

### Brand/display

For:

- page titles
- executive metrics
- editorial preview
- selected section headings

### Interface

For:

- navigation
- forms
- tables
- buttons
- labels
- metadata
- tooltips

Scale:

```text
Page display        40–48px
Primary metric      32–40px
Section heading     20–24px
Card heading        15–17px
Body                14–15px
Interface label     12–13px
Metadata            11–12px
```

Use tabular numerals for financial and analytical values.

---

## 6. Component layers

### Primitives

- Button
- IconButton
- Link
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Avatar
- Tooltip
- Popover
- Dialog
- Drawer
- Tabs
- SegmentedControl
- Progress
- Skeleton
- Divider

### Composition

- FormField
- SearchField
- FilterButton
- FilterBar
- DateRange
- EntitySelector
- UserChip
- StatusControl
- CommandItem
- ActionMenu
- BulkActionBar
- EmptyState
- InlineAlert

### Product components

- AdminShell
- GlobalRail
- ContextSidebar
- CommandBar
- PageHeader
- MetricCard
- ChartCard
- EntityTable
- EntityCard
- LeadStageControl
- ActivityTimeline
- EvidenceStatus
- TranslationStatus
- PublicationStatus
- EventLifecycleControl
- ConsentHistory
- ResourceDeliveryStatus
- IntegrationHealth

---

## 7. Status system

Status colors must communicate semantics and remain accessible.

### Publication

- Draft: neutral
- In review: information
- Changes requested: warning
- Approved: success-muted
- Scheduled: gold
- Published: success
- Withdrawn: danger-muted
- Archived: neutral-dark

### CRM

- New: neutral
- Qualified: information
- Meeting: gold-muted
- Proposal: gold
- Negotiation: warning
- Won: success
- Lost: danger
- Nurture: violet-neutral
- Onboarding: teal-neutral

### Evidence

- Missing: danger-muted
- Submitted: information
- Verified: success
- Rejected: danger

Color is always paired with text or icon.

---

## 8. Tables

### Standard behavior

- sticky header
- 52–56px standard rows
- 44–48px compact rows
- soft dividers
- visible selection
- keyboard row navigation
- column preferences
- saved views
- bulk actions after selection
- context menu at row end

### Mobile

Tables transform into structured entity cards.

Do not simply hide important columns.

---

## 9. Editors

The CMS editor should use a three-pane model on large screens:

```text
Structure tree | Live canvas | Settings
```

Behavior:

- resizable panes
- locale preview
- viewport preview
- autosave state
- validation panel
- unsaved-change guard
- version history
- publish controls

On tablet:

- structure becomes drawer
- settings becomes drawer

On mobile:

- one pane at a time
- sticky mode switcher
- full-screen preview

---

## 10. Forms

Rules:

- label always visible
- helper text only when needed
- errors inline
- required state explicit
- autosave for long workflows
- draft preservation
- field groups
- sticky summary for long forms
- destructive actions separated

Forms must use schema-driven definitions where possible.

---

## 11. Motion

Timing:

- micro: 120–160ms
- panel: 180–240ms
- drawer: 220–320ms
- chart entrance: 300–450ms

Rules:

- no large hover lifts
- no motion required for comprehension
- active navigation indicator may slide
- charts animate only on first meaningful load
- reduced-motion support is mandatory

---

## 12. Accessibility

Minimum:

- WCAG AA contrast
- visible focus
- full keyboard support
- 44px touch targets
- semantic forms
- screen-reader summaries for charts
- table headers and relationships
- accessible dialogs and drawers
- no color-only state
- RTL support
- zoom to 200%
- robust long-text handling

---

## 13. Component quality gates

A component is complete only when it includes:

- default
- hover
- focus
- active
- selected
- loading
- empty
- error
- disabled
- permission-restricted
- RTL
- reduced motion
- responsive behavior
- visual regression test
- accessibility test

---

## 14. Recommended code organization

```text
components/
  admin/
    shell/
    navigation/
    data-display/
    crm/
    events/
    cms/
    analytics/
    settings/

  primitives/
    actions/
    forms/
    overlays/
    feedback/
    data-display/

styles/
  tokens/
    foundation.css
    brand.css
    admin.css
  components/
  utilities/

lib/
  admin/
    navigation.ts
    permissions.ts
    saved-views.ts
    command-search.ts
```

The public and admin products may share primitives, but product-specific compositions should remain separate.
