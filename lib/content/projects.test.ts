import { describe, expect, it } from "vitest";
import { CATEGORIES, PROJECTS } from "./projects";

describe("Made by Yellow project contract", () => {
  it("keeps the audited 21-project order unique", () => {
    expect(PROJECTS).toHaveLength(21);
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(PROJECTS.length);
  });

  it("uses only the eight audited filters", () => {
    const allowed = new Set<string>(CATEGORIES);

    for (const project of PROJECTS) {
      expect(project.categories.length).toBeGreaterThan(0);
      expect(project.categories.every((category) => allowed.has(category))).toBe(true);
    }
  });

  it("keeps every filter connected to at least one project", () => {
    for (const category of CATEGORIES) {
      expect(PROJECTS.some((project) => project.categories.includes(category))).toBe(true);
    }
  });
});
