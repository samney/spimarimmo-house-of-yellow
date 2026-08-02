begin;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  legal_name text not null,
  normalized_name text generated always as (lower(btrim(legal_name))) stored,
  organization_kind text not null default 'prospect' check (
    organization_kind in ('prospect', 'exhibitor', 'developer', 'agency', 'institution', 'other')
  ),
  website_url text check (website_url is null or website_url ~ '^https://'),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  owner_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retention_until timestamptz,
  anonymized_at timestamptz,
  deleted_at timestamptz,
  unique (site_id, id)
);

create index organizations_name_idx on public.organizations(site_id, normalized_name) where deleted_at is null;
create unique index organizations_normalized_name_unique
  on public.organizations(site_id, normalized_name)
  where deleted_at is null;

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  organization_id uuid,
  email text,
  normalized_email text generated always as (lower(btrim(email))) stored,
  phone text,
  normalized_phone text generated always as (regexp_replace(coalesce(phone, ''), '[^0-9+]', '', 'g')) stored,
  first_name text,
  last_name text,
  preferred_locale text not null default 'fr' check (preferred_locale in ('en', 'fr', 'ar')),
  timezone text,
  owner_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retention_until timestamptz,
  anonymized_at timestamptz,
  deleted_at timestamptz,
  unique (site_id, id),
  foreign key (site_id, organization_id) references public.organizations(site_id, id) on delete set null,
  check (anonymized_at is not null or email is not null or phone is not null),
  check (email is null or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
);

create unique index contacts_normalized_email_unique
  on public.contacts(site_id, normalized_email)
  where normalized_email is not null and deleted_at is null;
create unique index contacts_normalized_phone_unique
  on public.contacts(site_id, normalized_phone)
  where normalized_phone <> '' and deleted_at is null;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  contact_id uuid not null,
  organization_id uuid,
  event_id uuid,
  acquisition_kind public.acquisition_kind not null,
  dedupe_key text not null,
  stage public.lead_stage not null default 'new',
  owner_id uuid references auth.users(id) on delete set null,
  queue_key text not null default 'unassigned' check (queue_key ~ '^[a-z0-9_.-]+$'),
  source_label text,
  campaign_label text,
  next_action text,
  next_action_at timestamptz,
  lost_reason text,
  won_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  retention_until timestamptz,
  anonymized_at timestamptz,
  deleted_at timestamptz,
  unique (site_id, dedupe_key),
  unique (site_id, id),
  foreign key (site_id, contact_id) references public.contacts(site_id, id) on delete restrict,
  foreign key (site_id, organization_id) references public.organizations(site_id, id) on delete set null,
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  check ((stage in ('won', 'exhibitor_onboarding')) = (won_at is not null)),
  check (stage <> 'lost' or lost_reason is not null)
);

create index leads_queue_idx on public.leads(site_id, queue_key, stage, created_at desc) where deleted_at is null;
create index leads_owner_idx on public.leads(site_id, owner_id, stage) where deleted_at is null;
create index leads_contact_idx on public.leads(contact_id, created_at desc);

create table public.lead_event_interests (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  event_id uuid not null,
  interest_kind text not null check (interest_kind in ('exhibitor', 'visitor', 'sponsor', 'partner', 'general')),
  created_at timestamptz not null default now(),
  unique (lead_id, event_id, interest_kind),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade
);

create table public.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  assignee_id uuid references auth.users(id) on delete set null,
  assigned_by uuid references auth.users(id) on delete set null,
  reason text not null,
  assigned_at timestamptz not null default now(),
  ended_at timestamptz,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  check (ended_at is null or ended_at >= assigned_at)
);

create unique index lead_assignments_one_active
  on public.lead_assignments(lead_id)
  where ended_at is null;
create index lead_assignments_assignee_idx
  on public.lead_assignments(site_id, assignee_id, assigned_at desc)
  where ended_at is null;

create table public.lead_stage_history (
  id bigint generated always as identity primary key,
  site_id uuid not null,
  lead_id uuid not null,
  from_stage public.lead_stage,
  to_stage public.lead_stage not null,
  reason text not null,
  actor_id uuid references auth.users(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null,
  event_id uuid,
  source_label text,
  campaign_label text,
  next_action text,
  changed_at timestamptz not null default now(),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null
);

create index lead_stage_history_lead_idx on public.lead_stage_history(lead_id, changed_at desc);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  contact_id uuid,
  lead_id uuid,
  acquisition_kind public.acquisition_kind not null,
  idempotency_key uuid not null,
  locale text not null check (locale in ('en', 'fr', 'ar')),
  message text,
  notice_version text not null,
  response_code text not null default 'accepted' check (response_code in ('accepted', 'deduplicated', 'rejected')),
  submitted_at timestamptz not null default now(),
  request_id text,
  ip_hash text check (ip_hash is null or ip_hash ~ '^[a-f0-9]{16,128}$'),
  user_agent_hash text check (user_agent_hash is null or user_agent_hash ~ '^[a-f0-9]{16,128}$'),
  unique (site_id, idempotency_key),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  foreign key (site_id, contact_id) references public.contacts(site_id, id) on delete set null,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete set null
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  contact_id uuid not null,
  lead_id uuid,
  form_submission_id uuid,
  purpose text not null check (purpose ~ '^[a-z0-9_.-]+$'),
  granted boolean not null,
  notice_version text not null,
  locale text not null check (locale in ('en', 'fr', 'ar')),
  captured_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  source text not null default 'public_form',
  foreign key (site_id, contact_id) references public.contacts(site_id, id) on delete cascade,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete set null,
  foreign key (site_id, form_submission_id) references public.form_submissions(site_id, id) on delete set null,
  check (withdrawn_at is null or withdrawn_at >= captured_at)
);

create index consents_contact_purpose_idx on public.consents(contact_id, purpose, captured_at desc);

create table public.campaign_attribution (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  form_submission_id uuid,
  attribution_model text not null default 'first_touch' check (attribution_model in ('first_touch', 'last_touch', 'submission')),
  source text,
  medium text,
  campaign text,
  term text,
  content text,
  referrer text,
  landing_path text,
  cta_position text,
  captured_at timestamptz not null default now(),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  foreign key (site_id, form_submission_id) references public.form_submissions(site_id, id) on delete set null
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  activity_kind text not null check (activity_kind in ('email', 'call', 'meeting', 'form', 'stage_change', 'resource', 'other')),
  occurred_at timestamptz not null default now(),
  subject text not null,
  details text,
  actor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade
);

create index activities_lead_idx on public.activities(lead_id, occurred_at desc);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  body text not null check (length(btrim(body)) > 0),
  author_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  title text not null,
  description text,
  status public.task_status not null default 'open',
  due_at timestamptz,
  assignee_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  check ((status = 'completed') = (completed_at is not null))
);

create index tasks_assignee_due_idx on public.tasks(site_id, assignee_id, status, due_at);

create table public.appointment_slots (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  staff_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null,
  capacity integer not null default 1 check (capacity > 0),
  is_public boolean not null default false,
  cancelled_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade,
  check (ends_at > starts_at)
);

create index appointment_slots_public_idx on public.appointment_slots(site_id, event_id, starts_at)
  where is_public and cancelled_at is null;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  event_id uuid,
  lead_id uuid not null,
  slot_id uuid not null,
  booking_key uuid not null default gen_random_uuid(),
  status public.appointment_status not null default 'pending',
  timezone text not null,
  attendee_notes text,
  cancellation_reason text,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, id),
  unique (site_id, booking_key),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  foreign key (site_id, slot_id) references public.appointment_slots(site_id, id) on delete restrict,
  check (status <> 'confirmed' or confirmed_at is not null),
  check (status <> 'cancelled' or (cancelled_at is not null and cancellation_reason is not null)),
  check (status <> 'completed' or completed_at is not null)
);

create index appointments_slot_status_idx on public.appointments(slot_id, status);
create index appointments_lead_idx on public.appointments(lead_id, created_at desc);

create table public.resource_deliveries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  lead_id uuid not null,
  contact_id uuid not null,
  resource_id uuid not null,
  resource_version_id uuid not null,
  status public.delivery_status not null default 'pending',
  provider_message_id text,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  last_error_code text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, resource_version_id),
  unique (site_id, id),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  foreign key (site_id, contact_id) references public.contacts(site_id, id) on delete cascade,
  foreign key (site_id, resource_id) references public.resources(site_id, id) on delete restrict,
  foreign key (site_id, resource_version_id) references public.resource_versions(site_id, id) on delete restrict
);

create table public.integration_jobs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  lead_id uuid,
  job_kind text not null check (job_kind in ('contact_notification', 'resource_delivery', 'confirmation_email', 'webhook', 'calendar_sync')),
  idempotency_key text not null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  status public.integration_job_status not null default 'pending',
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 5 check (max_attempts > 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  last_error_code text,
  last_error_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, job_kind, idempotency_key),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade,
  check (attempt_count <= max_attempts),
  check (status <> 'succeeded' or completed_at is not null)
);

create index integration_jobs_ready_idx on public.integration_jobs(status, available_at)
  where status in ('pending', 'failed');

commit;
