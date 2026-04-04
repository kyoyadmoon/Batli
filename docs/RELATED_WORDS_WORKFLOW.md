# Related Words Workflow

## Goal

為 LearnZhTw 的單字補上高品質、可重用的 `生活詞語` workflow，優先選擇：

- 與目標字有直接關聯的日常詞語
- 可由教育部辭典安全解析到官方台語語音的詞
- 已經存在 `tai` / `zh` / `en` locale 的詞

這個 workflow 刻意分成「候選產生」與「人工或 LLM 審核」兩階段，不直接把字典包含該字的詞全數自動灌入。原因是 MOE 詞庫雖然廣，但不等於適合長者識字教材的生活詞語。

## Files

- `scripts/prepare-related-words-workflow.mjs`
  - 產生缺口報告、候選池、review prompt
- `scripts/apply-related-words-workflow.mjs`
  - 套用審核後的 JSON patch 到 `src/data/vocabulary/related-words.ts`
- `docs/related-words-curation-prompt.md`
  - 供另一個 agent 或 LLM 使用的審核 prompt
- `.codex/skills/related-words-curator/SKILL.md`
  - repo 內 skill，方便後續重跑同樣流程

## Preparation Step

先產生 workset：

```bash
node scripts/prepare-related-words-workflow.mjs --limit 20
```

常用參數：

```bash
node scripts/prepare-related-words-workflow.mjs --chars 家,人,吃
node scripts/prepare-related-words-workflow.mjs --min-related 4 --min-audio 4
node scripts/prepare-related-words-workflow.mjs --all
```

預設輸出到 `tmp/related-words/`：

- `workset.json`
- `prompt.md`

## What The Workset Checks

每個字的 work item 會檢查：

- 現有 `related-words.ts` 是否已有明確生活詞語
- 現有詞語中，有多少可以安全解析到官方台語語音
- 候選詞是否已有 `tai` / `zh` / `en` locale
- 詞是否已在其他主題中作為 `contextWord` 或既有 related word 出現

候選排序大致偏好：

1. 可安全解析官方台語語音
2. 已有 locale 覆蓋
3. 已在課程其他地方出現
4. 2 到 4 個字的短詞
5. 與目標字的 `contextWord` 一致

## Review Step

把 `tmp/related-words/prompt.md` 丟給另一個 agent 或 LLM，要求它只回傳 JSON：

```json
{
  "家": {
    "mode": "replace",
    "relatedWords": [
      { "emoji": "👨‍👩‍👧", "word": "家人", "pronunciation": "家人" }
    ],
    "notes": "Optional"
  }
}
```

審核時的原則：

- 優先保留有台語語音的候選
- 不要只因為字典裡有，就加入太生僻或太抽象的詞
- 避免同一類意思的重複詞，例如只是在「大/小」或方位上微調
- 對長者日常識字場景有幫助的詞優先

## Apply Step

把審核後的 JSON 存成 `tmp/related-words/approved.json`，再套用：

```bash
node scripts/apply-related-words-workflow.mjs tmp/related-words/approved.json
```

若只想先看結果，不落檔：

```bash
node scripts/apply-related-words-workflow.mjs tmp/related-words/approved.json --dry-run
```

`apply` 腳本會額外警告：

- 缺 `tai` locale 的詞
- 缺 `zh` locale 的詞
- 缺 `en` locale 的詞
- 無法安全解析台語音檔的詞

## After Apply

related words 更新後，還要跑一次音檔與基本驗證：

```bash
node scripts/build-tai-audio-assets.mjs
pnpm run typecheck
pnpm run build
```

如果 `apply` 腳本有警告 locale 缺口，請同步補上：

- `src/i18n/locales/tai.ts`
- `src/i18n/locales/zh.ts`
- `src/i18n/locales/en.ts`

## Why This Is Review-First

舊的 `auto-populate-related-words.mjs` 只靠「詞中包含該字」與字典順序挑詞，缺點是：

- 不保證是生活化詞語
- 不保證 locale 已存在
- 不保證台語音檔能安全解析
- 容易整塊覆寫既有資料

新的 workflow 保留 deterministic 候選產生，但把最終選詞交給人工或 LLM 審核，降低資料品質回退的風險。
