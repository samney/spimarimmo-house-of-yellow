import { expect, test } from "@playwright/test";

/* Section 04 — "Notre méthode" (SPIMARIMMO_NOTRE_METHODE_CLAUDE_HANDOFF_v1).

   Deterministic three-state assertions on the /visual-test/method harness:
   approved copy per phase, one shared component tree, locked stage geometry
   across phases, accessible tablist behavior. Pixel-level parity evidence is
   produced by qa/method-parity/{capture,compare}.mjs per the region-based
   validation decision — a single global screenshot threshold is not the gate. */

const GOLDEN = { width: 1536, height: 1024 };

/* The central dossier is one supplied editorial WebP per phase with an
   sr-only summary (MethodDossierFigure) — the earlier drawn document layers
   and their .methodDoc__label captions no longer exist. The spec asserts the
   shipped contract: the phase's plate serves and its summary is exposed. */
const PHASES = [
  {
    phase: "before",
    title: "Préparer la demande",
    chip: "Campagnes digitales",
    dossierSrc: "01-avant-dossier",
    deliverablesHeading: "LIVRABLES AVANT",
    deliverable: "Profils qualifiés",
    annotation: "Tout est visible avant l’ouverture du salon.",
    cta: "Voir la préparation",
  },
  {
    phase: "during",
    title: "Activer les rencontres",
    chip: "Captation des leads",
    dossierSrc: "02-pendant-dossier",
    deliverablesHeading: "LIVRABLES PENDANT",
    deliverable: "Leads captés",
    annotation: "Chaque interaction est structurée pendant le salon.",
    cta: "Voir le dispositif salon",
  },
  {
    phase: "after",
    title: "Transformer et suivre",
    chip: "Analyse des performances",
    dossierSrc: "03-apres-dossier",
    deliverablesHeading: "LIVRABLES APRÈS",
    deliverable: "Base transmise",
    annotation: "La valeur du salon continue après sa fermeture.",
    cta: "Voir le processus de suivi",
  },
] as const;

test.describe("method section — three-state contract", () => {
  test.use({ viewport: GOLDEN });

  for (const c of PHASES) {
    test(`renders approved ${c.phase} content deterministically`, async ({ page }) => {
      await page.goto(`/visual-test/method?phase=${c.phase}`);
      await page.evaluate(() => document.fonts.ready);

      const section = page.locator(".methodSection");
      await expect(section).toHaveAttribute("data-method-phase", c.phase);
      await expect(page.locator(".methodCopy__title")).toHaveText(c.title);
      await expect(page.locator(".methodCopy__chip", { hasText: c.chip })).toBeVisible();
      // All three plates stay mounted for the crossfade; the active one is
      // the phase's own artwork and the caption announces it.
      const scene = page.locator('.methodDossier__scene[data-active="true"]');
      await expect(scene).toHaveAttribute("src", new RegExp(c.dossierSrc));
      await expect(page.locator(".methodDossier figcaption")).toContainText(/Dossier exposant/);
      await expect(page.locator(".methodDeliverables__heading")).toHaveText(c.deliverablesHeading);
      await expect(page.locator(".methodCard__title", { hasText: c.deliverable })).toBeVisible();
      await expect(page.locator(".methodDeliverables__annotation")).toHaveText(c.annotation);
      await expect(page.locator(".methodCopy__cta")).toContainText(c.cta);
      await expect(page.locator(".methodCard")).toHaveCount(4);
    });
  }

  test("locks stage geometry across all three phases", async ({ page }) => {
    const boxes: Record<string, unknown>[] = [];
    for (const c of PHASES) {
      await page.goto(`/visual-test/method?phase=${c.phase}`);
      await page.evaluate(() => document.fonts.ready);
      boxes.push(
        await page.evaluate(() => {
          const rect = (sel: string) => {
            const b = document.querySelector(sel)!.getBoundingClientRect();
            // Whole pixels: the lock is against layout jumps between phases,
            // not against sub-pixel text-rendering variance.
            return {
              x: Math.round(b.x),
              y: Math.round(b.y),
              w: Math.round(b.width),
              h: Math.round(b.height),
            };
          };
          const pos = (sel: string) => {
            const { x, y, w } = rect(sel);
            return { x, y, w };
          };
          return {
            stage: rect(".methodStage"),
            rail: rect(".methodRail"),
            copy: rect(".methodCopy"),
            /* The dossier BOX is the invariant; the active plate inside it
               carries a deliberate settle transform, so it is not measured. */
            dossier: rect(".methodDossier"),
            /* Absolutely positioned rail: its anchor is locked, its height is
               its own per-phase content and moves nothing else. */
            deliverables: pos(".methodDeliverables"),
            journey: rect(".methodJourney"),
          };
        }),
      );
    }
    expect(boxes[1]).toEqual(boxes[0]);
    expect(boxes[2]).toEqual(boxes[0]);
  });

  test("phase rail is an accessible tablist with full keyboard support", async ({ page }) => {
    await page.goto("/visual-test/method?phase=before");
    const rail = page.locator(".methodRail");
    await expect(rail).toHaveRole("tablist");
    await expect(page.locator("#method-tab-before")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#method-tab-during")).toHaveAttribute("tabindex", "-1");

    await page.locator("#method-tab-before").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator(".methodSection")).toHaveAttribute("data-method-phase", "during");
    await page.keyboard.press("End");
    await expect(page.locator(".methodSection")).toHaveAttribute("data-method-phase", "after");
    await page.keyboard.press("Home");
    await expect(page.locator(".methodSection")).toHaveAttribute("data-method-phase", "before");
  });

  test("Phase suivante advances and disappears on the final phase", async ({ page }) => {
    await page.goto("/visual-test/method?phase=before");
    await page.locator(".methodJourney__next").click();
    await expect(page.locator(".methodSection")).toHaveAttribute("data-method-phase", "during");
    await page.locator(".methodJourney__next").click();
    await expect(page.locator(".methodSection")).toHaveAttribute("data-method-phase", "after");
    await expect(page.locator(".methodJourney__next")).toHaveCount(0);
  });

  test("homepage mounts the section after the pillars section", async ({ page }) => {
    await page.goto("/");
    const order = await page.evaluate(() => {
      const services = document.querySelector(".servicesBlock");
      const method = document.querySelector(".methodSection");
      if (!services || !method) return "missing";
      return services.compareDocumentPosition(method) & Node.DOCUMENT_POSITION_FOLLOWING
        ? "after"
        : "before";
    });
    expect(order).toBe("after");
  });
});
