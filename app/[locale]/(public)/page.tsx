import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

/* Neutral placeholder. TRF-004 removed the reference homepage composition with
   the rest of the House of Yellow product. The SPIMAR homepage — its nineteen
   B2B narrative chapters — is built in TRF-030 to TRF-033, on top of the design
   system (TRF-010 to TRF-019) and the content/route foundation (TRF-020 to
   TRF-027).

   This renders no product claim, no metric, no partner and no event detail:
   inventing any of that is forbidden until SPIMAR content exists. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("placeholder");

  return (
    <section className="interimSurface">
      <h1>{t("title")}</h1>
      <p>{t("body")}</p>
    </section>
  );
}
