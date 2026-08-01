import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

type Detail = {
  slug: string;
  title: string;
  stats: { label: string; value: string }[];
  relatedNext: string;
  blocks: { cls: string }[];
};

const DETAILS = JSON.parse(readFileSync("lib/content/project-details.json", "utf8")) as Detail[];
const bySlug = (slug: string) => DETAILS.find((detail) => detail.slug === slug)!;

async function openProject(page: Page, slug: string, locale = "") {
  await page.goto(`${locale}/project/${slug}`);
  const consent = page.locator(".cmplz-cookiebanner");
  const deny = consent.getByRole("button", { name: "Deny" });
  if (await deny.isVisible().catch(() => false)) {
    await deny.click();
    await expect(consent).toBeHidden();
  }
}

const blockSequence = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".projectDetail .innerBlocks > section")].map((section) =>
      section.className.trim(),
    ),
  );

test.describe("project-detail route inventory", () => {
  test("every default-locale project route renders its audited block sequence", async ({
    request,
  }) => {
    for (const detail of DETAILS) {
      const response = await request.get(`/project/${detail.slug}`, { maxRedirects: 0 });
      expect(response.status(), detail.slug).toBe(200);

      const body = await response.text();
      expect(body, `${detail.slug} requested an undeliverable video`).not.toContain("/videos/");

      const rendered = [...body.matchAll(/<section class="([^"]*(?:Block)[^"]*)"/g)].map(
        (match) => match[1],
      );
      expect(rendered, detail.slug).toEqual(detail.blocks.map((block) => block.cls));
    }
  });

  test("every French-prefixed project route renders", async ({ request }) => {
    for (const detail of DETAILS) {
      const response = await request.get(`/fr/project/${detail.slug}`, { maxRedirects: 0 });
      expect(response.status(), detail.slug).toBe(200);
      expect(await response.text()).not.toContain("/videos/");
    }
  });

  test("an unknown project slug returns the localized 404", async ({ request }) => {
    for (const route of ["/project/not-a-project", "/fr/project/not-a-project"]) {
      const response = await request.get(route, { maxRedirects: 0 });
      expect(response.status(), route).toBe(404);
    }
  });
});

test.describe("route-specific block contracts", () => {
  test("Oceanco keeps both optional variants", async ({ page }) => {
    await openProject(page, "oceanco-leviathan");
    expect(await blockSequence(page)).toEqual(bySlug("oceanco-leviathan").blocks.map((b) => b.cls));
    await expect(page.locator(".projectTwoImagesBlock.sqaures")).toHaveCount(1);
    await expect(page.locator(".projectFullWidthLoopBlock")).toHaveCount(1);
  });

  test("Broederliefde keeps the squares variant without the full-width loop", async ({ page }) => {
    await openProject(page, "broederliefde-rotterdam-ahoy");
    await expect(page.locator(".projectTwoImagesBlock.sqaures")).toHaveCount(1);
    await expect(page.locator(".projectFullWidthLoopBlock")).toHaveCount(0);
  });

  test("Salvia keeps the full-width loop without the squares variant", async ({ page }) => {
    await openProject(page, "salvia-bioelectronics");
    await expect(page.locator(".projectTwoImagesBlock.sqaures")).toHaveCount(0);
    await expect(page.locator(".projectFullWidthLoopBlock")).toHaveCount(1);
  });

  test("Ansu Fati drops both optional variants and keeps five metrics", async ({ page }) => {
    await openProject(page, "ansu-fati-arriba-nutrition");
    await expect(page.locator(".projectTwoImagesBlock.sqaures")).toHaveCount(0);
    await expect(page.locator(".projectFullWidthLoopBlock")).toHaveCount(0);
    await expect(page.locator(".projectStatsBlock .stat")).toHaveCount(5);
    await expect(page.locator(".projectStatsBlock .stat .statLabel").nth(2)).toHaveText(
      "Products sold",
    );
  });
});

test.describe("statistics", () => {
  test("renders each route's audited metric labels, values and order", async ({ page }) => {
    for (const slug of [
      "oceanco-leviathan",
      "madunia-brand-launch",
      "ansu-fati-arriba-nutrition",
      "de-hollandse-100-lymphco",
    ]) {
      await openProject(page, slug);
      const stats = bySlug(slug).stats;
      await expect(page.locator(".projectStatsBlock .stat")).toHaveCount(stats.length);
      await expect(page.locator(".projectStatsBlock .stat .statLabel")).toHaveText(
        stats.map((stat) => stat.label),
      );
      await expect(page.locator(".projectStatsBlock .stat .statValue")).toHaveText(
        stats.map((stat) => stat.value),
      );
    }
  });

  test("shows no metadata label the reference does not use", async ({ page }) => {
    await openProject(page, "oceanco-leviathan");
    const header = page.locator(".headerProjectBlock");
    await expect(header.locator(".infoTag")).toHaveText([
      "'26",
      "Luxury & yachting",
      "Corporate, Commercials",
    ]);
    await expect(header).not.toContainText("Year");
    await expect(header).not.toContainText("Sector");
    await expect(header).not.toContainText("Services");
  });
});

test.describe("hero and media surfaces", () => {
  test("the hero stays poster-only and issues no video request", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/videos/")) videoRequests.push(request.url());
    });

    await openProject(page, "oceanco-leviathan");
    const hero = page.locator(".headerProjectBlock .imageWrapper");
    await expect(hero).toHaveAttribute("data-media-state", "unavailable");
    await expect(hero.locator("picture img")).toBeVisible();
    await expect(page.locator(".projectDetail video")).toHaveCount(0);
    expect(videoRequests).toEqual([]);
  });

  test("the image-only hero route renders its poster plane", async ({ page }) => {
    await openProject(page, "porsche-employer-branding");
    const hero = page.locator(".headerProjectBlock .imageWrapper");
    await expect(hero).toHaveAttribute("data-media-state", "unavailable");
    await expect(hero).toHaveClass(/is-wide/);
    await expect(hero.locator("picture img")).toBeVisible();
  });

  test("media pairs keep their audited surface count and slot geometry", async ({ page }) => {
    await openProject(page, "oceanco-leviathan");

    const pair = page.locator(".projectTwoImagesBlock:not(.text):not(.sqaures) .imageWrapper");
    await expect(pair).toHaveCount(2);
    await expect(pair.nth(0)).toHaveClass(/is-landscape/);
    await expect(pair.nth(1)).toHaveClass(/is-portrait/);

    const squares = page.locator(".projectTwoImagesBlock.sqaures .imageWrapper");
    await expect(squares).toHaveCount(2);
    await expect(squares.nth(0)).toHaveClass(/is-square/);
    await expect(squares.nth(1)).toHaveClass(/is-square/);

    await expect(page.locator(".projectFullWidthLoopBlock .imageWrapper")).toHaveClass(/is-wide/);
  });
});

test.describe("related project", () => {
  test("links to the audited next project", async ({ page }) => {
    for (const slug of ["oceanco-leviathan", "hotek-brand-video", "madunia-brand-launch"]) {
      await openProject(page, slug);
      const link = page.locator(".projectRelatedBlock .relatedProjectItem");
      await expect(link).toHaveAttribute("href", `/project/${bySlug(slug).relatedNext}`);
      await expect(link.locator(".relatedTitle")).toHaveText(
        bySlug(bySlug(slug).relatedNext).title,
      );
    }
  });

  test("wraps the final route back to the first project", async ({ page }) => {
    await openProject(page, "madunia-brand-launch");
    await page.locator(".projectRelatedBlock .relatedProjectItem").click();
    await expect(page).toHaveURL(/\/project\/oceanco-leviathan$/);
    await expect(page.locator(".headerProjectBlock h1")).toHaveText("Oceanco – Leviathan");
  });
});

test.describe("layout", () => {
  test("desktop composition orders the hero after the header copy", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openProject(page, "oceanco-leviathan");

    const geometry = await page.evaluate(() => {
      const top = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        return Math.round(element.getBoundingClientRect().top + window.scrollY);
      };
      return {
        title: top(".headerProjectBlock .projectTitle"),
        summary: top(".headerProjectBlock .projectSummary"),
        infoTags: top(".headerProjectBlock .infoTags"),
        hero: top(".headerProjectBlock .imageWrapper"),
        stats: top(".projectStatsBlock .stats"),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(geometry.title!).toBeLessThan(geometry.summary!);
    expect(geometry.summary!).toBeLessThan(geometry.infoTags!);
    expect(geometry.infoTags!).toBeLessThan(geometry.hero!);
    expect(geometry.hero!).toBeLessThan(geometry.stats!);
    /* The reference places the hero well below the fold-opening copy; the
       pre-ENG-014C template started it around 220px too early. */
    expect(geometry.hero!).toBeGreaterThan(500);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
  });

  test("mobile composition stacks without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openProject(page, "oceanco-leviathan");

    await expect(page.locator(".headerProjectBlock .imageWrapper")).toBeVisible();
    await expect(page.locator(".projectStatsBlock .stat")).toHaveCount(4);
    await expect(page.locator(".headerProjectBlock .infoTags")).toBeHidden();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
