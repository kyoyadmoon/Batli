# 字學 Batli

A web app for learning everyday Traditional Chinese characters, designed for elderly users (65+) in Taiwan.

Large fonts, large touch targets, simplified flows, voice assistance, and instant feedback — built to lower the digital learning barrier for seniors.

## Features

- **看一看 (Look)** — Character recognition with Zhuyin and contextual vocabulary
- **聽一聽 (Listen)** — Audio-based character quizzes with auto-play and replay
- **寫一寫 (Write)** — Stroke order animation and handwriting practice
- **Life Topics** — 12 thematic units: family, food, transportation, health, numbers & time, and more
- **Helper Languages** — Choose Chinese, English, or Taiwanese Hokkien as the helper display language
- **Taiwanese Audio** — Native speaker recordings in Taiwanese Hokkien helper mode

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Hanzi Writer](https://hanziwriter.org/) — Stroke order animation and writing practice
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — Mandarin text-to-speech
- Primary public deployment target: GitHub Pages
- Optional deployment config retained via `vercel.json`
- Learning progress stored in browser localStorage

## Getting Started

```bash
pnpm install
pnpm dev
```

Build and preview:

```bash
pnpm build
pnpm preview
```

Run tests:

```bash
pnpm test
```

## Deployment

The primary public release target is GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

`vercel.json` remains in the repository for optional dual deployment, but Vercel is no longer the default public release target.

- GitHub repository: [kyoyadmoon/Batli](https://github.com/kyoyadmoon/Batli)
- Planned GitHub Pages URL: [kyoyadmoon.github.io/Batli](https://kyoyadmoon.github.io/Batli/)

## Taiwanese Audio Build Pipeline

The project automates processing of the Taiwanese Hokkien audio corpus. If you update the source files (e.g., `downloads/kautian.ods`) or add new vocabulary, run these scripts in order:

1. **Generate mapping JSON** — Produces a lookup table (`src/data/moeKautianMapping.json`) from the raw corpus.
   ```bash
   node scripts/generate-kautian-mapping.mjs
   ```

2. **Build audio assets and manifest** — Copies matching audio files for vocabulary used in the app to `public/audio/tai/` and generates the runtime manifest.
   ```bash
   node scripts/build-tai-audio-assets.mjs
   ```

Generated support files are intentionally gitignored:

- `src/data/moeKautianMapping.json` — local build-time lookup table regenerated from `downloads/kautian.ods`
- `src/data/taiAudioUnresolved.json` — local report of unresolved audio matches from the asset build step

## License

Source code is licensed under the [MIT License](LICENSE).

Third-party resources are subject to their own licenses — see below.

## Credits & Third-Party Licenses

### Taiwanese Audio

Audio files are sourced from:

> **Ministry of Education, R.O.C. (Taiwan) — Taiwanese Hokkien Dictionary**
> (教育部《臺灣台語常用詞辭典》)
> https://sutian.moe.edu.tw

Licensed under [CC BY-ND 3.0 Taiwan](https://creativecommons.org/licenses/by-nd/3.0/tw/).
All audio files included in this project are unmodified originals, redistributed in compliance with the license.

See [`public/audio/tai/LICENSE`](public/audio/tai/LICENSE) for details.

### Character Stroke Data

Stroke animations powered by [Hanzi Writer](https://hanziwriter.org/) (MIT).
Character data originates from [Make Me a Hanzi](https://github.com/skishore/makemeahanzi),
dual-licensed under [LGPL-3.0](https://www.gnu.org/licenses/lgpl-3.0.html) and
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Stroke data is fetched at runtime from CDN and is not bundled in this repository.

### Curriculum Content

Thematic vocabulary, Zhuyin annotations, and curriculum design are original to this project.

## Project Documentation

- [`PRD.md`](PRD.md) — Product Requirements Document
- [`PLAN.md`](PLAN.md) — Public release and deployment checklist
- [`docs/PROJECT_STANDARDS.md`](docs/PROJECT_STANDARDS.md) — UI/UX and engineering standards
- [`docs/CURRICULUM_PROPOSAL.md`](docs/CURRICULUM_PROPOSAL.md) — Curriculum design proposal
- [`docs/RELATED_WORDS_WORKFLOW.md`](docs/RELATED_WORDS_WORKFLOW.md) — Related words curation workflow
- [`docs/related-words-curation-prompt.md`](docs/related-words-curation-prompt.md) — Review prompt for related words curation
- [`docs/illustration-prompt.md`](docs/illustration-prompt.md) — Illustration prompt system for generated vocabulary images
