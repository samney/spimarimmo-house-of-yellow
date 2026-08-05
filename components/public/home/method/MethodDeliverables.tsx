import Image from "next/image";
import type { MethodPhase } from "./method-types";

/* Connector geometry in the stage's own 1486 × 712 reference space. The SVG
   keeps that viewBox and stretches to the rendered stage — uniformly, since
   1436/1486 and 688/712 are the same ratio — so these stay valid after the
   section was inset to the 1436-wide page rhythm.

   The dossier figure occupies x 487…1107, y 2…602 in this space, at the
   artwork's 1:1 intrinsic scale, so artwork pixel (ax, ay) is stage
   (487 + ax, 2 + ay). */
const DOSSIER_X = 487;
const DOSSIER_Y = 2;

/* Where the artwork's OWN gold stubs leave the folder, measured by scanning
   the three supplied WebPs for gold in their right margin: all three phases
   put them at the same three points, which is what makes one connector layer
   valid for every phase.

   This is the crux of the "detached folder" defect. Earlier passes anchored
   the DOM paths at an arbitrary offset from each card, so the gold dots landed
   on blank folder instead of on the artwork's own stubs, and the network read
   as two unrelated drawings. */
const ARTWORK_STUBS = [
  { x: 595, y: 238 },
  { x: 577, y: 320 },
  { x: 562, y: 441 },
].map((s) => ({ x: DOSSIER_X + s.x, y: DOSSIER_Y + s.y }));

/* Card centres and the cards' left edge, measured off the live DOM. */
const CARD_CENTERS = [130, 249, 368, 487];
const CARD_LEFT = 1159;
/* The shared vertical trunk, in the gutter between figure and cards. */
const SPINE_X = 1130;
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
        {/* One trunk spanning every card, so the four runs read as a single
            network rather than four unrelated rules. */}
        <path d={`M ${SPINE_X} ${CARD_CENTERS[0]} V ${CARD_CENTERS[CARD_CENTERS.length - 1]}`} />

        {/* Folder side: each artwork stub continues into the trunk. */}
        {ARTWORK_STUBS.map((stub) => (
          <g key={`stub-${stub.y}`}>
            <path d={`M ${stub.x} ${stub.y} H ${SPINE_X}`} />
            <circle cx={stub.x} cy={stub.y} r={NODE_R} />
          </g>
        ))}

        {/* Card side: the trunk branches to each card's left edge. */}
        {CARD_CENTERS.map((y) => (
          <g key={`card-${y}`}>
            <path d={`M ${SPINE_X} ${y} H ${CARD_LEFT}`} />
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
