begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(62);

select ok(not has_function_privilege('anon', 'public.cms_project_details_v1(uuid)', 'execute'), 'anonymous callers cannot inspect project details');
select ok(has_function_privilege('authenticated', 'public.cms_project_details_v1(uuid)', 'execute'), 'authenticated staff may enter the project details workspace');
select ok(not has_table_privilege('authenticated', 'public.project_metrics', 'insert'), 'direct authenticated project metric inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_metrics', 'update'), 'direct authenticated project metric updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_credits', 'insert'), 'direct authenticated project credit inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_credits', 'update'), 'direct authenticated project credit updates are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_relations', 'insert'), 'direct authenticated project relation inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.project_relations', 'delete'), 'direct authenticated project relation deletes are revoked');

insert into public.sites (id, slug, name, status, default_locale, timezone, settings)
values (
  '00000000-0000-4000-8000-000000003900', 'project-details-other',
  'Project Details Other Tenant', 'active', 'en', 'UTC', '{}'::jsonb
);
insert into public.projects (id, site_id, slug, project_key)
values (
  '00000000-0000-4000-8000-000000003399',
  '00000000-0000-4000-8000-000000003900', 'other-project', 'other.project'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003301', 'authenticated', 'authenticated', 'project-details-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003302', 'authenticated', 'authenticated', 'project-details-translator@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003303', 'authenticated', 'authenticated', 'project-details-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003304', 'authenticated', 'authenticated', 'project-details-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000003301', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000003302', '00000000-0000-4000-8000-000000000100', 'translator'),
  ('00000000-0000-4000-8000-000000003303', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000003304', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003304","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select public.cms_project_details_v1('00000000-0000-4000-8000-000000003399')$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect project details'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003301","role":"authenticated"}', true);
set local role authenticated;
create temporary table details_main on commit drop as
select * from public.create_project_v1(
  '00000000-0000-4000-8000-000000000100', 'details-main', 'portfolio.details_main',
  null, null, null, null
);
create temporary table details_related on commit drop as
select * from public.create_project_v1(
  '00000000-0000-4000-8000-000000000100', 'details-related', 'portfolio.details_related',
  null, null, null, null
);
create temporary table details_tail on commit drop as
select * from public.create_project_v1(
  '00000000-0000-4000-8000-000000000100', 'details-tail', 'portfolio.details_tail',
  null, null, null, null
);
grant select on details_main, details_related, details_tail to authenticated, anon;
select is((select status from details_main), 'draft'::public.publication_status, 'editor creates the project details fixture through the governed project API');

select is((select lock_version from public.replace_project_credits_v1(
  (select project_id from details_main), 1,
  '[{"role":"Creative direction","name":"SPIMAR Studio"},{"role":"Architecture","name":"Atlas Partners"}]'::jsonb,
  'Create ordered project credits'
)), 2, 'credit replacement advances the project lock');
select is((select count(*) from public.project_credits where project_id = (select project_id from details_main)), 2::bigint, 'credit replacement persists every governed credit');
select is((select array_agg(position order by position) from public.project_credits where project_id = (select project_id from details_main)), array[0,1], 'credit replacement assigns deterministic ordering');
select is((select count(*) from public.project_credits where project_id = (select project_id from details_main) and created_by = '00000000-0000-4000-8000-000000003301'), 2::bigint, 'project credits record the authenticated editor');
select throws_ok(
  $$select * from public.replace_project_credits_v1(
    (select project_id from details_main), 1, '[]'::jsonb, 'Attempt stale credit replacement'
  )$$,
  '40001', 'project was modified by another editor', 'stale credit replacement is rejected'
);
select throws_ok(
  $$select * from public.replace_project_credits_v1(
    (select project_id from details_main), 2,
    '[{"role":"Director","name":"Studio","extra":true}]'::jsonb,
    'Attempt unsafe credit payload'
  )$$,
  '22023', 'zero to one hundred valid project credits are required', 'unknown project credit fields are rejected'
);
select is((select lock_version from public.replace_project_credits_v1(
  (select project_id from details_main), 2,
  '[{"role":"Creative direction","name":"SPIMAR Studio"}]'::jsonb,
  'Refine ordered project credits'
)), 3, 'second credit replacement advances the project lock again');

select throws_ok(
  $$select * from public.replace_project_relations_v1(
    (select project_id from details_main), 3,
    jsonb_build_array(jsonb_build_object('relatedProjectId', (select project_id from details_main), 'kind', 'related')),
    'Attempt self relation'
  )$$,
  '22023', 'project cannot relate to itself', 'self project relations are rejected'
);
select throws_ok(
  $$select * from public.replace_project_relations_v1(
    (select project_id from details_main), 3,
    jsonb_build_array(
      jsonb_build_object('relatedProjectId', (select project_id from details_related), 'kind', 'related'),
      jsonb_build_object('relatedProjectId', (select project_id from details_related), 'kind', 'related')
    ), 'Attempt duplicate relations'
  )$$,
  '22023', 'zero to fifty unique project relations are required', 'duplicate project relations are rejected'
);
select throws_ok(
  $$select * from public.replace_project_relations_v1(
    (select project_id from details_main), 3,
    '[{"relatedProjectId":"00000000-0000-4000-8000-000000003399","kind":"related"}]'::jsonb,
    'Attempt cross-tenant relation'
  )$$,
  '22023', 'related projects must belong to the same site', 'cross-tenant project relations are rejected'
);
reset role;
insert into public.project_relations (
  site_id, project_id, related_project_id, relation_kind, position
) values (
  '00000000-0000-4000-8000-000000000100',
  (select project_id from details_related), (select project_id from details_main), 'next', 0
);
set local role authenticated;
select throws_ok(
  $$select * from public.replace_project_relations_v1(
    (select project_id from details_main), 3,
    jsonb_build_array(jsonb_build_object('relatedProjectId', (select project_id from details_related), 'kind', 'next')),
    'Attempt cyclic next relation'
  )$$,
  '22023', 'next-project relations cannot contain cycles', 'cyclic next-project relations are rejected'
);
reset role;
delete from public.project_relations where project_id = (select project_id from details_related);
set local role authenticated;
select is((select lock_version from public.replace_project_relations_v1(
  (select project_id from details_main), 3,
  jsonb_build_array(
    jsonb_build_object('relatedProjectId', (select project_id from details_related), 'kind', 'next'),
    jsonb_build_object('relatedProjectId', (select project_id from details_tail), 'kind', 'featured')
  ), 'Create ordered project relations'
)), 4, 'relation replacement advances the project lock');
select is((select count(*) from public.project_relations where project_id = (select project_id from details_main)), 2::bigint, 'relation replacement persists every governed relation');
select is((select array_agg(position order by position) from public.project_relations where project_id = (select project_id from details_main)), array[0,1], 'relation replacement assigns deterministic ordering');
select is(jsonb_array_length(public.cms_project_details_v1((select project_id from details_main))->'credits'), 1, 'project details workspace returns the latest ordered credits');
select is(jsonb_array_length(public.cms_project_details_v1((select project_id from details_main))->'relations'), 2, 'project details workspace returns ordered relations');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003302","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'visitor_growth', '+24%', 'Verified visitor growth.',
    '2025-01-01', '2025-12-31', 'Audited analytics', 'https://evidence.test/growth', 0
  )$$,
  '42501', 'content.write permission required', 'translator cannot create project metrics'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003301","role":"authenticated"}', true);
set local role authenticated;
create temporary table details_metric on commit drop as
select * from public.create_project_metric_v1(
  (select project_id from details_main), 'visitor_growth', '+24%',
  'Verified visitor growth during the reporting period.',
  '2025-01-01', '2025-12-31', 'Audited analytics',
  'https://evidence.test/growth', 0
);
grant select on details_metric to authenticated, anon;
select is((select evidence_status from details_metric), 'missing'::public.evidence_status, 'new project metrics begin without verified evidence');
select is((select created_by from public.project_metrics where id = (select metric_id from details_metric)), '00000000-0000-4000-8000-000000003301'::uuid, 'project metric creation records the editor');
select is((select lock_version from details_metric), 1, 'new project metrics begin at lock version one');
select ok('project_metric_not_verified' = any(app_private.project_warnings_v1((select project_id from details_main))), 'unverified project metrics create a truthful project warning');
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'Invalid Key', '24', 'Definition', null, null,
    'Source', null, 0
  )$$,
  '22023', 'valid project metric key is required', 'invalid project metric keys are rejected'
);
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'period', '24', 'Definition',
    '2026-12-31', '2026-01-01', 'Source', null, 0
  )$$,
  '22023', 'project metric period is invalid', 'reversed project metric periods are rejected'
);
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'source', '24', 'Definition', null, null,
    'Source', 'http://insecure.test', 0
  )$$,
  '22023', 'project metric source URL must use HTTPS', 'insecure project metric source URLs are rejected'
);
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'position', '24', 'Definition', null, null,
    'Source', null, -1
  )$$,
  '22023', 'valid project metric position is required', 'invalid project metric positions are rejected'
);
select is((select lock_version from public.update_project_metric_v1(
  (select project_id from details_main), (select metric_id from details_metric), 1,
  'visitor_growth', '+25%', 'Updated verified visitor growth.',
  '2025-01-01', '2025-12-31', 'Audited analytics',
  'https://evidence.test/growth-v2', 0, 'Clarify project metric evidence'
)), 2, 'project metric updates advance optimistic locking');
select throws_ok(
  $$select * from public.update_project_metric_v1(
    (select project_id from details_main), (select metric_id from details_metric), 1,
    'visitor_growth', '+26%', 'Stale update', null, null, 'Source', null, 0,
    'Attempt stale project metric update'
  )$$,
  '40001', 'project metric was modified by another editor', 'stale project metric updates are rejected'
);
select is((select lock_version from public.transition_project_metric_evidence_v1(
  (select project_id from details_main), (select metric_id from details_metric),
  'submitted', 'Audited analytics export 2025', 'Submit project metric evidence'
)), 3, 'editor submits project metric evidence for review');
select throws_ok(
  $$select * from public.transition_project_metric_evidence_v1(
    (select project_id from details_main), (select metric_id from details_metric),
    'verified', 'Audited analytics export 2025', 'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify project metric evidence'
);
create temporary table removable_metric on commit drop as
select * from public.create_project_metric_v1(
  (select project_id from details_main), 'temporary_metric', '1',
  'Temporary project metric.', null, null, 'Temporary source', null, 10
);
grant select on removable_metric to authenticated, anon;
select is((select evidence_status from removable_metric), 'missing'::public.evidence_status, 'editor creates an independently locked removable metric');
select is((select removed from public.remove_project_metric_v1(
  (select project_id from details_main), (select metric_id from removable_metric), 1,
  'Remove temporary project metric'
)), true, 'editor removes a draft project metric through the governed RPC');
select is((select count(*) from public.project_metrics where id = (select metric_id from removable_metric)), 0::bigint, 'removed project metrics are durably deleted');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003303","role":"authenticated"}', true);
set local role authenticated;
select is((select evidence_status from public.transition_project_metric_evidence_v1(
  (select project_id from details_main), (select metric_id from details_metric),
  'verified', 'Audited analytics export 2025', 'Verify project metric evidence'
)), 'verified'::public.evidence_status, 'publisher verifies submitted project metric evidence');
select is((select approved_by from public.project_metrics where id = (select metric_id from details_metric)), '00000000-0000-4000-8000-000000003303'::uuid, 'project metric verification records the publisher');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003301","role":"authenticated"}', true);
set local role authenticated;
select is((select evidence_status from public.update_project_metric_v1(
  (select project_id from details_main), (select metric_id from details_metric), 4,
  'visitor_growth', '+27%', 'Revised visitor growth requires new evidence.',
  '2025-01-01', '2025-12-31', 'Audited analytics',
  'https://evidence.test/growth-v3', 0, 'Revise verified project metric'
)), 'missing'::public.evidence_status, 'editing verified project metric content resets evidence truthfully');
select is((select approved_by from public.project_metrics where id = (select metric_id from details_metric)), null::uuid, 'metric edits clear the prior approver');
select ok('project_metric_not_verified' = any(app_private.project_warnings_v1((select project_id from details_main))), 'metric edits restore the project evidence warning');
select is((select lock_version from public.transition_project_metric_evidence_v1(
  (select project_id from details_main), (select metric_id from details_metric),
  'submitted', 'Revised audited analytics export 2025', 'Resubmit revised metric evidence'
)), 6, 'editor resubmits revised project metric evidence');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003303","role":"authenticated"}', true);
set local role authenticated;
select is((select lock_version from public.transition_project_metric_evidence_v1(
  (select project_id from details_main), (select metric_id from details_metric),
  'verified', 'Revised audited analytics export 2025', 'Verify revised metric evidence'
)), 7, 'publisher verifies the revised project metric evidence');
select is(jsonb_array_length(public.cms_project_details_v1((select project_id from details_main))->'metrics'), 1, 'project details workspace returns the surviving metric');
select is((public.cms_project_details_v1((select project_id from details_main))->'metrics'->0->>'evidenceStatus'), 'verified', 'project details workspace exposes verified evidence state');
select is((public.cms_project_details_v1((select project_id from details_main))->'metrics'->0->>'sourceUrl'), 'https://evidence.test/growth-v3', 'project details workspace exposes governed source metadata');
reset role;

update public.projects set status = 'archived' where id = (select project_id from details_main);
set local role authenticated;
select throws_ok(
  $$select * from public.create_project_metric_v1(
    (select project_id from details_main), 'archived_metric', '1', 'Archived edit',
    null, null, 'Source', null, 0
  )$$,
  '23514', 'project must be editable before metric changes', 'archived projects reject project metric mutations'
);
reset role;

set local role anon;
select is((select count(*) from public.project_metrics where project_id = (select project_id from details_main)), 0::bigint, 'anonymous callers cannot see project metrics for an unpublished project');
select is((select count(*) from public.project_credits where project_id = (select project_id from details_main)), 0::bigint, 'anonymous callers cannot see credits for an unpublished project');
select is((select count(*) from public.project_relations where project_id = (select project_id from details_main)), 0::bigint, 'anonymous callers cannot see relations for an unpublished project');
reset role;

select ok((select count(*) from public.content_revisions where entity_table = 'project_metrics'
  and entity_id = (select metric_id from details_metric)) >= 5, 'project metric mutations create immutable revision history');
select ok((select count(*) from public.content_revisions where entity_table = 'project_credits') >= 2, 'credit replacement preserves removed credit revisions');
select ok((select count(*) from public.content_revisions where entity_table = 'projects'
  and entity_id = (select project_id from details_main)) >= 3, 'credit and relation replacements create project revision history');
select ok((select count(*) from public.audit_events where domain = 'cms'
  and entity_table = 'project_metrics' and actor_id in (
    '00000000-0000-4000-8000-000000003301', '00000000-0000-4000-8000-000000003303'
  )) >= 8, 'project metric mutations create attributable audit evidence');
select ok((select count(*) from public.audit_events where domain = 'cms'
  and entity_table = 'project_credits' and actor_id = '00000000-0000-4000-8000-000000003301') >= 4, 'project credit replacement creates attributable audit evidence');
select ok((select count(*) from public.audit_events where domain = 'cms'
  and entity_table = 'project_relations' and actor_id = '00000000-0000-4000-8000-000000003301') >= 4, 'project relation replacement creates attributable audit evidence');

select * from finish();
rollback;
