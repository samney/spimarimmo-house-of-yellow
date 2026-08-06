"use client";

import { useActionState } from "react";
import { saveLeadView, deleteLeadView } from "@/app/actions/cms";
import type { LeadFilterState } from "@/lib/backend/admin-seams";

/* Save / delete controls for a leads-desk view (ADM-076).

   A client island only because the operator needs to be told what happened;
   the filters themselves are plain links and the desk stays a server
   component. The current filter state is passed in as hidden fields rather
   than re-read from the URL here, so what gets saved is exactly what the
   server used to build the table. */

export function SavedViewForm({
  filters,
  canSave,
}: {
  filters: LeadFilterState;
  /** False when no filter is active: naming an unfiltered view saves nothing. */
  canSave: boolean;
}) {
  const [result, action, pending] = useActionState(saveLeadView, null);

  return (
    <form action={action} className="viewSave">
      <input type="hidden" name="stage" value={filters.stage} />
      <input type="hidden" name="kind" value={filters.kind} />
      <input type="hidden" name="owner" value={filters.owner} />
      <input type="hidden" name="event" value={filters.event} />
      <input type="hidden" name="q" value={filters.q} />

      <label className="sr-only" htmlFor="saved-view-name">
        Nom de la vue
      </label>
      <input
        id="saved-view-name"
        name="name"
        className="input input--sm"
        placeholder="Nommer cette vue"
        maxLength={60}
        required
        disabled={!canSave}
      />
      <button type="submit" className="btn btn--secondary btn--sm" disabled={!canSave || pending}>
        {pending ? "Enregistrement…" : "Enregistrer la vue"}
      </button>

      {!canSave ? (
        <span className="tertiary">Filtrez d’abord la liste pour enregistrer une vue.</span>
      ) : null}

      {result ? (
        <span
          className={result.ok ? "notice notice--success" : "notice notice--error"}
          role="status"
        >
          {result.message}
        </span>
      ) : null}
    </form>
  );
}

export function SavedViewDelete({ id, name }: { id: string; name: string }) {
  const [result, action, pending] = useActionState(deleteLeadView, null);

  return (
    <form action={action} className="viewDelete">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="viewDelete__button"
        disabled={pending}
        aria-label={`Supprimer la vue ${name}`}
        title={`Supprimer la vue ${name}`}
      >
        ×
      </button>
      {result && !result.ok ? (
        <span className="sr-only" role="status">
          {result.message}
        </span>
      ) : null}
    </form>
  );
}
