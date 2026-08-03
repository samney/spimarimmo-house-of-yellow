begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(47);

select ok(
  not has_function_privilege('anon', 'public.cms_dashboard_summary_v1(uuid)', 'execute'),
  'anonymous callers cannot execute the CMS dashboard aggregate'
);
select ok(
  has_function_privilege('authenticated', 'public.cms_dashboard_summary_v1(uuid)', 'execute'),
  'authenticated staff may enter the permission-checked dashboard transaction'
);
select volatility_is(
  'public',
  'cms_dashboard_summary_v1',
  array['uuid'],
  'stable',
  'CMS dashboard aggregate is declared stable'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001801', 'authenticated', 'authenticated', 'dashboard-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001802', 'authenticated', 'authenticated', 'dashboard-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001803', 'authenticated', 'authenticated', 'dashboard-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001804', 'authenticated', 'authenticated', 'dashboard-admin@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001801', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001802', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000001803', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000001804', null, 'super_admin');

insert into public.sites (id, slug, name, status, default_locale, timezone) values
  ('00000000-0000-4000-8000-000000001890', 'dashboard-other-site', 'Dashboard Other Site', 'active', 'en', 'UTC');

insert into public.pages (id, site_id, route_key, page_type, slug) values
  ('00000000-0000-4000-8000-000000001811', '00000000-0000-4000-8000-000000000100', 'dashboard.incomplete', 'test', 'dashboard-incomplete'),
  ('00000000-0000-4000-8000-000000001812', '00000000-0000-4000-8000-000000000100', 'dashboard.complete', 'test', 'dashboard-complete');
insert into public.page_translations (site_id, page_id, locale, title) values
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001812', 'en', 'Complete dashboard page'),
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001812', 'fr', 'Page tableau complÃ¨te');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000001821',
  '00000000-0000-4000-8000-000000000100',
  'dashboard.incomplete-event',
  'dashboard-incomplete-event',
  'UTC'
);

insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type,
  alt_text, rights_holder, rights_source
) values
  ('00000000-0000-4000-8000-000000001831', '00000000-0000-4000-8000-000000000100', 'image', 'supabase', 'dashboard/incomplete.webp', 'image/webp', '', null, null),
  ('00000000-0000-4000-8000-000000001832', '00000000-0000-4000-8000-000000000100', 'image', 'supabase', 'dashboard/complete.webp', 'image/webp', 'Documented venue', 'SPIMAR', 'commissioned');

insert into public.exhibitor_packages (
  id, site_id, package_key, tier
) values (
  '00000000-0000-4000-8000-000000001841',
  '00000000-0000-4000-8000-000000000100', 'dashboard.package', 'standard'
);
insert into public.content_partners (
  id, site_id, partner_key, kind
) values (
  '00000000-0000-4000-8000-000000001842',
  '00000000-0000-4000-8000-000000000100', 'dashboard.partner', 'partner'
);
insert into public.case_studies (
  id, site_id, slug
) values (
  '00000000-0000-4000-8000-000000001843',
  '00000000-0000-4000-8000-000000000100', 'dashboard-case-study'
);
insert into public.metrics (
  id, site_id, metric_key, display_value, definition, source_label
) values (
  '00000000-0000-4000-8000-000000001844',
  '00000000-0000-4000-8000-000000000100', 'dashboard.metric', '1,000',
  'Dashboard metric definition', 'Dashboard source fixture'
);
insert into public.resources (
  id, site_id, slug, resource_kind, requires_form
) values (
  '00000000-0000-4000-8000-000000001845',
  '00000000-0000-4000-8000-000000000100', 'dashboard-resource', 'guide', true
);
insert into public.testimonials (
  id, site_id, testimonial_key, person_name, organization_name
) values (
  '00000000-0000-4000-8000-000000001846',
  '00000000-0000-4000-8000-000000000100', 'dashboard.testimonial',
  'Dashboard Speaker', 'Dashboard Organization'
);
insert into public.articles (
  id, site_id, slug
) values (
  '00000000-0000-4000-8000-000000001847',
  '00000000-0000-4000-8000-000000000100', 'dashboard-article'
);
insert into public.faqs (
  id, site_id, faq_key, audience, position
) values (
  '00000000-0000-4000-8000-000000001848',
  '00000000-0000-4000-8000-000000000100', 'dashboard.faq', 'general', 0
);
insert into public.venues (
  id, site_id, venue_key, timezone
) values (
  '00000000-0000-4000-8000-000000001849',
  '00000000-0000-4000-8000-000000000100', 'dashboard.venue', 'UTC'
);
insert into public.industries (id, site_id, slug) values (
  '00000000-0000-4000-8000-000000001850',
  '00000000-0000-4000-8000-000000000100', 'dashboard-industry'
);
insert into public.project_categories (id, site_id, slug, position) values (
  '00000000-0000-4000-8000-000000001851',
  '00000000-0000-4000-8000-000000000100', 'dashboard-category', 0
);
insert into public.project_tags (id, site_id, slug, label) values (
  '00000000-0000-4000-8000-000000001852',
  '00000000-0000-4000-8000-000000000100', 'dashboard-tag', 'Dashboard tag'
);
insert into public.projects (id, site_id, slug, project_key) values (
  '00000000-0000-4000-8000-000000001853',
  '00000000-0000-4000-8000-000000000100', 'dashboard-project', 'dashboard.project'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001801","role":"authenticated"}', true);
set local role authenticated;
create temporary table dashboard_result on commit drop as
select * from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000000100');

select is((select count(*) from dashboard_result), 16::bigint, 'dashboard returns each implemented governed module');
select is((select total_count from dashboard_result where module_key = 'pages'), 2::bigint, 'page total is truthful');
select is((select draft_count from dashboard_result where module_key = 'pages'), 2::bigint, 'page publication count is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'pages'), 1::bigint, 'page completeness finds missing enabled translations');
select is((select total_count from dashboard_result where module_key = 'events'), 1::bigint, 'event total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'events'), 1::bigint, 'event completeness uses governed warning rules');
select is((select total_count from dashboard_result where module_key = 'venues'), 1::bigint, 'venue total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'venues'), 1::bigint, 'venue completeness uses governed location and translation warnings');
select is((select total_count from dashboard_result where module_key = 'media'), 2::bigint, 'media total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'media'), 1::bigint, 'media completeness finds missing accessibility and rights metadata');
select is((select total_count from dashboard_result where module_key = 'exhibitor_packages'), 1::bigint, 'package total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'exhibitor_packages'), 1::bigint, 'package completeness uses governed warnings');
select is((select total_count from dashboard_result where module_key = 'content_partners'), 1::bigint, 'partner total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'content_partners'), 1::bigint, 'partner completeness uses governed warnings');
select is((select total_count from dashboard_result where module_key = 'case_studies'), 1::bigint, 'case study total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'case_studies'), 1::bigint, 'case study completeness uses governed warnings');
select is((select total_count from dashboard_result where module_key = 'metrics'), 1::bigint, 'metric total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'metrics'), 1::bigint, 'metric completeness uses governed warnings');
select is((select total_count from dashboard_result where module_key = 'resources'), 1::bigint, 'resource total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'resources'), 1::bigint, 'resource completeness uses governed translation and version warnings');
select is((select total_count from dashboard_result where module_key = 'testimonials'), 1::bigint, 'testimonial total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'testimonials'), 1::bigint, 'testimonial completeness uses governed evidence, consent, attribution, media, and translation warnings');
select is((select total_count from dashboard_result where module_key = 'articles'), 1::bigint, 'article total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'articles'), 1::bigint, 'article completeness uses governed media and translation warnings');
select is((select total_count from dashboard_result where module_key = 'faqs'), 1::bigint, 'FAQ total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'faqs'), 1::bigint, 'FAQ completeness uses governed translation warnings');
select is((select total_count from dashboard_result where module_key = 'industries'), 1::bigint, 'industry total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'industries'), 1::bigint, 'industry completeness uses governed translation warnings');
select is((select total_count from dashboard_result where module_key = 'project_categories'), 1::bigint, 'project category total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'project_categories'), 1::bigint, 'project category completeness uses governed translation warnings');
select is((select total_count from dashboard_result where module_key = 'project_tags'), 1::bigint, 'project tag total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'project_tags'), 0::bigint, 'project tag completeness accepts a governed label');
select is((select total_count from dashboard_result where module_key = 'projects'), 1::bigint, 'project total is truthful');
select is((select incomplete_count from dashboard_result where module_key = 'projects'), 1::bigint, 'project completeness uses governed media, taxonomy, and translation warnings');
select ok(
  not (to_jsonb((select value from dashboard_result value where module_key = 'pages')) ?| array['title', 'slug', 'body', 'alt_text', 'email', 'phone']),
  'dashboard schema exposes no content payload or personal data'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001802","role":"authenticated"}', true);
set local role authenticated;
select is((select sum(total_count) from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000000100')), 18::numeric, 'translator can read truthful tenant completeness');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001803","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000000100')$$,
  '42501',
  'content.read permission required',
  'sales staff cannot read the CMS dashboard'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001801","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000001890')$$,
  '42501',
  'content.read permission required',
  'site-scoped editor cannot inspect another tenant dashboard'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001804","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000001890')), 16::bigint, 'super administrator receives all module rows for an empty tenant');
select is((select sum(total_count) from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000001890')), 0::numeric, 'empty tenant dashboard reports zero content');
select is((select sum(incomplete_count) from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000001890')), 0::numeric, 'empty tenant dashboard reports zero incomplete content');
select throws_ok(
  $$select * from public.cms_dashboard_summary_v1('00000000-0000-4000-8000-000000001899')$$,
  'P0002',
  'site not found',
  'unknown tenant is rejected instead of returning a misleading empty dashboard'
);
reset role;

select is(
  (select count(*) from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'cms_dashboard_summary_v1' and grantee = 'anon'),
  0::bigint,
  'anonymous execution has no residual dashboard grant'
);
select is(
  (select count(*) from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'cms_dashboard_summary_v1' and grantee = 'authenticated'),
  1::bigint,
  'authenticated execution has one explicit dashboard grant'
);

select * from finish();
rollback;
