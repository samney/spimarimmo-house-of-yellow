import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/spimar/EmptyState";
import { Inview } from "@/components/primitives/motion/Inview";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { Marquee } from "@/components/primitives/motion/Marquee";
import { listEvents } from "@/lib/spimar/repository";
import { hasConfirmedDates, localized, type Locale } from "@/lib/spimar/types";

export const dynamic = "force-dynamic";

/* SPIMARIMMO homepage.

   Built on the accepted editorial foundation rather than beside it: the
   viewport-relative type scale, the vw section rhythm, the editorial column
   grid and the `Inview`/`SplitTitle`/`Marquee` motion primitives are all the
   ones preserved by TRF-003. Colour and typography are SPIMAR (`06-Visual-
   Identity`); structure, rhythm and choreography are adapted, not reinvented.

   The approved chapter sequence runs to 19. The structural spine ships here;
   the remaining chapters each require approved business content that does not
   exist in the repository, and inventing metrics, partners or testimonials to
   fill them is forbidden (`D-021`). */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const te = await getTranslations("events");
  const events = listEvents().slice(0, 6);

  return (
    <>
      {/* Chapter 2 — cinematic B2B hero */}
      <section className="spimarHero">
        <div className="grainBackground" />
        <div className="spimarSection__inner">
          <p className="spimarEyebrow">{t("eyebrow")}</p>
          <SplitTitle as="h1" className="spimarHeading" text={t("title")} />
          <p className="spimarLede">{t("lede")}</p>
          <div className="spimarActions">
            <Link className="spimarButton spimarButton--primary" href="/contact">
              <span className="label">{t("ctaButton")}</span>
            </Link>
            <Link className="spimarButton spimarButton--ghost" href="/salons">
              <span className="label">{te("title")}</span>
            </Link>
          </div>
        </div>
      </section>

      <Inview as="section" className="spimarSection spimarSection--tight reveal">
        <p className="spimarNotice">{t("note")}</p>
      </Inview>

      {/* Chapter 3 — country/city event opportunities, within the first three
          content chapters as the specification requires. */}
      <Inview as="section" className="spimarSection reveal">
        <div className="spimarCols">
          <div className="spimarCols__label">{t("eventsHeading")}</div>
          <div className="spimarCols__main">
            {events.length === 0 ? (
              <EmptyState title={te("emptyTitle")} body={te("emptyBody")} />
            ) : (
              <ul className="spimarGrid">
                {events.map((event) => (
                  <li key={event.id} className="spimarCard">
                    <p className="spimarCard__meta">
                      {[event.city, event.country].filter(Boolean).join(", ")}
                    </p>
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
          </div>
        </div>
      </Inview>

      {/* Chapter 5 — why exhibit, on the gold editorial plane */}
      <Inview as="section" className="spimarSection spimarSection--gold reveal">
        <div className="grainBackground" />
        <div className="spimarSection__inner">
          <div className="spimarCols">
            <div className="spimarCols__label">{t("exhibitHeading")}</div>
            <div className="spimarCols__main">
              <h2 className="spimarSubheading">{t("exhibitHeading")}</h2>
              <p className="spimarProse">{t("exhibitBody")}</p>
              <div className="spimarActions">
                <Link className="spimarButton spimarButton--ghost" href="/exposer">
                  <span className="label">{t("exhibitHeading")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Inview>

      {/* Chapter 4 — evidence */}
      <Inview as="section" className="spimarSection reveal">
        <div className="spimarCols">
          <div className="spimarCols__label">{t("proofHeading")}</div>
          <div className="spimarCols__main">
            <h2 className="spimarSubheading">{t("proofHeading")}</h2>
            <p className="spimarProse">{t("proofBody")}</p>
          </div>
        </div>
      </Inview>

      {/* Chapter 18 — qualified final conversion */}
      <Inview as="section" className="spimarSection spimarSection--dark reveal">
        <div className="spimarSection__inner">
          <SplitTitle as="h2" className="spimarSubheading" text={t("ctaHeading")} />
          <p className="spimarLede">{t("ctaBody")}</p>
          <Link className="spimarButton spimarButton--primary" href="/contact">
            <span className="label">
              <span className="fixedLabel">{t("ctaButton")}</span>
              <span className="innerLabel" aria-hidden="true">
                <Marquee text={t("ctaButton")} direction="left" speed={90} />
              </span>
            </span>
          </Link>
        </div>
      </Inview>
    </>
  );
}
