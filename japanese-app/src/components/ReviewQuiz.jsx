import { useState, useEffect } from "react";
import Furigana from "./Furigana";
import { speak } from "../utils/speak";
import { loadTaskPosition, saveTaskPosition, clearTaskPosition, clampIndex } from "../utils/taskPosition";
import { mergeFlaggedCards, flagItem, unflagItem } from "../utils/reviewFlags";
import { getDueLongTermItems, recordLongTermResult } from "../utils/spacedReview";
import { getReadingParts } from "../utils/getReadingParts";

// ── 1단계: 지난 4일 단어·문장 플래시카드로 훑어보기 ──────────────
// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function FlashPhase({ cards, initialIdx = 0, onIdxChange, onDone, onSkipAll, profile, dayNum }) {
  const [idx, setIdx] = useState(clampIndex(initialIdx, cards.length));
  const current = cards[idx];
  const isLast = idx + 1 >= cards.length;
  const currentReadingParts = getReadingParts(current.japanese, current.reading);

  useEffect(() => { onIdxChange?.(idx); }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    if (isLast) { onDone(); return; }
    setIdx((i) => i + 1);
  }

  function prev() {
    if (idx === 0) return;
    setIdx((i) => i - 1);
  }

  function markRemembered() {
    unflagItem(profile, current);
    recordLongTermResult(profile, current, true, dayNum);
    next();
  }

  function markNotYet() {
    flagItem(profile, current);
    recordLongTermResult(profile, current, false, dayNum);
    next();
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-rose-600">🎯 복습 플래시카드</p>
        <p className="text-xs text-gray-400 mt-0.5">{idx + 1} / {cards.length}</p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow p-5 text-center">
        <p className="text-xl font-bold text-gray-800">{current.meaning}</p>
      </div>
      <div
        className="w-full max-w-sm py-10 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center gap-2 cursor-pointer px-6 text-center"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-2xl font-medium text-gray-800" />
        <p className="text-sm text-indigo-500">{currentReadingParts.hiragana}</p>
        <p className="text-sm text-gray-400">{currentReadingParts.romaji}</p>
      </div>
      {idx > 0 && (
        <button className="w-full max-w-sm py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-lg font-medium" onClick={prev}>
          ← 이전
        </button>
      )}
      <div className="flex gap-3 w-full max-w-sm">
        <button className="flex-1 py-3 bg-rose-50 border-2 border-rose-200 text-rose-700 rounded-2xl font-medium" onClick={markNotYet}>
          🔁 아직이에요
        </button>
        <button className="flex-1 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-medium" onClick={markRemembered}>
          {isLast ? "외웠어요, 퀴즈 시작 →" : "외웠어요 →"}
        </button>
      </div>
      <button className="text-xs text-gray-400 underline underline-offset-2 mt-1" onClick={onSkipAll}>
        다 한 걸로 표시하고 넘어가기
      </button>
    </div>
  );
}

// ── 2단계: 4지선다 객관식 퀴즈 ────────────────────────────────
// answers = { [문제 idx]: 고른 답 } — 이전으로 돌아가도 이미 고른 답과 점수가
// 그대로 유지되고, 답을 바꿀 수는 없다(복습 결과이므로).
function QuizPhase({ items, initialIdx = 0, initialAnswers = {}, onIdxChange, onDone, onSkipAll }) {
  const [idx, setIdx] = useState(clampIndex(initialIdx, items.length));
  const [answers, setAnswers] = useState(initialAnswers);
  const current = items[idx];
  const isLast = idx + 1 >= items.length;
  const selected = answers[idx] ?? null;
  const score = Object.keys(answers).filter((k) => answers[k] === items[k]?.correct).length;
  const currentReadingParts = getReadingParts(current.japanese, current.reading);

  useEffect(() => { onIdxChange?.(idx, answers); }, [idx, answers]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(choice) {
    if (selected) return;
    setAnswers((a) => ({ ...a, [idx]: choice }));
  }

  function next() {
    if (isLast) { onDone(score); return; }
    setIdx((i) => i + 1);
  }

  function prev() {
    if (idx === 0) return;
    setIdx((i) => i - 1);
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-rose-600">🎯 복습 퀴즈</p>
        <p className="text-xs text-gray-400 mt-0.5">{idx + 1} / {items.length}</p>
      </div>
      <div
        className="w-full max-w-sm py-8 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center gap-2 cursor-pointer px-6 text-center"
        onClick={() => speak(current.japanese)}
      >
        <Furigana japanese={current.japanese} reading={current.reading} className="text-2xl font-medium text-gray-800" />
        <p className="text-sm text-indigo-500">{currentReadingParts.hiragana}</p>
        <p className="text-sm text-gray-400">{currentReadingParts.romaji}</p>
      </div>
      <div className="w-full max-w-sm flex flex-col gap-2">
        {current.choices.map((choice) => {
          const isCorrect = choice === current.correct;
          const isPicked = choice === selected;
          let style = "bg-white border-gray-200 text-gray-700";
          if (selected) {
            if (isCorrect) style = "bg-green-50 border-green-400 text-green-700";
            else if (isPicked) style = "bg-red-50 border-red-300 text-red-600";
          }
          return (
            <button
              key={choice}
              onClick={() => choose(choice)}
              disabled={!!selected}
              className={`w-full py-3 px-4 rounded-2xl border-2 text-left font-medium transition-colors ${style}`}
            >
              {choice}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 w-full max-w-sm">
        {idx > 0 && (
          <button className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-2xl text-lg font-medium" onClick={prev}>
            ← 이전
          </button>
        )}
        {selected && (
          <button className="flex-1 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={next}>
            {isLast ? "결과 보기 →" : "다음 문제 →"}
          </button>
        )}
      </div>
      <button className="text-xs text-gray-400 underline underline-offset-2 mt-1" onClick={onSkipAll}>
        다 한 걸로 표시하고 넘어가기
      </button>
    </div>
  );
}

// ── 3단계: 결과 ──────────────────────────────────────────────
function ResultPhase({ score, total, onDone }) {
  const ratio = total > 0 ? score / total : 0;
  const message = ratio >= 0.8 ? "완벽해요! 잘 외웠네요 🎉"
    : ratio >= 0.5 ? "잘했어요! 조금만 더 복습해요 💪"
    : "괜찮아요, 다시 한번 복습해봐요 📖";

  return (
    <div className="flex flex-col items-center gap-5 py-10 px-4 text-center">
      <p className="text-5xl">🎯</p>
      <p className="text-2xl font-bold text-gray-800">{score} / {total} 정답!</p>
      <p className="text-gray-500">{message}</p>
      <button className="w-full max-w-sm py-4 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={onDone}>
        복습 완료 ✓
      </button>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function ReviewQuiz({ lesson, onDone, profile, dayNum }) {
  const saved = loadTaskPosition(profile, dayNum, "review");
  const initialPhase = ["flash", "quiz", "result"].includes(saved?.phase) ? saved.phase : "flash";

  const [phase, setPhase] = useState(initialPhase);
  const [finalScore, setFinalScore] = useState(initialPhase === "result" ? saved?.score || 0 : 0);

  const naturalCards = lesson.flashcards.length > 0 ? lesson.flashcards : lesson.words;
  // "아직 못 외웠어요" 카드 + 오늘 다시 볼 차례가 된 장기 복습 카드(최대 3개)를
  // 얹어서, 세션 도중에는 목록이 안 바뀌게 고정
  const [cards] = useState(() => {
    const withFlags = mergeFlaggedCards(profile, naturalCards);
    const existingKeys = new Set(withFlags.map((c) => c.japanese));
    const dueLongTerm = getDueLongTermItems(profile, dayNum, 3).filter(
      (it) => !existingKeys.has(it.japanese)
    );
    return [...dueLongTerm, ...withFlags];
  });
  const quizItems = lesson.quizItems;

  function persist(nextPhase, idx, extra = {}) {
    saveTaskPosition(profile, dayNum, "review", { phase: nextPhase, idx, ...extra });
  }

  function handleFinalDone() {
    clearTaskPosition(profile, dayNum, "review");
    onDone();
  }

  if (phase === "flash") {
    return (
      <FlashPhase
        cards={cards}
        initialIdx={saved?.phase === "flash" ? saved.idx : 0}
        onIdxChange={(idx) => persist("flash", idx)}
        onDone={() => {
          const next = quizItems.length > 0 ? "quiz" : "result";
          setPhase(next);
          persist(next, 0);
        }}
        onSkipAll={handleFinalDone}
        profile={profile}
        dayNum={dayNum}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <QuizPhase
        items={quizItems}
        initialIdx={saved?.phase === "quiz" ? saved.idx : 0}
        initialAnswers={saved?.phase === "quiz" ? saved.answers || {} : {}}
        onIdxChange={(idx, answers) => persist("quiz", idx, { answers })}
        onDone={(score) => { setFinalScore(score); setPhase("result"); persist("result", 0, { score }); }}
        onSkipAll={handleFinalDone}
      />
    );
  }

  return <ResultPhase score={finalScore} total={quizItems.length} onDone={handleFinalDone} />;
}
