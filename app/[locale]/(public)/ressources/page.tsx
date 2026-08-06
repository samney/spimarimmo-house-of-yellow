import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BookOpen, CalendarDays, ClipboardCheck, FileText, Map } from "lucide-react";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Link } from "@/i18n/navigation";
import { BrochureTrigger } from "@/components/public/global/BrochureDialog";

/* Spec §16 — Ressources et SEO, rebuilt as the designed library (owner note,
   D-026). Each resource is a card with a truthful action: the brochure is
   the one validated document, so its card carries the real preview +
   download popup; every other card states its availability honestly and
   routes the request through contact. Nothing is linked that does not
   exist. Icons from the D-023 lucide set. */

const RESOURCES = [
  { key: "r1", Icon: FileText, available: true },
  { key: "r2", Icon: BookOpen, available: false },
  { key: "r3", Icon: CalendarDays, available: false },
  { key: "r4", Icon: Map, available: false },
  { key: "r5", Icon: ClipboardCheck, available: false },
] as const;

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
          <ul className="bibGrid" role="list">
            {RESOURCES.map(({ key, Icon, available }) => (
              <li className={`bibCard${available ? " bibCard--available" : ""}`} key={key}>
                <span className="bibIconRing" aria-hidden="true">
                  <Icon className="bibIcon" strokeWidth={1.25} />
                </span>
                <h2 className="bibName">{t(`resources.${key}.name`)}</h2>
                <p className="bibDescription">{t(`resources.${key}.description`)}</p>
                <div className="bibAction">
                  {available ? (
                    <>
                      <p className="bibAvailable">{t("availableNow")}</p>
                      <BrochureTrigger variant="dark" />
                    </>
                  ) : (
                    <>
                      <p className="bibPending">{t("availability")}</p>
                      <Link className="bibContactLink" href="/contact">
                        {t("requestResource")}
                      </Link>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

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
      </section>
    </div>
  );
}
