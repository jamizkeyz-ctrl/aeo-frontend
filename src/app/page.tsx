"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
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
  Minus,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  History,
  Clock,
  ExternalLink as OpenIcon,
  Crown
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";
import PricingModal from "@/components/PricingModal";

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
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<"sov" | "competitor" | "remediation">("sov");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auth & Profile States
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // History State
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  // UI States
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOutreachIdx, setCopiedOutreachIdx] = useState<number | null>(null);

  // Fetch User Profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, [supabase]);

  // Fetch Audit History
  const fetchAuditHistory = useCallback(async (userId?: string) => {
    try {
      setLoadingHistory(true);
      let query = supabase
        .from("audit_jobs")
        .select("id, created_at, target_brand, target_domain, audit_type, category, share_of_voice, status, summary_payload")
        .order("created_at", { ascending: false })
        .limit(10);

      if (userId) {
        query = query.or(`created_by.eq.${userId},created_by.is.null`);
      }

      const { data, error } = await query;
      if (!error && data) {
        setAuditHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
        fetchAuditHistory(activeUser.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
        fetchAuditHistory(activeUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchAuditHistory, fetchUserProfile, supabase]);

  useEffect(() => {
    const reportParam = searchParams.get("report");
    if (reportParam && reportParam !== jobId) {
      setJobId(reportParam);
      setStatus("processing");
    }
  }, [searchParams]);

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
          if (user) {
            fetchAuditHistory(user.id);
            fetchUserProfile(user.id);
          }
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
  }, [jobId, status, user, fetchAuditHistory, fetchUserProfile]);

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profile && profile.tier === "free" && profile.audits_used >= profile.audits_limit) {
      setIsPricingOpen(true);
      return;
    }

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
          category,
          user_id: user?.id || null 
        }
      : { 
          target_brand: brandA, 
          target_domain: cleanDomainA, 
          category,
          user_id: user?.id || null 
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
      router.push(`?report=${data.job_id}`);
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuditHistory([]);
    setProfile(null);
  };

  const handleShareLink = () => {
    const permUrl = `${window.location.origin}?report=${jobId}`;
    navigator.clipboard.writeText(permUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToEngine = () => {
    document.getElementById("engine")?.scrollIntoView({ behavior: "smooth" });
  };

  const loadPastReport = (pastJobId: string) => {
    setJobId(pastJobId);
    setStatus("processing");
    router.push(`?report=${pastJobId}`);
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
      title: `Enhance Your ${category} Comparison with ${brandA}`,
      body: `Hi there,\n\nI hope this message finds you well! I recently came across your article reviewing top tools for ${category}.\n\nWhile ${brandB} is a well-known option, I wanted to suggest adding ${brandA} as an emerging, highly efficient modern alternative.`
    },
    {
      url: `https://www.qapita.com/blog/${category.toLowerCase().replace(/\s+/g, '-')}-tools`,
      title: `Boost Your Alternatives Guide with ${brandA}`,
      body: `Hi [Recipient's Name],\n\nI just read your in-depth guide on ${category} solutions. Great breakdown!\n\nGiven the rising demand for lightweight and transparent alternatives to legacy players like ${brandB}, I recommend listing ${brandA}.`
    },
    {
      url: `https://storyflow.so/blog/best-${category.toLowerCase().replace(/\s+/g, '-')}-2026`,
      title: `${brandA}: A Must-Have in Your 2026 ${category} Roundups!`,
      body: `Hi [Recipient's Name],\n\nI came across your 2026 roundup for ${category} tools.\n\n${brandA} has quickly become a standout alternative with its sleek UI and powerful feature set.`
    },
    {
      url: `https://www.rock.so/blog/${brandB.toLowerCase()}-alternatives`,
      title: `Feature ${brandA} in Your "${brandB} Alternatives" Article`,
      body: `Hi [Recipient's Name],\n\nI noticed your popular piece highlighting top alternatives to ${brandB}.\n\n${brandA} is engineered specifically to address common user pain points with modern automation.`
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

  const faqs = [
    {
      q: "What is Answer Engine Optimization (AEO)?",
      a: "AEO focuses on optimizing brand visibility and citation share across AI conversational models (ChatGPT, Perplexity, Claude, Google AI Overviews) rather than traditional blue-link search engine rankings."
    },
    {
      q: "How is Share of Voice (SoV) calculated?",
      a: "PulseFlow runs structured buyer-intent prompt taxonomies against multi-agent search crawlers to measure the percentage of times your brand is referenced and its average recommendation position."
    },
    {
      q: "How do the remediation tools help increase citations?",
      a: "PulseFlow generates specialized schema markup and reverse-engineers the exact listicle articles and third-party media outlets currently powering AI citations in your niche."
    },
    {
      q: "Is the initial audit completely free?",
      a: "Yes. You can test your brand or run a head-to-head comparison with 30 evaluated prompts with zero credit card required."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased relative overflow-x-hidden">
      
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* GLOW BACKGROUNDS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* FROSTED NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-[#030712]/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSummaryData(null); router.push("/"); }}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              PulseFlow <span className="text-indigo-400 font-black">AEO</span>
            </span>
          </div>

          {!user && (
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <a href="#engine" className="hover:text-white transition">Live Engine</a>
              <a href="#solutions" className="hover:text-white transition">Platform</a>
              <a href="#architecture" className="hover:text-white transition">Architecture</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-xl shadow-inner">
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition ${
                    profile?.tier === "agency"
                      ? "bg-purple-950 text-purple-300 border border-purple-800"
                      : profile?.tier === "pro"
                      ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      : "bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-700"
                  }`}
                  title="Click to view plans & upgrade"
                >
                  <Crown className="h-3 w-3" />
                  {profile?.tier ? profile.tier.toUpperCase() : "FREE"}
                </button>

                <span className="text-xs text-slate-300 font-mono hidden sm:inline">{user.email?.split("@")[0]}</span>
                <button onClick={handleSignOut} className="text-slate-400 hover:text-red-400 transition ml-1" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={scrollToEngine}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start For Free <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12 space-y-16">
        
        {/* VIEW A: UNLOGGED MARKETING HERO */}
        {!summaryData && !user && (
          <section className="text-center max-w-4xl mx-auto space-y-8 pt-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-950/70 border border-indigo-600/40 text-indigo-300 text-xs font-semibold shadow-inner">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span>Next-Gen Answer Engine Optimization (AEO) Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Dominate Brand Citations In <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                AI Answer Engines
              </span>.
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
              When users ask ChatGPT, Perplexity, or Claude for recommendations in your category—are you cited, or are your competitors winning the prompt?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={scrollToEngine}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
              >
                Run Free Visibility Audit <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <Crown className="h-4 w-4 text-amber-400" /> View Pricing & Plans
              </button>
            </div>

            <div className="pt-6 flex flex-wrap justify-center items-center gap-2.5 text-xs font-medium text-slate-400">
              <span className="text-slate-500 mr-2 uppercase tracking-wider font-semibold text-[11px]">Real-Time Data From:</span>
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg shadow-sm">ChatGPT Search</span>
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg shadow-sm">Perplexity AI</span>
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg shadow-sm">Google AI Overviews</span>
              <span className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg shadow-sm">Claude 3.5</span>
            </div>
          </section>
        )}

        {/* VIEW B: AUTHENTICATED WORKSPACE GREETING */}
        {!summaryData && user && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> WORKSPACE ACTIVE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                AEO Citation & Visibility Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage brand visibility taxonomies and monitor competitor movements across generative AI models.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                {profile?.tier === "agency" ? "Agency Unlimited" : profile?.tier === "pro" ? "Pro Plan Active" : "Upgrade from Free ($49)"}
              </button>
            </div>
          </div>
        )}

        {/* LIVE EVALUATION SANDBOX */}
        {!summaryData && (
          <section id="engine" className="scroll-mt-28 bg-slate-900/70 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Zap className="h-4 w-4" /> Live Evaluation Sandbox
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Launch 30-Prompt Visibility Audit
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {profile && (
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Quotas: <strong className="text-indigo-400">{profile.audits_used}</strong> / {profile.audits_limit} used
                  </span>
                )}
                <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                      mode === "single" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Single Brand
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("compare")}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                      mode === "compare" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Swords className="h-3.5 w-3.5" /> Side-by-Side
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleStartAudit} className="space-y-6">
              <div className={`grid grid-cols-1 ${mode === "compare" ? "md:grid-cols-5" : "md:grid-cols-3"} gap-4`}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                    {mode === "compare" ? "Brand A Name" : "Target Brand Name"}
                  </label>
                  <input
                    type="text"
                    value={brandA}
                    onChange={(e) => setBrandA(e.target.value)}
                    required
                    placeholder="e.g. BudgetFlow"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                    {mode === "compare" ? "Brand A Domain" : "Target Brand Domain"}
                  </label>
                  <input
                    type="text"
                    value={domainA}
                    onChange={(e) => setDomainA(e.target.value)}
                    required
                    placeholder="e.g. budgetflow.app"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  />
                </div>

                {mode === "compare" && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Brand B Name</label>
                      <input
                        type="text"
                        value={brandB}
                        onChange={(e) => setBrandB(e.target.value)}
                        required
                        placeholder="e.g. YNAB"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Brand B Domain</label>
                      <input
                        type="text"
                        value={domainB}
                        onChange={(e) => setDomainB(e.target.value)}
                        required
                        placeholder="e.g. ynab.com"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Industry Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="e.g. Personal Finance App"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "processing"}
                className="w-full md:w-auto px-9 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 disabled:opacity-50"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {mode === "compare" ? "Parallel Evaluation Running..." : "Evaluating 30 High-Intent Prompts..."}
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    {mode === "compare" ? `Run Head-to-Head: ${brandA} vs ${brandB}` : `Run 30-Prompt Audit for ${brandA}`}
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="bg-red-950/50 border border-red-800/80 text-red-300 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>
        )}

        {/* WORKSPACE AUDIT HISTORY TABLE */}
        {!summaryData && user && (
          <section id="history" className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <History className="h-5 w-5 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Recent Workspace Audits</h3>
              </div>
              <button 
                onClick={() => fetchAuditHistory(user.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                {loadingHistory ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
              </button>
            </div>

            {loadingHistory ? (
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 flex items-center justify-center gap-3 text-slate-400 text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                Loading saved audits...
              </div>
            ) : auditHistory.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center space-y-2">
                <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No previous audits found</p>
                <p className="text-xs text-slate-500">Run an evaluation above to store your first verified report.</p>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                        <th className="py-3.5 px-5">DATE</th>
                        <th className="py-3.5 px-5">TYPE</th>
                        <th className="py-3.5 px-5">TARGET BRAND</th>
                        <th className="py-3.5 px-5">CATEGORY</th>
                        <th className="py-3.5 px-5">SHARE OF VOICE</th>
                        <th className="py-3.5 px-5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {auditHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-4 px-5 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>
                          <td className="py-4 px-5">
                            {item.audit_type === "compare" ? (
                              <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold rounded-lg flex items-center gap-1 w-fit">
                                <Swords className="h-3 w-3" /> Compare
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-bold rounded-lg w-fit">
                                Single
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 font-bold text-white">
                            {item.target_brand || "N/A"}
                            <span className="block text-xs font-normal text-slate-400 font-mono">
                              {item.target_domain}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-xs text-slate-300">{item.category || "General"}</td>
                          <td className="py-4 px-5">
                            <span className="text-sm font-black text-indigo-400">
                              {item.share_of_voice ?? item.summary_payload?.share_of_voice_percentage ?? 0}%
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => loadPastReport(item.id)}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow-sm"
                            >
                              Open <OpenIcon className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* REPORT VIEW 1: SIDE-BY-SIDE HEAD-TO-HEAD BENCHMARK            */}
        {/* ------------------------------------------------------------- */}
        {isCompareReport && (
          <div className="space-y-8 animate-fadeIn pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSummaryData(null); router.push("/"); }} 
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Swords className="h-4 w-4" /> HEAD-TO-HEAD COMPETITOR BENCHMARK
                  </span>
                  <h2 className="text-2xl font-black text-white">
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
                  {copiedLink ? "Link Copied!" : "Share Link"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <Printer className="h-4 w-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* BATTLE SCORECARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/90 border border-indigo-900/50 p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  {summaryData.brand_a_summary?.target_brand || brandA} (Target)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">
                    {summaryData.brand_a_summary?.share_of_voice_percentage ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Share of Voice</span>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Direct Wins:</span>
                  <strong className="text-indigo-300 font-bold">{summaryData.brand_a_wins || 0} prompts</strong>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-2 shadow-xl">
                <Trophy className="h-9 w-9 text-amber-400" />
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

              <div className="bg-slate-900/90 border border-emerald-900/50 p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {summaryData.brand_b_summary?.target_brand || brandB} (Competitor)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">
                    {summaryData.brand_b_summary?.share_of_voice_percentage ?? 0}%
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Share of Voice</span>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3 flex justify-between">
                  <span>Direct Wins:</span>
                  <strong className="text-emerald-300 font-bold">{summaryData.brand_b_wins || 0} prompts</strong>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="border-b border-slate-800 flex gap-8">
              <button
                onClick={() => setActiveReportTab("overview")}
                className={`pb-4 text-sm font-bold flex items-center gap-2 transition ${
                  activeReportTab === "overview" ? "border-b-2 border-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="h-4 w-4" /> Comparison Breakdown
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

            {/* TAB 1: COMPARISON BREAKDOWN */}
            {activeReportTab === "overview" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Swords className="h-5 w-5 text-indigo-400" /> Prompt-by-Prompt Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                        <th className="py-3.5 px-4">PROMPT EVALUATED</th>
                        <th className="py-3.5 px-4">{summaryData.brand_a_summary?.target_brand || brandA}</th>
                        <th className="py-3.5 px-4">{summaryData.brand_b_summary?.target_brand || brandB}</th>
                        <th className="py-3.5 px-4">WINNER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {(summaryData.head_to_head_prompts || []).map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-950/50">
                          <td className="py-4 px-4 font-medium text-slate-200">{item.prompt}</td>
                          <td className="py-4 px-4">
                            {item.brand_a_mentioned ? (
                              <span className="px-2.5 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold rounded">
                                Rank #{item.brand_a_rank || 1}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">Missing</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {item.brand_b_mentioned ? (
                              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold rounded">
                                Rank #{item.brand_b_rank || 1}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 font-mono">Missing</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
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
            )}

            {/* TAB 2: REMEDIATION & FIXES */}
            {activeReportTab === "remediation" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-indigo-400" /> Automated JSON-LD Schema ({brandA})
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
                    Paste this <code className="text-indigo-400">&lt;script&gt;</code> tag in the <code className="text-indigo-400">&lt;head&gt;</code> section of {brandA}&apos;s website.
                  </p>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{generateJsonLdSchema()}</pre>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Competitor Conquest Outreach Campaigns</h3>
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

        {/* ------------------------------------------------------------- */}
        {/* REPORT VIEW 2: SINGLE BRAND VERIFIED AUDIT                    */}
        {/* ------------------------------------------------------------- */}
        {!isCompareReport && summaryData && (
          <div className="space-y-8 animate-fadeIn pt-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSummaryData(null); router.push("/"); }} 
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-300 transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    VERIFIED AEO AUDIT REPORT
                  </span>
                  <h2 className="text-2xl font-black text-white">
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
                  {copiedLink ? "Link Copied!" : "Share Link"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-md shadow-indigo-600/20"
                >
                  <Printer className="h-4 w-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* 4 CORE KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  <TrendingUp className="h-4 w-4" /> SHARE OF VOICE
                </div>
                <p className="text-5xl font-black text-white">
                  {summaryData.share_of_voice_percentage ?? summaryData.sov_percentage ?? 0}%
                </p>
                <p className="text-xs text-slate-400">Across {summaryData.total_prompts_evaluated || 30} evaluated queries</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <BarChart3 className="h-4 w-4 text-indigo-400" /> AVG POSITION
                </div>
                <p className="text-5xl font-black text-white">
                  {summaryData.average_rank_when_mentioned ? `#${summaryData.average_rank_when_mentioned}` : "Unranked"}
                </p>
                <p className="text-xs text-slate-400">When recommended by AI</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                  <FileText className="h-4 w-4" /> TOTAL QUERIES
                </div>
                <p className="text-5xl font-black text-white">{summaryData.total_prompts_evaluated || 30}</p>
                <p className="text-xs text-slate-400">Prompts in category taxonomy</p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
                  <Globe className="h-4 w-4" /> PRIMARY SOURCES
                </div>
                <p className="text-5xl font-black text-white">10</p>
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
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-400" /> Competitor Mentions Breakdown
                    </h3>
                    <div className="space-y-3">
                      {defaultCompetitors.map((comp, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-sm font-semibold text-slate-200">{comp.name}</span>
                          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full">{comp.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
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
                          className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition group"
                        >
                          <span className="text-xs font-mono text-indigo-300 truncate pr-4">{srcUrl}</span>
                          <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h3 className="text-lg font-bold text-white">Query Audit Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                          <th className="py-3.5 px-4">PROMPT EVALUATED</th>
                          <th className="py-3.5 px-4">STATUS</th>
                          <th className="py-3.5 px-4">RANK</th>
                          <th className="py-3.5 px-4">TOP COMPETITOR</th>
                          <th className="py-3.5 px-4">REMEDIATION ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {(summaryData.prompt_results || summaryData.prompts || summaryData.results || []).map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-950/50">
                            <td className="py-4 px-4 font-medium text-slate-200">{item.prompt}</td>
                            <td className="py-4 px-4">
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
                            <td className="py-4 px-4 text-slate-400">{item.rank ? `#${item.rank}` : "-"}</td>
                            <td className="py-4 px-4 text-slate-300 font-medium">{defaultCompetitors[idx % defaultCompetitors.length].name}</td>
                            <td className="py-4 px-4 text-xs text-slate-400 max-w-md">
                              Create content that highlights {brandA}&apos;s unique features and benefits compared to competitors.
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
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

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
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

        {/* MARKETING SECTIONS (Only shown if unauthenticated and not viewing report) */}
        {!summaryData && !user && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-center space-y-1">
                <div className="text-3xl font-black text-indigo-400">94.2%</div>
                <div className="text-xs font-medium text-slate-400">High-Intent AI Query Coverage</div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-center space-y-1">
                <div className="text-3xl font-black text-purple-400">&lt; 15s</div>
                <div className="text-xs font-medium text-slate-400">30-Prompt Audit Execution Speed</div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 text-center space-y-1">
                <div className="text-3xl font-black text-emerald-400">4.2x</div>
                <div className="text-xs font-medium text-slate-400">Average Citation Lift with Remediation</div>
              </div>
            </section>

            <section id="solutions" className="scroll-mt-28 space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Platform Capabilities</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Everything You Need to Win Generative Search
                </h2>
                <p className="text-sm text-slate-400">
                  Comprehensive toolsets engineered specifically for AEO practitioners and modern marketing teams.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setActiveInteractiveTab("sov")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeInteractiveTab === "sov" 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" /> Share of Voice Auditing
                  </button>
                  <button
                    onClick={() => setActiveInteractiveTab("competitor")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeInteractiveTab === "competitor" 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <Swords className="h-4 w-4" /> Competitor Benchmarks
                  </button>
                  <button
                    onClick={() => setActiveInteractiveTab("remediation")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      activeInteractiveTab === "remediation" 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" 
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <Code2 className="h-4 w-4" /> Automated Remediation
                  </button>
                </div>

                <div className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-8 shadow-2xl">
                  {activeInteractiveTab === "sov" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Full-Funnel AI Visibility Mapping</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Answer Engines do not output ten blue links. They summarize, cite, and rank the single best answer. PulseFlow measures your exact presence across 30 taxonomy prompts in under 15 seconds.
                        </p>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Real-time Share of Voice percentage calculation</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Average recommendation position tracking</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Identification of blind spots in buyer queries</li>
                        </ul>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-indigo-300 space-y-2">
                        <div className="text-slate-500">// Sample Output Payload</div>
                        <div className="text-emerald-400">&quot;target_brand&quot;: &quot;YourBrand&quot;,</div>
                        <div>&quot;share_of_voice&quot;: &quot;78.5%&quot;,</div>
                        <div>&quot;average_rank&quot;: 1.4,</div>
                        <div>&quot;prompts_evaluated&quot;: 30,</div>
                        <div>&quot;cited_sources_detected&quot;: 12</div>
                      </div>
                    </div>
                  )}

                  {activeInteractiveTab === "competitor" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Head-to-Head Conquest Analysis</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          Discover exactly where legacy competitors outrank you and where you hold the citation advantage. Get prompt-by-prompt win/loss indicators.
                        </p>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Side-by-side Share of Voice comparison</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Prompt win/loss scoring matrix</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Direct competitor conquest email generators</li>
                        </ul>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-indigo-400 font-bold">Your Brand</span>
                          <span className="text-emerald-400 font-bold">Competitor Brand</span>
                        </div>
                        <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden">
                          <div className="bg-indigo-600 h-full w-[65%]" />
                          <div className="bg-emerald-600 h-full w-[35%]" />
                        </div>
                        <div className="text-[11px] text-slate-400 text-center font-mono">65% SoV vs 35% SoV (Target Brand Leads by +30%)</div>
                      </div>
                    </div>
                  )}

                  {activeInteractiveTab === "remediation" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Instant Actionable Remediation</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          AEO requires entity authority and publisher inclusion. PulseFlow automatically drafts your structured JSON-LD schema tags and custom publisher outreach emails.
                        </p>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Auto-generated SoftwareApplication JSON-LD</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Publisher listicle conquest templates</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> One-click clipboard copying</li>
                        </ul>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-300 space-y-2">
                        <div className="text-indigo-400">&lt;script type=&quot;application/ld+json&quot;&gt;</div>
                        <div className="pl-4 text-slate-400">&quot;@context&quot;: &quot;https://schema.org&quot;,</div>
                        <div className="pl-4 text-slate-400">&quot;@type&quot;: &quot;SoftwareApplication&quot;,</div>
                        <div className="pl-4 text-emerald-400">&quot;name&quot;: &quot;Your Brand&quot;</div>
                        <div className="text-indigo-400">&lt;/script&gt;</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section id="architecture" className="scroll-mt-28 space-y-12">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Methodology & Workflow</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  How the PulseFlow Citation Engine Works
                </h2>
                <p className="text-sm text-slate-400">
                  Four automated phases powering real-time answer engine discovery and benchmarking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                    1
                  </div>
                  <h4 className="text-base font-bold text-white">Prompt Synthesis</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Constructs 30 high-intent category queries matching buyer searches.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black">
                    2
                  </div>
                  <h4 className="text-base font-bold text-white">Parallel Crawl</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Executes multi-threaded queries against search APIs and generative models.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black">
                    3
                  </div>
                  <h4 className="text-base font-bold text-white">Entity Extraction</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Parses brand mentions, cited source URLs, and rank positions.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 relative">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                    4
                  </div>
                  <h4 className="text-base font-bold text-white">Remediation Delivery</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Produces permanent shareable reports, JSON-LD schema, and outreach copy.
                  </p>
                </div>
              </div>
            </section>

            <section id="faq" className="scroll-mt-28 space-y-8 max-w-3xl mx-auto">
              <div className="text-center space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Got Questions?</div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-white hover:text-indigo-300 transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3 animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <PricingModal 
          isOpen={isPricingOpen} 
          onClose={() => setIsPricingOpen(false)} 
          userEmail={user?.email} 
          userId={user?.id} 
          onSuccess={() => {
            if (user) fetchUserProfile(user.id);
          }} 
        />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 mt-20 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <BarChart3 className="h-4 w-4 text-indigo-400" /> PulseFlow AEO
          </div>
          <p>&copy; 2026 PulseFlow AEO Engine. Enterprise Answer Engine Optimization Platform.</p>
          <div className="flex gap-6">
            <a href="#engine" className="hover:text-slate-300 transition">Audit Engine</a>
            <a href="#solutions" className="hover:text-slate-300 transition">Solutions</a>
            <a href="#architecture" className="hover:text-slate-300 transition">Architecture</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function AEODashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712] flex items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}