begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(50);

select ok(not has_function_privilege('anon', 'public.search_cms_resources_v1(uuid,uuid,text,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search resource drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_resources_v1(uuid,uuid,text,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter permission-checked resource search');
select ok(not has_table_privilege('authenticated', 'public.resources', 'insert'), 'direct authenticated resource inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.resource_translations', 'update'), 'direct authenticated translation updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.resource_versions', 'insert'), 'direct authenticated version inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.resource_versions', 'update'), 'direct authenticated version updates are revoked');
select ok(not has_table_privilege('anon', 'public.resource_versions', 'select'), 'anonymous callers cannot enumerate delivery versions');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000002610',
  '00000000-0000-4000-8000-000000000100',
  'resource.contract-event', 'resource-contract-event', 'UTC'
);
insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type, byte_size,
  checksum_sha256, rights_holder, rights_source
) values
  ('00000000-0000-4000-8000-000000002611',
   '00000000-0000-4000-8000-000000000100', 'document', 'supabase',
   'resources/contract-brochure-v1.pdf', 'application/pdf', 1024,
   repeat('a', 64), 'Fixture owner', 'Fixture license'),
  ('00000000-0000-4000-8000-000000002612',
   '00000000-0000-4000-8000-000000000100', 'document', 'supabase',
   'resources/unpublished.pdf', 'application/pdf', 2048,
   repeat('b', 64), 'Fixture owner', 'Fixture license');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002601', 'authenticated', 'authenticated', 'resource-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002602', 'authenticated', 'authenticated', 'resource-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002603', 'authenticated', 'authenticated', 'resource-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002604', 'authenticated', 'authenticated', 'resource-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002601', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002602', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002603', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002604', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002603","role":"authenticated"}', true);
set local role authenticated;
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002611', 'in_review', 'Submit resource document');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002611', 'approved', 'Approve resource document');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002611', 'published', 'Publish resource document');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002604","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_resources_v1('00000000-0000-4000-8000-000000000100', null, null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect resource drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002601","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_resource on commit drop as
select * from public.create_resource_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002610',
  'contract-brochure', 'brochure', true
);
grant select on created_resource to authenticated, anon;
select is((select status from created_resource), 'draft'::public.publication_status, 'editor creates a governed resource draft');
select is((select created_by from public.resources where id = (select resource_id from created_resource)), '00000000-0000-4000-8000-000000002601'::uuid, 'resource creation records the editor');
select is((select lock_version from created_resource), 1, 'new resource begins at lock version one');
select ok('missing_translation:en' = any(app_private.resource_warnings_v1((select resource_id from created_resource))), 'draft resource reports missing English translation');
select ok('missing_current_version:fr' = any(app_private.resource_warnings_v1((select resource_id from created_resource))), 'draft resource reports missing French delivery version');
select is((select lock_version from public.update_resource_v1(
  (select resource_id from created_resource), 1,
  '00000000-0000-4000-8000-000000002610',
  'contract-brochure', 'guide', true, 'Correct the governed resource kind'
)), 2, 'resource update advances optimistic locking');
select throws_ok(
  $$select * from public.update_resource_v1(
    (select resource_id from created_resource), 1,
    '00000000-0000-4000-8000-000000002610',
    'contract-brochure', 'guide', true, 'Stale resource update'
  )$$,
  '40001', 'resource was modified by another editor', 'stale resource updates are rejected'
);
select throws_ok(
  $$select * from public.create_resource_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'Invalid Slug', 'guide', true
  )$$,
  '22023', 'valid resource slug is required', 'invalid resource slugs are rejected'
);
select throws_ok(
  $$select * from public.create_resource_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'invalid-kind', 'video', true
  )$$,
  '22023', 'valid resource kind is required', 'unknown resource kinds are rejected'
);
select throws_ok(
  $$select * from public.create_resource_version_v1(
    (select resource_id from created_resource), 2, 'en',
    '00000000-0000-4000-8000-000000002612', 'privacy-2026-08',
    'Attempt unpublished resource document'
  )$$,
  '22023', 'published document media from the resource site is required', 'unpublished document media cannot become a delivery version'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002602","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_resource_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'translator-bypass', 'guide', false
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base resources'
);
select is((select status from public.upsert_resource_translation_v1(
  (select resource_id from created_resource), 'en', 'Contract brochure',
  'English resource summary', 'Create English resource copy'
)), 'draft'::public.translation_status, 'translator creates English resource copy');
select is((select status from public.upsert_resource_translation_v1(
  (select resource_id from created_resource), 'fr', 'Brochure contractuelle',
  'Résumé français de la ressource', 'Create French resource copy'
)), 'draft'::public.translation_status, 'translator creates French resource copy');
select throws_ok(
  $$select * from public.upsert_resource_translation_v1(
    (select resource_id from created_resource), 'ar', 'Arabic disabled', '',
    'Attempt disabled resource locale'
  )$$,
  '22023', 'enabled resource locale is required', 'disabled locales cannot receive resource copy'
);
select is((select count(*) from public.resource_translations
  where resource_id = (select resource_id from created_resource)
    and created_by = '00000000-0000-4000-8000-000000002602'), 2::bigint,
  'resource translations record the translator actor');
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'en', 'in_review', 'Submit English resource copy'
)), 'in_review'::public.translation_status, 'translator submits English resource copy');
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'fr', 'in_review', 'Submit French resource copy'
)), 'in_review'::public.translation_status, 'translator submits French resource copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002601","role":"authenticated"}', true);
set local role authenticated;
create temporary table version_en_one on commit drop as
select * from public.create_resource_version_v1(
  (select resource_id from created_resource), 2, 'en',
  '00000000-0000-4000-8000-000000002611', 'privacy-2026-08',
  'Create immutable English resource version'
);
grant select on version_en_one to authenticated, anon;
select is((select version_number from version_en_one), 1, 'first localized resource version receives server-assigned version one');
select is((select resource_lock_version from version_en_one), 3, 'version creation advances the parent optimistic lock');
select is((select version_number from public.create_resource_version_v1(
  (select resource_id from created_resource), 3, 'fr',
  '00000000-0000-4000-8000-000000002611', 'privacy-2026-08',
  'Create immutable French resource version'
)), 1, 'version numbering is independent per locale');
create temporary table version_en_two on commit drop as
select * from public.create_resource_version_v1(
  (select resource_id from created_resource), 4, 'en',
  '00000000-0000-4000-8000-000000002611', 'privacy-2026-09',
  'Create replacement English resource version'
);
grant select on version_en_two to authenticated, anon;
select is((select version_number from version_en_two), 2, 'replacement resource version advances the server sequence');
select is((select count(*) from public.resource_versions
  where resource_id = (select resource_id from created_resource)
    and locale = 'en' and is_current), 1::bigint, 'exactly one English resource version remains current');
select is((select is_current from public.resource_versions where id = (select version_id from version_en_one)), false, 'superseded delivery version remains immutable and non-current');
select throws_ok(
  $$update public.resource_versions set notice_version = 'tampered'
    where id = (select version_id from version_en_one)$$,
  '42501', null, 'direct version content mutation is denied'
);
select is((select status from public.transition_resource_status_v1(
  (select resource_id from created_resource), 'in_review', 'Submit resource for review'
)), 'in_review'::public.publication_status, 'editor submits the resource for review');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002603","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_resource_status_v1(
    (select resource_id from created_resource), 'approved', 'Approve before translations'
  )$$,
  '23514', 'resource is incomplete', 'resource approval is blocked until translations are approved'
);
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'en', 'approved', 'Approve English resource copy'
)), 'approved'::public.translation_status, 'publisher approves English resource copy');
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'fr', 'approved', 'Approve French resource copy'
)), 'approved'::public.translation_status, 'publisher approves French resource copy');
select is((select status from public.transition_resource_status_v1(
  (select resource_id from created_resource), 'approved', 'Approve complete resource'
)), 'approved'::public.publication_status, 'publisher approves the complete resource');
select throws_ok(
  $$select * from public.transition_resource_status_v1(
    (select resource_id from created_resource), 'scheduled', 'Unsupported resource schedule'
  )$$,
  '23514', 'resource scheduling is not implemented', 'resource API never claims fake scheduling'
);
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'en', 'published', 'Publish English resource copy'
)), 'published'::public.translation_status, 'publisher publishes English resource copy');
select is((select status from public.transition_resource_translation_status_v1(
  (select resource_id from created_resource), 'fr', 'published', 'Publish French resource copy'
)), 'published'::public.translation_status, 'publisher publishes French resource copy');
select is((select status from public.transition_resource_status_v1(
  (select resource_id from created_resource), 'published', 'Publish governed resource'
)), 'published'::public.publication_status, 'publisher publishes the governed resource');
select is((select publication_status from public.search_cms_resources_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002610', 'guide', null, 'contractuelle', 10
) where resource_id = (select resource_id from created_resource)), 'published'::public.publication_status, 'resource search matches tenant, event, kind, and localized content');
select is((select cardinality(warning_codes) from public.search_cms_resources_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, null, 50
) where resource_id = (select resource_id from created_resource)), 0, 'published resource clears translation and version warnings');
select is((select count(*) from public.list_cms_resource_versions_v1((select resource_id from created_resource))), 3::bigint, 'authorized version history retains every immutable delivery version');
select throws_ok(
  $$select * from public.create_resource_version_v1(
    (select resource_id from created_resource),
    (select lock_version from public.resources where id = (select resource_id from created_resource)),
    'en', '00000000-0000-4000-8000-000000002611', 'privacy-2026-10',
    'Attempt published version replacement'
  )$$,
  '23514', 'resource must be draft before adding a version', 'published delivery cannot be silently replaced'
);
select throws_ok(
  $$select * from public.search_cms_resources_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, null, 101
  )$$,
  '22023', 'limit must be between 1 and 100', 'resource search rejects unbounded limits'
);
reset role;

set local role anon;
select is((select count(*) from public.resources where id = (select resource_id from created_resource)), 1::bigint, 'anonymous query sees the published resource');
select is((select count(*) from public.resource_translations where resource_id = (select resource_id from created_resource)), 2::bigint, 'anonymous query sees published resource translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('resources','resource_translations')) >= 9, 'resource mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('resources','resource_translations','resource_versions')) >= 13, 'resource mutations create attributable audit evidence');

select * from finish();
rollback;
