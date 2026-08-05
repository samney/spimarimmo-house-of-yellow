import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";

/* Spec §16 — Ressources et SEO. The five-resource library comes from the
   specification table. Per the content principle every resource keeps a
   presentation before download; the documents themselves ship once their
   validated versions exist, so each card carries an honest availability state
   and routes the request through contact. Nothing is linked that does not
   exist. */
const RESOURCES = ["r1", "r2", "r3", "r4", "r5"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromNamespace({ namespace: "resourcesPage", path: "/ressources", locale });
}

export default async function Ressources({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resourcesPage");

  return (
    <div className="pageBlocks">
      <PageHeader index="13" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <Reveal as="ul" className="spimarCardList" role="list">
                {RESOURCES.map((key) => (
                  <li key={key} className="cardItem">
                    <h2 className="text medium">{t(`resources.${key}.name`)}</h2>
                    <p className="text medium">{t(`resources.${key}.description`)}</p>
                    <span className="cardNote text medium">{t("availability")}</span>
                  </li>
                ))}
              </Reveal>
              <footer className="pageOutro">
                <p className="text medium">
                  {t("outro")} <Link href="/contact">{t("outroContact")}</Link>
                  {" · "}
                  <Link href="/ressources/exposants">{t("outroExposants")}</Link>
                  {" · "}
                  <Link href="/ressources/galerie">{t("outroGallery")}</Link>
                  {" · "}
                  <Link href="/insights">{t("outroInsights")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
