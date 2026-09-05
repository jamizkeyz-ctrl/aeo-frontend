import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * The site previously had no robots.txt at all — /robots.txt 404'd, so the
 * sitemap was never declared and no AI crawler had explicit permission.
 *
 * AI crawlers are listed individually and allowed on purpose. Several of
 * them (Google-Extended, Applebot-Extended, OAI-SearchBot) are opt-out
 * controls: staying silent is ambiguous, allowing them is not. For a
 * product sold on AI visibility, being explicitly crawlable is the point.
 */

const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  // Google / Apple / Microsoft AI surfaces
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  // Common Crawl (feeds many model training sets)
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/badge/", "/report/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/", "/report/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
