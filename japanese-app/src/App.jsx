import { useState } from "react";
import { hiragana, katakana } from "./data/kana";
import { useDailyProgress, getStoredProfile, setStoredProfile } from "./hooks/useDailyProgress";
import { getDayLesson } from "./data/curriculum";
import Home from "./components/Home";
import DailyLesson from "./components/DailyLesson";
import Flashcard from "./components/Flashcard";
import ReadingDrill from "./components/ReadingDrill";
import VocabBook from "./components/VocabBook";
import GrammarLesson from "./components/GrammarLesson";
import KanaChart from "./components/KanaChart";
import ChatWidget from "./components/ChatWidget";
import ScratchPad from "./components/ScratchPad";

const SCREEN_LABELS = {
  home: "홈", hiragana: "히라가나 퀴즈", katakana: "카타카나 퀴즈",
  reading: "읽기 드릴", chart: "가나 표", vocab: "단어장", grammar: "문법 레슨",
};
const TASK_LABELS_FOR_CHAT = {
  dailyReview: "전날 복습", kana: "글자 연습", words: "단어 학습", grammar: "문법", sentence: "문장 익히기", review: "복습 퀴즈",
};

const BOTTOM_TABS = [
  { id: "home",    icon: "🏠", label: "홈" },
  { id: "kana",    icon: "あ", label: "글자" },
  { id: "vocab",   icon: "単", label: "단어장" },
  { id: "grammar", icon: "文", label: "문법" },
];

// ── 프로필 설정 화면 ──────────────────────────────────────────
function ProfileSetup({ onDone }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setStoredProfile(trimmed);
    onDone(trimmed);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 flex flex-col items-center justify-center px-6">
      <div className="text-center mb-10">
        <p className="text-6xl mb-4">🇯🇵</p>
        <h1 className="text-3xl font-bold text-white">일본어 학습</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          maxLength={12}
          autoFocus
          className="w-full px-4 py-4 rounded-2xl text-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 bg-white text-indigo-700 font-bold text-lg rounded-2xl disabled:opacity-40 active:scale-95 transition-transform"
        >
          시작하기 →
        </button>
      </form>

      <p className="text-indigo-300 text-xs mt-8 text-center">
        같은 링크를 써도 이름별로 진도가 따로 저장돼요
      </p>
    </div>
  );
}

// ── 메인 앱 ──────────────────────────────────────────────────
function MainApp({ profile, onSwitchProfile }) {
  const [tab, setTab] = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [viewDayNum, setViewDayNum] = useState(null); // null = 오늘(현재 진행 중인 Day) 보는 중

  const { markDayTask, getDayProgress, getStreak, getRecentStatus, dayProgress, dayNum: todayDayNum } = useDailyProgress(profile);
  const streak = getStreak();
  const recentStatus = getRecentStatus();

  const homeDayNum = viewDayNum ?? todayDayNum;
  const homeDone = getDayProgress(homeDayNum);

  function handleNavigate(task, dayNum = homeDayNum) {
    setActiveLesson({ task, dayNum });
  }

  function handleViewDay(d) {
    setViewDayNum(d === todayDayNum ? null : d);
  }

  function handleTaskDone() {
    const { task, dayNum } = activeLesson;
    markDayTask(dayNum, task);
    setActiveLesson(null);
    setTab("home");
  }

  const taskLabel = {
    dailyReview: "전날 복습", kana: "글자 연습", words: "단어 학습", grammar: "문법", sentence: "문장 익히기", review: "복습 퀴즈",
  };

  const chatDayNum = activeLesson ? activeLesson.dayNum : homeDayNum;
  const chatScreenLabel = activeLesson
    ? `Day ${activeLesson.dayNum} ${TASK_LABELS_FOR_CHAT[activeLesson.task]}`
    : SCREEN_LABELS[tab] || tab;
  const chatContext = { profile, dayNum: chatDayNum, screenLabel: chatScreenLabel, lesson: getDayLesson(chatDayNum) };

  if (activeLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveLesson(null)} className="text-gray-400 text-2xl leading-none">←</button>
            <div>
              <p className="font-semibold text-gray-800">{taskLabel[activeLesson.task]}</p>
              {activeLesson.dayNum !== todayDayNum && (
                <p className="text-xs text-indigo-500">Day {activeLesson.dayNum} 복습</p>
              )}
            </div>
          </div>
        </header>
        <main className="max-w-lg mx-auto pb-44">
          <DailyLesson task={activeLesson.task} dayNum={activeLesson.dayNum} onDone={handleTaskDone} />
        </main>
        <ChatWidget context={chatContext} />
        <ScratchPad />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">
            {tab === "home" && "🇯🇵 일본어 학습"}
            {tab === "hiragana" && "히라가나 퀴즈"}
            {tab === "katakana" && "카타카나 퀴즈"}
            {tab === "reading" && "읽기 드릴"}
            {tab === "vocab" && "단어장"}
            {tab === "grammar" && "문법 레슨"}
          </h1>
          {/* 프로필 표시 + 전환 버튼 */}
          <button
            onClick={onSwitchProfile}
            className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full px-3 py-1 text-sm font-medium"
          >
            <span>👤</span>
            <span>{profile}</span>
          </button>
        </div>
        {["hiragana","katakana","reading","chart"].includes(tab) && (
          <div className="max-w-lg mx-auto px-4 pb-2 flex gap-1">
            {[{id:"hiragana",label:"히라가나"},{id:"katakana",label:"카타카나"},{id:"reading",label:"읽기"},{id:"chart",label:"표 📋"}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${tab===t.id?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600"}`}>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto">
        {tab === "home" && (
          <Home
            onNavigate={handleNavigate}
            todayDone={homeDone}
            streak={streak}
            recentStatus={recentStatus}
            dayProgress={dayProgress}
            dayNum={homeDayNum}
            actualDayNum={todayDayNum}
            onBackToToday={() => setViewDayNum(null)}
            onViewDay={handleViewDay}
          />
        )}
        {tab === "hiragana" && <Flashcard key="hiragana" deck={hiragana} onProgress={() => {}} />}
        {tab === "katakana" && <Flashcard key="katakana" deck={katakana} onProgress={() => {}} />}
        {tab === "reading" && <ReadingDrill />}
        {tab === "chart" && <KanaChart />}
        {tab === "vocab" && <VocabBook />}
        {tab === "grammar" && <GrammarLesson />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="max-w-lg mx-auto flex">
          {BOTTOM_TABS.map(t => {
            const active = t.id === "kana"
              ? ["hiragana","katakana","reading","chart"].includes(tab)
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
      <ChatWidget context={chatContext} />
    </div>
  );
}

// ── 루트 ────────────────────────────────────────────────────
export default function App() {
  const [profile, setProfile] = useState(() => getStoredProfile());

  function handleProfileDone(name) {
    setProfile(name);
  }

  function handleSwitchProfile() {
    if (window.confirm(`프로필을 바꿀까요?\n현재: ${profile}`)) {
      setStoredProfile("");
      setProfile(null);
    }
  }

  if (!profile) {
    return <ProfileSetup onDone={handleProfileDone} />;
  }

  return <MainApp profile={profile} onSwitchProfile={handleSwitchProfile} />;
}
