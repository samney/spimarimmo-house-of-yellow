begin;

alter table public.global_settings
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.seo_entries
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function public.cms_settings_seo_workspace_v1(
  p_site_id uuid,
  p_locale text default null
)
returns table (global_settings jsonb, seo_entries jsonb)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_locale is not null and not exists (
    select 1 from public.site_locales l
    where l.site_id = p_site_id and l.locale = p_locale and l.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled locale is required';
  end if;

  return query select
    coalesce((
      select jsonb_agg(to_jsonb(setting) order by setting.setting_key, setting.locale nulls first)
      from public.global_settings setting
      where setting.site_id = p_site_id
        and (p_locale is null or setting.locale is null or setting.locale = p_locale)
    ), '[]'::jsonb),
    coalesce((
      select jsonb_agg(to_jsonb(entry) order by entry.route, entry.locale)
      from public.seo_entries entry
      where entry.site_id = p_site_id and (p_locale is null or entry.locale = p_locale)
    ), '[]'::jsonb);
end;
$$;

create or replace function public.create_global_setting_v1(
  p_site_id uuid,
  p_setting_key text,
  p_locale text,
  p_value jsonb
)
returns table (setting_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.global_settings%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_setting_key is null or btrim(p_setting_key) !~ '^[a-z0-9_.-]+$' or length(btrim(p_setting_key)) > 200 then
    raise exception using errcode = '22023', message = 'valid setting key is required';
  end if;
  if p_locale is not null and not exists (
    select 1 from public.site_locales l where l.site_id = p_site_id and l.locale = p_locale and l.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled locale is required';
  end if;
  if p_value is null or jsonb_typeof(p_value) not in ('object','array','string','number','boolean')
     or octet_length(p_value::text) > 16384 then
    raise exception using errcode = '22023', message = 'bounded setting value is required';
  end if;

  insert into public.global_settings (site_id, setting_key, locale, value, created_by, updated_by)
  values (p_site_id, btrim(p_setting_key), p_locale, p_value, (select auth.uid()), (select auth.uid()))
  returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_global_setting_v1(
  p_setting_id uuid,
  p_expected_lock_version integer,
  p_value jsonb,
  p_reason text
)
returns table (setting_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.global_settings%rowtype;
begin
  select * into target from public.global_settings where id = p_setting_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'global setting not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'global setting must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'global setting was modified by another editor';
  end if;
  if p_value is null or jsonb_typeof(p_value) not in ('object','array','string','number','boolean')
     or octet_length(p_value::text) > 16384 then
    raise exception using errcode = '22023', message = 'bounded setting value is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.global_settings
  set value = p_value, lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_global_setting_status_v1(
  p_setting_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (setting_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.global_settings%rowtype;
begin
  select * into target from public.global_settings where id = p_setting_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'global setting not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'global setting scheduling is not implemented';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.global_settings set status = p_new_status where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.create_seo_entry_v1(
  p_site_id uuid,
  p_locale text,
  p_route text,
  p_title text,
  p_description text,
  p_canonical_url text,
  p_robots_index boolean,
  p_robots_follow boolean,
  p_open_graph jsonb,
  p_structured_data jsonb
)
returns table (seo_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.seo_entries%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if not exists (select 1 from public.site_locales l where l.site_id = p_site_id and l.locale = p_locale and l.enabled) then
    raise exception using errcode = '22023', message = 'enabled locale is required';
  end if;
  perform app_private.validate_seo_input_v1(p_route, p_title, p_description, p_canonical_url,
    p_robots_index, p_robots_follow, p_open_graph, p_structured_data);
  insert into public.seo_entries (
    site_id, locale, route, title, description, canonical_url, robots_index,
    robots_follow, open_graph, structured_data, created_by, updated_by
  ) values (
    p_site_id, p_locale, btrim(p_route), btrim(p_title), btrim(p_description),
    nullif(btrim(p_canonical_url), ''), p_robots_index, p_robots_follow,
    p_open_graph, p_structured_data, (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function app_private.validate_seo_input_v1(
  p_route text,
  p_title text,
  p_description text,
  p_canonical_url text,
  p_robots_index boolean,
  p_robots_follow boolean,
  p_open_graph jsonb,
  p_structured_data jsonb
)
returns void
language plpgsql
immutable
set search_path = pg_catalog
as $$
begin
  if p_route is null or length(btrim(p_route)) not between 1 and 500
     or btrim(p_route) !~ '^/' or position('?' in p_route) > 0 or position('#' in p_route) > 0 then
    raise exception using errcode = '22023', message = 'valid SEO route is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 120
     or p_description is null or length(btrim(p_description)) not between 1 and 320 then
    raise exception using errcode = '22023', message = 'bounded SEO title and description are required';
  end if;
  if p_canonical_url is not null and btrim(p_canonical_url) <> '' and btrim(p_canonical_url) !~ '^https://[^[:space:]]+$' then
    raise exception using errcode = '22023', message = 'HTTPS canonical URL is required';
  end if;
  if p_robots_index is null or p_robots_follow is null
     or p_open_graph is null or jsonb_typeof(p_open_graph) <> 'object'
     or p_structured_data is null or jsonb_typeof(p_structured_data) <> 'array'
     or octet_length(p_open_graph::text) > 16384 or octet_length(p_structured_data::text) > 32768 then
    raise exception using errcode = '22023', message = 'valid bounded SEO metadata is required';
  end if;
end;
$$;

create or replace function public.update_seo_entry_v1(
  p_seo_id uuid,
  p_expected_lock_version integer,
  p_route text,
  p_title text,
  p_description text,
  p_canonical_url text,
  p_robots_index boolean,
  p_robots_follow boolean,
  p_open_graph jsonb,
  p_structured_data jsonb,
  p_reason text
)
returns table (seo_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.seo_entries%rowtype;
begin
  select * into target from public.seo_entries where id = p_seo_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'SEO entry not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'SEO entry must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'SEO entry was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_seo_input_v1(p_route, p_title, p_description, p_canonical_url,
    p_robots_index, p_robots_follow, p_open_graph, p_structured_data);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.seo_entries set
    route = btrim(p_route), title = btrim(p_title), description = btrim(p_description),
    canonical_url = nullif(btrim(p_canonical_url), ''), robots_index = p_robots_index,
    robots_follow = p_robots_follow, open_graph = p_open_graph,
    structured_data = p_structured_data, lock_version = target.lock_version + 1,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_seo_entry_status_v1(
  p_seo_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (seo_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.seo_entries%rowtype;
begin
  select * into target from public.seo_entries where id = p_seo_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'SEO entry not found'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'SEO scheduling is not implemented'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.seo_entries set status = p_new_status where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.global_settings, public.seo_entries from authenticated;
revoke all on function public.cms_settings_seo_workspace_v1(uuid, text) from public, anon;
revoke all on function public.create_global_setting_v1(uuid, text, text, jsonb) from public, anon;
revoke all on function public.update_global_setting_v1(uuid, integer, jsonb, text) from public, anon;
revoke all on function public.transition_global_setting_status_v1(uuid, public.publication_status, text) from public, anon;
revoke all on function public.create_seo_entry_v1(uuid, text, text, text, text, text, boolean, boolean, jsonb, jsonb) from public, anon;
revoke all on function public.update_seo_entry_v1(uuid, integer, text, text, text, text, boolean, boolean, jsonb, jsonb, text) from public, anon;
revoke all on function public.transition_seo_entry_status_v1(uuid, public.publication_status, text) from public, anon;

grant execute on function public.cms_settings_seo_workspace_v1(uuid, text) to authenticated;
grant execute on function public.create_global_setting_v1(uuid, text, text, jsonb) to authenticated;
grant execute on function public.update_global_setting_v1(uuid, integer, jsonb, text) to authenticated;
grant execute on function public.transition_global_setting_status_v1(uuid, public.publication_status, text) to authenticated;
grant execute on function public.create_seo_entry_v1(uuid, text, text, text, text, text, boolean, boolean, jsonb, jsonb) to authenticated;
grant execute on function public.update_seo_entry_v1(uuid, integer, text, text, text, text, boolean, boolean, jsonb, jsonb, text) to authenticated;
grant execute on function public.transition_seo_entry_status_v1(uuid, public.publication_status, text) to authenticated;

commit;
