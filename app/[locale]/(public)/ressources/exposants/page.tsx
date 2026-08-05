import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { ResourcesSection } from "@/components/public/home/ResourcesSection";

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
  return <ResourcesSection headingLevel="h1" />;
}
