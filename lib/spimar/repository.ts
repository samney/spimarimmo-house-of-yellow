import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Destination, Lead, MediaAsset, Page, PublishState, SpimarEvent } from "./types";

/* Repository layer.

   Persistence follows the convention already established by
   `lib/contact/store.ts`: newline-delimited JSON under `.data/`, which is
   gitignored. This is the documented substitute while `P-1` leaves Supabase
   credentials unavailable (`D-021`).

   Every public read and every CMS write goes through the functions below, so
   swapping in a Supabase adapter is a change to this file alone. Callers never
   touch storage directly. No provider is claimed to be live. */

const DATA_DIR = path.join(process.cwd(), ".data");

type Collection = "destinations" | "events" | "pages" | "media" | "leads";

function file(collection: Collection): string {
  return path.join(DATA_DIR, `spimar-${collection}.jsonl`);
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
  fs.mkdirSync(DATA_DIR, { recursive: true });
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

export function dedupeKeyFor(kind: string, email: string, message: string): string {
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
    never confirmed to the visitor. */
export function createLead(input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "activity">) {
  const rows = readAll<Lead>("leads");
  if (rows.some((r) => r.dedupeKey === input.dedupeKey)) return null;
  const record: Lead = {
    ...input,
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
