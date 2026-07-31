// HOY-090: download all culture + how-we-roll media (videos + poster/bg images)
// referenced in qa/{culture,how-we-roll}-main.html, skipping files we have.
// Updates lib/content/local-videos.json with new entries.

import fs from "node:fs";
import { execFileSync } from "node:child_process";

const pages = ["qa/culture-main.html", "qa/how-we-roll-main.html"];
const html = pages.map((p) => fs.readFileSync(p, "utf8")).join("\n");

const unesc = (s) => s.replace(/&amp;/g, "&");

// videos: desktop data-src only
const vidUrls = [...html.matchAll(/data-src="([^"]+)"/g)].map((m) => unesc(m[1]));
const have = new Set(
  fs.readdirSync("public/videos").map((f) => f.match(/(\d{9,11})/)?.[1]).filter(Boolean),
);
const wanted = new Map();
for (const url of vidUrls) {
  const id = url.match(/playback\/(\d+)/)?.[1];
  if (!id || have.has(id) || wanted.has(id)) continue;
  wanted.set(id, url);
}

// images: data-bg + inline background-image
const imgUrls = new Set(
  [
    ...[...html.matchAll(/data-bg="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/background-image: url\('([^']+)'\)/g)].map((m) => m[1]),
  ].map(unesc),
);

console.log(`videos to fetch: ${wanted.size}; images referenced: ${imgUrls.size}`);

let vOk = 0;
for (const [id, url] of wanted) {
  const res = url.match(/rendition\/(\w+)\//)?.[1] || "720p";
  const out = `public/videos/vid-${id}-${res}.mp4`;
  try {
    execFileSync("curl.exe", ["-sS", "-L", "--max-time", "300", "-o", out, url]);
    const mb = (fs.statSync(out).size / 1048576).toFixed(1);
    console.log(`vid ok ${id} ${mb}MB`);
    vOk++;
  } catch (e) {
    console.log(`vid FAIL ${id}: ${String(e).slice(0, 80)}`);
  }
}

let iOk = 0;
for (const url of imgUrls) {
  const name = url.split("/").pop();
  const out = `public/images/${name}`;
  if (fs.existsSync(out)) { console.log(`img skip ${name}`); iOk++; continue; }
  try {
    execFileSync("curl.exe", ["-sS", "-L", "--max-time", "120", "-o", out, url]);
    console.log(`img ok ${name} ${(fs.statSync(out).size / 1024).toFixed(0)}KB`);
    iOk++;
  } catch (e) {
    console.log(`img FAIL ${name}: ${String(e).slice(0, 80)}`);
  }
}

// refresh local-videos.json from disk
const map = {};
for (const f of fs.readdirSync("public/videos")) {
  const id = f.match(/(\d{9,11})/)?.[1];
  if (id && !map[id]) map[id] = `/videos/${f}`;
}
fs.writeFileSync("lib/content/local-videos.json", JSON.stringify(map, null, 1) + "\n");
console.log(`DONE videos ${vOk}/${wanted.size}, images ${iOk}/${imgUrls.size}; local-videos.json ${Object.keys(map).length} entries`);
