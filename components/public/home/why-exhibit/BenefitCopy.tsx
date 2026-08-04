import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import type { Benefit } from "./why-exhibit-types";

/* Copy column: benefit numeral, title, body, underlined CTA.

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
      <Link className="whyCopy__cta" href={benefit.cta.href}>
        <span className="whyCopy__ctaLabel">{benefit.cta.label}</span>
        <svg viewBox="0 0 20 14" aria-hidden="true" focusable="false" className="whyCopy__ctaArrow">
          <path
            d="M1 7h17M12.5 1.5 19 7l-6.5 5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </Link>
    </div>
  );
}
