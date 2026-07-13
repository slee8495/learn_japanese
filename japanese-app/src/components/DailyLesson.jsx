import { useState } from "react";
import { getDayLesson, getDailyReviewLesson } from "../data/curriculum";
import Furigana from "./Furigana";
import { speak } from "../utils/speak";
import ReviewQuiz from "./ReviewQuiz";
import DailyReview from "./DailyReview";

// ── 글자 연습 (히라가나+카타카나 같이 + 읽기 연습) ───────────────
function KanaSection({ lesson, onDone }) {
  // phase: "kana" → 글자 카드, "reading" → 단어 읽기
  const [phase, setPhase] = useState("kana");
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // 히라가나 먼저, 카타카나 나중 순서
  const kanaList = lesson.kana;
  const readingList = lesson.readingWords || [];

  function nextKana() {
    if (idx + 1 >= kanaList.length) {
      if (readingList.length > 0) { setPhase("reading"); setIdx(0); setRevealed(false); }
      else onDone();
      return;
    }
    setIdx(i => i + 1);
    setRevealed(false);
  }

  function nextReading() {
    if (idx + 1 >= readingList.length) { onDone(); return; }
    setIdx(i => i + 1);
    setRevealed(false);
  }

  if (phase === "kana") {
    const current = kanaList[idx];
    const isHira = idx < kanaList.length / 2;
    return (
      <div className="flex flex-col items-center gap-5 py-6 px-4">
        <div className="text-center">
          <p className="text-sm text-gray-400">{lesson.kanaLabel} — {isHira ? "히라가나" : "카타카나"}</p>
          <p className="text-xs text-gray-300 mt-0.5">{idx + 1} / {kanaList.length}</p>
        </div>
        <div
          className={`w-44 h-44 rounded-3xl shadow-lg border flex items-center justify-center cursor-pointer ${isHira ? "bg-violet-50 border-violet-100" : "bg-blue-50 border-blue-100"}`}
          onClick={() => speak(current.char)}
        >
          <span className="text-8xl">{current.char}</span>
        </div>
        <p className="text-gray-400 text-sm">탭하면 발음 🔊</p>
        {!revealed ? (
          <button
            className="w-full max-w-xs py-4 bg-violet-50 border-2 border-violet-200 text-violet-700 rounded-2xl text-lg font-medium"
            onClick={() => { setRevealed(true); speak(current.char); }}
          >
            읽기 확인
          </button>
        ) : (
          <div className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 shadow p-5 text-center">
            <p className="text-3xl font-bold text-indigo-600">{current.romaji}</p>
          </div>
        )}
        {revealed && (
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={nextKana}>
            {idx + 1 >= kanaList.length ? (readingList.length > 0 ? "읽기 연습 →" : "완료 ✓") : "다음 →"}
          </button>
        )}
      </div>
    );
  }

  // 읽기 연습 — 뜻을 먼저 보고 일본어를 떠올려보는 방식(작문 감각 훈련)
  const current = readingList[idx];
  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-emerald-600">📖 읽기 연습</p>
        <p className="text-xs text-gray-400 mt-0.5">{idx + 1} / {readingList.length}</p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow p-5 text-center">
        <p className="text-xl font-bold text-gray-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-12 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center cursor-pointer"
        onClick={() => speak(current.japanese)}
      >
        <span className="text-4xl font-medium">{current.japanese}</span>
        <p className="text-indigo-500 text-sm mt-2">{current.reading}</p>
        <p className="text-gray-300 text-sm mt-3">탭하면 발음 🔊</p>
      </div>
      <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={nextReading}>
        {idx + 1 >= readingList.length ? "완료 ✓" : "다음 →"}
      </button>
    </div>
  );
}

// ── 단어 학습 ─────────────────────────────────────────────────
// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function WordsSection({ lesson, onDone }) {
  const [idx, setIdx] = useState(0);
  const current = lesson.words[idx];

  function next() {
    if (idx + 1 >= lesson.words.length) { onDone(); return; }
    setIdx(i => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <p className="text-xs text-gray-400">{idx + 1} / {lesson.words.length} 단어</p>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow p-5 text-center">
        <p className="text-2xl font-bold text-gray-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-12 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center cursor-pointer"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-5xl" />
        <p className="text-xl font-medium text-blue-600 mt-2">{current.reading}</p>
        <p className="text-gray-300 text-sm mt-3">탭하면 발음 🔊</p>
      </div>
      <button
        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium"
        onClick={next}
      >
        {idx + 1 >= lesson.words.length ? "완료 ✓" : "다음 →"}
      </button>
    </div>
  );
}

// ── 문법 학습 ──────────────────────────────────────────────────
function GrammarSection({ lesson, onDone }) {
  const g = lesson.grammar;
  return (
    <div className="flex flex-col gap-4 py-6 px-4 max-w-lg mx-auto">
      <div className={`rounded-2xl p-1 text-center text-xs font-bold ${lesson.isNewGrammar ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
        {lesson.isNewGrammar ? "🆕 새로운 문법 포인트" : "🔄 복습"}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow p-5">
        <span className="text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">{g.level}</span>
        <h2 className="text-xl font-bold text-gray-800 mt-2">{g.title}</h2>
        <p className="text-gray-600 text-sm mt-2">{g.rule}</p>
        {g.tip && (
          <div className="mt-3 bg-amber-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700">💡 포인트</p>
            <p className="text-sm text-amber-800 mt-1">{g.tip}</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">예문 (탭하면 발음)</p>
        <div className="flex flex-col gap-2">
          {g.examples.map((ex, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer"
              onClick={() => speak(ex.j)}
            >
              <p className="text-sm font-medium text-gray-500">{ex.m}</p>
              <Furigana japanese={ex.j} reading={ex.r} className="text-lg text-gray-800 mt-1" />
              <p className="text-sm text-indigo-500 mt-0.5">{ex.r}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-lg font-medium"
        onClick={onDone}
      >
        이해했어요 ✓
      </button>
    </div>
  );
}

// ── 문장 익히기 ───────────────────────────────────────────────
// 뜻을 먼저 보여주고 일본어 문장을 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function SentenceSection({ lesson, onDone }) {
  const [idx, setIdx] = useState(0);
  const current = lesson.sentences[idx];

  function next() {
    if (idx + 1 >= lesson.sentences.length) { onDone(); return; }
    setIdx(i => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <p className="text-xs text-gray-400">문장 {idx + 1} / {lesson.sentences.length}</p>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow p-5 text-center">
        <p className="text-xl font-bold text-gray-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-10 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center gap-2 cursor-pointer px-6 text-center"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-2xl font-medium text-gray-800" />
        <p className="text-base text-indigo-500">{current.reading}</p>
        <p className="text-gray-300 text-sm">탭하면 발음 🔊</p>
      </div>
      <button
        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium"
        onClick={next}
      >
        {idx + 1 >= lesson.sentences.length ? "완료 ✓" : "다음 →"}
      </button>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function DailyLesson({ task, dayNum, onDone }) {
  if (task === "dailyReview") {
    return <DailyReview lesson={getDailyReviewLesson(dayNum)} onDone={onDone} />;
  }

  const lesson = getDayLesson(dayNum);

  return (
    <div>
      {task === "kana" && <KanaSection lesson={lesson} onDone={onDone} />}
      {task === "words" && <WordsSection lesson={lesson} onDone={onDone} />}
      {task === "grammar" && <GrammarSection lesson={lesson} onDone={onDone} />}
      {task === "sentence" && <SentenceSection lesson={lesson} onDone={onDone} />}
      {task === "review" && <ReviewQuiz lesson={lesson} onDone={onDone} />}
    </div>
  );
}
