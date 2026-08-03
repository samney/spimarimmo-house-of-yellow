import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Qualified final conversion (§17).

   The accepted closing composition is preserved exactly — dark plane, side
   index, oversized editorial statement, pill action. Only the content becomes
   the exhibitor conversion the specification requires.

   §17 defines four conversion paths. Two are live here: the exhibitor enquiry
   and the brochure. The scheduled meeting and WhatsApp paths follow once the
   CRM and contact routing are connected. */
export function ClosingSection() {
  return (
    <section className="cultureQuoteAnimationBlock dark">
      <div className="contentWrapper">
        <div className="hoyCols">
          <div className="colLabel">
            <div className="text medium">
              [ <span className="numIndex">05</span> ]
            </div>
          </div>
          <div className="colMain">
            <div className="label text medium">Devenir exposant</div>
            <SplitTitle
              as="h2"
              className="normalTitle"
              text="Réservez un stand, demandez la brochure ou parlez à un conseiller. Vous saurez où, pour quelle audience et avec quel accompagnement."
            />
            <span className="buttonsRow">
              <Link
                className="button light"
                href="/exposer/devenir-exposant"
                title="Devenir exposant"
              >
                <span className="label">
                  <span className="fixedLabel">Devenir exposant</span>
                  <span className="innerLabel">
                    <Marquee text="Devenir exposant" direction="left" speed={90} />
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
  );
}
