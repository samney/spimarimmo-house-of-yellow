begin;

alter table public.resources
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.resource_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.resource_version_immutable_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using errcode = '23514', message = 'resource versions are immutable';
  end if;
  if row(
    new.site_id, new.resource_id, new.locale, new.version_number,
    new.media_asset_id, new.notice_version, new.created_by, new.created_at
  ) is distinct from row(
    old.site_id, old.resource_id, old.locale, old.version_number,
    old.media_asset_id, old.notice_version, old.created_by, old.created_at
  ) then
    raise exception using errcode = '23514', message = 'resource version content is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists b_resource_version_immutable on public.resource_versions;
create trigger b_resource_version_immutable
  before update or delete on public.resource_versions
  for each row execute function app_private.resource_version_immutable_v1();

create or replace function app_private.resource_warnings_v1(p_resource_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.resources%rowtype;
  locale_row record;
  translation_status public.translation_status;
  version_row record;
  warnings text[] := array[]::text[];
begin
  select * into target from public.resources
  where id = p_resource_id and deleted_at is null;
  if not found then return array['resource_not_found']::text[]; end if;

  for locale_row in
    select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select translation.status into translation_status
    from public.resource_translations translation
    where translation.site_id = target.site_id
      and translation.resource_id = target.id
      and translation.locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_status not in ('approved', 'published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    end if;

    select version.id, version.notice_version, asset.status as media_status,
      asset.kind as media_kind, asset.deleted_at as media_deleted_at
    into version_row
    from public.resource_versions version
    join public.media_assets asset
      on asset.site_id = version.site_id and asset.id = version.media_asset_id
    where version.site_id = target.site_id
      and version.resource_id = target.id
      and version.locale = locale_row.locale
      and version.is_current;
    if not found then
      warnings := array_append(warnings, 'missing_current_version:' || locale_row.locale);
    else
      if version_row.media_kind <> 'document' then
        warnings := array_append(warnings, 'current_media_not_document:' || locale_row.locale);
      end if;
      if version_row.media_status <> 'published' or version_row.media_deleted_at is not null then
        warnings := array_append(warnings, 'current_media_unpublished:' || locale_row.locale);
      end if;
      if nullif(btrim(version_row.notice_version), '') is null then
        warnings := array_append(warnings, 'missing_notice_version:' || locale_row.locale);
      end if;
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_resources_v1(
  p_site_id uuid,
  p_event_id uuid default null,
  p_resource_kind text default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  resource_id uuid, site_id uuid, event_id uuid, slug text,
  resource_kind text, requires_form boolean,
  publication_status public.publication_status, lock_version integer,
  warning_codes text[], translations jsonb, current_versions jsonb,
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
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;
  if p_resource_kind is not null and p_resource_kind not in ('brochure','report','guide','press_kit','other') then
    raise exception using errcode = '22023', message = 'valid resource kind is required';
  end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the resource site';
  end if;

  return query
  select resource.id, resource.site_id, resource.event_id, resource.slug,
    resource.resource_kind, resource.requires_form, resource.status,
    resource.lock_version, app_private.resource_warnings_v1(resource.id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'title', translation.title,
      'summary', translation.summary, 'status', translation.status,
      'lockVersion', translation.lock_version
    ) order by translation.locale)
      from public.resource_translations translation
      where translation.site_id = resource.site_id
        and translation.resource_id = resource.id), '[]'::jsonb),
    coalesce((select jsonb_agg(jsonb_build_object(
      'id', version.id, 'locale', version.locale,
      'versionNumber', version.version_number,
      'mediaAssetId', version.media_asset_id,
      'noticeVersion', version.notice_version,
      'createdAt', version.created_at
    ) order by version.locale)
      from public.resource_versions version
      where version.site_id = resource.site_id
        and version.resource_id = resource.id and version.is_current), '[]'::jsonb),
    resource.updated_at
  from public.resources resource
  where resource.site_id = p_site_id and resource.deleted_at is null
    and (p_event_id is null or resource.event_id = p_event_id)
    and (p_resource_kind is null or resource.resource_kind = p_resource_kind)
    and (p_status is null or resource.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or resource.slug ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.resource_translations translation
        where translation.site_id = resource.site_id
          and translation.resource_id = resource.id
          and (translation.title ilike '%' || btrim(p_query) || '%'
            or translation.summary ilike '%' || btrim(p_query) || '%')))
  order by resource.updated_at desc, resource.id
  limit p_limit;
end;
$$;

create or replace function public.list_cms_resource_versions_v1(p_resource_id uuid)
returns table (
  version_id uuid, locale text, version_number integer, media_asset_id uuid,
  notice_version text, is_current boolean, media_status public.publication_status,
  mime_type text, byte_size bigint, checksum_sha256 text,
  created_by uuid, created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.resources%rowtype;
begin
  select * into target from public.resources
  where id = p_resource_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'resource not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  return query select version.id, version.locale, version.version_number,
    version.media_asset_id, version.notice_version, version.is_current,
    asset.status, asset.mime_type, asset.byte_size, asset.checksum_sha256,
    version.created_by, version.created_at
  from public.resource_versions version
  join public.media_assets asset
    on asset.site_id = version.site_id and asset.id = version.media_asset_id
  where version.site_id = target.site_id and version.resource_id = target.id
  order by version.locale, version.version_number desc;
end;
$$;

create or replace function app_private.validate_resource_input_v1(
  p_site_id uuid, p_event_id uuid, p_slug text,
  p_resource_kind text, p_requires_form boolean
)
returns void
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200
     or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'valid resource slug is required';
  end if;
  if p_resource_kind is null or p_resource_kind not in ('brochure','report','guide','press_kit','other') then
    raise exception using errcode = '22023', message = 'valid resource kind is required';
  end if;
  if p_requires_form is null then
    raise exception using errcode = '22023', message = 'requires_form is required';
  end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the resource site';
  end if;
end;
$$;

create or replace function public.create_resource_v1(
  p_site_id uuid, p_event_id uuid, p_slug text,
  p_resource_kind text, p_requires_form boolean
)
returns table (
  resource_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.resources%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_resource_input_v1(
    p_site_id, p_event_id, p_slug, p_resource_kind, p_requires_form
  );
  insert into public.resources (
    site_id, event_id, slug, resource_kind, requires_form,
    created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_slug), p_resource_kind, p_requires_form,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_resource_v1(
  p_resource_id uuid, p_expected_lock_version integer, p_event_id uuid,
  p_slug text, p_resource_kind text, p_requires_form boolean, p_reason text
)
returns table (
  resource_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.resources%rowtype;
begin
  select * into target from public.resources
  where id = p_resource_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'resource not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'resource must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'resource was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_resource_input_v1(
    target.site_id, p_event_id, p_slug, p_resource_kind, p_requires_form
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.resources set event_id = p_event_id, slug = btrim(p_slug),
    resource_kind = p_resource_kind, requires_form = p_requires_form,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_resource_translation_v1(
  p_resource_id uuid, p_locale text, p_title text,
  p_summary text, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target_resource public.resources%rowtype;
declare target public.resource_translations%rowtype;
begin
  select * into target_resource from public.resources
  where id = p_resource_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'resource not found'; end if;
  if not (select app_private.has_permission(target_resource.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if target_resource.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'resource must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_resource.site_id
      and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled resource locale is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 300
     or p_summary is null or length(p_summary) > 2000 then
    raise exception using errcode = '22023', message = 'valid bounded resource translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.resource_translations
  where resource_id = target_resource.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'resource translation must return to draft before editing';
    end if;
    update public.resource_translations set title = btrim(p_title), summary = p_summary,
      updated_by = (select auth.uid()), lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.resource_translations (
      site_id, resource_id, locale, title, summary, created_by, updated_by
    ) values (
      target_resource.site_id, target_resource.id, p_locale, btrim(p_title),
      p_summary, (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_resource_translation_status_v1(
  p_resource_id uuid, p_locale text,
  p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.resource_translations%rowtype;
begin
  select * into target from public.resource_translations
  where resource_id = p_resource_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'resource translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.resource_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.create_resource_version_v1(
  p_resource_id uuid, p_expected_lock_version integer, p_locale text,
  p_media_asset_id uuid, p_notice_version text, p_reason text
)
returns table (
  version_id uuid, version_number integer, locale text,
  media_asset_id uuid, notice_version text, is_current boolean,
  resource_lock_version integer, created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target_resource public.resources%rowtype;
declare target_media public.media_assets%rowtype;
declare target_version public.resource_versions%rowtype;
declare next_version integer;
begin
  select * into target_resource from public.resources
  where id = p_resource_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'resource not found'; end if;
  if not (select app_private.has_permission(target_resource.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target_resource.status <> 'draft' then
    raise exception using errcode = '23514', message = 'resource must be draft before adding a version';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target_resource.lock_version then
    raise exception using errcode = '40001', message = 'resource was modified by another editor';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_resource.site_id
      and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled resource locale is required';
  end if;
  if p_notice_version is null or length(btrim(p_notice_version)) not between 1 and 200 then
    raise exception using errcode = '22023', message = 'notice version must contain 1 to 200 characters';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'version reason must contain 3 to 500 characters';
  end if;
  select * into target_media from public.media_assets
  where id = p_media_asset_id and site_id = target_resource.site_id
    and deleted_at is null;
  if not found or target_media.kind <> 'document' or target_media.status <> 'published' then
    raise exception using errcode = '22023', message = 'published document media from the resource site is required';
  end if;

  select coalesce(max(version.version_number), 0) + 1 into next_version
  from public.resource_versions version
  where version.resource_id = target_resource.id and version.locale = p_locale;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.resource_versions version set is_current = false
  where version.resource_id = target_resource.id
    and version.locale = p_locale and version.is_current;
  insert into public.resource_versions (
    site_id, resource_id, locale, version_number, media_asset_id,
    notice_version, is_current, created_by
  ) values (
    target_resource.site_id, target_resource.id, p_locale, next_version,
    p_media_asset_id, btrim(p_notice_version), true, (select auth.uid())
  ) returning * into target_version;
  update public.resources set updated_by = (select auth.uid())
  where id = target_resource.id returning * into target_resource;

  return query select target_version.id, target_version.version_number,
    target_version.locale, target_version.media_asset_id,
    target_version.notice_version, target_version.is_current,
    target_resource.lock_version, target_version.created_at;
end;
$$;

create or replace function public.transition_resource_status_v1(
  p_resource_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (
  resource_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.resources%rowtype;
begin
  select * into target from public.resources
  where id = p_resource_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'resource not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'resource scheduling is not implemented';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published')
     and cardinality(app_private.resource_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'resource is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.resources set status = p_new_status,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.resources from authenticated;
revoke insert, update, delete on table public.resource_translations from authenticated;
revoke insert, update, delete on table public.resource_versions from authenticated;

revoke all on function public.search_cms_resources_v1(uuid,uuid,text,public.publication_status,text,integer) from public, anon;
revoke all on function public.list_cms_resource_versions_v1(uuid) from public, anon;
revoke all on function public.create_resource_v1(uuid,uuid,text,text,boolean) from public, anon;
revoke all on function public.update_resource_v1(uuid,integer,uuid,text,text,boolean,text) from public, anon;
revoke all on function public.upsert_resource_translation_v1(uuid,text,text,text,text) from public, anon;
revoke all on function public.transition_resource_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.create_resource_version_v1(uuid,integer,text,uuid,text,text) from public, anon;
revoke all on function public.transition_resource_status_v1(uuid,public.publication_status,text) from public, anon;

grant execute on function public.search_cms_resources_v1(uuid,uuid,text,public.publication_status,text,integer) to authenticated;
grant execute on function public.list_cms_resource_versions_v1(uuid) to authenticated;
grant execute on function public.create_resource_v1(uuid,uuid,text,text,boolean) to authenticated;
grant execute on function public.update_resource_v1(uuid,integer,uuid,text,text,boolean,text) to authenticated;
grant execute on function public.upsert_resource_translation_v1(uuid,text,text,text,text) to authenticated;
grant execute on function public.transition_resource_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.create_resource_version_v1(uuid,integer,text,uuid,text,text) to authenticated;
grant execute on function public.transition_resource_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
