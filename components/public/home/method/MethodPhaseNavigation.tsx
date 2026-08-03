"use client";

import { useRef } from "react";
import type { MethodPhase, MethodPhaseId } from "./method-types";

/* Vertical phase rail: an accessible tablist with three nodes carrying
   complete / active / inactive states. Active is never color-only — the node
   fills, the check appears on completed phases, and aria-selected carries the
   state programmatically (specs/05, "Semantic structure"). Keyboard follows
   the repository's pillarTabs pattern: arrows move, Home/End jump, roving
   tabindex keeps one stop in the tab order. */
export function MethodPhaseNavigation({
  phases,
  activePhase,
  onSelectPhase,
}: {
  phases: MethodPhase[];
  activePhase: MethodPhaseId;
  onSelectPhase: (phase: MethodPhaseId) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = phases.findIndex((p) => p.id === activePhase);

  const focusAndSelect = (index: number) => {
    const next = (index + phases.length) % phases.length;
    refs.current[next]?.focus();
    onSelectPhase(phases[next].id);
  };

  return (
    <div
      className="methodRail"
      role="tablist"
      aria-label="Phases de la méthode"
      aria-orientation="vertical"
    >
      {phases.map((phase, i) => {
        const isActive = phase.id === activePhase;
        const isDone = i < activeIndex;
        return (
          <button
            key={phase.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`method-tab-${phase.id}`}
            aria-selected={isActive}
            aria-controls="method-phase-panel"
            tabIndex={isActive ? 0 : -1}
            className={`methodRail__item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
            onClick={() => onSelectPhase(phase.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                focusAndSelect(i + 1);
              } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                focusAndSelect(i - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusAndSelect(0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusAndSelect(phases.length - 1);
              }
            }}
          >
            <span className="methodRail__node" aria-hidden="true">
              {isDone ? "✓" : ""}
            </span>
            <span>
              <span className="methodRail__num">{phase.number}</span>
              <span className="methodRail__label">{phase.label}</span>
              {isDone && <span className="sr-only"> (terminée)</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
