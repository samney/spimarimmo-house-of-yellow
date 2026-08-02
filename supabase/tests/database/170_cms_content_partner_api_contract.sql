begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(40);

select ok(not has_function_privilege('anon', 'public.search_cms_content_partners_v1(uuid,public.content_partner_kind,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search partner drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_content_partners_v1(uuid,public.content_partner_kind,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter permission-checked partner search');
select ok(not has_table_privilege('authenticated', 'public.content_partners', 'insert'), 'direct authenticated partner inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.content_partners', 'update'), 'direct authenticated partner updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.content_partner_translations', 'insert'), 'direct authenticated partner translation inserts are revoked');

insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type, alt_text,
  rights_holder, rights_source
) values (
  '00000000-0000-4000-8000-000000002310',
  '00000000-0000-4000-8000-000000000100',
  'image', 'supabase', 'partners/contract-logo.webp', 'image/webp',
  'Content partner logo fixture', 'Fixture owner', 'Fixture license'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002301', 'authenticated', 'authenticated', 'partner-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002302', 'authenticated', 'authenticated', 'partner-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002303', 'authenticated', 'authenticated', 'partner-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002304', 'authenticated', 'authenticated', 'partner-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002301', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002302', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002303', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002304', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002303","role":"authenticated"}', true);
set local role authenticated;
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002310', 'in_review', 'Submit fixture logo');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002310', 'approved', 'Approve fixture logo');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002310', 'published', 'Publish fixture logo');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002304","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_content_partners_v1('00000000-0000-4000-8000-000000000100', null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect partner drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002301","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_partner on commit drop as
select * from public.create_content_partner_v1(
  '00000000-0000-4000-8000-000000000100', 'contract.bank', 'bank', null,
  'https://partner.test'
);
grant select on created_partner to authenticated, anon;
select is((select status from created_partner), 'draft'::public.publication_status, 'editor creates a governed partner draft');
select is((select created_by from public.content_partners where id = (select partner_id from created_partner)), '00000000-0000-4000-8000-000000002301'::uuid, 'partner creation records the authenticated editor');
select is((select lock_version from created_partner), 1, 'new partner begins at lock version one');
select ok('evidence_unverified' = any(app_private.content_partner_warnings_v1((select partner_id from created_partner))), 'draft partner reports unverified evidence');
select ok('missing_logo' = any(app_private.content_partner_warnings_v1((select partner_id from created_partner))), 'draft partner reports a missing logo');
select is((select lock_version from public.update_content_partner_v1(
  (select partner_id from created_partner), 1, 'contract.bank', 'bank',
  '00000000-0000-4000-8000-000000002310', 'https://partner.test',
  'Attach the governed partner logo'
)), 2, 'partner update advances optimistic locking');
select throws_ok(
  $$select * from public.update_content_partner_v1(
    (select partner_id from created_partner), 1, 'contract.bank', 'bank',
    '00000000-0000-4000-8000-000000002310', 'https://partner.test', 'Stale partner update'
  )$$,
  '40001', 'content partner was modified by another editor', 'stale partner updates are rejected'
);
select throws_ok(
  $$select * from public.create_content_partner_v1(
    '00000000-0000-4000-8000-000000000100', 'invalid.url', 'partner', null, 'http://insecure.test'
  )$$,
  '22023', 'partner website must use HTTPS', 'insecure partner websites are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002302","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_content_partner_v1(
    '00000000-0000-4000-8000-000000000100', 'translator.bypass', 'partner', null, null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base partner records'
);
select is((select status from public.upsert_content_partner_translation_v1(
  (select partner_id from created_partner), 'en', 'Contract Bank',
  'English partner description', 'Create English partner copy'
)), 'draft'::public.translation_status, 'translator creates English partner content');
select is((select status from public.upsert_content_partner_translation_v1(
  (select partner_id from created_partner), 'fr', 'Banque Contractuelle',
  'French partner description', 'Create French partner copy'
)), 'draft'::public.translation_status, 'translator creates French partner content');
select throws_ok(
  $$select * from public.upsert_content_partner_translation_v1(
    (select partner_id from created_partner), 'ar', 'Disabled Arabic', '', 'Disabled locale attempt'
  )$$,
  '22023', 'enabled partner locale is required', 'disabled locales cannot receive partner content'
);
select is((select count(*) from public.content_partner_translations
  where partner_id = (select partner_id from created_partner)
    and created_by = '00000000-0000-4000-8000-000000002302'), 2::bigint,
  'partner translations record the translator actor');
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'en', 'in_review', 'Submit English partner copy'
)), 'in_review'::public.translation_status, 'translator submits English partner copy');
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'fr', 'in_review', 'Submit French partner copy'
)), 'in_review'::public.translation_status, 'translator submits French partner copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002301","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_content_partner_status_v1(
  (select partner_id from created_partner), 'in_review', 'Submit partner for review'
)), 'in_review'::public.publication_status, 'editor submits base partner content');
select is((select evidence_status from public.transition_content_partner_evidence_v1(
  (select partner_id from created_partner), 'submitted', 'Signed partnership agreement fixture',
  'Submit partner evidence'
)), 'submitted'::public.evidence_status, 'editor submits partner evidence');
select throws_ok(
  $$select * from public.transition_content_partner_evidence_v1(
    (select partner_id from created_partner), 'verified', 'Signed partnership agreement fixture',
    'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify partner evidence'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002303","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_content_partner_status_v1(
    (select partner_id from created_partner), 'approved', 'Unverified approval attempt'
  )$$,
  '23514', null, 'unverified evidence blocks partner approval'
);
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'en', 'approved', 'Approve English partner copy'
)), 'approved'::public.translation_status, 'publisher approves English partner copy');
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'fr', 'approved', 'Approve French partner copy'
)), 'approved'::public.translation_status, 'publisher approves French partner copy');
select is((select evidence_status from public.transition_content_partner_evidence_v1(
  (select partner_id from created_partner), 'verified', 'Signed partnership agreement fixture',
  'Verify partner evidence'
)), 'verified'::public.evidence_status, 'publisher verifies partner evidence');
select is((select approved_by from public.content_partners where id = (select partner_id from created_partner)), '00000000-0000-4000-8000-000000002303'::uuid, 'evidence verification records the publisher');
select is((select status from public.transition_content_partner_status_v1(
  (select partner_id from created_partner), 'approved', 'Approve verified partner'
)), 'approved'::public.publication_status, 'publisher approves the verified translation-complete partner');
select throws_ok(
  $$select * from public.transition_content_partner_status_v1(
    (select partner_id from created_partner), 'scheduled', 'Unsupported partner schedule'
  )$$,
  '23514', 'partner scheduling is not implemented', 'partner API never claims fake scheduling'
);
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'en', 'published', 'Publish English partner copy'
)), 'published'::public.translation_status, 'publisher publishes English partner copy');
select is((select status from public.transition_content_partner_translation_status_v1(
  (select partner_id from created_partner), 'fr', 'published', 'Publish French partner copy'
)), 'published'::public.translation_status, 'publisher publishes French partner copy');
select is((select status from public.transition_content_partner_status_v1(
  (select partner_id from created_partner), 'published', 'Publish verified partner'
)), 'published'::public.publication_status, 'publisher publishes the verified partner');
select is((select publication_status from public.search_cms_content_partners_v1(
  '00000000-0000-4000-8000-000000000100', 'bank', null, 'Banque', 10
) where partner_id = (select partner_id from created_partner)), 'published'::public.publication_status,
  'authorized partner search matches kind and localized query');
select is((select cardinality(warning_codes) from public.search_cms_content_partners_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, 50
) where partner_id = (select partner_id from created_partner)), 0,
  'published partner clears evidence, logo, and translation warnings');
reset role;

set local role anon;
select is((select count(*) from public.content_partners where id = (select partner_id from created_partner)), 1::bigint, 'anonymous query sees the published partner');
select is((select count(*) from public.content_partner_translations where partner_id = (select partner_id from created_partner)), 2::bigint, 'anonymous query sees both published partner translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('content_partners','content_partner_translations')) >= 9, 'partner and translation mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('content_partners','content_partner_translations')) >= 11, 'partner and translation mutations create attributable audit evidence');

select * from finish();
rollback;
