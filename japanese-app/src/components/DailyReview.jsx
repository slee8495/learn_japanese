import { useState, useEffect } from "react";
import Furigana from "./Furigana";
import { speak } from "../utils/speak";
import { loadTaskPosition, saveTaskPosition, clearTaskPosition, clampIndex } from "../utils/taskPosition";
import { mergeFlaggedCards, flagItem, unflagItem } from "../utils/reviewFlags";
import { getDueLongTermItems, recordLongTermResult } from "../utils/spacedReview";
import { getReadingParts } from "../utils/getReadingParts";

// 매일 뜨는 "복습" — 5일마다의 복습 퀴즈(ReviewQuiz)와는 별개로,
// 글자연습 바로 위에서 전날·전전날 단어/문장을 플래시카드로만 훑고 넘어간다.
// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
export default function DailyReview({ lesson, onDone, profile, dayNum }) {
  // "아직 못 외웠어요" 카드 + 오늘 다시 볼 차례가 된 장기 복습 카드(최대 3개)를
  // 얹어서, 세션 도중에는 목록이 안 바뀌게 고정
  const [cards] = useState(() => {
    const withFlags = mergeFlaggedCards(profile, lesson.flashcards);
    const existingKeys = new Set(withFlags.map((c) => c.japanese));
    const dueLongTerm = getDueLongTermItems(profile, dayNum, 3).filter(
      (it) => !existingKeys.has(it.japanese)
    );
    return [...dueLongTerm, ...withFlags];
  });
  const saved = loadTaskPosition(profile, dayNum, "dailyReview");
  const [idx, setIdx] = useState(clampIndex(saved?.idx, cards.length));

  useEffect(() => {
    if (cards.length > 0) saveTaskPosition(profile, dayNum, "dailyReview", { idx });
  }, [idx, profile, dayNum, cards.length]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 px-4 text-center">
        <p className="text-4xl">🔁</p>
        <p className="text-gray-500">아직 복습할 내용이 없어요</p>
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium" onClick={onDone}>
          확인 ✓
        </button>
      </div>
    );
  }

  const current = cards[idx];
  const isLast = idx + 1 >= cards.length;
  const currentReadingParts = getReadingParts(current.japanese, current.reading);

  function next() {
    if (isLast) { clearTaskPosition(profile, dayNum, "dailyReview"); onDone(); return; }
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

  function skipTask() {
    clearTaskPosition(profile, dayNum, "dailyReview");
    onDone();
  }

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-sky-600">🔁 복습</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Day {lesson.coveredDays.join(", ")} · {idx + 1} / {cards.length}
        </p>
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
        <p className="text-gray-300 text-sm">탭하면 발음 🔊</p>
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
          {isLast ? "외웠어요 ✓" : "외웠어요 →"}
        </button>
      </div>
      <button className="text-xs text-gray-400 underline underline-offset-2 mt-1" onClick={skipTask}>
        다 한 걸로 표시하고 넘어가기
      </button>
    </div>
  );
}
