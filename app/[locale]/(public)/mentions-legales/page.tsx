import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

/* Legal identification. The publisher, host and company details are legally
   binding facts that must be supplied and verified — never drafted here. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mentionsLegales" });
  return buildMetadata({
    label: t("label"),
    description: t("pending"),
    path: "/mentions-legales",
    locale,
  });
}

export default async function MentionsLegales({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("mentionsLegales");
  const tn = await getTranslations("nav");
  return (
    <SpimarStandingPage
      index="19"
      label={t("label")}
      statement={t("statement")}
      pending={t("pending")}
      action={{ href: "/contact", label: t("actionLabel") }}
      relatedTitle={tn("relatedTitle")}
      related={[{ href: "/contact", label: tn("contact") }]}
    />
  );
}
