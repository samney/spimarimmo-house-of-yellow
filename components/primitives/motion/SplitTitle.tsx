"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, STAGGER, TRIGGER } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Editorial split-text reveal replicating the reference: text split into
   chars per row, chars translate up on inview with the observed voice
   (0.9s power2.out, small stagger). Falls back to static text for
   reduced motion. */
export function SplitTitle({
  text,
  as: Tag = "div",
  className = "",
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "div";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      /* SplitText's default aria handling writes aria-label onto the split
         element. That is permitted on headings but prohibited on a plain div
         (axe: aria-prohibited-attr), so div renders opt out — their char spans
         carry no aria attributes and read as continuous text. */
      const split = SplitText.create(el, {
        type: "lines,chars",
        linesClass: "row",
        aria: Tag === "div" ? "none" : "auto",
      });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.to(split.chars, {
        yPercent: 0,
        duration: DUR.stage,
        ease: EASE.out,
        stagger: STAGGER.dense,
        scrollTrigger: { trigger: el, start: TRIGGER.block, once: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={`${className} splitTitle`} id={id}>
      {text}
    </Tag>
  );
}
