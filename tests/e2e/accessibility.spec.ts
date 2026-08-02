import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/* Automated accessibility gate.
   `.claude/rules/testing-and-validation.md` requires "Automated Axe checks per
   route". `@axe-core/playwright` has been a devDependency since ENG-014, but no
   assertion ever used it, so the rule had no enforcement.

   TRF-006 re-homed the horizontal-overflow assertions lost when TRF-004 deleted
   the works/project-detail specs, but not the accessibility ones — and then
   introduced a serious contrast violation on the 404 (`opacity: 0.6` on the
   eyebrow, 4.21:1 against the 4.5:1 AA minimum) that shipped precisely because
   nothing checked. This spec closes that gap.

   Extend ROUTES as TRF-025 scaffolds the SPIMAR route families. */
const ROUTES = [
  "/",
  "/fr",
  "/salons",
  "/exposer",
  "/contact",
  "/cookies",
  "/this-route-does-not-exist",
];

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const route of ROUTES) {
  test(`${route} has no automated accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    // Report every violation, with the offending nodes, rather than just a count.
    const detail = results.violations
      .map(
        (v) =>
          `${v.id} (${v.impact}): ${v.help}\n` +
          v.nodes.map((n) => `    ${n.target.join(" ")} — ${n.failureSummary}`).join("\n"),
      )
      .join("\n");

    expect(detail, `${route} axe violations:\n${detail}`).toBe("");
  });
}

/* The 404 boundary is checked at a narrow viewport too: it renders its own
   <html> outside the locale shell, so it does not inherit the public layout and
   is the surface most likely to drift unnoticed. */
test("404 boundary is accessible at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/this-route-does-not-exist");
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => `${v.id}:${v.impact}`)).toEqual([]);
});
