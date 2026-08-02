begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(20);
select set_config('request.jwt.claims', '{"role":"service_role"}', true);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000601', 'authenticated', 'authenticated', 'workflow-manager@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000602', 'authenticated', 'authenticated', 'workflow-agent@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000603', 'authenticated', 'authenticated', 'workflow-admin@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000000601', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000000602', '00000000-0000-4000-8000-000000000100', 'sales_agent'),
  ('00000000-0000-4000-8000-000000000603', null, 'super_admin');

create temporary table first_acquisition on commit drop as
select * from app_private.acquire_lead_v1(
  'reference-foundation',
  'contact_request',
  '00000000-0000-4000-8000-000000000701',
  'en',
  'privacy-v1',
  true,
  'Lead@Test.Invalid',
  null,
  'Test',
  'Lead',
  null,
  null,
  'Please contact me',
  'lead_follow_up',
  '{"source":"contract-test","campaign":"workflow","landing_path":"/en/connect","cta_position":"hero"}'::jsonb,
  null,
  'workflow-request-1',
  'aaaaaaaaaaaaaaaa',
  'bbbbbbbbbbbbbbbb'
);
grant select on first_acquisition to authenticated;

select is((select disposition from first_acquisition), 'accepted', 'first acquisition is accepted');
select is((select count(*) from public.form_submissions), 1::bigint, 'successful submission is persisted');
select is((select count(*) from public.consents), 1::bigint, 'consent is persisted');
select is((select count(*) from public.campaign_attribution), 1::bigint, 'attribution is persisted');
select is((select count(*) from public.integration_jobs), 2::bigint, 'notification and confirmation jobs are queued');

select is(
  (
    select disposition from app_private.acquire_lead_v1(
      'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000000701',
      'en', 'privacy-v1', true, 'Lead@Test.Invalid'
    )
  ),
  'idempotent_replay',
  'same idempotency key returns the existing result'
);
select is((select count(*) from public.form_submissions), 1::bigint, 'idempotent retry creates no extra submission');

select is(
  (
    select lead_id = (select lead_id from first_acquisition)
      and contact_id = (select contact_id from first_acquisition)
    from app_private.acquire_lead_v1(
      'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000000702',
      'en', 'privacy-v1', true, 'lead@test.invalid'
    )
  ),
  true,
  'new submission deduplicates contact and lead by normalized identity'
);

select throws_ok(
  $$select * from app_private.acquire_lead_v1(
    'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000000703',
    'en', 'privacy-v1', false, 'no-consent@test.invalid'
  )$$,
  '22023',
  'affirmative consent and purpose are required',
  'non-consenting acquisition is rejected atomically'
);

select is(
  (select count(*) from public.lead_stage_history where lead_id = (select lead_id from first_acquisition)),
  1::bigint,
  'lead creation writes initial immutable stage history'
);

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000601","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.assign_lead_v1(%L, %L, %L)',
    (select lead_id from first_acquisition),
    '00000000-0000-4000-8000-000000000602',
    'workflow assignment'
  ),
  'manager assigns acquired lead'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000602","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.transition_lead_stage(%L, ''marketing_qualified'', ''validated acquisition'', ''review'', now() + interval ''1 day'')',
    (select lead_id from first_acquisition)
  ),
  'assigned agent advances lead through an allowed transition'
);
reset role;
select is(
  (select count(*) from public.lead_stage_history where lead_id = (select lead_id from first_acquisition)),
  2::bigint,
  'stage transition appends actor and reason history'
);

select set_config('request.jwt.claims', '{"role":"service_role"}', true);
insert into public.appointment_slots (
  id, site_id, staff_id, starts_at, ends_at, timezone, capacity, is_public
) values (
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000000601',
  now() + interval '7 days',
  now() + interval '7 days 30 minutes',
  'UTC',
  1,
  true
);
select pass('staff can configure a future public slot');

select throws_ok(
  $$insert into public.appointment_slots (
      id, site_id, staff_id, starts_at, ends_at, timezone, capacity, is_public
    ) values (
      '00000000-0000-4000-8000-000000000802',
      '00000000-0000-4000-8000-000000000100',
      '00000000-0000-4000-8000-000000000601',
      now() + interval '7 days 15 minutes',
      now() + interval '7 days 45 minutes',
      'UTC', 1, true
    )$$,
  '23P01',
  'appointment slot overlaps another active staff slot',
  'overlapping staff slot is rejected'
);

create temporary table first_booking on commit drop as
select * from app_private.book_appointment_v1(
  'reference-foundation',
  (select lead_id from first_acquisition),
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000811',
  'UTC',
  'Contract test booking'
);
select is((select appointment_status from first_booking), 'pending'::public.appointment_status, 'native booking starts pending');
select is(
  (
    select appointment_id from app_private.book_appointment_v1(
      'reference-foundation',
      (select lead_id from first_acquisition),
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000811',
      'UTC'
    )
  ),
  (select appointment_id from first_booking),
  'booking retry is idempotent'
);

insert into public.contacts (id, site_id, email, preferred_locale) values
  ('00000000-0000-4000-8000-000000000821', '00000000-0000-4000-8000-000000000100', 'capacity@test.invalid', 'en');
insert into public.leads (id, site_id, contact_id, acquisition_kind, dedupe_key) values
  ('00000000-0000-4000-8000-000000000822', '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000821', 'meeting_request', 'capacity-fixture');
select throws_ok(
  $$select * from app_private.book_appointment_v1(
      'reference-foundation',
      '00000000-0000-4000-8000-000000000822',
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000812',
      'UTC'
    )$$,
  '23514',
  'appointment slot is at capacity',
  'slot capacity is enforced under lock'
);

update public.integration_jobs
  set status = 'failed', attempt_count = 1, last_error_code = 'test_failure', last_error_at = now()
  where id = (select id from public.integration_jobs order by created_at limit 1);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000601","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format(
    'select * from public.retry_integration_job(%L)',
    (select id from public.integration_jobs where status = 'failed' order by created_at limit 1)
  ),
  'manager can safely retry a failed integration job'
);
reset role;

select is((select count(*) from public.appointments), 1::bigint, 'failed capacity attempt creates no extra appointment');

select * from finish();
rollback;
