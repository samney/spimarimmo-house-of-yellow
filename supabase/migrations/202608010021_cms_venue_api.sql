begin;

alter table public.venues
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.venue_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.venue_warnings_v1(p_venue_id uuid)
returns text[]
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
declare target public.venues%rowtype;
declare locale_row record;
declare translation_row public.venue_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.venues
  where id = p_venue_id and deleted_at is null;
  if not found then return array['venue_not_found']::text[]; end if;

  if nullif(btrim(target.address_line_1), '') is null then
    warnings := array_append(warnings, 'missing_address');
  end if;
  if nullif(btrim(target.city), '') is null then
    warnings := array_append(warnings, 'missing_city');
  end if;
  if target.country_code is null then
    warnings := array_append(warnings, 'missing_country');
  end if;
  if nullif(btrim(target.timezone), '') is null then
    warnings := array_append(warnings, 'missing_timezone');
  end if;
  if (target.latitude is null) <> (target.longitude is null) then
    warnings := array_append(warnings, 'incomplete_coordinates');
  end if;

  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.venue_translations
    where venue_id = target.id and locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    elsif nullif(btrim(translation_row.name), '') is null then
      warnings := array_append(warnings, 'missing_name:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_venues_v1(
  p_site_id uuid, p_status public.publication_status default null,
  p_query text default null, p_limit integer default 50
)
returns table (
  venue_id uuid, site_id uuid, venue_key text,
  address_line_1 text, address_line_2 text, city text, region text,
  country_code text, postal_code text, latitude numeric, longitude numeric,
  timezone text, publication_status public.publication_status,
  lock_version integer, warning_codes text[], translations jsonb,
  updated_at timestamptz
)
language plpgsql stable security definer set search_path = pg_catalog, public
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

  return query select venue.id, venue.site_id, venue.venue_key,
    venue.address_line_1, venue.address_line_2, venue.city, venue.region,
    venue.country_code, venue.postal_code, venue.latitude, venue.longitude,
    venue.timezone, venue.status, venue.lock_version,
    app_private.venue_warnings_v1(venue.id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'name', translation.name,
      'directions', translation.directions,
      'accessibilityNotes', translation.accessibility_notes,
      'status', translation.status, 'lockVersion', translation.lock_version
    ) order by translation.locale)
      from public.venue_translations translation
      where translation.site_id = venue.site_id and translation.venue_id = venue.id),
      '[]'::jsonb), venue.updated_at
  from public.venues venue
  where venue.site_id = p_site_id and venue.deleted_at is null
    and (p_status is null or venue.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or venue.venue_key ilike '%' || btrim(p_query) || '%'
      or venue.city ilike '%' || btrim(p_query) || '%'
      or venue.region ilike '%' || btrim(p_query) || '%'
      or venue.country_code ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.venue_translations translation
        where translation.site_id = venue.site_id and translation.venue_id = venue.id
          and translation.name ilike '%' || btrim(p_query) || '%'))
  order by venue.updated_at desc, venue.id limit p_limit;
end;
$$;

create or replace function app_private.validate_venue_input_v1(
  p_venue_key text, p_address_line_1 text, p_address_line_2 text,
  p_city text, p_region text, p_country_code text, p_postal_code text,
  p_latitude numeric, p_longitude numeric, p_timezone text
)
returns void
language plpgsql immutable security definer set search_path = pg_catalog, public
as $$
begin
  if p_venue_key is null or length(btrim(p_venue_key)) not between 1 and 200
     or btrim(p_venue_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid venue key is required';
  end if;
  if p_address_line_1 is null or length(btrim(p_address_line_1)) not between 1 and 500 then
    raise exception using errcode = '22023', message = 'valid venue address is required';
  end if;
  if p_address_line_2 is not null and length(btrim(p_address_line_2)) > 500 then
    raise exception using errcode = '22023', message = 'venue address line two is too long';
  end if;
  if p_city is null or length(btrim(p_city)) not between 1 and 200 then
    raise exception using errcode = '22023', message = 'valid venue city is required';
  end if;
  if p_region is not null and length(btrim(p_region)) > 200 then
    raise exception using errcode = '22023', message = 'venue region is too long';
  end if;
  if p_country_code is null or btrim(p_country_code) !~ '^[A-Z]{2}$' then
    raise exception using errcode = '22023', message = 'valid venue country code is required';
  end if;
  if p_postal_code is not null and length(btrim(p_postal_code)) > 30 then
    raise exception using errcode = '22023', message = 'venue postal code is too long';
  end if;
  if (p_latitude is null) <> (p_longitude is null)
     or (p_latitude is not null and p_latitude not between -90 and 90)
     or (p_longitude is not null and p_longitude not between -180 and 180) then
    raise exception using errcode = '22023', message = 'valid venue coordinate pair is required';
  end if;
  if p_timezone is null or length(btrim(p_timezone)) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'valid venue timezone is required';
  end if;
end;
$$;

create or replace function public.create_venue_v1(
  p_site_id uuid, p_venue_key text, p_address_line_1 text,
  p_address_line_2 text, p_city text, p_region text, p_country_code text,
  p_postal_code text, p_latitude numeric, p_longitude numeric, p_timezone text
)
returns table (
  venue_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.venues%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_venue_input_v1(
    p_venue_key, p_address_line_1, p_address_line_2, p_city, p_region,
    p_country_code, p_postal_code, p_latitude, p_longitude, p_timezone
  );
  insert into public.venues (
    site_id, venue_key, address_line_1, address_line_2, city, region,
    country_code, postal_code, latitude, longitude, timezone,
    created_by, updated_by
  ) values (
    p_site_id, btrim(p_venue_key), btrim(p_address_line_1),
    nullif(btrim(p_address_line_2), ''), btrim(p_city), nullif(btrim(p_region), ''),
    btrim(p_country_code), nullif(btrim(p_postal_code), ''),
    p_latitude, p_longitude, btrim(p_timezone),
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_venue_v1(
  p_venue_id uuid, p_expected_lock_version integer, p_venue_key text,
  p_address_line_1 text, p_address_line_2 text, p_city text, p_region text,
  p_country_code text, p_postal_code text, p_latitude numeric,
  p_longitude numeric, p_timezone text, p_reason text
)
returns table (
  venue_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.venues%rowtype;
begin
  select * into target from public.venues
  where id = p_venue_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'venue not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'venue must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'venue was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_venue_input_v1(
    p_venue_key, p_address_line_1, p_address_line_2, p_city, p_region,
    p_country_code, p_postal_code, p_latitude, p_longitude, p_timezone
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.venues set venue_key = btrim(p_venue_key),
    address_line_1 = btrim(p_address_line_1),
    address_line_2 = nullif(btrim(p_address_line_2), ''),
    city = btrim(p_city), region = nullif(btrim(p_region), ''),
    country_code = btrim(p_country_code),
    postal_code = nullif(btrim(p_postal_code), ''),
    latitude = p_latitude, longitude = p_longitude, timezone = btrim(p_timezone),
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_venue_translation_v1(
  p_venue_id uuid, p_locale text, p_name text,
  p_directions text, p_accessibility_notes text, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target_venue public.venues%rowtype;
declare target public.venue_translations%rowtype;
begin
  select * into target_venue from public.venues where id = p_venue_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'venue not found'; end if;
  if not (select app_private.has_permission(target_venue.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if target_venue.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'venue must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_venue.site_id and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled venue locale is required';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 300
     or p_directions is null or length(p_directions) > 5000
     or p_accessibility_notes is null or length(p_accessibility_notes) > 5000 then
    raise exception using errcode = '22023', message = 'valid bounded venue translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.venue_translations
  where venue_id = target_venue.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'venue translation must return to draft before editing';
    end if;
    update public.venue_translations set name = btrim(p_name),
      directions = btrim(p_directions), accessibility_notes = btrim(p_accessibility_notes),
      updated_by = (select auth.uid()), lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.venue_translations (
      site_id, venue_id, locale, name, directions, accessibility_notes,
      created_by, updated_by
    ) values (
      target_venue.site_id, target_venue.id, p_locale, btrim(p_name),
      btrim(p_directions), btrim(p_accessibility_notes),
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_venue_translation_status_v1(
  p_venue_id uuid, p_locale text,
  p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.venue_translations%rowtype;
begin
  select * into target from public.venue_translations
  where venue_id = p_venue_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'venue translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'venue translation status must change';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.venue_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_venue_status_v1(
  p_venue_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (
  venue_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.venues%rowtype;
begin
  select * into target from public.venues where id = p_venue_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'venue not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'venue scheduling is not implemented';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'venue status must change';
  end if;
  if p_new_status in ('approved','published','archived')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published')
     and cardinality(app_private.venue_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'venue is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.venues set status = p_new_status, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.venues from authenticated;
revoke insert, update, delete on table public.venue_translations from authenticated;

revoke all on function public.search_cms_venues_v1(uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_venue_v1(uuid,text,text,text,text,text,text,text,numeric,numeric,text) from public, anon;
revoke all on function public.update_venue_v1(uuid,integer,text,text,text,text,text,text,text,numeric,numeric,text,text) from public, anon;
revoke all on function public.upsert_venue_translation_v1(uuid,text,text,text,text,text) from public, anon;
revoke all on function public.transition_venue_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_venue_status_v1(uuid,public.publication_status,text) from public, anon;

grant execute on function public.search_cms_venues_v1(uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_venue_v1(uuid,text,text,text,text,text,text,text,numeric,numeric,text) to authenticated;
grant execute on function public.update_venue_v1(uuid,integer,text,text,text,text,text,text,text,numeric,numeric,text,text) to authenticated;
grant execute on function public.upsert_venue_translation_v1(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.transition_venue_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_venue_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
