"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRateLimited } from "@/lib/contact/rate-limit";
import {
  canEditContent,
  canManageLeads,
  canPublish,
  endSession,
  isConfigured,
  readSession,
  startSession,
  verifyCredentials,
} from "@/lib/spimar/auth";
import { getAdminSeams } from "@/lib/spimar/repositories";
import { LEAD_STAGES, LOST_REASONS, lostReasonLabel } from "@/lib/backend/admin-seams";
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
  /* Brute-force control: the endpoint that grants access to every lead's PII
     must have at least the protection the public contact form has. Key is
     hashed and login-scoped; behind a trusted proxy the first forwarded hop
     is the client. */
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const loginKey = createHash("sha256")
    .update(`login|${forwarded.split(",")[0]?.trim() || "unknown"}`)
    .digest("hex");
  if (isRateLimited(loginKey, 10)) {
    return { ok: false, message: "Too many attempts. Try again in a few minutes." };
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

/** Revalidates the CONSOLE surface the operator is looking at.

    Without this an editor saves a record and the list beside the form still
    shows the previous state until they navigate away and back — the save looks
    like it did nothing. The public revalidation below is a separate concern. */
function revalidateConsole(paths: string[]): void {
  for (const path of paths) revalidatePath(path);
}

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
  await getAdminSeams().cms.savePage(
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

  revalidateConsole(["/admin/cms/pages", "/admin"]);
  revalidatePublic([`/${slug}`, "/"]);
  return {
    ok: true,
    message:
      state === "published"
        ? "Saved and published. The public page has been revalidated."
        : "Saved as a draft. Drafts are not visible on the public site.",
  };
}

/* ------------------------------------------------------------- études de cas

   Case studies are pages in the `etudes/` family — the public listing and
   detail already read exactly that (D-026 kept the publish → visible
   contract). A dedicated action exists so the PREFIX is the system's job:
   an operator types `casablanca-2026`, never a path, and cannot land a case
   outside the family or double the prefix by pasting one in. */

const CASE_PREFIX = "etudes/";

const caseSlugSchema = z
  .string()
  .trim()
  .transform((value) => (value.startsWith(CASE_PREFIX) ? value.slice(CASE_PREFIX.length) : value))
  .pipe(
    z
      .string()
      .min(1, "Un slug est requis.")
      .max(80)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Le slug utilise des minuscules, chiffres et tirets — il devient l’URL publique.",
      ),
  );

export async function saveCaseStudyAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await requireEditor();
  if (!session) return { ok: false, message: "You do not have permission to edit content." };

  const parsedSlug = caseSlugSchema.safeParse(String(form.get("slug") ?? ""));
  if (!parsedSlug.success) {
    return { ok: false, message: parsedSlug.error.issues[0]?.message ?? "Slug invalide." };
  }
  const slug = parsedSlug.data;

  const state = requestedState(form, canPublish(session));
  await getAdminSeams().cms.savePage(
    {
      id: String(form.get("id") ?? "") || undefined,
      slug: `${CASE_PREFIX}${slug}`,
      state,
      title: localizedFrom(form, "title"),
      intro: localizedFrom(form, "intro"),
      body: localizedFrom(form, "body"),
    },
    session.email,
  );

  revalidateConsole(["/admin/cms/etudes", "/admin"]);
  revalidatePublic(["/etudes-de-cas", `/etudes-de-cas/${slug}`]);
  return {
    ok: true,
    message:
      state === "published"
        ? `Étude publiée — visible sur /etudes-de-cas/${slug}.`
        : "Étude enregistrée en brouillon. Les brouillons ne sont pas visibles publiquement.",
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
  await getAdminSeams().cms.saveEvent(
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

  revalidateConsole(["/admin/events", "/admin"]);
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
  await getAdminSeams().cms.saveDestination(
    {
      id: String(form.get("id") ?? "") || undefined,
      slug,
      state,
      name: localizedFrom(form, "name"),
      summary: localizedFrom(form, "summary"),
    },
    session.email,
  );

  revalidateConsole(["/admin/destinations", "/admin"]);
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

  /* ADM-149: the source path is validated against what the site can actually
     serve — a local public/ prefix with an allowlisted extension, or an https
     URL. A typo'd path stored today is a broken image discovered by a visitor
     later, and an unchecked scheme is how javascript: sneaks into an src. */
  const parsedSrc = mediaSrcSchema.safeParse(String(form.get("src") ?? "").trim());
  if (!parsedSrc.success) {
    return { ok: false, message: parsedSrc.error.issues[0]?.message ?? "Chemin invalide." };
  }
  const src = parsedSrc.data;
  const rightsOwner = String(form.get("rightsOwner") ?? "").trim();
  const provenance = String(form.get("sourceProvenance") ?? "").trim();
  const altFr = String(form.get("alt_fr") ?? "").trim();

  // Rights metadata is mandatory before an asset may be published. This is the
  // control that stops another organisation's media being served again.
  const wantsPublish = String(form.get("state") ?? "") === "published";
  if (wantsPublish && (!rightsOwner || !provenance)) {
    return {
      ok: false,
      message: "Rights owner and source provenance are required before publishing an asset.",
    };
  }

  // Publishing without an FR alt text ships an inaccessible image to the
  // default locale. Draft may stay incomplete; published may not.
  if (wantsPublish && !altFr) {
    return {
      ok: false,
      message: "Un texte alternatif (FR) est requis avant de publier un média.",
    };
  }

  const state = requestedState(form, canPublish(session));
  await getAdminSeams().cms.saveMedia(
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
  revalidateConsole(["/admin/cms/media", "/admin"]);
  return { ok: true, message: "Media record saved." };
}

/* What the site can actually serve: a public/ path with an allowlisted media
   extension, or an https URL. Never javascript:, data:, or an extensionless
   guess. */
const MEDIA_EXTENSIONS = /\.(avif|webp|png|jpe?g|svg|mp4|webm|pdf|woff2?)$/i;
const mediaSrcSchema = z
  .string()
  .min(1, "Un chemin source est requis.")
  .max(500)
  .refine(
    (value) =>
      value.startsWith("https://") ||
      ((value.startsWith("/images/") ||
        value.startsWith("/videos/") ||
        value.startsWith("/documents/") ||
        value.startsWith("/fonts/")) &&
        MEDIA_EXTENSIONS.test(value)),
    "Le chemin doit être une URL https ou un chemin public (/images, /videos, /documents, /fonts) avec une extension média reconnue.",
  );

export async function deleteContentAction(
  collection: "pages" | "events" | "destinations" | "media",
  id: string,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canPublish(session)) {
    return { ok: false, message: "Deleting content requires an administrator." };
  }
  /* Media never takes the blind path: even a caller of this generic action is
     routed through the usage check, so no code path can delete an asset that
     content still references (ADM-150). */
  if (collection === "media") {
    return deleteMediaById(id);
  }
  const removed = await getAdminSeams().cms.deleteRecord(collection, id);
  revalidateConsole(["/admin/events", "/admin/cms/pages", "/admin"]);
  revalidatePublic(["/", "/salons"]);
  return removed
    ? { ok: true, message: "Deleted." }
    : { ok: false, message: "That record no longer exists." };
}

async function deleteMediaById(id: string): Promise<ActionResult> {
  const result = await getAdminSeams().cms.safeDeleteMedia(id);
  revalidateConsole(["/admin/cms/media", "/admin"]);

  switch (result.outcome) {
    case "deleted":
      return { ok: true, message: "Média supprimé." };
    case "absent":
      return { ok: false, message: "Ce média n’existe plus." };
    case "in_use":
      return {
        ok: false,
        message:
          `Suppression refusée : utilisé par ${result.usage.length} contenu${result.usage.length === 1 ? "" : "s"} — ` +
          result.usage.map((u) => u.label).join(", ") +
          ". Retirez d’abord ces références.",
      };
  }
}

/** Safe media deletion (ADM-150) — the form-facing wrapper. */
export async function deleteMediaAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canPublish(session)) {
    return { ok: false, message: "Deleting content requires an administrator." };
  }
  const id = String(form.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Ce média n’existe plus." };
  return deleteMediaById(id);
}

/* ----------------------------------------------------------------------- CRM */

export async function updateLeadAction(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canManageLeads(session)) {
    return { ok: false, message: "You do not have permission to manage leads." };
  }

  const id = String(form.get("id") ?? "");
  const intent = String(form.get("intent") ?? "");

  /* The operator must see their own change immediately: without revalidating
     the detail route the activity trail keeps rendering the pre-update server
     snapshot, so a note appears to vanish. */
  const refresh = () => {
    revalidatePath("/admin/crm/leads");
    revalidatePath(`/admin/crm/leads/${id}`);
  };

  if (intent === "note") {
    const detail = String(form.get("note") ?? "").trim();
    if (!detail) return { ok: false, message: "A note cannot be empty." };
    const updated = await getAdminSeams().crm.updateLead(
      id,
      {},
      { by: session.email, kind: "note", detail },
    );
    refresh();
    return updated
      ? { ok: true, message: "Note added." }
      : { ok: false, message: "That lead no longer exists." };
  }

  if (intent === "stage") {
    const stage = String(form.get("stage") ?? "") as LeadStage;
    if (!LEAD_STAGES.includes(stage))
      return { ok: false, message: "That stage is not recognised." };

    /* ADM-087: losing requires saying why, from the closed vocabulary. The
       requirement is enforced HERE, at the boundary — a lost lead without a
       reason is exactly the unaggregatable dead end the field exists to
       prevent. Non-lost transitions ignore any submitted reason; the adapter
       clears the stored one. */
    if (stage === "lost") {
      const reason = String(form.get("lostReason") ?? "").trim();
      if (!LOST_REASONS.some((entry) => entry.value === reason)) {
        return {
          ok: false,
          message: "Indiquez la raison de la perte — elle est requise pour clore un lead.",
        };
      }
      const updated = await getAdminSeams().crm.updateLead(
        id,
        { stage, lostReason: reason },
        {
          by: session.email,
          kind: "stage",
          detail: `Étape perdue — raison : ${lostReasonLabel(reason)}`,
        },
      );
      refresh();
      return updated
        ? { ok: true, message: "Stage updated." }
        : { ok: false, message: "That lead no longer exists." };
    }

    const updated = await getAdminSeams().crm.updateLead(
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
    const updated = await getAdminSeams().crm.updateLead(
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

/** Pipeline board stage move: a plain form action so the board needs no client
    JS. Authorization and stage validation are identical to updateLeadAction;
    the board simply re-renders the moved card in its new column. */
export async function moveLeadStage(form: FormData): Promise<void> {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  // The lead-desk permission, not just a session — same gate as the export
  // route, so every lead mutation and read-out shares one boundary.
  if (!canManageLeads(session)) redirect("/admin");

  const id = String(form.get("id") ?? "");
  const stage = String(form.get("stage") ?? "") as LeadStage;

  /* ADM-087: the board cannot ask why, and a silent default reason would be an
     invented fact. Losing from the board therefore hands over to the lead's
     workspace, which requires the reason before anything changes. */
  if (id && stage === "lost") {
    redirect(`/admin/crm/leads/${id}?cloture=1`);
  }

  if (id && LEAD_STAGES.includes(stage)) {
    await getAdminSeams().crm.updateLead(
      id,
      { stage },
      { by: session.email, kind: "stage", detail: `Stage set to ${stage}` },
    );
  }

  revalidatePath("/admin/crm/pipeline");
  revalidatePath("/admin/crm/leads");
  revalidatePath(`/admin/crm/leads/${id}`);
  redirect("/admin/crm/pipeline");
}

/** Closes a lead task (ADM-092) — a plain form action so the onboarding
    panel and the tasks screen need no client JS. The repository writes the
    lead-history note; this action only authorizes and revalidates. */
export async function completeTaskAction(form: FormData): Promise<void> {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  if (!canManageLeads(session)) redirect("/admin");

  const taskId = String(form.get("taskId") ?? "");
  const leadId = String(form.get("leadId") ?? "");
  if (taskId) {
    await getAdminSeams().crm.completeLeadTask(taskId, session.email);
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  if (leadId) {
    revalidatePath(`/admin/crm/leads/${leadId}`);
    redirect(`/admin/crm/leads/${leadId}`);
  }
  redirect("/admin/tasks");
}

/* --------------------------------------------------------------- saved views */

/* Every field is validated against the domain, not merely coerced to a string:
   these values are replayed straight back into the desk's query string, so an
   unvalidated `stage` would round-trip whatever was posted. `owner` is not in
   the schema on purpose — it is taken from the session below, never from the
   form, so one operator cannot save a view into another's list. */
const savedViewSchema = z.object({
  id: z.string().trim().max(100).optional(),
  name: z.string().trim().min(1, "Nommez la vue.").max(60),
  stage: z.enum(["new", "qualified", "in_progress", "won", "lost"]).or(z.literal("")).default(""),
  kind: z.enum(["contact", "exhibitor", "brochure", "visitor"]).or(z.literal("")).default(""),
  owner: z.string().trim().max(160).default(""),
  event: z.string().trim().max(160).default(""),
  q: z.string().trim().max(200).default(""),
});

/** Saves (or renames) one of the current operator's leads-desk views. */
export async function saveLeadView(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canManageLeads(session)) {
    return { ok: false, message: "You do not have permission to manage leads." };
  }

  const parsed = savedViewSchema.safeParse({
    id: form.get("id") || undefined,
    name: form.get("name") ?? "",
    stage: form.get("stage") ?? "",
    kind: form.get("kind") ?? "",
    owner: form.get("owner") ?? "",
    event: form.get("event") ?? "",
    q: form.get("q") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Vue invalide." };
  }

  const { id, name, ...filters } = parsed.data;
  const saved = await getAdminSeams().crm.saveSavedView(
    { id, name, owner: session.email, filters },
    session.email,
  );

  revalidatePath("/admin/crm/leads");
  // `null` means the id was absent or owned by someone else. Both are reported
  // the same way: naming the difference would confirm that an id exists.
  return saved
    ? { ok: true, message: `Vue « ${saved.name} » enregistrée.` }
    : { ok: false, message: "Cette vue est introuvable." };
}

/** Removes one of the current operator's own views. */
export async function deleteLeadView(
  _prev: ActionResult | null,
  form: FormData,
): Promise<ActionResult> {
  const session = await readSession();
  if (!session || !canManageLeads(session)) {
    return { ok: false, message: "You do not have permission to manage leads." };
  }

  const id = String(form.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Vue introuvable." };

  const removed = await getAdminSeams().crm.deleteSavedView(id, session.email);
  revalidatePath("/admin/crm/leads");
  return removed
    ? { ok: true, message: "Vue supprimée." }
    : { ok: false, message: "Cette vue est introuvable." };
}
