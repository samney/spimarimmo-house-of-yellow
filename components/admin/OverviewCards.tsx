import Link from "next/link";
import type { MetricWindow, NextEvent, NextFollowUp } from "@/lib/backend/admin-seams";
import { StatusBadge } from "./StatusBadge";

/* Overview presentation pieces (ADM-071, VISUAL_01).

   Server components: the dashboard has no interaction beyond links, so none of
   this ships JavaScript.

   The brief's composition is followed exactly — primary metric with a trend and
   a pipeline strip, four insight cards, then the dashboard cards. What differs
   is the VALUES, and only where the mock specifies figures SPIMAR cannot
   measure: money, opportunity value and exhibitor capacity do not exist in the
   schema. Those slots carry real operational numbers instead, and the one slot
   with no honest equivalent renders as `Unavailable` stating why (owner
   decision, 2026-08-07) rather than disappearing. */

/** Renders a trend, or says plainly why there is none. */
export function Trend({ window: w, unit }: { window: MetricWindow; unit: string }) {
  if (w.previous === null) {
    return (
      <p className="card__meta">
        <span className="tertiary">Pas encore d’historique comparable</span>
      </p>
    );
  }
  if (w.changePercent === null) {
    return (
      <p className="card__meta">
        {w.previous === 0 ? `Aucun ${unit} sur la période précédente` : "Variation indisponible"}
      </p>
    );
  }
  const up = w.changePercent > 0;
  const flat = w.changePercent === 0;
  return (
    <p className="card__meta">
      <span className={`delta${up ? " delta--up" : flat ? "" : " delta--down"}`}>
        {up ? "+" : ""}
        {w.changePercent}%
      </span>{" "}
      par rapport à la période précédente ({w.previous})
    </p>
  );
}

/**
 * A slot the blueprint specifies but the system cannot honestly fill.
 *
 * Shown rather than hidden, on purpose: this console is compared against
 * `VISUAL_01`, and a silently missing card reads as an oversight while a
 * stated one reads as a decision. It names what is missing and what would
 * make it real.
 */
export function UnavailableCard({
  label,
  reason,
  unblockedBy,
}: {
  label: string;
  reason: string;
  unblockedBy: string;
}) {
  return (
    <article className="card card--unavailable">
      <div className="card__head">
        <span className="card__label">{label}</span>
        <StatusBadge tone="neutral">Non disponible</StatusBadge>
      </div>
      <p className="card__meta">{reason}</p>
      <p className="card__meta tertiary">{unblockedBy}</p>
    </article>
  );
}

export function PipelineStrip({
  pipeline,
  total,
}: {
  pipeline: readonly { stage: string; count: number }[];
  total: number;
}) {
  if (total === 0) {
    return (
      <p className="tertiary">Aucun lead enregistré — la barre apparaîtra à la première demande.</p>
    );
  }
  return (
    <div
      className="pipelineStrip"
      role="img"
      aria-label={pipeline.map((p) => `${p.stage}: ${p.count}`).join(", ")}
    >
      {pipeline.map((segment) => (
        <span
          key={segment.stage}
          className={`pipelineStrip__seg pipelineStrip__seg--${segment.stage}`}
          style={{ flexGrow: segment.count }}
          data-empty={segment.count === 0 ? "true" : undefined}
        />
      ))}
    </div>
  );
}

export function FollowUpCard({ followUp }: { followUp: NextFollowUp | null }) {
  if (!followUp) {
    return (
      <article className="card card--emphasis">
        <div className="card__head">
          <span className="card__label">Prochaine relance</span>
        </div>
        <p className="metric metric--sm">—</p>
        <p className="card__meta">Aucune relance ouverte</p>
      </article>
    );
  }
  return (
    <article className="card card--emphasis">
      <div className="card__head">
        <span className="card__label">Prochaine relance</span>
        {followUp.overdue ? <StatusBadge tone="danger">En retard</StatusBadge> : null}
      </div>
      <p className="metric metric--sm">{followUp.label}</p>
      <p className="card__meta">
        échéance <span className="mono">{followUp.dueAt.slice(0, 10)}</span>
      </p>
      <Link href={`/admin/crm/leads/${followUp.leadId}`} className="cell__link">
        Ouvrir le lead
      </Link>
    </article>
  );
}

export function NextEventCard({ event }: { event: NextEvent | null }) {
  if (!event) {
    return (
      <article className="card">
        <div className="card__head">
          <span className="card__label">Prochain salon</span>
        </div>
        <p className="metric metric--sm">—</p>
        <p className="card__meta">Aucune édition publiée</p>
      </article>
    );
  }
  return (
    <article className="card">
      <div className="card__head">
        <span className="card__label">Prochain salon</span>
      </div>
      <p className="metric metric--sm">{event.city || event.title}</p>
      {/* An undated edition is a real record the owner has not dated. It says
          so; it does not guess a countdown. */}
      <p className="card__meta">
        {event.startDate ? (
          <span className="mono">
            {event.startDate.slice(0, 10)}
            {event.endDate ? ` → ${event.endDate.slice(0, 10)}` : ""}
          </span>
        ) : (
          "Dates à confirmer"
        )}
      </p>
      <p className="card__meta tertiary">
        {event.daysUntil === null
          ? "Compte à rebours indisponible"
          : event.daysUntil === 0
            ? "Ouvre aujourd’hui"
            : `${event.daysUntil} jours restants`}
      </p>
    </article>
  );
}

export function CountedList({
  rows,
  emptyLabel,
}: {
  rows: readonly { label: string; count: number }[];
  emptyLabel: string;
}) {
  if (rows.length === 0) return <p className="tertiary">{emptyLabel}</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="countedList">
      {rows.map((row) => (
        <li key={row.label} className="countedList__row">
          <span className="countedList__label">{row.label}</span>
          <span className="countedList__bar" aria-hidden="true">
            <span style={{ inlineSize: `${Math.round((row.count / max) * 100)}%` }} />
          </span>
          <span className="countedList__count numeric">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}
