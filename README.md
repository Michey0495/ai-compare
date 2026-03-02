# AIなんでも比較

2つのものを入力するだけでAIが多角的に徹底比較するサービス。

## 機能

- 2つの項目を入力 → AIが5つの基準でスコア付き比較
- 勝敗判定（A勝利 / B勝利 / 引き分け）
- 総合評価とおすすめポイント
- SNSシェア（X、LINE、リンクコピー）
- MCP Server でAIエージェントからも利用可能
- SEO最適化（OGP、JSON-LD、sitemap）

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
| `/` | トップ - 比較フォーム |
| `/result/[id]` | 比較結果ページ |

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

### MCP Server: /api/mcp

JSON-RPC 2.0 準拠。ツール `compare_items` を提供。

## AI公開チャネル

- `/.well-known/agent.json` - A2A Agent Card
- `/api/mcp` - MCP Server
- `/llms.txt` - AI向けサイト説明
- `/robots.txt` - AIクローラー許可

## デプロイ

Vercel にデプロイ。ドメイン: ai-compare.ezoai.jp
