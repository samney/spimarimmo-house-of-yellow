import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Case-study detail: header title, then the video slot, then the prose —
   served from the CMS pages seam (`etudes/` family). A draft or unknown slug
   is a 404, never a leak. The video slot renders its honest pending state:
   no case video is published without validated media. */
export const dynamic = "force-dynamic";

export default async function EtudeDeCas({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");

  const page = await getBackendSeams().content.getPage({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
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

              <footer className="pageOutro">
                <p className="text medium">
                  <Link href="/etudes-de-cas">{t("backToList")}</Link>
                  {" · "}
                  <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
