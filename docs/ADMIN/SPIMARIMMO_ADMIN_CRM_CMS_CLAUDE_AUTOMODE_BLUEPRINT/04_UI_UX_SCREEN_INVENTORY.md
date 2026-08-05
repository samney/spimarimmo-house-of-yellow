# 04 — UI / UX SCREEN INVENTORY

## 1. Inventory rules

Every screen must define:

- desktop
- tablet
- mobile
- loading
- empty
- error
- permission-restricted
- offline or stale-data state where relevant
- keyboard behavior
- destructive-action behavior

---

## 2. Authentication

| ID | Screen | Purpose |
|---|---|---|
| AUTH-01 | Login | Email and password |
| AUTH-02 | Forgot password | Request reset |
| AUTH-03 | Reset password | Create new password |
| AUTH-04 | Invitation | Accept team invitation |
| AUTH-05 | Email verification | Confirm identity |
| AUTH-06 | MFA setup | Configure second factor |
| AUTH-07 | MFA challenge | Verify session |
| AUTH-08 | Session expired | Re-authenticate safely |
| AUTH-09 | Access denied | Explain missing access |
| AUTH-10 | Account disabled | Contact administrator |

---

## 3. Onboarding

| ID | Screen | Purpose |
|---|---|---|
| ONB-01 | Profile setup | Name, avatar, locale |
| ONB-02 | Workspace selection | Select site when multiple are available |
| ONB-03 | Role summary | Explain permission scope |
| ONB-04 | First-run checklist | Configure useful defaults |
| ONB-05 | Product tour | Contextual introduction |

---

## 4. Application shell

| ID | Screen / state | Purpose |
|---|---|---|
| SHELL-01 | Full desktop shell | Rail, sidebar, command bar |
| SHELL-02 | Collapsed sidebar | More data width |
| SHELL-03 | Tablet shell | Overlay sidebar |
| SHELL-04 | Mobile shell | Bottom navigation |
| SHELL-05 | Command palette | Cross-entity search and actions |
| SHELL-06 | Notifications panel | Alerts and updates |
| SHELL-07 | User menu | Profile, locale, logout |
| SHELL-08 | Site switcher | Change current site |
| SHELL-09 | Event switcher | Change current event context |

---

## 5. Overview

| ID | Screen | Purpose |
|---|---|---|
| OVR-01 | Executive overview | Commercial, event and CMS summary |
| OVR-02 | My day | Personal tasks and appointments |
| OVR-03 | Activity stream | Cross-workspace activity |
| OVR-04 | Tasks | Personal and team tasks |
| OVR-05 | Notifications | Operational alerts |
| OVR-06 | Dashboard customization | Choose visible cards |

---

## 6. CRM

### Leads

| ID | Screen | Purpose |
|---|---|---|
| CRM-01 | Leads list | Search, filters, saved views |
| CRM-02 | Lead quick preview | Fast drawer |
| CRM-03 | Lead detail | Full record |
| CRM-04 | Lead activity | Timeline |
| CRM-05 | Lead assignment | Assign owner or queue |
| CRM-06 | Lead merge | Resolve duplicates |
| CRM-07 | Lead stage change | Controlled transition |
| CRM-08 | Lost reason | Required loss classification |
| CRM-09 | New lead | Manual creation |
| CRM-10 | Bulk actions | Assignment, stage, export |

### Pipeline and opportunities

| ID | Screen | Purpose |
|---|---|---|
| CRM-11 | Pipeline board | Stage-based workflow |
| CRM-12 | Opportunity detail | Value, package, event, probability |
| CRM-13 | Proposal history | Proposal versions |
| CRM-14 | Forecast | Commercial forecast |
| CRM-15 | Won conversion | Convert to exhibitor onboarding |

### Organizations and contacts

| ID | Screen | Purpose |
|---|---|---|
| CRM-16 | Organizations list | Companies and developers |
| CRM-17 | Organization detail | Contacts, leads, events |
| CRM-18 | Contacts list | People directory |
| CRM-19 | Contact detail | Identity, consent and history |
| CRM-20 | Duplicate resolution | Merge identities |
| CRM-21 | Consent history | Purpose and withdrawal |

### Exhibitors

| ID | Screen | Purpose |
|---|---|---|
| CRM-22 | Exhibitors list | Active and historical exhibitors |
| CRM-23 | Exhibitor detail | Commercial and event profile |
| CRM-24 | Onboarding checklist | Assets and obligations |
| CRM-25 | Public profile preview | Validate public exhibitor card |
| CRM-26 | Documents | Contract and operational assets |

### Tasks and appointments

| ID | Screen | Purpose |
|---|---|---|
| CRM-27 | Task board | Team workflow |
| CRM-28 | Calendar | Appointments |
| CRM-29 | Appointment detail | Booking and provider state |
| CRM-30 | Availability | Public slots |
| CRM-31 | Create task | Follow-up |
| CRM-32 | Call / email log | Activity creation |

### Imports and exports

| ID | Screen | Purpose |
|---|---|---|
| CRM-33 | Import upload | Map CSV |
| CRM-34 | Import validation | Resolve invalid rows |
| CRM-35 | Import result | Created, linked, rejected |
| CRM-36 | Export builder | Permission-controlled export |
| CRM-37 | Export history | Audit downloads |

---

## 7. Events

| ID | Screen | Purpose |
|---|---|---|
| EVT-01 | Events list | Lifecycle and availability |
| EVT-02 | Event creation | Core identity |
| EVT-03 | Event overview | Operational summary |
| EVT-04 | Event lifecycle | State controls and history |
| EVT-05 | Venue | Address and localized instructions |
| EVT-06 | Dates and windows | Sales and registration windows |
| EVT-07 | Packages | Standard, Premium, Sponsor, Custom |
| EVT-08 | Package editor | Price, capacity, evidence |
| EVT-09 | Exhibitor applications | Review applications |
| EVT-10 | Exhibitors | Confirmed participants |
| EVT-11 | Visitor registrations | Registration overview |
| EVT-12 | Appointments | Event meeting schedule |
| EVT-13 | Program | Sessions and conferences |
| EVT-14 | Media | Event gallery |
| EVT-15 | Public event preview | Full page preview |
| EVT-16 | Reporting | Attendance, leads and outcomes |
| EVT-17 | Post-event closeout | Evidence and archive checklist |
| EVT-18 | Postpone / cancel | Controlled exceptional states |

---

## 8. CMS

### Pages and sections

| ID | Screen | Purpose |
|---|---|---|
| CMS-01 | CMS overview | Content requiring attention |
| CMS-02 | Pages list | Status, locale, SEO |
| CMS-03 | Create page | Template and route |
| CMS-04 | Page editor | Structure, canvas, settings |
| CMS-05 | Section library | Reusable section types |
| CMS-06 | Section editor | Schema-driven content |
| CMS-07 | Page preview | Locale and viewport |
| CMS-08 | Revision history | Compare and restore |
| CMS-09 | Publication dialog | Publish or schedule |
| CMS-10 | Archive / withdraw | Controlled removal |

### Domain content

| ID | Screen | Purpose |
|---|---|---|
| CMS-11 | Resources | Brochures, reports, guides |
| CMS-12 | Resource versions | Version and delivery context |
| CMS-13 | Articles | SEO content |
| CMS-14 | Article editor | Rich body and relations |
| CMS-15 | Case studies | Proof content |
| CMS-16 | Case-study editor | Objectives, results, media |
| CMS-17 | Testimonials | Quotes and video |
| CMS-18 | Partners | Logos, kind and evidence |
| CMS-19 | Metrics | Sourced proof |
| CMS-20 | Evidence review queue | Verify or reject claims |
| CMS-21 | FAQ | Audience and event scope |

### Media

| ID | Screen | Purpose |
|---|---|---|
| CMS-22 | Media library | Search and filter |
| CMS-23 | Upload media | File validation |
| CMS-24 | Media detail | Rights, alt, focal point |
| CMS-25 | Media usage | Where asset is used |
| CMS-26 | Replace media | Preserve usage |
| CMS-27 | Expiring rights | Risk management |

### Navigation, forms and SEO

| ID | Screen | Purpose |
|---|---|---|
| CMS-28 | Navigation manager | Header, mobile, footer |
| CMS-29 | Form definitions | Versioned forms |
| CMS-30 | Form editor | Fields, consent and availability |
| CMS-31 | SEO index | Route-level health |
| CMS-32 | SEO editor | Metadata and structured data |
| CMS-33 | Redirects | Redirect rules |
| CMS-34 | Publishing queue | Scheduled work |
| CMS-35 | Translation dashboard | Locale completion |
| CMS-36 | Translation editor | Side-by-side locale editing |

---

## 9. Analytics

| ID | Screen | Purpose |
|---|---|---|
| ANA-01 | Commercial performance | Pipeline and value |
| ANA-02 | Acquisition | Source and campaign |
| ANA-03 | Conversion | Funnel performance |
| ANA-04 | Event performance | Compare events |
| ANA-05 | Website performance | Pages and CTAs |
| ANA-06 | Content performance | Resources and articles |
| ANA-07 | Locale performance | FR / EN / AR |
| ANA-08 | Evidence health | Proof readiness |
| ANA-09 | Report builder | Save and export reports |
| ANA-10 | Scheduled reports | Delivery settings |

---

## 10. Settings

| ID | Screen | Purpose |
|---|---|---|
| SET-01 | Workspace | Name, timezone, defaults |
| SET-02 | Sites | Site records |
| SET-03 | Domains | Canonical domains |
| SET-04 | Locales | Enabled languages and direction |
| SET-05 | Team | Users and invitations |
| SET-06 | Role detail | Role permissions |
| SET-07 | Permission override | User-level exceptions |
| SET-08 | Integrations | CRM, email, calendar, webhooks |
| SET-09 | Integration health | Provider status |
| SET-10 | Notifications | User and team preferences |
| SET-11 | Legal documents | Privacy, terms, notices |
| SET-12 | Consent definitions | Purpose and legal basis |
| SET-13 | Retention | Data lifecycle |
| SET-14 | Audit log | Security and mutation history |
| SET-15 | Appearance | Admin theme and density |
| SET-16 | API / webhook keys | Restricted technical settings |

---

## 11. System states

| ID | Screen | Purpose |
|---|---|---|
| SYS-01 | 403 | Permission denied |
| SYS-02 | 404 | Not found |
| SYS-03 | 409 | Concurrent edit conflict |
| SYS-04 | 422 | Validation failure |
| SYS-05 | 500 | Internal error |
| SYS-06 | Offline | Connectivity loss |
| SYS-07 | Stale data | Refresh required |
| SYS-08 | Maintenance | Planned downtime |
| SYS-09 | Provider degraded | Integration problem |
| SYS-10 | Unsaved changes | Navigation guard |

---

## 12. First visual iteration sequence

The first screen set should be produced in this order:

1. Login
2. Invitation acceptance
3. Overview dashboard
4. Leads list
5. Lead detail
6. Pipeline
7. Event overview
8. CMS pages list
9. CMS page editor
10. Media library
11. Translation dashboard
12. Settings / team and roles
13. Mobile overview
14. Mobile lead detail

This order establishes the shell, operational density, editor behavior, governance and responsive model.
