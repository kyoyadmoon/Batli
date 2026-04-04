# LearnZhTw — Project Notes for Claude

## Project Overview

**字學 Batli** — 專為長者設計的繁體中文識字學習 App。
Target audience: elderly users in Taiwan learning to read Traditional Chinese characters.

---

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode) + **Vite 8** + **SWC**
- **React Router DOM 7** — route-based code splitting with `lazy()` + `Suspense`
- **Hanzi Writer 3** — stroke animation & writing practice (CDN data)
- **CSS Modules** — scoped styles with `.module.css` files, no Tailwind
- **pnpm 10** package manager
- **Vitest 4** + **@testing-library/react** for testing
- Deploy target: Vercel

Dependencies are intentionally minimal — no state management library, no CSS framework.

---

## Project Structure

```
src/
├── components/       # Reusable UI — one folder per component with index.ts barrel
│   ├── AppHeader/
│   ├── ContentDrawer/
│   ├── IconButton/
│   ├── NavBar/
│   ├── StrokeCanvas/
│   └── GrowthTree/
├── context/          # React Context providers (state management)
│   ├── LearningContext.tsx   # Learned characters, persisted to localStorage
│   └── TopicMenuContext.tsx  # UI state for topic menu
├── data/             # Curriculum & vocabulary data (all readonly)
│   ├── types.ts             # Core type system (discriminated unions)
│   ├── curriculum.ts        # Root curriculum
│   ├── quiz.ts              # Quiz generation
│   ├── vocabulary/          # 12 unit files + related-words + summary
│   ├── radicalHints.json    # Character → radical + hint mapping
│   ├── radicalHints.ts      # Typed accessor: getRadicalHint()
│   ├── taiAudioManifest.json
│   └── moeKautianMapping.json
├── hooks/            # Custom hooks
│   ├── useSpeech.ts         # Mandarin TTS (Web Speech API)
│   ├── useTaiAudio.ts       # Taiwanese MP3 playback
│   ├── useHanziWriter.ts    # Stroke animation/practice
│   ├── useGuideSpeech.ts    # English narration guide
│   └── useAudioFeedback.ts  # Sound effects
├── i18n/             # Internationalization
│   ├── context.tsx          # HelperLanguageProvider + useHelperLang()
│   ├── types.ts             # HelperLangCode, HelperWord
│   └── locales/             # zh.ts, en.ts, tai.ts + UI subsets
├── pages/            # Route-level components
│   ├── HomePage.tsx
│   ├── ModuleSelectPage.tsx
│   ├── SettingsPage.tsx
│   ├── vocab/               # RecognitionPage, ListeningPage, WritingPage
│   └── zhuyin/              # ZhuyinLearnPage, ZhuyinQuizPage
├── styles/
│   ├── global.css
│   └── tokens.css           # Design system tokens
├── App.tsx           # Root: providers → AppHeader → Outlet
├── router.tsx        # Route definitions with lazy loading
└── main.tsx          # Vite entry
```

---

## Key Conventions

### Imports

- Path alias `@/*` → `src/*`（tsconfig + Vite alias）
- CSS Modules: `import styles from './Component.module.css'`

### Component Pattern

```
ComponentName/
├── ComponentName.tsx        # Named export (not default)
├── ComponentName.module.css # Scoped styles
└── index.ts                 # Barrel: export { ComponentName } from './ComponentName'
```

- Pages use **named exports** with `lazy()` mapping in `router.tsx`
- Props typed with `interface XxxProps`, include `ariaLabel` for interactive elements

### Naming

- **PascalCase**: components, types, interfaces
- **camelCase**: functions, variables, hooks, file names for hooks/utils
- Event handlers: `handle*` internally, `on*` in props

### Styling

- **CSS Modules** only — no inline styles, no Tailwind, no CSS-in-JS
- Use **design tokens** from `tokens.css` (`--color-*`, `--space-*`, `--touch-*`, `--font-size-*`)
- **Responsive**: use `clamp()` instead of media queries
- **Touch targets**: minimum `--touch-min: 64px` (above WCAG 44px)
- **Typography**: `--font-size-base: 24px` — everything is large for elderly users
- Selector style: flat BEM-inspired (`.button`, `.button.lg`, `.button.primary`)

### State Management

Three React Context providers, no external library:
1. **LearningContext** — progress tracking, persisted to `localStorage`
2. **TopicMenuContext** — UI state (ephemeral)
3. **HelperLanguageContext** — i18n settings, persisted to `localStorage`

### TypeScript

- **Strict mode** enabled
- All data interfaces are `readonly`
- Discriminated unions for module types (`ModuleKind: 'zhuyin' | 'vocabulary'`)
- Key types in `src/data/types.ts`: `VocabCharacter`, `VocabUnit`, `VocabRelatedWord`, `QuizQuestion<T>`

### Routing

```
/                                     → HomePage
/settings                             → SettingsPage
/select                               → ModuleSelectPage
/zhuyin/learn/:index                  → ZhuyinLearnPage
/zhuyin/quiz                          → ZhuyinQuizPage
/vocab/:unitId/recognition/:index     → RecognitionPage（看一看）
/vocab/:unitId/listening/:index       → ListeningPage（聽一聽）
/vocab/:unitId/writing/:index         → WritingPage（寫一寫）
```

### Accessibility

- Semantic HTML (`<button>`, `<section>`, `<header>`)
- `aria-label` on icon-only buttons
- `aria-hidden="true"` on decorative emoji
- High contrast colors (WCAG AA)
- All touch targets ≥ 64px

---

## 課程設計原則

### 單元內字序：筆畫由簡至繁

每個單元內的字應盡量按筆畫數由少到多排列。讓學習者先從簡單的字建立信心，再挑戰複雜的字。調整時仍需兼顧主題相關性，但在相關性相近的情況下優先讓筆畫少的字排前面。

### 生活常用字單元（已定案）

現有 11 個主題單元以名詞/動詞為主。新增兩個「生活常用字」單元，收錄日常閱讀中不可或缺的高頻功能字，共 20 字。

- **生活常用字（一）**（描述/指示）：不、了、也、有、在、那、的、和、是、這
- **生活常用字（二）**（意圖/動作）：可、沒、你、到、要、很、都、就、給、會

位置：家庭之後、食物之前，兩個連續放。contextWord 採「口語錨點」策略（如：不要、好了、可以、沒有⋯）。

### 部首提示（已實作）

課程中約 120 字有部首提示，顯示在 RecognitionPage 的插圖卡與生活詞語之間。

- 資料：`src/data/radicalHints.json`（靜態 JSON 映射表，每字標注部首與簡短說明）
- 存取：`src/data/radicalHints.ts`（`getRadicalHint(character)` → `RadicalHint | undefined`）
- 顯示：冷色調 banner，非互動元素，僅在有映射時顯示
- 新增字時需同步維護 `radicalHints.json`（部首即本體的字、功能字不加提示）

### 「讀一讀」閱讀辨識活動（規劃中）

目標族群口語上能使用中文，缺的是文字辨識力。計劃在每個單元結束後加入「讀一讀」活動：

- 呈現用已學字組成的短語/標示（如招牌、菜單、藥袋）
- 學習者辨認聽到的短語對應哪段文字
- 重點是「在短語情境中辨認已學過的字」，而非閱讀理解
- 可搭配實物照片增加真實感

---

## Audio System

### Mandarin TTS — `useSpeech()`
- Web Speech API with `lang: 'zh-TW'`, `rate: 0.85`
- Smart voice selection with fallback
- Watchdog timer, visibility handling, iOS resume recovery

### Taiwanese Audio — `useTaiAudio()`
- MP3 files in `public/audio/tai/`
- Registry: `src/data/taiAudioManifest.json`
- Source: MOE Taiwanese Dictionary (CC BY-ND 3.0 Taiwan)

---

## i18n System

Four helper language modes: `'none' | 'zh' | 'en' | 'tai'`

- `useHelperLang()` returns `t(chineseText)` for lookup, `uiText()` for UI strings
- Locale files lazy-loaded on language change
- Each locale has: `characters` (single char), `words` (compound), `ui` (system strings)
- Files: `src/i18n/locales/{zh,en,tai}.ts` + `{zh,en,tai}-ui.ts`

---

## NPM Scripts

```bash
pnpm dev                    # Vite dev server
pnpm build                  # tsc --noEmit && vite build
pnpm test                   # Vitest watch
pnpm test:run               # Vitest single run
pnpm typecheck              # tsc --noEmit
pnpm related-words:prepare  # Generate workset from MOE dictionary
pnpm related-words:apply    # Apply patch to related-words.ts
```

---

## 生活詞語（Related Words）選詞標準

每個字的「生活詞語」是顯示在學習畫面中的相關詞彙，幫助學習者建立字詞網絡。

### 選詞規則

1. **contextWord 必須排在第一位**
   每個字在 vocabulary 檔案（如 `activities.ts`, `furniture.ts`）中都有一個 `contextWord`，代表該單元的主題詞。這個詞必須出現在 related words 列表的**第一位**，無論是否有台語音。

2. **數量：4–6 個詞**（若候選不足，保留最佳選項即可）

3. **優先選有台語音的詞**（`audioStatus === 'resolved'` in workset）

4. **字數：2–4 漢字為主**（口語短語為佳）

5. **排除條件**：
   - 避免重複教相同情境的詞
   - 避免太罕見、太正式、或過於學術的詞
   - 避免文言/詩詞用語

6. **加分條件**：
   - 已存在於 `tai.ts`、`zh.ts`、`en.ts` locale 檔案
   - 長者日常生活中實際會用到

---

## 新增詞語 patch 格式

`tmp/related-words/patch.json` 的正確格式（每個字為 key，值為陣列，預設 mode 為 replace）：

```json
{
  "走": [
    { "emoji": "🚶", "word": "走路" },
    { "emoji": "🚪", "word": "走廊" }
  ],
  "家": {
    "mode": "merge",
    "relatedWords": [
      { "emoji": "👨‍👩‍👧", "word": "家人" }
    ]
  }
}
```

- 陣列形式 → `mode: "replace"`（取代現有詞語）
- 物件形式 → 可指定 `mode: "merge"`（追加）或 `mode: "replace"`

---

## 完整工作流程（新增課程字詞）

### Step 1：產生候選詞

```bash
pnpm related-words:prepare --chars 字1,字2,字3
```

輸出：`tmp/related-words/workset.json`
- 每個字含 `candidatePool`（MOE 辭典候選詞）
- 每個候選含 `audioStatus`（`resolved` = 有台語音）

### Step 2：建立 patch.json

依照選詞標準，從 workset 的 `candidatePool` 中為每個字選 4–6 個詞，寫入 `tmp/related-words/patch.json`。

**注意**：contextWord（來自 vocabulary 檔案）應放在第一位，即使它不在 candidatePool 中也要手動加入。

### Step 3：套用 patch

```bash
pnpm related-words:apply tmp/related-words/patch.json
```

修改：`src/data/vocabulary/related-words.ts`

### Step 4：建置台語音 manifest

```bash
node scripts/build-tai-audio-assets.mjs
```

- 從 `downloads/moe-sutian/sutiau-mp3/` 複製音檔到 `public/audio/tai/`
- 更新 `src/data/taiAudioManifest.json`
- 需要預先下載 MOE 素材（見下方）

### Step 5：驗證

```bash
pnpm typecheck
```

---

## MOE 台語音素材

- 來源：教育部台灣閩南語常用詞辭典（公開資料，CC BY-ND 3.0 台灣）
- 本地路徑：`downloads/moe-sutian/sutiau-mp3/{id/1000}/{audioFileBase}.mp3`
- 對應表：`src/data/moeKautianMapping.json`（由 `scripts/generate-kautian-mapping.mjs` 產生）
- `downloads/` 已加入 `.gitignore`，不進版本控制
- 公開的 `public/audio/tai/` 音檔視為衍生作品，需保留 MOE 授權標示（見 `public/audio/tai/LICENSE`）

---

## 新增詞語 locale 翻譯

新詞語加入 related-words.ts 後，若要在三種輔助語言中正確顯示，需同步更新：

- `src/i18n/locales/tai.ts`（台語輔助說明）
- `src/i18n/locales/zh.ts`（中文輔助說明）
- `src/i18n/locales/en.ts`（英文輔助說明）

apply script 執行後的 warnings 會列出缺少 locale entry 的詞語，可作為待補清單。
