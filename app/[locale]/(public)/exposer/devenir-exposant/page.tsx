import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";

/* Owner restructure (2026-08-04): one combined conversion section — the
   offers configurator with the flexible path built in (tier optional,
   skip-to-request, free message). Same single-sourced component as
   /exposer/offres. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers" });
  /* This route renders the same wizard as /exposer/offres. Until the two are
     genuinely differentiated (owner IA decision, see ROUTE-AUDIT gap #4), the
     catalogue URL owns the content and this one canonicalises to it rather
     than competing with it for the same queries. */
  return buildMetadata({
    label: t("eyebrow"),
    description: t("header.choose.lead"),
    path: "/exposer/devenir-exposant",
    canonicalPath: "/exposer/offres",
    locale,
  });
}

export default async function DevenirExposant({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OffersSection headingLevel="h1" />;
}
