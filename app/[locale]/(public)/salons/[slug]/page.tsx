import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons/{event} — the canonical edition page, served from the CMS
   seam. Published editions only: a draft or unknown slug is a 404, never a
   leak. Missing dates and venues render their honest pending state.

   Server-rendered per request so publication state changes apply immediately. */
export const dynamic = "force-dynamic";

/* The detail pages are where per-item metadata actually earns its keep: an
   edition's own name is what someone searches for and what a shared link should
   read. Unpublished or unknown slugs get no metadata — the page 404s. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "salonsPage" });
  const event = await getBackendSeams().content.getEvent({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
    slug,
  });
  if (!event || event.publicationState !== "published") return {};

  /* Venue and dates are stated only when validated; otherwise the page's own
     pending copy is the description, never an invented date. */
  const place = event.venue ? `${event.venue.city} — ${event.venue.countryCode}` : t("venueTbc");
  return buildMetadata({
    label: event.name || slug,
    description: `${place}. ${t("detailPending")}`,
    path: `/salons/${slug}`,
    locale,
  });
}

export default async function SalonDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("salonsPage");

  const event = await getBackendSeams().content.getEvent({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
    slug,
  });

  if (!event || event.publicationState !== "published") notFound();

  const dateRange = event.startsAt
    ? [event.startsAt, event.endsAt]
        .filter(Boolean)
        .map((d) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(d!)))
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(" — ")
    : null;

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
              {/* Back path before the title, not only in the outro (N-02): on a
                  detail page reached from search, the way out is part of
                  orienting, and a visitor should not have to read to the bottom
                  to find it. */}
              <nav className="detailCrumb" aria-label={t("breadcrumb")}>
                <Link className="text medium" href="/salons">
                  ← {t("backToIndex")}
                </Link>
              </nav>
              <header className="pageIntro">
                <div className="label text medium">
                  {t("detailLabel")}
                  {event.demo ? <span className="cardItem__demo">Démo</span> : null}
                </div>
                <SplitTitle as="h1" className="normalTitle" text={event.name || slug} />
                {event.summary ? <p className="detailLead text medium">{event.summary}</p> : null}
              </header>

              {event.image ? (
                <figure className="detailMedia">
                  <Image
                    src={event.image.src}
                    alt={event.image.alt}
                    width={1200}
                    height={640}
                    sizes="(max-width: 580px) 100vw, 60vw"
                    priority
                  />
                </figure>
              ) : null}

              {/* The facts as a description list rather than a sentence: each is
                  independently known or independently pending, and a list lets
                  one be "à confirmer" without hedging the others. */}
              <h2 className="detailFactsTitle text medium">{t("detailFacts")}</h2>
              <dl className="detailFacts">
                <div className="detailFacts__row">
                  <dt className="text medium">{t("detailCity")}</dt>
                  <dd className="text medium">{event.venue?.city || t("venueTbc")}</dd>
                </div>
                <div className="detailFacts__row">
                  <dt className="text medium">{t("detailCountry")}</dt>
                  <dd className="text medium">{event.venue?.countryCode || t("venueTbc")}</dd>
                </div>
                <div className="detailFacts__row">
                  <dt className="text medium">{t("detailDates")}</dt>
                  <dd className="text medium">{dateRange ?? t("datesTbc")}</dd>
                </div>
              </dl>

              <p className="text medium">{t("detailPending")}</p>
              <footer className="pageOutro">
                <p className="text medium">
                  <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                  {" · "}
                  <Link href="/salons">{t("backToIndex")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
