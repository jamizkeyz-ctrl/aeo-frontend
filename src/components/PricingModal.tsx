"use client";

import React, { useState } from "react";
import { Check, Zap, Crown, X, Loader2, Sparkles, ShieldCheck, UserCheck } from "lucide-react";

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

  const handlePaystackPayment = (plan: "pro" | "agency", amountInCents: number) => {
    if (!userEmail) {
      alert("Please sign in first to upgrade your workspace.");
      return;
    }

    setLoadingPlan(plan);

    const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_sample";

    // @ts-ignore
    if (typeof window !== "undefined" && window.PaystackPop) {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: userEmail,
        amount: amountInCents, // e.g. 4900 for $49.00
        currency: "USD",
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
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => handlePaystackPayment(plan, amountInCents);
      document.body.appendChild(script);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#030712] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Scale Your Answer Engine Authority</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Predictable Plans for High-Growth Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a tier to track Share of Voice across ChatGPT, Perplexity, Claude, and Google AI Overviews.
          </p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Free Tier */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                <UserCheck className="h-4 w-4 text-slate-400" /> STARTER / FREE
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">For exploratory brand audits.</p>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  3 Evaluation Audits / month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  Single Brand AEO Visibility
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-slate-500 shrink-0" />
                  Top 5 Cited Sources Discovery
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  Head-to-Head Benchmarking
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Current Active Plan
            </button>
          </div>

          {/* Pro Tier ($49/mo) */}
          <div className="bg-slate-900/80 border-2 border-indigo-500/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
              Most Popular
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Zap className="h-4 w-4" /> PRO TIER
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$49</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">For growing SaaS & e-commerce brands.</p>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <strong>50 Audits & Comparisons / mo</strong>
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
                  Listicle Outreach Conquest Templates
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePaystackPayment("pro", 4900)} // $49.00 in cents
              disabled={loadingPlan !== null}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loadingPlan === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro ($49/mo)"}
            </button>
          </div>

          {/* Agency Tier ($149/mo) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Crown className="h-4 w-4" /> AGENCY TIER
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$149</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
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
                  Multi-Client Workspace Seats
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePaystackPayment("agency", 14900)} // $149.00 in cents
              disabled={loadingPlan !== null}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingPlan === "agency" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Agency ($149/mo)"}
            </button>
          </div>

        </div>

        {/* Security Badge */}
        <div className="text-center flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Secured checkout via Paystack. Supports all major international debit and credit cards in USD.
        </div>

      </div>
    </div>
  );
}