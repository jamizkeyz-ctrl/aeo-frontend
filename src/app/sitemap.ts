import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pulseflowaeo.com';

  const staticRoutes = [
    '',
    '/resources/best-aeo-software',
    '/resources/best-aeo-tools-for-tracking-chatgpt-brand-mentions',
    '/resources/how-to-track-ai-search-visibility',
    '/resources/state-of-ai-search-visibility-2026',
    '/alternative/semrush',
    '/alternative/ahrefs',
    '/alternative/moz',
    '/alternative/brightedge',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes];
}