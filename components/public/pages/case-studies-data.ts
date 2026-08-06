/* Études de cas — provisional fixtures (D-026, 2026-08-06). Every study
   below is an owner-authorized placeholder the owner swaps for validated
   case records: client identities are deliberately generic descriptors
   (never invented brand names), figures are staging values, and the pages
   carry the validation disclaimer. Imagery reuses validated assets only. */

export type CaseObjective = "notoriete" | "leads" | "ventes";

export type CaseStudy = {
  readonly slug: string;
  /* Generic client descriptor — real client names publish only after
     owner validation. */
  readonly client: { readonly fr: string; readonly en: string };
  readonly edition: string;
  readonly editionSlug: string;
  readonly objective: CaseObjective;
  readonly title: { readonly fr: string; readonly en: string };
  readonly summary: { readonly fr: string; readonly en: string };
  readonly image: string;
  /* Placeholder result figures (D-026), disclaimed on render. */
  readonly results: readonly {
    readonly value: string;
    readonly label: { readonly fr: string; readonly en: string };
  }[];
  readonly quote: { readonly fr: string; readonly en: string };
  readonly quoteRole: { readonly fr: string; readonly en: string };
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "promoteur-residentiel-paris",
    client: {
      fr: "Promoteur résidentiel — Casablanca",
      en: "Residential developer — Casablanca",
    },
    edition: "Paris 2025",
    editionSlug: "paris",
    objective: "ventes",
    title: {
      fr: "Du salon de Paris au pipeline commercial complet.",
      en: "From the Paris show to a full sales pipeline.",
    },
    summary: {
      fr: "Un programme résidentiel présenté à la diaspora de région parisienne, du premier contact qualifié aux réservations attribuées.",
      en: "A residential programme presented to the Paris-region diaspora, from first qualified contact to attributed bookings.",
    },
    image: "/images/mre/investissement-patrimonial.jpg",
    results: [
      { value: "412", label: { fr: "Leads qualifiés", en: "Qualified leads" } },
      { value: "58", label: { fr: "Rendez-vous projet", en: "Project meetings" } },
      { value: "17", label: { fr: "Réservations attribuées", en: "Attributed bookings" } },
    ],
    quote: {
      fr: "Le salon nous a livré des contacts déjà qualifiés — le suivi commercial a fait le reste.",
      en: "The show delivered contacts already qualified — sales follow-up did the rest.",
    },
    quoteRole: { fr: "Direction commerciale", en: "Sales management" },
  },
  {
    slug: "groupe-immobilier-bruxelles",
    client: {
      fr: "Groupe immobilier — côte atlantique",
      en: "Real-estate group — Atlantic coast",
    },
    edition: "Bruxelles 2025",
    editionSlug: "bruxelles",
    objective: "leads",
    title: {
      fr: "Une audience belge qualifiée pour un lancement balnéaire.",
      en: "A qualified Belgian audience for a seaside launch.",
    },
    summary: {
      fr: "Pré-inscriptions ciblées et rendez-vous planifiés avant l'ouverture, pour un lancement présenté en exclusivité au salon.",
      en: "Targeted pre-registrations and meetings scheduled before opening, for a launch presented exclusively at the show.",
    },
    image: "/images/mre/residence-principale.jpg",
    results: [
      { value: "286", label: { fr: "Leads qualifiés", en: "Qualified leads" } },
      { value: "44", label: { fr: "Rendez-vous planifiés", en: "Scheduled meetings" } },
      { value: "9", label: { fr: "Options posées", en: "Options placed" } },
    ],
    quote: {
      fr: "Les rendez-vous étaient déjà dans l'agenda avant même l'ouverture des portes.",
      en: "Meetings were already in the calendar before the doors even opened.",
    },
    quoteRole: { fr: "Direction marketing", en: "Marketing management" },
  },
  {
    slug: "residence-services-montreal",
    client: {
      fr: "Résidence services — région de Marrakech",
      en: "Serviced residence — Marrakech region",
    },
    edition: "Montréal 2025",
    editionSlug: "montreal",
    objective: "notoriete",
    title: {
      fr: "Installer une marque auprès de la diaspora canadienne.",
      en: "Establishing a brand with the Canadian diaspora.",
    },
    summary: {
      fr: "Une première participation orientée notoriété : présence média, captation vidéo et une base de contacts pour les éditions suivantes.",
      en: "A first participation focused on awareness: media presence, video capture and a contact base for later editions.",
    },
    image: "/images/mre/retour-au-maroc.jpg",
    results: [
      { value: "1 900", label: { fr: "Visiteurs sur le stand", en: "Stand visitors" } },
      { value: "163", label: { fr: "Contacts collectés", en: "Contacts collected" } },
      { value: "12", label: { fr: "Retombées médias", en: "Media mentions" } },
    ],
    quote: {
      fr: "Nous sommes repartis avec une notoriété installée et une base saine pour la suite.",
      en: "We left with established awareness and a healthy base for what comes next.",
    },
    quoteRole: { fr: "Direction générale", en: "General management" },
  },
  {
    slug: "promoteur-mixte-abu-dhabi",
    client: {
      fr: "Promoteur mixte — axe Rabat-Salé",
      en: "Mixed-use developer — Rabat-Salé axis",
    },
    edition: "Abu Dhabi 2025",
    editionSlug: "abu-dhabi",
    objective: "ventes",
    title: {
      fr: "Convertir une clientèle d'investissement au Golfe.",
      en: "Converting an investment clientele in the Gulf.",
    },
    summary: {
      fr: "Un dispositif rendez-vous d'abord, pensé pour des investisseurs disposant d'un budget défini et d'un horizon court.",
      en: "A meetings-first setup designed for investors with a defined budget and a short horizon.",
    },
    image: "/destinations/abu-dhabi.png",
    results: [
      { value: "198", label: { fr: "Leads qualifiés", en: "Qualified leads" } },
      { value: "37", label: { fr: "Rendez-vous investisseurs", en: "Investor meetings" } },
      { value: "11", label: { fr: "Réservations attribuées", en: "Attributed bookings" } },
    ],
    quote: {
      fr: "Des interlocuteurs préparés, des budgets réels : la conversion a suivi.",
      en: "Prepared prospects, real budgets: conversion followed.",
    },
    quoteRole: { fr: "Direction des ventes", en: "Sales direction" },
  },
  {
    slug: "programme-neuf-laval",
    client: {
      fr: "Programme neuf — grand Agadir",
      en: "New-build programme — greater Agadir",
    },
    edition: "Laval 2025",
    editionSlug: "laval",
    objective: "leads",
    title: {
      fr: "Une base de leads MRE construite en un week-end.",
      en: "An MRE lead base built in one weekend.",
    },
    summary: {
      fr: "Trois jours de salon transformés en pipeline structuré, transmis qualifié par qualifié à l'équipe commerciale.",
      en: "Three show days turned into a structured pipeline, handed over lead by qualified lead to the sales team.",
    },
    image: "/destinations/laval.png",
    results: [
      { value: "247", label: { fr: "Leads qualifiés", en: "Qualified leads" } },
      { value: "31", label: { fr: "Rendez-vous projet", en: "Project meetings" } },
      { value: "6", label: { fr: "Options posées", en: "Options placed" } },
    ],
    quote: {
      fr: "Chaque contact transmis portait un projet réel et un horizon daté.",
      en: "Every contact handed over carried a real project and a dated horizon.",
    },
    quoteRole: { fr: "Direction commerciale", en: "Sales management" },
  },
];

export const CASE_PAGE_SIZE = 4;
