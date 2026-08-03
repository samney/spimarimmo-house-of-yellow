begin;

create or replace function app_private.event_completeness_warnings(p_event_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events%rowtype;
  locale_row record;
  translation_row public.event_translations%rowtype;
  warnings text[] := array[]::text[];
begin
  select * into target
  from public.events
  where id = p_event_id and deleted_at is null;

  if not found then
    return array['event_not_found']::text[];
  end if;

  if target.venue_id is null then
    warnings := array_append(warnings, 'missing_venue');
  end if;
  if target.starts_at is null or target.ends_at is null then
    warnings := array_append(warnings, 'missing_schedule');
  end if;
  if not exists (
    select 1
    from public.media_usages usage
    where usage.site_id = target.site_id
      and usage.entity_table in ('events', 'event_translations')
      and (
        usage.entity_id = target.id
        or usage.entity_id in (
          select translation.id
          from public.event_translations translation
          where translation.event_id = target.id
        )
      )
  ) then
    warnings := array_append(warnings, 'missing_media');
  end if;

  for locale_row in
    select locale
    from public.site_locales
    where site_id = target.site_id and enabled
    order by locale
  loop
    select * into translation_row
    from public.event_translations
    where event_id = target.id and locale = locale_row.locale;

    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    else
      if nullif(btrim(translation_row.short_description), '') is null then
        warnings := array_append(warnings, 'empty_summary:' || locale_row.locale);
      end if;
      if translation_row.status not in ('approved', 'published') then
        warnings := array_append(warnings, 'translation_unapproved:' || locale_row.locale);
      end if;
    end if;
  end loop;

  return warnings;
end;
$$;

create or replace function public.search_cms_events_v1(
  p_site_id uuid,
  p_query text default null,
  p_publication_status public.publication_status default null,
  p_lifecycle_status public.event_lifecycle_status default null,
  p_limit integer default 50
)
returns table (
  event_id uuid,
  site_id uuid,
  event_key text,
  slug text,
  publication_status public.publication_status,
  lifecycle_status public.event_lifecycle_status,
  venue_id uuid,
  timezone text,
  starts_at timestamptz,
  ends_at timestamptz,
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
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;

  return query
  select
    event.id,
    event.site_id,
    event.event_key,
    event.slug,
    event.status,
    event.lifecycle_status,
    event.venue_id,
    event.timezone,
    event.starts_at,
    event.ends_at,
    event.lock_version,
    app_private.event_completeness_warnings(event.id),
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', translation.id,
          'locale', translation.locale,
          'name', translation.name,
          'shortDescription', translation.short_description,
          'status', translation.status,
          'updatedAt', translation.updated_at
        ) order by translation.locale
      )
      from public.event_translations translation
      where translation.event_id = event.id
    ), '[]'::jsonb),
    event.updated_at
  from public.events event
  where event.site_id = p_site_id
    and event.deleted_at is null
    and (p_publication_status is null or event.status = p_publication_status)
    and (p_lifecycle_status is null or event.lifecycle_status = p_lifecycle_status)
    and (
      nullif(btrim(p_query), '') is null
      or event.event_key ilike '%' || btrim(p_query) || '%'
      or event.slug ilike '%' || btrim(p_query) || '%'
      or exists (
        select 1
        from public.event_translations translation
        where translation.event_id = event.id
          and translation.name ilike '%' || btrim(p_query) || '%'
      )
    )
  order by event.updated_at desc, event.id
  limit p_limit;
end;
$$;

create or replace function public.cms_event_workspace_v1(p_event_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events%rowtype;
begin
  select * into target
  from public.events
  where id = p_event_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;

  return jsonb_build_object(
    'event', to_jsonb(target),
    'warningCodes', to_jsonb(app_private.event_completeness_warnings(target.id)),
    'translations', coalesce((
      select jsonb_agg(to_jsonb(translation) order by translation.locale)
      from public.event_translations translation
      where translation.event_id = target.id
    ), '[]'::jsonb),
    'lifecycleHistory', coalesce((
      select jsonb_agg(to_jsonb(history) order by history.changed_at desc, history.id desc)
      from public.event_status_history history
      where history.event_id = target.id
    ), '[]'::jsonb),
    'media', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'usageId', usage.id,
          'entityTable', usage.entity_table,
          'entityId', usage.entity_id,
          'fieldKey', usage.field_key,
          'locale', usage.locale,
          'asset', to_jsonb(asset)
        ) order by usage.created_at, usage.id
      )
      from public.media_usages usage
      join public.media_assets asset
        on asset.id = usage.asset_id and asset.site_id = usage.site_id
      where usage.site_id = target.site_id
        and usage.entity_table in ('events', 'event_translations')
        and (
          usage.entity_id = target.id
          or usage.entity_id in (
            select translation.id
            from public.event_translations translation
            where translation.event_id = target.id
          )
        )
    ), '[]'::jsonb),
    'revisions', coalesce((
      select jsonb_agg(to_jsonb(revision) order by revision.revision_number desc)
      from public.content_revisions revision
      where revision.site_id = target.site_id
        and (
          (revision.entity_table = 'events' and revision.entity_id = target.id)
          or (
            revision.entity_table = 'event_translations'
            and revision.entity_id in (
              select translation.id
              from public.event_translations translation
              where translation.event_id = target.id
            )
          )
        )
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.create_event_draft_v1(
  p_site_id uuid,
  p_event_key text,
  p_slug text,
  p_venue_id uuid,
  p_timezone text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_exhibitor_sales_opens_at timestamptz,
  p_exhibitor_sales_closes_at timestamptz,
  p_visitor_registration_opens_at timestamptz,
  p_visitor_registration_closes_at timestamptz
)
returns table (
  event_id uuid,
  publication_status public.publication_status,
  lifecycle_status public.event_lifecycle_status,
  lock_version integer,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  created public.events%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_event_key is null or btrim(p_event_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid event key is required';
  end if;
  if p_slug is null or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'valid event slug is required';
  end if;
  if p_timezone is null or length(btrim(p_timezone)) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'valid timezone is required';
  end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_venue_id is not null and not exists (
    select 1 from public.venues venue
    where venue.id = p_venue_id and venue.site_id = p_site_id and venue.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'venue must belong to the event site';
  end if;

  insert into public.events (
    site_id, event_key, slug, venue_id, timezone, starts_at, ends_at,
    exhibitor_sales_opens_at, exhibitor_sales_closes_at,
    visitor_registration_opens_at, visitor_registration_closes_at
  ) values (
    p_site_id, btrim(p_event_key), btrim(p_slug), p_venue_id, btrim(p_timezone), p_starts_at, p_ends_at,
    p_exhibitor_sales_opens_at, p_exhibitor_sales_closes_at,
    p_visitor_registration_opens_at, p_visitor_registration_closes_at
  )
  returning * into created;

  return query
  select created.id, created.status, created.lifecycle_status, created.lock_version, created.created_at;
end;
$$;

create or replace function public.update_event_draft_v1(
  p_event_id uuid,
  p_expected_lock_version integer,
  p_event_key text,
  p_slug text,
  p_venue_id uuid,
  p_timezone text,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_exhibitor_sales_opens_at timestamptz,
  p_exhibitor_sales_closes_at timestamptz,
  p_visitor_registration_opens_at timestamptz,
  p_visitor_registration_closes_at timestamptz,
  p_reason text
)
returns table (
  event_id uuid,
  publication_status public.publication_status,
  lifecycle_status public.event_lifecycle_status,
  lock_version integer,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events%rowtype;
begin
  select * into target from public.events where id = p_event_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' or target.lifecycle_status <> 'draft' then
    raise exception using errcode = '23514', message = 'event must return to draft before editing';
  end if;
  if p_expected_lock_version is null or target.lock_version <> p_expected_lock_version then
    raise exception using errcode = '40001', message = 'event was modified by another editor';
  end if;
  if p_event_key is null or btrim(p_event_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid event key is required';
  end if;
  if p_slug is null or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'valid event slug is required';
  end if;
  if p_timezone is null or length(btrim(p_timezone)) not between 1 and 100 then
    raise exception using errcode = '22023', message = 'valid timezone is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;
  if p_venue_id is not null and not exists (
    select 1 from public.venues venue
    where venue.id = p_venue_id and venue.site_id = target.site_id and venue.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'venue must belong to the event site';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.events
  set event_key = btrim(p_event_key),
      slug = btrim(p_slug),
      venue_id = p_venue_id,
      timezone = btrim(p_timezone),
      starts_at = p_starts_at,
      ends_at = p_ends_at,
      exhibitor_sales_opens_at = p_exhibitor_sales_opens_at,
      exhibitor_sales_closes_at = p_exhibitor_sales_closes_at,
      visitor_registration_opens_at = p_visitor_registration_opens_at,
      visitor_registration_closes_at = p_visitor_registration_closes_at
  where id = p_event_id
  returning * into target;

  return query
  select target.id, target.status, target.lifecycle_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_event_translation_v1(
  p_event_id uuid,
  p_locale text,
  p_name text,
  p_short_description text,
  p_body jsonb,
  p_reason text
)
returns table (
  translation_id uuid,
  status public.translation_status,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_event public.events%rowtype;
  target public.event_translations%rowtype;
begin
  select * into target_event from public.events where id = p_event_id and deleted_at is null;
  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;
  if not (select app_private.has_permission(target_event.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if not exists (
    select 1 from public.site_locales locale
    where locale.site_id = target_event.site_id and locale.locale = p_locale and locale.enabled
  ) then
    raise exception using errcode = '22023', message = 'enabled event locale is required';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 300 then
    raise exception using errcode = '22023', message = 'event name must contain 1 to 300 characters';
  end if;
  if p_short_description is null or length(p_short_description) > 1000 then
    raise exception using errcode = '22023', message = 'event summary cannot exceed 1000 characters';
  end if;
  if p_body is null or jsonb_typeof(p_body) <> 'object' or octet_length(p_body::text) > 32768 then
    raise exception using errcode = '22023', message = 'event body must be a JSON object no larger than 32768 bytes';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'edit reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target
  from public.event_translations
  where event_id = p_event_id and locale = p_locale
  for update;

  if found then
    if target.status not in ('missing', 'draft', 'in_review') then
      raise exception using errcode = '23514', message = 'translation must return to draft before editing';
    end if;
    update public.event_translations
    set name = btrim(p_name), short_description = p_short_description, body = p_body
    where id = target.id
    returning * into target;
  else
    insert into public.event_translations (
      site_id, event_id, locale, name, short_description, body
    ) values (
      target_event.site_id, p_event_id, p_locale, btrim(p_name), p_short_description, p_body
    )
    returning * into target;
  end if;

  return query select target.id, target.status, target.updated_at;
end;
$$;

create or replace function public.transition_event_publication_status_v1(
  p_event_id uuid,
  p_new_status public.publication_status,
  p_reason text,
  p_publish_at timestamptz default null
)
returns table (
  event_id uuid,
  publication_status public.publication_status,
  lifecycle_status public.event_lifecycle_status,
  lock_version integer,
  publish_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.events%rowtype;
begin
  select * into target from public.events where id = p_event_id and deleted_at is null for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'event not found';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status = 'scheduled' and (p_publish_at is null or p_publish_at <= now()) then
    raise exception using errcode = '22023', message = 'scheduled publication requires a future publish_at';
  end if;
  if p_new_status = 'in_review' and target.lifecycle_status <> 'review' then
    raise exception using errcode = '23514', message = 'event lifecycle must enter review before publication review';
  end if;
  if p_new_status = 'approved' and target.lifecycle_status in ('draft', 'cancelled', 'rescheduled', 'archived') then
    raise exception using errcode = '23514', message = 'event lifecycle is incompatible with approval';
  end if;
  if p_new_status = 'scheduled' and target.lifecycle_status not in (
    'scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live'
  ) then
    raise exception using errcode = '23514', message = 'event lifecycle is incompatible with scheduled publication';
  end if;
  if p_new_status = 'published' and target.lifecycle_status not in (
    'scheduled', 'exhibitor_sales_open', 'visitor_registration_open', 'live', 'ended', 'recap_waitlist'
  ) then
    raise exception using errcode = '23514', message = 'event lifecycle is incompatible with publication';
  end if;
  if p_new_status = 'archived' and target.lifecycle_status not in ('archived', 'cancelled', 'rescheduled') then
    raise exception using errcode = '23514', message = 'event lifecycle is incompatible with archival';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.events
  set status = p_new_status,
      publish_at = case
        when p_new_status = 'scheduled' then p_publish_at
        when p_new_status = 'draft' then null
        else target.publish_at
      end
  where id = p_event_id
  returning * into target;

  return query
  select target.id, target.status, target.lifecycle_status, target.lock_version, target.publish_at, target.updated_at;
end;
$$;

create or replace function public.transition_event_translation_status_v1(
  p_event_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (
  translation_id uuid,
  status public.translation_status,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.event_translations%rowtype;
begin
  select * into target
  from public.event_translations
  where event_id = p_event_id and locale = p_locale
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'event translation not found';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.event_translations
  set status = p_new_status
  where id = target.id
  returning * into target;

  return query select target.id, target.status, target.updated_at;
end;
$$;

revoke all on function public.search_cms_events_v1(
  uuid, text, public.publication_status, public.event_lifecycle_status, integer
) from public, anon;
revoke all on function public.cms_event_workspace_v1(uuid) from public, anon;
revoke all on function public.create_event_draft_v1(
  uuid, text, text, uuid, text, timestamptz, timestamptz,
  timestamptz, timestamptz, timestamptz, timestamptz
) from public, anon;
revoke all on function public.update_event_draft_v1(
  uuid, integer, text, text, uuid, text, timestamptz, timestamptz,
  timestamptz, timestamptz, timestamptz, timestamptz, text
) from public, anon;
revoke all on function public.upsert_event_translation_v1(uuid, text, text, text, jsonb, text)
  from public, anon;
revoke all on function public.transition_event_publication_status_v1(
  uuid, public.publication_status, text, timestamptz
) from public, anon;
revoke all on function public.transition_event_translation_status_v1(
  uuid, text, public.translation_status, text
) from public, anon;

grant execute on function public.search_cms_events_v1(
  uuid, text, public.publication_status, public.event_lifecycle_status, integer
) to authenticated;
grant execute on function public.cms_event_workspace_v1(uuid) to authenticated;
grant execute on function public.create_event_draft_v1(
  uuid, text, text, uuid, text, timestamptz, timestamptz,
  timestamptz, timestamptz, timestamptz, timestamptz
) to authenticated;
grant execute on function public.update_event_draft_v1(
  uuid, integer, text, text, uuid, text, timestamptz, timestamptz,
  timestamptz, timestamptz, timestamptz, timestamptz, text
) to authenticated;
grant execute on function public.upsert_event_translation_v1(uuid, text, text, text, jsonb, text)
  to authenticated;
grant execute on function public.transition_event_publication_status_v1(
  uuid, public.publication_status, text, timestamptz
) to authenticated;
grant execute on function public.transition_event_translation_status_v1(
  uuid, text, public.translation_status, text
) to authenticated;

-- Event writes from browser-facing clients must use the actor-stamped workflow RPCs.
revoke insert, update, delete on public.events, public.event_translations from authenticated;

commit;
