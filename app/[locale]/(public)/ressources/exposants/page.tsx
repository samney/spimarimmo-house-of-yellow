import { setRequestLocale, getTranslations } from "next-intl/server";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { ResourcesSection } from "@/components/public/home/ResourcesSection";

/* Owner restructure (2026-08-04; page header added 2026-08-06, D-026): the
   exhibitor-resources section renders standalone under the child-page
   layout — its own PageHeader, no homepage chapter index, the FAQ CTA on
   the real /faq route, and the analyses deep-linked into the article
   system. */
export default async function RessourcesExposants({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resourcesExposantsPage");

  return (
    <div className="pageBlocks">
      <section className="spimarListPage spimarListPage--flush">
        <div className="contentWrapper">
          <header className="pageIntro">
            <div className="label text medium">{t("label")}</div>
            <SplitTitle as="h1" className="normalTitle" text={t("title")} />
            <p className="text medium">{t("lead")}</p>
          </header>
        </div>
      </section>
      <ResourcesSection standalone />
    </div>
  );
}
