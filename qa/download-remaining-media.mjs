// Owner request 2026-07-31: no empty media placeholders pre-CMS — download
// every remaining block video from the HOY-080 manifest. Falls back to a
// fresh crawl of a page when its signed URLs have expired. Regenerates
// lib/content/local-videos.json from disk when done.

import fs from "node:fs";
import { execFileSync } from "node:child_process";

const manifest = JSON.parse(fs.readFileSync("qa/project-media-manifest.json", "utf8"));
const have = () =>
  new Set(fs.readdirSync("public/videos").map((f) => f.match(/(\d{9,11})/)?.[1]).filter(Boolean));

let owned = have();
const wanted = new Map();
for (const m of manifest) {
  const id = m.url.match(/playback\/(\d+)/)?.[1];
  if (!id || owned.has(id) || wanted.has(id)) continue;
  wanted.set(id, { url: m.url, slug: m.slug });
}
console.log(`missing videos: ${wanted.size}`);

const fetchOne = (id, url) => {
  const res = url.match(/rendition\/(\w+)\//)?.[1] || "720p";
  const out = `public/videos/vid-${id}-${res}.mp4`;
  execFileSync("curl.exe", ["-sS", "-f", "-L", "--max-time", "300", "-o", out, url]);
  const size = fs.statSync(out).size;
  if (size < 20000) {
    fs.rmSync(out);
    throw new Error(`too small (${size}B) — likely expired signature`);
  }
  return size;
};

let ok = 0;
const failed = [];
for (const [id, { url, slug }] of wanted) {
  try {
    const size = fetchOne(id, url);
    ok++;
    console.log(`ok ${id} (${slug}) ${(size / 1048576).toFixed(1)}MB`);
  } catch (e) {
    failed.push({ id, slug });
    console.log(`FAIL ${id} (${slug}): ${String(e.message || e).slice(0, 80)}`);
  }
}

// Re-crawl pages whose URLs expired, then retry with fresh signatures.
if (failed.length) {
  const slugs = [...new Set(failed.map((f) => f.slug))];
  console.log(`re-crawling ${slugs.length} pages for fresh signed URLs...`);
  const { chromium } = await import("@playwright/test");
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  try {
    await page.goto("https://houseofyellow.nl/", { waitUntil: "load", timeout: 45000 });
    await page.locator(".cmplz-accept").first().click({ timeout: 6000 });
  } catch {}
  owned = have();
  for (const slug of slugs) {
    try {
      await page.goto(`https://houseofyellow.nl/project/${slug}/`, { waitUntil: "load", timeout: 45000 });
      await page.evaluate(async () => {
        const d = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await d(80); }
        await d(400);
      });
      const urls = await page.evaluate(() =>
        [...document.querySelectorAll("video")]
          .map((v) => v.currentSrc || v.src || v.dataset.src || "")
          .filter(Boolean),
      );
      for (const url of urls) {
        const id = url.match(/playback\/(\d+)/)?.[1];
        if (!id || owned.has(id)) continue;
        try {
          const size = fetchOne(id, url);
          owned.add(id);
          ok++;
          console.log(`ok(fresh) ${id} (${slug}) ${(size / 1048576).toFixed(1)}MB`);
        } catch (e) {
          console.log(`FAIL(fresh) ${id} (${slug}): ${String(e.message || e).slice(0, 60)}`);
        }
      }
    } catch (e) {
      console.log(`crawl FAIL ${slug}: ${String(e).slice(0, 80)}`);
    }
  }
  await browser.close();
}

// refresh local-videos.json from disk
const map = {};
for (const f of fs.readdirSync("public/videos")) {
  const id = f.match(/(\d{9,11})/)?.[1];
  if (id && !map[id]) map[id] = `/videos/${f}`;
}
fs.writeFileSync("lib/content/local-videos.json", JSON.stringify(map, null, 1) + "\n");
const still = [...wanted.keys()].filter((id) => !map[id]);
console.log(`DONE ok=${ok} totalLocal=${Object.keys(map).length} stillMissing=${still.length} ${still.join(",")}`);
