/**
 * Server component — this is the H1 that answer-engine crawlers read.
 * It must never become a client component and must never be gated behind
 * auth or Suspense state.
 */

import React from "react";

const CITED = [
  { src: "northstar.io/compare", cited: true },
  { src: "beaconlabs.ai/docs", cited: true },
  { src: "g2.com — category page", cited: true },
  { src: "yourbrand.com — not cited", cited: false },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col items-start gap-6">
          <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            <span aria-hidden="true" className="h-px w-6 bg-indigo-500" />
            Answer Engine Optimization
          </p>

          <h1 className="text-[2.3rem] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Get cited when AI answers your buyers&apos;{" "}
            <span className="text-indigo-400">questions.</span>
          </h1>

          <p className="max-w-[52ch] text-lg leading-relaxed text-slate-400">
            PulseFlow measures your brand&apos;s share of voice across ChatGPT,
            Perplexity, Claude and Google AI Overviews — then generates the
            schema, citation targets and outreach copy that get you named in the
            answer.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#audit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              Run a free audit
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#platform"
              className="rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
            >
              See what you get
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            {["No card required", "Results in under 15 seconds", "Shareable report link"].map(
              (t) => (
                <li key={t} className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-emerald-400"
                  >
                    <path
                      d="m3 8.5 3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Sample answer — shows the problem the product solves. */}
        <figure className="m-0 min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
              Sample audit output · prompt 07
            </span>
            <span className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-[10px] text-slate-400">
              ChatGPT Search
            </span>
          </div>

          <div className="flex flex-col gap-4 p-4 pb-5">
            <div className="flex gap-2.5 rounded-xl border border-slate-800/70 bg-slate-900/70 p-3.5">
              <span aria-hidden="true" className="font-mono text-sm text-indigo-400">
                &gt;
              </span>
              <p className="text-sm leading-relaxed text-slate-200">
                What&apos;s the best tool for a B2B SaaS team to track brand
                visibility in AI search?
              </p>
            </div>

            <p className="text-sm leading-[1.7] text-slate-400">
              For a B2B SaaS team, the most commonly recommended options are{" "}
              <b className="font-semibold text-slate-200">Northstar</b>,{" "}
              <b className="font-semibold text-slate-200">Beacon Labs</b> and{" "}
              <b className="font-semibold text-slate-200">Meridian</b>. Northstar
              is usually cited first for prompt-level tracking across multiple
              engines…
            </p>

            <div>
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600">
                Sources cited in this answer
              </p>
              <ul className="flex flex-wrap gap-2">
                {CITED.map((c) => (
                  <li
                    key={c.src}
                    className={`flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                      c.cited
                        ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
                        : "border-orange-500/40 bg-orange-950/40 text-orange-400"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        c.cited ? "bg-emerald-400" : "bg-orange-400"
                      }`}
                    />
                    {c.src}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-slate-800/70 bg-slate-800/70">
              {[
                { k: "Share of voice", v: "0%", tone: "text-orange-400" },
                { k: "Avg. rank", v: "—", tone: "text-orange-400" },
                { k: "Fixes found", v: "7", tone: "text-emerald-400" },
              ].map((s) => (
                <div key={s.k} className="flex flex-col gap-1 bg-slate-950 p-3">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600">
                    {s.k}
                  </dt>
                  <dd
                    className={`m-0 text-xl font-black tracking-tight tabular-nums ${s.tone}`}
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <figcaption className="border-t border-slate-800/70 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">
            Illustrative example · brand names are fictional
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
