import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="text-white/60">ページが見つかりませんでした</p>
        <Link
          href="/"
          className="inline-block bg-rose-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-rose-400 transition-all duration-200"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
