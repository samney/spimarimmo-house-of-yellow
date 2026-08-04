import type { Scene, SupportSheet } from "../why-exhibit-types";
import { WhyIcon } from "../why-exhibit-icons";
import { SceneBars, SceneImage } from "./scene-parts";

/* The document thumbnail beside a deliverable row. Paper sheets are layout bars
   only; image sheets use the mapped photograph or the stand-plan render. */
function Sheet({ sheet }: { sheet: SupportSheet }) {
  if (sheet.kind === "image") {
    return (
      <span className="whyDeliver__sheet whyDeliver__sheet--image">
        <SceneImage image={sheet.image} />
      </span>
    );
  }
  if (sheet.kind === "chart") {
    return (
      <span className="whyDeliver__sheet whyDeliver__sheet--chart" aria-hidden="true">
        <svg viewBox="0 0 60 34" className="whyDeliver__chart">
          {[10, 18, 12, 24, 16, 28, 20].map((h, i) => (
            <rect key={i} x={4 + i * 8} y={30 - h} width="4.5" height={h} rx="1" />
          ))}
        </svg>
        <SceneBars widths={[70, 46]} />
      </span>
    );
  }
  return (
    <span
      className={`whyDeliver__sheet whyDeliver__sheet--paper is-cols-${sheet.columns}`}
      aria-hidden="true"
    >
      <SceneBars widths={[100, 82, 94, 70, 88]} />
      {sheet.columns === 2 && <SceneBars widths={[100, 76, 92, 84, 66]} />}
    </span>
  );
}

/* Tab 04 — the deliverable ledger. Each row states its approved status word;
   the legend below maps the three markers so status is never colour-only. */
export function SupportScene({ scene }: { scene: Extract<Scene, { kind: "support" }> }) {
  return (
    <div className="whyDeliverables">
      <ol className="whyDeliver__rows">
        {scene.deliverables.map((item) => (
          <li key={item.title} className="whyDeliver__row">
            <span className="whyDeliver__node" aria-hidden="true" />
            <span className="whyDeliver__icon" aria-hidden="true">
              <WhyIcon name={item.icon} />
            </span>
            <span className="whyDeliver__text">
              <span className="whyDeliver__title">{item.title}</span>
              <span className="whyDeliver__status">{item.status}</span>
            </span>
            <Sheet sheet={item.sheet} />
          </li>
        ))}
      </ol>
      <div className="whyDeliver__legend">
        {scene.legend.map((entry) => (
          <span key={entry.label} className="whyDeliver__legendItem">
            <span
              className={`whyDeliver__marker whyDeliver__marker--${entry.marker}`}
              aria-hidden="true"
            >
              {entry.marker === "done" && <WhyIcon name="check" />}
            </span>
            {entry.label}
          </span>
        ))}
      </div>
    </div>
  );
}
