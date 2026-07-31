// HOY-080: normalize qa/projects-data.json into lib/content/project-details.json
// consumed by the project template. Also emits a media manifest of remote URLs.

import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync("qa/projects-data.json", "utf8"));
const base = JSON.parse(
  fs
    .readFileSync("lib/content/projects.ts", "utf8")
    .match(/export const PROJECTS[^=]*=\s*(\[[\s\S]*\]);/)[1]
    // crude TS->JSON: quote keys, strip trailing commas
    .replace(/(\w+):/g, '"$1":')
    .replace(/,(\s*[}\]])/g, "$1"),
);

const details = [];
const mediaManifest = [];

for (const p of raw) {
  const meta = base.find((b) => b.slug === p.slug);
  if (!meta || p.error) {
    console.log(`skip ${p.slug} ${p.error || "no base"}`);
    continue;
  }
  const blockOf = (cls) => p.blocks.find((b) => b.cls.trim() === cls);

  // Header: "{title} {summary} {year} {sector} {categories}"
  const header = p.headerText || "";
  let summary = "";
  let categories = meta.categories;
  const afterTitle = header.startsWith(meta.title) ? header.slice(meta.title.length).trim() : header;
  const yearIdx = afterTitle.lastIndexOf(meta.year);
  if (yearIdx > 0) {
    summary = afterTitle.slice(0, yearIdx).trim();
    const tail = afterTitle.slice(yearIdx + meta.year.length).trim();
    const catPart = tail.startsWith(meta.sector) ? tail.slice(meta.sector.length).trim() : tail;
    if (catPart) categories = catPart.split(",").map((c) => c.trim()).filter(Boolean);
  } else summary = afterTitle;

  // Stats
  const statsText = blockOf("projectStatsBlock")?.text || "";
  const stat = (label) => statsText.match(new RegExp(label + "\\s*(\\+?[\\d.]+)"))?.[1] || null;

  // Narratives
  const clientText = (blockOf("projectTitleQuoteBlock")?.text || "").replace(/^The Client\s*/, "");
  const processBlock = p.blocks.find((b) => b.cls.includes("projectTwoImagesBlock") && /The Process/.test(b.text));
  const processText = processBlock ? processBlock.text.replace(/^.*?The Process\s*/, "") : "";
  const projBlock = p.blocks.find((b) => b.cls.includes("projectTextBlock"));
  const projMatch = projBlock?.text.match(/\[\s*(\d+)\s*\]\s*The Project\s*(.*)/);
  const projectText = projMatch ? projMatch[2] : projBlock?.text || "";

  const credits = (blockOf("projectCreditsBlock")?.text || "").replace(/^Big thank you to:\s*/, "");
  const related = p.blocks.find((b) => b.cls.includes("projectRelatedBlock"));
  const relatedNext = related ? related.text.replace(/Keep Looking Through Our work.*/i, "").trim() : "";

  // Media: collect all remote video URLs + bg images per block for the manifest.
  const blockMedia = p.blocks.map((b) => ({
    cls: b.cls,
    vids: b.vids.filter((v) => v.url),
    bgs: b.bgs,
  }));
  for (const b of blockMedia)
    for (const v of b.vids) mediaManifest.push({ slug: p.slug, block: b.cls, url: v.url, poster: v.poster });

  const heroVid = blockOf("headerProjectBlock")?.vids?.[0]?.url || "";
  const heroId = heroVid.match(/playback\/(\d+)/)?.[1] || null;

  details.push({
    slug: p.slug,
    metaDesc: p.metaDesc,
    summary,
    categories,
    stats: {
      impressions: stat("Impressions"),
      followers: stat("Followers"),
      countries: stat("Countries"),
      engagements: stat("Engagements"),
    },
    clientText,
    processText,
    projectText,
    credits,
    relatedNext,
    heroVideoId: heroId,
    blocks: blockMedia.map((b) => ({ cls: b.cls, vidIds: b.vids.map((v) => v.url.match(/playback\/(\d+)/)?.[1]).filter(Boolean), bgs: b.bgs.map((u) => u.split("/").pop()) })),
  });
}

fs.mkdirSync("lib/content", { recursive: true });
fs.writeFileSync("lib/content/project-details.json", JSON.stringify(details, null, 1));
fs.writeFileSync("qa/project-media-manifest.json", JSON.stringify(mediaManifest, null, 1));
console.log(`details=${details.length} mediaUrls=${mediaManifest.length}`);
