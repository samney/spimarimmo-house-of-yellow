import type { MethodSectionContent } from "./method-types";

/* Section 04 — "Notre méthode". All strings below are approved implementation
   copy from specs/03_CONTENT_CONTRACT_ALL_PHASES.md, verbatim. Do not
   paraphrase without explicit product approval.

   CTA destinations: the owner decision for Phase 01 routes every method CTA to
   /exposer (the /accompagnement page does not exist and must not be created in
   this gate). The phase is preserved as a #fragment so the destination can be
   split later without touching labels. */
export const METHOD_CONTENT: MethodSectionContent = {
  eyebrowIndex: "04",
  eyebrowLabel: "NOTRE MÉTHODE",
  heading: "Avant, pendant et après le salon — rien n’est laissé au hasard.",
  description:
    "Un dispositif en trois temps pour préparer l’audience, activer les rencontres et transformer les leads en opportunités commerciales.",
  globalCta: {
    label: "Découvrir notre accompagnement",
    href: "/exposer",
  },
  phases: [
    {
      id: "before",
      number: "01",
      label: "Avant",
      stageLabel: "ÉTAPE 01 / 03",
      title: "Préparer la demande",
      titleBreakAfterWord: 1,
      description:
        "Nous construisons la visibilité, qualifions les intentions et préparons les rendez-vous avant l’ouverture du salon.",
      mechanisms: [
        "Campagnes digitales",
        "Relations presse",
        "Landing pages",
        "Pré-inscriptions",
        "Qualification",
        "Rendez-vous",
      ],
      documents: [
        {
          id: "campaign-plan",
          label: "PLAN DE CAMPAGNE",
          kind: "schedule",
          accessibleSummary: "Aperçu du plan de campagne : calendrier des actions avant le salon.",
        },
        {
          id: "landing-page",
          label: "LANDING PAGE",
          kind: "media",
          accessibleSummary: "Aperçu de la landing page dédiée à l’immobilier marocain.",
        },
        {
          id: "qualification",
          label: "QUALIFICATION",
          kind: "flow",
          accessibleSummary:
            "Aperçu du parcours de qualification : intérêt détecté, information envoyée, profil qualifié, rendez-vous planifié.",
        },
        {
          id: "agenda",
          label: "AGENDA EXPOSANT",
          kind: "schedule",
          accessibleSummary:
            "Aperçu de l’agenda exposant : rendez-vous planifiés avant l’ouverture.",
        },
      ],
      statuses: ["Préparé", "Validé", "Planifié"],
      deliverablesHeading: "LIVRABLES AVANT",
      deliverables: [
        { id: "media-plan", title: "Plan média", status: "Préparé" },
        { id: "landing", title: "Landing page", status: "Validé" },
        { id: "qualified-profiles", title: "Profils qualifiés", status: "Validé" },
        { id: "exhibitor-agenda", title: "Agenda exposant", status: "Planifié" },
      ],
      annotation: "Tout est visible avant l’ouverture du salon.",
      contextualCta: { label: "Voir la préparation", href: "/exposer#avant" },
      journeyLabel: "PRÉPARER",
    },
    {
      id: "during",
      number: "02",
      label: "Pendant",
      stageLabel: "ÉTAPE 02 / 03",
      title: "Activer les rencontres",
      titleBreakAfterWord: 2,
      description:
        "Nous accompagnons l’exposant sur place pour transformer le trafic en conversations commerciales structurées.",
      mechanisms: [
        "Accueil",
        "Animation",
        "Conférences",
        "Rendez-vous",
        "Captation des leads",
        "Support commercial",
      ],
      documents: [
        {
          id: "live-salon",
          label: "SALON EN DIRECT",
          kind: "media",
          accessibleSummary: "Aperçu du salon en direct : le stand en activité.",
        },
        {
          id: "live-agenda",
          label: "AGENDA LIVE",
          kind: "schedule",
          accessibleSummary: "Aperçu de l’agenda live : rendez-vous du jour confirmés.",
        },
        {
          id: "floor-plan",
          label: "PLAN DU SALON",
          kind: "flow",
          accessibleSummary: "Aperçu du plan du salon avec l’emplacement du stand.",
        },
        {
          id: "lead-capture",
          label: "CAPTATION DES LEADS",
          kind: "flow",
          accessibleSummary: "Aperçu de la captation des leads : contacts structurés en direct.",
        },
        {
          id: "support",
          label: "SUPPORT EXPOSANT",
          kind: "checklist",
          accessibleSummary: "Aperçu du support exposant : accompagnement commercial sur place.",
        },
      ],
      statuses: ["En direct", "Confirmé", "Accompagné"],
      deliverablesHeading: "LIVRABLES PENDANT",
      deliverables: [
        { id: "live-agenda-output", title: "Agenda live", status: "Confirmé" },
        { id: "salon-plan", title: "Plan du salon", status: "Disponible" },
        { id: "captured-leads", title: "Leads captés", status: "En direct" },
        { id: "exhibitor-support", title: "Support exposant", status: "Actif" },
      ],
      annotation: "Chaque interaction est structurée pendant le salon.",
      contextualCta: { label: "Voir le dispositif salon", href: "/exposer#pendant" },
      journeyLabel: "ACTIVER",
    },
    {
      id: "after",
      number: "03",
      label: "Après",
      stageLabel: "ÉTAPE 03 / 03",
      title: "Transformer et suivre",
      titleBreakAfterWord: 1,
      description:
        "Les contacts, résultats et prochaines actions sont structurés pour prolonger la valeur commerciale du salon.",
      mechanisms: [
        "Transmission des leads",
        "Reporting",
        "Suivi commercial",
        "Analyse des performances",
        "Plan d’action",
      ],
      documents: [
        {
          id: "followup-report",
          label: "RAPPORT DE SUIVI",
          kind: "report",
          accessibleSummary: "Aperçu du rapport de suivi remis après le salon.",
        },
        {
          id: "lead-handoff",
          label: "BASE TRANSMISE",
          kind: "flow",
          accessibleSummary: "Aperçu de la base de contacts transmise à l’exposant.",
        },
        {
          id: "analysis",
          label: "ANALYSE",
          kind: "report",
          accessibleSummary: "Aperçu de l’analyse des performances du salon.",
        },
        {
          id: "sales-followup",
          label: "SUIVI COMMERCIAL",
          kind: "flow",
          accessibleSummary: "Aperçu du suivi commercial : prochaines actions structurées.",
        },
        {
          id: "action-plan",
          label: "PLAN D’ACTION",
          kind: "checklist",
          accessibleSummary: "Aperçu du plan d’action établi après le salon.",
        },
      ],
      statuses: ["Transmis", "Analysé", "À suivre"],
      deliverablesHeading: "LIVRABLES APRÈS",
      deliverables: [
        { id: "transmitted-base", title: "Base transmise", status: "Livré" },
        { id: "followup-report-output", title: "Rapport de suivi", status: "Livré" },
        { id: "analysis-output", title: "Analyse", status: "Validée" },
        { id: "followup-plan", title: "Plan de suivi", status: "À activer" },
      ],
      annotation: "La valeur du salon continue après sa fermeture.",
      contextualCta: { label: "Voir le processus de suivi", href: "/exposer#apres" },
      journeyLabel: "TRANSFORMER",
    },
  ],
};
