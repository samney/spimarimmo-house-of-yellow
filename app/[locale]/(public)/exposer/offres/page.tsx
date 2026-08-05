import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";

/* Owner restructure (2026-08-04): one combined conversion section — the
   offers configurator with the flexible path built in (tier optional,
   skip-to-request, free message). Same single-sourced component as
   /exposer/devenir-exposant. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers" });
  return buildMetadata({
    label: t("eyebrow"),
    description: t("header.choose.lead"),
    path: "/exposer/offres",
    locale,
  });
}

export default async function Offres({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OffersSection headingLevel="h1" />;
}
