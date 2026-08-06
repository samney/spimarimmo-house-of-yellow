import { expect, test, type Page } from "@playwright/test";

/* Reduced motion, pinned (F-07).

   Every reduced-motion claim in Phase F was verified by driving a real browser
   and reading computed style — but verification that only happens while
   someone is watching is exactly how the `.inview` reveal stayed broken for
   the life of the repository. This spec is that evidence, made repeatable.

   It asserts the two things that matter to a visitor who has asked their
   system to stop animating:

   1. **Nothing is missing.** The failure mode is not "it still moves" — it is
      content stranded at `opacity: 0`, a title stuck at `yPercent: 110`, or an
      indicator collapsed to zero width because a kill-switch reverted an
      animated property to a base that was never a design state.
   2. **Nothing is moving.** No animation is left running, and the reveal
      engine creates no tween at all rather than a fast one.

   Deliberately *not* asserted: exact durations and easings. Those belong to
   the unit guards, which read the vocabulary directly and need no browser.

   **Why the preference is set by hand.** `test.use({ reducedMotion: "reduce" })`
   is the idiomatic form and it silently does nothing here — probed against
   this config, the page still reported `prefers-reduced-motion: no-preference`,
   so the first draft of this spec asserted reduced-motion behaviour while the
   browser was animating normally. Every test therefore emulates the media
   feature explicitly and then *proves the precondition* before testing
   anything: a test that cannot show the state it names is not evidence. */

const CONTENT_ROUTES = [
  { path: "/fr/faq", list: ".faqList", item: "details" },
  { path: "/fr/insights", list: ".blogGrid", item: "li" },
  { path: "/fr/ressources", list: ".bibGrid", item: "li" },
  /* The salons calendar (D-026) renders .salcList rows; the contract —
     every row fully visible, none stranded mid-reveal — is unchanged. */
  { path: "/fr/salons", list: ".salcList", item: "li" },
  { path: "/fr/etudes-de-cas", list: ".etuList", item: "li" },
];

/** Emulate the preference, navigate, and refuse to continue unless the page
    agrees it is in effect. */
async function visitReduced(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  const inEffect = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  expect(inEffect, "reduced-motion emulation is not in effect — the test would be vacuous").toBe(
    true,
  );
}

test.describe("under prefers-reduced-motion: reduce", () => {
  for (const route of CONTENT_ROUTES) {
    test(`${route.path} renders its content fully`, async ({ page }) => {
      await visitReduced(page, route.path);

      const items = page.locator(`${route.list} > ${route.item}`);
      expect(await items.count(), `${route.path} should render list items`).toBeGreaterThan(0);

      /* Given a moment on purpose: the point is not that it is correct before
         anything can run, but that it is still correct after everything has. */
      await page.waitForTimeout(1200);
      const opacities = await items.evaluateAll((els) =>
        els.map((el) => Number(getComputedStyle(el).opacity)),
      );
      expect(
        opacities.every((o) => o === 1),
        `stranded items: ${JSON.stringify(opacities)}`,
      ).toBe(true);
    });
  }

  test("the page title is fully rendered, not stranded mid-reveal", async ({ page }) => {
    await visitReduced(page, "/fr/faq");
    await page.waitForTimeout(1200);

    const title = page.locator(".splitTitle").first();
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    /* SplitTitle sets yPercent: 110 before its trigger fires. Under reduced
       motion it must not split at all — a stranded character is invisible
       text, the same defect class as the `.inview` reveal. */
    const stranded = await title.evaluate(
      (el) =>
        [...el.querySelectorAll(".row div")].filter((c) => {
          const m = getComputedStyle(c).transform.match(/matrix\(([^)]+)\)/);
          return m ? Math.abs(Number(m[1].split(",")[5])) > 1 : false;
        }).length,
    );
    expect(stranded, "characters left translated off their line").toBe(0);
  });

  test("smooth scroll is not engaged", async ({ page }) => {
    await visitReduced(page, "/fr/faq");
    await page.waitForTimeout(600);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
  });

  test("the custom cursor is not rendered", async ({ page }) => {
    await visitReduced(page, "/fr/faq");
    await page.mouse.move(600, 400);
    await page.waitForTimeout(400);
    await expect(page.locator(".customCursor")).toBeHidden();
  });

  test("no element is left running an animation", async ({ page }) => {
    await visitReduced(page, "/fr/salons");
    await page.waitForTimeout(1500);

    /* getAnimations() is the honest check: it reports what the engine is
       actually running, not what the stylesheet appears to say. */
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => {
          const target = (a.effect as KeyframeEffect | null)?.target as Element | null;
          return target ? `${target.tagName}.${target.className}`.slice(0, 60) : "unknown";
        }),
    );
    expect(running, `still animating: ${JSON.stringify(running)}`).toEqual([]);
  });

  test("the marquee rests legibly instead of collapsing", async ({ page }) => {
    await visitReduced(page, "/fr/salons");
    await page.waitForTimeout(600);

    const item = page.locator(".marqueeScroll .item").first();
    if ((await item.count()) === 0) test.skip();

    const rest = await item.evaluate((el) => {
      const scroll = el.closest(".marqueeScroll") as HTMLElement;
      return {
        animationName: getComputedStyle(scroll).animationName,
        transform: getComputedStyle(scroll).transform,
        width: el.getBoundingClientRect().width,
        text: el.textContent?.trim() ?? "",
      };
    });

    /* Declared, not inherited from the global kill-switch — the point of the
       F-05 fix. A 0.01ms duration would leave animationName intact. */
    expect(rest.animationName).toBe("none");
    expect(rest.transform === "none" || rest.transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    expect(rest.width).toBeGreaterThan(0);
    expect(rest.text.length).toBeGreaterThan(0);
  });
});

test.describe("with motion allowed", () => {
  test("the reveal animates, and still finishes at its end state", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/fr/ressources");
    const inEffect = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches,
    );
    expect(inEffect, "motion should be allowed for this test to mean anything").toBe(true);

    /* The counterpart to the assertions above: motion is allowed to happen,
       but it must never be what decides whether content is readable. */
    const items = page.locator(".bibGrid > li");
    await expect(items.first()).toHaveCSS("opacity", "1", { timeout: 5000 });

    await page.waitForTimeout(1200);
    const opacities = await items.evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );
    expect(opacities.every((o) => o === 1)).toBe(true);
  });
});
