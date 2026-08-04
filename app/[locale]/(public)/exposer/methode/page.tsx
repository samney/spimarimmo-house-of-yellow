import { setRequestLocale } from "next-intl/server";
import { MethodSection } from "@/components/public/home/method/MethodSection";

/* Spec §04 sitemap: /exposer/methode. The Notre méthode three-state system is
   the canonical content for this route; it renders the same accepted component
   as the homepage chapter rather than a diverging copy. */
export default async function Methode({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MethodSection />;
}
