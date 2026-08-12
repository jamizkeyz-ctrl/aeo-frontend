"use client";

import React, { useState } from "react";
import { Code, Mail, Copy, Check, Sparkles, AlertCircle } from "lucide-react";

interface OutreachPitch {
  target_url: string;
  recipient_role: string;
  subject_line: string;
  email_body: string;
}

interface RemediationPackage {
  target_brand: string;
  target_domain: string; // Fixed 'str' to 'string'
  schema_markup: {
    json_ld_schema: string;
    implementation_guide: string;
  };
  outreach_campaigns: {
    outreach_pitches: OutreachPitch[];
  };
}

export default function RemediationTab({ jobId }: { jobId: string }) {
  const [data, setData] = useState<RemediationPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const fetchRemediation = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aeo/remediation/${jobId}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to generate remediation package.");
      }

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      console.error("Remediation error:", err);
      setErrorMessage(err.message || "An error occurred while generating fixes.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number | "schema") => {
    navigator.clipboard.writeText(text);
    if (index === "schema") {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (!data && !loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
        <Sparkles className="h-10 w-10 text-indigo-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Generate One-Click Remediation</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Automatically create structured JSON-LD schema markup and personalized outreach emails to win missing citation spots.
        </p>
        
        {errorMessage && (
          <div className="max-w-md mx-auto bg-red-950/50 border border-red-800 text-red-300 p-3 rounded-lg text-xs flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={fetchRemediation}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition shadow-lg shadow-indigo-600/20"
        >
          Generate Remediation Fixes
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 text-sm">Building JSON-LD schema & drafting editorial pitches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SCHEMA MARKUP SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-emerald-400" /> Automated JSON-LD Schema
          </h3>
          <button
            onClick={() => copyToClipboard(data?.schema_markup.json_ld_schema || "", "schema")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            {copiedSchema ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedSchema ? "Copied!" : "Copy Code"}
          </button>
        </div>
        <p className="text-xs text-slate-400">{data?.schema_markup.implementation_guide}</p>
        <pre className="bg-slate-950 p-4 rounded-lg text-xs text-indigo-300 overflow-x-auto border border-slate-800 font-mono">
          {`<script type="application/ld+json">\n${data?.schema_markup.json_ld_schema}\n</script>`}
        </pre>
      </div>

      {/* OUTREACH PITCHES SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-indigo-400" /> Listicle Outreach Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.outreach_campaigns.outreach_pitches.map((pitch, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-indigo-400 truncate max-w-[200px]">
                  {pitch.target_url}
                </span>
                <button
                  onClick={() => copyToClipboard(`Subject: ${pitch.subject_line}\n\n${pitch.email_body}`, idx)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                >
                  {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-xs font-bold text-white">{pitch.subject_line}</p>
              <p className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-6">{pitch.email_body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}