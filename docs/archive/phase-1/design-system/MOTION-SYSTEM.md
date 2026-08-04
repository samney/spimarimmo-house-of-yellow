# Motion System — extracted from houseofyellow.nl

Sources: theme JS bundles (24 files, captured 2026-07-30), theme CSS transitions, HTML state classes. Timelines to be refined against `qa/recordings/` (HOY-020 recordings). All `Observed` unless noted.

## Smooth scroll — Lenis (verbatim reference config)
```js
new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ~easeOutExpo
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  smoothTouch: false, // native scrolling on touch devices
})
```
HTML gains `lenis lenis-smooth` classes. Rebuild: identical config via `lenis` package integrated with GSAP ScrollTrigger ticker.

## Page transitions — Swup (reference) → Next.js equivalent
`html.swup-enabled`; SwupHeadPlugin (head diffing) + SwupGaPlugin (GA pageviews). Transition visuals to be timed from `page-transition-home-to-works--desktop.webm`. Rebuild: App Router route transitions choreographed with GSAP (no Swup).

## GSAP vocabulary (from theme JS)
| Parameter | Observed values (frequency) | Use |
|---|---|---|
| durations | 0.2s (12×), 0.3s (10×) | micro-interactions, UI toggles |
| | 0.9s, 1s, 1.2s | section/text reveals |
| | 2s (10×), 3s, 4s | loops, marquees, counters |
| eases | `power1.out` (19×), `power1.inOut` (18×) | default motion voice |
| | `power2.out` (4×), `power3.out` (3×) | stronger arrivals |
| | `none`/`linear` (12×) | marquees, scrub |
| | `bounce.out` (3×) | playful accents (identify targets from recordings) |
| ScrollTrigger | `scrub: 1`, `scrub: true` | scroll-driven sequences |
| SplitText | `new SplitText(el, ...)`, applied to `.rowWrapper` children | char/line reveals |

## CSS-side motion (co-exists with GSAP)
- Hover fades `.3s ease-out`; reveal transitions `transform+opacity .45s` with 150 ms stagger ladder (0/.15/.3/.45/.6s) via delay classes.
- Repeated-text marquees (Connect CTA, Reset filters, cursor labels): stacked span groups, continuous loop, `linear` timing.

## Known animated set pieces (from DOM + captures; timeline detail from recordings)
1. Initial page reveal — HOY logo letters animate (SplitText/MorphSVG candidates), hero video fade-in.
2. Scroll choreography — `inview` classes gate section reveals; editorial headings char-split (SplitText) reveal per row.
3. Animated metric counters (2–4s, project stats + homepage metrics).
4. Client-logo marquee (continuous, linear).
5. Project tiles — hover starts video playback + cursor swaps to Play/Video state.
6. Grid↔List view morph on Made by Yellow; filter apply/reset re-flow.
7. Custom cursor — follows pointer, contextual labels (Play/Video), inverts on dark sections (`removeDarkCursor`).
8. Sticky/pinned sections and scrub-driven transforms (scrub:1) — locations to be mapped from recordings.
9. Live clocks tick (Connect).

## Reduced motion
Reference: none (only CF7 spinner fallback). Rebuild: every GSAP timeline and CSS reveal gets a `prefers-reduced-motion` fallback (opacity-only or static), per master prompt accessibility requirements — an intentional, recorded improvement over the reference.

## Rebuild architecture rules
- `@gsap/react` `useGSAP` for lifecycle-safe timelines; kill ScrollTriggers on unmount.
- One motion module per set piece under `lib/animations/`; shared eases/durations exported as constants mirroring the vocabulary table.
- Lenis instance owned by a single provider; ScrollTrigger `scrollerProxy` wired once.
