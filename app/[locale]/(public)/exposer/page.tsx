import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "exposerHub" });
  return buildMetadata({
    label: t("label"),
    description: t("pending"),
    path: "/exposer",
    locale,
  });
}

export default async function Exposer({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exposerHub");
  const tn = await getTranslations("nav");
  return (
    <SpimarStandingPage
      index="04"
      label={t("label")}
      statement={t("statement")}
      pending={t("pending")}
      relatedTitle={tn("relatedTitle")}
      related={[
        { href: "/exposer/offres", label: tn("offres") },
        { href: "/exposer/methode", label: tn("methode") },
        { href: "/exposer/visibilite", label: tn("visibilite") },
      ]}
    />
  );
}
