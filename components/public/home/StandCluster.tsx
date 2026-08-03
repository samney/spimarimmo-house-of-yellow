"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpimarStandGlyph } from "@/components/public/global/logos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Decorative glyph cluster for the "Pourquoi SPIMARIMMO" section.

   This reproduces the reference's `.animation` device architecture exactly:
   a square block offset into the right of the column band, an inner square
   centred by top/left 50% plus a -50% translate, and three absolutely-centred
   glyph wrappers that differ only in scale and delay. Measured from the
   reference at 1440: block 328.5px, inner 234px, wrappers 35.09 / 24.30 / 18px,
   with `data-scroll-speed="2"` driving a parallax offset.

   The reference stagger comes from per-wrapper `data-delay` and
   `data-position-factor` attributes; those are preserved as props here so the
   ratios stay legible rather than being buried in the timeline.

   Motion is decorative only — it carries no content and no state, so under
   reduced motion the cluster simply renders static. */

const WRAPPERS = [
  { size: 35.0938, delay: 0.6, positionFactor: 1 },
  { size: 24.2969, delay: 0.3, positionFactor: 0.6 },
  { size: 18, delay: 0, positionFactor: 0.3 },
];

export function StandCluster() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = root.current;
      if (!el) return;

      // Parallax, matching the reference's data-scroll-speed="2".
      gsap.to(el, {
        y: 60,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Staggered breathing on the glyphs, ordered by the reference delays.
      gsap.utils.toArray<HTMLElement>(".standCluster__glyph", el).forEach((glyph, i) => {
        gsap.fromTo(
          glyph,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            delay: WRAPPERS[i]?.delay ?? 0,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div className="animation standCluster" ref={root} aria-hidden="true">
      <div className="innerAnimation">
        {WRAPPERS.map((w) => (
          <div
            key={w.size}
            className="svgWrapper standCluster__glyph"
            style={{ width: `${w.size}px`, height: `${w.size}px` }}
            data-position-factor={w.positionFactor}
          >
            <SpimarStandGlyph />
          </div>
        ))}
      </div>
    </div>
  );
}
