import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { INSIGHTS } from "@/components/public/pages/insights-data";
import { PageCta } from "@/components/public/pages/PageCta";

/* Article detail — refactored to the owner's reference structure
   (aljaridapro blog, 2026-08-07): the branded PAGE HEADER carries the
   article's identity — crumb back to the blog, category and reading-time
   chips, the title and the excerpt as subtitle — then a CONTAINED banner
   (no viewport-breaking image), the body on a CENTRED readable measure
   with a lead opening, the D-026 disclaimer as a gold callout where the
   content lives, the next article suggested, and the convert outro.
   Claim-free fixtures only; an unknown slug is a 404. */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = INSIGHTS.find((a) => a.slug === slug);
  if (!article) return {};
  const loc = locale === "en" ? ("en" as const) : ("fr" as const);
  return buildMetadata({
    label: article.title[loc],
    description: article.excerpt[loc],
    path: `/insights/${slug}`,
    locale,
  });
}

export default async function InsightArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("insights");

  const index = INSIGHTS.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();
  const article = INSIGHTS[index];
  const next = INSIGHTS[(index + 1) % INSIGHTS.length];

  return (
    <div className="pageBlocks">
      {/* The page header IS the article hero (owner direction): title and
          subtitle in the branded band, with the article's meta riding the
          action row. */}
      <PageHeader label={t("label")} title={article.title[locale]} lead={article.excerpt[locale]}>
        <Link className="blogMetaBack" href="/insights">
          ← {t("backToBlog")}
        </Link>
        <span className="blogMetaChip blogMetaChip--gold">
          {t(`categories.${article.category}`)}
        </span>
        <span className="blogMetaChip">{t("readingTime", { minutes: article.minutes })}</span>
      </PageHeader>

      <section className="spimarListPage">
        <div className="contentWrapper">
          {/* Contained banner — never a viewport-breaking plate. */}
          <div className="blogHero">
            <Image
              alt=""
              className="blogHeroPhoto"
              fill
              priority
              sizes="(max-width: 580px) 92vw, 62vw"
              src={article.image}
            />
          </div>

          <article className="blogArticle">
            {article.body[locale].map((paragraph, i) => (
              <p className="blogParagraph" key={i}>
                {paragraph}
              </p>
            ))}
            {/* The D-026 disclaimer as the reference's callout device — a
                gold-railed note where the content lives. */}
            <p className="blogCallout">{t("fixturesNote")}</p>
          </article>

          {/* The next article, suggested cleanly. */}
          <Link className="blogNext" href={`/insights/${next.slug}`}>
            <span className="blogNextLabel">{t("nextArticle")}</span>
            <span className="blogNextMeta">
              <span className="blogNextTitle">{next.title[locale]}</span>
              <span className="blogNextSub">
                {t(`categories.${next.category}`)} · {t("readingTime", { minutes: next.minutes })}
              </span>
            </span>
            <span className="blogNextArrow" aria-hidden="true">
              →
            </span>
          </Link>

          <PageCta
            text={t("outro")}
            actions={[
              { label: t("outroCta"), href: "/exposer/devenir-exposant" },
              { label: t("backToBlog"), href: "/insights" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
