"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR } from "./motion-tokens";

gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll matching the reference's verbatim Lenis config
   (docs/design-system/MOTION-SYSTEM.md). Skipped for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: DUR.scroll,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* Anchor navigation must go THROUGH Lenis: it owns the scroll position,
       so native hash jumps are swallowed and the nav's home anchors landed
       nowhere (owner report, 2026-08-06). Offset clears the fixed header.
       Staged dead links (href="#") are left alone. */
    const headerOffset = () => {
      const bar = document.querySelector<HTMLElement>("header .headerBar");
      return -((bar?.offsetHeight ?? 0) + 16);
    };
    const scrollToHash = (hash: string) => {
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      /* Sticky-deck members (#methode, #visibilite) cannot be targeted by
         their measured rect: a sticky element's rect already includes its
         current stuck offset, so the target is wrong once the deck is in
         play. Derive the NATURAL top instead — stack top + preceding
         siblings' heights — and land there: the section starts flush at the
         viewport top (full cover, title first) and the deck pins it as the
         reader scrolls on. No header offset — deck members are designed as
         full-viewport covers under the floating header. */
      const stack = el.closest<HTMLElement>(".sectionStack");
      if (stack && el.parentElement === stack) {
        let naturalTop = stack.getBoundingClientRect().top + window.scrollY;
        for (const sibling of Array.from(stack.children)) {
          if (sibling === el) break;
          naturalTop += (sibling as HTMLElement).offsetHeight;
        }
        lenis.scrollTo(naturalTop);
        return;
      }
      lenis.scrollTo(el, { offset: headerOffset() });
    };
    if (window.location.hash.length > 1) {
      // Arriving from another page: position after the sections mount.
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.<HTMLAnchorElement>('a[href*="#"]');
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const hashIndex = href.indexOf("#");
      const hash = href.slice(hashIndex);
      if (hash.length < 2) return; // staged "#" links keep their no-op
      const path = href.slice(0, hashIndex).replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
      const here = window.location.pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
      if (path !== here) return; // cross-page: let the router navigate
      const el = document.querySelector(hash);
      if (!el) return;
      event.preventDefault();
      history.pushState(null, "", hash);
      scrollToHash(hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
