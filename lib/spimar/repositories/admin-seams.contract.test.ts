import { afterEach, beforeEach, describe } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  describeCmsContract,
  describeCrmContract,
  describeDirectoryContract,
  describeOverviewContract,
} from "./contract-suites";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";
import { FileOverviewRepository } from "./file-overview-repository";

/* The development implementations of the operational seams, held to the shared
   contracts in contract-suites.ts. A database adapter must pass the same
   describes unchanged. */

describe("file-backed operational seams", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "spimar-admin-seams-"));
    process.env.SPIMAR_DATA_DIR = dir;
  });

  afterEach(() => {
    delete process.env.SPIMAR_DATA_DIR;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  describeCmsContract("FileCmsRepository", () => new FileCmsRepository());
  describeCrmContract("FileCrmRepository", () => new FileCrmRepository());
  describeDirectoryContract("FileCrmRepository", () => new FileCrmRepository());
  describeOverviewContract("FileOverviewRepository", (now) => ({
    crm: new FileCrmRepository(),
    overview: new FileOverviewRepository(now),
  }));
});
