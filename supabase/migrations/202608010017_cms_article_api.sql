begin;

alter table public.articles
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.article_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.article_warnings_v1(p_article_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.articles%rowtype;
declare locale_row record;
declare translation_row public.article_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.articles
  where id = p_article_id and deleted_at is null;
  if not found then return array['article_not_found']; end if;

  if target.primary_media_id is not null and not exists (
    select 1 from public.media_assets asset
    where asset.id = target.primary_media_id
      and asset.site_id = target.site_id
      and asset.kind = 'image'
      and asset.status = 'published'
      and asset.deleted_at is null
  ) then
    warnings := array_append(warnings, 'primary_media_not_ready');
  end if;

  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.article_translations translation
    where translation.site_id = target.site_id
      and translation.article_id = target.id
      and translation.locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    elsif nullif(btrim(translation_row.title), '') is null then
      warnings := array_append(warnings, 'missing_title:' || locale_row.locale);
    elsif nullif(btrim(translation_row.excerpt), '') is null then
      warnings := array_append(warnings, 'missing_excerpt:' || locale_row.locale);
    elsif translation_row.body = '{}'::jsonb then
      warnings := array_append(warnings, 'missing_body:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_articles_v1(
  p_site_id uuid,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  article_id uuid, site_id uuid, slug text, primary_media_id uuid,
  publication_status public.publication_status, publish_at timestamptz,
  published_at timestamptz, lock_version integer, warning_codes text[],
  translations jsonb, updated_at timestamptz
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

  return query select article.id, article.site_id, article.slug,
    article.primary_media_id, article.status, article.publish_at,
    article.published_at, article.lock_version,
    app_private.article_warnings_v1(article.id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'title', translation.title,
      'excerpt', translation.excerpt, 'body', translation.body,
      'status', translation.status, 'lockVersion', translation.lock_version
    ) order by translation.locale)
      from public.article_translations translation
      where translation.site_id = article.site_id
        and translation.article_id = article.id), '[]'::jsonb),
    article.updated_at
  from public.articles article
  where article.site_id = p_site_id and article.deleted_at is null
    and (p_status is null or article.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or article.slug ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.article_translations translation
        where translation.site_id = article.site_id
          and translation.article_id = article.id
          and (translation.title ilike '%' || btrim(p_query) || '%'
            or translation.excerpt ilike '%' || btrim(p_query) || '%')))
  order by article.updated_at desc, article.id limit p_limit;
end;
$$;

create or replace function app_private.validate_article_input_v1(
  p_site_id uuid, p_slug text, p_primary_media_id uuid
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
    raise exception using errcode = '22023', message = 'valid article slug is required';
  end if;
  if p_primary_media_id is not null and not exists (
    select 1 from public.media_assets asset
    where asset.id = p_primary_media_id and asset.site_id = p_site_id
      and asset.kind = 'image' and asset.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'article media must be a same-site image';
  end if;
end;
$$;

create or replace function public.create_article_v1(
  p_site_id uuid, p_slug text, p_primary_media_id uuid
)
returns table (
  article_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.articles%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_article_input_v1(p_site_id, p_slug, p_primary_media_id);
  insert into public.articles (
    site_id, slug, primary_media_id, created_by, updated_by
  ) values (
    p_site_id, btrim(p_slug), p_primary_media_id,
    (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_article_v1(
  p_article_id uuid, p_expected_lock_version integer,
  p_slug text, p_primary_media_id uuid, p_reason text
)
returns table (
  article_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.articles%rowtype;
begin
  select * into target from public.articles
  where id = p_article_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'article not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'article must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'article was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_article_input_v1(target.site_id, p_slug, p_primary_media_id);
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.articles set slug = btrim(p_slug),
    primary_media_id = p_primary_media_id,
    lock_version = target.lock_version + 1,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_article_translation_v1(
  p_article_id uuid, p_locale text, p_title text, p_excerpt text,
  p_body jsonb, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target_article public.articles%rowtype;
declare target public.article_translations%rowtype;
begin
  select * into target_article from public.articles
  where id = p_article_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'article not found'; end if;
  if not (select app_private.has_permission(target_article.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if target_article.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'article must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = target_article.site_id
      and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled article locale is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 300
     or p_excerpt is null or length(btrim(p_excerpt)) not between 1 and 1000
     or p_body is null or jsonb_typeof(p_body) <> 'object'
     or p_body = '{}'::jsonb or octet_length(p_body::text) > 100000 then
    raise exception using errcode = '22023', message = 'valid bounded article copy is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.article_translations
  where article_id = target_article.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'article translation must return to draft before editing';
    end if;
    update public.article_translations set title = btrim(p_title),
      excerpt = btrim(p_excerpt), body = p_body,
      updated_by = (select auth.uid()), lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.article_translations (
      site_id, article_id, locale, title, excerpt, body, created_by, updated_by
    ) values (
      target_article.site_id, target_article.id, p_locale, btrim(p_title),
      btrim(p_excerpt), p_body, (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_article_translation_status_v1(
  p_article_id uuid, p_locale text,
  p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.article_translations%rowtype;
begin
  select * into target from public.article_translations
  where article_id = p_article_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'article translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'article translation status must change';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.article_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_article_status_v1(
  p_article_id uuid, p_new_status public.publication_status,
  p_publish_at timestamptz, p_reason text
)
returns table (
  article_id uuid, status public.publication_status, publish_at timestamptz,
  published_at timestamptz, lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.articles%rowtype;
begin
  select * into target from public.articles
  where id = p_article_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'article not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'article status must change';
  end if;
  if p_new_status in ('approved','scheduled','published','archived')
     and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_new_status = 'scheduled' and (p_publish_at is null or p_publish_at <= now()) then
    raise exception using errcode = '22023', message = 'future publish time is required for scheduling';
  end if;
  if p_new_status <> 'scheduled' and p_publish_at is not null then
    raise exception using errcode = '22023', message = 'publish time is only valid for scheduling';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','scheduled','published')
     and cardinality(app_private.article_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'article is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.articles set status = p_new_status,
    publish_at = case when p_new_status = 'scheduled' then p_publish_at else null end,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.publish_at,
    target.published_at, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.articles from authenticated;
revoke insert, update, delete on table public.article_translations from authenticated;

revoke all on function public.search_cms_articles_v1(uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_article_v1(uuid,text,uuid) from public, anon;
revoke all on function public.update_article_v1(uuid,integer,text,uuid,text) from public, anon;
revoke all on function public.upsert_article_translation_v1(uuid,text,text,text,jsonb,text) from public, anon;
revoke all on function public.transition_article_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_article_status_v1(uuid,public.publication_status,timestamptz,text) from public, anon;

grant execute on function public.search_cms_articles_v1(uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_article_v1(uuid,text,uuid) to authenticated;
grant execute on function public.update_article_v1(uuid,integer,text,uuid,text) to authenticated;
grant execute on function public.upsert_article_translation_v1(uuid,text,text,text,jsonb,text) to authenticated;
grant execute on function public.transition_article_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_article_status_v1(uuid,public.publication_status,timestamptz,text) to authenticated;

commit;
