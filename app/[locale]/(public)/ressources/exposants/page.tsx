import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { ExhibitorResources } from "@/components/public/pages/ExhibitorResources";
import { PageCta } from "@/components/public/pages/PageCta";
import { PageHeader } from "@/components/public/pages/PageHeader";

/* Owner restructure (2026-08-04): the exhibitor-resources section moves off
   the homepage onto this standalone page inside the Ressources family. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return buildMetadata({
    label: t("eyebrow"),
    description: t("lead"),
    path: "/ressources/exposants",
    locale,
  });
}

export default async function RessourcesExposants({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resources" });
  return (
    <div className="pageBlocks">
      {/* ONE header (owner remark, 2026-08-07): the shared PageHeader only —
          the old homepage section brought a second header beside its feature
          card. The four-box grid below is the child-page composition. */}
      <PageHeader label={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <ExhibitorResources />
              <PageCta
                text={t("faq.label")}
                actions={[
                  { label: t("faq.all"), href: "/faq" },
                  { label: t("feature.cta"), href: "/ressources" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
