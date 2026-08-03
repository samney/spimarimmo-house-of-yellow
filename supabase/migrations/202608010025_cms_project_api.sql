begin;

alter table public.project_translations
  add column if not exists lock_version integer not null default 1 check (lock_version > 0);

create or replace function app_private.project_warnings_v1(p_project_id uuid)
returns text[]
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
declare locale_row record;
declare translation_row public.project_translations%rowtype;
declare warnings text[] := array[]::text[];
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null;
  if not found then return array['project_not_found']; end if;

  if target.industry_id is null then
    warnings := array_append(warnings, 'missing_industry');
  elsif not exists (
    select 1 from public.industries industry
    where industry.id = target.industry_id and industry.site_id = target.site_id
      and industry.status = 'published' and industry.deleted_at is null
  ) then
    warnings := array_append(warnings, 'industry_not_ready');
  end if;

  if target.primary_media_id is null then
    warnings := array_append(warnings, 'missing_primary_media');
  elsif not exists (
    select 1 from public.media_assets asset
    where asset.id = target.primary_media_id and asset.site_id = target.site_id
      and asset.kind in ('image','video','external_video')
      and asset.status = 'published' and asset.deleted_at is null
  ) then
    warnings := array_append(warnings, 'primary_media_not_ready');
  end if;

  if not exists (
    select 1 from public.project_category_links link
    where link.project_id = target.id and link.site_id = target.site_id
  ) then
    warnings := array_append(warnings, 'missing_project_category');
  elsif exists (
    select 1 from public.project_category_links link
    left join public.project_categories category
      on category.id = link.category_id and category.site_id = link.site_id
    where link.project_id = target.id and link.site_id = target.site_id
      and (category.id is null or category.status <> 'published' or category.deleted_at is not null)
  ) then
    warnings := array_append(warnings, 'project_category_not_ready');
  end if;

  if exists (
    select 1 from public.project_tag_links link
    left join public.project_tags tag
      on tag.id = link.tag_id and tag.site_id = link.site_id
    where link.project_id = target.id and link.site_id = target.site_id
      and (tag.id is null or tag.status <> 'published' or tag.deleted_at is not null)
  ) then
    warnings := array_append(warnings, 'project_tag_not_ready');
  end if;

  if exists (
    select 1 from public.project_metrics metric
    where metric.project_id = target.id and metric.site_id = target.site_id
      and metric.evidence_status <> 'verified'
  ) then
    warnings := array_append(warnings, 'project_metric_not_verified');
  end if;

  for locale_row in select locale from public.site_locales
    where site_id = target.site_id and enabled order by locale
  loop
    select * into translation_row from public.project_translations translation
    where translation.project_id = target.id and translation.site_id = target.site_id
      and translation.locale = locale_row.locale;
    if not found then
      warnings := array_append(warnings, 'missing_translation:' || locale_row.locale);
    elsif translation_row.status not in ('approved','published') then
      warnings := array_append(warnings, 'translation_not_ready:' || locale_row.locale);
    elsif nullif(btrim(translation_row.title), '') is null then
      warnings := array_append(warnings, 'missing_title:' || locale_row.locale);
    elsif nullif(btrim(translation_row.summary), '') is null then
      warnings := array_append(warnings, 'missing_summary:' || locale_row.locale);
    elsif nullif(btrim(translation_row.client_text), '') is null
      and nullif(btrim(translation_row.process_text), '') is null
      and nullif(btrim(translation_row.project_text), '') is null then
      warnings := array_append(warnings, 'missing_story_copy:' || locale_row.locale);
    end if;
  end loop;
  return warnings;
end;
$$;

create or replace function public.search_cms_projects_v1(
  p_site_id uuid,
  p_status public.publication_status default null,
  p_query text default null,
  p_limit integer default 50
)
returns table (
  project_id uuid, site_id uuid, slug text, project_key text, industry_id uuid,
  year_label text, delivery_label text, primary_media_id uuid,
  publication_status public.publication_status, publish_at timestamptz,
  published_at timestamptz, lock_version integer, warning_codes text[],
  category_count bigint, tag_count bigint, translations jsonb, updated_at timestamptz
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

  return query select project.id, project.site_id, project.slug, project.project_key,
    project.industry_id, project.year_label, project.delivery_label,
    project.primary_media_id, project.status, project.publish_at,
    project.published_at, project.lock_version,
    app_private.project_warnings_v1(project.id),
    (select count(*) from public.project_category_links link
      where link.project_id = project.id and link.site_id = project.site_id),
    (select count(*) from public.project_tag_links link
      where link.project_id = project.id and link.site_id = project.site_id),
    coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'title', translation.title,
      'summary', translation.summary, 'status', translation.status,
      'lockVersion', translation.lock_version
    ) order by translation.locale) from public.project_translations translation
      where translation.project_id = project.id and translation.site_id = project.site_id), '[]'::jsonb),
    project.updated_at
  from public.projects project
  where project.site_id = p_site_id and project.deleted_at is null
    and (p_status is null or project.status = p_status)
    and (nullif(btrim(p_query), '') is null
      or project.slug ilike '%' || btrim(p_query) || '%'
      or project.project_key ilike '%' || btrim(p_query) || '%'
      or exists (select 1 from public.project_translations translation
        where translation.project_id = project.id and translation.site_id = project.site_id
          and (translation.title ilike '%' || btrim(p_query) || '%'
            or translation.summary ilike '%' || btrim(p_query) || '%')))
  order by project.updated_at desc, project.id limit p_limit;
end;
$$;

create or replace function public.cms_project_workspace_v1(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.read')) then
    raise exception using errcode = '42501', message = 'content.read permission required';
  end if;

  return jsonb_build_object(
    'project', jsonb_build_object(
      'projectId', target.id, 'siteId', target.site_id, 'slug', target.slug,
      'projectKey', target.project_key, 'industryId', target.industry_id,
      'yearLabel', target.year_label, 'deliveryLabel', target.delivery_label,
      'primaryMediaId', target.primary_media_id, 'status', target.status,
      'publishAt', target.publish_at, 'publishedAt', target.published_at,
      'lockVersion', target.lock_version,
      'warningCodes', app_private.project_warnings_v1(target.id),
      'updatedAt', target.updated_at
    ),
    'translations', coalesce((select jsonb_agg(jsonb_build_object(
      'locale', translation.locale, 'title', translation.title,
      'summary', translation.summary, 'clientText', translation.client_text,
      'processText', translation.process_text, 'projectText', translation.project_text,
      'status', translation.status, 'lockVersion', translation.lock_version,
      'updatedAt', translation.updated_at
    ) order by translation.locale) from public.project_translations translation
      where translation.project_id = target.id and translation.site_id = target.site_id), '[]'::jsonb),
    'categories', coalesce((select jsonb_agg(jsonb_build_object(
      'categoryId', category.id, 'slug', category.slug, 'position', link.position,
      'status', category.status,
      'translations', coalesce((select jsonb_agg(jsonb_build_object(
        'locale', translation.locale, 'name', translation.name, 'status', translation.status
      ) order by translation.locale) from public.project_category_translations translation
        where translation.category_id = category.id), '[]'::jsonb)
    ) order by link.position, category.id) from public.project_category_links link
      join public.project_categories category on category.id = link.category_id and category.site_id = link.site_id
      where link.project_id = target.id and link.site_id = target.site_id), '[]'::jsonb),
    'tags', coalesce((select jsonb_agg(jsonb_build_object(
      'tagId', tag.id, 'slug', tag.slug, 'label', tag.label, 'status', tag.status
    ) order by tag.label, tag.id) from public.project_tag_links link
      join public.project_tags tag on tag.id = link.tag_id and tag.site_id = link.site_id
      where link.project_id = target.id and link.site_id = target.site_id), '[]'::jsonb),
    'metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metricId', metric.id, 'metricKey', metric.metric_key,
      'displayValue', metric.display_value, 'definition', metric.definition,
      'evidenceStatus', metric.evidence_status, 'position', metric.position
    ) order by metric.position, metric.id) from public.project_metrics metric
      where metric.project_id = target.id and metric.site_id = target.site_id), '[]'::jsonb),
    'credits', coalesce((select jsonb_agg(jsonb_build_object(
      'creditId', credit.id, 'role', credit.credit_role,
      'name', credit.credit_name, 'position', credit.position
    ) order by credit.position, credit.id) from public.project_credits credit
      where credit.project_id = target.id and credit.site_id = target.site_id), '[]'::jsonb),
    'relations', coalesce((select jsonb_agg(jsonb_build_object(
      'relatedProjectId', relation.related_project_id,
      'kind', relation.relation_kind, 'position', relation.position
    ) order by relation.relation_kind, relation.position, relation.related_project_id)
      from public.project_relations relation
      where relation.project_id = target.id and relation.site_id = target.site_id), '[]'::jsonb)
  );
end;
$$;

create or replace function app_private.validate_project_input_v1(
  p_site_id uuid, p_slug text, p_project_key text, p_industry_id uuid,
  p_year_label text, p_delivery_label text, p_primary_media_id uuid
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
    raise exception using errcode = '22023', message = 'valid project slug is required';
  end if;
  if p_project_key is null or length(btrim(p_project_key)) not between 1 and 200
     or btrim(p_project_key) !~ '^[a-z0-9_.-]+$' then
    raise exception using errcode = '22023', message = 'valid project key is required';
  end if;
  if p_year_label is not null and length(btrim(p_year_label)) > 100 then
    raise exception using errcode = '22023', message = 'project year label cannot exceed 100 characters';
  end if;
  if p_delivery_label is not null and length(btrim(p_delivery_label)) > 200 then
    raise exception using errcode = '22023', message = 'project delivery label cannot exceed 200 characters';
  end if;
  if p_industry_id is not null and not exists (
    select 1 from public.industries industry
    where industry.id = p_industry_id and industry.site_id = p_site_id
      and industry.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'project industry must belong to the same site';
  end if;
  if p_primary_media_id is not null and not exists (
    select 1 from public.media_assets asset
    where asset.id = p_primary_media_id and asset.site_id = p_site_id
      and asset.kind in ('image','video','external_video') and asset.deleted_at is null
  ) then
    raise exception using errcode = '22023', message = 'project media must be same-site visual media';
  end if;
end;
$$;

create or replace function public.create_project_v1(
  p_site_id uuid, p_slug text, p_project_key text, p_industry_id uuid,
  p_year_label text, p_delivery_label text, p_primary_media_id uuid
)
returns table (
  project_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  if not (select app_private.has_permission(p_site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if not exists (select 1 from public.sites site
    where site.id = p_site_id and site.deleted_at is null) then
    raise exception using errcode = 'P0002', message = 'site not found';
  end if;
  perform app_private.validate_project_input_v1(
    p_site_id, p_slug, p_project_key, p_industry_id,
    p_year_label, p_delivery_label, p_primary_media_id
  );
  insert into public.projects (
    site_id, slug, project_key, industry_id, year_label,
    delivery_label, primary_media_id, created_by, updated_by
  ) values (
    p_site_id, btrim(p_slug), btrim(p_project_key), p_industry_id,
    nullif(btrim(p_year_label), ''), nullif(btrim(p_delivery_label), ''),
    p_primary_media_id, (select auth.uid()), (select auth.uid())
  ) returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.update_project_v1(
  p_project_id uuid, p_expected_lock_version integer,
  p_slug text, p_project_key text, p_industry_id uuid,
  p_year_label text, p_delivery_label text, p_primary_media_id uuid, p_reason text
)
returns table (
  project_id uuid, status public.publication_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status <> 'draft' then
    raise exception using errcode = '23514', message = 'project must be draft before editing';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project was modified by another editor';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'update reason must contain 3 to 500 characters';
  end if;
  perform app_private.validate_project_input_v1(
    target.site_id, p_slug, p_project_key, p_industry_id,
    p_year_label, p_delivery_label, p_primary_media_id
  );
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.projects set slug = btrim(p_slug), project_key = btrim(p_project_key),
    industry_id = p_industry_id, year_label = nullif(btrim(p_year_label), ''),
    delivery_label = nullif(btrim(p_delivery_label), ''),
    primary_media_id = p_primary_media_id,
    lock_version = target.lock_version + 1, updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.upsert_project_translation_v1(
  p_project_id uuid, p_locale text, p_title text, p_summary text,
  p_client_text text, p_process_text text, p_project_text text, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare parent public.projects%rowtype;
declare target public.project_translations%rowtype;
begin
  select * into parent from public.projects project
  where project.id = p_project_id and project.deleted_at is null;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(parent.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if parent.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before translation changes';
  end if;
  if not exists (select 1 from public.site_locales locale
    where locale.site_id = parent.site_id and locale.locale = p_locale and locale.enabled) then
    raise exception using errcode = '22023', message = 'enabled project locale is required';
  end if;
  if p_title is null or length(btrim(p_title)) not between 1 and 300
     or p_summary is null or length(btrim(p_summary)) not between 1 and 2000
     or p_client_text is null or length(p_client_text) > 20000
     or p_process_text is null or length(p_process_text) > 20000
     or p_project_text is null or length(p_project_text) > 20000
     or (nullif(btrim(p_client_text), '') is null
       and nullif(btrim(p_process_text), '') is null
       and nullif(btrim(p_project_text), '') is null) then
    raise exception using errcode = '22023', message = 'valid bounded project translation is required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'translation reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  select * into target from public.project_translations translation
  where translation.project_id = parent.id and translation.locale = p_locale for update;
  if found then
    if target.status not in ('missing','draft','in_review') then
      raise exception using errcode = '23514', message = 'project translation must return to draft before editing';
    end if;
    update public.project_translations set title = btrim(p_title), summary = btrim(p_summary),
      client_text = btrim(p_client_text), process_text = btrim(p_process_text),
      project_text = btrim(p_project_text), updated_by = (select auth.uid()),
      lock_version = target.lock_version + 1
    where id = target.id returning * into target;
  else
    insert into public.project_translations (
      site_id, project_id, locale, title, summary, client_text,
      process_text, project_text, created_by, updated_by
    ) values (
      parent.site_id, parent.id, p_locale, btrim(p_title), btrim(p_summary),
      btrim(p_client_text), btrim(p_process_text), btrim(p_project_text),
      (select auth.uid()), (select auth.uid())
    ) returning * into target;
  end if;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.transition_project_translation_status_v1(
  p_project_id uuid, p_locale text,
  p_new_status public.translation_status, p_reason text
)
returns table (
  translation_id uuid, status public.translation_status,
  lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.project_translations%rowtype;
begin
  select * into target from public.project_translations translation
  where translation.project_id = p_project_id and translation.locale = p_locale for update;
  if not found then raise exception using errcode = 'P0002', message = 'project translation not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'translations.write')) then
    raise exception using errcode = '42501', message = 'translations.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'project translation status must change';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.project_translations set status = p_new_status,
    updated_by = (select auth.uid()), lock_version = target.lock_version + 1
  where id = target.id returning * into target;
  return query select target.id, target.status, target.lock_version, target.updated_at;
end;
$$;

create or replace function public.replace_project_taxonomy_v1(
  p_project_id uuid, p_expected_lock_version integer,
  p_category_ids uuid[], p_tag_ids uuid[], p_reason text
)
returns table (
  project_id uuid, lock_version integer,
  category_count bigint, tag_count bigint, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if target.status not in ('draft','in_review') then
    raise exception using errcode = '23514', message = 'project must be editable before taxonomy changes';
  end if;
  if p_expected_lock_version is null or p_expected_lock_version <> target.lock_version then
    raise exception using errcode = '40001', message = 'project was modified by another editor';
  end if;
  if p_category_ids is null or cardinality(p_category_ids) not between 1 and 20
     or exists (select 1 from unnest(p_category_ids) value where value is null)
     or cardinality(p_category_ids) <> (select count(distinct value) from unnest(p_category_ids) value) then
    raise exception using errcode = '22023', message = 'one to twenty unique project categories are required';
  end if;
  if p_tag_ids is null or cardinality(p_tag_ids) > 50
     or exists (select 1 from unnest(p_tag_ids) value where value is null)
     or cardinality(p_tag_ids) <> (select count(distinct value) from unnest(p_tag_ids) value) then
    raise exception using errcode = '22023', message = 'zero to fifty unique project tags are required';
  end if;
  if exists (select 1 from unnest(p_category_ids) category_id
    where not exists (select 1 from public.project_categories category
      where category.id = category_id and category.site_id = target.site_id
        and category.status = 'published' and category.deleted_at is null)) then
    raise exception using errcode = '22023', message = 'published same-site project categories are required';
  end if;
  if exists (select 1 from unnest(p_tag_ids) tag_id
    where not exists (select 1 from public.project_tags tag
      where tag.id = tag_id and tag.site_id = target.site_id
        and tag.status = 'published' and tag.deleted_at is null)) then
    raise exception using errcode = '22023', message = 'published same-site project tags are required';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'taxonomy reason must contain 3 to 500 characters';
  end if;

  perform set_config('app.revision_reason', btrim(p_reason), true);
  delete from public.project_category_links link
    where link.project_id = target.id and link.site_id = target.site_id;
  insert into public.project_category_links (site_id, project_id, category_id, position)
  select target.site_id, target.id, item.category_id, (item.ordinality - 1)::integer
  from unnest(p_category_ids) with ordinality item(category_id, ordinality);
  delete from public.project_tag_links link
    where link.project_id = target.id and link.site_id = target.site_id;
  insert into public.project_tag_links (site_id, project_id, tag_id)
  select target.site_id, target.id, tag_id from unnest(p_tag_ids) tag_id;
  update public.projects set lock_version = target.lock_version + 1,
    updated_by = (select auth.uid()) where id = target.id returning * into target;
  return query select target.id, target.lock_version,
    cardinality(p_category_ids)::bigint, cardinality(p_tag_ids)::bigint, target.updated_at;
end;
$$;

create or replace function public.transition_project_status_v1(
  p_project_id uuid, p_new_status public.publication_status,
  p_publish_at timestamptz, p_reason text
)
returns table (
  project_id uuid, status public.publication_status, publish_at timestamptz,
  published_at timestamptz, lock_version integer, updated_at timestamptz
)
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare target public.projects%rowtype;
begin
  select * into target from public.projects project
  where project.id = p_project_id and project.deleted_at is null for update;
  if not found then raise exception using errcode = 'P0002', message = 'project not found'; end if;
  if not (select app_private.has_permission(target.site_id, 'content.write')) then
    raise exception using errcode = '42501', message = 'content.write permission required';
  end if;
  if p_new_status = target.status then
    raise exception using errcode = '23514', message = 'project status must change';
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
  if target.status = 'scheduled' and p_new_status = 'published'
     and target.publish_at is not null and target.publish_at > now() then
    raise exception using errcode = '23514', message = 'scheduled project cannot publish before its due time';
  end if;
  if p_reason is null or length(btrim(p_reason)) not between 3 and 500 then
    raise exception using errcode = '22023', message = 'transition reason must contain 3 to 500 characters';
  end if;
  if p_new_status in ('approved','scheduled','published')
     and cardinality(app_private.project_warnings_v1(target.id)) > 0 then
    raise exception using errcode = '23514', message = 'project is incomplete';
  end if;
  perform set_config('app.revision_reason', btrim(p_reason), true);
  update public.projects set status = p_new_status,
    publish_at = case when p_new_status = 'scheduled' then p_publish_at else null end,
    updated_by = (select auth.uid())
  where id = target.id returning * into target;
  return query select target.id, target.status, target.publish_at,
    target.published_at, target.lock_version, target.updated_at;
end;
$$;

revoke insert, update, delete on table public.projects from authenticated;
revoke insert, update, delete on table public.project_translations from authenticated;
revoke insert, update, delete on table public.project_category_links from authenticated;
revoke insert, update, delete on table public.project_tag_links from authenticated;
revoke insert, update, delete on table public.project_metrics from authenticated;
revoke insert, update, delete on table public.project_credits from authenticated;
revoke insert, update, delete on table public.project_relations from authenticated;

revoke all on function public.search_cms_projects_v1(uuid,public.publication_status,text,integer) from public, anon;
revoke all on function public.cms_project_workspace_v1(uuid) from public, anon;
revoke all on function public.create_project_v1(uuid,text,text,uuid,text,text,uuid) from public, anon;
revoke all on function public.update_project_v1(uuid,integer,text,text,uuid,text,text,uuid,text) from public, anon;
revoke all on function public.upsert_project_translation_v1(uuid,text,text,text,text,text,text,text) from public, anon;
revoke all on function public.transition_project_translation_status_v1(uuid,text,public.translation_status,text) from public, anon;
revoke all on function public.replace_project_taxonomy_v1(uuid,integer,uuid[],uuid[],text) from public, anon;
revoke all on function public.transition_project_status_v1(uuid,public.publication_status,timestamptz,text) from public, anon;

grant execute on function public.search_cms_projects_v1(uuid,public.publication_status,text,integer) to authenticated;
grant execute on function public.cms_project_workspace_v1(uuid) to authenticated;
grant execute on function public.create_project_v1(uuid,text,text,uuid,text,text,uuid) to authenticated;
grant execute on function public.update_project_v1(uuid,integer,text,text,uuid,text,text,uuid,text) to authenticated;
grant execute on function public.upsert_project_translation_v1(uuid,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.transition_project_translation_status_v1(uuid,text,public.translation_status,text) to authenticated;
grant execute on function public.replace_project_taxonomy_v1(uuid,integer,uuid[],uuid[],text) to authenticated;
grant execute on function public.transition_project_status_v1(uuid,public.publication_status,timestamptz,text) to authenticated;

commit;
