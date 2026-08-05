import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";

/* Spec §16 — the blog captures searches around the Moroccan market and the
   diaspora. The six editorial territories come from the specification; no
   article is fabricated — the index states honestly that the first articles
   are in preparation, and each will link to a salon, destination or offer. */
const TERRITORIES = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;

export default async function Insights({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");

  return (
    <div className="pageBlocks">
      <PageHeader index="16" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <h2 className="text medium label">{t("territoriesTitle")}</h2>
              <Reveal as="ul" className="spimarCardList" role="list">
                {TERRITORIES.map((key) => (
                  <li key={key} className="cardItem">
                    <span className="cardKicker text medium">{t("territoryKicker")}</span>
                    <h3 className="text medium">{t(`territories.${key}`)}</h3>
                    <span className="cardNote text medium">{t("pendingNote")}</span>
                  </li>
                ))}
              </Reveal>
              <footer className="pageOutro">
                <p className="text medium">
                  {t("outro")} <Link href="/ressources">{t("outroResources")}</Link>
                  {" · "}
                  <Link href="/salons">{t("outroSalons")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
