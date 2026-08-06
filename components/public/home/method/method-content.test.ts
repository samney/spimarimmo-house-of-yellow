import { describe, expect, it } from "vitest";
import { METHOD_CONTENT } from "./method-content";
import { METHOD_PHASE_IDS } from "./method-types";

/* Gate 1 exit evidence: the complete three-phase content contract exists and
   matches specs/03_CONTENT_CONTRACT_ALL_PHASES.md verbatim. These tests pin
   the approved copy — a paraphrase is a failure, not a variation. */

describe("method section content contract", () => {
  it("carries the shared introduction verbatim", () => {
    expect(METHOD_CONTENT.eyebrowIndex).toBe("04");
    expect(METHOD_CONTENT.eyebrowLabel).toBe("NOTRE MÉTHODE");
    expect(METHOD_CONTENT.heading).toBe(
      "Avant, pendant et après le salon — rien n’est laissé au hasard.",
    );
    expect(METHOD_CONTENT.description).toBe(
      "Un dispositif en trois temps pour préparer l’audience, activer les rencontres et transformer les leads en opportunités commerciales.",
    );
  });

  it("has exactly three phases with fixed ids and numbers", () => {
    expect(METHOD_CONTENT.phases.map((p) => p.id)).toEqual([...METHOD_PHASE_IDS]);
    expect(METHOD_CONTENT.phases.map((p) => p.number)).toEqual(["01", "02", "03"]);
    expect(METHOD_CONTENT.phases.map((p) => p.stageLabel)).toEqual([
      "ÉTAPE 01 / 03",
      "ÉTAPE 02 / 03",
      "ÉTAPE 03 / 03",
    ]);
  });

  it("keeps the approved phase headings and bodies", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.title).toBe("Préparer la demande");
    expect(before.description).toBe(
      "Nous construisons la visibilité, qualifions les intentions et préparons les rendez-vous avant l’ouverture du salon.",
    );
    expect(during.title).toBe("Activer les rencontres");
    expect(during.description).toBe(
      "Nous accompagnons l’exposant sur place pour transformer le trafic en conversations commerciales structurées.",
    );
    expect(after.title).toBe("Transformer et suivre");
    expect(after.description).toBe(
      "Les contacts, résultats et prochaines actions sont structurés pour prolonger la valeur commerciale du salon.",
    );
  });

  it("keeps the approved mechanisms per phase", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.mechanisms).toEqual([
      "Campagnes digitales",
      "Relations presse",
      "Landing pages",
      "Pré-inscriptions",
      "Qualification",
      "Rendez-vous",
    ]);
    expect(during.mechanisms).toEqual([
      "Accueil",
      "Animation",
      "Conférences",
      "Rendez-vous",
      "Captation des leads",
      "Support commercial",
    ]);
    expect(after.mechanisms).toEqual([
      "Transmission des leads",
      "Reporting",
      "Suivi commercial",
      "Analyse des performances",
      "Plan d’action",
    ]);
  });

  it("binds each phase to its supplied dossier scene", () => {
    expect(METHOD_CONTENT.phases.map((p) => p.dossier.src)).toEqual([
      "/images/method/dossier/01-avant-dossier.webp",
      "/images/method/dossier/02-pendant-dossier.webp",
      "/images/method/dossier/03-apres-dossier.webp",
    ]);
  });

  it("keeps one identical dossier box across phases", () => {
    /* The invariant that makes a phase change a crossfade instead of a
       relayout: every scene declares the same intrinsic 620 × 600 box, so no
       phase can introduce a per-phase crop or scale. */
    for (const phase of METHOD_CONTENT.phases) {
      expect(phase.dossier.width).toBe(620);
      expect(phase.dossier.height).toBe(600);
      expect(phase.dossier.summary.length).toBeGreaterThan(0);
    }
  });

  it("gives every deliverable its own supplied preview", () => {
    const previews = METHOD_CONTENT.phases.flatMap((p) => p.deliverables.map((d) => d.previewSrc));
    expect(previews).toEqual([
      "/images/method/deliverables/01-avant-plan-media.webp",
      "/images/method/deliverables/01-avant-landing-page.webp",
      "/images/method/deliverables/01-avant-profils-qualifies.webp",
      "/images/method/deliverables/01-avant-agenda-exposant.webp",
      "/images/method/deliverables/02-pendant-agenda-live.webp",
      "/images/method/deliverables/02-pendant-plan-salon.webp",
      "/images/method/deliverables/02-pendant-leads-captes.webp",
      "/images/method/deliverables/02-pendant-support-exposant.webp",
      "/images/method/deliverables/03-apres-base-transmise.webp",
      "/images/method/deliverables/03-apres-rapport-suivi.webp",
      "/images/method/deliverables/03-apres-analyse.webp",
      "/images/method/deliverables/03-apres-plan-suivi.webp",
    ]);
    // No card may reuse another card's artwork.
    expect(new Set(previews).size).toBe(previews.length);
  });

  it("keeps the approved deliverables per phase", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.deliverables.map((d) => [d.title, d.status])).toEqual([
      ["Plan média", "Préparé"],
      ["Landing page", "Validé"],
      ["Profils qualifiés", "Validé"],
      ["Agenda exposant", "Planifié"],
    ]);
    expect(during.deliverables.map((d) => [d.title, d.status])).toEqual([
      ["Agenda live", "Confirmé"],
      ["Plan du salon", "Disponible"],
      ["Leads captés", "En direct"],
      ["Support exposant", "Actif"],
    ]);
    expect(after.deliverables.map((d) => [d.title, d.status])).toEqual([
      ["Base transmise", "Livré"],
      ["Rapport de suivi", "Livré"],
      ["Analyse", "Validée"],
      ["Plan de suivi", "À activer"],
    ]);
    // The locked deliverable stack renders exactly four cards per phase.
    for (const phase of METHOD_CONTENT.phases) {
      expect(phase.deliverables).toHaveLength(4);
    }
  });

  it("keeps the approved annotations, CTAs and journey labels", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.annotation).toBe("Tout est visible avant l’ouverture du salon.");
    expect(during.annotation).toBe("Chaque interaction est structurée pendant le salon.");
    expect(after.annotation).toBe("La valeur du salon continue après sa fermeture.");

    expect(before.contextualCta.label).toBe("Voir la préparation");
    expect(during.contextualCta.label).toBe("Voir le dispositif salon");
    expect(after.contextualCta.label).toBe("Voir le processus de suivi");

    expect(METHOD_CONTENT.phases.map((p) => p.journeyLabel)).toEqual([
      "PRÉPARER",
      "ACTIVER",
      "TRANSFORMER",
    ]);
  });

  it("stages every contextual CTA to '#' (owner decision D-026, 2026-08-06)", () => {
    /* The global accompaniment CTA is gone entirely; the three phase CTAs are
       deliberately staged dead links until the owner re-links them. If a real
       destination appears here, that is a contract change to record, not a
       test to relax. */
    for (const phase of METHOD_CONTENT.phases) {
      expect(phase.contextualCta.href).toBe("#");
    }
  });

  it("introduces no fabricated metrics, dates or venues", () => {
    /* The contract forbids invented numbers, dates and venue names. The only
       digits allowed in any visible string are the fixed phase numerals.
       (Structural fields like titleBreakAfterWord are layout data, not copy;
       `*Src` fields are asset paths, so they are skipped rather than allowed
       to pass incidentally on their phase-numbered filenames.) */
    const strings: string[] = [];
    const collect = (value: unknown) => {
      if (typeof value === "string") strings.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          if (key === "src" || key.endsWith("Src")) continue;
          collect(nested);
        }
      }
    };
    collect(METHOD_CONTENT);
    for (const text of strings) {
      for (const run of text.match(/\d+/g) ?? []) {
        expect(["01", "02", "03", "04"]).toContain(run);
      }
    }
  });
});
