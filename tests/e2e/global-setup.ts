import { rm } from "node:fs/promises";
import { E2E_DATA_DIR } from "./data-dir";

/* Starts every browser run from an empty store.

   Two reasons this matters. First, a local run must reproduce CI, where the
   store is always empty — a suite that passes only because the developer's
   store happens to contain a matching record is not evidence. Second, the
   suite writes real records, and it has no business mutating the store a
   developer is working in. */
export default async function globalSetup() {
  await rm(E2E_DATA_DIR, { recursive: true, force: true });
}
