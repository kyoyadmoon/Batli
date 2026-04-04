#!/usr/bin/env node

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildDictionaryIndex,
  buildTargetOrderIndex,
  collectTermUsage,
  collectVocabularyTargets,
  hasLocalArchiveFile,
  isSimpleHanWord,
  loadCurrentTaiAudioTerms,
  loadDictionaryEntries,
  loadLocaleCoverage,
  normalize,
  paths,
  projectRoot,
  readRelatedWordsSource,
  resolveTermAudio,
} from './lib/related-words-workflow.mjs';

function parseArgs(argv) {
  const options = {
    chars: [],
    limit: Number.POSITIVE_INFINITY,
    minRelated: 4,
    minAudio: 4,
    maxCandidates: 12,
    outputDir: resolve(projectRoot, 'tmp/related-words'),
    onlyNeedsWork: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--chars') {
      options.chars = argv[index + 1].split(',').map((value) => normalize(value)).filter(Boolean);
      index += 1;
      continue;
    }
    if (arg === '--limit') {
      options.limit = Number.parseInt(argv[index + 1], 10);
      index += 1;
      continue;
    }
    if (arg === '--min-related') {
      options.minRelated = Number.parseInt(argv[index + 1], 10);
      index += 1;
      continue;
    }
    if (arg === '--min-audio') {
      options.minAudio = Number.parseInt(argv[index + 1], 10);
      index += 1;
      continue;
    }
    if (arg === '--max-candidates') {
      options.maxCandidates = Number.parseInt(argv[index + 1], 10);
      index += 1;
      continue;
    }
    if (arg === '--output-dir') {
      options.outputDir = resolve(projectRoot, argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--all') {
      options.onlyNeedsWork = false;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/prepare-related-words-workflow.mjs [options]

Options:
  --chars 家,人,吃           Only prepare the listed characters
  --limit 20                Limit the number of work items in the output
  --min-related 4           Mark characters below this explicit related-word count as needing work
  --min-audio 4             Mark characters below this resolvable tai-audio count as needing work
  --max-candidates 12       Include at most this many candidates per character
  --output-dir tmp/path     Directory for workset.json and prompt.md
  --all                     Include all characters, not only those needing work
  --help                    Show this message
`);
}

function summarizeLocaleCoverage(candidate) {
  const parts = [];
  if (candidate.hasTaiHelper) parts.push('tai');
  if (candidate.hasZhHelper) parts.push('zh');
  if (candidate.hasEnHelper) parts.push('en');
  return parts.length > 0 ? parts.join('/') : 'missing';
}

function buildCandidatePool(target, context) {
  const {
    dictionaryIndex,
    dictionaryEntries,
    localeCoverage,
    termUsage,
    currentTaiAudioTerms,
    relatedWordsMap,
    maxCandidates,
  } = context;

  const candidateWords = new Set();

  for (const entry of dictionaryEntries) {
    const word = normalize(entry.lookupLabel);
    if (word === target.character) continue;
    if (!word.includes(target.character)) continue;
    if (word.length < 2 || word.length > 4) continue;
    if (!isSimpleHanWord(word)) continue;
    candidateWords.add(word);
  }

  for (const item of relatedWordsMap.get(target.character) ?? []) {
    candidateWords.add(item.word);
  }

  if (target.contextWord) {
    candidateWords.add(target.contextWord);
  }

  const candidates = [...candidateWords].map((word) => {
    const taiHelper = localeCoverage.taiWordEntries.get(word);
    const resolution = resolveTermAudio(word, taiHelper?.pronunciation ?? '', dictionaryIndex);
    const hasLocalAudioArchive = Boolean(resolution.match && hasLocalArchiveFile(resolution.match));
    const hasPlayableTaiAudio = currentTaiAudioTerms.has(word) || hasLocalAudioArchive;
    const usage = termUsage.get(word) ?? { contextCount: 0, relatedCount: 0 };
    const isExisting = (relatedWordsMap.get(target.character) ?? []).some((item) => item.word === word);
    const reasons = [];
    let score = 0;

    if (word === target.contextWord) {
      score += 45;
      reasons.push('matches_context_word');
    }
    if (usage.contextCount > 0) {
      score += 24;
      reasons.push('already_used_as_context_word');
    }
    if (usage.relatedCount > 0) {
      score += 12;
      reasons.push('already_used_as_related_word');
    }
    if (isExisting) {
      score += 18;
      reasons.push('already_in_current_map');
    }

    if (hasPlayableTaiAudio) {
      score += 100;
      reasons.push('resolvable_official_tai_audio');
    } else if (resolution.status === 'ambiguous') {
      score += 12;
      reasons.push('audio_exists_but_ambiguous');
    } else {
      score -= 18;
      reasons.push('no_safe_audio_resolution');
    }

    if (currentTaiAudioTerms.has(word)) {
      score += 10;
      reasons.push('already_bundled_in_app');
    }
    if (localeCoverage.taiWordKeys.has(word)) {
      score += 20;
      reasons.push('tai_locale_exists');
    }
    if (localeCoverage.zhWordKeys.has(word)) {
      score += 8;
      reasons.push('zh_locale_exists');
    }
    if (localeCoverage.enWordKeys.has(word)) {
      score += 8;
      reasons.push('en_locale_exists');
    }
    if (word.length === 2) {
      score += 16;
      reasons.push('two_char_phrase');
    } else if (word.length === 3) {
      score += 12;
      reasons.push('three_char_phrase');
    } else if (word.length === 4) {
      score += 6;
      reasons.push('four_char_phrase');
    }
    if (word.startsWith(target.character) || word.endsWith(target.character)) {
      score += 5;
      reasons.push('character_on_phrase_edge');
    }

    return {
      word,
      dictionaryPronunciation: resolution.match?.pronunciation ?? '',
      taiTranslation: taiHelper?.translation ?? '',
      taiPronunciation: taiHelper?.pronunciation ?? '',
      audioStatus: hasPlayableTaiAudio ? 'resolved' : (resolution.status === 'ambiguous' ? 'ambiguous' : 'unresolved'),
      audioVia: currentTaiAudioTerms.has(word)
        ? 'current_app_manifest'
        : (hasLocalAudioArchive ? resolution.via : 'local_archive_missing'),
      currentAppAudio: currentTaiAudioTerms.has(word),
      hasTaiHelper: localeCoverage.taiWordKeys.has(word),
      hasZhHelper: localeCoverage.zhWordKeys.has(word),
      hasEnHelper: localeCoverage.enWordKeys.has(word),
      usage,
      score,
      reasons,
    };
  });

  return candidates
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.word.length !== right.word.length) return left.word.length - right.word.length;
      if (right.usage.contextCount !== left.usage.contextCount) return right.usage.contextCount - left.usage.contextCount;
      return left.word.localeCompare(right.word, 'zh-Hant');
    })
    .slice(0, maxCandidates);
}

function buildPrompt(template, workItems, options) {
  const lines = [
    template.trimEnd(),
    '',
    '## Work Items',
    `Generated at: ${new Date().toISOString()}`,
    `Selection rule: explicit related words < ${options.minRelated} or resolvable tai-audio words < ${options.minAudio}`,
    '',
  ];

  for (const item of workItems) {
    lines.push(`### ${item.character} | ${item.unitTitle || item.unitId || item.fileName}`);
    lines.push(`- Source: ${item.fileName}`);
    lines.push(`- Context word: ${item.contextWord || '(none)'}`);
    lines.push(`- Current related words (${item.currentRelatedWords.length}): ${item.currentRelatedWords.map((entry) => entry.word).join('、') || '(none)'}`);
    lines.push(`- Current audio-ready words (${item.currentAudioReadyWords.length}): ${item.currentAudioReadyWords.map((entry) => entry.word).join('、') || '(none)'}`);
    lines.push('- Candidate shortlist:');

    item.candidatePool.forEach((candidate, index) => {
      lines.push(
        `  ${index + 1}. ${candidate.word} | score=${candidate.score} | audio=${candidate.audioStatus} | locales=${summarizeLocaleCoverage(candidate)} | reasons=${candidate.reasons.join(', ')}`,
      );
    });

    lines.push('```json');
    lines.push(JSON.stringify(item.candidatePool, null, 2));
    lines.push('```');
    lines.push('');
  }

  lines.push('## Output Target');
  lines.push(`Save the approved JSON to ${resolve(options.outputDir, 'approved.json')}`);
  lines.push('Only return JSON that matches the schema in the prompt template.');

  return `${lines.join('\n').trimEnd()}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const dictionaryEntries = loadDictionaryEntries();
  const dictionaryIndex = buildDictionaryIndex(dictionaryEntries);
  const localeCoverage = loadLocaleCoverage();
  const currentTaiAudioTerms = loadCurrentTaiAudioTerms();
  const targets = collectVocabularyTargets();
  const targetOrderIndex = buildTargetOrderIndex(targets);
  const { relatedWords } = readRelatedWordsSource();
  const termUsage = collectTermUsage(targets, relatedWords.entries);

  const selectedTargets = targets.filter((target) =>
    options.chars.length === 0 || options.chars.includes(target.character),
  );

  const workItems = [];

  for (const target of selectedTargets) {
    const currentRelatedWords = relatedWords.entries.get(target.character) ?? [];
    const currentAudioReadyWords = currentRelatedWords.filter((entry) => {
      if (currentTaiAudioTerms.has(entry.word)) {
        return true;
      }

      const taiHelper = localeCoverage.taiWordEntries.get(entry.word);
      const resolution = resolveTermAudio(entry.word, taiHelper?.pronunciation ?? '', dictionaryIndex);
      return Boolean(resolution.match && hasLocalArchiveFile(resolution.match));
    });

    const needsRelatedWords = currentRelatedWords.length < options.minRelated;
    const needsTaiAudio = currentAudioReadyWords.length < options.minAudio;
    if (options.onlyNeedsWork && !needsRelatedWords && !needsTaiAudio) {
      continue;
    }

    const candidatePool = buildCandidatePool(target, {
      dictionaryEntries,
      dictionaryIndex,
      localeCoverage,
      termUsage,
      currentTaiAudioTerms,
      relatedWordsMap: relatedWords.entries,
      maxCandidates: options.maxCandidates,
    });

    workItems.push({
      character: target.character,
      unitId: target.unitId,
      unitTitle: target.unitTitle,
      fileName: target.fileName,
      order: target.order,
      contextWord: target.contextWord,
      contextPronunciation: target.contextPronunciation,
      currentRelatedWords,
      currentAudioReadyWords,
      needsWork: {
        relatedWords: needsRelatedWords,
        taiAudio: needsTaiAudio,
      },
      candidatePool,
    });
  }

  workItems.sort((left, right) => {
    const leftOrder = targetOrderIndex.get(left.character) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = targetOrderIndex.get(right.character) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });

  const limitedItems = Number.isFinite(options.limit) ? workItems.slice(0, options.limit) : workItems;
  const template = readFileSync(paths.promptTemplatePath, 'utf8');

  mkdirSync(options.outputDir, { recursive: true });

  const worksetPath = resolve(options.outputDir, 'workset.json');
  const promptPath = resolve(options.outputDir, 'prompt.md');

  writeFileSync(worksetPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    options: {
      chars: options.chars,
      minRelated: options.minRelated,
      minAudio: options.minAudio,
      maxCandidates: options.maxCandidates,
      onlyNeedsWork: options.onlyNeedsWork,
    },
    items: limitedItems,
  }, null, 2)}\n`);
  writeFileSync(promptPath, buildPrompt(template, limitedItems, options));

  console.log(`Scanned ${selectedTargets.length} character(s).`);
  console.log(`Prepared ${limitedItems.length} work item(s).`);
  console.log(`Wrote ${worksetPath}`);
  console.log(`Wrote ${promptPath}`);
}

main();
