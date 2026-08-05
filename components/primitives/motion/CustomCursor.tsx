"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { Marquee } from "@/components/primitives/motion/Marquee";

/* Custom cursor replicating the reference: a small gold mark following the
   pointer, expanding into a rounded BOX over video surfaces
   (`[data-cursor="play"|"video"]`) with looping labels, inverted on dark
   sections (`.setDarkCursor`). Desktop pointers only; hidden for touch and
   reduced motion.

   2026-08-05 (owner direction): the expanded state is a box rather than a
   circle, and `[data-cursor="close"]` adds a third state — the same box with a
   cross that draws itself in — so the open player closes under the same
   pointer affordance that opened it.

   Labels come from `messages` rather than being hard-coded English: this is a
   French-first site and the cursor is visible copy. */
export function CustomCursor() {
  const t = useTranslations("hero");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power2.out" });

    const move = (e: MouseEvent) => {
      el.classList.remove("hidden");
      xTo(e.clientX);
      yTo(e.clientY);
      const target = e.target as HTMLElement;
      const cursorState = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      el.classList.toggle("statePlay", cursorState === "play");
      el.classList.toggle("stateVideo", cursorState === "video");
      el.classList.toggle("stateClose", cursorState === "close");
      el.classList.toggle("dark", !!target.closest(".setDarkCursor"));
    };
    const leave = () => el.classList.add("hidden");

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  const play = t("cursorPlay");
  const video = t("cursorVideo");

  return (
    <div ref={ref} className="customCursor hidden" aria-hidden="true">
      <div className="background" />
      <div className="playCursor">
        <div className="labels">
          <div className="label">
            <Marquee text={play} direction="right" speed={30} />
          </div>
          <div className="label">
            <Marquee text={video} direction="left" speed={30} />
          </div>
          <div className="label">
            <Marquee text={play} direction="right" speed={30} />
          </div>
          <div className="label">
            <Marquee text={video} direction="left" speed={30} />
          </div>
        </div>
      </div>
      {/* Two bars that scale in from nothing and settle crossed. */}
      <div className="closeCursor">
        <span className="closeBar" />
        <span className="closeBar" />
      </div>
    </div>
  );
}
