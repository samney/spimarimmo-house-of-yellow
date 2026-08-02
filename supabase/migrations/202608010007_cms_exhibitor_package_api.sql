begin;

alter table public.exhibitor_packages
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.exhibitor_package_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.exhibitor_package_warnings_v1(p_package_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.exhibitor_packages%rowtype;
  locale_row record;
  translation_row public.exhibitor_package_translations%rowtype;
  warnings text[] := array[]::text[];
begin
  select * into target from public.exhibitor_packages
  where id = p_package_id and deleted_at is null;
  if not found then return array['package_not_found']::text[]; end if;
  if target.evidence_status <> 'verified' then warnings := array_append(warnings, 'evidence_unverified'); end if;
  if target.tier <> 'custom' and target.price_minor is null then warnings := array_append(warnings, 'missing_price'); end if;
  if target.price_minor is not null and target.currency is null then warnings := array_append(warnings, 'missing_currency'); end if;

  for locale_row in
    select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.exhibitor_package_translations
    where package_id = target.id and locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    else
      if jsonb_array_length(translation_row.inclusions) = 0 then
        warnings := array_append(warnings, 'empty_inclusions:' || locale_row.locale);
      end if;
      if translation_row.status not in ('approved','published') then
        warnings := array_append(warnings, 'translation_unapproved:' || locale_row.locale);
      end if;
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_exhibitor_packages_v1(
  p_site_id uuid,
  p_event_id uuid default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  package_id uuid,
  site_id uuid,
  event_id uuid,
  package_key text,
  tier text,
  currency text,
  price_minor bigint,
  capacity integer,
  evidence_status public.evidence_status,
  publication_status public.publication_status,
  lock_version integer,
  warning_codes text[],
  translations jsonb,
  updated_at timestamptz
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
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events e where e.id = p_event_id and e.site_id = p_site_id and e.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'event must belong to the package site';
  end if;

  return query
  select package.id, package.site_id, package.event_id, package.package_key,
    package.tier, package.currency, package.price_minor, package.capacity,
    package.evidence_status, package.status, package.lock_version,
    app_private.exhibitor_package_warnings_v1(package.id),
    coalesce((select jsonb_agg(to_jsonb(translation) order by translation.locale)
      from public.exhibitor_package_translations translation
      where translation.package_id = package.id), '[]'::jsonb),
    package.updated_at
  from public.exhibitor_packages package
  where package.site_id = p_site_id and package.deleted_at is null
    and (p_event_id is null or package.event_id = p_event_id)
    and (p_status is null or package.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or package.package_key ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.exhibitor_package_translations translation
        where translation.package_id = package.id and translation.name ilike '%' || btrim(p_query) || '%'))
  order by package.updated_at desc, package.id limit p_limit;
end;
$$;

create or replace function app_private.validate_exhibitor_package_input_v1(
  p_site_id uuid,
  p_event_id uuid,
  p_package_key text,
  p_tier text,
  p_currency text,
  p_price_minor bigint,
  p_capacity integer
)
returns void
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_package_key is null or length(btrim(p_package_key)) not between 1 and 200
     or btrim(p_package_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid package key is required';
  end if;
  if p_tier is null or p_tier not in ('standard','premium','sponsor','custom') then
    raise exception using errcode = '22023', message = 'valid package tier is required';
  end if;
  if (p_currency is null) <> (p_price_minor is null)
     or (p_currency is not null and p_currency !~ '^[A-Z]{3}$')
     or (p_price_minor is not null and p_price_minor < 0)
     or (p_capacity is not null and p_capacity < 0) then
    raise exception using errcode = '22023', message = 'valid package commercial values are required';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events e where e.id = p_event_id and e.site_id = p_site_id and e.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'event must belong to the package site';
  end if;
end;
$$;

create or replace function public.create_exhibitor_package_v1(
  p_site_id uuid,
  p_event_id uuid,
  p_package_key text,
  p_tier text,
  p_currency text,
  p_price_minor bigint,
  p_capacity integer
)
returns table (package_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.exhibitor_packages%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_exhibitor_package_input_v1(
    p_site_id, p_event_id, p_package_key, p_tier, p_currency, p_price_minor, p_capacity);
  insert into public.exhibitor_packages (
    site_id, event_id, package_key, tier, currency, price_minor, capacity, created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_package_key), p_tier, p_currency, p_price_minor,
    p_capacity, (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_exhibitor_package_v1(
  p_package_id uuid,
  p_expected_lock_version integer,
  p_event_id uuid,
  p_package_key text,
  p_tier text,
  p_currency text,
  p_price_minor bigint,
  p_capacity integer,
  p_reason text
)
returns table (package_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.exhibitor_packages%rowtype;
begin
  select * into target from public.exhibitor_packages where id = p_package_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'exhibitor package not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'exhibitor package must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'exhibitor package was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_exhibitor_package_input_v1(
    target.site_id, p_event_id, p_package_key, p_tier, p_currency, p_price_minor, p_capacity);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.exhibitor_packages set
    event_id = p_event_id, package_key = btrim(p_package_key), tier = p_tier,
    currency = p_currency, price_minor = p_price_minor, capacity = p_capacity,
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_exhibitor_package_translation_v1(
  p_package_id uuid,
  p_locale text,
  p_name text,
  p_summary text,
  p_inclusions jsonb,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare parent public.exhibitor_packages%rowtype; target public.exhibitor_package_translations%rowtype;
begin
  select * into parent from public.exhibitor_packages where id = p_package_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'exhibitor package not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if parent.status <> 'draft' then raise exception using errcode = '23514', message = 'package translations require a draft package'; end if;
  if not exists (select 1 from public.site_locales l where l.site_id = parent.site_id and l.locale = p_locale and l.enabled) then
    raise exception using errcode = '22023', message = 'enabled package locale is required';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 200
     or p_summary is null or length(btrim(p_summary)) > 1000
     or p_inclusions is null or jsonb_typeof(p_inclusions) <> 'array'
     or jsonb_array_length(p_inclusions) > 100 or octet_length(p_inclusions::text) > 16384 then
    raise exception using errcode = '22023', message = 'valid bounded package translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.exhibitor_package_translations
  where package_id = p_package_id and locale = p_locale for update;
  if found then
    if target.status <> 'draft' then raise exception using errcode = '23514', message = 'package translation must be draft before editing'; end if;
    update public.exhibitor_package_translations set
      name = btrim(p_name), summary = btrim(p_summary), inclusions = p_inclusions,
      lock_version = target.lock_version + 1, updated_by = (select auth.uid())
    where id = target.id returning * into target;
  else
    insert into public.exhibitor_package_translations (
      site_id, package_id, locale, name, summary, inclusions, created_by, updated_by
    ) values (
      parent.site_id, parent.id, p_locale, btrim(p_name), btrim(p_summary), p_inclusions,
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_exhibitor_package_translation_status_v1(
  p_package_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.exhibitor_package_translations%rowtype;
begin
  select * into target from public.exhibitor_package_translations
  where package_id = p_package_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'package translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.exhibitor_package_translations set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_exhibitor_package_evidence_v1(
  p_package_id uuid,
  p_new_status public.evidence_status,
  p_evidence_source text,
  p_reason text
)
returns table (package_id uuid, evidence_status public.evidence_status, approved_by uuid, approved_at timestamptz, lock_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.exhibitor_packages%rowtype;
begin
  select * into target from public.exhibitor_packages where id = p_package_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'exhibitor package not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published package evidence cannot change';
  end if;
  if not (
    (target.evidence_status = 'missing' and p_new_status = 'submitted') or
    (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected')) or
    (target.evidence_status = 'rejected' and p_new_status = 'submitted')
  ) then raise exception using errcode = '23514', message = 'invalid package evidence transition'; end if;
  if p_new_status in ('verified','rejected') and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000 then
    raise exception using errcode = '22023', message = 'evidence source must contain 3 to 1000 characters';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'evidence reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.exhibitor_packages set
    evidence_status = p_new_status, evidence_source = btrim(p_evidence_source),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.approved_by, target.approved_at, target.lock_version;
end;
$$;

create or replace function public.transition_exhibitor_package_status_v1(
  p_package_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (package_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.exhibitor_packages%rowtype;
begin
  select * into target from public.exhibitor_packages where id = p_package_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'exhibitor package not found'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'package scheduling is not implemented'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.exhibitor_packages set status = p_new_status where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.exhibitor_packages, public.exhibitor_package_translations from authenticated;
revoke all on function public.search_cms_exhibitor_packages_v1(uuid,uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_exhibitor_package_v1(uuid,uuid,text,text,text,bigint,integer) from public, anon;
revoke all on function public.update_exhibitor_package_v1(uuid,integer,uuid,text,text,text,bigint,integer,text) from public, anon;
revoke all on function public.upsert_exhibitor_package_translation_v1(uuid,text,text,text,jsonb,text) from public, anon;
revoke all on function public.transition_exhibitor_package_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_exhibitor_package_evidence_v1(uuid,public.evidence_status,text,text) from public, anon;
revoke all on function public.transition_exhibitor_package_status_v1(uuid,public.publication_status,text) from public, anon;
grant execute on function public.search_cms_exhibitor_packages_v1(uuid,uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_exhibitor_package_v1(uuid,uuid,text,text,text,bigint,integer) to authenticated;
grant execute on function public.update_exhibitor_package_v1(uuid,integer,uuid,text,text,text,bigint,integer,text) to authenticated;
grant execute on function public.upsert_exhibitor_package_translation_v1(uuid,text,text,text,jsonb,text) to authenticated;
grant execute on function public.transition_exhibitor_package_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_exhibitor_package_evidence_v1(uuid,public.evidence_status,text,text) to authenticated;
grant execute on function public.transition_exhibitor_package_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
