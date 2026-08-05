import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { localized, type Locale as StoreLocale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* Public salon detail.

   A draft must 404 rather than resolve on a guessable URL, so the read is the
   published-only one — a `includeDrafts` read here would leak unpublished
   editions to anyone who knew the slug. */
export default async function SalonDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const event = await getAdminSeams().cms.getEvent(slug);
  if (!event) notFound();

  const store = locale as StoreLocale;
  const title = localized(event.title, store) || event.slug;
  const summary = localized(event.summary, store);
  const place = [event.city, event.country].filter(Boolean).join(", ");

  return (
    <main className="salonsPage">
      <p>
        <Link href="/salons">← Tous les salons</Link>
      </p>
      <h1>{title}</h1>

      <dl className="salonsPage__facts">
        <dt>Dates</dt>
        <dd>
          {event.startDate ? (
            <time dateTime={event.startDate}>
              {[event.startDate, event.endDate].filter(Boolean).join(" – ")}
            </time>
          ) : (
            "Dates à confirmer"
          )}
        </dd>
        {place ? (
          <>
            <dt>Lieu</dt>
            <dd>{place}</dd>
          </>
        ) : null}
      </dl>

      {summary ? <p className="salonsPage__summary">{summary}</p> : null}

      <p style={{ marginBlockStart: "2em" }}>
        <Link className="button" href="/exposer">
          Devenir exposant sur ce salon
        </Link>
      </p>
    </main>
  );
}
