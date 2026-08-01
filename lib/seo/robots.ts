import type { Metadata, MetadataRoute } from "next";

export type DeploymentEnvironment = Record<string, string | undefined>;

const BLOCKED_ROBOTS_HEADER = "noindex, nofollow, noarchive";

function parseApprovedProductionUrl(rawUrl: string | undefined): URL | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.toLowerCase();
    const isPreviewHost = hostname === "localhost" || hostname.endsWith(".vercel.app");
    if (url.protocol !== "https:" || isPreviewHost) return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

export function getCanonicalProductionUrl(
  environment: DeploymentEnvironment = process.env,
): URL | null {
  if (environment.VERCEL_ENV !== "production") return null;
  return parseApprovedProductionUrl(environment.NEXT_PUBLIC_SITE_URL);
}

export function isIndexingAllowed(environment: DeploymentEnvironment = process.env): boolean {
  return getCanonicalProductionUrl(environment) !== null;
}

export function getRobotsHeader(environment: DeploymentEnvironment = process.env): string | null {
  return isIndexingAllowed(environment) ? null : BLOCKED_ROBOTS_HEADER;
}

export function getRobotsMetadata(
  environment: DeploymentEnvironment = process.env,
): Metadata["robots"] {
  if (isIndexingAllowed(environment)) {
    return { index: true, follow: true };
  }

  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}

export function getRobotsRoute(
  environment: DeploymentEnvironment = process.env,
): MetadataRoute.Robots {
  const canonicalUrl = getCanonicalProductionUrl(environment);
  if (!canonicalUrl) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: canonicalUrl.toString(),
  };
}
