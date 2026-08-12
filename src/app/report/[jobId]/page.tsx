"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Globe, 
  Layers, 
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ListFilter
} from "lucide-react";

// Import the RemediationTab component
import RemediationTab from "@/components/RemediationTab";

interface CompetitorMention {
  name: string;
  rank: number;
  key_reason: string;
}

interface CitationSource {
  url: string;
  source_type: string;
  supports_competitor: boolean;
  supports_target: boolean;
}

interface ExtractionReport {
  target_brand: string;
  prompt_evaluated: string;
  target_brand_mentioned: boolean;
  target_brand_rank: number | null;
  sentiment: string;
  competitors_mentioned: CompetitorMention[];
  citations: CitationSource[];
  remediation_actions: string[];
}

interface BatchSummary {
  target_brand: string;
  target_domain: string;
  category: string;
  total_prompts_evaluated: number;
  share_of_voice_percentage: number;
  average_rank_when_mentioned: number;
  competitor_mentions_summary: Record<string, number>;
  top_citation_urls: string[];
  individual_reports: ExtractionReport[];
}

interface JobResponse {
  job_id: string;
  status: "processing" | "completed" | "failed";
  summary: BatchSummary | null;
  error: string | null;
}

export default function ShareableReportPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for active tab: 'overview' or 'remediation'
  const [activeTab, setActiveTab] = useState<"overview" | "remediation">("overview");

  useEffect(() => {
    if (!jobId) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aeo/jobs/${jobId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Report not found. The ID may be invalid.");
          throw new Error("Failed to load audit report.");
        }

        const data: JobResponse = await res.json();
        
        if (data.status === "completed" && data.summary) {
          setSummary(data.summary);
        } else if (data.status === "processing") {
          setError("This report is still being evaluated. Please refresh in a few seconds.");
        } else {
          setError(data.error || "Failed to load audit report.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [jobId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Retrieving public AEO report...</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Report Unavailable</h2>
          <p className="text-sm text-slate-400">{error || "Could not locate report data."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition"
          >
            <ArrowLeft className="h-4 w-4" /> Run New Audit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans print:bg-white print:text-slate-900 print:p-0">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ACTION BAR (Hidden during Print/PDF Generation) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Verified AEO Audit Report</span>
              <h1 className="text-2xl font-bold text-white">{summary.target_brand} Visibility Overview</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm font-medium text-slate-200 flex items-center gap-2 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link Copied!" : "Share Link"}
            </button>
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition"
            >
              <Printer className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print:block mb-8">
          <h1 className="text-3xl font-bold">{summary.target_brand} — Answer Engine Optimization Audit</h1>
          <p className="text-slate-600 text-sm">Category: {summary.category} | Domain: {summary.target_domain}</p>
        </div>

        {/* METRICS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl print:border-slate-300 print:bg-slate-50">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2 print:text-slate-600">
              <TrendingUp className="h-4 w-4 text-emerald-400 print:text-emerald-600" /> Share of Voice
            </span>
            <p className="text-3xl font-extrabold text-white print:text-slate-900 mt-2">{summary.share_of_voice_percentage}%</p>
            <p className="text-xs text-slate-500 print:text-slate-600">Across {summary.total_prompts_evaluated} evaluated queries</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl print:border-slate-300 print:bg-slate-50">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2 print:text-slate-600">
              <BarChart3 className="h-4 w-4 text-indigo-400 print:text-indigo-600" /> Avg Position
            </span>
            <p className="text-3xl font-extrabold text-white print:text-slate-900 mt-2">
              {summary.average_rank_when_mentioned > 0 ? `#${summary.average_rank_when_mentioned}` : "Unranked"}
            </p>
            <p className="text-xs text-slate-500 print:text-slate-600">When recommended by AI</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl print:border-slate-300 print:bg-slate-50">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2 print:text-slate-600">
              <Layers className="h-4 w-4 text-amber-400 print:text-amber-600" /> Total Queries
            </span>
            <p className="text-3xl font-extrabold text-white print:text-slate-900 mt-2">{summary.total_prompts_evaluated}</p>
            <p className="text-xs text-slate-500 print:text-slate-600">Prompts in category taxonomy</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl print:border-slate-300 print:bg-slate-50">
            <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2 print:text-slate-600">
              <Globe className="h-4 w-4 text-sky-400 print:text-sky-600" /> Primary Sources
            </span>
            <p className="text-3xl font-extrabold text-white print:text-slate-900 mt-2">{summary.top_citation_urls.length}</p>
            <p className="text-xs text-slate-500 print:text-slate-600">Top URLs cited by AI</p>
          </div>
        </div>

        {/* NAVIGATION TABS (Hidden during Print) */}
        <div className="flex border-b border-slate-800 gap-8 print:hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
              activeTab === "overview"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListFilter className="h-4 w-4" /> Audit Overview
          </button>
          <button
            onClick={() => setActiveTab("remediation")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 transition border-b-2 ${
              activeTab === "remediation"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="h-4 w-4 text-indigo-400" /> Remediation & Fixes
          </button>
        </div>

        {/* TAB CONTENT 1: OVERVIEW */}
        {(activeTab === "overview" || typeof window === "undefined") && (
          <div className="space-y-8">
            {/* COMPETITORS & CITATIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* COMPETITORS */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 print:border-slate-300 print:bg-white">
                <h3 className="text-lg font-bold text-white print:text-slate-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" /> Competitor Mentions Breakdown
                </h3>
                <div className="divide-y divide-slate-800 print:divide-slate-200">
                  {Object.entries(summary.competitor_mentions_summary)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([comp, count]) => (
                      <div key={comp} className="py-3 flex justify-between items-center">
                        <span className="font-medium text-slate-200 print:text-slate-800">{comp}</span>
                        <span className="px-3 py-1 bg-slate-800 print:bg-slate-100 text-xs font-semibold text-slate-300 print:text-slate-700 rounded-full">
                          {count} prompts
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* CITATION SOURCES */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 print:border-slate-300 print:bg-white">
                <h3 className="text-lg font-bold text-white print:text-slate-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-400" /> Top Cited Sources Powering AI
                </h3>
                <div className="space-y-3">
                  {summary.top_citation_urls.slice(0, 6).map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-lg text-sm text-indigo-400 print:text-indigo-600 truncate flex items-center justify-between"
                    >
                      <span className="truncate">{url}</span>
                      <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0 print:hidden" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* FULL AUDIT BREAKDOWN TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 print:border-slate-300 print:bg-white">
              <h3 className="text-lg font-bold text-white print:text-slate-900">Query Audit Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600 uppercase text-xs">
                      <th className="py-3 px-4">Prompt Evaluated</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Top Competitor</th>
                      <th className="py-3 px-4">Remediation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                    {summary.individual_reports.map((report, idx) => (
                      <tr key={idx} className="hover:bg-slate-950/50 print:hover:bg-transparent">
                        <td className="py-3 px-4 font-medium text-slate-200 print:text-slate-800">{report.prompt_evaluated}</td>
                        <td className="py-3 px-4">
                          {report.target_brand_mentioned ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 print:text-emerald-700 text-xs font-semibold px-2 py-1 bg-emerald-950/50 print:bg-emerald-50 border border-emerald-800 print:border-emerald-300 rounded">
                              <CheckCircle2 className="h-3 w-3" /> Mentioned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 print:text-slate-600 text-xs font-semibold px-2 py-1 bg-slate-800 print:bg-slate-100 rounded">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-300 print:text-slate-700">
                          {report.target_brand_rank ? `#${report.target_brand_rank}` : "-"}
                        </td>
                        <td className="py-3 px-4 text-slate-400 print:text-slate-600 text-xs">
                          {report.competitors_mentioned[0]?.name || "None"}
                        </td>
                        <td className="py-3 px-4 text-slate-300 print:text-slate-700 text-xs">
                          {report.remediation_actions[0] || "Maintain current positioning"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: REMEDIATION TAB */}
        {activeTab === "remediation" && (
          <div className="print:hidden">
            <RemediationTab jobId={jobId} />
          </div>
        )}

      </div>
    </div>
  );
}