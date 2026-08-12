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
  Minus
} from "lucide-react";

export default function AEODashboard() {
  const [mode, setMode] = useState<"single" | "compare">("compare");

  // Form Inputs
  const [brandA, setBrandA] = useState("Notion");
  const [domainA, setDomainA] = useState("notion.so");
  const [brandB, setBrandB] = useState("Craft");
  const [domainB, setDomainB] = useState("craft.do");
  const [category, setCategory] = useState("Note Taking Software");

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [summaryData, setSummaryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setError(null);
    setSummaryData(null);

    const endpoint = mode === "compare" 
      ? "/api/v1/aeo/compare-audit"
      : "/api/v1/aeo/batch-audit";

    const payload = mode === "compare"
      ? {
          brand_a_name: brandA,
          brand_a_domain: domainA,
          brand_b_name: brandB,
          brand_b_domain: domainB,
          category: category,
        }
      : {
          target_brand: brandA,
          target_domain: domainA,
          category: category,
        };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aeo/jobs/${jobId}`);
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
              <label className="block text-xs font-semibold uppercase text-indigo-400 mb-2">Brand A Name</label>
              <input
                type="text"
                value={brandA}
                onChange={(e) => setBrandA(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-indigo-400 mb-2">Brand A Domain</label>
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
                {mode === "compare" ? `Run Head-to-Head: ${brandA} vs ${brandB}` : "Run 30-Prompt Audit"}
              </>
            )}
          </button>
        </form>

        {/* ERROR */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* COMPARISON RESULTS */}
        {mode === "compare" && summaryData && summaryData.head_to_head_prompts && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* COMPARISON KPI SCORECARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* BRAND A SCORECARD */}
              <div className="bg-slate-900 border-2 border-indigo-500/50 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-indigo-400">{summaryData.brand_a_summary.target_brand}</span>
                  <span className="px-3 py-1 bg-indigo-950 text-indigo-300 text-xs font-bold rounded-full">
                    {summaryData.brand_a_wins} Wins
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Share of Voice</span>
                    <p className="text-2xl font-extrabold text-white">{summaryData.brand_a_summary.share_of_voice_percentage}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Avg Rank</span>
                    <p className="text-2xl font-extrabold text-white">#{summaryData.brand_a_summary.average_rank_when_mentioned}</p>
                  </div>
                </div>
              </div>

              {/* VS BANNER */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <Trophy className="h-8 w-8 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Head-to-Head Leader</h3>
                <p className="text-sm font-semibold text-indigo-400">
                  {summaryData.brand_a_wins > summaryData.brand_b_wins 
                    ? `${summaryData.brand_a_summary.target_brand} Leads` 
                    : `${summaryData.brand_b_summary.target_brand} Leads`}
                </p>
                <span className="text-xs text-slate-500">{summaryData.ties} Shared Ties / Neither</span>
              </div>

              {/* BRAND B SCORECARD */}
              <div className="bg-slate-900 border-2 border-emerald-500/50 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-emerald-400">{summaryData.brand_b_summary.target_brand}</span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full">
                    {summaryData.brand_b_wins} Wins
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Share of Voice</span>
                    <p className="text-2xl font-extrabold text-white">{summaryData.brand_b_summary.share_of_voice_percentage}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Avg Rank</span>
                    <p className="text-2xl font-extrabold text-white">#{summaryData.brand_b_summary.average_rank_when_mentioned}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* HEAD-TO-HEAD PROMPT MATRIX TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">30-Prompt Head-to-Head Comparison Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                      <th className="py-3 px-4">Prompt Evaluated</th>
                      <th className="py-3 px-4">{summaryData.brand_a_summary.target_brand}</th>
                      <th className="py-3 px-4">{summaryData.brand_b_summary.target_brand}</th>
                      <th className="py-3 px-4">Query Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {summaryData.head_to_head_prompts.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-950/50">
                        <td className="py-3 px-4 font-medium text-slate-200">{item.prompt}</td>
                        <td className="py-3 px-4">
                          {item.brand_a_mentioned ? (
                            <span className="text-indigo-400 text-xs font-bold">
                              Rank #{item.brand_a_rank || 1}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">Missing</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.brand_b_mentioned ? (
                            <span className="text-emerald-400 text-xs font-bold">
                              Rank #{item.brand_b_rank || 1}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">Missing</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.winner === "brand_a" && (
                            <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 font-semibold text-xs rounded border border-indigo-800">
                              {summaryData.brand_a_summary.target_brand}
                            </span>
                          )}
                          {item.winner === "brand_b" && (
                            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 font-semibold text-xs rounded border border-emerald-800">
                              {summaryData.brand_b_summary.target_brand}
                            </span>
                          )}
                          {item.winner === "tie" && (
                            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 font-semibold text-xs rounded">
                              Tie
                            </span>
                          )}
                          {item.winner === "neither" && (
                            <span className="text-slate-600 text-xs">Neither Mentioned</span>
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

      </div>
    </div>
  );
}