"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Editorial split-text reveal replicating the reference: text split into
   chars per row, chars translate up on inview with the observed voice
   (0.9s power2.out, small stagger). Falls back to static text for
   reduced motion. */
export function SplitTitle({
  text,
  as: Tag = "div",
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "div";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create(el, { type: "lines,chars", linesClass: "row" });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.to(split.chars, {
        yPercent: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.012,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={`${className} splitTitle`}>
      {text}
    </Tag>
  );
}
