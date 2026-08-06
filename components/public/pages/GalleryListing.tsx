import Image from "next/image";
import { PageHeader } from "./PageHeader";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GALLERY_CATEGORIES, MEDIA } from "@/components/public/home/galleryData";

/* /ressources/galerie — the full media library.

   The homepage "Preuve terrain" section is a curated teaser with a hard
   display budget; this page is the scalable listing. Composition: editorial
   intro, a category anchor nav (server-rendered — it scales with the library
   without shipping client JS), then one titled group per category with its
   count. Every card keeps the honest states: demo badge and pending edition
   until validated media lands. */
export async function GalleryListing() {
  const t = await getTranslations("gallery");
  const tp = await getTranslations("galleryPage");

  const groups = GALLERY_CATEGORIES.map((category) => ({
    category,
    items: MEDIA.filter((m) => m.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="pageBlocks">
      <PageHeader index="11" label={tp("label")} title={tp("title")} lead={tp("lead")} />
      <section className="spimarListPage">
        <div className="contentWrapper">
          <div className="hoyCols">
            <div className="colLabel" aria-hidden="true" />
            <div className="colMain">
              <nav aria-label={tp("navLabel")} className="galListNav">
                {groups.map(({ category, items }) => (
                  <a key={category} className="galListNavPill" href={`#galerie-${category}`}>
                    {t(`categories.${category}`)}
                    <span className="galListNavCount">{items.length}</span>
                  </a>
                ))}
              </nav>

              {groups.map(({ category, items }) => (
                <section
                  key={category}
                  aria-labelledby={`galerie-${category}-title`}
                  className="galListGroup"
                  id={`galerie-${category}`}
                >
                  <h2 className="label text medium" id={`galerie-${category}-title`}>
                    {t(`categories.${category}`)}{" "}
                    <span className="galListNavCount">{items.length}</span>
                  </h2>
                  <ul className="galAllGrid" role="list">
                    {items.map((m) => (
                      <li className="galAllCard" key={m.id}>
                        <span className="galAllThumb">
                          <Image
                            alt=""
                            className="galTileImg"
                            fill
                            sizes="(max-width: 580px) 90vw, 22vw"
                            src={`/gallery/${m.file}.png`}
                          />
                          <span className="galDemoBadge galDemoBadgeSm">{t("demoBadge")}</span>
                        </span>
                        <span className="galAllMeta">
                          <span className="galAllTitle">{t(`items.${m.id}.title`)}</span>
                          <span className="galAllSub">
                            {t(`categories.${m.category}`)} · {t("editionPending")}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <footer className="pageOutro">
                <p className="text medium">
                  {tp("outro")} <Link href="/salons">{t("exploreSalons")}</Link>
                  <Link href="/ressources">{tp("outroLibrary")}</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
