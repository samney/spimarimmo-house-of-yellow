"use client";

import { useActionState } from "react";
import { updateLeadAction } from "@/app/actions/cms";
import type { LeadActivity, LeadStage } from "@/lib/spimar/types";

const STAGES: LeadStage[] = ["new", "qualified", "in_progress", "won", "lost"];

/* Lead workspace: controlled stage changes, assignment and notes.

   Each mutation appends to an activity trail with actor and timestamp, so a
   lead's history is reconstructable — required by the audit rule in
   `data-security.md`. The trail is append-only; nothing here edits or deletes
   past entries. */
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
    <>
      {result ? (
        <div
          className={`adminNotice ${result.ok ? "adminNotice--ok" : "adminNotice--error"}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      ) : null}

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Stage</h2>
        <form className="adminForm" action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="stage" />
          <div>
            <label htmlFor="stage">Current stage</label>
            <select id="stage" name="stage" defaultValue={stage}>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="spimarButton spimarButton--primary" type="submit" disabled={pending}>
              Update stage
            </button>
          </div>
        </form>
      </div>

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Assignment</h2>
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
            <button className="spimarButton spimarButton--ghost" type="submit" disabled={pending}>
              Save assignment
            </button>
          </div>
        </form>
      </div>

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Next action / notes</h2>
        <form className="adminForm" action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="intent" value="note" />
          <div>
            <label htmlFor="note">Note</label>
            <textarea id="note" name="note" placeholder="What happens next?" />
          </div>
          <div>
            <button className="spimarButton spimarButton--ghost" type="submit" disabled={pending}>
              Add note
            </button>
          </div>
        </form>
      </div>

      <div className="adminCard">
        <h2 style={{ marginTop: 0 }}>Activity</h2>
        {activity.length === 0 ? (
          <div className="adminEmpty">No activity recorded yet.</div>
        ) : (
          <table className="adminTable">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>What</th>
              </tr>
            </thead>
            <tbody>
              {[...activity].reverse().map((entry, index) => (
                <tr key={index}>
                  <td>{entry.at.slice(0, 16).replace("T", " ")}</td>
                  <td>{entry.by}</td>
                  <td>
                    <span className="adminBadge">{entry.kind}</span> {entry.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
