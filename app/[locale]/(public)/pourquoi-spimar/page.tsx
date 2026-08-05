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
  const t = await getTranslations({ locale, namespace: "pourquoiSpimar" });
  return buildMetadata({
    label: t("label"),
    description: t("pending"),
    path: "/pourquoi-spimar",
    locale,
  });
}

export default async function PourquoiSpimar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pourquoiSpimar");
  return (
    <SpimarStandingPage
      index="03"
      label={t("label")}
      statement={t("statement")}
      pending={t("pending")}
    />
  );
}
