/* Repeated-text marquee replicating the reference structure:
   .marquees > .marqueeWrapper > .marquee > .marqueeScroll > 5x .itemsContainer > .item
   Reference drives this with GSAP (data-marquee-speed px/s, direction left|right);
   speeds observed: Connect pill rows 90/45, cursor labels 30. */

export function Marquee({
  text,
  direction = "left",
  speed = 45,
  copies = 5,
}: {
  text: string;
  direction?: "left" | "right";
  speed?: number;
  copies?: number;
}) {
  // CSS animation duration derived from speed (px/s) against a normalized 100% loop.
  // One loop translates by one item width; approximate with text length * 0.6em/char.
  const duration = Math.max(2, (text.length * 12) / speed);
  return (
    <span className="marquees" aria-hidden="true">
      <span className="marqueeWrapper">
        <span
          className={`marquee dir-${direction}`}
          style={{ ["--marquee-duration" as string]: `${duration}s` }}
        >
          <span className="marqueeScroll">
            {Array.from({ length: copies }, (_, i) => (
              <span className="itemsContainer" key={i}>
                <span className="item">{text}</span>
              </span>
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}
