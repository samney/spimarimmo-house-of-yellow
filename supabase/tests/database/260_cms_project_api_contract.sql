begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(66);

select ok(not has_function_privilege('anon', 'public.search_cms_projects_v1(uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search project drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_projects_v1(uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter project search');
select ok(not has_function_privilege('anon', 'public.cms_project_workspace_v1(uuid)', 'execute'), 'anonymous callers cannot inspect the project workspace');
select ok(not has_table_privilege('authenticated', 'public.projects', 'insert'), 'direct authenticated project inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.projects', 'update'), 'direct authenticated project updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_translations', 'insert'), 'direct authenticated project translation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_category_links', 'insert'), 'direct authenticated project category links are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_tag_links', 'insert'), 'direct authenticated project tag links are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_metrics', 'insert'), 'direct authenticated project metric inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_credits', 'insert'), 'direct authenticated project credit inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_relations', 'insert'), 'direct authenticated project relation inserts are revoked');

insert into public.media_assets (
  id, site_id, kind, storage_provider, storage_key, mime_type,
  alt_text, rights_holder, rights_source
) values (
  '00000000-0000-4000-8000-000000003213',
  '00000000-0000-4000-8000-000000000100', 'image', 'supabase',
  'projects/contract.webp', 'image/webp', 'SPIMAR portfolio project',
  'Fixture owner', 'Commissioned project artwork'
);
update public.media_assets set status = 'in_review' where id = '00000000-0000-4000-8000-000000003213';
update public.media_assets set status = 'approved' where id = '00000000-0000-4000-8000-000000003213';
update public.media_assets set status = 'published' where id = '00000000-0000-4000-8000-000000003213';

insert into public.industries (id, site_id, slug) values
  ('00000000-0000-4000-8000-000000003210', '00000000-0000-4000-8000-000000000100', 'hospitality-real-estate');
insert into public.industry_translations (site_id, industry_id, locale, name, description) values
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003210', 'en', 'Hospitality real estate', 'Hotels and destination assets.'),
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003210', 'fr', 'Immobilier hotelier', 'Hotels et actifs de destination.');
update public.industries set status = 'in_review' where id = '00000000-0000-4000-8000-000000003210';
update public.industry_translations set status = 'in_review' where industry_id = '00000000-0000-4000-8000-000000003210';
update public.industry_translations set status = 'approved' where industry_id = '00000000-0000-4000-8000-000000003210';
update public.industries set status = 'approved' where id = '00000000-0000-4000-8000-000000003210';
update public.industry_translations set status = 'published' where industry_id = '00000000-0000-4000-8000-000000003210';
update public.industries set status = 'published' where id = '00000000-0000-4000-8000-000000003210';

insert into public.project_categories (id, site_id, slug, position) values
  ('00000000-0000-4000-8000-000000003211', '00000000-0000-4000-8000-000000000100', 'featured-projects', 10),
  ('00000000-0000-4000-8000-000000003214', '00000000-0000-4000-8000-000000000100', 'draft-projects', 20);
insert into public.project_category_translations (site_id, category_id, locale, name) values
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003211', 'en', 'Featured projects'),
  ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003211', 'fr', 'Projets selectionnes');
update public.project_categories set status = 'in_review' where id = '00000000-0000-4000-8000-000000003211';
update public.project_category_translations set status = 'in_review' where category_id = '00000000-0000-4000-8000-000000003211';
update public.project_category_translations set status = 'approved' where category_id = '00000000-0000-4000-8000-000000003211';
update public.project_categories set status = 'approved' where id = '00000000-0000-4000-8000-000000003211';
update public.project_category_translations set status = 'published' where category_id = '00000000-0000-4000-8000-000000003211';
update public.project_categories set status = 'published' where id = '00000000-0000-4000-8000-000000003211';

insert into public.project_tags (id, site_id, slug, label) values
  ('00000000-0000-4000-8000-000000003212', '00000000-0000-4000-8000-000000000100', 'premium-hospitality', 'Premium hospitality');
update public.project_tags set status = 'in_review' where id = '00000000-0000-4000-8000-000000003212';
update public.project_tags set status = 'approved' where id = '00000000-0000-4000-8000-000000003212';
update public.project_tags set status = 'published' where id = '00000000-0000-4000-8000-000000003212';

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003201', 'authenticated', 'authenticated', 'project-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003202', 'authenticated', 'authenticated', 'project-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003203', 'authenticated', 'authenticated', 'project-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003204', 'authenticated', 'authenticated', 'project-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000003201', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000003202', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000003203', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000003204', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003204","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_projects_v1('00000000-0000-4000-8000-000000000100', null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect project drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003201","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_project on commit drop as
select * from public.create_project_v1(
  '00000000-0000-4000-8000-000000000100', 'palace-atlas', 'portfolio.palace_atlas',
  '00000000-0000-4000-8000-000000003210', '2026', 'Brand and launch',
  '00000000-0000-4000-8000-000000003213'
);
grant select on created_project to authenticated, anon;
select is((select status from created_project), 'draft'::public.publication_status, 'editor creates a governed project draft');
select is((select created_by from public.projects where id = (select project_id from created_project)), '00000000-0000-4000-8000-000000003201'::uuid, 'project creation records the editor');
select is((select lock_version from created_project), 1, 'new project begins at lock version one');
select ok('missing_project_category' = any(app_private.project_warnings_v1((select project_id from created_project))), 'draft project reports missing governed taxonomy');
select is((select lock_version from public.update_project_v1(
  (select project_id from created_project), 1, 'palace-atlas', 'portfolio.palace_atlas',
  '00000000-0000-4000-8000-000000003210', '2026', 'Identity, digital, and launch',
  '00000000-0000-4000-8000-000000003213', 'Clarify project delivery scope'
)), 2, 'project update advances optimistic locking');
select throws_ok(
  $$select * from public.update_project_v1(
    (select project_id from created_project), 1, 'palace-atlas', 'portfolio.palace_atlas',
    '00000000-0000-4000-8000-000000003210', '2026', 'Stale edit',
    '00000000-0000-4000-8000-000000003213', 'Attempt stale project update'
  )$$,
  '40001', 'project was modified by another editor', 'stale project updates are rejected'
);
select throws_ok(
  $$select * from public.create_project_v1(
    '00000000-0000-4000-8000-000000000100', 'Invalid Slug', 'valid.key', null, null, null, null
  )$$,
  '22023', 'valid project slug is required', 'invalid project slugs are rejected'
);
select throws_ok(
  $$select * from public.create_project_v1(
    '00000000-0000-4000-8000-000000000100', 'valid-slug', 'Invalid Key', null, null, null, null
  )$$,
  '22023', 'valid project key is required', 'invalid project keys are rejected'
);
select throws_ok(
  $$select * from public.create_project_v1(
    '00000000-0000-4000-8000-000000000100', 'unknown-industry', 'unknown.industry',
    '00000000-0000-4000-8000-000000003299', null, null, null
  )$$,
  '22023', 'project industry must belong to the same site', 'unknown project industries are rejected'
);
select throws_ok(
  $$select * from public.upsert_project_translation_v1(
    (select project_id from created_project), 'en', 'Bypass', 'Bypass summary',
    'Bypass story', '', '', 'Attempt translation bypass'
  )$$,
  '42501', 'translations.write permission required', 'content editors cannot bypass translator permissions'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003202","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_project_v1(
    '00000000-0000-4000-8000-000000000100', 'translator-bypass', 'translator.bypass', null, null, null, null
  )$$,
  '42501', 'content.write permission required', 'translator cannot create base projects'
);
select is((select status from public.upsert_project_translation_v1(
  (select project_id from created_project), 'en', 'Palace Atlas',
  'A verified hospitality transformation in Morocco.',
  'A destination owner preparing a flagship opening.',
  'Research, identity, digital experience, and launch.', '',
  'Create English project story'
)), 'draft'::public.translation_status, 'translator creates English project copy');
select is((select status from public.upsert_project_translation_v1(
  (select project_id from created_project), 'fr', 'Palace Atlas',
  'Une transformation hoteliere verifiee au Maroc.', '',
  'Recherche, identite, experience numerique et lancement.',
  'Un nouveau repere de destination.', 'Create French project story'
)), 'draft'::public.translation_status, 'translator creates French project copy');
select throws_ok(
  $$select * from public.upsert_project_translation_v1(
    (select project_id from created_project), 'en', 'Title', '', 'Story', '', '', 'Attempt empty summary'
  )$$,
  '22023', 'valid bounded project translation is required', 'empty project summaries are rejected'
);
select throws_ok(
  $$select * from public.upsert_project_translation_v1(
    (select project_id from created_project), 'en', 'Title', 'Summary', '', '', '', 'Attempt empty story'
  )$$,
  '22023', 'valid bounded project translation is required', 'project copy requires at least one story field'
);
select throws_ok(
  $$select * from public.upsert_project_translation_v1(
    (select project_id from created_project), 'ar', 'Arabic', 'Disabled locale', 'Story', '', '', 'Attempt disabled locale'
  )$$,
  '22023', 'enabled project locale is required', 'disabled locales cannot receive project copy'
);
select is((select count(*) from public.project_translations
  where project_id = (select project_id from created_project)
    and created_by = '00000000-0000-4000-8000-000000003202'), 2::bigint,
  'project translations record the translator actor');
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'en', 'in_review', 'Submit English project copy'
)), 'in_review'::public.translation_status, 'translator submits English project copy');
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'fr', 'in_review', 'Submit French project copy'
)), 'in_review'::public.translation_status, 'translator submits French project copy');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003201","role":"authenticated"}', true);
set local role authenticated;
select is((select lock_version from public.replace_project_taxonomy_v1(
  (select project_id from created_project), 2,
  array['00000000-0000-4000-8000-000000003211']::uuid[],
  array['00000000-0000-4000-8000-000000003212']::uuid[],
  'Attach approved project taxonomy'
)), 3, 'taxonomy replacement advances project optimistic locking');
select is((select position from public.project_category_links where project_id = (select project_id from created_project)), 0, 'project category ordering begins at zero');
select is((select count(*) from public.project_tag_links where project_id = (select project_id from created_project)), 1::bigint, 'project tag replacement persists the selected tag');
select throws_ok(
  $$select * from public.replace_project_taxonomy_v1(
    (select project_id from created_project), 2,
    array['00000000-0000-4000-8000-000000003211']::uuid[], array[]::uuid[],
    'Attempt stale taxonomy update'
  )$$,
  '40001', 'project was modified by another editor', 'stale taxonomy replacement is rejected'
);
select throws_ok(
  $$select * from public.replace_project_taxonomy_v1(
    (select project_id from created_project), 3,
    array['00000000-0000-4000-8000-000000003211','00000000-0000-4000-8000-000000003211']::uuid[],
    array[]::uuid[], 'Attempt duplicate project categories'
  )$$,
  '22023', 'one to twenty unique project categories are required', 'duplicate project categories are rejected'
);
select throws_ok(
  $$select * from public.replace_project_taxonomy_v1(
    (select project_id from created_project), 3,
    array['00000000-0000-4000-8000-000000003214']::uuid[], array[]::uuid[],
    'Attempt draft project category'
  )$$,
  '22023', 'published same-site project categories are required', 'unpublished project categories are rejected'
);
select is((select jsonb_array_length(public.cms_project_workspace_v1((select project_id from created_project))->'translations')), 2, 'project workspace returns localized story copy');
select is((select jsonb_array_length(public.cms_project_workspace_v1((select project_id from created_project))->'categories')), 1, 'project workspace returns governed categories');
select is((select jsonb_array_length(public.cms_project_workspace_v1((select project_id from created_project))->'tags')), 1, 'project workspace returns governed tags');
select is((select status from public.transition_project_status_v1(
  (select project_id from created_project), 'in_review', null, 'Submit project for review'
)), 'in_review'::public.publication_status, 'editor submits base project content');
select throws_ok(
  $$select * from public.transition_project_status_v1(
    (select project_id from created_project), 'approved', null, 'Editor approval attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot approve project content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003203","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_project_status_v1(
    (select project_id from created_project), 'approved', null, 'Incomplete project approval attempt'
  )$$,
  '23514', 'project is incomplete', 'unapproved localized copy blocks project approval'
);
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'en', 'approved', 'Approve English project copy'
)), 'approved'::public.translation_status, 'publisher approves English project copy');
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'fr', 'approved', 'Approve French project copy'
)), 'approved'::public.translation_status, 'publisher approves French project copy');
select is((select status from public.transition_project_status_v1(
  (select project_id from created_project), 'approved', null, 'Approve complete project'
)), 'approved'::public.publication_status, 'publisher approves complete project content');
select throws_ok(
  $$select * from public.transition_project_status_v1(
    (select project_id from created_project), 'scheduled', null, 'Attempt schedule without time'
  )$$,
  '22023', 'future publish time is required for scheduling', 'project scheduling requires a future time'
);
select is((select status from public.transition_project_status_v1(
  (select project_id from created_project), 'scheduled', now() + interval '1 day', 'Schedule complete project'
)), 'scheduled'::public.publication_status, 'publisher truthfully schedules complete project content');
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'en', 'published', 'Publish English project copy'
)), 'published'::public.translation_status, 'publisher publishes English project copy');
select is((select status from public.transition_project_translation_status_v1(
  (select project_id from created_project), 'fr', 'published', 'Publish French project copy'
)), 'published'::public.translation_status, 'publisher publishes French project copy');
select throws_ok(
  $$select * from public.transition_project_status_v1(
    (select project_id from created_project), 'published', null, 'Attempt project publication before due time'
  )$$,
  '23514', 'scheduled project cannot publish before its due time', 'scheduled project cannot publish before its due time'
);
reset role;
update public.projects set publish_at = now() - interval '1 second' where id = (select project_id from created_project);
set local role authenticated;
select is((select status from public.transition_project_status_v1(
  (select project_id from created_project), 'published', null, 'Publish scheduled project'
)), 'published'::public.publication_status, 'publisher publishes the due scheduled project');
select ok((select published_at is not null from public.projects where id = (select project_id from created_project)), 'project publication receives a server timestamp');
select is((select publication_status from public.search_cms_projects_v1(
  '00000000-0000-4000-8000-000000000100', null, 'hospitality transformation', 10
) where project_id = (select project_id from created_project)), 'published'::public.publication_status, 'project search matches localized summaries');
select is((select cardinality(warning_codes) from public.search_cms_projects_v1(
  '00000000-0000-4000-8000-000000000100', null, null, 50
) where project_id = (select project_id from created_project)), 0, 'published project clears taxonomy, media, and translation warnings');
select is((public.cms_project_workspace_v1((select project_id from created_project))->'project'->>'status'), 'published', 'project workspace exposes the governed publication state');
select throws_ok(
  $$select * from public.search_cms_projects_v1(
    '00000000-0000-4000-8000-000000000100', null, null, 101
  )$$,
  '22023', 'limit must be between 1 and 100', 'project search enforces bounded result limits'
);
select throws_ok(
  $$select * from public.update_project_v1(
    (select project_id from created_project),
    (select lock_version from public.projects where id = (select project_id from created_project)),
    'palace-atlas', 'portfolio.palace_atlas', '00000000-0000-4000-8000-000000003210',
    '2026', 'Protected edit', '00000000-0000-4000-8000-000000003213', 'Protected published edit'
  )$$,
  '23514', 'project must be draft before editing', 'published projects cannot be edited in place'
);
select throws_ok(
  $$select * from public.replace_project_taxonomy_v1(
    (select project_id from created_project),
    (select lock_version from public.projects where id = (select project_id from created_project)),
    array['00000000-0000-4000-8000-000000003211']::uuid[], array[]::uuid[],
    'Protected published taxonomy edit'
  )$$,
  '23514', 'project must be editable before taxonomy changes', 'published project taxonomy cannot be changed in place'
);
reset role;

set local role anon;
select is((select count(*) from public.projects where id = (select project_id from created_project)), 1::bigint, 'anonymous query sees the published project');
select is((select count(*) from public.project_translations where project_id = (select project_id from created_project)), 2::bigint, 'anonymous query sees both published project translations');
select is((select count(*) from public.project_category_links where project_id = (select project_id from created_project)), 1::bigint, 'anonymous query sees published project category links');
select is((select count(*) from public.project_tag_links where project_id = (select project_id from created_project)), 1::bigint, 'anonymous query sees published project tag links');
select is((select count(*) from public.project_tags where id = '00000000-0000-4000-8000-000000003212'), 1::bigint, 'anonymous query sees tags linked to published projects');
reset role;

select ok((select count(*) from public.content_revisions where
  (entity_table = 'projects' and entity_id = (select project_id from created_project))
  or (entity_table = 'project_translations' and entity_id in (
    select id from public.project_translations where project_id = (select project_id from created_project)
  ))
) >= 10, 'project mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and (
  (entity_table = 'projects' and entity_id = (select project_id::text from created_project))
  or (entity_table = 'project_translations' and entity_id in (
    select id::text from public.project_translations where project_id = (select project_id from created_project)
  ))
)) >= 12, 'project mutations create attributable audit evidence');

select * from finish();
rollback;
