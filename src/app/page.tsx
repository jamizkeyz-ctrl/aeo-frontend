"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Globe, 
  Layers, 
  Loader2,
  Swords,
  Trophy,
  Minus,
  Code2,
  Send,
  Download,
  Share2,
  ShieldCheck,
  Wrench,
  FileText,
  Copy,
  Check
} from "lucide-react";

// Robust API Base URL resolution with fallback
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  "https://pulseflow-aeo-backend.onrender.com";

export default function AEODashboard() {
  const [mode, setMode] = useState<"single" | "compare">("single");

  // Form Inputs
  const [brandA, setBrandA] = useState("BudgetFlow");
  const [domainA, setDomainA] = useState("budgetflow-finance.netlify.app");
  const [brandB, setBrandB] = useState("YNAB");
  const [domainB, setDomainB] = useState("ynab.com");
  const [category, setCategory] = useState("Personal Finance App");

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [summaryData, setSummaryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // UI Interactive States
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeRemediationTab, setActiveRemediationTab] = useState<"schema" | "outreach">("schema");

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
      ? {
          brand_a_name: brandA,
          brand_a_domain: cleanDomainA,
          brand_b_name: brandB,
          brand_b_domain: cleanDomainB,
          category: category,
        }
      : {
          target_brand: brandA,
          target_domain: cleanDomainA,
          category: category,
        };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to start audit job.");
      const data = await res.json();
      setJobId(data.job_id);
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (!jobId || status !== "processing") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/aeo/jobs/${jobId}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data.status === "completed" && data.summary) {
          setSummaryData(data.summary);
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

  // Helper JSON-LD Schema Generator
  const generateJsonLdSchema = () => {
    return JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": brandA,
        "operatingSystem": "Web, iOS, Android",
        "applicationCategory": "FinanceApplication",
        "url": `https://${domainA.replace(/^https?:\/\//, "")}`,
        "description": `${brandA} is a top-rated ${category} providing intuitive expense tracking, cash flow analytics, and budgeting tools.`,
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "USD"
        }
      },
      null,
      2
    );
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generateJsonLdSchema());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleShareLink = () => {
    if (jobId) {
      navigator.clipboard.writeText(`${window.location.origin}?report=${jobId}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleExportCSV = () => {
    if (!summaryData) return;
    const prompts = summaryData.prompt_results || summaryData.prompts || summaryData.results || [];
    let csvContent = "data:text/csv;charset=utf-8,Prompt,Mentioned,Rank\n";
    prompts.forEach((p: any) => {
      csvContent += `"${p.prompt.replace(/"/g, '""')}",${p.brand_mentioned ? "Yes" : "No"},${p.rank || "N/A"}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${brandA}_AEO_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
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

          {/* MODE TOGGLE */}
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
        </div>

        {/* INPUT AUDIT FORM */}
        <form onSubmit={handleStartAudit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className={`grid grid-cols-1 ${mode === "compare" ? "md:grid-cols-5" : "md:grid-cols-3"} gap-4`}>
            
            {/* BRAND A */}
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

            {/* BRAND B (COMPARE MODE ONLY) */}
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

            {/* CATEGORY */}
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
                {mode === "compare" ? "Running Parallel Head-to-Head Evaluation..." : "Evaluating 30 Prompts..."}
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                {mode === "compare" ? `Run Head-to-Head: ${brandA} vs ${brandB}` : `Run 30-Prompt Audit for ${brandA}`}
              </>
            )}
          </button>
        </form>

        {/* ERROR ALERT */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* SINGLE BRAND AUDIT RESULTS */}
        {mode === "single" && summaryData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* AUDIT OVERVIEW & VERIFIED REPORT HEADER */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Verified AEO Audit Report</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-800">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Target: <span className="text-slate-200 font-mono">{brandA}</span> ({domainA})
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS: SHARE & EXPORT */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleShareLink}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-2"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  {copiedLink ? "Link Copied!" : "Share Report"}
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV Report
                </button>
              </div>
            </div>

            {/* KPI SCORECARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Share of Voice (SoV)</span>
                <p className="text-3xl font-extrabold text-indigo-400">
                  {summaryData.share_of_voice_percentage ?? summaryData.sov_percentage ?? 0}%
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Brand Mentions</span>
                <p className="text-3xl font-extrabold text-white">
                  {summaryData.mentions_count ?? summaryData.total_mentions ?? 0} / {summaryData.total_prompts_evaluated ?? 27}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Average Rank</span>
                <p className="text-3xl font-extrabold text-white">
                  #{summaryData.average_rank_when_mentioned ?? summaryData.avg_rank ?? "N/A"}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Prompts Evaluated</span>
                <p className="text-3xl font-extrabold text-white">
                  {summaryData.total_prompts_evaluated ?? 27}
                </p>
              </div>
            </div>

            {/* REMEDIATION & FIXES SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">AEO Remediation & Fixes Package</h3>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveRemediationTab("schema")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                      activeRemediationTab === "schema" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Automated JSON-LD Schema
                  </button>
                  <button
                    onClick={() => setActiveRemediationTab("outreach")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                      activeRemediationTab === "outreach" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Listicle Outreach Campaigns
                  </button>
                </div>
              </div>

              {/* TAB 1: AUTOMATED JSON-LD SCHEMA */}
              {activeRemediationTab === "schema" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Inject this structured JSON-LD schema into the <code className="text-indigo-400">&lt;head&gt;</code> of <span className="text-slate-200">{domainA}</span> to help Answer Engines (ChatGPT, Claude, Perplexity) correctly identify and cite your software entity.
                  </p>
                  <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
                    <button
                      onClick={handleCopySchema}
                      className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5 text-xs transition"
                    >
                      {copiedSchema ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedSchema ? "Copied!" : "Copy Code"}
                    </button>
                    <pre>{generateJsonLdSchema()}</pre>
                  </div>
                </div>
              )}

              {/* TAB 2: LISTICLE OUTREACH CAMPAIGNS */}
              {activeRemediationTab === "outreach" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Answer engines cite top domain listicles in the <span className="text-slate-200">{category}</span> niche. Use these pre-generated publisher pitches to secure backlink inclusion:
                  </p>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
                      <span>Publisher Pitch Template</span>
                      <span className="text-indigo-400">Category: {category}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded border border-slate-850">
                      Subject: Feature Update: Adding {brandA} to your best {category} roundup<br /><br />
                      Hi Editor,<br /><br />
                      I came across your list of top {category} solutions and loved your breakdown. We recently launched {brandA} ({domainA}), an intuitive finance application focused on clean tracking and privacy.<br /><br />
                      Would you be open to adding {brandA} as an alternative on your list? Happy to provide a complimentary demo account or answer any questions.<br /><br />
                      Best regards,<br />
                      The {brandA} Team
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* DETAILED PROMPT BREAKDOWN TABLE */}
            {(summaryData.prompt_results || summaryData.prompts || summaryData.results) && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">27-Prompt Audit Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                        <th className="py-3 px-4">Prompt Evaluated</th>
                        <th className="py-3 px-4">Mention Status</th>
                        <th className="py-3 px-4">Rank Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(summaryData.prompt_results || summaryData.prompts || summaryData.results).map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-950/50">
                          <td className="py-3 px-4 font-medium text-slate-200">{item.prompt}</td>
                          <td className="py-3 px-4">
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
                          <td className="py-3 px-4 font-semibold text-white">
                            {item.rank ? `#${item.rank}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}