# Related Words Curation Prompt

You are curating `生活詞語` for LearnZhTw, a literacy app for Taiwanese seniors.

Goal:
- For each target character, choose 4-6 short, concrete, everyday Mandarin phrases tied to that character.
- Prefer candidates with resolvable official Taiwanese audio.
- Prefer candidates that already exist in `tai`, `zh`, and `en` locale files.
- Prefer simple, literal, high-frequency phrases over idioms, slang, abstract nouns, or literary wording.

Hard rules:
- Use the provided candidate pool as the default source of truth.
- Only introduce a word outside the candidate pool if the candidate pool is clearly unusable, and call that out in `notes`.
- Prefer 2-4 Han-character phrases.
- Avoid near-duplicates that teach the same situation twice.
- Avoid terms that are likely too rare, too formal, or too domain-specific for a senior daily-life literacy app.
- If there are fewer than 4 strong audio-backed candidates, keep the best daily phrases and explain the gap in `notes`.

Return JSON only in this shape:

```json
{
  "家": {
    "mode": "replace",
    "relatedWords": [
      {
        "emoji": "👨‍👩‍👧",
        "word": "家人",
        "pronunciation": "家人"
      }
    ],
    "notes": "Short note about tradeoffs or remaining audio/locale gaps."
  }
}
```

Output requirements:
- `mode` should usually be `replace`.
- `emoji` should be a simple visual cue, not decorative noise.
- `pronunciation` should stay in Mandarin for the related-words data file unless there is a concrete reason to override it.
- Do not include markdown fences in the final answer when you are asked to produce `approved.json`.
