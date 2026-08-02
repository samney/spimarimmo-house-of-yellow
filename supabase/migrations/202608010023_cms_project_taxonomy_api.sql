begin;

alter table public.industries
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.industry_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.project_categories
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists deleted_at timestamptz,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);
alter table public.project_category_translations
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

alter table public.project_tags
  add column if not exists status public.publication_status not null default 'draft',
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists deleted_at timestamptz,
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

drop policy if exists project_tags_public_read on public.project_tags;
create policy project_tags_public_read on public.project_tags for select to anon, authenticated
  using (
    status = 'published' and deleted_at is null and exists (
      select 1 from public.project_tag_links link
      join public.projects project on project.id = link.project_id and project.site_id = link.site_id
      where link.tag_id = project_tags.id and link.site_id = project_tags.site_id
        and project.status = 'published' and project.deleted_at is null
        and exists (select 1 from public.sites site
          where site.id = project_tags.site_id and site.status = 'active' and site.deleted_at is null)
    )
  );

drop trigger if exists b_govern_publication on public.project_tags;
create trigger b_govern_publication before insert or update on public.project_tags
  for each row execute function app_private.govern_publication_status();
drop trigger if exists a_capture_revision on public.project_tags;
create trigger a_capture_revision before update or delete on public.project_tags
  for each row execute function app_private.capture_content_revision();
drop trigger if exists z_set_updated_at on public.project_tags;
create trigger z_set_updated_at before update on public.project_tags
  for each row execute function app_private.set_updated_at();

create or replace function app_private.industry_warnings_v1(p_industry_id uuid)
returns text[]
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
declare target public.industries%rowtype;
declare locale_row record;
declare translation_row public.industry_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.industries where id = p_industry_id and deleted_at is null;
  if not found then return array['industry_not_found']::text[]; end if;
  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.industry_translations
    where industry_id = target.id and locale = locale_row.locale;
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

create or replace function app_private.project_category_warnings_v1(p_category_id uuid)
returns text[]
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
declare target public.project_categories%rowtype;
declare locale_row record;
declare translation_row public.project_category_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.project_categories where id = p_category_id and deleted_at is null;
  if not found then return array['project_category_not_found']::text[]; end if;
  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.project_category_translations
    where category_id = target.id and locale = locale_row.locale;
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

create or replace function app_private.project_tag_warnings_v1(p_tag_id uuid)
returns text[]
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
declare target public.project_tags%rowtype;
begin
  select * into target from public.project_tags where id = p_tag_id and deleted_at is null;
  if not found then return array['project_tag_not_found']::text[]; end if;
  if nullif(btrim(target.label), '') is null then return array['missing_label']::text[]; end if;
  return array[]::text[];
end;
$$;

create or replace function public.search_cms_project_taxonomies_v1(
  p_site_id uuid, p_status public.publication_status default null,
  p_query text default null, p_limit integer default 50
)
returns jsonb
language plpgsql stable security definer set search_path = pg_catalog, public
as $$
begin
  if not (select app_private.has_permission(p_site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_limit is null or p_limit not between 1 and 100 then
    raise exception using errcode = '22023', message = 'limit must be between 1 and 100';
  end if;
  if p_query is not null and length(btrim(p_query)) > 200 then
    raise exception using errcode = '22023', message = 'query cannot exceed 200 characters';
  end if;

  return jsonb_build_object(
    'industries', coalesce((select jsonb_agg(row.item order by row.updated_at desc, row.id)
      from (select industry.id, industry.updated_at, jsonb_build_object(
        'industryId', industry.id, 'slug', industry.slug, 'status', industry.status,
        'lockVersion', industry.lock_version,
        'warningCodes', app_private.industry_warnings_v1(industry.id),
        'translations', coalesce((select jsonb_agg(jsonb_build_object(
          'locale', translation.locale, 'name', translation.name,
          'description', translation.description, 'status', translation.status,
          'lockVersion', translation.lock_version
        ) order by translation.locale) from public.industry_translations translation
          where translation.industry_id = industry.id), '[]'::jsonb)
      ) as item from public.industries industry
      where industry.site_id = p_site_id and industry.deleted_at is null
        and (p_status is null or industry.status = p_status)
        and (nullif(btrim(p_query), '') is null or industry.slug ilike '%' || btrim(p_query) || '%'
          or exists (select 1 from public.industry_translations translation
            where translation.industry_id = industry.id and translation.name ilike '%' || btrim(p_query) || '%'))
      order by industry.updated_at desc, industry.id limit p_limit) row), '[]'::jsonb),
    'categories', coalesce((select jsonb_agg(row.item order by row.position, row.id)
      from (select category.id, category.position, jsonb_build_object(
        'categoryId', category.id, 'slug', category.slug, 'position', category.position,
        'status', category.status, 'lockVersion', category.lock_version,
        'warningCodes', app_private.project_category_warnings_v1(category.id),
        'translations', coalesce((select jsonb_agg(jsonb_build_object(
          'locale', translation.locale, 'name', translation.name,
          'status', translation.status, 'lockVersion', translation.lock_version
        ) order by translation.locale) from public.project_category_translations translation
          where translation.category_id = category.id), '[]'::jsonb)
      ) as item from public.project_categories category
      where category.site_id = p_site_id and category.deleted_at is null
        and (p_status is null or category.status = p_status)
        and (nullif(btrim(p_query), '') is null or category.slug ilike '%' || btrim(p_query) || '%'
          or exists (select 1 from public.project_category_translations translation
            where translation.category_id = category.id and translation.name ilike '%' || btrim(p_query) || '%'))
      order by category.position, category.id limit p_limit) row), '[]'::jsonb),
    'tags', coalesce((select jsonb_agg(row.item order by row.label, row.id)
      from (select tag.id, tag.label, jsonb_build_object(
        'tagId', tag.id, 'slug', tag.slug, 'label', tag.label,
        'status', tag.status, 'lockVersion', tag.lock_version,
        'warningCodes', app_private.project_tag_warnings_v1(tag.id)
      ) as item from public.project_tags tag
      where tag.site_id = p_site_id and tag.deleted_at is null
        and (p_status is null or tag.status = p_status)
        and (nullif(btrim(p_query), '') is null or tag.slug ilike '%' || btrim(p_query) || '%'
          or tag.label ilike '%' || btrim(p_query) || '%')
      order by tag.label, tag.id limit p_limit) row), '[]'::jsonb)
  );
end;
$$;

create or replace function public.create_industry_v1(p_site_id uuid, p_slug text)
returns table (industry_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.industries%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200
     or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'valid industry slug is required';
  end if;
  insert into public.industries (site_id, slug, created_by, updated_by)
  values (p_site_id, btrim(p_slug), (select auth.uid()), (select auth.uid()))
  returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_industry_v1(
  p_industry_id uuid, p_expected_lock_version integer, p_slug text, p_reason text
)
returns table (industry_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.industries%rowtype;
begin
  select * into target from public.industries where id = p_industry_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'industry not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'industry must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'industry was modified by another editor';
  end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200
     or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception using errcode = '22023', message = 'valid industry slug is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.industries set slug = btrim(p_slug), lock_version = target.lock_version + 1,
    updated_by = (select auth.uid()) where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_industry_translation_v1(
  p_industry_id uuid, p_locale text, p_name text, p_description text, p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.industries%rowtype;
declare target public.industry_translations%rowtype;
begin
  select * into parent from public.industries where id = p_industry_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'industry not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then raise exception using errcode = '23514', message = 'industry must be editable before translation changes'; end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = parent.site_id and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled industry locale is required';
  end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 300
     or p_description is null or length(p_description) > 5000 then
    raise exception using errcode = '22023', message = 'valid bounded industry translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.industry_translations
  where industry_id = parent.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then raise exception using errcode = '23514', message = 'industry translation must return to draft before editing'; end if;
    update public.industry_translations set name = btrim(p_name), description = btrim(p_description),
      updated_by = (select auth.uid()), lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.industry_translations (
      site_id, industry_id, locale, name, description, created_by, updated_by
    ) values (
      parent.site_id, parent.id, p_locale, btrim(p_name), btrim(p_description),
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_industry_translation_status_v1(
  p_industry_id uuid, p_locale text, p_new_status public.translation_status, p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.industry_translations%rowtype;
begin
  select * into target from public.industry_translations where industry_id = p_industry_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'industry translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then raise exception using errcode = '42501', message = 'translations.write permission required'; end if;
  if p_new_status = target.status then raise exception using errcode = '23514', message = 'industry translation status must change'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.industry_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_industry_status_v1(
  p_industry_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (industry_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.industries%rowtype;
begin
  select * into target from public.industries where id = p_industry_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'industry not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'industry scheduling is not implemented'; end if;
  if p_new_status = target.status then raise exception using errcode = '23514', message = 'industry status must change'; end if;
  if p_new_status in ('approved','published','archived') and not (select app_private.has_permission(target.site_id, 'content.publish')) then
    raise exception using errcode = '42501', message = 'content.publish permission required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters'; end if;
  if p_new_status in ('approved','published') and cardinality(app_private.industry_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'industry is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.industries set status = p_new_status, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.create_project_category_v1(
  p_site_id uuid, p_slug text, p_position integer
)
returns table (category_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_categories%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then raise exception using errcode = 'P0002', message = 'site not found'; end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200 or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode = '22023', message = 'valid project category slug is required'; end if;
  if p_position is null or p_position not between 0 and 1000000 then raise exception using errcode = '22023', message = 'valid project category position is required'; end if;
  insert into public.project_categories (site_id, slug, position, created_by, updated_by)
  values (p_site_id, btrim(p_slug), p_position, (select auth.uid()), (select auth.uid())) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_project_category_v1(
  p_category_id uuid, p_expected_lock_version integer, p_slug text,
  p_position integer, p_reason text
)
returns table (category_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_categories%rowtype;
begin
  select * into target from public.project_categories where id = p_category_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project category not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'project category must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then raise exception using errcode = '40001', message = 'project category was modified by another editor'; end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200 or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode = '22023', message = 'valid project category slug is required'; end if;
  if p_position is null or p_position not between 0 and 1000000 then raise exception using errcode = '22023', message = 'valid project category position is required'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_categories set slug = btrim(p_slug), position = p_position,
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_project_category_translation_v1(
  p_category_id uuid, p_locale text, p_name text, p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.project_categories%rowtype;
declare target public.project_category_translations%rowtype;
begin
  select * into parent from public.project_categories where id = p_category_id and deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'project category not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then raise exception using errcode = '42501', message = 'translations.write permission required'; end if;
  if parent.status not in ('draft','in_review') then raise exception using errcode = '23514', message = 'project category must be editable before translation changes'; end if;
  if not exists (select 1 from public.site_locales locale where locale.site_id = parent.site_id and locale.locale = p_locale and locale.enabled) then raise exception using errcode = '22023', message = 'enabled project category locale is required'; end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 300 then raise exception using errcode = '22023', message = 'valid project category name is required'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.project_category_translations where category_id = parent.id and locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then raise exception using errcode = '23514', message = 'project category translation must return to draft before editing'; end if;
    update public.project_category_translations set name = btrim(p_name), updated_by = (select auth.uid()),
      lock_version = target.lock_version + 1 where id = target.id returning * into target;
  else
    insert into public.project_category_translations (site_id, category_id, locale, name, created_by, updated_by)
    values (parent.site_id, parent.id, p_locale, btrim(p_name), (select auth.uid()), (select auth.uid())) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_project_category_translation_status_v1(
  p_category_id uuid, p_locale text, p_new_status public.translation_status, p_reason text
)
returns table (translation_id uuid, status public.translation_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_category_translations%rowtype;
begin
  select * into target from public.project_category_translations where category_id = p_category_id and locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'project category translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then raise exception using errcode = '42501', message = 'translations.write permission required'; end if;
  if p_new_status = target.status then raise exception using errcode = '23514', message = 'project category translation status must change'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_category_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_project_category_status_v1(
  p_category_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (category_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_categories%rowtype;
begin
  select * into target from public.project_categories where id = p_category_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project category not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'project category scheduling is not implemented'; end if;
  if p_new_status = target.status then raise exception using errcode = '23514', message = 'project category status must change'; end if;
  if p_new_status in ('approved','published','archived') and not (select app_private.has_permission(target.site_id, 'content.publish')) then raise exception using errcode = '42501', message = 'content.publish permission required'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters'; end if;
  if p_new_status in ('approved','published') and cardinality(app_private.project_category_warnings_v1(target.id)) > 0 then raise exception using errcode = '23514', message = 'project category is incomplete'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_categories set status = p_new_status, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.create_project_tag_v1(p_site_id uuid, p_slug text, p_label text)
returns table (tag_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_tags%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if not exists (select 1 from public.sites site where site.id = p_site_id and site.deleted_at is null) then raise exception using errcode = 'P0002', message = 'site not found'; end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200 or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode = '22023', message = 'valid project tag slug is required'; end if;
  if p_label is null or length(btrim(p_label)) not between 1 and 300 then raise exception using errcode = '22023', message = 'valid project tag label is required'; end if;
  insert into public.project_tags (site_id, slug, label, created_by, updated_by)
  values (p_site_id, btrim(p_slug), btrim(p_label), (select auth.uid()), (select auth.uid())) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_project_tag_v1(
  p_tag_id uuid, p_expected_lock_version integer, p_slug text, p_label text, p_reason text
)
returns table (tag_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_tags%rowtype;
begin
  select * into target from public.project_tags where id = p_tag_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project tag not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if target.status <> 'draft' then raise exception using errcode = '23514', message = 'project tag must be draft before editing'; end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then raise exception using errcode = '40001', message = 'project tag was modified by another editor'; end if;
  if p_slug is null or length(btrim(p_slug)) not between 1 and 200 or btrim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception using errcode = '22023', message = 'valid project tag slug is required'; end if;
  if p_label is null or length(btrim(p_label)) not between 1 and 300 then raise exception using errcode = '22023', message = 'valid project tag label is required'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_tags set slug = btrim(p_slug), label = btrim(p_label),
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_project_tag_status_v1(
  p_tag_id uuid, p_new_status public.publication_status, p_reason text
)
returns table (tag_id uuid, status public.publication_status, lock_version integer, updated_at timestamptz)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_tags%rowtype;
begin
  select * into target from public.project_tags where id = p_tag_id and deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project tag not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then raise exception using errcode = '42501', message = 'content.write permission required'; end if;
  if p_new_status = 'scheduled' then raise exception using errcode = '23514', message = 'project tag scheduling is not implemented'; end if;
  if p_new_status = target.status then raise exception using errcode = '23514', message = 'project tag status must change'; end if;
  if p_new_status in ('approved','published','archived') and not (select app_private.has_permission(target.site_id, 'content.publish')) then raise exception using errcode = '42501', message = 'content.publish permission required'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters'; end if;
  if p_new_status in ('approved','published') and cardinality(app_private.project_tag_warnings_v1(target.id)) > 0 then raise exception using errcode = '23514', message = 'project tag is incomplete'; end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_tags set status = p_new_status, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.industries from authenticated;
revoke insert, update, delete on table public.industry_translations from authenticated;
revoke insert, update, delete on table public.project_categories from authenticated;
revoke insert, update, delete on table public.project_category_translations from authenticated;
revoke insert, update, delete on table public.project_tags from authenticated;

revoke all on function public.search_cms_project_taxonomies_v1(uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.create_industry_v1(uuid,text) from public, anon;
revoke all on function public.update_industry_v1(uuid,integer,text,text) from public, anon;
revoke all on function public.upsert_industry_translation_v1(uuid,text,text,text,text) from public, anon;
revoke all on function public.transition_industry_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_industry_status_v1(uuid,public.publication_status,text) from public, anon;
revoke all on function public.create_project_category_v1(uuid,text,integer) from public, anon;
revoke all on function public.update_project_category_v1(uuid,integer,text,integer,text) from public, anon;
revoke all on function public.upsert_project_category_translation_v1(uuid,text,text,text) from public, anon;
revoke all on function public.transition_project_category_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.transition_project_category_status_v1(uuid,public.publication_status,text) from public, anon;
revoke all on function public.create_project_tag_v1(uuid,text,text) from public, anon;
revoke all on function public.update_project_tag_v1(uuid,integer,text,text,text) from public, anon;
revoke all on function public.transition_project_tag_status_v1(uuid,public.publication_status,text) from public, anon;

grant execute on function public.search_cms_project_taxonomies_v1(uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.create_industry_v1(uuid,text) to authenticated;
grant execute on function public.update_industry_v1(uuid,integer,text,text) to authenticated;
grant execute on function public.upsert_industry_translation_v1(uuid,text,text,text,text) to authenticated;
grant execute on function public.transition_industry_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_industry_status_v1(uuid,public.publication_status,text) to authenticated;
grant execute on function public.create_project_category_v1(uuid,text,integer) to authenticated;
grant execute on function public.update_project_category_v1(uuid,integer,text,integer,text) to authenticated;
grant execute on function public.upsert_project_category_translation_v1(uuid,text,text,text) to authenticated;
grant execute on function public.transition_project_category_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.transition_project_category_status_v1(uuid,public.publication_status,text) to authenticated;
grant execute on function public.create_project_tag_v1(uuid,text,text) to authenticated;
grant execute on function public.update_project_tag_v1(uuid,integer,text,text,text) to authenticated;
grant execute on function public.transition_project_tag_status_v1(uuid,public.publication_status,text) to authenticated;

commit;
