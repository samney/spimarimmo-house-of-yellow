import { getTranslations } from "next-intl/server";
import { EmptyState } from "./EmptyState";
import { getPage } from "@/lib/spimar/repository";
import { localized, type Locale } from "@/lib/spimar/types";

/* Renders a CMS-authored standing page.

   Every marketing route (`/exposer`, `/preuves`, `/ressources`) is driven by a
   `Page` record edited in the CMS. When no published record exists the route
   still resolves — it renders its heading and an honest empty state rather than
   404ing, so navigation never appears broken and no copy is invented. */
export async function CmsPage({
  slug,
  fallbackTitle,
  locale,
}: {
  slug: string;
  fallbackTitle: string;
  locale: Locale;
}) {
  const t = await getTranslations("page");
  const page = getPage(slug);

  const title = page ? localized(page.title, locale) || fallbackTitle : fallbackTitle;
  const intro = page ? localized(page.intro, locale) : "";
  const body = page ? localized(page.body, locale) : "";

  return (
    <section className="spimarSection">
      <h1 className="spimarHeading">{title}</h1>
      {intro ? <p className="spimarLede">{intro}</p> : null}

      {body ? (
        <div className="spimarProse">
          {body.split(/\n{2,}/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
      )}
    </section>
  );
}
