import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/* Local submission store — the documented substitute until the owner links
   Supabase (P-1). Contract: every accepted submission is persisted with id,
   timestamps, and origin metadata; moves to a `contact_submissions` table
   (RLS: service-role only) at HOY-040/120. Never log message bodies. */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "contact-submissions.jsonl");

export type StoredSubmission = {
  id: string;
  createdAt: string;
  nameVisitor: string;
  email: string;
  message: string;
  locale: string;
  ipHash: string;
};

export function storeSubmission(
  input: Omit<StoredSubmission, "id" | "createdAt">,
): StoredSubmission {
  const record: StoredSubmission = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.appendFileSync(FILE, JSON.stringify(record) + "\n", "utf8");
  return record;
}

/* Notification contract (P-2): when the owner supplies EMAIL_PROVIDER_API_KEY
   (and optionally CONTACT_NOTIFY_TO, default info@houseofyellow.nl), this is
   where the provider call goes. Until then we log a redacted line so the
   pipeline is observable without leaking content or secrets. */
export function notifySubmission(record: StoredSubmission): void {
  if (process.env.EMAIL_PROVIDER_API_KEY) {
    // Provider integration lands when the owner picks one (e.g. Resend).
    // Send: new submission {record.id} to CONTACT_NOTIFY_TO.
    console.warn(
      `contact: EMAIL_PROVIDER_API_KEY is set but no provider is wired yet (submission ${record.id})`,
    );
    return;
  }
  console.info(`contact: stored submission ${record.id} (no email provider configured)`);
}
