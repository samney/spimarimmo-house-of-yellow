"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { WHY_EXHIBIT_CONTENT } from "./why-exhibit-content";
import { isBenefitId, type BenefitId } from "./why-exhibit-types";
import { WhyExhibitHeader } from "./WhyExhibitHeader";
import { BenefitTabs } from "./BenefitTabs";
import { BenefitStage } from "./BenefitStage";

/* Section 03 — "Pourquoi exposer avec SPIMARIMMO ?".

   One canonical `activeBenefit` drives the tab rail, the copy column, the phone
   scene, the evidence cards, the connectors and the proof line. The four
   approved references are one stateful section, not four compositions
   (PIXEL_PARITY_SPEC.md, "Required component model").

   `initialBenefit` + `staticRender` exist for the deterministic visual-test
   state: /visual-test/why-exhibit renders one stable end frame with every
   transition disabled. Production ignores both and starts at 01.

   Deep linking: `?benefit=` is read once on mount and written back on selection
   through the native History API, so the query follows the tab without a
   navigation or a reload. */
export function WhyExhibitSection({
  initialBenefit = "qualified",
  staticRender = false,
}: {
  initialBenefit?: BenefitId;
  staticRender?: boolean;
}) {
  const [activeBenefit, setActiveBenefit] = useState<BenefitId>(initialBenefit);
  const headingId = useId();
  const panelId = useId();

  useEffect(() => {
    if (staticRender) return;
    const requested = new URLSearchParams(window.location.search).get("benefit");
    if (!isBenefitId(requested)) return;
    /* Deferred one frame: applying a deep link is an external event, not a
       render adjustment, and the sync-setState-in-effect rule forbids the
       latter. */
    const frame = requestAnimationFrame(() => setActiveBenefit(requested));
    return () => cancelAnimationFrame(frame);
  }, [staticRender]);

  const selectBenefit = useCallback(
    (id: BenefitId) => {
      setActiveBenefit(id);
      if (staticRender) return;
      const url = new URL(window.location.href);
      url.searchParams.set("benefit", id);
      /* pushState, not router.push: the section state is a view selection, not
         a navigation — this keeps the back button meaningful without asking
         the server for the route again. */
      window.history.pushState(null, "", url);
    },
    [staticRender],
  );

  /* Back/forward must land on the tab the URL names. */
  useEffect(() => {
    if (staticRender) return;
    const onPopState = () => {
      const requested = new URLSearchParams(window.location.search).get("benefit");
      setActiveBenefit(isBenefitId(requested) ? requested : "qualified");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [staticRender]);

  const content = WHY_EXHIBIT_CONTENT;
  const benefit = content.benefits.find((b) => b.id === activeBenefit) ?? content.benefits[0];

  return (
    <section
      id="pourquoi-exposer"
      className="whyExhibit"
      aria-labelledby={headingId}
      data-benefit={benefit.id}
      data-static={staticRender ? "true" : undefined}
    >
      <div className="whyExhibit__inner">
        <WhyExhibitHeader content={content} benefit={benefit} headingId={headingId} />
        <BenefitTabs
          benefits={content.benefits}
          activeBenefit={benefit.id}
          onSelectBenefit={selectBenefit}
          label={content.tablistLabel}
          panelId={panelId}
        />
        <BenefitStage benefit={benefit} panelId={panelId} staticRender={staticRender} />
      </div>
    </section>
  );
}
