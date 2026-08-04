import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";
import { BecomeExhibitorSection } from "@/components/public/home/BecomeExhibitorSection";

/* Owner restructure (2026-08-04): the Devenir-exposant page is the full
   conversion surface — the offers configurator first, then the exhibitor
   request form. Both are the accepted homepage components, single-sourced. */
export default async function DevenirExposant({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <OffersSection />
      <BecomeExhibitorSection />
    </>
  );
}
