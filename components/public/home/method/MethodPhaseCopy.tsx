import { Link } from "@/i18n/navigation";
import type { MethodPhase } from "./method-types";

/* The phase copy column: oversized gold numeral, phase heading, supporting
   body, mechanism chips and the contextual CTA. All real DOM text. */
export function MethodPhaseCopy({ phase }: { phase: MethodPhase }) {
  const words = phase.title.split(" ");
  const firstLine = words.slice(0, phase.titleBreakAfterWord).join(" ");
  const secondLine = words.slice(phase.titleBreakAfterWord).join(" ");
  return (
    <div
      className="methodCopy"
      role="tabpanel"
      id="method-phase-panel"
      aria-labelledby={`method-tab-${phase.id}`}
    >
      <p className="methodCopy__number" aria-hidden="true">
        {phase.number}
      </p>
      {/* The space before the break keeps the accessible text one phrase:
          without it, textContent runs the words together. */}
      <h3 className="methodCopy__title">
        {firstLine} <br />
        {secondLine}
      </h3>
      <p className="methodCopy__body">{phase.description}</p>
      <ul className="methodCopy__chips">
        {phase.mechanisms.map((mechanism) => (
          <li className="methodCopy__chip" key={mechanism}>
            {mechanism}
          </li>
        ))}
      </ul>
      <Link className="methodCopy__cta" href={phase.contextualCta.href}>
        <span>{phase.contextualCta.label}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
