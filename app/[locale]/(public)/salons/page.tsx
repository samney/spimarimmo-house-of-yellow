import type { Metadata } from "next";
import Image from "next/image";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons — the destinations and editions index, served from the CMS
   seam (P-01). Published editions only; while none is published the page states
   that honestly instead of inventing a programme. Dates and venues that are not
   validated render their pending state, never a guess.

   The country filter is a plain GET form on a `?pays=` query parameter, handled
   on the server. That is not a limitation: it means the filter works with no
   JavaScript, every filtered view has its own shareable URL, and the page stays
   a Server Component with no client bundle. A client-side filter would buy
   nothing here — the list is short and already server-rendered per request.

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

export default async function Salons({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ pays?: string }>;
}) {
  const { locale } = await params;
  const { pays } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("salonsPage");

  const events = await getBackendSeams().content.listEvents({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
  });

  /* Countries come from the published records themselves, so the filter can
     never offer a country with nothing behind it. */
  const countries = [
    ...new Map(
      events
        .filter((e) => e.venue?.countryCode)
        .map((e) => [e.venue!.countryCode, e.venue!.countryCode]),
    ).keys(),
  ].sort();

  const selected = pays && countries.includes(pays) ? pays : null;
  const shown = selected ? events.filter((e) => e.venue?.countryCode === selected) : events;

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <div className="pageBlocks">
      <PageHeader index="04" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              {/* The filter is offered only when there is something to filter —
                  a country select over one edition is furniture, not a tool. */}
              {countries.length > 1 ? (
                <form className="listFilter" method="get" action="">
                  <label className="listFilter__label text medium" htmlFor="pays">
                    {t("filterLabel")}
                  </label>
                  <select
                    className="listFilter__select"
                    id="pays"
                    name="pays"
                    defaultValue={selected ?? ""}
                  >
                    <option value="">{t("filterAll")}</option>
                    {countries.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  {/* Submits without JavaScript; a client-side onChange would
                      leave keyboard-only and no-JS visitors unable to filter. */}
                  <button className="listFilter__submit" type="submit">
                    {t("filterApply")}
                  </button>
                </form>
              ) : null}

              {events.length === 0 ? (
                <p className="text medium">{t("empty")}</p>
              ) : (
                <>
                  {/* There is deliberately no "no results" state. The country
                      options are derived from the published records, and an
                      unrecognised `?pays=` is ignored rather than honoured, so a
                      filtered view can never be empty. Writing that branch anyway
                      would leave unreachable code that reads like a designed
                      state — which is how a later session ends up building
                      against something that cannot happen. */}
                  <p className="listCount text medium" aria-live="polite">
                    {shown.length === 1 ? t("countOne") : t("countMany", { count: shown.length })}
                    {selected ? (
                      <>
                        {" · "}
                        <Link href="/salons">{t("clearFilter")}</Link>
                      </>
                    ) : null}
                  </p>
                  <Reveal as="ul" className="spimarCardList" role="list">
                    {shown.map((event) => (
                      <li key={event.slug} className="cardItem cardItem--media">
                        {event.image ? (
                          <span className="cardItem__media">
                            <Image
                              src={event.image.src}
                              alt={event.image.alt}
                              width={480}
                              height={320}
                              sizes="(max-width: 580px) 100vw, 22vw"
                            />
                          </span>
                        ) : null}
                        <span className="cardItem__body">
                          {event.demo ? <span className="cardItem__demo">Démo</span> : null}
                          <span className="cardKicker text medium">
                            {event.venue
                              ? `${event.venue.city} — ${event.venue.countryCode}`
                              : t("venueTbc")}
                          </span>
                          <h2 className="text medium">
                            <Link href={`/salons/${event.slug}`}>{event.name || event.slug}</Link>
                          </h2>
                          {/* An editor may publish an edition before writing its
                              blurb; the card must not collapse when they do. */}
                          {event.summary ? (
                            <span className="cardSummary text medium">{event.summary}</span>
                          ) : null}
                          <span className="cardNote text medium">
                            {event.startsAt
                              ? dateFormat.format(new Date(event.startsAt))
                              : t("datesTbc")}
                          </span>
                        </span>
                      </li>
                    ))}
                  </Reveal>
                </>
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
