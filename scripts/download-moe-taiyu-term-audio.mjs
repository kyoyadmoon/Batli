#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const baseUrl = 'https://sutian.moe.edu.tw';
const defaultOutputDir = resolve(projectRoot, 'downloads/moe-sutian/used-terms');
const defaultManifestPath = resolve(defaultOutputDir, 'manifest.json');
const localArchiveRoot = resolve(projectRoot, 'downloads/moe-sutian/sutiau-mp3');

function parseArgs(argv) {
  const options = {
    dryRun: false,
    includeCharacters: false,
    limit: Number.POSITIVE_INFINITY,
    outputDir: defaultOutputDir,
    manifestPath: defaultManifestPath,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--include-characters') {
      options.includeCharacters = true;
      continue;
    }

    if (arg === '--limit') {
      const value = Number(argv[index + 1] ?? '');
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid value for --limit: ${argv[index + 1] ?? '(missing)'}`);
      }
      options.limit = value;
      index += 1;
      continue;
    }

    if (arg === '--output-dir') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Missing value for --output-dir');
      }
      options.outputDir = resolve(projectRoot, value);
      options.manifestPath = resolve(options.outputDir, 'manifest.json');
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function decodeHtml(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .trim();
}

function parseTaiHelperEntries() {
  const taiLocalePath = resolve(projectRoot, 'src/i18n/locales/tai.ts');
  const source = readFileSync(taiLocalePath, 'utf8');
  const map = new Map();
  const entryPattern = /^\s*'([^']+)':\s*\{\s*translation:\s*'([^']*)',\s*pronunciation:\s*'([^']+)'/gm;

  for (const match of source.matchAll(entryPattern)) {
    const term = match[1];
    const translation = match[2];
    const pronunciation = match[3];
    map.set(term, { translation, pronunciation });
  }

  return map;
}

function normalizeWhitespace(text) {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function sanitizeFileName(text) {
  return text.replace(/[\\/:*?"<>|]/g, '_');
}

function collectTerms(options, helperEntries) {
  const terms = new Map();
  const vocabDir = resolve(projectRoot, 'src/data/vocabulary');
  const files = readdirSync(vocabDir)
    .filter((name) => extname(name) === '.ts' && !['index.ts', 'related-words.ts'].includes(name))
    .sort();

  const addTerm = (term, sourceLabel) => {
    const cleaned = normalizeWhitespace(term);
    if (!cleaned) return;
    if (!options.includeCharacters && cleaned.length <= 1) return;

    const current = terms.get(cleaned) ?? { term: cleaned, sources: new Set() };
    current.sources.add(sourceLabel);
    terms.set(cleaned, current);
  };

  for (const fileName of files) {
    const source = readFileSync(join(vocabDir, fileName), 'utf8');

    for (const match of source.matchAll(/contextWord:\s*'([^']+)'/g)) {
      addTerm(match[1], `${fileName}:contextWord`);
    }

    if (options.includeCharacters) {
      for (const match of source.matchAll(/character:\s*'([^']+)'/g)) {
        addTerm(match[1], `${fileName}:character`);
      }
    }
  }

  const relatedWordsSource = readFileSync(join(vocabDir, 'related-words.ts'), 'utf8');
  for (const match of relatedWordsSource.matchAll(/rw\(\s*'[^']*'\s*,\s*'([^']+)'(?:\s*,\s*'[^']+')?\s*\)/g)) {
    addTerm(match[1], 'related-words.ts:relatedWord');
  }

  return [...terms.values()]
    .sort((left, right) => left.term.localeCompare(right.term, 'zh-Hant'))
    .slice(0, options.limit)
    .map((entry) => ({
      term: entry.term,
      sources: [...entry.sources].sort(),
      translation: helperEntries.get(entry.term)?.translation ?? entry.term,
      pronunciation: helperEntries.get(entry.term)?.pronunciation ?? null,
    }));
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'LearnZhTw selective audio downloader/1.0',
      'accept-language': 'zh-TW,zh;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

function extractSearchSection(html, queryType, matchType) {
  const startLabel = queryType === 'hua_su'
    ? matchType === 'exact'
      ? '完全符合對應華語'
      : '對應華語、釋義或例句華語欄位符合'
    : matchType === 'exact'
      ? '完全符合 「'
      : '部分符合 「';

  const endLabel = queryType === 'hua_su'
    ? matchType === 'exact'
      ? '對應華語、釋義或例句華語欄位符合'
      : '<h2 class="bg-dark bg-opacity-10 h5 p-2 rounded">搜尋辭典</h2>'
    : matchType === 'exact'
      ? '部分符合 「'
      : '<h2 class="bg-dark bg-opacity-10 h5 p-2 rounded">搜尋辭典</h2>';

  const startIndex = html.indexOf(startLabel);
  if (startIndex === -1) return '';

  const endIndex = html.indexOf(endLabel, startIndex);
  return endIndex === -1 ? html.slice(startIndex) : html.slice(startIndex, endIndex);
}

async function searchEntries({ queryType, query, matchType }) {
  const searchUrl = `${baseUrl}/zh-hant/tshiau/?lui=${queryType}&tsha=${encodeURIComponent(query)}`;
  const html = await fetchText(searchUrl);
  const section = extractSearchSection(html, queryType, matchType);
  const entries = new Map();
  const anchorPattern = /<a href="\/zh-hant\/su\/(\d+)\/">\s*([^<]+?)\s*<\/a>/g;

  for (const match of section.matchAll(anchorPattern)) {
    const entryId = match[1];
    const label = normalizeWhitespace(decodeHtml(match[2]));
    entries.set(entryId, { entryId, label, searchUrl, queryType, query, matchType });
  }

  return {
    searchUrl,
    entries: [...entries.values()],
  };
}

async function loadEntry(entryId) {
  const entryUrl = `${baseUrl}/zh-hant/su/${entryId}/`;
  const html = await fetchText(entryUrl);
  const match = html.match(
    /<ul class="fs-4 fw-bold list-inline">[\s\S]*?<span>([^<]+)<\/span><button[^>]*data-src="([^"]+\.mp3)"/,
  );

  if (!match) {
    throw new Error(`Unable to parse entry page: ${entryUrl}`);
  }

  const pronunciation = normalizeWhitespace(decodeHtml(match[1]));
  const audioPath = decodeHtml(match[2]);

  return {
    entryId,
    entryUrl,
    label: null,
    pronunciation,
    audioPath,
    audioUrl: new URL(audioPath, baseUrl).href,
  };
}

function chooseCandidate(term, candidates, expectedTranslation, expectedPronunciation) {
  if (candidates.length === 0) {
    return {
      status: 'not_found',
      reason: 'No dictionary candidate found for the term.',
    };
  }

  const chooseSingle = (filtered, status) => {
    const unique = new Map(filtered.map((candidate) => [candidate.entryId, candidate]));
    if (unique.size === 1) {
      return {
        status,
        candidate: [...unique.values()][0],
      };
    }
    return null;
  };

  const translationLabelExact = candidates.filter(
    (candidate) => candidate.label === expectedTranslation && candidate.matchType === 'exact',
  );
  const translationLabelExactChoice = chooseSingle(
    translationLabelExact,
    'matched_translation_label_exact',
  );
  if (translationLabelExactChoice) return translationLabelExactChoice;

  const termLabelExact = candidates.filter(
    (candidate) => candidate.label === term && candidate.matchType === 'exact',
  );
  const termLabelExactChoice = chooseSingle(termLabelExact, 'matched_term_label_exact');
  if (termLabelExactChoice) return termLabelExactChoice;

  if (expectedPronunciation) {
    const normalizedExpected = normalizeWhitespace(expectedPronunciation);
    const pronunciationExactMatches = candidates.filter(
      (candidate) => candidate.matchType === 'exact'
        && normalizeWhitespace(candidate.pronunciation) === normalizedExpected,
    );

    const pronunciationExactChoice = chooseSingle(
      pronunciationExactMatches,
      'matched_pronunciation_exact',
    );
    if (pronunciationExactChoice) {
      return pronunciationExactChoice;
    }

    const pronunciationMatches = candidates.filter(
      (candidate) => normalizeWhitespace(candidate.pronunciation) === normalizedExpected,
    );
    const pronunciationChoice = chooseSingle(
      pronunciationMatches,
      'matched_pronunciation_any',
    );
    if (pronunciationChoice) {
      return {
        ...pronunciationChoice,
      };
    }
  }

  const translationLabelChoice = chooseSingle(
    candidates.filter((candidate) => candidate.label === expectedTranslation),
    'matched_translation_label_any',
  );
  if (translationLabelChoice) return translationLabelChoice;

  const termLabelChoice = chooseSingle(
    candidates.filter((candidate) => candidate.label === term),
    'matched_term_label_any',
  );
  if (termLabelChoice) return termLabelChoice;

  return {
    status: 'ambiguous',
    reason: 'Multiple candidates remain after label/pronunciation filtering.',
  };
}

function localArchivePathForEntry(entryId, audioPath) {
  const fileName = basename(audioPath);
  if (!fileName.endsWith('.mp3')) return null;

  const numericId = Number(entryId);
  if (!Number.isFinite(numericId)) return null;

  return join(localArchiveRoot, String(Math.floor(numericId / 1000)), `${entryId}(1).mp3`);
}

function writeManifest(manifestPath, items, summary, options) {
  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        options: {
          dryRun: options.dryRun,
          includeCharacters: options.includeCharacters,
          limit: Number.isFinite(options.limit) ? options.limit : null,
        },
        summary,
        items,
      },
      null,
      2,
    )}\n`,
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  mkdirSync(options.outputDir, { recursive: true });

  const helperEntries = parseTaiHelperEntries();
  const terms = collectTerms(options, helperEntries);
  const results = [];
  const summary = {
    totalTerms: terms.length,
    downloaded: 0,
    reused: 0,
    ambiguous: 0,
    notFound: 0,
    failed: 0,
  };

  console.log(
    `Resolving ${terms.length} term(s) from project data (${options.includeCharacters ? 'with' : 'without'} single-character items).`,
  );

  for (const [index, item] of terms.entries()) {
    const progress = `[${index + 1}/${terms.length}]`;
    const expectedPronunciation = item.pronunciation;
    const expectedTranslation = item.translation;

    try {
      console.log(`${progress} Searching ${item.term}`);
      const searchPlans = [
        expectedTranslation ? { queryType: 'tai_su', query: expectedTranslation, matchType: 'exact' } : null,
        expectedPronunciation ? { queryType: 'tai_su', query: expectedPronunciation, matchType: 'exact' } : null,
        { queryType: 'hua_su', query: item.term, matchType: 'exact' },
        expectedTranslation ? { queryType: 'tai_su', query: expectedTranslation, matchType: 'partial' } : null,
        expectedPronunciation ? { queryType: 'tai_su', query: expectedPronunciation, matchType: 'partial' } : null,
        { queryType: 'hua_su', query: item.term, matchType: 'partial' },
      ].filter(Boolean);

      const searchRecords = [];
      const candidateMap = new Map();

      for (const plan of searchPlans) {
        const search = await searchEntries(plan);
        searchRecords.push({
          searchUrl: search.searchUrl,
          queryType: plan.queryType,
          query: plan.query,
          matchType: plan.matchType,
          resultCount: search.entries.length,
        });

        for (const entry of search.entries) {
          if (!candidateMap.has(entry.entryId)) {
            candidateMap.set(entry.entryId, entry);
          }
        }
      }

      const candidates = [];
      for (const record of candidateMap.values()) {
        const loaded = await loadEntry(record.entryId);
        candidates.push({
          ...loaded,
          label: record.label,
          matchType: record.matchType,
          queryType: record.queryType,
          query: record.query,
          searchUrl: record.searchUrl,
        });
      }

      const choice = chooseCandidate(
        item.term,
        candidates,
        expectedTranslation,
        expectedPronunciation,
      );

      if (!choice.candidate) {
        if (candidates.length === 0) {
          summary.notFound += 1;
        } else {
          summary.ambiguous += 1;
        }
        results.push({
          term: item.term,
          sources: item.sources,
          status: candidates.length === 0 ? 'not_found' : 'ambiguous',
          expectedTranslation,
          expectedPronunciation,
          searches: searchRecords,
          reason: choice.reason,
          candidates,
        });
        writeManifest(options.manifestPath, results, summary, options);
        continue;
      }

      const selected = choice.candidate;
      const fileName = `${sanitizeFileName(item.term)}__${selected.entryId}.mp3`;
      const outputPath = join(options.outputDir, fileName);
      const localSourcePath = localArchivePathForEntry(selected.entryId, selected.audioPath);
      const usedLocalCopy = Boolean(localSourcePath && existsSync(localSourcePath));
      let status = options.dryRun ? 'resolved' : 'downloaded';

      if (!options.dryRun) {
        if (existsSync(outputPath)) {
          summary.reused += 1;
          status = 'reused';
        } else if (usedLocalCopy) {
          copyFileSync(localSourcePath, outputPath);
          summary.downloaded += 1;
          status = 'copied_from_local_archive';
        } else {
          throw new Error(`Local archive file not found for entry ${selected.entryId}: ${localSourcePath ?? '(unresolved)'}`);
        }
      }

      results.push({
        term: item.term,
        sources: item.sources,
        status,
        selectionMethod: choice.status,
        expectedTranslation,
        expectedPronunciation,
        label: selected.label,
        resolvedPronunciation: selected.pronunciation,
        entryId: selected.entryId,
        entryUrl: selected.entryUrl,
        audioUrl: selected.audioUrl,
        copySourcePath: usedLocalCopy ? localSourcePath : null,
        fileName,
        fileSizeBytes: !options.dryRun && existsSync(outputPath) ? statSync(outputPath).size : null,
        searches: searchRecords,
      });
      writeManifest(options.manifestPath, results, summary, options);
    } catch (error) {
      summary.failed += 1;
      results.push({
        term: item.term,
        sources: item.sources,
        status: 'failed',
        expectedPronunciation,
        error: error instanceof Error ? error.message : String(error),
      });
      writeManifest(options.manifestPath, results, summary, options);
    }
  }

  console.log('');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`Manifest: ${options.manifestPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
