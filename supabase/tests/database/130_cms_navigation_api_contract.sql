begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(38);

select ok(not has_function_privilege('anon', 'public.cms_navigation_workspace_v1(uuid,text)', 'execute'), 'anonymous callers cannot execute the navigation workspace');
select ok(has_function_privilege('authenticated', 'public.cms_navigation_workspace_v1(uuid,text)', 'execute'), 'authenticated staff may enter the permission-checked navigation workspace');
select ok(not has_table_privilege('authenticated', 'public.navigation_items', 'insert'), 'direct authenticated navigation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.navigation_items', 'update'), 'direct authenticated navigation updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.navigation_item_translations', 'insert'), 'direct authenticated translation inserts are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001901', 'authenticated', 'authenticated', 'navigation-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001902', 'authenticated', 'authenticated', 'navigation-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001903', 'authenticated', 'authenticated', 'navigation-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001904', 'authenticated', 'authenticated', 'navigation-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001901', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001902', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000001903', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000001904', '00000000-0000-4000-8000-000000000100', 'sales_manager');

insert into public.sites (id, slug, name, status, default_locale, timezone) values
  ('00000000-0000-4000-8000-000000001990', 'navigation-other-site', 'Navigation Other Site', 'active', 'en', 'UTC');
insert into public.navigation_items (id, site_id, location, item_key, href, position) values
  ('00000000-0000-4000-8000-000000001991', '00000000-0000-4000-8000-000000001990', 'header', 'other.parent', '/other', 0);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001901","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_root on commit drop as
select * from public.create_navigation_item_v1(
  '00000000-0000-4000-8000-000000000100', null, 'header', 'main.events', '/events', 10
);
grant select on created_root to anon;
select is((select status from created_root), 'draft'::public.publication_status, 'editor creates a governed navigation draft');
select is((select created_by from public.navigation_items where id = (select item_id from created_root)), '00000000-0000-4000-8000-000000001901'::uuid, 'navigation creation records the authenticated editor');
select is((select lock_version from created_root), 1, 'new navigation item begins at lock version one');

create temporary table created_child on commit drop as
select * from public.create_navigation_item_v1(
  '00000000-0000-4000-8000-000000000100', (select item_id from created_root),
  'header', 'main.events.casablanca', '/events/casablanca', 20
);
select is((select parent_id from public.navigation_items where id = (select item_id from created_child)), (select item_id from created_root), 'editor creates a same-site same-location child item');
select is(
  (select lock_version from public.update_navigation_item_v1(
    (select item_id from created_child), 1, (select item_id from created_root),
    'header', 'main.events.casablanca', '/events/casablanca-2027', 21, 'Correct event destination'
  )),
  2,
  'navigation draft update advances optimistic locking'
);
select throws_ok(
  $$select * from public.update_navigation_item_v1(
    (select item_id from created_child), 1, (select item_id from created_root),
    'header', 'main.events.casablanca', '/stale', 21, 'Stale update attempt'
  )$$,
  '40001',
  'navigation item was modified by another editor',
  'stale navigation update is rejected'
);
select throws_ok(
  $$select * from public.create_navigation_item_v1(
    '00000000-0000-4000-8000-000000000100', null, 'header', 'main.unsafe', 'javascript:alert(1)', 30
  )$$,
  '22023',
  'safe navigation href is required',
  'unsafe navigation href is rejected'
);
select throws_ok(
  $$select * from public.create_navigation_item_v1(
    '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001991',
    'header', 'main.cross-tenant', '/cross', 30
  )$$,
  '22023',
  'navigation parent must belong to the same site and location',
  'cross-tenant navigation parent is rejected'
);
select is((select count(*) from public.cms_navigation_workspace_v1('00000000-0000-4000-8000-000000000100', 'header')), 2::bigint, 'navigation workspace returns the controlled location');
select is((select jsonb_array_length(translations) from public.cms_navigation_workspace_v1('00000000-0000-4000-8000-000000000100', 'header') where item_id = (select item_id from created_root)), 0, 'new navigation workspace truthfully reports no translations');
select throws_ok(
  $$select * from public.upsert_navigation_translation_v1(
    (select item_id from created_root), 'en', 'Events', 'Browse events', 'Editor translation attempt'
  )$$,
  '42501',
  'translations.write permission required',
  'content editor cannot bypass translator permission'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001902","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.upsert_navigation_translation_v1((select item_id from created_root), 'en', 'Events', 'Browse events', 'Add English navigation label')), 'draft'::public.translation_status, 'translator creates English navigation copy');
select is((select status from public.upsert_navigation_translation_v1((select item_id from created_root), 'fr', 'Ã‰vÃ©nements', 'Parcourir les Ã©vÃ©nements', 'Add French navigation label')), 'draft'::public.translation_status, 'translator creates French navigation copy');
select throws_ok(
  $$select * from public.upsert_navigation_translation_v1(
    (select item_id from created_root), 'ar', 'Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª', null, 'Disabled locale attempt'
  )$$,
  '22023',
  'enabled navigation locale is required',
  'disabled locale cannot receive navigation copy'
);
select is((select created_by from public.navigation_item_translations where navigation_item_id = (select item_id from created_root) and locale = 'en'), '00000000-0000-4000-8000-000000001902'::uuid, 'navigation translation records the authenticated translator');
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'en', 'in_review', 'Submit English label')), 'in_review'::public.translation_status, 'translator submits English navigation copy');
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'fr', 'in_review', 'Submit French label')), 'in_review'::public.translation_status, 'translator submits French navigation copy');
select throws_ok(
  $$select * from public.transition_navigation_item_status_v1(
    (select item_id from created_root), 'in_review', 'Translator base transition attempt'
  )$$,
  '42501',
  'content.write permission required',
  'translator cannot submit base navigation content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001901","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_navigation_item_status_v1((select item_id from created_root), 'in_review', 'Submit navigation item')), 'in_review'::public.publication_status, 'editor submits base navigation content');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001903","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'en', 'approved', 'Approve English label')), 'approved'::public.translation_status, 'publisher approves English navigation copy');
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'fr', 'approved', 'Approve French label')), 'approved'::public.translation_status, 'publisher approves French navigation copy');
select is((select status from public.transition_navigation_item_status_v1((select item_id from created_root), 'approved', 'Approve navigation item')), 'approved'::public.publication_status, 'publisher approves base navigation content');
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'en', 'published', 'Publish English label')), 'published'::public.translation_status, 'publisher publishes English navigation copy');
select is((select status from public.transition_navigation_translation_status_v1((select item_id from created_root), 'fr', 'published', 'Publish French label')), 'published'::public.translation_status, 'publisher publishes French navigation copy');
select is((select status from public.transition_navigation_item_status_v1((select item_id from created_root), 'published', 'Publish navigation item')), 'published'::public.publication_status, 'publisher publishes translation-complete navigation item');
select throws_ok(
  $$select * from public.update_navigation_item_v1(
    (select item_id from created_root),
    (select lock_version from public.navigation_items where id = (select item_id from created_root)),
    null, 'header', 'main.events', '/events-new', 10, 'Protected edit attempt'
  )$$,
  '23514',
  'navigation item must be draft before editing',
  'published navigation item cannot be edited in place'
);
reset role;

set local role anon;
select is((select count(*) from public.navigation_items where id = (select item_id from created_root)), 1::bigint, 'anonymous public query sees the published navigation item');
select is((select count(*) from public.navigation_item_translations where navigation_item_id = (select item_id from created_root)), 2::bigint, 'anonymous public query sees both published navigation translations');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001901","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.cms_navigation_workspace_v1('00000000-0000-4000-8000-000000000100', 'header') where item_id = (select item_id from created_root)), 'published'::public.publication_status, 'workspace exposes final navigation publication state');
select is((select jsonb_array_length(translations) from public.cms_navigation_workspace_v1('00000000-0000-4000-8000-000000000100', 'header') where item_id = (select item_id from created_root)), 2, 'workspace exposes both localized labels');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001904","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.cms_navigation_workspace_v1('00000000-0000-4000-8000-000000000100', 'header')$$,
  '42501',
  'content.read permission required',
  'sales staff cannot inspect the CMS navigation workspace'
);
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('navigation_items', 'navigation_item_translations')) >= 8, 'navigation mutations create immutable revision snapshots');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('navigation_items', 'navigation_item_translations')) >= 12, 'navigation mutations create attributable CMS audit evidence');

select * from finish();
rollback;
