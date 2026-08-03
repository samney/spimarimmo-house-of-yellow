begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(33);

select ok(not has_function_privilege('anon', 'public.cms_site_workspace_v1(uuid)', 'execute'), 'anonymous callers cannot execute the site workspace');
select ok(has_function_privilege('authenticated', 'public.cms_site_workspace_v1(uuid)', 'execute'), 'authenticated staff may enter the permission-checked site workspace');
select ok(not has_table_privilege('authenticated', 'public.sites', 'update'), 'direct authenticated site updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.site_domains', 'insert'), 'direct authenticated domain inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.site_locales', 'update'), 'direct authenticated locale updates are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002001', 'authenticated', 'authenticated', 'site-superadmin@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002002', 'authenticated', 'authenticated', 'site-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002001', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002002', '00000000-0000-4000-8000-000000000100', 'content_editor');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002002","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')$$,
  '42501', 'settings.manage permission required',
  'content editors cannot inspect tenant administration settings'
);
select throws_ok(
  $$select * from public.update_site_settings_v1(
    '00000000-0000-4000-8000-000000000100', 1, 'Unauthorized', 'active', 'UTC', '{}', 'Unauthorized update'
  )$$,
  '42501', 'settings.manage permission required',
  'content editors cannot update tenant settings'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002001","role":"authenticated"}', true);
set local role authenticated;
select is((select site_name from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 'Reference Foundation', 'super administrator opens the governed site workspace');
select is((select jsonb_array_length(domains) from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 1, 'workspace exposes the canonical domain');
select is((select jsonb_array_length(locales) from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 3, 'workspace exposes every supported locale state');

select is((select lock_version from public.update_site_settings_v1(
  '00000000-0000-4000-8000-000000000100', 1, 'Reference Foundation CMS', 'active', 'Africa/Casablanca', '{"brand":"yellow"}', 'Configure tenant metadata'
)), 2, 'site update advances optimistic locking');
select is((select updated_by from public.sites where id = '00000000-0000-4000-8000-000000000100'), '00000000-0000-4000-8000-000000002001'::uuid, 'site update records the authenticated administrator');
select throws_ok(
  $$select * from public.update_site_settings_v1(
    '00000000-0000-4000-8000-000000000100', 1, 'Stale', 'active', 'UTC', '{}', 'Stale update attempt'
  )$$,
  '40001', 'site settings were modified by another administrator',
  'stale site update is rejected'
);
select throws_ok(
  $$select * from public.update_site_settings_v1(
    '00000000-0000-4000-8000-000000000100', 2, 'Invalid timezone', 'active', 'Mars/Olympus', '{}', 'Invalid timezone attempt'
  )$$,
  '22023', 'valid timezone is required',
  'unknown timezones are rejected in the database boundary'
);
select is((select settings ->> 'brand' from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 'yellow', 'workspace returns the persisted bounded settings object');

create temporary table created_domain on commit drop as
select * from public.upsert_site_domain_v1(
  '00000000-0000-4000-8000-000000000100', null, 'preview.spimar.test', false, true, 'Add preview domain'
);
select is((select hostname from created_domain), 'preview.spimar.test', 'administrator adds a governed site domain');
select is((select actor_id from public.audit_events where action = 'site.domain_upserted' order by id desc limit 1), '00000000-0000-4000-8000-000000002001'::uuid, 'domain mutation audit records the administrator');
select throws_ok(
  $$select * from public.upsert_site_domain_v1(
    '00000000-0000-4000-8000-000000000100', null, 'HTTPS://BAD.TEST', false, true, 'Invalid domain attempt'
  )$$,
  '22023', 'valid lowercase hostname is required',
  'schemes and uppercase hostnames are rejected'
);
select is((select is_canonical from public.upsert_site_domain_v1(
  '00000000-0000-4000-8000-000000000100', (select domain_id from created_domain), 'preview.spimar.test', true, false, 'Promote canonical domain'
)), true, 'administrator promotes a replacement canonical domain');
select is((select is_canonical from public.site_domains where id = '00000000-0000-4000-8000-000000000101'), false, 'previous canonical domain is demoted atomically');
select is((select is_canonical from public.site_domains where id = (select domain_id from created_domain)), true, 'replacement domain is the sole canonical domain');
select throws_ok(
  $$select * from public.remove_site_domain_v1(
    '00000000-0000-4000-8000-000000000100', (select domain_id from created_domain), 'Unsafe canonical removal'
  )$$,
  '23514', 'canonical domain must be replaced before removal',
  'canonical domains cannot be removed without replacement'
);
select is((select removed from public.remove_site_domain_v1(
  '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000101', 'Remove obsolete local domain'
)), true, 'administrator removes a non-canonical domain');
select is((select count(*) from public.site_domains where id = '00000000-0000-4000-8000-000000000101'), 0::bigint, 'removed domain no longer exists');

select is((select direction from public.configure_site_locale_v1(
  '00000000-0000-4000-8000-000000000100', 'ar', true, true, 'Enable Arabic as default'
)), 'rtl', 'Arabic locale direction is derived as RTL');
select is((select default_locale from public.sites where id = '00000000-0000-4000-8000-000000000100'), 'ar', 'site default locale follows the governed locale transition');
select is((select is_default from public.site_locales where site_id = '00000000-0000-4000-8000-000000000100' and locale = 'en'), false, 'previous default locale is demoted atomically');
select is((select lock_version from public.sites where id = '00000000-0000-4000-8000-000000000100'), 3, 'default-locale change advances the site lock version');
select throws_ok(
  $$select * from public.configure_site_locale_v1(
    '00000000-0000-4000-8000-000000000100', 'ar', false, false, 'Attempt default disable'
  )$$,
  '23514', 'default locale cannot be disabled',
  'active default locale cannot be disabled'
);
select throws_ok(
  $$select * from public.configure_site_locale_v1(
    '00000000-0000-4000-8000-000000000100', 'es', true, false, 'Unsupported locale attempt'
  )$$,
  '22023', 'valid locale configuration is required',
  'unsupported locale is rejected'
);
select is((select jsonb_array_length(domains) from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 1, 'final workspace returns the governed domain set');
select is((select current_status from public.cms_site_workspace_v1('00000000-0000-4000-8000-000000000100')), 'active'::public.site_status, 'final workspace preserves explicit tenant status');
select ok((select count(*) from public.audit_events where site_id = '00000000-0000-4000-8000-000000000100' and action like 'site.%') >= 5, 'site, domain, and locale mutations create attributable audit evidence');
reset role;

select * from finish();
rollback;
