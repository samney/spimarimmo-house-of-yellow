import Image from "next/image";
import type { MethodPhase } from "./method-types";

/* Connector geometry in the stage's own 1486 × 712 reference space. The SVG
   keeps that viewBox and stretches to the rendered stage — uniformly, since
   1436/1486 and 688/712 are the same ratio — so these stay valid after the
   section was inset to the 1436-wide page rhythm.

   Card centres (y) and the cards' left edge (x) are measured off the live DOM.

   `DOSSIER_ANCHOR` deliberately sits *inside* the figure's right margin rather
   than on its outer edge: the artwork carries its own gold nodes and dashes
   there, and the DOM paths have to meet them or the folder reads as unlinked
   from the deliverables. Anchoring to the outer edge (1107) leaves a dead gap. */
const CARD_CENTERS = [130, 249, 368, 487];
const CARD_LEFT = 1159;
const DOSSIER_ANCHOR = 1064;
const SPINE_X = 1122;
/* Vertical drop from a card's centre to where its path leaves the dossier —
   what gives the network its staircase read instead of four parallel rules. */
const ANCHOR_DROP = 18;
const NODE_R = 4;

/* Right-hand deliverable stack: four ivory cards, each carrying the supplied
   112 × 80 preview artwork for that deliverable (repair v2 ASSET_MANIFEST.md —
   the previous neutral bar stack made all four cards interchangeable, and
   Lucide-style icons are explicitly forbidden as a substitute).

   The preview is decorative: title and status stay DOM text and are never
   baked into the raster. Status is never color-only — the check ring plus the
   word carry it. Thin connectors map each card back to the dossier and are
   hidden from assistive technology. */
export function MethodDeliverables({ phase }: { phase: MethodPhase }) {
  return (
    <>
      <svg
        className="methodConnectors"
        viewBox="0 0 1486 712"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {CARD_CENTERS.map((y, i) => (
          <g key={i}>
            <path d={`M ${DOSSIER_ANCHOR} ${y + ANCHOR_DROP} H ${SPINE_X} V ${y} H ${CARD_LEFT}`} />
            {/* A node at each end, as in the reference: the run has to read as
                a link between two objects, not as a line trailing off. */}
            <circle cx={DOSSIER_ANCHOR} cy={y + ANCHOR_DROP} r={NODE_R} />
            <circle cx={CARD_LEFT} cy={y} r={NODE_R} />
          </g>
        ))}
      </svg>
      <aside className="methodDeliverables" aria-label={phase.deliverablesHeading}>
        <h4 className="methodDeliverables__heading">{phase.deliverablesHeading}</h4>
        <ul className="methodDeliverables__list">
          {phase.deliverables.map((deliverable, i) => {
            /* "Planifié" / "À activer" close each stack as the still-pending
               state; its ring stays empty (dashed) instead of checked. */
            const pending = i === phase.deliverables.length - 1;
            return (
              <li className="methodCard" key={deliverable.id}>
                <Image
                  className="methodCard__thumb"
                  src={deliverable.previewSrc}
                  width={112}
                  height={80}
                  alt=""
                  sizes="112px"
                />
                <span>
                  <span className="methodCard__title">{deliverable.title}</span>
                  <span className="methodCard__status">
                    <span
                      className={`methodCard__statusIcon${pending ? " methodCard__statusIcon--pending" : ""}`}
                      aria-hidden="true"
                    >
                      {pending ? "" : "✓"}
                    </span>
                    {deliverable.status}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="methodDeliverables__annotation">{phase.annotation}</p>
      </aside>
    </>
  );
}
