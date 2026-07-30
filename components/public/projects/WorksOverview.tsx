"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/public/global/Marquee";
import { PlusIcon } from "@/components/public/global/logos";
import { CATEGORIES, PROJECTS, type Project } from "@/lib/content/projects";

/* Made by Yellow overview replicating the reference projectsOverviewBlock:
   masonry-style grid of landscape/portrait autoplaying tiles, "+ filter works"
   panel with 8 categories + Reset filters, Grid/List view toggle (reference
   viewBox markup), list view with year/title/views/delivery rows. */

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 0H6V3C6 4.65685 4.65685 6 3 6H0V0Z" fill="currentColor" />
      <path d="M0 7H3C4.65685 7 6 8.34315 6 10V13H0V7Z" fill="currentColor" />
      <path d="M7 0H13V6H10C8.34315 6 7 4.65685 7 3V0Z" fill="currentColor" />
      <path d="M7 10C7 8.34315 8.34315 7 10 7H13V13H7V10Z" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {[0.5, 2.5, 4.5, 6.5, 8.5, 10.5, 12.5].map((y) => (
        <line key={y} y1={y} x2="13" y2={y} stroke="currentColor" />
      ))}
    </svg>
  );
}

function ProjectTile({ p }: { p: Project }) {
  return (
    <Link className={`project visible ${p.orientation}`} href={`/project/${p.slug}`} data-cursor="play">
      <span className="media">
        <video src={p.video} poster={p.poster} muted loop playsInline autoPlay preload="metadata" />
        <span className="tags">
          {p.categories.map((c) => (
            <span className="tag" key={c}>
              {c}
            </span>
          ))}
        </span>
        <span className="takeALook textTitle">Take a look</span>
      </span>
      <span className="projectTitle">{p.title}</span>
    </Link>
  );
}

function ProjectRow({ p }: { p: Project }) {
  return (
    <Link className={`projectList ${p.orientation}`} href={`/project/${p.slug}`}>
      <span className="rowMain">
        <span className="year">{p.year}</span>
        <span className="listTitle">{p.title}</span>
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
    <div className="projectsOverviewBlock">
      <div className="contentWrapper">
        {view === "grid" ? (
          <div className="worksGrid">
            {filtered.map((p) => (
              <ProjectTile p={p} key={p.slug} />
            ))}
          </div>
        ) : (
          <div className="worksList">
            {filtered.map((p) => (
              <ProjectRow p={p} key={p.slug} />
            ))}
          </div>
        )}
        {filtered.length === 0 && <div className="noResults text">No works match these filters.</div>}
      </div>

      <div className="filterWrapper">
        {filtersOpen && (
          <div className="filterPanel">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`filterCategory textTitle${active.includes(c) ? " active" : ""}`}
                onClick={() => toggleCategory(c)}
                aria-pressed={active.includes(c)}
              >
                {c}
              </button>
            ))}
            {active.length > 0 && (
              <button className="resetFilters textTitle" onClick={() => setActive([])}>
                <span className="fixedLabel">Reset filters</span>
                <span className="innerLabel">
                  <Marquee text="Reset filters" direction="left" speed={45} />
                </span>
              </button>
            )}
          </div>
        )}
        <button
          className="filter hoverLink"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
        >
          <span className="icon">
            <PlusIcon />
          </span>
          <span className="label textTitle"> + filter works</span>
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
