import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";
import { CASE_STUDIES } from "@/components/public/pages/case-studies-data";

/* Case-study detail. Two sources, one 404 rule:

   - a provisional fixture (D-026) renders the designed detail — hero image,
     result tiles with the validation disclaimer, dispositif quote;
   - otherwise the CMS pages seam (`etudes/` family) serves the record, and
     a draft or unknown slug is a 404, never a leak.

   Fixture slugs are namespaced descriptors that cannot collide with CMS
   test slugs. The video slot keeps its honest pending state: no case video
   is published without validated media. */
export const dynamic = "force-dynamic";

export default async function EtudeDeCas({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale === "en" ? ("en" as const) : ("fr" as const);
  const t = await getTranslations("caseStudies");

  const fixture = CASE_STUDIES.find((c) => c.slug === slug);
  if (fixture) {
    return (
      <div className="pageBlocks">
        <section className="spimarListPage">
          <div className="contentWrapper">
            <header className="pageIntro">
              <div className="label text medium">{t("detailLabel")}</div>
              <SplitTitle as="h1" className="normalTitle" text={fixture.title[locale]} />
              <p className="text medium">{fixture.summary[locale]}</p>
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
                  {/* The D-026 disclaimer rides with the figures. */}
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

            <div className="pageOutro">
              <p className="text medium">
                <Link href="/etudes-de-cas">{t("backToList")}</Link>
                {" · "}
                <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
              </p>
            </div>
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
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">09</span> ]
              </div>
            </div>
            <div className="colMain">
              <header className="pageIntro">
                <div className="label text medium">{t("detailLabel")}</div>
                <SplitTitle as="h1" className="normalTitle" text={page.title || slug} />
                {intro ? <p className="text medium">{intro}</p> : null}
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

              <div className="pageOutro">
                <p className="text medium">
                  <Link href="/etudes-de-cas">{t("backToList")}</Link>
                  {" · "}
                  <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
