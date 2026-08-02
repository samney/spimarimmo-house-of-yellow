import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  PublicSubmissionStatus,
  SubmissionInput,
  SubmissionReceipt,
  SubmissionRepository,
} from "@/lib/backend/seams";

/* Development implementation of `SubmissionRepository`.

   Production is the Supabase schema, where the submission, its immutable
   context, its consent records and the resulting outbox event commit in one
   database transaction. That stack is not reachable yet (`P-1`), so this stores
   the same four parts locally.

   A file store has no transactions. Rather than pretend otherwise, all four
   parts are serialised into ONE record and written with a single atomic append,
   so a crash can never leave a submission without its consent or outbox rows.
   That is the closest honest equivalent, and it is still a development adapter,
   never production persistence.

   The contract's discipline is preserved exactly:
   - `create` resolves only after the write is durable;
   - the receipt state is only `received` or `duplicate_linked`, so an
     acknowledgement can never imply delivery or CRM synchronisation;
   - `publicReference` is opaque, non-enumerable and PII-free;
   - a retried request with the same idempotency key never creates a second
     record. */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "spimar-submissions.jsonl");

type StoredSubmission = {
  id: string;
  publicReference: string;
  idempotencyKey: string;
  siteId: string;
  locale: string;
  formKey: string;
  formVersionId: string | null;
  fields: Record<string, unknown>;
  consents: readonly { consentDefinitionId: string; granted: boolean }[];
  context: Record<string, unknown>;
  state: "received" | "duplicate_linked" | "withdrawn" | "rejected" | "closed";
  submittedAt: string;
  /** The outbox event that delivery would later consume. Never sent from here. */
  outbox: { event: string; createdAt: string; deliveredAt: null };
  withdrawnReason?: string;
};

function readAll(): StoredSubmission[] {
  if (!fs.existsSync(FILE)) return [];
  return fs
    .readFileSync(FILE, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => JSON.parse(line) as StoredSubmission);
}

function writeAll(rows: StoredSubmission[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, rows.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
}

/** Opaque and non-enumerable: 160 bits of randomness, no embedded identifiers. */
function publicReference(): string {
  return crypto.randomBytes(20).toString("base64url");
}

export class FileSubmissionRepository implements SubmissionRepository {
  async create(input: SubmissionInput): Promise<SubmissionReceipt> {
    const rows = readAll();

    // Idempotency is checked before anything is written, so a retried request
    // links to the original rather than creating a second record.
    const existing = rows.find((r) => r.idempotencyKey === input.idempotencyKey);
    if (existing) {
      return {
        state: "duplicate_linked",
        publicReference: existing.publicReference,
        submittedAt: existing.submittedAt,
      };
    }

    const submittedAt = new Date().toISOString();
    const record: StoredSubmission = {
      id: crypto.randomUUID(),
      publicReference: publicReference(),
      idempotencyKey: input.idempotencyKey,
      siteId: input.siteId,
      locale: input.locale,
      formKey: input.formKey,
      formVersionId: input.formVersionId,
      fields: { ...input.fields },
      consents: input.consents.map((c) => ({ ...c })),
      context: { ...input.context },
      state: "received",
      submittedAt,
      // Queued, never delivered here. No provider is connected (`P-2`).
      outbox: { event: "submission.received", createdAt: submittedAt, deliveredAt: null },
    };

    // Single append: submission, context, consents and outbox commit together.
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf8");

    return {
      state: "received",
      publicReference: record.publicReference,
      submittedAt: record.submittedAt,
    };
  }

  async getPublicStatus(reference: string): Promise<PublicSubmissionStatus | null> {
    const row = readAll().find((r) => r.publicReference === reference);
    if (!row) return null;
    // Coarse only — never exposes fields, consent detail or delivery state.
    const status: PublicSubmissionStatus["status"] =
      row.state === "withdrawn"
        ? "withdrawn"
        : row.state === "rejected"
          ? "rejected"
          : row.state === "closed"
            ? "closed"
            : "received";
    return { status, submittedAt: row.submittedAt };
  }

  async withdraw(reference: string, reason: string): Promise<void> {
    const rows = readAll();
    const index = rows.findIndex((r) => r.publicReference === reference);
    // Withdrawing an unknown reference is a no-op, not an error: responding
    // differently would let a caller enumerate valid references.
    if (index < 0) return;
    rows[index] = { ...rows[index], state: "withdrawn", withdrawnReason: reason };
    writeAll(rows);
  }
}
