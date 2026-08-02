"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/* Replicates the reference data-scroll-inview behavior: the block gets an
   `inview` class the first time it enters the viewport, driving the CSS
   translateY/opacity reveals extracted from the theme. Reduced motion (or no
   IntersectionObserver) applies the class immediately. */
export function Inview({
  as: Tag = "section",
  className = "",
  children,
  threshold = 0.15,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("inview");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("inview");
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
