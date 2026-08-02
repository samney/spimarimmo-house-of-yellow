begin;

alter table public.project_metrics
  add column if not exists evidence_source text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.project_credits
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

drop trigger if exists a_capture_revision on public.project_metrics;
create trigger a_capture_revision before update or delete on public.project_metrics
  for each row execute function app_private.capture_content_revision();
drop trigger if exists a_capture_revision on public.project_credits;
create trigger a_capture_revision before update or delete on public.project_credits
  for each row execute function app_private.capture_content_revision();
drop trigger if exists z_set_updated_at on public.project_credits;
create trigger z_set_updated_at before update on public.project_credits
  for each row execute function app_private.set_updated_at();

create or replace function public.cms_project_details_v1(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  return jsonb_build_object(
    'metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metricId', metric.id, 'metricKey', metric.metric_key,
      'displayValue', metric.display_value, 'definition', metric.definition,
      'periodStart', metric.period_start, 'periodEnd', metric.period_end,
      'sourceLabel', metric.source_label, 'sourceUrl', metric.source_url,
      'evidenceStatus', metric.evidence_status,
      'evidenceSource', metric.evidence_source, 'position', metric.position,
      'lockVersion', metric.lock_version, 'updatedAt', metric.updated_at
    ) order by metric.position, metric.id) from public.project_metrics metric
      where metric.project_id = parent.id and metric.site_id = parent.site_id), '[]'::jsonb),
    'credits', coalesce((select jsonb_agg(jsonb_build_object(
      'creditId', credit.id, 'role', credit.credit_role,
      'name', credit.credit_name, 'position', credit.position,
      'lockVersion', credit.lock_version, 'updatedAt', credit.updated_at
    ) order by credit.position, credit.id) from public.project_credits credit
      where credit.project_id = parent.id and credit.site_id = parent.site_id), '[]'::jsonb),
    'relations', coalesce((select jsonb_agg(jsonb_build_object(
      'relatedProjectId', relation.related_project_id,
      'kind', relation.relation_kind, 'position', relation.position
    ) order by relation.position, relation.related_project_id, relation.relation_kind)
      from public.project_relations relation
      where relation.project_id = parent.id and relation.site_id = parent.site_id), '[]'::jsonb)
  );
end;
$$;

create or replace function app_private.validate_project_metric_input_v1(
  p_metric_key text, p_display_value text, p_definition text,
  p_period_start date, p_period_end date, p_source_label text,
  p_source_url text, p_position integer
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
    raise exception using errcode = '22023', message = 'valid project metric key is required';
  end if;
  if p_display_value is null or length(btrim(p_display_value)) not between 1 and 200
     or p_definition is null or length(btrim(p_definition)) not between 1 and 2000
     or p_source_label is null or length(btrim(p_source_label)) not between 1 and 500 then
    raise exception using errcode = '22023', message = 'complete project metric content is required';
  end if;
  if p_period_start is not null and p_period_end is not null and p_period_end < p_period_start then
    raise exception using errcode = '22023', message = 'project metric period is invalid';
  end if;
  if nullif(btrim(p_source_url), '') is not null and (
    length(btrim(p_source_url)) > 2048 or btrim(p_source_url) !~ '^https://'
  ) then
    raise exception using errcode = '22023', message = 'project metric source URL must use HTTPS';
  end if;
  if p_position is null or p_position not between 0 and 1000000 then
    raise exception using errcode = '22023', message = 'valid project metric position is required';
  end if;
end;
$$;

create or replace function public.create_project_metric_v1(
  p_project_id uuid, p_metric_key text, p_display_value text,
  p_definition text, p_period_start date, p_period_end date,
  p_source_label text, p_source_url text, p_position integer
)
returns table (
  metric_id uuid, evidence_status public.evidence_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype; target public.project_metrics%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before metric changes';
  end if;
  perform app_private.validate_project_metric_input_v1(
    p_metric_key, p_display_value, p_definition, p_period_start, p_period_end,
    p_source_label, p_source_url, p_position
  );
  insert into public.project_metrics (
    site_id, project_id, metric_key, display_value, definition,
    period_start, period_end, source_label, source_url, position,
    created_by, updated_by
  ) values (
    parent.site_id, parent.id, btrim(p_metric_key), btrim(p_display_value),
    btrim(p_definition), p_period_start, p_period_end, btrim(p_source_label),
    nullif(btrim(p_source_url), ''), p_position,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_project_metric_v1(
  p_project_id uuid, p_metric_id uuid, p_expected_lock_version integer,
  p_metric_key text, p_display_value text, p_definition text,
  p_period_start date, p_period_end date, p_source_label text,
  p_source_url text, p_position integer, p_reason text
)
returns table (
  metric_id uuid, evidence_status public.evidence_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype; target public.project_metrics%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  select * into target from public.project_metrics metric
  where metric.id = p_metric_id and metric.project_id = parent.id
    and metric.site_id = parent.site_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'project metric not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before metric changes';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project metric was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_project_metric_input_v1(
    p_metric_key, p_display_value, p_definition, p_period_start, p_period_end,
    p_source_label, p_source_url, p_position
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_metrics set
    metric_key = btrim(p_metric_key), display_value = btrim(p_display_value),
    definition = btrim(p_definition), period_start = p_period_start,
    period_end = p_period_end, source_label = btrim(p_source_label),
    source_url = nullif(btrim(p_source_url), ''), position = p_position,
    evidence_status = 'missing', evidence_source = null,
    approved_by = null, approved_at = null,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_project_metric_evidence_v1(
  p_project_id uuid, p_metric_id uuid,
  p_new_status public.evidence_status, p_evidence_source text, p_reason text
)
returns table (
  metric_id uuid, evidence_status public.evidence_status,
  approved_by uuid, approved_at timestamptz, lock_version integer
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype; target public.project_metrics%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  select * into target from public.project_metrics metric
  where metric.id = p_metric_id and metric.project_id = parent.id
    and metric.site_id = parent.site_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'project metric not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published project metric evidence cannot change';
  end if;
  if not ((target.evidence_status = 'missing' and p_new_status = 'submitted')
    or (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected'))
    or (target.evidence_status = 'rejected' and p_new_status = 'submitted')) then
    raise exception using errcode = '23514', message = 'invalid project metric evidence transition';
  end if;
  if p_new_status in ('verified','rejected')
     and not (select app_private.has_permission(parent.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000
     or p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'bounded evidence source and reason are required';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_metrics set evidence_status = p_new_status,
    evidence_source = btrim(p_evidence_source),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status,
    target.approved_by, target.approved_at, target.lock_version;
end;
$$;

create or replace function public.remove_project_metric_v1(
  p_project_id uuid, p_metric_id uuid,
  p_expected_lock_version integer, p_reason text
)
returns table (metric_id uuid, removed boolean)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype; target public.project_metrics%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  select * into target from public.project_metrics metric
  where metric.id = p_metric_id and metric.project_id = parent.id
    and metric.site_id = parent.site_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'project metric not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before metric changes';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project metric was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'removal reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  delete from public.project_metrics where id = target.id;
  return query select target.id, true;
end;
$$;

create or replace function public.replace_project_credits_v1(
  p_project_id uuid, p_expected_lock_version integer,
  p_credits jsonb, p_reason text
)
returns table (
  project_id uuid, lock_version integer,
  credit_count integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before credit changes';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project was modified by another editor';
  end if;
  if p_credits is null or jsonb_typeof(p_credits) <> 'array'
     or jsonb_array_length(p_credits) > 100
     or exists (select 1 from jsonb_array_elements(p_credits) item where
       jsonb_typeof(item) <> 'object'
       or not (item ?& array['role','name'])
       or item - array['role','name']::text[] <> '{}'::jsonb
       or length(btrim(item ->> 'role')) not between 1 and 200
       or length(btrim(item ->> 'name')) not between 1 and 300) then
    raise exception using errcode = '22023', message = 'zero to one hundred valid project credits are required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'credit reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  delete from public.project_credits credit
    where credit.project_id = target.id and credit.site_id = target.site_id;
  insert into public.project_credits (
    site_id, project_id, credit_role, credit_name, position, created_by, updated_by
  ) select target.site_id, target.id, btrim(item.value ->> 'role'),
    btrim(item.value ->> 'name'), (item.ordinality - 1)::integer,
    (select auth.uid()), (select auth.uid())
  from jsonb_array_elements(p_credits) with ordinality item(value, ordinality);
  update public.projects set lock_version = target.lock_version + 1,
    updated_by = (select auth.uid()) where id = target.id returning * into target;
  return query select target.id, target.lock_version,
    jsonb_array_length(p_credits), target.updated_at;
end;
$$;

create or replace function public.replace_project_relations_v1(
  p_project_id uuid, p_expected_lock_version integer,
  p_relations jsonb, p_reason text
)
returns table (
  project_id uuid, lock_version integer,
  relation_count integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before relation changes';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project was modified by another editor';
  end if;
  if p_relations is null or jsonb_typeof(p_relations) <> 'array'
     or jsonb_array_length(p_relations) > 50
     or exists (select 1 from jsonb_array_elements(p_relations) item where
       jsonb_typeof(item) <> 'object'
       or not (item ?& array['relatedProjectId','kind'])
       or item - array['relatedProjectId','kind']::text[] <> '{}'::jsonb
       or (item ->> 'relatedProjectId') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
       or (item ->> 'kind') not in ('next','related','featured'))
     or exists (select 1 from jsonb_array_elements(p_relations) item
       group by item ->> 'relatedProjectId', item ->> 'kind' having count(*) > 1) then
    raise exception using errcode = '22023', message = 'zero to fifty unique project relations are required';
  end if;
  if exists (select 1 from jsonb_array_elements(p_relations) item
    where (item ->> 'relatedProjectId')::uuid = target.id) then
    raise exception using errcode = '22023', message = 'project cannot relate to itself';
  end if;
  if exists (select 1 from jsonb_array_elements(p_relations) item
    where not exists (select 1 from public.projects related
      where related.id = (item ->> 'relatedProjectId')::uuid
        and related.site_id = target.site_id and related.deleted_at is null)) then
    raise exception using errcode = '22023', message = 'related projects must belong to the same site';
  end if;
  if exists (
    with recursive walk(current_id, path) as (
      select (item ->> 'relatedProjectId')::uuid,
        array[(item ->> 'relatedProjectId')::uuid]
      from jsonb_array_elements(p_relations) item where item ->> 'kind' = 'next'
      union all
      select relation.related_project_id, walk.path || relation.related_project_id
      from walk join public.project_relations relation
        on relation.project_id = walk.current_id and relation.site_id = target.site_id
          and relation.relation_kind = 'next'
      where not relation.related_project_id = any(walk.path)
    ) select 1 from walk where current_id = target.id
  ) then
    raise exception using errcode = '22023', message = 'next-project relations cannot contain cycles';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'relation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  delete from public.project_relations relation
    where relation.project_id = target.id and relation.site_id = target.site_id;
  insert into public.project_relations (
    site_id, project_id, related_project_id, relation_kind, position
  ) select target.site_id, target.id,
    (item.value ->> 'relatedProjectId')::uuid,
    item.value ->> 'kind', (item.ordinality - 1)::integer
  from jsonb_array_elements(p_relations) with ordinality item(value, ordinality);
  update public.projects set lock_version = target.lock_version + 1,
    updated_by = (select auth.uid()) where id = target.id returning * into target;
  return query select target.id, target.lock_version,
    jsonb_array_length(p_relations), target.updated_at;
end;
$$;

revoke insert, update, delete on table public.project_metrics from authenticated;
revoke insert, update, delete on table public.project_credits from authenticated;
revoke insert, update, delete on table public.project_relations from authenticated;

revoke all on function public.cms_project_details_v1(uuid) from public, anon;
revoke all on function public.create_project_metric_v1(uuid,text,text,text,date,date,text,text,integer) from public, anon;
revoke all on function public.update_project_metric_v1(uuid,uuid,integer,text,text,text,date,date,text,text,integer,text) from public, anon;
revoke all on function public.transition_project_metric_evidence_v1(uuid,uuid,public.evidence_status,text,text) from public, anon;
revoke all on function public.remove_project_metric_v1(uuid,uuid,integer,text) from public, anon;
revoke all on function public.replace_project_credits_v1(uuid,integer,jsonb,text) from public, anon;
revoke all on function public.replace_project_relations_v1(uuid,integer,jsonb,text) from public, anon;

grant execute on function public.cms_project_details_v1(uuid) to authenticated;
grant execute on function public.create_project_metric_v1(uuid,text,text,text,date,date,text,text,integer) to authenticated;
grant execute on function public.update_project_metric_v1(uuid,uuid,integer,text,text,text,date,date,text,text,integer,text) to authenticated;
grant execute on function public.transition_project_metric_evidence_v1(uuid,uuid,public.evidence_status,text,text) to authenticated;
grant execute on function public.remove_project_metric_v1(uuid,uuid,integer,text) to authenticated;
grant execute on function public.replace_project_credits_v1(uuid,integer,jsonb,text) to authenticated;
grant execute on function public.replace_project_relations_v1(uuid,integer,jsonb,text) to authenticated;

commit;
