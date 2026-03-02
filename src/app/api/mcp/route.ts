import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { CompareResult } from "@/types";

const TOOL_DEFINITION = {
  name: "compare_items",
  description:
    "2つのものをAIが多角的に比較します。商品、サービス、技術、食べ物など何でも比較可能。5つの評価基準でスコア付き比較結果を生成します。",
  inputSchema: {
    type: "object" as const,
    properties: {
      itemA: {
        type: "string",
        description: "比較対象A（例: iPhone, Python, 東京）",
      },
      itemB: {
        type: "string",
        description: "比較対象B（例: Android, JavaScript, 大阪）",
      },
      context: {
        type: "string",
        description: "比較の観点や補足情報（任意）",
      },
    },
    required: ["itemA", "itemB"],
  },
};

export async function GET() {
  return NextResponse.json({
    name: "AIなんでも比較 MCP Server",
    version: "1.0.0",
    tools: [TOOL_DEFINITION],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: [TOOL_DEFINITION] },
      });
    }

    if (body.method === "tools/call") {
      const args = body.params?.arguments ?? {};
      const itemA = String(args.itemA ?? "").trim().slice(0, 100);
      const itemB = String(args.itemB ?? "").trim().slice(0, 100);
      const context = String(args.context ?? "").trim().slice(0, 200);

      if (!itemA || !itemB) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32602, message: "itemA and itemB are required" },
        });
      }

      const anthropic = new Anthropic();
      const contextLine = context ? `\n比較の観点・補足: ${context}` : "";

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `あなたは公平で分析的な比較の専門家です。以下の2つを多角的に比較してください。

比較対象A: ${itemA}
比較対象B: ${itemB}${contextLine}

以下のJSON形式のみで出力してください。マークダウンや説明文は不要です。絵文字は使わないでください。

{
  "category": "比較カテゴリ",
  "summary": "比較の要約（1-2文）",
  "winner": "A" or "B" or "draw",
  "winnerReason": "勝者/引き分けの理由（1文）",
  "criteria": [
    {
      "name": "評価基準名",
      "itemAScore": 1-10,
      "itemBScore": 1-10,
      "itemAComment": "Aについての短評",
      "itemBComment": "Bについての短評"
    }
  ],
  "conclusion": "総合的な結論（2-3文）",
  "recommendation": "どんな人にどちらがおすすめか（1-2文）"
}

criteriaは5つ丁度生成してください。スコアは1-10の整数のみ。`,
          },
        ],
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text : "";

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse AI response");
        }
      }

      const id = nanoid(10);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-compare.ezoai.jp";

      const result: CompareResult = {
        id,
        itemA,
        itemB,
        category: String(parsed.category ?? "一般"),
        summary: String(parsed.summary ?? ""),
        winner: parsed.winner === "A" || parsed.winner === "B" ? parsed.winner : "draw",
        winnerReason: String(parsed.winnerReason ?? ""),
        criteria: Array.isArray(parsed.criteria)
          ? parsed.criteria.slice(0, 5).map((c: Record<string, unknown>) => ({
              name: String(c.name ?? ""),
              itemAScore: Math.min(10, Math.max(1, Number(c.itemAScore) || 5)),
              itemBScore: Math.min(10, Math.max(1, Number(c.itemBScore) || 5)),
              itemAComment: String(c.itemAComment ?? ""),
              itemBComment: String(c.itemBComment ?? ""),
            }))
          : [],
        conclusion: String(parsed.conclusion ?? ""),
        recommendation: String(parsed.recommendation ?? ""),
        createdAt: new Date().toISOString(),
      };

      await kv.set(`compare:${id}`, result, { ex: 60 * 60 * 24 * 30 });

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          meta: {
            resultId: id,
            resultUrl: `${siteUrl}/result/${id}`,
          },
        },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32601, message: "Method not found" },
    });
  } catch (e) {
    console.error("MCP error:", e);
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32603, message: "Internal error" },
    });
  }
}
