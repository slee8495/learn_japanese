import { useState } from "react";
import { hiragana, katakana } from "./data/kana";
import { useDailyProgress } from "./hooks/useDailyProgress";
import { getDayNumber, dayNumToDateKey } from "./data/curriculum";
import Home from "./components/Home";
import DailyLesson from "./components/DailyLesson";
import Flashcard from "./components/Flashcard";
import ReadingDrill from "./components/ReadingDrill";
import VocabBook from "./components/VocabBook";
import GrammarLesson from "./components/GrammarLesson";

const BOTTOM_TABS = [
  { id: "home",    icon: "🏠", label: "홈" },
  { id: "kana",    icon: "あ", label: "글자" },
  { id: "vocab",   icon: "単", label: "단어장" },
  { id: "grammar", icon: "文", label: "문법" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  // { task, dayNum } or null
  const [activeLesson, setActiveLesson] = useState(null);

  const { markTask, getTodayDone, getStreak, getWeekStatus, dateKey, daily } = useDailyProgress();
  const todayDone = getTodayDone();
  const streak = getStreak();
  const weekStatus = getWeekStatus();

  function handleNavigate(task, dayNum = getDayNumber()) {
    setActiveLesson({ task, dayNum });
  }

  function handleTaskDone() {
    const { task, dayNum } = activeLesson;
    // 오늘 레슨만 완료 표시
    if (dayNum === getDayNumber()) {
      markTask(task, dateKey());
    }
    setActiveLesson(null);
    setTab("home");
  }

  const taskLabel = {
    kana: "글자 연습", words: "단어 학습", grammar: "문법", sentence: "문장 익히기",
  };

  if (activeLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 text-2xl leading-none">←</button>
            <div>
              <p className="font-semibold text-gray-800">{taskLabel[activeLesson.task]}</p>
              {activeLesson.dayNum !== getDayNumber() && (
                <p className="text-xs text-indigo-500">Day {activeLesson.dayNum} 복습</p>
              )}
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto">
          <DailyLesson task={activeLesson.task} dayNum={activeLesson.dayNum} onDone={handleTaskDone} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">
            {tab === "home" && "🇯🇵 일본어 학습"}
            {tab === "hiragana" && "히라가나 퀴즈"}
            {tab === "katakana" && "카타카나 퀴즈"}
            {tab === "reading" && "읽기 드릴"}
            {tab === "vocab" && "단어장"}
            {tab === "grammar" && "문법 레슨"}
          </h1>
          {["hiragana","katakana","reading"].includes(tab) && (
            <div className="flex gap-1 mt-2">
              {[{id:"hiragana",label:"히라가나"},{id:"katakana",label:"카타카나"},{id:"reading",label:"읽기"}].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${tab===t.id?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {tab === "home" && (
          <Home onNavigate={handleNavigate} todayDone={todayDone} streak={streak} weekStatus={weekStatus} daily={daily} />
        )}
        {tab === "hiragana" && <Flashcard key="hiragana" deck={hiragana} onProgress={() => {}} />}
        {tab === "katakana" && <Flashcard key="katakana" deck={katakana} onProgress={() => {}} />}
        {tab === "reading" && <ReadingDrill />}
        {tab === "vocab" && <VocabBook />}
        {tab === "grammar" && <GrammarLesson />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="max-w-lg mx-auto flex">
          {BOTTOM_TABS.map(t => {
            const active = t.id === "kana"
              ? ["hiragana","katakana","reading"].includes(tab)
              : tab === t.id;
            return (
              <button key={t.id}
                onClick={() => setTab(t.id === "kana" ? "hiragana" : t.id)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${active?"text-indigo-600":"text-gray-400"}`}>
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
