import type { MethodSectionContent } from "./method-types";

const PREVIEWS = "/images/method/deliverables";

/* Every phase scene is supplied at the same intrinsic size, which is what lets
   one fixed wrapper hold all three without a phase-specific crop or scale
   (repair v2 ASSET_MANIFEST.md, "Production dossier scenes"). */
const DOSSIER_BOX = { width: 620, height: 600 } as const;

/* Section 04 — "Notre méthode". All strings below are approved implementation
   copy from specs/03_CONTENT_CONTRACT_ALL_PHASES.md, verbatim. Do not
   paraphrase without explicit product approval.

   CTA destinations (D-026, 2026-08-06): the owner removed the global
   accompaniment CTA and staged every contextual CTA to "#" — they are
   re-linked when the owner validates the destinations. Labels are unchanged
   approved copy. */
export const METHOD_CONTENT: MethodSectionContent = {
  eyebrowIndex: "04",
  eyebrowLabel: "NOTRE MÉTHODE",
  heading: "Avant, pendant et après le salon — rien n’est laissé au hasard.",
  description:
    "Un dispositif en trois temps pour préparer l’audience, activer les rencontres et transformer les leads en opportunités commerciales.",
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
      dossier: {
        ...DOSSIER_BOX,
        src: "/images/method/dossier/01-avant-dossier.webp",
        summary:
          "Dossier exposant en phase Avant : plan de campagne, landing page, parcours de qualification et agenda exposant réunis avant l’ouverture du salon.",
      },
      deliverablesHeading: "LIVRABLES AVANT",
      deliverables: [
        {
          id: "media-plan",
          title: "Plan média",
          status: "Préparé",
          previewSrc: `${PREVIEWS}/01-avant-plan-media.webp`,
        },
        {
          id: "landing",
          title: "Landing page",
          status: "Validé",
          previewSrc: `${PREVIEWS}/01-avant-landing-page.webp`,
        },
        {
          id: "qualified-profiles",
          title: "Profils qualifiés",
          status: "Validé",
          previewSrc: `${PREVIEWS}/01-avant-profils-qualifies.webp`,
        },
        {
          id: "exhibitor-agenda",
          title: "Agenda exposant",
          status: "Planifié",
          previewSrc: `${PREVIEWS}/01-avant-agenda-exposant.webp`,
        },
      ],
      annotation: "Tout est visible avant l’ouverture du salon.",
      contextualCta: { label: "Voir la préparation", href: "#" },
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
      dossier: {
        ...DOSSIER_BOX,
        src: "/images/method/dossier/02-pendant-dossier.webp",
        summary:
          "Dossier exposant en phase Pendant : salon en direct, agenda live, plan du salon, captation des leads et support exposant sur place.",
      },
      deliverablesHeading: "LIVRABLES PENDANT",
      deliverables: [
        {
          id: "live-agenda-output",
          title: "Agenda live",
          status: "Confirmé",
          previewSrc: `${PREVIEWS}/02-pendant-agenda-live.webp`,
        },
        {
          id: "salon-plan",
          title: "Plan du salon",
          status: "Disponible",
          previewSrc: `${PREVIEWS}/02-pendant-plan-salon.webp`,
        },
        {
          id: "captured-leads",
          title: "Leads captés",
          status: "En direct",
          previewSrc: `${PREVIEWS}/02-pendant-leads-captes.webp`,
        },
        {
          id: "exhibitor-support",
          title: "Support exposant",
          status: "Actif",
          previewSrc: `${PREVIEWS}/02-pendant-support-exposant.webp`,
        },
      ],
      annotation: "Chaque interaction est structurée pendant le salon.",
      contextualCta: { label: "Voir le dispositif salon", href: "#" },
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
      dossier: {
        ...DOSSIER_BOX,
        src: "/images/method/dossier/03-apres-dossier.webp",
        summary:
          "Dossier exposant en phase Après : rapport de suivi, base de contacts transmise, analyse des performances et plan d’action structurés après le salon.",
      },
      deliverablesHeading: "LIVRABLES APRÈS",
      deliverables: [
        {
          id: "transmitted-base",
          title: "Base transmise",
          status: "Livré",
          previewSrc: `${PREVIEWS}/03-apres-base-transmise.webp`,
        },
        {
          id: "followup-report-output",
          title: "Rapport de suivi",
          status: "Livré",
          previewSrc: `${PREVIEWS}/03-apres-rapport-suivi.webp`,
        },
        {
          id: "analysis-output",
          title: "Analyse",
          status: "Validée",
          previewSrc: `${PREVIEWS}/03-apres-analyse.webp`,
        },
        {
          id: "followup-plan",
          title: "Plan de suivi",
          status: "À activer",
          previewSrc: `${PREVIEWS}/03-apres-plan-suivi.webp`,
        },
      ],
      annotation: "La valeur du salon continue après sa fermeture.",
      contextualCta: { label: "Voir le processus de suivi", href: "#" },
      journeyLabel: "TRANSFORMER",
    },
  ],
};
