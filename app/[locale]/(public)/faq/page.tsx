import type { Metadata } from "next";
import { metadataFromNamespace } from "@/lib/seo/page-metadata";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/public/pages/PageHeader";
import { Reveal } from "@/components/primitives/motion/Reveal";
import { Link } from "@/i18n/navigation";

/* Spec §17 — Conversion et réassurance. The seven exhibitor questions come
   from the specification verbatim; every answer states only what other
   published surfaces already state (method, offers, resources) or says
   plainly that the detail is delivered during the commercial exchange.
   No figure, date or claim is invented. */
const QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromNamespace({ namespace: "faq", path: "/faq", locale });
}

export default async function Faq({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <div className="pageBlocks">
      <PageHeader index="17" label={t("label")} title={t("title")} lead={t("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <Reveal className="faqList">
                {QUESTIONS.map((q, i) => (
                  <details key={q}>
                    <summary>
                      <span className="numIndex text medium">{String(i + 1).padStart(2, "0")}</span>
                      <h2 className="text medium">{t(`${q}.question`)}</h2>
                      <span className="faqMarker" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <div className="faqAnswer text medium">
                      <p>{t(`${q}.answer`)}</p>
                    </div>
                  </details>
                ))}
              </Reveal>
              <footer className="pageOutro">
                <p className="text medium">
                  {t("outro")} <Link href="/contact">{t("outroContact")}</Link>
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
