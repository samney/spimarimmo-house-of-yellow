import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = join(repositoryRoot, "lib/media/video-manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const errors = [];

/* TRF-004 removed the audited House of Yellow legacy mapping
   (lib/content/local-videos.json) that this validator previously cross-checked
   every published asset against.

   That assertion could not be re-pointed: it required each deployable asset to
   appear in the reference site's mapping, so it would reject every SPIMAR asset
   by construction — a gate that fails correct input is worse than no gate.

   Nothing else is relaxed. Rights approval, provenance, ownership, id/path/src
   uniqueness, repository-media existence and Git tracking, CDN HTTPS, and the
   ban on raw <video> outside the resilient component all still apply. Per-asset
   rights and source traceability is owned by the SPIMAR asset/source/readiness
   register in TRF-023. */

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.assets)) {
  errors.push("video-manifest.json must use schemaVersion 1 with an assets array");
}

const ids = new Set();
const legacyPaths = new Set();
const sources = new Set();

for (const asset of manifest.assets ?? []) {
  for (const field of ["id", "legacyPath", "src", "delivery", "sourceProvenance", "rightsOwner"]) {
    if (typeof asset[field] !== "string" || asset[field].trim() === "") {
      errors.push(`media asset ${asset.id ?? "<unknown>"} is missing ${field}`);
    }
  }
  if (asset.rightsStatus !== "approved") {
    errors.push(`media asset ${asset.id} is not rights-approved`);
  }
  if (ids.has(asset.id) || legacyPaths.has(asset.legacyPath) || sources.has(asset.src)) {
    errors.push(`media asset ${asset.id} duplicates an id, legacy path or source`);
  }
  ids.add(asset.id);
  legacyPaths.add(asset.legacyPath);
  sources.add(asset.src);

  if (asset.delivery === "repository") {
    const publicPath = join(repositoryRoot, "public", asset.src.replace(/^\//, ""));
    if (!existsSync(publicPath)) {
      errors.push(`repository media is missing: ${asset.src}`);
    } else {
      try {
        execFileSync("git", ["ls-files", "--error-unmatch", relative(repositoryRoot, publicPath)], {
          cwd: repositoryRoot,
          stdio: "ignore",
        });
      } catch {
        errors.push(`repository media is not tracked by Git: ${asset.src}`);
      }
    }
  } else if (asset.delivery === "cdn") {
    try {
      const url = new URL(asset.src);
      if (url.protocol !== "https:") errors.push(`CDN media must use HTTPS: ${asset.src}`);
    } catch {
      errors.push(`CDN media has an invalid URL: ${asset.src}`);
    }
  } else {
    errors.push(`media asset ${asset.id} has an unsupported delivery mode`);
  }
}

function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

const resilientVideoPath = join(repositoryRoot, "components/primitives/media/ResilientVideo.tsx");
for (const sourcePath of [
  ...sourceFiles(join(repositoryRoot, "app")),
  ...sourceFiles(join(repositoryRoot, "components")),
]) {
  if (sourcePath === resilientVideoPath) continue;
  if (/<video\b/.test(readFileSync(sourcePath, "utf8"))) {
    errors.push(
      `${relative(repositoryRoot, sourcePath)} bypasses the resilient media component with a raw <video>`,
    );
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Media manifest valid: ${manifest.assets.length} deployable asset(s); every mapping without a deployable source falls back to its poster.`,
);
