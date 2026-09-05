"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, UserPlus, LogOut, Crown, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";
import PricingModal from "@/components/PricingModal";
import PulseCitationLogo from "@/components/PulseCitationLogo";

const RESOURCES = [
  { href: "/resources/best-aeo-software", label: "10 Best AEO Tools (2026)" },
  {
    href: "/resources/best-aeo-tools-for-tracking-chatgpt-brand-mentions",
    label: "Tracking ChatGPT Mentions",
  },
  { href: "/resources/how-to-track-ai-search-visibility", label: "AI Visibility Guide" },
  {
    href: "/resources/state-of-ai-search-visibility-2026",
    label: "2026 AI Search Visibility Report",
  },
];

const NAV = [
  { href: "/#audit", label: "Live audit" },
  { href: "/#platform", label: "Platform" },
  { href: "/#method", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const supabase = createClient();

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadTier = async (id: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", id)
        .single();
      if (!cancelled) setTier(data?.tier ?? null);
    };

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const u = data.user;
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
      if (u) loadTier(u.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
      if (u) loadTier(u.id);
      else setTier(null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="no-print sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#030712]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="PulseFlow AEO home"
          >
            <PulseCitationLogo size={34} className="group-hover:scale-105" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              PulseFlow <span className="font-black text-indigo-400">AEO</span>
            </span>
          </Link>

          <nav
            className="ml-4 hidden flex-1 items-center gap-6 text-sm font-medium text-slate-400 lg:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}

            <div className="group relative py-2">
              <button className="flex items-center gap-1 transition hover:text-white">
                Resources
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full z-50 hidden w-64 rounded-xl border border-slate-800 bg-slate-900 py-2 shadow-2xl group-hover:block">
                {RESOURCES.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="block px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-800/80 hover:text-white"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-1.5">
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                    tier === "agency"
                      ? "border border-purple-800 bg-purple-950 text-purple-300"
                      : tier === "pro"
                        ? "border border-indigo-800 bg-indigo-950 text-indigo-300"
                        : "border border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700"
                  }`}
                  title="View plans and upgrade"
                >
                  <Crown className="h-3 w-3" />
                  {tier ? tier.toUpperCase() : "FREE"}
                </button>
                <span className="hidden font-mono text-xs text-slate-300 sm:inline">
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="ml-1 text-slate-400 transition hover:text-red-400"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth("signin")}
                  className="hidden px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:text-white sm:block"
                >
                  Sign in
                </button>
                <button
                  onClick={() => openAuth("signup")}
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Run a free audit</span>
                  <span className="sm:hidden">Free audit</span>
                </button>
              </>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg border border-slate-800 p-2 text-slate-300 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            className="border-t border-slate-800/80 bg-[#030712] px-6 py-4 lg:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1 text-sm">
              {[...NAV, ...RESOURCES.map((r) => ({ href: r.href, label: r.label }))].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-2 py-2.5 text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        )}
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        userEmail={user?.email}
        userId={user?.id}
        onSuccess={() => undefined}
      />
    </>
  );
}
