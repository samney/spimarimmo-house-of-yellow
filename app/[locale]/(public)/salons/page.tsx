import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons — the destinations and events index, served from the CMS
   seam. Published editions only; while none is published the page states that
   honestly instead of inventing a programme. Dates and venues that are not
   validated yet render their pending state, never a guess.

   Server-rendered per request so a CMS publish is visible immediately — the
   integration contract (publish -> public visibility) depends on it. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromNamespace({ namespace: "salonsPage", path: "/salons", locale });
}

export default async function Salons({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("salonsPage");

  const events = await getBackendSeams().content.listEvents({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
  });

  return (
    <div className="pageBlocks">
      <PageHeader index="04" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              {events.length === 0 ? (
                <p className="text medium">{t("empty")}</p>
              ) : (
                <Reveal as="ul" className="spimarCardList" role="list">
                  {events.map((event) => (
                    <li key={event.slug} className="cardItem">
                      <span className="cardKicker text medium">
                        {event.venue
                          ? `${event.venue.city} — ${event.venue.countryCode}`
                          : t("venueTbc")}
                      </span>
                      <h2 className="text medium">
                        <Link href={`/salons/${event.slug}`}>{event.name || event.slug}</Link>
                      </h2>
                      <span className="cardNote text medium">
                        {event.startsAt
                          ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
                              new Date(event.startsAt),
                            )
                          : t("datesTbc")}
                      </span>
                    </li>
                  ))}
                </Reveal>
              )}
              <footer className="pageOutro">
                <p className="text medium">
                  {t("outro")} <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
