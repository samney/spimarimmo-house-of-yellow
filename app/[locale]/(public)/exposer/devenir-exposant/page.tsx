import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";

/* Owner restructure (2026-08-04): one combined conversion section — the
   offers configurator with the flexible path built in (tier optional,
   skip-to-request, free message). Same single-sourced component as
   /exposer/offres. */
export default async function DevenirExposant({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OffersSection />;
}
