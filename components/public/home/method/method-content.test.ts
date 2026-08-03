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
    expect(METHOD_CONTENT.globalCta.label).toBe("Découvrir notre accompagnement");
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

  it("keeps the approved dossier documents per phase", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.documents.map((d) => d.label)).toEqual([
      "PLAN DE CAMPAGNE",
      "LANDING PAGE",
      "QUALIFICATION",
      "AGENDA EXPOSANT",
    ]);
    expect(during.documents.map((d) => d.label)).toEqual([
      "SALON EN DIRECT",
      "AGENDA LIVE",
      "PLAN DU SALON",
      "CAPTATION DES LEADS",
      "SUPPORT EXPOSANT",
    ]);
    expect(after.documents.map((d) => d.label)).toEqual([
      "RAPPORT DE SUIVI",
      "BASE TRANSMISE",
      "ANALYSE",
      "SUIVI COMMERCIAL",
      "PLAN D’ACTION",
    ]);
    // The locked dossier composition renders at most five document slots.
    for (const phase of METHOD_CONTENT.phases) {
      expect(phase.documents.length).toBeGreaterThanOrEqual(4);
      expect(phase.documents.length).toBeLessThanOrEqual(5);
      for (const doc of phase.documents) {
        expect(doc.accessibleSummary.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the approved statuses and deliverables per phase", () => {
    const [before, during, after] = METHOD_CONTENT.phases;
    expect(before.statuses).toEqual(["Préparé", "Validé", "Planifié"]);
    expect(during.statuses).toEqual(["En direct", "Confirmé", "Accompagné"]);
    expect(after.statuses).toEqual(["Transmis", "Analysé", "À suivre"]);

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

  it("routes every CTA to an existing destination (owner decision: /exposer)", () => {
    expect(METHOD_CONTENT.globalCta.href).toBe("/exposer");
    for (const phase of METHOD_CONTENT.phases) {
      expect(phase.contextualCta.href.startsWith("/exposer")).toBe(true);
    }
  });

  it("introduces no fabricated metrics, dates or venues", () => {
    /* The contract forbids invented numbers, dates and venue names. The only
       digits allowed in any visible string are the fixed phase numerals.
       (Structural fields like titleBreakAfterWord are layout data, not copy.) */
    const strings: string[] = [];
    const collect = (value: unknown) => {
      if (typeof value === "string") strings.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
    };
    collect(METHOD_CONTENT);
    for (const text of strings) {
      for (const run of text.match(/\d+/g) ?? []) {
        expect(["01", "02", "03", "04"]).toContain(run);
      }
    }
  });
});
