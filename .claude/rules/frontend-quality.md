# Frontend quality rules

- Fidelity to the reference site is the priority. Do not modernize, simplify, or "improve" the public UI. No generic card chrome, template patterns, default shadcn styling on public routes, or unobserved decoration.
- All colors, type sizes, spacing, radii, and z-indices come from extracted design tokens (CSS custom properties + Tailwind theme). Known anchors: paper `#EEEEEE`, ink `#1D1D1B`, yellow `#F2EFA3`, Poppins 300–700 self-hosted.
- Typography in the reference is viewport-relative (`vw`-based). Derive real clamping and mobile overrides from evidence — never copy desktop `vw` values blindly.
- GSAP (+ ScrollTrigger, `@gsap/react`) owns timelines, scroll choreography, text reveals, pinning, transitions, counters. Native CSS for simple hover/focus. No Framer Motion. Lenis only if smooth-scroll evidence requires it (it does: `lenis` classes observed — verify before adopting).
- Every animation respects `prefers-reduced-motion` with a documented fallback, and cleans up on unmount (no ScrollTrigger leaks).
- Responsive validation at all eight required viewports (1920, 1440, 1280, 1024×768, 768×1024, 430, 390, 360 widths) plus fluid behavior between them. No horizontal overflow, no layout shift.
- Media: `next/image`/optimized pipeline, correct poster frames, correct crops and focal points, lazy-load noncritical video.
- Accessibility is part of fidelity: semantic HTML, keyboard navigation, visible focus, accessible forms, accurate alt text, sufficient contrast.
- Performance budget: fast first render, route-level code splitting, no unnecessary client JS; measure with Lighthouse; never trade visual fidelity for a synthetic score without a recorded decision.
