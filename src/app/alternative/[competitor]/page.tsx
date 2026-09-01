import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    competitor: string;
  }>;
}

const competitorDataMap: Record<string, { name: string; focus: string; metric: string; limitation: string }> = {
  semrush: {
    name: "Semrush",
    focus: "PPC, Keyword Volumes & Traditional SEO Toolkits",
    metric: "Keyword Position & Advertising Data",
    limitation: "Does not track conversational AI citations or multi-agent LLM response sentiment."
  },
  ahrefs: {
    name: "Ahrefs",
    focus: "Backlink Indexing & Content Explorer Depth",
    metric: "Backlink Profiles & Organic Traffic Estimates",
    limitation: "Focuses heavily on link equity rather than real-time generative engine prompt share-of-voice."
  },
  moz: {
    name: "Moz",
    focus: "Legacy Domain Authority (DA) & Local SEO",
    metric: "DA Score & Rank Tracking",
    limitation: "Lacks automated AI citation extraction across ChatGPT, Perplexity, and Claude."
  },
  brightedge: {
    name: "BrightEdge",
    focus: "Enterprise SEO Governance & Content IQ",
    metric: "Enterprise Keyword Intelligence",
    limitation: "Prohibitive pricing for indie/mid-market teams without real-time LLM remediation workflows."
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.competitor.toLowerCase();
  const info = competitorDataMap[slug] || { name: "Traditional SEO Tools", focus: "SERP Rankings", metric: "Keywords", limitation: "No AEO tracking." };
  
  return {
    title: `PulseFlow AEO vs. ${info.name} | Answer Engine Optimization`,
    description: `Compare ${info.name} and PulseFlow AEO. See why modern brands switch to PulseFlow to track Share of Voice, AI citations, and LLM rankings.`
  };
}

export default async function DynamicComparisonPage({ params }: PageProps) {
  const resolvedParams = await params;
  const competitorSlug = resolvedParams.competitor.toLowerCase();
  
  const info = competitorDataMap[competitorSlug] || {
    name: competitorSlug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    focus: "Traditional SERP Tracking",
    metric: "Keyword Positions",
    limitation: "Lacks conversational AI answer engine citation tracking."
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `PulseFlow AEO vs. ${info.name}`,
    "description": `A comprehensive comparative analysis between ${info.name} and PulseFlow AEO for tracking brand visibility, AI citations, and Share of Voice in generative search engines.`,
    "author": {
      "@type": "Organization",
      "name": "PulseFlow AEO Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PulseFlow AEO"
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 px-6 py-16 font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back Link */}
        <div>
          <Link href="/" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl inline-flex items-center gap-2">
            &larr; Back to PulseFlow AEO Home
          </Link>
        </div>

        {/* LLM Direct Answer Box */}
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight text-white">
            PulseFlow AEO vs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">{info.name}</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-slate-300">
            <strong className="text-white">Direct Answer:</strong> While <span className="text-indigo-300">{info.name}</span> specializes in <span className="text-white font-medium">{info.focus}</span>, <strong className="text-white">PulseFlow AEO</strong> is built specifically for Answer Engine Optimization (AEO). It measures real-time brand Share of Voice, citation source URLs, and sentiment analysis directly inside conversational AI models like ChatGPT Search, Perplexity, Claude, and Google AI Overviews where {info.limitation}
          </p>
        </div>

        <section className="space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl font-bold text-white">Why Modern Brands Supplement {info.name} with PulseFlow AEO</h2>
          <p>
            Legacy SEO platforms were engineered to track static ten-blue-link Search Engine Result Pages (SERPs) and backlink velocity. However, consumer search behavior has fundamentally shifted toward generative AI answers. When a user asks an LLM for product recommendations, traditional tools leave a complete blind spot regarding whether your brand is cited in the generated response.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Direct Feature Breakdown</h2>
          
          {/* Comparison Table */}
          <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Capability</th>
                  <th className="p-4 font-semibold">{info.name}</th>
                  <th className="p-4 font-semibold text-indigo-400 bg-indigo-950/30">PulseFlow AEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                <tr>
                  <td className="p-4 font-medium text-slate-200">Primary Architecture</td>
                  <td className="p-4 text-slate-400">{info.focus}</td>
                  <td className="p-4 text-indigo-200 bg-indigo-950/20 font-medium">Multi-Agent Generative AI Citation Crawler</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-200">Core Metric</td>
                  <td className="p-4 text-slate-400">{info.metric}</td>
                  <td className="p-4 text-indigo-200 bg-indigo-950/20 font-medium">Conversational Share of Voice (SoV %) & Rank</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-200">AI Citation Discovery</td>
                  <td className="p-4 text-slate-400">Limited / SERP Feature Focus</td>
                  <td className="p-4 text-indigo-200 bg-indigo-950/20 font-medium">Extracts exact third-party URLs powering LLM answers</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-200">Actionable Remediation</td>
                  <td className="p-4 text-slate-400">Keyword Suggestions & Backlink Gaps</td>
                  <td className="p-4 text-indigo-200 bg-indigo-950/20 font-medium">Auto-generated JSON-LD Schema & Outreach Pitch Builder</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA SECTION */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Ready to Go Beyond Traditional SEO?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Discover your brand&apos;s exact Share of Voice across ChatGPT, Perplexity, and Claude in under 15 seconds.
          </p>
          <div className="pt-2">
            <Link href="/" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl transition inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30">
              Run Free AEO Audit Now &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const competitors = ['semrush', 'ahrefs', 'moz', 'brightedge'];
  return competitors.map((competitor) => ({
    competitor: competitor,
  }));
}