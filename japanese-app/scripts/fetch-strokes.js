/**
 * Fetches per-character stroke-order path data from KanjiVG and saves to
 * src/data/stroke-data.json. Covers every hiragana/katakana in src/data/kana.js
 * plus every kanji that appears anywhere in vocabulary.js / curriculum.js / grammar.js,
 * so the app can offer stroke-order tracing for anything a learner actually encounters.
 *
 * Run: node scripts/fetch-strokes.js
 *
 * Source: KanjiVG (Ulrich Apel et al.), CC BY-SA 3.0 — http://kanjivg.tagaini.net
 */

import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../src/data");
const OUT_PATH = join(DATA_DIR, "stroke-data.json");

const SOURCE_FILES = ["kana.js", "vocabulary.js", "curriculum.js", "grammar.js"];
const CONCURRENCY = 12;

function isKanji(code) {
  return code >= 0x4e00 && code <= 0x9fff;
}
function isKana(code) {
  return (code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff);
}

function collectChars() {
  const set = new Set();
  for (const file of SOURCE_FILES) {
    const text = readFileSync(join(DATA_DIR, file), "utf-8");
    for (const ch of text) {
      const code = ch.codePointAt(0);
      if (isKanji(code) || isKana(code)) set.add(ch);
    }
  }
  return [...set];
}

function toKanjiVgId(ch) {
  return ch.codePointAt(0).toString(16).padStart(5, "0");
}

function parseSvg(svg) {
  const strokes = [];
  const strokeRe = /<path\b[^>]*\bid="kvg:[0-9a-f]+-s(\d+)"[^>]*\bd="([^"]+)"/g;
  let m;
  while ((m = strokeRe.exec(svg))) {
    strokes.push({ n: Number(m[1]), d: m[2] });
  }
  if (strokes.length === 0) return null;
  strokes.sort((a, b) => a.n - b.n);

  const numPos = [];
  const numRe = /<text transform="matrix\(1 0 0 1 ([\d.-]+) ([\d.-]+)\)">(\d+)<\/text>/g;
  while ((m = numRe.exec(svg))) {
    numPos[Number(m[3]) - 1] = [Number(m[1]), Number(m[2])];
  }

  return {
    strokes: strokes.map((s) => s.d),
    numPos: strokes.map((s, i) => numPos[i] || null),
  };
}

async function fetchChar(ch) {
  const id = toKanjiVgId(ch);
  const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${id}.svg`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const svg = await res.text();
    return parseSvg(svg);
  } catch {
    return null;
  }
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  async function runOne() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
      done++;
      if (done % 25 === 0 || done === items.length) {
        process.stdout.write(`\r  ${done}/${items.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, runOne));
  return results;
}

async function main() {
  console.log("=== Stroke Data Fetcher (KanjiVG) ===\n");
  const chars = collectChars();
  console.log(`Found ${chars.length} unique kana/kanji characters across ${SOURCE_FILES.join(", ")}\n`);

  console.log("Fetching stroke data...");
  const results = await runPool(chars, fetchChar, CONCURRENCY);
  console.log();

  const out = {};
  let missing = 0;
  chars.forEach((ch, i) => {
    if (results[i]) out[ch] = results[i];
    else missing++;
  });

  console.log(`\n✅ ${Object.keys(out).length} characters resolved, ${missing} missing`);

  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(out), "utf-8");
  console.log(`Saved to ${OUT_PATH}`);
}

main().catch(console.error);
