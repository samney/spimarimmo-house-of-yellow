# SPIMARIMMO ADMIN — PRODUCT BLUEPRINT

**Product name:** SPIMAR Control  
**Scope:** Admin + CRM + CMS  
**Version:** 1.0  
**Date:** 2026-08-05  
**Status:** Architecture and UX kickoff

---

## Purpose

This package defines the product architecture, sitemap, user journeys, public-funnel integration, screen inventory, design-system architecture, permissions model, and implementation sequence for the authenticated SPIMARIMMO platform.

It is designed to connect three layers into one coherent system:

1. **The public SPIMARIMMO website**
   - B2B conversion
   - exhibitor acquisition
   - visitor registration
   - brochure and resource downloads
   - appointment booking
   - proof, event and content publishing

2. **The CRM**
   - organizations
   - contacts
   - leads
   - qualification
   - ownership
   - opportunities
   - appointments
   - tasks
   - activity history
   - attribution and reporting

3. **The CMS**
   - pages
   - reusable sections
   - event content
   - packages
   - resources
   - articles
   - media
   - metrics and evidence
   - case studies
   - testimonials
   - navigation
   - SEO
   - localization
   - publication workflow

The platform is not three separate products. It is one operating system with shared entities, permissions, audit history, localization, analytics, and design language.

---

## Grounding

This blueprint is based on:

- `SPIMARIMMO_Specifications_Strategie_UX_Contenus(2).pdf`
- the current repository `samney/spimarimmo-house-of-yellow`
- the existing Supabase schema and Edge Function contracts
- the current Next.js and internationalization setup
- the approved SPIMAR Control dashboard visual direction

The strategic document defines the public site as a B2B conversion engine built around the sequence:

> **Promesse → Preuve → ROI → Conversion**

It prioritizes the exhibitor journey while keeping the visitor journey accessible and measurable.

The repository already contains a substantial backend contract, but it explicitly does not yet contain a connected admin UI, hosted Supabase readiness, or connected public forms. This package defines the missing product layer.

---

## Package map

| File | Purpose |
|---|---|
| `01_PRODUCT_ARCHITECTURE_AND_SITEMAP.md` | Application architecture, modules, routes and navigation |
| `02_USER_JOURNEYS_AND_END_TO_END_FLOWS.md` | Staff and customer journeys from authentication to conversion |
| `03_PUBLIC_FUNNEL_TO_CMS_CRM_MAPPING.md` | Exact bridge between website actions, CMS content and CRM records |
| `04_UI_UX_SCREEN_INVENTORY.md` | Complete screen and state inventory from auth to settings |
| `05_ADMIN_DESIGN_SYSTEM_ARCHITECTURE.md` | Scalable admin design-system rules and component architecture |
| `06_DATA_DOMAINS_ROLES_AND_PERMISSIONS.md` | Entity map, ownership, roles and permission behavior |
| `07_IMPLEMENTATION_ROADMAP_AND_ACCEPTANCE.md` | Delivery phases, work packages and acceptance gates |

---

## Product north star

> SPIMAR Control is the internal operating system that turns public interest into qualified commercial action, governed content and measurable event performance.

---

## Core decisions

- The public website remains the start of the funnel.
- Every public conversion must become a durable, attributable and auditable record.
- CRM and CMS share events, resources, organizations, media and evidence.
- The admin uses the public brand identity without copying the public website layout.
- The interface is light, calm, precise and operational.
- Gold is used as a controlled semantic accent.
- No unverified metric, package price, event capacity or claim may be published.
- French, English and Arabic are first-class locales.
- Mobile is a deliberate product experience, not a reduced desktop view.
- Permissions affect navigation, data visibility and available actions.
- Every meaningful mutation creates an audit trail.


---

## Claude Code auto-mode execution

This package now includes the complete execution layer for Claude Code:

- master implementation prompt
- auto-mode task queue
- per-task definition of done
- screen / route / component / data matrix
- visual implementation rules
- nine approved visual references

Start Claude Code from the project root and provide:

```text
Read the full SPIMAR Control blueprint package, beginning with
11_CLAUDE_CODE_AUTOMODE_MASTER_PROMPT.md.

Then execute 12_AUTOMODE_EXECUTION_QUEUE.md continuously in task order.
Update the queue, checklist, evidence and documentation after every task.
Do not stop after scaffolding.
```
