import type { Metadata } from "next";
import React from "react";
import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * Missing routes previously served the homepage shell with a `noindex` tag
 * and a 200-ish soft 404. This returns a real 404 with useful onward links,
 * which stops crawl budget being spent on dead URLs.
 */

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { href: "/", label: "Run a free AI visibility audit" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources/best-aeo-software", label: "10 best AEO tools (2026)" },
  {
    href: "/resources/how-to-track-ai-search-visibility",
    label: "How to track AI search visibility",
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#030712] font-sans text-slate-100 antialiased">
      <SiteHeader />

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-6 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo-400">
          Error 404
        </p>
        <h1 className="mt-4 max-w-[18ch] text-4xl font-black tracking-tight text-white sm:text-5xl">
          That page isn&apos;t here.
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-slate-400">
          The link may be out of date, or the page may have moved. Here is
          where most people were heading.
        </p>

        <ul className="mt-10 flex max-w-xl flex-col border-t border-slate-800/60">
          {SUGGESTIONS.map((s) => (
            <li key={s.href} className="border-b border-slate-800/60">
              <Link
                href={s.href}
                className="flex items-center justify-between gap-4 py-4 text-base font-semibold text-slate-300 transition hover:text-indigo-400"
              >
                {s.label}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
