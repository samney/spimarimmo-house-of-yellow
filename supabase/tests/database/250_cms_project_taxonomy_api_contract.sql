begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(79);

select ok(not has_function_privilege('anon', 'public.search_cms_project_taxonomies_v1(uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search taxonomy drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_project_taxonomies_v1(uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter taxonomy search');
select ok(not has_table_privilege('authenticated', 'public.industries', 'insert'), 'direct authenticated industry inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.industries', 'update'), 'direct authenticated industry updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.industry_translations', 'insert'), 'direct authenticated industry translation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_categories', 'insert'), 'direct authenticated project category inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_categories', 'update'), 'direct authenticated project category updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_category_translations', 'insert'), 'direct authenticated project category translation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_tags', 'insert'), 'direct authenticated project tag inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_tags', 'update'), 'direct authenticated project tag updates are revoked');

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003101', 'authenticated', 'authenticated', 'taxonomy-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003102', 'authenticated', 'authenticated', 'taxonomy-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003103', 'authenticated', 'authenticated', 'taxonomy-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003104', 'authenticated', 'authenticated', 'taxonomy-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000003101', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000003102', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000003103', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000003104', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003104","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select public.search_cms_project_taxonomies_v1('00000000-0000-4000-8000-000000000100', null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect taxonomy drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003102","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_industry_v1('00000000-0000-4000-8000-000000000100', 'translator-bypass')$$,
  '42501', 'content.write permission required', 'translator cannot create base taxonomy content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003101","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_industry on commit drop as
select * from public.create_industry_v1('00000000-0000-4000-8000-000000000100', 'real-estate');
grant select on created_industry to authenticated, anon;
select is((select status from created_industry), 'draft'::public.publication_status, 'editor creates a governed industry draft');
select is((select created_by from public.industries where id = (select industry_id from created_industry)), '00000000-0000-4000-8000-000000003101'::uuid, 'industry creation records the editor');
select is((select lock_version from created_industry), 1, 'new industry begins at lock version one');
select throws_ok(
  $$select * from public.create_industry_v1('00000000-0000-4000-8000-000000000100', 'Invalid Industry')$$,
  '22023', 'valid industry slug is required', 'invalid industry slugs are rejected'
);
select is((select lock_version from public.update_industry_v1(
  (select industry_id from created_industry), 1, 'maritime-real-estate', 'Clarify industry taxonomy'
)), 2, 'industry update advances optimistic locking');
select throws_ok(
  $$select * from public.update_industry_v1(
    (select industry_id from created_industry), 1, 'stale-industry', 'Attempt stale industry edit'
  )$$,
  '40001', 'industry was modified by another editor', 'stale industry updates are rejected'
);

create temporary table created_category on commit drop as
select * from public.create_project_category_v1('00000000-0000-4000-8000-000000000100', 'featured', 10);
grant select on created_category to authenticated, anon;
select is((select status from created_category), 'draft'::public.publication_status, 'editor creates a governed project category draft');
select is((select created_by from public.project_categories where id = (select category_id from created_category)), '00000000-0000-4000-8000-000000003101'::uuid, 'project category creation records the editor');
select throws_ok(
  $$select * from public.create_project_category_v1('00000000-0000-4000-8000-000000000100', 'bad-position', -1)$$,
  '22023', 'valid project category position is required', 'invalid project category positions are rejected'
);
select is((select lock_version from public.update_project_category_v1(
  (select category_id from created_category), 1, 'selected-work', 20, 'Refine project category order'
)), 2, 'project category update advances optimistic locking');

create temporary table created_tag on commit drop as
select * from public.create_project_tag_v1('00000000-0000-4000-8000-000000000100', 'hospitality', 'Hospitality');
grant select on created_tag to authenticated, anon;
select is((select status from created_tag), 'draft'::public.publication_status, 'editor creates a governed project tag draft');
select is((select created_by from public.project_tags where id = (select tag_id from created_tag)), '00000000-0000-4000-8000-000000003101'::uuid, 'project tag creation records the editor');
select throws_ok(
  $$select * from public.create_project_tag_v1('00000000-0000-4000-8000-000000000100', 'empty-label', '')$$,
  '22023', 'valid project tag label is required', 'empty project tag labels are rejected'
);
select is((select lock_version from public.update_project_tag_v1(
  (select tag_id from created_tag), 1, 'premium-hospitality', 'Premium hospitality', 'Clarify project tag'
)), 2, 'project tag update advances optimistic locking');
select throws_ok(
  $$select * from public.update_project_tag_v1(
    (select tag_id from created_tag), 1, 'stale-tag', 'Stale tag', 'Attempt stale project tag edit'
  )$$,
  '40001', 'project tag was modified by another editor', 'stale project tag updates are rejected'
);
select throws_ok(
  $$select * from public.upsert_industry_translation_v1(
    (select industry_id from created_industry), 'en', 'Bypass', '', 'Attempt translation bypass'
  )$$,
  '42501', 'translations.write permission required', 'content editor cannot bypass translator permissions'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003102","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.upsert_industry_translation_v1(
  (select industry_id from created_industry), 'en', 'Maritime real estate', 'Ports, logistics, and coastal development.', 'Create English industry copy'
)), 'draft'::public.translation_status, 'translator creates English industry copy');
select is((select status from public.upsert_industry_translation_v1(
  (select industry_id from created_industry), 'fr', 'Immobilier maritime', 'Ports, logistique et developpement cotier.', 'Create French industry copy'
)), 'draft'::public.translation_status, 'translator creates French industry copy');
select is((select status from public.upsert_project_category_translation_v1(
  (select category_id from created_category), 'en', 'Selected work', 'Create English category copy'
)), 'draft'::public.translation_status, 'translator creates English project category copy');
select is((select status from public.upsert_project_category_translation_v1(
  (select category_id from created_category), 'fr', 'Projets selectionnes', 'Create French category copy'
)), 'draft'::public.translation_status, 'translator creates French project category copy');
select throws_ok(
  $$select * from public.upsert_industry_translation_v1(
    (select industry_id from created_industry), 'en', '', '', 'Attempt empty industry name'
  )$$,
  '22023', 'valid bounded industry translation is required', 'empty industry names are rejected'
);
select throws_ok(
  $$select * from public.upsert_project_category_translation_v1(
    (select category_id from created_category), 'ar', 'Arabic category', 'Attempt disabled category locale'
  )$$,
  '22023', 'enabled project category locale is required', 'disabled locales cannot receive project category copy'
);
select is((select count(*) from public.industry_translations
  where industry_id = (select industry_id from created_industry)
    and created_by = '00000000-0000-4000-8000-000000003102'), 2::bigint,
  'industry translations record the translator actor');
select is((select count(*) from public.project_category_translations
  where category_id = (select category_id from created_category)
    and created_by = '00000000-0000-4000-8000-000000003102'), 2::bigint,
  'project category translations record the translator actor');
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'en', 'in_review', 'Submit English industry copy'
)), 'in_review'::public.translation_status, 'translator submits English industry copy');
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'fr', 'in_review', 'Submit French industry copy'
)), 'in_review'::public.translation_status, 'translator submits French industry copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'en', 'in_review', 'Submit English category copy'
)), 'in_review'::public.translation_status, 'translator submits English project category copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'fr', 'in_review', 'Submit French category copy'
)), 'in_review'::public.translation_status, 'translator submits French project category copy');
select throws_ok(
  $$select * from public.transition_industry_status_v1(
    (select industry_id from created_industry), 'in_review', 'Translator base transition attempt'
  )$$,
  '42501', 'content.write permission required', 'translator cannot submit base taxonomy content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003101","role":"authenticated"}', true);
set local role authenticated;
select is((select status from public.transition_industry_status_v1(
  (select industry_id from created_industry), 'in_review', 'Submit industry for review'
)), 'in_review'::public.publication_status, 'editor submits base industry content');
select is((select status from public.transition_project_category_status_v1(
  (select category_id from created_category), 'in_review', 'Submit category for review'
)), 'in_review'::public.publication_status, 'editor submits base project category content');
select is((select status from public.transition_project_tag_status_v1(
  (select tag_id from created_tag), 'in_review', 'Submit project tag for review'
)), 'in_review'::public.publication_status, 'editor submits base project tag content');
select throws_ok(
  $$select * from public.transition_industry_status_v1(
    (select industry_id from created_industry), 'approved', 'Editor approval attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot approve taxonomy content'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003103","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_industry_status_v1(
    (select industry_id from created_industry), 'approved', 'Incomplete industry approval attempt'
  )$$,
  '23514', 'industry is incomplete', 'unapproved localized copy blocks industry approval'
);
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'en', 'approved', 'Approve English industry copy'
)), 'approved'::public.translation_status, 'publisher approves English industry copy');
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'fr', 'approved', 'Approve French industry copy'
)), 'approved'::public.translation_status, 'publisher approves French industry copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'en', 'approved', 'Approve English category copy'
)), 'approved'::public.translation_status, 'publisher approves English project category copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'fr', 'approved', 'Approve French category copy'
)), 'approved'::public.translation_status, 'publisher approves French project category copy');
select is((select status from public.transition_industry_status_v1(
  (select industry_id from created_industry), 'approved', 'Approve complete industry'
)), 'approved'::public.publication_status, 'publisher approves complete industry content');
select is((select status from public.transition_project_category_status_v1(
  (select category_id from created_category), 'approved', 'Approve complete project category'
)), 'approved'::public.publication_status, 'publisher approves complete project category content');
select is((select status from public.transition_project_tag_status_v1(
  (select tag_id from created_tag), 'approved', 'Approve project tag'
)), 'approved'::public.publication_status, 'publisher approves governed project tag content');
select throws_ok(
  $$select * from public.transition_industry_status_v1(
    (select industry_id from created_industry), 'scheduled', 'Unsupported industry schedule'
  )$$,
  '23514', 'industry scheduling is not implemented', 'industry API never claims fake scheduling'
);
select throws_ok(
  $$select * from public.transition_project_category_status_v1(
    (select category_id from created_category), 'scheduled', 'Unsupported category schedule'
  )$$,
  '23514', 'project category scheduling is not implemented', 'project category API never claims fake scheduling'
);
select throws_ok(
  $$select * from public.transition_project_tag_status_v1(
    (select tag_id from created_tag), 'scheduled', 'Unsupported tag schedule'
  )$$,
  '23514', 'project tag scheduling is not implemented', 'project tag API never claims fake scheduling'
);
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'en', 'published', 'Publish English industry copy'
)), 'published'::public.translation_status, 'publisher publishes English industry copy');
select is((select status from public.transition_industry_translation_status_v1(
  (select industry_id from created_industry), 'fr', 'published', 'Publish French industry copy'
)), 'published'::public.translation_status, 'publisher publishes French industry copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'en', 'published', 'Publish English category copy'
)), 'published'::public.translation_status, 'publisher publishes English project category copy');
select is((select status from public.transition_project_category_translation_status_v1(
  (select category_id from created_category), 'fr', 'published', 'Publish French category copy'
)), 'published'::public.translation_status, 'publisher publishes French project category copy');
select is((select status from public.transition_industry_status_v1(
  (select industry_id from created_industry), 'published', 'Publish complete industry'
)), 'published'::public.publication_status, 'publisher publishes complete industry content');
select is((select status from public.transition_project_category_status_v1(
  (select category_id from created_category), 'published', 'Publish complete project category'
)), 'published'::public.publication_status, 'publisher publishes complete project category content');
select is((select status from public.transition_project_tag_status_v1(
  (select tag_id from created_tag), 'published', 'Publish project tag'
)), 'published'::public.publication_status, 'publisher publishes governed project tag content');

create temporary table taxonomy_workspace on commit drop as
select public.search_cms_project_taxonomies_v1(
  '00000000-0000-4000-8000-000000000100', 'published', null, 50
) as payload;
grant select on taxonomy_workspace to authenticated, anon;
select ok(
  jsonb_array_length((select payload -> 'industries' from taxonomy_workspace)) = 1
  and jsonb_array_length((select payload -> 'categories' from taxonomy_workspace)) = 1
  and jsonb_array_length((select payload -> 'tags' from taxonomy_workspace)) = 1,
  'taxonomy workspace returns every governed taxonomy type'
);
select is(
  jsonb_array_length(public.search_cms_project_taxonomies_v1(
    '00000000-0000-4000-8000-000000000100', 'published', 'Maritime real estate', 50
  ) -> 'industries'), 1, 'taxonomy search matches localized industry names'
);
select ok(
  jsonb_array_length(public.search_cms_project_taxonomies_v1(
    '00000000-0000-4000-8000-000000000100', 'published', null, 50
  ) -> 'industries') = 1,
  'taxonomy status filter preserves published industry results'
);
select ok(
  jsonb_array_length(((select payload -> 'industries' from taxonomy_workspace) -> 0) -> 'warningCodes') = 0
  and jsonb_array_length(((select payload -> 'categories' from taxonomy_workspace) -> 0) -> 'warningCodes') = 0
  and jsonb_array_length(((select payload -> 'tags' from taxonomy_workspace) -> 0) -> 'warningCodes') = 0,
  'published taxonomy workspace clears governed completeness warnings'
);
select throws_ok(
  $$select public.search_cms_project_taxonomies_v1('00000000-0000-4000-8000-000000000100', null, null, 101)$$,
  '22023', 'limit must be between 1 and 100', 'taxonomy search rejects unsafe limits'
);
select throws_ok(
  $$select public.search_cms_project_taxonomies_v1(
    '00000000-0000-4000-8000-000000000100', null, repeat('x', 201), 50
  )$$,
  '22023', 'query cannot exceed 200 characters', 'taxonomy search rejects oversized queries'
);
select throws_ok(
  $$select * from public.update_industry_v1(
    (select industry_id from created_industry), 5, 'published-industry-edit', 'Attempt published industry edit'
  )$$,
  '23514', 'industry must be draft before editing', 'published industry metadata cannot change silently'
);
select throws_ok(
  $$select * from public.update_project_category_v1(
    (select category_id from created_category), 5, 'published-category-edit', 30, 'Attempt published category edit'
  )$$,
  '23514', 'project category must be draft before editing', 'published project category metadata cannot change silently'
);
select throws_ok(
  $$select * from public.update_project_tag_v1(
    (select tag_id from created_tag), 5, 'published-tag-edit', 'Published tag edit', 'Attempt published tag edit'
  )$$,
  '23514', 'project tag must be draft before editing', 'published project tag metadata cannot change silently'
);
reset role;

set local role anon;
select is((select count(*) from public.industries where id = (select industry_id from created_industry)), 1::bigint, 'anonymous query sees the published industry');
select is((select count(*) from public.industry_translations where industry_id = (select industry_id from created_industry)), 2::bigint, 'anonymous query sees both published industry translations');
select is((select count(*) from public.project_categories where id = (select category_id from created_category)), 1::bigint, 'anonymous query sees the published project category');
select is((select count(*) from public.project_category_translations where category_id = (select category_id from created_category)), 2::bigint, 'anonymous query sees both published project category translations');
select is((select count(*) from public.project_tags where id = (select tag_id from created_tag)), 0::bigint, 'anonymous query cannot see an unlinked project tag');
reset role;

select ok((select count(*) from public.content_revisions where entity_table in (
  'industries', 'industry_translations', 'project_categories',
  'project_category_translations', 'project_tags'
)) >= 17, 'taxonomy mutations create immutable revision history');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table in (
  'industries', 'industry_translations', 'project_categories',
  'project_category_translations', 'project_tags'
)) >= 22, 'taxonomy mutations create attributable audit evidence');

select * from finish();
rollback;
