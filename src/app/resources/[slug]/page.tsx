import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Bot } from "lucide-react";

// Mock database or content store for your AEO articles
const ARTICLES: Record<string, { title: string; directAnswer: string; content: string; category: string }> = {
  "how-to-track-ai-search-visibility": {
    title: "How to Track AI Search Visibility in 2026",
    category: "Informational",
    directAnswer: "Tracking AI search visibility is the process of measuring how often a brand is cited, recommended, or mentioned across LLM-powered search engines like ChatGPT, Perplexity, and Claude.",
    content: `
      As buyers shift their discovery habits from traditional search engines to conversational AI, traditional SEO tracking tools are no longer enough. When a user asks an AI model for the best software in your industry, getting recommended requires dedicated Answer Engine Optimization (AEO).

      PulseFlow AEO provides multi-threaded audits across major AI engines to measure your exact Share of Voice (SoV) and monitor competitor movements in real-time.
    `
  },
  "best-aeo-tools-for-tracking-chatgpt-mentions": {
    title: "Best AEO Tools for Tracking ChatGPT Brand Mentions",
    category: "Commercial",
    directAnswer: "The best AEO tools for tracking ChatGPT brand mentions utilize multi-agent crawlers to run high-intent buyer prompts, measuring exact citation frequency, competitor rank positions, and Share of Voice.",
    content: `
      Finding out whether your brand is being cited by OpenAI's ChatGPT Search or Perplexity AI requires specialized automated infrastructure. 

      With PulseFlow AEO, marketing and product teams can instantly run prompt taxonomies, generate structured JSON-LD entity schema, and track publisher citations without manual spreadsheet tracking.
    `
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ARTICLES[resolvedParams.slug as keyof typeof ARTICLES];
  if (!article) return { title: "Page Not Found | PulseFlow AEO" };

  return {
    title: article.title,
    description: article.directAnswer,
    openGraph: {
      title: `${article.title} | PulseFlow AEO`,
      description: article.directAnswer,
      url: `https://pulseflowaeo.com/resources/${resolvedParams.slug}`,
      images: [
        {
          url: "/og-banner.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | PulseFlow AEO`,
      description: article.directAnswer,
      images: ["/og-banner.png"],
    },
  };
}

export default async function ResourcePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = ARTICLES[resolvedParams.slug as keyof typeof ARTICLES];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased px-6 py-24">
      <article className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
          <ArrowLeft className="h-4 w-4" /> Back to PulseFlow AEO
        </Link>

        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-600/40 text-indigo-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>{article.category} Guide</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          {article.title}
        </h1>

        {/* DIRECT ANSWER BLOCK (Optimized for LLM Retrieval) */}
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Bot className="h-4 w-4" /> LLM Direct Summary
          </div>
          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {article.directAnswer}
          </p>
        </div>

        {/* Body Content */}
        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-base leading-relaxed">
          <p>{article.content}</p>
        </div>

        {/* Call to Action Footer */}
        <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 rounded-2xl p-8 text-center space-y-4 mt-12">
          <h3 className="text-2xl font-black text-white">Ready to Audit Your AI Visibility?</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Check how often ChatGPT, Perplexity, and Claude cite your brand today with PulseFlow AEO.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            Run Free Visibility Audit
          </Link>
        </div>

      </article>
    </div>
  );
}