begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(40);

select ok(
  not has_function_privilege('anon', 'public.search_crm_leads_v1(uuid,public.lead_stage,uuid,text,text,integer,integer)', 'execute'),
  'anonymous callers cannot execute CRM lead search'
);
select ok(
  has_function_privilege('authenticated', 'public.search_crm_leads_v1(uuid,public.lead_stage,uuid,text,text,integer,integer)', 'execute'),
  'authenticated staff may enter permission-checked CRM search'
);
select ok(
  not has_table_privilege('authenticated', 'public.activities', 'insert'),
  'browser clients cannot bypass governed activity actor stamping'
);
select ok(
  not has_table_privilege('authenticated', 'public.leads', 'update'),
  'browser clients cannot bypass governed lead workflows'
);
select ok(
  not has_table_privilege('authenticated', 'public.notes', 'insert'),
  'browser clients cannot spoof note authors'
);
select ok(
  not has_table_privilege('authenticated', 'public.tasks', 'insert'),
  'browser clients cannot spoof task creators'
);
select ok(
  not has_table_privilege('authenticated', 'public.contacts', 'update'),
  'browser clients cannot spoof CRM contact audit fields'
);
select ok(
  not has_table_privilege('authenticated', 'public.organizations', 'update'),
  'browser clients cannot spoof CRM organization audit fields'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001401', 'authenticated', 'authenticated', 'crm-manager@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001402', 'authenticated', 'authenticated', 'crm-agent@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001403', 'authenticated', 'authenticated', 'crm-other-agent@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001404', 'authenticated', 'authenticated', 'crm-analyst@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001401', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000001402', '00000000-0000-4000-8000-000000000100', 'sales_agent'),
  ('00000000-0000-4000-8000-000000001403', '00000000-0000-4000-8000-000000000100', 'sales_agent'),
  ('00000000-0000-4000-8000-000000001404', '00000000-0000-4000-8000-000000000100', 'analyst');

select set_config('request.jwt.claims', '{"role":"service_role"}', true);
create temporary table first_crm_lead on commit drop as
select * from app_private.acquire_lead_v1(
  'reference-foundation', 'brochure_request', '00000000-0000-4000-8000-000000001411',
  'fr', 'privacy-v1', true, 'first.crm@test.invalid', '+212600000001', 'First', 'Prospect',
  'Atlas Development', null, 'Send the brochure', 'lead_follow_up',
  '{"source":"linkedin","campaign":"crm-contract","cta_position":"hero"}'::jsonb
);
create temporary table second_crm_lead on commit drop as
select * from app_private.acquire_lead_v1(
  'reference-foundation', 'exhibitor_enquiry', '00000000-0000-4000-8000-000000001412',
  'en', 'privacy-v1', true, 'second.crm@test.invalid', '+212600000002', 'Second', 'Prospect',
  'Rif Properties', null, 'Discuss exhibiting', 'lead_follow_up',
  '{"source":"search","campaign":"crm-contract-two","cta_position":"footer"}'::jsonb
);
grant select on first_crm_lead, second_crm_lead to authenticated;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001401","role":"authenticated"}', true);
set local role authenticated;
select is(
  (select count(*) from public.search_crm_leads_v1('00000000-0000-4000-8000-000000000100')),
  2::bigint,
  'sales manager sees the full authorized tenant queue'
);
select is(
  (select count(*) from public.search_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, 'unassigned', 'atlas', 20, 0
  )),
  1::bigint,
  'CRM search combines controlled queue and contact organization filters'
);
select is(
  (select count(*) from public.search_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, null, 1, 1
  )),
  1::bigint,
  'CRM search enforces bounded pagination'
);
select lives_ok(
  format(
    'select * from public.assign_lead_v1(%L, %L, %L)',
    (select lead_id from first_crm_lead),
    '00000000-0000-4000-8000-000000001402',
    'Assign brochure lead to agent'
  ),
  'sales manager assigns the lead through the governed transaction'
);
select is(
  (select assigned_by from public.lead_assignments where lead_id = (select lead_id from first_crm_lead) and ended_at is null),
  '00000000-0000-4000-8000-000000001401'::uuid,
  'lead assignment records the authenticated manager'
);
select is(
  (select jsonb_array_length(public.crm_lead_workspace_v1((select lead_id from first_crm_lead)) -> 'integrationJobs')),
  2,
  'manager workspace exposes operational job state without payloads'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001404","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.search_crm_leads_v1('00000000-0000-4000-8000-000000000100')$$,
  '42501',
  'CRM read permission required',
  'analyst cannot read CRM personal data through the API'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001402","role":"authenticated"}', true);
set local role authenticated;
select is(
  (select count(*) from public.search_crm_leads_v1('00000000-0000-4000-8000-000000000100')),
  1::bigint,
  'sales agent search returns only assigned leads'
);
select throws_ok(
  $$select * from public.search_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null,
    '00000000-0000-4000-8000-000000001403', null, null, 50, 0
  )$$,
  '42501',
  'assigned CRM users can filter only their own records',
  'sales agent cannot probe another owner queue'
);
select is(
  public.crm_lead_workspace_v1((select lead_id from first_crm_lead)) #>> '{contact,email}',
  'first.crm@test.invalid',
  'assigned agent can open the authorized lead workspace'
);
select is(
  jsonb_array_length(public.crm_lead_workspace_v1((select lead_id from first_crm_lead)) -> 'integrationJobs'),
  0,
  'sales agent workspace hides manager-only integration operations'
);

create temporary table created_note on commit drop as
select * from public.add_lead_note_v1((select lead_id from first_crm_lead), 'Qualified budget and decision timeline.');
grant select on created_note to authenticated;
select is((select author_id from created_note), '00000000-0000-4000-8000-000000001402'::uuid, 'lead note records the authenticated author');
select is((select body from public.notes where id = (select note_id from created_note)), 'Qualified budget and decision timeline.', 'lead note is durably stored');

create temporary table created_activity on commit drop as
select * from public.record_lead_activity_v1(
  (select lead_id from first_crm_lead), 'call', 'Qualification call', 'Discussed event objectives', now()
);
grant select on created_activity to authenticated;
select is((select actor_id from created_activity), '00000000-0000-4000-8000-000000001402'::uuid, 'lead activity records the authenticated actor');
select is((select activity_kind from public.activities where id = (select activity_id from created_activity)), 'call', 'lead activity is durably stored');

create temporary table created_task on commit drop as
select * from public.create_lead_task_v1(
  (select lead_id from first_crm_lead), 'Prepare qualification brief', 'Summarize objectives', now() + interval '1 day', null
);
grant select on created_task to authenticated;
select is((select assignee_id from created_task), '00000000-0000-4000-8000-000000001402'::uuid, 'agent task defaults to the authenticated assignee');
select is((select created_by from created_task), '00000000-0000-4000-8000-000000001402'::uuid, 'task records the authenticated creator');
select lives_ok(
  format('select * from public.transition_lead_task_v1(%L, ''completed'')', (select task_id from created_task)),
  'assigned agent completes a lead task through the governed transaction'
);
select ok((select completed_at is not null from public.tasks where id = (select task_id from created_task)), 'completed task receives a completion timestamp');
select lives_ok(
  format(
    'select * from public.transition_lead_stage(%L, ''marketing_qualified'', %L, %L, now() + interval ''1 day'')',
    (select lead_id from first_crm_lead), 'Qualification criteria met', 'Manager review'
  ),
  'assigned agent advances the lead through an allowed stage transition'
);
select is(
  (select actor_id from public.lead_stage_history where lead_id = (select lead_id from first_crm_lead) order by changed_at desc, id desc limit 1),
  '00000000-0000-4000-8000-000000001402'::uuid,
  'lead stage history records the authenticated agent'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001403","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  format('select public.crm_lead_workspace_v1(%L)', (select lead_id from first_crm_lead)),
  '42501',
  'lead read is not authorized',
  'unassigned sales agent cannot open another agent workspace'
);
select throws_ok(
  format('select * from public.add_lead_note_v1(%L, %L)', (select lead_id from first_crm_lead), 'Unauthorized note'),
  '42501',
  'lead note is not authorized',
  'unassigned sales agent cannot add a note'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001401","role":"authenticated"}', true);
set local role authenticated;
create temporary table bookable_slot on commit drop as
select * from public.create_appointment_slot_v1(
  '00000000-0000-4000-8000-000000000100', null,
  '00000000-0000-4000-8000-000000001402', now() + interval '8 days',
  now() + interval '8 days 30 minutes', 'Africa/Casablanca', 1, true
);
grant select on bookable_slot to authenticated;
select is((select count(*) from bookable_slot), 1::bigint, 'sales manager creates a future appointment slot');
select is(
  (select created_by from public.appointment_slots where id = (select slot_id from bookable_slot)),
  '00000000-0000-4000-8000-000000001401'::uuid,
  'appointment slot records the authenticated manager'
);

create temporary table cancellable_slot on commit drop as
select * from public.create_appointment_slot_v1(
  '00000000-0000-4000-8000-000000000100', null,
  '00000000-0000-4000-8000-000000001402', now() + interval '9 days',
  now() + interval '9 days 30 minutes', 'Africa/Casablanca', 1, false
);
grant select on cancellable_slot to authenticated;
select lives_ok(
  format('select * from public.cancel_appointment_slot_v1(%L, %L)', (select slot_id from cancellable_slot), 'Staff availability changed'),
  'sales manager cancels an unused appointment slot'
);
select is(
  (select metadata ->> 'reason' from public.audit_events where action = 'appointment_slot.cancelled' and entity_id = (select slot_id from cancellable_slot)::text order by occurred_at desc limit 1),
  'Staff availability changed',
  'slot cancellation writes a reasoned audit event'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001402","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.create_appointment_slot_v1(
    '00000000-0000-4000-8000-000000000100', null,
    '00000000-0000-4000-8000-000000001402', now() + interval '10 days',
    now() + interval '10 days 30 minutes', 'Africa/Casablanca', 1, false
  )$$,
  '42501',
  'crm.write_all permission required',
  'sales agent cannot configure appointment inventory'
);
reset role;

select set_config('request.jwt.claims', '{"role":"service_role"}', true);
create temporary table booked_appointment on commit drop as
select * from app_private.book_appointment_v1(
  'reference-foundation', (select lead_id from first_crm_lead), (select slot_id from bookable_slot),
  '00000000-0000-4000-8000-000000001421', 'Africa/Casablanca', 'POC meeting'
);
grant select on booked_appointment to authenticated;
select is((select appointment_status from booked_appointment), 'pending'::public.appointment_status, 'native booking transaction creates a pending appointment');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001402","role":"authenticated"}', true);
set local role authenticated;
select lives_ok(
  format('select * from public.transition_appointment_status(%L, ''confirmed'', %L)', (select appointment_id from booked_appointment), 'Confirmed with prospect'),
  'assigned agent confirms the native appointment'
);
select is(
  (select updated_by from public.appointments where id = (select appointment_id from booked_appointment)),
  '00000000-0000-4000-8000-000000001402'::uuid,
  'appointment transition records the authenticated agent'
);
reset role;

select ok(
  (select count(*) >= 8 from public.audit_events where domain = 'crm' and actor_id in (
    '00000000-0000-4000-8000-000000001401',
    '00000000-0000-4000-8000-000000001402'
  )),
  'CRM workspace mutations create attributable audit evidence'
);

select set_config('request.jwt.claims', '{}', true);
select * from finish();
rollback;
