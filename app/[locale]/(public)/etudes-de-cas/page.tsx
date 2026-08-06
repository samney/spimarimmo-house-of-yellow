import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Owner restructure (2026-08-04): /etudes-de-cas is the CMS-driven listing —
   case studies are CMS pages under the `etudes/` slug family, created and
   published from /admin/pages. Published cases only; an honest empty state
   while none is published. Server-rendered per request so a publish is
   visible immediately. */
export const dynamic = "force-dynamic";

const PREFIX = "etudes/";

export default async function EtudesDeCas({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");

  const pages = await getBackendSeams().content.listPages({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
  });
  const cases = pages.filter((p) => p.slug.startsWith(PREFIX));

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
                <div className="label text medium">{t("label")}</div>
                <SplitTitle as="h1" className="normalTitle" text={t("title")} />
                <p className="text medium">{t("lead")}</p>
              </header>
              {cases.length === 0 ? (
                <p className="text medium">{t("empty")}</p>
              ) : (
                <ul className="spimarCardList" role="list">
                  {cases.map((page) => {
                    const intro = String(page.sections[0]?.body.intro ?? "");
                    return (
                      <li key={page.slug} className="cardItem">
                        <span className="cardKicker text medium">{t("cardKicker")}</span>
                        <h2 className="text medium">
                          <Link href={`/etudes-de-cas/${page.slug.slice(PREFIX.length)}`}>
                            {page.title || page.slug.slice(PREFIX.length)}
                          </Link>
                        </h2>
                        {intro ? <span className="cardNote text medium">{intro}</span> : null}
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="pageOutro">
                <p className="text medium">
                  {t("outro")} <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
