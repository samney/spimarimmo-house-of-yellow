"use client";

import { useActionState } from "react";
import { updateLeadAction } from "@/app/actions/cms";
import { LEAD_STAGES as STAGES } from "@/lib/backend/admin-seams";
import type { LeadActivity, LeadStage } from "@/lib/spimar/types";

/* Lead workspace: controlled stage changes, assignment and notes.

   Each mutation appends to an activity trail with actor and timestamp, so a
   lead's history is reconstructable — required by the audit rule in
   `data-security.md`. The trail is append-only; nothing here edits or deletes
   past entries.

   Returns ONE element on purpose: the workspace sits inside a grid column. */
export function LeadWorkspace({
  id,
  stage,
  assignee,
  activity,
}: {
  id: string;
  stage: LeadStage;
  assignee: string;
  activity: LeadActivity[];
}) {
  const [result, action, pending] = useActionState(updateLeadAction, null);

  return (
    <div>
      {result ? (
        <div
          className={`adminNotice ${result.ok ? "adminNotice--ok" : "adminNotice--error"}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      ) : null}

      <section className="adminPanel" aria-label="Stage">
        <h2>Stage</h2>
        <form className="adminForm" action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="stage" />
          <div>
            <label htmlFor="stage">Current stage</label>
            <select id="stage" name="stage" defaultValue={stage}>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="adminButton adminButton--primary" type="submit" disabled={pending}>
              Update stage
            </button>
          </div>
        </form>
      </section>

      <section className="adminPanel" aria-label="Assignment">
        <h2>Assignment</h2>
        <form className="adminForm" action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="assign" />
          <div>
            <label htmlFor="assignee">Assignee</label>
            <input
              id="assignee"
              name="assignee"
              defaultValue={assignee}
              placeholder="name or email"
            />
          </div>
          <div>
            <button className="adminButton adminButton--ghost" type="submit" disabled={pending}>
              Save assignment
            </button>
          </div>
        </form>
      </section>

      <section className="adminPanel" aria-label="Notes">
        <h2>Next action / notes</h2>
        <form className="adminForm" action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="note" />
          <div>
            <label htmlFor="note">Note</label>
            <textarea id="note" name="note" placeholder="What happens next?" />
          </div>
          <div>
            <button className="adminButton adminButton--ghost" type="submit" disabled={pending}>
              Add note
            </button>
          </div>
        </form>
      </section>

      <section className="adminPanel" aria-label="Activity">
        <h2>Activity</h2>
        {activity.length === 0 ? (
          <div className="adminEmpty">No activity recorded yet.</div>
        ) : (
          <ol className="adminTrail">
            {[...activity].reverse().map((entry, index) => (
              <li className="adminTrail__entry" key={index}>
                <p className="adminTrail__meta">
                  <time>{entry.at.slice(0, 16).replace("T", " ")}</time> · {entry.by} ·{" "}
                  <span className="adminChip">{entry.kind}</span>
                </p>
                <p className="adminTrail__detail">{entry.detail}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
