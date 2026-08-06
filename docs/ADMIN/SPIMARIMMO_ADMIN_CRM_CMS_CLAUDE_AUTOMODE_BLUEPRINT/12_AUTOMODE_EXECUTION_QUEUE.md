# SPIMAR CONTROL — AUTO-MODE EXECUTION QUEUE

## Status legend

```text
TODO
IN_PROGRESS
BLOCKED
DONE
VERIFIED
```

Do not mark `VERIFIED` without test or browser evidence.

---

# WAVE 0 — AUDIT AND ALIGNMENT

- [ ] ADM-000 Repository tree and route audit
- [ ] ADM-001 Current public implementation audit
- [ ] ADM-002 Backend migrations, RLS and Edge Function audit
- [ ] ADM-003 Hosted Supabase readiness gap report
- [ ] ADM-004 Existing design-token and primitive audit
- [ ] ADM-005 Auth and session architecture decision
- [ ] ADM-006 Provider-neutral repository adapter plan
- [ ] ADM-007 Route, entity and permission alignment report
- [ ] ADM-008 Establish admin ADR log
- [ ] ADM-009 Freeze implementation sequence

**Wave exit gate**

- [ ] No unknown critical backend dependency
- [ ] No conflicting route architecture
- [ ] No unresolved role model mismatch
- [ ] Initial checks pass

---

# WAVE 1 — DESIGN SYSTEM

- [ ] ADM-010 SPIMAR semantic color tokens
- [ ] ADM-011 Admin surface and elevation tokens
- [ ] ADM-012 Admin typography and numeric system
- [ ] ADM-013 Spacing, grid and radius tokens
- [ ] ADM-014 Buttons and icon buttons
- [ ] ADM-015 Inputs, select, textarea and validation
- [ ] ADM-016 Checkbox, radio, switch and segmented controls
- [ ] ADM-017 Badge and status system
- [ ] ADM-018 Tooltip, popover and command items
- [ ] ADM-019 Dialog, drawer and confirmation patterns
- [ ] ADM-020 Tables and entity rows
- [ ] ADM-021 Cards, metrics and chart containers
- [ ] ADM-022 Skeleton, empty, error and permission states
- [ ] ADM-023 RTL and reduced-motion foundations
- [ ] ADM-024 Component laboratory / documentation
- [ ] ADM-025 Visual regression baseline

**Wave exit gate**

- [ ] All primitives responsive
- [ ] WCAG AA checks pass
- [ ] RTL checked
- [ ] Visual snapshots approved

---

# WAVE 2 — SHELL, AUTH AND ONBOARDING

- [ ] ADM-030 Admin route group and protected layout
- [ ] ADM-031 Global rail
- [ ] ADM-032 Contextual sidebar
- [ ] ADM-033 Command bar
- [ ] ADM-034 Command palette
- [ ] ADM-035 Site and event switchers
- [ ] ADM-036 Notification panel
- [ ] ADM-037 Mobile shell
- [ ] ADM-038 Login
- [ ] ADM-039 Forgot and reset password
- [ ] ADM-040 Invitation acceptance
- [ ] ADM-041 Session expiry
- [ ] ADM-042 MFA states
- [ ] ADM-043 Role-aware route guard
- [ ] ADM-044 Access denied and disabled account
- [ ] ADM-045 First-run onboarding
- [ ] ADM-046 Auth browser journey suite

**Visual references**

- `VISUAL_02_AUTH_LOGIN.png`
- `VISUAL_03_ONBOARDING.png`
- `VISUAL_01_OVERVIEW_DASHBOARD.png`

---

# WAVE 3 — PUBLIC ACQUISITION VERTICAL SLICE

- [ ] ADM-050 Form-definition repository adapter
- [ ] ADM-051 Public exhibitor form connected to schema
- [ ] ADM-052 Consent version capture
- [ ] ADM-053 Attribution context capture
- [ ] ADM-054 Idempotent durable submission
- [ ] ADM-055 Contact and organization deduplication
- [ ] ADM-056 Lead creation or duplicate linkage
- [ ] ADM-057 Queue and owner assignment
- [ ] ADM-058 Initial activity and follow-up task
- [ ] ADM-059 Durable acknowledgement screen
- [ ] ADM-060 Public reference status screen
- [ ] ADM-061 Full exhibitor enquiry browser test
- [ ] ADM-062 Negative and retry cases

**Wave exit gate**

- [ ] Public form creates correct records
- [ ] Duplicate retries do not create duplicates
- [ ] Consent and attribution are stored
- [ ] UI never reports provider success prematurely
- [ ] RLS verified in browser context

---

# WAVE 4 — OVERVIEW AND CRM

- [ ] ADM-070 Overview dashboard data contract
- [ ] ADM-071 Overview dashboard implementation
- [ ] ADM-072 My Day
- [ ] ADM-073 Activity stream
- [ ] ADM-074 Team tasks
- [ ] ADM-075 Leads list
- [ ] ADM-076 Saved views
- [ ] ADM-077 Lead preview drawer
- [ ] ADM-078 Lead detail
- [ ] ADM-079 Activity timeline
- [ ] ADM-080 Notes
- [ ] ADM-081 Tasks
- [ ] ADM-082 Appointments
- [ ] ADM-083 Attribution view
- [ ] ADM-084 Consent view
- [ ] ADM-085 Assignment
- [ ] ADM-086 Stage transitions
- [ ] ADM-087 Lost reason
- [ ] ADM-088 Organizations list and detail
- [ ] ADM-089 Contacts list and detail
- [ ] ADM-090 Pipeline board
- [ ] ADM-091 Opportunity detail
- [ ] ADM-092 Won to exhibitor onboarding
- [ ] ADM-093 CRM export with audit
- [ ] ADM-094 CRM role browser tests
- [ ] ADM-095 Mobile CRM workflow

**Visual references**

- `VISUAL_01_OVERVIEW_DASHBOARD.png`
- `VISUAL_04_CRM_LEADS_LIST.png`
- `VISUAL_05_CRM_LEAD_DETAIL.png`
- `VISUAL_06_CRM_PIPELINE.png`

---

# WAVE 5 — EVENTS

- [ ] ADM-100 Events list
- [ ] ADM-101 Event creation
- [ ] ADM-102 Event overview
- [ ] ADM-103 Lifecycle control
- [ ] ADM-104 Exhibitor-sales state
- [ ] ADM-105 Visitor-registration state
- [ ] ADM-106 Venue
- [ ] ADM-107 Dates and windows
- [ ] ADM-108 Packages list
- [ ] ADM-109 Package editor and evidence
- [ ] ADM-110 Applications
- [ ] ADM-111 Confirmed exhibitors
- [ ] ADM-112 Visitor registrations
- [ ] ADM-113 Event appointments
- [ ] ADM-114 Program
- [ ] ADM-115 Event media
- [ ] ADM-116 Event public preview
- [ ] ADM-117 Reporting
- [ ] ADM-118 Post-event closeout
- [ ] ADM-119 Postpone and cancel
- [ ] ADM-120 Event browser journeys

**Visual reference**

- `VISUAL_07_EVENT_OVERVIEW.png`

---

# WAVE 6 — CMS

- [ ] ADM-130 Content repository adapter
- [ ] ADM-131 CMS overview
- [ ] ADM-132 Pages list
- [ ] ADM-133 Create page
- [ ] ADM-134 Three-pane page editor
- [ ] ADM-135 Section schema registry
- [ ] ADM-136 Section library
- [ ] ADM-137 Section editing
- [ ] ADM-138 Autosave and conflict handling
- [ ] ADM-139 Preview
- [ ] ADM-140 Revision history
- [ ] ADM-141 Review and publication workflow
- [ ] ADM-142 Scheduling
- [ ] ADM-143 Archive and restore
- [ ] ADM-144 Translation dashboard
- [ ] ADM-145 Side-by-side translation editor
- [ ] ADM-146 Arabic RTL preview
- [ ] ADM-147 Media library
- [ ] ADM-148 Media upload
- [ ] ADM-149 Media details, rights and focal point
- [ ] ADM-150 Media usage and replacement
- [ ] ADM-151 Resources
- [ ] ADM-152 Resource versions
- [ ] ADM-153 Articles
- [ ] ADM-154 Case studies
- [ ] ADM-155 Testimonials
- [ ] ADM-156 Partners
- [ ] ADM-157 Metrics
- [ ] ADM-158 Evidence review queue
- [ ] ADM-159 FAQ
- [ ] ADM-160 Navigation manager
- [ ] ADM-161 Versioned form editor
- [ ] ADM-162 SEO
- [ ] ADM-163 Redirects
- [ ] ADM-164 CMS browser journeys

**Visual reference**

- `VISUAL_08_CMS_PAGE_EDITOR.png`

---

# WAVE 7 — ANALYTICS AND SETTINGS

- [ ] ADM-170 Commercial analytics
- [ ] ADM-171 Acquisition analytics
- [ ] ADM-172 Conversion analytics
- [ ] ADM-173 Event analytics
- [ ] ADM-174 Website and CTA analytics
- [ ] ADM-175 Content analytics
- [ ] ADM-176 Locale analytics
- [ ] ADM-177 Evidence-health analytics
- [ ] ADM-178 Report builder
- [ ] ADM-179 Workspace settings
- [ ] ADM-180 Sites and domains
- [ ] ADM-181 Locales
- [ ] ADM-182 Team and invitations
- [ ] ADM-183 Roles
- [ ] ADM-184 Permission overrides
- [ ] ADM-185 Integrations
- [ ] ADM-186 Integration health
- [ ] ADM-187 Notification preferences
- [ ] ADM-188 Legal documents
- [ ] ADM-189 Consent definitions
- [ ] ADM-190 Retention
- [ ] ADM-191 Audit log
- [ ] ADM-192 Appearance and density
- [ ] ADM-193 Settings browser journeys

**Visual reference**

- `VISUAL_09_SETTINGS_TEAM_ROLES.png`

---

# WAVE 8 — HARDENING AND RELEASE

- [ ] ADM-200 Full lint and typecheck
- [ ] ADM-201 Unit and integration suite
- [ ] ADM-202 Backend verification
- [ ] ADM-203 Full browser journey suite
- [ ] ADM-204 Accessibility audit
- [ ] ADM-205 RTL audit
- [ ] ADM-206 Responsive audit
- [ ] ADM-207 Visual regression audit
- [ ] ADM-208 Permission matrix audit
- [ ] ADM-209 Security review
- [ ] ADM-210 Performance review
- [ ] ADM-211 Observability
- [ ] ADM-212 Backup and restore runbook
- [ ] ADM-213 Deployment and rollback test
- [ ] ADM-214 Documentation sync
- [ ] ADM-215 Release candidate evidence
- [ ] ADM-216 Production readiness sign-off
