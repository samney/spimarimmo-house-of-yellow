import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Destination, Lead, MediaAsset, Page, PublishState, SpimarEvent } from "../types";
import type { AcquisitionAttribution } from "@/lib/backend/acquisition-seams";
import type { SavedLeadView, SavedLeadViewInput } from "@/lib/backend/admin-seams";

/* File-backed store engine.

   Persistence follows the convention established by `lib/contact/store.ts`:
   newline-delimited JSON under `.data/`, which is gitignored. This is the
   documented substitute while `P-1` leaves Supabase credentials unavailable
   (`D-021`).

   This module is internal to `lib/spimar/repositories/`. Application code
   depends on the seams in `lib/backend/` and obtains an implementation from
   the composition root (`./index.ts`) — never from here. No provider is
   claimed to be live. */

function dataDir(): string {
  // Overridable so contract tests run against a throwaway directory instead of
  // the developer's working store. Never set in production.
  return process.env.SPIMAR_DATA_DIR ?? path.join(process.cwd(), ".data");
}

type Collection =
  | "destinations"
  | "events"
  | "pages"
  | "media"
  | "leads"
  | "acquisitions"
  | "tasks"
  | "saved-views";

function file(collection: Collection): string {
  return path.join(dataDir(), `spimar-${collection}.jsonl`);
}

function readAll<T>(collection: Collection): T[] {
  const target = file(collection);
  if (!fs.existsSync(target)) return [];
  return fs
    .readFileSync(target, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as T);
}

function writeAll<T>(collection: Collection, rows: T[]): void {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(collection), rows.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
}

export function newId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

/* ------------------------------------------------------------------ content */

type WithState = { id: string; slug?: string; state: PublishState };

function published<T extends WithState>(rows: T[]): T[] {
  return rows.filter((r) => r.state === "published");
}

export function listDestinations(opts: { includeDrafts?: boolean } = {}): Destination[] {
  const rows = readAll<Destination>("destinations");
  return opts.includeDrafts ? rows : published(rows);
}

export function getDestination(slug: string, opts: { includeDrafts?: boolean } = {}) {
  return listDestinations(opts).find((d) => d.slug === slug) ?? null;
}

export function listEvents(opts: { includeDrafts?: boolean } = {}): SpimarEvent[] {
  const rows = readAll<SpimarEvent>("events");
  const visible = opts.includeDrafts ? rows : published(rows);
  // Undated records sort last: they are honest "dates to be confirmed" entries,
  // not upcoming editions, so they must never lead the index.
  return visible.sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return a.startDate.localeCompare(b.startDate);
  });
}

export function getEvent(slug: string, opts: { includeDrafts?: boolean } = {}) {
  return listEvents(opts).find((e) => e.slug === slug) ?? null;
}

export function listPages(opts: { includeDrafts?: boolean } = {}): Page[] {
  const rows = readAll<Page>("pages");
  return opts.includeDrafts ? rows : published(rows);
}

export function getPage(slug: string, opts: { includeDrafts?: boolean } = {}) {
  return listPages(opts).find((p) => p.slug === slug) ?? null;
}

export function listMedia(opts: { includeDrafts?: boolean } = {}): MediaAsset[] {
  const rows = readAll<MediaAsset>("media");
  return opts.includeDrafts ? rows : published(rows);
}

type AnyRecord = { id: string };

function upsert<T extends AnyRecord>(collection: Collection, record: T): T {
  const rows = readAll<T>(collection);
  const index = rows.findIndex((r) => r.id === record.id);
  if (index >= 0) rows[index] = record;
  else rows.push(record);
  writeAll(collection, rows);
  return record;
}

function remove(collection: Collection, id: string): boolean {
  const rows = readAll<AnyRecord>(collection);
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  writeAll(collection, next);
  return true;
}

export function saveDestination(input: Partial<Destination> & { id?: string }, actor: string) {
  const existing = input.id
    ? readAll<Destination>("destinations").find((d) => d.id === input.id)
    : undefined;
  const record: Destination = {
    id: existing?.id ?? newId(),
    slug: input.slug ?? existing?.slug ?? "",
    state: input.state ?? existing?.state ?? "draft",
    name: input.name ?? existing?.name ?? {},
    summary: input.summary ?? existing?.summary ?? {},
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
    createdBy: existing?.createdBy ?? actor,
    updatedBy: actor,
  };
  return upsert("destinations", record);
}

export function saveEvent(input: Partial<SpimarEvent> & { id?: string }, actor: string) {
  const existing = input.id
    ? readAll<SpimarEvent>("events").find((e) => e.id === input.id)
    : undefined;
  const record: SpimarEvent = {
    id: existing?.id ?? newId(),
    slug: input.slug ?? existing?.slug ?? "",
    state: input.state ?? existing?.state ?? "draft",
    destinationId: input.destinationId ?? existing?.destinationId ?? null,
    title: input.title ?? existing?.title ?? {},
    summary: input.summary ?? existing?.summary ?? {},
    startDate: input.startDate ?? existing?.startDate ?? "",
    endDate: input.endDate ?? existing?.endDate ?? "",
    city: input.city ?? existing?.city ?? "",
    country: input.country ?? existing?.country ?? "",
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
    createdBy: existing?.createdBy ?? actor,
    updatedBy: actor,
  };
  return upsert("events", record);
}

export function savePage(input: Partial<Page> & { id?: string }, actor: string) {
  const existing = input.id ? readAll<Page>("pages").find((p) => p.id === input.id) : undefined;
  const record: Page = {
    id: existing?.id ?? newId(),
    slug: input.slug ?? existing?.slug ?? "",
    state: input.state ?? existing?.state ?? "draft",
    title: input.title ?? existing?.title ?? {},
    intro: input.intro ?? existing?.intro ?? {},
    body: input.body ?? existing?.body ?? {},
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
    createdBy: existing?.createdBy ?? actor,
    updatedBy: actor,
  };
  return upsert("pages", record);
}

export function saveMedia(input: Partial<MediaAsset> & { id?: string }, actor: string) {
  const existing = input.id
    ? readAll<MediaAsset>("media").find((m) => m.id === input.id)
    : undefined;
  const record: MediaAsset = {
    id: existing?.id ?? newId(),
    state: input.state ?? existing?.state ?? "draft",
    src: input.src ?? existing?.src ?? "",
    alt: input.alt ?? existing?.alt ?? {},
    rightsOwner: input.rightsOwner ?? existing?.rightsOwner ?? "",
    sourceProvenance: input.sourceProvenance ?? existing?.sourceProvenance ?? "",
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
    createdBy: existing?.createdBy ?? actor,
    updatedBy: actor,
  };
  return upsert("media", record);
}

export function deleteRecord(collection: Exclude<Collection, "leads">, id: string): boolean {
  return remove(collection, id);
}

/* --------------------------------------------------------------------- CRM */

function dedupeKeyFor(kind: string, email: string, message: string): string {
  return crypto
    .createHash("sha256")
    .update(`${kind}|${email.trim().toLowerCase()}|${message.trim()}`)
    .digest("hex");
}

export function listLeads(): Lead[] {
  return readAll<Lead>("leads").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getLead(id: string): Lead | null {
  return listLeads().find((l) => l.id === id) ?? null;
}

/** Returns the stored lead, or `null` when it duplicates a recent submission.
    The caller must not report success on `null` — an unstored submission is
    never confirmed to the visitor. The dedupe key is computed here: callers
    never mint storage keys. */
export function createLead(
  input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "activity" | "dedupeKey">,
) {
  const dedupeKey = dedupeKeyFor(input.kind, input.email, input.message);
  const rows = readAll<Lead>("leads");
  if (rows.some((r) => r.dedupeKey === dedupeKey)) return null;
  const record: Lead = {
    ...input,
    dedupeKey,
    id: newId(),
    createdAt: now(),
    updatedAt: now(),
    activity: [],
  };
  rows.push(record);
  writeAll("leads", rows);
  return record;
}

export function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "stage" | "assignee">>,
  activity: { by: string; kind: LeadActivityKind; detail: string },
): Lead | null {
  const rows = readAll<Lead>("leads");
  const index = rows.findIndex((l) => l.id === id);
  if (index < 0) return null;
  const current = rows[index];
  const next: Lead = {
    ...current,
    ...patch,
    updatedAt: now(),
    activity: [...current.activity, { at: now(), ...activity }],
  };
  rows[index] = next;
  writeAll("leads", rows);
  return next;
}

type LeadActivityKind = "note" | "stage" | "assignment";

/* ----------------------------------------------------------- acquisition

   Records the public funnel writes. Kept beside the leads rather than inside
   them because a submission is evidence in its own right: a deduplicated
   enquiry produces no new lead but must still leave a record that it happened.
   The canonical schema models these as form_submissions, consents,
   campaign_attribution, lead_assignments and tasks; this is their local
   equivalent. */

export type StoredAssignment = { queueKey: string; owner: string | null };

export type StoredTask = {
  id: string;
  leadId: string;
  title: string;
  dueAt: string;
  queueKey: string;
  createdAt: string;
  completedAt: string | null;
};

export type StoredAcquisition = {
  id: string;
  idempotencyKey: string;
  reference: string;
  leadId: string;
  submittedAt: string;
  disposition: string;
  formKey: string;
  formVersion: number | null;
  noticeVersion: string;
  consents: { consentDefinitionId: string; purpose: string; granted: boolean }[];
  /* The seam's own type rather than a loose record: an interface with optional
     members is not assignable to an index signature, and widening it here
     would let a typo in an attribution key pass silently. */
  attribution: AcquisitionAttribution;
  assignment: StoredAssignment;
  followUpTask: StoredTask;
};

export function findAcquisitionByIdempotencyKey(key: string): StoredAcquisition | null {
  return readAll<StoredAcquisition>("acquisitions").find((a) => a.idempotencyKey === key) ?? null;
}

export function findAcquisitionByReference(reference: string): StoredAcquisition | null {
  return readAll<StoredAcquisition>("acquisitions").find((a) => a.reference === reference) ?? null;
}

export function listAcquisitionsForLead(leadId: string): StoredAcquisition[] {
  return readAll<StoredAcquisition>("acquisitions").filter((a) => a.leadId === leadId);
}

export function recordAcquisition(input: Omit<StoredAcquisition, "id">): StoredAcquisition {
  const record: StoredAcquisition = { ...input, id: newId() };
  const rows = readAll<StoredAcquisition>("acquisitions");
  rows.push(record);
  writeAll("acquisitions", rows);
  return record;
}

export function findLeadByDedupeKey(dedupeKey: string): Lead | null {
  return readAll<Lead>("leads").find((l) => l.dedupeKey === dedupeKey) ?? null;
}

/** Creates the lead an acquisition produced, with its own dedupe key. */
export function createAcquiredLead(input: {
  dedupeKey: string;
  kind: Lead["kind"];
  name: string;
  email: string;
  organisation: string;
  organisationKey: string;
  message: string;
  locale: Lead["locale"];
  sourcePath: string;
  cta: string;
  eventSlug: string;
  consent: boolean;
}): string {
  const record: Lead = {
    id: newId(),
    createdAt: now(),
    updatedAt: now(),
    kind: input.kind,
    name: input.name,
    email: input.email,
    organisation: input.organisation,
    message: input.message,
    locale: input.locale,
    sourcePath: input.sourcePath,
    cta: input.cta,
    eventSlug: input.eventSlug,
    consent: input.consent,
    stage: "new",
    assignee: "",
    activity: [
      {
        at: now(),
        by: "système",
        kind: "note",
        detail: "Lead créé depuis le formulaire public.",
      },
    ],
    dedupeKey: input.dedupeKey,
  };
  const rows = readAll<Lead>("leads");
  rows.push(record);
  writeAll("leads", rows);
  return record.id;
}

export function createFollowUpTask(input: {
  leadId: string;
  title: string;
  dueAt: string;
  queueKey: string;
}): StoredTask {
  const record: StoredTask = {
    id: newId(),
    leadId: input.leadId,
    title: input.title,
    dueAt: input.dueAt,
    queueKey: input.queueKey,
    createdAt: now(),
    completedAt: null,
  };
  const rows = readAll<StoredTask>("tasks");
  rows.push(record);
  writeAll("tasks", rows);
  return record;
}

export function listOpenTasks(): StoredTask[] {
  return readAll<StoredTask>("tasks")
    .filter((t) => t.completedAt === null)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function completeTask(id: string): StoredTask | null {
  const rows = readAll<StoredTask>("tasks");
  const index = rows.findIndex((t) => t.id === id);
  if (index < 0) return null;
  rows[index] = { ...rows[index], completedAt: now() };
  writeAll("tasks", rows);
  return rows[index];
}

/* -------------------------------------------------------------- saved views */

/* Per-owner saved filter sets for the leads desk.

   Ownership is enforced on every read and write here rather than by the
   caller. The console does filter its own queries, but a view is not sensitive
   because it is hidden — it is private because this layer refuses to return or
   mutate another operator's row. */

export function listSavedViews(owner: string): SavedLeadView[] {
  return readAll<SavedLeadView>("saved-views")
    .filter((view) => view.owner === owner)
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export function saveSavedView(input: SavedLeadViewInput, actor: string): SavedLeadView | null {
  const rows = readAll<SavedLeadView>("saved-views");
  const timestamp = now();

  if (input.id) {
    const index = rows.findIndex((view) => view.id === input.id);
    // Absent, or owned by someone else: both answer `null`. Distinguishing them
    // would confirm to a caller that an id they do not own exists.
    if (index < 0 || rows[index].owner !== input.owner) return null;
    const updated: SavedLeadView = {
      ...rows[index],
      name: input.name,
      filters: input.filters,
      updatedAt: timestamp,
      updatedBy: actor,
    };
    rows[index] = updated;
    writeAll("saved-views", rows);
    return updated;
  }

  /* A second view with the same name would be indistinguishable in the UI, so
     saving over an existing name updates it rather than creating a twin. */
  const existing = rows.findIndex((view) => view.owner === input.owner && view.name === input.name);
  if (existing >= 0) {
    const updated: SavedLeadView = {
      ...rows[existing],
      filters: input.filters,
      updatedAt: timestamp,
      updatedBy: actor,
    };
    rows[existing] = updated;
    writeAll("saved-views", rows);
    return updated;
  }

  const created: SavedLeadView = {
    id: newId(),
    name: input.name,
    owner: input.owner,
    filters: input.filters,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: actor,
    updatedBy: actor,
  };
  rows.push(created);
  writeAll("saved-views", rows);
  return created;
}

export function deleteSavedView(id: string, owner: string): boolean {
  const rows = readAll<SavedLeadView>("saved-views");
  const index = rows.findIndex((view) => view.id === id && view.owner === owner);
  if (index < 0) return false;
  rows.splice(index, 1);
  writeAll("saved-views", rows);
  return true;
}
