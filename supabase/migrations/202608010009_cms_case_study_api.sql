begin;

alter table public.case_studies
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.case_study_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.case_study_warnings_v1(p_case_study_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  target public.case_studies%rowtype;
  locale_row record;
  translation_row public.case_study_translations%rowtype;
  media_status public.publication_status;
  warnings text[] := array[]::text[];
begin
  select * into target from public.case_studies
  where id = p_case_study_id and deleted_at is null;
  if not found then return array['case_study_not_found']::text[]; end if;
  if target.evidence_status <> 'verified' then
    warnings := array_append(warnings, 'evidence_unverified');
  end if;
  if target.primary_media_id is null then
    warnings := array_append(warnings, 'missing_primary_media');
  else
    select status into media_status from public.media_assets
    where id = target.primary_media_id and site_id = target.site_id and deleted_at is null;
    if media_status is distinct from 'published' then
      warnings := array_append(warnings, 'primary_media_unpublished');
    end if;
  end if;
  for locale_row in
    select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.case_study_translations
    where case_study_id = target.id and locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_unapproved:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_case_studies_v1(
  p_site_id uuid,
  p_event_id uuid default null,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  case_study_id uuid,
  site_id uuid,
  event_id uuid,
  slug text,
  primary_media_id uuid,
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
  if not exists (select 1 from public.sites where id = p_site_id and deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null
  ) then raise exception using errcode = '22023', message = 'event must belong to the case study site'; end if;

  return query
  select story.id, story.site_id, story.event_id, story.slug,
    story.primary_media_id, story.evidence_status, story.status,
    story.lock_version, app_private.case_study_warnings_v1(story.id),
    coalesce((select jsonb_agg(to_jsonb(translation) order by translation.locale)
      from public.case_study_translations translation
      where translation.case_study_id = story.id), '[]'::jsonb),
    story.updated_at
  from public.case_studies story
  where story.site_id = p_site_id and story.deleted_at is null
    and (p_event_id is null or story.event_id = p_event_id)
    and (p_status is null or story.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or story.slug ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.case_study_translations translation
        where translation.case_study_id = story.id
          and translation.title ilike '%' || btrim(p_query) || '%'))
  order by story.updated_at desc, story.id limit p_limit;
end;
$$;

create or replace function app_private.validate_case_study_input_v1(
  p_site_id uuid,
  p_event_id uuid,
  p_slug text,
  p_primary_media_id uuid
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
    raise exception using errcode = '22023', message = 'valid case study slug is required';
  end if;
  if p_event_id is not null and not exists (
    select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null
  ) then raise exception using errcode = '22023', message = 'event must belong to the case study site'; end if;
  if p_primary_media_id is not null and not exists (
    select 1 from public.media_assets asset
    where asset.id = p_primary_media_id and asset.site_id = p_site_id and asset.deleted_at is null
  ) then raise exception using errcode = '22023', message = 'media must belong to the case study site'; end if;
end;
$$;

create or replace function public.create_case_study_v1(
  p_site_id uuid,
  p_event_id uuid,
  p_slug text,
  p_primary_media_id uuid
)
returns table (case_study_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.case_studies%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites where id = p_site_id and deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_case_study_input_v1(
    p_site_id, p_event_id, p_slug, p_primary_media_id);
  insert into public.case_studies (
    site_id, event_id, slug, primary_media_id, created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_slug), p_primary_media_id,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_case_study_v1(
  p_case_study_id uuid,
  p_expected_lock_version integer,
  p_event_id uuid,
  p_slug text,
  p_primary_media_id uuid,
  p_reason text
)
returns table (case_study_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.case_studies%rowtype;
begin
  select * into target from public.case_studies
  where id = p_case_study_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'case study not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'case study must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'case study was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_case_study_input_v1(
    target.site_id, p_event_id, p_slug, p_primary_media_id);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.case_studies set
    event_id = p_event_id, slug = btrim(p_slug), primary_media_id = p_primary_media_id,
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_case_study_translation_v1(
  p_case_study_id uuid,
  p_locale text,
  p_title text,
  p_summary text,
  p_body jsonb,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare parent public.case_studies%rowtype; target public.case_study_translations%rowtype;
begin
  select * into parent from public.case_studies where id = p_case_study_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'case study not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if parent.status <> 'draft' then
    raise exception using errcode = '23514', message = 'case study translations require a draft story';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = parent.site_id and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled case study locale is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 200
     or p_summary is null or length(btrim(p_summary)) > 1000
     or p_body is null or jsonb_typeof(p_body) <> 'object'
     or octet_length(p_body::text) > 65536 then
    raise exception using errcode = '22023', message = 'valid bounded case study translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.case_study_translations
  where case_study_id = p_case_study_id and locale = p_locale for update;
  if found then
    if target.status <> 'draft' then
      raise exception using errcode = '23514', message = 'case study translation must be draft before editing';
    end if;
    update public.case_study_translations set
      title = btrim(p_title), summary = btrim(p_summary), body = p_body,
      lock_version = target.lock_version + 1, updated_by = (select auth.uid())
    where id = target.id returning * into target;
  else
    insert into public.case_study_translations (
      site_id, case_study_id, locale, title, summary, body, created_by, updated_by
    ) values (
      parent.site_id, parent.id, p_locale, btrim(p_title), btrim(p_summary), p_body,
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_case_study_translation_status_v1(
  p_case_study_id uuid,
  p_locale text,
  p_new_status public.translation_status,
  p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.case_study_translations%rowtype;
begin
  select * into target from public.case_study_translations
  where case_study_id = p_case_study_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'case study translation not found'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.case_study_translations set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_case_study_evidence_v1(
  p_case_study_id uuid,
  p_new_status public.evidence_status,
  p_evidence_source text,
  p_reason text
)
returns table (case_study_id uuid, evidence_status public.evidence_status, approved_by uuid, approved_at timestamptz, lock_version integer)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.case_studies%rowtype;
begin
  select * into target from public.case_studies
  where id = p_case_study_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'case study not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'published case study evidence cannot change';
  end if;
  if not (
    (target.evidence_status = 'missing' and p_new_status = 'submitted') or
    (target.evidence_status = 'submitted' and p_new_status in ('verified','rejected')) or
    (target.evidence_status = 'rejected' and p_new_status = 'submitted')
  ) then raise exception using errcode = '23514', message = 'invalid case study evidence transition'; end if;
  if p_new_status in ('verified','rejected')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_evidence_source is null or length(btrim(p_evidence_source)) not between 3 and 1000 then
    raise exception using errcode = '22023', message = 'evidence source must contain 3 to 1000 characters';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'evidence reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.case_studies set
    evidence_status = p_new_status, evidence_source = btrim(p_evidence_source),
    approved_by = case when p_new_status = 'verified' then (select auth.uid()) else null end,
    approved_at = case when p_new_status = 'verified' then now() else null end,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.evidence_status, target.approved_by, target.approved_at, target.lock_version;
end;
$$;

create or replace function public.transition_case_study_status_v1(
  p_case_study_id uuid,
  p_new_status public.publication_status,
  p_reason text
)
returns table (case_study_id uuid, status public.publication_status, evidence_status public.evidence_status, lock_version integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare target public.case_studies%rowtype; warnings text[];
begin
  select * into target from public.case_studies
  where id = p_case_study_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'case study not found'; end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'case study scheduling is not implemented';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published') then
    warnings := app_private.case_study_warnings_v1(target.id);
    if cardinality(warnings) > 0 then
      raise exception using errcode = '23514', message = 'case study is incomplete';
    end if;
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.case_studies set status = p_new_status
  where id = target.id returning * into target;
  return query select target.id, target.status, target.evidence_status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.case_studies, public.case_study_translations from authenticated;
revoke all on function public.search_cms_case_studies_v1(uuid,uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_case_study_v1(uuid,uuid,text,uuid) from public, anon;
revoke all on function public.update_case_study_v1(uuid,integer,uuid,text,uuid,text) from public, anon;
revoke all on function public.upsert_case_study_translation_v1(uuid,text,text,text,jsonb,text) from public, anon;
revoke all on function public.transition_case_study_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_case_study_evidence_v1(uuid,public.evidence_status,text,text) from public, anon;
revoke all on function public.transition_case_study_status_v1(uuid,public.publication_status,text) from public, anon;
grant execute on function public.search_cms_case_studies_v1(uuid,uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_case_study_v1(uuid,uuid,text,uuid) to authenticated;
grant execute on function public.update_case_study_v1(uuid,integer,uuid,text,uuid,text) to authenticated;
grant execute on function public.upsert_case_study_translation_v1(uuid,text,text,text,jsonb,text) to authenticated;
grant execute on function public.transition_case_study_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_case_study_evidence_v1(uuid,public.evidence_status,text,text) to authenticated;
grant execute on function public.transition_case_study_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
