import { useState, useMemo } from "react";
import jlptWords from "../data/jlpt-words.json";

const LEVELS = [
  { id: "n5", label: "N5", sub: "기초 (100개)", color: "bg-green-100 text-green-700" },
  { id: "n4", label: "N4", sub: "초급 (160개)", color: "bg-blue-100 text-blue-700" },
  { id: "n3", label: "N3", sub: "중급 (300개)", color: "bg-violet-100 text-violet-700" },
  { id: "n2", label: "N2", sub: "고급 (400개)", color: "bg-rose-100 text-rose-700" },
];

const POS_LABELS = {
  "Noun": "명사", "Verb": "동사", "Adjective": "형용사",
  "Adverb": "부사", "Particle": "조사", "Expression": "표현",
  "Suffix": "접미사", "Prefix": "접두사",
};

function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.85;
  speechSynthesis.speak(utt);
}

function WordCard({ word }) {
  const [flipped, setFlipped] = useState(false);
  const posLabel = POS_LABELS[word.pos] || word.pos;

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => { setFlipped((f) => !f); speak(word.japanese); }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-medium text-gray-800">{word.japanese}</p>
          {flipped ? (
            <div className="mt-1">
              <p className="text-sm text-indigo-500">{word.reading}</p>
              <p className="text-base text-gray-600 mt-0.5">{word.meaning}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-300 mt-1">탭해서 뜻 보기</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {posLabel && (
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{posLabel}</span>
          )}
          {word.common && (
            <span className="text-xs bg-amber-50 text-amber-600 rounded-full px-2 py-0.5">★ 자주 씀</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VocabBook() {
  const [level, setLevel] = useState("n5");
  const [search, setSearch] = useState("");
  const [showCommonOnly, setShowCommonOnly] = useState(false);

  const words = useMemo(() => {
    let list = jlptWords[level] || [];
    if (showCommonOnly) list = list.filter((w) => w.common);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.japanese.includes(q) ||
          w.reading.includes(q) ||
          w.meaning.toLowerCase().includes(q)
      );
    }
    return list;
  }, [level, search, showCommonOnly]);

  const currentLevel = LEVELS.find((l) => l.id === level);

  return (
    <div className="flex flex-col gap-4 py-6 px-4 max-w-lg mx-auto">

      {/* 레벨 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => { setLevel(l.id); setSearch(""); }}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              level === l.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {l.label}
            <span className="ml-1 text-xs opacity-70">({jlptWords[l.id]?.length})</span>
          </button>
        ))}
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="일본어, 읽기, 뜻 검색..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
        />
        <button
          onClick={() => setShowCommonOnly((v) => !v)}
          className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors ${
            showCommonOnly ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          ★ 자주 씀
        </button>
      </div>

      {/* 결과 수 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${currentLevel?.color}`}>
            {currentLevel?.label}
          </span>
          {words.length}개 단어
        </p>
        <p className="text-xs text-gray-400">탭하면 발음 + 뜻</p>
      </div>

      {/* 단어 리스트 */}
      {words.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>검색 결과가 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {words.map((word, i) => (
            <WordCard key={`${word.japanese}-${i}`} word={word} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-gray-300 mt-2">
        출처: Jisho.org (JMdict · Creative Commons)
      </p>
    </div>
  );
}
