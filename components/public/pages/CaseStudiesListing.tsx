import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  CASE_PAGE_SIZE,
  CASE_STUDIES,
  type CaseObjective,
  type CaseStudy,
} from "./case-studies-data";

/* Études de cas listing (owner rebuild, D-026): rows of image + heading +
   summary + detail action, with URL-driven filters and pagination — list
   state lives in the URL so a view is shareable and the back button
   behaves, the same rule the CRM desk follows.

   CMS-published cases render first in their own group with their real
   detail routes (the publish → visible → detail contract the integration
   suite proves). The provisional fixtures below them are disclaimed
   placeholders the owner swaps for validated case records. */

export type CmsCaseCard = {
  readonly slug: string;
  readonly title: string;
  readonly intro: string;
};

export type CaseFilters = {
  readonly edition?: string;
  readonly objective?: CaseObjective;
  readonly page: number;
};

const OBJECTIVES: readonly CaseObjective[] = ["notoriete", "leads", "ventes"];

function filterHref(filters: { edition?: string; objective?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (filters.edition) params.set("edition", filters.edition);
  if (filters.objective) params.set("objectif", filters.objective);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/etudes-de-cas?${query}` : "/etudes-de-cas";
}

export async function CaseStudiesListing({
  locale,
  cmsCases,
  filters,
}: {
  locale: "fr" | "en";
  cmsCases: readonly CmsCaseCard[];
  filters: CaseFilters;
}) {
  const t = await getTranslations("caseStudies");

  const editions = [...new Set(CASE_STUDIES.map((c) => c.editionSlug))];
  const filtered = CASE_STUDIES.filter(
    (c) =>
      (!filters.edition || c.editionSlug === filters.edition) &&
      (!filters.objective || c.objective === filters.objective),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / CASE_PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page), pageCount);
  const visible = filtered.slice((page - 1) * CASE_PAGE_SIZE, page * CASE_PAGE_SIZE);

  const editionLabel = (slug: string) =>
    CASE_STUDIES.find((c) => c.editionSlug === slug)?.edition.replace(/ \d{4}$/, "") ?? slug;

  return (
    <div className="etuWrap">
      {cmsCases.length > 0 && (
        <section className="etuGroup" aria-labelledby="etu-published">
          <h2 className="etuGroupTitle" id="etu-published">
            {t("publishedTitle")}
          </h2>
          <ul className="etuList" role="list">
            {cmsCases.map((cmsCase) => (
              <li className="etuRow etuRow--published" key={cmsCase.slug}>
                <div className="etuBody">
                  <p className="etuKicker">{t("cardKicker")}</p>
                  <h3 className="etuTitle">
                    <Link className="etuTitleLink" href={`/etudes-de-cas/${cmsCase.slug}`}>
                      {cmsCase.title}
                    </Link>
                  </h3>
                  {cmsCase.intro ? <p className="etuSummary">{cmsCase.intro}</p> : null}
                  <div className="etuActions">
                    <Link className="etuCta" href={`/etudes-de-cas/${cmsCase.slug}`}>
                      {t("readCase")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="etuGroup" aria-labelledby="etu-programme">
        <div className="etuGroupHead">
          <h2 className="etuGroupTitle" id="etu-programme">
            {t("fixturesTitle")}
          </h2>
          {/* The D-026 disclaimer rides with the fixtures it disclaims. */}
          <p className="etuDisclaimer">{t("fixturesNote")}</p>
        </div>

        <div className="etuFilters">
          <div className="etuFilterGroup" role="group" aria-label={t("filterEditionLabel")}>
            <Link
              className="etuFilter"
              aria-current={!filters.edition ? "true" : undefined}
              href={filterHref({ objective: filters.objective })}
            >
              {t("filterAll")}
            </Link>
            {editions.map((slug) => (
              <Link
                key={slug}
                className="etuFilter"
                aria-current={filters.edition === slug ? "true" : undefined}
                href={filterHref({ edition: slug, objective: filters.objective })}
              >
                {editionLabel(slug)}
              </Link>
            ))}
          </div>
          <div className="etuFilterGroup" role="group" aria-label={t("filterObjectiveLabel")}>
            {OBJECTIVES.map((objective) => (
              <Link
                key={objective}
                className="etuFilter etuFilter--objective"
                aria-current={filters.objective === objective ? "true" : undefined}
                href={filterHref({
                  edition: filters.edition,
                  objective: filters.objective === objective ? undefined : objective,
                })}
              >
                {t(`objectives.${objective}`)}
              </Link>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="etuEmpty">{t("filterEmpty")}</p>
        ) : (
          <ul className="etuList" role="list">
            {visible.map((study: CaseStudy) => (
              <li className="etuRow" key={study.slug}>
                <div className="etuMedia">
                  <Image
                    alt=""
                    className="etuPhoto"
                    fill
                    sizes="(max-width: 580px) 88vw, 20vw"
                    src={study.image}
                  />
                  <span className="etuEdition">{study.edition}</span>
                </div>
                <div className="etuBody">
                  <p className="etuKicker">
                    {study.client[locale]} · {t(`objectives.${study.objective}`)}
                  </p>
                  <h3 className="etuTitle">
                    <Link className="etuTitleLink" href={`/etudes-de-cas/${study.slug}`}>
                      {study.title[locale]}
                    </Link>
                  </h3>
                  <p className="etuSummary">{study.summary[locale]}</p>
                  <div className="etuActions">
                    <Link className="etuCta" href={`/etudes-de-cas/${study.slug}`}>
                      {t("readCase")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <nav className="etuPagination" aria-label={t("paginationLabel")}>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                className="etuPage"
                aria-current={n === page ? "page" : undefined}
                href={filterHref({
                  edition: filters.edition,
                  objective: filters.objective,
                  page: n,
                })}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
