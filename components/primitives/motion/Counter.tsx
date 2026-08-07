"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, TRIGGER } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger);

/* Animated metric counter (reference: 2s count-up on inview).
   Locale-formatted thousands — de-DE dots by default (the reference's voice),
   fr-FR narrow spaces for SPIMAR figures — with an optional suffix so
   percentages and units ride the same count. */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  locale = "de-DE",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => Math.round(n).toLocaleString(locale);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = prefix + fmt(value) + suffix;
        return;
      }
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: DUR.count,
        ease: EASE.count,
        scrollTrigger: { trigger: el, start: TRIGGER.late, once: true },
        onUpdate: () => {
          el.textContent = prefix + fmt(obj.n) + suffix;
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
