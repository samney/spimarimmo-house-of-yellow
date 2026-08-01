import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

/* The comparison tool is a gate. These tests drive the real script as a child
   process and assert its real exit code, because the defect being guarded
   against is precisely a tool that reports "no mismatches" while exiting 0 on
   incomplete evidence. */

/* Deliberately permissive: these tests corrupt captures in ways a healthy audit
   never contains, so the fields must accept the invalid shapes under test. */
type AuditBlock = {
  cls: string;
  box: { top: number | null; height: number | null };
  surfaceCount?: number;
};
type AuditRecord = {
  slug: string;
  viewport: string;
  blocks: AuditBlock[];
  blockSequence: string[];
  stats: { label: string; value: string }[];
  scrollHeight: number | null;
  horizontalOverflow: number | string;
  consoleErrors: string[];
  failedRequests: string[];
  error?: string;
};
type Audit = { base: string; results: AuditRecord[] };

const REFERENCE = JSON.parse(readFileSync("qa/eng014c/reference-audit.json", "utf8")) as Audit;
const IMPLEMENTATION = JSON.parse(
  readFileSync("qa/eng014c/implementation-audit.json", "utf8"),
) as Audit;

const workspace = mkdtempSync(join(tmpdir(), "eng014c-compare-"));
afterAll(() => rmSync(workspace, { recursive: true, force: true }));

let counter = 0;
function run(mutate: (reference: Audit, implementation: Audit) => void) {
  const reference = structuredClone(REFERENCE);
  const implementation = structuredClone(IMPLEMENTATION);
  mutate(reference, implementation);

  const id = `case-${(counter += 1)}`;
  const referencePath = join(workspace, `${id}-reference.json`);
  const implementationPath = join(workspace, `${id}-implementation.json`);
  const outPath = join(workspace, `${id}-matrix.json`);
  writeFileSync(referencePath, JSON.stringify(reference));
  writeFileSync(implementationPath, JSON.stringify(implementation));

  try {
    const stdout = execFileSync(
      process.execPath,
      [
        "qa/eng014c-compare.mjs",
        `--reference=${referencePath}`,
        `--implementation=${implementationPath}`,
        `--out=${outPath}`,
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return { code: 0, output: stdout };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { code: failure.status, output: `${failure.stdout}${failure.stderr}` };
  }
}

const desktop = (record: { viewport: string }) => record.viewport === "1440x900";

describe("eng014c-compare gate", () => {
  it("passes on the real 42-record audit and still reports the whole-page exception", () => {
    const result = run(() => {});
    expect(result.code).toBe(0);

    const summary = JSON.parse(result.output.slice(0, result.output.indexOf("\n\nwrote")));
    expect(summary.records).toBe(42);
    expect(summary.expectedRecords).toBe(42);
    expect(summary.validationFailures).toEqual([]);
    /* The unmet criterion must stay visible and must never read as passing. */
    expect(summary.wholePageScrollHeightException.status).toMatch(/UNMET/);
    expect(summary.wholePageScrollHeightException.recordsExceedingTwoPercent).toBe(42);
  });

  it("rejects a missing implementation record", () => {
    const result = run((_reference, implementation) => {
      implementation.results.splice(3, 1);
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/expected 42 records, found 41/);
  });

  it("rejects a missing reference record", () => {
    const result = run((reference) => {
      reference.results.splice(7, 1);
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/expected 42 records, found 41/);
  });

  it("rejects a duplicate record instead of silently de-duplicating it", () => {
    const result = run((_reference, implementation) => {
      implementation.results[5] = structuredClone(implementation.results[4]);
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/duplicate record/);
  });

  it("rejects an unmatched record rather than skipping past it", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.slug = "not-a-real-route";
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/unmatched: implementation record not-a-real-route/);
  });

  it("rejects a null scroll height instead of treating it as zero", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.scrollHeight = null;
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/scrollHeight: expected a finite number/);
  });

  it("rejects a non-finite measurement", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.horizontalOverflow = "NaN";
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/horizontalOverflow: expected a finite number/);
  });

  it("rejects a block box with no measurable geometry rather than scoring it zero", () => {
    const result = run((_reference, implementation) => {
      const record = implementation.results.find(desktop)!;
      record.blocks[record.blocks.length - 1].box = { top: null, height: null };
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/expected a finite number/);
  });

  it("rejects a record captured with an error", () => {
    const result = run((_reference, implementation) => {
      const record = implementation.results.find(desktop)!;
      record.error = "navigation timeout";
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/captured with error navigation timeout/);
  });

  it("rejects a record with no captured blocks", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.blocks = [];
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/has no captured blocks/);
  });

  it("rejects a drifted block sequence", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.blockSequence.reverse();
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/blockSequenceMismatches/);
  });

  it("rejects drifted statistics", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.stats[0].value = "0";
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/statsMismatches/);
  });

  it("rejects a section anchor outside tolerance", () => {
    const result = run((_reference, implementation) => {
      const record = implementation.results.find(desktop)!;
      const box = record.blocks[record.blocks.length - 1].box;
      box.top = (box.top ?? 0) + 500;
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/anchorsOutOfTolerance|blockSpanOutOfTolerance/);
  });

  it("rejects horizontal overflow", () => {
    const result = run((_reference, implementation) => {
      implementation.results.find(desktop)!.horizontalOverflow = 24;
    });
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/horizontalOverflow/);
  });
});
