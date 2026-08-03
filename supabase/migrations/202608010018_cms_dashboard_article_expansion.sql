begin;

create or replace function public.cms_dashboard_summary_v1(p_site_id uuid)
returns table (
  module_key text, total_count bigint, draft_count bigint, review_count bigint,
  approved_count bigint, scheduled_count bigint, published_count bigint,
  archived_count bigint, incomplete_count bigint
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

  return query
  with module_rows as (
    select 'pages'::text as module_key, page.status,
      exists (select 1 from public.site_locales locale
        where locale.site_id = page.site_id and locale.enabled
          and not exists (select 1 from public.page_translations translation
            where translation.page_id = page.id and translation.site_id = page.site_id
              and translation.locale = locale.locale)) as incomplete
    from public.pages page where page.site_id = p_site_id and page.deleted_at is null
    union all
    select 'events', event.status,
      cardinality(app_private.event_completeness_warnings(event.id)) > 0
    from public.events event where event.site_id = p_site_id and event.deleted_at is null
    union all
    select 'media', asset.status, asset.status <> 'archived' and (
      (asset.kind = 'image' and nullif(btrim(asset.alt_text), '') is null)
      or nullif(btrim(asset.rights_holder), '') is null
      or nullif(btrim(asset.rights_source), '') is null
      or (asset.rights_expires_at is not null and asset.rights_expires_at <= now()))
    from public.media_assets asset where asset.site_id = p_site_id and asset.deleted_at is null
    union all
    select 'exhibitor_packages', package.status,
      cardinality(app_private.exhibitor_package_warnings_v1(package.id)) > 0
    from public.exhibitor_packages package where package.site_id = p_site_id and package.deleted_at is null
    union all
    select 'content_partners', partner.status,
      cardinality(app_private.content_partner_warnings_v1(partner.id)) > 0
    from public.content_partners partner where partner.site_id = p_site_id and partner.deleted_at is null
    union all
    select 'case_studies', story.status,
      cardinality(app_private.case_study_warnings_v1(story.id)) > 0
    from public.case_studies story where story.site_id = p_site_id and story.deleted_at is null
    union all
    select 'metrics', metric.status,
      cardinality(app_private.metric_warnings_v1(metric.id)) > 0
    from public.metrics metric where metric.site_id = p_site_id and metric.deleted_at is null
    union all
    select 'resources', resource.status,
      cardinality(app_private.resource_warnings_v1(resource.id)) > 0
    from public.resources resource where resource.site_id = p_site_id and resource.deleted_at is null
    union all
    select 'testimonials', testimonial.status,
      cardinality(app_private.testimonial_warnings_v1(testimonial.id)) > 0
    from public.testimonials testimonial where testimonial.site_id = p_site_id and testimonial.deleted_at is null
    union all
    select 'articles', article.status,
      cardinality(app_private.article_warnings_v1(article.id)) > 0
    from public.articles article where article.site_id = p_site_id and article.deleted_at is null
  ), modules(module_key) as (
    values ('pages'::text), ('events'::text), ('media'::text),
      ('exhibitor_packages'::text), ('content_partners'::text),
      ('case_studies'::text), ('metrics'::text), ('resources'::text),
      ('testimonials'::text), ('articles'::text)
  )
  select module.module_key, count(row.module_key)::bigint,
    count(row.module_key) filter (where row.status = 'draft')::bigint,
    count(row.module_key) filter (where row.status = 'in_review')::bigint,
    count(row.module_key) filter (where row.status = 'approved')::bigint,
    count(row.module_key) filter (where row.status = 'scheduled')::bigint,
    count(row.module_key) filter (where row.status = 'published')::bigint,
    count(row.module_key) filter (where row.status = 'archived')::bigint,
    count(row.module_key) filter (where row.incomplete)::bigint
  from modules module left join module_rows row on row.module_key = module.module_key
  group by module.module_key order by module.module_key;
end;
$$;

revoke all on function public.cms_dashboard_summary_v1(uuid) from public, anon;
grant execute on function public.cms_dashboard_summary_v1(uuid) to authenticated;

commit;
