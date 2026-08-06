/* Salons 2026 provisional programme — owner-authorized placeholder data
   (D-026, 2026-08-06). Every date, venue and figure below is a staging
   fixture the owner swaps for CMS/database records when the backend is
   connected; the page carries the validation disclaimer alongside. The
   destination set and photography are the validated ones from section 02. */

export type SalonStatus = "open" | "upcoming" | "past";

export type SalonEdition = {
  readonly slug: string;
  readonly city: string;
  readonly country: string;
  /* 1-12, drives the calendar rail grouping. */
  readonly month: number;
  readonly monthLabel: { readonly fr: string; readonly en: string };
  readonly dates: { readonly fr: string; readonly en: string };
  readonly venue: string;
  readonly status: SalonStatus;
  /* Expected visitors — placeholder figure (D-026). */
  readonly visitors: string;
};

export const SALONS_2026: readonly SalonEdition[] = [
  {
    slug: "paris",
    city: "Paris",
    country: "France",
    month: 4,
    monthLabel: { fr: "Avril", en: "April" },
    dates: { fr: "24–26 avril 2026", en: "April 24–26, 2026" },
    venue: "Porte de Versailles",
    status: "open",
    visitors: "12 000",
  },
  {
    slug: "bruxelles",
    city: "Bruxelles",
    country: "Belgique",
    month: 5,
    monthLabel: { fr: "Mai", en: "May" },
    dates: { fr: "22–24 mai 2026", en: "May 22–24, 2026" },
    venue: "Brussels Expo",
    status: "open",
    visitors: "8 500",
  },
  {
    slug: "londres",
    city: "Londres",
    country: "Royaume-Uni",
    month: 6,
    monthLabel: { fr: "Juin", en: "June" },
    dates: { fr: "19–21 juin 2026", en: "June 19–21, 2026" },
    venue: "Olympia London",
    status: "upcoming",
    visitors: "7 000",
  },
  {
    slug: "laval",
    city: "Laval",
    country: "Canada",
    month: 9,
    monthLabel: { fr: "Septembre", en: "September" },
    dates: { fr: "18–20 septembre 2026", en: "September 18–20, 2026" },
    venue: "Place Bell",
    status: "upcoming",
    visitors: "6 500",
  },
  {
    slug: "montreal",
    city: "Montréal",
    country: "Canada",
    month: 10,
    monthLabel: { fr: "Octobre", en: "October" },
    dates: { fr: "16–18 octobre 2026", en: "October 16–18, 2026" },
    venue: "Palais des congrès",
    status: "upcoming",
    visitors: "9 000",
  },
  {
    slug: "abu-dhabi",
    city: "Abu Dhabi",
    country: "Émirats Arabes Unis",
    month: 11,
    monthLabel: { fr: "Novembre", en: "November" },
    dates: { fr: "20–22 novembre 2026", en: "November 20–22, 2026" },
    venue: "ADNEC",
    status: "upcoming",
    visitors: "10 000",
  },
];
