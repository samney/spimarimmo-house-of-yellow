begin;

alter table public.media_assets
  add column lock_version integer not null default 1 check (lock_version > 0);

create unique index media_usages_unique_binding_v1
  on public.media_usages(asset_id, entity_table, entity_id, field_key, locale) nulls not distinct;

create or replace function app_private.cms_media_target_exists_v1(
  p_site_id uuid,
  p_entity_table text,
  p_entity_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target_exists boolean;
begin
  if p_entity_table not in (
    'pages', 'page_translations', 'page_sections', 'page_section_translations',
    'projects', 'project_translations', 'navigation_items', 'navigation_item_translations',
    'venues', 'venue_translations', 'events', 'event_translations',
    'exhibitor_packages', 'exhibitor_package_translations', 'content_partners',
    'content_partner_translations', 'case_studies', 'case_study_translations',
    'testimonials', 'testimonial_translations', 'resources', 'resource_translations',
    'articles', 'article_translations'
  ) then
    return false;
  end if;

  execute format(
    'select exists(select 1 from public.%I where id = $1 and site_id = $2)',
    p_entity_table
  ) into target_exists using p_entity_id, p_site_id;
  return target_exists;
end;
$$;

create or replace function public.search_cms_media_v1(
  p_site_id uuid,
  p_query text default null,
  p_kind public.media_kind default null,
  p_status public.publication_status default null,
  p_limit integer default 50
)
returns table (
  asset_id uuid,
  site_id uuid,
  kind public.media_kind,
  storage_provider text,
  storage_key text,
  external_url text,
  mime_type text,
  byte_size bigint,
  width integer,
  height integer,
  duration_ms integer,
  alt_text text,
  caption text,
  rights_holder text,
  rights_source text,
  rights_expires_at timestamptz,
  focal_x numeric,
  focal_y numeric,
  status public.publication_status,
  lock_version integer,
  usage_count bigint,
  variants jsonb,
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
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;

  return query
  select
    asset.id,
    asset.site_id,
    asset.kind,
    asset.storage_provider,
    asset.storage_key,
    asset.external_url,
    asset.mime_type,
    asset.byte_size,
    asset.width,
    asset.height,
    asset.duration_ms,
    asset.alt_text,
    asset.caption,
    asset.rights_holder,
    asset.rights_source,
    asset.rights_expires_at,
    asset.focal_x,
    asset.focal_y,
    asset.status,
    asset.lock_version,
    (select count(*) from public.media_usages usage where usage.asset_id = asset.id),
    coalesce((
      select jsonb_agg(to_jsonb(variant) order by variant.variant_key)
      from public.media_variants variant
      where variant.asset_id = asset.id
    ), '[]'::jsonb),
    asset.updated_at
  from public.media_assets asset
  where asset.site_id = p_site_id
    and asset.deleted_at is null
    and (p_kind is null or asset.kind = p_kind)
    and (p_status is null or asset.status = p_status)
    and (
      nullif(btrim(p_query), '') is null
      or asset.alt_text ilike '%' || btrim(p_query) || '%'
      or asset.caption ilike '%' || btrim(p_query) || '%'
      or coalesce(asset.rights_holder, '') ilike '%' || btrim(p_query) || '%'
      or coalesce(asset.storage_key, '') ilike '%' || btrim(p_query) || '%'
      or coalesce(asset.external_url, '') ilike '%' || btrim(p_query) || '%'
    )
  order by asset.updated_at desc, asset.id
  limit p_limit;
end;
$$;

create or replace function public.cms_media_workspace_v1(p_asset_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
begin
  select * into target
  from public.media_assets
  where id = p_asset_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;

  return jsonb_build_object(
    'asset', to_jsonb(target),
    'variants', coalesce((
      select jsonb_agg(to_jsonb(variant) order by variant.variant_key)
      from public.media_variants variant
      where variant.asset_id = target.id
    ), '[]'::jsonb),
    'usages', coalesce((
      select jsonb_agg(to_jsonb(usage) order by usage.created_at, usage.id)
      from public.media_usages usage
      where usage.asset_id = target.id
    ), '[]'::jsonb),
    'revisions', coalesce((
      select jsonb_agg(to_jsonb(revision) order by revision.revision_number desc)
      from public.content_revisions revision
      where revision.entity_table = 'media_assets' and revision.entity_id = target.id
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.create_media_asset_v1(
  p_site_id uuid,
  p_kind public.media_kind,
  p_storage_provider text,
  p_storage_key text,
  p_external_url text,
  p_mime_type text,
  p_byte_size bigint,
  p_width integer,
  p_height integer,
  p_duration_ms integer,
  p_checksum_sha256 text,
  p_alt_text text,
  p_caption text,
  p_rights_holder text,
  p_rights_source text,
  p_rights_expires_at timestamptz,
  p_focal_x numeric,
  p_focal_y numeric
)
returns table (
  asset_id uuid,
  status public.publication_status,
  lock_version integer,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  created public.media_assets%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'media.write')) then
    raise exception using errcode = '42501', message = 'media.write permission required';
  end if;
  if p_storage_provider is null or btrim(p_storage_provider) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid storage provider is required';
  end if;
  if (nullif(btrim(p_storage_key), '') is null) = (nullif(btrim(p_external_url), '') is null) then
    raise exception using errcode = '22023', message = 'exactly one storage key or external URL is required';
  end if;
  if p_external_url is not null and btrim(p_external_url) !~ '^https://' then
    raise exception using errcode = '22023', message = 'external media URL must use HTTPS';
  end if;
  if p_mime_type is null or length(btrim(p_mime_type)) not between 3 and 120
     or btrim(p_mime_type) !~ '^[a-z0-9.+-]+/[a-z0-9.+-]+$' then
    raise exception using errcode = '22023', message = 'valid MIME type is required';
  end if;
  if p_alt_text is null or length(p_alt_text) > 500 or p_caption is null or length(p_caption) > 2000 then
    raise exception using errcode = '22023', message = 'media text exceeds its allowed length';
  end if;
  if p_rights_holder is not null and length(p_rights_holder) > 300
     or p_rights_source is not null and length(p_rights_source) > 1000 then
    raise exception using errcode = '22023', message = 'media rights metadata exceeds its allowed length';
  end if;

  insert into public.media_assets (
    site_id, kind, storage_provider, storage_key, external_url, mime_type,
    byte_size, width, height, duration_ms, checksum_sha256, alt_text, caption,
    rights_holder, rights_source, rights_expires_at, focal_x, focal_y
  ) values (
    p_site_id, p_kind, btrim(p_storage_provider), nullif(btrim(p_storage_key), ''),
    nullif(btrim(p_external_url), ''), btrim(p_mime_type), p_byte_size, p_width,
    p_height, p_duration_ms, nullif(btrim(p_checksum_sha256), ''), p_alt_text,
    p_caption, nullif(btrim(p_rights_holder), ''), nullif(btrim(p_rights_source), ''),
    p_rights_expires_at, p_focal_x, p_focal_y
  )
  returning * into created;

  return query select created.id, created.status, created.lock_version, created.created_at;
end;
$$;

create or replace function public.update_media_asset_v1(
  p_asset_id uuid,
  p_expected_lock_version integer,
  p_alt_text text,
  p_caption text,
  p_rights_holder text,
  p_rights_source text,
  p_rights_expires_at timestamptz,
  p_focal_x numeric,
  p_focal_y numeric,
  p_reason text
)
returns table (
  asset_id uuid,
  status public.publication_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
begin
  select asset.* into target
  from public.media_assets asset
  where asset.id = p_asset_id and asset.deleted_at is null
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write')) then
    raise exception using errcode = '42501', message = 'media.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'media asset must return to draft before editing';
  end if;
  if p_expected_lock_version is null or target.lock_version <> p_expected_lock_version then
    raise exception using errcode = '40001', message = 'media asset was modified by another editor';
  end if;
  if p_alt_text is null or length(p_alt_text) > 500 or p_caption is null or length(p_caption) > 2000 then
    raise exception using errcode = '22023', message = 'media text exceeds its allowed length';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.media_assets
  set alt_text = p_alt_text,
      caption = p_caption,
      rights_holder = nullif(btrim(p_rights_holder), ''),
      rights_source = nullif(btrim(p_rights_source), ''),
      rights_expires_at = p_rights_expires_at,
      focal_x = p_focal_x,
      focal_y = p_focal_y
  where id = p_asset_id
  returning * into target;

  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.add_media_variant_v1(
  p_asset_id uuid,
  p_variant_key text,
  p_storage_key text,
  p_external_url text,
  p_mime_type text,
  p_byte_size bigint,
  p_width integer,
  p_height integer
)
returns table (variant_id uuid, variant_key text, created_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
  created public.media_variants%rowtype;
begin
  select * into target from public.media_assets where id = p_asset_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write')) then
    raise exception using errcode = '42501', message = 'media.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'media variants can change only while the asset is draft';
  end if;
  if p_variant_key is null or btrim(p_variant_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid variant key is required';
  end if;
  if (nullif(btrim(p_storage_key), '') is null) = (nullif(btrim(p_external_url), '') is null) then
    raise exception using errcode = '22023', message = 'exactly one variant storage key or external URL is required';
  end if;
  if p_external_url is not null and btrim(p_external_url) !~ '^https://' then
    raise exception using errcode = '22023', message = 'variant external URL must use HTTPS';
  end if;

  insert into public.media_variants (
    site_id, asset_id, variant_key, storage_key, external_url, mime_type,
    byte_size, width, height
  ) values (
    target.site_id, target.id, btrim(p_variant_key), nullif(btrim(p_storage_key), ''),
    nullif(btrim(p_external_url), ''), btrim(p_mime_type), p_byte_size, p_width, p_height
  ) returning * into created;

  return query select created.id, created.variant_key, created.created_at;
end;
$$;

create or replace function public.link_media_usage_v1(
  p_asset_id uuid,
  p_entity_table text,
  p_entity_id uuid,
  p_field_key text,
  p_locale text default null
)
returns table (usage_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
  created public.media_usages%rowtype;
begin
  select * into target from public.media_assets where id = p_asset_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write'))
     or not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'media.write and content.write permissions required';
  end if;
  if not app_private.cms_media_target_exists_v1(target.site_id, p_entity_table, p_entity_id) then
    raise exception using errcode = '22023', message = 'valid same-site CMS media target is required';
  end if;
  if p_field_key is null or btrim(p_field_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid media field key is required';
  end if;
  if p_locale is not null and not exists (
    select 1 from public.site_locales locale
    where locale.site_id = target.site_id and locale.locale = p_locale and locale.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled media locale is required';
  end if;

  insert into public.media_usages (site_id, asset_id, entity_table, entity_id, field_key, locale)
  values (target.site_id, target.id, p_entity_table, p_entity_id, btrim(p_field_key), p_locale)
  returning * into created;

  return query select created.id, created.created_at;
end;
$$;

create or replace function public.unlink_media_usage_v1(
  p_asset_id uuid,
  p_usage_id uuid,
  p_reason text
)
returns table (usage_id uuid, removed boolean)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
  usage public.media_usages%rowtype;
begin
  select * into target from public.media_assets where id = p_asset_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write'))
     or not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'media.write and content.write permissions required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'unlink reason must contain 3 to 500 characters';
  end if;
  select * into usage
  from public.media_usages
  where id = p_usage_id and asset_id = p_asset_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'media usage not found';
  end if;

  delete from public.media_usages where id = usage.id;
  insert into public.audit_events (
    site_id, domain, action, entity_table, entity_id, actor_id, metadata
  ) values (
    target.site_id, 'cms', 'unlink', 'media_usages', usage.id::text, (select auth.uid()),
    jsonb_build_object('assetId', target.id, 'reason', btrim(p_reason))
  );
  return query select usage.id, true;
end;
$$;

create or replace function public.transition_media_status_v1(
  p_asset_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (
  asset_id uuid,
  status public.publication_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
begin
  select * into target from public.media_assets where id = p_asset_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write')) then
    raise exception using errcode = '42501', message = 'media.write permission required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'media scheduling is not supported without a publish timestamp';
  end if;
  if p_new_status in ('approved', 'published') then
    if nullif(btrim(target.rights_holder), '') is null
       or nullif(btrim(target.rights_source), '') is null then
      raise exception using errcode = '23514', message = 'verified media rights are required before approval';
    end if;
    if target.rights_expires_at is not null and target.rights_expires_at <= now() then
      raise exception using errcode = '23514', message = 'expired media rights block approval';
    end if;
    if target.kind = 'image' and nullif(btrim(target.alt_text), '') is null then
      raise exception using errcode = '23514', message = 'image alt text is required before approval';
    end if;
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.media_assets set status = p_new_status where id = p_asset_id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.retire_media_asset_v1(p_asset_id uuid, p_reason text)
returns table (asset_id uuid, status public.publication_status, deleted_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.media_assets%rowtype;
begin
  select asset.* into target
  from public.media_assets asset
  where asset.id = p_asset_id and asset.deleted_at is null
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'media asset not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'media.write'))
     or not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'media.write and content.publish permissions required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'retirement reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.media_assets as asset
  set status = 'archived', deleted_at = now()
  where asset.id = p_asset_id
  returning asset.* into target;
  return query select target.id, target.status, target.deleted_at;
end;
$$;

revoke all on function public.search_cms_media_v1(uuid, text, public.media_kind, public.publication_status, integer) from public, anon;
revoke all on function public.cms_media_workspace_v1(uuid) from public, anon;
revoke all on function public.create_media_asset_v1(uuid, public.media_kind, text, text, text, text, bigint, integer, integer, integer, text, text, text, text, text, timestamptz, numeric, numeric) from public, anon;
revoke all on function public.update_media_asset_v1(uuid, integer, text, text, text, text, timestamptz, numeric, numeric, text) from public, anon;
revoke all on function public.add_media_variant_v1(uuid, text, text, text, text, bigint, integer, integer) from public, anon;
revoke all on function public.link_media_usage_v1(uuid, text, uuid, text, text) from public, anon;
revoke all on function public.unlink_media_usage_v1(uuid, uuid, text) from public, anon;
revoke all on function public.transition_media_status_v1(uuid, public.publication_status, text) from public, anon;
revoke all on function public.retire_media_asset_v1(uuid, text) from public, anon;

grant execute on function public.search_cms_media_v1(uuid, text, public.media_kind, public.publication_status, integer) to authenticated;
grant execute on function public.cms_media_workspace_v1(uuid) to authenticated;
grant execute on function public.create_media_asset_v1(uuid, public.media_kind, text, text, text, text, bigint, integer, integer, integer, text, text, text, text, text, timestamptz, numeric, numeric) to authenticated;
grant execute on function public.update_media_asset_v1(uuid, integer, text, text, text, text, timestamptz, numeric, numeric, text) to authenticated;
grant execute on function public.add_media_variant_v1(uuid, text, text, text, text, bigint, integer, integer) to authenticated;
grant execute on function public.link_media_usage_v1(uuid, text, uuid, text, text) to authenticated;
grant execute on function public.unlink_media_usage_v1(uuid, uuid, text) to authenticated;
grant execute on function public.transition_media_status_v1(uuid, public.publication_status, text) to authenticated;
grant execute on function public.retire_media_asset_v1(uuid, text) to authenticated;

revoke insert, update, delete on public.media_assets, public.media_variants, public.media_usages from authenticated;

commit;
