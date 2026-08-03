import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function Ressources({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="13"
      label="Ressources"
      statement="Brochure, guide exposant, calendrier, plans des salons et checklist."
      pending="Les documents sont mis à disposition dès leur version validée."
    />
  );
}
