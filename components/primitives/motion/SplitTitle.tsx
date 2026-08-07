"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, STAGGER, TRIGGER } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Editorial split-text reveal replicating the reference in detail (owner
   correction, 2026-08-07 — the earlier 0.9s per-char lift read as slow and
   heavy; the reference's own recipe, preserved verbatim in the legacy
   `.split-reveal` CSS, is masked rows rising in 0.45s ease-out):

   - `mode="chars"` (headings): each character rises fast inside its masked
     line with a tight left-to-right cascade — a heading sweeps in well
     under a second.
   - `mode="lines"` (leads, subtitles, body): whole lines rise inside their
     masks with a short stagger — the same voice at paragraph scale.

   SplitText's own `mask` wrapper does the clipping, so no companion CSS is
   required. Falls back to static text for reduced motion. */
export function SplitTitle({
  text,
  as: Tag = "div",
  className = "",
  id,
  mode = "chars",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  id?: string;
  mode?: "chars" | "lines";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const isHeading = Tag === "h1" || Tag === "h2" || Tag === "h3";
      /* SplitText's default aria handling writes aria-label onto the split
         element. That is permitted on headings but prohibited on generic
         text containers (axe: aria-prohibited-attr), so p/div renders opt
         out — their spans carry no aria attributes and read as continuous
         text. */
      const split = SplitText.create(el, {
        type: mode === "chars" ? "lines,chars" : "lines",
        linesClass: "row",
        mask: "lines",
        aria: isHeading ? "auto" : "none",
      });
      const targets = mode === "chars" ? split.chars : split.lines;
      gsap.set(targets, { yPercent: 110 });
      gsap.to(targets, {
        yPercent: 0,
        duration: DUR.reveal,
        ease: EASE.out,
        stagger: mode === "chars" ? STAGGER.dense : 0.08,
        scrollTrigger: { trigger: el, start: TRIGGER.block, once: true },
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [mode] },
  );

  return (
    <Tag ref={ref as never} className={`${className} splitTitle`} id={id}>
      {text}
    </Tag>
  );
}
