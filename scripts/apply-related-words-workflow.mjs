#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import {
  buildDictionaryIndex,
  buildTargetOrderIndex,
  collectVocabularyTargets,
  hasLocalArchiveFile,
  loadCurrentTaiAudioTerms,
  loadDictionaryEntries,
  loadLocaleCoverage,
  normalize,
  paths,
  readRelatedWordsSource,
  resolveTermAudio,
  serializeRelatedWordsLine,
  validateRelatedWordItems,
} from './lib/related-words-workflow.mjs';

function parseArgs(argv) {
  const options = {
    patchPath: '',
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    if (!options.patchPath) {
      options.patchPath = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.patchPath) {
    throw new Error('Patch path is required.');
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/apply-related-words-workflow.mjs <approved.json> [--dry-run]

Input shape:
{
  "家": {
    "mode": "replace",
    "relatedWords": [
      { "emoji": "👨‍👩‍👧", "word": "家人", "pronunciation": "家人" }
    ]
  }
}
`);
}

function normalizePatchEntry(character, payload) {
  if (Array.isArray(payload)) {
    return {
      mode: 'replace',
      relatedWords: validateRelatedWordItems(payload, `${character}.relatedWords`),
    };
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error(`${character} must be an object or array.`);
  }

  return {
    mode: normalize(payload.mode || 'replace'),
    relatedWords: validateRelatedWordItems(payload.relatedWords ?? [], `${character}.relatedWords`),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const rawPatch = JSON.parse(readFileSync(options.patchPath, 'utf8'));
  const { source, relatedWords } = readRelatedWordsSource();
  const targets = collectVocabularyTargets();
  const targetOrderIndex = buildTargetOrderIndex(targets);
  const lines = [...relatedWords.lines];
  const dictionaryIndex = buildDictionaryIndex(loadDictionaryEntries());
  const localeCoverage = loadLocaleCoverage();
  const currentTaiAudioTerms = loadCurrentTaiAudioTerms();

  const patchEntries = new Map();
  for (const [character, payload] of Object.entries(rawPatch)) {
    patchEntries.set(normalize(character), normalizePatchEntry(normalize(character), payload));
  }

  const newCharacters = [];

  for (const [character, payload] of patchEntries.entries()) {
    const existing = relatedWords.entries.get(character) ?? [];
    const nextItems = payload.mode === 'merge'
      ? validateRelatedWordItems([...existing, ...payload.relatedWords], `${character}.relatedWords`)
      : payload.relatedWords;

    const nextLine = serializeRelatedWordsLine(character, nextItems);
    const existingLineIndex = relatedWords.lineIndexes.get(character);

    if (existingLineIndex !== undefined) {
      lines[existingLineIndex] = nextLine;
    } else {
      newCharacters.push({ character, line: nextLine });
    }
  }

  newCharacters.sort((left, right) => {
    const leftOrder = targetOrderIndex.get(left.character) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = targetOrderIndex.get(right.character) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.character.localeCompare(right.character, 'zh-Hant');
  });

  lines.splice(relatedWords.endIndex, 0, ...newCharacters.map((entry) => entry.line));
  const nextSource = `${lines.join('\n')}\n`;

  if (!options.dryRun) {
    writeFileSync(paths.relatedWordsPath, nextSource);
  }

  const warnings = [];
  for (const [character, payload] of patchEntries.entries()) {
    for (const item of payload.relatedWords) {
      if (!localeCoverage.taiWordKeys.has(item.word)) {
        warnings.push(`[${character}] ${item.word}: missing tai locale entry`);
      }
      if (!localeCoverage.zhWordKeys.has(item.word)) {
        warnings.push(`[${character}] ${item.word}: missing zh locale entry`);
      }
      if (!localeCoverage.enWordKeys.has(item.word)) {
        warnings.push(`[${character}] ${item.word}: missing en locale entry`);
      }

      const taiHelper = localeCoverage.taiWordEntries.get(item.word);
      const resolution = resolveTermAudio(item.word, taiHelper?.pronunciation ?? '', dictionaryIndex);
      const hasPlayableTaiAudio = currentTaiAudioTerms.has(item.word)
        || Boolean(resolution.match && hasLocalArchiveFile(resolution.match));
      if (!hasPlayableTaiAudio) {
        warnings.push(`[${character}] ${item.word}: tai audio ${resolution.status} (${resolution.via})`);
      }
    }
  }

  console.log(`${options.dryRun ? 'Dry run prepared' : 'Updated'} ${paths.relatedWordsPath}`);
  console.log(`Patched ${patchEntries.size} character(s).`);

  if (warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }
}

main();
