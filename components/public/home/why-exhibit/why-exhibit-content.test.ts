import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WHY_EXHIBIT_CONTENT } from "./why-exhibit-content";
import { BENEFIT_IDS, isBenefitId, type EvidenceSlot } from "./why-exhibit-types";

/* The four-state content contract. These tests pin the approved copy from the
   SPIMARIMMO_WHY_EXHIBIT references — a paraphrase is a failure, not a
   variation — and guard the rules the section must never break: real CTA
   routes, no invented figures, every mapped asset present in the repository. */

const REPOSITORY_ROOT = join(import.meta.dirname, "..", "..", "..", "..");

/* Real shipped routes only; the section may never invent a destination. */
const REAL_ROUTES = new Set(["/exposer/methode", "/salons", "/etudes-de-cas", "/exposer/offres"]);

const REQUIRED_SLOTS: EvidenceSlot[] = [
  "leftTop",
  "leftBottom",
  "rightTop",
  "rightBottom",
  "rightOuter",
];

describe("why-exhibit content contract", () => {
  it("carries the shared header verbatim", () => {
    expect(WHY_EXHIBIT_CONTENT.eyebrowIndex).toBe("03");
    expect(WHY_EXHIBIT_CONTENT.heading).toBe("Pourquoi exposer avec SPIMARIMMO ?");
    expect(WHY_EXHIBIT_CONTENT.subtitle).toBe(
      "Quatre piliers de réponse, soutenus par des preuves concrètes.",
    );
  });

  it("has exactly four benefits with fixed ids and numbers", () => {
    expect(WHY_EXHIBIT_CONTENT.benefits.map((b) => b.id)).toEqual([...BENEFIT_IDS]);
    expect(WHY_EXHIBIT_CONTENT.benefits.map((b) => b.number)).toEqual(["01", "02", "03", "04"]);
    expect(WHY_EXHIBIT_CONTENT.benefits.map((b) => b.tabLabel)).toEqual([
      "Clientèle qualifiée",
      "Présence internationale",
      "Campagnes massives",
      "Accompagnement complet",
    ]);
  });

  it("keeps the approved titles, bodies and proof lines", () => {
    const [qualified, international, campaigns, support] = WHY_EXHIBIT_CONTENT.benefits;

    expect(qualified.title).toBe("Une clientèle qualifiée");
    expect(qualified.body).toBe(
      "Des visiteurs ayant un projet immobilier concret, identifiés avant leur arrivée au salon.",
    );
    expect(qualified.proofLine).toBe("De la pré-inscription au rendez-vous qualifié.");

    expect(international.title).toBe("Une présence internationale");
    expect(international.body).toBe(
      "France, Canada, Belgique, Royaume-Uni et Émirats Arabes Unis : un réseau de salons au plus près des marchés MRE.",
    );
    expect(international.proofLine).toBe("Du Maroc vers les marchés MRE prioritaires.");

    expect(campaigns.title).toBe("Des campagnes massives");
    expect(campaigns.body).toBe(
      "Une présence coordonnée sur les canaux qui comptent, avec des volumes, une couverture et des créations visibles.",
    );
    expect(campaigns.proofLine).toBe("Du plan média aux créations diffusées.");

    expect(support.title).toBe("Un accompagnement complet");
    expect(support.body).toBe(
      "Stand, communication, prise de rendez-vous, support commercial et suivi : chaque livrable est visible avant l’achat.",
    );
    expect(support.proofLine).toBe("De la préparation au suivi post-salon.");
  });

  it("points every CTA at a real shipped route", () => {
    for (const benefit of WHY_EXHIBIT_CONTENT.benefits) {
      expect(benefit.cta.label.length).toBeGreaterThan(0);
      expect(REAL_ROUTES.has(benefit.cta.href)).toBe(true);
    }
  });

  it("fills all five evidence slots exactly once per benefit", () => {
    for (const benefit of WHY_EXHIBIT_CONTENT.benefits) {
      expect(benefit.evidence.map((card) => card.slot).sort()).toEqual([...REQUIRED_SLOTS].sort());
      expect(new Set(benefit.evidence.map((card) => card.id)).size).toBe(benefit.evidence.length);
    }
  });

  it("ships every mapped asset in the repository", () => {
    const sources = new Set<string>();
    const collect = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(collect);
      if (!value || typeof value !== "object") return;
      const record = value as Record<string, unknown>;
      if (typeof record.src === "string") sources.add(record.src);
      Object.values(record).forEach(collect);
    };
    collect(WHY_EXHIBIT_CONTENT.benefits);

    expect(sources.size).toBeGreaterThan(0);
    for (const src of sources) {
      expect(src.startsWith("/images/why-exhibit/")).toBe(true);
      expect(existsSync(join(REPOSITORY_ROOT, "public", src.slice(1)))).toBe(true);
    }
  });

  it("states no figure anywhere in the visible copy", () => {
    /* The references carry no count, volume, case-study value or date, and the
       contract forbids inventing one. Benefit numerals live in `number`, which
       is excluded here, as is the section's own index. */
    const strings: string[] = [];
    const EXCLUDED = new Set(["number", "eyebrowIndex", "src", "position"]);
    const collect = (value: unknown, key?: string) => {
      if (key !== undefined && EXCLUDED.has(key)) return;
      if (typeof value === "string") return void strings.push(value);
      if (Array.isArray(value)) return value.forEach((v) => collect(v));
      if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) collect(v, k);
      }
    };
    collect(WHY_EXHIBIT_CONTENT);

    for (const text of strings) {
      expect(text, `unexpected figure in "${text}"`).not.toMatch(/\d/);
    }
  });

  it("recognises only the four benefit ids", () => {
    expect(BENEFIT_IDS.every(isBenefitId)).toBe(true);
    expect(isBenefitId("nope")).toBe(false);
    expect(isBenefitId(null)).toBe(false);
  });
});
