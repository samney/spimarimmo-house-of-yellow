import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Privacy policy. Controller identity, retention and rights are legal
   commitments; they are supplied and validated, never generated. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "confidentialite" });
  return buildMetadata({
    label: t("label"),
    description: t("pending"),
    path: "/confidentialite",
    locale,
  });
}

export default async function Confidentialite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("confidentialite");
  const tn = await getTranslations("nav");
  return (
    <SpimarStandingPage
      index="19"
      label={t("label")}
      statement={t("statement")}
      pending={t("pending")}
      action={{ href: "/cookies", label: t("actionLabel") }}
      relatedTitle={tn("relatedTitle")}
      related={[{ href: "/contact", label: tn("contact") }]}
    />
  );
}
