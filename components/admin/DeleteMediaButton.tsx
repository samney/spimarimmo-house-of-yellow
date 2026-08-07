"use client";

import { useActionState } from "react";
import { deleteMediaAction } from "@/app/actions/cms";
import type { ActionResult } from "@/app/actions/cms";

/* Safe media deletion (ADM-150).

   A client island only because the operator must see WHY a deletion was
   refused — the in-use message names the referencing content. The check
   itself is server-side in the repository; this is presentation.

   `confirm()` before a destructive action is the data-security rule
   ("destructive CMS actions require confirmation"); native confirm keeps the
   island dependency-free and works without any dialog plumbing. */
export function DeleteMediaButton({ id, label }: { id: string; label: string }) {
  const [result, action, pending] = useActionState(
    async (prev: ActionResult | null, form: FormData) => {
      if (!window.confirm(`Supprimer le média « ${label} » ? Cette action est définitive.`)) {
        return prev;
      }
      return deleteMediaAction(prev, form);
    },
    null,
  );

  return (
    <form action={action} className="cluster" style={{ gap: 8 }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="cell__link cell__link--danger"
        disabled={pending}
        aria-label={`Supprimer le média ${label}`}
      >
        {pending ? "…" : "Supprimer"}
      </button>
      {result && !result.ok ? (
        <span className="notice notice--error notice--inline" role="status">
          {result.message}
        </span>
      ) : null}
    </form>
  );
}
