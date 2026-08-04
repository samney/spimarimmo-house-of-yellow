"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Benefit } from "./why-exhibit-types";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceConnectors } from "./EvidenceConnectors";
import { EvidencePhone } from "./EvidencePhone";

gsap.registerPlugin(ScrollTrigger);

/* The bounded evidence stage. This is the only place in the section where
   absolute positioning is used: coordinates are relative to this canvas, never
   to the viewport, and the canvas itself stays in document flow.

   Choreography (owner direction, 2026-08-04): scrolling into the section brings
   the device up first; the evidence cards are then thrown out from behind it to
   their slots; the connector network draws last; the cards keep breathing after
   they land. Changing tab replays the throw for the new cards only — the device
   never moves, so the composition never jumps.

   Every tween is created inside `useGSAP` scoped to this canvas, so React
   unmount reverts them and kills their ScrollTriggers. `gsap.matchMedia`
   carries the reduced-motion and small-viewport branches: reduced motion gets
   the end state immediately with no drawing and no breathing, and below the
   desktop regime the corridors the throw depends on do not exist, so the cards
   simply rise into place. */
export function EvidenceCanvas({
  benefit,
  staticRender,
}: {
  benefit: Benefit;
  staticRender: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  /* First pass plays the full scroll-in; later passes replay the card throw
     only, because the device is already on stage. */
  const hasIntroPlayed = useRef(false);

  useGSAP(
    () => {
      if (staticRender) return;
      const canvas = root.current;
      if (!canvas) return;

      const phone = canvas.querySelector<HTMLElement>("[data-why-phone]");
      const cards = gsap.utils.toArray<HTMLElement>(".whyCard", canvas);
      const paths = gsap.utils.toArray<SVGPathElement>("[data-why-path]", canvas);
      const nodes = gsap.utils.toArray<SVGCircleElement>("[data-why-node]", canvas);
      if (!phone || cards.length === 0) return;

      /* Where each card starts: the device's centre, so it reads as thrown out
         from behind the screen. Measured from layout rather than assumed, so a
         slot change never desynchronises the motion. */
      const originOf = (card: HTMLElement) => {
        const p = phone.getBoundingClientRect();
        const c = card.getBoundingClientRect();
        return {
          x: p.left + p.width / 2 - (c.left + c.width / 2),
          y: p.top + p.height / 2 - (c.top + c.height / 2),
        };
      };

      /* Small, slow, out-of-phase drift so the composition stays alive without
         ever reading as movement for its own sake. */
      const startBreathing = () => {
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 === 0 ? "+=7" : "-=7",
            duration: 3.2 + (i % 3) * 0.45,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.22,
          });
        });
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
          compact: "(max-width: 1279px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, compact, reduced } = context.conditions as Record<string, boolean>;

          if (reduced) {
            gsap.set([phone, ...cards], { clearProps: "all" });
            gsap.set(paths, { strokeDashoffset: 0 });
            hasIntroPlayed.current = true;
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: canvas,
              start: "top 78%",
              once: true,
            },
            onComplete: () => {
              hasIntroPlayed.current = true;
              startBreathing();
            },
          });

          if (!hasIntroPlayed.current) {
            tl.from(phone, {
              yPercent: 8,
              scale: 0.94,
              opacity: 0,
              duration: 0.85,
              ease: "power3.out",
            });
          }

          if (desktop) {
            tl.from(
              cards,
              {
                x: (_i, target: HTMLElement) => originOf(target).x,
                y: (_i, target: HTMLElement) => originOf(target).y,
                scale: 0.5,
                opacity: 0,
                rotate: (i: number) => (i % 2 === 0 ? -7 : 7),
                duration: 0.9,
                ease: "back.out(1.25)",
                stagger: { each: 0.085, from: "center" },
              },
              hasIntroPlayed.current ? 0 : "-=0.42",
            );
          }

          if (compact) {
            tl.from(
              cards,
              { y: 34, opacity: 0, duration: 0.55, ease: "power2.out", stagger: 0.07 },
              hasIntroPlayed.current ? 0 : "-=0.35",
            );
          }

          if (paths.length) {
            tl.from(
              paths,
              { strokeDashoffset: 640, duration: 0.7, ease: "power1.inOut", stagger: 0.08 },
              "-=0.35",
            ).from(
              nodes,
              { scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.06 },
              "<",
            );
          }

          return () => {
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [benefit.id, staticRender] },
  );

  return (
    <div className="whyCanvas" ref={root}>
      {/* Branded depth: a warm glow anchored on the device and a fine dot field
          behind the corridors. Both are paint only. */}
      <span className="whyCanvas__glow" aria-hidden="true" />
      <EvidenceConnectors />
      <div className="whyCanvas__cards">
        {benefit.evidence.map((card, index) => (
          <EvidenceCard key={`${benefit.id}-${card.id}`} card={card} index={index} />
        ))}
      </div>
      <EvidencePhone benefit={benefit} />
    </div>
  );
}
