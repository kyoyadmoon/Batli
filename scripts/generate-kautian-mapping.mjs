#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const dictionaryIndexPath = resolve(projectRoot, 'downloads/kautian.ods');
const outputPath = resolve(projectRoot, 'src/data/moeKautianMapping.json');

function normalize(text) {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function decodeXml(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number.parseInt(value, 10)));
}

function stripVariantAnnotation(text) {
  return text.replace(/【[^】]*】/g, '');
}

function normalizeInlineXmlText(text) {
  return normalize(
    decodeXml(
      text
        .replace(/<text:s(?:\s+text:c="(\d+)")?\s*\/>/g, (_, count) => ' '.repeat(Number(count ?? '1')))
        .replace(/<[^>]+>/g, ''),
    ),
  );
}

function extractCellValue(attributes, body) {
  const paragraphs = [...body.matchAll(/<text:p\b[^>]*>([\s\S]*?)<\/text:p>/g)].map((match) =>
    normalizeInlineXmlText(match[1]),
  );

  if (paragraphs.length > 0) {
    return normalize(paragraphs.join('\n'));
  }

  const stringValue = attributes.match(/office:string-value="([^"]*)"/)?.[1];
  if (stringValue) {
    return normalize(decodeXml(stringValue));
  }

  const numericValue = attributes.match(/office:value="([^"]*)"/)?.[1];
  if (numericValue) {
    return normalize(decodeXml(numericValue));
  }

  return '';
}

function parseTableCells(rowXml) {
  const cells = [];
  const cellPattern = /<table:(table-cell|covered-table-cell)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:\1>)/g;

  for (const match of rowXml.matchAll(cellPattern)) {
    const kind = match[1];
    const attributes = match[2] ?? '';
    const body = match[3] ?? '';
    const repeated = Number.parseInt(attributes.match(/table:number-columns-repeated="(\d+)"/)?.[1] ?? '1', 10);
    const value = kind === 'covered-table-cell' ? '' : extractCellValue(attributes, body);

    for (let index = 0; index < repeated; index += 1) {
      cells.push(value);
    }
  }

  return cells;
}

function parseTableRows(tableXml) {
  const rows = [];
  const rowPattern = /<table:table-row\b([^>]*)>([\s\S]*?)<\/table:table-row>/g;

  for (const match of tableXml.matchAll(rowPattern)) {
    const attributes = match[1] ?? '';
    const repeated = Number.parseInt(attributes.match(/table:number-rows-repeated="(\d+)"/)?.[1] ?? '1', 10);
    const cells = parseTableCells(match[2] ?? '');

    for (let index = 0; index < repeated; index += 1) {
      rows.push([...cells]);
    }
  }

  return rows;
}

function extractTableXml(contentXml, tableName) {
  const startMarker = `<table:table table:name="${tableName}">`;
  const startIndex = contentXml.indexOf(startMarker);

  if (startIndex === -1) {
    throw new Error(`Missing table "${tableName}" in ${dictionaryIndexPath}`);
  }

  const afterStart = contentXml.slice(startIndex + startMarker.length);
  const endIndex = afterStart.indexOf('</table:table>');

  if (endIndex === -1) {
    throw new Error(`Missing closing tag for table "${tableName}" in ${dictionaryIndexPath}`);
  }

  return afterStart.slice(0, endIndex);
}

function readDictionaryContentXml() {
  if (!existsSync(dictionaryIndexPath)) {
    throw new Error(`Missing local dictionary index: ${dictionaryIndexPath}`);
  }

  return execFileSync('unzip', ['-p', dictionaryIndexPath, 'content.xml'], {
    encoding: 'utf8',
    maxBuffer: 128 * 1024 * 1024,
  });
}

function splitPronunciationVariants(text) {
  return normalize(text)
    .split('/')
    .map((variant) => normalize(variant))
    .filter(Boolean);
}

function loadDictionaryEntries() {
  const contentXml = readDictionaryContentXml();
  const tableXml = extractTableXml(contentXml, '詞目');
  const rows = parseTableRows(tableXml);

  if (rows.length === 0) {
    throw new Error(`No rows found in 詞目 table of ${dictionaryIndexPath}`);
  }

  const header = rows[0].map((cell) => normalize(cell));
  const headerIndex = Object.fromEntries(header.map((cell, index) => [cell, index]));

  for (const field of ['詞目id', '詞目類型', '漢字', '羅馬字', '羅馬字音檔檔名']) {
    if (!(field in headerIndex)) {
      throw new Error(`Missing column "${field}" in ${dictionaryIndexPath}`);
    }
  }

  return rows
    .slice(1)
    .map((row) => {
      const entryId = normalize(row[headerIndex['詞目id']] ?? '');
      const entryType = normalize(row[headerIndex['詞目類型']] ?? '');
      const label = normalize(row[headerIndex['漢字']] ?? '');
      const pronunciation = normalize(row[headerIndex['羅馬字']] ?? '');
      const audioFileBase = normalize(row[headerIndex['羅馬字音檔檔名']] ?? '').replace(/\.mp3$/i, '');

      if (!entryId || !label || !audioFileBase) {
        return null;
      }

      return {
        entryId,
        entryType,
        label,
        lookupLabel: normalize(stripVariantAnnotation(label)),
        pronunciation,
        pronunciationVariants: splitPronunciationVariants(pronunciation),
        audioFileBase,
      };
    })
    .filter(Boolean);
}

function main() {
  console.log(`Reading dictionary from ${dictionaryIndexPath}...`);
  const entries = loadDictionaryEntries();
  
  console.log(`Writing ${entries.length} entries to ${outputPath}...`);
  writeFileSync(outputPath, JSON.stringify(entries, null, 2) + '\n');
  
  console.log('Mapping JSON generated successfully!');
}

main();
