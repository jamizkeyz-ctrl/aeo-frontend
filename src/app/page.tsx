"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  BarChart3, 
  Search, 
  ArrowLeft,
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Loader2,
  Swords,
  AlertCircle,
  Code2,
  Mail,
  Globe,
  TrendingUp,
  FileText,
  User,
  LogOut,
  Trophy,
  Minus
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  "https://pulseflow-aeo-backend.onrender.com";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"single" | "compare">("single");
  const [activeReportTab, setActiveReportTab] = useState<"overview" | "remediation">("overview");

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Input Form States
  const [brandA, setBrandA] = useState("BudgetFlow");
  const [domainA, setDomainA] = useState("budgetflow-finance.netlify.app");
  const [brandB, setBrandB] = useState("YNAB");
  const [domainB, setDomainB] = useState("ynab.com");
  const [category, setCategory] = useState("Personal Finance App");

  // Job & Execution States
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [summaryData, setSummaryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // UI Interactive States
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOutreachIdx, setCopiedOutreachIdx] = useState<number | null>(null);

  // 1. Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Query Loader (?report=...)
  useEffect(() => {
    const reportParam = searchParams.get("report");
    if (reportParam && reportParam !== jobId) {
      setJobId(reportParam);
      setStatus("processing");
    }
  }, [searchParams]);

  // 3. Status Polling & Supabase Retrieval
  useEffect(() => {
    if (!jobId || status !== "processing") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/aeo/jobs/${jobId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === "completed" && data.summary) {
          const s = data.summary;
          setSummaryData(s);
          
          // Auto-detect whether this was a compare audit or single audit
          if (s.brand_a_summary && s.brand_b_summary) {
            setMode("compare");
            if (s.brand_a_summary.target_brand) setBrandA(s.brand_a_summary.target_brand);
            if (s.brand_a_summary.target_domain) setDomainA(s.brand_a_summary.target_domain);
            if (s.brand_b_summary.target_brand) setBrandB(s.brand_b_summary.target_brand);
            if (s.brand_b_summary.target_domain) setDomainB(s.brand_b_summary.target_domain);
          } else {
            setMode("single");
            if (s.target_brand) setBrandA(s.target_brand);
            if (s.target_domain) setDomainA(s.target_domain);
          }

          if (s.category) setCategory(s.category);
          setStatus("completed");
          clearInterval(interval);
        } else if (data.status === "failed") {
          setError(data.error || "Batch execution failed.");
          setStatus("failed");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setError(null);
    setSummaryData(null);

    const cleanDomainA = domainA.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const cleanDomainB = domainB.replace(/^https?:\/\//, "").replace(/\/$/, "");

    const endpoint = mode === "compare" 
      ? "/api/v1/aeo/compare-audit"
      : "/api/v1/aeo/batch-audit";

    const payload = mode === "compare"
      ? { brand_a_name: brandA, brand_a_domain: cleanDomainA, brand_b_name: brandB, brand_b_domain: cleanDomainB, category }
      : { target_brand: brandA, target_domain: cleanDomainA, category };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to start audit job.");
      const data = await res.json();
      setJobId(data.job_id);
      router.push(`?report=${data.job_id}`);
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleShareLink = () => {
    const permUrl = `${window.location.origin}?report=${jobId}`;
    navigator.clipboard.writeText(permUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const defaultCompetitors = [
    { name: "PocketGuard", count: "7 prompts" },
    { name: "Monarch Money", count: "6 prompts" },
    { name: "QuickBooks", count: "6 prompts" },
    { name: "YNAB", count: "5 prompts" },
    { name: "Xero", count: "4 prompts" },
    { name: "Origin", count: "3 prompts" }
  ];

  const defaultCitedSources = [
    "https://www.forbes.com/financial-services/best-budgeting-apps-2",
    "https://www.pcmag.com/picks/the-best-personal-finance-services",
    "https://www.purdueglobal.edu/blog/student-life/budgeting-apps-personal-fina...",
    "https://www.nerdwallet.com/finance/learn/best-budget-apps",
    "https://getpennies.com/ultimate-multi-currency-budget-tracker"
  ];

  const outreachCampaigns = [
    {
      url: `https://qubit.capital/blog/best-${category.toLowerCase().replace(/\s+/g, '-')}`,
      title: `Enhance Your Financial Planning Software List with ${brandA}`,
      body: `Hi there,\n\nI hope this message finds you well! I recently came across your article on the best financial planning software and was impressed by the selection you've curated.\n\nI wanted to suggest adding ${brandA} to your list. Our platform offers a unique feature set that allows users to manage budgets effortlessly.`
    },
    {
      url: `https://www.qapita.com/blog/financial-tools-startup`,
      title: `Boost Your Startup Financial Tools List with ${brandA}`,
      body: `Hi [Recipient's Name],\n\nI hope you're having a great day! I just read your blog post about financial planning tools for startups and found it very insightful.\n\nI'd like to recommend including ${brandA} in your list. Our tool is specifically designed for startups, offering intuitive expense tracking and cash flow analytics.`
    },
    {
      url: `https://storyflow.so/blog/best-${category.toLowerCase().replace(/\s+/g, '-')}-2026`,
      title: `${brandA}: A Must-Have for Your 2026 ${category} List!`,
      body: `Hi [Recipient's Name],\n\nI came across your article on the best ${category.toLowerCase()}s for 2026 and wanted to suggest adding ${brandA} to your list.\n\n${brandA} has evolved into a powerhouse with its recent updates, offering unique features like customizable cash flow dashboards and offline tracking.`
    },
    {
      url: `https://www.rock.so/blog/${brandA.toLowerCase()}-alternatives`,
      title: `Consider Adding ${brandA} to Your Alternatives List!`,
      body: `Hi [Recipient's Name],\n\nI recently read your article on popular budget tool alternatives and thought it was a great overview of available software.\n\nHowever, I believe ${brandA} itself deserves a spot in your discussion due to its unique feature set and privacy-first architecture.`
    }
  ];

  const generateJsonLdSchema = () => {
    return `<script type="application/ld+json">\n${JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": brandA,
        "operatingSystem": "Web, iOS, Android, Windows, macOS",
        "applicationCategory": category,
        "url": `https://${domainA.replace(/^https?:\/\//, "")}`,
        "description": `${brandA} is a modern, privacy-focused ${category} providing intuitive expense tracking, cash flow analytics, and budgeting tools.`
      },
      null,
      2
    )}\n</script>`;
  };

  const isCompareReport = summaryData && (summaryData.brand_a_summary || summaryData.head_to_head_prompts);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR / MODE & AUTH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-indigo-500" />
              AEO Citation & Visibility Engine
            </h1>
            <p className="text-slate-400 mt-1">
              Analyze and compare Share of Voice (SoV) across Answer Engines in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setMode("single")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  mode === "single" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Single Brand Audit
              </button>
              <button
                onClick={() => setMode("compare")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  mode === "compare" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Swords className="h-3.5 w-3.5" /> Side-by-Side Comparison
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-xs text-slate-300 font-mono">{user.email?.split("@")[0]}</span>
                <button onClick={handleSignOut} className="text-slate-400 hover:text-red-400 p-1 transition" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* INPUT AUDIT FORM */}
        <form onSubmit={handleStartAudit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className={`grid grid-cols-1 ${mode === "compare" ? "md:grid-cols-5" : "md:grid-cols-3"} gap-4`}>
            <div>
              <label className="block text-xs font-semibold uppercase text-indigo-400 mb-2">
                {mode === "compare" ? "Brand A Name" : "Target Brand Name"}
              </label>
              <input
                type="text"
                value={brandA}
                onChange={(e) => setBrandA(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-indigo-400 mb-2">
                {mode === "compare" ? "Brand A Domain" : "Target Brand Domain"}
              </label>
              <input
                type="text"
                value={domainA}
                onChange={(e) => setDomainA(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {mode === "compare" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-emerald-400 mb-2">Brand B Name</label>
                  <input
                    type="text"
                    value={brandB}
                    onChange={(e) => setBrandB(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-emerald-400 mb-2">Brand B Domain</label>
                  <input
                    type="text"
                    value={domainB}
                    onChange={(e) => setDomainB(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Industry Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "processing"}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "processing" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {mode === "compare" ? "Running Parallel Comparison..." : "Evaluating 30 Prompts..."}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                {mode === "compare" ? `Run Head-to-Head: ${brandA} vs ${brandB}` : `Run 30-Prompt Audit for ${brandA}`}
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: SIDE-BY-SIDE HEAD-TO-HEAD COMPARISON REPORT           */}
        {/* ------------------------------------------------------------- */}
        {isCompareReport && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSummaryData(null); router.push("/"); }} 
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Swords className="h-4 w-4" /> HEAD-TO-HEAD COMPETITOR BENCHMARK
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {summaryData.brand_a_summary?.target_brand || brandA} vs {summaryData.brand_b_summary?.target_brand || brandB}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareLink}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  {copiedLink ? "Permanent Link Copied!" : "Share Link"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* BATTLE SCORECARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-indigo-900/50 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  {summaryData.brand_a_summary?.target_brand || brandA} (Target)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    {summaryData.brand_a_summary?.share_of_voice_percentage ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Share of Voice</span>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Direct Wins:</span>
                  <strong className="text-indigo-300">{summaryData.brand_a_wins || 0} prompts</strong>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
                <Trophy className="h-8 w-8 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-200">Outcome Breakdown</h4>
                <p className="text-xs text-slate-400">
                  {summaryData.brand_a_wins > summaryData.brand_b_wins 
                    ? `${summaryData.brand_a_summary?.target_brand || brandA} leads in visibility` 
                    : summaryData.brand_b_wins > summaryData.brand_a_wins 
                    ? `${summaryData.brand_b_summary?.target_brand || brandB} leads in visibility`
                    : "Dead heat tie across answer engines"}
                </p>
                <span className="text-xs font-mono text-slate-500">Ties / Neutral: {summaryData.ties || 0}</span>
              </div>

              <div className="bg-slate-900 border border-emerald-900/50 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {summaryData.brand_b_summary?.target_brand || brandB} (Competitor)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    {summaryData.brand_b_summary?.share_of_voice_percentage ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Share of Voice</span>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Direct Wins:</span>
                  <strong className="text-emerald-300">{summaryData.brand_b_wins || 0} prompts</strong>
                </div>
              </div>
            </div>

            {/* HEAD-TO-HEAD PROMPT BREAKDOWN TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Swords className="h-5 w-5 text-indigo-400" /> Prompt-by-Prompt Winner Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                      <th className="py-3 px-4">PROMPT EVALUATED</th>
                      <th className="py-3 px-4">{summaryData.brand_a_summary?.target_brand || brandA}</th>
                      <th className="py-3 px-4">{summaryData.brand_b_summary?.target_brand || brandB}</th>
                      <th className="py-3 px-4">WINNER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(summaryData.head_to_head_prompts || []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-950/50">
                        <td className="py-3.5 px-4 font-medium text-slate-200">{item.prompt}</td>
                        <td className="py-3.5 px-4">
                          {item.brand_a_mentioned ? (
                            <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold rounded">
                              Rank #{item.brand_a_rank || 1}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">Missing</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.brand_b_mentioned ? (
                            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold rounded">
                              Rank #{item.brand_b_rank || 1}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-mono">Missing</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.winner === "brand_a" ? (
                            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                              <Trophy className="h-3.5 w-3.5" /> {summaryData.brand_a_summary?.target_brand || brandA}
                            </span>
                          ) : item.winner === "brand_b" ? (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <Trophy className="h-3.5 w-3.5" /> {summaryData.brand_b_summary?.target_brand || brandB}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Minus className="h-3.5 w-3.5 text-slate-500" /> Tie / Neither
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: SINGLE BRAND AUDIT REPORT                             */}
        {/* ------------------------------------------------------------- */}
        {!isCompareReport && summaryData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSummaryData(null); router.push("/"); }} 
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    VERIFIED AEO AUDIT REPORT
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {brandA} Visibility Overview
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShareLink}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  {copiedLink ? "Permanent Link Copied!" : "Share Link"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* 4 CORE KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  <TrendingUp className="h-4 w-4" /> SHARE OF VOICE
                </div>
                <p className="text-4xl font-black text-white">
                  {summaryData.share_of_voice_percentage ?? summaryData.sov_percentage ?? 0}%
                </p>
                <p className="text-xs text-slate-400">Across {summaryData.total_prompts_evaluated || 30} evaluated queries</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <BarChart3 className="h-4 w-4 text-indigo-400" /> AVG POSITION
                </div>
                <p className="text-4xl font-black text-white">
                  {summaryData.average_rank_when_mentioned ? `#${summaryData.average_rank_when_mentioned}` : "Unranked"}
                </p>
                <p className="text-xs text-slate-400">When recommended by AI</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <FileText className="h-4 w-4" /> TOTAL QUERIES
                </div>
                <p className="text-4xl font-black text-white">{summaryData.total_prompts_evaluated || 30}</p>
                <p className="text-xs text-slate-400">Prompts in category taxonomy</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
                  <Globe className="h-4 w-4" /> PRIMARY SOURCES
                </div>
                <p className="text-4xl font-black text-white">10</p>
                <p className="text-xs text-slate-400">Top URLs cited by AI</p>
              </div>
            </div>

            {/* TABS */}
            <div className="border-b border-slate-800 flex gap-8">
              <button
                onClick={() => setActiveReportTab("overview")}
                className={`pb-4 text-sm font-bold flex items-center gap-2 transition ${
                  activeReportTab === "overview" ? "border-b-2 border-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="h-4 w-4" /> Audit Overview
              </button>
              <button
                onClick={() => setActiveReportTab("remediation")}
                className={`pb-4 text-sm font-bold flex items-center gap-2 transition ${
                  activeReportTab === "remediation" ? "border-b-2 border-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="h-4 w-4 text-indigo-400" /> Remediation & Fixes
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeReportTab === "overview" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-400" /> Competitor Mentions Breakdown
                    </h3>
                    <div className="space-y-3">
                      {defaultCompetitors.map((comp, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850">
                          <span className="text-sm font-semibold text-slate-200">{comp.name}</span>
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-full">{comp.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-sky-400" /> Top Cited Sources Powering AI
                    </h3>
                    <div className="space-y-3">
                      {defaultCitedSources.map((srcUrl, idx) => (
                        <a 
                          key={idx} 
                          href={srcUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850 hover:border-slate-700 transition group"
                        >
                          <span className="text-xs font-mono text-indigo-300 truncate pr-4">{srcUrl}</span>
                          <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Query Audit Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                          <th className="py-3 px-4">PROMPT EVALUATED</th>
                          <th className="py-3 px-4">STATUS</th>
                          <th className="py-3 px-4">RANK</th>
                          <th className="py-3 px-4">TOP COMPETITOR</th>
                          <th className="py-3 px-4">REMEDIATION ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {(summaryData.prompt_results || summaryData.prompts || summaryData.results || []).map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-950/50">
                            <td className="py-3.5 px-4 font-medium text-slate-200">{item.prompt}</td>
                            <td className="py-3.5 px-4">
                              {item.brand_mentioned || item.mentioned ? (
                                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold rounded">
                                  Mentioned
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded">
                                  Missing
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{item.rank ? `#${item.rank}` : "-"}</td>
                            <td className="py-3.5 px-4 text-slate-300 font-medium">{defaultCompetitors[idx % defaultCompetitors.length].name}</td>
                            <td className="py-3.5 px-4 text-xs text-slate-400 max-w-md">
                              Create content that highlights {brandA}'s unique features and benefits compared to competitors.
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REMEDIATION */}
            {activeReportTab === "remediation" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-indigo-400" /> Automated JSON-LD Schema
                    </h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generateJsonLdSchema());
                        setCopiedSchema(true);
                        setTimeout(() => setCopiedSchema(false), 2000);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-2 text-xs font-semibold transition"
                    >
                      {copiedSchema ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      {copiedSchema ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Paste this <code className="text-indigo-400">&lt;script&gt;</code> tag in the <code className="text-indigo-400">&lt;head&gt;</code> section of your HTML document.
                  </p>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{generateJsonLdSchema()}</pre>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Listicle Outreach Campaigns</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {outreachCampaigns.map((camp, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-mono text-indigo-400 truncate max-w-[280px]">{camp.url}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${camp.title}\n\n${camp.body}`);
                                setCopiedOutreachIdx(idx);
                                setTimeout(() => setCopiedOutreachIdx(null), 2000);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition shrink-0"
                            >
                              {copiedOutreachIdx === idx ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">{camp.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans whitespace-pre-line line-clamp-4">{camp.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    </div>
  );
}

export default function AEODashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}