begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(45);

select ok(not has_function_privilege('anon', 'public.search_cms_exhibitor_packages_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search package drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_exhibitor_packages_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter permission-checked package search');
select ok(not has_table_privilege('authenticated', 'public.exhibitor_packages', 'insert'), 'direct authenticated package inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.exhibitor_packages', 'update'), 'direct authenticated package updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.exhibitor_package_translations', 'insert'), 'direct authenticated package translation inserts are revoked');

insert into public.events (
  id, site_id, event_key, slug, timezone, starts_at, ends_at
) values (
  '00000000-0000-4000-8000-000000002210',
  '00000000-0000-4000-8000-000000000100',
  'package.contract.event', 'package-contract-event', 'UTC',
  now() + interval '120 days', now() + interval '122 days'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002201', 'authenticated', 'authenticated', 'package-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002202', 'authenticated', 'authenticated', 'package-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002203', 'authenticated', 'authenticated', 'package-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002204', 'authenticated', 'authenticated', 'package-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002201', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002202', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002203', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002204', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002204","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_exhibitor_packages_v1('00000000-0000-4000-8000-000000000100', null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect package drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002201","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_package on commit drop as
select * from public.create_exhibitor_package_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002210',
  'contract.standard', 'standard', null, null, null
);
grant select on created_package to authenticated, anon;
select is((select status from created_package), 'draft'::public.publication_status, 'editor creates a governed package draft');
select is((select created_by from public.exhibitor_packages where id = (select package_id from created_package)), '00000000-0000-4000-8000-000000002201'::uuid, 'package creation records the authenticated editor');
select is((select lock_version from created_package), 1, 'new package begins at lock version one');
select ok('evidence_unverified' = any(app_private.exhibitor_package_warnings_v1((select package_id from created_package))), 'draft package reports unverified evidence');
select ok('missing_price' = any(app_private.exhibitor_package_warnings_v1((select package_id from created_package))), 'standard draft reports missing price');
select is((select lock_version from public.update_exhibitor_package_v1(
  (select package_id from created_package), 1,
  '00000000-0000-4000-8000-000000002210', 'contract.standard', 'standard',
  'MAD', 100000, 25, 'Add evidence-pending commercial values'
)), 2, 'package update advances optimistic locking');
select throws_ok(
  $$select * from public.update_exhibitor_package_v1(
    (select package_id from created_package), 1,
    '00000000-0000-4000-8000-000000002210', 'contract.standard', 'standard',
    'MAD', 120000, 25, 'Stale package update'
  )$$,
  '40001', 'exhibitor package was modified by another editor', 'stale package update is rejected'
);
select throws_ok(
  $$select * from public.create_exhibitor_package_v1(
    '00000000-0000-4000-8000-000000000100', null, 'invalid.currency', 'premium', 'mad', 1, 1
  )$$,
  '22023', 'valid package commercial values are required', 'lowercase currencies are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002202","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_exhibitor_package_v1(
    '00000000-0000-4000-8000-000000000100', null, 'translator.bypass', 'custom', null, null, null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base package records'
);
select is((select status from public.upsert_exhibitor_package_translation_v1(
  (select package_id from created_package), 'en', 'Standard package', 'English package summary',
  '["Stand fixture","Listing fixture"]'::jsonb, 'Create English package copy'
)), 'draft'::public.translation_status, 'translator creates English package content');
select is((select status from public.upsert_exhibitor_package_translation_v1(
  (select package_id from created_package), 'fr', 'Forfait standard', 'French package summary',
  '["Stand fixture","Listing fixture"]'::jsonb, 'Create French package copy'
)), 'draft'::public.translation_status, 'translator creates French package content');
select throws_ok(
  $$select * from public.upsert_exhibitor_package_translation_v1(
    (select package_id from created_package), 'ar', 'Arabic disabled', 'Disabled locale', '[]'::jsonb, 'Disabled locale attempt'
  )$$,
  '22023', 'enabled package locale is required', 'disabled locales cannot receive package content'
);
select is((select count(*) from public.exhibitor_package_translations where package_id = (select package_id from created_package) and created_by = '00000000-0000-4000-8000-000000002202'), 2::bigint, 'package translations record the translator actor');
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'en', 'in_review', 'Submit English package copy')), 'in_review'::public.translation_status, 'translator submits English package copy');
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'fr', 'in_review', 'Submit French package copy')), 'in_review'::public.translation_status, 'translator submits French package copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002201","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_exhibitor_package_status_v1((select package_id from created_package), 'in_review', 'Submit package for review')), 'in_review'::public.publication_status, 'editor submits base package content');
select is((select evidence_status from public.transition_exhibitor_package_evidence_v1(
  (select package_id from created_package), 'submitted', 'Signed commercial source fixture', 'Submit package evidence'
)), 'submitted'::public.evidence_status, 'editor submits package evidence');
select throws_ok(
  $$select * from public.transition_exhibitor_package_evidence_v1(
    (select package_id from created_package), 'verified', 'Signed commercial source fixture', 'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify commercial evidence'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002203","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_exhibitor_package_status_v1(
    (select package_id from created_package), 'approved', 'Unverified approval attempt'
  )$$,
  '23514', null, 'submitted but unverified evidence blocks package approval'
);
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'en', 'approved', 'Approve English package copy')), 'approved'::public.translation_status, 'publisher approves English package copy');
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'fr', 'approved', 'Approve French package copy')), 'approved'::public.translation_status, 'publisher approves French package copy');
select is((select evidence_status from public.transition_exhibitor_package_evidence_v1(
  (select package_id from created_package), 'rejected', 'Signed commercial source fixture', 'Reject incomplete evidence'
)), 'rejected'::public.evidence_status, 'publisher rejects incomplete evidence');
select throws_ok(
  $$select * from public.transition_exhibitor_package_evidence_v1(
    (select package_id from created_package), 'verified', 'Signed commercial source fixture', 'Skip resubmission attempt'
  )$$,
  '23514', 'invalid package evidence transition', 'rejected evidence cannot skip resubmission'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002201","role":"authenticated"}', true);
set local role authenticated;
select is((select evidence_status from public.transition_exhibitor_package_evidence_v1(
  (select package_id from created_package), 'submitted', 'Revised signed commercial source fixture', 'Resubmit package evidence'
)), 'submitted'::public.evidence_status, 'editor resubmits corrected evidence');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002203","role":"authenticated"}', true);
set local role authenticated;
select is((select evidence_status from public.transition_exhibitor_package_evidence_v1(
  (select package_id from created_package), 'verified', 'Revised signed commercial source fixture', 'Verify corrected evidence'
)), 'verified'::public.evidence_status, 'publisher verifies corrected evidence');
select is((select approved_by from public.exhibitor_packages where id = (select package_id from created_package)), '00000000-0000-4000-8000-000000002203'::uuid, 'evidence verification records the publisher');
select is((select status from public.transition_exhibitor_package_status_v1((select package_id from created_package), 'approved', 'Approve verified package')), 'approved'::public.publication_status, 'publisher approves the verified translation-complete package');
select throws_ok(
  $$select * from public.transition_exhibitor_package_status_v1((select package_id from created_package), 'scheduled', 'Unsupported package schedule')$$,
  '23514', 'package scheduling is not implemented', 'package API never claims fake scheduled publication'
);
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'en', 'published', 'Publish English package copy')), 'published'::public.translation_status, 'publisher publishes English package copy');
select is((select status from public.transition_exhibitor_package_translation_status_v1((select package_id from created_package), 'fr', 'published', 'Publish French package copy')), 'published'::public.translation_status, 'publisher publishes French package copy');
select is((select status from public.transition_exhibitor_package_status_v1((select package_id from created_package), 'published', 'Publish verified package')), 'published'::public.publication_status, 'publisher publishes the verified package');
select throws_ok(
  $$select * from public.update_exhibitor_package_v1(
    (select package_id from created_package),
    (select lock_version from public.exhibitor_packages where id = (select package_id from created_package)),
    '00000000-0000-4000-8000-000000002210', 'contract.standard', 'standard', 'MAD', 100000, 25,
    'Protected published edit'
  )$$,
  '23514', 'exhibitor package must be draft before editing', 'published packages cannot be edited in place'
);
select is((select publication_status from public.search_cms_exhibitor_packages_v1(
  '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000002210', null, 'standard', 10
) where package_id = (select package_id from created_package)), 'published'::public.publication_status, 'authorized package search matches event and localized query');
select is((select cardinality(warning_codes) from public.search_cms_exhibitor_packages_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, 50
) where package_id = (select package_id from created_package)), 0, 'published package clears all evidence, price, inclusion, and translation warnings');
select throws_ok(
  $$select * from public.search_cms_exhibitor_packages_v1('00000000-0000-4000-8000-000000000100', null, null, null, 101)$$,
  '22023', 'limit must be between 1 and 100', 'package search rejects unbounded limits'
);
reset role;

set local role anon;
select is((select count(*) from public.exhibitor_packages where id = (select package_id from created_package)), 1::bigint, 'anonymous query sees the published package');
select is((select count(*) from public.exhibitor_package_translations where package_id = (select package_id from created_package)), 2::bigint, 'anonymous query sees both published package translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('exhibitor_packages','exhibitor_package_translations')) >= 12, 'package and translation mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('exhibitor_packages','exhibitor_package_translations')) >= 14, 'package and translation mutations create attributable audit evidence');

select * from finish();
rollback;
