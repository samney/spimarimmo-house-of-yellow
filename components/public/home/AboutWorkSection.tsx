import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { StandCluster } from "./StandCluster";
import { EventsCarousel, type EventOpportunity } from "./EventsCarousel";

/* The works -> Salons par pays (specification §05, §07).

   The section keeps its foundation direction exactly: the same
   `projectsSection` treatment, the same `hoyCols` header of side label /
   statement / numbered chapter marker, the same card row, and cards with the
   same media plane, tag chip, title and two stats. Only the content changes,
   from featured project to event destination.

   Content discipline, from §07 and §19:
   - Country, city and status come from the specification.
   - Date, venue and expected-visitor counts must never appear unvalidated, so
     those stats state their readiness instead of carrying a figure.
   - Ordering follows §07: upcoming editions first, historical last. */

const EVENTS: EventOpportunity[] = [
  { slug: "paris", country: "France", city: "Paris", status: "prochaine-edition" },
  { slug: "bruxelles", country: "Belgique", city: "Bruxelles", status: "prochaine-edition" },
  { slug: "laval", country: "Canada", city: "Laval", status: "prochaine-edition" },
  {
    slug: "abu-dhabi",
    country: "Émirats Arabes Unis",
    city: "Abu Dhabi",
    status: "prochaine-edition",
  },
  { slug: "londres", country: "Royaume-Uni", city: "Londres", status: "a-venir" },
  { slug: "montreal", country: "Canada", city: "Montréal", status: "historique" },
];

/* Social proof — "Ils nous font confiance" (§14).

   Restored to the reference's `logoSection` marquee architecture. The previous
   occupant of this row was 32 House of Yellow client logos, which presented
   other companies' trademarks as SPIMARIMMO's clients; that content was the
   problem, not the component.

   These partners are named in the approved SPIMARIMMO design reference under
   "Ils nous font confiance", so the relationships are evidenced. They are set
   as wordmarks rather than logo files: the partners' marks are third-party
   trademarks whose usage rights are not recorded, and §14 requires logos to be
   CMS-managed with an approval state. The approved reference sets them as type
   too. Real marks replace these once rights are cleared. */
const PARTNERS = ["Prestigia", "Saham Immobilier", "Addoha", "Coralia", "CGI"];

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
              <div className="col">
                <div className="text smaller medium">Pourquoi SPIMARIMMO</div>
              </div>
              <div className="col">
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
              <div className="col">
                <div className="text medium">
                  [ <span className="numIndex">01</span> ]
                </div>
              </div>
            </div>
            <StandCluster />
          </div>
          <div className="projectsSection">
            {/* Reference header row: two columns of 684. Label and statement
                left, chapter marker and action right-aligned. */}
            <div className="cols" style={{ paddingBottom: "2.5vw" }}>
              <div className="col">
                <div className="text smaller medium">Salons par pays</div>
                <SplitTitle
                  className="smallTitle"
                  text="Les salons SPIMARIMMO rendent le réseau international tangible : chaque destination réunit une clientèle qualifiée, prête à concrétiser son projet immobilier au Maroc."
                />
              </div>
              <div className="col">
                <div className="text medium">
                  [ <span className="numIndex">02</span> ]
                </div>
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
                      {PARTNERS.map((name) => (
                        <span className="partnerMark" key={name}>
                          {name}
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
            {PARTNERS.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
