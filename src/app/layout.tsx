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
    "Measure and conquer your brand visibility across AI Answer Engines. Real-time 30-prompt citation audits for ChatGPT Search, Perplexity, Claude, and Google AI Overviews.",
  keywords: [
    "AEO",
    "Answer Engine Optimization",
    "Share of Voice",
    "ChatGPT SEO",
    "Perplexity AI Citations",
    "AI Search Engine Optimization",
    "Generative Engine Optimization",
    "GEO",
  ],
  authors: [{ name: "PulseFlow AEO Team" }],
  creator: "PulseFlow AEO",
  publisher: "PulseFlow AEO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulseflowaeo.com",
    siteName: "PulseFlow AEO",
    title: "PulseFlow AEO | Answer Engine Visibility & Citation Engine",
    description:
      "Benchmark your brand's Share of Voice against competitors across AI search platforms. Instant schema remediation and conquest listicle generation.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "PulseFlow AEO - AI Search Share of Voice Benchmark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow AEO | AI Answer Engine Visibility Engine",
    description:
      "Track your brand's AI search presence across ChatGPT, Perplexity, and Google AI Overviews in seconds.",
    images: ["/og-preview.png"],
    creator: "@pulseflowaeo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#030712] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}