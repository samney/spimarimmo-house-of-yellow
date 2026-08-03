"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/actions/cms";

type Field =
  | { kind: "text"; name: string; label: string; required?: boolean; hint?: string }
  | { kind: "date"; name: string; label: string; hint?: string }
  | { kind: "localized"; name: string; label: string; multiline?: boolean; hint?: string };

/* Shared CMS editor.

   One component drives every collection so validation, permission and result
   feedback behave identically everywhere. The server action is the authority:
   this form never decides what may be published, it only offers the choice. */
export function ContentForm({
  action,
  fields,
  initial,
  canPublish,
  state: initialState,
  submitLabel = "Save",
}: {
  action: (prev: ActionResult | null, form: FormData) => Promise<ActionResult>;
  fields: Field[];
  initial: Record<string, string>;
  canPublish: boolean;
  state: string;
  submitLabel?: string;
}) {
  const [result, formAction, pending] = useActionState(action, null);

  return (
    <form className="adminForm" action={formAction}>
      {result ? (
        <div
          className={`adminNotice ${result.ok ? "adminNotice--ok" : "adminNotice--error"}`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      ) : null}

      <input type="hidden" name="id" defaultValue={initial.id ?? ""} />

      {fields.map((field) => {
        if (field.kind === "localized") {
          return (
            <fieldset key={field.name}>
              <legend>{field.label}</legend>
              {field.hint ? <p className="adminHint">{field.hint}</p> : null}
              <div className="adminRow">
                {(["en", "fr"] as const).map((loc) => (
                  <div key={loc}>
                    <label htmlFor={`${field.name}_${loc}`}>{loc.toUpperCase()}</label>
                    {field.multiline ? (
                      <textarea
                        id={`${field.name}_${loc}`}
                        name={`${field.name}_${loc}`}
                        defaultValue={initial[`${field.name}_${loc}`] ?? ""}
                      />
                    ) : (
                      <input
                        id={`${field.name}_${loc}`}
                        name={`${field.name}_${loc}`}
                        defaultValue={initial[`${field.name}_${loc}`] ?? ""}
                      />
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          );
        }
        return (
          <div key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.kind === "text" && field.required ? " *" : ""}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.kind === "date" ? "date" : "text"}
              required={field.kind === "text" ? field.required : undefined}
              defaultValue={initial[field.name] ?? ""}
            />
            {field.hint ? <p className="adminHint">{field.hint}</p> : null}
          </div>
        );
      })}

      <div>
        <label htmlFor="state">Publication</label>
        <select id="state" name="state" defaultValue={initialState}>
          <option value="draft">Draft — not visible publicly</option>
          <option value="published" disabled={!canPublish}>
            Published — visible on the public site
          </option>
        </select>
        {!canPublish ? (
          <p className="adminHint">
            Your role can edit but not publish. Saving keeps this a draft; the server enforces this
            regardless of what the form sends.
          </p>
        ) : null}
      </div>

      <div>
        <button className="adminButton adminButton--primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
