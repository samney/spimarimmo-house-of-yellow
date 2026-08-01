import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import legacyVideoMap from "../content/local-videos.json";
import { PROJECTS } from "../content/projects";
import { getProjectPoster } from "./posters";
import { getVideoDeliveryAssets, resolveLegacyVideoPath, resolveVideoId } from "./video-registry";

describe("video delivery registry", () => {
  it("publishes only unique, approved and traceable assets", () => {
    const assets = getVideoDeliveryAssets();
    const ids = new Set<string>();
    const paths = new Set<string>();
    const sources = new Set<string>();

    for (const asset of assets) {
      expect(asset.rightsStatus).toBe("approved");
      expect(asset.sourceProvenance.trim()).not.toBe("");
      expect(asset.rightsOwner.trim()).not.toBe("");
      expect(ids.has(asset.id)).toBe(false);
      expect(paths.has(asset.legacyPath)).toBe(false);
      expect(sources.has(asset.src)).toBe(false);
      expect(legacyVideoMap[asset.id as keyof typeof legacyVideoMap]).toBe(asset.legacyPath);

      ids.add(asset.id);
      paths.add(asset.legacyPath);
      sources.add(asset.src);
      expect(resolveVideoId(asset.id)).toBe(asset.src);
      expect(resolveLegacyVideoPath(asset.legacyPath)).toBe(asset.src);
    }
  });

  it("does not publish an unapproved reference mapping", () => {
    expect(resolveVideoId("not-approved")).toBeNull();
    expect(resolveLegacyVideoPath("/videos/not-approved.mp4")).toBeNull();
  });

  it("provides a deployable poster for every project card", () => {
    for (const project of PROJECTS) {
      const poster = getProjectPoster(project);
      expect(poster.startsWith("/images/")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", poster))).toBe(true);
    }
  });
});
