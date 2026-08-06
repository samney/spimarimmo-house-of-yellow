import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SALONS_2026, type SalonEdition } from "./salons-data";

/* The salons calendar (owner rebuild, D-026): a month rail down the inline
   start with the year's editions attached as photographic cards. Two data
   sources render through the SAME card:

   - the provisional 2026 programme (placeholder fixtures, disclaimed);
   - CMS-published editions, which carry real detail routes — this is the
     durability contract the integration suite verifies (publish → visible
     here), and the path that replaces the fixtures when the backend owns
     the programme.

   Server Component; the only motion is CSS hover depth with no reduced-
   motion obligation (nothing translates or autoplays). */

export type CmsEditionCard = {
  readonly slug: string;
  readonly name: string;
  readonly city: string | null;
  readonly country: string | null;
  readonly datesLabel: string | null;
};

const STATUS_KEY: Record<SalonEdition["status"], string> = {
  open: "statusOpen",
  upcoming: "statusUpcoming",
  past: "statusPast",
};

export async function SalonsCalendar({
  locale,
  cmsEditions,
}: {
  locale: "fr" | "en";
  cmsEditions: readonly CmsEditionCard[];
}) {
  const t = await getTranslations("salonsPage");

  /* CMS editions surface first — they are the validated records. */
  const hasCms = cmsEditions.length > 0;

  return (
    <div className="salcWrap">
      {hasCms && (
        <section className="salcGroup" aria-labelledby="salc-published">
          <h2 className="salcGroupTitle" id="salc-published">
            {t("publishedTitle")}
          </h2>
          <ol className="salcList" role="list">
            {cmsEditions.map((edition) => (
              <li className="salcRow" key={edition.slug}>
                <div className="salcMonth" aria-hidden="true">
                  <span className="salcMonthLabel">{t("publishedBadge")}</span>
                </div>
                <article className="salcCard">
                  <div className="salcMedia salcMedia--empty" aria-hidden="true">
                    <span className="salcMediaMark">{edition.name.slice(0, 1)}</span>
                  </div>
                  <div className="salcBody">
                    <p className="salcPlace">
                      {/* The edition name is the link — the publish→visible
                          contract asserts exactly this accessible name. */}
                      <Link className="salcCity salcTitleLink" href={`/salons/${edition.slug}`}>
                        {edition.name}
                      </Link>
                      {edition.city && (
                        <span className="salcCountry">
                          {edition.city}
                          {edition.country ? `, ${edition.country}` : ""}
                        </span>
                      )}
                    </p>
                    <p className="salcMeta">
                      <span>{edition.datesLabel ?? t("datesTbc")}</span>
                    </p>
                    <div className="salcActions">
                      <Link className="salcCta salcCta--primary" href={`/salons/${edition.slug}`}>
                        {t("cardDetail")}
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="salcGroup" aria-labelledby="salc-programme">
        <div className="salcGroupHead">
          <h2 className="salcGroupTitle" id="salc-programme">
            {t("programmeTitle")}
          </h2>
          {/* The D-026 disclaimer rides with the fixtures it disclaims. */}
          <p className="salcDisclaimer">{t("programmeNote")}</p>
        </div>
        <ol className="salcList" role="list">
          {SALONS_2026.map((edition) => (
            <li className="salcRow" key={edition.slug}>
              <div className="salcMonth">
                <span className="salcMonthIndex">{String(edition.month).padStart(2, "0")}</span>
                <span className="salcMonthLabel">{edition.monthLabel[locale]}</span>
              </div>
              <article className="salcCard">
                <div className="salcMedia">
                  <Image
                    alt=""
                    className="salcPhoto"
                    fill
                    sizes="(max-width: 580px) 88vw, 22vw"
                    src={`/destinations/${edition.slug}.png`}
                  />
                  <span className={`salcStatus salcStatus--${edition.status}`}>
                    {t(STATUS_KEY[edition.status])}
                  </span>
                </div>
                <div className="salcBody">
                  <p className="salcPlace">
                    <span className="salcCity">{edition.city}</span>
                    <span className="salcCountry">{edition.country}</span>
                  </p>
                  <p className="salcMeta">
                    <span className="salcDates">{edition.dates[locale]}</span>
                    <span className="salcVenue">{edition.venue}</span>
                  </p>
                  <p className="salcVisitors">{t("visitorsLabel", { count: edition.visitors })}</p>
                  <div className="salcActions">
                    <Link className="salcCta salcCta--primary" href="/exposer/devenir-exposant">
                      {t("cardExhibit")}
                    </Link>
                    {/* Staged to "#" (D-026) until the edition detail is
                        validated content. */}
                    <a className="salcCta salcCta--ghost" href="#">
                      {t("cardDetail")}
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
