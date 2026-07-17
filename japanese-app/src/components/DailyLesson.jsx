import { useState, useEffect } from "react";
import { getDayLesson, getDailyReviewLesson } from "../data/curriculum";
import Furigana from "./Furigana";
import { speak } from "../utils/speak";
import ReviewQuiz from "./ReviewQuiz";
import DailyReview from "./DailyReview";
import { loadTaskPosition, saveTaskPosition, clearTaskPosition, clampIndex } from "../utils/taskPosition";
import { getReadingParts } from "../utils/getReadingParts";

// 다 안 봤어도 "이거 다 한 걸로 치고 완료 처리"할 수 있는 건너뛰기 버튼
function SkipButton({ onSkip }) {
  return (
    <button
      className="text-xs text-sumi-400 underline underline-offset-2 mt-1"
      onClick={onSkip}
    >
      다 한 걸로 표시하고 넘어가기
    </button>
  );
}

// ── 글자 연습 (히라가나+카타카나 같이 + 읽기 연습) ───────────────
function KanaSection({ lesson, onDone, profile, dayNum }) {
  // 히라가나 먼저, 카타카나 나중 순서
  const kanaList = lesson.kana;
  const readingList = lesson.readingWords || [];

  const saved = loadTaskPosition(profile, dayNum, "kana");
  const initialPhase = saved?.phase === "reading" && readingList.length > 0 ? "reading" : "kana";
  const initialList = initialPhase === "kana" ? kanaList : readingList;

  // phase: "kana" → 글자 카드, "reading" → 단어 읽기
  const [phase, setPhase] = useState(initialPhase);
  const [idx, setIdx] = useState(clampIndex(saved?.idx, initialList.length));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    saveTaskPosition(profile, dayNum, "kana", { phase, idx });
  }, [phase, idx, profile, dayNum]);

  function nextKana() {
    if (idx + 1 >= kanaList.length) {
      if (readingList.length > 0) { setPhase("reading"); setIdx(0); setRevealed(false); }
      else { clearTaskPosition(profile, dayNum, "kana"); onDone(); }
      return;
    }
    setIdx(i => i + 1);
    setRevealed(false);
  }

  function prevKana() {
    if (idx === 0) return;
    setIdx(i => i - 1);
    setRevealed(false);
  }

  function nextReading() {
    if (idx + 1 >= readingList.length) { clearTaskPosition(profile, dayNum, "kana"); onDone(); return; }
    setIdx(i => i + 1);
    setRevealed(false);
  }

  function prevReading() {
    if (idx === 0) return;
    setIdx(i => i - 1);
  }

  function skipTask() {
    clearTaskPosition(profile, dayNum, "kana");
    onDone();
  }

  if (phase === "kana") {
    const current = kanaList[idx];
    const isHira = idx < kanaList.length / 2;
    return (
      <div className="flex flex-col items-center gap-5 py-6 px-4">
        <div className="text-center">
          <p className="text-sm text-sumi-400">{lesson.kanaLabel} — {isHira ? "히라가나" : "카타카나"}</p>
          <p className="text-xs text-sumi-300 mt-0.5">{idx + 1} / {kanaList.length}</p>
        </div>
        <div
          className={`w-44 h-44 rounded-3xl shadow-lg border flex items-center justify-center cursor-pointer ${isHira ? "bg-shu-50 border-shu-100" : "bg-ai-50 border-ai-100"}`}
          onClick={() => speak(current.char)}
        >
          <span className="text-8xl">{current.char}</span>
        </div>
        <span className="text-sumi-300 text-lg -mt-2">🔊</span>
        {!revealed ? (
          <div className="flex gap-3 w-full max-w-xs">
            {idx > 0 && (
              <button className="flex-1 py-3 bg-white border-2 border-sumi-200 text-sumi-600 rounded-2xl text-lg font-medium" onClick={prevKana}>
                ← 이전
              </button>
            )}
            <button
              className="flex-1 py-4 bg-shu-50 border-2 border-shu-200 text-shu-700 rounded-2xl text-lg font-medium"
              onClick={() => { setRevealed(true); speak(current.char); }}
            >
              읽기 확인
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xs bg-white rounded-2xl border border-sumi-100 shadow p-5 text-center">
            <p className="text-3xl font-bold text-ai-600">{current.romaji}</p>
          </div>
        )}
        {revealed && (
          <div className="flex gap-3 w-full max-w-xs">
            {idx > 0 && (
              <button className="flex-1 py-3 bg-white border-2 border-sumi-200 text-sumi-600 rounded-2xl text-lg font-medium" onClick={prevKana}>
                ← 이전
              </button>
            )}
            <button className="flex-1 px-8 py-3 bg-ai-600 text-white rounded-2xl text-lg font-medium" onClick={nextKana}>
              {idx + 1 >= kanaList.length ? (readingList.length > 0 ? "읽기 연습 →" : "완료 ✓") : "다음 →"}
            </button>
          </div>
        )}
        <SkipButton onSkip={skipTask} />
      </div>
    );
  }

  // 읽기 연습 — 뜻을 먼저 보고 일본어를 떠올려보는 방식(작문 감각 훈련)
  const current = readingList[idx];
  const currentReadingParts = getReadingParts(current.japanese, current.reading);
  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-emerald-600">📖 읽기 연습</p>
        <p className="text-xs text-sumi-400 mt-0.5">{idx + 1} / {readingList.length}</p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-sumi-100 shadow p-5 text-center">
        <p className="text-xl font-bold text-sumi-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-12 bg-white rounded-3xl shadow-lg border border-sumi-100 flex flex-col items-center cursor-pointer"
        onClick={() => speak(current.japanese)}
      >
        <span className="text-4xl font-medium">{current.japanese}</span>
        <p className="text-ai-500 text-sm mt-2">{currentReadingParts.hiragana}</p>
        <p className="text-sumi-400 text-xs mt-0.5">{currentReadingParts.romaji}</p>
      </div>
      <span className="text-sumi-300 text-lg -mt-3">🔊</span>
      <div className="flex gap-3 w-full max-w-sm">
        {idx > 0 && (
          <button className="flex-1 py-3 bg-white border-2 border-sumi-200 text-sumi-600 rounded-2xl text-lg font-medium" onClick={prevReading}>
            ← 이전
          </button>
        )}
        <button className="flex-1 px-8 py-3 bg-ai-600 text-white rounded-2xl text-lg font-medium" onClick={nextReading}>
          {idx + 1 >= readingList.length ? "완료 ✓" : "다음 →"}
        </button>
      </div>
      <SkipButton onSkip={skipTask} />
    </div>
  );
}

// ── 단어 학습 ─────────────────────────────────────────────────
// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function WordsSection({ lesson, onDone, profile, dayNum }) {
  const saved = loadTaskPosition(profile, dayNum, "words");
  const [idx, setIdx] = useState(clampIndex(saved?.idx, lesson.words.length));
  const current = lesson.words[idx];
  const currentReadingParts = getReadingParts(current.japanese, current.reading);

  useEffect(() => {
    saveTaskPosition(profile, dayNum, "words", { idx });
  }, [idx, profile, dayNum]);

  function next() {
    if (idx + 1 >= lesson.words.length) { clearTaskPosition(profile, dayNum, "words"); onDone(); return; }
    setIdx(i => i + 1);
  }

  function prev() {
    if (idx === 0) return;
    setIdx(i => i - 1);
  }

  function skipTask() {
    clearTaskPosition(profile, dayNum, "words");
    onDone();
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <p className="text-xs text-sumi-400">{idx + 1} / {lesson.words.length} 단어</p>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-sumi-100 shadow p-5 text-center">
        <p className="text-2xl font-bold text-sumi-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-12 bg-white rounded-3xl shadow-lg border border-sumi-100 flex flex-col items-center cursor-pointer"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-5xl" />
        <p className="text-xl font-medium text-ai-600 mt-2">{currentReadingParts.hiragana}</p>
        <p className="text-sumi-400 text-sm mt-0.5">{currentReadingParts.romaji}</p>
      </div>
      <span className="text-sumi-300 text-lg -mt-3">🔊</span>
      <div className="flex gap-3 w-full max-w-sm">
        {idx > 0 && (
          <button className="flex-1 py-3 bg-white border-2 border-sumi-200 text-sumi-600 rounded-2xl text-lg font-medium" onClick={prev}>
            ← 이전
          </button>
        )}
        <button
          className="flex-1 px-8 py-3 bg-ai-600 text-white rounded-2xl text-lg font-medium"
          onClick={next}
        >
          {idx + 1 >= lesson.words.length ? "완료 ✓" : "다음 →"}
        </button>
      </div>
      <SkipButton onSkip={skipTask} />
    </div>
  );
}

// ── 문법 학습 ──────────────────────────────────────────────────
function GrammarSection({ lesson, onDone }) {
  const g = lesson.grammar;
  return (
    <div className="flex flex-col gap-4 py-6 px-4 max-w-lg mx-auto">
      <div className={`rounded-2xl p-1 text-center text-xs font-bold ${lesson.isNewGrammar ? "bg-emerald-100 text-emerald-700" : "bg-sumi-100 text-sumi-500"}`}>
        {lesson.isNewGrammar ? "🆕 새로운 문법 포인트" : "🔄 복습"}
      </div>

      <div className="bg-white rounded-2xl border border-sumi-100 shadow p-5">
        <span className="text-xs font-bold bg-ai-100 text-ai-600 rounded-full px-2 py-0.5">{g.level}</span>
        <h2 className="text-xl font-bold text-sumi-800 mt-2">{g.title}</h2>
        <p className="text-sumi-600 text-sm mt-2">{g.rule}</p>
        {g.tip && (
          <div className="mt-3 bg-amber-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700">💡 포인트</p>
            <p className="text-sm text-amber-800 mt-1">{g.tip}</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-sumi-400 mb-2">예문</p>
        <div className="flex flex-col gap-2">
          {g.examples.map((ex, i) => {
            const readingParts = getReadingParts(ex.j, ex.r);
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-sumi-100 shadow-sm p-4 cursor-pointer"
                onClick={() => speak(ex.j)}
              >
                <p className="text-sm font-medium text-sumi-500">{ex.m}</p>
                <Furigana japanese={ex.j} reading={ex.r} className="text-lg text-sumi-800 mt-1" />
                <p className="text-sm text-ai-500 mt-0.5">{readingParts.hiragana}</p>
                <p className="text-xs text-sumi-400 mt-0.5">{readingParts.romaji}</p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="w-full py-4 bg-ai-600 text-white rounded-2xl text-lg font-medium"
        onClick={onDone}
      >
        이해했어요 ✓
      </button>
    </div>
  );
}

// ── 문장 익히기 ───────────────────────────────────────────────
// 뜻을 먼저 보여주고 일본어 문장을 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function SentenceSection({ lesson, onDone, profile, dayNum }) {
  const saved = loadTaskPosition(profile, dayNum, "sentence");
  const [idx, setIdx] = useState(clampIndex(saved?.idx, lesson.sentences.length));
  const current = lesson.sentences[idx];
  const currentReadingParts = getReadingParts(current.japanese, current.reading);

  useEffect(() => {
    saveTaskPosition(profile, dayNum, "sentence", { idx });
  }, [idx, profile, dayNum]);

  function next() {
    if (idx + 1 >= lesson.sentences.length) { clearTaskPosition(profile, dayNum, "sentence"); onDone(); return; }
    setIdx(i => i + 1);
  }

  function prev() {
    if (idx === 0) return;
    setIdx(i => i - 1);
  }

  function skipTask() {
    clearTaskPosition(profile, dayNum, "sentence");
    onDone();
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <p className="text-xs text-sumi-400">문장 {idx + 1} / {lesson.sentences.length}</p>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-sumi-100 shadow p-5 text-center">
        <p className="text-xl font-bold text-sumi-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-10 bg-white rounded-3xl shadow-lg border border-sumi-100 flex flex-col items-center gap-2 cursor-pointer px-6 text-center"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-2xl font-medium text-sumi-800" />
        <p className="text-base text-ai-500">{currentReadingParts.hiragana}</p>
        <p className="text-sm text-sumi-400">{currentReadingParts.romaji}</p>
      </div>
      <span className="text-sumi-300 text-lg -mt-3">🔊</span>
      <div className="flex gap-3 w-full max-w-sm">
        {idx > 0 && (
          <button className="flex-1 py-3 bg-white border-2 border-sumi-200 text-sumi-600 rounded-2xl text-lg font-medium" onClick={prev}>
            ← 이전
          </button>
        )}
        <button
          className="flex-1 px-8 py-3 bg-ai-600 text-white rounded-2xl text-lg font-medium"
          onClick={next}
        >
          {idx + 1 >= lesson.sentences.length ? "완료 ✓" : "다음 →"}
        </button>
      </div>
      <SkipButton onSkip={skipTask} />
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function DailyLesson({ task, dayNum, onDone, profile }) {
  if (task === "dailyReview") {
    return <DailyReview lesson={getDailyReviewLesson(dayNum)} onDone={onDone} profile={profile} dayNum={dayNum} />;
  }

  const lesson = getDayLesson(dayNum);

  return (
    <div>
      {task === "kana" && <KanaSection lesson={lesson} onDone={onDone} profile={profile} dayNum={dayNum} />}
      {task === "words" && <WordsSection lesson={lesson} onDone={onDone} profile={profile} dayNum={dayNum} />}
      {task === "grammar" && <GrammarSection lesson={lesson} onDone={onDone} />}
      {task === "sentence" && <SentenceSection lesson={lesson} onDone={onDone} profile={profile} dayNum={dayNum} />}
      {task === "review" && <ReviewQuiz lesson={lesson} onDone={onDone} profile={profile} dayNum={dayNum} />}
    </div>
  );
}
