import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import type { CompareResult } from "@/types";

export const runtime = "edge";
export const alt = "AIなんでも比較 - 比較結果";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await kv.get<CompareResult>(`compare:${id}`);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          AIなんでも比較
        </div>
      ),
      { ...size }
    );
  }

  const totalA = result.criteria.reduce((sum, c) => sum + c.itemAScore, 0);
  const totalB = result.criteria.reduce((sum, c) => sum + c.itemBScore, 0);
  const winnerLabel =
    result.winner === "A"
      ? result.itemA
      : result.winner === "B"
        ? result.itemB
        : "引き分け";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          color: "#fff",
          padding: "48px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }}>
            {result.category}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#fb7185",
                textAlign: "center",
                lineHeight: 1.2,
                maxWidth: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {result.itemA}
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#fb7185",
                marginTop: 12,
              }}
            >
              {totalA}
            </span>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>/ 50</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "rgba(255,255,255,0.2)",
              }}
            >
              VS
            </span>
            <div
              style={{
                display: "flex",
                background:
                  result.winner === "draw"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(251,113,133,0.2)",
                color:
                  result.winner === "draw"
                    ? "rgba(255,255,255,0.6)"
                    : "#fb7185",
                fontSize: 22,
                fontWeight: 700,
                padding: "8px 20px",
                borderRadius: 12,
              }}
            >
              {result.winner === "draw" ? "DRAW" : `${winnerLabel} WIN`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                lineHeight: 1.2,
                maxWidth: 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {result.itemB}
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "rgba(255,255,255,0.6)",
                marginTop: 12,
              }}
            >
              {totalB}
            </span>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)" }}>/ 50</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
            AIなんでも比較
          </span>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.2)" }}>
            ai-compare.ezoai.jp
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
