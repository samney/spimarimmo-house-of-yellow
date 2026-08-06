import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";
import Image from "next/image";
import { CASE_STUDIES } from "@/components/public/pages/case-studies-data";

/* Case-study detail: header title, then the video slot, then the prose —
   served from the CMS pages seam (`etudes/` family). A draft or unknown slug
   is a 404, never a leak. The video slot renders its honest pending state:
   no case video is published without validated media. */
export const dynamic = "force-dynamic";

/* Per-case metadata: the study's own title is the searchable thing. The
   description reuses the published intro, so nothing is written here that an
   editor has not already approved; a case with no intro falls back to the
   listing's own lead rather than to an invented summary. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  const fixture = CASE_STUDIES.find((c) => c.slug === slug);
  if (fixture) {
    const loc = locale === "en" ? ("en" as const) : ("fr" as const);
    return buildMetadata({
      label: fixture.title[loc],
      description: fixture.summary[loc],
      path: `/etudes-de-cas/${slug}`,
      locale,
    });
  }
  const page = await getBackendSeams().content.getPage({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
    slug: `etudes/${slug}`,
  });
  if (!page || page.publicationState !== "published") return {};

  const intro = String(page.sections[0]?.body.intro ?? "").trim();
  return buildMetadata({
    label: page.title || slug,
    description: intro || t("lead"),
    path: `/etudes-de-cas/${slug}`,
    locale,
  });
}

export default async function EtudeDeCas({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("caseStudies");

  /* A provisional fixture (D-026) renders the designed detail — hero image,
     disclaimed result tiles, dispositif quote. Fixture slugs are namespaced
     descriptors that cannot collide with CMS slugs; everything else falls
     through to the CMS seam and its draft-is-404 rule. */
  const fixture = CASE_STUDIES.find((c) => c.slug === slug);
  if (fixture) {
    return (
      <div className="pageBlocks">
        <section className="spimarListPage">
          <div className="contentWrapper">
            <nav className="detailCrumb" aria-label={t("breadcrumb")}>
              <Link className="text medium" href="/etudes-de-cas">
                ← {t("backToList")}
              </Link>
            </nav>
            <header className="pageIntro">
              <div className="label text medium">{t("detailLabel")}</div>
              <SplitTitle as="h1" className="normalTitle" text={fixture.title[locale]} />
              <p className="detailLead text medium">{fixture.summary[locale]}</p>
            </header>

            <div className="etuDetail">
              <div className="etuHero">
                <Image
                  alt=""
                  className="etuHeroPhoto"
                  fill
                  sizes="(max-width: 580px) 92vw, 60vw"
                  src={fixture.image}
                />
                <div className="etuHeroMeta">
                  <span className="etuEdition">{fixture.edition}</span>
                  <span className="etuClient">{fixture.client[locale]}</span>
                </div>
              </div>

              <section className="etuResults" aria-labelledby="etu-results-title">
                <div className="etuGroupHead">
                  <h2 className="etuGroupTitle" id="etu-results-title">
                    {t("resultsTitle")}
                  </h2>
                  <p className="etuDisclaimer">{t("fixturesNote")}</p>
                </div>
                <ul className="etuTiles" role="list">
                  {fixture.results.map((result) => (
                    <li className="etuTile" key={result.label[locale]}>
                      <span className="etuTileValue">{result.value}</span>
                      <span className="etuTileLabel">{result.label[locale]}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <figure className="etuQuote">
                <blockquote className="etuQuoteText">« {fixture.quote[locale]} »</blockquote>
                <figcaption className="etuQuoteRole">{fixture.quoteRole[locale]}</figcaption>
              </figure>
            </div>

            <footer className="pageOutro">
              <p className="text medium">
                <Link href="/etudes-de-cas">{t("backToList")}</Link>

                <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
              </p>
            </footer>
          </div>
        </section>
      </div>
    );
  }

  const page = await getBackendSeams().content.getPage({
    siteId: "spimar",
    locale,
    slug: `etudes/${slug}`,
  });
  if (!page || page.publicationState !== "published") notFound();

  const section = page.sections[0];
  const intro = String(section?.body.intro ?? "");
  const text = String(section?.body.text ?? "");

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          {/* Same designed template as the fixture details (owner remark,
              2026-08-06): no chapter column, no demo badge on the face. */}
          <nav className="detailCrumb" aria-label={t("breadcrumb")}>
            <Link className="text medium" href="/etudes-de-cas">
              ← {t("backToList")}
            </Link>
          </nav>
          <header className="pageIntro">
            <div className="label text medium">{t("detailLabel")}</div>
            <SplitTitle as="h1" className="normalTitle" text={page.title || slug} />
            {intro ? <p className="detailLead text medium">{intro}</p> : null}
          </header>

          <div className="caseVideoSlot" aria-label={t("videoPending")}>
            <span className="caseVideoBadge" aria-hidden="true">
              <Play className="caseVideoIcon" strokeWidth={1.75} />
            </span>
            <p className="text medium">{t("videoPending")}</p>
          </div>

          {text ? (
            <div className="caseBody">
              {text.split(/\n\n+/).map((paragraph, i) => (
                <p key={i} className="text medium">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          <footer className="pageOutro">
            <p className="text medium">
              <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
              <Link href="/etudes-de-cas">{t("backToList")}</Link>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
