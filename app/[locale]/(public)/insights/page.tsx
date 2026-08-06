import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { INSIGHTS, type InsightCategory } from "@/components/public/pages/insights-data";

/* Spec §16 — the blog, rebuilt as the card listing (owner note, D-026):
   image, category pill, heading, excerpt and reading time per card, with a
   URL-driven category filter. The articles are provisional fixtures under
   the validation disclaimer; the analyses card on /ressources/exposants
   deep-links into the same records. */

const CATEGORIES: readonly InsightCategory[] = ["marche", "conseils", "analyses"];

export default async function Insights({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("insights");

  const { categorie } = await searchParams;
  const active = CATEGORIES.find((c) => c === categorie);
  const articles = active ? INSIGHTS.filter((a) => a.category === active) : INSIGHTS;

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <header className="pageIntro">
            <div className="label text medium">{t("label")}</div>
            <SplitTitle as="h1" className="normalTitle" text={t("title")} />
            <p className="text medium">{t("lead")}</p>
          </header>

          <div className="blogHead">
            <div className="blogFilters" role="group" aria-label={t("filterLabel")}>
              <Link
                className="blogFilter"
                aria-current={!active ? "true" : undefined}
                href="/insights"
              >
                {t("filterAll")}
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category}
                  className="blogFilter"
                  aria-current={active === category ? "true" : undefined}
                  href={`/insights?categorie=${category}`}
                >
                  {t(`categories.${category}`)}
                </Link>
              ))}
            </div>
            {/* The D-026 disclaimer rides with the fixtures it disclaims. */}
            <p className="blogDisclaimer">{t("fixturesNote")}</p>
          </div>

          <ul className="blogGrid" role="list">
            {articles.map((article) => (
              <li className="blogCard" key={article.slug}>
                <Link className="blogCardLink" href={`/insights/${article.slug}`}>
                  <span className="blogMedia">
                    <Image
                      alt=""
                      className="blogPhoto"
                      fill
                      sizes="(max-width: 580px) 88vw, 26vw"
                      src={article.image}
                    />
                  </span>
                  <span className="blogBody">
                    <span className="blogMeta">
                      <span className="blogPill">{t(`categories.${article.category}`)}</span>
                      <span className="blogMinutes">
                        {t("readingTime", { minutes: article.minutes })}
                      </span>
                    </span>
                    <span className="blogTitle">{article.title[locale]}</span>
                    <span className="blogExcerpt">{article.excerpt[locale]}</span>
                    <span className="blogRead" aria-hidden="true">
                      {t("readArticle")} →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="pageOutro">
            <p className="text medium">
              {t("outro")} <Link href="/ressources">{t("outroResources")}</Link>
              {" · "}
              <Link href="/salons">{t("outroSalons")}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
