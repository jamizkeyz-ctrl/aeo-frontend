import type { NextConfig } from "next";

/**
 * Canonical host: the sitemap, JSON-LD and metadataBase all use the apex
 * domain, but www.pulseflowaeo.com also resolved — two hosts serving the
 * same content splits every ranking and citation signal. www now 301s to
 * the apex.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pulseflowaeo.com" }],
        destination: "https://pulseflowaeo.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Generated text files should be cacheable at the edge but cheap to refresh.
        source: "/llms.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
