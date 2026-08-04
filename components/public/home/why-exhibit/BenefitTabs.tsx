"use client";

import { useRef } from "react";
import type { Benefit, BenefitId } from "./why-exhibit-types";

export function benefitTabId(panelId: string, id: BenefitId) {
  return `${panelId}-tab-${id}`;
}

/* The four-part rail. Selection is never colour-only: the active track fills,
   its number and label switch to white, a gold indicator dot sits under it and
   `aria-selected` carries the state programmatically.

   Keyboard follows the repository's rail pattern (method section): Left/Right
   move, Home/End jump, roving tabindex keeps one stop in the tab order. */
export function BenefitTabs({
  benefits,
  activeBenefit,
  onSelectBenefit,
  label,
  panelId,
}: {
  benefits: Benefit[];
  activeBenefit: BenefitId;
  onSelectBenefit: (id: BenefitId) => void;
  label: string;
  panelId: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusAndSelect = (index: number) => {
    const next = (index + benefits.length) % benefits.length;
    refs.current[next]?.focus();
    onSelectBenefit(benefits[next].id);
  };

  return (
    <div className="whyTabs" role="tablist" aria-label={label}>
      {benefits.map((benefit, i) => {
        const isActive = benefit.id === activeBenefit;
        return (
          <button
            key={benefit.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={benefitTabId(panelId, benefit.id)}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            className={`whyTab${isActive ? " is-active" : ""}`}
            onClick={() => onSelectBenefit(benefit.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                focusAndSelect(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                focusAndSelect(i - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusAndSelect(0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusAndSelect(benefits.length - 1);
              }
            }}
          >
            <span className="whyTab__num">{benefit.number}</span>
            <span className="whyTab__label">{benefit.tabLabel}</span>
            <span className="whyTab__dot" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
