import { useState } from "react";
import { grammarLessons } from "../data/grammar";
import Furigana from "./Furigana";
import { getReadingParts } from "../utils/getReadingParts";

function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.85;
  speechSynthesis.speak(utt);
}

function ExampleRow({ ex }) {
  const readingParts = getReadingParts(ex.japanese, ex.reading);
  return (
    <div
      className="bg-sumi-50 rounded-xl p-3 cursor-pointer hover:bg-ai-50 transition-colors"
      onClick={() => speak(ex.japanese)}
    >
      <p className="text-sm font-medium text-sumi-500">{ex.meaning}</p>
      <Furigana japanese={ex.japanese} reading={ex.reading} className="text-lg text-sumi-800 mt-1" />
      <p className="text-sm text-ai-500 mt-0.5">{readingParts.hiragana}</p>
      <p className="text-xs text-sumi-400 mt-0.5">{readingParts.romaji}</p>
    </div>
  );
}

function LessonCard({ lesson, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-sumi-100 shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4 flex items-center justify-between gap-3"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-ai-100 text-ai-600 rounded-full px-2 py-0.5">{lesson.level}</span>
            <span className="text-xs text-sumi-400">레슨 {lesson.id}</span>
          </div>
          <p className="text-base font-semibold text-sumi-800 mt-1">{lesson.title}</p>
        </div>
        <span className="text-sumi-400 text-xl shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-sumi-50 pt-3">
          <p className="text-sm text-sumi-600">{lesson.explanation}</p>

          <div className="flex flex-col gap-1.5">
            {lesson.points.map((p, i) => (
              <div key={i} className="flex gap-2 text-sm text-sumi-700">
                <span className="text-ai-400 shrink-0">•</span>
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-sumi-400 uppercase tracking-wide mb-2">예문</p>
            <div className="flex flex-col gap-2">
              {lesson.examples.map((ex, i) => (
                <ExampleRow key={i} ex={ex} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const LEVEL_FILTERS = [
  { id: "all", label: "전체" },
  { id: "N5", label: "N5 기초" },
  { id: "N4", label: "N4 중급" },
  { id: "N3", label: "N3 고급" },
  { id: "N2", label: "N2 상급" },
];

export default function GrammarLesson() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? grammarLessons
    : grammarLessons.filter((l) => l.level === filter);

  return (
    <div className="flex flex-col gap-3 py-6 px-4 max-w-lg mx-auto">
      <div className="text-center mb-1">
        <p className="text-sm text-sumi-500">유치원~고등학교 수준</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {LEVEL_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filter === f.id
                ? "bg-ai-600 text-white"
                : "bg-sumi-100 text-sumi-600 hover:bg-sumi-200"
            }`}
          >
            {f.label}
            <span className="ml-1 text-xs opacity-70">
              ({filter === f.id || f.id === "all"
                ? grammarLessons.filter((l) => f.id === "all" || l.level === f.id).length
                : grammarLessons.filter((l) => l.level === f.id).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.map((lesson, i) => (
        <LessonCard key={lesson.id} lesson={lesson} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
