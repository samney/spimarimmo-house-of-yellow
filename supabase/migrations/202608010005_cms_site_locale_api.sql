begin;

alter table public.sites
  add column if not exists lock_version integer not null default 1
  check (lock_version > 0);

create or replace function public.cms_site_workspace_v1(p_site_id uuid)
returns table (
  site_id uuid,
  slug text,
  site_name text,
  current_status public.site_status,
  default_locale text,
  timezone text,
  settings jsonb,
  lock_version integer,
  domains jsonb,
  locales jsonb,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'settings.manage')) then
    raise exception using errcode = '42501', message = 'settings.manage permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;

  return query
  select s.id, s.slug, s.name, s.status, s.default_locale, s.timezone,
    s.settings, s.lock_version,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id,
        'hostname', d.hostname,
        'isCanonical', d.is_canonical,
        'redirectsToCanonical', d.redirects_to_canonical
      ) order by d.is_canonical desc, d.hostname)
      from public.site_domains d where d.site_id = s.id
    ), '[]'::jsonb),
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'locale', l.locale,
        'direction', l.direction,
        'enabled', l.enabled,
        'isDefault', l.is_default
      ) order by l.is_default desc, l.locale)
      from public.site_locales l where l.site_id = s.id
    ), '[]'::jsonb),
    s.updated_at
  from public.sites s
  where s.id = p_site_id and s.deleted_at is null;
end;
$$;

create or replace function public.update_site_settings_v1(
  p_site_id uuid,
  p_expected_lock_version integer,
  p_name text,
  p_status public.site_status,
  p_timezone text,
  p_settings jsonb,
  p_reason text
)
returns table (
  site_id uuid,
  site_name text,
  current_status public.site_status,
  timezone text,
  settings jsonb,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.sites%rowtype;
begin
  select * into target from public.sites where id = p_site_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if not (select app_private.has_permission(target.id, 'settings.manage')) then
    raise exception using errcode = '42501', message = 'settings.manage permission required';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'site settings were modified by another administrator';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 200 then
    raise exception using errcode = '22023', message = 'site name must contain 1 to 200 characters';
  end if;
  if p_status is null or p_settings is null or jsonb_typeof(p_settings) <> 'object'
     or octet_length(p_settings::text) > 16384 then
    raise exception using errcode = '22023', message = 'valid bounded site settings are required';
  end if;
  if p_timezone is null or length(btrim(p_timezone)) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'valid timezone is required';
  end if;
  begin
    perform now() at time zone btrim(p_timezone);
  exception when invalid_parameter_value then
    raise exception using errcode = '22023', message = 'valid timezone is required';
  end;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;

  update public.sites
  set name = btrim(p_name), status = p_status, timezone = btrim(p_timezone),
      settings = p_settings, lock_version = target.lock_version + 1,
      updated_by = (select auth.uid())
  where id = target.id
  returning * into target;

  insert into public.audit_events (site_id, actor_id, domain, action, entity_table, entity_id, metadata)
  values (target.id, (select auth.uid()), 'cms', 'site.settings_updated', 'sites', target.id::text,
    jsonb_build_object('reason', btrim(p_reason), 'lockVersion', target.lock_version));

  return query select target.id, target.name, target.status, target.timezone,
    target.settings, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_site_domain_v1(
  p_site_id uuid,
  p_domain_id uuid,
  p_hostname text,
  p_is_canonical boolean,
  p_redirects_to_canonical boolean,
  p_reason text
)
returns table (
  domain_id uuid,
  hostname text,
  is_canonical boolean,
  redirects_to_canonical boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.site_domains%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'settings.manage')) then
    raise exception using errcode = '42501', message = 'settings.manage permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_hostname is null or length(btrim(p_hostname)) not between 1 and 253
     or lower(btrim(p_hostname)) !~ '^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$'
     or btrim(p_hostname) <> lower(btrim(p_hostname))
     or position('..' in btrim(p_hostname)) > 0 then
    raise exception using errcode = '22023', message = 'valid lowercase hostname is required';
  end if;
  if p_is_canonical is null or p_redirects_to_canonical is null then
    raise exception using errcode = '22023', message = 'domain flags are required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'domain reason must contain 3 to 500 characters';
  end if;
  if p_domain_id is not null and not exists (
    select 1 from public.site_domains d where d.id = p_domain_id and d.site_id = p_site_id
  ) then
    raise exception using errcode = 'P0002', message = 'site domain not found';
  end if;

  if p_is_canonical then
    update public.site_domains d set is_canonical = false
    where d.site_id = p_site_id and (p_domain_id is null or d.id <> p_domain_id) and d.is_canonical;
  end if;

  if p_domain_id is null then
    insert into public.site_domains (site_id, hostname, is_canonical, redirects_to_canonical)
    values (p_site_id, btrim(p_hostname), p_is_canonical, p_redirects_to_canonical)
    returning * into target;
  else
    update public.site_domains
    set hostname = btrim(p_hostname), is_canonical = p_is_canonical,
        redirects_to_canonical = p_redirects_to_canonical
    where id = p_domain_id and site_id = p_site_id
    returning * into target;
  end if;

  insert into public.audit_events (site_id, actor_id, domain, action, entity_table, entity_id, metadata)
  values (p_site_id, (select auth.uid()), 'cms', 'site.domain_upserted', 'site_domains', target.id::text,
    jsonb_build_object('reason', btrim(p_reason), 'isCanonical', target.is_canonical));

  return query select target.id, target.hostname, target.is_canonical, target.redirects_to_canonical;
end;
$$;

create or replace function public.remove_site_domain_v1(
  p_site_id uuid,
  p_domain_id uuid,
  p_reason text
)
returns table (domain_id uuid, removed boolean)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.site_domains%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'settings.manage')) then
    raise exception using errcode = '42501', message = 'settings.manage permission required';
  end if;
  select * into target from public.site_domains
  where id = p_domain_id and site_id = p_site_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'site domain not found';
  end if;
  if target.is_canonical then
    raise exception using errcode = '23514', message = 'canonical domain must be replaced before removal';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'domain removal reason must contain 3 to 500 characters';
  end if;

  delete from public.site_domains where id = target.id;
  insert into public.audit_events (site_id, actor_id, domain, action, entity_table, entity_id, metadata)
  values (p_site_id, (select auth.uid()), 'cms', 'site.domain_removed', 'site_domains', target.id::text,
    jsonb_build_object('reason', btrim(p_reason)));
  return query select target.id, true;
end;
$$;

create or replace function public.configure_site_locale_v1(
  p_site_id uuid,
  p_locale text,
  p_enabled boolean,
  p_is_default boolean,
  p_reason text
)
returns table (
  locale text,
  direction text,
  enabled boolean,
  is_default boolean,
  site_lock_version integer
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.site_locales%rowtype;
  site_row public.sites%rowtype;
begin
  select * into site_row from public.sites where id = p_site_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if not (select app_private.has_permission(p_site_id, 'settings.manage')) then
    raise exception using errcode = '42501', message = 'settings.manage permission required';
  end if;
  if p_locale not in ('en', 'fr', 'ar') or p_enabled is null or p_is_default is null then
    raise exception using errcode = '22023', message = 'valid locale configuration is required';
  end if;
  if p_is_default and not p_enabled then
    raise exception using errcode = '23514', message = 'default locale must be enabled';
  end if;
  if not p_enabled and exists (
    select 1 from public.site_locales l
    where l.site_id = p_site_id and l.locale = p_locale and l.is_default
  ) then
    raise exception using errcode = '23514', message = 'default locale cannot be disabled';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'locale reason must contain 3 to 500 characters';
  end if;

  if p_is_default then
    update public.site_locales l set is_default = false
    where l.site_id = p_site_id and l.locale <> p_locale and l.is_default;
  end if;
  insert into public.site_locales (site_id, locale, direction, enabled, is_default)
  values (p_site_id, p_locale, case when p_locale = 'ar' then 'rtl' else 'ltr' end, p_enabled, p_is_default)
  on conflict on constraint site_locales_pkey do update
  set direction = excluded.direction, enabled = excluded.enabled, is_default = excluded.is_default,
      updated_at = now()
  returning * into target;

  if not exists (select 1 from public.site_locales l where l.site_id = p_site_id and l.enabled) then
    raise exception using errcode = '23514', message = 'at least one locale must remain enabled';
  end if;
  if p_is_default then
    update public.sites
    set default_locale = p_locale, lock_version = lock_version + 1, updated_by = (select auth.uid())
    where id = p_site_id
    returning * into site_row;
  end if;

  insert into public.audit_events (site_id, actor_id, domain, action, entity_table, entity_id, metadata)
  values (p_site_id, (select auth.uid()), 'cms', 'site.locale_configured', 'site_locales', p_locale,
    jsonb_build_object('reason', btrim(p_reason), 'enabled', p_enabled, 'isDefault', p_is_default));
  return query select target.locale, target.direction, target.enabled, target.is_default, site_row.lock_version;
end;
$$;

revoke insert, update, delete on table public.sites, public.site_domains, public.site_locales from authenticated;

revoke all on function public.cms_site_workspace_v1(uuid) from public, anon;
revoke all on function public.update_site_settings_v1(uuid, integer, text, public.site_status, text, jsonb, text) from public, anon;
revoke all on function public.upsert_site_domain_v1(uuid, uuid, text, boolean, boolean, text) from public, anon;
revoke all on function public.remove_site_domain_v1(uuid, uuid, text) from public, anon;
revoke all on function public.configure_site_locale_v1(uuid, text, boolean, boolean, text) from public, anon;

grant execute on function public.cms_site_workspace_v1(uuid) to authenticated;
grant execute on function public.update_site_settings_v1(uuid, integer, text, public.site_status, text, jsonb, text) to authenticated;
grant execute on function public.upsert_site_domain_v1(uuid, uuid, text, boolean, boolean, text) to authenticated;
grant execute on function public.remove_site_domain_v1(uuid, uuid, text) to authenticated;
grant execute on function public.configure_site_locale_v1(uuid, text, boolean, boolean, text) to authenticated;

commit;
