import "server-only";
import type {
  CmsActivityEntry,
  CmsRepository,
  CollectionCount,
  CountedLabel,
  CrmRepository,
  LeadTask,
  MetricWindow,
  NextEvent,
  NextFollowUp,
  OverviewMetrics,
  OverviewRepository,
} from "@/lib/backend/admin-seams";
import { LEAD_STAGES } from "@/lib/backend/admin-seams";
import {
  localized,
  type Destination,
  type Lead,
  type MediaAsset,
  type Page,
  type SpimarEvent,
} from "../types";

/* Implementation of the overview contract (ADM-070) over the seams themselves.

   Everything here is COUNTED from stored records. Nothing is projected,
   forecast, sampled or illustrative — an empty deployment yields zeros and
   nulls, and the screen is required to say so rather than fill the gap.

   It reads through `CrmRepository`/`CmsRepository` rather than a store, so ONE
   implementation serves every backend and the two dashboards cannot disagree
   about what a metric means. The known cost: it loads the lead list rather
   than aggregating in SQL. At the current scale that is the cheaper honest
   trade; pushing these reductions into SQL is an optimisation that changes no
   contract, recorded as future work rather than smuggled in here. */

/** `now` is injectable so period arithmetic is testable without a fake clock. */
export class SeamOverviewRepository implements OverviewRepository {
  constructor(
    private readonly deps: { crm: CrmRepository; cms: CmsRepository },
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getOverview(): Promise<OverviewMetrics> {
    const at = this.now();
    const { crm, cms } = this.deps;
    const [leads, events, pages, destinations, media, openTasks] = await Promise.all([
      crm.listLeads(),
      cms.listEvents({ includeDrafts: true }),
      cms.listPages({ includeDrafts: true }),
      cms.listDestinations({ includeDrafts: true }),
      cms.listMedia({ includeDrafts: true }),
      crm.listOpenLeadTasks(),
    ]);

    return {
      leadsThisMonth: monthWindow(leads, at),
      pipeline: LEAD_STAGES.map((stage) => ({
        stage,
        count: leads.filter((l) => l.stage === stage).length,
      })),
      qualified: qualifiedWindow(leads, at),
      nextFollowUp: toFollowUps(openTasks, leads, at)[0] ?? null,
      unassigned: leads.filter((l) => !l.assignee).length,
      nextEvent: nextEvent(events, at),
      acquisitionBySource: acquisitionBySource(leads),
      leadsByEvent: leadsByEvent(leads),
      priorityTasks: toFollowUps(openTasks, leads, at).slice(0, 5),
      cmsActivity: cmsActivity(pages, events, destinations, media),
      content: [
        countCollection("Pages", pages),
        countCollection("Salons", events),
        countCollection("Destinations", destinations),
        countCollection("Médias", media),
      ],
      totalLeads: leads.length,
    };
  }
}

/* --------------------------------------------------------------- windows */

/** Start of the calendar month `offset` months before the one containing `at`. */
function monthStart(at: Date, offset = 0): Date {
  return new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth() - offset, 1));
}

function countBetween(leads: readonly Lead[], from: Date, to: Date): number {
  return leads.filter((l) => {
    const created = new Date(l.createdAt).getTime();
    return created >= from.getTime() && created < to.getTime();
  }).length;
}

/**
 * Builds a window, refusing to invent a comparison.
 *
 * `previous` stays null when the store holds nothing before the previous
 * window opened — there is no evidence either way at that point, and
 * reporting "+100%" off a single window of history is arithmetic dressed as
 * insight. A percentage is also withheld when the previous count is zero,
 * because growth from nothing has no meaningful rate.
 */
function windowOf(current: number, previous: number | null): MetricWindow {
  if (previous === null || previous === 0) {
    return { current, previous, changePercent: null };
  }
  return {
    current,
    previous,
    changePercent: Math.round(((current - previous) / previous) * 100),
  };
}

function hasHistoryBefore(leads: readonly Lead[], boundary: Date): boolean {
  return leads.some((l) => new Date(l.createdAt).getTime() < boundary.getTime());
}

function monthWindow(leads: readonly Lead[], at: Date): MetricWindow {
  const thisMonth = monthStart(at);
  const lastMonth = monthStart(at, 1);
  const current = countBetween(leads, thisMonth, new Date(at.getTime() + 1));
  if (!hasHistoryBefore(leads, thisMonth)) return windowOf(current, null);
  return windowOf(current, countBetween(leads, lastMonth, thisMonth));
}

function qualifiedWindow(leads: readonly Lead[], at: Date): MetricWindow {
  const qualified = leads.filter((l) => l.stage === "qualified");
  const weekAgo = new Date(at.getTime() - 7 * 86_400_000);
  const twoWeeksAgo = new Date(at.getTime() - 14 * 86_400_000);
  const current = qualified.length;
  if (!hasHistoryBefore(leads, weekAgo)) return windowOf(current, null);
  // "Movement" is arrivals in the trailing week against the week before it.
  const thisWeek = countBetween(qualified, weekAgo, new Date(at.getTime() + 1));
  const lastWeek = countBetween(qualified, twoWeeksAgo, weekAgo);
  return { current, previous: lastWeek, changePercent: windowOf(thisWeek, lastWeek).changePercent };
}

/* ----------------------------------------------------------------- cards */

function toFollowUps(tasks: readonly LeadTask[], leads: readonly Lead[], at: Date): NextFollowUp[] {
  return tasks
    .map((task) => {
      const lead = leads.find((l) => l.id === task.leadId);
      return {
        leadId: task.leadId,
        // The organisation reads better on a card, but a lead may have none.
        label: lead ? lead.organisation || lead.name : task.title,
        dueAt: task.dueAt,
        overdue: new Date(task.dueAt).getTime() < at.getTime(),
      };
    })
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

function nextEvent(events: readonly SpimarEvent[], at: Date): NextEvent | null {
  const dated = events
    .filter((e) => e.state === "published" && e.startDate)
    .filter((e) => new Date(e.startDate).getTime() >= at.getTime())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Undated published editions are real records the owner has not dated yet.
  // Preferring a dated one is correct; falling back to an undated one with a
  // null countdown is honest. Inventing a date is not an option.
  const chosen = dated[0] ?? events.find((e) => e.state === "published" && !e.startDate);
  if (!chosen) return null;

  return {
    slug: chosen.slug,
    title: localized(chosen.title, "fr"),
    city: chosen.city,
    startDate: chosen.startDate,
    endDate: chosen.endDate,
    daysUntil: chosen.startDate
      ? Math.ceil((new Date(chosen.startDate).getTime() - at.getTime()) / 86_400_000)
      : null,
  };
}

/* ----------------------------------------------------------------- lists */

function tally(values: readonly string[]): CountedLabel[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function acquisitionBySource(leads: readonly Lead[]): CountedLabel[] {
  // `cta` is the attribution captured at submission; `kind` is the form family.
  return tally(leads.map((l) => l.cta || l.kind)).slice(0, 6);
}

function leadsByEvent(leads: readonly Lead[]): CountedLabel[] {
  return tally(leads.filter((l) => l.eventSlug).map((l) => l.eventSlug)).slice(0, 6);
}

type Auditable = { state: string; updatedAt: string; updatedBy: string };

function countCollection(collection: string, rows: readonly Auditable[]): CollectionCount {
  return {
    collection,
    published: rows.filter((r) => r.state === "published").length,
    total: rows.length,
  };
}

function cmsActivity(
  pages: readonly Page[],
  events: readonly SpimarEvent[],
  destinations: readonly Destination[],
  media: readonly MediaAsset[],
): CmsActivityEntry[] {
  const entries: CmsActivityEntry[] = [
    ...pages.map((p) => entry("Page", localized(p.title, "fr") || p.slug, p)),
    ...events.map((e) => entry("Salon", localized(e.title, "fr") || e.slug, e)),
    ...destinations.map((d) => entry("Destination", localized(d.name, "fr") || d.slug, d)),
    ...media.map((m) => entry("Média", localized(m.alt, "fr") || m.src, m)),
  ];
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
}

function entry(collection: string, label: string, row: Auditable): CmsActivityEntry {
  return { collection, label, updatedAt: row.updatedAt, updatedBy: row.updatedBy };
}
