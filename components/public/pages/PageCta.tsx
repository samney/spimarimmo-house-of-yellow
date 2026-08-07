import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { ArrowRightIcon } from "@/components/public/home/impactIcons";

/* One closing CTA band for every page (owner direction, 2026-08-07): the
   outros were assembled ad hoc per page; this component is the single
   anatomy. A statement on the left faces the actions on the right — system
   pill buttons with the marquee label: the first action carries the gold
   fill, the rest the outline. `staged: true` renders the honest dead link
   (href="#", D-026) while a real href navigates via the locale-aware Link.

   Server-safe: no state, no effects — the marquee is a CSS animation. */

export type PageCtaAction = {
  readonly label: string;
  readonly href: string;
  readonly staged?: boolean;
};

export function PillLabel({ text }: { text: string }) {
  return (
    <span className="label">
      <span className="fixedLabel">{text}</span>
      <span className="innerLabel">
        <Marquee text={text} direction="left" speed={90} />
      </span>
    </span>
  );
}

export function PageCta({ text, actions }: { text: string; actions: readonly PageCtaAction[] }) {
  /* Deliberately a div: shell.css styles the bare <footer> tag as the
     site-wide fixed yellow reveal footer (100vw), which broke this band out
     of its column the moment it used the semantic tag. */
  return (
    <div className="pageCta">
      <span className="pageCta__rail" aria-hidden="true" />
      <p className="pageCta__text">{text}</p>
      <div className="pageCta__actions">
        {actions.map((action, i) => {
          const className = `button${i === 0 ? "" : " outline"} pageCta__button`;
          const body = (
            <>
              <PillLabel text={action.label} />
              <span className="icon">
                <ArrowRightIcon />
              </span>
            </>
          );
          return action.staged ? (
            <a className={className} href="#" key={action.label}>
              {body}
            </a>
          ) : (
            <Link className={className} href={action.href} key={action.label}>
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
