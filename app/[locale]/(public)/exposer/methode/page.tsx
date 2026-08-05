import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { METHOD_CONTENT } from "@/components/public/home/method/method-content";
import { MethodSection } from "@/components/public/home/method/MethodSection";

/* Spec §04 sitemap: /exposer/methode. The Notre méthode three-state system is
   the canonical content for this route; it renders the same accepted component
   as the homepage chapter rather than a diverging copy. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  /* Section 04's copy is hard-coded in `method-content.ts` rather than in
     `messages` (punchlist F3), so the title reads from the same constant the
     section renders. Both move to a namespace together. */
  return buildMetadata({
    label: METHOD_CONTENT.eyebrowLabel,
    description: METHOD_CONTENT.description,
    path: "/exposer/methode",
    locale,
  });
}

export default async function Methode({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MethodSection headingLevel="h1" />;
}
