import { Suspense } from "react";
import { CompareForm } from "@/components/CompareForm";

const exampleComparisons = [
  { itemA: "iPhone", itemB: "Android", context: "" },
  { itemA: "Python", itemB: "JavaScript", context: "学習しやすさ重視" },
  { itemA: "東京", itemB: "大阪", context: "住みやすさ" },
  { itemA: "Netflix", itemB: "Amazon Prime Video", context: "" },
  { itemA: "リモートワーク", itemB: "オフィス出社", context: "" },
  { itemA: "Mac", itemB: "Windows", context: "クリエイター向け" },
];

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          AI<span className="text-rose-400">なんでも</span>比較
        </h1>
        <p className="text-white/60 text-lg leading-relaxed">
          2つのものを入力するだけ。AIが5つの観点から徹底比較します。
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <Suspense fallback={<div className="h-64" />}>
          <CompareForm />
        </Suspense>
      </div>

      <div className="mt-12 space-y-3">
        <p className="text-white/30 text-xs text-center tracking-widest uppercase">
          こんな比較ができます
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleComparisons.map((ex) => (
            <a
              key={`${ex.itemA}-${ex.itemB}`}
              href={`/?a=${encodeURIComponent(ex.itemA)}&b=${encodeURIComponent(ex.itemB)}${ex.context ? `&c=${encodeURIComponent(ex.context)}` : ""}`}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center gap-3"
            >
              <span className="text-sm text-white/70">{ex.itemA}</span>
              <span className="text-rose-400/60 text-xs font-bold">VS</span>
              <span className="text-sm text-white/70">{ex.itemB}</span>
              {ex.context && (
                <span className="text-xs text-white/30 ml-auto">{ex.context}</span>
              )}
            </a>
          ))}
        </div>
        <div className="text-center mt-3">
          <a
            href="/popular"
            className="text-sm text-white/40 hover:text-white/60 transition-all duration-200 cursor-pointer"
          >
            もっと見る →
          </a>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-rose-400 text-2xl font-bold mb-2">5</div>
          <div className="text-white/60 text-sm">評価基準で多角的に分析</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-rose-400 text-2xl font-bold mb-2">10</div>
          <div className="text-white/60 text-sm">点満点のスコアリング</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-rose-400 text-2xl font-bold mb-2">AI</div>
          <div className="text-white/60 text-sm">が公平に判定</div>
        </div>
      </div>
    </div>
  );
}
