/* The motion vocabulary, in the one form GSAP can consume.

   `app/globals.css` declares these as L2 tokens (`--dur-*`, `--stagger-step`,
   `--ease-out-ref`) and CSS transitions bind to them there. GSAP needs numbers
   and its own easing strings, so the same values are restated here — and only
   here. An animation that wants a duration reaches for one of these rather
   than inventing 0.7.

   Keep the two in step: changing a value means changing it in both places, and
   the pairing is asserted by `motion-tokens.test.ts`. */

export const DUR = {
  /** Micro-interaction: hover, focus, small state flips. `--dur-micro`. */
  micro: 0.2,
  /** Continuous pointer tracking — the lag that makes a follower feel weighted
      rather than glued. Short enough not to read as latency. */
  follow: 0.25,
  /** Cross-fade between two states. `--dur-fade`. */
  fade: 0.3,
  /** Entrance of a block or a card. `--dur-reveal`. */
  reveal: 0.45,
  /** A composed set piece: the device rising, a title landing. */
  stage: 0.9,
  /** A value counting up to its real figure. Long on purpose — the number has
      to be legible while it moves, not just when it lands. */
  count: 2,
  /** Not a tween: Lenis's scroll-easing time constant, how long the page keeps
      travelling after the wheel stops. Verbatim from the reference. It lives
      here so it is a named decision rather than a bare 1.2 in the engine
      setup, but it is not interchangeable with the tween durations above. */
  scroll: 1.2,
} as const;

export const STAGGER = {
  /** Between siblings in one revealed block. `--stagger-step`. */
  step: 0.15,
  /** Between characters or other dense repeats. */
  dense: 0.012,
} as const;

export const EASE = {
  /** The house entrance curve. `--ease-out-ref` is CSS `ease-out`. */
  out: "power2.out",
  /** Longer settles — the device, the stage. */
  stage: "power3.out",
  /** Overshoot, used only where an object is thrown into place. */
  throw: "back.out(1.25)",
  /** A value settling onto its figure: gentler than `out`, so the last digits
      are readable instead of snapping. */
  count: "power1.out",
} as const;

/** Where a scroll-driven animation begins, in ScrollTrigger's `start` syntax.
    Naming these keeps the site's reveals landing on the same line rather than
    each component picking its own percentage. */
export const TRIGGER = {
  /** A block entering — starts while it is still below the fold. */
  block: "top 85%",
  /** Deliberately later, for things that should not be half-finished by the
      time they are readable (a figure counting up). */
  late: "top 90%",
} as const;

/** Distance a revealed block travels, in viewport width units, per the
    reference (`translateY(1.25vw)`). Expressed as a CSS length so it scales
    with the composition rather than being a fixed pixel nudge. */
export const REVEAL_SHIFT = "1.25vw";
