import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CulturePage } from "@/components/public/pages/CulturePage";
import { CULTURE } from "@/lib/content/pages";

export const metadata: Metadata = {
  title: CULTURE.title,
  description: CULTURE.metaDesc,
};

export default async function Culture({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CulturePage />;
}
