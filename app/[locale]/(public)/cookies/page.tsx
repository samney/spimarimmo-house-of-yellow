import { setRequestLocale, getTranslations } from "next-intl/server";
import { CmsPage } from "@/components/spimar/CmsPage";
import type { Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return <CmsPage slug="cookies" fallbackTitle={t("cookiesTitle")} locale={locale as Locale} />;
}
