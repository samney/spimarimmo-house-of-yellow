begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(27);

select ok(
  not has_function_privilege('anon', 'public.create_page_draft_v1(uuid,text,text,text)', 'execute'),
  'anonymous callers cannot execute CMS draft creation'
);
select ok(
  has_function_privilege('authenticated', 'public.create_page_draft_v1(uuid,text,text,text)', 'execute'),
  'authenticated staff may enter the permission-checked CMS transaction'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001301', 'authenticated', 'authenticated', 'cms-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001302', 'authenticated', 'authenticated', 'cms-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001303', 'authenticated', 'authenticated', 'cms-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001301', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001302', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000001303', null, 'super_admin');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001301","role":"authenticated"}', true);
set local role authenticated;
create temporary table cms_page on commit drop as
select * from public.create_page_draft_v1(
  '00000000-0000-4000-8000-000000000100',
  'cms.contract',
  'landing',
  'cms-contract'
);
grant select on cms_page to authenticated, anon;
select pass('content editor creates a governed page draft');
select is((select status from cms_page), 'draft'::public.publication_status, 'new CMS page begins draft');
select is(
  (select created_by from public.pages where id = (select page_id from cms_page)),
  '00000000-0000-4000-8000-000000001301'::uuid,
  'page creation records the authenticated editor'
);
select is(
  (
    select lock_version
    from public.update_page_draft_v1(
      (select page_id from cms_page), 1, 'cms.contract', 'landing', 'cms-contract-updated', 'Correct initial slug'
    )
  ),
  2,
  'draft update advances the optimistic lock version'
);
select throws_ok(
  format(
    'select * from public.update_page_draft_v1(%L, 1, %L, %L, %L, %L)',
    (select page_id from cms_page), 'cms.contract', 'landing', 'stale-update', 'Stale editor attempt'
  ),
  '40001',
  'page was modified by another editor',
  'stale draft update is rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001302","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_page_draft_v1(
    '00000000-0000-4000-8000-000000000100', 'cms.translator-denied', 'landing', 'translator-denied'
  )$$,
  '42501',
  'content.write permission required',
  'translator cannot create base content'
);
select lives_ok(
  format(
    'select * from public.upsert_page_translation_v1(%L, ''en'', ''CMS contract'', ''English summary'', ''Create English copy'')',
    (select page_id from cms_page)
  ),
  'translator creates English copy'
);
select lives_ok(
  format(
    'select * from public.upsert_page_translation_v1(%L, ''fr'', ''Contrat CMS'', ''Résumé français'', ''Create French copy'')',
    (select page_id from cms_page)
  ),
  'translator creates French copy'
);
select is(
  (
    select count(*)
    from public.page_translations
    where page_id = (select page_id from cms_page)
      and created_by = '00000000-0000-4000-8000-000000001302'
  ),
  2::bigint,
  'translation creation records the translator'
);
select lives_ok(
  format(
    'select * from public.transition_page_translation_status_v1(%L, ''en'', ''in_review'', ''English copy ready''); '
    || 'select * from public.transition_page_translation_status_v1(%L, ''fr'', ''in_review'', ''French copy ready'')',
    (select page_id from cms_page),
    (select page_id from cms_page)
  ),
  'translator submits all enabled locales for review'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001301","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.transition_page_status_v1(%L, ''in_review'', ''Base page ready for review'', null)',
    (select page_id from cms_page)
  ),
  'editor submits the base page for review'
);
select throws_ok(
  format(
    'select * from public.transition_page_status_v1(%L, ''approved'', ''Editor self approval denied'', null)',
    (select page_id from cms_page)
  ),
  '42501',
  'content.publish permission required',
  'editor cannot self-approve content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001303","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.transition_page_status_v1(%L, ''approved'', ''Publisher approves base page'', null)',
    (select page_id from cms_page)
  ),
  'publisher approves the base page'
);
select lives_ok(
  format(
    'select * from public.transition_page_translation_status_v1(%L, ''en'', ''approved'', ''Approve English copy''); '
    || 'select * from public.transition_page_translation_status_v1(%L, ''fr'', ''approved'', ''Approve French copy'')',
    (select page_id from cms_page),
    (select page_id from cms_page)
  ),
  'publisher approves all enabled translations'
);
select lives_ok(
  format(
    'select * from public.transition_page_translation_status_v1(%L, ''en'', ''published'', ''Publish English copy''); '
    || 'select * from public.transition_page_translation_status_v1(%L, ''fr'', ''published'', ''Publish French copy'')',
    (select page_id from cms_page),
    (select page_id from cms_page)
  ),
  'publisher publishes all enabled translations'
);
select lives_ok(
  format(
    'select * from public.transition_page_status_v1(%L, ''published'', ''Publish complete page'', null)',
    (select page_id from cms_page)
  ),
  'publisher publishes the translation-complete page'
);
select is(
  (select status from public.pages where id = (select page_id from cms_page)),
  'published'::public.publication_status,
  'base page reaches published state'
);
select throws_ok(
  format(
    'update public.pages set slug = ''forbidden-live-edit'' where id = %L',
    (select page_id from cms_page)
  ),
  '23514',
  'protected content must re-enter an editable workflow state before editing',
  'published base content cannot be edited in place'
);
select throws_ok(
  format(
    'update public.page_translations set title = ''Forbidden live edit'' where page_id = %L and locale = ''en''',
    (select page_id from cms_page)
  ),
  '23514',
  'protected translation must return to draft before editing',
  'published translation cannot be edited in place'
);
reset role;

set local role anon;
select is(
  (select count(*) from public.pages where id = (select page_id from cms_page)),
  1::bigint,
  'anonymous public query sees the published page'
);
select is(
  (select count(*) from public.page_translations where page_id = (select page_id from cms_page)),
  2::bigint,
  'anonymous public query sees both published translations'
);
reset role;

select ok(
  (select count(*) >= 4 from public.content_revisions where entity_id = (select page_id from cms_page)),
  'page mutations create immutable revision snapshots'
);
select ok(
  (
    select count(*) >= 4
    from public.audit_events
    where domain = 'cms' and entity_id = (select page_id from cms_page)::text
  ),
  'page mutations create CMS audit events'
);
select ok(
  (select lock_version >= 5 from public.pages where id = (select page_id from cms_page)),
  'all page workflow changes advance optimistic lock metadata'
);
select is(
  (select updated_by from public.pages where id = (select page_id from cms_page)),
  '00000000-0000-4000-8000-000000001303'::uuid,
  'last authenticated publisher is recorded on the page'
);

select set_config('request.jwt.claims', '{}', true);
select * from finish();
rollback;
