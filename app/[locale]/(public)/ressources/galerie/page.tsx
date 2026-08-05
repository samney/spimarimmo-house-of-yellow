import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { GalleryListing } from "@/components/public/pages/GalleryListing";

/* Owner restructure (2026-08-04): the standalone gallery is a LISTING, not a
   repeat of the homepage teaser section — the homepage has a display budget,
   the library scales. Media data stays single-sourced in galleryData. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromNamespace({ namespace: "galleryPage", path: "/ressources/galerie", locale });
}

export default async function Galerie({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GalleryListing />;
}
