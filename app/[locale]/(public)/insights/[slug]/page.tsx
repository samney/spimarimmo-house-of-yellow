import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { INSIGHTS } from "@/components/public/pages/insights-data";
import { PageCta } from "@/components/public/pages/PageCta";

/* Article detail (D-026 fixtures): hero image with category pill and
   reading time, the lede, claim-free body paragraphs, and the convert
   outro. An unknown slug is a 404 — fixture slugs are the only records
   until validated articles replace them. */

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

  const article = INSIGHTS.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <nav className="detailCrumb" aria-label={t("label")}>
            <Link className="text medium" href="/insights">
              ← {t("backToBlog")}
            </Link>
          </nav>
          <header className="pageIntro">
            <div className="label text medium">
              {t(`categories.${article.category}`)} ·{" "}
              {t("readingTime", { minutes: article.minutes })}
            </div>
            <SplitTitle as="h1" className="normalTitle" text={article.title[locale]} />
            <p className="detailLead text medium">{article.excerpt[locale]}</p>
          </header>

          <div className="blogHero">
            <Image
              alt=""
              className="blogHeroPhoto"
              fill
              sizes="(max-width: 580px) 92vw, 60vw"
              src={article.image}
            />
          </div>

          <div className="blogArticle">
            {article.body[locale].map((paragraph, i) => (
              <p className="blogParagraph" key={i}>
                {paragraph}
              </p>
            ))}
            {/* The D-026 disclaimer, restated where the content lives. */}
            <p className="blogDisclaimer">{t("fixturesNote")}</p>
          </div>

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
