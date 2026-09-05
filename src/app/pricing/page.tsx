import type { Metadata } from "next";
import React from "react";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PricingSection, FaqSection } from "@/components/marketing/MarketingSections";
import {
  graph,
  organizationSchema,
  softwareApplicationSchema,
  breadcrumbSchema,
  faqSchema,
  PLANS,
  SITE_URL,
} from "@/lib/seo";

/**
 * /pricing previously 404'd. Publishing prices is the single biggest
 * conversion fix for a self-serve tool, and an indexable pricing page with
 * Offer schema is what lets an answer engine quote what PulseFlow costs.
 *
 * Amounts here come from lib/seo PLANS, which mirrors the Paystack charges
 * in PricingModal. Change one, change the other.
 */

export const metadata: Metadata = {
  title: "Pricing — free AI visibility audit, then $49/mo",
  description:
    "PulseFlow AEO pricing: free multi-engine citation audits, Pro at $49/month for continuous tracking and competitor benchmarking, Agency at $149/month for unlimited audits and white-label reports.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    url: `${SITE_URL}/pricing`,
    title: "PulseFlow AEO pricing — start free, Pro from $49/month",
    description:
      "Every plan covers ChatGPT, Perplexity, Claude and Google AI Overviews. No per-engine upsell.",
  },
};

export default function PricingPage() {
  const lowest = Math.min(...PLANS.map((p) => p.priceUSD));
  const highest = Math.max(...PLANS.map((p) => p.priceUSD));

  const jsonLd = graph(
    organizationSchema(),
    softwareApplicationSchema(),
    faqSchema(),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
    {
      "@type": "Product",
      "@id": `${SITE_URL}/pricing#product`,
      name: "PulseFlow AEO",
      description:
        "Answer Engine Optimization platform measuring brand share of voice across ChatGPT, Perplexity, Claude and Google AI Overviews.",
      brand: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: String(lowest),
        highPrice: String(highest),
        offerCount: PLANS.length,
        url: `${SITE_URL}/pricing`,
        availability: "https://schema.org/InStock",
      },
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
        <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600">
              <li>
                <Link href="/" className="transition hover:text-slate-400">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-400">Pricing</li>
            </ol>
          </nav>

          <div className="flex max-w-3xl flex-col gap-5">
            <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
              <span aria-hidden="true" className="h-px w-6 bg-indigo-500" />
              Pricing
            </p>
            <h1 className="text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl">
              Start free. Pay when you&apos;re tracking.
            </h1>
            <p className="max-w-[56ch] text-lg leading-relaxed text-slate-400">
              Every plan covers all four answer engines — ChatGPT Search,
              Perplexity, Claude and Google AI Overviews. There is no per-engine
              upsell; audit volume is the only thing that scales.
            </p>
          </div>
        </div>

        <PricingSection heading={false} />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
