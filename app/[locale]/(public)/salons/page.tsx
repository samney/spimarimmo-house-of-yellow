import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/spimar/EmptyState";
import { listEvents } from "@/lib/spimar/repository";
import { hasConfirmedDates, localized, type Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* `RT-EVT-INDEX` — /{locale}/salons. Event discovery.

   Undated editions are shown with an explicit "dates to be confirmed" label
   rather than hidden or given a guessed date, and the repository sorts them
   last so they never lead the index. */
export default async function EventsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const events = listEvents();

  return (
    <section className="spimarSection">
      <h1 className="spimarHeading">{t("title")}</h1>
      <p className="spimarLede">{t("lede")}</p>

      {events.length === 0 ? (
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
      ) : (
        <ul className="spimarGrid" style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li key={event.id} className="spimarCard">
              <h2>
                <Link href={`/salons/${event.slug}`}>
                  {localized(event.title, locale as Locale)}
                </Link>
              </h2>
              <p className="spimarCard__meta">
                {[event.city, event.country].filter(Boolean).join(", ")}
              </p>
              <p className="spimarCard__meta">
                {hasConfirmedDates(event)
                  ? [event.startDate, event.endDate].filter(Boolean).join(" – ")
                  : t("datesPending")}
              </p>
              <p>{localized(event.summary, locale as Locale)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
