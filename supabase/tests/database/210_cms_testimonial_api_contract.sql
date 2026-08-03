begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(44);

select ok(not has_function_privilege('anon', 'public.search_cms_testimonials_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search testimonial drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_testimonials_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter testimonial search');
select ok(not has_table_privilege('authenticated', 'public.testimonials', 'insert'), 'direct authenticated testimonial inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.testimonials', 'update'), 'direct authenticated testimonial updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.testimonial_translations', 'insert'), 'direct authenticated testimonial translation inserts are revoked');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000002710',
  '00000000-0000-4000-8000-000000000100',
  'testimonial.contract-event', 'testimonial-contract-event', 'UTC'
);
insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type,
  alt_text, rights_holder, rights_source
) values (
  '00000000-0000-4000-8000-000000002711',
  '00000000-0000-4000-8000-000000000100', 'image', 'supabase',
  'testimonials/contract.webp', 'image/webp', 'Portrait of testimonial speaker',
  'Fixture owner', 'Signed speaker release'
);
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002701', 'authenticated', 'authenticated', 'testimonial-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002702', 'authenticated', 'authenticated', 'testimonial-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002703', 'authenticated', 'authenticated', 'testimonial-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002704', 'authenticated', 'authenticated', 'testimonial-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002701', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002702', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002703', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002704', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002703","role":"authenticated"}', true);
set local role authenticated;
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002711', 'in_review', 'Submit testimonial media');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002711', 'approved', 'Approve testimonial media');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002711', 'published', 'Publish testimonial media');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002704","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_testimonials_v1('00000000-0000-4000-8000-000000000100', null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect testimonial drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002701","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_testimonial on commit drop as
select * from public.create_testimonial_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002710', 'contract.exhibitor',
  'Amina Benali', 'Commercial Director', 'Atlas Habitat', null
);
grant select on created_testimonial to authenticated, anon;
select is((select status from created_testimonial), 'draft'::public.publication_status, 'editor creates a governed testimonial draft');
select is((select created_by from public.testimonials where id = (select testimonial_id from created_testimonial)), '00000000-0000-4000-8000-000000002701'::uuid, 'testimonial creation records the editor');
select is((select lock_version from created_testimonial), 1, 'new testimonial begins at lock version one');
select ok('evidence_unverified' = any(app_private.testimonial_warnings_v1((select testimonial_id from created_testimonial))), 'draft testimonial reports unverified evidence');
select ok('missing_consent_reference' = any(app_private.testimonial_warnings_v1((select testimonial_id from created_testimonial))), 'draft testimonial reports missing consent release');
select is((select lock_version from public.update_testimonial_v1(
  (select testimonial_id from created_testimonial), 1,
  '00000000-0000-4000-8000-000000002710', 'contract.exhibitor',
  'Amina Benali', 'Commercial Director', 'Atlas Habitat',
  '00000000-0000-4000-8000-000000002711', 'Attach governed testimonial media'
)), 2, 'testimonial update advances optimistic locking');
select throws_ok(
  $$select * from public.update_testimonial_v1(
    (select testimonial_id from created_testimonial), 1,
    '00000000-0000-4000-8000-000000002710', 'contract.exhibitor',
    'Amina Benali', null, 'Atlas Habitat', null, 'Stale testimonial update'
  )$$,
  '40001', 'testimonial was modified by another editor', 'stale testimonial updates are rejected'
);
select throws_ok(
  $$select * from public.create_testimonial_v1(
    '00000000-0000-4000-8000-000000000100', null, 'Invalid Key',
    'Amina Benali', null, 'Atlas Habitat', null
  )$$,
  '22023', 'valid testimonial key is required', 'invalid testimonial keys are rejected'
);
select throws_ok(
  $$select * from public.create_testimonial_v1(
    '00000000-0000-4000-8000-000000000100', null, 'missing.person',
    '', null, 'Atlas Habitat', null
  )$$,
  '22023', 'bounded testimonial attribution is required', 'unattributed testimonials are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002702","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_testimonial_v1(
    '00000000-0000-4000-8000-000000000100', null, 'translator.bypass',
    'Amina Benali', null, 'Atlas Habitat', null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base testimonials'
);
select is((select status from public.upsert_testimonial_translation_v1(
  (select testimonial_id from created_testimonial), 'en',
  'SPIMAR connected us with qualified buyers.',
  'Full English interview transcript.', 'Create English testimonial copy'
)), 'draft'::public.translation_status, 'translator creates English testimonial copy');
select is((select status from public.upsert_testimonial_translation_v1(
  (select testimonial_id from created_testimonial), 'fr',
  'SPIMAR nous a mis en relation avec des acheteurs qualifiés.',
  'Transcription complète en français.', 'Create French testimonial copy'
)), 'draft'::public.translation_status, 'translator creates French testimonial copy');
select throws_ok(
  $$select * from public.upsert_testimonial_translation_v1(
    (select testimonial_id from created_testimonial), 'en', '', null,
    'Attempt empty quote'
  )$$,
  '22023', 'valid bounded testimonial copy is required', 'empty testimonial quotes are rejected'
);
select throws_ok(
  $$select * from public.upsert_testimonial_translation_v1(
    (select testimonial_id from created_testimonial), 'ar', 'Disabled Arabic', null,
    'Attempt disabled locale'
  )$$,
  '22023', 'enabled testimonial locale is required', 'disabled locales cannot receive testimonial copy'
);
select is((select count(*) from public.testimonial_translations
  where testimonial_id = (select testimonial_id from created_testimonial)
    and created_by = '00000000-0000-4000-8000-000000002702'), 2::bigint,
  'testimonial translations record the translator actor');
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'en', 'in_review',
  'Submit English testimonial copy'
)), 'in_review'::public.translation_status, 'translator submits English testimonial copy');
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'fr', 'in_review',
  'Submit French testimonial copy'
)), 'in_review'::public.translation_status, 'translator submits French testimonial copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002701","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_testimonial_status_v1(
  (select testimonial_id from created_testimonial), 'in_review',
  'Submit testimonial for review'
)), 'in_review'::public.publication_status, 'editor submits base testimonial content');
select is((select evidence_status from public.transition_testimonial_evidence_v1(
  (select testimonial_id from created_testimonial), 'submitted',
  'Signed interview transcript revision 2', 'release:testimonial-2026-0042',
  'Submit testimonial evidence and release'
)), 'submitted'::public.evidence_status, 'editor submits testimonial evidence and consent release');
select is((select consent_reference from public.testimonials where id = (select testimonial_id from created_testimonial)), 'release:testimonial-2026-0042', 'testimonial consent reference is durable');
select throws_ok(
  $$select * from public.transition_testimonial_evidence_v1(
    (select testimonial_id from created_testimonial), 'verified',
    'Signed interview transcript revision 2', 'release:testimonial-2026-0042',
    'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify testimonial evidence or consent'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002703","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_testimonial_status_v1(
    (select testimonial_id from created_testimonial), 'approved',
    'Unverified testimonial approval attempt'
  )$$,
  '23514', null, 'unverified evidence blocks testimonial approval'
);
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'en', 'approved',
  'Approve English testimonial copy'
)), 'approved'::public.translation_status, 'publisher approves English testimonial copy');
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'fr', 'approved',
  'Approve French testimonial copy'
)), 'approved'::public.translation_status, 'publisher approves French testimonial copy');
select is((select evidence_status from public.transition_testimonial_evidence_v1(
  (select testimonial_id from created_testimonial), 'verified',
  'Signed interview transcript revision 2', 'release:testimonial-2026-0042',
  'Verify testimonial evidence and release'
)), 'verified'::public.evidence_status, 'publisher verifies testimonial evidence and consent');
select is((select approved_by from public.testimonials where id = (select testimonial_id from created_testimonial)), '00000000-0000-4000-8000-000000002703'::uuid, 'testimonial verification records the publisher');
select is((select status from public.transition_testimonial_status_v1(
  (select testimonial_id from created_testimonial), 'approved',
  'Approve verified testimonial'
)), 'approved'::public.publication_status, 'publisher approves the verified testimonial');
select throws_ok(
  $$select * from public.transition_testimonial_status_v1(
    (select testimonial_id from created_testimonial), 'scheduled',
    'Unsupported testimonial schedule'
  )$$,
  '23514', 'testimonial scheduling is not implemented', 'testimonial API never claims fake scheduling'
);
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'en', 'published',
  'Publish English testimonial copy'
)), 'published'::public.translation_status, 'publisher publishes English testimonial copy');
select is((select status from public.transition_testimonial_translation_status_v1(
  (select testimonial_id from created_testimonial), 'fr', 'published',
  'Publish French testimonial copy'
)), 'published'::public.translation_status, 'publisher publishes French testimonial copy');
select is((select status from public.transition_testimonial_status_v1(
  (select testimonial_id from created_testimonial), 'published',
  'Publish verified testimonial'
)), 'published'::public.publication_status, 'publisher publishes the verified testimonial');
select is((select publication_status from public.search_cms_testimonials_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002710', null, 'acheteurs', 10
) where testimonial_id = (select testimonial_id from created_testimonial)), 'published'::public.publication_status, 'testimonial search matches event and localized quote');
select is((select cardinality(warning_codes) from public.search_cms_testimonials_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, 50
) where testimonial_id = (select testimonial_id from created_testimonial)), 0, 'published testimonial clears evidence, consent, attribution, media, and translation warnings');
select throws_ok(
  $$select * from public.update_testimonial_v1(
    (select testimonial_id from created_testimonial),
    (select lock_version from public.testimonials where id = (select testimonial_id from created_testimonial)),
    '00000000-0000-4000-8000-000000002710', 'contract.exhibitor',
    'Amina Benali', 'Commercial Director', 'Atlas Habitat',
    '00000000-0000-4000-8000-000000002711', 'Protected published edit'
  )$$,
  '23514', 'testimonial must be draft before editing', 'published testimonials cannot be edited in place'
);
reset role;

set local role anon;
select is((select count(*) from public.testimonials where id = (select testimonial_id from created_testimonial)), 1::bigint, 'anonymous query sees the published testimonial');
select is((select count(*) from public.testimonial_translations where testimonial_id = (select testimonial_id from created_testimonial)), 2::bigint, 'anonymous query sees both published testimonial translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('testimonials','testimonial_translations')) >= 9, 'testimonial mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('testimonials','testimonial_translations')) >= 11, 'testimonial mutations create attributable audit evidence');

select * from finish();
rollback;
