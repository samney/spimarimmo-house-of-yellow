import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";

/* Spec §17 — Conversion et réassurance. The seven exhibitor questions come
   from the specification verbatim; every answer states only what other
   published surfaces already state (method, offers, resources) or says
   plainly that the detail is delivered during the commercial exchange.
   No figure, date or claim is invented. */
const QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;

export default async function Faq({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <header className="pageIntro">
            <div className="label text medium">{t("label")}</div>
            <SplitTitle as="h1" className="normalTitle" text={t("title")} />
            <p className="text medium">{t("lead")}</p>
          </header>
          <div className="faqList">
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
          </div>
          <div className="pageOutro">
            <p className="text medium">
              {t("outro")} <Link href="/contact">{t("outroContact")}</Link>
              {" · "}
              <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
