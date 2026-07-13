import { useState, useEffect } from "react";
import Furigana from "./Furigana";
import { speak } from "../utils/speak";
import { loadTaskPosition, saveTaskPosition, clearTaskPosition, clampIndex } from "../utils/taskPosition";

// ── 1단계: 지난 4일 단어·문장 플래시카드로 훑어보기 ──────────────
// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
function FlashPhase({ cards, initialIdx = 0, onIdxChange, onDone }) {
  const [idx, setIdx] = useState(clampIndex(initialIdx, cards.length));
  const current = cards[idx];
  const isLast = idx + 1 >= cards.length;

  useEffect(() => { onIdxChange?.(idx); }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    if (isLast) { onDone(); return; }
    setIdx((i) => i + 1);
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
        <p className="text-gray-300 text-sm">탭하면 발음 🔊</p>
      </div>
      <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={next}>
        {isLast ? "퀴즈 시작 →" : "다음 →"}
      </button>
    </div>
  );
}

// ── 2단계: 4지선다 객관식 퀴즈 ────────────────────────────────
function QuizPhase({ items, initialIdx = 0, initialScore = 0, onIdxChange, onDone }) {
  const [idx, setIdx] = useState(clampIndex(initialIdx, items.length));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(initialScore);
  const current = items[idx];
  const isLast = idx + 1 >= items.length;

  useEffect(() => { onIdxChange?.(idx, score); }, [idx, score]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(choice) {
    if (selected) return;
    setSelected(choice);
    if (choice === current.correct) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) { onDone(score); return; }
    setIdx((i) => i + 1);
    setSelected(null);
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
        <p className="text-gray-300 text-sm">탭하면 발음 🔊</p>
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
      {selected && (
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={next}>
          {isLast ? "결과 보기 →" : "다음 문제 →"}
        </button>
      )}
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

  const cards = lesson.flashcards.length > 0 ? lesson.flashcards : lesson.words;
  const quizItems = lesson.quizItems;

  function persist(nextPhase, idx, score) {
    saveTaskPosition(profile, dayNum, "review", { phase: nextPhase, idx, score });
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
        onIdxChange={(idx) => persist("flash", idx, 0)}
        onDone={() => {
          const next = quizItems.length > 0 ? "quiz" : "result";
          setPhase(next);
          persist(next, 0, 0);
        }}
      />
    );
  }

  if (phase === "quiz") {
    return (
      <QuizPhase
        items={quizItems}
        initialIdx={saved?.phase === "quiz" ? saved.idx : 0}
        initialScore={saved?.phase === "quiz" ? saved.score || 0 : 0}
        onIdxChange={(idx, score) => persist("quiz", idx, score)}
        onDone={(score) => { setFinalScore(score); setPhase("result"); persist("result", 0, score); }}
      />
    );
  }

  return <ResultPhase score={finalScore} total={quizItems.length} onDone={handleFinalDone} />;
}
