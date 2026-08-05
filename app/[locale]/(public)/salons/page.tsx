import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { localized, type Locale as StoreLocale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Salons — SPIMARIMMO",
  description: "Les éditions du réseau de salons SPIMARIMMO.",
};

/* Public salon index.

   Reads published editions from the CMS seam. Two rules the page keeps:

   - An edition with no confirmed date renders "Dates à confirmer" rather than
     a guess. The absence of a date is information, not a gap to fill.
   - Drafts never appear: the seam's default read excludes them, and the
     detail route 404s rather than leaking through a guessable URL. */
export default async function SalonsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const events = await getAdminSeams().cms.listEvents();
  const store = locale as StoreLocale;

  return (
    <main className="salonsPage">
      <h1>Salons</h1>
      <p className="exposerPage__lede">
        Les éditions publiées du réseau SPIMARIMMO. Les dates non confirmées sont indiquées comme
        telles — nous ne publions pas de date qui n’a pas été arrêtée.
      </p>

      {events.length === 0 ? (
        <p className="salonsPage__empty">
          Aucune édition n’est publiée pour le moment. Les prochaines éditions apparaîtront ici dès
          leur confirmation.
        </p>
      ) : (
        <ul className="salonsPage__list">
          {events.map((event) => {
            const title = localized(event.title, store) || event.slug;
            const summary = localized(event.summary, store);
            const place = [event.city, event.country].filter(Boolean).join(", ");
            return (
              <li className="salonsPage__item" key={event.id}>
                <h2 className="salonsPage__title">
                  <Link href={`/salons/${event.slug}`}>{title}</Link>
                </h2>
                <p className="salonsPage__meta">
                  {event.startDate ? (
                    <time dateTime={event.startDate}>
                      {[event.startDate, event.endDate].filter(Boolean).join(" – ")}
                    </time>
                  ) : (
                    <span>Dates à confirmer</span>
                  )}
                  {place ? <span> · {place}</span> : null}
                </p>
                {summary ? <p className="salonsPage__summary">{summary}</p> : null}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
