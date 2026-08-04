import { expect, test } from "@playwright/test";

/* Section 03 — "Pourquoi exposer avec SPIMARIMMO ?"
   (SPIMARIMMO_WHY_EXHIBIT_IMPLEMENTATION_HANDOFF_v1).

   Deterministic four-state assertions on the /visual-test/why-exhibit harness:
   approved copy per benefit, one shared component tree, a phone that never
   moves between tabs, accessible tablist behaviour, deep linking, and the
   mobile reading order without page-level horizontal overflow. */

const GOLDEN = { width: 1536, height: 1024 };

const BENEFITS = [
  {
    id: "qualified",
    number: "01",
    tab: "Clientèle qualifiée",
    title: "Une clientèle qualifiée",
    cta: "Voir la méthode de qualification",
    href: "/exposer/methode",
    proof: "De la pré-inscription au rendez-vous qualifié.",
    card: "Formulaire",
  },
  {
    id: "international",
    number: "02",
    tab: "Présence internationale",
    title: "Une présence internationale",
    cta: "Explorer les salons par pays",
    href: "/salons",
    proof: "Du Maroc vers les marchés MRE prioritaires.",
    card: "Royaume-Uni",
  },
  {
    id: "campaigns",
    number: "03",
    tab: "Campagnes massives",
    title: "Des campagnes massives",
    cta: "Voir l’étude de cas",
    href: "/etudes-de-cas",
    proof: "Du plan média aux créations diffusées.",
    card: "Emailing",
  },
  {
    id: "support",
    number: "04",
    tab: "Accompagnement complet",
    title: "Un accompagnement complet",
    cta: "Voir les livrables inclus",
    href: "/exposer/offres",
    proof: "De la préparation au suivi post-salon.",
    card: "Rapport de suivi",
  },
] as const;

test.describe("Pourquoi exposer — four-state benefit system", () => {
  test.use({ viewport: GOLDEN });

  for (const benefit of BENEFITS) {
    test(`${benefit.number} renders its approved copy and evidence`, async ({ page }) => {
      await page.goto(`/visual-test/why-exhibit?benefit=${benefit.id}`);

      await expect(page.locator(".whyExhibit")).toHaveAttribute("data-benefit", benefit.id);
      await expect(page.getByRole("heading", { level: 3 })).toHaveText(benefit.title);
      await expect(page.locator(".whyCopy__number")).toHaveText(benefit.number);
      await expect(page.locator(".whyProof")).toContainText(benefit.proof);

      const cta = page.locator(".whyCopy__cta");
      await expect(cta).toContainText(benefit.cta);
      /* Locale prefixing is the router's business; what this pins is that the
         CTA points at the real shipped route and not at an invented one. */
      await expect(cta).toHaveAttribute("href", new RegExp(`${benefit.href}$`));

      /* One shared tree: five evidence slots, always. */
      await expect(page.locator(".whyCard")).toHaveCount(5);
      await expect(page.getByRole("heading", { level: 4, name: benefit.card })).toBeVisible();
    });
  }

  test("the phone shell holds the same box in every state", async ({ page }) => {
    const boxes = [];
    for (const benefit of BENEFITS) {
      await page.goto(`/visual-test/why-exhibit?benefit=${benefit.id}`);
      boxes.push(await page.locator(".whyPhone__frame").boundingBox());
    }
    for (const box of boxes.slice(1)) {
      expect(box?.x).toBeCloseTo(boxes[0]!.x, 0);
      expect(box?.y).toBeCloseTo(boxes[0]!.y, 0);
      expect(box?.width).toBeCloseTo(boxes[0]!.width, 0);
      expect(box?.height).toBeCloseTo(boxes[0]!.height, 0);
    }
  });

  test("the tablist carries correct ARIA state and roving tabindex", async ({ page }) => {
    await page.goto("/visual-test/why-exhibit?benefit=qualified");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("tabindex", "0");
    await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");

    const panelId = await tabs.nth(0).getAttribute("aria-controls");
    const panel = page.getByRole("tabpanel");
    await expect(panel).toHaveAttribute("id", panelId!);
    await expect(panel).toHaveAttribute("aria-labelledby", (await tabs.nth(0).getAttribute("id"))!);
  });

  test("arrow, Home and End move the selection", async ({ page }) => {
    await page.goto("/visual-test/why-exhibit?benefit=qualified");
    const section = page.locator(".whyExhibit");
    await page.getByRole("tab").first().focus();

    await page.keyboard.press("ArrowRight");
    await expect(section).toHaveAttribute("data-benefit", "international");
    await page.keyboard.press("End");
    await expect(section).toHaveAttribute("data-benefit", "support");
    await page.keyboard.press("Home");
    await expect(section).toHaveAttribute("data-benefit", "qualified");
    await page.keyboard.press("ArrowLeft");
    await expect(section).toHaveAttribute("data-benefit", "support");
  });

  /* Query state is a live-page behaviour, so it is exercised on the real
     homepage: the visual-test harness deliberately pins one static frame. */
  test("selecting a tab writes the query without reloading", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      (window as unknown as { __kept: boolean }).__kept = true;
    });

    await page.getByRole("tab", { name: /Campagnes massives/ }).click();
    await expect(page.locator(".whyExhibit")).toHaveAttribute("data-benefit", "campaigns");
    await expect(page).toHaveURL(/benefit=campaigns/);
    /* A navigation would have discarded this marker. */
    expect(await page.evaluate(() => (window as unknown as { __kept?: boolean }).__kept)).toBe(
      true,
    );

    await page.goBack();
    await expect(page.locator(".whyExhibit")).toHaveAttribute("data-benefit", "qualified");
  });

  test("a deep link restores the right tab", async ({ page }) => {
    await page.goto("/?benefit=support");
    await expect(page.locator(".whyExhibit")).toHaveAttribute("data-benefit", "support");
    await expect(page.getByRole("tab", { name: /Accompagnement complet/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("the section mounts on the homepage before the method section", async ({ page }) => {
    await page.goto("/");
    const order = await page.evaluate(() => {
      const why = document.querySelector(".whyExhibit");
      const method = document.querySelector(".methodSection");
      if (!why || !method) return "missing";
      return why.compareDocumentPosition(method) & Node.DOCUMENT_POSITION_FOLLOWING
        ? "after"
        : "before";
    });
    expect(order).toBe("after");
  });
});

test.describe("Pourquoi exposer — mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("reads in one column with no page-level horizontal overflow", async ({ page }) => {
    await page.goto("/visual-test/why-exhibit?benefit=support");
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      win: window.innerWidth,
    }));
    expect(overflow.doc).toBeLessThanOrEqual(overflow.win);

    /* Reading order: copy, then the phone, then the evidence carousel. */
    const copy = await page.locator(".whyCopy").boundingBox();
    const phone = await page.locator(".whyPhone").boundingBox();
    const cards = await page.locator(".whyCanvas__cards").boundingBox();
    const proof = await page.locator(".whyProof").boundingBox();
    expect(copy!.y).toBeLessThan(phone!.y);
    expect(phone!.y).toBeLessThan(cards!.y);
    expect(cards!.y).toBeLessThan(proof!.y);

    /* Decorative desktop connectors are removed, not rescaled. */
    await expect(page.locator(".whyConnectors")).toBeHidden();

    for (const tab of await page.getByRole("tab").all()) {
      const box = await tab.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }
  });
});
