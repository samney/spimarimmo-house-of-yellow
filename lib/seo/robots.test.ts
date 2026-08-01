import { describe, expect, it } from "vitest";
import {
  getCanonicalProductionUrl,
  getRobotsHeader,
  getRobotsRoute,
  isIndexingAllowed,
} from "./robots";

describe("deployment indexing policy", () => {
  it.each(["preview", "development"])("blocks the %s environment", (vercelEnv) => {
    const environment = {
      VERCEL_ENV: vercelEnv,
      NEXT_PUBLIC_SITE_URL: "https://spimarimmo.com",
    };

    expect(isIndexingAllowed(environment)).toBe(false);
    expect(getRobotsHeader(environment)).toBe("noindex, nofollow, noarchive");
    expect(getRobotsRoute(environment)).toEqual({
      rules: [{ userAgent: "*", disallow: "/" }],
    });
  });

  it("blocks production until an approved canonical domain is configured", () => {
    expect(isIndexingAllowed({ VERCEL_ENV: "production" })).toBe(false);
    expect(
      isIndexingAllowed({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://project-preview.vercel.app",
      }),
    ).toBe(false);
  });

  it("allows indexing only for production on an HTTPS custom domain", () => {
    const environment = {
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://spimarimmo.com/some-path?preview=1",
    };

    expect(isIndexingAllowed(environment)).toBe(true);
    expect(getRobotsHeader(environment)).toBeNull();
    expect(getCanonicalProductionUrl(environment)?.toString()).toBe("https://spimarimmo.com/");
    expect(getRobotsRoute(environment)).toEqual({
      rules: [{ userAgent: "*", allow: "/" }],
      host: "https://spimarimmo.com/",
    });
  });
});
