import manifestJson from "./video-manifest.json";

export type VideoDeliveryAsset = {
  id: string;
  legacyPath: string;
  src: string;
  delivery: "repository" | "cdn";
  sourceProvenance: string;
  rightsOwner: string;
  rightsStatus: "approved";
  expiresAt: string | null;
};

type VideoManifest = {
  schemaVersion: number;
  deliveryPolicy: string;
  assets: VideoDeliveryAsset[];
};

const manifest = manifestJson as VideoManifest;
const byId = new Map(manifest.assets.map((asset) => [asset.id, asset]));
const byLegacyPath = new Map(manifest.assets.map((asset) => [asset.legacyPath, asset]));

export function resolveVideoId(id: string | null | undefined): string | null {
  if (!id) return null;
  return byId.get(id)?.src ?? null;
}

export function resolveLegacyVideoPath(path: string | null | undefined): string | null {
  if (!path) return null;
  return byLegacyPath.get(path)?.src ?? null;
}

export function getVideoDeliveryAssets(): readonly VideoDeliveryAsset[] {
  return manifest.assets;
}
