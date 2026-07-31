// Regenerate lib/content/local-videos.json: playback-id -> local /videos path.
import fs from "node:fs";
const map = {};
for (const f of fs.readdirSync("public/videos")) {
  const id = f.match(/(\d{9,11})/)?.[1];
  if (id) map[id] = `/videos/${f}`;
}
fs.writeFileSync("lib/content/local-videos.json", JSON.stringify(map, null, 1));
console.log(`mapped ${Object.keys(map).length} videos`);
