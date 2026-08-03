"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArmchairIcon,
  BuildingsIcon,
  FamilyIcon,
  HouseIcon,
  ImagePendingIcon,
  ParasolIcon,
  SuitcaseIcon,
} from "./mreIcons";

/* The motivations explorer for section 06.
 *
 * The only client island of the section: two pieces of state (active filter,
 * active motivation), no effects, no observers, no scroll work. Selecting a
 * filter narrows the rail; if the active motivation falls outside the filter,
 * the first visible one becomes active, so the detail pane can never show a
 * motivation the rail does not.
 *
 * Numbering is global and stable: a motivation keeps its 01-06 identity in
 * every filter state, because the six motivations are a fixed editorial set
 * ("Six motivations structurent la demande") and renumbering under a filter
 * would make the same motivation change name between visits. The rail count
 * and the dots' active position are the only things a filter changes.
 *
 * Three of the six photos exist as validated assets. The other three render a
 * designed pending state rather than a borrowed or invented visual, matching
 * the section-05 rule that unvalidated material is shown as such. Dropping the
 * validated file into /public/images/mre and filling `image` here is the whole
 * swap. */

type FilterKey = "all" | "life" | "investment" | "transmission";

type Motivation = {
  readonly key: string;
  readonly num: string;
  readonly filter: Exclude<FilterKey, "all">;
  readonly Icon: (props: { className?: string }) => React.JSX.Element;
  readonly image: string | null;
};

const MOTIVATIONS: readonly Motivation[] = [
  {
    key: "principale",
    num: "01",
    filter: "life",
    Icon: HouseIcon,
    image: "/images/mre/residence-principale.jpg",
  },
  { key: "secondaire", num: "02", filter: "life", Icon: ParasolIcon, image: null },
  {
    key: "retour",
    num: "03",
    filter: "life",
    Icon: SuitcaseIcon,
    image: "/images/mre/retour-au-maroc.jpg",
  },
  { key: "retraite", num: "04", filter: "life", Icon: ArmchairIcon, image: null },
  {
    key: "patrimonial",
    num: "05",
    filter: "investment",
    Icon: BuildingsIcon,
    image: "/images/mre/investissement-patrimonial.jpg",
  },
  { key: "transmission", num: "06", filter: "transmission", Icon: FamilyIcon, image: null },
];

const FILTERS: readonly FilterKey[] = ["all", "life", "investment", "transmission"];

export function MreExplorer() {
  const t = useTranslations("mre");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeKey, setActiveKey] = useState<string>(MOTIVATIONS[0].key);

  const visible = useMemo(
    () => MOTIVATIONS.filter((m) => filter === "all" || m.filter === filter),
    [filter],
  );
  const active = visible.find((m) => m.key === activeKey) ?? visible[0];

  const selectFilter = (next: FilterKey) => {
    setFilter(next);
    const stillVisible = MOTIVATIONS.some(
      (m) => m.key === activeKey && (next === "all" || m.filter === next),
    );
    if (!stillVisible) {
      const first = MOTIVATIONS.find((m) => next === "all" || m.filter === next);
      if (first) setActiveKey(first.key);
    }
  };

  const tags = t(`motivations.${active.key}.tags`).split("|");

  return (
    <div className="mreExplorer">
      <div className="mreFilters" role="group" aria-label={t("filtersLabel")}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className="mreFilter"
            aria-pressed={filter === f}
            onClick={() => selectFilter(f)}
          >
            {t(`filters.${f}`)}
          </button>
        ))}
      </div>

      <div className="mrePanel">
        <div className="mreRail">
          <p className="mreRailCount">
            {t("railCount", { count: visible.length })}
          </p>
          <ul className="mreRailList">
            {visible.map((m) => (
              <li key={m.key}>
                <button
                  type="button"
                  className="mreRailItem"
                  aria-current={m.key === active.key}
                  onClick={() => setActiveKey(m.key)}
                >
                  <span className="mreRailIcon" aria-hidden="true">
                    <m.Icon className="mreIcon" />
                  </span>
                  <span className="mreRailText">
                    <span className="mreRailNum">{m.num}</span>
                    <span className="mreRailLabel">{t(`motivations.${m.key}.label`)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Keyed remount restarts the entrance fade on each selection; the
            animation is suppressed under prefers-reduced-motion in CSS. */}
        <div className="mreDetail" key={active.key} aria-live="polite">
          <p className="mreDetailCounter">
            {t("detailCounter", { num: active.num, total: MOTIVATIONS.length })}
          </p>
          <h4 className="mreDetailTitle">{t(`motivations.${active.key}.label`)}</h4>
          <p className="mreDetailText">{t(`motivations.${active.key}.description`)}</p>
          <ul className="mreTags">
            {tags.map((tag) => (
              <li className="mreTag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>

          {active.image ? (
            <div className="mreMedia">
              <Image
                src={active.image}
                alt={t(`motivations.${active.key}.imageAlt`)}
                fill
                sizes="(max-width: 580px) 92vw, (max-width: 1024px) 88vw, 46vw"
                className="mreMediaImage"
              />
            </div>
          ) : (
            <div className="mreMedia mreMediaPending">
              <ImagePendingIcon className="mreMediaPendingIcon" aria-hidden="true" />
              <p className="mreMediaPendingNote">{t("mediaPending")}</p>
            </div>
          )}

          <div className="mreProgress">
            <span className="mreProgressStart">
              <span className="mreProgressNum">{active.num}</span> {t("explore")}
            </span>
            <span className="mreDots" aria-hidden="true">
              {MOTIVATIONS.map((m) => (
                <span
                  key={m.key}
                  className="mreDot"
                  data-active={m.key === active.key || undefined}
                />
              ))}
            </span>
            <span className="mreProgressEnd">{t("railCount", { count: visible.length })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
