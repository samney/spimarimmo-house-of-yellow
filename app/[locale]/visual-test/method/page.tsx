import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MethodSection } from "@/components/public/home/method/MethodSection";
import { isMethodPhaseId } from "@/components/public/home/method/method-types";

/* Deterministic visual-test state for the "Notre méthode" section
   (qa/01_VISUAL_PARITY_PROTOCOL.md; the contract's /__visual/* path is
   adapted because Next.js excludes underscore-prefixed folders from routing):

     /visual-test/method?phase=before | during | after

   Renders one stable phase end frame with every transition disabled, without
   the public chrome (header, footer, cursor, consent banner), so parity
   screenshots capture only the section under test.

   Not a public page: outside development it exists only when the test harness
   sets SPIMAR_VISUAL_TEST=1 (the Playwright web server does), and it is never
   indexable. */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/* Per-request rendering: the SPIMAR_VISUAL_TEST gate must be evaluated by the
   serving process, not baked into the build (a static prerender without the
   variable would hard-404 the harness). */
export const dynamic = "force-dynamic";

export default async function MethodVisualTestPage({
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

  return <MethodSection initialPhase={isMethodPhaseId(phase) ? phase : "before"} staticRender />;
}
