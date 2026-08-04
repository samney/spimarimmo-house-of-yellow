import { setRequestLocale } from "next-intl/server";
import { OffersSection } from "@/components/public/home/offers/OffersSection";
import { BecomeExhibitorSection } from "@/components/public/home/BecomeExhibitorSection";

/* Owner restructure (2026-08-04): the full Offres page carries both accepted
   sections — [10] the offers configurator and [13] the exhibitor request
   form — so the journey completes without leaving the page. Single-sourced
   components, same as /exposer/devenir-exposant. */
export default async function Offres({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <OffersSection />
      <BecomeExhibitorSection />
    </>
  );
}
