# 02 — Phase Data Example

This example locks the three-state system before Phase 01 JSX is implemented. Adapt import paths and URL destinations to the repository.

```ts
export const methodPhases = [
  {
    id: "before",
    number: "01",
    label: "Avant",
    title: "Préparer la demande",
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
      { id: "campaign-plan", label: "PLAN DE CAMPAGNE", kind: "schedule" },
      { id: "landing-page", label: "LANDING PAGE", kind: "media" },
      { id: "qualification", label: "QUALIFICATION", kind: "flow" },
      { id: "agenda", label: "AGENDA EXPOSANT", kind: "schedule" },
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
    contextualCta: {
      label: "Voir la préparation",
      href: "/accompagnement#avant",
    },
  },
  {
    id: "during",
    number: "02",
    label: "Pendant",
    title: "Activer les rencontres",
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
      { id: "live-salon", label: "SALON EN DIRECT", kind: "media" },
      { id: "live-agenda", label: "AGENDA LIVE", kind: "schedule" },
      { id: "floor-plan", label: "PLAN DU SALON", kind: "flow" },
      { id: "lead-capture", label: "CAPTATION DES LEADS", kind: "flow" },
      { id: "support", label: "SUPPORT EXPOSANT", kind: "checklist" },
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
    contextualCta: {
      label: "Voir le dispositif salon",
      href: "/accompagnement#pendant",
    },
  },
  {
    id: "after",
    number: "03",
    label: "Après",
    title: "Transformer et suivre",
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
      { id: "followup-report", label: "RAPPORT DE SUIVI", kind: "report" },
      { id: "lead-handoff", label: "BASE TRANSMISE", kind: "flow" },
      { id: "analysis", label: "ANALYSE", kind: "report" },
      { id: "sales-followup", label: "SUIVI COMMERCIAL", kind: "flow" },
      { id: "action-plan", label: "PLAN D’ACTION", kind: "checklist" },
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
    contextualCta: {
      label: "Voir le processus de suivi",
      href: "/accompagnement#apres",
    },
  },
] as const;
```

The example destinations are placeholders for repository routing integration, not approval to create nonexistent pages. Resolve actual routes before implementation.

