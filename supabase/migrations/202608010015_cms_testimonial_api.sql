begin;

alter table public.testimonials
  add column if not exists consent_reference text,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.testimonial_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.testimonial_warnings_v1(p_testimonial_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.testimonials%rowtype;
  locale_row record;
  translation_row public.testimonial_translations%rowtype;
  media_status public.publication_status;
  warnings text[] := array[]::text[];
begin
  select * into target from public.testimonials
  where id = p_testimonial_id and deleted_at is null;
  if not found then return array['testimonial_not_found']::text[]; end if;
  if target.evidence_status <> 'verified' then
    warnings := array_append(warnings, 'evidence_unverified');
  end if;
  if nullif(btrim(target.consent_reference), '') is null then
    warnings := array_append(warnings, 'missing_consent_reference');
  end if;
  if nullif(btrim(target.person_name), '') is null then
    warnings := array_append(warnings, 'missing_person_name');
  end if;
  if nullif(btrim(target.organization_name), '') is null then
    warnings := array_append(warnings, 'missing_organization_name');
  end if;
  if target.media_id is not null then
    select asset.status into media_status from public.media_assets asset
    where asset.id = target.media_id and asset.site_id = target.site_id
      and asset.deleted_at is null;
    if media_status is distinct from 'published' then
      warnings := array_append(warnings, 'testimonial_media_unpublished');
    end if;
  end if;
  for locale_row in
    select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.testimonial_translations translation
    where translation.site_id = target.site_id
      and translation.testimonial_id = target.id
      and translation.locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    elsif nullif(btrim(translation_row.quote), '') is null then
      warnings := array_append(warnings, 'missing_quote:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_testimonials_v1(
  p_site_id uuid,
  p_event_id uuid default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  testimonial_id uuid, site_id uuid, event_id uuid, testimonial_key text,
  person_name text, person_role text, organization_name text, media_id uuid,
  evidence_status public.evidence_status,
  publication_status public.publication_status, lock_version integer,
  warning_codes text[], translations jsonb, updated_at timestamptz
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
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the testimonial site';
  end if;

  return query select testimonial.id, testimonial.site_id, testimonial.event_id,
    testimonial.testimonial_key, testimonial.person_name, testimonial.person_role,
    testimonial.organization_name, testimonial.media_id,
    testimonial.evidence_status, testimonial.status, testimonial.lock_version,
    app_private.testimonial_warnings_v1(testimonial.id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'quote', translation.quote,
      'transcript', translation.transcript, 'status', translation.status,
      'lockVersion', translation.lock_version
    ) order by translation.locale)
      from public.testimonial_translations translation
      where translation.site_id = testimonial.site_id
        and translation.testimonial_id = testimonial.id), '[]'::jsonb),
    testimonial.updated_at
  from public.testimonials testimonial
  where testimonial.site_id = p_site_id and testimonial.deleted_at is null
    and (p_event_id is null or testimonial.event_id = p_event_id)
    and (p_status is null or testimonial.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or testimonial.testimonial_key ilike '%' || btrim(p_query) || '%'
      or testimonial.person_name ilike '%' || btrim(p_query) || '%'
      or testimonial.organization_name ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.testimonial_translations translation
        where translation.site_id = testimonial.site_id
          and translation.testimonial_id = testimonial.id
          and (translation.quote ilike '%' || btrim(p_query) || '%'
            or translation.transcript ilike '%' || btrim(p_query) || '%')))
  order by testimonial.updated_at desc, testimonial.id limit p_limit;
end;
$$;

create or replace function app_private.validate_testimonial_input_v1(
  p_site_id uuid, p_event_id uuid, p_testimonial_key text,
  p_person_name text, p_person_role text, p_organization_name text,
  p_media_id uuid
)
returns void
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
begin
  if p_testimonial_key is null or length(btrim(p_testimonial_key)) not between 1 and 200
     or btrim(p_testimonial_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid testimonial key is required';
  end if;
  if p_person_name is null or length(btrim(p_person_name)) not between 1 and 200
     or p_organization_name is null or length(btrim(p_organization_name)) not between 1 and 300
     or (p_person_role is not null and length(btrim(p_person_role)) > 200) then
    raise exception using errcode = '22023', message = 'bounded testimonial attribution is required';
  end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the testimonial site';
  end if;
  if p_media_id is not null and not exists (select 1 from public.media_assets asset
    where asset.id = p_media_id and asset.site_id = p_site_id and asset.deleted_at is null) then
    raise exception using errcode = '22023', message = 'media must belong to the testimonial site';
  end if;
end;
$$;

create or replace function public.create_testimonial_v1(
  p_site_id uuid, p_event_id uuid, p_testimonial_key text,
  p_person_name text, p_person_role text, p_organization_name text,
  p_media_id uuid
)
returns table (
  testimonial_id uuid, status public.publication_status,
  evidence_status public.evidence_status, lock_version integer,
  updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.testimonials%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_testimonial_input_v1(
    p_site_id, p_event_id, p_testimonial_key, p_person_name, p_person_role,
    p_organization_name, p_media_id
  );
  insert into public.testimonials (
    site_id, event_id, testimonial_key, person_name, person_role,
    organization_name, media_id, created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_testimonial_key), btrim(p_person_name),
    nullif(btrim(p_person_role), ''), btrim(p_organization_name), p_media_id,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.evidence_status,
    target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_testimonial_v1(
  p_testimonial_id uuid, p_expected_lock_version integer, p_event_id uuid,
  p_testimonial_key text, p_person_name text, p_person_role text,
  p_organization_name text, p_media_id uuid, p_reason text
)
returns table (
  testimonial_id uuid, status public.publication_status,
  evidence_status public.evidence_status, lock_version integer,
  updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.testimonials%rowtype;
begin
  select * into target from public.testimonials
  where id = p_testimonial_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'testimonial not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'testimonial must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'testimonial was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_testimonial_input_v1(
    target.site_id, p_event_id, p_testimonial_key, p_person_name, p_person_role,
    p_organization_name, p_media_id
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.testimonials set event_id = p_event_id,
    testimonial_key = btrim(p_testimonial_key), person_name = btrim(p_person_name),
    person_role = nullif(btrim(p_person_role), ''),
    organization_name = btrim(p_organization_name), media_id = p_media_id,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status,
    target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_testimonial_translation_v1(
  p_testimonial_id uuid, p_locale text, p_quote text,
  p_transcript text, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target_testimonial public.testimonials%rowtype;
declare target public.testimonial_translations%rowtype;
begin
  select * into target_testimonial from public.testimonials
  where id = p_testimonial_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'testimonial not found'; end if;
  if not (select app_private.has_permission(target_testimonial.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if target_testimonial.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'testimonial must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_testimonial.site_id
      and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled testimonial locale is required';
  end if;
  if p_quote is null or length(btrim(p_quote)) not between 1 and 2000
     or (p_transcript is not null and length(p_transcript) > 10000) then
    raise exception using errcode = '22023', message = 'valid bounded testimonial copy is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.testimonial_translations
  where testimonial_id = target_testimonial.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'testimonial translation must return to draft before editing';
    end if;
    update public.testimonial_translations set quote = btrim(p_quote),
      transcript = nullif(p_transcript, ''), updated_by = (select auth.uid()),
      lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.testimonial_translations (
      site_id, testimonial_id, locale, quote, transcript, created_by, updated_by
    ) values (
      target_testimonial.site_id, target_testimonial.id, p_locale,
      btrim(p_quote), nullif(p_transcript, ''),
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_testimonial_translation_status_v1(
  p_testimonial_id uuid, p_locale text,
  p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.testimonial_translations%rowtype;
begin
  select * into target from public.testimonial_translations
  where testimonial_id = p_testimonial_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'testimonial translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.testimonial_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_testimonial_evidence_v1(
  p_testimonial_id uuid, p_new_status public.evidence_status,
  p_evidence_source text, p_consent_reference text, p_reason text
)
returns table (
  testimonial_id uuid, evidence_status public.evidence_status,
  approved_by uuid, approved_at timestamptz, lock_version integer
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.testimonials%rowtype;
begin
  select * into target from public.testimonials
  where id = p_testimonial_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'testimonial not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published testimonial evidence cannot change';
  end if;
  if not ((target.evidence_status = 'missing' and p_new_status = 'submitted')
    or (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected'))
    or (target.evidence_status = 'rejected' and p_new_status = 'submitted')) then
    raise exception using errcode = '23514', message = 'invalid testimonial evidence transition';
  end if;
  if p_new_status in ('verified','rejected')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000
     or p_consent_reference is null or length(btrim(p_consent_reference)) not between 3 and 500
     or p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'bounded evidence, consent reference, and reason are required';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.testimonials set evidence_status = p_new_status,
    evidence_source = btrim(p_evidence_source),
    consent_reference = btrim(p_consent_reference),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.approved_by,
    target.approved_at, target.lock_version;
end;
$$;

create or replace function public.transition_testimonial_status_v1(
  p_testimonial_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (
  testimonial_id uuid, status public.publication_status,
  evidence_status public.evidence_status, lock_version integer,
  updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.testimonials%rowtype;
begin
  select * into target from public.testimonials
  where id = p_testimonial_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'testimonial not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'testimonial scheduling is not implemented';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published')
     and cardinality(app_private.testimonial_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'testimonial is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.testimonials set status = p_new_status,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status,
    target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.testimonials from authenticated;
revoke insert, update, delete on table public.testimonial_translations from authenticated;

revoke all on function public.search_cms_testimonials_v1(uuid,uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_testimonial_v1(uuid,uuid,text,text,text,text,uuid) from public, anon;
revoke all on function public.update_testimonial_v1(uuid,integer,uuid,text,text,text,text,uuid,text) from public, anon;
revoke all on function public.upsert_testimonial_translation_v1(uuid,text,text,text,text) from public, anon;
revoke all on function public.transition_testimonial_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_testimonial_evidence_v1(uuid,public.evidence_status,text,text,text) from public, anon;
revoke all on function public.transition_testimonial_status_v1(uuid,public.publication_status,text) from public, anon;

grant execute on function public.search_cms_testimonials_v1(uuid,uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_testimonial_v1(uuid,uuid,text,text,text,text,uuid) to authenticated;
grant execute on function public.update_testimonial_v1(uuid,integer,uuid,text,text,text,text,uuid,text) to authenticated;
grant execute on function public.upsert_testimonial_translation_v1(uuid,text,text,text,text) to authenticated;
grant execute on function public.transition_testimonial_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_testimonial_evidence_v1(uuid,public.evidence_status,text,text,text) to authenticated;
grant execute on function public.transition_testimonial_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
