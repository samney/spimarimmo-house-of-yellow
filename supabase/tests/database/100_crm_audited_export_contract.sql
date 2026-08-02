begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(30);

select ok(
  not has_function_privilege(
    'anon',
    'public.export_crm_leads_v1(uuid,public.lead_stage,uuid,uuid,timestamptz,timestamptz,integer,text)',
    'execute'
  ),
  'anonymous callers cannot execute CRM exports'
);
select ok(
  has_function_privilege(
    'authenticated',
    'public.export_crm_leads_v1(uuid,public.lead_stage,uuid,uuid,timestamptz,timestamptz,integer,text)',
    'execute'
  ),
  'authenticated staff may enter the permission-checked export transaction'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001601', 'authenticated', 'authenticated', 'export-manager@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001602', 'authenticated', 'authenticated', 'export-agent@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001603', 'authenticated', 'authenticated', 'export-analyst@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000001604', 'authenticated', 'authenticated', 'export-admin@test.invalid', crypt('test-only', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');
insert into public.profile_roles (profile_id, site_id, role) values
  ('00000000-0000-4000-8000-000000001601', '00000000-0000-4000-8000-000000000100', 'sales_manager'),
  ('00000000-0000-4000-8000-000000001602', '00000000-0000-4000-8000-000000000100', 'sales_agent'),
  ('00000000-0000-4000-8000-000000001603', '00000000-0000-4000-8000-000000000100', 'analyst'),
  ('00000000-0000-4000-8000-000000001604', null, 'super_admin');

insert into public.sites (id, slug, name, default_locale, timezone) values (
  '00000000-0000-4000-8000-000000001690',
  'export-other-site',
  'Export Other Site',
  'en',
  'UTC'
);
insert into public.events (id, site_id, event_key, slug, timezone) values (
  '00000000-0000-4000-8000-000000001610',
  '00000000-0000-4000-8000-000000000100',
  'export.contract.event',
  'export-contract-event',
  'UTC'
);
insert into public.organizations (
  id, site_id, legal_name, organization_kind, country_code, owner_id
) values (
  '00000000-0000-4000-8000-000000001620',
  '00000000-0000-4000-8000-000000000100',
  'Atlas Exhibitions',
  'exhibitor',
  'MA',
  '00000000-0000-4000-8000-000000001601'
);
insert into public.contacts (
  id, site_id, organization_id, email, phone, first_name, last_name,
  preferred_locale, owner_id, anonymized_at
) values
  (
    '00000000-0000-4000-8000-000000001631',
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001620',
    'amina@example.test',
    '+212600000001',
    'Amina',
    'Alaoui',
    'fr',
    '00000000-0000-4000-8000-000000001601',
    null
  ),
  (
    '00000000-0000-4000-8000-000000001632',
    '00000000-0000-4000-8000-000000000100',
    null,
    'youssef@example.test',
    '+212600000002',
    'Youssef',
    'Bennani',
    'en',
    '00000000-0000-4000-8000-000000001601',
    null
  ),
  (
    '00000000-0000-4000-8000-000000001633',
    '00000000-0000-4000-8000-000000000100',
    null,
    'removed@example.test',
    null,
    'Removed',
    'Contact',
    'en',
    null,
    now()
  );
insert into public.leads (
  id, site_id, contact_id, organization_id, event_id, acquisition_kind,
  dedupe_key, owner_id, source_label, campaign_label, next_action,
  next_action_at, created_at, anonymized_at
) values
  (
    '00000000-0000-4000-8000-000000001641',
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001631',
    '00000000-0000-4000-8000-000000001620',
    '00000000-0000-4000-8000-000000001610',
    'brochure_request',
    'export-contract-lead-one',
    '00000000-0000-4000-8000-000000001601',
    'linkedin',
    'spring-2027',
    'Call about premium package',
    now() + interval '1 day',
    now() - interval '2 days',
    null
  ),
  (
    '00000000-0000-4000-8000-000000001642',
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001632',
    null,
    null,
    'proposal_request',
    'export-contract-lead-two',
    '00000000-0000-4000-8000-000000001601',
    'google',
    'proposal-2027',
    null,
    null,
    now() - interval '1 hour',
    null
  ),
  (
    '00000000-0000-4000-8000-000000001643',
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001633',
    null,
    null,
    'contact_request',
    'export-contract-anonymized',
    null,
    null,
    null,
    null,
    null,
    now() - interval '1 day',
    now()
  );
select set_config('app.transition_reason', 'export contract fixture', true);
update public.leads
set stage = 'deduplicated'
where id = '00000000-0000-4000-8000-000000001642';
select set_config('app.transition_reason', '', true);

insert into public.campaign_attribution (
  site_id, lead_id, attribution_model, source, medium, campaign, term,
  content, referrer, landing_path, cta_position
) values (
  '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000001641',
  'last_touch',
  'linkedin',
  'paid_social',
  'spring-2027',
  'real-estate-exhibition',
  'hero-video',
  'https://linkedin.example.test/campaign',
  '/fr/exposer',
  'hero-primary'
);
insert into public.consents (
  site_id, contact_id, lead_id, purpose, granted, notice_version, locale
) values
  (
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001631',
    '00000000-0000-4000-8000-000000001641',
    'lead_follow_up',
    true,
    'privacy-2027-01',
    'fr'
  ),
  (
    '00000000-0000-4000-8000-000000000100',
    '00000000-0000-4000-8000-000000001632',
    '00000000-0000-4000-8000-000000001642',
    'proposal_follow_up',
    true,
    'privacy-2027-01',
    'en'
  );

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001602","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 100,
    '11111111-1111-4111-8111-111111111111'
  )$$,
  '42501',
  'crm.export permission required',
  'sales agents cannot export CRM personal data'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001603","role":"authenticated"}', true);
set local role authenticated;
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 100,
    '22222222-2222-4222-8222-222222222222'
  )$$,
  '42501',
  'crm.export permission required',
  'analysts cannot export CRM personal data'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001601","role":"authenticated"}', true);
set local role authenticated;
create temporary table crm_export on commit drop as
select * from public.export_crm_leads_v1(
  '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 100,
  '33333333-3333-4333-8333-333333333333'
);
grant select on crm_export to authenticated, anon;
select pass('sales manager executes a governed CRM export');
select is((select count(*) from crm_export), 2::bigint, 'export includes active non-anonymized leads only');
select is(
  (select count(*) from crm_export where lead_id = '00000000-0000-4000-8000-000000001643'),
  0::bigint,
  'anonymized leads never enter export rows'
);
select is((select count(distinct export_id) from crm_export), 1::bigint, 'one export has a stable correlation identifier');
select is(
  (select email from crm_export where lead_id = '00000000-0000-4000-8000-000000001641'),
  'amina@example.test',
  'authorized export contains the intended contact email'
);
select is(
  (select attribution_medium from crm_export where lead_id = '00000000-0000-4000-8000-000000001641'),
  'paid_social',
  'authorized export preserves campaign attribution'
);
select is(
  (select consent_purposes from crm_export where lead_id = '00000000-0000-4000-8000-000000001641'),
  array['lead_follow_up']::text[],
  'authorized export includes active consent purposes'
);
select ok(
  not (to_jsonb((select row_value from crm_export row_value limit 1)) ?| array['message', 'notes', 'ip_hash', 'user_agent_hash']),
  'export schema excludes messages, notes, and request fingerprints'
);
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', 'new', null, null, null, null, 100,
      '44444444-4444-4444-8444-444444444444'
    )
  ),
  1::bigint,
  'stage filter is enforced inside the export transaction'
);
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', null, null,
      '00000000-0000-4000-8000-000000001601', null, null, 100,
      '55555555-5555-4555-8555-555555555555'
    )
  ),
  2::bigint,
  'owner filter is enforced inside the export transaction'
);
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', null, null, null,
      now() - interval '6 hours', null, 100,
      '66666666-6666-4666-8666-666666666666'
    )
  ),
  1::bigint,
  'created-date filter is enforced inside the export transaction'
);
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 1,
      '77777777-7777-4777-8777-777777777777'
    )
  ),
  1::bigint,
  'export row count is bounded by the requested maximum'
);
select is(
  (
    select count(*)
    from public.audit_events
    where domain = 'crm' and action = 'export'
      and actor_id = '00000000-0000-4000-8000-000000001601'
  ),
  5::bigint,
  'every successful manager export writes one audit event'
);
select ok(
  not exists (
    select 1 from public.audit_events
    where domain = 'crm' and action = 'export'
      and actor_id is distinct from '00000000-0000-4000-8000-000000001601'
  ),
  'denied export attempts do not create misleading success audits'
);
select is(
  (
    select request_id
    from public.audit_events
    where domain = 'crm' and action = 'export'
      and request_id = '33333333-3333-4333-8333-333333333333'
  ),
  '33333333-3333-4333-8333-333333333333',
  'export audit preserves the request correlation identifier'
);
select is(
  (
    select (metadata ->> 'exportedRowCount')::integer
    from public.audit_events
    where request_id = '33333333-3333-4333-8333-333333333333'
  ),
  2,
  'export audit records the exported row count'
);
select ok(
  (
    select metadata::text not ilike '%amina@example.test%'
      and metadata::text not ilike '%youssef@example.test%'
      and not (metadata ?| array['email', 'phone', 'firstName', 'lastName'])
    from public.audit_events
    where request_id = '33333333-3333-4333-8333-333333333333'
  ),
  'export audit metadata contains no contact PII'
);
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', 'won', null, null, null, null, 100,
      '88888888-8888-4888-8888-888888888888'
    )
  ),
  0::bigint,
  'empty governed exports return zero rows truthfully'
);
select is(
  (
    select count(*)
    from public.audit_events
    where domain = 'crm' and action = 'export'
      and actor_id = '00000000-0000-4000-8000-000000001601'
  ),
  6::bigint,
  'empty successful exports are still audited'
);
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 1001,
    '99999999-9999-4999-8999-999999999999'
  )$$,
  '22023',
  'export row limit must be between 1 and 1000',
  'unbounded export requests are rejected'
);
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null, null,
    now(), now() - interval '1 day', 100, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  )$$,
  '22023',
  'export created_to must be after created_from',
  'reversed export date ranges are rejected'
);
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null,
    '00000000-0000-4000-8000-000000009999', null, null, null, 100,
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  )$$,
  '22023',
  'export event must belong to the site',
  'unknown event filters are rejected'
);
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000000100', null, null,
    '00000000-0000-4000-8000-000000009998', null, null, 100,
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  )$$,
  '22023',
  'export owner must belong to the site',
  'unknown owner filters are rejected'
);
select throws_ok(
  $$select * from public.export_crm_leads_v1(
    '00000000-0000-4000-8000-000000001690', null, null, null, null, null, 100,
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
  )$$,
  '42501',
  'crm.export permission required',
  'site-scoped manager cannot export another tenant'
);
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000001604","role":"authenticated"}', true);
set local role authenticated;
select is(
  (
    select count(*)
    from public.export_crm_leads_v1(
      '00000000-0000-4000-8000-000000000100', null, null, null, null, null, 100,
      'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'
    )
  ),
  2::bigint,
  'super administrator may execute the governed export'
);
select is(
  (
    select count(*)
    from public.audit_events
    where domain = 'crm' and action = 'export'
  ),
  7::bigint,
  'final export audit count matches every successful export transaction'
);
reset role;

select set_config('request.jwt.claims', '{}', true);
select * from finish();
rollback;
