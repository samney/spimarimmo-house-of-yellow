import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

/*
 * Verifies the MIG-000 checksum manifest against the immutable blobs of the
 * migration commit, not against the evolving working tree: control-plane
 * documents legitimately change after MIG-000, but the migration evidence
 * itself must remain byte-identical in history.
 */
const MIGRATION_COMMIT = "d29776d9e4e1269e809fd2c118d8fc27100a2556";

/*
 * The manifest was generated from a Windows working tree (core.autocrlf=input).
 * Exactly one archival file contained mixed CRLF/LF line endings on disk, so
 * its manifest hash records the original byte stream while Git stores the
 * LF-normalized blob. Both hashes identify the same accepted content and both
 * are pinned: the exception applies only while the manifest still records
 * exactly the documented mixed-line-ending hash and the migration commit still
 * stores exactly the documented LF blob. Any drift on either side is a genuine
 * integrity failure.
 */
const LINE_ENDING_EXCEPTIONS = new Map([
  [
    "docs/spimar/archive/early-gpt-work/90-House-of-Yellow-Reference-Foundation/HOUSE-OF-YELLOW-CLAUDE-CODE-MASTER-PROMPT.md",
    {
      manifestHash: "ada7e41eb38de80599c3408b8a5e70cf56040e90bc34ae340cc0d207ea9bc4e2",
      blobHash: "ba2b99032f8f98bc8a9fe7478c4c8cfab580f6ecd4706bf0da59df85ab3dd0ed",
    },
  ],
]);

/*
 * MIG-000 migrated exactly 164 checksummed overlay files (the manifest itself
 * is self-excluded). The manifest is immutable evidence: a changed entry
 * count, a duplicated path or an identical duplicated line is an integrity
 * failure. Distinct files may legitimately share a content hash (archive copy
 * plus canonical copy), so duplicate hashes alone are not defects.
 */
const EXPECTED_ENTRY_COUNT = 164;

const repositoryRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = join(repositoryRoot, "docs/migration/MIGRATION-MANIFEST.sha256");

function git(args, options = {}) {
  return execFileSync("git", args, {
    cwd: repositoryRoot,
    maxBuffer: 1024 * 1024 * 1024,
    ...options,
  });
}

try {
  git(["cat-file", "-e", `${MIGRATION_COMMIT}^{commit}`], { stdio: "ignore" });
} catch {
  console.log(`Migration commit ${MIGRATION_COMMIT} not present locally; fetching it from origin.`);
  git(["fetch", "--no-tags", "--depth=1", "origin", MIGRATION_COMMIT], { stdio: "inherit" });
}

const entries = readFileSync(manifestPath, "utf8")
  .split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => {
    const match = /^([0-9a-f]{64})\s+(.+)$/.exec(line.trim());
    if (!match) throw new Error(`Unparseable manifest line: ${line}`);
    return { hash: match[1], path: match[2].replace(/^\.\//, "") };
  });

const errors = [];

if (entries.length !== EXPECTED_ENTRY_COUNT) {
  errors.push(
    `manifest entry count changed: expected ${EXPECTED_ENTRY_COUNT}, found ${entries.length}`,
  );
}

const seenPaths = new Map();
for (const { hash, path } of entries) {
  const previousHash = seenPaths.get(path);
  if (previousHash === undefined) {
    seenPaths.set(path, hash);
  } else if (previousHash === hash) {
    errors.push(`identical duplicate manifest entry: ${path}`);
  } else {
    errors.push(`duplicate manifest path with conflicting hashes: ${path}`);
  }
}

let exactMatches = 0;
const documentedExceptions = [];

for (const { hash, path } of entries) {
  let blob;
  try {
    blob = git(["cat-file", "blob", `${MIGRATION_COMMIT}:${path}`]);
  } catch {
    errors.push(`missing from migration commit: ${path}`);
    continue;
  }

  const actual = createHash("sha256").update(blob).digest("hex");
  const exception = LINE_ENDING_EXCEPTIONS.get(path);
  if (actual === hash) {
    exactMatches += 1;
  } else if (
    exception !== undefined &&
    hash === exception.manifestHash &&
    actual === exception.blobHash
  ) {
    documentedExceptions.push(path);
  } else {
    errors.push(`checksum mismatch: ${path} manifest=${hash} blob=${actual}`);
  }
}

for (const path of LINE_ENDING_EXCEPTIONS.keys()) {
  if (!documentedExceptions.includes(path)) {
    errors.push(`documented line-ending exception no longer applies and must be re-audited: ${path}`);
  }
}

if (errors.length > 0) {
  console.error(`Migration manifest verification failed with ${errors.length} defect(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Migration manifest verified against ${MIGRATION_COMMIT}: ${entries.length} entries, ` +
    `${exactMatches} exact matches, ${documentedExceptions.length} documented line-ending exception(s).`,
);
