import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = join(repositoryRoot, "lib/media/video-manifest.json");
const legacyMapPath = join(repositoryRoot, "lib/content/local-videos.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const legacyMap = JSON.parse(readFileSync(legacyMapPath, "utf8"));
const errors = [];

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

  if (legacyMap[asset.id] !== asset.legacyPath) {
    errors.push(`media asset ${asset.id} does not match the audited legacy mapping`);
  }

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
  `Media manifest valid: ${manifest.assets.length} deployable asset(s); ${Object.keys(legacyMap).length} audited reference mapping(s) safely fall back when unavailable.`,
);
