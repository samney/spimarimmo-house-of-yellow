"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { METHOD_CONTENT } from "./method-content";
import { isMethodPhaseId, METHOD_PHASE_IDS, type MethodPhaseId } from "./method-types";
import { MethodIntroduction } from "./MethodIntroduction";
import { MethodStage } from "./MethodStage";

/* Section 04 — "Notre méthode".

   One canonical `activePhase` drives the rail, the copy column, the dossier
   layers, the status rail, the deliverables and the footer journey — the three
   approved screens are one locked interaction system, not three compositions
   (specs/04_INTERACTION_AND_MOTION_CONTRACT.md).

   `initialPhase` + `staticRender` exist for the deterministic visual-test
   state: the /__visual/method harness renders one stable phase end frame with
   every transition disabled. Production ignores both and starts at "before".

   Deep linking: `?methodPhase=` is read once on mount (spec 04 URL-state
   requirement). It is applied through the same setter as every other input so
   scroll, click, keyboard and URL never own competing states. */
/* When this section IS the page, its heading is the document's only heading
   and must be an `h1` — A-02 measured five such routes rendering no `h1` at
   all. Under the homepage hero it stays an `h2`. */
export function MethodSection({
  initialPhase = "before",
  staticRender = false,
  headingLevel = "h2",
}: {
  initialPhase?: MethodPhaseId;
  staticRender?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const [activePhase, setActivePhase] = useState<MethodPhaseId>(initialPhase);
  const headingId = useId();
  const sectionRef = useRef<HTMLElement | null>(null);

  /* Entrance choreography (owner direction, 2026-08-06): the dossier deals
     its documents into place when the section scrolls into view. "pending"
     holds the animated pieces invisible, "run" plays the keyframes; both live
     on a data attribute so the CSS carries the whole choreography. JS-gated
     on purpose: without JS the attribute never appears and the section
     renders complete, reduced motion never enters the state machine, and the
     visual-test harness stays deterministic. */
  const [animState, setAnimState] = useState<"idle" | "pending" | "run">("idle");
  useEffect(() => {
    if (staticRender) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    if (!section) return;
    setAnimState("pending");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setAnimState("run");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [staticRender]);

  useEffect(() => {
    if (staticRender) return;
    const requested = new URLSearchParams(window.location.search).get("methodPhase");
    if (!isMethodPhaseId(requested)) return;
    /* Deferred one frame: applying a deep link is an external event, not a
       render adjustment, and the sync-setState-in-effect rule rightly forbids
       the latter. */
    const frame = requestAnimationFrame(() => setActivePhase(requested));
    return () => cancelAnimationFrame(frame);
  }, [staticRender]);

  const goToNextPhase = useCallback(() => {
    setActivePhase((current) => {
      const index = METHOD_PHASE_IDS.indexOf(current);
      return METHOD_PHASE_IDS[Math.min(index + 1, METHOD_PHASE_IDS.length - 1)];
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="methode"
      className="methodSection"
      aria-labelledby={headingId}
      data-static={staticRender ? "true" : undefined}
      data-method-phase={activePhase}
      data-anim={animState === "idle" ? undefined : animState}
    >
      <MethodIntroduction
        content={METHOD_CONTENT}
        headingId={headingId}
        headingLevel={headingLevel}
      />
      <MethodStage
        content={METHOD_CONTENT}
        activePhase={activePhase}
        onSelectPhase={setActivePhase}
        onNextPhase={goToNextPhase}
      />
    </section>
  );
}
