begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(44);

select ok(not has_function_privilege('anon', 'public.search_cms_venues_v1(uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search venue drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_venues_v1(uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter venue search');
select ok(not has_table_privilege('authenticated', 'public.venues', 'insert'), 'direct authenticated venue inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.venues', 'update'), 'direct authenticated venue updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.venue_translations', 'insert'), 'direct authenticated venue translation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.venue_translations', 'update'), 'direct authenticated venue translation updates are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003001', 'authenticated', 'authenticated', 'venue-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003002', 'authenticated', 'authenticated', 'venue-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003003', 'authenticated', 'authenticated', 'venue-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003004', 'authenticated', 'authenticated', 'venue-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000003001', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000003002', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000003003', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000003004', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003004","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_venues_v1('00000000-0000-4000-8000-000000000100', null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect venue drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003001","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_venue on commit drop as
select * from public.create_venue_v1(
  '00000000-0000-4000-8000-000000000100', 'casablanca.expo',
  'Rue de la Foire', null, 'Casablanca', 'Casablanca-Settat', 'MA', '20000',
  33.573100, -7.589800, 'Africa/Casablanca'
);
grant select on created_venue to authenticated, anon;
select is((select status from created_venue), 'draft'::public.publication_status, 'editor creates a governed venue draft');
select is((select created_by from public.venues where id = (select venue_id from created_venue)), '00000000-0000-4000-8000-000000003001'::uuid, 'venue creation records the editor');
select is((select lock_version from created_venue), 1, 'new venue begins at lock version one');
select ok('missing_translation:en' = any(app_private.venue_warnings_v1((select venue_id from created_venue))), 'draft venue reports missing enabled-locale copy');
select is((select lock_version from public.update_venue_v1(
  (select venue_id from created_venue), 1, 'casablanca.expo',
  'Rue de la Foire', 'Hall A', 'Casablanca', 'Casablanca-Settat', 'MA', '20000',
  33.573200, -7.589900, 'Africa/Casablanca', 'Correct venue location metadata'
)), 2, 'venue update advances optimistic locking');
select is((select latitude from public.venues where id = (select venue_id from created_venue)), 33.573200::numeric, 'venue update stores the governed coordinate pair');
select throws_ok(
  $$select * from public.update_venue_v1(
    (select venue_id from created_venue), 1, 'casablanca.expo',
    'Rue de la Foire', null, 'Casablanca', null, 'MA', null,
    33.573200, -7.589900, 'Africa/Casablanca', 'Stale venue update'
  )$$,
  '40001', 'venue was modified by another editor', 'stale venue updates are rejected'
);
select throws_ok(
  $$select * from public.create_venue_v1(
    '00000000-0000-4000-8000-000000000100', 'Invalid Key',
    'Address', null, 'City', null, 'MA', null, null, null, 'UTC'
  )$$,
  '22023', 'valid venue key is required', 'invalid venue keys are rejected'
);
select throws_ok(
  $$select * from public.create_venue_v1(
    '00000000-0000-4000-8000-000000000100', 'invalid.address',
    '', null, 'City', null, 'MA', null, null, null, 'UTC'
  )$$,
  '22023', 'valid venue address is required', 'empty venue addresses are rejected'
);
select throws_ok(
  $$select * from public.create_venue_v1(
    '00000000-0000-4000-8000-000000000100', 'invalid.country',
    'Address', null, 'City', null, 'ma', null, null, null, 'UTC'
  )$$,
  '22023', 'valid venue country code is required', 'non-ISO venue country codes are rejected'
);
select throws_ok(
  $$select * from public.create_venue_v1(
    '00000000-0000-4000-8000-000000000100', 'invalid.coordinates',
    'Address', null, 'City', null, 'MA', null, 33.57, null, 'UTC'
  )$$,
  '22023', 'valid venue coordinate pair is required', 'partial venue coordinates are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003002","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_venue_v1(
    '00000000-0000-4000-8000-000000000100', 'translator.bypass',
    'Address', null, 'City', null, 'MA', null, null, null, 'UTC'
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base venues'
);
select is((select status from public.upsert_venue_translation_v1(
  (select venue_id from created_venue), 'en', 'Casablanca Expo Centre',
  'Use the eastern exhibitor entrance.', 'Step-free access is available.',
  'Create English venue copy'
)), 'draft'::public.translation_status, 'translator creates English venue copy');
select is((select status from public.upsert_venue_translation_v1(
  (select venue_id from created_venue), 'fr', 'Centre Expo Casablanca',
  'Utilisez l entree est des exposants.', 'Un acces sans marche est disponible.',
  'Create French venue copy'
)), 'draft'::public.translation_status, 'translator creates French venue copy');
select throws_ok(
  $$select * from public.upsert_venue_translation_v1(
    (select venue_id from created_venue), 'en', '', '', '', 'Attempt empty venue name'
  )$$,
  '22023', 'valid bounded venue translation is required', 'empty venue names are rejected'
);
select throws_ok(
  $$select * from public.upsert_venue_translation_v1(
    (select venue_id from created_venue), 'ar', 'Arabic venue', '', '', 'Attempt disabled locale'
  )$$,
  '22023', 'enabled venue locale is required', 'disabled locales cannot receive venue copy'
);
select is((select count(*) from public.venue_translations
  where venue_id = (select venue_id from created_venue)
    and created_by = '00000000-0000-4000-8000-000000003002'), 2::bigint,
  'venue translations record the translator actor');
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'en', 'in_review', 'Submit English venue copy'
)), 'in_review'::public.translation_status, 'translator submits English venue copy');
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'fr', 'in_review', 'Submit French venue copy'
)), 'in_review'::public.translation_status, 'translator submits French venue copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003001","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_venue_status_v1(
  (select venue_id from created_venue), 'in_review', 'Submit venue for review'
)), 'in_review'::public.publication_status, 'editor submits base venue content');
select throws_ok(
  $$select * from public.transition_venue_status_v1(
    (select venue_id from created_venue), 'approved', 'Editor approval attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot approve venue content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003003","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_venue_status_v1(
    (select venue_id from created_venue), 'approved', 'Incomplete venue approval attempt'
  )$$,
  '23514', 'venue is incomplete', 'unapproved localized copy blocks venue approval'
);
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'en', 'approved', 'Approve English venue copy'
)), 'approved'::public.translation_status, 'publisher approves English venue copy');
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'fr', 'approved', 'Approve French venue copy'
)), 'approved'::public.translation_status, 'publisher approves French venue copy');
select is((select status from public.transition_venue_status_v1(
  (select venue_id from created_venue), 'approved', 'Approve complete venue'
)), 'approved'::public.publication_status, 'publisher approves complete venue content');
select throws_ok(
  $$select * from public.transition_venue_status_v1(
    (select venue_id from created_venue), 'scheduled', 'Unsupported venue schedule'
  )$$,
  '23514', 'venue scheduling is not implemented', 'venue API never claims fake scheduling'
);
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'en', 'published', 'Publish English venue copy'
)), 'published'::public.translation_status, 'publisher publishes English venue copy');
select is((select status from public.transition_venue_translation_status_v1(
  (select venue_id from created_venue), 'fr', 'published', 'Publish French venue copy'
)), 'published'::public.translation_status, 'publisher publishes French venue copy');
select is((select status from public.transition_venue_status_v1(
  (select venue_id from created_venue), 'published', 'Publish complete venue'
)), 'published'::public.publication_status, 'publisher publishes complete venue content');
select is((select publication_status from public.search_cms_venues_v1(
  '00000000-0000-4000-8000-000000000100', 'published', 'Centre Expo', 10
) where venue_id = (select venue_id from created_venue)), 'published'::public.publication_status, 'venue search matches localized names and status');
select is((select cardinality(warning_codes) from public.search_cms_venues_v1(
  '00000000-0000-4000-8000-000000000100', null, null, 50
) where venue_id = (select venue_id from created_venue)), 0, 'published venue clears location and localization warnings');
select throws_ok(
  $$select * from public.search_cms_venues_v1(
    '00000000-0000-4000-8000-000000000100', null, null, 101
  )$$,
  '22023', 'limit must be between 1 and 100', 'venue search rejects unsafe limits'
);
select throws_ok(
  $$select * from public.update_venue_v1(
    (select venue_id from created_venue), 6, 'casablanca.expo',
    'Rue de la Foire', 'Hall A', 'Casablanca', 'Casablanca-Settat', 'MA', '20000',
    33.573200, -7.589900, 'Africa/Casablanca', 'Published venue edit attempt'
  )$$,
  '23514', 'venue must be draft before editing', 'published venue metadata cannot change silently'
);
reset role;

set local role anon;
select is((select count(*) from public.venues where id = (select venue_id from created_venue)), 1::bigint, 'anonymous query sees the published venue');
select is((select count(*) from public.venue_translations where venue_id = (select venue_id from created_venue)), 2::bigint, 'anonymous query sees both published venue translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('venues','venue_translations')) >= 9, 'venue mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('venues','venue_translations')) >= 12, 'venue mutations create attributable audit evidence');

select * from finish();
rollback;
