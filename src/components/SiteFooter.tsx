/**
 * Server component. This is the site's internal-linking backbone — every
 * resource and comparison page gets a site-wide link from here.
 */

import React from "react";
import Link from "next/link";
import PulseCitationLogo from "@/components/PulseCitationLogo";
import { CONTACT_EMAIL } from "@/lib/seo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { href: "/#audit", label: "Live audit engine" },
      { href: "/#platform", label: "Share of voice auditing" },
      { href: "/#platform", label: "Competitor benchmarks" },
      { href: "/#platform", label: "Schema remediation" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources/best-aeo-software", label: "10 best AEO tools (2026)" },
      {
        href: "/resources/best-aeo-tools-for-tracking-chatgpt-brand-mentions",
        label: "Track ChatGPT brand mentions",
      },
      {
        href: "/resources/how-to-track-ai-search-visibility",
        label: "How to track AI search visibility",
      },
      {
        href: "/resources/state-of-ai-search-visibility-2026",
        label: "State of AI search visibility 2026",
      },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/alternative/semrush", label: "Semrush alternative" },
      { href: "/alternative/ahrefs", label: "Ahrefs alternative" },
      { href: "/alternative/moz", label: "Moz alternative" },
      { href: "/alternative/brightedge", label: "BrightEdge alternative" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/#method", label: "Methodology" },
      { href: `mailto:${CONTACT_EMAIL}`, label: "Contact" },
      { href: "https://twitter.com/pulseflowaeo", label: "X / Twitter" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-slate-800/70 bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="flex max-w-[34ch] flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <PulseCitationLogo size={28} />
              <span className="text-base font-extrabold tracking-tight text-white">
                PulseFlow <span className="font-black text-indigo-400">AEO</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              The answer engine visibility platform for marketing teams. Measure
              your share of the AI answer, then ship the fixes that change it.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col">
              <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("http") || l.href.startsWith("mailto:") ? (
                      <a
                        href={l.href}
                        rel="noopener"
                        className="text-sm text-slate-400 transition hover:text-indigo-400"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-slate-400 transition hover:text-indigo-400"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/60 pt-6 text-xs text-slate-600">
          <span>
            © {new Date().getFullYear()} PulseFlow AEO. Answer Engine
            Optimization platform.
          </span>
          <span className="flex flex-wrap gap-5">
            <a href="/sitemap.xml" className="transition hover:text-slate-400">
              Sitemap
            </a>
            <a href="/llms.txt" className="transition hover:text-slate-400">
              llms.txt
            </a>
            <a href="/robots.txt" className="transition hover:text-slate-400">
              robots.txt
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
