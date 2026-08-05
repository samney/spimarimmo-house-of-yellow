import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";
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
      <PageHeader index="09" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              {cases.length === 0 ? (
                <p className="text medium">{t("empty")}</p>
              ) : (
                <Reveal as="ul" className="spimarCardList" role="list">
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
                </Reveal>
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
