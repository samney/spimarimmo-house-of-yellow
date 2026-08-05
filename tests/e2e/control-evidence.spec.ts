import { expect, test, type Page } from "@playwright/test";

/* Evidence capture for SPIMAR Control (blueprint 11 §8).

   Produces the desktop / tablet / mobile screenshots the definition of done
   requires, plus the empty and permission states, and asserts the properties
   the visual rules make non-negotiable: no page-level horizontal overflow at
   any viewport, and a working RTL flip.

   Captures land in qa/control/ and are committed as review evidence. The data
   is whatever the local store holds — fixtures, never presented as production
   truth. */

const ADMIN = { email: "e2e-admin@example.test", password: "e2e-admin-password" };
const EDITOR = { email: "e2e-editor@example.test", password: "e2e-editor-password" };

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 1024, height: 800 },
  mobile: { width: 390, height: 844 },
} as const;

const SCREENS = [
  { key: "overview", path: "/admin", heading: "Vue d’ensemble" },
  { key: "leads", path: "/admin/crm/leads", heading: "Leads" },
  { key: "pipeline", path: "/admin/crm/pipeline", heading: "Pipeline" },
  { key: "pages", path: "/admin/cms/pages", heading: "Pages" },
  { key: "events", path: "/admin/events", heading: "Salons" },
] as const;

async function signIn(page: Page, who: typeof ADMIN) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Mot de passe").fill(who.password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByRole("heading", { name: "Vue d’ensemble" })).toBeVisible();
}

/** The page itself must never scroll sideways; wide content scrolls inside its
    own container instead (blueprint 15 responsive rules). */
async function expectNoPageOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.describe("console evidence", () => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    test(`${name} screens render without page overflow`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await signIn(page, ADMIN);

      for (const screen of SCREENS) {
        await page.goto(screen.path);
        await expect(page.getByRole("heading", { name: screen.heading, level: 1 })).toBeVisible();
        await expectNoPageOverflow(page);
        await page.screenshot({ path: `qa/control/${screen.key}-${name}.png` });
      }
    });
  }
});

test("sign-in gate is captured at desktop and mobile", async ({ page }) => {
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    if (name === "tablet") continue;
    await page.setViewportSize(viewport);
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "SPIMAR Control" })).toBeVisible();
    await expectNoPageOverflow(page);
    await page.screenshot({ path: `qa/control/login-${name}.png` });
  }
});

test("permission state names the missing permission rather than blanking", async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await signIn(page, EDITOR);

  // The editor role holds no settings.manage grant.
  await page.goto("/admin/settings");
  await expect(page.getByText("Accès non autorisé")).toBeVisible();
  await expect(page.getByText("settings.manage")).toBeVisible();
  await page.screenshot({ path: "qa/control/permission-denied-desktop.png" });
});

test("the console lays out correctly under RTL", async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.desktop);
  await signIn(page, ADMIN);
  await page.goto("/admin/crm/leads");

  // Logical properties mean a dir flip is the whole change (ADR-A6).
  await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
  await expect(page.getByRole("heading", { name: "Leads", level: 1 })).toBeVisible();
  await expectNoPageOverflow(page);
  await page.screenshot({ path: "qa/control/leads-rtl-desktop.png" });
});
