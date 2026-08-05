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
  /** Cross-fade between two states. `--dur-fade`. */
  fade: 0.3,
  /** Entrance of a block or a card. `--dur-reveal`. */
  reveal: 0.45,
  /** A composed set piece: the device rising, a title landing. */
  stage: 0.9,
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
} as const;

/** Distance a revealed block travels, in viewport width units, per the
    reference (`translateY(1.25vw)`). Expressed as a CSS length so it scales
    with the composition rather than being a fixed pixel nudge. */
export const REVEAL_SHIFT = "1.25vw";
