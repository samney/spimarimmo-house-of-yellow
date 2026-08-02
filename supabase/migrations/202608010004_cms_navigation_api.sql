begin;

alter table public.navigation_items
  add column created_by uuid references auth.users(id) on delete set null,
  add column updated_by uuid references auth.users(id) on delete set null,
  add column lock_version integer not null default 1 check (lock_version > 0);

alter table public.navigation_item_translations
  add column created_by uuid references auth.users(id) on delete set null,
  add column updated_by uuid references auth.users(id) on delete set null,
  add column lock_version integer not null default 1 check (lock_version > 0);

create or replace function public.cms_navigation_workspace_v1(
  p_site_id uuid,
  p_location text default null
)
returns table (
  item_id uuid,
  parent_id uuid,
  location text,
  item_key text,
  href text,
  item_position integer,
  status public.publication_status,
  lock_version integer,
  translations jsonb,
  created_at timestamptz,
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
  if not exists (
    select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null
  ) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_location is not null and p_location not in ('header', 'mobile', 'footer', 'utility') then
    raise exception using errcode = '22023', message = 'valid navigation location is required';
  end if;

  return query
  select
    item.id,
    item.parent_id,
    item.location,
    item.item_key,
    item.href,
    item.position,
    item.status,
    item.lock_version,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', translation.id,
          'locale', translation.locale,
          'label', translation.label,
          'accessibilityLabel', translation.accessibility_label,
          'status', translation.status,
          'lockVersion', translation.lock_version,
          'updatedAt', translation.updated_at
        ) order by translation.locale
      )
      from public.navigation_item_translations translation
      where translation.navigation_item_id = item.id
    ), '[]'::jsonb),
    item.created_at,
    item.updated_at
  from public.navigation_items item
  where item.site_id = p_site_id
    and (p_location is null or item.location = p_location)
  order by item.location, item.position, item.item_key;
end;
$$;

create or replace function public.create_navigation_item_v1(
  p_site_id uuid,
  p_parent_id uuid,
  p_location text,
  p_item_key text,
  p_href text,
  p_position integer
)
returns table (
  item_id uuid,
  status public.publication_status,
  lock_version integer,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  created public.navigation_items%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_location is null or p_location not in ('header', 'mobile', 'footer', 'utility') then
    raise exception using errcode = '22023', message = 'valid navigation location is required';
  end if;
  if p_item_key is null or btrim(p_item_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid navigation item key is required';
  end if;
  if p_href is null or length(btrim(p_href)) not between 1 and 1000
     or not (btrim(p_href) like '/%' or btrim(p_href) ~ '^https://') then
    raise exception using errcode = '22023', message = 'safe navigation href is required';
  end if;
  if p_position is null or p_position not between 0 and 10000 then
    raise exception using errcode = '22023', message = 'navigation position must be between 0 and 10000';
  end if;
  if p_parent_id is not null and not exists (
    select 1 from public.navigation_items parent
    where parent.id = p_parent_id and parent.site_id = p_site_id and parent.location = p_location
  ) then
    raise exception using errcode = '22023', message = 'navigation parent must belong to the same site and location';
  end if;

  insert into public.navigation_items (
    site_id, parent_id, location, item_key, href, position
  ) values (
    p_site_id, p_parent_id, p_location, btrim(p_item_key), btrim(p_href), p_position
  ) returning * into created;

  return query select created.id, created.status, created.lock_version, created.created_at;
end;
$$;

create or replace function public.update_navigation_item_v1(
  p_item_id uuid,
  p_expected_lock_version integer,
  p_parent_id uuid,
  p_location text,
  p_item_key text,
  p_href text,
  p_position integer,
  p_reason text
)
returns table (
  item_id uuid,
  status public.publication_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.navigation_items%rowtype;
begin
  select * into target from public.navigation_items where id = p_item_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'navigation item not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'navigation item must be draft before editing';
  end if;
  if p_expected_lock_version is null or target.lock_version <> p_expected_lock_version then
    raise exception using errcode = '40001', message = 'navigation item was modified by another editor';
  end if;
  if p_item_id = p_parent_id then
    raise exception using errcode = '22023', message = 'navigation item cannot parent itself';
  end if;
  if p_location is null or p_location not in ('header', 'mobile', 'footer', 'utility')
     or p_item_key is null or btrim(p_item_key) !~ '^[a-z0-9_.-]+$'
     or p_href is null or length(btrim(p_href)) not between 1 and 1000
     or not (btrim(p_href) like '/%' or btrim(p_href) ~ '^https://')
     or p_position is null or p_position not between 0 and 10000 then
    raise exception using errcode = '22023', message = 'valid navigation metadata is required';
  end if;
  if p_parent_id is not null and not exists (
    select 1 from public.navigation_items parent
    where parent.id = p_parent_id and parent.site_id = target.site_id and parent.location = p_location
  ) then
    raise exception using errcode = '22023', message = 'navigation parent must belong to the same site and location';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.navigation_items
  set parent_id = p_parent_id,
      location = p_location,
      item_key = btrim(p_item_key),
      href = btrim(p_href),
      position = p_position
  where id = p_item_id
  returning * into target;

  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_navigation_translation_v1(
  p_item_id uuid,
  p_locale text,
  p_label text,
  p_accessibility_label text,
  p_reason text
)
returns table (
  translation_id uuid,
  status public.translation_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  parent public.navigation_items%rowtype;
  target public.navigation_item_translations%rowtype;
begin
  select * into parent from public.navigation_items where id = p_item_id;
  if not found then raise exception using errcode = 'P0002', message = 'navigation item not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if not exists (
    select 1 from public.site_locales locale
    where locale.site_id = parent.site_id and locale.locale = p_locale and locale.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled navigation locale is required';
  end if;
  if p_label is null or length(btrim(p_label)) not between 1 and 200
     or p_accessibility_label is not null and length(btrim(p_accessibility_label)) > 300 then
    raise exception using errcode = '22023', message = 'valid navigation translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.navigation_item_translations
  where navigation_item_id = p_item_id and locale = p_locale for update;
  if found then
    if target.status not in ('missing', 'draft', 'in_review') then
      raise exception using errcode = '23514', message = 'navigation translation must return to draft before editing';
    end if;
    update public.navigation_item_translations
    set label = btrim(p_label), accessibility_label = nullif(btrim(p_accessibility_label), '')
    where id = target.id returning * into target;
  else
    insert into public.navigation_item_translations (
      site_id, navigation_item_id, locale, label, accessibility_label
    ) values (
      parent.site_id, p_item_id, p_locale, btrim(p_label), nullif(btrim(p_accessibility_label), '')
    ) returning * into target;
  end if;

  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_navigation_item_status_v1(
  p_item_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (item_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.navigation_items%rowtype;
begin
  select * into target from public.navigation_items where id = p_item_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'navigation item not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '22023', message = 'navigation items cannot be scheduled';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.navigation_items set status = p_new_status where id = p_item_id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_navigation_translation_status_v1(
  p_item_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.navigation_item_translations%rowtype;
begin
  select * into target from public.navigation_item_translations
  where navigation_item_id = p_item_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'navigation translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.navigation_item_translations set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on public.navigation_items from authenticated;
revoke insert, update, delete on public.navigation_item_translations from authenticated;

revoke all on function public.cms_navigation_workspace_v1(uuid, text) from public, anon;
revoke all on function public.create_navigation_item_v1(uuid, uuid, text, text, text, integer) from public, anon;
revoke all on function public.update_navigation_item_v1(uuid, integer, uuid, text, text, text, integer, text) from public, anon;
revoke all on function public.upsert_navigation_translation_v1(uuid, text, text, text, text) from public, anon;
revoke all on function public.transition_navigation_item_status_v1(uuid, public.publication_status, text) from public, anon;
revoke all on function public.transition_navigation_translation_status_v1(uuid, text, public.translation_status, text) from public, anon;

grant execute on function public.cms_navigation_workspace_v1(uuid, text) to authenticated;
grant execute on function public.create_navigation_item_v1(uuid, uuid, text, text, text, integer) to authenticated;
grant execute on function public.update_navigation_item_v1(uuid, integer, uuid, text, text, text, integer, text) to authenticated;
grant execute on function public.upsert_navigation_translation_v1(uuid, text, text, text, text) to authenticated;
grant execute on function public.transition_navigation_item_status_v1(uuid, public.publication_status, text) to authenticated;
grant execute on function public.transition_navigation_translation_status_v1(uuid, text, public.translation_status, text) to authenticated;

commit;
