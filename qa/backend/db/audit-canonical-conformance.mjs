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
  entity("CNT-04", "content", "Event", "PARTIAL", ["events", "event_translations", "event_status_history", "event_axis_history"], [
    "Destination, series/edition, and explicit canonical-host ownership are absent.",
    "The legacy lifecycle enum is retained alongside the canonical axes until every caller reads the canonical columns.",
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
  entity("CNT-19", "content", "LegalDocument", "PRESENT", ["legal_documents"], []),
  entity("CNT-20", "content", "ConsentDefinition", "PRESENT", ["consent_definitions", "consents"], []),
  entity("CNT-21", "content", "FormDefinition", "PRESENT", ["form_definitions", "form_definition_versions"], []),
  entity("OPS-01", "operational", "Contact", "PRESENT", ["contacts"], []),
  entity("OPS-02", "operational", "Account", "PARTIAL", ["organizations"], [
    "Approved match metadata and account-deduplication evidence are incomplete.",
  ]),
  entity("OPS-03", "operational", "Submission", "PARTIAL", ["form_submissions", "submission_public_references"], [
    "Canonical state, retention/anonymization states and an opaque public reference exist; audience/source/route identity is carried on the context rather than on the submission itself.",
  ]),
  entity("OPS-04", "operational", "SubmissionContext", "PRESENT", ["submission_contexts"], []),
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
  entity("OPS-08", "operational", "VisitorRegistration", "PRESENT", ["visitor_registrations"], []),
  entity("OPS-09", "operational", "AppointmentRequest", "PARTIAL", ["appointments", "appointment_slots"], [
    "Canonical provider_pending/provider_failed/expired states exist and booked is constrained to evidenced provider acceptance; the legacy status column is retained until callers migrate.",
  ]),
  entity("OPS-10", "operational", "Assignment", "PRESENT", ["lead_assignments", "leads"], []),
  entity("OPS-11", "operational", "Communication", "PRESENT", ["communications"], []),
  entity("OPS-12", "operational", "IntegrationJob", "PARTIAL", ["integration_jobs"], [
    "Canonical retrying/failed_terminal/suppressed/cancelled states exist; the legacy status column is retained until the worker reads the canonical column.",
  ]),
  entity("OPS-13", "operational", "OutboxEvent", "PRESENT", ["outbox_events"], []),
  entity("OPS-14", "operational", "AuditEvent", "PARTIAL", ["audit_events"], [
    "Purpose and before/after summaries are not explicit governed fields and depend on untyped metadata.",
  ]),
  entity("OPS-15", "operational", "PrivacyRequest", "PRESENT", ["privacy_requests"], []),
  entity("OPS-16", "operational", "Suppression", "PRESENT", ["suppressions"], []),
];

// A state contract is measured against the CANONICAL enum, with the legacy enum
// recorded alongside it. The legacy vocabulary is retained deliberately until
// every caller reads the canonical column, so an exact canonical match is
// reported as PARTIAL while the legacy enum still exists: the model is correct,
// but two vocabularies are still live and that is a real, reviewable state.
const stateContract = (id, contract, canonical, canonicalEnum, legacyEnum) => {
  const canonicalValues = enumIndex.get(canonicalEnum) ?? [];
  const legacyValues = legacyEnum ? (enumIndex.get(legacyEnum) ?? []) : [];
  const canonicalMatches =
    canonicalValues.length > 0 &&
    JSON.stringify(canonicalValues) === JSON.stringify(canonical);

  let classification;
  if (canonicalMatches) {
    classification = legacyValues.length > 0 ? "PARTIAL" : "PRESENT";
  } else if (canonicalValues.length > 0) {
    classification = "PARTIAL";
  } else if (legacyValues.length > 0) {
    classification = "MISMATCH";
  } else {
    classification = "MISSING";
  }

  return {
    id,
    contract,
    canonical,
    canonicalEnum: enumIndex.has(canonicalEnum) ? canonicalEnum : null,
    canonicalValues,
    legacyEnum: legacyEnum && enumIndex.has(legacyEnum) ? legacyEnum : null,
    legacyValues,
    legacyRetained: legacyValues.length > 0,
    classification,
  };
};

const states = [
  stateContract(
    "STA-01",
    "event_lifecycle",
    ["draft", "announced_undated", "scheduled", "live", "completed", "archived", "postponed", "cancelled"],
    "event_lifecycle_axis",
    "event_lifecycle_status",
  ),
  stateContract(
    "STA-02",
    "exhibitor_sales",
    ["planned", "open", "limited", "sold_out", "closed"],
    "event_exhibitor_sales_status",
    null,
  ),
  stateContract(
    "STA-03",
    "visitor_registration",
    ["planned", "open", "waitlist", "full", "closed"],
    "event_visitor_registration_status",
    null,
  ),
  stateContract(
    "STA-04",
    "submission",
    ["received", "duplicate_linked", "invalid_rejected", "withdrawn", "retained", "anonymized"],
    "submission_state",
    null,
  ),
  stateContract(
    "STA-05",
    "integration_job",
    ["queued", "processing", "succeeded", "retrying", "failed_terminal", "suppressed", "cancelled"],
    "integration_job_state",
    "integration_job_status",
  ),
  stateContract(
    "STA-06",
    "delivery",
    ["not_required", "queued", "delivered", "delayed", "bounced", "failed", "suppressed"],
    "delivery_state",
    "delivery_status",
  ),
  stateContract(
    "STA-07",
    "appointment",
    ["lead_captured", "provider_pending", "booked", "provider_failed", "cancelled", "expired"],
    "appointment_state",
    "appointment_status",
  ),
  stateContract(
    "STA-08",
    "publication",
    ["draft", "in_review", "changes_requested", "approved", "scheduled", "published", "expired", "withdrawn", "archived"],
    "publication_state",
    "publication_status",
  ),
];

const canonicalEditorialRoles = [
  "contributor",
  "editor",
  "evidence_reviewer",
  "translator",
  "publisher",
  "administrator",
];
const rolesWithPublishPermission = inventory.roleMatrix
  .filter((entry) => entry.permissions.includes("content.publish"))
  .map((entry) => entry.role);

const capabilityMatrix = inventory.capabilityMatrix ?? [];
const capabilityPermissions = new Map(
  capabilityMatrix.map((entry) => [entry.profile, entry.permissions]),
);
const profilesWithPublishPermission = capabilityMatrix
  .filter((entry) => entry.permissions.includes("content.publish"))
  .map((entry) => entry.profile);

const missingEditorialProfiles = canonicalEditorialRoles.filter(
  (profile) => !capabilityPermissions.has(profile),
);

// Separation of duties is only demonstrated when a profile is denied the things
// it must not be able to do. Presence of the profile alone proves nothing.
const grants = (profile, permission) =>
  (capabilityPermissions.get(profile) ?? []).includes(permission);

const separationChecks = [
  {
    check: "contributor cannot approve",
    holds: !grants("contributor", "content.approve"),
  },
  {
    check: "contributor cannot publish",
    holds: !grants("contributor", "content.publish"),
  },
  {
    check: "editor cannot approve evidence",
    holds: !grants("editor", "evidence.approve"),
  },
  {
    check: "evidence reviewer cannot publish",
    holds: !grants("evidence_reviewer", "content.publish"),
  },
  {
    check: "publisher cannot approve evidence",
    holds: !grants("publisher", "evidence.approve"),
  },
  {
    check: "administrator does not publish routinely",
    holds: !grants("administrator", "content.publish"),
  },
  {
    check: "translator cannot write base content",
    holds: !grants("translator", "content.write"),
  },
  {
    check: "publisher can publish",
    holds: grants("publisher", "content.publish"),
  },
  {
    check: "evidence reviewer can approve evidence",
    holds: grants("evidence_reviewer", "evidence.approve"),
  },
];

const failedSeparationChecks = separationChecks
  .filter((entry) => !entry.holds)
  .map((entry) => entry.check);

const rolesClassification =
  missingEditorialProfiles.length > 0
    ? "MISMATCH"
    : failedSeparationChecks.length > 0
      ? "PARTIAL"
      : "PRESENT";

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

// These probes describe the donor application layer. The SPIMAR repository does
// not necessarily contain the same files, and a missing file is a meaningful
// result ("this hard-coded reader does not exist here"), not a crash.
const readIfPresent = async (...segments) => {
  try {
    return await readFile(path.join(root, ...segments), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

const hardCodedPages = await readIfPresent("lib", "content", "pages.ts");
const hardCodedProjects = await readIfPresent("lib", "content", "projects.ts");
const localContactStore = await readIfPresent("lib", "contact", "store.ts");

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
    classification: rolesClassification,
    canonicalEditorialRoles,
    localRoleMatrix: inventory.roleMatrix,
    capabilityMatrix,
    missingDistinctEditorialRoles: missingEditorialProfiles,
    rolesWithPublishPermission,
    profilesWithPublishPermission,
    separationOfDutiesChecks: separationChecks,
    finding:
      missingEditorialProfiles.length > 0
        ? `Canonical editorial profiles are missing: ${missingEditorialProfiles.join(", ")}.`
        : failedSeparationChecks.length > 0
          ? `Editorial profiles exist but separation of duties is not demonstrated: ${failedSeparationChecks.join("; ")}.`
          : "All six canonical editorial profiles exist and separation of duties holds; legacy roles are retained alongside them.",
  },
  repositorySeams: {
    // The seam interfaces exist once they are declared in source; they are only
    // CONNECTED once the public and staff journeys read through them. Declaring
    // them is necessary but not sufficient, so this stays PARTIAL until the
    // application actually resolves content and submissions through the seam.
    classification: repositorySeamHits.length === 0 ? "MISSING" : "PARTIAL",
    repositorySeamHits,
    hardCodedContentMarkers: {
      pagesPresent: hardCodedPages !== null,
      projectsPresent: hardCodedProjects !== null,
      pagesDeclareFutureSupabaseMove:
        hardCodedPages?.includes("CMS-shaped: moves into Supabase") ?? false,
      projectsDeclareFutureSupabaseMove:
        hardCodedProjects?.includes("Becomes Supabase seed data") ?? false,
    },
    localContactStorePresent: localContactStore !== null,
    localContactJsonlStore:
      localContactStore?.includes("contact-submissions.jsonl") ?? false,
    finding:
      repositorySeamHits.length === 0
        ? "The application has no canonical repository seam and does not resolve content or submissions through one."
        : "Repository seam interfaces are declared, but the public and staff journeys do not yet resolve through them.",
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
