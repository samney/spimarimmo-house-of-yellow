import { Marquee } from "@/components/primitives/motion/Marquee";
import { MethodArrowIcon } from "./method-icons";
import type { MethodPhase } from "./method-types";

/* The phase copy column: oversized gold numeral, phase heading, supporting
   body, mechanism chips and the contextual CTA. All real DOM text.

   The CTA is the repository's `.button` in its `outline` variant: the intro
   already carries the section's filled primary, and two identical yellow pills
   would flatten the hierarchy the user reads down the page. Only the outline's
   ink is re-tinted section-locally, because the stage is obsidian and the
   global variant is drawn for paper.

   The reference draws an underlined text link; the design system outranks it,
   exactly as it did for section 03's benefit CTA. */
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
      {/* Staged to "#" (owner note, D-026) until the destinations are
          validated; the refined outline pill stays. */}
      <span className="methodCopy__actions">
        <a
          className="button outline methodCopy__cta"
          href={phase.contextualCta.href}
          title={phase.contextualCta.label}
        >
          <span className="label">
            <span className="fixedLabel">{phase.contextualCta.label}</span>
            <span className="innerLabel">
              <Marquee text={phase.contextualCta.label} direction="left" speed={90} />
            </span>
          </span>
          <span className="icon">
            <MethodArrowIcon />
          </span>
        </a>
      </span>
    </div>
  );
}
