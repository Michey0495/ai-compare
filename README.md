# AIなんでも比較

2つのものを入力するだけでAIが多角的に徹底比較するサービス。

## 機能

- 2つの項目を入力 → AIが5つの基準でスコア付き比較
- 勝敗判定（A勝利 / B勝利 / 引き分け）
- 総合評価とおすすめポイント
- SNSシェア（X、LINE、リンクコピー）
- MCP Server でAIエージェントからも利用可能
- SEO最適化（OGP動的画像、JSON-LD、sitemap）
- Google Analytics 対応
- 人気の比較トピックページ
- クリック可能な比較例（URLパラメータ連携）

## 技術スタック

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Claude Haiku 4.5
- Vercel KV
- Vercel (hosting)

## セットアップ

```bash
npm install
```

### 環境変数

`.env.local` を作成:

```
ANTHROPIC_API_KEY=your-api-key
KV_REST_API_URL=your-kv-url
KV_REST_API_TOKEN=your-kv-token
NEXT_PUBLIC_SITE_URL=https://ai-compare.ezoai.jp
NEXT_PUBLIC_GA_ID=your-ga-id (optional)
```

### 開発

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## ページ構成

| パス | 説明 |
|------|------|
| `/` | トップ - 比較フォーム + 比較例 |
| `/popular` | 人気の比較トピック一覧 |
| `/result/[id]` | 比較結果ページ（動的OGP画像付き） |

## API

### POST /api/compare

```json
{
  "itemA": "iPhone",
  "itemB": "Android",
  "context": "コスパ重視"
}
```

Response: `{ "id": "xxxxxxxxxx" }`

### POST /api/feedback

フィードバック送信 → GitHub Issues

### MCP Server: /api/mcp

JSON-RPC 2.0 準拠。ツール `compare_items` を提供。

## AI公開チャネル

- `/.well-known/agent.json` - A2A Agent Card
- `/api/mcp` - MCP Server
- `/llms.txt` - AI向けサイト説明
- `/robots.txt` - AIクローラー許可

## デプロイ

Vercel にデプロイ。ドメイン: ai-compare.ezoai.jp

## 開発進捗

### Night 1 (完了)
- コア機能: 比較フォーム、API、結果ページ
- MCP Server
- AI公開チャネル (llms.txt, agent.json, robots.txt)
- フィードバックウィジェット
- CrossPromo (ezoai.jp サービス相互リンク)
- ShareButtons (X, LINE, リンクコピー)
- SEOメタデータ、JSON-LD、sitemap

### Night 2 (完了)
- Google Analytics 統合
- 動的OGP画像生成 (トップ + 各結果ページ)
- クリック可能な比較例 (URLパラメータでフォームにプリフィル)
- 比較中のローディングメッセージアニメーション
- 結果ページの勝敗表示改善 (勝者が視覚的に明確)
- 人気の比較トピックページ (/popular) - SEO強化
- sitemap.xml に /popular 追加
- llms.txt にPages セクション追加

### 残りのタスク
- なし（主要機能すべて実装済み）
