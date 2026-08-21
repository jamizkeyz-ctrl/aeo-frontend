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
          backgroundImage: "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #0f172a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            📊
          </div>
          <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>
            PulseFlow <span style={{ color: "#818cf8" }}>AEO</span>
          </span>
        </div>

        {/* Main Pitch */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-2px",
            }}
          >
            Own Your Brand’s Voice In <span style={{ color: "#818cf8" }}>AI Search</span>.
          </div>
          <div style={{ fontSize: "24px", color: "#94a3b8", lineHeight: 1.4 }}>
            Real-time Share of Voice benchmarking across ChatGPT, Perplexity, Claude & Google AI Overviews.
          </div>
        </div>

        {/* Bottom Metrics Pill */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.4)",
              color: "#a5b4fc",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            ⚡ 30-Prompt Citation Audits
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
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