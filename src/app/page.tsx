import { CompareForm } from "@/components/CompareForm";

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
        <CompareForm />
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

      <div className="mt-12 space-y-3">
        <p className="text-white/30 text-xs text-center tracking-widest uppercase">
          比較できるもの
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "商品 vs 商品",
            "プログラミング言語",
            "フレームワーク",
            "食べ物",
            "都市 vs 都市",
            "サービス比較",
            "学習方法",
            "仕事術",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
