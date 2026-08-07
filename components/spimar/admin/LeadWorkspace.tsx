"use client";

import { useActionState, useState } from "react";
import { updateLeadAction } from "@/app/actions/cms";
import { LEAD_STAGES, LOST_REASONS } from "@/lib/backend/admin-seams";
import { leadStageLabel } from "@/components/admin/StatusBadge";
import { Icon } from "@/components/admin/icons";
import { EmptyState } from "@/components/admin/states";
import type { LeadActivity, LeadStage } from "@/lib/spimar/types";

/* Operational side panel for a lead (blueprint 15: "entity detail and
   operational side panel").

   Controlled stage changes, assignment and notes. Each mutation appends to an
   activity trail with actor and timestamp, so a lead's history is
   reconstructable — required by the audit rule in `data-security.md`. The
   trail is append-only; nothing here edits or deletes past entries. */

const ACTIVITY_LABEL: Record<LeadActivity["kind"], string> = {
  note: "Note",
  stage: "Étape",
  assignment: "Assignation",
};

export function LeadWorkspace({
  id,
  stage,
  assignee,
  lostReason,
  activity,
  preselectLost = false,
}: {
  id: string;
  stage: LeadStage;
  assignee: string;
  lostReason: string;
  activity: LeadActivity[];
  /** True when the pipeline board handed over a "lost" move: the workspace
      opens on `lost` so the operator only has to supply the reason. */
  preselectLost?: boolean;
}) {
  const [result, action, pending] = useActionState(updateLeadAction, null);
  /* ADM-087: the reason field exists exactly when `lost` is the selection —
     visibility only; the requirement itself is enforced server-side.

     The select stays UNCONTROLLED, and the initial state is read from the
     live DOM during the hydration render: a change made before hydration (a
     fast user, or an automated one) lands in the server-rendered select
     without firing React's onChange, and initialising from props would
     silently disagree with what the operator sees. onChange covers
     everything after. */
  const [selectedStage, setSelectedStage] = useState<LeadStage>(() => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("stage") as HTMLSelectElement | null;
      if (el?.value) return el.value as LeadStage;
    }
    return preselectLost ? "lost" : stage;
  });

  return (
    <div className="stack">
      {result ? (
        <div
          className={`notice ${result.ok ? "notice--success" : "notice--error"}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      ) : null}

      <section className="card" aria-labelledby="stage-heading">
        <h2 id="stage-heading" className="card__label">
          Étape du lead
        </h2>
        <form className="form" action={action} style={{ marginBlockStart: 12 }}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="stage" />
          <div className="field">
            <label className="field__label" htmlFor="stage">
              Étape actuelle
            </label>
            <select
              className="select"
              id="stage"
              name="stage"
              defaultValue={preselectLost ? "lost" : stage}
              onChange={(event) => setSelectedStage(event.target.value as LeadStage)}
            >
              {LEAD_STAGES.map((s) => (
                <option key={s} value={s}>
                  {leadStageLabel(s)}
                </option>
              ))}
            </select>
          </div>
          {selectedStage === "lost" ? (
            <div className="field">
              <label className="field__label" htmlFor="lostReason">
                Raison de la perte
              </label>
              <select
                className="select"
                id="lostReason"
                name="lostReason"
                required
                defaultValue={lostReason || ""}
              >
                <option value="" disabled>
                  Choisir une raison…
                </option>
                {LOST_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              <p className="field__hint">
                Requise pour clore le lead — elle alimente l’analyse des pertes.
              </p>
            </div>
          ) : null}
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Enregistrement…" : "Faire progresser l’étape"}
          </button>
        </form>
      </section>

      <section className="card" aria-labelledby="owner-heading">
        <h2 id="owner-heading" className="card__label">
          Propriétaire
        </h2>
        <form className="form" action={action} style={{ marginBlockStart: 12 }}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="assign" />
          <div className="field">
            <label className="field__label" htmlFor="assignee">
              Assigné à
            </label>
            <input
              className="input"
              id="assignee"
              name="assignee"
              defaultValue={assignee}
              placeholder="nom ou e-mail"
            />
            <p className="field__hint">
              Laisser vide replace le lead dans la file d’attente non assignée.
            </p>
          </div>
          <button type="submit" className="btn btn--secondary" disabled={pending}>
            Enregistrer
          </button>
        </form>
      </section>

      <section className="card" aria-labelledby="note-heading">
        <h2 id="note-heading" className="card__label">
          Prochaine action
        </h2>
        <form className="form" action={action} style={{ marginBlockStart: 12 }}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="note" />
          <div className="field">
            <label className="field__label" htmlFor="note">
              Note
            </label>
            <textarea
              className="textarea"
              id="note"
              name="note"
              placeholder="Que se passe-t-il ensuite ?"
            />
          </div>
          <button type="submit" className="btn btn--secondary" disabled={pending}>
            Ajouter la note
          </button>
        </form>
      </section>

      <section className="card" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="card__label">
          Activité
        </h2>
        <div style={{ marginBlockStart: 12 }}>
          {activity.length === 0 ? (
            <EmptyState
              title="Aucune activité"
              body="Les changements d’étape, les assignations et les notes apparaissent ici."
            />
          ) : (
            <ol className="timeline">
              {[...activity].reverse().map((entry, index) => (
                <li className="timeline__item" key={index}>
                  <span className="timeline__icon">
                    {entry.kind === "note"
                      ? Icon.document({ size: 9 })
                      : entry.kind === "stage"
                        ? Icon.check({ size: 9 })
                        : Icon.users({ size: 9 })}
                  </span>
                  <p className="timeline__title">{ACTIVITY_LABEL[entry.kind]}</p>
                  <p className="timeline__meta">
                    <time>{entry.at.slice(0, 16).replace("T", " ")}</time> · {entry.by}
                  </p>
                  <p className="timeline__body">{entry.detail}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
