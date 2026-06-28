/**
 * Fetches graded Japanese sentences from Tatoeba.org and saves to src/data/tatoeba-sentences.json
 * Run: node scripts/fetch-sentences.js
 *
 * Tatoeba is CC-BY 2.0. Sentences are crowdsourced and reviewed.
 * Grades by character length: beginner <20, intermediate 20-40, advanced 40+
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../src/data/tatoeba-sentences.json");

const DELAY_MS = 600;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// keyword sets per level to pull varied, relevant sentences
const QUERIES = {
  beginner: [
    "これ", "あれ", "私は", "私が", "何", "どこ", "いくら",
    "ありがとう", "すみません", "おいしい", "好き", "大きい",
  ],
  intermediate: [
    "から", "ので", "けど", "てから", "ために", "ながら",
    "ことができる", "てみる", "てしまう", "てほしい",
  ],
  advanced: [
    "にもかかわらず", "ということ", "わけではない", "にすぎない",
    "にとって", "に対して", "によって", "さえ", "こそ",
  ],
};

async function fetchQuery(query, limit = 15) {
  const url = `https://tatoeba.org/en/api_v0/search?from=jpn&to=eng&query=${encodeURIComponent(query)}&sort=relevance&limit=${limit}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.results || [];
  } catch (e) {
    console.warn(`  ⚠ Query "${query}" failed: ${e.message}`);
    return [];
  }
}

function extractSentence(result, grade) {
  const jpn = result.text;
  if (!jpn) return null;

  const engTrans = result.translations?.[0]?.[0];
  const eng = engTrans?.text;
  if (!eng) return null;

  return { japanese: jpn, english: eng, grade };
}

async function main() {
  console.log("=== Tatoeba Sentence Fetcher ===");
  console.log("Source: Tatoeba.org (CC-BY 2.0)\n");

  const seen = new Set();
  const result = { beginner: [], intermediate: [], advanced: [] };

  for (const [grade, queries] of Object.entries(QUERIES)) {
    console.log(`\nFetching ${grade} sentences...`);
    for (const q of queries) {
      process.stdout.write(`  "${q}"...`);
      const rows = await fetchQuery(q);
      let added = 0;
      for (const row of rows) {
        const s = extractSentence(row, grade);
        if (!s || seen.has(s.japanese)) continue;
        seen.add(s.japanese);
        result[grade].push(s);
        added++;
      }
      process.stdout.write(` +${added}\n`);
      await sleep(DELAY_MS);
    }
  }

  const total = Object.values(result).reduce((s, a) => s + a.length, 0);
  console.log(`\nTotal sentences: ${total}`);
  Object.entries(result).forEach(([g, arr]) =>
    console.log(`  ${g}: ${arr.length}`)
  );

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), "utf-8");
  console.log(`\n✅ Saved to ${OUT_PATH}`);
}

main().catch(console.error);
