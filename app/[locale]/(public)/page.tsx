import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/spimar/EmptyState";
import { listEvents } from "@/lib/spimar/repository";
import { hasConfirmedDates, localized, type Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* SPIMARIMMO homepage.

   The approved chapter sequence (06-HOMEPAGE-IMPLEMENTATION) runs to 19
   chapters. The launch scope here implements the structural spine — hero, event
   opportunities, exhibitor proposition, evidence, conversion — because the
   remaining chapters (proof bar, MRE demand intelligence, testimonials,
   gallery, offers comparison, FAQ, insights) each require approved business
   content that does not exist in the repository. Rendering them with invented
   metrics, partners or testimonials is explicitly forbidden (`D-021`).

   Event opportunities appear within the first three content chapters, as the
   specification requires. */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const te = await getTranslations("events");
  const events = listEvents().slice(0, 6);

  return (
    <>
      <section className="spimarSection spimarSection--dark">
        <div className="spimarSection__inner">
          <p className="spimarEyebrow">{t("eyebrow")}</p>
          <h1 className="spimarHeading">{t("title")}</h1>
          <p className="spimarLede">{t("lede")}</p>
          <div className="spimarActions">
            <Link className="spimarButton spimarButton--primary" href="/contact">
              {t("ctaButton")}
            </Link>
            <Link className="spimarButton spimarButton--ghost" href="/salons">
              {te("title")}
            </Link>
          </div>
        </div>
      </section>

      <section className="spimarSection spimarSection--tight">
        <p className="spimarNotice">{t("note")}</p>
      </section>

      <section className="spimarSection">
        <h2 className="spimarSubheading">{t("eventsHeading")}</h2>
        {events.length === 0 ? (
          <EmptyState title={te("emptyTitle")} body={te("emptyBody")} />
        ) : (
          <ul className="spimarGrid" style={{ listStyle: "none", padding: 0 }}>
            {events.map((event) => (
              <li key={event.id} className="spimarCard">
                <h3>
                  <Link href={`/salons/${event.slug}`}>
                    {localized(event.title, locale as Locale)}
                  </Link>
                </h3>
                <p className="spimarCard__meta">
                  {hasConfirmedDates(event)
                    ? [event.startDate, event.endDate].filter(Boolean).join(" – ")
                    : te("datesPending")}
                </p>
                <p>{localized(event.summary, locale as Locale)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="spimarSection spimarSection--surface">
        <div className="spimarSection__inner spimarSection">
          <h2 className="spimarSubheading">{t("exhibitHeading")}</h2>
          <p className="spimarProse">{t("exhibitBody")}</p>
          <div className="spimarActions">
            <Link className="spimarButton spimarButton--ghost" href="/exposer">
              {t("exhibitHeading")}
            </Link>
          </div>
        </div>
      </section>

      <section className="spimarSection">
        <h2 className="spimarSubheading">{t("proofHeading")}</h2>
        <p className="spimarProse">{t("proofBody")}</p>
      </section>

      <section className="spimarSection spimarSection--dark">
        <div className="spimarSection__inner">
          <h2 className="spimarSubheading">{t("ctaHeading")}</h2>
          <p className="spimarLede">{t("ctaBody")}</p>
          <Link className="spimarButton spimarButton--primary" href="/contact">
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
