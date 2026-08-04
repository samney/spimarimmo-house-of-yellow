import { setRequestLocale } from "next-intl/server";
import { ResourcesSection } from "@/components/public/home/ResourcesSection";

/* Owner restructure (2026-08-04): the exhibitor-resources section moves off
   the homepage onto this standalone page inside the Ressources family. */
export default async function RessourcesExposants({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResourcesSection />;
}
