-- Contract tests for the four canonical corrections (202608020001-202608020004).
--
-- Every slice is exercised on both the positive and the negative path: it is not
-- enough that the canonical record exists, it must also refuse the thing it was
-- introduced to prevent.

begin;

create extension if not exists pgtap with schema extensions;
set local search_path = pg_catalog, public, extensions;
select plan(75);

-- ---------------------------------------------------------------------------
-- Fixtures
-- ---------------------------------------------------------------------------

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003001',
   'authenticated', 'authenticated', 'canon-admin@test.invalid',
   crypt('test-only', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003002',
   'authenticated', 'authenticated', 'canon-contributor@test.invalid',
   crypt('test-only', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003003',
   'authenticated', 'authenticated', 'canon-publisher@test.invalid',
   crypt('test-only', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003004',
   'authenticated', 'authenticated', 'canon-evidence@test.invalid',
   crypt('test-only', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000003005',
   'authenticated', 'authenticated', 'canon-editor@test.invalid',
   crypt('test-only', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into public.profile_roles (profile_id, site_id, role)
values ('00000000-0000-4000-8000-000000003001', null, 'super_admin');

insert into public.profile_capability_assignments (profile_id, site_id, capability_profile) values
  ('00000000-0000-4000-8000-000000003002', '00000000-0000-4000-8000-000000000100', 'contributor'),
  ('00000000-0000-4000-8000-000000003003', '00000000-0000-4000-8000-000000000100', 'publisher'),
  ('00000000-0000-4000-8000-000000003004', '00000000-0000-4000-8000-000000000100', 'evidence_reviewer'),
  ('00000000-0000-4000-8000-000000003005', '00000000-0000-4000-8000-000000000100', 'editor');

insert into public.venues (id, site_id, venue_key, city, country_code, timezone)
values ('00000000-0000-4000-8000-000000003011', '00000000-0000-4000-8000-000000000100',
        'canon-venue', 'Test City', 'MA', 'UTC');

insert into public.events (
  id, site_id, event_key, slug, venue_id, timezone, starts_at, ends_at
) values (
  '00000000-0000-4000-8000-000000003012',
  '00000000-0000-4000-8000-000000000100',
  'canon.contract.event',
  'canon-contract-event',
  '00000000-0000-4000-8000-000000003011',
  'UTC',
  now() + interval '30 days',
  now() + interval '31 days'
);

-- ===========================================================================
-- Slice 1: independent event axes
-- ===========================================================================

select has_table('public', 'event_axis_history', 'axis history table exists');
select has_column('public', 'events', 'lifecycle_axis', 'events carry a canonical lifecycle axis');
select has_column('public', 'events', 'exhibitor_sales_status', 'events carry exhibitor sales availability');
select has_column('public', 'events', 'visitor_registration_status', 'events carry visitor registration availability');

-- The whole point of the correction: the three axes are independent, so a state
-- the legacy enum could not express must now be expressible.
select is(
  (select count(*) from unnest(enum_range(null::public.event_exhibitor_sales_status)) v
   where v::text in ('limited', 'sold_out')),
  2::bigint,
  'exhibitor sales can be limited or sold out'
);
select is(
  (select count(*) from unnest(enum_range(null::public.event_visitor_registration_status)) v
   where v::text in ('waitlist', 'full')),
  2::bigint,
  'visitor registration can be waitlisted or full'
);
select is(
  (select count(*) from unnest(enum_range(null::public.event_lifecycle_axis)) v
   where v::text = 'review'),
  0::bigint,
  'editorial review is not an event lifecycle value'
);

-- A new event is unambiguous and resolves immediately.
select is(
  (select lifecycle_axis from public.events where id = '00000000-0000-4000-8000-000000003012'),
  'draft'::public.event_lifecycle_axis,
  'a new event starts on the draft lifecycle axis'
);
select is(
  (select axis_reconciliation from public.events where id = '00000000-0000-4000-8000-000000003012'),
  'resolved'::public.event_axis_reconciliation,
  'a new event needs no manual reconciliation'
);
select is(
  (select count(*) from public.event_axis_history
   where event_id = '00000000-0000-4000-8000-000000003012'),
  1::bigint,
  'event creation records one axis history row'
);

-- The projection implements the approved mapping, including its ambiguity.
select ok(
  (select ambiguous from app_private.legacy_event_axis_projection('draft')) = false,
  'draft projects unambiguously'
);
select ok(
  (select ambiguous from app_private.legacy_event_axis_projection('review')),
  'editorial review is ambiguous and needs manual reconciliation'
);
select ok(
  (select ambiguous from app_private.legacy_event_axis_projection('live')),
  'live is ambiguous for availability and needs manual reconciliation'
);
select is(
  (select exhibitor_sales_status from app_private.legacy_event_axis_projection('exhibitor_sales_open')),
  'open'::public.event_exhibitor_sales_status,
  'exhibitor_sales_open still yields the availability it does evidence'
);
select is(
  (select lifecycle_axis from app_private.legacy_event_axis_projection('exhibitor_sales_open')),
  null,
  'exhibitor_sales_open does not invent a lifecycle value'
);
select is(
  (select visitor_registration_status from app_private.legacy_event_axis_projection('recap_waitlist')),
  null,
  'recap_waitlist does not invent a waitlist availability'
);

-- Independent control of the two availability axes at once.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003001","role":"authenticated"}', true);

select lives_ok(
  $$select public.set_event_axes_v1(
      '00000000-0000-4000-8000-000000003012',
      'contract test: open sales, waitlist registration',
      null,
      'limited'::public.event_exhibitor_sales_status,
      'waitlist'::public.event_visitor_registration_status
    )$$,
  'sales and registration availability can be set independently'
);
select is(
  (select exhibitor_sales_status from public.events where id = '00000000-0000-4000-8000-000000003012'),
  'limited'::public.event_exhibitor_sales_status,
  'exhibitor sales availability is limited'
);
select is(
  (select visitor_registration_status from public.events where id = '00000000-0000-4000-8000-000000003012'),
  'waitlist'::public.event_visitor_registration_status,
  'visitor registration availability is waitlist at the same time'
);
select throws_ok(
  $$select public.set_event_axes_v1(
      '00000000-0000-4000-8000-000000003012', '   ', null, 'open'::public.event_exhibitor_sales_status, null
    )$$,
  '22023',
  'a reason is required to change canonical event axes',
  'an axis change without a reason is refused'
);

-- Publication is blocked while reconciliation is unresolved.
--
-- A newly created event can never be unresolved: it always begins in draft,
-- which projects unambiguously. Unresolved is specifically the state a LEGACY
-- row lands in when its old lifecycle value could not be safely projected, so
-- the fixture reproduces that condition rather than a shape the trigger would
-- refuse to create.
insert into public.events (
  id, site_id, event_key, slug, venue_id, timezone, starts_at, ends_at,
  lifecycle_axis, exhibitor_sales_status, visitor_registration_status
) values (
  '00000000-0000-4000-8000-000000003013',
  '00000000-0000-4000-8000-000000000100',
  'canon.unresolved.event',
  'canon-unresolved-event',
  '00000000-0000-4000-8000-000000003011',
  'UTC', now() + interval '60 days', now() + interval '61 days',
  null, null, null
);
select is(
  (select axis_reconciliation from public.events where id = '00000000-0000-4000-8000-000000003013'),
  'resolved'::public.event_axis_reconciliation,
  'a newly created event can never be left unresolved'
);

-- Reproduce the post-backfill legacy shape: an axis whose value is unknown.
update public.events
set visitor_registration_status = null
where id = '00000000-0000-4000-8000-000000003013';

select is(
  (select axis_reconciliation from public.events where id = '00000000-0000-4000-8000-000000003013'),
  'unresolved'::public.event_axis_reconciliation,
  'an event with unknown availability is unresolved'
);
select throws_ok(
  $$update public.events set status = 'published'
    where id = '00000000-0000-4000-8000-000000003013'$$,
  '23514',
  null,
  'an unresolved event cannot be published'
);

-- ===========================================================================
-- Slice 2: canonical workflow states
-- ===========================================================================

select has_table('public', 'canonical_state_history', 'canonical state history exists');
select has_table('public', 'state_contract_versions', 'state contracts are versioned');

-- Vocabularies that the legacy enums could not express.
select ok(
  'failed_terminal' = any (enum_range(null::public.integration_job_state)::text[])
  and 'retrying' = any (enum_range(null::public.integration_job_state)::text[])
  and 'suppressed' = any (enum_range(null::public.integration_job_state)::text[])
  and 'cancelled' = any (enum_range(null::public.integration_job_state)::text[]),
  'retrying, terminal failure, suppression and cancellation are distinguishable'
);
select ok(
  'changes_requested' = any (enum_range(null::public.publication_state)::text[])
  and 'expired' = any (enum_range(null::public.publication_state)::text[])
  and 'withdrawn' = any (enum_range(null::public.publication_state)::text[]),
  'changes_requested, expired and withdrawn are not collapsed into archived'
);
select ok(
  'not_required' = any (enum_range(null::public.delivery_state)::text[])
  and 'delayed' = any (enum_range(null::public.delivery_state)::text[])
  and 'bounced' = any (enum_range(null::public.delivery_state)::text[]),
  'delivery can be not required, delayed or bounced'
);

-- Durable submission truth.
select ok(
  app_private.is_valid_submission_state_transition(null, 'received'),
  'a committed submission may be received'
);
select ok(
  app_private.is_valid_submission_state_transition(null, 'duplicate_linked'),
  'a committed submission may be duplicate_linked'
);
select ok(
  not app_private.is_valid_submission_state_transition(null, 'retained'),
  'a submission cannot be created as retained'
);
select ok(
  not app_private.is_valid_submission_state_transition('anonymized', 'received'),
  'anonymized submissions cannot be revived'
);

-- Provider acceptance is the only route to booked.
select ok(
  not app_private.is_valid_appointment_state_transition('lead_captured', 'booked'),
  'a captured lead cannot jump straight to booked'
);
select ok(
  app_private.is_valid_appointment_state_transition('provider_pending', 'booked'),
  'booking follows a provider pending state'
);
select ok(
  app_private.is_valid_appointment_state_transition('provider_failed', 'provider_pending'),
  'a provider failure can be retried'
);

-- Integration job retry semantics.
select ok(
  app_private.is_valid_integration_job_state_transition('processing', 'retrying'),
  'a processing job may go back to retrying'
);
select ok(
  not app_private.is_valid_integration_job_state_transition('failed_terminal', 'processing'),
  'a terminally failed job is not silently retried'
);
select ok(
  not app_private.is_valid_integration_job_state_transition('succeeded', 'processing'),
  'a succeeded job is terminal'
);

-- Publication states are not collapsed.
select ok(
  app_private.is_valid_publication_state_transition('published', 'expired'),
  'published content can expire'
);
select ok(
  app_private.is_valid_publication_state_transition('expired', 'in_review'),
  'expired content can be revived through review, not only archived'
);
select ok(
  app_private.is_valid_publication_state_transition('in_review', 'changes_requested'),
  'a reviewer can request changes'
);

-- The booked-requires-acceptance rule is a database constraint, not a
-- convention: it cannot be bypassed by writing the column directly.
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
insert into public.contacts (id, site_id, email)
values ('00000000-0000-4000-8000-000000003021', '00000000-0000-4000-8000-000000000100',
        'canon-contact@test.invalid');
insert into public.leads (id, site_id, contact_id, acquisition_kind, dedupe_key)
values ('00000000-0000-4000-8000-000000003022', '00000000-0000-4000-8000-000000000100',
        '00000000-0000-4000-8000-000000003021', 'meeting_request', 'canon-contract-lead');
insert into public.appointment_slots (
  id, site_id, event_id, staff_id, starts_at, ends_at, timezone, capacity
) values (
  '00000000-0000-4000-8000-000000003023', '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000003012', '00000000-0000-4000-8000-000000003001',
  now() + interval '30 days', now() + interval '30 days 1 hour', 'UTC', 1
);
insert into public.appointments (id, site_id, event_id, lead_id, slot_id, booking_key, timezone)
values ('00000000-0000-4000-8000-000000003024', '00000000-0000-4000-8000-000000000100',
        '00000000-0000-4000-8000-000000003012', '00000000-0000-4000-8000-000000003022',
        '00000000-0000-4000-8000-000000003023', gen_random_uuid(), 'UTC');

select throws_ok(
  $$update public.appointments
    set canonical_state = 'booked'
    where id = '00000000-0000-4000-8000-000000003024'$$,
  '23514',
  null,
  'an appointment cannot be booked without provider acceptance evidence'
);

-- ===========================================================================
-- Slice 3: activation-critical conversion contracts
-- ===========================================================================

select has_table('public', 'form_definitions', 'form definitions exist');
select has_table('public', 'form_definition_versions', 'form definition versions exist');
select has_table('public', 'consent_definitions', 'consent definitions exist');
select has_table('public', 'legal_documents', 'typed legal documents exist');
select has_table('public', 'submission_contexts', 'immutable submission contexts exist');
select has_table('public', 'visitor_registrations', 'visitor registrations are distinct records');
select has_table('public', 'communications', 'communications exist');
select has_table('public', 'outbox_events', 'outbox events exist');
select has_table('public', 'privacy_requests', 'privacy requests exist');
select has_table('public', 'suppressions', 'suppressions exist');
select has_table('public', 'submission_public_references', 'opaque public references exist');

-- An outbox event is a domain fact; it may not claim dispatch without a job.
select throws_ok(
  $$insert into public.outbox_events (
      site_id, event_type, aggregate_table, aggregate_id, payload, state, dispatched_at
    ) values (
      '00000000-0000-4000-8000-000000000100', 'submission.received', 'form_submissions',
      gen_random_uuid(), '{}'::jsonb, 'dispatched', now()
    )$$,
  '23514',
  null,
  'an outbox event cannot claim dispatch without a derived integration job'
);

-- Consent as a legal basis must be refusable.
select throws_ok(
  $$insert into public.consent_definitions (
      site_id, purpose, locale, version, requiredness, legal_basis, notice_text, effective_at
    ) values (
      '00000000-0000-4000-8000-000000000100', 'marketing', 'en', 'v1',
      'required', 'consent', 'We will email you.', now()
    )$$,
  '23514',
  null,
  'consent cannot be a required field'
);

-- A suppression must say what it suppresses.
select throws_ok(
  $$insert into public.suppressions (site_id, contact_id, scope, reason, source)
    values ('00000000-0000-4000-8000-000000000100',
            '00000000-0000-4000-8000-000000003021', 'channel', 'unsubscribed', 'public_form')$$,
  '23514',
  null,
  'a channel suppression must name the channel'
);

-- Submission contexts are append-only evidence.
insert into public.form_submissions (
  id, site_id, contact_id, acquisition_kind, idempotency_key, locale,
  notice_version, response_code
) values (
  '00000000-0000-4000-8000-000000003031', '00000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000003021', 'contact_request', gen_random_uuid(),
  'en', 'v1', 'accepted'
);
insert into public.submission_contexts (site_id, form_submission_id, locale, route_path)
values ('00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003031',
        'en', '/en/contact');

select throws_ok(
  $$update public.submission_contexts set route_path = '/en/tampered'
    where form_submission_id = '00000000-0000-4000-8000-000000003031'$$,
  '23514',
  null,
  'a submission context cannot be edited after the fact'
);
select throws_ok(
  $$delete from public.submission_contexts
    where form_submission_id = '00000000-0000-4000-8000-000000003031'$$,
  '23514',
  null,
  'a submission context cannot be deleted'
);

-- A committed submission is durable truth.
select is(
  (select canonical_state from public.form_submissions
   where id = '00000000-0000-4000-8000-000000003031'),
  'received'::public.submission_state,
  'a committed submission is received'
);

-- The public reference is opaque and leaks nothing.
select ok(
  app_private.issue_submission_reference(
    '00000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000003031'
  ) ~ '^[0-9a-f]{32}$',
  'the public reference is a random opaque token'
);
select is(
  (select count(*) from public.get_submission_status_v1(
    (select reference from public.submission_public_references
     where form_submission_id = '00000000-0000-4000-8000-000000003031')
  ) where status = 'received'),
  1::bigint,
  'the opaque reference resolves to a coarse status'
);
select is(
  (select count(*) from public.get_submission_status_v1('0123456789abcdef0123456789abcdef')),
  0::bigint,
  'an unknown reference reveals nothing'
);

-- ===========================================================================
-- Slice 4: editorial separation of duties
-- ===========================================================================

select is(
  (select count(*) from public.capability_profiles),
  6::bigint,
  'all six canonical editorial capability profiles exist'
);

-- Contributor authors but cannot approve or publish.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003002","role":"authenticated"}', true);
select ok(
  (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.write')),
  'a contributor can write content'
);
select ok(
  not (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.approve')),
  'a contributor cannot approve content'
);
select ok(
  not (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.publish')),
  'a contributor cannot publish content'
);

-- An editor reviews but does not own evidence approval.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003005","role":"authenticated"}', true);
select ok(
  (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.review')),
  'an editor can review content'
);
select ok(
  not (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'evidence.approve')),
  'an editor cannot self-approve protected evidence'
);

-- The evidence reviewer owns evidence approval and nothing more.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003004","role":"authenticated"}', true);
select ok(
  (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'evidence.approve')),
  'an evidence reviewer can approve evidence'
);
select ok(
  not (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.publish')),
  'an evidence reviewer cannot publish'
);

-- The publisher publishes.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003003","role":"authenticated"}', true);
select ok(
  (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'content.publish')),
  'a publisher can publish'
);
select ok(
  not (select app_private.has_permission('00000000-0000-4000-8000-000000000100', 'evidence.approve')),
  'a publisher cannot approve the evidence they publish'
);

-- A privileged override needs a substantive reason and leaves a record.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000003001","role":"authenticated"}', true);
select throws_ok(
  $$select public.record_privileged_override_v1(
      '00000000-0000-4000-8000-000000000100', 'events',
      '00000000-0000-4000-8000-000000003012', 'translation_coverage', 'why'
    )$$,
  '22023',
  'a privileged override requires a substantive reason',
  'an override without a substantive reason is refused'
);
select lives_ok(
  $$select public.record_privileged_override_v1(
      '00000000-0000-4000-8000-000000000100', 'events',
      '00000000-0000-4000-8000-000000003012', 'translation_coverage',
      'Owner approved launch with FR pending, ticket SPI-123'
    )$$,
  'an override with a substantive reason is recorded'
);
select is(
  (select count(*) from public.audit_events
   where action = 'privileged_override'
     and entity_id = '00000000-0000-4000-8000-000000003012'),
  1::bigint,
  'a privileged override writes immutable audit evidence'
);

select * from finish();
rollback;
