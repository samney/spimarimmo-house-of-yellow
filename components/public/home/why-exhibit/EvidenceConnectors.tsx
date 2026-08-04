/* The connector network: one absolute SVG layer behind the cards and the phone.

   Paths are authored in the stage's own coordinate system (1436 × 694 reference
   pixels, the inset-to-inset width and the stage height at the 1536 × 1024
   target), never measured from the DOM — so they hold at every viewport that
   keeps the desktop composition and never depend on layout timing.

   Entirely decorative: it repeats relationships the copy and card titles
   already state, so the whole layer is hidden from assistive technology. */

const NODE_R = 4.5;

/* Left: card A joins the phone; a bracket ties card A down to card B. */
const LEFT_BRACKET =
  "M 410 186 H 371 A 12 12 0 0 0 359 198 V 409 A 12 12 0 0 1 347 421 H 317 A 12 12 0 0 0 305 433 V 507 A 12 12 0 0 0 317 519 H 410";
const LEFT_TO_PHONE = "M 556 155 H 609";

/* Right: the top card feeds a return bracket, which feeds the outer card. */
const RIGHT_UPPER = "M 1210 89 H 1253 A 10 10 0 0 1 1263 99 V 184";
const RIGHT_LOWER = "M 1210 184 H 1327 A 10 10 0 0 1 1337 194 V 243";

const NODES: [number, number][] = [
  [572, 155],
  [359, 421],
  [1235, 89],
  [1265, 184],
];

/* The three double-chevron marks that punctuate the corridors. */
const CHEVRONS: [number, number][] = [
  [575, 423],
  [982, 418],
  [1230, 418],
];

function Chevron({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="whyConnectors__chevron">
      <path d="M-9 -8 -1 0 -9 8M1 -8 9 0 1 8" />
    </g>
  );
}

export function EvidenceConnectors() {
  return (
    <svg
      className="whyConnectors"
      viewBox="0 0 1436 694"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {[LEFT_BRACKET, LEFT_TO_PHONE, RIGHT_UPPER, RIGHT_LOWER].map((d, i) => (
        <path
          key={d}
          d={d}
          className="whyConnectors__path"
          style={{ "--why-path-index": i } as React.CSSProperties}
        />
      ))}
      {NODES.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={NODE_R} className="whyConnectors__node" />
      ))}
      {CHEVRONS.map(([x, y]) => (
        <Chevron key={`${x}-${y}`} x={x} y={y} />
      ))}
    </svg>
  );
}
