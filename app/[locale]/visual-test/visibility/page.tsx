import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { VisibilitySection } from "@/components/public/home/VisibilitySection";

/* Deterministic parity state for section 07 "Votre visibilité"
   (qa/PARITY_TEST_PROTOCOL.md; the contract's /__visual/* path is adapted
   because Next.js excludes underscore-prefixed folders from routing):

     /visual-test/visibility?phase=before | during | after

   The protocol requires a stable route per phase so a capture is reproducible:
   one phase, transitions disabled, no public chrome (header, footer, cursor,
   consent banner) to sit over the region being measured.

   Not a public page: outside development it exists only when the harness sets
   SPIMAR_VISUAL_TEST=1, and it is never indexable. */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* Per-request rendering: the gate must be evaluated by the serving process,
   not baked into the build — a static prerender without the variable would
   hard-404 the harness. */
export const dynamic = "force-dynamic";

function isPhase(value: string | undefined): value is "before" | "during" | "after" {
  return value === "before" || value === "during" || value === "after";
}

export default async function VisibilityVisualTestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phase?: string }>;
}) {
  if (process.env.NODE_ENV !== "development" && process.env.SPIMAR_VISUAL_TEST !== "1") {
    notFound();
  }
  const { locale } = await params;
  setRequestLocale(locale);
  const { phase } = await searchParams;

  return <VisibilitySection initialPhase={isPhase(phase) ? phase : "before"} staticRender />;
}
