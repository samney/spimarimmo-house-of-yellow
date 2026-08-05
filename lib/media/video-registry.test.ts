import { describe, expect, it } from "vitest";
import { getVideoDeliveryAssets, resolveLegacyVideoPath, resolveVideoId } from "./video-registry";

/* TRF-004 deleted the reference project and legacy-video-map fixtures this suite
   previously asserted against. The registry's own contract is unchanged and is
   still worth guarding, so the coverage is re-pointed rather than dropped: every
   published asset must be unique, approved and traceable, and anything not
   published must resolve to null.

   The manifest currently declares zero deployable assets (limitation L2), so the
   per-asset invariants iterate an empty set. They are kept deliberately — they
   are what will catch a bad entry the moment SPIMAR media is added in TRF-022,
   rather than something to write after the fact. */
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

      ids.add(asset.id);
      paths.add(asset.legacyPath);
      sources.add(asset.src);
      expect(resolveVideoId(asset.id)).toBe(asset.src);
      expect(resolveLegacyVideoPath(asset.legacyPath)).toBe(asset.src);
    }
  });

  it("resolves nothing for an unpublished id or legacy path", () => {
    expect(resolveVideoId("not-approved")).toBeNull();
    expect(resolveLegacyVideoPath("/videos/not-approved.mp4")).toBeNull();
  });

  it("rejects empty and nullish lookups", () => {
    expect(resolveVideoId(null)).toBeNull();
    expect(resolveVideoId(undefined)).toBeNull();
    expect(resolveVideoId("")).toBeNull();
    expect(resolveLegacyVideoPath(null)).toBeNull();
    expect(resolveLegacyVideoPath(undefined)).toBeNull();
    expect(resolveLegacyVideoPath("")).toBeNull();
  });

  /* Limitation L2 (no deployable asset) was lifted for exactly one
     owner-supplied, rights-approved asset under D-024. The assertion is not
     deleted: it now pins the declared set, so any undeclared addition — the
     regression L2 actually guarded against — still fails here. */
  it("declares only the rights-approved hero asset (D-024, lifting L2)", () => {
    const assets = getVideoDeliveryAssets();
    expect(assets.map((asset) => asset.id)).toEqual(["hero-real-estate-exhibition"]);
    for (const asset of assets) {
      expect(asset.rightsStatus).toBe("approved");
      expect(asset.rightsOwner).toBe("SPIMARIMMO");
      expect(asset.delivery).toBe("repository");
    }
  });
});
