import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, TWITTER } from "@/lib/seo";

/**
 * Type system:
 *   Archivo       — display / headings (tight, confident grotesque)
 *   Public Sans   — body copy
 *   JetBrains Mono— data, labels, code, tabular figures
 *
 * All three are self-hosted by next/font, so there is no render-blocking
 * request to fonts.googleapis.com and no layout shift.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "PulseFlow AEO — Track Your Brand in ChatGPT, Perplexity & AI Overviews",
    template: "%s | PulseFlow AEO",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // `keywords` intentionally removed — ignored by every major engine since
  // 2009 and a dated-SEO signal on a site selling search expertise.
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: "PulseFlow AEO — Get cited when AI answers your buyers' questions",
    description:
      "Share of voice across ChatGPT, Perplexity, Claude and Google AI Overviews, plus the schema and outreach fixes that get you named.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "PulseFlow AEO — AI answer engine share of voice report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER,
    creator: TWITTER,
    title: "PulseFlow AEO — Get cited when AI answers your buyers' questions",
    description:
      "Share of voice across ChatGPT, Perplexity, Claude and Google AI Overviews, plus the fixes that get you named.",
    // Same asset as Open Graph. These previously pointed at two different
    // files, which meant social previews and crawlers saw different images.
    images: ["/og-banner.png"],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${archivo.variable} ${publicSans.variable} ${jetbrains.variable}`}
    >
      <body className="bg-[#030712] font-sans text-slate-100 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
