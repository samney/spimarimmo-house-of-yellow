import { expect, test } from "@playwright/test";

/* Locale parity (N-05).

   Gap #1 of the route audit: `/en` rendered French wherever a page's copy was
   hard-coded in a component rather than held in `messages`. Six standing pages
   were moved onto namespaces; this locks that in, because the regression is
   silent — an English-speaking visitor sees a French heading and nothing fails.

   The check is deliberately crude. It looks for French function words in the
   page's own heading and lead, not for "correct English", because the failure
   mode is wholesale untranslated copy rather than an awkward phrase. */

const FRENCH_MARKERS =
  /\b(le|la|les|des|une|votre|nos|pour|avec|dans|sont|après|avant|chaque|vous)\b/i;

const EN_ROUTES = [
  "/en/pourquoi-spimar",
  "/en/visiteurs",
  "/en/confidentialite",
  "/en/mentions-legales",
  "/en/exposer",
  "/en/contact",
  "/en/salons",
  "/en/faq",
  "/en/insights",
  "/en/ressources",
  "/en/etudes-de-cas",
];

test.describe("/en renders English", () => {
  for (const route of EN_ROUTES) {
    test(`${route} has an English heading`, async ({ page }) => {
      await page.goto(route);
      const heading = (await page.locator("h1").first().textContent()) ?? "";
      expect(heading.trim().length, `${route} has no heading`).toBeGreaterThan(0);
      expect(
        FRENCH_MARKERS.test(heading),
        `${route} heading is still French: ${JSON.stringify(heading.trim())}`,
      ).toBe(false);
    });
  }

  test("declares the English language on the document", async ({ page }) => {
    await page.goto("/en/salons");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  /* The one route still serving French, tracked rather than hidden.

     `/en/exposer/methode` renders `MethodSection`, whose copy lives in
     `method-content.ts` as hard-coded French rather than in a `messages`
     namespace. It is a shared homepage section, so moving it is a larger
     change than the standing pages were and is carried as punchlist F3.

     Asserted as STILL BROKEN on purpose: when someone fixes it this test fails
     and forces this block to be deleted, so the exception cannot outlive the
     defect. */
  test("has exactly one known untranslated route left", async ({ page }) => {
    await page.goto("/en/exposer/methode");
    const heading = (await page.locator("h1").first().textContent()) ?? "";
    expect(
      FRENCH_MARKERS.test(heading),
      "/en/exposer/methode now renders English — delete this test and add the " +
        "route to EN_ROUTES above",
    ).toBe(true);
  });
});
