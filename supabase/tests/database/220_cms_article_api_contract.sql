begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(43);

select ok(not has_function_privilege('anon', 'public.search_cms_articles_v1(uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search article drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_articles_v1(uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter article search');
select ok(not has_table_privilege('authenticated', 'public.articles', 'insert'), 'direct authenticated article inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.articles', 'update'), 'direct authenticated article updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.article_translations', 'insert'), 'direct authenticated article translation inserts are revoked');

insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type,
  alt_text, rights_holder, rights_source
) values (
  '00000000-0000-4000-8000-000000002811',
  '00000000-0000-4000-8000-000000000100', 'image', 'supabase',
  'articles/contract.webp', 'image/webp', 'SPIMAR insight cover',
  'Fixture owner', 'Commissioned article artwork'
);
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002801', 'authenticated', 'authenticated', 'article-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002802', 'authenticated', 'authenticated', 'article-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002803', 'authenticated', 'authenticated', 'article-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002804', 'authenticated', 'authenticated', 'article-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002801', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002802', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000002803', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002804', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002803","role":"authenticated"}', true);
set local role authenticated;
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002811', 'in_review', 'Submit article cover');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002811', 'approved', 'Approve article cover');
select public.transition_media_status_v1('00000000-0000-4000-8000-000000002811', 'published', 'Publish article cover');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002804","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_articles_v1('00000000-0000-4000-8000-000000000100', null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect article drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002801","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_article on commit drop as
select * from public.create_article_v1(
  '00000000-0000-4000-8000-000000000100',
  'morocco-property-outlook', null
);
grant select on created_article to authenticated, anon;
select is((select status from created_article), 'draft'::public.publication_status, 'editor creates a governed article draft');
select is((select created_by from public.articles where id = (select article_id from created_article)), '00000000-0000-4000-8000-000000002801'::uuid, 'article creation records the editor');
select is((select lock_version from created_article), 1, 'new article begins at lock version one');
select ok('missing_translation:en' = any(app_private.article_warnings_v1((select article_id from created_article))), 'draft article reports missing enabled-locale copy');
select is((select lock_version from public.update_article_v1(
  (select article_id from created_article), 1, 'morocco-property-outlook',
  '00000000-0000-4000-8000-000000002811', 'Attach governed article cover'
)), 2, 'article update advances optimistic locking');
select throws_ok(
  $$select * from public.update_article_v1(
    (select article_id from created_article), 1, 'morocco-property-outlook', null,
    'Stale article update'
  )$$,
  '40001', 'article was modified by another editor', 'stale article updates are rejected'
);
select throws_ok(
  $$select * from public.create_article_v1(
    '00000000-0000-4000-8000-000000000100', 'Invalid Slug', null
  )$$,
  '22023', 'valid article slug is required', 'invalid article slugs are rejected'
);
select throws_ok(
  $$select * from public.create_article_v1(
    '00000000-0000-4000-8000-000000000100', 'missing-media',
    '00000000-0000-4000-8000-000000002899'
  )$$,
  '22023', 'article media must be a same-site image', 'unknown article media is rejected'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002802","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_article_v1(
    '00000000-0000-4000-8000-000000000100', 'translator-bypass', null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base articles'
);
select is((select status from public.upsert_article_translation_v1(
  (select article_id from created_article), 'en',
  'Morocco property outlook', 'A verified view of the next market cycle.',
  '{"blocks":[{"type":"paragraph","text":"Qualified market analysis."}]}'::jsonb,
  'Create English article copy'
)), 'draft'::public.translation_status, 'translator creates English article copy');
select is((select status from public.upsert_article_translation_v1(
  (select article_id from created_article), 'fr',
  'Perspectives immobiliÃ¨res au Maroc', 'Une analyse vÃ©rifiÃ©e du prochain cycle.',
  '{"blocks":[{"type":"paragraph","text":"Analyse qualifiÃ©e du marchÃ©."}]}'::jsonb,
  'Create French article copy'
)), 'draft'::public.translation_status, 'translator creates French article copy');
select throws_ok(
  $$select * from public.upsert_article_translation_v1(
    (select article_id from created_article), 'en', 'Title', '',
    '{"blocks":[1]}'::jsonb, 'Attempt empty excerpt'
  )$$,
  '22023', 'valid bounded article copy is required', 'empty article excerpts are rejected'
);
select throws_ok(
  $$select * from public.upsert_article_translation_v1(
    (select article_id from created_article), 'en', 'Title', 'Excerpt',
    '{}'::jsonb, 'Attempt empty body'
  )$$,
  '22023', 'valid bounded article copy is required', 'empty structured article bodies are rejected'
);
select throws_ok(
  $$select * from public.upsert_article_translation_v1(
    (select article_id from created_article), 'ar', 'Arabic', 'Disabled locale',
    '{"blocks":[1]}'::jsonb, 'Attempt disabled locale'
  )$$,
  '22023', 'enabled article locale is required', 'disabled locales cannot receive article copy'
);
select is((select count(*) from public.article_translations
  where article_id = (select article_id from created_article)
    and created_by = '00000000-0000-4000-8000-000000002802'), 2::bigint,
  'article translations record the translator actor');
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'en', 'in_review',
  'Submit English article copy'
)), 'in_review'::public.translation_status, 'translator submits English article copy');
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'fr', 'in_review',
  'Submit French article copy'
)), 'in_review'::public.translation_status, 'translator submits French article copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002801","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_article_status_v1(
  (select article_id from created_article), 'in_review', null,
  'Submit article for review'
)), 'in_review'::public.publication_status, 'editor submits base article content');
select throws_ok(
  $$select * from public.transition_article_status_v1(
    (select article_id from created_article), 'approved', null,
    'Editor approval attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot approve article content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002803","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_article_status_v1(
    (select article_id from created_article), 'approved', null,
    'Incomplete article approval attempt'
  )$$,
  '23514', 'article is incomplete', 'unapproved localized copy blocks article approval'
);
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'en', 'approved',
  'Approve English article copy'
)), 'approved'::public.translation_status, 'publisher approves English article copy');
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'fr', 'approved',
  'Approve French article copy'
)), 'approved'::public.translation_status, 'publisher approves French article copy');
select is((select status from public.transition_article_status_v1(
  (select article_id from created_article), 'approved', null,
  'Approve complete article'
)), 'approved'::public.publication_status, 'publisher approves complete article content');
select throws_ok(
  $$select * from public.transition_article_status_v1(
    (select article_id from created_article), 'scheduled', null,
    'Attempt schedule without time'
  )$$,
  '22023', 'future publish time is required for scheduling', 'article scheduling requires a future time'
);
select is((select status from public.transition_article_status_v1(
  (select article_id from created_article), 'scheduled', now() + interval '1 day',
  'Schedule complete article'
)), 'scheduled'::public.publication_status, 'publisher truthfully schedules complete article content');
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'en', 'published',
  'Publish English article copy'
)), 'published'::public.translation_status, 'publisher publishes English article copy');
select is((select status from public.transition_article_translation_status_v1(
  (select article_id from created_article), 'fr', 'published',
  'Publish French article copy'
)), 'published'::public.translation_status, 'publisher publishes French article copy');
select throws_ok(
  $$select * from public.transition_article_status_v1(
    (select article_id from created_article), 'published', null,
    'Attempt publication before due time'
  )$$,
  '23514', 'scheduled content cannot publish before publish_at', 'scheduled article cannot publish before its due time'
);
reset role;
update public.articles set publish_at = now() - interval '1 second'
where id = (select article_id from created_article);
set local role authenticated;
select is((select status from public.transition_article_status_v1(
  (select article_id from created_article), 'published', null,
  'Publish scheduled article'
)), 'published'::public.publication_status, 'publisher publishes the scheduled article');
select ok((select published_at is not null from public.articles where id = (select article_id from created_article)), 'article publication receives a server timestamp');
select is((select publication_status from public.search_cms_articles_v1(
  '00000000-0000-4000-8000-000000000100', null, 'immobili', 10
) where article_id = (select article_id from created_article)), 'published'::public.publication_status, 'article search matches localized titles and excerpts');
select is((select cardinality(warning_codes) from public.search_cms_articles_v1(
  '00000000-0000-4000-8000-000000000100', null, null, 50
) where article_id = (select article_id from created_article)), 0, 'published article clears media and translation warnings');
select throws_ok(
  $$select * from public.update_article_v1(
    (select article_id from created_article),
    (select lock_version from public.articles where id = (select article_id from created_article)),
    'morocco-property-outlook', '00000000-0000-4000-8000-000000002811',
    'Protected published edit'
  )$$,
  '23514', 'article must be draft before editing', 'published articles cannot be edited in place'
);
reset role;

set local role anon;
select is((select count(*) from public.articles where id = (select article_id from created_article)), 1::bigint, 'anonymous query sees the published article');
select is((select count(*) from public.article_translations where article_id = (select article_id from created_article)), 2::bigint, 'anonymous query sees both published article translations');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in ('articles','article_translations')) >= 9, 'article mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in ('articles','article_translations')) >= 11, 'article mutations create attributable audit evidence');

select * from finish();
rollback;
