import type { NextConfig } from "next";

/**
 * Host canonicalisation is owned by Vercel's domain settings, NOT by this
 * file. A www -> apex redirect here fought Vercel's own edge redirect and
 * produced ERR_TOO_MANY_REDIRECTS in production. Set the primary domain in
 * Vercel (Project -> Settings -> Domains) and let the edge handle it; one
 * redirect authority only.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,

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
