# PulseFlow AEO — what shipped, and what you need to do next

Branch: `redesign/aeo-seo-2026` · Commit: `dcbe619` · Repo: `C:\Users\HomePC\Documents\aeo-dashboard`

---

## The headline finding

Your homepage was serving **12,006 bytes of loading spinner** to every crawler. No H1, no copy, no FAQ.

`src/app/page.tsx` was one large `"use client"` component calling `useSearchParams()` inside a `<Suspense>` boundary. That combination tells Next.js to skip server rendering for the whole tree and emit the fallback instead. Everything appeared only after JavaScript booted in a browser.

Googlebot renders JavaScript and mostly coped. **GPTBot, PerplexityBot and ClaudeBot largely do not.** An AEO product was invisible to the exact crawlers it sells visibility for. Adding robots.txt and schema on top of that page would have achieved close to nothing, so the fix came first.

**After: 211,690 bytes of real HTML** in the first response, with the H1, all eight FAQ answers, pricing and the full footer link graph inside it.

---

## Verified before commit

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `next build` | passes, 17 static pages |
| ESLint on all new files | clean (pre-existing `any`/`@ts-ignore` warnings in AuthModal, PricingModal, RemediationTab left untouched) |
| H1 / FAQ / pricing in server HTML | present |
| Heading order | one `h1`, 11 `h2`, 10 `h3` |
| JSON-LD parses | Organization, WebSite, SoftwareApplication, FAQPage, WebPage |
| `/pricing` | 200, with Product + AggregateOffer + BreadcrumbList |
| `/robots.txt` `/llms.txt` | 200, `text/plain` |
| Unknown route | real 404 |
| Horizontal overflow | none at 390px or 1440px |
| Console errors | none |
| Sticky header | works under `overflow-x: clip` |

---

## Files

**New**

- `src/lib/seo.ts` — single source of truth. Site description, plans, FAQ content and all JSON-LD builders. The page, the schema and `llms.txt` all read from here, so they cannot drift apart. Google's structured-data policy requires FAQ markup to match visible text; this makes that structural rather than a promise.
- `src/components/AuditEngine.tsx` — your existing audit workspace, extracted from `page.tsx` unchanged apart from three edits: the workspace heading became an `h2` (it was a second `h1`), the Suspense fallback is now a small inline spinner instead of a full-screen one, and it sets `document.body.dataset.workspace` so the marketing shell can hide via CSS.
- `src/components/SiteHeader.tsx` — client island for auth state, nav and a working mobile menu.
- `src/components/SiteFooter.tsx` — static, 20+ internal links. Every resource and comparison page now gets a site-wide link; previously they had almost none.
- `src/components/marketing/Hero.tsx` — the H1 and the sample-answer panel.
- `src/components/marketing/MarketingSections.tsx` — engine strip, the shift, platform, methodology, comparison table, pricing, FAQ, CTA. All server components.
- `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/pricing/page.tsx`, `src/app/not-found.tsx`.

**Changed**

- `src/app/page.tsx` — server component, 2,320 lines lighter.
- `src/app/layout.tsx` — canonical, unified OG/Twitter image, `keywords` removed, `next/font` for Archivo + Public Sans + JetBrains Mono, skip link.
- `src/app/globals.css` — the old file defined a light palette on `:root` that the hard-coded dark markup never used, and set `font-family: Arial`. Both fixed. Adds the marketing-hide rule and reduced-motion handling.
- `src/app/sitemap.ts` — `/pricing` added; `lastModified` is per-route instead of `new Date()` on every build (which told crawlers the whole site changed each deploy).
- `next.config.ts` — www → apex 301, security headers, `poweredByHeader: false`.

---

## Pricing: I used your real numbers

The audit doc proposed $89 / $279 / $749 from market benchmarks. I did **not** use those. `PricingModal.tsx` charges ₦75,000 and ₦225,000 through Paystack — the live product sells **$0 / $49 / $149**, and putting different numbers on the page than your checkout charges is not a redesign decision I'll make for you.

The benchmark case still stands as a business question. Comparable tools: Otterly $29, Rankscale $20–99, Ahrefs Brand Radar $50, Profound $99 (ChatGPT only), Semrush AI Toolkit $99–199, Peec €89, Scrunch $100–500, AthenaHQ $95–295. At $49 covering four engines you are underpriced against every one of them. If you raise prices, change `PLANS` in `src/lib/seo.ts` **and** the kobo amounts in `PricingModal.tsx` together — the page, the schema and `llms.txt` all follow from `PLANS`.

---

## Three things I need from you

**1. Substantiate or replace the hero stats.** `94.2%`, `< 15s` and `4.2×` are carried over from your current site. They now sit in prominent, crawlable HTML where AI engines can quote them. Sourced numbers get quoted; unsourced ones get ignored, and wrong ones become a liability. Add a methodology note, or replace them. They're in `ProblemSection` in `MarketingSections.tsx`.

~~**2. Decide on the contact address.**~~ Done — `admin@pulseflowaeo.com`, centralised as `CONTACT_EMAIL` in `src/lib/seo.ts` and referenced by the footer, the Enterprise CTA, `llms.txt` and the Organization `contactPoint` schema. One line to change if it ever moves.

**3. Social proof is deliberately absent.** No logos, no testimonials — inventing them would be a trust and legal problem. Those slots belong directly under the hero once you have real, permissioned ones. That's the highest-value empty space on the page right now.

---

## Deploying

The device VM has no network access, so the build ran in the cloud container. Google Fonts is blocked there by egress policy, so I stubbed the three fonts locally to verify everything else. **`next/font/google` works fine in your Vercel pipeline** — your current `layout.tsx` already uses it for Inter. Nothing to change; just be aware the font fetch is the one step I could not exercise here.

```bash
git checkout redesign/aeo-seo-2026
npm run build          # confirm the font fetch succeeds on your machine
npm run start          # spot-check localhost:3000
```

Then merge and deploy. After it's live:

- [ ] `curl https://pulseflowaeo.com/robots.txt` returns plain text, not HTML
- [ ] `curl https://pulseflowaeo.com/llms.txt` returns plain text
- [ ] `curl -sI https://www.pulseflowaeo.com/` returns `301` to the apex
- [ ] `curl -s https://pulseflowaeo.com/ | grep -c "Get cited when AI"` returns `1` — this is the whole point, check it first
- [ ] Rich Results Test on `/` shows FAQ eligibility
- [ ] Add the **apex** property in Google Search Console and Bing Webmaster Tools, submit the sitemap
- [ ] Lighthouse: LCP under 2.5s

One unrelated thing worth doing: `js.paystack.co` loads on every route. Move it to the checkout path only — it costs you Core Web Vitals on the homepage for no reason.

---

## What I did not do

Content. Your sitemap has ten URLs and that's the real ceiling on traffic — technical SEO makes you eligible, content gets you cited. Part 3 of the earlier audit document has the cluster plan: a `/what-is-answer-engine-optimization` pillar page, four more `/alternative/*` pages (Profound, Peec, Otterly, Scrunch), `Article` schema with named authors on the resources, and a quarterly data report built from your own audit corpus. Say the word and I'll start on those.

The pre-existing CRLF line-ending churn across other files is untouched and still unstaged — worth a separate `.gitattributes` commit sometime, but not mixed into this one.
