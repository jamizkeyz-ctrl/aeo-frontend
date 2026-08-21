"use client";

import React, { useState } from "react";
import { Check, Zap, Crown, X, Loader2, Sparkles, ShieldCheck } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userId?: string;
  onSuccess: () => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  userEmail,
  userId,
  onSuccess,
}: PricingModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePaystackPayment = (plan: "pro" | "agency", amountInKobo: number) => {
    if (!userEmail) {
      alert("Please sign in first to upgrade your workspace.");
      return;
    }

    setLoadingPlan(plan);

    // Load Paystack Inline
    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sample";

    // @ts-ignore
    if (typeof window !== "undefined" && window.PaystackPop) {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: userEmail,
        amount: amountInKobo,
        currency: "NGN",
        metadata: {
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: plan },
            { display_name: "User ID", variable_name: "user_id", value: userId },
          ],
        },
        callback: function (response: any) {
          setLoadingPlan(null);
          alert(`Payment successful! Reference: ${response.reference}`);
          onSuccess();
          onClose();
        },
        onClose: function () {
          setLoadingPlan(null);
        },
      });
      handler.openIframe();
    } else {
      // Fallback: Dynamically inject Paystack Script if not loaded
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => handlePaystackPayment(plan, amountInKobo);
      document.body.appendChild(script);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#030712] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Unlock Enterprise Answer Engine Optimization</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Upgrade Your Visibility Tier
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Scale your brand presence across ChatGPT, Perplexity, and Google AI Overviews with unlimited audits and conquest campaigns.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pro Tier */}
          <div className="bg-slate-900/70 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between relative hover:border-indigo-500/60 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Zap className="h-4 w-4" /> PRO TIER
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 text-[11px] font-bold rounded-full border border-indigo-800">
                  Most Popular
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">₦35,000</span>
                  <span className="text-xs text-slate-400 font-medium">/ month (~$25)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">For growing startups & DTC brands.</p>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <strong>50 Full Audits / month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Head-to-Head Competitor Benchmarking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Automated JSON-LD Schema Generator
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Listicle Conquest Outreach Templates
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePaystackPayment("pro", 3500000)} // 35,000 NGN in Kobo
              disabled={loadingPlan !== null}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loadingPlan === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro (Paystack)"}
            </button>
          </div>

          {/* Agency Tier */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between relative hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Crown className="h-4 w-4" /> AGENCY TIER
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">₦95,000</span>
                  <span className="text-xs text-slate-400 font-medium">/ month (~$65)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">For SEO agencies & multiple brand portfolios.</p>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <strong>Unlimited Audits & Comparisons</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Executive White-Label PDF Export
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Weekly Automated Citation Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  Multi-Client Workspace Access
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePaystackPayment("agency", 9500000)} // 95,000 NGN in Kobo
              disabled={loadingPlan !== null}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPlan === "agency" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Agency (Paystack)"}
            </button>
          </div>

        </div>

        {/* Security Trust Badge */}
        <div className="text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Secured by Paystack. Supports Nigerian Naira cards, Bank Transfers, and International Cards.
        </div>

      </div>
    </div>
  );
}