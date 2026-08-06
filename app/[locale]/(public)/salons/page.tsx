import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";
import { SalonsCalendar, type CmsEditionCard } from "@/components/public/pages/SalonsCalendar";

/* Spec §04 /salons — rebuilt as the 2026 calendar (owner note, D-026): month
   rail + photographic edition cards. Two sources, one card design:

   - CMS-published editions render first with their real detail routes; the
     publish → public-visibility contract the integration suite verifies is
     unchanged.
   - The provisional 2026 programme renders from disclaimed placeholder
     fixtures the owner swaps for database records when the backend owns the
     programme.

   Server-rendered per request so a CMS publish is visible immediately. */
export const dynamic = "force-dynamic";

export default async function Salons({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("salonsPage");

  const events = await getBackendSeams().content.listEvents({
    siteId: "spimar",
    locale,
  });

  const cmsEditions: CmsEditionCard[] = events.map((event) => ({
    slug: event.slug,
    name: event.name || event.slug,
    city: event.venue?.city ?? null,
    country: event.venue?.countryCode ?? null,
    datesLabel: event.startsAt
      ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(event.startsAt))
      : null,
  }));

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <header className="pageIntro">
            <div className="label text medium">{t("label")}</div>
            <SplitTitle as="h1" className="normalTitle" text={t("title")} />
            <p className="text medium">{t("lead")}</p>
          </header>

          <SalonsCalendar locale={locale} cmsEditions={cmsEditions} />

          {/* Deliberately a div: shell.css styles the bare <footer> tag as the
              fixed 100vw yellow reveal, which overflows 390 (same rationale as
              the MRE section's footer strip). */}
          <div className="pageOutro">
            <p className="text medium">
              {t("outro")} <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
