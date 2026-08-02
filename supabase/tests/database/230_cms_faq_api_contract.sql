begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(40);

select ok(not has_function_privilege('anon', 'public.search_cms_faqs_v1(uuid,uuid,text,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search FAQ drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_faqs_v1(uuid,uuid,text,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter FAQ search');
select ok(not has_table_privilege('authenticated', 'public.faqs', 'insert'), 'direct authenticated FAQ inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.faqs', 'update'), 'direct authenticated FAQ updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.faq_translations', 'insert'), 'direct authenticated FAQ translation inserts are revoked');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000002910',
  '00000000-0000-4000-8000-000000000100',
  'faq.contract-event', 'faq-contract-event', 'UTC'
);
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002901', 'authenticated', 'authenticated', 'faq-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002902', 'authenticated', 'authenticated', 'faq-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002903', 'authenticated', 'authenticated', 'faq-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002904', 'authenticated', 'authenticated', 'faq-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002901', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002902', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002903', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002904', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002904","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_faqs_v1('00000000-0000-4000-8000-000000000100', null, null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect FAQ drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002901","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_faq on commit drop as
select * from public.create_faq_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002910',
  'exhibitor.registration', 'exhibitor', 10
);
grant select on created_faq to authenticated, anon;
select is((select status from created_faq), 'draft'::public.publication_status, 'editor creates a governed FAQ draft');
select is((select created_by from public.faqs where id = (select faq_id from created_faq)), '00000000-0000-4000-8000-000000002901'::uuid, 'FAQ creation records the editor');
select is((select lock_version from created_faq), 1, 'new FAQ begins at lock version one');
select ok('missing_translation:en' = any(app_private.faq_warnings_v1((select faq_id from created_faq))), 'draft FAQ reports missing enabled-locale copy');
select is((select lock_version from public.update_faq_v1(
  (select faq_id from created_faq), 1,
  '00000000-0000-4000-8000-000000002910',
  'exhibitor.registration', 'exhibitor', 20, 'Correct FAQ ordering'
)), 2, 'FAQ update advances optimistic locking');
select throws_ok(
  $$select * from public.update_faq_v1(
    (select faq_id from created_faq), 1,
    '00000000-0000-4000-8000-000000002910',
    'exhibitor.registration', 'exhibitor', 20, 'Stale FAQ update'
  )$$,
  '40001', 'FAQ was modified by another editor', 'stale FAQ updates are rejected'
);
select throws_ok(
  $$select * from public.create_faq_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'Invalid Key', 'general', 0
  )$$,
  '22023', 'valid FAQ key is required', 'invalid FAQ keys are rejected'
);
select throws_ok(
  $$select * from public.create_faq_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'invalid.audience', 'press', 0
  )$$,
  '22023', 'valid FAQ audience is required', 'unknown FAQ audiences are rejected'
);
select throws_ok(
  $$select * from public.create_faq_v1(
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000002999',
    'invalid.event', 'general', 0
  )$$,
  '22023', 'event must belong to the FAQ site', 'unknown FAQ events are rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002902","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_faq_v1(
    '00000000-0000-4000-8000-000000000100', null,
    'translator.bypass', 'general', 0
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base FAQs'
);
select is((select status from public.upsert_faq_translation_v1(
  (select faq_id from created_faq), 'en', 'How do I register as an exhibitor?',
  '{"blocks":[{"type":"paragraph","text":"Complete the verified application form."}]}'::jsonb,
  'Create English FAQ copy'
)), 'draft'::public.translation_status, 'translator creates English FAQ copy');
select is((select status from public.upsert_faq_translation_v1(
  (select faq_id from created_faq), 'fr', 'Comment devenir exposant ?',
  '{"blocks":[{"type":"paragraph","text":"Remplissez le formulaire de candidature."}]}'::jsonb,
  'Create French FAQ copy'
)), 'draft'::public.translation_status, 'translator creates French FAQ copy');
select throws_ok(
  $$select * from public.upsert_faq_translation_v1(
    (select faq_id from created_faq), 'en', '', '{"blocks":[1]}'::jsonb,
    'Attempt empty question'
  )$$,
  '22023', 'valid bounded FAQ copy is required', 'empty FAQ questions are rejected'
);
select throws_ok(
  $$select * from public.upsert_faq_translation_v1(
    (select faq_id from created_faq), 'en', 'Question', '{}'::jsonb,
    'Attempt empty answer'
  )$$,
  '22023', 'valid bounded FAQ copy is required', 'empty FAQ answers are rejected'
);
select throws_ok(
  $$select * from public.upsert_faq_translation_v1(
    (select faq_id from created_faq), 'ar', 'Arabic', '{"blocks":[1]}'::jsonb,
    'Attempt disabled locale'
  )$$,
  '22023', 'enabled FAQ locale is required', 'disabled locales cannot receive FAQ copy'
);
select is((select count(*) from public.faq_translations
  where faq_id = (select faq_id from created_faq)
    and created_by = '00000000-0000-4000-8000-000000002902'), 2::bigint,
  'FAQ translations record the translator actor');
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'en', 'in_review', 'Submit English FAQ copy'
)), 'in_review'::public.translation_status, 'translator submits English FAQ copy');
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'fr', 'in_review', 'Submit French FAQ copy'
)), 'in_review'::public.translation_status, 'translator submits French FAQ copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002901","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_faq_status_v1(
  (select faq_id from created_faq), 'in_review', 'Submit FAQ for review'
)), 'in_review'::public.publication_status, 'editor submits base FAQ content');
select throws_ok(
  $$select * from public.transition_faq_status_v1(
    (select faq_id from created_faq), 'approved', 'Editor approval attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot approve FAQ content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002903","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_faq_status_v1(
    (select faq_id from created_faq), 'approved', 'Incomplete FAQ approval attempt'
  )$$,
  '23514', 'FAQ is incomplete', 'unapproved localized copy blocks FAQ approval'
);
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'en', 'approved', 'Approve English FAQ copy'
)), 'approved'::public.translation_status, 'publisher approves English FAQ copy');
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'fr', 'approved', 'Approve French FAQ copy'
)), 'approved'::public.translation_status, 'publisher approves French FAQ copy');
select is((select status from public.transition_faq_status_v1(
  (select faq_id from created_faq), 'approved', 'Approve complete FAQ'
)), 'approved'::public.publication_status, 'publisher approves complete FAQ content');
select throws_ok(
  $$select * from public.transition_faq_status_v1(
    (select faq_id from created_faq), 'scheduled', 'Unsupported FAQ schedule'
  )$$,
  '23514', 'FAQ scheduling is not implemented', 'FAQ API never claims fake scheduling'
);
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'en', 'published', 'Publish English FAQ copy'
)), 'published'::public.translation_status, 'publisher publishes English FAQ copy');
select is((select status from public.transition_faq_translation_status_v1(
  (select faq_id from created_faq), 'fr', 'published', 'Publish French FAQ copy'
)), 'published'::public.translation_status, 'publisher publishes French FAQ copy');
select is((select status from public.transition_faq_status_v1(
  (select faq_id from created_faq), 'published', 'Publish complete FAQ'
)), 'published'::public.publication_status, 'publisher publishes complete FAQ content');
select is((select publication_status from public.search_cms_faqs_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002910', 'exhibitor', null, 'exposant', 10
) where faq_id = (select faq_id from created_faq)), 'published'::public.publication_status, 'FAQ search matches event, audience, and localized question');
select is((select cardinality(warning_codes) from public.search_cms_faqs_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, null, 50
) where faq_id = (select faq_id from created_faq)), 0, 'published FAQ clears localization warnings');
reset role;

set local role anon;
select is((select count(*) from public.faqs where id = (select faq_id from created_faq)), 1::bigint, 'anonymous query sees the published FAQ');
select is((select count(*) from public.faq_translations where faq_id = (select faq_id from created_faq)), 2::bigint, 'anonymous query sees both published FAQ translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('faqs','faq_translations')) >= 9, 'FAQ mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('faqs','faq_translations')) >= 11, 'FAQ mutations create attributable audit evidence');

select * from finish();
rollback;
