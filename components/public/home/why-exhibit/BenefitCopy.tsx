import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { ArrowRightIcon } from "./why-exhibit-icons";
import type { Benefit } from "./why-exhibit-types";

/* Copy column: benefit numeral, title, body, action.

   The action is the repository's own `.button` pill — same fill, same label /
   marquee / icon anatomy as every other primary action on the site (owner
   direction, 2026-08-04). The references draw an underlined text link; the
   design system outranks that, and one button vocabulary across the page is
   worth more than one section's screenshot.

   The title is stored as one verbatim string; `titleBreakAfterWord` reproduces
   the reference's controlled break without editing the copy. The break is
   presentational and CSS removes it below the desktop regime. */
export function BenefitCopy({ benefit }: { benefit: Benefit }) {
  const words = benefit.title.split(" ");
  return (
    <div className="whyCopy">
      <p className="whyCopy__number" aria-hidden="true">
        {benefit.number}
      </p>
      <h3 className="whyCopy__title">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            {i > 0 && " "}
            {word}
            {i === benefit.titleBreakAfterWord - 1 && <br className="whyCopy__break" />}
          </Fragment>
        ))}
      </h3>
      <p className="whyCopy__body">{benefit.body}</p>
      <span className="whyCopy__actions">
        <Link className="button whyCopy__cta" href={benefit.cta.href} title={benefit.cta.label}>
          <span className="label">
            <span className="fixedLabel">{benefit.cta.label}</span>
            <span className="innerLabel">
              <Marquee text={benefit.cta.label} direction="left" speed={90} />
            </span>
          </span>
          <span className="icon">
            <ArrowRightIcon />
          </span>
        </Link>
      </span>
    </div>
  );
}
