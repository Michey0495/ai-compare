import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { CompareResult } from "@/types";
import { ShareButtons } from "@/components/ShareButtons";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-compare.ezoai.jp";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getResult(id: string): Promise<CompareResult | null> {
  return kv.get<CompareResult>(`compare:${id}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) return { title: "比較結果が見つかりません" };

  const winnerText =
    result.winner === "A"
      ? `${result.itemA}の勝利`
      : result.winner === "B"
        ? `${result.itemB}の勝利`
        : "引き分け";

  const title = `${result.itemA} vs ${result.itemB} - ${winnerText}`;
  const description = result.summary;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | AIなんでも比較`,
      description,
      url: `${siteUrl}/result/${id}`,
      siteName: "AIなんでも比較",
      type: "article",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AIなんでも比較`,
      description,
    },
  };
}

function ScoreBar({ score, accent, label }: { score: number; accent: string; label: string }) {
  const pct = (score / 10) * 100;
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={score} aria-valuemin={1} aria-valuemax={10} aria-label={`${label}: ${score}/10`}>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${accent}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-white/80 w-6 text-right">{score}</span>
    </div>
  );
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const totalA = result.criteria.reduce((sum, c) => sum + c.itemAScore, 0);
  const totalB = result.criteria.reduce((sum, c) => sum + c.itemBScore, 0);

  const winnerLabel =
    result.winner === "A"
      ? result.itemA
      : result.winner === "B"
        ? result.itemB
        : "引き分け";

  const shareText = `「${result.itemA}」vs「${result.itemB}」をAIが徹底比較! 結果: ${winnerLabel}`;
  const shareUrl = `${siteUrl}/result/${id}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center space-y-2 mb-8">
        <p className="text-white/40 text-sm">{result.category}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          <span className="text-rose-400">{result.itemA}</span>
          <span className="text-white/30 mx-3">vs</span>
          <span className="text-rose-400">{result.itemB}</span>
        </h1>
        <p className="text-white/60 text-base leading-relaxed">{result.summary}</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-center flex-1 ${result.winner === "A" ? "relative" : ""}`}>
            {result.winner === "A" && (
              <div className="text-xs font-bold text-rose-400 mb-1">WIN</div>
            )}
            <div className={`text-2xl font-bold ${result.winner === "A" ? "text-rose-400" : "text-white"}`}>
              {result.itemA}
            </div>
            <div className={`text-3xl font-bold mt-1 ${result.winner === "A" ? "text-rose-400" : "text-white/60"}`}>
              {totalA}
            </div>
            <div className="text-white/40 text-xs">/ 50</div>
          </div>
          <div className="text-center px-4">
            <div
              className={`text-lg font-bold px-4 py-2 rounded-xl ${
                result.winner === "draw"
                  ? "bg-white/10 text-white/60"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {result.winner === "draw" ? "DRAW" : "VS"}
            </div>
          </div>
          <div className={`text-center flex-1 ${result.winner === "B" ? "relative" : ""}`}>
            {result.winner === "B" && (
              <div className="text-xs font-bold text-rose-400 mb-1">WIN</div>
            )}
            <div className={`text-2xl font-bold ${result.winner === "B" ? "text-rose-400" : "text-white"}`}>
              {result.itemB}
            </div>
            <div className={`text-3xl font-bold mt-1 ${result.winner === "B" ? "text-rose-400" : "text-white/60"}`}>
              {totalB}
            </div>
            <div className="text-white/40 text-xs">/ 50</div>
          </div>
        </div>
        <p className="text-white/50 text-sm text-center">{result.winnerReason}</p>
      </div>

      <div className="space-y-4 mb-6">
        {result.criteria.map((c, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="text-sm font-bold text-white mb-3">{c.name}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-white/50">{result.itemA}</div>
                <ScoreBar score={c.itemAScore} accent="bg-rose-400" label={`${result.itemA} - ${c.name}`} />
                <p className="text-xs text-white/40 mt-1">{c.itemAComment}</p>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-white/50">{result.itemB}</div>
                <ScoreBar score={c.itemBScore} accent="bg-white/60" label={`${result.itemB} - ${c.name}`} />
                <p className="text-xs text-white/40 mt-1">{c.itemBComment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="text-lg font-bold text-white">総合評価</h2>
        <p className="text-white/60 text-sm leading-relaxed">{result.conclusion}</p>
        <p className="text-white/50 text-sm leading-relaxed">{result.recommendation}</p>
      </div>

      <ShareButtons shareText={shareText} shareUrl={shareUrl} />

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block bg-white/10 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer"
        >
          別のものを比較する
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${result.itemA} vs ${result.itemB} - AI比較`,
            description: result.summary,
            author: {
              "@type": "Organization",
              name: "Ghostfee",
            },
            datePublished: result.createdAt,
            publisher: {
              "@type": "Organization",
              name: "AIなんでも比較",
              url: siteUrl,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
