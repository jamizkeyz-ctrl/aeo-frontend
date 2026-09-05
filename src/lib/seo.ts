/**
 * Central SEO / AEO constants and JSON-LD builders.
 *
 * Everything answer engines read about PulseFlow is defined here so the
 * entity description stays identical across pages, schema, llms.txt and
 * the marketing copy. Divergent descriptions are the fastest way to lose
 * an entity match.
 */

export const SITE_URL = "https://pulseflowaeo.com";
export const SITE_NAME = "PulseFlow AEO";
export const TWITTER = "@pulseflowaeo";
export const CONTACT_EMAIL = "admin@pulseflowaeo.com";

export const SITE_DESCRIPTION =
  "Answer Engine Optimization platform that measures your brand's share of voice across ChatGPT, Perplexity, Claude and Google AI Overviews, then generates the JSON-LD schema and outreach fixes that get you cited.";

export const ENGINES = [
  "ChatGPT Search",
  "Perplexity AI",
  "Claude",
  "Google AI Overviews",
] as const;

/** Live plans. Amounts must stay in sync with PricingModal's Paystack charges. */
export const PLANS = [
  {
    id: "free",
    name: "Starter",
    priceUSD: 0,
    display: "$0",
    cadence: "forever",
    who: "For a first look at where your brand stands.",
    features: [
      "3 evaluation audits per month",
      "Single-brand AEO visibility",
      "Top cited sources discovery",
      "Shareable report link",
    ],
    excluded: ["Head-to-head benchmarking"],
    cta: "Run a free audit",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceUSD: 49,
    display: "$49",
    cadence: "/month",
    who: "For in-house marketing teams tracking one brand continuously.",
    features: [
      "50 audits and comparisons per month",
      "Head-to-head competitor benchmarking",
      "Automated JSON-LD schema generator",
      "Listicle outreach conquest templates",
    ],
    excluded: [],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    priceUSD: 149,
    display: "$149",
    cadence: "/month",
    who: "For agencies running AEO across a client roster.",
    features: [
      "Unlimited audits and comparisons",
      "Executive white-label PDF export",
      "Weekly automated citation monitoring",
      "Multi-client workspace seats",
    ],
    excluded: [],
    cta: "Upgrade to Agency",
    featured: false,
  },
] as const;

/**
 * Homepage FAQ. Rendered as visible HTML *and* as FAQPage schema from this
 * one source, so the markup can never drift from what a reader sees —
 * which is what Google's structured-data policy requires.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Answer Engine Optimization (AEO)?",
    a: "Answer Engine Optimization (AEO) is the practice of getting your brand named and cited inside AI-generated answers — the responses ChatGPT, Perplexity, Claude and Google AI Overviews produce instead of a list of links. Where SEO optimises for a ranked position on a results page, AEO optimises for inclusion in a single synthesised recommendation: structured data an engine can parse, clear entity definitions, comparison content that answers buyer questions directly, and presence on the third-party sources engines already cite.",
  },
  {
    q: "How is share of voice calculated?",
    a: "Share of voice is the percentage of tracked prompts in which your brand appears in the answer, weighted by recommendation position. PulseFlow runs a structured buyer-intent prompt taxonomy against every engine, parses each response for brand entities, and records whether you were named and where in the recommendation order. A brand named first in 20 of 30 answers scores higher than one mentioned last in all 30.",
  },
  {
    q: "Which AI answer engines does PulseFlow track?",
    a: "ChatGPT Search, Perplexity AI, Claude and Google AI Overviews. Engines are queried live rather than read from a cache, so a report reflects what a buyer would see the moment you run it. Every plan, including the free audit, covers all four.",
  },
  {
    q: "How do the remediation tools increase citations?",
    a: "They close the three gaps that keep engines from citing you: unparseable markup, missing entity definitions, and absence from the sources engines already trust. Each audit returns validated JSON-LD for your pages, the listicles and third-party media currently powering citations in your niche, and outreach copy for reaching them.",
  },
  {
    q: "Is the initial audit really free?",
    a: "Yes. You can run a single-brand audit or a head-to-head comparison with no credit card. You get the full share-of-voice breakdown, the cited-source list and a permanent shareable report link.",
  },
  {
    q: "How is AEO different from SEO — do I still need both?",
    a: "You need both, and they share a foundation. Answer engines still crawl the web and still favour crawlable, well-structured, authoritative pages. What differs is the target: SEO wins a ranked position, AEO wins a mention. Ranking third for a keyword does nothing if the engine's answer names three competitors and stops. AEO work layers on top of the SEO you already do.",
  },
  {
    q: "How often should I re-run an audit?",
    a: "Monthly at minimum, weekly if your category is competitive. Answers drift as models are updated and as competitors publish, so a one-off score goes stale within weeks. The Agency plan re-runs tracked brands automatically every week and alerts you when your share of voice moves.",
  },
  {
    q: "Can agencies use PulseFlow for client reporting?",
    a: "Yes. The Agency plan includes unlimited audits, multi-client workspace seats, executive white-label PDF export and weekly automated monitoring, so each client gets its own tracked brand and its own branded report.",
  },
];

type Graph = Record<string, unknown>;

export function organizationSchema(): Graph {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-banner.png`,
      width: 1200,
      height: 630,
    },
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT_EMAIL,
      url: `${SITE_URL}/pricing`,
    },
    sameAs: ["https://twitter.com/pulseflowaeo"],
  };
}

export function websiteSchema(): Graph {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function softwareApplicationSchema(): Graph {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Answer Engine Optimization",
    operatingSystem: "Web",
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    featureList: [
      "Share of voice auditing across AI answer engines",
      "Head-to-head competitor benchmarking",
      "Automated JSON-LD schema remediation",
      "Cited source discovery",
      "Weekly automated citation monitoring",
      "Executive white-label PDF export",
    ],
    offers: PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: String(p.priceUSD),
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
      availability: "https://schema.org/InStock",
    })),
  };
}

export function faqSchema(): Graph {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): Graph {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

/** Wrap nodes into a single @graph document. */
export function graph(...nodes: Graph[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
