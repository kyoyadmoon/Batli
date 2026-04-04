import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const mappingPath = path.resolve(projectRoot, 'src/data/moeKautianMapping.json');
const relatedWordsPath = path.resolve(projectRoot, 'src/data/vocabulary/related-words.ts');
const vocabDir = path.resolve(projectRoot, 'src/data/vocabulary');

if (!fs.existsSync(mappingPath)) {
  console.error(`Error: Cannot find mapping JSON at ${mappingPath}. Please run "node scripts/generate-kautian-mapping.mjs" first!`);
  process.exit(1);
}

// 1. Gather all target characters from the .ts files
const vocabFiles = fs.readdirSync(vocabDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts' && f !== 'related-words.ts' && f !== 'summary.ts');

const targetChars = new Set();
for (const f of vocabFiles) {
  const content = fs.readFileSync(path.join(vocabDir, f), 'utf8');
  const matches = [...content.matchAll(/character:\s*'([^']+)'/g)];
  for (const m of matches) {
    if (m[1].length === 1) targetChars.add(m[1]);
  }
}

// 2. Load the mapping
const _mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// 3. For each target character, find matching 2~3 char words
const charToWords = new Map();
// Simple logic: we take the first 5 unique, short dictionary entries that contain the character.
// The raw dictionary entries might not be sorted by frequency, but shorter words are generally more common.
for (const ch of targetChars) {
  const found = [];
  const seen = new Set();
  
  for (const entry of _mapping) {
    const word = entry.lookupLabel; // Clean label without variant marks
    if (word.includes(ch) && word.length >= 2 && word.length <= 4) {
      if (!seen.has(word) && !word.includes('(') && !word.includes('（')) {
        seen.add(word);
        found.push(entry);
        if (found.length >= 5) break; // Take up to 5 words
      }
    }
  }
  
  if (found.length > 0) {
    charToWords.set(ch, found);
  }
}

// 4. Update related-words.ts
let relatedWordsContent = fs.readFileSync(relatedWordsPath, 'utf8');

// We want to safely insert/replace mappings in RELATED_WORDS_BY_CHARACTER
// We'll construct a massive dictionary string and replace the old one.
let newDictStr = 'const RELATED_WORDS_BY_CHARACTER: Record<string, readonly VocabRelatedWord[]> = {\n';

for (const [ch, entries] of charToWords.entries()) {
  const rwCalls = entries.map(e => `rw('📘', '${e.lookupLabel}', '${e.pronunciationVariants[0] || e.pronunciation}')`).join(', ');
  newDictStr += `  '${ch}': [${rwCalls}],\n`;
}

newDictStr += '};';

// Regex to find "const RELATED_WORDS_BY_CHARACTER: ... = { ... };"
const dictRegex = /const\s+RELATED_WORDS_BY_CHARACTER\s*:\s*Record<string,\s*readonly\s*VocabRelatedWord\[\]>\s*=\s*\{[\s\S]*?\};/;

if (dictRegex.test(relatedWordsContent)) {
  relatedWordsContent = relatedWordsContent.replace(dictRegex, newDictStr);
  fs.writeFileSync(relatedWordsPath, relatedWordsContent, 'utf8');
  console.log(`Successfully updated related-words.ts with dictionary matches for ${charToWords.size} characters!`);
} else {
  console.error("Could not find RELATED_WORDS_BY_CHARACTER definition block in related-words.ts");
}
