import { getTranslations } from "next-intl/server";
import { ArrowRight, Crown, ShieldCheck, Star, Store } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Owner decisions (2026-08-04, D-023): the homepage offers CTA band uses the
   lucide icon set and a layered inverse surface — gold radial glow, grain,
   ghost numeral — so the action moment carries the same depth language as the
   accepted sections instead of a flat box. Tier names, chips and descriptions
   come from the shared offers catalog: the teaser can never drift from the
   configurator. */
const TIERS = [
  { key: "standard", Icon: Store },
  { key: "premium", Icon: Star, highlighted: true },
  { key: "sponsor", Icon: Crown },
] as const;

export async function OffersTeaser() {
  const t = await getTranslations("offers");
  return (
    <section className="offTeaser" aria-labelledby="off-teaser-title">
      <span className="offTeaserGlow" aria-hidden="true" />
      <span className="offTeaserGrain" aria-hidden="true" />
      <span className="offTeaserGhost" aria-hidden="true">
        10
      </span>
      <div className="offTeaserInner">
        <div className="offTeaserCopy">
          <p className="offTeaserEyebrow">
            [ <span className="offTeaserEyebrowIndex">10</span> ] {t("eyebrow")}
          </p>
          <SplitTitle
            as="h2"
            className="offTeaserTitle"
            id="off-teaser-title"
            text={t("teaser.title")}
          />
          <p className="offTeaserLead">{t("teaser.lead")}</p>
          <div className="offTeaserActions">
            <Link className="offTeaserCta" href="/exposer/offres">
              {t("teaser.cta")}
              <ArrowRight className="offTeaserCtaIcon" aria-hidden="true" />
            </Link>
            <Link className="offTeaserSecondary" href="/faq">
              {t("teaser.secondary")}
            </Link>
          </div>
          <p className="offTeaserNote">
            <ShieldCheck className="offTeaserNoteIcon" aria-hidden="true" />
            {t("notes.pendingValidation")}
          </p>
        </div>
        <ul className="offTeaserTiers" role="list">
          {TIERS.map(({ key, Icon, ...tier }) => (
            <li key={key}>
              {/* The whole pack card is the action: it opens the configurator. */}
              <Link
                className={`offTeaserTier${"highlighted" in tier ? " isHighlighted" : ""}`}
                href="/exposer/offres"
              >
                <span className="offTeaserTierBubble" aria-hidden="true">
                  <Icon className="offTeaserTierIcon" strokeWidth={1.75} />
                </span>
                <span className="offTeaserTierMeta">
                  <span className="offTeaserTierName">
                    {t(`tiers.${key}.name`)}
                    <span className="offTeaserTierChip">{t(`tiers.${key}.chip`)}</span>
                  </span>
                  <span className="offTeaserTierDesc">{t(`tiers.${key}.desc`)}</span>
                </span>
                <ArrowRight className="offTeaserTierArrow" aria-hidden="true" strokeWidth={1.75} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
