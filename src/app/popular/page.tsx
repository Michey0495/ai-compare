import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "人気の比較 - みんなが気になる比較トピック",
  description:
    "AIなんでも比較で人気の比較トピック一覧。iPhone vs Android、Python vs JavaScript、東京 vs 大阪など、話題の比較をAIが徹底分析。",
};

const categories = [
  {
    title: "テクノロジー",
    items: [
      { itemA: "iPhone", itemB: "Android" },
      { itemA: "Mac", itemB: "Windows" },
      { itemA: "ChatGPT", itemB: "Claude" },
      { itemA: "PS5", itemB: "Nintendo Switch" },
    ],
  },
  {
    title: "プログラミング",
    items: [
      { itemA: "Python", itemB: "JavaScript" },
      { itemA: "React", itemB: "Vue.js" },
      { itemA: "TypeScript", itemB: "JavaScript" },
      { itemA: "Docker", itemB: "Kubernetes" },
    ],
  },
  {
    title: "ライフスタイル",
    items: [
      { itemA: "東京", itemB: "大阪" },
      { itemA: "リモートワーク", itemB: "オフィス出社" },
      { itemA: "賃貸", itemB: "持ち家" },
      { itemA: "朝型", itemB: "夜型" },
    ],
  },
  {
    title: "サービス",
    items: [
      { itemA: "Netflix", itemB: "Amazon Prime Video" },
      { itemA: "Uber Eats", itemB: "出前館" },
      { itemA: "Spotify", itemB: "Apple Music" },
      { itemA: "LINE Pay", itemB: "PayPay" },
    ],
  },
  {
    title: "食べ物",
    items: [
      { itemA: "ラーメン", itemB: "うどん" },
      { itemA: "コーヒー", itemB: "紅茶" },
      { itemA: "寿司", itemB: "焼肉" },
      { itemA: "カレー", itemB: "ハンバーグ" },
    ],
  },
  {
    title: "学習",
    items: [
      { itemA: "独学", itemB: "スクール" },
      { itemA: "本", itemB: "動画学習" },
      { itemA: "英語", itemB: "中国語" },
      { itemA: "TOEIC", itemB: "TOEFL" },
    ],
  },
];

export default function PopularPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          人気の<span className="text-rose-400">比較</span>トピック
        </h1>
        <p className="text-white/60 text-base">
          みんなが気になる比較をAIが徹底分析。クリックですぐ比較できます。
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-lg font-bold text-white/80 mb-3">{cat.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cat.items.map((item) => (
                <Link
                  key={`${item.itemA}-${item.itemB}`}
                  href={`/?a=${encodeURIComponent(item.itemA)}&b=${encodeURIComponent(item.itemB)}`}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer flex items-center gap-3"
                >
                  <span className="text-sm text-white/70">{item.itemA}</span>
                  <span className="text-rose-400/60 text-xs font-bold">VS</span>
                  <span className="text-sm text-white/70">{item.itemB}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-block bg-rose-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-rose-400 transition-all duration-200 cursor-pointer"
        >
          自分で比較する
        </Link>
      </div>
    </div>
  );
}
