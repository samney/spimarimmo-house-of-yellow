# Spimar Immo — Decision Log

## D-006 — Mobile-first conversion architecture

**Status:** Proposed for approval  
**Date:** 2026-07-29

The main landing page will be designed at 390 px first and validated down to 320 px
before desktop expansion. Mobile campaign visitors receive featured-event facts,
trust and registration priority; desktop adds richer media and editorial composition
without changing the core sequence.

Consequences:

- Persistent mobile bottom CTA after the hero.
- Two-step mobile registration flow.
- No autoplay hero video on constrained mobile connections.
- Separate mobile image crops.
- French, English and Arabic/RTL mobile QA is mandatory.

This file records approved product decisions that downstream creative and engineering work must follow.

## DEC-001 — Canonical Main Landing Page

- **Status:** APPROVED
- **Decision:** Start with the main Spimar Immo landing page.
- **Consequence:** It defines the shared layout, conversion components, content hierarchy, tokens and behavior used by event-location pages.

## DEC-002 — Multi-Location Platform

- **Status:** APPROVED
- **Decision:** Support all event locations from one reusable platform.
- **Consequence:** Locations are CMS/data entries. Separate copy-pasted websites or code forks are prohibited.

## DEC-003 — Multilingual and RTL

- **Status:** APPROVED
- **Decision:** French, Arabic and English are first-class initial locales.
- **Consequence:** UX, content models, routes, components and QA must support LTR and RTL from the start. Additional market languages remain extensible.

## DEC-004 — Authentic Source Assets

- **Status:** APPROVED
- **Decision:** Use real Spimar brand files, partner logos and previous-event media where available.
- **Consequence:** Real documentary event imagery must not be replaced by synthetic “proof.” Generated media may support campaign art direction but must remain clearly non-documentary.

## DEC-005 — Clean Engineering Start

- **Status:** APPROVED
- **Decision:** Start from scratch.
- **Consequence:** Claude Code will initialize a clean Next.js architecture after UX, creative direction and asset gates are approved.

## Open Decisions

- Featured event shown in the main hero.
- CMS and database.
- Registration workflow and CRM/lead destination.
- Consent and privacy requirements.
- Final content ownership and publishing roles.
