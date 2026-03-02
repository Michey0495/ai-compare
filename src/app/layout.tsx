import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import CrossPromo from "@/components/CrossPromo";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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
    default: "AIなんでも比較 - 2つのものをAIが徹底比較【無料・登録不要】",
  },
  description:
    "2つのものを入力するだけでAIが5つの観点×10点満点で徹底比較。iPhone vs Android、Python vs JavaScript、東京 vs 大阪など何でもOK。スコア付きの比較結果を10秒で生成。無料・登録不要。",
  keywords: [
    "AI比較",
    "比較ツール",
    "AI分析",
    "商品比較",
    "技術比較",
    "徹底比較",
    "AIツール",
    "なんでも比較",
    "VS",
    "どっちがいい",
    "比較サイト",
    "AI 無料",
    "スコア比較",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "AIなんでも比較 - 何でも2つ入れるだけでAIが徹底比較",
    description:
      "2つのものを入力するだけでAIが5つの観点×10点満点で徹底比較。スコア付きの比較結果を10秒で生成。無料・登録不要。",
    url: siteUrl,
    siteName: "AIなんでも比較",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIなんでも比較 - 何でも2つ入れるだけでAIが徹底比較",
    description:
      "2つのものを入力するだけでAIが5つの観点×10点満点で徹底比較。スコア付きの比較結果を10秒で生成。無料・登録不要。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
      </head>
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
