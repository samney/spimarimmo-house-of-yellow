import type { MethodPhase } from "./method-types";

/* Card-center Y coordinates in reference pixels (stage-relative), matching
   the four measured cards (y 366/486/604/723, height ~103). The connector
   spine and branches are drawn in the same coordinate space as the stage so
   the SVG scales with it. */
const CARD_CENTERS = [131, 250, 368, 487];
const CARD_LEFT = 1159;
const DOSSIER_EDGE = 1064;
const SPINE_X = 1122;

/* Right-hand deliverable stack: four ivory cards with a neutral document
   thumbnail, real title and explicit status (never color-only — the check
   ring plus text carry it). Thin connectors map each card back to the
   dossier; they are decorative and hidden from assistive technology. */
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
                <span className="methodCard__thumb" aria-hidden="true">
                  <span
                    className="methodCard__thumbBar methodCard__thumbBar--gold"
                    style={{ inlineSize: "55%" }}
                  />
                  <span className="methodCard__thumbBar" />
                  <span className="methodCard__thumbBar" style={{ inlineSize: "80%" }} />
                  <span className="methodCard__thumbBar" style={{ inlineSize: "62%" }} />
                </span>
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
