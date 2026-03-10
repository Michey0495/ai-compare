# Changelog

## 2026-03-11 - 保守メンテナンス

### Fixed
- フィードバックAPIのエラーハンドリング改善（エラー時に正しくエラーレスポンスを返すように）
- GitHub API呼び出し失敗時の適切なエラー返却（502レスポンス）

### Changed
- CrossPromoコンポーネントのアクセントカラーを他サービスと統一
- パッチ依存パッケージ更新（eslint, @types/node）

### Checked
- ビルド: OK（TypeScriptエラーなし、ESLintエラーなし）
- 脆弱性: 0件（npm audit clean）
- GitHub Issues: 0件
- AI公開ファイル: 全て正常（robots.txt, llms.txt, agent.json）
