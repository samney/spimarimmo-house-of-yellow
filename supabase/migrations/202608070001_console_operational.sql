begin;

-- Console operational storage (F4 / DEMO-4).
--
-- The admin console operates on the Release 1 domain (`lib/spimar/types.ts`)
-- while the canonical content model mapping remains the deferred D-021 slice.
-- These tables give the console DURABLE homes for the facts the canonical
-- schema cannot hold yet, WITHOUT altering any canonical table:
--
--   * console_documents      — the R1 CMS collections (pages, events,
--                              destinations, media) as documents; the same
--                              records the file store kept in `.data/*.jsonl`.
--   * console_lead_facts     — per-lead R1 fields with no canonical column:
--                              the operator assignee (an e-mail, because the
--                              console authenticates operators by e-mail until
--                              Supabase Auth lands — ADM-039/040 deferred),
--                              and the denormalised identity fields of a
--                              console-created lead that has no acquisition
--                              records behind it.
--   * console_lead_activity  — the R1 activity trail (note/stage/assignment),
--                              append-only.
--   * console_task_meta      — the queue tag that marks onboarding-checklist
--                              tasks (ADM-092); canonical `tasks` has no
--                              queue column.
--   * console_saved_views    — per-operator saved filter sets (ADM-076).
--   * console_export_log     — the export audit trail (ADM-093), append-only.
--
-- Every table is additive: canonical tables, functions and policies are
-- untouched, so the acquisition boundary keeps its verified behaviour and the
-- real R1↔canonical mapping can replace these homes later without unwinding
-- schema changes on canonical tables.

create table public.console_documents (
  seq bigint generated always as identity,
  site_id uuid not null references public.sites(id) on delete cascade,
  collection text not null
    check (collection in ('destinations', 'events', 'pages', 'media')),
  -- Text, not uuid: the id is the R1 record id and belongs to the document
  -- domain, not to this table.
  id text not null,
  doc jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (site_id, collection, id)
);

-- `seq` preserves insertion order — the file store's jsonl append order,
-- which the R1 read paths treat as the collection's stable base order.
create index console_documents_seq_idx on public.console_documents(site_id, collection, seq);

create table public.console_lead_facts (
  lead_id uuid primary key,
  site_id uuid not null,
  assignee_email text not null default '',
  -- The R1 five-stage pipeline. Deliberately NOT written onto `leads.stage`:
  -- the canonical fourteen-stage workflow is trigger-enforced (insert at
  -- `new`, legal transitions only, `won` terminal), and projecting R1 moves
  -- onto it would fabricate workflow steps that never happened — e.g. a
  -- `proposal_sent` history row for a lead whose proposal does not exist.
  -- Empty means "no console decision yet"; the read path then projects the
  -- canonical stage. The real R1↔canonical workflow mapping is part of the
  -- D-021 slice.
  stage text not null default ''
    check (stage in ('', 'new', 'qualified', 'in_progress', 'won', 'lost')),
  -- Non-empty exactly while `stage` is 'lost' (ADM-087); the adapter clears
  -- it on reopen and the activity trail keeps the history.
  lost_reason text not null default '',
  name text not null default '',
  email text not null default '',
  organisation text not null default '',
  message text not null default '',
  source_path text not null default '',
  cta text not null default '',
  event_slug text not null default '',
  locale text not null default '',
  -- Null means "no console-recorded decision": the canonical consents rows
  -- remain the authority for funnel-acquired leads.
  consent boolean,
  updated_at timestamptz not null default now(),
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade
);

create table public.console_lead_activity (
  id bigint generated always as identity primary key,
  site_id uuid not null,
  lead_id uuid not null,
  at timestamptz not null default now(),
  by_email text not null,
  kind text not null check (kind in ('note', 'stage', 'assignment')),
  detail text not null,
  foreign key (site_id, lead_id) references public.leads(site_id, id) on delete cascade
);

create index console_lead_activity_lead_idx
  on public.console_lead_activity(lead_id, at, id);

create table public.console_task_meta (
  task_id uuid primary key references public.tasks(id) on delete cascade,
  site_id uuid not null,
  queue_key text not null check (queue_key ~ '^[a-z0-9_.-]+$')
);

create table public.console_saved_views (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  owner_email text not null,
  name text not null,
  filters jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text not null,
  updated_by text not null
);

create index console_saved_views_owner_idx
  on public.console_saved_views(site_id, owner_email);

create table public.console_export_log (
  -- Identity, not uuid: the log is a sequence, and "newest first" must stay
  -- well-defined even when two exports land in the same clock reading.
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  at timestamptz not null default now(),
  actor_email text not null,
  format text not null check (format = 'csv'),
  row_count integer not null check (row_count >= 0),
  view_name text not null,
  filters jsonb not null,
  scoped boolean not null
);

-- Append-only enforcement for the two audit trails. The seam deliberately
-- exposes no edit or delete; this makes the database refuse them too, so the
-- guarantee does not depend on every future caller remembering the rule.
create or replace function public.console_append_only()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception using
    errcode = '42501',
    message = 'this console table is append-only';
end;
$$;

create trigger console_lead_activity_append_only
  before update or delete on public.console_lead_activity
  for each row execute function public.console_append_only();

create trigger console_export_log_append_only
  before update or delete on public.console_export_log
  for each row execute function public.console_append_only();

-- RLS from the first migration, like every other table. No anon or
-- authenticated policies exist ON PURPOSE: the console reaches these tables
-- only through the server-side service connection, and PII (lead facts,
-- activity, export log) must not be readable through the Data API. Policies
-- arrive with the Supabase Auth slice (ADM-039/040), not before.
alter table public.console_documents enable row level security;
alter table public.console_lead_facts enable row level security;
alter table public.console_lead_activity enable row level security;
alter table public.console_task_meta enable row level security;
alter table public.console_saved_views enable row level security;
alter table public.console_export_log enable row level security;

commit;
