"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Marquee } from "./Marquee";

/* Custom cursor replicating the reference: small yellow dot (z-20) following the
   pointer, expanding with looping Play/Video labels over video surfaces
   ([data-cursor="play"|"video"]), inverted on dark sections (.setDarkCursor).
   Desktop pointers only; hidden for touch and reduced motion. */
export function CustomCursor() {
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

  return (
    <div ref={ref} className="customCursor hidden" aria-hidden="true">
      <div className="background" />
      <div className="playCursor">
        <div className="labels">
          <div className="label">
            <Marquee text="Play" direction="right" speed={30} />
          </div>
          <div className="label">
            <Marquee text="Video" direction="left" speed={30} />
          </div>
          <div className="label">
            <Marquee text="Play" direction="right" speed={30} />
          </div>
          <div className="label">
            <Marquee text="Video" direction="left" speed={30} />
          </div>
        </div>
      </div>
    </div>
  );
}
