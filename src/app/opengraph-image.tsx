import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AIなんでも比較 - 2つのものをAIが徹底比較";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>
          <span>AI</span>
          <span style={{ color: "#fb7185" }}>なんでも</span>
          <span>比較</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          2つのものを入力するだけ。AIが5つの観点から徹底比較します。
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 20,
          }}
        >
          {["5評価基準", "10点満点", "AI判定"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px 24px",
                fontSize: 22,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 48,
            fontSize: 18,
            color: "rgba(255,255,255,0.2)",
          }}
        >
          ai-compare.ezoai.jp
        </div>
      </div>
    ),
    { ...size }
  );
}
