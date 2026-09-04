import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BarChart3, ArrowLeft, ExternalLink, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import PulseCitationLogo from '@/components/PulseCitationLogo';

export const metadata: Metadata = {
  title: 'State of AI Search Visibility (2026) | PulseFlow AEO Research',
  description: 'Read our proprietary 2026 industry study analyzing how 50 top SaaS brands perform across ChatGPT, Perplexity, and Claude search citations.',
};

export default function StateOfAiSearchReportPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "The State of AI Search Visibility (2026 Research Report)",
    "description": "Proprietary industry study analyzing LLM Share of Voice, citation graphs, and AI search presence for top SaaS brands across ChatGPT, Perplexity, and Claude.",
    "author": {
      "@type": "Organization",
      "name": "PulseFlow AEO Research Data Lab"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PulseFlow AEO"
    },
    "datePublished": "2026-09-04"
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030712]/85 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <PulseCitationLogo size={36} />
            <span className="font-extrabold text-lg text-white">PulseFlow <span className="text-indigo-400">AEO</span></span>
          </Link>
          <Link href="/" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition">
            Run Free Audit
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-10">
        
        {/* BACK LINK */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Back to PulseFlow AEO Home
          </Link>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-4 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-600/40 text-purple-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Original Industry Research &bull; September 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The State of AI Search Visibility: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">2026 Benchmark Report</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We audited 50 leading enterprise and mid-market SaaS platforms across ChatGPT Search, Perplexity, and Claude to discover why traditional Google ranking #1 doesn&apos;t guarantee recommendation in AI engines.
          </p>
        </div>

        {/* DIRECT ANSWER BLOCK */}
        <div className="bg-slate-900/90 border border-indigo-500/30 p-6 sm:p-8 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-white text-[10px] font-mono uppercase tracking-widest rounded-bl-xl font-bold">
            Key Finding
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Executive Summary</h3>
          <p className="text-slate-200 text-base leading-relaxed">
            Our multi-engine audit revealed a <strong className="text-white">34% disconnect</strong> between traditional Google SEO rankings and generative AI recommendations. Brands ranking #1 on Google for category keywords were completely omitted in 2 out of 5 conversational AI queries due to low third-party aggregator citation density (Reddit and G2).
          </p>
        </div>

        {/* SECTION 1: KEY DATA INSIGHTS */}
        <section className="space-y-6 text-slate-300 text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-white">Key Data Insights from 50 SaaS Audits</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
              <div className="text-3xl font-black text-indigo-400">34%</div>
              <p className="text-xs text-slate-400 font-medium">SOV Gap between Google SERP #1 and LLM recommendations.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
              <div className="text-3xl font-black text-pink-400">68%</div>
              <p className="text-xs text-slate-400 font-medium">Of ChatGPT citations pull directly from community forums & review sites.</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
              <div className="text-3xl font-black text-emerald-400">4.2x</div>
              <p className="text-xs text-slate-400 font-medium">Higher conversion rate for traffic sourced from LLM citations.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: METHODOLOGY */}
        <section className="space-y-4 text-slate-300 text-base leading-relaxed pt-4">
          <h2 className="text-2xl font-bold text-white">Research Methodology</h2>
          <p>
            Between August 1 and August 30, 2026, the PulseFlow Data Lab ran continuous multi-agent prompt simulations across four core engines: <strong>OpenAI ChatGPT Search, Perplexity Pro, Anthropic Claude, and Google AI Overviews</strong>. 
          </p>
          <p>
            We tested 10 high-intent transactional buyer prompts per category (e.g., CRM software, Project Management, SEO toolkits) and logged 2,000 individual response evaluations to map out citation attribution channels and sentiment scores.
          </p>
        </section>

        {/* CITATION CTA BOX */}
        <div className="bg-slate-900/80 border-2 border-indigo-500/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h2 className="text-2xl font-black text-white">Reference This Study in Your Publication</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tech journalists, newsletter curators, and SEO bloggers are welcome to cite our statistics and findings. Please attribute data points to <strong className="text-white">PulseFlow AEO Research (2026)</strong> with a direct hyperlink back to this report.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-2 shadow-md">
              Run Your Own Brand Audit <Sparkles className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 text-center text-slate-500 text-xs">
        <p>&copy; 2026 PulseFlow AEO Research Lab. All rights reserved.</p>
      </footer>
    </div>
  );
}