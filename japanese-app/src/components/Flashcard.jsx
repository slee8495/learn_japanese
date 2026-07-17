import { useState, useEffect, useCallback } from "react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.9;
  speechSynthesis.speak(utt);
}

function buildChoices(correct, pool) {
  const others = shuffle(pool.filter((k) => k.char !== correct.char)).slice(0, 3);
  return shuffle([correct, ...others]);
}

export default function Flashcard({ deck, onProgress }) {
  const [queue, setQueue] = useState(() => shuffle(deck));
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const current = queue[index];

  useEffect(() => {
    setChoices(buildChoices(current, deck));
    setSelected(null);
  }, [index, current, deck]);

  useEffect(() => {
    speak(current.char);
  }, [current]);

  const handleChoice = useCallback(
    (choice) => {
      if (selected) return;
      setSelected(choice);
      const correct = choice.char === current.char;
      onProgress(current.char, correct);
      setTotalAnswered((n) => n + 1);
      if (correct) {
        setStreak((s) => s + 1);
        setTotalCorrect((n) => n + 1);
      } else {
        setStreak(0);
      }
    },
    [selected, current, onProgress]
  );

  function next() {
    if (index + 1 >= queue.length) {
      setQueue(shuffle(deck));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-md mx-auto">
      <div className="flex gap-6 text-sm text-sumi-500">
        <span>연속 정답: <strong className="text-ai-600">{streak}</strong></span>
        <span>정확도: <strong className="text-ai-600">{accuracy}%</strong></span>
        <span>총 {totalAnswered}문제</span>
      </div>

      <div
        className="w-48 h-48 flex items-center justify-center bg-white rounded-3xl shadow-lg border border-sumi-100 cursor-pointer select-none"
        onClick={() => speak(current.char)}
        title="클릭하면 발음을 들을 수 있어요"
      >
        <span className="text-8xl">{current.char}</span>
      </div>

      <p className="text-sumi-400 text-sm">클릭하면 발음을 들을 수 있어요 🔊</p>

      <div className="grid grid-cols-2 gap-3 w-full">
        {choices.map((choice) => {
          let base = "py-4 rounded-2xl text-lg font-medium border-2 transition-all duration-150 ";
          if (!selected) {
            base += "bg-white border-sumi-200 hover:border-ai-400 hover:bg-ai-50 cursor-pointer";
          } else if (choice.char === current.char) {
            base += "bg-green-50 border-green-400 text-green-700";
          } else if (choice.char === selected.char) {
            base += "bg-red-50 border-red-400 text-red-700";
          } else {
            base += "bg-white border-sumi-200 text-sumi-400";
          }
          return (
            <button key={choice.char} className={base} onClick={() => handleChoice(choice)}>
              {choice.romaji}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          className="mt-2 px-8 py-3 bg-ai-600 text-white rounded-2xl text-lg font-medium hover:bg-ai-700 transition-colors"
          onClick={next}
        >
          다음 →
        </button>
      )}
    </div>
  );
}
