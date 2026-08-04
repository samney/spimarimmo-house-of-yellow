import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";

/* Spec §04 sitemap: /exposer/offres. Same accepted component as the homepage
   chapter — package levels and inclusions stay single-sourced. */
export default async function Offres({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OffersSection />;
}
