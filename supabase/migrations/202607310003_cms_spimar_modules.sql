begin;

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  venue_key text not null check (venue_key ~ '^[a-z0-9_.-]+$'),
  address_line_1 text,
  address_line_2 text,
  city text,
  region text,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  postal_code text,
  latitude numeric(9,6) check (latitude is null or latitude between -90 and 90),
  longitude numeric(9,6) check (longitude is null or longitude between -180 and 180),
  timezone text not null,
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, venue_key),
  unique (site_id, id)
);

create table public.venue_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  venue_id uuid not null,
  locale text not null,
  name text not null,
  directions text not null default '',
  accessibility_notes text not null default '',
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_id, locale),
  foreign key (site_id, venue_id) references public.venues(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_key text not null check (event_key ~ '^[a-z0-9_.-]+$'),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  venue_id uuid,
  timezone text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  exhibitor_sales_opens_at timestamptz,
  exhibitor_sales_closes_at timestamptz,
  visitor_registration_opens_at timestamptz,
  visitor_registration_closes_at timestamptz,
  lifecycle_status public.event_lifecycle_status not null default 'draft',
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  rescheduled_from_event_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  lock_version integer not null default 1 check (lock_version > 0),
  unique (site_id, event_key),
  unique (site_id, slug),
  unique (site_id, id),
  foreign key (site_id, venue_id) references public.venues(site_id, id) on delete restrict,
  foreign key (site_id, rescheduled_from_event_id) references public.events(site_id, id) on delete set null,
  check (ends_at is null or starts_at is null or ends_at > starts_at),
  check (exhibitor_sales_closes_at is null or exhibitor_sales_opens_at is null or exhibitor_sales_closes_at > exhibitor_sales_opens_at),
  check (visitor_registration_closes_at is null or visitor_registration_opens_at is null or visitor_registration_closes_at > visitor_registration_opens_at),
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.event_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  event_id uuid not null,
  locale text not null,
  name text not null,
  short_description text not null default '',
  body jsonb not null default '{}'::jsonb check (jsonb_typeof(body) = 'object'),
  status public.translation_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, locale),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.event_status_history (
  id bigint generated always as identity primary key,
  site_id uuid not null,
  event_id uuid not null,
  from_status public.event_lifecycle_status,
  to_status public.event_lifecycle_status not null,
  reason text not null,
  actor_id uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now(),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade
);

create table public.exhibitor_packages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  package_key text not null check (package_key ~ '^[a-z0-9_.-]+$'),
  tier text not null check (tier in ('standard', 'premium', 'sponsor', 'custom')),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  price_minor bigint check (price_minor is null or price_minor >= 0),
  capacity integer check (capacity is null or capacity >= 0),
  evidence_status public.evidence_status not null default 'missing',
  evidence_source text,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique nulls not distinct (site_id, event_id, package_key),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade,
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null)),
  check (status not in ('approved', 'scheduled', 'published') or evidence_status = 'verified')
);

create table public.exhibitor_package_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  package_id uuid not null,
  locale text not null,
  name text not null,
  summary text not null default '',
  inclusions jsonb not null default '[]'::jsonb check (jsonb_typeof(inclusions) = 'array'),
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (package_id, locale),
  foreign key (site_id, package_id) references public.exhibitor_packages(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.content_partners (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  partner_key text not null check (partner_key ~ '^[a-z0-9_.-]+$'),
  kind public.content_partner_kind not null,
  logo_media_id uuid,
  website_url text check (website_url is null or website_url ~ '^https://'),
  evidence_status public.evidence_status not null default 'missing',
  evidence_source text,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, partner_key),
  unique (site_id, id),
  foreign key (site_id, logo_media_id) references public.media_assets(site_id, id) on delete set null,
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null)),
  check (status not in ('approved', 'scheduled', 'published') or evidence_status = 'verified')
);

create table public.content_partner_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  partner_id uuid not null,
  locale text not null,
  name text not null,
  description text not null default '',
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, locale),
  foreign key (site_id, partner_id) references public.content_partners(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  primary_media_id uuid,
  evidence_status public.evidence_status not null default 'missing',
  evidence_source text,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, slug),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  foreign key (site_id, primary_media_id) references public.media_assets(site_id, id) on delete set null,
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null)),
  check (status not in ('approved', 'scheduled', 'published') or evidence_status = 'verified'),
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.case_study_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  case_study_id uuid not null,
  locale text not null,
  title text not null,
  summary text not null default '',
  body jsonb not null default '{}'::jsonb check (jsonb_typeof(body) = 'object'),
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (case_study_id, locale),
  foreign key (site_id, case_study_id) references public.case_studies(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  testimonial_key text not null check (testimonial_key ~ '^[a-z0-9_.-]+$'),
  person_name text,
  person_role text,
  organization_name text,
  media_id uuid,
  evidence_status public.evidence_status not null default 'missing',
  evidence_source text,
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, testimonial_key),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  foreign key (site_id, media_id) references public.media_assets(site_id, id) on delete set null,
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null)),
  check (status not in ('approved', 'scheduled', 'published') or evidence_status = 'verified')
);

create table public.testimonial_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  testimonial_id uuid not null,
  locale text not null,
  quote text not null,
  transcript text,
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (testimonial_id, locale),
  foreign key (site_id, testimonial_id) references public.testimonials(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.metrics (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  metric_key text not null check (metric_key ~ '^[a-z0-9_.-]+$'),
  display_value text not null,
  definition text not null,
  period_start date,
  period_end date,
  source_label text not null,
  source_url text check (source_url is null or source_url ~ '^https://'),
  evidence_status public.evidence_status not null default 'missing',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique nulls not distinct (site_id, event_id, metric_key),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  check (period_end is null or period_start is null or period_end >= period_start),
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null)),
  check (status not in ('approved', 'scheduled', 'published') or evidence_status = 'verified')
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  resource_kind text not null check (resource_kind in ('brochure', 'report', 'guide', 'press_kit', 'other')),
  requires_form boolean not null default false,
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, slug),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete set null,
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.resource_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  resource_id uuid not null,
  locale text not null,
  title text not null,
  summary text not null default '',
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_id, locale),
  foreign key (site_id, resource_id) references public.resources(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.resource_versions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  resource_id uuid not null,
  locale text not null,
  version_number integer not null check (version_number > 0),
  media_asset_id uuid not null,
  notice_version text not null,
  is_current boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (resource_id, locale, version_number),
  unique (site_id, id),
  foreign key (site_id, resource_id) references public.resources(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale),
  foreign key (site_id, media_asset_id) references public.media_assets(site_id, id) on delete restrict
);

create unique index resource_versions_one_current
  on public.resource_versions(resource_id, locale)
  where is_current;

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  primary_media_id uuid,
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, slug),
  unique (site_id, id),
  foreign key (site_id, primary_media_id) references public.media_assets(site_id, id) on delete set null,
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.article_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  article_id uuid not null,
  locale text not null,
  title text not null,
  excerpt text not null default '',
  body jsonb not null default '{}'::jsonb check (jsonb_typeof(body) = 'object'),
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_id, locale),
  foreign key (site_id, article_id) references public.articles(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  event_id uuid,
  faq_key text not null check (faq_key ~ '^[a-z0-9_.-]+$'),
  audience text not null check (audience in ('exhibitor', 'visitor', 'general')),
  position integer not null default 0 check (position >= 0),
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique nulls not distinct (site_id, event_id, faq_key),
  unique (site_id, id),
  foreign key (site_id, event_id) references public.events(site_id, id) on delete cascade
);

create table public.faq_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  faq_id uuid not null,
  locale text not null,
  question text not null,
  answer jsonb not null check (jsonb_typeof(answer) = 'object'),
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faq_id, locale),
  foreign key (site_id, faq_id) references public.faqs(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create index events_public_lookup_idx on public.events(site_id, slug, status, lifecycle_status) where deleted_at is null;
create index event_status_history_event_idx on public.event_status_history(event_id, changed_at desc);
create index resources_public_lookup_idx on public.resources(site_id, slug, status) where deleted_at is null;
create index articles_public_lookup_idx on public.articles(site_id, slug, status) where deleted_at is null;

commit;
