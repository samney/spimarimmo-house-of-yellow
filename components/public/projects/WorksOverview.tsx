"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/public/global/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { HeroLetters } from "@/components/public/home/HeroLetters";
import { CATEGORIES, PROJECTS, type Project } from "@/lib/content/projects";
import { ResilientVideo } from "@/components/public/media/ResilientVideo";
import { getProjectPoster } from "@/lib/media/posters";
import { resolveLegacyVideoPath } from "@/lib/media/video-registry";

/* Made by Yellow overview replicating the reference projectsOverviewBlock:
   a six-position floating-media constellation around the HOY letterform,
   a full-viewport filter state, and animated Grid/List state convergence. */

function GridIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M0 0H6V3C6 4.65685 4.65685 6 3 6H0V0Z" fill="currentColor" />
      <path d="M0 7H3C4.65685 7 6 8.34315 6 10V13H0V7Z" fill="currentColor" />
      <path d="M7 0H13V6H10C8.34315 6 7 4.65685 7 3V0Z" fill="currentColor" />
      <path d="M7 10C7 8.34315 8.34315 7 10 7H13V13H7V10Z" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[0.5, 2.5, 4.5, 6.5, 8.5, 10.5, 12.5].map((y) => (
        <line key={y} y1={y} x2="13" y2={y} stroke="currentColor" />
      ))}
    </svg>
  );
}

function ProjectTile({ p, index }: { p: Project; index: number }) {
  return (
    <Link
      className={`project visible ${p.orientation}`}
      href={`/project/${p.slug}`}
      aria-label={p.title}
      data-cursor="play"
      data-layout-slot={(index % 6) + 1}
      data-scroll-speed={[6, 3, 2, 4, 1, 3][index % 6]}
    >
      <span className="innerProject">
        <ResilientVideo
          className="mediaPlane--fill"
          src={resolveLegacyVideoPath(p.video)}
          poster={getProjectPoster(p)}
        />
        <span className="projectHover" aria-hidden="true">
          <span className="projectHoverMarker" />
          <span className="smallTitle">{p.title}</span>
        </span>
      </span>
    </Link>
  );
}

function ProjectRow({ p }: { p: Project }) {
  return (
    <Link
      className={`projectList ${p.orientation}`}
      href={`/project/${p.slug}`}
      aria-label={`${p.title}, ${p.year}, ${p.sector}`}
    >
      <span className="rowMain">
        <span className="year">{p.year}</span>
        <span className="listTitle">{p.title}</span>
        <span className="listSector">{p.sector}</span>
        <span className="listCategory">{p.categories[0]}</span>
      </span>
      <span className="rowStats">
        <span>
          <span className="statLabel">Views</span>
          {p.views}
        </span>
        <span>
          <span className="statLabel">Delivery time</span>
          {p.delivery}
        </span>
      </span>
    </Link>
  );
}

export function WorksOverview() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState<string[]>([]);

  useEffect(() => {
    if (!filtersOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [filtersOpen]);

  const filtered = useMemo(
    () =>
      active.length === 0
        ? PROJECTS
        : PROJECTS.filter((p) => p.categories.some((c) => active.includes(c))),
    [active],
  );

  const toggleCategory = (c: string) =>
    setActive((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  return (
    <div
      className="projectsOverviewBlock"
      data-view={view}
      data-filter-open={filtersOpen ? "true" : "false"}
      data-active-filter-count={active.length}
    >
      <div className="worksLetterform" data-testid="works-letterform" aria-hidden="true">
        <div className="worksLetterformSticky">
          <HeroLetters />
        </div>
      </div>

      <div className="projectsStage contentWrapper" data-view={view}>
        <div
          className={`worksGrid${view === "grid" ? " active" : ""}`}
          data-testid="works-grid"
          data-project-count={filtered.length}
          aria-hidden={view !== "grid"}
          inert={filtersOpen || view !== "grid"}
        >
          {filtered.map((p, index) => (
            <ProjectTile p={p} index={index} key={p.slug} />
          ))}
        </div>
        <div
          className={`worksList${view === "list" ? " active" : ""}`}
          data-testid="works-list"
          data-project-count={filtered.length}
          aria-hidden={view !== "list"}
          inert={filtersOpen || view !== "list"}
        >
          {filtered.map((p) => (
            <ProjectRow p={p} key={p.slug} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="noResults text">No works match these filters.</div>
        )}
      </div>

      {filtersOpen && (
        <div
          className="worksFilterOverlay"
          id="work-filters"
          role="dialog"
          aria-modal="true"
          aria-label="Filter works"
        >
          <div className="filterPanel" role="group" aria-label="Work categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filterCategory textTitle${active.includes(c) ? " active" : ""}`}
                onClick={() => toggleCategory(c)}
                aria-pressed={active.includes(c)}
              >
                <span>{c}</span>
                <span className="filterCategoryIcon" aria-hidden="true">
                  <PlusIcon size={12} />
                </span>
              </button>
            ))}
            {active.length > 0 && (
              <button className="resetFilters textTitle" onClick={() => setActive([])}>
                <span className="fixedLabel">Reset filters</span>
                <span className="innerLabel" aria-hidden="true">
                  <Marquee text="Reset filters" direction="left" speed={45} />
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="filterWrapper">
        <button
          className={`filter hoverLink${filtersOpen ? " active" : ""}`}
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="work-filters"
        >
          <span className="icon">
            <PlusIcon />
          </span>
          <span className="label textTitle">+ filter works</span>
        </button>
        <div className="viewBox" role="group" aria-label="View style">
          <button
            className={`viewBoxItem hoverLink${view === "grid" ? " active" : ""}`}
            data-style="grid"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
          >
            <span className="viewBoxIcon">
              <GridIcon />
            </span>
            <span className="viewBoxLabel textTitle">Grid</span>
          </button>
          <button
            className={`viewBoxItem hoverLink${view === "list" ? " active" : ""}`}
            data-style="list"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
          >
            <span className="viewBoxIcon">
              <ListIcon />
            </span>
            <span className="viewBoxLabel textTitle">List</span>
          </button>
        </div>
      </div>
    </div>
  );
}
