// HOY-090: pull block-scoped rules (with @media context) from the captured
// theme CSS for the culture + how-we-roll blocks. Output: qa/hoy090-blocks.css

import fs from "node:fs";

const css = fs.readFileSync("qa/theme-inline.css", "utf8");
const WANT = /\.(headerCultureBlock|cultureItemBlock|cultureQuoteBlock|cultureQuoteAnimationBlock|cultureWorkBlock|headerHowWeRollBlock|howWeRollTitleBlock|howWeRollTextItemsBlock|howWeRollDividerAnimationBlock|projectTwoImagesBlock)\b/;

// tiny tokenizer: walk rules, tracking @media nesting
let out = [];
let i = 0;
function parseBlock(mediaCtx) {
  while (i < css.length) {
    // skip whitespace/comments
    while (i < css.length && /\s/.test(css[i])) i++;
    if (css.startsWith("/*", i)) { i = css.indexOf("*/", i) + 2; continue; }
    if (css[i] === "}") { i++; return; }
    if (i >= css.length) return;
    // read selector / at-rule up to { or ;
    let j = i;
    while (j < css.length && css[j] !== "{" && css[j] !== ";") j++;
    const head = css.slice(i, j).trim();
    if (css[j] === ";") { i = j + 1; continue; } // @import etc.
    if (head.startsWith("@media") || head.startsWith("@supports")) {
      i = j + 1;
      parseBlock(mediaCtx ? mediaCtx + " AND " + head : head);
      continue;
    }
    if (head.startsWith("@")) {
      // other at-rule with block (keyframes etc.) — skip balanced
      let depth = 1; i = j + 1;
      while (i < css.length && depth > 0) { if (css[i] === "{") depth++; else if (css[i] === "}") depth--; i++; }
      continue;
    }
    // normal rule
    const end = css.indexOf("}", j);
    const body = css.slice(j + 1, end).trim();
    i = end + 1;
    if (WANT.test(head)) out.push({ media: mediaCtx, head, body });
  }
}
parseBlock(null);

let text = "";
let lastMedia = "<start>";
for (const r of out) {
  if (r.media !== lastMedia) { text += `\n/* ========== ${r.media || "base"} ========== */\n`; lastMedia = r.media; }
  text += `${r.head} { ${r.body} }\n`;
}
fs.writeFileSync("qa/hoy090-blocks.css", text);
console.log(`rules: ${out.length} -> qa/hoy090-blocks.css (${text.length} bytes)`);
