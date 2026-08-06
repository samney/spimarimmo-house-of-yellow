# SCREEN → ROUTE → COMPONENT → DATA MATRIX

| Area | Screen | Route | Primary components | Existing data/contracts |
|---|---|---|---|---|
| Auth | Login | `/[locale]/auth/login` | AuthShell, LoginForm | Supabase Auth |
| Auth | Invitation | `/[locale]/auth/invite` | InviteForm, PasswordSetup | profiles, profile_roles |
| Onboarding | Welcome | `/[locale]/admin/onboarding` | Stepper, SiteSelector, RoleSummary | sites, site_locales, profile_roles |
| Overview | Dashboard | `/[locale]/admin` | MetricCard, ChartCard, TaskList | leads, tasks, events, pages |
| CRM | Leads | `/[locale]/admin/crm/leads` | EntityTable, Filters, LeadDrawer | leads, contacts, organizations |
| CRM | Lead detail | `/[locale]/admin/crm/leads/[leadId]` | Timeline, StageControl, Tasks | lead_stage_history, activities, notes, tasks |
| CRM | Pipeline | `/[locale]/admin/crm/pipeline` | KanbanBoard, OpportunityCard | leads, lead_stage |
| CRM | Organizations | `/[locale]/admin/crm/organizations` | EntityTable | organizations |
| CRM | Contacts | `/[locale]/admin/crm/contacts` | EntityTable, ConsentSummary | contacts, consents |
| CRM | Appointments | `/[locale]/admin/crm/appointments` | Calendar, AppointmentDrawer | appointment_slots, appointments |
| Events | Events list | `/[locale]/admin/events` | EventTable, LifecycleBadge | events |
| Events | Event overview | `/[locale]/admin/events/[eventId]` | EventHeader, KPIGrid, Schedule | events, venues, packages |
| Events | Packages | `/[locale]/admin/events/[eventId]/packages` | PackageTable, EvidenceStatus | exhibitor_packages |
| CMS | Pages | `/[locale]/admin/cms/pages` | ContentTable, PublicationStatus | pages, page_translations |
| CMS | Page editor | `/[locale]/admin/cms/pages/[pageId]` | StructureTree, Canvas, Inspector | page_sections, translations, revisions |
| CMS | Media | `/[locale]/admin/cms/media` | MediaGrid, MediaDrawer | media_assets, variants, usages |
| CMS | Translations | `/[locale]/admin/cms/translations` | LocaleMatrix, TranslationEditor | page_translations, section translations |
| CMS | Evidence | `/[locale]/admin/cms/evidence` | ReviewQueue, EvidencePanel | metrics, case studies, testimonials |
| CMS | Resources | `/[locale]/admin/cms/resources` | ResourceTable, VersionPanel | resources, resource_versions |
| Analytics | Commercial | `/[locale]/admin/analytics/commercial` | Charts, Funnel, ReportTable | leads, stages, appointments |
| Settings | Team | `/[locale]/admin/settings/team` | TeamTable, InviteDialog | profiles, profile_roles |
| Settings | Roles | `/[locale]/admin/settings/roles` | RoleList, PermissionMatrix | roles, permissions, role_permissions |
| Settings | Audit | `/[locale]/admin/settings/audit` | AuditTable | audit_events |
