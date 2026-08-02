import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const resultsRoot = path.join(root, "qa", "backend", "db", "results");
const inventoryPath = path.join(resultsRoot, "schema-inventory.json");
const reportPath = path.join(resultsRoot, "canonical-conformance.json");

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
if (!inventory.ok) {
  throw new Error("Schema inventory must pass before canonical conformance is audited");
}

const tableIndex = new Map(
  inventory.tables.map((table) => [table.table_name, table]),
);
const enumIndex = new Map(
  inventory.enums.map((entry) => [entry.enum_name, entry.values]),
);

const tableEvidence = (names) =>
  names.map((name) => {
    const table = tableIndex.get(name);
    return {
      table: name,
      exists: Boolean(table),
      columns: table?.columns.map((column) => column.name) ?? [],
      rlsEnabled: table?.rls_enabled ?? false,
    };
  });

const entity = (id, domain, contract, classification, tables, gaps) => ({
  id,
  domain,
  contract,
  classification,
  evidence: tableEvidence(tables),
  gaps,
});

const entities = [
  entity("CNT-01", "content", "SiteHost", "PARTIAL", ["sites", "site_domains", "site_locales"], [
    "Host kind G/L1/LM, market, and governed legal/contact/analytics profiles are not explicit contracts.",
  ]),
  entity("CNT-02", "content", "LocaleRelease", "MISSING", ["site_locales"], [
    "No locale release record with completeness result, publish owner, release state, and effective time.",
  ]),
  entity("CNT-03", "content", "Destination", "MISSING", [], [
    "No destination identity, localization, publication, event, evidence, or media relation tables.",
  ]),
  entity("CNT-04", "content", "Event", "MISMATCH", ["events", "event_translations", "event_status_history"], [
    "Lifecycle, exhibitor-sales availability, and visitor-registration availability are serialized in one lifecycle enum.",
    "Destination, series/edition, and explicit canonical-host ownership are absent.",
  ]),
  entity("CNT-05", "content", "Venue", "PARTIAL", ["venues", "venue_translations"], [
    "Verification status/date and a governed map-reference contract are absent.",
  ]),
  entity("CNT-06", "content", "Organization", "PARTIAL", ["organizations", "content_partners", "content_partner_translations"], [
    "Operational account identity and public partner identity are split without canonical participation or rights-period semantics.",
  ]),
  entity("CNT-07", "content", "EventParticipation", "MISSING", [], [
    "No explicit event-to-organization/person participation, role, approval, status, or display interval record.",
  ]),
  entity("CNT-08", "content", "ProgrammeItem", "MISSING", [], [
    "No localized programme schedule, room, participant, timezone, or change-state record.",
  ]),
  entity("CNT-09", "content", "Offer / OfferVersion", "PARTIAL", ["exhibitor_packages", "exhibitor_package_translations"], [
    "No immutable offer version, applicability, terms version, proposal/public-price mode, or governed override contract.",
  ]),
  entity("CNT-10", "content", "EvidenceItem", "PARTIAL", ["metrics", "project_metrics"], [
    "Evidence is specialized into metric records; generic expected/actual, unit, scope, owner, caveat, expiry, and dependency withdrawal are incomplete.",
  ]),
  entity("CNT-11", "content", "CaseStudy", "PARTIAL", ["case_studies", "case_study_translations"], [
    "Organization, objective, intervention, outcomes, evidence, permissions, media, and caveat relations are not governed as the canonical contract requires.",
  ]),
  entity("CNT-12", "content", "Testimonial", "PARTIAL", ["testimonials", "testimonial_translations"], [
    "Rights period, contextual relations, and withdrawal propagation are incomplete.",
  ]),
  entity("CNT-13", "content", "MediaAsset", "PARTIAL", ["media_assets", "media_variants", "media_usages"], [
    "Territory/use/consent, localized alt/caption, poster/failure state, and rights-withdrawal propagation are incomplete.",
  ]),
  entity("CNT-14", "content", "Gallery", "MISSING", [], [
    "No ordered rights-valid gallery with event/case/destination scope.",
  ]),
  entity("CNT-15", "content", "Resource / ResourceVersion", "PARTIAL", ["resources", "resource_versions", "resource_translations"], [
    "Effective/expiry/replacement, rights, and delivery-mode semantics are incomplete.",
  ]),
  entity("CNT-16", "content", "Article / Topic", "PARTIAL", ["articles", "article_translations"], [
    "No Topic contract and no governed author/reviewer, source, freshness, relation, or next-action fields.",
  ]),
  entity("CNT-17", "content", "Person", "MISSING", ["profiles"], [
    "Staff profiles are private identities, not an approved public person/bio/media/contact-visibility contract.",
  ]),
  entity("CNT-18", "content", "Page", "PARTIAL", ["pages", "page_translations", "page_sections", "page_section_translations", "seo_entries"], [
    "Host/locale release gating and full canonical publication states are incomplete.",
  ]),
  entity("CNT-19", "content", "LegalDocument", "MISSING", ["pages"], [
    "Generic pages do not provide typed legal version, effective time, controller/contact, approval, and host/locale scope.",
  ]),
  entity("CNT-20", "content", "ConsentDefinition", "MISSING", ["consents"], [
    "Consent records exist, but no governed definition for purpose, requiredness, legal basis/mechanism, notice/legal version, and host/locale scope.",
  ]),
  entity("CNT-21", "content", "FormDefinition", "MISSING", ["form_submissions"], [
    "No versioned purpose/audience field schema, availability, routing, consent, and confirmation definition.",
  ]),
  entity("OPS-01", "operational", "Contact", "PRESENT", ["contacts"], []),
  entity("OPS-02", "operational", "Account", "PARTIAL", ["organizations"], [
    "Approved match metadata and account-deduplication evidence are incomplete.",
  ]),
  entity("OPS-03", "operational", "Submission", "PARTIAL", ["form_submissions"], [
    "No canonical submission status, audience/source/route identity, retention/anonymization state, or opaque public reference.",
  ]),
  entity("OPS-04", "operational", "SubmissionContext", "PARTIAL", ["form_submissions", "campaign_attribution"], [
    "Event is stored, but offer/resource/campaign/route/template/content-version snapshots are incomplete.",
  ]),
  entity("OPS-05", "operational", "ConsentRecord", "PARTIAL", ["consents"], [
    "Withdrawal exists, but objection/state history and linkage to governed consent/legal definitions are incomplete.",
  ]),
  entity("OPS-06", "operational", "AttributionTouch", "PARTIAL", ["campaign_attribution"], [
    "The row has an attribution-model label but no enforced first/latest touch contract or source-version snapshot.",
  ]),
  entity("OPS-07", "operational", "ExhibitorLead", "MISMATCH", ["leads", "lead_event_interests", "lead_stage_history"], [
    "Generic leads omit canonical offer/objective/role qualification fields.",
    "Local stages make proposal, negotiation, won/lost, and onboarding first-class website states before an approved provider mapping/source-of-truth decision.",
  ]),
  entity("OPS-08", "operational", "VisitorRegistration", "MISSING", ["form_submissions", "leads"], [
    "Visitor registration is only an acquisition kind; no distinct registration state or recipient/sharing-rule version is persisted.",
  ]),
  entity("OPS-09", "operational", "AppointmentRequest", "MISMATCH", ["appointments", "appointment_slots"], [
    "Local pending/confirmed states and required internal slot do not model provider_pending/provider_failed/expired or provider acceptance separately.",
  ]),
  entity("OPS-10", "operational", "Assignment", "PRESENT", ["lead_assignments", "leads"], []),
  entity("OPS-11", "operational", "Communication", "MISSING", ["activities"], [
    "Activities are not a communication record with purpose, template/version, channel, provider status, and suppression outcome.",
  ]),
  entity("OPS-12", "operational", "IntegrationJob", "MISMATCH", ["integration_jobs"], [
    "Canonical retrying, failed_terminal, suppressed, and cancelled states and explicit adapter/action/correlation fields are absent.",
  ]),
  entity("OPS-13", "operational", "OutboxEvent", "PARTIAL", ["integration_jobs"], [
    "Integration jobs are transactionally queued as an outbox substitute but do not preserve a distinct domain event and source-transaction dispatch record.",
  ]),
  entity("OPS-14", "operational", "AuditEvent", "PARTIAL", ["audit_events"], [
    "Purpose and before/after summaries are not explicit governed fields and depend on untyped metadata.",
  ]),
  entity("OPS-15", "operational", "PrivacyRequest", "MISSING", [], [
    "No access/correction/deletion/objection/withdrawal workflow and evidence record.",
  ]),
  entity("OPS-16", "operational", "Suppression", "MISSING", [], [
    "No contact/channel/purpose suppression record or provider propagation state.",
  ]),
];

const stateContract = (id, contract, canonical, localEnum) => {
  const local = enumIndex.get(localEnum) ?? [];
  return {
    id,
    contract,
    canonical,
    localEnum: enumIndex.has(localEnum) ? localEnum : null,
    local,
    classification:
      local.length === 0
        ? "MISSING"
        : JSON.stringify(local) === JSON.stringify(canonical)
          ? "PRESENT"
          : "MISMATCH",
  };
};

const states = [
  stateContract(
    "STA-01",
    "event_lifecycle",
    ["draft", "announced_undated", "scheduled", "live", "completed", "archived", "postponed", "cancelled"],
    "event_lifecycle_status",
  ),
  stateContract("STA-02", "exhibitor_sales", ["planned", "open", "limited", "sold_out", "closed"], "exhibitor_sales_status"),
  stateContract("STA-03", "visitor_registration", ["planned", "open", "waitlist", "full", "closed"], "visitor_registration_status"),
  stateContract("STA-04", "submission", ["received", "duplicate_linked", "invalid_rejected", "withdrawn", "retained", "anonymized"], "submission_status"),
  stateContract("STA-05", "integration_job", ["queued", "processing", "succeeded", "retrying", "failed_terminal", "suppressed", "cancelled"], "integration_job_status"),
  stateContract("STA-06", "delivery", ["not_required", "queued", "delivered", "delayed", "bounced", "failed", "suppressed"], "delivery_status"),
  stateContract("STA-07", "appointment", ["lead_captured", "provider_pending", "booked", "provider_failed", "cancelled", "expired"], "appointment_status"),
  stateContract("STA-08", "publication", ["draft", "in_review", "changes_requested", "approved", "scheduled", "published", "expired", "withdrawn", "archived"], "publication_status"),
];

const canonicalEditorialRoles = [
  "contributor",
  "editor",
  "evidence_reviewer",
  "translator",
  "publisher",
  "administrator",
];
const localRoles = inventory.roleMatrix.map((entry) => entry.role);
const rolesWithPublishPermission = inventory.roleMatrix
  .filter((entry) => entry.permissions.includes("content.publish"))
  .map((entry) => entry.role);

const sourceRoots = ["app", "components", "lib"];
const sourceFiles = [];
for (const sourceRoot of sourceRoots) {
  const absoluteRoot = path.join(root, sourceRoot);
  const entries = await readdir(absoluteRoot, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !/\.(?:ts|tsx|js|mjs)$/.test(entry.name)) continue;
    sourceFiles.push(path.join(entry.parentPath, entry.name));
  }
}

const repositorySeamHits = [];
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  if (/\b(?:ContentRepository|SubmissionRepository|ProviderAdapter)\b/.test(source)) {
    repositorySeamHits.push(path.relative(root, file).replaceAll("\\", "/"));
  }
}

const hardCodedPages = await readFile(path.join(root, "lib", "content", "pages.ts"), "utf8");
const hardCodedProjects = await readFile(path.join(root, "lib", "content", "projects.ts"), "utf8");
const localContactStore = await readFile(path.join(root, "lib", "contact", "store.ts"), "utf8");

const classificationCounts = entities.reduce((counts, entry) => {
  counts[entry.classification] = (counts[entry.classification] ?? 0) + 1;
  return counts;
}, {});

const stateCounts = states.reduce((counts, entry) => {
  counts[entry.classification] = (counts[entry.classification] ?? 0) + 1;
  return counts;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  authority: {
    canonical: [
      "SPM-TECH-DATA-001",
      "SPM-TECH-CMS-001",
      "SPM-TECH-INT-001",
    ],
    implementation: path.relative(root, inventoryPath).replaceAll("\\", "/"),
    productionAuthority: false,
  },
  schemaBaseline: {
    migrations: inventory.migrations.length,
    tables: inventory.tables.length,
    enums: inventory.enums.length,
    functions: inventory.functions.length,
    roles: inventory.roleMatrix.length,
  },
  summary: {
    entityContracts: entities.length,
    entityClassifications: classificationCounts,
    stateContracts: states.length,
    stateClassifications: stateCounts,
    canonicalConformant: false,
  },
  entities,
  states,
  roles: {
    classification: "MISMATCH",
    canonicalEditorialRoles,
    localRoleMatrix: inventory.roleMatrix,
    missingDistinctEditorialRoles: [
      "contributor",
      "evidence_reviewer",
      "publisher",
    ],
    rolesWithPublishPermission,
    finding:
      "Only super_admin has content.publish; contributor/editor/evidence-reviewer/publisher separation is not represented.",
  },
  repositorySeams: {
    classification: "MISSING",
    repositorySeamHits,
    hardCodedContentMarkers: {
      pagesDeclareFutureSupabaseMove: hardCodedPages.includes("CMS-shaped: moves into Supabase"),
      projectsDeclareFutureSupabaseMove: hardCodedProjects.includes("Becomes Supabase seed data"),
    },
    localContactJsonlStore: localContactStore.includes("contact-submissions.jsonl"),
    finding:
      "The public application has no canonical repository seam, still imports hard-coded content, and persists contact submissions outside the tested Supabase acquisition module.",
  },
};

await mkdir(resultsRoot, { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      auditExecuted: true,
      canonicalConformant: report.summary.canonicalConformant,
      entityContracts: report.summary.entityContracts,
      entityClassifications: report.summary.entityClassifications,
      stateContracts: report.summary.stateContracts,
      stateClassifications: report.summary.stateClassifications,
      missingRepositorySeam: repositorySeamHits.length === 0,
      report: path.relative(root, reportPath),
    },
    null,
    2,
  ),
);
