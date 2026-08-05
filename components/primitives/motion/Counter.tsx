"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, TRIGGER } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger);

/* Animated metric counter (reference: 2s count-up on inview).
   Formats with the site's dotted thousands (e.g. 2.600.000). */
export function Counter({
  value,
  prefix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = prefix + fmt(value);
        return;
      }
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: DUR.count,
        ease: EASE.count,
        scrollTrigger: { trigger: el, start: TRIGGER.late, once: true },
        onUpdate: () => {
          el.textContent = prefix + fmt(obj.n);
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0
    </span>
  );
}
