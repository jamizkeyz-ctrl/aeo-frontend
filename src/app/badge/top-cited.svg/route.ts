import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const svg = `<svg width="220" height="40" viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="220" height="40" rx="8" fill="#090D1A" stroke="#312E81" stroke-width="1.5"/>
  <rect x="1" y="1" width="58" height="38" rx="7" fill="#1E1B4B"/>
  <path d="M12 20h3l2-5 3 10 3-6 2 4 2-3h3" stroke="#818CF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="38" cy="20" r="7" stroke="#A855F7" stroke-width="1.5" fill="#312E81"/>
  <text x="35" y="23" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#E0E7FF">&#8220;</text>
  <text x="39" y="23" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="900" fill="#E0E7FF">&#8221;</text>
  <line x1="60" y1="8" x2="60" y2="32" stroke="#3730A3" stroke-width="1"/>
  <text x="72" y="16" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="800" fill="#818CF8" letter-spacing="0.6">PULSEFLOW AEO</text>
  <text x="72" y="29" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#34D399">#1 Top Cited Entity</text>
</svg>`.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
    },
  });
}