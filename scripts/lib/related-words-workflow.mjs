import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(__dirname, '..', '..');

export const paths = {
  relatedWordsPath: resolve(projectRoot, 'src/data/vocabulary/related-words.ts'),
  vocabDir: resolve(projectRoot, 'src/data/vocabulary'),
  mappingPath: resolve(projectRoot, 'src/data/moeKautianMapping.json'),
  taiAudioManifestPath: resolve(projectRoot, 'src/data/taiAudioManifest.json'),
  taiLocalePath: resolve(projectRoot, 'src/i18n/locales/tai.ts'),
  zhLocalePath: resolve(projectRoot, 'src/i18n/locales/zh.ts'),
  enLocalePath: resolve(projectRoot, 'src/i18n/locales/en.ts'),
  audioArchiveRoot: resolve(projectRoot, 'downloads/moe-sutian/sutiau-mp3'),
  promptTemplatePath: resolve(projectRoot, 'docs/related-words-curation-prompt.md'),
};

export function normalize(text = '') {
  return String(text).normalize('NFC').replace(/\s+/g, ' ').trim();
}

export function stripVariantAnnotation(text) {
  return normalize(text).replace(/【[^】]*】/g, '');
}

export function splitPronunciationVariants(text) {
  return normalize(text)
    .split('/')
    .map((variant) => normalize(variant))
    .filter(Boolean);
}

function unescapeTsString(text) {
  return text.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
}

export function escapeTsString(text) {
  return text.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

export function loadJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function loadDictionaryEntries() {
  if (!existsSync(paths.mappingPath)) {
    throw new Error(`Missing dictionary mapping: ${paths.mappingPath}. Run node scripts/generate-kautian-mapping.mjs first.`);
  }

  return loadJson(paths.mappingPath);
}

export function buildDictionaryIndex(entries) {
  const byRawLabel = new Map();
  const byLookupLabel = new Map();

  for (const entry of entries) {
    const rawLabel = normalize(entry.label);
    const lookupLabel = normalize(entry.lookupLabel);

    const rawEntries = byRawLabel.get(rawLabel) ?? [];
    rawEntries.push(entry);
    byRawLabel.set(rawLabel, rawEntries);

    const lookupEntries = byLookupLabel.get(lookupLabel) ?? [];
    lookupEntries.push(entry);
    byLookupLabel.set(lookupLabel, lookupEntries);
  }

  return { byRawLabel, byLookupLabel };
}

function dedupeEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.entryId)) return false;
    seen.add(entry.entryId);
    return true;
  });
}

function filterByPronunciation(entries, pronunciation) {
  const queryVariants = splitPronunciationVariants(pronunciation);
  if (queryVariants.length === 0) return [];

  return entries.filter((entry) =>
    entry.pronunciationVariants.some((variant) => queryVariants.includes(variant)),
  );
}

export function localArchivePathForEntry(entry) {
  const numericId = Number(entry?.entryId);
  if (!Number.isFinite(numericId) || !entry?.audioFileBase) return null;
  return join(paths.audioArchiveRoot, String(Math.floor(numericId / 1000)), `${entry.audioFileBase}.mp3`);
}

export function hasLocalArchiveFile(entry) {
  const archivePath = localArchivePathForEntry(entry);
  return Boolean(archivePath && existsSync(archivePath));
}

function resolveFromMatches(matches, pronunciation, viaPrefix) {
  if (matches.length === 1) {
    return {
      status: 'resolved',
      via: `${viaPrefix}_exact`,
      match: matches[0],
      matches,
    };
  }

  if (matches.length > 1 && pronunciation) {
    const pronunciationMatches = filterByPronunciation(matches, pronunciation);
    if (pronunciationMatches.length === 1) {
      return {
        status: 'resolved',
        via: `${viaPrefix}_and_pronunciation_exact`,
        match: pronunciationMatches[0],
        matches: pronunciationMatches,
      };
    }
  }

  return {
    status: matches.length > 0 ? 'ambiguous' : 'unresolved',
    via: matches.length > 0 ? `${viaPrefix}_multiple_exact_matches` : `${viaPrefix}_not_found`,
    match: null,
    matches,
  };
}

export function resolveTermAudio(term, pronunciation, dictionaryIndex) {
  const normalizedTerm = normalize(term);
  const rawMatches = dedupeEntries(dictionaryIndex.byRawLabel.get(normalizedTerm) ?? []);
  if (rawMatches.length > 0) {
    return resolveFromMatches(rawMatches, pronunciation, 'translation_raw_ods');
  }

  const lookupTerm = stripVariantAnnotation(normalizedTerm);
  const lookupMatches = dedupeEntries(dictionaryIndex.byLookupLabel.get(lookupTerm) ?? []);
  if (lookupMatches.length > 0) {
    return resolveFromMatches(lookupMatches, pronunciation, 'translation_lookup_ods');
  }

  return {
    status: 'unresolved',
    via: 'translation_exact_not_found_in_ods',
    match: null,
    matches: [],
  };
}

function parseWordEntryMap(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const entries = new Map();
  const pattern = /^\s*'([^']+)':\s*\{\s*translation:\s*'([^']*)'(?:,\s*pronunciation:\s*'([^']+)')?/gm;

  for (const match of source.matchAll(pattern)) {
    const key = normalize(match[1]);
    if (key.length <= 1) continue;

    entries.set(key, {
      translation: normalize(match[2] ?? ''),
      pronunciation: normalize(match[3] ?? ''),
    });
  }

  return entries;
}

function parseWordKeySet(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const keys = new Set();
  const pattern = /^\s*'([^']+)':\s*\{/gm;

  for (const match of source.matchAll(pattern)) {
    const key = normalize(match[1]);
    if (key.length > 1) {
      keys.add(key);
    }
  }

  return keys;
}

export function loadLocaleCoverage() {
  const taiWordEntries = parseWordEntryMap(paths.taiLocalePath);

  return {
    taiWordEntries,
    taiWordKeys: new Set(taiWordEntries.keys()),
    zhWordKeys: parseWordKeySet(paths.zhLocalePath),
    enWordKeys: parseWordKeySet(paths.enLocalePath),
  };
}

export function loadCurrentTaiAudioTerms() {
  if (!existsSync(paths.taiAudioManifestPath)) {
    return new Set();
  }

  return new Set(Object.keys(loadJson(paths.taiAudioManifestPath)));
}

export function collectVocabularyTargets() {
  const files = readdirSync(paths.vocabDir)
    .filter((name) => extname(name) === '.ts' && !['index.ts', 'related-words.ts', 'summary.ts'].includes(name))
    .sort();

  const targets = [];

  for (const fileName of files) {
    const source = readFileSync(join(paths.vocabDir, fileName), 'utf8');
    const unitId = normalize(source.match(/id:\s*'([^']+)'/)?.[1] ?? '');
    const unitTitle = normalize(source.match(/title:\s*'([^']+)'/)?.[1] ?? '');
    const blockPattern = /\{([\s\S]*?character:\s*'([^']+)'[\s\S]*?)\n\s*\},?/g;

    for (const match of source.matchAll(blockPattern)) {
      const block = match[1];
      const character = normalize(match[2]);
      const order = Number.parseInt(block.match(/order:\s*(\d+)/)?.[1] ?? '-1', 10);

      if (!character || !Number.isFinite(order) || order < 0) continue;

      targets.push({
        character,
        contextWord: normalize(block.match(/contextWord:\s*'([^']+)'/)?.[1] ?? ''),
        contextPronunciation: normalize(block.match(/contextPronunciation:\s*'([^']+)'/)?.[1] ?? ''),
        fileName,
        unitId,
        unitTitle,
        order,
      });
    }
  }

  return targets.sort((left, right) => {
    const unitCompare = left.fileName.localeCompare(right.fileName);
    if (unitCompare !== 0) return unitCompare;
    return left.order - right.order;
  });
}

function parseRwArray(arrayText) {
  const items = [];
  const pattern = /rw\(\s*'((?:\\'|\\\\|[^'])*)'\s*,\s*'((?:\\'|\\\\|[^'])*)'(?:\s*,\s*'((?:\\'|\\\\|[^'])*)')?\s*\)/g;

  for (const match of arrayText.matchAll(pattern)) {
    const emoji = unescapeTsString(match[1]);
    const word = unescapeTsString(match[2]);
    const pronunciation = unescapeTsString(match[3] ?? word);
    items.push({ emoji, word, pronunciation });
  }

  return items;
}

function parseNamedRwMap(source, mapName) {
  const lines = source.split('\n');
  const startIndex = lines.findIndex((line) => line.includes(`const ${mapName}`));
  if (startIndex === -1) {
    throw new Error(`Could not find ${mapName} in ${paths.relatedWordsPath}`);
  }

  let endIndex = startIndex + 1;
  while (endIndex < lines.length && lines[endIndex].trim() !== '};') {
    endIndex += 1;
  }

  if (endIndex >= lines.length) {
    throw new Error(`Could not find end of ${mapName} in ${paths.relatedWordsPath}`);
  }

  const entries = new Map();
  const lineIndexes = new Map();

  for (let index = startIndex + 1; index < endIndex; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*([^:\s][^:]*)\s*:\s*\[(.*)\],?\s*$/);
    if (!match) continue;
    if (match[1].startsWith('//')) continue;

    const key = normalize(match[1].replaceAll("'", ''));
    const items = parseRwArray(match[2]);
    entries.set(key, items);
    lineIndexes.set(key, index);
  }

  return {
    lines,
    startIndex,
    endIndex,
    entries,
    lineIndexes,
  };
}

export function readRelatedWordsSource() {
  const source = readFileSync(paths.relatedWordsPath, 'utf8');

  return {
    source,
    relatedWords: parseNamedRwMap(source, 'RELATED_WORDS_BY_CHARACTER'),
    audioSupplements: parseNamedRwMap(source, 'AUDIO_SUPPLEMENTS_BY_CHARACTER'),
  };
}

export function serializeRelatedWordsLine(character, items) {
  const calls = items.map((item) => {
    const emoji = escapeTsString(normalize(item.emoji || '📘'));
    const word = escapeTsString(normalize(item.word));
    const pronunciation = normalize(item.pronunciation || item.word);

    if (pronunciation === normalize(item.word)) {
      return `rw('${emoji}', '${word}')`;
    }

    return `rw('${emoji}', '${word}', '${escapeTsString(pronunciation)}')`;
  });

  return `  ${character}: [${calls.join(', ')}],`;
}

export function buildTargetOrderIndex(targets) {
  return new Map(targets.map((target, index) => [target.character, index]));
}

export function collectTermUsage(targets, relatedWordsMap) {
  const usage = new Map();

  const touch = (term, bucket) => {
    const key = normalize(term);
    if (!key) return;

    const current = usage.get(key) ?? { contextCount: 0, relatedCount: 0 };
    current[bucket] += 1;
    usage.set(key, current);
  };

  for (const target of targets) {
    touch(target.contextWord, 'contextCount');
  }

  for (const items of relatedWordsMap.values()) {
    for (const item of items) {
      touch(item.word, 'relatedCount');
    }
  }

  return usage;
}

export function isSimpleHanWord(word) {
  return /^[\p{Script=Han}]+$/u.test(word);
}

export function validateRelatedWordItems(items, label) {
  if (!Array.isArray(items)) {
    throw new Error(`${label} must be an array.`);
  }

  const deduped = [];
  const seenWords = new Set();

  for (const [index, item] of items.entries()) {
    if (!item || typeof item !== 'object') {
      throw new Error(`${label}[${index}] must be an object.`);
    }

    const word = normalize(item.word);
    if (!word) {
      throw new Error(`${label}[${index}].word is required.`);
    }

    if (seenWords.has(word)) continue;
    seenWords.add(word);

    deduped.push({
      emoji: normalize(item.emoji || '📘'),
      word,
      pronunciation: normalize(item.pronunciation || word),
    });
  }

  if (deduped.length === 0) {
    throw new Error(`${label} must contain at least one related word.`);
  }

  return deduped;
}
