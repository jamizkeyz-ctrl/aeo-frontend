import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PulseFlow AEO Engine";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#030712",
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Clean SVG Bar Chart Icon */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: "32px", fontWeight: 800 }}>
            <span style={{ color: "#ffffff" }}>PulseFlow</span>
            <span style={{ color: "#818cf8", marginLeft: "8px" }}>AEO</span>
          </div>
        </div>

        {/* Main Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#ffffff",
              letterSpacing: "-1.5px",
            }}
          >
            <span>Dominate Brand Citations In </span>
            <span style={{ color: "#818cf8", marginLeft: "14px" }}>AI Search.</span>
          </div>
          <div style={{ fontSize: "24px", color: "#94a3b8", lineHeight: 1.4 }}>
            Real-time Share of Voice benchmarking across ChatGPT, Perplexity & Claude.
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              color: "#c7d2fe",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            30-Prompt Category Audits
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#6ee7b7",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Head-to-Head Benchmarks
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}