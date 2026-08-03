import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const migrationDir = path.join(root, "supabase", "migrations");
const testDir = path.join(root, "supabase", "tests", "database");

const failures = [];
const checks = [];

function check(condition, message) {
  checks.push({ ok: Boolean(condition), message });
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const migrationFiles = fs
  .readdirSync(migrationDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();
const migrations = migrationFiles.map((name) => ({
  name,
  source: fs.readFileSync(path.join(migrationDir, name), "utf8"),
}));
const allSql = migrations.map(({ source }) => source).join("\n");
const rlsSql = read("supabase/migrations/202607310006_rls.sql");
const seedSql = read("supabase/seed.sql");

const expectedMigrations = [
  "202607310001_foundation.sql",
  "202607310002_cms_core.sql",
  "202607310003_cms_spimar_modules.sql",
  "202607310004_crm.sql",
  "202607310005_workflows.sql",
  "202607310006_rls.sql",
  "202607310007_acquisition_edge_boundary.sql",
  "202607310008_integration_worker.sql",
  "202607310009_cms_page_api.sql",
  "202607310010_crm_workspace_api.sql",
  "202607310011_cms_event_api.sql",
  "202607310012_cms_media_api.sql",
  "202608010001_crm_audited_export.sql",
  "202608010002_crm_pipeline_api.sql",
  "202608010003_cms_dashboard_api.sql",
  "202608010004_cms_navigation_api.sql",
  "202608010005_cms_site_locale_api.sql",
  "202608010006_cms_settings_seo_api.sql",
  "202608010007_cms_exhibitor_package_api.sql",
  "202608010008_cms_content_partner_api.sql",
  "202608010009_cms_case_study_api.sql",
  "202608010010_cms_dashboard_expansion.sql",
  "202608010011_cms_metric_api.sql",
  "202608010012_cms_dashboard_metric_expansion.sql",
  "202608010013_cms_resource_api.sql",
  "202608010014_cms_dashboard_resource_expansion.sql",
  "202608010015_cms_testimonial_api.sql",
  "202608010016_cms_dashboard_testimonial_expansion.sql",
  "202608010017_cms_article_api.sql",
  "202608010018_cms_dashboard_article_expansion.sql",
  "202608010019_cms_faq_api.sql",
  "202608010020_cms_dashboard_faq_expansion.sql",
  "202608010021_cms_venue_api.sql",
  "202608010022_cms_dashboard_venue_expansion.sql",
  "202608010023_cms_project_taxonomy_api.sql",
  "202608010024_cms_dashboard_taxonomy_expansion.sql",
  "202608010025_cms_project_api.sql",
  "202608010026_cms_dashboard_project_expansion.sql",
  "202608010027_cms_project_details_api.sql",
  // Canonical corrections. Additive forward migrations; the 39 above are never
  // rewritten. See docs/backend/CANONICAL-CORRECTIONS.md.
  "202608020001_canonical_event_axes.sql",
  "202608020002_canonical_workflow_states.sql",
  "202608020003_activation_critical_contracts.sql",
  "202608020004_editorial_separation_of_duties.sql",
];
check(
  JSON.stringify(migrationFiles) === JSON.stringify(expectedMigrations),
  "migration sequence is complete, ordered, and contains no unreviewed file",
);

for (const { name, source } of migrations) {
  check(/^begin;\s/i.test(source), `${name} begins an explicit transaction`);
  check(/commit;\s*$/i.test(source), `${name} commits its explicit transaction`);
  check((source.match(/\$\$/g) ?? []).length % 2 === 0, `${name} has balanced dollar quotes`);
}

const requiredTables = [
  "sites",
  "site_domains",
  "site_locales",
  "profiles",
  "profile_roles",
  "profile_permissions",
  "audit_events",
  "pages",
  "page_translations",
  "page_sections",
  "content_revisions",
  "media_assets",
  "media_variants",
  "media_usages",
  "projects",
  "project_translations",
  "events",
  "event_translations",
  "event_status_history",
  "exhibitor_packages",
  "content_partners",
  "case_studies",
  "testimonials",
  "metrics",
  "resources",
  "resource_versions",
  "articles",
  "faqs",
  "organizations",
  "contacts",
  "leads",
  "lead_event_interests",
  "lead_assignments",
  "lead_stage_history",
  "form_submissions",
  "consents",
  "campaign_attribution",
  "activities",
  "notes",
  "tasks",
  "appointment_slots",
  "appointments",
  "resource_deliveries",
  "integration_jobs",
];

const createdTables = new Set(
  [...allSql.matchAll(/create\s+table\s+public\.([a-z0-9_]+)/gi)].map((match) => match[1]),
);
for (const table of requiredTables) {
  check(createdTables.has(table), `required table public.${table} exists`);
}

const explicitRlsTables = new Set(
  [...allSql.matchAll(/alter\s+table\s+public\.([a-z0-9_]+)\s+enable\s+row\s+level\s+security/gi)].map(
    (match) => match[1],
  ),
);
const dynamicRlsSection = rlsSql.slice(0, rlsSql.indexOf("-- Public CMS roots"));
for (const table of createdTables) {
  check(
    explicitRlsTables.has(table) || dynamicRlsSection.includes(`'${table}'`),
    `public.${table} is included in an RLS enablement declaration`,
  );
}

check(
  !/revoke\s+all\s+on\s+all\s+tables\s+in\s+schema\s+public/i.test(allSql),
  "migrations never revoke privileges from unrelated public-schema tables",
);
check(
  !/grant\s+all\s+on\s+all\s+tables\s+in\s+schema\s+public/i.test(allSql),
  "migrations never grant privileges across unrelated public-schema tables",
);

const functionBlocks = [
  ...allSql.matchAll(/create\s+or\s+replace\s+function\s+([^\s(]+)[\s\S]*?\$\$;/gi),
];
const definerFunctions = functionBlocks.filter((match) => /security\s+definer/i.test(match[0]));
check(definerFunctions.length >= 20, "security-definer workflow boundaries are present");
for (const match of definerFunctions) {
  const [block, name] = match;
  check(
    /set\s+search_path\s*=\s*pg_catalog,\s*public/i.test(block),
    `${name} pins search_path to pg_catalog, public`,
  );
  check(!/set\s+search_path[^\n]*extensions/i.test(block), `${name} excludes extensions from search_path`);
}

const crmPiiTables = [
  "organizations",
  "contacts",
  "leads",
  "form_submissions",
  "consents",
  "campaign_attribution",
  "activities",
  "notes",
  "tasks",
  "appointments",
  "resource_deliveries",
  "integration_jobs",
];
const anonGrantBlocks = [...rlsSql.matchAll(/grant\s+select\s+on\s+table([\s\S]*?)to\s+anon\s*;/gi)].map(
  (match) => match[1],
);
for (const table of crmPiiTables) {
  check(
    anonGrantBlocks.every((block) => !new RegExp(`public\\.${table}\\b`, "i").test(block)),
    `anon receives no table grant on CRM PII table public.${table}`,
  );
}
check(
  /revoke\s+all\s+on\s+all\s+functions\s+in\s+schema\s+app_private\s+from\s+public,\s*anon,\s*authenticated/gi.test(
    allSql,
  ),
  "private functions are denied by default",
);
check(
  /grant\s+execute\s+on\s+all\s+functions\s+in\s+schema\s+app_private\s+to\s+service_role/i.test(
    rlsSql,
  ),
  "service role alone receives the private transaction surface",
);
check(
  !/grant\s+execute\s+on\s+all\s+functions\s+in\s+schema\s+app_private\s+to\s+(anon|authenticated)/i.test(
    allSql,
  ),
  "anon and authenticated never receive the whole private function surface",
);

for (const contract of [
  "app_private.acquire_lead_v1",
  "app_private.book_appointment_v1",
  "app_private.anonymize_expired_crm_v1",
  "app_private.prune_acquisition_rate_limits_v1",
  "public.acquire_lead_edge_v1",
  "public.claim_integration_jobs_v1",
  "public.complete_integration_job_v1",
  "public.fail_integration_job_v1",
  "public.create_page_draft_v1",
  "public.update_page_draft_v1",
  "public.upsert_page_translation_v1",
  "public.transition_page_status_v1",
  "public.transition_page_translation_status_v1",
  "public.search_cms_events_v1",
  "public.cms_event_workspace_v1",
  "public.create_event_draft_v1",
  "public.update_event_draft_v1",
  "public.upsert_event_translation_v1",
  "public.transition_event_publication_status_v1",
  "public.transition_event_translation_status_v1",
  "public.search_cms_media_v1",
  "public.cms_media_workspace_v1",
  "public.create_media_asset_v1",
  "public.update_media_asset_v1",
  "public.add_media_variant_v1",
  "public.link_media_usage_v1",
  "public.unlink_media_usage_v1",
  "public.transition_media_status_v1",
  "public.retire_media_asset_v1",
  "public.export_crm_leads_v1",
  "public.search_crm_leads_v1",
  "public.crm_lead_workspace_v1",
  "public.record_lead_activity_v1",
  "public.add_lead_note_v1",
  "public.create_lead_task_v1",
  "public.transition_lead_task_v1",
  "public.create_appointment_slot_v1",
  "public.cancel_appointment_slot_v1",
  "public.transition_event_lifecycle",
  "public.transition_lead_stage",
  "public.assign_lead_v1",
  "public.transition_appointment_status",
  "public.retry_integration_job",
  "public.crm_pipeline_summary",
  "public.cms_dashboard_summary_v1",
  "public.cms_navigation_workspace_v1",
  "public.create_navigation_item_v1",
  "public.update_navigation_item_v1",
  "public.upsert_navigation_translation_v1",
  "public.transition_navigation_item_status_v1",
  "public.transition_navigation_translation_status_v1",
  "public.cms_site_workspace_v1",
  "public.update_site_settings_v1",
  "public.upsert_site_domain_v1",
  "public.remove_site_domain_v1",
  "public.configure_site_locale_v1",
  "public.cms_settings_seo_workspace_v1",
  "public.create_global_setting_v1",
  "public.update_global_setting_v1",
  "public.transition_global_setting_status_v1",
  "public.create_seo_entry_v1",
  "public.update_seo_entry_v1",
  "public.transition_seo_entry_status_v1",
  "public.search_cms_exhibitor_packages_v1",
  "public.create_exhibitor_package_v1",
  "public.update_exhibitor_package_v1",
  "public.upsert_exhibitor_package_translation_v1",
  "public.transition_exhibitor_package_translation_status_v1",
  "public.transition_exhibitor_package_evidence_v1",
  "public.transition_exhibitor_package_status_v1",
  "public.search_cms_content_partners_v1",
  "public.create_content_partner_v1",
  "public.update_content_partner_v1",
  "public.upsert_content_partner_translation_v1",
  "public.transition_content_partner_translation_status_v1",
  "public.transition_content_partner_evidence_v1",
  "public.transition_content_partner_status_v1",
  "public.search_cms_case_studies_v1",
  "public.create_case_study_v1",
  "public.update_case_study_v1",
  "public.upsert_case_study_translation_v1",
  "public.transition_case_study_translation_status_v1",
  "public.transition_case_study_evidence_v1",
  "public.transition_case_study_status_v1",
  "public.search_cms_metrics_v1",
  "public.create_metric_v1",
  "public.update_metric_v1",
  "public.transition_metric_evidence_v1",
  "public.transition_metric_status_v1",
  "public.search_cms_resources_v1",
  "public.list_cms_resource_versions_v1",
  "public.create_resource_v1",
  "public.update_resource_v1",
  "public.upsert_resource_translation_v1",
  "public.transition_resource_translation_status_v1",
  "public.create_resource_version_v1",
  "public.transition_resource_status_v1",
  "public.search_cms_testimonials_v1",
  "public.create_testimonial_v1",
  "public.update_testimonial_v1",
  "public.upsert_testimonial_translation_v1",
  "public.transition_testimonial_translation_status_v1",
  "public.transition_testimonial_evidence_v1",
  "public.transition_testimonial_status_v1",
  "public.search_cms_articles_v1",
  "public.create_article_v1",
  "public.update_article_v1",
  "public.upsert_article_translation_v1",
  "public.transition_article_translation_status_v1",
  "public.transition_article_status_v1",
  "public.search_cms_faqs_v1",
  "public.create_faq_v1",
  "public.update_faq_v1",
  "public.upsert_faq_translation_v1",
  "public.transition_faq_translation_status_v1",
  "public.transition_faq_status_v1",
  "public.search_cms_venues_v1",
  "public.create_venue_v1",
  "public.update_venue_v1",
  "public.upsert_venue_translation_v1",
  "public.transition_venue_translation_status_v1",
  "public.transition_venue_status_v1",
  "public.search_cms_project_taxonomies_v1",
  "public.create_industry_v1",
  "public.update_industry_v1",
  "public.upsert_industry_translation_v1",
  "public.transition_industry_translation_status_v1",
  "public.transition_industry_status_v1",
  "public.create_project_category_v1",
  "public.update_project_category_v1",
  "public.upsert_project_category_translation_v1",
  "public.transition_project_category_translation_status_v1",
  "public.transition_project_category_status_v1",
  "public.create_project_tag_v1",
  "public.update_project_tag_v1",
  "public.transition_project_tag_status_v1",
  "public.search_cms_projects_v1",
  "public.cms_project_workspace_v1",
  "public.create_project_v1",
  "public.update_project_v1",
  "public.upsert_project_translation_v1",
  "public.transition_project_translation_status_v1",
  "public.replace_project_taxonomy_v1",
  "public.transition_project_status_v1",
  "public.cms_project_details_v1",
  "public.create_project_metric_v1",
  "public.update_project_metric_v1",
  "public.transition_project_metric_evidence_v1",
  "public.remove_project_metric_v1",
  "public.replace_project_credits_v1",
  "public.replace_project_relations_v1",
]) {
  check(allSql.includes(`function ${contract}`), `${contract} contract exists`);
}

check(seedSql.includes("reference-foundation"), "seed contains deterministic local reference tenant");
check(
  !/insert\s+into\s+public\.(exhibitor_packages|content_partners|case_studies|testimonials|metrics|articles|faqs)/i.test(
    seedSql,
  ),
  "seed contains no invented SPIMAR commercial or evidence claims",
);
check(fs.existsSync(path.join(root, "supabase", "config.toml")), "Supabase config is committed");

const testFiles = fs
  .readdirSync(testDir)
  .filter((name) => name.endsWith(".sql"))
  .sort();
check(testFiles.length >= 3, "database test suite contains schema, RLS, and workflow contracts");
for (const name of testFiles) {
  const source = fs.readFileSync(path.join(testDir, name), "utf8");
  const planned = Number(source.match(/select\s+plan\((\d+)\)/i)?.[1] ?? -1);
  const assertions = (
    source.match(
      /select\s+(?:has_table|has_column|is|isnt|ok|throws_ok|lives_ok|volatility_is|pass)\s*\(/gi,
    ) ?? []
  ).length;
  check(planned === assertions, `${name} plan(${planned}) matches ${assertions} assertions`);
  check(/select\s+\*\s+from\s+finish\(\)/i.test(source), `${name} calls pgTAP finish()`);
  check(/rollback;\s*$/i.test(source), `${name} rolls back fixtures`);
}

const secretPattern = /(service_role_key|supabase_service_role_key|postgres(?:ql)?:\/\/[^\s]*:[^\s@]+@)/i;
for (const relativePath of [
  ...migrationFiles.map((name) => path.join("supabase", "migrations", name)),
  "supabase/seed.sql",
  ...testFiles.map((name) => path.join("supabase", "tests", "database", name)),
]) {
  check(!secretPattern.test(read(relativePath)), `${relativePath} contains no credential material`);
}

const report = {
  ok: failures.length === 0,
  checkedAt: new Date().toISOString(),
  migrations: migrationFiles,
  tables: createdTables.size,
  checks: checks.length,
  failures,
};

const resultsDir = path.join(root, "qa", "backend", "db", "results");
fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(
  path.join(resultsDir, "schema-contract.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;
