# 01 — Visual Parity Protocol

## Golden references

```text
references/generated/notre-methode-01-avant.png
references/generated/notre-methode-02-pendant.png
references/generated/notre-methode-03-apres.png
```

All are `1536 × 1024`.

## Deterministic capture requirements

- fixed browser version;
- fixed operating environment in CI;
- fixed viewport;
- deterministic phase query;
- fonts fully loaded;
- images fully decoded;
- animations disabled or advanced to a known stable frame;
- cookie banners and unrelated overlays disabled in the test harness;
- no time-dependent content;
- no random media selection.

## Suggested Playwright pattern

Adapt the URL and test helpers to the repository.

```ts
import { expect, test } from "@playwright/test";

const cases = [
  ["before", "notre-methode-01-avant.png"],
  ["during", "notre-methode-02-pendant.png"],
  ["after", "notre-methode-03-apres.png"],
] as const;

for (const [phase, screenshot] of cases) {
  test(`method section — ${phase}`, async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 1024 });
    await page.goto(`/__visual/method?phase=${phase}`);
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot(screenshot, {
      animations: "disabled",
      fullPage: true,
      maxDiffPixelRatio: 0.001,
    });
  });
}
```

If the reference is a cropped section rather than a full page, capture the section locator instead of the full page.

## Development overlay

Provide a development-only reference overlay toggle.

```css
.visualReferenceOverlay {
  position: fixed;
  inset: 0;
  width: 1536px;
  height: 1024px;
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 9999;
}
```

The overlay must never be included in production output.

## Correction order

Never correct micro-details before macro geometry.

1. Section/canvas bounds
2. Introduction height
3. Stage bounds and radius
4. Primary grid columns
5. Phase rail
6. Dossier anchor and size
7. Deliverable stack
8. Footer progress rail
9. Typography and wrapping
10. Document-layer positions
11. Connectors
12. Shadows, grain and micro-spacing

## Regional diff review

Break the section into regions:

- introduction;
- phase rail;
- phase copy;
- dossier;
- deliverables;
- footer progress.

Record the largest errors per region. A single full-image percentage is not enough to diagnose drift.

## Font-rendering caveat

Cross-platform font antialiasing can produce pixel differences. Use one fixed CI environment for the parity gate. Do not loosen the threshold globally to hide layout errors.

## Allowed intentional differences

Only differences required by:

- accessibility contrast;
- real approved content replacing neutral placeholders;
- browser rendering limitations;
- repository-native font metrics when the reference used an approximation.

Every intentional difference must be documented with a reason and screenshot.

## Phase 01 gate

Phase 01 is approved only when:

- macro geometry is aligned;
- typography and line breaks are aligned;
- dossier footprint and documents are aligned;
- deliverables and connectors are aligned;
- no material unreviewed diff remains;
- production uses real DOM and accessible controls.

