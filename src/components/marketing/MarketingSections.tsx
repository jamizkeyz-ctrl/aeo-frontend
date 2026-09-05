/**
 * Server component. Every word below is in the initial HTML response, which
 * is the whole point — GPTBot, PerplexityBot and ClaudeBot do not reliably
 * execute JavaScript. Nothing here may become a client component.
 */

import React from "react";
import Link from "next/link";
import { FAQS, PLANS, CONTACT_EMAIL } from "@/lib/seo";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
      <span aria-hidden="true" className="h-px w-6 bg-indigo-500" />
      {children}
    </p>
  );
}

function Tick({ tone = "emerald" }: { tone?: "emerald" | "indigo" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`mt-[5px] h-3.5 w-3.5 shrink-0 ${
        tone === "emerald" ? "text-emerald-400" : "text-indigo-400"
      }`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3 8.5 3 3 7-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Engine strip                                                        */
/* ------------------------------------------------------------------ */

export function EngineStrip() {
  const engines = [
    "ChatGPT Search",
    "Perplexity AI",
    "Claude",
    "Google AI Overviews",
  ];
  return (
    <section
      aria-label="Answer engines monitored"
      className="border-y border-slate-800/70 bg-slate-950/40"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-3 px-6 py-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          Queried live, every audit
        </span>
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {engines.map((e) => (
            <li
              key={e}
              className="flex items-center gap-2 text-sm font-semibold text-slate-300"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.14)]"
              />
              {e}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The shift                                                           */
/* ------------------------------------------------------------------ */

export function ProblemSection() {
  const stats = [
    {
      fig: "94.2%",
      tone: "text-indigo-400",
      cap: "of high-intent queries in a typical B2B category are covered by PulseFlow's prompt taxonomy.",
      src: "Platform coverage",
    },
    {
      fig: "< 15s",
      tone: "text-purple-400",
      cap: "to run a full multi-engine audit across a 30-prompt taxonomy and four answer engines.",
      src: "Median execution time",
    },
    {
      fig: "4.2×",
      tone: "text-emerald-400",
      cap: "average lift in citation frequency after applying the generated remediation set.",
      src: "Customer cohort average",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>The shift</Eyebrow>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ten blue links stopped being the interface.
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-slate-400">
          Answer engines don&apos;t rank pages. They synthesise one
          recommendation and cite a handful of sources. Your ranking position is
          no longer what your buyer sees — being named in the answer is.
        </p>
      </div>

      <dl className="mt-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.fig}
            className={`flex flex-col gap-1.5 p-7 ${
              i < stats.length - 1
                ? "border-b border-slate-800/70 md:border-b-0 md:border-r"
                : ""
            }`}
          >
            <dt className="sr-only">{s.src}</dt>
            <dd className="contents">
              <span
                className={`font-mono text-3xl font-black tracking-tight sm:text-4xl ${s.tone}`}
              >
                {s.fig}
              </span>
              <span className="text-sm leading-relaxed text-slate-400">
                {s.cap}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-600">
                {s.src}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Platform                                                            */
/* ------------------------------------------------------------------ */

const SOV_ROWS = [
  { name: "Your brand", pct: 41.2, you: true },
  { name: "Northstar", pct: 63.4, you: false },
  { name: "Beacon Labs", pct: 37.1, you: false },
  { name: "Meridian", pct: 22.8, you: false },
  { name: "Quillbase", pct: 14.3, you: false },
];

const MOVEMENT = [
  { prompt: "best AI visibility tool", winner: "Northstar", you: "#3", d: "+2", up: true },
  { prompt: "track ChatGPT brand mentions", winner: "You", you: "#1", d: "+1", up: true },
  { prompt: "Semrush AI toolkit alternative", winner: "Beacon Labs", you: "#4", d: "-2", up: false },
  { prompt: "how to rank in Perplexity", winner: "Meridian", you: "—", d: "-1", up: false },
  { prompt: "AEO software for agencies", winner: "You", you: "#2", d: "+3", up: true },
];

function FeatureRow({
  eyebrow,
  title,
  body,
  points,
  art,
  flip = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  art: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 border-t border-slate-800/60 py-12 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
      <div
        className={`flex min-w-0 flex-col items-start gap-4 ${flip ? "lg:order-2" : ""}`}
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
        <p className="max-w-prose text-[15px] leading-relaxed text-slate-400">
          {body}
        </p>
        <ul className="mt-1 flex flex-col gap-2.5">
          {points.map((p) => (
            <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
              <Tick />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`min-w-0 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl ${
          flip ? "lg:order-1" : ""
        }`}
      >
        {art}
      </div>
    </div>
  );
}

export function PlatformSection() {
  return (
    <section
      id="platform"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/40"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>Platform</Eyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Measure the answer. Then change it.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            Most tools stop at a dashboard. PulseFlow closes the loop — every gap
            it finds comes back with the markup, the page and the outreach copy
            that closes it.
          </p>
        </div>

        <div className="mt-12 flex flex-col">
          <FeatureRow
            eyebrow="Share of voice"
            title="Know your exact share of the answer"
            body="PulseFlow builds a taxonomy of high-intent buyer prompts for your category, runs them against every engine, and parses each response for brand mentions, rank position and cited URLs."
            points={[
              "Real-time share of voice, per engine and per prompt",
              "Average recommendation position, not just mention counts",
              "Blind-spot detection for the queries you are invisible on",
            ]}
            art={
              <>
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Share of voice — sample category
                  </span>
                  <span className="font-mono text-[10px] text-slate-600">
                    28 prompts
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {SOV_ROWS.map((r) => (
                    <li
                      key={r.name}
                      className="grid grid-cols-[minmax(88px,120px)_1fr_52px] items-center gap-3"
                    >
                      <span
                        className={`truncate text-[13px] ${
                          r.you ? "font-semibold text-white" : "text-slate-400"
                        }`}
                      >
                        {r.name}
                      </span>
                      <span className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <span
                          className={`block h-full rounded-full ${
                            r.you
                              ? "bg-gradient-to-r from-indigo-600 to-purple-400"
                              : "bg-slate-600"
                          }`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </span>
                      <span
                        className={`text-right font-mono text-xs tabular-nums ${
                          r.you ? "font-bold text-indigo-300" : "text-slate-400"
                        }`}
                      >
                        {r.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600">
                  Sample data · brand names are illustrative
                </p>
              </>
            }
          />

          <FeatureRow
            flip
            eyebrow="Competitor benchmarks"
            title="Watch the prompts flip, week by week"
            body="Run a head-to-head against the competitor you actually lose deals to, on the same prompt set. When a rival starts winning a query you used to own, you see the movement and the source that displaced you."
            points={[
              "Side-by-side share of voice on one prompt taxonomy",
              "Prompt-level win/loss scoring matrix",
              "Conquest outreach copy for the sources that beat you",
            ]}
            art={
              <div className="min-w-0 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-[13px]">
                  <caption className="mb-3 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Prompt-level movement · sample
                  </caption>
                  <thead>
                    <tr>
                      {["Prompt", "Winner", "You", "Δ"].map((h, i) => (
                        <th
                          key={h}
                          scope="col"
                          className={`border-b border-slate-800 pb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 ${
                            i > 1 ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOVEMENT.map((m) => (
                      <tr key={m.prompt}>
                        <td className="border-b border-slate-800/60 py-2.5 pr-3 text-slate-400">
                          {m.prompt}
                        </td>
                        <td className="border-b border-slate-800/60 py-2.5 pr-3 font-semibold text-white">
                          {m.winner}
                        </td>
                        <td className="border-b border-slate-800/60 py-2.5 pr-3 text-right font-mono tabular-nums text-slate-300">
                          {m.you}
                        </td>
                        <td
                          className={`border-b border-slate-800/60 py-2.5 text-right font-mono tabular-nums ${
                            m.up ? "text-emerald-400" : "text-orange-400"
                          }`}
                        >
                          {m.d}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />

          <FeatureRow
            eyebrow="Remediation"
            title="Get the fix, not just the finding"
            body="Every audit returns a remediation set: validated JSON-LD to paste into your head, the listicles and third-party media currently powering citations in your niche, and the outreach copy to reach them."
            points={[
              "Auto-generated SoftwareApplication and Organization JSON-LD",
              "Publisher listicle conquest templates",
              "One-click copy for every generated asset",
            ]}
            art={
              <>
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/70 pb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    remediation / product-schema.json
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    validated
                  </span>
                </div>
                <pre className="min-w-0 overflow-x-auto rounded-xl border border-slate-800/70 bg-[#030712] p-4 font-mono text-[12px] leading-relaxed text-slate-400">
                  <code>
                    <span className="text-slate-600">
                      {"// paste into <head>"}
                    </span>
                    {"\n{\n  "}
                    <span className="text-indigo-300">&quot;@context&quot;</span>
                    {": "}
                    <span className="text-emerald-400">
                      &quot;https://schema.org&quot;
                    </span>
                    {",\n  "}
                    <span className="text-indigo-300">&quot;@type&quot;</span>
                    {": "}
                    <span className="text-emerald-400">
                      &quot;SoftwareApplication&quot;
                    </span>
                    {",\n  "}
                    <span className="text-indigo-300">&quot;name&quot;</span>
                    {": "}
                    <span className="text-emerald-400">&quot;YourBrand&quot;</span>
                    {",\n  "}
                    <span className="text-indigo-300">
                      &quot;applicationCategory&quot;
                    </span>
                    {": "}
                    <span className="text-emerald-400">
                      &quot;BusinessApplication&quot;
                    </span>
                    {"\n}"}
                  </code>
                </pre>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Method                                                              */
/* ------------------------------------------------------------------ */

export function MethodSection() {
  const phases = [
    {
      n: "Phase 01",
      h: "Prompt synthesis",
      p: "Constructs a taxonomy of high-intent category queries from your brand, domain and category — the questions buyers actually ask.",
      out: "30-prompt taxonomy",
    },
    {
      n: "Phase 02",
      h: "Parallel crawl",
      p: "Executes every prompt concurrently against live search APIs and generative models, capturing the full response rather than a cached snippet.",
      out: "Raw response corpus",
    },
    {
      n: "Phase 03",
      h: "Entity extraction",
      p: "Parses each answer for brand mentions, recommendation order and cited source URLs, then normalises entities across engines.",
      out: "Ranked mention graph",
    },
    {
      n: "Phase 04",
      h: "Remediation delivery",
      p: "Converts gaps into shippable fixes: JSON-LD blocks, cited-source targets and publisher outreach copy, in a permanent shareable report.",
      out: "Shareable report + fix set",
    },
  ];

  return (
    <section id="method" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>Methodology</Eyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            How the citation engine works
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            Four phases run on every audit, and each produces an artefact you can
            inspect — no black box, no scraped-and-averaged &ldquo;visibility
            score&rdquo;.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 border-t border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <li
              key={p.n}
              className={`flex flex-col gap-2.5 p-6 ${
                i < phases.length - 1 ? "lg:border-r lg:border-slate-800/60" : ""
              } ${i % 2 === 0 ? "sm:border-r sm:border-slate-800/60 lg:border-r" : ""} ${
                i > 1 ? "border-t border-slate-800/60 sm:border-t lg:border-t-0" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-indigo-400">
                {p.n}
              </span>
              <h3 className="text-lg font-bold text-white">{p.h}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{p.p}</p>
              <span className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-slate-600">
                → {p.out}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison                                                          */
/* ------------------------------------------------------------------ */

export function CompareSection() {
  const rows: [string, string, string][] = [
    ["Unit measured", "Keyword rank position", "Share of the generated answer"],
    [
      "Engines covered",
      "Google and Bing results pages",
      "ChatGPT, Perplexity, Claude, Google AI Overviews",
    ],
    [
      "Competitor view",
      "Domain-level keyword overlap",
      "Prompt-level head-to-head with win/loss scoring",
    ],
    ["Citation sources", "Not tracked", "Every cited URL powering answers in your niche"],
    [
      "Output",
      "A dashboard and a CSV",
      "Validated JSON-LD, outreach copy and a shareable report",
    ],
    ["Time to first insight", "Days of crawl and setup", "Under 15 seconds"],
  ];

  return (
    <section
      id="compare"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/40"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>Where legacy tools stop</Eyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Rank trackers measure a page. PulseFlow measures the answer.
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            Classic SEO suites were built for a results page with ten positions.
            Answer engines return one synthesised recommendation and a few
            citations — a different unit of measurement entirely.
          </p>
        </div>

        <div className="mt-11 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[15px]">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-slate-800 p-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500"
                  >
                    Capability
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-800 p-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500"
                  >
                    Traditional SEO suite
                  </th>
                  <th
                    scope="col"
                    className="border-b border-slate-800 p-4 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-indigo-400"
                  >
                    PulseFlow AEO
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([cap, legacy, pulse]) => (
                  <tr key={cap}>
                    <td className="border-b border-slate-800/60 p-4 font-semibold text-white">
                      {cap}
                    </td>
                    <td className="border-b border-slate-800/60 p-4 text-slate-500">
                      {legacy}
                    </td>
                    <td className="border-b border-slate-800/60 bg-indigo-500/[0.07] p-4 text-slate-200">
                      {pulse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          Comparing specific tools? See PulseFlow as a{" "}
          <Link href="/alternative/semrush" className="text-indigo-400 hover:underline">
            Semrush alternative
          </Link>
          ,{" "}
          <Link href="/alternative/ahrefs" className="text-indigo-400 hover:underline">
            Ahrefs alternative
          </Link>
          ,{" "}
          <Link href="/alternative/moz" className="text-indigo-400 hover:underline">
            Moz alternative
          </Link>{" "}
          or{" "}
          <Link href="/alternative/brightedge" className="text-indigo-400 hover:underline">
            BrightEdge alternative
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export function PricingSection({ heading = true }: { heading?: boolean }) {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        {heading && (
          <div className="flex max-w-3xl flex-col gap-4">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Start free. Pay when you&apos;re tracking.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-400">
              Every plan covers all four answer engines — there is no per-engine
              upsell. Audit volume is the only thing that scales.
            </p>
          </div>
        )}

        <div className="mt-11 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col gap-5 rounded-3xl border p-6 ${
                p.featured
                  ? "border-indigo-500/60 bg-gradient-to-b from-indigo-600/10 to-slate-900/60 shadow-2xl shadow-indigo-600/10"
                  : "border-slate-800 bg-slate-900/50"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                  Most popular
                </span>
              )}

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="min-h-[2.6em] text-[13px] leading-relaxed text-slate-500">
                  {p.who}
                </p>
                <p className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tight text-white tabular-nums">
                    {p.display}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {p.cadence}
                  </span>
                </p>
              </div>

              <ul className="flex flex-col gap-2.5 border-t border-slate-800 pt-5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-slate-300"
                  >
                    <Tick />
                    <span>{f}</span>
                  </li>
                ))}
                {p.excluded.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-slate-600 line-through"
                  >
                    <span aria-hidden="true" className="mt-[5px] h-3.5 w-3.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/#audit"
                className={`mt-auto rounded-xl px-4 py-3 text-center text-sm font-bold transition ${
                  p.featured
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                    : "border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-400">
            <strong className="font-bold text-white">Enterprise.</strong> Custom
            audit volumes, security review, data residency and a named AEO
            strategist.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=PulseFlow%20AEO%20enterprise`}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
          >
            Talk to us
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-slate-600">
          Secure checkout via Paystack — cards, Apple Pay and bank transfer.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — native <details>, so it works with zero JavaScript            */
/* ------------------------------------------------------------------ */

export function FaqSection() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/40"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Answer Engine Optimization, explained
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400">
            Short, direct answers — written the way an answer engine likes to
            quote them.
          </p>
        </div>

        <div className="mt-10 border-t border-slate-800/60">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group border-b border-slate-800/60"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold tracking-tight text-white transition hover:text-indigo-300 [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                >
                  <path
                    d="m3 6 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p className="max-w-[74ch] pb-6 text-[15px] leading-[1.7] text-slate-400">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="flex flex-col items-start gap-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/15 via-slate-900/60 to-slate-900/60 p-8 sm:p-12">
        <Eyebrow>Find out in 15 seconds</Eyebrow>
        <h2 className="max-w-[20ch] text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Are you the answer, or the footnote?
        </h2>
        <p className="max-w-[52ch] text-base leading-relaxed text-slate-400">
          Run a high-intent prompt taxonomy for your category across four answer
          engines and get your share of voice, your cited sources and your first
          fixes. Free, no card.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/#audit"
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            Run my free audit
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
          >
            Compare plans
          </Link>
        </div>
      </div>
    </section>
  );
}
