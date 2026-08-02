begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(13);

select ok(
  to_regprocedure(
    'public.acquire_lead_edge_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,text,jsonb,text,text,text,text,integer,integer)'
  ) is not null,
  'service-only Edge acquisition RPC exists'
);
select ok(
  not has_function_privilege(
    'anon',
    'public.acquire_lead_edge_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,text,jsonb,text,text,text,text,integer,integer)',
    'execute'
  ),
  'anonymous callers cannot execute the Edge acquisition RPC directly'
);
select ok(
  not has_function_privilege(
    'authenticated',
    'public.acquire_lead_edge_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,text,jsonb,text,text,text,text,integer,integer)',
    'execute'
  ),
  'authenticated browser callers cannot execute the Edge acquisition RPC directly'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.acquire_lead_edge_v1(text,public.acquisition_kind,uuid,text,text,boolean,text,text,text,text,text,text,text,text,text,jsonb,text,text,text,text,integer,integer)',
    'execute'
  ),
  'service role can execute the Edge acquisition RPC'
);

select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;

create temporary table edge_first on commit drop as
select * from public.acquire_lead_edge_v1(
  'reference-foundation',
  'contact_request',
  '00000000-0000-4000-8000-000000001001',
  'en',
  'privacy-v1',
  true,
  repeat('a', 64),
  'edge-first@test.invalid',
  null,
  'Edge',
  'First',
  null,
  null,
  'Please contact me',
  'lead_follow_up',
  '{"source":"edge-contract"}'::jsonb,
  null,
  'edge-request-1',
  repeat('b', 64),
  repeat('c', 64),
  1,
  900
);
select is((select disposition from edge_first), 'accepted', 'first request inside the bucket is accepted');

create temporary table edge_retry on commit drop as
select * from public.acquire_lead_edge_v1(
  'reference-foundation',
  'contact_request',
  '00000000-0000-4000-8000-000000001001',
  'en',
  'privacy-v1',
  true,
  repeat('a', 64),
  'edge-first@test.invalid',
  null,
  'Edge',
  'First',
  null,
  null,
  'Please contact me',
  'lead_follow_up',
  '{"source":"edge-contract"}'::jsonb,
  null,
  'edge-request-1-retry',
  repeat('b', 64),
  repeat('c', 64),
  1,
  900
);
select is((select disposition from edge_retry), 'idempotent_replay', 'idempotent retry bypasses the rate ceiling');
select is(
  (select hit_count from app_private.acquisition_rate_limits where key_hash = repeat('a', 64)),
  1,
  'idempotent retry does not consume another rate-limit hit'
);

create temporary table edge_limited on commit drop as
select * from public.acquire_lead_edge_v1(
  'reference-foundation',
  'contact_request',
  '00000000-0000-4000-8000-000000001002',
  'en',
  'privacy-v1',
  true,
  repeat('a', 64),
  'edge-limited@test.invalid',
  null,
  'Edge',
  'Limited',
  null,
  null,
  'Please contact me',
  'lead_follow_up',
  '{}'::jsonb,
  null,
  'edge-request-2',
  repeat('b', 64),
  repeat('c', 64),
  1,
  900
);
select is((select disposition from edge_limited), 'rate_limited', 'a new request above the ceiling is rejected');
select is(
  (select hit_count from app_private.acquisition_rate_limits where key_hash = repeat('a', 64)),
  2,
  'rejected rate-limit hit is retained'
);
select is(
  (select count(*) from public.form_submissions where idempotency_key = '00000000-0000-4000-8000-000000001002'),
  0::bigint,
  'rate-limited request creates no CRM submission'
);

select throws_ok(
  $$select * from public.acquire_lead_edge_v1(
    'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000001003',
    'en', 'privacy-v1', true, 'not-a-hash', 'invalid-hash@test.invalid'
  )$$,
  '22023',
  'valid rate key hash is required',
  'raw or malformed rate identifiers are rejected'
);
select lives_ok(
  $$select app_private.prune_acquisition_rate_limits_v1(interval '2 days')$$,
  'service role can prune expired private rate buckets'
);

reset role;
select set_config('request.jwt.claims', '{}', true);

select ok(
  not has_table_privilege('anon', 'app_private.acquisition_rate_limits', 'select')
  and not has_table_privilege('authenticated', 'app_private.acquisition_rate_limits', 'select'),
  'browser roles cannot read private rate-limit state'
);

select * from finish();
rollback;
