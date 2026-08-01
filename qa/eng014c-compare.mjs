// ENG-014C: compare the reference and implementation audits into the parity
// matrix and the desktop/mobile measurement tables used as review evidence.
//
//   node qa/eng014c-compare.mjs [--out=qa/eng014c/parity-matrix.json]
//
// This is a gate, not a report. It exits non-zero when the audits are
// structurally incomplete or when in-scope parity fails. Records are never
// silently skipped and absent measurements are never coerced to zero: a missing
// value is a failure, because a shrunken matrix that prints "zero mismatches" is
// indistinguishable from a passing one.
//
// The raw whole-page scroll-height delta is reported but is NOT a gate. It is
// the authorized unmet exception recorded in DECISIONS.md as D-014 (shared
// global shell, +203px desktop / +193px mobile, owned by PAR-P1-004 under
// ENG-014E). It is never reported as passing.

import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const reference = JSON.parse(
  fs.readFileSync(args.reference ?? "qa/eng014c/reference-audit.json", "utf8"),
);
const implementation = JSON.parse(
  fs.readFileSync(args.implementation ?? "qa/eng014c/implementation-audit.json", "utf8"),
);
const outPath = args.out ?? "qa/eng014c/parity-matrix.json";

/* 21 audited routes × two required viewports. Both audits must be complete;
   anything else means the evidence cannot support a parity claim. */
const EXPECTED_ROUTES = 21;
const EXPECTED_VIEWPORTS = ["1440x900", "390x844"];
const EXPECTED_RECORDS = EXPECTED_ROUTES * EXPECTED_VIEWPORTS.length;
const ANCHOR_TOLERANCE = { "1440x900": 8, "390x844": 6 };
const BLOCK_SPAN_TOLERANCE_PERCENT = 2;

const key = (record) => `${record.slug}@${record.viewport}`;
const failures = [];
const fail = (message) => failures.push(message);

/* A measurement that is absent, null or non-finite is a failed capture, not a
   zero. Every numeric read in this file goes through here. */
function measure(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(`${label}: expected a finite number, got ${JSON.stringify(value)}`);
    return null;
  }
  return value;
}

/* Index one audit, proving it has exactly the expected complete records and no
   duplicates. Incomplete records are reported, never dropped. */
function index(audit, label) {
  const results = Array.isArray(audit?.results) ? audit.results : null;
  if (!results) {
    fail(`${label}: audit has no results array`);
    return new Map();
  }
  if (results.length !== EXPECTED_RECORDS) {
    fail(`${label}: expected ${EXPECTED_RECORDS} records, found ${results.length}`);
  }

  const byKey = new Map();
  for (const record of results) {
    if (!record?.slug || !record?.viewport) {
      fail(`${label}: record without slug/viewport: ${JSON.stringify(record).slice(0, 120)}`);
      continue;
    }
    const id = key(record);
    if (byKey.has(id)) {
      fail(`${label}: duplicate record ${id}`);
      continue;
    }
    if (!EXPECTED_VIEWPORTS.includes(record.viewport)) {
      fail(`${label}: ${id} uses unexpected viewport ${record.viewport}`);
    }
    if (record.error) {
      fail(`${label}: ${id} captured with error ${record.error}`);
    }
    if (!Array.isArray(record.blocks) || record.blocks.length === 0) {
      fail(`${label}: ${id} has no captured blocks`);
    }
    if (!Array.isArray(record.blockSequence) || record.blockSequence.length === 0) {
      fail(`${label}: ${id} has no block sequence`);
    }
    byKey.set(id, record);
  }

  const routes = new Set(results.map((record) => record?.slug).filter(Boolean));
  if (routes.size !== EXPECTED_ROUTES) {
    fail(`${label}: expected ${EXPECTED_ROUTES} distinct routes, found ${routes.size}`);
  }
  for (const slug of routes) {
    for (const viewport of EXPECTED_VIEWPORTS) {
      if (!byKey.has(`${slug}@${viewport}`)) fail(`${label}: missing record ${slug}@${viewport}`);
    }
  }
  return byKey;
}

const refBy = index(reference, "reference");
const implBy = index(implementation, "implementation");

/* Unmatched records on either side are reported. The previous version skipped
   them, which let the matrix shrink while still summarising "no mismatches". */
for (const id of implBy.keys()) {
  if (!refBy.has(id)) fail(`unmatched: implementation record ${id} has no reference record`);
}
for (const id of refBy.keys()) {
  if (!implBy.has(id)) fail(`unmatched: reference record ${id} has no implementation record`);
}

const rows = [];
for (const [id, impl] of implBy) {
  const ref = refBy.get(id);
  if (!ref) continue; // already reported as unmatched above
  if (!Array.isArray(impl.blocks) || !Array.isArray(ref.blocks)) continue; // already reported

  const sequenceMatch = JSON.stringify(ref.blockSequence) === JSON.stringify(impl.blockSequence);
  const statsMatch = JSON.stringify(ref.stats) === JSON.stringify(impl.stats);
  const relatedMatch =
    (ref.related?.href?.match(/\/project\/([^/]+)\/?$/)?.[1] ?? null) ===
    (impl.related?.href?.match(/\/project\/([^/]+)\/?$/)?.[1] ?? null);

  if (ref.blocks.length !== impl.blocks.length) {
    fail(`${id}: block count ${impl.blocks.length} does not match reference ${ref.blocks.length}`);
  }

  /* Section anchors are compared as offsets from the first block so the two
     documents' differing page chrome does not mask the block rhythm. */
  const anchorBase = (record, label) => measure(record.blocks[0]?.box?.top, `${label} first block top`);
  const refBase = anchorBase(ref, `${id} reference`);
  const implBase = anchorBase(impl, `${id} implementation`);

  const anchors = ref.blocks.map((block, position) => {
    const mirror = impl.blocks[position];
    if (!mirror) {
      fail(`${id}: implementation is missing block ${position} (${block.cls})`);
      return null;
    }
    const refTop = measure(block.box?.top, `${id} reference block ${position} top`);
    const implTop = measure(mirror.box?.top, `${id} implementation block ${position} top`);
    const refHeight = measure(block.box?.height, `${id} reference block ${position} height`);
    const implHeight = measure(mirror.box?.height, `${id} implementation block ${position} height`);
    if (refBase === null || implBase === null || refTop === null || implTop === null) return null;
    return {
      cls: block.cls,
      referenceTop: refTop - refBase,
      implementationTop: implTop - implBase,
      delta: implTop - implBase - (refTop - refBase),
      referenceHeight: refHeight,
      implementationHeight: implHeight,
      heightDelta: refHeight === null || implHeight === null ? null : implHeight - refHeight,
      referenceSurfaces: block.surfaceCount,
      implementationSurfaces: mirror.surfaceCount,
    };
  });

  if (anchors.some((anchor) => anchor === null)) {
    fail(`${id}: incomplete anchor measurements`);
  }
  const usable = anchors.filter(Boolean);
  const worstAnchor = usable.reduce((worst, a) => Math.max(worst, Math.abs(a.delta)), 0);
  const tolerance = ANCHOR_TOLERANCE[impl.viewport];
  if (tolerance === undefined) fail(`${id}: no anchor tolerance defined for ${impl.viewport}`);

  /* Page scroll height includes global header/footer chrome, so the block-span
     height is the comparable measure of this route's own composition. */
  const span = (record, label) => {
    const last = record.blocks[record.blocks.length - 1]?.box;
    const base = record.blocks[0]?.box?.top;
    const top = measure(last?.top, `${label} last block top`);
    const height = measure(last?.height, `${label} last block height`);
    const start = measure(base, `${label} first block top`);
    if (top === null || height === null || start === null) return null;
    return top + height - start;
  };
  const refSpan = span(ref, `${id} reference`);
  const implSpan = span(impl, `${id} implementation`);
  let blockSpanDeltaPercent = null;
  if (refSpan === null || implSpan === null) {
    fail(`${id}: block span could not be measured`);
  } else if (refSpan === 0) {
    fail(`${id}: reference block span is zero`);
  } else {
    blockSpanDeltaPercent = Number((((implSpan - refSpan) / refSpan) * 100).toFixed(2));
  }

  const refScroll = measure(ref.scrollHeight, `${id} reference scrollHeight`);
  const implScroll = measure(impl.scrollHeight, `${id} implementation scrollHeight`);
  let scrollHeightDeltaPercent = null;
  if (refScroll !== null && implScroll !== null && refScroll !== 0) {
    scrollHeightDeltaPercent = Number((((implScroll - refScroll) / refScroll) * 100).toFixed(2));
  } else if (refScroll === 0) {
    fail(`${id}: reference scrollHeight is zero`);
  }

  const overflow = measure(impl.horizontalOverflow, `${id} horizontalOverflow`);
  const consoleErrors = Array.isArray(impl.consoleErrors) ? impl.consoleErrors : null;
  const failedRequests = Array.isArray(impl.failedRequests) ? impl.failedRequests : null;
  if (consoleErrors === null) fail(`${id}: consoleErrors is not an array`);
  if (failedRequests === null) fail(`${id}: failedRequests is not an array`);

  rows.push({
    slug: impl.slug,
    viewport: impl.viewport,
    blockSequenceMatch: sequenceMatch,
    referenceSequence: ref.blockSequence,
    implementationSequence: impl.blockSequence,
    statsMatch,
    referenceStats: ref.stats,
    implementationStats: impl.stats,
    relatedMatch,
    referenceRelated: ref.related?.title ?? null,
    implementationRelated: impl.related?.title ?? null,
    surfaceCountMatch: usable.every((a) => a.referenceSurfaces === a.implementationSurfaces),
    worstAnchorDelta: worstAnchor,
    anchorTolerance: tolerance ?? null,
    anchorsWithinTolerance: tolerance !== undefined && worstAnchor <= tolerance,
    referenceBlockSpan: refSpan,
    implementationBlockSpan: implSpan,
    blockSpanDeltaPercent,
    referenceScrollHeight: refScroll,
    implementationScrollHeight: implScroll,
    scrollHeightDeltaPercent,
    horizontalOverflow: overflow,
    consoleErrors: consoleErrors ?? [],
    failedRequests: failedRequests ?? [],
    anchors: usable,
  });
}

if (rows.length !== EXPECTED_RECORDS) {
  fail(`comparison produced ${rows.length} rows, expected ${EXPECTED_RECORDS}`);
}

/* In-scope parity gates. A null measurement never passes silently: every value
   below is already proven finite, or the record has already failed. */
const gate = (name, predicate) => {
  const offenders = rows.filter((row) => !predicate(row)).map((row) => key(row));
  if (offenders.length) fail(`${name}: ${offenders.join(", ")}`);
  return offenders;
};

const blockSequenceMismatches = gate("blockSequenceMismatches", (r) => r.blockSequenceMatch);
const statsMismatches = gate("statsMismatches", (r) => r.statsMatch);
const relatedMismatches = gate("relatedMismatches", (r) => r.relatedMatch);
const surfaceCountMismatches = gate("surfaceCountMismatches", (r) => r.surfaceCountMatch);
const anchorsOutOfTolerance = gate("anchorsOutOfTolerance", (r) => r.anchorsWithinTolerance);
const blockSpanOutOfTolerance = gate(
  "blockSpanOutOfTolerance",
  (r) =>
    typeof r.blockSpanDeltaPercent === "number" &&
    Math.abs(r.blockSpanDeltaPercent) <= BLOCK_SPAN_TOLERANCE_PERCENT,
);
const horizontalOverflow = gate(
  "horizontalOverflow",
  (r) => typeof r.horizontalOverflow === "number" && r.horizontalOverflow <= 1,
);
const consoleErrors = gate("consoleErrors", (r) => r.consoleErrors.length === 0);
const failedRequests = gate("failedRequests", (r) => r.failedRequests.length === 0);

/* D-014: reported, never gated, never described as passing. */
const scrollHeightDeltas = rows
  .map((r) => r.scrollHeightDeltaPercent)
  .filter((v) => typeof v === "number");
const wholePageException = {
  criterion: "raw whole-page scroll-height delta <= 2%",
  status: "UNMET — authorized exception D-014, not a passing measurement",
  owner: "PAR-P1-004 under ENG-014E",
  cause: "pre-existing, unchanged shared global shell (footer.setDarkCursor)",
  recordsExceedingTwoPercent: rows.filter(
    (r) => typeof r.scrollHeightDeltaPercent === "number" && Math.abs(r.scrollHeightDeltaPercent) > 2,
  ).length,
  minDeltaPercent: scrollHeightDeltas.length ? Math.min(...scrollHeightDeltas) : null,
  maxDeltaPercent: scrollHeightDeltas.length ? Math.max(...scrollHeightDeltas) : null,
};

const summary = {
  routes: new Set(rows.map((r) => r.slug)).size,
  records: rows.length,
  expectedRecords: EXPECTED_RECORDS,
  blockSequenceMismatches,
  statsMismatches,
  relatedMismatches,
  surfaceCountMismatches,
  anchorsOutOfTolerance,
  blockSpanOutOfTolerance,
  horizontalOverflow,
  consoleErrors,
  failedRequests,
  wholePageScrollHeightException: wholePageException,
  validationFailures: failures,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify({ summary, rows }, null, 1)}\n`);

console.log(JSON.stringify(summary, null, 1));
console.log(`\nwrote ${outPath}`);

if (failures.length) {
  console.error(`\nENG-014C comparison FAILED with ${failures.length} problem(s):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `\nENG-014C comparison passed on ${rows.length}/${EXPECTED_RECORDS} complete records.` +
    `\nWhole-page scroll height remains UNMET by design under D-014 ` +
    `(${wholePageException.recordsExceedingTwoPercent}/${rows.length} records above 2%, ` +
    `${wholePageException.minDeltaPercent}%–${wholePageException.maxDeltaPercent}%), ` +
    `owned by PAR-P1-004 under ENG-014E.`,
);
