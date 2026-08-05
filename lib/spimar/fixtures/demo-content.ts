import type { Locale, MediaAsset, Page, SpimarEvent } from "@/lib/spimar/types";

/* CMS-shaped demo content (C-01).

   Layouts cannot be designed honestly against empty slots. `.data/` is
   gitignored, so on any clean checkout the listings render their empty state
   and nobody has seen a card beside another card. On a machine that has run the
   e2e suite the listings are worse than empty: they show its residue — 31
   records with slugs like `e2e-edition-1785696125733805405`, no titles and no
   dates — because the suite writes into the same local store the public site
   reads. Neither state is something a layout can be designed against.

   These fixtures fill that gap in **exactly the shape the CMS will deliver**,
   conforming to `lib/spimar/types.ts`, so Phase P designs against real content
   and the eventual Supabase swap changes nothing above the seam.

   Three rules hold this apart from inventing facts:

   1. **No component imports this file.** It is served through
      `DemoContentRepository`, which implements the same `ContentRepository`
      interface as the file adapter. If a component could read it directly, the
      fixtures would be indistinguishable from content.
   2. **It is off unless asked for.** `SPIMAR_DEMO_CONTENT=1` is the only way in
      (`C-02`). Without it the site serves today's honest pending states.
   3. **Every record is marked.** `demo: true` reaches the UI as a visible
      `Démo` badge — the pattern already shipped on the salon cards — so a
      visitor is never shown a fabricated date that looks validated.

   `D-021` says the repository ships no seeded content. That rule exists to stop
   invented facts reaching visitors; it is not weakened here, because these
   never reach a visitor unmarked and never reach production at all. */

export type DemoEvent = SpimarEvent & {
  readonly demo: true;
  /** Card/hero image, as a `MediaAsset` so the CMS shape is exercised (C-04). */
  readonly image: MediaAsset | null;
};
export type DemoPage = Page & { readonly demo: true };

const AUDIT = {
  createdAt: "2026-08-05T00:00:00.000Z",
  updatedAt: "2026-08-05T00:00:00.000Z",
  createdBy: "demo-fixtures",
  updatedBy: "demo-fixtures",
} as const;

function bilingual(fr: string, en: string): Record<Locale, string> {
  return { fr, en };
}

/* Editions. Deliberately awkward in places — `C-03` asks for the difficult
   cases, not six tidy ones, because a layout that only survives tidy data is
   not designed yet:
   - `paris-2026` is the long-title case;
   - `london-2026` has NO confirmed dates, so it must render "dates à confirmer"
     rather than a guess;
   - `dubai-2026` is a draft and must never appear on a public listing;
   - `montreal-2026` has an empty summary. */
export const DEMO_EVENTS: readonly DemoEvent[] = [
  {
    ...AUDIT,
    demo: true,
    image: {
      ...AUDIT,
      id: "media-paris",
      state: "published",
      src: "/destinations/paris.png",
      alt: bilingual("Le salon SPIMARIMMO à Paris", "SPIMARIMMO exhibition in Paris"),
      rightsOwner: "SPIMARIMMO",
      sourceProvenance: "docs/assets-UX-UI (owner-supplied)",
    },
    id: "evt-paris-2026",
    slug: "paris-2026",
    state: "published",
    destinationId: "dst-paris",
    title: bilingual(
      "Salon de l'Immobilier Marocain à Paris — édition anniversaire",
      "Moroccan Property Show Paris — anniversary edition",
    ),
    summary: bilingual(
      "Trois jours de rencontres entre promoteurs marocains et acquéreurs de la diaspora, au cœur de Paris.",
      "Three days connecting Moroccan developers with diaspora buyers in central Paris.",
    ),
    startDate: "2026-03-14",
    endDate: "2026-03-16",
    city: "Paris",
    country: "FR",
  },
  {
    ...AUDIT,
    demo: true,
    image: {
      ...AUDIT,
      id: "media-bruxelles",
      state: "published",
      src: "/destinations/bruxelles.png",
      alt: bilingual("Le salon SPIMARIMMO à Bruxelles", "SPIMARIMMO exhibition in Brussels"),
      rightsOwner: "SPIMARIMMO",
      sourceProvenance: "docs/assets-UX-UI (owner-supplied)",
    },
    id: "evt-bruxelles-2026",
    slug: "bruxelles-2026",
    state: "published",
    destinationId: "dst-bruxelles",
    title: bilingual(
      "Salon de l'Immobilier Marocain à Bruxelles",
      "Moroccan Property Show Brussels",
    ),
    summary: bilingual(
      "Le rendez-vous de la communauté marocaine du Benelux.",
      "The meeting point for the Moroccan community across Benelux.",
    ),
    startDate: "2026-04-11",
    endDate: "2026-04-12",
    city: "Bruxelles",
    country: "BE",
  },
  {
    ...AUDIT,
    demo: true,
    image: {
      ...AUDIT,
      id: "media-montreal",
      state: "published",
      src: "/destinations/montreal.png",
      alt: bilingual("Le salon SPIMARIMMO à Montréal", "SPIMARIMMO exhibition in Montreal"),
      rightsOwner: "SPIMARIMMO",
      sourceProvenance: "docs/assets-UX-UI (owner-supplied)",
    },
    id: "evt-montreal-2026",
    slug: "montreal-2026",
    state: "published",
    destinationId: "dst-montreal",
    title: bilingual(
      "Salon de l'Immobilier Marocain à Montréal",
      "Moroccan Property Show Montreal",
    ),
    /* Empty on purpose: a listing card must not collapse when the summary is
       missing, and an editor will publish an edition before writing its blurb. */
    summary: { fr: "", en: "" },
    startDate: "2026-05-09",
    endDate: "2026-05-10",
    city: "Montréal",
    country: "CA",
  },
  {
    ...AUDIT,
    demo: true,
    image: {
      ...AUDIT,
      id: "media-londres",
      state: "published",
      src: "/destinations/londres.png",
      alt: bilingual("Le salon SPIMARIMMO à Londres", "SPIMARIMMO exhibition in London"),
      rightsOwner: "SPIMARIMMO",
      sourceProvenance: "docs/assets-UX-UI (owner-supplied)",
    },
    id: "evt-london-2026",
    slug: "london-2026",
    state: "published",
    destinationId: null,
    title: bilingual("Salon de l'Immobilier Marocain à Londres", "Moroccan Property Show London"),
    summary: bilingual(
      "Première édition britannique, en préparation avec nos partenaires locaux.",
      "First UK edition, in preparation with our local partners.",
    ),
    /* Unconfirmed. The UI must say so rather than guess a month. */
    startDate: "",
    endDate: "",
    city: "London",
    country: "GB",
  },
  {
    ...AUDIT,
    demo: true,
    /* No approved image for this edition. `null` rather than a stand-in: an
       unillustrated card is honest, a borrowed photo is not. */
    image: null,
    id: "evt-dubai-2026",
    slug: "dubai-2026",
    state: "draft",
    destinationId: null,
    title: bilingual("Salon de l'Immobilier Marocain à Dubaï", "Moroccan Property Show Dubai"),
    summary: bilingual("Édition en cours de préparation.", "Edition in preparation."),
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    city: "Dubaï",
    country: "AE",
  },
];

/* Case studies live in the pages collection under the `etudes/` slug family,
   which is what `/etudes-de-cas` filters on. */
export const DEMO_PAGES: readonly DemoPage[] = [
  {
    ...AUDIT,
    demo: true,
    id: "pg-etude-atlas",
    slug: "etudes/residences-atlas-paris",
    state: "published",
    title: bilingual(
      "Résidences Atlas — 180 rendez-vous qualifiés en trois jours",
      "Résidences Atlas — 180 qualified meetings in three days",
    ),
    intro: bilingual(
      "Comment un promoteur casablancais a converti une première participation en pipeline commercial.",
      "How a Casablanca developer turned a first appearance into a commercial pipeline.",
    ),
    body: bilingual(
      "Préparation de l'audience six semaines avant l'ouverture, stand de 24 m² en zone centrale, et un dispositif de qualification sur place. Les rendez-vous ont été suivis pendant le trimestre suivant.",
      "Audience preparation six weeks before opening, a 24 m² stand in the central zone, and on-site qualification. Meetings were followed through the following quarter.",
    ),
  },
  {
    ...AUDIT,
    demo: true,
    id: "pg-etude-marina",
    slug: "etudes/marina-bleue-bruxelles",
    state: "published",
    title: bilingual(
      "Marina Bleue — ouvrir le marché du Benelux",
      "Marina Bleue — opening the Benelux market",
    ),
    intro: bilingual(
      "Une première présence hors de France, avec un catalogue adapté à la diaspora belge.",
      "A first appearance outside France, with a catalogue adapted to the Belgian diaspora.",
    ),
    body: bilingual(
      "Le programme a été repositionné pour un public primo-accédant, avec un accompagnement bancaire présenté sur le stand.",
      "The development was repositioned for first-time buyers, with banking support presented on the stand.",
    ),
  },
  {
    ...AUDIT,
    demo: true,
    id: "pg-etude-draft",
    slug: "etudes/programme-confidentiel",
    state: "draft",
    title: bilingual("Étude en cours de validation", "Case study under validation"),
    intro: bilingual("", ""),
    body: bilingual("", ""),
  },
];
