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
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            📊
          </div>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff" }}>
            PulseFlow <span style={{ color: "#818cf8" }}>AEO</span>
          </span>
        </div>

        {/* Main Heading */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            Dominate Brand Citations In <span style={{ color: "#818cf8" }}>AI Search</span>.
          </div>
          <div style={{ fontSize: "24px", color: "#94a3b8" }}>
            Real-time Share of Voice benchmarking across ChatGPT, Perplexity & Claude.
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "1px solid #4f46e5",
              color: "#c7d2fe",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            ⚡ 30-Prompt Audits
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              border: "1px solid #10b981",
              color: "#6ee7b7",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            ⚔️ Head-to-Head Benchmarks
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}