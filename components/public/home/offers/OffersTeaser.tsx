import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Owner decision (2026-08-04): the homepage carries a compact offers teaser —
   the full interactive configurator lives on /exposer/offres and inside
   /exposer/devenir-exposant. Same catalog namespace, so tier naming stays
   single-sourced with the configurator. */
const TIERS = ["standard", "premium", "sponsor"] as const;

export async function OffersTeaser() {
  const t = await getTranslations("offers");
  return (
    <section className="offTeaser" aria-labelledby="off-teaser-title">
      <div className="offTeaserInner">
        <p className="offEyebrow">
          [ <span className="offEyebrowIndex">10</span> ] {t("eyebrow")}
        </p>
        <SplitTitle as="h2" className="offTitle" text={t("teaser.title")} />
        <p className="offLead">{t("teaser.lead")}</p>
        <ul className="offTeaserTiers" role="list">
          {TIERS.map((key) => (
            <li key={key} className="offTeaserTier">
              {t(`tiers.${key}.name`)}
            </li>
          ))}
        </ul>
        <Link className="offTeaserCta" href="/exposer/offres">
          {t("teaser.cta")}
        </Link>
      </div>
    </section>
  );
}
