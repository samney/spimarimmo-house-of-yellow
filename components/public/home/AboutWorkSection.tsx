import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { BrochureTrigger } from "@/components/public/global/BrochureDialog";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { EventsCarousel, type EventOpportunity } from "./EventsCarousel";
import { PromotersSection } from "./PromotersSection";
import { SectionEyebrow } from "./SectionEyebrow";

/* The works -> Salons par pays (specification §05, §07).

   The section keeps its foundation direction exactly: the same
   `projectsSection` treatment, the same `hoyCols` header of side label /
   statement / numbered chapter marker, the same card row, and cards with the
   same media plane, tag chip, title and two stats. Only the content changes,
   from featured project to event destination.

   Content discipline, from §07 and §19:
   - Country, city and status come from the specification.
   - Date, venue and expected-visitor counts are NOT owner-validated. They
     carry sample values so the card can be judged with content in it, and
     every card that does says "Démo" on its face (owner decision, 2026-08-05,
     using the design contract's demo-badge pattern). Dropping a card's `demo`
     block returns it to the honest "à confirmer" / "à publier" state.
   - Ordering follows §07: upcoming editions first, historical last. */

const EVENTS: EventOpportunity[] = [
  {
    slug: "paris",
    country: "France",
    city: "Paris",
    status: "prochaine-edition",
    demo: { dateAndVenue: "14–16 mars 2026 · Paris Expo", expectedVisitors: "4 200 attendus" },
  },
  {
    slug: "bruxelles",
    country: "Belgique",
    city: "Bruxelles",
    status: "prochaine-edition",
    demo: { dateAndVenue: "11–12 avril 2026 · Brussels Expo", expectedVisitors: "2 600 attendus" },
  },
  {
    slug: "laval",
    country: "Canada",
    city: "Laval",
    status: "prochaine-edition",
    demo: { dateAndVenue: "9–10 mai 2026 · Place Bell", expectedVisitors: "3 100 attendus" },
  },
  {
    slug: "abu-dhabi",
    country: "Émirats Arabes Unis",
    city: "Abu Dhabi",
    status: "prochaine-edition",
    demo: { dateAndVenue: "6–7 juin 2026 · ADNEC", expectedVisitors: "1 900 attendus" },
  },
  {
    slug: "londres",
    country: "Royaume-Uni",
    city: "Londres",
    status: "a-venir",
    demo: { dateAndVenue: "Automne 2026 · Olympia London", expectedVisitors: "2 400 attendus" },
  },
  {
    slug: "montreal",
    country: "Canada",
    city: "Montréal",
    status: "historique",
    demo: {
      dateAndVenue: "18–19 octobre 2025 · Palais des congrès",
      expectedVisitors: "2 800 reçus",
    },
  },
];

/* Social proof — "Ils nous font confiance" (§14) — used to run here as a bare
   `logoSection` marquee: a label and a scrolling strip of the same five marks,
   with no eyebrow, no lead, no pause control and no way to see the full list.

   It was removed on 2026-08-05 (owner direction). The trust band is now a
   single component, `PromotersSection`, mounted directly after this section —
   one social-proof moment on the page instead of two competing ones, and the
   surviving copy is the stronger of the two. */

function PillButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  /* The reference pairs a filled primary with an outlined secondary, which is
     also the specification's commitment hierarchy: stand first, brochure as the
     lighter alternative. */
  variant?: "dark" | "outline";
}) {
  return (
    <Link className={`button${variant ? ` ${variant}` : ""}`} href={href} title={label}>
      <span className="label">
        <span className="fixedLabel">{label}</span>
        <span className="innerLabel">
          <Marquee text={label} direction="left" speed={90} />
        </span>
      </span>
      <span className="icon">
        <PlusIcon />
      </span>
    </Link>
  );
}

export function AboutWorkSection() {
  return (
    <section className="aboutWorkBlock noMargin scrollSection setDarkCursor">
      <div className="innerAnimContainer">
        <div className="grainBackground" aria-hidden="true" />
        <div className="contentWrapper">
          {/* Anchor target for the header's Exposer > Pourquoi SPIMARIMMO entry. */}
          <div className="aboutSection" id="pourquoi-spimar">
            <div className="cols">
              <div className="col"></div>
              <div className="col">
                <SectionEyebrow index="01" label="Pourquoi SPIMARIMMO" />
                {/* §01 North Star, stated as the opening editorial claim. */}
                <SplitTitle
                  as="h1"
                  className="normalTitle smaller"
                  text="SPIMARIMMO apporte aux promoteurs immobiliers marocains un accès mesurable, organisé et crédible à la demande MRE et internationale."
                />
                {/* §06 approved supporting message. */}
                <SplitTitle
                  className="smallTitle"
                  text="Nos salons réunissent une clientèle qualifiée, prête à concrétiser son projet immobilier au Maroc."
                />
                <div className="buttons">
                  <PillButton
                    href="/exposer/devenir-exposant"
                    label="Devenir exposant"
                    variant="dark"
                  />
                  {/* Real preview + download of the owner-supplied PDF
                      (D-026) instead of the resources placeholder route. */}
                  <BrochureTrigger variant="outline" />
                </div>
              </div>
              <div className="col"></div>
            </div>
          </div>
          <div className="projectsSection">
            {/* Reference header row: two columns of 684. Label and statement
                left, chapter marker and action right-aligned. */}
            <div className="cols" style={{ paddingBottom: "2.5vw" }}>
              <div className="col">
                <SectionEyebrow index="02" label="Salons par pays" />
                {/* Owner note (D-026): the statement reads in two lines, not
                    four — the second clause of the approved §07 sentence
                    carries the message alone. */}
                <SplitTitle
                  className="smallTitle"
                  text="Chaque destination réunit une clientèle qualifiée, prête à concrétiser son projet immobilier au Maroc."
                />
              </div>
              <div className="col">
                <div className="buttons">
                  <PillButton href="/salons" label="Voir tous les salons" variant="dark" />
                </div>
              </div>
            </div>
            <EventsCarousel events={EVENTS} />
          </div>
        </div>
        {/* The trust band lives inside the yellow block (owner direction,
            2026-08-05), in the row the bare logo marquee used to occupy. It
            draws no surface of its own so the yellow reads straight through
            it. */}
        <PromotersSection />
      </div>
    </section>
  );
}
