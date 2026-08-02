begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(41);

select ok(not has_function_privilege('anon', 'public.search_cms_case_studies_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search case study drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_case_studies_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter permission-checked case study search');
select ok(not has_table_privilege('authenticated', 'public.case_studies', 'insert'), 'direct authenticated case study inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.case_studies', 'update'), 'direct authenticated case study updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.case_study_translations', 'insert'), 'direct authenticated case study translation inserts are revoked');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000002410',
  '00000000-0000-4000-8000-000000000100',
  'case-study.contract-event', 'case-study-contract-event', 'UTC'
);
insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type, alt_text,
  rights_holder, rights_source
) values (
  '00000000-0000-4000-8000-000000002411',
  '00000000-0000-4000-8000-000000000100', 'image', 'supabase',
  'case-studies/contract.webp', 'image/webp', 'Case study media fixture',
  'Fixture owner', 'Fixture license'
);
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002401', 'authenticated', 'authenticated', 'story-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002402', 'authenticated', 'authenticated', 'story-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002403', 'authenticated', 'authenticated', 'story-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002404', 'authenticated', 'authenticated', 'story-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002401', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002402', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002403', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002404', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002403","role":"authenticated"}', true);
set local role authenticated;
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002411', 'in_review', 'Submit story media');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002411', 'approved', 'Approve story media');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002411', 'published', 'Publish story media');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002404","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_case_studies_v1('00000000-0000-4000-8000-000000000100', null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect case study drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002401","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_story on commit drop as
select * from public.create_case_study_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002410', 'contract-success-story', null
);
grant select on created_story to authenticated, anon;
select is((select status from created_story), 'draft'::public.publication_status, 'editor creates a governed case study draft');
select is((select created_by from public.case_studies where id = (select case_study_id from created_story)), '00000000-0000-4000-8000-000000002401'::uuid, 'case study creation records the authenticated editor');
select is((select lock_version from created_story), 1, 'new case study begins at lock version one');
select ok('evidence_unverified' = any(app_private.case_study_warnings_v1((select case_study_id from created_story))), 'draft case study reports unverified evidence');
select ok('missing_primary_media' = any(app_private.case_study_warnings_v1((select case_study_id from created_story))), 'draft case study reports missing primary media');
select is((select lock_version from public.update_case_study_v1(
  (select case_study_id from created_story), 1,
  '00000000-0000-4000-8000-000000002410', 'contract-success-story',
  '00000000-0000-4000-8000-000000002411', 'Attach the governed primary media'
)), 2, 'case study update advances optimistic locking');
select throws_ok(
  $$select * from public.update_case_study_v1(
    (select case_study_id from created_story), 1,
    '00000000-0000-4000-8000-000000002410', 'contract-success-story',
    '00000000-0000-4000-8000-000000002411', 'Stale story update'
  )$$,
  '40001', 'case study was modified by another editor', 'stale case study updates are rejected'
);
select throws_ok(
  $$select * from public.create_case_study_v1(
    '00000000-0000-4000-8000-000000000100', null, 'Invalid Slug', null
  )$$,
  '22023', 'valid case study slug is required', 'invalid case study slugs are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002402","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_case_study_v1(
    '00000000-0000-4000-8000-000000000100', null, 'translator-bypass', null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base case study records'
);
select is((select status from public.upsert_case_study_translation_v1(
  (select case_study_id from created_story), 'en', 'Contract success story',
  'English case study summary', '{"blocks":[{"type":"paragraph","text":"Evidence-backed result."}]}'::jsonb,
  'Create English story copy'
)), 'draft'::public.translation_status, 'translator creates English case study content');
select is((select status from public.upsert_case_study_translation_v1(
  (select case_study_id from created_story), 'fr', 'Étude de réussite contractuelle',
  'French case study summary', '{"blocks":[{"type":"paragraph","text":"Résultat documenté."}]}'::jsonb,
  'Create French story copy'
)), 'draft'::public.translation_status, 'translator creates French case study content');
select throws_ok(
  $$select * from public.upsert_case_study_translation_v1(
    (select case_study_id from created_story), 'en', 'Invalid body', '', '[]'::jsonb, 'Invalid body attempt'
  )$$,
  '22023', 'valid bounded case study translation is required', 'case study body must be an object'
);
select throws_ok(
  $$select * from public.upsert_case_study_translation_v1(
    (select case_study_id from created_story), 'ar', 'Disabled Arabic', '', '{}'::jsonb, 'Disabled locale attempt'
  )$$,
  '22023', 'enabled case study locale is required', 'disabled locales cannot receive case study content'
);
select is((select count(*) from public.case_study_translations
  where case_study_id = (select case_study_id from created_story)
    and created_by = '00000000-0000-4000-8000-000000002402'), 2::bigint,
  'case study translations record the translator actor');
select is((select status from public.transition_case_study_translation_status_v1(
  (select case_study_id from created_story), 'en', 'in_review', 'Submit English story copy'
)), 'in_review'::public.translation_status, 'translator submits English story copy');
select is((select status from public.transition_case_study_translation_status_v1(
  (select case_study_id from created_story), 'fr', 'in_review', 'Submit French story copy'
)), 'in_review'::public.translation_status, 'translator submits French story copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002401","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_case_study_status_v1(
  (select case_study_id from created_story), 'in_review', 'Submit case study for review'
)), 'in_review'::public.publication_status, 'editor submits base case study content');
select is((select evidence_status from public.transition_case_study_evidence_v1(
  (select case_study_id from created_story), 'submitted', 'Signed outcome report fixture',
  'Submit case study evidence'
)), 'submitted'::public.evidence_status, 'editor submits case study evidence');
select throws_ok(
  $$select * from public.transition_case_study_evidence_v1(
    (select case_study_id from created_story), 'verified', 'Signed outcome report fixture', 'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify case study evidence'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002403","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_case_study_status_v1(
    (select case_study_id from created_story), 'approved', 'Unverified approval attempt'
  )$$,
  '23514', null, 'unverified evidence blocks case study approval'
);
select is((select status from public.transition_case_study_translation_status_v1((select case_study_id from created_story), 'en', 'approved', 'Approve English story copy')), 'approved'::public.translation_status, 'publisher approves English story copy');
select is((select status from public.transition_case_study_translation_status_v1((select case_study_id from created_story), 'fr', 'approved', 'Approve French story copy')), 'approved'::public.translation_status, 'publisher approves French story copy');
select is((select evidence_status from public.transition_case_study_evidence_v1(
  (select case_study_id from created_story), 'verified', 'Signed outcome report fixture', 'Verify case study evidence'
)), 'verified'::public.evidence_status, 'publisher verifies case study evidence');
select is((select approved_by from public.case_studies where id = (select case_study_id from created_story)), '00000000-0000-4000-8000-000000002403'::uuid, 'evidence verification records the publisher');
select is((select status from public.transition_case_study_status_v1((select case_study_id from created_story), 'approved', 'Approve verified case study')), 'approved'::public.publication_status, 'publisher approves the verified case study');
select throws_ok(
  $$select * from public.transition_case_study_status_v1((select case_study_id from created_story), 'scheduled', 'Unsupported story schedule')$$,
  '23514', 'case study scheduling is not implemented', 'case study API never claims fake scheduling'
);
select is((select status from public.transition_case_study_translation_status_v1((select case_study_id from created_story), 'en', 'published', 'Publish English story copy')), 'published'::public.translation_status, 'publisher publishes English story copy');
select is((select status from public.transition_case_study_translation_status_v1((select case_study_id from created_story), 'fr', 'published', 'Publish French story copy')), 'published'::public.translation_status, 'publisher publishes French story copy');
select is((select status from public.transition_case_study_status_v1((select case_study_id from created_story), 'published', 'Publish verified case study')), 'published'::public.publication_status, 'publisher publishes the verified case study');
select is((select publication_status from public.search_cms_case_studies_v1(
  '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000002410', null, 'réussite', 10
) where case_study_id = (select case_study_id from created_story)), 'published'::public.publication_status, 'authorized case study search matches event and localized title');
select is((select cardinality(warning_codes) from public.search_cms_case_studies_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, 50
) where case_study_id = (select case_study_id from created_story)), 0, 'published case study clears evidence, media, and translation warnings');
reset role;

set local role anon;
select is((select count(*) from public.case_studies where id = (select case_study_id from created_story)), 1::bigint, 'anonymous query sees the published case study');
select is((select count(*) from public.case_study_translations where case_study_id = (select case_study_id from created_story)), 2::bigint, 'anonymous query sees both published case study translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('case_studies','case_study_translations')) >= 9, 'case study mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('case_studies','case_study_translations')) >= 11, 'case study mutations create attributable audit evidence');

select * from finish();
rollback;
