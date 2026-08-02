begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(19);

select ok(
  not has_function_privilege('anon', 'public.crm_pipeline_summary(uuid)', 'execute'),
  'anonymous callers cannot execute pipeline analytics'
);
select ok(
  has_function_privilege('authenticated', 'public.crm_pipeline_summary(uuid)', 'execute'),
  'authenticated staff may enter the permission-checked analytics transaction'
);
select volatility_is(
  'public',
  'crm_pipeline_summary',
  array['uuid'],
  'stable',
  'pipeline analytics is declared stable'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001701', 'authenticated', 'authenticated', 'pipeline-analyst@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001702', 'authenticated', 'authenticated', 'pipeline-editor@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001703', 'authenticated', 'authenticated', 'pipeline-manager@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001704', 'authenticated', 'authenticated', 'pipeline-admin@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001701', '00000000-0000-4000-8000-000000000100', 'analyst'),
  ('00000000-0000-4000-8000-000000001702', '00000000-0000-4000-8000-000000000100', 'content_editor'),
  ('00000000-0000-4000-8000-000000001703', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000001704', null, 'super_admin');

insert into public.sites (id, slug, name, status, default_locale, timezone) values
  ('00000000-0000-4000-8000-000000001790', 'pipeline-other-site', 'Pipeline Other Site', 'active', 'en', 'UTC');

insert into public.contacts (id, site_id, email, preferred_locale, anonymized_at) values
  ('00000000-0000-4000-8000-000000001711', '00000000-0000-4000-8000-000000000100', 'pipeline-one@test.invalid', 'en', null),
  ('00000000-0000-4000-8000-000000001712', '00000000-0000-4000-8000-000000000100', 'pipeline-two@test.invalid', 'fr', null),
  ('00000000-0000-4000-8000-000000001713', '00000000-0000-4000-8000-000000000100', 'pipeline-removed@test.invalid', 'en', now());

insert into public.leads (
  id, site_id, contact_id, acquisition_kind, dedupe_key, stage, owner_id,
  queue_key, anonymized_at
) values
  ('00000000-0000-4000-8000-000000001721', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001711', 'contact_request', 'pipeline-one', 'new', null, 'unassigned', null),
  ('00000000-0000-4000-8000-000000001722', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001712', 'contact_request', 'pipeline-two', 'new', '00000000-0000-4000-8000-000000001703', 'assigned', null),
  ('00000000-0000-4000-8000-000000001723', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001713', 'contact_request', 'pipeline-removed', 'new', null, 'unassigned', now());

insert into public.appointment_slots (
  id, site_id, staff_id, starts_at, ends_at, timezone, capacity, is_public
) values (
  '00000000-0000-4000-8000-000000001731',
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000001703',
  now() + interval '30 days',
  now() + interval '30 days 1 hour',
  'UTC',
  2,
  false
);
insert into public.appointments (
  id, site_id, lead_id, slot_id, status, timezone
) values
  ('00000000-0000-4000-8000-000000001741', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001721', '00000000-0000-4000-8000-000000001731', 'pending', 'UTC'),
  ('00000000-0000-4000-8000-000000001742', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000001721', '00000000-0000-4000-8000-000000001731', 'pending', 'UTC');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001702","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.crm_pipeline_summary('00000000-0000-4000-8000-000000000100')$$,
  '42501',
  'analytics.read permission required',
  'content editors cannot read CRM analytics'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001701","role":"authenticated"}', true);
set local role authenticated;
create temporary table pipeline_result on commit drop as
select * from public.crm_pipeline_summary('00000000-0000-4000-8000-000000000100');

select is((select count(*) from pipeline_result), 14::bigint, 'analytics returns every pipeline stage');
select is((select sum(lead_count) from pipeline_result), 2::numeric, 'analytics excludes anonymized leads');
select is((select lead_count from pipeline_result where stage = 'new'), 2::bigint, 'multiple appointments do not inflate lead count');
select is((select unassigned_count from pipeline_result where stage = 'new'), 1::bigint, 'unassigned lead count remains distinct');
select is((select appointment_count from pipeline_result where stage = 'new'), 2::bigint, 'active appointment count remains distinct');
select is((select lead_count from pipeline_result where stage = 'won'), 0::bigint, 'empty stages return an explicit zero');
select ok(
  not (to_jsonb((select value from pipeline_result value where stage = 'new')) ?| array['email', 'phone', 'first_name', 'last_name', 'contact_id', 'message', 'notes']),
  'pipeline schema exposes no contact PII or free text'
);
select throws_ok(
  $$select * from public.crm_pipeline_summary('00000000-0000-4000-8000-000000001790')$$,
  '42501',
  'analytics.read permission required',
  'site-scoped analyst cannot inspect another tenant'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001703","role":"authenticated"}', true);
set local role authenticated;
select is((select sum(lead_count) from public.crm_pipeline_summary('00000000-0000-4000-8000-000000000100')), 2::numeric, 'sales manager can read tenant analytics');
select is((select sum(appointment_count) from public.crm_pipeline_summary('00000000-0000-4000-8000-000000000100')), 2::numeric, 'manager aggregate preserves appointment totals');
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001704","role":"authenticated"}', true);
set local role authenticated;
select is((select count(*) from public.crm_pipeline_summary('00000000-0000-4000-8000-000000001790')), 14::bigint, 'super administrator can read another tenant aggregate');
select is((select sum(lead_count) from public.crm_pipeline_summary('00000000-0000-4000-8000-000000001790')), 0::numeric, 'empty tenant aggregate contains zero leads');
select throws_ok(
  $$select * from public.crm_pipeline_summary('00000000-0000-4000-8000-000000001799')$$,
  'P0002',
  'site not found',
  'unknown tenant is rejected instead of returning a misleading empty dashboard'
);
reset role;

select is(
  (select count(*) from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'crm_pipeline_summary' and grantee = 'anon'),
  0::bigint,
  'anonymous execution has no residual routine grant'
);
select is(
  (select count(*) from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'crm_pipeline_summary' and grantee = 'authenticated'),
  1::bigint,
  'authenticated execution has one explicit routine grant'
);

select * from finish();
rollback;
