import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { EventsCarousel, type EventOpportunity } from "./EventsCarousel";
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

/* Social proof — "Ils nous font confiance" (§14).

   Restored to the reference's `logoSection` marquee architecture. The previous
   occupant of this row was 32 House of Yellow client logos, which presented
   other companies' trademarks as SPIMARIMMO's clients; that content was the
   problem, not the component.

   The marks were previously set as type because their usage rights were not
   recorded. The owner has since supplied the logo files directly
   (`docs/assets-UX-UI/logoproof/`, mirrored to `public/promoters/`) and
   authorized them for this band (2026-08-04), so the reference component now
   runs the real logos, as it does below its own project cards. Section 12
   publishes the same set with the consent line, which is repeated here. */
const PARTNERS: readonly { slug: string; name: string; width: number; height: number }[] = [
  { slug: "prestigia", name: "Prestigia", width: 500, height: 230 },
  { slug: "saham-immobilier", name: "Saham Immobilier", width: 1200, height: 1054 },
  { slug: "addoha", name: "Addoha", width: 200, height: 107 },
  { slug: "coralia", name: "Coralia", width: 1136, height: 568 },
  { slug: "cgi", name: "CGI", width: 300, height: 300 },
];

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
          <div className="aboutSection">
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
                  <PillButton
                    href="/ressources"
                    label="Télécharger la brochure"
                    variant="outline"
                  />
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
                <SplitTitle
                  className="smallTitle"
                  text="Les salons SPIMARIMMO rendent le réseau international tangible : chaque destination réunit une clientèle qualifiée, prête à concrétiser son projet immobilier au Maroc."
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
        <div className="logoSection">
          <div className="contentWrapper">
            <div className="text smaller medium logoSection__label">Ils nous font confiance</div>
          </div>
          <div className="marquees" aria-hidden="true">
            <div className="marqueeWrapper">
              <div className="marquee" style={{ ["--marquee-duration" as string]: "40s" }}>
                <div className="marqueeScroll">
                  {[0, 1, 2, 3].map((copy) => (
                    <span className="itemsContainer" key={copy}>
                      {PARTNERS.map((partner) => (
                        <span className="partnerMark" key={partner.slug}>
                          <Image
                            alt=""
                            height={partner.height}
                            src={`/promoters/${partner.slug}.png`}
                            width={partner.width}
                          />
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* The marquee is decorative and hidden from assistive tech, so the
              partners are also listed once in text. */}
          <ul className="sr-only">
            {PARTNERS.map((partner) => (
              <li key={partner.slug}>{partner.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
