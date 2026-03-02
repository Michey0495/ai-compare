# ARCHITECTURE.md - AIなんでも比較

## コンセプト
2つのものを入力するとAIが多角的に徹底比較するサービス。SEO集客しやすいコンテンツ型で、比較結果ページが検索エンジンにインデックスされることを想定。

## ページ構成

| パス | 種別 | 説明 |
|------|------|------|
| `/` | Server Component | ランディング + 比較フォーム |
| `/result/[id]` | Server Component (SSR) | 比較結果表示 + OGP + JSON-LD |
| `/api/compare` | API Route | AI比較実行 |
| `/api/mcp` | API Route | MCP Server (JSON-RPC 2.0) |
| `/api/feedback` | API Route | フィードバック → GitHub Issues |

## コンポーネント設計

| コンポーネント | 種別 | 説明 |
|----------------|------|------|
| `CompareForm` | Client | 比較入力フォーム（itemA, itemB, context） |
| `ShareButtons` | Client | X / LINE / リンクコピー |
| `CrossPromo` | Client | ezoai.jp サービス相互リンク |
| `FeedbackWidget` | Client | フィードバック送信 |

## データフロー

```
ユーザー入力 (itemA, itemB, context)
  → POST /api/compare
    → レートリミットチェック (KV: 5回/10分/IP)
    → 入力バリデーション・サニタイズ
    → Claude Haiku 4.5 呼び出し (構造化JSON出力)
    → レスポンスパース・正規化
    → Vercel KV 保存 (compare:{id}, TTL 30日)
    → { id } レスポンス
  → /result/{id} にリダイレクト (SSR)
    → KV からデータ取得
    → generateMetadata() で OGP 生成
    → JSON-LD 構造化データ出力
    → シェアボタン表示
```

## AI出力スキーマ

```typescript
interface CompareResult {
  id: string;
  itemA: string;
  itemB: string;
  category: string;          // 比較カテゴリ
  summary: string;           // 1-2文の要約
  winner: "A" | "B" | "draw";
  winnerReason: string;      // 判定理由
  criteria: Criterion[];     // 5つの評価基準
  conclusion: string;        // 総合評価
  recommendation: string;    // おすすめ
  createdAt: string;
}

interface Criterion {
  name: string;              // 基準名
  itemAScore: number;        // 1-10
  itemBScore: number;        // 1-10
  itemAComment: string;      // Aへの短評
  itemBComment: string;      // Bへの短評
}
```

## MCP Server設計

### エンドポイント: `/api/mcp`

**プロトコル**: JSON-RPC 2.0

**ツール定義**:
- `compare_items`: 2つのものを比較
  - `itemA` (required, string): 比較対象A
  - `itemB` (required, string): 比較対象B
  - `context` (optional, string): 比較の観点

**メソッド**:
- `tools/list`: ツール一覧取得
- `tools/call`: ツール実行

**レスポンス**:
```json
{
  "content": [{ "type": "text", "text": "JSON結果" }],
  "meta": { "resultId": "xxx", "resultUrl": "https://..." }
}
```

## レートリミット
- 5リクエスト / 10分 / IP
- Vercel KV で管理 (`rate:compare:{ip}`)

## デザインシステム
- 背景: #000000 (純黒)
- アクセントカラー: rose-400 / rose-500
- カード: `bg-white/5 border border-white/10 rounded-xl`
- ホバー: `hover:bg-white/10 transition-all duration-200 cursor-pointer`
- テキスト: `text-white`, `text-white/60`, `text-white/40`

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Yes | Claude API キー |
| `KV_REST_API_URL` | Yes | Vercel KV URL |
| `KV_REST_API_TOKEN` | Yes | Vercel KV トークン |
| `NEXT_PUBLIC_SITE_URL` | Yes | サイトURL |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics ID |
| `GITHUB_TOKEN` | No | フィードバック → Issues |
