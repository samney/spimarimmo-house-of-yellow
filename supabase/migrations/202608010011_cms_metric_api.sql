begin;

alter table public.metrics
  add column if not exists lock_version integer not null default 1 check (lock_version > 0),
  add column if not exists evidence_source text;

create or replace function app_private.metric_warnings_v1(p_metric_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.metrics%rowtype; warnings text[] := array[]::text[];
begin
  select * into target from public.metrics where id = p_metric_id and deleted_at is null;
  if not found then return array['metric_not_found']::text[]; end if;
  if target.evidence_status <> 'verified' then warnings := array_append(warnings, 'evidence_unverified'); end if;
  if nullif(btrim(target.display_value), '') is null then warnings := array_append(warnings, 'missing_display_value'); end if;
  if nullif(btrim(target.definition), '') is null then warnings := array_append(warnings, 'missing_definition'); end if;
  if nullif(btrim(target.source_label), '') is null then warnings := array_append(warnings, 'missing_source'); end if;
  return warnings;
end;
$$;

create or replace function public.search_cms_metrics_v1(
  p_site_id uuid,
  p_event_id uuid default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  metric_id uuid, site_id uuid, event_id uuid, metric_key text,
  display_value text, definition text, period_start date, period_end date,
  source_label text, source_url text, evidence_status public.evidence_status,
  publication_status public.publication_status, lock_version integer,
  warning_codes text[], updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  if not exists (select 1 from public.sites where id = p_site_id and deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the metric site';
  end if;
  return query select metric.id, metric.site_id, metric.event_id, metric.metric_key,
    metric.display_value, metric.definition, metric.period_start, metric.period_end,
    metric.source_label, metric.source_url, metric.evidence_status, metric.status,
    metric.lock_version, app_private.metric_warnings_v1(metric.id), metric.updated_at
  from public.metrics metric
  where metric.site_id = p_site_id and metric.deleted_at is null
    and (p_event_id is null or metric.event_id = p_event_id)
    and (p_status is null or metric.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or metric.metric_key ilike '%' || btrim(p_query) || '%'
      or metric.display_value ilike '%' || btrim(p_query) || '%'
      or metric.source_label ilike '%' || btrim(p_query) || '%')
  order by metric.updated_at desc, metric.id limit p_limit;
end;
$$;

create or replace function app_private.validate_metric_input_v1(
  p_site_id uuid, p_event_id uuid, p_metric_key text, p_display_value text,
  p_definition text, p_period_start date, p_period_end date,
  p_source_label text, p_source_url text
)
returns void
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_metric_key is null or length(btrim(p_metric_key)) not between 1 and 200
     or btrim(p_metric_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid metric key is required';
  end if;
  if p_display_value is null or length(btrim(p_display_value)) not between 1 and 200
     or p_definition is null or length(btrim(p_definition)) not between 1 and 2000
     or p_source_label is null or length(btrim(p_source_label)) not between 1 and 500 then
    raise exception using errcode = '22023', message = 'complete metric content is required';
  end if;
  if p_period_start is not null and p_period_end is not null and p_period_end < p_period_start then
    raise exception using errcode = '22023', message = 'metric period is invalid';
  end if;
  if p_source_url is not null and (
    length(btrim(p_source_url)) > 2048 or btrim(p_source_url) !~ '^https://'
  ) then raise exception using errcode = '22023', message = 'metric source URL must use HTTPS'; end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the metric site';
  end if;
end;
$$;

create or replace function public.create_metric_v1(
  p_site_id uuid, p_event_id uuid, p_metric_key text, p_display_value text,
  p_definition text, p_period_start date, p_period_end date,
  p_source_label text, p_source_url text
)
returns table (metric_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.metrics%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites where id = p_site_id and deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_metric_input_v1(p_site_id, p_event_id, p_metric_key,
    p_display_value, p_definition, p_period_start, p_period_end, p_source_label, p_source_url);
  insert into public.metrics (
    site_id, event_id, metric_key, display_value, definition, period_start,
    period_end, source_label, source_url, created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_metric_key), btrim(p_display_value),
    btrim(p_definition), p_period_start, p_period_end, btrim(p_source_label),
    nullif(btrim(p_source_url), ''), (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_metric_v1(
  p_metric_id uuid, p_expected_lock_version integer, p_event_id uuid,
  p_metric_key text, p_display_value text, p_definition text,
  p_period_start date, p_period_end date, p_source_label text,
  p_source_url text, p_reason text
)
returns table (metric_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.metrics%rowtype;
begin
  select * into target from public.metrics where id = p_metric_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'metric not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'metric must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'metric was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_metric_input_v1(target.site_id, p_event_id, p_metric_key,
    p_display_value, p_definition, p_period_start, p_period_end, p_source_label, p_source_url);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.metrics set event_id = p_event_id, metric_key = btrim(p_metric_key),
    display_value = btrim(p_display_value), definition = btrim(p_definition),
    period_start = p_period_start, period_end = p_period_end,
    source_label = btrim(p_source_label), source_url = nullif(btrim(p_source_url), ''),
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_metric_evidence_v1(
  p_metric_id uuid, p_new_status public.evidence_status,
  p_evidence_source text, p_reason text
)
returns table (metric_id uuid, evidence_status public.evidence_status, approved_by uuid, approved_at timestamptz, lock_version integer)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.metrics%rowtype;
begin
  select * into target from public.metrics where id = p_metric_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'metric not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published metric evidence cannot change';
  end if;
  if not ((target.evidence_status = 'missing' and p_new_status = 'submitted')
    or (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected'))
    or (target.evidence_status = 'rejected' and p_new_status = 'submitted')) then
    raise exception using errcode = '23514', message = 'invalid metric evidence transition';
  end if;
  if p_new_status in ('verified','rejected')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000
     or p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'bounded evidence source and reason are required';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.metrics set evidence_status = p_new_status,
    evidence_source = btrim(p_evidence_source),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.approved_by, target.approved_at, target.lock_version;
end;
$$;

create or replace function public.transition_metric_status_v1(
  p_metric_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (metric_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.metrics%rowtype;
begin
  select * into target from public.metrics where id = p_metric_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'metric not found'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'metric scheduling is not implemented'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published')
     and cardinality(app_private.metric_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'metric is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.metrics set status = p_new_status where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.metrics from authenticated;
revoke all on function public.search_cms_metrics_v1(uuid,uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_metric_v1(uuid,uuid,text,text,text,date,date,text,text) from public, anon;
revoke all on function public.update_metric_v1(uuid,integer,uuid,text,text,text,date,date,text,text,text) from public, anon;
revoke all on function public.transition_metric_evidence_v1(uuid,public.evidence_status,text,text) from public, anon;
revoke all on function public.transition_metric_status_v1(uuid,public.publication_status,text) from public, anon;
grant execute on function public.search_cms_metrics_v1(uuid,uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_metric_v1(uuid,uuid,text,text,text,date,date,text,text) to authenticated;
grant execute on function public.update_metric_v1(uuid,integer,uuid,text,text,text,date,date,text,text,text) to authenticated;
grant execute on function public.transition_metric_evidence_v1(uuid,public.evidence_status,text,text) to authenticated;
grant execute on function public.transition_metric_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
