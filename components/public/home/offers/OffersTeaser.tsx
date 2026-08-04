import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { ArrowRightIcon, ShieldCheckIcon, StarIcon } from "../impactIcons";
import { BoothIcon, CrownIcon } from "./offersIcons";

/* Owner decision (2026-08-04): the homepage carries a conversion-focused
   offers CTA band — the full configurator lives on /exposer/offres. Inverse
   surface so the action moment breaks the paper rhythm of the surrounding
   sections. Tier names, descriptions and chips come from the shared offers
   catalog, so the teaser can never drift from the configurator. */
const TIERS = [
  { key: "standard", Icon: BoothIcon },
  { key: "premium", Icon: StarIcon, highlighted: true },
  { key: "sponsor", Icon: CrownIcon },
] as const;

export async function OffersTeaser() {
  const t = await getTranslations("offers");
  return (
    <section className="offTeaser" aria-labelledby="off-teaser-title">
      <div className="offTeaserInner">
        <div className="offTeaserCopy">
          <p className="offTeaserEyebrow">
            [ <span className="offTeaserEyebrowIndex">10</span> ] {t("eyebrow")}
          </p>
          <SplitTitle as="h2" className="offTeaserTitle" text={t("teaser.title")} />
          <p className="offTeaserLead">{t("teaser.lead")}</p>
          <div className="offTeaserActions">
            <Link className="offTeaserCta" href="/exposer/offres">
              {t("teaser.cta")}
              <ArrowRightIcon className="offTeaserCtaIcon" aria-hidden="true" />
            </Link>
            <Link className="offTeaserSecondary" href="/faq">
              {t("teaser.secondary")}
            </Link>
          </div>
          <p className="offTeaserNote">
            <ShieldCheckIcon className="offTeaserNoteIcon" aria-hidden="true" />
            {t("notes.pendingValidation")}
          </p>
        </div>
        <ul className="offTeaserTiers" role="list">
          {TIERS.map(({ key, Icon, ...tier }) => (
            <li
              key={key}
              className={`offTeaserTier${"highlighted" in tier ? " isHighlighted" : ""}`}
            >
              <span className="offTeaserTierBubble" aria-hidden="true">
                <Icon className="offTeaserTierIcon" />
              </span>
              <span className="offTeaserTierMeta">
                <span className="offTeaserTierName">
                  {t(`tiers.${key}.name`)}
                  <span className="offTeaserTierChip">{t(`tiers.${key}.chip`)}</span>
                </span>
                <span className="offTeaserTierDesc">{t(`tiers.${key}.desc`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
