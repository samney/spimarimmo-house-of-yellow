import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";
import { PageCta, PillLabel } from "@/components/public/pages/PageCta";
import { ArrowRightIcon } from "@/components/public/home/impactIcons";

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
                <span className="salonHeroChip salonHeroChip--gold">
                  {event.venue ? `${event.venue.city} — ${event.venue.countryCode}` : t("venueTbc")}
                </span>
                <span className="salonHeroChip salonHeroChip--ink">
                  {dateRange ?? t("datesTbc")}
                </span>
              </div>
            </div>
          </header>

          {/* Two columns give the context its power (owner direction,
              2026-08-07): the editorial reads wide on the left; the raised
              fact card holds the edition's identity — each fact
              independently known or independently pending — with the
              conversion path riding it. */}
          <div className="salonGrid">
            <Reveal as="section" className="salonAboutCol" aria-labelledby="salon-about-title">
              <h2 className="etuGroupTitle" data-reveal id="salon-about-title">
                {t("detailAbout")}
              </h2>
              {event.summary ? (
                <p className="salonAboutText" data-reveal>
                  {event.summary}
                </p>
              ) : null}
              <p className="salonPendingNote" data-reveal>
                {t("detailPending")}
              </p>
            </Reveal>

            <Reveal as="aside" className="salonFactsCard" aria-labelledby="salon-facts-title">
              <h2 className="salonFactsTitle" data-reveal id="salon-facts-title">
                {t("detailBrief")}
              </h2>
              <dl className="salonFactsRows" data-reveal>
                <div className="salonFactsRow">
                  <dt>{t("detailCity")}</dt>
                  <dd>{event.venue?.city || t("venueTbc")}</dd>
                </div>
                <div className="salonFactsRow">
                  <dt>{t("detailCountry")}</dt>
                  <dd>{event.venue?.countryCode || t("venueTbc")}</dd>
                </div>
                <div className="salonFactsRow">
                  <dt>{t("detailDates")}</dt>
                  <dd className="salonFactsDates">{dateRange ?? t("datesTbc")}</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* The branded hook (owner direction, 2026-08-07): the gold ground
              carries the conversion moment — the edition's own name in the
              ask, the approved audience statement beneath it, the live
              funnel pill and the edition site staged beside it. */}
          <Reveal as="section" className="salonHook" aria-labelledby="salon-hook-title">
            <span className="salonHook__grain" aria-hidden="true" />
            <div className="salonHook__copy" data-reveal>
              <h2 className="salonHook__title" id="salon-hook-title">
                {t("hookTitle", { place: event.venue?.city || event.name || slug })}
              </h2>
              <p className="salonHook__lead">{t("hookLead")}</p>
            </div>
            <div className="salonHook__actions" data-reveal>
              <Link className="button dark" href="/exposer/devenir-exposant">
                <PillLabel text={t("outroCta")} />
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </Link>
              <a className="button outline" href="#">
                <PillLabel text={t("salonSite")} />
                <span className="icon">
                  <ArrowRightIcon />
                </span>
              </a>
            </div>
          </Reveal>

          {/* One action band, not two (owner review, 2026-08-07): the closing
              PageCta carries the whole path — the live conversion CTA, the
              edition's own site staged to "#" until it exists, and the way
              back to the calendar. */}
          <PageCta
            text={t("outro")}
            actions={[
              { label: t("outroCta"), href: "/exposer/devenir-exposant" },
              { label: t("salonSite"), href: "#", staged: true },
              { label: t("backToIndex"), href: "/salons" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
