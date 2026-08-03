begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(18);

select ok(
  not has_function_privilege('anon', 'public.claim_integration_jobs_v1(text,integer,integer)', 'execute')
  and not has_function_privilege('authenticated', 'public.claim_integration_jobs_v1(text,integer,integer)', 'execute'),
  'browser roles cannot claim integration jobs'
);
select ok(
  has_function_privilege('service_role', 'public.claim_integration_jobs_v1(text,integer,integer)', 'execute'),
  'service role can claim integration jobs'
);

select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;

create temporary table worker_acquisition on commit drop as
select * from public.acquire_lead_edge_v1(
  'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000001201',
  'en', 'privacy-v1', true, repeat('d', 64), 'worker@test.invalid', null,
  'Worker', 'Contract', null, null, 'Please contact me', 'lead_follow_up',
  '{}'::jsonb, null, 'worker-request-1', repeat('e', 64), repeat('f', 64), 8, 900
);
select is((select count(*) from public.integration_jobs), 2::bigint, 'email acquisition queues two executable jobs');

create temporary table first_claim on commit drop as
select * from public.claim_integration_jobs_v1('worker-a', 1, 300);
select is((select count(*) from first_claim), 1::bigint, 'worker atomically claims the requested batch size');
select is((select attempt_count from first_claim), 1, 'claim increments attempt count exactly once');
select is(
  (select job_context ->> 'contact_email' from first_claim),
  'worker@test.invalid',
  'claim returns service-only delivery context'
);
select is(
  (select status from public.integration_jobs where id = (select job_id from first_claim)),
  'processing'::public.integration_job_status,
  'claimed job enters processing state'
);
select throws_ok(
  format(
    'select public.complete_integration_job_v1(%L, %L, %L)',
    (select job_id from first_claim), 'worker-b', 'provider-wrong-lock'
  ),
  '55000',
  'integration job lock is not owned by worker',
  'a different worker cannot complete the claim'
);
select lives_ok(
  format(
    'select public.complete_integration_job_v1(%L, %L, %L)',
    (select job_id from first_claim), 'worker-a', 'provider-success-1'
  ),
  'lock owner completes the job'
);
select is(
  (select status from public.integration_jobs where id = (select job_id from first_claim)),
  'succeeded'::public.integration_job_status,
  'completed job is terminally succeeded'
);

create temporary table second_claim on commit drop as
select * from public.claim_integration_jobs_v1('worker-b', 1, 300);
select isnt(
  (select job_id from second_claim),
  (select job_id from first_claim),
  'later worker cannot reclaim a succeeded job'
);
select is(
  public.fail_integration_job_v1(
    (select job_id from second_claim), 'worker-b', 'provider_unavailable', true, 60
  ),
  'failed'::public.integration_job_status,
  'retryable provider failure enters failed state'
);
select ok(
  (select locked_by is null and available_at > now() from public.integration_jobs where id = (select job_id from second_claim)),
  'retryable failure releases the lock and schedules backoff'
);

reset role;
update public.integration_jobs
set available_at = now()
where id = (select job_id from second_claim);
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
set local role service_role;

create temporary table retry_claim on commit drop as
select * from public.claim_integration_jobs_v1('worker-c', 1, 300);
select is((select attempt_count from retry_claim), 2, 'retry claim increments the persisted attempt count');
select is(
  public.fail_integration_job_v1(
    (select job_id from retry_claim), 'worker-c', 'invalid_recipient', false, 60
  ),
  'dead_letter'::public.integration_job_status,
  'non-retryable provider failure enters dead letter'
);

create temporary table phone_acquisition on commit drop as
select * from public.acquire_lead_edge_v1(
  'reference-foundation', 'contact_request', '00000000-0000-4000-8000-000000001202',
  'en', 'privacy-v1', true, repeat('1', 64), null, '+212600000001',
  'Phone', 'Only', null, null, null, 'lead_follow_up', '{}'::jsonb, null,
  'worker-request-phone', repeat('2', 64), repeat('3', 64), 8, 900
);
select is(
  (
    select count(*)
    from public.integration_jobs
    where lead_id = (select lead_id from phone_acquisition)
  ),
  1::bigint,
  'phone-only acquisition does not enqueue an impossible confirmation email'
);
select is(
  (
    select job_kind
    from public.integration_jobs
    where lead_id = (select lead_id from phone_acquisition)
  ),
  'contact_notification',
  'phone-only acquisition still notifies the internal CRM queue'
);

select throws_ok(
  $$select * from public.claim_integration_jobs_v1('!', 1, 300)$$,
  '22023',
  'valid worker id is required',
  'malformed worker identifiers are rejected'
);

reset role;
select set_config('request.jwt.claims', '{}', true);

select * from finish();
rollback;
