/* Placeholder media for a destination card.

   No approved SPIMARIMMO event photography exists yet, and reference media may
   not be reused. This draws a deterministic abstract composition instead — an
   exhibition floor plan reduced to stand blocks, keyed off the destination slug
   so each card differs but never changes between renders.

   It is deliberately abstract rather than a stock photograph: the
   specification forbids publishing generated filler as documentary evidence,
   and an obviously-drawn plane cannot be mistaken for a photograph of a real
   event. It is a frame holding the composition until real media lands. */

function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function DestinationPlaceholder({ slug }: { slug: string }) {
  const h = hash(slug);
  // A 6x6 stand grid; the seed decides which cells are occupied.
  const cells = Array.from({ length: 36 }, (_, i) => (h >> i % 30) % 5 !== 0);

  return (
    <svg
      className="destinationPlaceholder"
      viewBox="0 0 120 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="120" height="120" fill="var(--hoy-ink)" />
      <g fill="var(--hoy-yellow)" opacity="0.16">
        {cells.map((on, i) =>
          on ? (
            <rect
              key={i}
              x={14 + (i % 6) * 16}
              y={14 + Math.floor(i / 6) * 16}
              width={((h >> i) % 2) + 1 === 2 ? 20 : 11}
              height="11"
              rx="1.5"
            />
          ) : null,
        )}
      </g>
      {/* Aisle, so the plan reads as a floor rather than a texture. */}
      <rect x="0" y="58" width="120" height="4" fill="var(--hoy-yellow)" opacity="0.28" />
    </svg>
  );
}
