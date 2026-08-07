import type { ReactNode } from "react";
import { SectionEyebrow } from "@/components/public/home/SectionEyebrow";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* One page header for every route (owner direction, 2026-08-05).

   Before this there were three of them. Listing pages opened with an h1 at
   57.6px/500 starting 278px down a 799px column; standing pages used the same
   h1 at 114px down a 1190px column with an 11.5px lead; and neither matched the
   section-header anatomy the design contract specifies and sections 05–13 ship.
   A visitor moving between pages met a different opening every time.

   The anatomy here is the contract's: the shared `SectionEyebrow`
   ("[ NN ] LABEL"), a title at `--text-heading-lg` / 600 / 1.1 with a balanced
   wrap, and a lead at `--text-small-title` / 400 — the same steps the homepage
   sections use, so the page and the sections below it read as one product.

   The band is branded rather than bare: warm paper, a gold glow anchored where
   the title sits, a fine dot field that fades out, and a hairline rule closing
   it off. All of it is paint — `aria-hidden`, no layout, no motion. */
export function PageHeader({
  label,
  title,
  lead,
  children,
}: {
  /* DEPRECATED and never rendered (owner rule, 2026-08-07): the bracketed
     index is HOMEPAGE wayfinding; child pages carry the label alone. The
     prop is still accepted so stale call sites cannot break the build. */
  index?: string;
  label: string;
  title: string;
  lead?: string;
  /* Optional action row, rendered under the lead. */
  children?: ReactNode;
}) {
  return (
    <header className="pageHeader">
      <span className="pageHeader__wash" aria-hidden="true" />
      <span className="pageHeader__grain" aria-hidden="true" />
      <div className="contentWrapper">
        <div className="pageHeader__inner">
          <SectionEyebrow label={label} />
          <SplitTitle as="h1" className="pageHeader__title" text={title} />
          {lead ? (
            <SplitTitle as="p" mode="lines" className="pageHeader__lead" text={lead} />
          ) : null}
          {children ? <div className="pageHeader__actions">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
