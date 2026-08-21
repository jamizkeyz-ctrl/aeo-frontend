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
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseFlow AEO | AI Answer Engine Visibility Engine",
    description:
      "Benchmark Share of Voice across ChatGPT, Perplexity & Claude with automated schema remediation.",
    creator: "@pulseflowaeo",
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
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#030712] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}