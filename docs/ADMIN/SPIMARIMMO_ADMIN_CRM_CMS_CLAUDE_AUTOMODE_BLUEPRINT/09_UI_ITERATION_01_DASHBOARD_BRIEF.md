# SPIMARIMMO ADMIN UI — ITERATION 01
## North-Star Dashboard Creative Brief

**Iteration:** 01  
**Screen:** Vue d’ensemble  
**Target:** Desktop, 16:10 composition  
**Purpose:** Define the visual direction before implementation  
**Output quality:** High-fidelity, presentation-ready, 4K-inspired UI exploration

---

# 1. Objective

Create the first complete visual direction for the SPIMARIMMO CRM / CMS admin platform.

The screen should demonstrate:

- the new admin shell
- the connection with the public website
- the black and gold identity
- the reverse-engineered structure of the reference
- the information hierarchy
- the card system
- the chart language
- the navigation model
- the overall level of polish

This screen is not a final implementation.

It is the north-star visual reference used to validate the direction before building the design system and production components.

---

# 2. Visual Mood

The screen should feel:

- calm
- fresh
- modern
- architectural
- precise
- premium
- operational
- elegant without being luxurious
- data-rich without being crowded

Avoid:

- generic SaaS styling
- excessive black
- excessive gold
- gradients
- neon effects
- heavy shadows
- bright pink
- playful startup visuals
- old enterprise dashboard patterns

---

# 3. Composition

## 3.1 Outer environment

- warm beige-grey background
- large centered application shell
- soft floating shadow
- rounded outer corners
- generous framing around the application

## 3.2 Global rail

A slim vertical rail on the far left.

Include icons for:

- Overview
- CRM
- Events
- CMS
- Analytics
- Notifications
- Settings

The active item uses a gold indicator and a subtle soft-gold background.

## 3.3 Context sidebar

Title:

**SPIMAR Control**

Sections:

- Vue d’ensemble
- Activité
- Tâches

CRM group:

- Leads
- Entreprises
- Exposants
- Opportunités
- Pipeline

CMS group:

- Pages
- Événements
- Médias
- Traductions
- SEO

Use restrained nesting and clear active-state hierarchy.

## 3.4 Command bar

Top area should contain:

- global search
- current event selector
- date range
- notifications
- user avatar
- gold primary action button

Search placeholder:

> Rechercher un exposant, un lead, une page ou un événement…

Primary action:

**Nouveau lead**

---

# 4. Main Header

Title:

**Vue d’ensemble**

Supporting text:

> Pilotez les prospects, exposants, événements et contenus SPIMARIMMO depuis un seul espace.

Right-side controls:

- date range
- filters
- export
- customize dashboard

---

# 5. Primary Metric

Label:

**Opportunités commerciales**

Value:

**2 480 000 MAD**

Trend:

**+12.8%**

Subtext:

> par rapport à la période précédente

Include a segmented pipeline strip:

- Nouveau
- Qualifié
- Proposition
- Négociation
- Confirmé

The confirmed segment should use the gold accent.

---

# 6. Top Insight Cards

## Card 01 — Leads qualifiés

Value:

**128**

Supporting text:

**+18 cette semaine**

## Card 02 — Meilleure opportunité

Use a black emphasis card.

Value:

**420 000 MAD**

Entity:

**Atlas Développement**

Event:

**Paris 2027**

## Card 03 — Exposants confirmés

Value:

**37 / 52**

Progress:

**71%**

## Card 04 — Prochain salon

City:

**Paris**

Date:

**24–26 octobre**

Status:

**22 jours restants**

---

# 7. Main Dashboard Cards

## 7.1 Acquisition des leads

Compact list with:

- Formulaire de contact
- Téléchargement brochure
- WhatsApp
- LinkedIn
- Recommandation

Each row includes:

- leads
- percentage
- small trend

## 7.2 Pipeline commercial

Large analytical card.

Include:

- monthly bar chart
- confirmed value in gold
- pending value in soft grey
- filter by event
- segmented toggle:
  - Valeur
  - Leads
  - Conversion

## 7.3 Performance par événement

Large card on the right.

Include:

- Paris
- Bruxelles
- Montréal
- Dubai

Metrics:

- leads
- exhibitors
- meetings
- value
- conversion rate

Use one gold line and one muted comparison line.

## 7.4 Opportunités actives

Compact table:

- company
- event
- stage
- owner
- value
- next action

## 7.5 Tâches prioritaires

Use a soft gold-tinted card.

Items:

- 7 leads sans suivi
- 3 candidatures à valider
- 4 exposants avec documents manquants
- 2 pages sans traduction anglaise

## 7.6 Activité CMS

Include:

- recently edited pages
- scheduled publication
- translation status
- SEO warnings

---

# 8. Visual Language

## 8.1 Surfaces

- white main canvas
- soft warm grey secondary cards
- black emphasis card
- very light gold attention surface

## 8.2 Typography

- large editorial title
- clean operational body font
- tabular numbers
- strong contrast
- small but readable labels

## 8.3 Controls

- compact rounded rectangles
- subtle borders
- small icons
- minimal pills
- gold selected state
- no oversized buttons

## 8.4 Charts

- neutral bars
- gold highlight
- light grid lines
- direct labels
- minimal axes
- no decorative gradients

## 8.5 Radius

- large application shell
- medium cards
- smaller controls
- pills only for statuses and filters

---

# 9. Responsive Intent

The desktop screen should already suggest a responsive system.

Design cards so that they can collapse into:

- 2 columns on tablet
- 1 column on mobile

The contextual sidebar should be able to become an overlay.

Tables must be convertible into entity cards.

---

# 10. Review Checklist

Approve the iteration only when:

- the screen feels connected to SPIMARIMMO
- the reference influence is visible but not copied
- the dashboard is calm and premium
- gold is selective and controlled
- the shell feels distinctive
- data hierarchy is clear
- charts are restrained
- cards do not all look identical
- CRM and CMS coexist naturally
- the screen is detailed enough to guide implementation
- the design does not look like a generic template

---

# 11. Next Iteration After Approval

After validating the north-star dashboard, produce:

1. CRM leads list
2. Lead detail drawer
3. CRM pipeline board
4. CMS page editor
5. Mobile dashboard

Each screen must inherit the same token system, spacing, navigation and interaction rules.
