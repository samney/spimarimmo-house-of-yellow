begin;

-- Canonical correction, slice 3: activation-critical conversion contracts.
--
-- These records must exist BEFORE any public form is connected. Without them a
-- submission cannot evidence which form version it came from, which consent
-- text was shown, which legal document was in force, what the visitor saw, or
-- what was later communicated, suppressed or erased.
--
-- Added here:
--   1. form_definitions + form_definition_versions
--   2. consent_definitions, with versioned legal/notice linkage
--   3. typed legal_documents (host/locale/version/effective/controller)
--   4. immutable submission_contexts
--   5. distinct visitor_registrations with canonical registration state
--   6. communications and outbox_events with provider correlation
--   7. privacy_requests and suppressions with propagation/audit state
--   8. opaque public status references with no PII and no enumerable internal id
--
-- Separation of concerns is deliberate. An outbox event is a DOMAIN event owned
-- by the source transaction; an integration job is PROVIDER execution. Conflating
-- them is what forces a database-plus-provider dual write. Provider jobs are
-- derived AFTER the acquisition transaction commits, never inside it.
--
-- Scope note: this migration creates and governs the records. Rewiring the
-- existing acquisition path to populate them is caller migration and is tracked
-- as remaining work; nothing here silently changes acquisition behaviour.

-- ---------------------------------------------------------------------------
-- Vocabularies
-- ---------------------------------------------------------------------------

create type public.form_audience as enum (
  'exhibitor', 'visitor', 'partner', 'press', 'general'
);

create type public.consent_requiredness as enum ('required', 'optional');

create type public.legal_basis as enum (
  'consent', 'contract', 'legal_obligation',
  'legitimate_interest', 'vital_interests', 'public_task'
);

create type public.legal_document_kind as enum (
  'privacy_notice', 'cookie_notice', 'terms_of_service',
  'exhibitor_terms', 'visitor_terms', 'data_processing_agreement', 'imprint'
);

create type public.visitor_registration_state as enum (
  'pending', 'confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show'
);

create type public.communication_channel as enum (
  'email', 'sms', 'whatsapp', 'phone', 'postal'
);

create type public.communication_state as enum (
  'queued', 'sent', 'delivered', 'bounced', 'failed', 'suppressed'
);

create type public.outbox_event_state as enum (
  'pending', 'dispatched', 'failed', 'discarded'
);

create type public.privacy_request_kind as enum (
  'access', 'rectification', 'erasure', 'restriction', 'portability', 'objection'
);

create type public.privacy_request_state as enum (
  'received', 'verifying', 'in_progress', 'completed', 'rejected', 'withdrawn'
);

create type public.suppression_scope as enum ('channel', 'purpose', 'global');

-- ---------------------------------------------------------------------------
-- 3. Typed legal documents
--
-- Created first because consent definitions reference them.
-- ---------------------------------------------------------------------------

create table public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  kind public.legal_document_kind not null,
  locale text not null,
  version text not null,
  title text not null,
  body text not null,
  -- The legal entity accountable for processing under this document.
  controller_name text not null,
  controller_contact text not null,
  effective_at timestamptz not null,
  superseded_at timestamptz,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, kind, locale, version),
  constraint legal_documents_supersede_after_effective
    check (superseded_at is null or superseded_at >= effective_at)
);

create index legal_documents_in_force_idx
  on public.legal_documents (site_id, kind, locale, effective_at desc)
  where superseded_at is null;

-- ---------------------------------------------------------------------------
-- 2. Consent definitions
-- ---------------------------------------------------------------------------

create table public.consent_definitions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  purpose text not null,
  locale text not null,
  version text not null,
  requiredness public.consent_requiredness not null,
  legal_basis public.legal_basis not null,
  -- The exact text shown to the person, retained verbatim as evidence.
  notice_text text not null,
  legal_document_id uuid references public.legal_documents(id) on delete restrict,
  effective_at timestamptz not null,
  superseded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, purpose, locale, version),
  -- Consent as a legal basis is meaningless if the person cannot refuse.
  constraint consent_definitions_consent_basis_is_optional
    check (legal_basis <> 'consent' or requiredness = 'optional')
);

create index consent_definitions_in_force_idx
  on public.consent_definitions (site_id, purpose, locale, effective_at desc)
  where superseded_at is null;

-- ---------------------------------------------------------------------------
-- 1. Form definitions and versions
-- ---------------------------------------------------------------------------

create table public.form_definitions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  form_key text not null,
  purpose text not null,
  audience public.form_audience not null,
  acquisition_kind public.acquisition_kind not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, form_key)
);

create table public.form_definition_versions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  form_definition_id uuid not null references public.form_definitions(id) on delete cascade,
  version integer not null,
  locale text not null,
  -- Declared field contract. Server-side validation is driven from this, so a
  -- client cannot introduce or rename a field.
  field_schema jsonb not null,
  -- When the form accepts submissions at all.
  available_from timestamptz,
  available_until timestamptz,
  -- Where an accepted submission is routed.
  routing jsonb not null default '{}'::jsonb,
  -- Which consent definitions this version presents, in display order.
  consent_definition_ids uuid[] not null default array[]::uuid[],
  -- What the person is promised on success.
  confirmation_contract jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (site_id, form_definition_id, version, locale),
  constraint form_definition_versions_window
    check (available_until is null or available_from is null or available_until > available_from),
  constraint form_definition_versions_field_schema_is_object
    check (jsonb_typeof(field_schema) = 'object')
);

create index form_definition_versions_lookup_idx
  on public.form_definition_versions (site_id, form_definition_id, locale, version desc);

-- A published form version is evidence of what was shown and must not be
-- rewritten afterwards.
create or replace function app_private.guard_form_version_immutability()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.published_at is not null
     and to_jsonb(new) - array['published_at'] is distinct from to_jsonb(old) - array['published_at'] then
    raise exception using
      errcode = '23514',
      message = 'a published form version is immutable; create a new version instead';
  end if;
  return new;
end;
$$;

create trigger c_guard_form_version_immutability
  before update on public.form_definition_versions
  for each row execute function app_private.guard_form_version_immutability();

-- ---------------------------------------------------------------------------
-- 4. Immutable submission contexts
--
-- Snapshots what the person was actually looking at when they submitted. It is
-- append-only: update and delete are refused at the database level, because a
-- context that can be edited is not evidence.
-- ---------------------------------------------------------------------------

create table public.submission_contexts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  form_submission_id uuid not null references public.form_submissions(id) on delete cascade,
  form_definition_version_id uuid references public.form_definition_versions(id) on delete restrict,
  event_id uuid,
  destination_key text,
  offer_key text,
  offer_version text,
  resource_id uuid references public.resources(id) on delete set null,
  resource_version_id uuid references public.resource_versions(id) on delete set null,
  campaign_key text,
  route_path text,
  template_key text,
  content_version text,
  locale text not null,
  captured_at timestamptz not null default now(),
  unique (form_submission_id)
);

create index submission_contexts_event_idx
  on public.submission_contexts (site_id, event_id);

create or replace function app_private.guard_submission_context_immutability()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  raise exception using
    errcode = '23514',
    message = 'submission_contexts is append-only evidence and cannot be modified or deleted';
  return null;
end;
$$;

create trigger c_guard_submission_context_immutability
  before update or delete on public.submission_contexts
  for each row execute function app_private.guard_submission_context_immutability();

-- ---------------------------------------------------------------------------
-- 8. Opaque public status references
--
-- The token is random, unique and carries no PII and no internal id, so it is
-- neither guessable nor enumerable. Anonymous callers never read this table:
-- they call a security-definer function with the token and receive a coarse
-- status only.
-- ---------------------------------------------------------------------------

create table public.submission_public_references (
  reference text primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  form_submission_id uuid not null references public.form_submissions(id) on delete cascade,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  unique (form_submission_id),
  constraint submission_public_references_opaque
    check (reference ~ '^[0-9a-f]{32}$')
);

create or replace function app_private.issue_submission_reference(
  p_site_id uuid,
  p_form_submission_id uuid,
  p_expires_at timestamptz default null
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  token text := encode(extensions.gen_random_bytes(16), 'hex');
begin
  insert into public.submission_public_references (
    reference, site_id, form_submission_id, expires_at
  ) values (token, p_site_id, p_form_submission_id, p_expires_at);

  return token;
end;
$$;

-- Coarse status only. No contact details, no message body, no internal ids.
create or replace function public.get_submission_status_v1(p_reference text)
returns table (status text, submitted_at timestamptz)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select
    case s.canonical_state
      when 'received' then 'received'
      when 'duplicate_linked' then 'received'
      when 'invalid_rejected' then 'rejected'
      when 'withdrawn' then 'withdrawn'
      when 'anonymized' then 'closed'
      else 'received'
    end,
    s.submitted_at
  from public.submission_public_references r
  join public.form_submissions s on s.id = r.form_submission_id
  where r.reference = p_reference
    and (r.expires_at is null or r.expires_at > now());
$$;

comment on function public.get_submission_status_v1(text) is
  'Coarse submission status for an opaque public reference. Exposes no PII and no internal identifiers.';

-- ---------------------------------------------------------------------------
-- 5. Distinct visitor registrations
--
-- A visitor registration is not an exhibitor lead. It has its own state and its
-- own recipient/sharing rules, which are versioned so a later policy change
-- cannot be applied retroactively to data already collected.
-- ---------------------------------------------------------------------------

create table public.visitor_registrations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  contact_id uuid references public.contacts(id) on delete set null,
  form_submission_id uuid references public.form_submissions(id) on delete set null,
  canonical_state public.visitor_registration_state not null default 'pending',
  canonical_state_version integer not null default 1,
  canonical_state_changed_at timestamptz not null default now(),
  -- The sharing rule in force when this person registered.
  recipient_policy_version text not null,
  sharing_rule_version text not null,
  locale text not null,
  registered_at timestamptz not null default now(),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null
);

create index visitor_registrations_event_idx
  on public.visitor_registrations (site_id, event_id, canonical_state);

create or replace function app_private.is_valid_visitor_registration_transition(
  from_state public.visitor_registration_state,
  to_state public.visitor_registration_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state = to_state then true
    when from_state = 'pending' then to_state in ('confirmed', 'waitlisted', 'cancelled')
    when from_state = 'waitlisted' then to_state in ('confirmed', 'cancelled')
    when from_state = 'confirmed' then to_state in ('attended', 'no_show', 'cancelled')
    else false
  end;
$$;

create or replace function app_private.validate_visitor_registration_state()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'UPDATE' and new.canonical_state is distinct from old.canonical_state then
    if not app_private.is_valid_visitor_registration_transition(
      old.canonical_state, new.canonical_state
    ) then
      raise exception using errcode = '23514', message = format(
        'invalid visitor registration transition: %s -> %s',
        old.canonical_state, new.canonical_state
      );
    end if;
    new.canonical_state_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger d_validate_visitor_registration_state
  before insert or update on public.visitor_registrations
  for each row execute function app_private.validate_visitor_registration_state();

-- ---------------------------------------------------------------------------
-- 6. Communications and outbox events
-- ---------------------------------------------------------------------------

create table public.communications (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  form_submission_id uuid references public.form_submissions(id) on delete set null,
  purpose text not null,
  channel public.communication_channel not null,
  template_key text not null,
  template_version text not null,
  locale text not null,
  state public.communication_state not null default 'queued',
  -- Provider correlation, so a delivery result can be traced back.
  provider text,
  provider_message_id text,
  suppressed_by_id uuid,
  failure_code text,
  queued_at timestamptz not null default now(),
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A suppressed communication must say what suppressed it.
  constraint communications_suppression_is_attributed
    check (state <> 'suppressed' or suppressed_by_id is not null)
);

create index communications_contact_idx
  on public.communications (site_id, contact_id, queued_at desc);
create index communications_provider_idx
  on public.communications (site_id, provider, provider_message_id);

-- A domain event owned by the transaction that produced it. Deliberately
-- separate from integration_jobs: this records THAT something happened, the job
-- records an attempt to tell a provider about it.
create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_type text not null,
  -- Identifies the record the event is about, without assuming its table.
  aggregate_table text not null,
  aggregate_id uuid not null,
  payload jsonb not null,
  state public.outbox_event_state not null default 'pending',
  -- Set only once a provider job has been derived from this event.
  integration_job_id uuid references public.integration_jobs(id) on delete set null,
  available_at timestamptz not null default now(),
  dispatched_at timestamptz,
  discarded_reason text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint outbox_events_payload_is_object
    check (jsonb_typeof(payload) = 'object'),
  constraint outbox_events_dispatch_is_evidenced
    check (state <> 'dispatched' or (integration_job_id is not null and dispatched_at is not null))
);

create index outbox_events_pending_idx
  on public.outbox_events (site_id, available_at)
  where state = 'pending';
create index outbox_events_aggregate_idx
  on public.outbox_events (site_id, aggregate_table, aggregate_id, occurred_at desc);

-- ---------------------------------------------------------------------------
-- 7. Privacy requests and suppressions
-- ---------------------------------------------------------------------------

create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  kind public.privacy_request_kind not null,
  state public.privacy_request_state not null default 'received',
  -- How the requester's identity was checked before anything was disclosed.
  verification_method text,
  verified_at timestamptz,
  received_at timestamptz not null default now(),
  due_at timestamptz,
  completed_at timestamptz,
  outcome_summary text,
  handled_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Nothing may be disclosed or erased on an unverified request.
  constraint privacy_requests_completion_requires_verification
    check (state <> 'completed' or (verified_at is not null and completed_at is not null))
);

create index privacy_requests_open_idx
  on public.privacy_requests (site_id, state, due_at);

create table public.suppressions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete cascade,
  scope public.suppression_scope not null,
  channel public.communication_channel,
  purpose text,
  reason text not null,
  source text not null,
  privacy_request_id uuid references public.privacy_requests(id) on delete set null,
  -- Whether downstream providers have been told about this suppression.
  propagated_at timestamptz,
  propagation_failure_code text,
  effective_from timestamptz not null default now(),
  effective_until timestamptz,
  created_at timestamptz not null default now(),
  constraint suppressions_scope_is_specific
    check (
      (scope = 'channel' and channel is not null)
      or (scope = 'purpose' and purpose is not null)
      or scope = 'global'
    )
);

create index suppressions_active_idx
  on public.suppressions (site_id, contact_id, scope)
  where effective_until is null;

alter table public.communications
  add constraint communications_suppressed_by_fk
  foreign key (suppressed_by_id) references public.suppressions(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Content-shaped definitions are readable by content staff and publicly
-- readable where the public genuinely needs them (legal documents in force,
-- consent notices, active form versions). Everything holding personal data is
-- CRM-scoped and never anonymous-readable.
-- ---------------------------------------------------------------------------

alter table public.legal_documents enable row level security;
alter table public.consent_definitions enable row level security;
alter table public.form_definitions enable row level security;
alter table public.form_definition_versions enable row level security;
alter table public.submission_contexts enable row level security;
alter table public.submission_public_references enable row level security;
alter table public.visitor_registrations enable row level security;
alter table public.communications enable row level security;
alter table public.outbox_events enable row level security;
alter table public.privacy_requests enable row level security;
alter table public.suppressions enable row level security;

-- Legal documents currently in force are public by necessity.
create policy legal_documents_public_read on public.legal_documents
  for select to anon, authenticated
  using (
    superseded_at is null
    and effective_at <= now()
    and exists (
      select 1 from public.sites s
      where s.id = legal_documents.site_id and s.status = 'active' and s.deleted_at is null
    )
  );
create policy legal_documents_staff_read on public.legal_documents
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));
create policy legal_documents_staff_write on public.legal_documents
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.publish')))
  with check ((select app_private.has_permission(site_id, 'content.publish')));

-- The consent notice shown to a person must be readable by that person.
create policy consent_definitions_public_read on public.consent_definitions
  for select to anon, authenticated
  using (
    superseded_at is null
    and effective_at <= now()
    and exists (
      select 1 from public.sites s
      where s.id = consent_definitions.site_id and s.status = 'active' and s.deleted_at is null
    )
  );
create policy consent_definitions_staff_write on public.consent_definitions
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.publish')))
  with check ((select app_private.has_permission(site_id, 'content.publish')));

create policy form_definitions_public_read on public.form_definitions
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.sites s
      where s.id = form_definitions.site_id and s.status = 'active' and s.deleted_at is null
    )
  );
create policy form_definitions_staff_write on public.form_definitions
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.write')))
  with check ((select app_private.has_permission(site_id, 'content.write')));

create policy form_definition_versions_public_read on public.form_definition_versions
  for select to anon, authenticated
  using (
    published_at is not null
    and exists (
      select 1 from public.form_definitions f
      join public.sites s on s.id = f.site_id
      where f.id = form_definition_versions.form_definition_id
        and f.is_active and s.status = 'active' and s.deleted_at is null
    )
  );
create policy form_definition_versions_staff_write on public.form_definition_versions
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'content.write')))
  with check ((select app_private.has_permission(site_id, 'content.write')));

-- Everything below holds or points at personal data: CRM scope only. Where the
-- record can be traced to a lead, an assigned agent keeps the same narrowed
-- access they already have on the rest of the CRM; where it cannot, the table is
-- tenant-wide read only rather than silently visible to every agent.

create policy submission_contexts_crm_read on public.submission_contexts
  for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or exists (
      select 1 from public.form_submissions s
      where s.id = submission_contexts.form_submission_id
        and s.lead_id is not null
        and (select app_private.can_access_lead(s.site_id, s.lead_id, false))
    )
  );

create policy submission_public_references_crm_read on public.submission_public_references
  for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or exists (
      select 1 from public.form_submissions s
      where s.id = submission_public_references.form_submission_id
        and s.lead_id is not null
        and (select app_private.can_access_lead(s.site_id, s.lead_id, false))
    )
  );

create policy visitor_registrations_crm_read on public.visitor_registrations
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'crm.read_all')));
create policy visitor_registrations_crm_write on public.visitor_registrations
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'crm.write_all')))
  with check ((select app_private.has_permission(site_id, 'crm.write_all')));

create policy communications_crm_read on public.communications
  for select to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.read_all'))
    or (lead_id is not null and (select app_private.can_access_lead(site_id, lead_id, false)))
  );
create policy communications_crm_write on public.communications
  for all to authenticated
  using (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (lead_id is not null and (select app_private.can_access_lead(site_id, lead_id, true)))
  )
  with check (
    (select app_private.has_permission(site_id, 'crm.write_all'))
    or (lead_id is not null and (select app_private.can_access_lead(site_id, lead_id, true)))
  );

create policy outbox_events_crm_read on public.outbox_events
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'crm.read_all')));

-- Privacy handling and suppression are tenant-wide responsibilities: an agent
-- must not be able to read or alter another person's rights request.
create policy privacy_requests_crm_read on public.privacy_requests
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'crm.read_all')));
create policy privacy_requests_crm_write on public.privacy_requests
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'crm.write_all')))
  with check ((select app_private.has_permission(site_id, 'crm.write_all')));

create policy suppressions_crm_read on public.suppressions
  for select to authenticated
  using ((select app_private.has_permission(site_id, 'crm.read_all')));
create policy suppressions_crm_write on public.suppressions
  for all to authenticated
  using ((select app_private.has_permission(site_id, 'crm.write_all')))
  with check ((select app_private.has_permission(site_id, 'crm.write_all')));

-- ---------------------------------------------------------------------------
-- Grants
--
-- Evidence tables are readable but never directly writable by staff: contexts
-- and public references are written by the acquisition transaction, outbox
-- events by the domain transaction.
-- ---------------------------------------------------------------------------

grant select on table
  public.legal_documents,
  public.consent_definitions,
  public.form_definitions,
  public.form_definition_versions
to anon, authenticated;

grant select on table
  public.submission_contexts,
  public.submission_public_references,
  public.visitor_registrations,
  public.communications,
  public.outbox_events,
  public.privacy_requests,
  public.suppressions
to authenticated;

grant insert, update, delete on table
  public.legal_documents,
  public.consent_definitions,
  public.form_definitions,
  public.form_definition_versions,
  public.visitor_registrations,
  public.communications,
  public.privacy_requests,
  public.suppressions
to authenticated;

grant execute on function public.get_submission_status_v1(text) to anon, authenticated;
grant execute on function app_private.issue_submission_reference(uuid, uuid, timestamptz)
  to service_role;
grant execute on function app_private.is_valid_visitor_registration_transition(
  public.visitor_registration_state, public.visitor_registration_state
) to authenticated, service_role;

-- Standard audit and updated_at behaviour, matching the existing CRM tables.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'legal_documents', 'consent_definitions', 'form_definitions',
    'visitor_registrations', 'communications', 'privacy_requests'
  ] loop
    execute format(
      'create trigger a_set_updated_at before update on public.%I '
      || 'for each row execute function app_private.set_updated_at()',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'legal_documents', 'consent_definitions', 'form_definitions',
    'form_definition_versions'
  ] loop
    execute format(
      'create trigger z_audit_mutation after insert or update or delete on public.%I '
      || 'for each row execute function app_private.record_audit_event(''cms'')',
      table_name
    );
  end loop;

  foreach table_name in array array[
    'submission_contexts', 'visitor_registrations', 'communications',
    'outbox_events', 'privacy_requests', 'suppressions'
  ] loop
    execute format(
      'create trigger z_audit_mutation after insert or update or delete on public.%I '
      || 'for each row execute function app_private.record_audit_event(''crm'')',
      table_name
    );
  end loop;
end;
$$;

commit;
