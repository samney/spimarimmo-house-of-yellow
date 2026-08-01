// ENG-014C: build the typed project-detail model consumed by the project
// template from the two audited inputs:
//
//   qa/projects-data.json                      verbatim reference copy (HOY-080 crawl)
//   qa/eng014c/reference-block-contract.json   block order, variants, surface
//                                              kinds, statistics and related targets
//
// Output: lib/content/project-details.json plus the remote-media provenance
// manifest qa/project-media-manifest.json. `buildProjectDetails` is pure so the
// unit suite can prove the committed data is reproducible from its inputs.
//
//   node qa/build-project-details.mjs

import fs from "node:fs";
import prettier from "prettier";

/* Structural contract per reference block class: model type and the ordered
   geometry slots the template renders. Slot shapes are fixed by the reference
   stylesheet, not by route data, and select the fallback poster geometry. */
const BLOCK_CONTRACT = {
  headerProjectBlock: { type: "header", shapes: ["wide"] },
  projectStatsBlock: { type: "stats", shapes: [] },
  projectTitleQuoteBlock: { type: "quote", shapes: [] },
  projectTwoImagesBlock: { type: "mediaPair", shapes: ["landscape", "portrait"] },
  "projectTwoImagesBlock text": { type: "mediaPairText", shapes: ["landscape", "portrait"] },
  "projectTwoImagesBlock sqaures": { type: "mediaPairSquares", shapes: ["square", "square"] },
  projectTextBlock: { type: "text", shapes: [] },
  projectFullWidthLoopBlock: { type: "fullLoop", shapes: ["wide"] },
  projectCreditsBlock: { type: "credits", shapes: [] },
  projectRelatedBlock: { type: "related", shapes: ["square"] },
};

const NARRATIVE_TYPES = new Set(["quote", "text", "mediaPairText", "credits"]);
const VIMEO_ID = /playback\/(\d+)/;
const collapse = (value) => (value || "").replace(/\s+/g, " ").trim();

/* The reference renders the narrative index as a sibling column, so it lands at
   one end of the section's text depending on the column order. */
function narrativeBody(text, heading, index) {
  let body = collapse(text);
  const marker = `[ ${index} ]`;
  if (body.startsWith(marker)) body = body.slice(marker.length).trim();
  if (body.endsWith(marker)) body = body.slice(0, -marker.length).trim();
  if (heading && body.startsWith(heading)) body = body.slice(heading.length).trim();
  return body;
}

function headerSummary(headerText, title, infoTags) {
  let body = collapse(headerText);
  if (title && body.startsWith(title)) body = body.slice(title.length).trim();
  const suffix = infoTags.join(" ");
  if (suffix && body.endsWith(suffix)) body = body.slice(0, -suffix.length).trim();
  return body;
}

export function buildProjectDetails(rawProjects, contract) {
  const errors = [];
  const details = [];
  const mediaManifest = [];
  const rawBySlug = new Map(rawProjects.map((record) => [record.slug, record]));

  for (const route of contract.routes) {
    const raw = rawBySlug.get(route.slug);
    if (!raw) {
      errors.push(`${route.slug}: no audited page record in qa/projects-data.json`);
      continue;
    }

    const rawSequence = raw.blocks.map((block) => collapse(block.cls));
    const contractSequence = route.blocks.map((block) => block.cls);
    if (rawSequence.join("|") !== contractSequence.join("|")) {
      errors.push(
        `${route.slug}: audited page blocks ${rawSequence.join(", ")} do not match the contract ${contractSequence.join(", ")}`,
      );
      continue;
    }

    const blocks = [];
    for (const [position, entry] of route.blocks.entries()) {
      const shape = BLOCK_CONTRACT[entry.cls];
      if (!shape) {
        errors.push(`${route.slug}: unsupported block class "${entry.cls}"`);
        continue;
      }
      if (entry.surfaces.length !== shape.shapes.length) {
        errors.push(
          `${route.slug}: block "${entry.cls}" has ${entry.surfaces.length} audited surfaces, expected ${shape.shapes.length}`,
        );
        continue;
      }

      const rawBlock = raw.blocks[position];
      const videoIds = rawBlock.vids
        .map((video) => video.url?.match(VIMEO_ID)?.[1])
        .filter(Boolean);
      let videoCursor = 0;
      const surfaces = entry.surfaces.map((kind, slot) => ({
        shape: shape.shapes[slot],
        kind,
        videoId: kind === "video" ? (videoIds[videoCursor++] ?? null) : null,
      }));

      for (const video of rawBlock.vids) {
        if (video.url) {
          mediaManifest.push({
            slug: route.slug,
            block: entry.cls,
            url: video.url,
            poster: video.poster,
          });
        }
      }

      const block = { type: shape.type, cls: entry.cls };
      if (entry.index) block.index = entry.index;
      if (entry.heading) block.heading = entry.heading;

      if (NARRATIVE_TYPES.has(shape.type)) {
        /* The audited page crawl is the copy authority and the audited DOM is
           the paragraph authority; requiring them to agree keeps either input
           from silently inventing or dropping narrative text. */
        const collapsed = narrativeBody(rawBlock.text, entry.heading, entry.index);
        const paragraphs = entry.paragraphs?.length ? entry.paragraphs : [collapsed];
        if (paragraphs.join(" ") !== collapsed) {
          errors.push(
            `${route.slug}: block "${entry.cls}" paragraphs do not reconstruct the audited copy`,
          );
        }
        block.paragraphs = paragraphs;
      } else if (shape.type === "related") {
        block.targetSlug = route.relatedSlug;
      }
      if (surfaces.length) block.surfaces = surfaces;

      blocks.push(block);
    }

    const headerBlock = blocks.find((block) => block.type === "header");
    details.push({
      slug: route.slug,
      title: route.title,
      metaDesc: raw.metaDesc,
      summary: headerSummary(raw.headerText, route.title, route.infoTags),
      infoTags: route.infoTags,
      categories: (route.infoTags[2] ?? "")
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean),
      stats: route.stats.map(({ label, value }) => ({ label, value })),
      relatedNext: route.relatedSlug,
      heroVideoId: headerBlock?.surfaces?.[0]?.videoId ?? null,
      blocks,
    });
  }

  if (errors.length) throw new Error(errors.join("\n"));
  return { details, mediaManifest };
}

/* Generated data is committed, so it is written in the repository's Prettier
   style; regenerating is then idempotent and never dirties the format gate. */
export async function serialize(value, filepath) {
  const options = await prettier.resolveConfig(filepath);
  return prettier.format(JSON.stringify(value, null, 2), { ...options, filepath });
}

if (process.argv[1]?.endsWith("build-project-details.mjs")) {
  const raw = JSON.parse(fs.readFileSync("qa/projects-data.json", "utf8"));
  const contract = JSON.parse(fs.readFileSync("qa/eng014c/reference-block-contract.json", "utf8"));
  const { details, mediaManifest } = buildProjectDetails(raw, contract);

  fs.mkdirSync("lib/content", { recursive: true });
  fs.writeFileSync(
    "lib/content/project-details.json",
    await serialize(details, "lib/content/project-details.json"),
  );
  fs.writeFileSync(
    "qa/project-media-manifest.json",
    await serialize(mediaManifest, "qa/project-media-manifest.json"),
  );
  console.log(`details=${details.length} mediaUrls=${mediaManifest.length}`);
}
