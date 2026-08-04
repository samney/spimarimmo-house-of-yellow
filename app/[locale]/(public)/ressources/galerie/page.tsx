import { setRequestLocale } from "next-intl/server";
import { GallerySection } from "@/components/public/home/GallerySection";

/* Owner restructure (2026-08-04): the full gallery lives in the Bibliothèque
   family. The grid opens expanded here; the homepage instance links in. */
export default async function Galerie({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GallerySection defaultExpanded />;
}
