// ENG-014C: reduce the live-reference audit to the stable structural contract
// that drives the project-detail model. Only viewport-independent facts are
// kept — block order and variants, per-block media-surface kinds, narrative
// headings and indices, statistics label/value pairs, header info tags and the
// related-project target. Measurements stay in the audit file as evidence.
//
//   node qa/eng014c-build-contract.mjs [--audit=qa/eng014c/reference-audit.json]

import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const auditPath = args.audit ?? "qa/eng014c/reference-audit.json";
const outPath = args.out ?? "qa/eng014c/reference-block-contract.json";

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
const desktop = audit.results.filter((r) => r.viewport === "1440x900");
const mobile = new Map(
  audit.results.filter((r) => r.viewport === "390x844").map((r) => [r.slug, r]),
);

const errors = [];
const routes = [];

for (const record of desktop) {
  if (record.error) {
    errors.push(`${record.slug}: audit error ${record.error}`);
    continue;
  }

  const twin = mobile.get(record.slug);
  if (!twin) {
    errors.push(`${record.slug}: no mobile audit record`);
  } else if (JSON.stringify(twin.blockSequence) !== JSON.stringify(record.blockSequence)) {
    errors.push(`${record.slug}: block sequence differs between viewports`);
  }

  const relatedSlug = record.related?.href?.match(/\/project\/([^/]+)\/?$/)?.[1] ?? null;
  if (!relatedSlug) errors.push(`${record.slug}: no related-project target`);

  routes.push({
    slug: record.slug,
    title: record.header?.title ?? null,
    infoTags: record.header?.infoTags ?? [],
    heroSurface: record.header?.heroKind ?? null,
    stats: record.stats ?? [],
    relatedSlug,
    blocks: record.blocks.map((block) => {
      const entry = { cls: block.cls, surfaces: block.surfaces.map((s) => s.kind) };
      if (block.numIndex) entry.index = block.numIndex;
      /* The header block's only heading is the project title itself, already
         carried on the route; every other heading is section copy. */
      if (block.title && block.cls !== "headerProjectBlock") entry.heading = block.title;
      if (block.paragraphs?.length) entry.paragraphs = block.paragraphs;
      return entry;
    }),
  });
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  `${JSON.stringify({ source: audit.base, viewports: ["1440x900", "390x844"], routes }, null, 2)}\n`,
);
console.log(`wrote ${outPath} (${routes.length} routes)`);
