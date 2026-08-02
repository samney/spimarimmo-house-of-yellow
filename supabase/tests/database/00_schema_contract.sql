begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;

select plan(15);

select has_table('public', 'sites', 'tenant sites table exists');
select has_table('public', 'pages', 'CMS pages table exists');
select has_table('public', 'events', 'event lifecycle table exists');
select has_table('public', 'contacts', 'CRM contacts table exists');
select has_table('public', 'leads', 'CRM leads table exists');
select has_table('public', 'appointments', 'native appointments table exists');
select has_table('public', 'audit_events', 'cross-domain audit table exists');

select is((select count(*) from public.roles), 6::bigint, 'all six required roles are seeded');
select is((select count(*) from public.permissions), 14::bigint, 'normalized permission catalog is seeded');

select ok(
  (
    select count(*) = cardinality(array[
      'roles', 'permissions', 'role_permissions', 'sites', 'site_domains', 'site_locales',
      'profiles', 'profile_roles', 'profile_permissions', 'audit_events', 'pages',
      'page_translations', 'page_sections', 'page_section_translations', 'content_revisions',
      'media_assets', 'media_variants', 'media_usages', 'industries', 'industry_translations',
      'project_categories', 'project_category_translations', 'project_tags', 'projects',
      'project_translations', 'project_category_links', 'project_tag_links', 'project_metrics',
      'project_credits', 'project_relations', 'navigation_items', 'navigation_item_translations',
      'global_settings', 'seo_entries', 'venues', 'venue_translations', 'events',
      'event_translations', 'event_status_history', 'exhibitor_packages',
      'exhibitor_package_translations', 'content_partners', 'content_partner_translations',
      'case_studies', 'case_study_translations', 'testimonials', 'testimonial_translations',
      'metrics', 'resources', 'resource_translations', 'resource_versions', 'articles',
      'article_translations', 'faqs', 'faq_translations', 'organizations', 'contacts', 'leads',
      'lead_event_interests', 'lead_assignments', 'lead_stage_history', 'form_submissions',
      'consents', 'campaign_attribution', 'activities', 'notes', 'tasks', 'appointment_slots',
      'appointments', 'resource_deliveries', 'integration_jobs'
    ]) and bool_and(c.relrowsecurity)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = any(array[
        'roles', 'permissions', 'role_permissions', 'sites', 'site_domains', 'site_locales',
        'profiles', 'profile_roles', 'profile_permissions', 'audit_events', 'pages',
        'page_translations', 'page_sections', 'page_section_translations', 'content_revisions',
        'media_assets', 'media_variants', 'media_usages', 'industries', 'industry_translations',
        'project_categories', 'project_category_translations', 'project_tags', 'projects',
        'project_translations', 'project_category_links', 'project_tag_links', 'project_metrics',
        'project_credits', 'project_relations', 'navigation_items', 'navigation_item_translations',
        'global_settings', 'seo_entries', 'venues', 'venue_translations', 'events',
        'event_translations', 'event_status_history', 'exhibitor_packages',
        'exhibitor_package_translations', 'content_partners', 'content_partner_translations',
        'case_studies', 'case_study_translations', 'testimonials', 'testimonial_translations',
        'metrics', 'resources', 'resource_translations', 'resource_versions', 'articles',
        'article_translations', 'faqs', 'faq_translations', 'organizations', 'contacts', 'leads',
        'lead_event_interests', 'lead_assignments', 'lead_stage_history', 'form_submissions',
        'consents', 'campaign_attribution', 'activities', 'notes', 'tasks', 'appointment_slots',
        'appointments', 'resource_deliveries', 'integration_jobs'
      ])
  ),
  'every exposed CMS/CRM/identity table has RLS enabled'
);

select ok(
  to_regprocedure(
    'app_private.acquire_lead_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,jsonb,text,text,text,text)'
  ) is not null,
  'atomic acquisition transaction exists'
);
select ok(
  to_regprocedure('app_private.book_appointment_v1(text,uuid,uuid,uuid,text,text)') is not null,
  'native appointment transaction exists'
);
select ok(
  not has_function_privilege(
    'anon',
    'app_private.acquire_lead_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,jsonb,text,text,text,text)',
    'execute'
  ),
  'anonymous callers cannot execute acquisition transaction directly'
);
select ok(
  not has_function_privilege(
    'authenticated',
    'app_private.acquire_lead_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,jsonb,text,text,text,text)',
    'execute'
  ),
  'authenticated browser callers cannot execute acquisition transaction directly'
);
select ok(
  (
    select bool_and(
      position('search_path=pg_catalog, public' in array_to_string(p.proconfig, ',')) > 0
      and position('extensions' in array_to_string(p.proconfig, ',')) = 0
    )
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where p.prosecdef
      and n.nspname in ('app_private', 'public')
  ),
  'all security-definer functions pin a trusted search path'
);

select * from finish();
rollback;
