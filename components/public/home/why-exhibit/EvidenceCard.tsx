import type { EvidenceCardData } from "./why-exhibit-types";
import { WhyFlag, WhyIcon } from "./why-exhibit-icons";
import { EvidenceCardBody } from "./EvidenceCardBody";

/* One card shell for every variant: warm paper, 1px gold border, small
   rotation, header of icon + title + the reference's overflow dots. Only the
   interior changes per variant.

   Bodies that carry no accessible text of their own — an emblem, a roster of
   neutral rows, an empty form — are announced through the card's authored
   summary instead. Bodies that already carry a photograph's alt or real labels
   are left to speak for themselves rather than being announced twice. */
const OPAQUE_BODIES = new Set(["emblem", "roster", "checkRows", "form", "press"]);

export function EvidenceCard({ card, index }: { card: EvidenceCardData; index: number }) {
  return (
    <article
      className="whyCard"
      data-slot={card.slot}
      style={{ "--why-card-index": index } as React.CSSProperties}
    >
      <header className="whyCard__head">
        {/* Country cards lead with the code-native flag the reference shows;
            every other card leads with its line icon. */}
        {card.body.kind === "country" ? (
          <WhyFlag code={card.body.flag} className="whyCard__flag" />
        ) : (
          <span className="whyCard__icon" aria-hidden="true">
            <WhyIcon name={card.icon} />
          </span>
        )}
        <h4 className="whyCard__title">{card.title}</h4>
        <span className="whyCard__more" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </header>
      <div className="whyCard__body">
        <EvidenceCardBody body={card.body} />
      </div>
      {OPAQUE_BODIES.has(card.body.kind) && <p className="sr-only">{card.accessibleSummary}</p>}
    </article>
  );
}
