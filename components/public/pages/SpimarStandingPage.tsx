import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { PageHeader } from "./PageHeader";

/* Standing page for a specification route whose content is not yet approved.

   Every route in the navigation must resolve — a nav that 404s is worse than a
   page that states its own readiness. It renders the shared `PageHeader`, so a
   standing page opens exactly like a content page and graduates into one
   without the visitor noticing a change of system. It used to hand-roll the
   `cultureQuoteAnimationBlock` composition, which is how these pages drifted
   onto a different type ladder from the rest of the site.

   Each page states its real purpose, taken from the specification, and says
   plainly what is still to come. Nothing is invented: no dates, no figures, no
   claims. Per §19 these routes are completed as their content is delivered. */

export type StandingPageProps = {
  index: string;
  label: string;
  statement: string;
  pending: string;
  action?: { href: string; label: string };
  /** Where a visitor can usefully go from here (N-03). A page that states it
      is not finished and then offers nothing is a dead end; the related routes
      are the difference between "come back later" and "meanwhile, this". */
  related?: readonly { href: string; label: string }[];
  relatedTitle?: string;
};

export function SpimarStandingPage({
  index,
  label,
  statement,
  pending,
  action = { href: "/exposer/devenir-exposant", label: "Devenir exposant" },
  related,
  relatedTitle,
}: StandingPageProps) {
  return (
    <div className="pageBlocks">
      <PageHeader index={index} label={label} title={statement} lead={pending}>
        <Link className="button" href={action.href} title={action.label}>
          <span className="label">
            <span className="fixedLabel">{action.label}</span>
            <span className="innerLabel">
              <Marquee text={action.label} direction="left" speed={90} />
            </span>
          </span>
          <span className="icon">
            <PlusIcon />
          </span>
        </Link>
      </PageHeader>
      {related?.length ? (
        <section className="spimarListPage">
          <div className="contentWrapper">
            <div className="hoyCols">
              <div className="colLabel" aria-hidden="true" />
              <div className="colMain">
                <nav className="standingRelated" aria-label={relatedTitle}>
                  <h2 className="text medium">{relatedTitle}</h2>
                  <ul>
                    {related.map((item) => (
                      <li key={item.href}>
                        <Link className="text medium" href={item.href}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
