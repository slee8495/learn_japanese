/**
 * Fetches JLPT N5-N2 vocabulary from Jisho.org API and saves to src/data/jlpt-words.json
 * Run: node scripts/fetch-vocab.js
 *
 * Jisho uses JMdict (open-source Japanese dictionary).
 * Meanings are in English — acceptable as intermediate for Korean learners.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/jlpt-words.json");

const LEVELS = ["n5", "n4", "n3", "n2"];
const PAGES_PER_LEVEL = { n5: 5, n4: 8, n3: 15, n2: 20 };
const DELAY_MS = 800; // be polite to Jisho

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPage(level, page) {
  const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-${level}&page=${page}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.warn(`  ⚠ Failed page ${page} for ${level}: ${e.message}`);
    return [];
  }
}

function extractEntry(word, level) {
  const kanjiForm = word.japanese[0]?.word;
  const reading = word.japanese[0]?.reading;
  if (!reading) return null;

  const senseEn = word.senses?.[0];
  const meanings = senseEn?.english_definitions?.slice(0, 3).join(", ");
  if (!meanings) return null;

  const partsOfSpeech = senseEn?.parts_of_speech || [];
  const isCommon = word.is_common;

  return {
    japanese: kanjiForm || reading,
    reading,
    meaning: meanings,
    level: level.toUpperCase(),
    common: isCommon,
    pos: partsOfSpeech[0] || "",
  };
}

async function fetchLevel(level) {
  const pages = PAGES_PER_LEVEL[level];
  const entries = [];
  console.log(`\nFetching ${level.toUpperCase()} (${pages} pages)...`);

  for (let page = 1; page <= pages; page++) {
    process.stdout.write(`  page ${page}/${pages}...`);
    const data = await fetchPage(level, page);
    const extracted = data.map((w) => extractEntry(w, level)).filter(Boolean);
    entries.push(...extracted);
    process.stdout.write(` ${extracted.length} words\n`);
    if (page < pages) await sleep(DELAY_MS);
  }

  return entries;
}

async function main() {
  console.log("=== JLPT Vocabulary Fetcher ===");
  console.log("Source: Jisho.org (JMdict — Creative Commons)\n");

  const result = {};

  for (const level of LEVELS) {
    result[level] = await fetchLevel(level);
    console.log(`  ✓ ${level.toUpperCase()}: ${result[level].length} words`);
    await sleep(DELAY_MS * 2);
  }

  const total = Object.values(result).reduce((s, a) => s + a.length, 0);
  console.log(`\nTotal: ${total} words`);

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), "utf-8");
  console.log(`\n✅ Saved to ${OUT_PATH}`);
}

main().catch(console.error);
