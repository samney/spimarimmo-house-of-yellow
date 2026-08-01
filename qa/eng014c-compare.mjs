// ENG-014C: compare the reference and implementation audits into the parity
// matrix and the desktop/mobile measurement tables used as review evidence.
//
//   node qa/eng014c-compare.mjs [--out=qa/eng014c/parity-matrix.json]

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

const key = (record) => `${record.slug}@${record.viewport}`;
const refBy = new Map(reference.results.map((r) => [key(r), r]));

const ANCHOR_TOLERANCE = { "1440x900": 8, "390x844": 6 };

const rows = [];
const incomplete = [];
for (const impl of implementation.results) {
  const ref = refBy.get(key(impl));
  if (!ref) continue;
  /* A record without blocks means that capture failed; surface it instead of
     silently shrinking the matrix. */
  if (!impl.blocks || !ref.blocks) {
    incomplete.push(`${key(impl)}: ${impl.error ?? ref.error ?? "no blocks captured"}`);
    continue;
  }

  const sequenceMatch =
    JSON.stringify(ref.blockSequence) === JSON.stringify(impl.blockSequence);
  const statsMatch = JSON.stringify(ref.stats) === JSON.stringify(impl.stats);
  const relatedMatch =
    (ref.related?.href?.match(/\/project\/([^/]+)\/?$/)?.[1] ?? null) ===
    (impl.related?.href?.match(/\/project\/([^/]+)\/?$/)?.[1] ?? null);

  /* Section anchors are compared as offsets from the first block so the two
     documents' differing page chrome does not mask the block rhythm. */
  const anchorBase = (record) => record.blocks[0]?.box?.top ?? 0;
  const refBase = anchorBase(ref);
  const implBase = anchorBase(impl);
  const anchors = ref.blocks.map((block, index) => {
    const mirror = impl.blocks[index];
    const refTop = block.box.top - refBase;
    const implTop = mirror ? mirror.box.top - implBase : null;
    return {
      cls: block.cls,
      referenceTop: refTop,
      implementationTop: implTop,
      delta: implTop === null ? null : implTop - refTop,
      referenceHeight: block.box.height,
      implementationHeight: mirror?.box.height ?? null,
      heightDelta: mirror ? mirror.box.height - block.box.height : null,
      referenceSurfaces: block.surfaceCount,
      implementationSurfaces: mirror?.surfaceCount ?? null,
    };
  });

  const worstAnchor = anchors.reduce(
    (worst, anchor) =>
      anchor.delta === null ? worst : Math.max(worst, Math.abs(anchor.delta)),
    0,
  );

  /* Page scroll height includes global header/footer chrome, so the block-span
     height is the comparable measure of this route's own composition. */
  const span = (record) => {
    const last = record.blocks[record.blocks.length - 1]?.box;
    return last ? last.top + last.height - anchorBase(record) : null;
  };
  const refSpan = span(ref);
  const implSpan = span(impl);

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
    surfaceCountMatch: anchors.every(
      (a) => a.referenceSurfaces === a.implementationSurfaces,
    ),
    worstAnchorDelta: worstAnchor,
    anchorTolerance: ANCHOR_TOLERANCE[impl.viewport],
    anchorsWithinTolerance: worstAnchor <= (ANCHOR_TOLERANCE[impl.viewport] ?? 8),
    referenceBlockSpan: refSpan,
    implementationBlockSpan: implSpan,
    blockSpanDeltaPercent:
      refSpan && implSpan ? Number((((implSpan - refSpan) / refSpan) * 100).toFixed(2)) : null,
    referenceScrollHeight: ref.scrollHeight,
    implementationScrollHeight: impl.scrollHeight,
    scrollHeightDeltaPercent: Number(
      (((impl.scrollHeight - ref.scrollHeight) / ref.scrollHeight) * 100).toFixed(2),
    ),
    horizontalOverflow: impl.horizontalOverflow,
    consoleErrors: impl.consoleErrors,
    failedRequests: impl.failedRequests,
    anchors,
  });
}

const summary = {
  routes: new Set(rows.map((r) => r.slug)).size,
  records: rows.length,
  incompleteCaptures: incomplete,
  blockSequenceMismatches: rows.filter((r) => !r.blockSequenceMatch).map((r) => key(r)),
  statsMismatches: rows.filter((r) => !r.statsMatch).map((r) => key(r)),
  relatedMismatches: rows.filter((r) => !r.relatedMatch).map((r) => key(r)),
  surfaceCountMismatches: rows.filter((r) => !r.surfaceCountMatch).map((r) => key(r)),
  anchorsOutOfTolerance: rows
    .filter((r) => !r.anchorsWithinTolerance)
    .map((r) => `${key(r)} (${r.worstAnchorDelta}px)`),
  blockSpanOutOfTolerance: rows
    .filter((r) => Math.abs(r.blockSpanDeltaPercent ?? 0) > 2)
    .map((r) => `${key(r)} (${r.blockSpanDeltaPercent}%)`),
  horizontalOverflow: rows.filter((r) => r.horizontalOverflow > 1).map((r) => key(r)),
  consoleErrors: rows.filter((r) => r.consoleErrors.length).map((r) => key(r)),
  failedRequests: rows.filter((r) => r.failedRequests.length).map((r) => key(r)),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify({ summary, rows }, null, 1)}\n`);

console.log(JSON.stringify(summary, null, 1));
console.log(`\nwrote ${outPath}`);
