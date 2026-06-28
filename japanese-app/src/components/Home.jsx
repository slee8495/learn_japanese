import { useState } from "react";
import { getDayNumber, getDayLesson } from "../data/curriculum";
import CalendarView from "./CalendarView";

const TASK_META = {
  kana:     { icon: "あ", label: "글자 연습", color: "bg-violet-50 border-violet-200 text-violet-700" },
  words:    { icon: "単", label: "단어 학습", color: "bg-blue-50 border-blue-200 text-blue-700" },
  grammar:  { icon: "文", label: "문법 학습", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  sentence: { icon: "会", label: "문장 익히기", color: "bg-amber-50 border-amber-200 text-amber-700" },
};

function WeekStrip({ weekStatus }) {
  const dayLabels = ["일","월","화","수","목","금","토"];
  return (
    <div className="flex justify-between gap-1">
      {weekStatus.map(({ date, count, isToday }) => {
        const label = dayLabels[date.getDay()];
        const done = count >= 4;
        const partial = count > 0 && count < 4;
        return (
          <div key={date.toISOString()} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs text-gray-400">{label}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              isToday ? "border-indigo-500 bg-indigo-500 text-white"
              : done  ? "border-green-400 bg-green-400 text-white"
              : partial ? "border-yellow-400 bg-yellow-100 text-yellow-700"
              : "border-gray-200 bg-white text-gray-300"
            }`}>
              {done ? "✓" : date.getDate()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ taskKey, done, onClick }) {
  const meta = TASK_META[taskKey];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
        done ? "bg-gray-50 border-gray-200 opacity-60" : meta.color
      }`}
    >
      <span className="text-3xl w-10 text-center shrink-0">{meta.icon}</span>
      <div className="flex-1">
        <p className={`font-semibold ${done ? "text-gray-400 line-through" : "text-gray-800"}`}>
          {meta.label}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {taskKey === "kana" && "히라가나+카타카나 한 행 + 읽기"}
          {taskKey === "words" && "새 단어 5개"}
          {taskKey === "grammar" && "문법 포인트 1개"}
          {taskKey === "sentence" && "오늘의 문장 3개"}
        </p>
      </div>
      <span className="text-xl">{done ? "✅" : "→"}</span>
    </button>
  );
}

export default function Home({ onNavigate, todayDone, streak, weekStatus, daily }) {
  const dayNum = getDayNumber();
  const lesson = getDayLesson(dayNum);
  const tasks = ["kana", "words", "grammar", "sentence"];
  const doneCount = tasks.filter(t => todayDone[t]).length;
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // 달력에서 선택한 날

  const motivations = [
    "오늘도 파이팅! 🔥",
    "하루 10분, 1년이면 기초 완성 🎯",
    "昨日より今日 (어제보다 오늘) ✨",
    "続けること大切！계속하는 게 최고예요 🌸",
  ];
  const motivation = motivations[dayNum % motivations.length];

  function handleCalendarSelect(d) {
    setShowCalendar(false);
    if (d !== dayNum) setSelectedDay(d);
  }

  return (
    <div className="flex flex-col gap-5 py-6 px-4 max-w-lg mx-auto">

      {/* 헤더 카드 */}
      <div className="bg-indigo-600 rounded-3xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm">오늘의 학습</p>
            <p className="text-3xl font-bold mt-1">Day {dayNum}</p>
            <p className="text-indigo-200 text-sm mt-0.5">/ 365 — {lesson.theme}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl">🔥</p>
            <p className="text-xl font-bold">{streak}일</p>
            <p className="text-indigo-200 text-xs">연속 학습</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>{motivation}</span>
            <span>{doneCount}/4 완료</span>
          </div>
          <div className="w-full bg-indigo-500 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${(doneCount / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 7일 스트립 + 달력 버튼 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-400">최근 7일</p>
          <button
            onClick={() => setShowCalendar(true)}
            className="text-xs text-indigo-500 font-medium flex items-center gap-1"
          >
            📅 전체 달력 보기
          </button>
        </div>
        <WeekStrip weekStatus={weekStatus} />
      </div>

      {/* 오늘 할 일 */}
      <div>
        <p className="text-sm font-semibold text-gray-500 mb-2">오늘의 학습 (하루 10분)</p>
        <div className="flex flex-col gap-2">
          {tasks.map(t => (
            <TaskCard key={t} taskKey={t} done={!!todayDone[t]} onClick={() => onNavigate(t)} />
          ))}
        </div>
      </div>

      {doneCount === 4 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-green-700">오늘 학습 완료!</p>
          <p className="text-sm text-green-600 mt-1">내일 또 만나요 またね！</p>
        </div>
      )}

      {/* 선택한 과거 날 복습 */}
      {selectedDay && selectedDay !== dayNum && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-indigo-700">Day {selectedDay} 복습</p>
            <button onClick={() => setSelectedDay(null)} className="text-indigo-400 text-sm">✕</button>
          </div>
          <p className="text-xs text-indigo-400 mb-3">{getDayLesson(selectedDay).theme}</p>
          <div className="flex gap-2 flex-wrap">
            {tasks.map(t => (
              <button
                key={t}
                onClick={() => onNavigate(t, selectedDay)}
                className="px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                {TASK_META[t].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 달력 모달 */}
      {showCalendar && (
        <CalendarView
          daily={daily}
          onSelectDay={handleCalendarSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
