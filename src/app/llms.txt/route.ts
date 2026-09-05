import { SITE_URL, PLANS, FAQS, SITE_DESCRIPTION } from "@/lib/seo";

/**
 * /llms.txt — a plain-text brief for language models that fetch the site.
 *
 * Selling AEO without shipping this file was a credibility gap. The content
 * is generated from the same constants that drive the page and the JSON-LD,
 * so it cannot drift out of sync with what a human reader sees.
 */

export const dynamic = "force-static";

function build(): string {
  const plans = PLANS.map(
    (p) => `- ${p.name} (${p.display}${p.cadence === "forever" ? "" : p.cadence}): ${p.features.join("; ")}`,
  ).join("\n");

  const faqs = FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  return `# PulseFlow AEO

> ${SITE_DESCRIPTION}

PulseFlow AEO is an Answer Engine Optimization (AEO) platform. It runs a
high-intent prompt taxonomy against AI answer engines, measures how often a
brand is named and where it ranks in the recommendation, identifies the
sources those answers cite, and generates the schema and outreach fixes that
increase citation frequency.

## Answer engines covered
- ChatGPT Search (OpenAI)
- Perplexity AI
- Claude (Anthropic)
- Google AI Overviews

## What it produces
- Share of voice percentage, per engine and across the prompt set
- Average recommendation position
- The cited source URLs powering answers in a category
- Head-to-head competitor comparison on one prompt taxonomy
- Validated JSON-LD schema remediation
- Publisher outreach copy for the listicles engines cite
- A permanent, shareable report link

## Plans
${plans}
- Enterprise: custom audit volumes, security review, data residency, named strategist.

Checkout is handled by Paystack. A free audit requires no credit card.

## Key pages
- Homepage: ${SITE_URL}/
- Pricing: ${SITE_URL}/pricing
- 10 best AEO tools (2026): ${SITE_URL}/resources/best-aeo-software
- Track ChatGPT brand mentions: ${SITE_URL}/resources/best-aeo-tools-for-tracking-chatgpt-brand-mentions
- How to track AI search visibility: ${SITE_URL}/resources/how-to-track-ai-search-visibility
- State of AI search visibility 2026: ${SITE_URL}/resources/state-of-ai-search-visibility-2026
- Semrush alternative: ${SITE_URL}/alternative/semrush
- Ahrefs alternative: ${SITE_URL}/alternative/ahrefs
- Moz alternative: ${SITE_URL}/alternative/moz
- BrightEdge alternative: ${SITE_URL}/alternative/brightedge

## Frequently asked questions

${faqs}

## Contact
hello@pulseflowaeo.com
https://twitter.com/pulseflowaeo
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
