#!/usr/bin/env node

/**
 * generate-vocab-illustrations.mjs
 *
 * Generates vocabulary illustration images using the Gemini image generation API.
 * Follows the illustration prompt system defined in docs/illustration-prompt.md.
 *
 * Usage:
 *   node scripts/generate-vocab-illustrations.mjs                    # Generate all missing images
 *   node scripts/generate-vocab-illustrations.mjs --unit unit-food   # Only a specific unit
 *   node scripts/generate-vocab-illustrations.mjs --prompts-only     # Preview prompts, no API calls
 *   node scripts/generate-vocab-illustrations.mjs --char 不          # Single character
 *   node scripts/generate-vocab-illustrations.mjs --model gemini-2.5-flash-image
 *   node scripts/generate-vocab-illustrations.mjs --dry-run          # Check which images are missing
 *
 * Requires: GEMINI_API_KEY in .env or environment
 * Optional: GEMINI_IMAGE_MODEL in .env or environment
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const CONFIG_PATH = join(__dirname, 'vocab-illustration-config.json');
const MANIFEST_PATH = join(ROOT, 'src', 'data', 'vocabIllustrationManifest.json');
const DEFAULT_IMAGE_MODELS = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview'];

function getEnvValue(name) {
  const directValue = process.env[name]?.trim();
  if (directValue) return directValue;

  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return undefined;

  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return match?.[1]?.trim();
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const unitFilter = getArg('--unit');
const charFilter = getArg('--char');
const modelOverride = getArg('--model') || getEnvValue('GEMINI_IMAGE_MODEL');
const promptsOnly = args.includes('--prompts-only');
const dryRun = args.includes('--dry-run');
const forceRegenerate = args.includes('--force');
const imageModelCandidates = modelOverride ? [modelOverride] : DEFAULT_IMAGE_MODELS;

// ---------------------------------------------------------------------------
// Load config
// ---------------------------------------------------------------------------

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

// ---------------------------------------------------------------------------
// Prompt builder — follows docs/illustration-prompt.md
// ---------------------------------------------------------------------------

/**
 * Core style prefix that every prompt starts with (from docs/illustration-prompt.md).
 */
const STYLE_PREFIX =
  'in a gentle, warm-toned Japanese watercolor (ehon) style with soft, translucent layers and delicate linework';

const NEGATIVE_SUFFIX =
  'No text, labels, watermarks, borders, or signatures in the image. Not anime, not digital art, not photorealistic. Clean composition with ample white space.';

/**
 * Determine background level (0/1/2) based on type and scene presence.
 */
function bgLevel(type, scene) {
  if (scene) return type === '動詞' ? 2 : 1;
  if (type === '動詞') return 1;
  return 0;
}

function bgDescription(level) {
  if (level === 0) return 'against a plain off-white background with no background elements';
  if (level === 1) return 'with a faint ground shadow and subtle spatial hints for minimal context';
  return 'with a light watercolor wash suggesting the scene environment';
}

/**
 * Capitalize first letter.
 */
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Build the English image prompt for a character entry.
 */
function buildPrompt(entry) {
  const { character, contextWord, type, scene } = entry;
  const subject = contextWord || character;
  const level = bgLevel(type, scene);
  const bg = bgDescription(level);

  // Scene provided — use it as the main visual description
  if (scene) {
    // If the scene already describes a person (starts with "a person" / "two people"),
    // add character traits. Otherwise use the scene directly for nouns.
    const sceneDescribesPerson = /^(a person|two people)/i.test(scene);

    let mainClause;
    if (sceneDescribesPerson) {
      // Enhance the person description with Taiwanese appearance traits
      mainClause = cap(
        scene.replace(
          /^a person/i,
          'A person with short dark hair, East Asian features, wearing simple Taiwanese casual clothes (polo shirt, loose pants, sandals)',
        ),
      );
    } else if (type === '動詞' || type === '形容詞') {
      // Action/adjective without person in scene — prepend person
      mainClause = `A person with short dark hair, East Asian features, wearing simple Taiwanese casual clothes: ${scene}`;
    } else {
      // Noun with scene description
      mainClause = cap(scene);
    }

    return [
      `${mainClause}, centered in frame`,
      `${STYLE_PREFIX}, ${bg}.`,
      `The subject occupies about 60-75% of the frame. 1:1 aspect ratio, 1024x1024px.`,
      NEGATIVE_SUFFIX,
    ].join(' ');
  }

  // No scene — default handling by type
  if (type === '名詞') {
    return [
      `A ${subject}, depicted clearly and centered in the frame`,
      `${STYLE_PREFIX}, ${bg}.`,
      `The subject is stylized, warm, and friendly. It occupies about 60-75% of the frame. 1:1 aspect ratio, 1024x1024px.`,
      NEGATIVE_SUFFIX,
    ].join(' ');
  }

  if (type === '動詞') {
    return [
      `A person with short dark hair, East Asian features, wearing simple Taiwanese casual clothes,`,
      `performing the action of ${subject}, centered in frame`,
      `${STYLE_PREFIX}, ${bg}.`,
      `The figure occupies about 60-75% of the frame. 1:1 aspect ratio, 1024x1024px.`,
      NEGATIVE_SUFFIX,
    ].join(' ');
  }

  // 形容詞
  return [
    `A visual representation of ${subject},`,
    `depicted through a simple, evocative object or scene, centered in frame`,
    `${STYLE_PREFIX}, ${bg}.`,
    `1:1 aspect ratio, 1024x1024px.`,
    NEGATIVE_SUFFIX,
  ].join(' ');
}

// ---------------------------------------------------------------------------
// Resolve imageRef path for a character from existing vocabulary data
// ---------------------------------------------------------------------------

/**
 * We read the imageRef from the vocabulary source files at runtime.
 * But since they're TypeScript, we'll derive the path from the config instead:
 * /images/vocab/{unitId-without-unit-prefix}/{pinyin}.webp
 *
 * The actual imageRef is defined in the TS source files. For the generation
 * script we compute the public path as: public + imageRef.
 */
function getPublicImagePath(unitId, character) {
  // Map character to the pinyin filename using the vocabulary source files.
  // Since we can't import TS from this mjs script, we'll search the TS files.
  const unitSlug = unitId.replace('unit-', '');
  const tsPath = join(ROOT, 'src', 'data', 'vocabulary', `${unitSlug}.ts`);

  if (!existsSync(tsPath)) {
    console.warn(`  ⚠ Unit file not found: ${tsPath}`);
    return null;
  }

  const tsContent = readFileSync(tsPath, 'utf-8');

  // Find the imageRef for this character
  // Pattern: character: '字', ... imageRef: '/images/vocab/...'
  const charEscaped = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `character:\\s*'${charEscaped}'[\\s\\S]*?imageRef:\\s*'([^']+)'`,
  );
  const match = tsContent.match(regex);

  if (!match) {
    console.warn(`  ⚠ imageRef not found for ${character} in ${unitSlug}.ts`);
    return null;
  }

  return join(PUBLIC, match[1]);
}

// ---------------------------------------------------------------------------
// Gemini API interaction
// ---------------------------------------------------------------------------

async function loadGeminiClient() {
  const apiKey = getEnvValue('GEMINI_API_KEY');

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found. Set it in .env or environment.');
    console.error('   Get a free key at: https://aistudio.google.com/apikey');
    process.exit(1);
  }

  // Use the new @google/genai SDK (not the deprecated @google/generative-ai)
  let GoogleGenAI;
  try {
    const module = await import('@google/genai');
    GoogleGenAI = module.GoogleGenAI;
  } catch {
    console.error('❌ @google/genai not installed.');
    console.error('   Run: pnpm add -D @google/genai');
    process.exit(1);
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Convert SDK/API errors into readable text.
 */
function formatErrorMessage(err) {
  const rawMessage = err instanceof Error && err.message ? err.message : null;

  if (rawMessage) {
    try {
      const parsed = JSON.parse(rawMessage);
      const apiMessage = parsed?.error?.message;
      if (apiMessage) {
        return apiMessage.replace(/\s+/g, ' ').trim();
      }
    } catch {
      // Non-JSON error messages should pass through unchanged.
    }

    return rawMessage;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function isUnavailableModelError(message) {
  return /models\/.+(not found|not supported)/i.test(message) || /"status":"NOT_FOUND"/.test(message);
}

function isQuotaExceededError(message) {
  return /RESOURCE_EXHAUSTED|quota exceeded|exceeded your current quota/i.test(message);
}

function getResponseParts(response) {
  return response?.candidates?.[0]?.content?.parts || response?.parts || [];
}

/**
 * Generate an image using currently supported Gemini image-generation models.
 * Returns the image buffer, mime type, and the model that succeeded.
 */
async function generateImage(ai, prompt, modelCandidates, retries = 2) {
  let lastError = 'No image returned.';

  for (let modelIndex = 0; modelIndex < modelCandidates.length; modelIndex++) {
    const model = modelCandidates[modelIndex];

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        const parts = getResponseParts(response);
        const responseText = parts
          .map((part) => part.text?.trim())
          .filter(Boolean)
          .join(' ');

        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            return {
              buffer: Buffer.from(part.inlineData.data, 'base64'),
              mimeType: part.inlineData.mimeType,
              model,
              responseText,
            };
          }
        }

        lastError = responseText
          ? `No image in response from ${model}. Response text: ${responseText}`
          : `No image in response from ${model}.`;
        console.warn(`  ⚠ ${lastError} (attempt ${attempt + 1})`);
      } catch (err) {
        const message = formatErrorMessage(err);
        lastError = message;
        const isUnavailableModel = isUnavailableModelError(message);
        const isQuotaExceeded = isQuotaExceededError(message);
        console.warn(`  ⚠ API error with ${model} (attempt ${attempt + 1}): ${message}`);

        if (isUnavailableModel || isQuotaExceeded) {
          break;
        }

        if (attempt < retries) {
          const delay = (attempt + 1) * 5000;
          console.log(`  ⏳ Waiting ${delay / 1000}s before retry...`);
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    if (modelIndex < modelCandidates.length - 1) {
      console.log(`  ↪ Falling back to model: ${modelCandidates[modelIndex + 1]}`);
    }
  }

  return {
    buffer: null,
    mimeType: null,
    model: null,
    responseText: null,
    error: lastError,
  };
}

// ---------------------------------------------------------------------------
// WebP conversion helper
// ---------------------------------------------------------------------------

/**
 * Convert image buffer to WebP.
 * We store `.webp` files in the app, so non-WebP responses must be converted.
 */
async function saveAsWebP(buffer, outputPath, mimeType) {
  const dir = dirname(outputPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  if (mimeType === 'image/webp') {
    writeFileSync(outputPath, buffer);
    return buffer.length;
  }

  try {
    const sharp = (await import('sharp')).default;
    const webpBuffer = await sharp(buffer)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();
    writeFileSync(outputPath, webpBuffer);
    return webpBuffer.length;
  } catch (err) {
    throw new Error(
      `Unable to convert ${mimeType || 'generated image'} to WebP. Install sharp with "pnpm add -D sharp". ${formatErrorMessage(err)}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Manifest management
// ---------------------------------------------------------------------------

function loadManifest() {
  if (existsSync(MANIFEST_PATH)) {
    return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  }
  return { generated: [], lastUpdated: null };
}

function saveManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  const dir = dirname(MANIFEST_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🎨 Vocabulary Illustration Generator\n');

  // Collect work items
  const workItems = [];

  for (const unit of config.units) {
    if (unitFilter && unit.unitId !== unitFilter) continue;

    for (const entry of unit.characters) {
      if (charFilter && entry.character !== charFilter) continue;

      const publicPath = getPublicImagePath(unit.unitId, entry.character);
      if (!publicPath) continue;

      const exists = existsSync(publicPath);
      if (exists && !forceRegenerate) continue;

      workItems.push({
        ...entry,
        unitId: unit.unitId,
        publicPath,
        prompt: buildPrompt(entry),
      });
    }
  }

  if (workItems.length === 0) {
    console.log('✅ All images already exist. Nothing to generate.');
    console.log('   Use --force to regenerate existing images.');
    return;
  }

  console.log(`📋 ${workItems.length} images to generate:\n`);
  console.log(`🤖 Candidate image models: ${imageModelCandidates.join(', ')}\n`);

  // Dry run — just list what would be generated
  if (dryRun) {
    for (const item of workItems) {
      console.log(`  ${item.character} (${item.contextWord || '-'}) → ${item.publicPath}`);
    }
    console.log(`\nTotal: ${workItems.length} images`);
    return;
  }

  // Prompts only — show prompts without calling API
  if (promptsOnly) {
    for (const item of workItems) {
      console.log(`━━━ ${item.character} (${item.contextWord || '-'}) [${item.unitId}] ━━━`);
      console.log(item.prompt);
      console.log();
    }
    console.log(`Total: ${workItems.length} prompts`);
    return;
  }

  // Generate images
  const ai = await loadGeminiClient();
  const manifest = loadManifest();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < workItems.length; i++) {
    const item = workItems[i];
    const progress = `[${i + 1}/${workItems.length}]`;

    console.log(`${progress} Generating: ${item.character} (${item.contextWord || '-'})`);

    const result = await generateImage(ai, item.prompt, imageModelCandidates);

    if (result.buffer) {
      try {
        const fileSize = await saveAsWebP(result.buffer, item.publicPath, result.mimeType);
        const sizeKB = (fileSize / 1024).toFixed(1);
        console.log(`  ✅ Saved ${item.publicPath} (${sizeKB} KB) via ${result.model}`);
      } catch (err) {
        console.log(`  ❌ Failed to save image for ${item.character}: ${formatErrorMessage(err)}`);
        failCount++;
        if (i < workItems.length - 1) {
          console.log('  ⏳ Rate limit pause (6s)...');
          await new Promise((r) => setTimeout(r, 6000));
        }
        continue;
      }

      // Update manifest
      const existing = manifest.generated.find(
        (g) => g.character === item.character && g.unitId === item.unitId,
      );
      if (existing) {
        existing.generatedAt = new Date().toISOString();
      } else {
        manifest.generated.push({
          character: item.character,
          contextWord: item.contextWord,
          unitId: item.unitId,
          generatedAt: new Date().toISOString(),
        });
      }

      successCount++;
    } else {
      console.log(
        `  ❌ Failed to generate image for ${item.character}${result.error ? `: ${result.error}` : ''}`,
      );
      failCount++;
    }

    // Rate limiting: 10 RPM for free tier → ~6s between requests
    if (i < workItems.length - 1) {
      console.log('  ⏳ Rate limit pause (6s)...');
      await new Promise((r) => setTimeout(r, 6000));
    }
  }

  // Save manifest
  if (successCount > 0) {
    saveManifest(manifest);
    console.log(`📄 Manifest saved to: ${MANIFEST_PATH}`);
  } else {
    console.log('📄 Manifest not updated because no images were generated successfully.');
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${failCount} failed`);

  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
