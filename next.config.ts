import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reverse proxy for PostHog, so analytics requests go to our own domain.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog API paths use trailing slashes.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
