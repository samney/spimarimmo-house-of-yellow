import { describe, expect, it } from "vitest";
import { csvCell, leadsToCsv } from "./csv";
import type { Lead } from "./types";

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "l1",
    createdAt: "2026-08-03T10:00:00.000Z",
    updatedAt: "2026-08-03T10:00:00.000Z",
    kind: "contact",
    name: "Visitor",
    email: "visitor@example.test",
    organisation: "",
    message: "Bonjour",
    locale: "fr",
    sourcePath: "/fr/contact",
    cta: "contact",
    eventSlug: "",
    consent: true,
    stage: "new",
    assignee: "",
    lostReason: "",
    activity: [],
    dedupeKey: "k",
    ...overrides,
  };
}

describe("csvCell", () => {
  it("quotes every cell and doubles inner quotes", () => {
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
  });

  it("neutralises formula triggers — lead fields are attacker-supplied", () => {
    expect(csvCell("=cmd|calc")).toBe('"\'=cmd|calc"');
    expect(csvCell("+SUM(A1)")).toBe('"\'+SUM(A1)"');
    expect(csvCell("-2+3")).toBe('"\'-2+3"');
    expect(csvCell("@import")).toBe('"\'@import"');
  });

  it("keeps ordinary text intact inside the quotes", () => {
    expect(csvCell("Bonjour, monde")).toBe('"Bonjour, monde"');
  });
});

describe("leadsToCsv", () => {
  it("emits a header row plus one row per lead, CRLF terminated", () => {
    const csv = leadsToCsv([lead(), lead({ id: "l2", name: "Autre" })]);
    const lines = csv.split("\r\n");
    expect(lines[0]).toContain('"received"');
    expect(lines).toHaveLength(4); // header + 2 rows + trailing empty
    expect(lines[1]).toContain('"Visitor"');
    expect(lines[2]).toContain('"Autre"');
  });

  it("survives multiline messages without breaking rows", () => {
    const csv = leadsToCsv([lead({ message: "line one\nline two" })]);
    // The newline stays INSIDE the quoted cell; the record separator is CRLF.
    expect(csv).toContain('"line one\nline two"');
    expect(csv.split("\r\n")).toHaveLength(3);
  });

  it("states consent explicitly, never as a bare boolean", () => {
    expect(leadsToCsv([lead({ consent: false })])).toContain('"not_given"');
  });
});
