begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(43);

select ok(not has_function_privilege('anon', 'public.cms_settings_seo_workspace_v1(uuid,text)', 'execute'), 'anonymous callers cannot execute the settings and SEO workspace');
select ok(has_function_privilege('authenticated', 'public.cms_settings_seo_workspace_v1(uuid,text)', 'execute'), 'authenticated staff may enter the permission-checked workspace');
select ok(not has_table_privilege('authenticated', 'public.global_settings', 'insert'), 'direct authenticated global-setting inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.global_settings', 'update'), 'direct authenticated global-setting updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.seo_entries', 'insert'), 'direct authenticated SEO inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.seo_entries', 'update'), 'direct authenticated SEO updates are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002101', 'authenticated', 'authenticated', 'settings-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002102', 'authenticated', 'authenticated', 'settings-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002103', 'authenticated', 'authenticated', 'settings-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002104', 'authenticated', 'authenticated', 'settings-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002101', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002102', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002103', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002104', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002104","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', null)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect CMS settings or SEO drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002101","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_setting on commit drop as
select * from public.create_global_setting_v1(
  '00000000-0000-4000-8000-000000000100', 'contact.primary', null,
  '{"email":"hello@example.test"}'::jsonb
);
grant select on created_setting to anon;
select is((select status from created_setting), 'draft'::public.publication_status, 'editor creates a governed global setting draft');
select is((select created_by from public.global_settings where id = (select setting_id from created_setting)), '00000000-0000-4000-8000-000000002101'::uuid, 'global setting records the authenticated editor');
select is((select lock_version from created_setting), 1, 'new global setting begins at lock version one');

create temporary table localized_setting on commit drop as
select * from public.create_global_setting_v1(
  '00000000-0000-4000-8000-000000000100', 'footer.legal', 'fr',
  '"Mentions legales"'::jsonb
);
select is((select status from localized_setting), 'draft'::public.publication_status, 'editor creates an enabled-locale setting');
select throws_ok(
  $$select * from public.create_global_setting_v1(
    '00000000-0000-4000-8000-000000000100', 'footer.ar', 'ar', '"Arabic"'::jsonb
  )$$,
  '22023', 'enabled locale is required', 'disabled locales cannot receive global settings'
);
select is((select lock_version from public.update_global_setting_v1(
  (select setting_id from created_setting), 1, '{"email":"contact@example.test"}'::jsonb,
  'Correct contact address'
)), 2, 'global setting update advances optimistic locking');
select throws_ok(
  $$select * from public.update_global_setting_v1(
    (select setting_id from created_setting), 1, '{"email":"stale@example.test"}'::jsonb,
    'Stale setting update'
  )$$,
  '40001', 'global setting was modified by another editor', 'stale global setting update is rejected'
);
select is((select jsonb_array_length(global_settings) from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', 'fr')), 2, 'localized workspace includes global and matching-locale settings');

create temporary table created_seo on commit drop as
select * from public.create_seo_entry_v1(
  '00000000-0000-4000-8000-000000000100', 'en', '/events',
  'SPIMAR Events', 'Discover verified SPIMAR events and exhibitor opportunities.',
  'https://example.test/en/events', true, true,
  '{"type":"website","image":"https://cdn.example.test/events.jpg"}'::jsonb,
  '[{"@context":"https://schema.org","@type":"WebPage"}]'::jsonb
);
grant select on created_seo to anon;
select is((select status from created_seo), 'draft'::public.publication_status, 'editor creates a governed SEO draft');
select is((select created_by from public.seo_entries where id = (select seo_id from created_seo)), '00000000-0000-4000-8000-000000002101'::uuid, 'SEO creation records the authenticated editor');
select throws_ok(
  $$select * from public.create_seo_entry_v1(
    '00000000-0000-4000-8000-000000000100', 'en', '/unsafe', 'Unsafe', 'Unsafe canonical test',
    'http://example.test/unsafe', true, true, '{}'::jsonb, '[]'::jsonb
  )$$,
  '22023', 'HTTPS canonical URL is required', 'insecure canonical URLs are rejected'
);
select throws_ok(
  $$select * from public.create_seo_entry_v1(
    '00000000-0000-4000-8000-000000000100', 'en', '/events?draft=true', 'Invalid route', 'Query fragments do not belong in routes',
    null, true, true, '{}'::jsonb, '[]'::jsonb
  )$$,
  '22023', 'valid SEO route is required', 'SEO routes reject query strings'
);
select is((select lock_version from public.update_seo_entry_v1(
  (select seo_id from created_seo), 1, '/events', 'SPIMAR Event Calendar',
  'Discover current SPIMAR events, locations, and exhibitor opportunities.',
  'https://example.test/en/events', true, true,
  '{"type":"website"}'::jsonb, '[{"@context":"https://schema.org","@type":"CollectionPage"}]'::jsonb,
  'Improve search metadata'
)), 2, 'SEO update advances optimistic locking');
select throws_ok(
  $$select * from public.update_seo_entry_v1(
    (select seo_id from created_seo), 1, '/events', 'Stale SEO', 'Stale SEO update attempt',
    null, true, true, '{}'::jsonb, '[]'::jsonb, 'Stale SEO update'
  )$$,
  '40001', 'SEO entry was modified by another editor', 'stale SEO update is rejected'
);
select is((select jsonb_array_length(seo_entries) from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', 'en')), 1, 'workspace exposes the localized SEO draft');
select is((select status from public.transition_global_setting_status_v1((select setting_id from created_setting), 'in_review', 'Submit setting for review')), 'in_review'::public.publication_status, 'editor submits global setting for review');
select is((select status from public.transition_seo_entry_status_v1((select seo_id from created_seo), 'in_review', 'Submit SEO for review')), 'in_review'::public.publication_status, 'editor submits SEO for review');
select throws_ok(
  $$select * from public.transition_global_setting_status_v1((select setting_id from created_setting), 'approved', 'Editor approval attempt')$$,
  '42501', 'content.publish permission required', 'editor cannot approve global settings'
);
select throws_ok(
  $$select * from public.transition_seo_entry_status_v1((select seo_id from created_seo), 'approved', 'Editor SEO approval attempt')$$,
  '42501', 'content.publish permission required', 'editor cannot approve SEO entries'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002102","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_global_setting_v1(
    '00000000-0000-4000-8000-000000000100', 'translator.bypass', 'fr', 'true'::jsonb
  )$$,
  '42501', 'content.write permission required', 'translator cannot bypass base-content permission'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002103","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_global_setting_status_v1((select setting_id from created_setting), 'approved', 'Approve global setting')), 'approved'::public.publication_status, 'publisher approves the global setting');
select is((select status from public.transition_seo_entry_status_v1((select seo_id from created_seo), 'approved', 'Approve SEO entry')), 'approved'::public.publication_status, 'publisher approves the SEO entry');
select throws_ok(
  $$select * from public.transition_global_setting_status_v1((select setting_id from created_setting), 'scheduled', 'Unsupported setting schedule')$$,
  '23514', 'global setting scheduling is not implemented', 'global settings never claim fake scheduled delivery'
);
select throws_ok(
  $$select * from public.transition_seo_entry_status_v1((select seo_id from created_seo), 'scheduled', 'Unsupported SEO schedule')$$,
  '23514', 'SEO scheduling is not implemented', 'SEO entries never claim fake scheduled delivery'
);
select is((select status from public.transition_global_setting_status_v1((select setting_id from created_setting), 'published', 'Publish global setting')), 'published'::public.publication_status, 'publisher publishes the global setting');
select is((select status from public.transition_seo_entry_status_v1((select seo_id from created_seo), 'published', 'Publish SEO entry')), 'published'::public.publication_status, 'publisher publishes the SEO entry');
select throws_ok(
  $$select * from public.update_global_setting_v1(
    (select setting_id from created_setting),
    (select lock_version from public.global_settings where id = (select setting_id from created_setting)),
    'false'::jsonb, 'Protected published edit'
  )$$,
  '23514', 'global setting must be draft before editing', 'published global settings cannot be edited in place'
);
select throws_ok(
  $$select * from public.update_seo_entry_v1(
    (select seo_id from created_seo),
    (select lock_version from public.seo_entries where id = (select seo_id from created_seo)),
    '/events', 'Protected', 'Protected published SEO edit', null, true, true, '{}'::jsonb, '[]'::jsonb,
    'Protected published edit'
  )$$,
  '23514', 'SEO entry must be draft before editing', 'published SEO entries cannot be edited in place'
);
select is((select jsonb_array_length(global_settings) from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', 'en')), 1, 'English workspace returns only the global published setting');
select is((select jsonb_array_length(seo_entries) from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', 'en')), 1, 'English workspace returns the published SEO entry');
reset role;

set local role anon;
select is((select count(*) from public.global_settings where id = (select setting_id from created_setting)), 1::bigint, 'anonymous query sees the published global setting');
select is((select count(*) from public.seo_entries where id = (select seo_id from created_seo)), 1::bigint, 'anonymous query sees the published SEO entry');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('global_settings','seo_entries')) >= 8, 'settings and SEO mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('global_settings','seo_entries')) >= 10, 'settings and SEO mutations create attributable audit evidence');
select throws_ok(
  $$select * from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000000100', 'ar')$$,
  '22023', 'enabled locale is required', 'workspace rejects disabled locales'
);
select throws_ok(
  $$select * from public.cms_settings_seo_workspace_v1('00000000-0000-4000-8000-000000009999', null)$$,
  'P0002', 'site not found', 'authorized administrators receive an explicit unknown-tenant rejection'
);

select * from finish();
rollback;
