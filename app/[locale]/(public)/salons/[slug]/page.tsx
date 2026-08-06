import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons/{event} — the canonical edition page, rebuilt as a real
   destination page (owner remark, 2026-08-06): photographic hero with the
   edition identity over it, fact tiles, the editorial block, and a clear
   action band — Devenir exposant live, the salon's own site staged to "#"
   until each edition's site exists. Served from the CMS seam; published
   editions only, drafts and unknown slugs 404. No demo badge renders
   (owner remark) — the data keeps its flag, the face stays clean. */
export const dynamic = "force-dynamic";

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

  const place = event.venue ? `${event.venue.city} — ${event.venue.countryCode}` : t("venueTbc");
  return buildMetadata({
    label: event.name || slug,
    description: event.summary || `${place}. ${t("detailPending")}`,
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

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const start = event.startsAt ? new Date(event.startsAt) : null;
  const end = event.endsAt ? new Date(event.endsAt) : null;
  const dateRange = start
    ? end
      ? dateFormat.formatRange(start, end)
      : dateFormat.format(start)
    : null;

  return (
    <div className="pageBlocks">
      <section className="spimarListPage salonDetail">
        <div className="contentWrapper">
          <nav className="detailCrumb" aria-label={t("breadcrumb")}>
            <Link className="text medium" href="/salons">
              ← {t("backToIndex")}
            </Link>
          </nav>

          {/* Edition hero: the destination photograph carries the identity —
              title, place and dates read over it. */}
          <header className="etuHero salonHero">
            {event.image ? (
              <Image
                src={event.image.src}
                alt={event.image.alt}
                className="etuHeroPhoto"
                fill
                sizes="(max-width: 580px) 92vw, 90vw"
                priority
              />
            ) : null}
            <div className="salonHero__scrim" aria-hidden="true" />
            <div className="salonHero__body">
              <p className="salonHero__kicker">{t("detailLabel")}</p>
              <SplitTitle as="h1" className="salonHero__title" text={event.name || slug} />
              <div className="salonHero__chips">
                <span className="etuEdition">
                  {event.venue ? `${event.venue.city} — ${event.venue.countryCode}` : t("venueTbc")}
                </span>
                <span className="etuClient">{dateRange ?? t("datesTbc")}</span>
              </div>
            </div>
          </header>

          {/* The facts as tiles: each independently known or independently
              pending, so one "à confirmer" never hedges the others. */}
          <section className="etuResults" aria-labelledby="salon-facts-title">
            <h2 className="etuGroupTitle" id="salon-facts-title">
              {t("detailFacts")}
            </h2>
            <ul className="etuTiles" role="list">
              <li className="etuTile">
                <span className="etuTileValue">{event.venue?.city || t("venueTbc")}</span>
                <span className="etuTileLabel">{t("detailCity")}</span>
              </li>
              <li className="etuTile">
                <span className="etuTileValue">{event.venue?.countryCode || t("venueTbc")}</span>
                <span className="etuTileLabel">{t("detailCountry")}</span>
              </li>
              <li className="etuTile">
                <span className="etuTileValue salonTileDates">{dateRange ?? t("datesTbc")}</span>
                <span className="etuTileLabel">{t("detailDates")}</span>
              </li>
            </ul>
          </section>

          {event.summary ? (
            <div className="blogArticle salonAbout">
              <p className="blogParagraph">{event.summary}</p>
              <p className="blogDisclaimer">{t("detailPending")}</p>
            </div>
          ) : (
            <p className="blogDisclaimer salonAbout">{t("detailPending")}</p>
          )}

          {/* Action band: the conversion path live, the edition's own site
              staged to "#" until it exists. */}
          <div className="salcActions salonActions">
            <Link className="salcCta salcCta--primary" href="/exposer/devenir-exposant">
              {t("outroCta")}
            </Link>
            <a className="salcCta salcCta--ghost" href="#">
              {t("salonSite")}
            </a>
          </div>

          <footer className="pageOutro">
            <p className="text medium">
              <Link href="/salons">{t("backToIndex")}</Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
