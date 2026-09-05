/**
 * Homepage — a SERVER component.
 *
 * Previously this file was one large `"use client"` tree calling
 * useSearchParams() inside <Suspense>, which made Next.js skip
 * server-rendering entirely: the HTML response was a 12KB loading spinner
 * with no headline, copy or FAQ in it. Googlebot renders JavaScript and
 * mostly coped; GPTBot, PerplexityBot and ClaudeBot largely do not, so the
 * site was invisible to the exact crawlers this product is sold on.
 *
 * The interactive audit engine now lives in <AuditEngine />, a client island
 * that keeps its own Suspense boundary. Everything else on this page is
 * static HTML in the first response.
 */

import type { Metadata } from "next";
import React from "react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AuditEngine from "@/components/AuditEngine";
import Hero from "@/components/marketing/Hero";
import {
  EngineStrip,
  ProblemSection,
  PlatformSection,
  MethodSection,
  CompareSection,
  PricingSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/MarketingSections";
import {
  graph,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  faqSchema,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Track Your Brand in ChatGPT, Perplexity & AI Overviews | PulseFlow AEO",
  description:
    "Measure your share of voice across ChatGPT, Perplexity, Claude and Google AI Overviews. Free multi-engine citation audit, automated JSON-LD remediation, results in under 15 seconds.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = graph(
    organizationSchema(),
    websiteSchema(),
    softwareApplicationSchema(),
    faqSchema(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "PulseFlow AEO — Answer Engine Optimization platform",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#software` },
      inLanguage: "en",
    },
  );

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#030712] font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main id="main">
        {/* Static, crawlable hero. */}
        <div data-marketing>
          <Hero />
        </div>

        {/* Client island: live audit form, job polling, report and history. */}
        <div id="audit" className="scroll-mt-20">
          <AuditEngine />
        </div>

        {/* Static, crawlable marketing body. */}
        <div data-marketing>
          <EngineStrip />
          <ProblemSection />
          <PlatformSection />
          <MethodSection />
          <CompareSection />
          <PricingSection />
          <FaqSection />
          <CtaSection />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
