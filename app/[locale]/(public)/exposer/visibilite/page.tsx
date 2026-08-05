import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";

/* Spec §04 sitemap: /exposer/visibilite. Same accepted component as the
   homepage chapter; the route exists so navigation and campaigns can target
   the visibility story directly. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "visibility" });
  return buildMetadata({
    label: t("eyebrow"),
    description: t("lead"),
    path: "/exposer/visibilite",
    locale,
  });
}

export default async function Visibilite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VisibilitySection deviceHref="/exposer/devenir-exposant" headingLevel="h1" />;
}
