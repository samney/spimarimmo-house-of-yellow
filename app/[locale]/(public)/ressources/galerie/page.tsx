import { setRequestLocale } from "next-intl/server";
import { GalleryListing } from "@/components/public/pages/GalleryListing";

/* Owner restructure (2026-08-04): the standalone gallery is a LISTING, not a
   repeat of the homepage teaser section — the homepage has a display budget,
   the library scales. Media data stays single-sourced in galleryData. */
export default async function Galerie({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GalleryListing />;
}
