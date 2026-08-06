import { setRequestLocale } from "next-intl/server";
import { GalleryListing } from "@/components/public/pages/GalleryListing";

/* Owner restructure (2026-08-04; filters + pagination 2026-08-06, D-026):
   the standalone gallery is a LISTING, not a repeat of the homepage teaser —
   the homepage has a display budget, the library scales. Media data stays
   single-sourced in galleryData; list state lives in the URL. */
export default async function Galerie({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categorie?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { categorie, page } = await searchParams;
  return <GalleryListing category={categorie} page={page} />;
}
