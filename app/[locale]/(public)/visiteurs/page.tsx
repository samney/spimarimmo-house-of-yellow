import { setRequestLocale } from "next-intl/server";
import { SpimarStandingPage } from "@/components/public/pages/SpimarStandingPage";

export default async function Visiteurs({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SpimarStandingPage
      index="18"
      label="Visiteurs"
      statement="Trouvez le salon de votre ville, découvrez le programme et préparez vos rendez-vous."
      pending="La pré-inscription ouvre avec le calendrier des éditions."
      action={{ href: "/salons", label: "Trouver un salon" }}
    />
  );
}
