import { afterEach, beforeEach, describe } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describeAcquisitionContract } from "./acquisition-contract";
import { FileAcquisitionRepository } from "./file-acquisition-repository";

/* The development implementation of the acquisition seam, held to the shared
   contract. The database adapter runs the identical describes in
   postgres-seams.pg.test.ts against the real migrations. */

describe("file-backed acquisition", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "spimar-acquisition-"));
    process.env.SPIMAR_DATA_DIR = dir;
  });

  afterEach(() => {
    delete process.env.SPIMAR_DATA_DIR;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  describeAcquisitionContract("FileAcquisitionRepository", () => new FileAcquisitionRepository());
});
