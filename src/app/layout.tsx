import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import CrossPromo from "@/components/CrossPromo";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-compare.ezoai.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | AIなんでも比較",
    default: "AIなんでも比較 - 2つのものをAIが徹底比較",
  },
  description:
    "2つのものを入力するだけでAIが多角的に徹底比較。商品、サービス、技術、食べ物など何でもOK。スコア付きの詳細な比較結果をすぐに生成。",
  keywords: [
    "AI比較",
    "比較ツール",
    "AI分析",
    "商品比較",
    "技術比較",
    "徹底比較",
    "AIツール",
    "なんでも比較",
  ],
  openGraph: {
    title: "AIなんでも比較 - 2つのものをAIが徹底比較",
    description:
      "2つのものを入力するだけでAIが多角的に徹底比較。スコア付きの詳細な比較結果をすぐに生成。",
    url: siteUrl,
    siteName: "AIなんでも比較",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIなんでも比較 - 2つのものをAIが徹底比較",
    description:
      "2つのものを入力するだけでAIが多角的に徹底比較。スコア付きの詳細な比較結果をすぐに生成。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <CrossPromo current="AIなんでも比較" />
          <footer className="text-center py-6 text-white/30 text-sm">
            <p>AIなんでも比較 by Ghostfee — ai-compare.ezoai.jp</p>
          </footer>
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
        <FeedbackWidget />
      </body>
    </html>
  );
}
