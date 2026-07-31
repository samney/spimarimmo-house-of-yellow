import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ConnectPage } from "@/components/public/pages/ConnectPage";
import { CONNECT } from "@/lib/content/pages";

export const metadata: Metadata = {
  title: CONNECT.title,
  description: CONNECT.metaDesc,
};

export default async function Connect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ConnectPage />;
}
