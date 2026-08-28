import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pulseflowaeo.com"),
  title: {
    default: "PulseFlow AEO | AI Visibility & Share of Voice Engine",
    template: "%s | PulseFlow AEO",
  },
  description:
    "Measure and conquer your brand visibility across AI Answer Engines with real-time 30-prompt citation audits and schema fixes.",
  keywords: [
    "AEO",
    "Answer Engine Optimization",
    "Share of Voice",
    "ChatGPT SEO",
    "Perplexity AI Citations",
    "AI Search Engine Optimization",
    "GEO",
  ],
  authors: [{ name: "PulseFlow AEO Team" }],
  creator: "PulseFlow AEO",
  publisher: "PulseFlow AEO",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulseflowaeo.com",
    siteName: "PulseFlow AEO",
    title: "PulseFlow AEO | Answer Engine Visibility Engine",
    description:
      "Benchmark Share of Voice across ChatGPT, Perplexity & Claude with automated schema remediation.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "PulseFlow AEO - AI Citation Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow AEO | Answer Engine Visibility Engine",
    description:
      "Benchmark Share of Voice across ChatGPT, Perplexity & Claude with automated schema remediation.",
    creator: "@pulseflowaeo",
    images: ["/og-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PulseFlow AEO",
    "url": "https://pulseflowaeo.com",
    "logo": "https://pulseflowaeo.com/og-banner.png",
    "sameAs": [
      "https://twitter.com/pulseflowaeo"
    ],
    "description": "Enterprise AI Answer Engine Optimization (AEO) and Share of Voice tracking platform."
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#030712] text-slate-100 antialiased`}>
        {/* Global Organization Entity Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}