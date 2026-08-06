import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { getBackendSeams } from "@/lib/spimar/repositories";

/* Spec §04 /salons/{event} — the canonical edition page, served from the CMS
   seam. Published editions only: a draft or unknown slug is a 404, never a
   leak. Missing dates and venues render their honest pending state.

   Server-rendered per request so publication state changes apply immediately. */
export const dynamic = "force-dynamic";

export default async function SalonDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("salonsPage");

  const event = await getBackendSeams().content.getEvent({
    siteId: "spimar",
    locale: locale === "en" ? "en" : "fr",
    slug,
  });

  if (!event || event.publicationState !== "published") notFound();

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel">
              <div className="text medium">
                [ <span className="numIndex">04</span> ]
              </div>
            </div>
            <div className="colMain">
              <header className="pageIntro">
                <div className="label text medium">{t("detailLabel")}</div>
                <SplitTitle as="h1" className="normalTitle" text={event.name || slug} />
                <p className="text medium">
                  {event.venue ? `${event.venue.city} — ${event.venue.countryCode}` : t("venueTbc")}
                  {" · "}
                  {event.startsAt
                    ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
                        new Date(event.startsAt),
                      )
                    : t("datesTbc")}
                </p>
              </header>
              <p className="text medium">{t("detailPending")}</p>
              <div className="pageOutro">
                <p className="text medium">
                  <Link href="/exposer/devenir-exposant">{t("outroCta")}</Link>
                  {" · "}
                  <Link href="/salons">{t("backToIndex")}</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
