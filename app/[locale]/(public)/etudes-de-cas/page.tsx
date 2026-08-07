import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { PageCta } from "@/components/public/pages/PageCta";
import { getBackendSeams } from "@/lib/spimar/repositories";
import {
  CaseStudiesListing,
  type CaseFilters,
  type CmsCaseCard,
} from "@/components/public/pages/CaseStudiesListing";
import type { CaseObjective } from "@/components/public/pages/case-studies-data";

/* /etudes-de-cas — the end-to-end listing (owner note, D-026): image rows,
   URL-driven filters and pagination. CMS-published cases (etudes/ page
   family) list first with their real detail routes — the publish → visible
   contract is unchanged. The provisional fixtures render below, disclaimed,
   until validated case records replace them. */
export const dynamic = "force-dynamic";

const PREFIX = "etudes/";
const OBJECTIVES: readonly CaseObjective[] = ["notoriete", "leads", "ventes"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromNamespace({ namespace: "caseStudies", path: "/etudes-de-cas", locale });
}

export default async function EtudesDeCas({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ edition?: string; objectif?: string; page?: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("caseStudies");

  const { edition, objectif, page } = await searchParams;
  const filters: CaseFilters = {
    edition: edition || undefined,
    objective: OBJECTIVES.find((o) => o === objectif),
    page: Number.parseInt(page ?? "1", 10) || 1,
  };

  const pages = await getBackendSeams().content.listPages({ siteId: "spimar", locale });
  const cmsCases: CmsCaseCard[] = pages
    .filter((p) => p.slug.startsWith(PREFIX))
    .map((p) => ({
      slug: p.slug.slice(PREFIX.length),
      title: p.title || p.slug.slice(PREFIX.length),
      intro: String(p.sections[0]?.body.intro ?? ""),
    }));

  return (
    <div className="pageBlocks">
      <PageHeader index="09" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <CaseStudiesListing locale={locale} cmsCases={cmsCases} filters={filters} />
          <PageCta
            text={t("outro")}
            actions={[{ label: t("outroCta"), href: "/exposer/devenir-exposant" }]}
          />
        </div>
      </section>
    </div>
  );
}
