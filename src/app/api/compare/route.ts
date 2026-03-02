import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { CompareResult } from "@/types";

const RATE_LIMIT = 5;
const RATE_WINDOW = 600;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate:compare:${ip}`;
  const count = (await kv.get<number>(key)) ?? 0;
  if (count >= RATE_LIMIT) return false;
  await kv.set(key, count + 1, { ex: RATE_WINDOW });
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "利用制限に達しました。10分後に再度お試しください。" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const itemA = String(body.itemA ?? "").trim().slice(0, 100);
    const itemB = String(body.itemB ?? "").trim().slice(0, 100);
    const context = String(body.context ?? "").trim().slice(0, 200);

    if (!itemA || !itemB) {
      return NextResponse.json(
        { error: "比較する2つの項目を入力してください。" },
        { status: 400 }
      );
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
  "category": "比較カテゴリ（例: テクノロジー、食品、サービス等）",
  "summary": "比較の要約（1-2文）",
  "winner": "A" or "B" or "draw",
  "winnerReason": "勝者/引き分けの理由（1文）",
  "criteria": [
    {
      "name": "評価基準名",
      "itemAScore": 1-10の整数,
      "itemBScore": 1-10の整数,
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

    return NextResponse.json({ id });
  } catch (e) {
    console.error("Compare API error:", e);
    return NextResponse.json(
      { error: "比較の生成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
