import { setRequestLocale } from "next-intl/server";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";

/* Spec §04 sitemap: /exposer/visibilite. Same accepted component as the
   homepage chapter; the route exists so navigation and campaigns can target
   the visibility story directly. */
export default async function Visibilite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VisibilitySection />;
}
