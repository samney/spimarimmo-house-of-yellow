begin;

-- Canonical correction, slice 1: independent event axes.
--
-- The legacy `public.event_lifecycle_status` enum conflates three independent
-- business facts into one serial value. `exhibitor_sales_open` and
-- `visitor_registration_open` are mutually exclusive enum members, so an event
-- literally cannot express "exhibitor sales are open AND visitor registration
-- is open" at the same time, and it cannot express `limited`, `sold_out`,
-- `waitlist` or `full` at all. `review` is an editorial publication state that
-- was mixed into the event lifecycle.
--
-- This migration is ADDITIVE. It does not rewrite the existing 39 migrations,
-- does not drop the legacy column or type, and does not change any legacy
-- behaviour. Legacy callers keep working unchanged while the canonical axes are
-- populated alongside them. Removing the legacy column is a separate, later
-- migration that may only run once every caller reads the canonical columns and
-- hosted tests pass.
--
-- Availability is never inferred from timestamps or from a serial lifecycle
-- value. Where the legacy value cannot be safely projected onto the canonical
-- axes, the row is left explicitly UNRESOLVED for manual reconciliation and
-- publication is blocked until a human resolves it.

-- ---------------------------------------------------------------------------
-- Canonical state vocabularies
-- ---------------------------------------------------------------------------

create type public.event_lifecycle_axis as enum (
  'draft',
  'announced_undated',
  'scheduled',
  'live',
  'completed',
  'archived',
  'postponed',
  'cancelled'
);

create type public.event_exhibitor_sales_status as enum (
  'planned',
  'open',
  'limited',
  'sold_out',
  'closed'
);

create type public.event_visitor_registration_status as enum (
  'planned',
  'open',
  'waitlist',
  'full',
  'closed'
);

create type public.event_axis_reconciliation as enum (
  'resolved',
  'unresolved'
);

-- ---------------------------------------------------------------------------
-- Canonical columns
--
-- All three axes are nullable on purpose: NULL means "not yet reconciled", which
-- is materially different from any concrete availability value. The
-- reconciliation state is a STORED GENERATED column so it can never drift out of
-- step with the axes it summarises.
-- ---------------------------------------------------------------------------

alter table public.events
  add column lifecycle_axis public.event_lifecycle_axis,
  add column exhibitor_sales_status public.event_exhibitor_sales_status,
  add column visitor_registration_status public.event_visitor_registration_status,
  add column axis_reconciliation public.event_axis_reconciliation
    generated always as (
      case
        when lifecycle_axis is not null
         and exhibitor_sales_status is not null
         and visitor_registration_status is not null
        then 'resolved'::public.event_axis_reconciliation
        else 'unresolved'::public.event_axis_reconciliation
      end
    ) stored,
  add column axis_reconciled_at timestamptz,
  add column axis_reconciled_by uuid references auth.users(id) on delete set null,
  add column axis_reconciliation_reason text;

comment on column public.events.lifecycle_axis is
  'Canonical event lifecycle. Independent of sales and registration availability.';
comment on column public.events.exhibitor_sales_status is
  'Canonical exhibitor-sales availability. Never inferred from window timestamps.';
comment on column public.events.visitor_registration_status is
  'Canonical visitor-registration availability. Never inferred from window timestamps.';
comment on column public.events.axis_reconciliation is
  'Derived: resolved only when all three canonical axes are set. Publication is blocked while unresolved.';

create index events_lifecycle_axis_idx
  on public.events (site_id, lifecycle_axis)
  where deleted_at is null;
create index events_axis_reconciliation_idx
  on public.events (site_id, axis_reconciliation)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Legacy -> canonical projection
--
-- Implements the approved mapping table exactly. `ambiguous` marks the legacy
-- values whose canonical meaning cannot be derived without a human decision.
-- For those values the projection still returns whatever IS known (for example
-- `exhibitor_sales_open` reliably means exhibitor sales are open) and leaves the
-- genuinely unknown axes NULL rather than guessing.
-- ---------------------------------------------------------------------------

create or replace function app_private.legacy_event_axis_projection(
  legacy public.event_lifecycle_status
)
returns table (
  lifecycle_axis public.event_lifecycle_axis,
  exhibitor_sales_status public.event_exhibitor_sales_status,
  visitor_registration_status public.event_visitor_registration_status,
  ambiguous boolean
)
language sql
immutable
set search_path = pg_catalog, public
as $$
  select
    case legacy
      when 'draft' then 'draft'::public.event_lifecycle_axis
      when 'scheduled' then 'scheduled'::public.event_lifecycle_axis
      when 'ended' then 'completed'::public.event_lifecycle_axis
      when 'archived' then 'archived'::public.event_lifecycle_axis
      when 'cancelled' then 'cancelled'::public.event_lifecycle_axis
      -- review, exhibitor_sales_open, visitor_registration_open, live,
      -- recap_waitlist and rescheduled are not safely derivable.
      else null
    end,
    case legacy
      when 'draft' then 'planned'::public.event_exhibitor_sales_status
      when 'scheduled' then 'planned'::public.event_exhibitor_sales_status
      when 'ended' then 'closed'::public.event_exhibitor_sales_status
      when 'archived' then 'closed'::public.event_exhibitor_sales_status
      when 'cancelled' then 'closed'::public.event_exhibitor_sales_status
      when 'exhibitor_sales_open' then 'open'::public.event_exhibitor_sales_status
      else null
    end,
    case legacy
      when 'draft' then 'planned'::public.event_visitor_registration_status
      when 'scheduled' then 'planned'::public.event_visitor_registration_status
      when 'ended' then 'closed'::public.event_visitor_registration_status
      when 'archived' then 'closed'::public.event_visitor_registration_status
      when 'cancelled' then 'closed'::public.event_visitor_registration_status
      when 'visitor_registration_open' then 'open'::public.event_visitor_registration_status
      else null
    end,
    legacy not in ('draft', 'scheduled', 'ended', 'archived', 'cancelled');
$$;

comment on function app_private.legacy_event_axis_projection(public.event_lifecycle_status) is
  'Approved legacy lifecycle -> canonical axis mapping. Ambiguous values return NULL axes and require manual reconciliation.';

-- ---------------------------------------------------------------------------
-- Axis transition history
--
-- One audited record captures the old and new value of ALL THREE axes in a
-- single transition, so an availability change is never split across rows.
-- ---------------------------------------------------------------------------

create table public.event_axis_history (
  id bigint generated always as identity primary key,
  site_id uuid not null,
  event_id uuid not null,
  from_lifecycle_axis public.event_lifecycle_axis,
  to_lifecycle_axis public.event_lifecycle_axis,
  from_exhibitor_sales_status public.event_exhibitor_sales_status,
  to_exhibitor_sales_status public.event_exhibitor_sales_status,
  from_visitor_registration_status public.event_visitor_registration_status,
  to_visitor_registration_status public.event_visitor_registration_status,
  reason text not null,
  actor_id uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now(),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade
);

create index event_axis_history_event_idx
  on public.event_axis_history (site_id, event_id, changed_at desc);

alter table public.event_axis_history enable row level security;

create policy event_axis_history_staff_read on public.event_axis_history for select to authenticated
  using ((select app_private.has_permission(site_id, 'content.read')));

-- History is written by trigger only: SELECT is granted, direct writes are not.
grant select on table public.event_axis_history to authenticated;

-- ---------------------------------------------------------------------------
-- Backfill
--
-- Runs before the maintenance triggers exist so it cannot recurse. Rows whose
-- legacy value is ambiguous keep NULL axes and therefore stay `unresolved`.
-- ---------------------------------------------------------------------------

update public.events e
set
  lifecycle_axis = (
    select p.lifecycle_axis
    from app_private.legacy_event_axis_projection(e.lifecycle_status) p
  ),
  exhibitor_sales_status = (
    select p.exhibitor_sales_status
    from app_private.legacy_event_axis_projection(e.lifecycle_status) p
  ),
  visitor_registration_status = (
    select p.visitor_registration_status
    from app_private.legacy_event_axis_projection(e.lifecycle_status) p
  );

-- ---------------------------------------------------------------------------
-- Axis maintenance
--
-- New events begin in draft (already enforced by c_validate_event_lifecycle), so
-- their canonical axes are unambiguous and are set immediately. On a legacy
-- lifecycle change the projection is applied: unambiguous values resolve the
-- row, ambiguous values write only what is known and leave the row unresolved.
-- ---------------------------------------------------------------------------

create or replace function app_private.maintain_event_axes()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  projected record;
begin
  if tg_op = 'INSERT' then
    -- Respect axes supplied explicitly by a canonical-aware caller.
    if new.lifecycle_axis is null
       and new.exhibitor_sales_status is null
       and new.visitor_registration_status is null then
      select p.lifecycle_axis, p.exhibitor_sales_status, p.visitor_registration_status
        into projected
      from app_private.legacy_event_axis_projection(new.lifecycle_status) p;

      new.lifecycle_axis := projected.lifecycle_axis;
      new.exhibitor_sales_status := projected.exhibitor_sales_status;
      new.visitor_registration_status := projected.visitor_registration_status;
    end if;
    return new;
  end if;

  -- Only project when the legacy value actually changed. A caller that sets the
  -- canonical axes directly is authoritative and is never overwritten here.
  if new.lifecycle_status is distinct from old.lifecycle_status
     and new.lifecycle_axis is not distinct from old.lifecycle_axis
     and new.exhibitor_sales_status is not distinct from old.exhibitor_sales_status
     and new.visitor_registration_status is not distinct from old.visitor_registration_status
  then
    select p.lifecycle_axis, p.exhibitor_sales_status, p.visitor_registration_status, p.ambiguous
      into projected
    from app_private.legacy_event_axis_projection(new.lifecycle_status) p;

    if projected.ambiguous then
      -- Write only what is known; leave the rest NULL so the row stays
      -- unresolved and publication remains blocked.
      new.lifecycle_axis := projected.lifecycle_axis;
      new.exhibitor_sales_status := coalesce(
        projected.exhibitor_sales_status, new.exhibitor_sales_status
      );
      new.visitor_registration_status := coalesce(
        projected.visitor_registration_status, new.visitor_registration_status
      );
    else
      new.lifecycle_axis := projected.lifecycle_axis;
      new.exhibitor_sales_status := projected.exhibitor_sales_status;
      new.visitor_registration_status := projected.visitor_registration_status;
    end if;
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Protected-content guard: recognise the canonical axes as workflow state
--
-- `app_private.govern_publication_status` blocks edits to approved/scheduled/
-- published/archived content by diffing the row minus a fixed allowlist of
-- workflow columns. The canonical axes are workflow state, exactly like the
-- legacy `lifecycle_status` that is already on that list, but they were added
-- after the function was written, so a lifecycle transition on an approved event
-- now looks like an illegal content edit.
--
-- This redefinition is byte-for-byte the definition from
-- 202607310009_cms_page_api.sql with the seven canonical axis columns added to
-- the allowlist. No other behaviour changes. The strip list is shared by every
-- publication-status table; keys that a table does not have are simply absent
-- and removing them is a no-op.
-- ---------------------------------------------------------------------------

create or replace function app_private.govern_publication_status()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  is_service boolean := (select app_private.is_service_context());
  row_data jsonb := to_jsonb(new);
  workflow_columns text[] := array[
    'status', 'publish_at', 'published_at', 'archived_at', 'updated_at',
    'updated_by', 'lock_version', 'lifecycle_status',
    -- Canonical event axes (202608020001).
    'lifecycle_axis', 'exhibitor_sales_status', 'visitor_registration_status',
    'axis_reconciliation', 'axis_reconciled_at', 'axis_reconciled_by',
    'axis_reconciliation_reason'
  ];
  old_content jsonb;
  new_content jsonb;
begin
  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception using errcode = '42501', message = 'new content must begin in draft';
    end if;
    if not is_service and row_data ? 'created_by' then
      new := jsonb_populate_record(new, jsonb_build_object('created_by', (select auth.uid())));
    end if;
    if not is_service and row_data ? 'updated_by' then
      new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
    end if;
    return new;
  end if;

  old_content := to_jsonb(old) - workflow_columns;
  new_content := to_jsonb(new) - workflow_columns;

  if new.status = old.status
     and old.status in ('approved', 'scheduled', 'published', 'archived')
     and old_content is distinct from new_content
     and not is_service then
    raise exception using errcode = '23514', message = 'protected content must re-enter an editable workflow state before editing';
  end if;

  if new.status <> old.status then
    if not (select app_private.is_valid_publication_transition(old.status, new.status)) then
      raise exception using errcode = '23514', message = format(
        'invalid publication transition for %s: %s -> %s', tg_table_name, old.status, new.status
      );
    end if;

    if not is_service and not (select app_private.has_permission(new.site_id, 'content.write')) then
      raise exception using errcode = '42501', message = 'content.write permission required';
    end if;

    if new.status in ('approved', 'scheduled', 'published', 'archived')
       and not is_service
       and not (select app_private.has_permission(new.site_id, 'content.publish')) then
      raise exception using errcode = '42501', message = 'content.publish permission required';
    end if;

    if new.status = 'scheduled' and not (select app_private.translation_coverage_complete(
      tg_table_name,
      new.site_id,
      new.id,
      array['approved', 'published']::public.translation_status[]
    )) then
      raise exception using errcode = '23514', message = 'all enabled locales must be approved before scheduling';
    end if;

    if new.status = 'published' and not (select app_private.translation_coverage_complete(
      tg_table_name,
      new.site_id,
      new.id,
      array['published']::public.translation_status[]
    )) then
      raise exception using errcode = '23514', message = 'all enabled locales must be published before base content publication';
    end if;

    if new.status = 'published'
       and old.status = 'scheduled'
       and nullif(to_jsonb(old) ->> 'publish_at', '')::timestamptz > now()
       and not is_service then
      raise exception using errcode = '23514', message = 'scheduled content cannot publish before publish_at';
    end if;

    if new.status = 'published' and row_data ? 'published_at' then
      new := jsonb_populate_record(new, jsonb_build_object('published_at', now()));
    elsif new.status = 'archived' and row_data ? 'archived_at' then
      new := jsonb_populate_record(new, jsonb_build_object('archived_at', now()));
    end if;
  end if;

  if row_data ? 'updated_by' and not is_service then
    new := jsonb_populate_record(new, jsonb_build_object('updated_by', (select auth.uid())));
  end if;
  if row_data ? 'lock_version' then
    new := jsonb_populate_record(
      new,
      jsonb_build_object('lock_version', coalesce((to_jsonb(old) ->> 'lock_version')::integer, 0) + 1)
    );
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Publication guard
--
-- An event whose canonical availability is unknown must not reach the public
-- site. This blocks scheduling and publishing while reconciliation is
-- unresolved, on both insert and update.
-- ---------------------------------------------------------------------------

create or replace function app_private.guard_event_axis_publication()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if new.status in ('scheduled', 'published')
     and new.axis_reconciliation = 'unresolved' then
    raise exception using
      errcode = '23514',
      message = 'event publication is blocked while canonical axis reconciliation is unresolved',
      hint = 'set lifecycle_axis, exhibitor_sales_status and visitor_registration_status via public.set_event_axes_v1';
  end if;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Axis history recording
-- ---------------------------------------------------------------------------

create or replace function app_private.record_event_axis_history()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  reason text := coalesce(
    nullif(current_setting('app.transition_reason', true), ''),
    case when tg_op = 'INSERT' then 'event created' else 'canonical axis maintenance' end
  );
begin
  if tg_op = 'UPDATE'
     and new.lifecycle_axis is not distinct from old.lifecycle_axis
     and new.exhibitor_sales_status is not distinct from old.exhibitor_sales_status
     and new.visitor_registration_status is not distinct from old.visitor_registration_status
  then
    return null;
  end if;

  insert into public.event_axis_history (
    site_id,
    event_id,
    from_lifecycle_axis,
    to_lifecycle_axis,
    from_exhibitor_sales_status,
    to_exhibitor_sales_status,
    from_visitor_registration_status,
    to_visitor_registration_status,
    reason,
    actor_id
  ) values (
    new.site_id,
    new.id,
    case when tg_op = 'UPDATE' then old.lifecycle_axis end,
    new.lifecycle_axis,
    case when tg_op = 'UPDATE' then old.exhibitor_sales_status end,
    new.exhibitor_sales_status,
    case when tg_op = 'UPDATE' then old.visitor_registration_status end,
    new.visitor_registration_status,
    reason,
    (select auth.uid())
  );

  return null;
end;
$$;

-- Trigger names carry their ordering: `c_` validates, `d_` projects, `m_`/`n_`
-- record history, `z_` audits. `d_` therefore runs after the existing
-- `c_validate_event_lifecycle` guard.
create trigger d_maintain_event_axes
  before insert or update on public.events
  for each row execute function app_private.maintain_event_axes();

create trigger e_guard_event_axis_publication
  before insert or update on public.events
  for each row execute function app_private.guard_event_axis_publication();

create trigger n_record_event_axis_history
  after insert or update on public.events
  for each row execute function app_private.record_event_axis_history();

-- ---------------------------------------------------------------------------
-- Canonical axis control
--
-- The single supported way for staff to set event availability. Each axis is
-- set independently; NULL means "leave unchanged". A reason is mandatory and the
-- change is recorded in event_axis_history by trigger.
-- ---------------------------------------------------------------------------

create or replace function public.set_event_axes_v1(
  p_event_id uuid,
  p_reason text,
  p_lifecycle_axis public.event_lifecycle_axis default null,
  p_exhibitor_sales_status public.event_exhibitor_sales_status default null,
  p_visitor_registration_status public.event_visitor_registration_status default null
)
returns public.events
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events;
  updated public.events;
begin
  if coalesce(btrim(p_reason), '') = '' then
    raise exception using
      errcode = '22023',
      message = 'a reason is required to change canonical event axes';
  end if;

  if p_lifecycle_axis is null
     and p_exhibitor_sales_status is null
     and p_visitor_registration_status is null then
    raise exception using
      errcode = '22023',
      message = 'at least one canonical event axis must be supplied';
  end if;

  select * into target from public.events where id = p_event_id and deleted_at is null;

  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;

  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'insufficient permission to change event axes';
  end if;

  perform set_config('app.transition_reason', p_reason, true);

  update public.events e
  set
    lifecycle_axis = coalesce(p_lifecycle_axis, e.lifecycle_axis),
    exhibitor_sales_status = coalesce(p_exhibitor_sales_status, e.exhibitor_sales_status),
    visitor_registration_status = coalesce(
      p_visitor_registration_status, e.visitor_registration_status
    ),
    axis_reconciled_at = now(),
    axis_reconciled_by = (select auth.uid()),
    axis_reconciliation_reason = p_reason,
    updated_by = (select auth.uid()),
    updated_at = now()
  where e.id = p_event_id
  returning * into updated;

  return updated;
end;
$$;

comment on function public.set_event_axes_v1(
  uuid, text, public.event_lifecycle_axis,
  public.event_exhibitor_sales_status, public.event_visitor_registration_status
) is
  'Sets canonical event axes independently. Requires content.write and a reason. Records event_axis_history.';

grant execute on function app_private.legacy_event_axis_projection(public.event_lifecycle_status)
  to authenticated, service_role;

grant execute on function public.set_event_axes_v1(
  uuid, text, public.event_lifecycle_axis,
  public.event_exhibitor_sales_status, public.event_visitor_registration_status
) to authenticated;

commit;
