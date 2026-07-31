import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HowWeRollPage } from "@/components/public/pages/HowWeRollPage";
import { HOW_WE_ROLL } from "@/lib/content/pages";

export const metadata: Metadata = {
  title: HOW_WE_ROLL.title,
  description: HOW_WE_ROLL.metaDesc,
};

export default async function HowWeRoll({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HowWeRollPage />;
}
