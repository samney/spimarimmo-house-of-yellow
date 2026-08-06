# 02 — Design-token debt

Gate A deliverable, `SPIMARIMMO_FINAL_STABILIZATION_CLAUDE_MASTER.md` §2.2 and
§4.5. Measured on `40fafca`, 2026-08-06.

---

## 1. The guard that exists

`tests/design-system/token-layers.test.ts` holds a **two-sided** ratchet:

```
const BASELINE = { looseHexTotal: 102 };
```

It fails if the count rises, and it also fails if the count drops more than 10
without the baseline being lowered to match. That second assertion is the good
part — it stops debt being paid down invisibly and then silently re-accrued. It
also checks that previously-clean stylesheets stay clean, that no hex is shared
across files, and that named CSS colours are not used as design decisions.

## 2. What the guard cannot see — **196 raw colour functions**

§2.2 says the audit must expand beyond hex, because `rgb()`, `rgba()`, `hsl()`,
`hsla()`, `oklch()`, named colours and gradient colours produce identical drift
while escaping a hex-only check. Measured:

| Stylesheet                                           | Raw colour functions |
| ---------------------------------------------------- | -------------------: |
| `components/public/home/visibility.css`              |                   54 |
| `components/public/home/why-exhibit/why-exhibit.css` |                   37 |
| `components/public/home/gallery.css`                 |                   19 |
| `components/public/home/impact.css`                  |                   14 |
| `components/public/home/events.css`                  |                   13 |
| `components/public/home/method/method.css`           |                   12 |
| `components/public/home/home.css`                    |                   11 |
| `components/public/home/offers/offers.css`           |                    9 |
| `components/public/home/hero.css`                    |                    7 |
| `components/public/home/proof.css`                   |                    6 |
| `components/public/global/shell.css`                 |                    4 |
| `components/public/pages/spimar-pages.css`           |                    4 |
| `components/public/home/mre.css`                     |                    2 |
| `components/public/home/promoters.css`               |                    2 |
| `components/public/home/resources.css`               |                    2 |
| **Total**                                            |              **196** |

That is roughly **twice** the tracked hex debt, entirely unguarded, and it
clusters in the same three files §2.2 already names — `visibility.css`,
`why-exhibit.css`, `method.css` — which is corroboration, not coincidence.

## 3. These are real palettes, not incidental alpha

Sampled from `visibility.css`:

```css
border: 1px solid rgb(216 178 106 / 75%); /* line 483 */
border: 1px solid rgb(216 178 106 / 45%); /* line 502 */
color: rgb(227 201 143 / 70%); /* line 516 */
color: rgb(214 176 104 / 30%); /* line 538 */
```

Three different near-golds in one stylesheet, none of them the identity gold
`#efc337` and none derived from it. This is precisely §2.2's "several sections
use different near-identical paper, ink and gold values", and it is why
"changing the main gold token currently does not reliably re-skin the product".

A second, easier class: `rgb(0 0 0 / 45%)`, `rgb(0 0 0 / 50%)`,
`rgb(255 255 255 / 8%)` used for shadows and hairlines, while `app/globals.css`
already defines `--shadow-raised`. These want an elevation token, not a
per-section literal.

## 4. Recommended next step, in this order

1. **Extend the ratchet before paying anything down.** Add the colour-function
   count to `token-layers.test.ts` with its own baseline of 196, two-sided like
   the hex one. Without this, Phase 1 work is unmeasured and can regress
   silently — and the master document is explicit that the ratchet must not
   merely stop the number rising.
2. **Introduce the missing L2 semantics** the literals are approximating: an
   elevation/shadow scale and a gold-on-dark surface treatment. Most of the 196
   collapse into a handful of tokens.
3. **Then take the three clusters in order of size** — `visibility.css` (54),
   `why-exhibit.css` (37), `gallery.css` (19) — preserving composition exactly,
   per §5.1. These are token substitutions, not redesigns.
4. Lower both baselines as each file lands, so the ratchet keeps meaning what
   it says.

**Do not** remove either assertion to make a phase pass. The two-sided ratchet
is the only reason this debt is measurable at all.
