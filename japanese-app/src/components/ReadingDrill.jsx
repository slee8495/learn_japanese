import { useState } from "react";
import { words } from "../data/kana";

function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.8;
  speechSynthesis.speak(utt);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 뜻을 먼저 보여주고 일본어를 떠올려본 뒤 확인하는 순서(작문 감각 훈련)
export default function ReadingDrill() {
  const [deck] = useState(() => shuffle(words));
  const [index, setIndex] = useState(0);

  const current = deck[index % deck.length];

  function next() {
    setIndex((i) => i + 1);
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-md mx-auto">
      <p className="text-gray-400 text-sm">{(index % deck.length) + 1} / {deck.length} 단어</p>

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow p-6 text-center">
        <p className="text-lg text-gray-700">{current.meaning}</p>
      </div>

      <div
        className="w-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl shadow-lg border border-gray-100 cursor-pointer"
        onClick={() => speak(current.japanese)}
      >
        <span className="text-6xl mb-4">{current.japanese}</span>
        <p className="text-2xl font-medium text-gray-700">{current.reading}</p>
        <p className="text-gray-400 text-sm mt-2">클릭하면 발음을 들을 수 있어요 🔊</p>
      </div>

      <button
        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-lg font-medium hover:bg-indigo-700 transition-colors"
        onClick={next}
      >
        다음 단어 →
      </button>
    </div>
  );
}
