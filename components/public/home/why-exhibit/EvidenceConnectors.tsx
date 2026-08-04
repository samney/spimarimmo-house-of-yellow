/* The anchor layer: one absolute SVG behind the cards and the device.

   Paths are authored in the stage's own coordinate system (1436 × 640 reference
   pixels — the inset-to-inset width and the stage height at the 1536 × 1024
   target), never measured from the DOM, so they hold at every viewport that
   keeps the desktop composition and never depend on layout timing.

   The network is deliberately orthogonal and symmetrical: each rail runs a
   short lead from a card's inner edge to a vertical bus, and the bus runs one
   lead into its neighbour. Left mirrors right, and the outer column is anchored
   the same way, so the eye reads one system instead of five decorations.

   Entirely decorative: it repeats relationships the copy and card titles
   already state, so the whole layer is hidden from assistive technology. */

/* Card centres, from the slot grid: rows at y=39 and y=331, height 270. */
const ROW_TOP = 174;
const ROW_BOTTOM = 466;
const OUTER_MID = 320;

/* Device centre, for the orbit rings. */
const DEVICE_CX = 859.5;
const DEVICE_CY = 320;
/* Kept inside the stage box so the rings never clip against the section edge. */
const RINGS = [200, 262, 318];

const PATHS = [
  /* left rail → device */
  `M 699 ${ROW_TOP} H 730`,
  `M 699 ${ROW_BOTTOM} H 730`,
  `M 714 ${ROW_TOP} V ${ROW_BOTTOM}`,
  /* device → right rail */
  `M 989 ${ROW_TOP} H 1020`,
  `M 989 ${ROW_BOTTOM} H 1020`,
  `M 1005 ${ROW_TOP} V ${ROW_BOTTOM}`,
  /* right rail → outer column */
  `M 1216 ${ROW_TOP} H 1228`,
  `M 1216 ${ROW_BOTTOM} H 1228`,
  `M 1228 ${ROW_TOP} V ${ROW_BOTTOM}`,
  `M 1228 ${OUTER_MID} H 1240`,
];

const NODES: [number, number][] = [
  [714, ROW_TOP],
  [714, ROW_BOTTOM],
  [1005, ROW_TOP],
  [1005, ROW_BOTTOM],
  [1228, OUTER_MID],
];

export function EvidenceConnectors() {
  return (
    <svg
      className="whyConnectors"
      viewBox="0 0 1436 640"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {RINGS.map((r) => (
        <circle key={r} cx={DEVICE_CX} cy={DEVICE_CY} r={r} className="whyConnectors__ring" />
      ))}
      {PATHS.map((d) => (
        <path key={d} d={d} className="whyConnectors__path" data-why-path />
      ))}
      {NODES.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={4}
          className="whyConnectors__node"
          data-why-node
        />
      ))}
    </svg>
  );
}
