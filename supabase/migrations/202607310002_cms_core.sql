begin;

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  route_key text not null check (route_key ~ '^[a-z0-9_.-]+$'),
  page_type text not null check (page_type ~ '^[a-z0-9_.-]+$'),
  slug text not null check (slug = '' or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references auth.users(id) on delete set null,
  lock_version integer not null default 1 check (lock_version > 0),
  unique (site_id, route_key),
  unique (site_id, slug),
  unique (site_id, id),
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.page_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  page_id uuid not null,
  locale text not null,
  title text not null default '',
  summary text not null default '',
  status public.translation_status not null default 'draft',
  completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, locale),
  foreign key (site_id, page_id) references public.pages(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  page_id uuid not null,
  section_key text not null check (section_key ~ '^[a-z0-9_.-]+$'),
  section_type text not null check (section_type ~ '^[a-z0-9_.-]+$'),
  position integer not null check (position >= 0),
  status public.publication_status not null default 'draft',
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (page_id, section_key),
  unique (page_id, position),
  unique (site_id, id),
  foreign key (site_id, page_id) references public.pages(site_id, id) on delete cascade
);

create table public.page_section_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  section_id uuid not null,
  locale text not null,
  status public.translation_status not null default 'draft',
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, locale),
  foreign key (site_id, section_id) references public.page_sections(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.content_revisions (
  id bigint generated always as identity primary key,
  site_id uuid not null references public.sites(id) on delete cascade,
  entity_table text not null,
  entity_id uuid not null,
  revision_number integer not null check (revision_number > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (entity_table, entity_id, revision_number)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  kind public.media_kind not null,
  storage_provider text not null check (storage_provider ~ '^[a-z0-9_.-]+$'),
  storage_key text,
  external_url text,
  mime_type text not null,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'),
  alt_text text not null default '',
  caption text not null default '',
  rights_holder text,
  rights_source text,
  rights_expires_at timestamptz,
  focal_x numeric(5,4) check (focal_x is null or focal_x between 0 and 1),
  focal_y numeric(5,4) check (focal_y is null or focal_y between 0 and 1),
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, id),
  check ((storage_key is not null)::integer + (external_url is not null)::integer = 1),
  check (external_url is null or external_url ~ '^https://')
);

create table public.media_variants (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  asset_id uuid not null,
  variant_key text not null check (variant_key ~ '^[a-z0-9_.-]+$'),
  storage_key text,
  external_url text,
  mime_type text not null,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  created_at timestamptz not null default now(),
  unique (asset_id, variant_key),
  foreign key (site_id, asset_id) references public.media_assets(site_id, id) on delete cascade,
  check ((storage_key is not null)::integer + (external_url is not null)::integer = 1),
  check (external_url is null or external_url ~ '^https://')
);

create table public.media_usages (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  asset_id uuid not null,
  entity_table text not null check (entity_table ~ '^[a-z0-9_]+$'),
  entity_id uuid not null,
  field_key text not null check (field_key ~ '^[a-z0-9_.-]+$'),
  locale text,
  created_at timestamptz not null default now(),
  unique (asset_id, entity_table, entity_id, field_key, locale),
  foreign key (site_id, asset_id) references public.media_assets(site_id, id) on delete restrict,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.industries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (site_id, slug),
  unique (site_id, id)
);

create table public.industry_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  industry_id uuid not null,
  locale text not null,
  name text not null,
  description text not null default '',
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (industry_id, locale),
  foreign key (site_id, industry_id) references public.industries(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.project_categories (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.publication_status not null default 'draft',
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug),
  unique (site_id, id)
);

create table public.project_category_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  category_id uuid not null,
  locale text not null,
  name text not null,
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, locale),
  foreign key (site_id, category_id) references public.project_categories(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.project_tags (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label text not null,
  created_at timestamptz not null default now(),
  unique (site_id, slug),
  unique (site_id, id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  project_key text not null check (project_key ~ '^[a-z0-9_.-]+$'),
  industry_id uuid,
  year_label text,
  delivery_label text,
  primary_media_id uuid,
  status public.publication_status not null default 'draft',
  publish_at timestamptz,
  published_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  lock_version integer not null default 1 check (lock_version > 0),
  unique (site_id, slug),
  unique (site_id, project_key),
  unique (site_id, id),
  foreign key (site_id, industry_id) references public.industries(site_id, id) on delete set null,
  foreign key (site_id, primary_media_id) references public.media_assets(site_id, id) on delete set null,
  check (status <> 'scheduled' or publish_at is not null)
);

create table public.project_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  project_id uuid not null,
  locale text not null,
  title text not null,
  summary text not null default '',
  client_text text not null default '',
  process_text text not null default '',
  project_text text not null default '',
  status public.translation_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, locale),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.project_category_links (
  site_id uuid not null references public.sites(id) on delete cascade,
  project_id uuid not null,
  category_id uuid not null,
  position integer not null default 0 check (position >= 0),
  primary key (project_id, category_id),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade,
  foreign key (site_id, category_id) references public.project_categories(site_id, id) on delete cascade
);

create table public.project_tag_links (
  site_id uuid not null references public.sites(id) on delete cascade,
  project_id uuid not null,
  tag_id uuid not null,
  primary key (project_id, tag_id),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade,
  foreign key (site_id, tag_id) references public.project_tags(site_id, id) on delete cascade
);

create table public.project_metrics (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  project_id uuid not null,
  metric_key text not null check (metric_key ~ '^[a-z0-9_.-]+$'),
  display_value text not null,
  definition text not null,
  period_start date,
  period_end date,
  source_label text,
  source_url text check (source_url is null or source_url ~ '^https://'),
  evidence_status public.evidence_status not null default 'missing',
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, metric_key),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade,
  check (period_end is null or period_start is null or period_end >= period_start),
  check ((evidence_status = 'verified') = (approved_at is not null and approved_by is not null))
);

create table public.project_credits (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  project_id uuid not null,
  credit_role text not null,
  credit_name text not null,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade
);

create table public.project_relations (
  site_id uuid not null references public.sites(id) on delete cascade,
  project_id uuid not null,
  related_project_id uuid not null,
  relation_kind text not null default 'next' check (relation_kind in ('next', 'related', 'featured')),
  position integer not null default 0 check (position >= 0),
  primary key (project_id, related_project_id, relation_kind),
  foreign key (site_id, project_id) references public.projects(site_id, id) on delete cascade,
  foreign key (site_id, related_project_id) references public.projects(site_id, id) on delete cascade,
  check (project_id <> related_project_id)
);

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  parent_id uuid,
  location text not null check (location in ('header', 'mobile', 'footer', 'utility')),
  item_key text not null check (item_key ~ '^[a-z0-9_.-]+$'),
  href text not null,
  position integer not null default 0 check (position >= 0),
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, location, item_key),
  unique (site_id, id),
  foreign key (site_id, parent_id) references public.navigation_items(site_id, id) on delete cascade
);

create table public.navigation_item_translations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null,
  navigation_item_id uuid not null,
  locale text not null,
  label text not null,
  accessibility_label text,
  status public.translation_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (navigation_item_id, locale),
  foreign key (site_id, navigation_item_id) references public.navigation_items(site_id, id) on delete cascade,
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.global_settings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  setting_key text not null check (setting_key ~ '^[a-z0-9_.-]+$'),
  locale text,
  value jsonb not null check (jsonb_typeof(value) in ('object', 'array', 'string', 'number', 'boolean')),
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (site_id, setting_key, locale),
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create table public.seo_entries (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  locale text not null,
  route text not null check (route like '/%'),
  title text not null,
  description text not null,
  canonical_url text check (canonical_url is null or canonical_url ~ '^https://'),
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  open_graph jsonb not null default '{}'::jsonb check (jsonb_typeof(open_graph) = 'object'),
  structured_data jsonb not null default '[]'::jsonb check (jsonb_typeof(structured_data) = 'array'),
  status public.publication_status not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, locale, route),
  foreign key (site_id, locale) references public.site_locales(site_id, locale)
);

create index pages_public_lookup_idx on public.pages(site_id, slug, status) where deleted_at is null;
create index projects_public_lookup_idx on public.projects(site_id, slug, status) where deleted_at is null;
create index page_sections_page_position_idx on public.page_sections(page_id, position) where deleted_at is null;
create index media_usages_entity_idx on public.media_usages(site_id, entity_table, entity_id);
create index content_revisions_entity_idx on public.content_revisions(entity_table, entity_id, revision_number desc);

commit;
