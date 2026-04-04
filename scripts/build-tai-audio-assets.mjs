#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const archiveRoot = resolve(projectRoot, 'downloads/moe-sutian/sutiau-mp3');
const kautianMappingPath = resolve(projectRoot, 'src/data/moeKautianMapping.json');
const publicAudioDir = resolve(projectRoot, 'public/audio/tai');
const manifestPath = resolve(projectRoot, 'src/data/taiAudioManifest.json');
const unresolvedPath = resolve(projectRoot, 'src/data/taiAudioUnresolved.json');
const concurrency = 8;

function normalize(text) {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function sanitizeFileName(text) {
  return text.replace(/[\\/:*?"<>|]/g, '_');
}

function stripVariantAnnotation(text) {
  return text.replace(/【[^】]*】/g, '');
}

function splitPronunciationVariants(text) {
  return normalize(text)
    .split('/')
    .map((variant) => normalize(variant))
    .filter(Boolean);
}

function dedupeEntries(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (seen.has(entry.entryId)) {
      return false;
    }
    seen.add(entry.entryId);
    return true;
  });
}

function loadDictionaryEntries() {
  if (!existsSync(kautianMappingPath)) {
    throw new Error(`Missing local dictionary mapping: ${kautianMappingPath}. Have you run scripts/generate-kautian-mapping.mjs?`);
  }
  return JSON.parse(readFileSync(kautianMappingPath, 'utf8'));
}

function buildDictionaryIndex(entries) {
  const byRawLabel = new Map();
  const byLookupLabel = new Map();

  for (const entry of entries) {
    const rawEntries = byRawLabel.get(entry.label) ?? [];
    rawEntries.push(entry);
    byRawLabel.set(entry.label, rawEntries);

    const lookupEntries = byLookupLabel.get(entry.lookupLabel) ?? [];
    lookupEntries.push(entry);
    byLookupLabel.set(entry.lookupLabel, lookupEntries);
  }

  return { byRawLabel, byLookupLabel };
}

function filterByPronunciation(entries, pronunciation) {
  const queryVariants = splitPronunciationVariants(pronunciation);
  if (queryVariants.length === 0) {
    return [];
  }

  return entries.filter((entry) =>
    entry.pronunciationVariants.some((variant) => queryVariants.includes(variant)),
  );
}

function serializeMatch(entry) {
  return {
    entryId: entry.entryId,
    entryType: entry.entryType,
    label: entry.label,
    pronunciation: entry.pronunciation,
    audioFileBase: entry.audioFileBase,
  };
}

function parseTaiHelperEntries() {
  const source = readFileSync(resolve(projectRoot, 'src/i18n/locales/tai.ts'), 'utf8');
  const entries = new Map();
  const pattern = /^\s*'([^']+)':\s*\{\s*translation:\s*'([^']*)',\s*pronunciation:\s*'([^']+)'/gm;

  for (const match of source.matchAll(pattern)) {
    entries.set(match[1], {
      translation: normalize(match[2]),
      pronunciation: normalize(match[3]),
    });
  }

  return entries;
}

function collectUsedTerms(helperEntries) {
  const terms = new Map();
  const vocabDir = resolve(projectRoot, 'src/data/vocabulary');
  const files = readdirSync(vocabDir)
    .filter((name) => extname(name) === '.ts' && !['index.ts', 'related-words.ts'].includes(name))
    .sort();

  const add = (term, source) => {
    const key = normalize(term);
    if (!key) return;

    const current = terms.get(key) ?? {
      term: key,
      sources: new Set(),
      translation: helperEntries.get(key)?.translation ?? key,
      pronunciation: helperEntries.get(key)?.pronunciation ?? null,
    };
    current.sources.add(source);
    terms.set(key, current);
  };

  for (const fileName of files) {
    const source = readFileSync(join(vocabDir, fileName), 'utf8');
    for (const match of source.matchAll(/character:\s*'([^']+)'/g)) {
      add(match[1], `${fileName}:character`);
    }
    for (const match of source.matchAll(/contextWord:\s*'([^']+)'/g)) {
      add(match[1], `${fileName}:contextWord`);
    }
  }

  const relatedWordsSource = readFileSync(join(vocabDir, 'related-words.ts'), 'utf8');
  for (const match of relatedWordsSource.matchAll(/rw\(\s*'[^']*'\s*,\s*'([^']+)'/g)) {
    add(match[1], 'related-words.ts:relatedWord');
  }

  return [...terms.values()]
    .sort((left, right) => left.term.localeCompare(right.term, 'zh-Hant'))
    .map((entry) => ({
      term: entry.term,
      translation: entry.translation,
      pronunciation: entry.pronunciation,
      sources: [...entry.sources].sort(),
    }));
}

function localArchivePathForEntry(entry) {
  const numericId = Number(entry.entryId);
  if (!Number.isFinite(numericId)) return null;
  return join(archiveRoot, String(Math.floor(numericId / 1000)), `${entry.audioFileBase}.mp3`);
}

function resolveFromMatches(matches, termInfo, viaPrefix) {
  if (matches.length === 1) {
    return {
      status: 'resolved',
      via: `${viaPrefix}_exact`,
      match: matches[0],
    };
  }

  if (matches.length > 1 && termInfo.pronunciation) {
    const pronunciationMatches = filterByPronunciation(matches, termInfo.pronunciation);

    if (pronunciationMatches.length === 1) {
      return {
        status: 'resolved',
        via: `${viaPrefix}_and_pronunciation_exact`,
        match: pronunciationMatches[0],
      };
    }
  }

  return {
    status: 'ambiguous',
    via: `${viaPrefix}_multiple_exact_matches`,
    matches: matches.map(serializeMatch),
  };
}

function resolveDirectAudio(termInfo, dictionaryIndex) {
  const normalizedTranslation = normalize(termInfo.translation);
  const rawMatches = dedupeEntries(dictionaryIndex.byRawLabel.get(normalizedTranslation) ?? []);

  if (rawMatches.length > 0) {
    return resolveFromMatches(rawMatches, termInfo, 'translation_raw_ods');
  }

  const lookupTranslation = normalize(stripVariantAnnotation(normalizedTranslation));
  const lookupMatches = dedupeEntries(dictionaryIndex.byLookupLabel.get(lookupTranslation) ?? []);

  if (lookupMatches.length > 0) {
    return resolveFromMatches(lookupMatches, termInfo, 'translation_lookup_ods');
  }

  return {
    status: 'unresolved',
    via: 'translation_exact_not_found_in_ods',
    matches: [],
  };
}

async function mapPool(items, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function main() {
  if (!existsSync(archiveRoot)) {
    throw new Error(`Missing local archive: ${archiveRoot}`);
  }

  const dictionaryEntries = loadDictionaryEntries();
  const dictionaryIndex = buildDictionaryIndex(dictionaryEntries);
  const helperEntries = parseTaiHelperEntries();
  const usedTerms = collectUsedTerms(helperEntries);

  console.log(`Loaded ${dictionaryEntries.length} dictionary entries from ${kautianMappingPath}.`);
  console.log(`Resolving direct exact audio for ${usedTerms.length} term(s).`);

  const results = await mapPool(usedTerms, async (termInfo, index) => {
    console.log(`[${index + 1}/${usedTerms.length}] ${termInfo.term}`);
    const resolution = resolveDirectAudio(termInfo, dictionaryIndex);
    return {
      ...termInfo,
      ...resolution,
    };
  });

  rmSync(publicAudioDir, { recursive: true, force: true });
  mkdirSync(publicAudioDir, { recursive: true });

  const manifest = {};
  const unresolved = [];

  for (const item of results) {
    if (item.status !== 'resolved' || !item.match) {
      unresolved.push({
        term: item.term,
        translation: item.translation,
        pronunciation: item.pronunciation,
        sources: item.sources,
        status: item.status,
        via: item.via,
        matches: item.matches ?? [],
      });
      continue;
    }

    const sourcePath = localArchivePathForEntry(item.match);
    if (!sourcePath || !existsSync(sourcePath)) {
      unresolved.push({
        term: item.term,
        translation: item.translation,
        pronunciation: item.pronunciation,
        sources: item.sources,
        status: 'missing_local_archive',
        via: item.via,
        match: item.match,
      });
      continue;
    }

    const fileName = `${sanitizeFileName(item.term)}__${item.match.entryId}.mp3`;
    copyFileSync(sourcePath, join(publicAudioDir, fileName));

    manifest[item.term] = {
      translation: item.translation,
      pronunciation: item.pronunciation,
      entryId: item.match.entryId,
      label: item.match.label,
      url: `/audio/tai/${fileName}`,
      via: item.via,
    };
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(unresolvedPath, `${JSON.stringify(unresolved, null, 2)}\n`);

  console.log('');
  console.log(JSON.stringify({
    total: usedTerms.length,
    resolved: Object.keys(manifest).length,
    unresolved: unresolved.length,
    outputDir: publicAudioDir,
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
