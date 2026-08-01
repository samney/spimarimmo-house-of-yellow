import { expect, test, type Page } from "@playwright/test";

/* Every fresh context shows the consent banner, which docks over the same
   bottom region as the filter UI; answer it the way a visitor would. */
async function openWorks(page: Page) {
  await page.goto("/made-by-yellow");
  const consent = page.locator(".cmplz-cookiebanner");
  await consent.getByRole("button", { name: "Deny" }).click();
  await expect(consent).toBeHidden();
}

test.describe("Made by Yellow state convergence", () => {
  test("opens as the 21-project HOY constellation", async ({ page }) => {
    await openWorks(page);

    const overview = page.locator(".projectsOverviewBlock");
    const grid = page.getByTestId("works-grid");

    await expect(overview).toHaveAttribute("data-view", "grid");
    await expect(page.getByTestId("works-letterform")).toBeVisible();
    await expect(grid).toHaveAttribute("data-project-count", "21");
    await expect(grid.locator(".project")).toHaveCount(21);

    for (let index = 0; index < 6; index += 1) {
      await expect(grid.locator(".project").nth(index)).toHaveAttribute(
        "data-layout-slot",
        String(index + 1),
      );
    }
  });

  test("filters, resets, and closes the overlay from the keyboard", async ({ page }) => {
    await openWorks(page);

    await page.getByRole("button", { name: /filter works/i }).click();
    const dialog = page.getByRole("dialog", { name: "Filter works" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Artists" }).click();
    await expect(page.getByTestId("works-grid")).toHaveAttribute("data-project-count", "2");
    await expect(page.locator(".projectsOverviewBlock")).toHaveAttribute(
      "data-active-filter-count",
      "1",
    );

    await dialog.getByRole("button", { name: /reset filters/i }).click();
    await expect(page.getByTestId("works-grid")).toHaveAttribute("data-project-count", "21");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /filter works/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("switches between grid and list without duplicating the active tab order", async ({
    page,
  }) => {
    await openWorks(page);

    await page.getByRole("button", { name: "List" }).click();
    await expect(page.locator(".projectsOverviewBlock")).toHaveAttribute("data-view", "list");
    await expect(page.getByTestId("works-grid")).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByTestId("works-list")).toHaveAttribute("aria-hidden", "false");
    await expect(page.getByTestId("works-list").locator(".projectList")).toHaveCount(21);

    await page.getByRole("button", { name: "Grid" }).click();
    await expect(page.locator(".projectsOverviewBlock")).toHaveAttribute("data-view", "grid");
    await expect(page.getByTestId("works-grid")).toHaveAttribute("aria-hidden", "false");
  });

  test("keeps the mobile composition inside the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openWorks(page);

    await expect(page.getByTestId("works-grid").locator(".project").first()).toBeVisible();
    await expect(page.locator(".filterWrapper")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
