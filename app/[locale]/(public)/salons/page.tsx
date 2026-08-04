import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons — the destinations and events index, served from the CMS
   seam. Published editions only; while none is published the page states that
   honestly instead of inventing a programme. Dates and venues that are not
   validated yet render their pending state, never a guess.

   Server-rendered per request so a CMS publish is visible immediately — the
   integration contract (publish -> public visibility) depends on it. */
export const dynamic = "force-dynamic";

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
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">04</span> ]
              </div>
            </div>
            <div className="colMain">
              <header className="pageIntro">
                <div className="label text medium">{t("label")}</div>
                <SplitTitle as="h1" className="normalTitle" text={t("title")} />
                <p className="text medium">{t("lead")}</p>
              </header>
              {events.length === 0 ? (
                <p className="text medium">{t("empty")}</p>
              ) : (
                <ul className="spimarCardList" role="list">
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
                </ul>
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
