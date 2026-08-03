begin;

-- Canonical correction, slice 2: canonical workflow states.
--
-- Five state vocabularies currently encode a materially different business
-- meaning from the approved contracts:
--
--   submission      no enum at all
--   integration job pending/processing/succeeded/failed/dead_letter collapses
--                   retrying, terminal failure, suppression and cancellation
--   delivery        pending/sent/delivered/failed cannot express not_required,
--                   delayed, bounced or suppressed
--   appointment     pending/confirmed does not separate provider pending,
--                   provider failure and provider acceptance
--   publication     changes_requested, expired and withdrawn are collapsed
--                   into archived
--
-- This migration is ADDITIVE. Legacy columns keep their values and their
-- behaviour; canonical state is carried alongside in a nullable column, so a
-- legacy row whose canonical meaning is genuinely unknown stays NULL rather than
-- being assigned a state that was never evidenced.
--
-- Enforced invariants:
--   * a durably committed submission is only ever `received` or
--     `duplicate_linked`; CRM sync, delivery and booking are separate states on
--     separate records;
--   * `booked` is unreachable without a provider reference AND a provider
--     acceptance time (database constraint, not convention);
--   * retrying, terminal failure, suppression and cancellation are distinct;
--   * changes_requested, expired and withdrawn are distinct from archived;
--   * every canonical transition appends immutable history with an actor and a
--     reason, and carries no PII.

-- ---------------------------------------------------------------------------
-- Canonical state vocabularies
-- ---------------------------------------------------------------------------

create type public.submission_state as enum (
  'received',
  'duplicate_linked',
  'invalid_rejected',
  'withdrawn',
  'retained',
  'anonymized'
);

create type public.integration_job_state as enum (
  'queued',
  'processing',
  'succeeded',
  'retrying',
  'failed_terminal',
  'suppressed',
  'cancelled'
);

create type public.delivery_state as enum (
  'not_required',
  'queued',
  'delivered',
  'delayed',
  'bounced',
  'failed',
  'suppressed'
);

create type public.appointment_state as enum (
  'lead_captured',
  'provider_pending',
  'booked',
  'provider_failed',
  'cancelled',
  'expired'
);

create type public.publication_state as enum (
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'scheduled',
  'published',
  'expired',
  'withdrawn',
  'archived'
);

-- The canonical state contract is versioned so a later vocabulary change can be
-- distinguished from data written under today's contract.
create table public.state_contract_versions (
  contract text primary key,
  version integer not null,
  description text not null,
  effective_at timestamptz not null default now()
);

alter table public.state_contract_versions enable row level security;

create policy state_contract_versions_read on public.state_contract_versions
  for select to anon, authenticated using (true);

grant select on table public.state_contract_versions to anon, authenticated;

insert into public.state_contract_versions (contract, version, description) values
  ('submission', 1, 'received, duplicate_linked, invalid_rejected, withdrawn, retained, anonymized'),
  ('integration_job', 1, 'queued, processing, succeeded, retrying, failed_terminal, suppressed, cancelled'),
  ('delivery', 1, 'not_required, queued, delivered, delayed, bounced, failed, suppressed'),
  ('appointment', 1, 'lead_captured, provider_pending, booked, provider_failed, cancelled, expired'),
  ('publication', 1, 'draft, in_review, changes_requested, approved, scheduled, published, expired, withdrawn, archived');

-- ---------------------------------------------------------------------------
-- Canonical columns
-- ---------------------------------------------------------------------------

alter table public.form_submissions
  add column canonical_state public.submission_state,
  add column canonical_state_version integer not null default 1,
  add column canonical_state_changed_at timestamptz;

alter table public.integration_jobs
  add column canonical_state public.integration_job_state,
  add column canonical_state_version integer not null default 1,
  add column canonical_state_changed_at timestamptz,
  add column suppressed_reason text,
  add column cancelled_reason text;

alter table public.resource_deliveries
  add column canonical_state public.delivery_state,
  add column canonical_state_version integer not null default 1,
  add column canonical_state_changed_at timestamptz;

alter table public.appointments
  add column canonical_state public.appointment_state,
  add column canonical_state_version integer not null default 1,
  add column canonical_state_changed_at timestamptz,
  add column provider_reference text,
  add column provider_accepted_at timestamptz,
  add column provider_failed_at timestamptz,
  add column provider_failure_code text;

-- A booking may only claim `booked` when the provider actually accepted it.
-- This is the database-level expression of "booking is successful only after
-- provider acceptance": no application path can bypass it.
alter table public.appointments
  add constraint appointments_booked_requires_provider_acceptance
  check (
    canonical_state is distinct from 'booked'
    or (provider_reference is not null and provider_accepted_at is not null)
  );

comment on constraint appointments_booked_requires_provider_acceptance on public.appointments is
  'booked is unreachable without a provider reference and acceptance time.';

-- Canonical publication state is added to every table that carries a
-- publication_status column, discovered from the catalogue so no table is missed.
do $$
declare
  target record;
begin
  for target in
    select c.relname as table_name
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_type t on t.oid = a.atttypid
    where n.nspname = 'public'
      and c.relkind = 'r'
      and a.attname = 'status'
      and t.typname = 'publication_status'
      and not a.attisdropped
    order by c.relname
  loop
    execute format(
      'alter table public.%I add column canonical_publication_state public.publication_state',
      target.table_name
    );
    -- Legacy publication states map one to one onto the canonical vocabulary.
    -- changes_requested, expired and withdrawn are new capabilities with no
    -- legacy equivalent, so they are only reachable through a canonical
    -- transition; nothing is invented during backfill.
    execute format(
      'update public.%I set canonical_publication_state = status::text::public.publication_state',
      target.table_name
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Backfill
-- ---------------------------------------------------------------------------

-- A row in form_submissions exists only because the acquisition transaction
-- committed, which is precisely what `received` asserts. Duplicate linkage was
-- not recorded distinctly, so no row is promoted to duplicate_linked.
update public.form_submissions
set canonical_state = 'received',
    canonical_state_changed_at = submitted_at
where canonical_state is null;

-- Legacy `failed` conflates "will be retried" with "will never be retried". The
-- distinction is recoverable from the retry accounting already stored on the
-- row, so it is derived from explicit retry columns rather than guessed.
update public.integration_jobs
set canonical_state = case status
      when 'pending' then 'queued'::public.integration_job_state
      when 'processing' then 'processing'::public.integration_job_state
      when 'succeeded' then 'succeeded'::public.integration_job_state
      when 'dead_letter' then 'failed_terminal'::public.integration_job_state
      when 'failed' then case
        when attempt_count < max_attempts then 'retrying'::public.integration_job_state
        else 'failed_terminal'::public.integration_job_state
      end
    end,
    canonical_state_changed_at = updated_at
where canonical_state is null;

-- Legacy `sent` means "handed to the provider", which is not evidence of
-- delivery. It maps to `queued` so no row can claim a delivery that was never
-- confirmed. not_required, delayed, bounced and suppressed are new capabilities.
update public.resource_deliveries
set canonical_state = case status
      when 'pending' then 'queued'::public.delivery_state
      when 'sent' then 'queued'::public.delivery_state
      when 'delivered' then 'delivered'::public.delivery_state
      when 'failed' then 'failed'::public.delivery_state
    end,
    canonical_state_changed_at = updated_at
where canonical_state is null;

-- Only `cancelled` is safely derivable. Legacy `pending` cannot distinguish
-- lead_captured from provider_pending, and legacy `confirmed`/`completed` carry
-- no provider reference or acceptance time, so they cannot be called `booked`
-- without inventing provider evidence. Those rows stay NULL for manual
-- reconciliation.
update public.appointments
set canonical_state = case status
      when 'cancelled' then 'cancelled'::public.appointment_state
    end,
    canonical_state_changed_at = updated_at
where canonical_state is null;

-- ---------------------------------------------------------------------------
-- Transition validity
-- ---------------------------------------------------------------------------

create or replace function app_private.is_valid_submission_state_transition(
  from_state public.submission_state,
  to_state public.submission_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state is null then to_state in ('received', 'duplicate_linked')
    when from_state = to_state then true
    when from_state = 'received' then to_state in (
      'duplicate_linked', 'invalid_rejected', 'withdrawn', 'retained', 'anonymized'
    )
    when from_state = 'duplicate_linked' then to_state in (
      'withdrawn', 'retained', 'anonymized'
    )
    when from_state = 'invalid_rejected' then to_state = 'anonymized'
    when from_state = 'withdrawn' then to_state = 'anonymized'
    when from_state = 'retained' then to_state in ('withdrawn', 'anonymized')
    -- anonymized is terminal: erased data cannot be revived.
    else false
  end;
$$;

create or replace function app_private.is_valid_integration_job_state_transition(
  from_state public.integration_job_state,
  to_state public.integration_job_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state is null then to_state = 'queued'
    when from_state = to_state then true
    when from_state = 'queued' then to_state in ('processing', 'suppressed', 'cancelled')
    when from_state = 'processing' then to_state in (
      'succeeded', 'retrying', 'failed_terminal', 'suppressed', 'cancelled'
    )
    when from_state = 'retrying' then to_state in (
      'processing', 'failed_terminal', 'suppressed', 'cancelled'
    )
    -- succeeded, failed_terminal, suppressed and cancelled are terminal.
    else false
  end;
$$;

create or replace function app_private.is_valid_delivery_state_transition(
  from_state public.delivery_state,
  to_state public.delivery_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state is null then to_state in ('not_required', 'queued', 'suppressed')
    when from_state = to_state then true
    when from_state = 'queued' then to_state in (
      'delivered', 'delayed', 'bounced', 'failed', 'suppressed'
    )
    when from_state = 'delayed' then to_state in (
      'delivered', 'bounced', 'failed', 'suppressed'
    )
    when from_state = 'failed' then to_state in ('queued', 'suppressed')
    -- not_required, delivered, bounced and suppressed are terminal.
    else false
  end;
$$;

create or replace function app_private.is_valid_appointment_state_transition(
  from_state public.appointment_state,
  to_state public.appointment_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state is null then to_state in ('lead_captured', 'cancelled')
    when from_state = to_state then true
    when from_state = 'lead_captured' then to_state in (
      'provider_pending', 'cancelled', 'expired'
    )
    when from_state = 'provider_pending' then to_state in (
      'booked', 'provider_failed', 'cancelled', 'expired'
    )
    -- A provider failure may be retried by re-submitting to the provider.
    when from_state = 'provider_failed' then to_state in (
      'provider_pending', 'cancelled', 'expired'
    )
    when from_state = 'booked' then to_state in ('cancelled', 'expired')
    else false
  end;
$$;

create or replace function app_private.is_valid_publication_state_transition(
  from_state public.publication_state,
  to_state public.publication_state
)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case
    when from_state is null then to_state = 'draft'
    when from_state = to_state then true
    when from_state = 'draft' then to_state in ('in_review', 'archived')
    when from_state = 'in_review' then to_state in (
      'draft', 'changes_requested', 'approved', 'archived'
    )
    when from_state = 'changes_requested' then to_state in ('draft', 'in_review', 'archived')
    when from_state = 'approved' then to_state in (
      'draft', 'changes_requested', 'scheduled', 'published', 'archived'
    )
    when from_state = 'scheduled' then to_state in (
      'approved', 'published', 'withdrawn', 'archived'
    )
    when from_state = 'published' then to_state in (
      'expired', 'withdrawn', 'archived'
    )
    -- Expired and withdrawn content can be revived through review; neither is
    -- collapsed into archived.
    when from_state = 'expired' then to_state in ('in_review', 'withdrawn', 'archived')
    when from_state = 'withdrawn' then to_state in ('in_review', 'archived')
    when from_state = 'archived' then to_state = 'draft'
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- Immutable canonical state history
--
-- One shared, sanitized record: entity table, entity id, contract, old and new
-- state, actor and reason. It carries no submitted content and therefore no PII.
-- ---------------------------------------------------------------------------

create table public.canonical_state_history (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  contract text not null references public.state_contract_versions(contract),
  contract_version integer not null,
  entity_table text not null,
  entity_id uuid not null,
  from_state text,
  to_state text not null,
  reason text not null,
  actor_id uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index canonical_state_history_entity_idx
  on public.canonical_state_history (site_id, entity_table, entity_id, changed_at desc);
create index canonical_state_history_contract_idx
  on public.canonical_state_history (site_id, contract, changed_at desc);

alter table public.canonical_state_history enable row level security;

create policy canonical_state_history_content_read on public.canonical_state_history
  for select to authenticated
  using (
    contract = 'publication'
    and (select app_private.has_permission(site_id, 'content.read'))
  );

-- Operational history spans entities and carries no lead_id, so it cannot be
-- narrowed to a single agent's assignments. It is tenant-wide CRM read only.
create policy canonical_state_history_crm_read on public.canonical_state_history
  for select to authenticated
  using (
    contract <> 'publication'
    and (select app_private.has_permission(site_id, 'crm.read_all'))
  );

-- Written by trigger only.
grant select on table public.canonical_state_history to authenticated;

create or replace function app_private.record_canonical_state_history()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  contract_name text := tg_argv[0];
  state_column text := tg_argv[1];
  old_state text := case when tg_op = 'UPDATE' then to_jsonb(old) ->> state_column end;
  new_state text := to_jsonb(new) ->> state_column;
  reason text := coalesce(
    nullif(current_setting('app.transition_reason', true), ''),
    'canonical state transition'
  );
begin
  if new_state is null or old_state is not distinct from new_state then
    return null;
  end if;

  insert into public.canonical_state_history (
    site_id, contract, contract_version, entity_table, entity_id,
    from_state, to_state, reason, actor_id
  ) values (
    new.site_id,
    contract_name,
    coalesce(
      (select v.version from public.state_contract_versions v where v.contract = contract_name),
      1
    ),
    tg_table_name,
    new.id,
    old_state,
    new_state,
    reason,
    (select auth.uid())
  );

  return null;
end;
$$;

-- ---------------------------------------------------------------------------
-- Transition enforcement
-- ---------------------------------------------------------------------------

create or replace function app_private.validate_canonical_state()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  contract_name text := tg_argv[0];
  old_state text := case when tg_op = 'UPDATE' then to_jsonb(old) ->> 'canonical_state' end;
  new_state text := to_jsonb(new) ->> 'canonical_state';
  is_valid boolean;
begin
  if new_state is null or old_state is not distinct from new_state then
    return new;
  end if;

  is_valid := case contract_name
    when 'submission' then app_private.is_valid_submission_state_transition(
      old_state::public.submission_state, new_state::public.submission_state
    )
    when 'integration_job' then app_private.is_valid_integration_job_state_transition(
      old_state::public.integration_job_state, new_state::public.integration_job_state
    )
    when 'delivery' then app_private.is_valid_delivery_state_transition(
      old_state::public.delivery_state, new_state::public.delivery_state
    )
    when 'appointment' then app_private.is_valid_appointment_state_transition(
      old_state::public.appointment_state, new_state::public.appointment_state
    )
    else false
  end;

  if not is_valid then
    raise exception using errcode = '23514', message = format(
      'invalid %s state transition: %s -> %s',
      contract_name, coalesce(old_state, 'null'), new_state
    );
  end if;

  new.canonical_state_changed_at := now();
  return new;
end;
$$;

-- A durably committed submission may only be created as `received` or
-- `duplicate_linked`. Anything else would let the acquisition path acknowledge a
-- submission it had not durably accepted.
create or replace function app_private.guard_durable_submission_state()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'INSERT'
     and new.canonical_state is not null
     and new.canonical_state not in ('received', 'duplicate_linked') then
    raise exception using
      errcode = '23514',
      message = 'a committed submission must be received or duplicate_linked',
      hint = 'later states are reached by transition, never at insert';
  end if;

  if tg_op = 'INSERT' and new.canonical_state is null then
    new.canonical_state := 'received';
    new.canonical_state_changed_at := now();
  end if;

  return new;
end;
$$;

create or replace function app_private.validate_canonical_publication_state()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.canonical_publication_state is null
     or (tg_op = 'UPDATE'
         and old.canonical_publication_state
             is not distinct from new.canonical_publication_state) then
    return new;
  end if;

  if not app_private.is_valid_publication_state_transition(
    case when tg_op = 'UPDATE' then old.canonical_publication_state end,
    new.canonical_publication_state
  ) then
    raise exception using errcode = '23514', message = format(
      'invalid publication state transition for %s: %s -> %s',
      tg_table_name,
      coalesce(old.canonical_publication_state::text, 'null'),
      new.canonical_publication_state
    );
  end if;

  return new;
end;
$$;

create trigger c_guard_durable_submission_state
  before insert on public.form_submissions
  for each row execute function app_private.guard_durable_submission_state();

create trigger d_validate_canonical_state
  before insert or update on public.form_submissions
  for each row execute function app_private.validate_canonical_state('submission');
create trigger n_record_canonical_state
  after insert or update on public.form_submissions
  for each row execute function app_private.record_canonical_state_history('submission', 'canonical_state');

create trigger d_validate_canonical_state
  before insert or update on public.integration_jobs
  for each row execute function app_private.validate_canonical_state('integration_job');
create trigger n_record_canonical_state
  after insert or update on public.integration_jobs
  for each row execute function app_private.record_canonical_state_history('integration_job', 'canonical_state');

create trigger d_validate_canonical_state
  before insert or update on public.resource_deliveries
  for each row execute function app_private.validate_canonical_state('delivery');
create trigger n_record_canonical_state
  after insert or update on public.resource_deliveries
  for each row execute function app_private.record_canonical_state_history('delivery', 'canonical_state');

create trigger d_validate_canonical_state
  before insert or update on public.appointments
  for each row execute function app_private.validate_canonical_state('appointment');
create trigger n_record_canonical_state
  after insert or update on public.appointments
  for each row execute function app_private.record_canonical_state_history('appointment', 'canonical_state');

-- Publication state validation and history on every content table.
do $$
declare
  target record;
begin
  for target in
    select c.relname as table_name
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and a.attname = 'canonical_publication_state'
      and not a.attisdropped
    order by c.relname
  loop
    execute format(
      'create trigger d_validate_canonical_publication_state '
      || 'before insert or update on public.%I '
      || 'for each row execute function app_private.validate_canonical_publication_state()',
      target.table_name
    );
    execute format(
      'create trigger n_record_canonical_publication_state '
      || 'after insert or update on public.%I '
      || 'for each row execute function '
      || 'app_private.record_canonical_state_history(''publication'', ''canonical_publication_state'')',
      target.table_name
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Provider acceptance
--
-- The only supported way to move an appointment to `booked`. Acceptance
-- evidence is required by signature, so "fake provider success" cannot be
-- expressed: there is no code path that books without a provider reference and
-- an acceptance time.
-- ---------------------------------------------------------------------------

create or replace function public.accept_appointment_booking_v1(
  p_appointment_id uuid,
  p_provider_reference text,
  p_provider_accepted_at timestamptz,
  p_reason text
)
returns public.appointments
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.appointments;
  updated public.appointments;
begin
  if coalesce(btrim(p_provider_reference), '') = '' then
    raise exception using errcode = '22023', message = 'provider reference is required to book';
  end if;

  if p_provider_accepted_at is null then
    raise exception using errcode = '22023', message = 'provider acceptance time is required to book';
  end if;

  select * into target from public.appointments where id = p_appointment_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'appointment not found';
  end if;

  -- Tenant-wide CRM writers, or the agent the lead is actually assigned to.
  if not (
    (select app_private.has_permission(target.site_id, 'crm.write_all'))
    or (select app_private.can_access_lead(target.site_id, target.lead_id, true))
  ) then
    raise exception using errcode = '42501', message = 'insufficient permission to book an appointment';
  end if;

  perform set_config(
    'app.transition_reason',
    coalesce(nullif(btrim(p_reason), ''), 'provider accepted booking'),
    true
  );

  update public.appointments a
  set canonical_state = 'booked',
      provider_reference = p_provider_reference,
      provider_accepted_at = p_provider_accepted_at,
      updated_by = (select auth.uid()),
      updated_at = now()
  where a.id = p_appointment_id
  returning * into updated;

  return updated;
end;
$$;

comment on function public.accept_appointment_booking_v1(uuid, text, timestamptz, text) is
  'Books an appointment only on evidenced provider acceptance. Requires crm.write.';

grant execute on function public.accept_appointment_booking_v1(uuid, text, timestamptz, text)
  to authenticated;

grant execute on function app_private.is_valid_submission_state_transition(
  public.submission_state, public.submission_state) to authenticated, service_role;
grant execute on function app_private.is_valid_integration_job_state_transition(
  public.integration_job_state, public.integration_job_state) to authenticated, service_role;
grant execute on function app_private.is_valid_delivery_state_transition(
  public.delivery_state, public.delivery_state) to authenticated, service_role;
grant execute on function app_private.is_valid_appointment_state_transition(
  public.appointment_state, public.appointment_state) to authenticated, service_role;
grant execute on function app_private.is_valid_publication_state_transition(
  public.publication_state, public.publication_state) to authenticated, service_role;

commit;
