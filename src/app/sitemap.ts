import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * lastModified was previously `new Date()` on every route, which told
 * crawlers the entire site changed on every build — a signal engines learn
 * to ignore. Dates are now declared per route and only moved when the
 * content actually changes.
 */

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified: string;
};

const ROUTES: Entry[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly", lastModified: "2026-09-05" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly", lastModified: "2026-09-05" },

  { path: "/resources/best-aeo-software", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-09-04" },
  { path: "/resources/best-aeo-tools-for-tracking-chatgpt-brand-mentions", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-09-04" },
  { path: "/resources/how-to-track-ai-search-visibility", priority: 0.8, changeFrequency: "weekly", lastModified: "2026-09-04" },
  { path: "/resources/state-of-ai-search-visibility-2026", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-04" },

  { path: "/alternative/semrush", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-04" },
  { path: "/alternative/ahrefs", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-04" },
  { path: "/alternative/moz", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-04" },
  { path: "/alternative/brightedge", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-04" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(r.lastModified),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
