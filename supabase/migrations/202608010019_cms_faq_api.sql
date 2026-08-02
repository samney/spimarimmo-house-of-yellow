begin;

alter table public.faqs
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.faq_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.faq_warnings_v1(p_faq_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.faqs%rowtype;
declare locale_row record;
declare translation_row public.faq_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.faqs where id = p_faq_id and deleted_at is null;
  if not found then return array['faq_not_found']; end if;
  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.faq_translations translation
    where translation.site_id = target.site_id and translation.faq_id = target.id
      and translation.locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    elsif nullif(btrim(translation_row.question), '') is null then
      warnings := array_append(warnings, 'missing_question:' || locale_row.locale);
    elsif translation_row.answer = '{}'::jsonb then
      warnings := array_append(warnings, 'missing_answer:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_faqs_v1(
  p_site_id uuid, p_event_id uuid default null, p_audience text default null,
  p_status public.publication_status default null, p_query text default null,
  p_limit integer default 50
)
returns table (
  faq_id uuid, site_id uuid, event_id uuid, faq_key text, audience text,
  "position" integer, publication_status public.publication_status,
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
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the FAQ site';
  end if;
  if p_audience is not null and p_audience not in ('exhibitor','visitor','general') then
    raise exception using errcode = '22023', message = 'valid FAQ audience is required';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;

  return query select faq.id, faq.site_id, faq.event_id, faq.faq_key,
    faq.audience, faq.position, faq.status, faq.lock_version,
    app_private.faq_warnings_v1(faq.id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'question', translation.question,
      'answer', translation.answer, 'status', translation.status,
      'lockVersion', translation.lock_version
    ) order by translation.locale)
      from public.faq_translations translation
      where translation.site_id = faq.site_id and translation.faq_id = faq.id),
      '[]'::jsonb), faq.updated_at
  from public.faqs faq
  where faq.site_id = p_site_id and faq.deleted_at is null
    and (p_event_id is null or faq.event_id = p_event_id)
    and (p_audience is null or faq.audience = p_audience)
    and (p_status is null or faq.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or faq.faq_key ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.faq_translations translation
        where translation.site_id = faq.site_id and translation.faq_id = faq.id
          and translation.question ilike '%' || btrim(p_query) || '%'))
  order by faq.position, faq.updated_at desc, faq.id limit p_limit;
end;
$$;

create or replace function app_private.validate_faq_input_v1(
  p_site_id uuid, p_event_id uuid, p_faq_key text,
  p_audience text, p_position integer
)
returns void
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
begin
  if p_faq_key is null or length(btrim(p_faq_key)) not between 1 and 200
     or btrim(p_faq_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid FAQ key is required';
  end if;
  if p_audience is null or p_audience not in ('exhibitor','visitor','general') then
    raise exception using errcode = '22023', message = 'valid FAQ audience is required';
  end if;
  if p_position is null or p_position not between 0 and 1000000 then
    raise exception using errcode = '22023', message = 'valid FAQ position is required';
  end if;
  if p_event_id is not null and not exists (select 1 from public.events event
    where event.id = p_event_id and event.site_id = p_site_id and event.deleted_at is null) then
    raise exception using errcode = '22023', message = 'event must belong to the FAQ site';
  end if;
end;
$$;

create or replace function public.create_faq_v1(
  p_site_id uuid, p_event_id uuid, p_faq_key text,
  p_audience text, p_position integer
)
returns table (
  faq_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.faqs%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_faq_input_v1(
    p_site_id, p_event_id, p_faq_key, p_audience, p_position
  );
  insert into public.faqs (
    site_id, event_id, faq_key, audience, position, created_by, updated_by
  ) values (
    p_site_id, p_event_id, btrim(p_faq_key), p_audience, p_position,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_faq_v1(
  p_faq_id uuid, p_expected_lock_version integer, p_event_id uuid,
  p_faq_key text, p_audience text, p_position integer, p_reason text
)
returns table (
  faq_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.faqs%rowtype;
begin
  select * into target from public.faqs
  where id = p_faq_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'FAQ not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'FAQ must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'FAQ was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_faq_input_v1(
    target.site_id, p_event_id, p_faq_key, p_audience, p_position
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.faqs set event_id = p_event_id, faq_key = btrim(p_faq_key),
    audience = p_audience, position = p_position,
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_faq_translation_v1(
  p_faq_id uuid, p_locale text, p_question text, p_answer jsonb, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target_faq public.faqs%rowtype;
declare target public.faq_translations%rowtype;
begin
  select * into target_faq from public.faqs where id = p_faq_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'FAQ not found'; end if;
  if not (select app_private.has_permission(target_faq.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if target_faq.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'FAQ must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_faq.site_id and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled FAQ locale is required';
  end if;
  if p_question is null or length(btrim(p_question)) not between 1 and 1000
     or p_answer is null or jsonb_typeof(p_answer) <> 'object'
     or p_answer = '{}'::jsonb or octet_length(p_answer::text) > 50000 then
    raise exception using errcode = '22023', message = 'valid bounded FAQ copy is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.faq_translations
  where faq_id = target_faq.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'FAQ translation must return to draft before editing';
    end if;
    update public.faq_translations set question = btrim(p_question), answer = p_answer,
      updated_by = (select auth.uid()), lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.faq_translations (
      site_id, faq_id, locale, question, answer, created_by, updated_by
    ) values (
      target_faq.site_id, target_faq.id, p_locale, btrim(p_question), p_answer,
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_faq_translation_status_v1(
  p_faq_id uuid, p_locale text, p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.faq_translations%rowtype;
begin
  select * into target from public.faq_translations
  where faq_id = p_faq_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'FAQ translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'FAQ translation status must change';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.faq_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_faq_status_v1(
  p_faq_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (
  faq_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.faqs%rowtype;
begin
  select * into target from public.faqs where id = p_faq_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'FAQ not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_new_status = 'scheduled' then
    raise exception using errcode = '23514', message = 'FAQ scheduling is not implemented';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'FAQ status must change';
  end if;
  if p_new_status in ('approved','published','archived')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','published')
     and cardinality(app_private.faq_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'FAQ is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.faqs set status = p_new_status, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.faqs from authenticated;
revoke insert, update, delete on table public.faq_translations from authenticated;

revoke all on function public.search_cms_faqs_v1(uuid,uuid,text,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_faq_v1(uuid,uuid,text,text,integer) from public, anon;
revoke all on function public.update_faq_v1(uuid,integer,uuid,text,text,integer,text) from public, anon;
revoke all on function public.upsert_faq_translation_v1(uuid,text,text,jsonb,text) from public, anon;
revoke all on function public.transition_faq_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_faq_status_v1(uuid,public.publication_status,text) from public, anon;

grant execute on function public.search_cms_faqs_v1(uuid,uuid,text,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_faq_v1(uuid,uuid,text,text,integer) to authenticated;
grant execute on function public.update_faq_v1(uuid,integer,uuid,text,text,integer,text) to authenticated;
grant execute on function public.upsert_faq_translation_v1(uuid,text,text,jsonb,text) to authenticated;
grant execute on function public.transition_faq_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_faq_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
