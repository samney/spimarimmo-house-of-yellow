import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Standing page for a specification route whose content is not yet approved.

   Every route in the navigation must resolve — a nav that 404s is worse than a
   page that states its own readiness. This uses the accepted
   `cultureQuoteAnimationBlock` composition (side index, editorial statement,
   pill action) so these pages belong to the foundation rather than introducing
   a holding-page template.

   Each page states its real purpose, taken from the specification, and says
   plainly what is still to come. Nothing is invented: no dates, no figures, no
   claims. Per §19 these routes are completed as their content is delivered. */

export type StandingPageProps = {
  index: string;
  label: string;
  statement: string;
  pending: string;
  action?: { href: string; label: string };
};

export function SpimarStandingPage({
  index,
  label,
  statement,
  pending,
  action = { href: "/exposer/devenir-exposant", label: "Devenir exposant" },
}: StandingPageProps) {
  return (
    <div className="pageBlocks">
      <section className="cultureQuoteAnimationBlock dark">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">{index}</span> ]
              </div>
            </div>
            <div className="colMain">
              <div className="label text medium">{label}</div>
              <SplitTitle as="h1" className="normalTitle" text={statement} />
              <div className="text medium">{pending}</div>
              <span className="buttonsRow">
                <Link className="button light" href={action.href} title={action.label}>
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
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
