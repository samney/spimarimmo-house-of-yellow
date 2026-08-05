# Notre méthode — Phase 01 parity report (Gates 1–2)

- **Branch:** `claude/method-section-parity`
- **Base SHA:** `c9f5b954601754e1d5b1039137a240fc07b6b75c` (see `base-sha.txt`)
- **Golden viewport:** 1536 × 1024, DPR 1, Chromium (Playwright 1.62), fonts loaded, animations disabled
- **Reference:** `reference-01-avant.png` (SHA-256 verified against `ASSET_MANIFEST.md` source)
- **Actual:** `actual-before.png`, captured from the production build (`next build` + `next start`) via `qa/method-parity/capture.mjs` on `/visual-test/method?phase=before`
- **Overlay:** `overlay-before.png` (50 % blend) · **Diff:** `diff-before.png` (red = per-channel delta > 24)

## Per-region delta (region-based validation per owner decision 7)

Full data: `report-before.json`. Tolerance 24/channel; ratios are differing-pixel shares.

| Region | Mode | Diff ratio | Assessment |
| --- | --- | --- | --- |
| introduction | strict | 0.114 | Anchors aligned: heading glyphs 94 vs 96 ref, support top 217 = ref, CTA box 1138×61 = ref. Residual is glyph-form difference (Poppins vs reference grotesk) plus heading line pitch (ref ≈ 1.23 lh vs 1.2). |
| phase-rail | strict | 0.059 | Item tops 383/545/707 = ref (measured 382/535/698 glyph rows; ±2 px). Residual is glyph antialiasing. |
| phase-copy | strict | 0.180 | Numeral bounds match; title breaks Préparer / la demande as ref (controlled break — see intentional deltas); body 3 lines = ref; chips 2×3 = ref; CTA underline y ≈ 800 = ref. Residual is glyph forms and chip pill widths (Poppins ~15 % wider). |
| dossier | perceptual | 0.377 | Reviewed by overlay: folder bounds, DOSSIER EXPOSANT label rows 394–446 = ref, document slot bounds within ~10 px, status rail top 796 = ref. Material is a CSS recreation of generated photography (see intentional deltas). |
| deliverables | strict | 0.198 | Heading row 330, cards y 366/486/604/723 h 103, stack x 1184 w 266 = ref. Residual: thumb interiors are neutral bars (no approved imagery) and title x-offset 118 vs 143 (kept single-line with repo font). |
| footer-progress | strict | 0.075 | Track y 921 = ref; markers x 80/573/963 = ref; pill 36 px on line = ref. |
| **whole image** | — | **0.185** | The 0.001 global target is not met and is not claimed. |

## Intentional differences (each per an allowed category)

1. **Typeface metrics** — repository self-hosted Poppins replaces the reference's approximated grotesk (spec 02 mandates repository fonts; parity protocol allows "repository-native font metrics"). Consequences: every glyph differs at pixel level; chip pills track wider; deliverable titles start at x ≈ 1302 vs 1327 to keep one line.
2. **Controlled title break** — "Préparer / la demande" cannot fall out of any wrap width in Poppins ("la demande" is wider than "Préparer la"), so the break is data-driven (`titleBreakAfterWord`), copy verbatim.
3. **Dossier material** — folder, clip, pen, paper stack recreated in CSS/DOM. The manifest forbids shipping reference screenshots as production media, and no SPIMAR-owned photography is approved for this slot; House of Yellow media is prohibited (CLAUDE.md).
4. **Document microcopy → neutral bars** — reference shows document interiors ("Intérêt détecté", "L'immobilier marocain à l'international", month scales); none of that text is in the approved content contract, which requires neutral layout bars for unapproved microcopy (spec 03).
5. **Eyebrow contrast** — reference gold #d79e3b on ivory measures 2.03:1; corrected to #8a6420 (4.58:1) per spec 05's contrast rule. Verified by axe: 0 violations on all three phases (`axe-before.json`).
6. **Visual-route path** — `/__visual/*` is impossible in Next.js (underscore-prefixed folders are private); the deterministic route is `/visual-test/method?phase=…`, gated by `SPIMAR_VISUAL_TEST=1` (or dev), `force-dynamic`, `robots: noindex`. Adaptation allowed by the master prompt.

## Commands and results (final state)

| Command | Result |
| --- | --- |
| `pnpm typecheck` | PASS |
| `pnpm lint` | 1 pre-existing error (`SiteHeader.tsx:63`, present in the inherited uncommitted diff; absent at HEAD) + 6 pre-existing warnings. New method files are clean. |
| `pnpm test` (vitest) | 81/81 PASS (includes 9 new content-contract tests) |
| `pnpm build` | PASS (`/[locale]/visual-test/method` is ƒ dynamic) |
| `pnpm playwright test tests/e2e/method-section.spec.ts` | 7/7 PASS (content per phase, geometry lock across phases, tablist keyboard, Phase suivante, homepage order) |
| `pnpm test:e2e` (full) | 40 pass / 4 fail — all 4 in flows untouched by this change set (salons draft leak ×1, editor publish ×1, project-detail inventory ×2); the failing routes belong to the inherited uncommitted work captured in `pre-existing-working-tree.diff`. |
| axe scan (`.methodSection`, all 3 phases) | 0 violations |

Interaction evidence (production build, console error-free): `?methodPhase=` deep link applies; Arrow/Home/End move the tablist with roving tabindex; Phase suivante advances 01→02→03 and is hidden on 03.

## Accessibility summary

Tablist with `aria-selected` / `aria-orientation` / roving tabindex; panel labelled by active tab; statuses are text + icon (never colour-only); connectors and dossier props `aria-hidden`; document panels expose `sr-only` French summaries; section labelled by its heading; 44 px+ touch targets on rail controls; axe clean on obsidian and ivory surfaces.

## Responsive state

Gate 6 (responsive recomposition) is **not started** per the gate order. A stacked fallback exists below 1024 px so intermediate deployments cannot render a broken absolute layout; it is a placeholder, not the contract recomposition.

## Known blockers / notes

- The 4 pre-existing e2e failures above belong to inherited in-progress work (salons/CMS/project routes), out of this gate's scope.
- Branch reconciliation with the inherited working tree is deferred per owner decision 1; the commit for this gate stages only the method system, its dependency closure, the handoff package, and this evidence.
- `CLAUDE.md` execution-boundary staleness recorded at Gate 0 remains for governance cleanup (owner decision 4).

## Verdict

Region-based validation per owner decision 7: macro geometry, region anchors, typography rhythm, deliverable/connector/footer geometry all aligned within measurement tolerance; all residual differences are documented above under allowed categories; production output is semantic, accessible DOM.

**PHASE_01_PARITY=PASS** (region-based criteria; global 0.001 pixel ratio explicitly not claimed)

## Next eligible gate

Gate 3 (Phase 01 correction pass on review feedback) or, if the owner accepts Phase 01 as-is, Gate 4 (Phase 02/03 static states). Not started without authorization.
