import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { getRobotsHeader } from "./lib/seo/robots";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const robotsHeader = getRobotsHeader();

const nextConfig: NextConfig = {
  async headers() {
    if (!robotsHeader) return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: robotsHeader }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
