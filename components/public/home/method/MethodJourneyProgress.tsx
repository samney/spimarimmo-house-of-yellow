"use client";

import type { MethodPhase } from "./method-types";

/* Footer journey rail: the three phase labels stay visible across all
   phases; the active one is gold, completed ones take the restrained check
   treatment (specs/03, "Footer journey"). "Phase suivante" advances the same
   canonical state as every other control; after Phase 03 it disappears
   (spec 04 allows hidden-or-final-CTA — the final-CTA variant belongs to the
   Phase 02/03 visual gate). */
export function MethodJourneyProgress({
  phases,
  activeIndex,
  onNextPhase,
}: {
  phases: MethodPhase[];
  activeIndex: number;
  onNextPhase: () => void;
}) {
  const progress = phases.length > 1 ? activeIndex / (phases.length - 1) : 0;

  return (
    <nav className="methodJourney" aria-label="Progression de la méthode">
      <div className="methodJourney__track" aria-hidden="true">
        <span className="methodJourney__trackFill" style={{ inlineSize: `${progress * 100}%` }} />
      </div>
      <ol className="methodJourney__steps">
        {phases.map((phase, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          return (
            <li
              key={phase.id}
              className={`methodJourney__step${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              {isDone ? (
                <span aria-hidden="true">✓</span>
              ) : (
                <span aria-hidden="true">{phase.number}</span>
              )}
              <span>
                {phase.journeyLabel}
                {isDone && <span className="sr-only"> (terminée)</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {activeIndex < phases.length - 1 && (
        <button type="button" className="methodJourney__next" onClick={onNextPhase}>
          <span>Phase suivante</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </nav>
  );
}
