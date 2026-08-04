import type { ImageRef, WhyExhibitContent } from "./why-exhibit-types";

/* Section 03 — "Pourquoi exposer avec SPIMARIMMO ?" content.

   Every visible French string in the four approved references lives here, and
   only here. Copy is verbatim from the references; nothing is added. No count,
   campaign volume, case-study value, lead total or country-event date appears
   anywhere — the references carry none and the contract forbids inventing them
   (PIXEL_PARITY_SPEC.md, "Prohibited shortcuts").

   CTA destinations are real shipped routes; none is invented.

   Asset mapping is ASSET_MANIFEST.md, reproduced here as the single source for
   src + default crop. `alt: ""` marks a duplicated instance of a picture that
   is already described beside it. */

const MEDIA = "/images/why-exhibit";

const image = (file: string, alt: string, position?: string): ImageRef => ({
  src: `${MEDIA}/${file}`,
  alt,
  position,
});

/* Generated masters — architecture and salon photography with no flag, caption,
   logo, interface chrome or readable text baked in. */
const COUNTRY_FRANCE = (alt: string) => image("country-france-paris.webp", alt, "50% 50%");
const COUNTRY_CANADA = (alt: string) => image("country-canada-montreal.webp", alt, "50% 48%");
const COUNTRY_BELGIUM = (alt: string) => image("country-belgium-brussels.webp", alt, "46% 50%");
const COUNTRY_UK = (alt: string) => image("country-uk-london.webp", alt, "50% 50%");
const COUNTRY_UAE = (alt: string) => image("country-uae-abu-dhabi.webp", alt, "48% 50%");
const STAND_PLAN = (alt: string) => image("stand-plan-topdown.webp", alt, "50% 50%");

/* Previously approved assets reused across tabs 01, 03 and 04. */
const PROPERTY_HERO = (alt: string) => image("campaign-property-hero.webp", alt);
const PROPERTY_INTERIOR = (alt: string) => image("show-apartment-interior.webp", alt);
const PROPERTY_NIGHT = (alt: string) => image("project-ocean-view.webp", alt);
const PROPERTY_WIDE = (alt: string) => image("project-riviera-bay.webp", alt);
const CONSULTATION = (alt: string) => image("investor-consultation.webp", alt);
const EVENT_CROWD = (alt: string) => image("affluence.webp", alt);
const CONFERENCE = (alt: string) => image("conference-marche-mre.webp", alt);

export const WHY_EXHIBIT_CONTENT: WhyExhibitContent = {
  eyebrowIndex: "03",
  eyebrowLabel: "Pourquoi exposer ?",
  heading: "Pourquoi exposer avec SPIMARIMMO ?",
  subtitle: "Quatre piliers de réponse, soutenus par des preuves concrètes.",
  tablistLabel: "Piliers SPIMARIMMO",
  benefits: [
    {
      id: "qualified",
      number: "01",
      tabLabel: "Clientèle qualifiée",
      title: "Une clientèle qualifiée",
      titleBreakAfterWord: 2,
      body: "Des visiteurs ayant un projet immobilier concret, identifiés avant leur arrivée au salon.",
      cta: { label: "Voir la méthode de qualification", href: "/exposer/methode" },
      proofLine: "De la pré-inscription au rendez-vous qualifié.",
      chips: ["Pré-inscription", "Projet", "Budget", "Horizon", "Intention", "Rendez-vous"],
      screenCta: "Découvrir la méthode",
      screenFootnote: "Données vérifiées",
      scene: {
        kind: "qualification",
        rows: [
          { title: "Visiteur pré-inscrit", icon: "user", progress: 0.72 },
          {
            title: "Projet immobilier",
            icon: "user",
            media: [PROPERTY_HERO(""), PROPERTY_INTERIOR(""), PROPERTY_NIGHT("")],
          },
          { title: "Profil qualifié", icon: "userLine", progress: 0.84 },
          { title: "Intention vérifiée", icon: "target", progress: 0.62 },
          { title: "Rendez-vous confirmé", icon: "calendar" },
        ],
        stats: [
          { label: "Pré-inscriptions", chart: "bars" },
          { label: "Profils qualifiés", chart: "donut" },
          { label: "Intentions", chart: "line" },
        ],
      },
      evidence: [
        {
          id: "form",
          slot: "leftTop",
          icon: "clipboard",
          title: "Formulaire",
          accessibleSummary: "Formulaire de pré-inscription du visiteur.",
          body: {
            kind: "form",
            caption: "Pré-inscription",
            steps: 4,
            activeStep: 2,
            fields: [
              { label: "Identité", icon: "userLine" },
              { label: "Adresse e-mail", icon: "mail" },
              { label: "Pays de résidence", icon: "pin" },
              { label: "Ville ciblée", icon: "home" },
            ],
          },
        },
        {
          id: "profile",
          slot: "leftBottom",
          icon: "userLine",
          title: "Profil qualifié",
          accessibleSummary:
            "Profil qualifié : type de projet, budget, horizon d’achat et destination.",
          body: {
            kind: "attributes",
            rows: [
              { label: "Type de projet", icon: "building" },
              { label: "Budget", icon: "coins" },
              { label: "Horizon d’achat", icon: "calendar" },
              { label: "Destination", icon: "pin" },
            ],
          },
        },
        {
          id: "intent",
          slot: "rightTop",
          icon: "target",
          title: "Intention",
          accessibleSummary: "Intention d’achat vérifiée.",
          body: { kind: "emblem", emblem: "ring", icon: "check", caption: "Intention vérifiée" },
        },
        {
          id: "appointment",
          slot: "rightBottom",
          icon: "calendar",
          title: "Rendez-vous",
          accessibleSummary: "Rendez-vous confirmé avec le visiteur.",
          body: {
            kind: "emblem",
            emblem: "disc",
            icon: "calendarCheck",
            caption: "Rendez-vous confirmé",
          },
        },
        {
          id: "criteria",
          slot: "rightOuter",
          icon: "criteria",
          title: "Critères",
          accessibleSummary:
            "Critères de qualification : projet immobilier, budget défini, horizon d’achat, intention d’achat, localisation ciblée.",
          body: {
            kind: "checklist",
            rows: [
              "Projet immobilier",
              "Budget défini",
              "Horizon d’achat",
              "Intention d’achat",
              "Localisation ciblée",
            ],
          },
        },
      ],
    },
    {
      id: "international",
      number: "02",
      tabLabel: "Présence internationale",
      title: "Une présence internationale",
      titleBreakAfterWord: 2,
      body: "France, Canada, Belgique, Royaume-Uni et Émirats Arabes Unis : un réseau de salons au plus près des marchés MRE.",
      cta: { label: "Explorer les salons par pays", href: "/salons" },
      proofLine: "Du Maroc vers les marchés MRE prioritaires.",
      chips: ["France", "Canada", "Belgique", "Royaume-Uni", "Émirats"],
      screenCta: "Voir les salons",
      screenFootnote: "Données vérifiées",
      scene: {
        kind: "international",
        /* "À venir" is the honest pending state: no edition date is validated,
           so none is shown (CLAUDE.md, validated content only). */
        countries: [
          {
            flag: "ca",
            name: "Canada",
            caption: "Salon SPIMARIMMO",
            status: "À venir",
            image: COUNTRY_CANADA(""),
          },
          {
            flag: "fr",
            name: "France",
            caption: "Salon SPIMARIMMO",
            status: "À venir",
            image: COUNTRY_FRANCE(""),
          },
          {
            flag: "be",
            name: "Belgique",
            caption: "Salon SPIMARIMMO",
            status: "À venir",
            image: COUNTRY_BELGIUM(""),
          },
        ],
        stats: [
          { label: "Pays couverts", chart: "globe" },
          { label: "Salons", chart: "calendar" },
          { label: "Marchés MRE", chart: "people" },
        ],
      },
      evidence: [
        {
          id: "france",
          slot: "leftTop",
          icon: "pin",
          title: "France",
          accessibleSummary: "Salon SPIMARIMMO en France.",
          body: {
            kind: "country",
            flag: "fr",
            caption: "Salon SPIMARIMMO",
            image: COUNTRY_FRANCE("Stand SPIMARIMMO sur un salon en France"),
          },
        },
        {
          id: "canada",
          slot: "leftBottom",
          icon: "pin",
          title: "Canada",
          accessibleSummary: "Salon SPIMARIMMO au Canada.",
          body: {
            kind: "country",
            flag: "ca",
            caption: "Salon SPIMARIMMO",
            image: COUNTRY_CANADA("Conférence SPIMARIMMO devant un public au Canada"),
          },
        },
        {
          id: "belgium",
          slot: "rightTop",
          icon: "pin",
          title: "Belgique",
          accessibleSummary: "Salon SPIMARIMMO en Belgique.",
          body: {
            kind: "country",
            flag: "be",
            caption: "Salon SPIMARIMMO",
            image: COUNTRY_BELGIUM("Allée d’exposition d’un salon SPIMARIMMO en Belgique"),
          },
        },
        {
          id: "uk",
          slot: "rightBottom",
          icon: "pin",
          title: "Royaume-Uni",
          accessibleSummary: "Salon SPIMARIMMO au Royaume-Uni.",
          body: {
            kind: "country",
            flag: "gb",
            caption: "Salon SPIMARIMMO",
            image: COUNTRY_UK("Présentation de projets devant un public au Royaume-Uni"),
          },
        },
        {
          id: "uae",
          slot: "rightOuter",
          icon: "pin",
          title: "Émirats",
          accessibleSummary: "Salon SPIMARIMMO aux Émirats arabes unis.",
          body: {
            kind: "country",
            flag: "ae",
            caption: "Salon SPIMARIMMO",
            image: COUNTRY_UAE("Espace d’exposition SPIMARIMMO aux Émirats arabes unis"),
          },
        },
      ],
    },
    {
      id: "campaigns",
      number: "03",
      tabLabel: "Campagnes massives",
      title: "Des campagnes massives",
      titleBreakAfterWord: 2,
      body: "Une présence coordonnée sur les canaux qui comptent, avec des volumes, une couverture et des créations visibles.",
      cta: { label: "Voir l’étude de cas", href: "/etudes-de-cas" },
      proofLine: "Du plan média aux créations diffusées.",
      chips: ["Meta", "Instagram", "Google", "YouTube", "Emailing", "SMS", "Presse", "Influence"],
      screenCta: "Consulter les preuves",
      screenFootnote: "Données vérifiées",
      scene: {
        kind: "campaigns",
        feed: [PROPERTY_WIDE(""), EVENT_CROWD(""), CONSULTATION(""), PROPERTY_NIGHT("")],
        stats: [
          { label: "Volume média", chart: "bars" },
          { label: "Couverture", chart: "map" },
          { label: "Créations", chart: "line" },
        ],
      },
      evidence: [
        {
          id: "instagram",
          slot: "leftTop",
          icon: "instagram",
          title: "Instagram",
          accessibleSummary: "Publication Instagram d’une création de campagne.",
          body: {
            kind: "socialPost",
            actions: "feed",
            image: PROPERTY_HERO("Création de campagne : façade d’un programme immobilier"),
          },
        },
        {
          id: "emailing",
          slot: "leftBottom",
          icon: "envelope",
          title: "Emailing",
          accessibleSummary: "Campagne emailing exposants, création diffusée.",
          body: {
            kind: "mailer",
            heading: "Campagne exposants",
            pill: "Création diffusée",
            image: PROPERTY_HERO(""),
          },
        },
        {
          id: "youtube",
          slot: "rightTop",
          icon: "youtube",
          title: "YouTube",
          accessibleSummary: "Vidéo d’une conférence SPIMARIMMO.",
          body: {
            kind: "video",
            image: CONFERENCE("Table ronde filmée lors d’une conférence SPIMARIMMO"),
          },
        },
        {
          id: "press",
          slot: "rightBottom",
          icon: "press",
          title: "Presse",
          accessibleSummary: "Retombée presse — preuve disponible sur demande.",
          body: {
            kind: "press",
            heading: "Preuve disponible",
            image: PROPERTY_HERO(""),
          },
        },
        {
          id: "influence",
          slot: "rightOuter",
          icon: "influence",
          title: "Influence",
          accessibleSummary: "Contenu d’influence tourné dans un appartement témoin.",
          body: {
            kind: "socialPost",
            actions: "reel",
            image: PROPERTY_INTERIOR("Séjour d’un appartement témoin, baie vitrée sur la ville"),
          },
        },
      ],
    },
    {
      id: "support",
      number: "04",
      tabLabel: "Accompagnement complet",
      title: "Un accompagnement complet",
      titleBreakAfterWord: 2,
      body: "Stand, communication, prise de rendez-vous, support commercial et suivi : chaque livrable est visible avant l’achat.",
      cta: { label: "Voir les livrables inclus", href: "/exposer/offres" },
      proofLine: "De la préparation au suivi post-salon.",
      chips: ["Cadrage", "Stand", "Communication", "Rendez-vous", "Support", "Suivi"],
      screenCta: "Voir les livrables",
      screenFootnote: "Livrables vérifiés",
      scene: {
        kind: "support",
        deliverables: [
          {
            title: "Brief validé",
            status: "Livré",
            icon: "document",
            sheet: { kind: "paper", columns: 2 },
          },
          {
            title: "Plan du stand",
            status: "En cours",
            icon: "hourglass",
            sheet: { kind: "image", image: STAND_PLAN("") },
          },
          {
            title: "Kit de communication",
            status: "Livré",
            icon: "megaphone",
            sheet: { kind: "image", image: PROPERTY_HERO("") },
          },
          {
            title: "Agenda de rendez-vous",
            status: "Inclus",
            icon: "agenda",
            sheet: { kind: "paper", columns: 1 },
          },
          {
            title: "Support salon",
            status: "En cours",
            icon: "headset",
            sheet: { kind: "paper", columns: 1 },
          },
          {
            title: "Rapport de suivi",
            status: "Inclus",
            icon: "report",
            sheet: { kind: "chart" },
          },
        ],
        legend: [
          { label: "Inclus", marker: "neutral" },
          { label: "En cours", marker: "progress" },
          { label: "Livré", marker: "done" },
        ],
      },
      evidence: [
        {
          id: "stand-plan",
          slot: "leftTop",
          icon: "plan",
          title: "Plan du stand",
          accessibleSummary: "Plan du stand en vue de dessus.",
          body: {
            kind: "planSheet",
            image: STAND_PLAN("Plan d’un stand d’exposition vu de dessus"),
          },
        },
        {
          id: "communication-kit",
          slot: "leftBottom",
          icon: "megaphone",
          title: "Kit communication",
          accessibleSummary: "Kit de communication : visuels et documents du stand.",
          body: {
            kind: "collage",
            images: [
              PROPERTY_HERO("Visuel de communication : façade d’un programme immobilier"),
              PROPERTY_NIGHT(""),
            ],
          },
        },
        {
          id: "appointments",
          slot: "rightTop",
          icon: "agenda",
          title: "Rendez-vous",
          accessibleSummary: "Agenda des rendez-vous exposant.",
          body: { kind: "roster", rows: 3 },
        },
        {
          id: "salon-support",
          slot: "rightBottom",
          icon: "headset",
          title: "Support salon",
          accessibleSummary: "Points de support assurés pendant le salon.",
          body: { kind: "checkRows", rows: 4 },
        },
        {
          id: "follow-up",
          slot: "rightOuter",
          icon: "chart",
          title: "Rapport de suivi",
          accessibleSummary: "Rapport de suivi post-salon.",
          body: {
            kind: "report",
            image: PROPERTY_HERO("Visuel du programme repris dans le rapport de suivi"),
          },
        },
      ],
    },
  ],
};
