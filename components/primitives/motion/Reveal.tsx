"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DUR, EASE, REVEAL_SHIFT, STAGGER } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger);

/* Scroll reveal for a block and its parts.

   Replaces `Inview`, which set an `.inview` class that CSS reacted to. That
   design had two faults this one does not:

   1. The pre-reveal state lived in CSS (`opacity: 0`), so if the observer
      never ran — as happened for the whole of this repository's life, because
      `Inview` was mounted nowhere — the content was one selector away from
      being invisible. Here the DOM's natural state IS the end state and GSAP
      animates *from* an offset, so no-JS and no-GSAP both render finished
      content.
   2. It was a second motion engine. The site already drives `SplitTitle`,
      `Counter` and section 03 with `useGSAP` + `ScrollTrigger`; this makes it
      one engine everywhere.

   Targets are explicit: descendants marked `data-reveal`, or the element's own
   children if none are marked. Nothing is inferred from class names, so a
   restyle cannot silently detach the choreography.

   Reduced motion is not a degraded animation — it is no animation. The
   `matchMedia` branch simply never creates the tween, and the content is
   already in its end state. */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  /** Viewport position at which the block begins revealing. */
  start = "top 85%",
  /** Seconds between siblings. */
  stagger = STAGGER.step,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  start?: string;
  stagger?: number;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const marked = el.querySelectorAll<HTMLElement>("[data-reveal]");
      const targets = marked.length
        ? Array.from(marked)
        : (Array.from(el.children) as HTMLElement[]);
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(targets, {
          y: REVEAL_SHIFT,
          opacity: 0,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [start, stagger] },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
