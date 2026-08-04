import type { Benefit } from "./why-exhibit-types";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceConnectors } from "./EvidenceConnectors";
import { EvidencePhone } from "./EvidencePhone";

/* The bounded evidence stage. This is the only place in the section where
   absolute positioning is used: coordinates are relative to this canvas, never
   to the viewport, and the canvas itself stays in document flow.

   Card slots are named in CSS, so a benefit can change which card sits where
   without any component learning about pixels. */
export function EvidenceCanvas({ benefit }: { benefit: Benefit }) {
  return (
    <div className="whyCanvas">
      <EvidenceConnectors />
      <div className="whyCanvas__cards">
        {benefit.evidence.map((card, index) => (
          <EvidenceCard key={`${benefit.id}-${card.id}`} card={card} index={index} />
        ))}
      </div>
      <EvidencePhone benefit={benefit} />
    </div>
  );
}
