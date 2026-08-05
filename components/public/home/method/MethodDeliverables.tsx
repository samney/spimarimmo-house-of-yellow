import Image from "next/image";
import type { MethodPhase } from "./method-types";

/* Connector geometry in the stage's own 1486 × 712 reference space. The SVG
   keeps that viewBox and stretches to the rendered stage, so these stay valid
   after the section was inset to the 1436-wide page rhythm.

   All four values are measured off the live DOM, not guessed: card centres sit
   at y 130/249/368/487 and the cards' left edge at x 1160. `DOSSIER_EDGE` is
   the dossier figure's right edge (x 1107) — it must not sit inside the
   artwork, or the gold paths are drawn across the pen and the paper stack. */
const CARD_CENTERS = [130, 249, 368, 487];
const CARD_LEFT = 1160;
const DOSSIER_EDGE = 1107;
const SPINE_X = 1134;

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
            <path
              d={`M ${DOSSIER_EDGE} ${y + 18} L ${SPINE_X} ${y + 18} L ${SPINE_X} ${y} L ${CARD_LEFT} ${y}`}
            />
            <circle cx={DOSSIER_EDGE} cy={y + 18} r="3.5" />
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
