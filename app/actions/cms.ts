"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  canEditContent,
  canPublish,
  endSession,
  isConfigured,
  readSession,
  startSession,
  verifyCredentials,
} from "@/lib/spimar/auth";
import {
  deleteRecord,
  saveDestination,
  saveEvent,
  saveMedia,
  savePage,
  updateLead,
} from "@/lib/spimar/repository";
import type { LeadStage, Localized, PublishState } from "@/lib/spimar/types";

/* CMS and CRM server actions.

   Every action re-reads the session and re-checks authorization on the server.
   The UI hides what a role cannot do, but hiding is never the control — an
   editor POSTing a publish request is rejected here, not in the browser. */

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };

async function requireEditor() {
  const session = await readSession();
  if (!session || !canEditContent(session)) return null;
  return session;
}

function localizedFrom(form: FormData, field: string): Localized {
  return {
    en: String(form.get(`${field}_en`) ?? "").trim(),
    fr: String(form.get(`${field}_fr`) ?? "").trim(),
  };
}

/** Publishing is admin-only; an editor's attempt is downgraded to draft, not
    silently honoured. */
function requestedState(form: FormData, canPublishNow: boolean): PublishState {
  const wanted = String(form.get("state") ?? "draft");
  if (wanted === "published" && canPublishNow) return "published";
  return "draft";
}

/* ------------------------------------------------------------------- session */

export async function login(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  if (!isConfigured()) {
    return { ok: false, message: "CMS authentication is not configured on this deployment." };
  }
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const session = verifyCredentials(email, password);
  // One message for both unknown-user and wrong-password: never disclose which.
  if (!session) return { ok: false, message: "Those credentials were not accepted." };
  await startSession(session);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------- content */

/** Revalidates the public surfaces a content change can affect. Targeted rather
    than a blanket purge, so a page edit does not invalidate the whole site. */
function revalidatePublic(paths: string[]): void {
  for (const locale of ["en", "fr"]) {
    for (const path of paths) {
      const prefix = locale === "en" ? "" : "/fr";
      revalidatePath(`${prefix}${path}`);
    }
  }
}

export async function savePageAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await requireEditor();
  if (!session) return { ok: false, message: "You do not have permission to edit content." };

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "A slug is required." };

  const state = requestedState(form, canPublish(session));
  savePage(
    {
      id: String(form.get("id") ?? "") || undefined,
      slug,
      state,
      title: localizedFrom(form, "title"),
      intro: localizedFrom(form, "intro"),
      body: localizedFrom(form, "body"),
    },
    session.email,
  );

  revalidatePublic([`/${slug}`, "/"]);
  return {
    ok: true,
    message:
      state === "published"
        ? "Saved and published. The public page has been revalidated."
        : "Saved as a draft. Drafts are not visible on the public site.",
  };
}

export async function saveEventAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await requireEditor();
  if (!session) return { ok: false, message: "You do not have permission to edit content." };

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "A slug is required." };

  const startDate = String(form.get("startDate") ?? "").trim();
  const endDate = String(form.get("endDate") ?? "").trim();
  if (endDate && !startDate) {
    return { ok: false, message: "An end date needs a start date." };
  }
  if (startDate && endDate && endDate < startDate) {
    return { ok: false, message: "The end date is before the start date." };
  }

  const state = requestedState(form, canPublish(session));
  saveEvent(
    {
      id: String(form.get("id") ?? "") || undefined,
      slug,
      state,
      title: localizedFrom(form, "title"),
      summary: localizedFrom(form, "summary"),
      // Empty dates are kept empty on purpose: the public page renders
      // "dates to be confirmed" rather than a guess.
      startDate,
      endDate,
      city: String(form.get("city") ?? "").trim(),
      country: String(form.get("country") ?? "").trim(),
      destinationId: String(form.get("destinationId") ?? "") || null,
    },
    session.email,
  );

  revalidatePublic([`/salons/${slug}`, "/salons", "/"]);
  return {
    ok: true,
    message:
      state === "published"
        ? "Saved and published. /salons has been revalidated."
        : "Saved as a draft. Drafts return 404 on the public site.",
  };
}

export async function saveDestinationAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await requireEditor();
  if (!session) return { ok: false, message: "You do not have permission to edit content." };

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return { ok: false, message: "A slug is required." };

  const state = requestedState(form, canPublish(session));
  saveDestination(
    {
      id: String(form.get("id") ?? "") || undefined,
      slug,
      state,
      name: localizedFrom(form, "name"),
      summary: localizedFrom(form, "summary"),
    },
    session.email,
  );

  revalidatePublic(["/salons", "/"]);
  return {
    ok: true,
    message: state === "published" ? "Saved and published." : "Saved as a draft.",
  };
}

export async function saveMediaAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await requireEditor();
  if (!session) return { ok: false, message: "You do not have permission to edit content." };

  const src = String(form.get("src") ?? "").trim();
  const rightsOwner = String(form.get("rightsOwner") ?? "").trim();
  const provenance = String(form.get("sourceProvenance") ?? "").trim();
  if (!src) return { ok: false, message: "A source path is required." };

  // Rights metadata is mandatory before an asset may be published. This is the
  // control that stops another organisation's media being served again.
  const wantsPublish = String(form.get("state") ?? "") === "published";
  if (wantsPublish && (!rightsOwner || !provenance)) {
    return {
      ok: false,
      message: "Rights owner and source provenance are required before publishing an asset.",
    };
  }

  const state = requestedState(form, canPublish(session));
  saveMedia(
    {
      id: String(form.get("id") ?? "") || undefined,
      src,
      state,
      alt: localizedFrom(form, "alt"),
      rightsOwner,
      sourceProvenance: provenance,
    },
    session.email,
  );
  return { ok: true, message: "Media record saved." };
}

export async function deleteContentAction(
  collection: "pages" | "events" | "destinations" | "media",
  id: string,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canPublish(session)) {
    return { ok: false, message: "Deleting content requires an administrator." };
  }
  const removed = deleteRecord(collection, id);
  revalidatePublic(["/", "/salons"]);
  return removed
    ? { ok: true, message: "Deleted." }
    : { ok: false, message: "That record no longer exists." };
}

/* ----------------------------------------------------------------------- CRM */

export async function updateLeadAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session) return { ok: false, message: "You do not have permission to manage leads." };

  const id = String(form.get("id") ?? "");
  const intent = String(form.get("intent") ?? "");

  /* The operator must see their own change immediately: without revalidating
     the detail route the activity trail keeps rendering the pre-update server
     snapshot, so a note appears to vanish. */
  const refresh = () => {
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
  };

  if (intent === "note") {
    const detail = String(form.get("note") ?? "").trim();
    if (!detail) return { ok: false, message: "A note cannot be empty." };
    const updated = updateLead(id, {}, { by: session.email, kind: "note", detail });
    refresh();
    return updated
      ? { ok: true, message: "Note added." }
      : { ok: false, message: "That lead no longer exists." };
  }

  if (intent === "stage") {
    const stage = String(form.get("stage") ?? "") as LeadStage;
    const allowed: LeadStage[] = ["new", "qualified", "in_progress", "won", "lost"];
    if (!allowed.includes(stage)) return { ok: false, message: "That stage is not recognised." };
    const updated = updateLead(
      id,
      { stage },
      { by: session.email, kind: "stage", detail: `Stage set to ${stage}` },
    );
    refresh();
    return updated
      ? { ok: true, message: "Stage updated." }
      : { ok: false, message: "That lead no longer exists." };
  }

  if (intent === "assign") {
    const assignee = String(form.get("assignee") ?? "").trim();
    const updated = updateLead(
      id,
      { assignee },
      {
        by: session.email,
        kind: "assignment",
        detail: assignee ? `Assigned to ${assignee}` : "Assignment cleared",
      },
    );
    refresh();
    return updated
      ? { ok: true, message: "Assignment updated." }
      : { ok: false, message: "That lead no longer exists." };
  }

  return { ok: false, message: "Unrecognised action." };
}
