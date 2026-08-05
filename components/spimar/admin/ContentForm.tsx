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
  submitLabel = "Enregistrer",
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
    <form className="form" action={formAction}>
      {result ? (
        <div
          className={`notice ${result.ok ? "notice--success" : "notice--error"}`}
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
            <fieldset
              key={field.name}
              style={{ border: 0, padding: 0, margin: 0, minInlineSize: 0 }}
            >
              <legend className="field__label">{field.label}</legend>
              {field.hint ? <p className="field__hint">{field.hint}</p> : null}
              <div className="row" style={{ marginBlockStart: 8 }}>
                {(["fr", "en"] as const).map((loc) => (
                  <div className="field" key={loc}>
                    <label className="field__label" htmlFor={`${field.name}_${loc}`}>
                      {loc.toUpperCase()}
                    </label>
                    {field.multiline ? (
                      <textarea
                        className="textarea"
                        id={`${field.name}_${loc}`}
                        name={`${field.name}_${loc}`}
                        defaultValue={initial[`${field.name}_${loc}`] ?? ""}
                      />
                    ) : (
                      <input
                        className="input"
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
          <div className="field" key={field.name}>
            <label className="field__label" htmlFor={field.name}>
              {field.label}
              {field.kind === "text" && field.required ? (
                <span className="field__required" aria-hidden="true">
                  *
                </span>
              ) : null}
            </label>
            <input
              className="input"
              id={field.name}
              name={field.name}
              type={field.kind === "date" ? "date" : "text"}
              required={field.kind === "text" ? field.required : undefined}
              defaultValue={initial[field.name] ?? ""}
            />
            {field.hint ? <p className="field__hint">{field.hint}</p> : null}
          </div>
        );
      })}

      <div className="field">
        <label className="field__label" htmlFor="state">
          Publication
        </label>
        <select className="select" id="state" name="state" defaultValue={initialState}>
          <option value="draft">Brouillon — non visible publiquement</option>
          <option value="published" disabled={!canPublish}>
            Publié — visible sur le site public
          </option>
        </select>
        {!canPublish ? (
          <p className="field__hint">
            Votre rôle peut modifier mais pas publier. L’enregistrement reste un brouillon ; le
            serveur applique cette règle quelle que soit la valeur envoyée.
          </p>
        ) : null}
      </div>

      <div>
        <button className="btn btn--primary" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
