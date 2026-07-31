// HOY-080: download detail-page hero videos for all projects + every block
// video for the representative page (oceanco-leviathan), skipping files we
// already have. Uses the signed URLs from the crawl manifest.

import fs from "node:fs";
import { execFileSync } from "node:child_process";

const manifest = JSON.parse(fs.readFileSync("qa/project-media-manifest.json", "utf8"));
const have = new Set(
  fs.readdirSync("public/videos").map((f) => f.match(/(\d{9,11})/)?.[1]).filter(Boolean),
);

const wanted = new Map();
for (const m of manifest) {
  const id = m.url.match(/playback\/(\d+)/)?.[1];
  if (!id || have.has(id) || wanted.has(id)) continue;
  const isHero = m.block.startsWith("headerProjectBlock");
  const isOceanco = m.slug === "oceanco-leviathan";
  if (isHero || isOceanco) wanted.set(id, m.url);
}

console.log(`downloading ${wanted.size} videos`);
let ok = 0;
for (const [id, url] of wanted) {
  const res = url.match(/rendition\/(\w+)\//)?.[1] || "720p";
  const out = `public/videos/vid-${id}-${res}.mp4`;
  try {
    execFileSync("curl.exe", ["-sS", "-L", "--max-time", "300", "-o", out, url]);
    const mb = (fs.statSync(out).size / 1048576).toFixed(1);
    console.log(`ok ${id} ${mb}MB`);
    ok++;
  } catch (e) {
    console.log(`FAIL ${id}: ${String(e).slice(0, 80)}`);
  }
}
console.log(`DONE ${ok}/${wanted.size}`);
