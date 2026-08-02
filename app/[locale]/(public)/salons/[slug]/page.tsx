import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Inview } from "@/components/primitives/motion/Inview";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getEvent } from "@/lib/spimar/repository";
import { hasConfirmedDates, localized, type Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* `RT-EVT-DETAIL` — /{locale}/salons/{slug}.

   Only published editions resolve. A draft returns 404 rather than leaking
   unapproved content through a guessable URL. */
export default async function EventDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");
  const event = getEvent(slug);

  if (!event) notFound();

  return (
    <Inview as="article" className="spimarSection reveal">
      <p className="spimarEyebrow">{[event.city, event.country].filter(Boolean).join(", ")}</p>
      <SplitTitle
        as="h1"
        className="spimarHeading"
        text={localized(event.title, locale as Locale)}
      />
      <p className="spimarLede">
        {hasConfirmedDates(event)
          ? [event.startDate, event.endDate].filter(Boolean).join(" – ")
          : t("datesPending")}
      </p>
      <div className="spimarDocument">
        <p>{localized(event.summary, locale as Locale)}</p>
      </div>
      <div className="spimarActions">
        <Link className="spimarButton spimarButton--primary" href="/contact">
          {t("backToIndex")}
        </Link>
        <Link className="spimarButton spimarButton--ghost" href="/salons">
          {t("backToIndex")}
        </Link>
      </div>
    </Inview>
  );
}
