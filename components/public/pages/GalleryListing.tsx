import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SplitTitle } from "@/components/primitives/motion/SplitTitle";
import { GALLERY_CATEGORIES, MEDIA } from "@/components/public/home/galleryData";

/* /ressources/galerie — the full media library, rebuilt (owner note,
   D-026): URL-driven category filters with counts and a paginated flat
   grid, replacing the anchor-nav groups. Every card keeps the honest
   states: demo badge and pending edition until validated media lands. The
   pagination mechanism is live from the start so the layout is already
   correct when the library outgrows one page. */

const PAGE_SIZE = 8;

export async function GalleryListing({
  category,
  page: rawPage,
}: {
  category?: string;
  page?: string;
}) {
  const t = await getTranslations("gallery");
  const tp = await getTranslations("galleryPage");

  const active = GALLERY_CATEGORIES.find((c) => c === category);
  const filtered = active ? MEDIA.filter((m) => m.category === active) : MEDIA;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1), pageCount);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filterHref = (cat?: string, p?: number) => {
    const params = new URLSearchParams();
    if (cat) params.set("categorie", cat);
    if (p && p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `/ressources/galerie?${query}` : "/ressources/galerie";
  };

  return (
    <div className="pageBlocks">
      <section className="spimarListPage">
        <div className="contentWrapper">
          <header className="pageIntro">
            <div className="label text medium">{tp("label")}</div>
            <SplitTitle as="h1" className="normalTitle" text={tp("title")} />
            <p className="text medium">{tp("lead")}</p>
          </header>

          <nav aria-label={tp("navLabel")} className="galListNav">
            <Link
              className="galListNavPill"
              aria-current={!active ? "true" : undefined}
              href={filterHref()}
            >
              {tp("filterAll")}
              <span className="galListNavCount">{MEDIA.length}</span>
            </Link>
            {GALLERY_CATEGORIES.map((cat) => {
              const count = MEDIA.filter((m) => m.category === cat).length;
              if (count === 0) return null;
              return (
                <Link
                  key={cat}
                  className="galListNavPill"
                  aria-current={active === cat ? "true" : undefined}
                  href={filterHref(cat)}
                >
                  {t(`categories.${cat}`)}
                  <span className="galListNavCount">{count}</span>
                </Link>
              );
            })}
          </nav>

          <ul className="galAllGrid" role="list">
            {visible.map((m) => (
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

          {pageCount > 1 && (
            <nav className="etuPagination" aria-label={tp("paginationLabel")}>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  className="etuPage"
                  aria-current={n === page ? "page" : undefined}
                  href={filterHref(active, n)}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}

          {/* Deliberately a div: shell.css styles the bare <footer> tag as
              the fixed 100vw yellow reveal, which overflows 390. */}
          <div className="pageOutro">
            <p className="text medium">
              {tp("outro")} <Link href="/salons">{t("exploreSalons")}</Link>
              {" · "}
              <Link href="/ressources">{tp("outroLibrary")}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
