import { afterEach, describe } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { describeContentContract, describeSubmissionContract } from "./contract-suites";
import { FileContentRepository } from "./file-content-repository";
import { FileSubmissionRepository } from "./file-submission-repository";

/* The development implementations, held to the shared contracts. The suites
   themselves live in contract-suites.ts so the database adapter is run through
   the identical describes (see postgres-seams.pg.test.ts). */

const DATA_DIR = path.join(process.cwd(), ".data");
const SUBMISSIONS = path.join(DATA_DIR, "spimar-submissions.jsonl");

describe("file-backed seams", () => {
  afterEach(() => {
    if (fs.existsSync(SUBMISSIONS)) fs.rmSync(SUBMISSIONS);
  });

  describeSubmissionContract("FileSubmissionRepository", () => new FileSubmissionRepository());
  describeContentContract("FileContentRepository", () => new FileContentRepository());
});
