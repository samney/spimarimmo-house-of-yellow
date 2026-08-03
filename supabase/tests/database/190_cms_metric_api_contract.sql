begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(31);

select ok(not has_function_privilege('anon', 'public.search_cms_metrics_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'anonymous callers cannot search metric drafts');
select ok(has_function_privilege('authenticated', 'public.search_cms_metrics_v1(uuid,uuid,public.publication_status,text,integer)', 'execute'), 'authenticated staff may enter metric search');
select ok(not has_table_privilege('authenticated', 'public.metrics', 'insert'), 'direct authenticated metric inserts are revoked');
select ok(not has_table_privilege('authenticated', 'public.metrics', 'update'), 'direct authenticated metric updates are revoked');

insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000002510',
  '00000000-0000-4000-8000-000000000100',
  'metric.contract-event', 'metric-contract-event', 'UTC'
);
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002501', 'authenticated', 'authenticated', 'metric-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002503', 'authenticated', 'authenticated', 'metric-publisher@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000002504', 'authenticated', 'authenticated', 'metric-sales@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000002501', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000002503', null, 'super_admin'),
  ('00000000-0000-4000-8000-000000002504', '00000000-0000-4000-8000-000000000100', 'sales_manager');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002504","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_cms_metrics_v1('00000000-0000-4000-8000-000000000100', null, null, null, 50)$$,
  '42501', 'content.read permission required', 'sales staff cannot inspect metric drafts'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002501","role":"authenticated"}', true);
set local role authenticated;
create temporary table created_metric on commit drop as
select * from public.create_metric_v1(
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000002510', 'contract.visitors', '12,500',
  'Unique verified visitors during the event', '2026-01-01', '2026-12-31',
  'Signed attendance audit', 'https://evidence.test/attendance'
);
grant select on created_metric to authenticated, anon;
select is((select status from created_metric), 'draft'::public.publication_status, 'editor creates a governed metric draft');
select is((select created_by from public.metrics where id = (select metric_id from created_metric)), '00000000-0000-4000-8000-000000002501'::uuid, 'metric creation records the editor');
select is((select lock_version from created_metric), 1, 'new metric begins at lock version one');
select ok('evidence_unverified' = any(app_private.metric_warnings_v1((select metric_id from created_metric))), 'draft metric reports unverified evidence');
select is((select lock_version from public.update_metric_v1(
  (select metric_id from created_metric), 1,
  '00000000-0000-4000-8000-000000002510', 'contract.visitors', '12,750',
  'Unique verified visitors during the event', '2026-01-01', '2026-12-31',
  'Signed attendance audit', 'https://evidence.test/attendance', 'Correct verified display value'
)), 2, 'metric update advances optimistic locking');
select throws_ok(
  $$select * from public.update_metric_v1(
    (select metric_id from created_metric), 1,
    '00000000-0000-4000-8000-000000002510', 'contract.visitors', '13,000',
    'Unique verified visitors during the event', '2026-01-01', '2026-12-31',
    'Signed attendance audit', null, 'Stale metric update'
  )$$,
  '40001', 'metric was modified by another editor', 'stale metric update is rejected'
);
select throws_ok(
  $$select * from public.create_metric_v1(
    '00000000-0000-4000-8000-000000000100', null, 'bad.period', '1', 'Definition',
    '2026-12-31', '2026-01-01', 'Source', null
  )$$,
  '22023', 'metric period is invalid', 'reversed metric periods are rejected'
);
select throws_ok(
  $$select * from public.create_metric_v1(
    '00000000-0000-4000-8000-000000000100', null, 'bad.url', '1', 'Definition',
    null, null, 'Source', 'http://insecure.test'
  )$$,
  '22023', 'metric source URL must use HTTPS', 'insecure source URLs are rejected'
);
select throws_ok(
  $$select * from public.create_metric_v1(
    '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001890',
    'bad.event', '1', 'Definition', null, null, 'Source', null
  )$$,
  '22023', 'event must belong to the metric site', 'foreign event identifiers are rejected'
);
select is((select status from public.transition_metric_status_v1(
  (select metric_id from created_metric), 'in_review', 'Submit metric for review'
)), 'in_review'::public.publication_status, 'editor submits metric for review');
select is((select evidence_status from public.transition_metric_evidence_v1(
  (select metric_id from created_metric), 'submitted', 'Signed attendance audit revision 4',
  'Submit metric evidence'
)), 'submitted'::public.evidence_status, 'editor submits metric evidence');
select is((select evidence_source from public.metrics where id = (select metric_id from created_metric)), 'Signed attendance audit revision 4', 'metric evidence source is durable');
select throws_ok(
  $$select * from public.transition_metric_evidence_v1(
    (select metric_id from created_metric), 'verified', 'Signed attendance audit revision 4',
    'Editor verification attempt'
  )$$,
  '42501', 'content.publish permission required', 'editor cannot verify metric evidence'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002503","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.transition_metric_status_v1(
    (select metric_id from created_metric), 'approved', 'Unverified approval attempt'
  )$$,
  '23514', null, 'unverified evidence blocks metric approval'
);
select is((select evidence_status from public.transition_metric_evidence_v1(
  (select metric_id from created_metric), 'verified', 'Signed attendance audit revision 4',
  'Verify metric evidence'
)), 'verified'::public.evidence_status, 'publisher verifies metric evidence');
select is((select approved_by from public.metrics where id = (select metric_id from created_metric)), '00000000-0000-4000-8000-000000002503'::uuid, 'metric verification records the publisher');
select is((select status from public.transition_metric_status_v1((select metric_id from created_metric), 'approved', 'Approve verified metric')), 'approved'::public.publication_status, 'publisher approves the verified metric');
select throws_ok(
  $$select * from public.transition_metric_status_v1((select metric_id from created_metric), 'scheduled', 'Unsupported metric schedule')$$,
  '23514', 'metric scheduling is not implemented', 'metric API never claims fake scheduling'
);
select is((select status from public.transition_metric_status_v1((select metric_id from created_metric), 'published', 'Publish verified metric')), 'published'::public.publication_status, 'publisher publishes the verified metric');
select is((select publication_status from public.search_cms_metrics_v1(
  '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000002510', null, 'attendance', 10
) where metric_id = (select metric_id from created_metric)), 'published'::public.publication_status, 'authorized metric search matches event and source');
select is((select cardinality(warning_codes) from public.search_cms_metrics_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, 50
) where metric_id = (select metric_id from created_metric)), 0, 'published metric clears all warnings');
select throws_ok(
  $$select * from public.search_cms_metrics_v1('00000000-0000-4000-8000-000000000100', null, null, null, 101)$$,
  '22023', 'limit must be between 1 and 100', 'metric search rejects unbounded limits'
);
select throws_ok(
  $$select * from public.update_metric_v1(
    (select metric_id from created_metric),
    (select lock_version from public.metrics where id = (select metric_id from created_metric)),
    '00000000-0000-4000-8000-000000002510', 'contract.visitors', '12,750',
    'Unique verified visitors during the event', '2026-01-01', '2026-12-31',
    'Signed attendance audit', null, 'Protected published edit'
  )$$,
  '23514', 'metric must be draft before editing', 'published metrics cannot be edited in place'
);
reset role;

set local role anon;
select is((select count(*) from public.metrics where id = (select metric_id from created_metric)), 1::bigint, 'anonymous query sees the published metric');
reset role;
select ok((select count(*) from public.content_revisions where entity_table = 'metrics') >= 5, 'metric mutations create immutable revisions');
select ok((select count(*) from public.audit_events where domain = 'cms' and entity_table = 'metrics') >= 6, 'metric mutations create attributable audit evidence');

select * from finish();
rollback;
