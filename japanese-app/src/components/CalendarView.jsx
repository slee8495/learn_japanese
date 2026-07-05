import { useState } from "react";
import { getDayLesson, getCaliforniaToday, dateToDayNum } from "../data/curriculum";

const DAYS = ["일","월","화","수","목","금","토"];

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

const TASK_META = {
  kana:     { icon: "あ", label: "글자 연습" },
  words:    { icon: "単", label: "단어 학습" },
  grammar:  { icon: "文", label: "문법" },
  sentence: { icon: "会", label: "문장 익히기" },
};

export default function CalendarView({ daily, startKey, todayDayNum, onSelectDay, onClose }) {
  const today = getCaliforniaToday();
  const todayDay = todayDayNum;
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickedDay, setPickedDay] = useState(null); // { dayNum, dateObj }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

  function handleDateTap(dayNum, dateObj) {
    if (dayNum === todayDay) {
      // 오늘은 달력 닫고 홈으로
      onClose();
      return;
    }
    setPickedDay({ dayNum, dateObj });
  }

  function handleTaskPick(task) {
    if (!pickedDay) return;
    onSelectDay(pickedDay.dayNum, task);
    onClose();
  }

  const lesson = pickedDay ? getDayLesson(pickedDay.dayNum) : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg pb-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── 달력 패널 ── */}
        {!pickedDay ? (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">‹</button>
              <p className="font-bold text-gray-800 text-lg">{viewYear}년 {monthNames[viewMonth]}</p>
              <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">›</button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <p key={d} className={`text-center text-xs font-semibold ${d==="일"?"text-red-400":d==="토"?"text-blue-400":"text-gray-400"}`}>{d}</p>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;

                const dateObj = new Date(viewYear, viewMonth, day);
                const key = dateKey(dateObj);
                const dayNum = dateToDayNum(dateObj, startKey);
                const isToday = key === dateKey(today);
                const isFuture = dateObj > today;
                const isBeforeStart = dayNum < 1;
                // 전날 학습을 다 못 끝냈으면 실제 날짜가 지나도 그 다음 Day는 아직 잠겨있음(오늘 칸은 예외)
                const isLocked = !isToday && dayNum > todayDay;
                const done = daily[key] || {};
                const doneCount = Object.values(done).filter(Boolean).length;

                let style = "bg-white border border-gray-100 text-gray-400";
                if (isBeforeStart) style = "text-gray-200";
                else if (isToday) style = "bg-indigo-600 text-white font-bold";
                else if (isFuture || isLocked) style = "text-gray-300";
                else if (doneCount >= 4) style = "bg-green-400 text-white";
                else if (doneCount > 0) style = "bg-yellow-100 border border-yellow-300 text-yellow-700";
                else style = "bg-white border border-gray-100 text-gray-600";

                const clickable = !isBeforeStart && !isFuture && !isLocked;

                return (
                  <button
                    key={day}
                    disabled={!clickable}
                    onClick={() => clickable && handleDateTap(dayNum, dateObj)}
                    className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${style} ${clickable ? "active:scale-90" : "cursor-default"}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 완료</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-300 inline-block" /> 일부</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> 오늘</span>
            </div>

            <button onClick={onClose} className="mt-4 w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium">닫기</button>
          </div>
        ) : (
          /* ── 날짜 선택 후 → 복습 항목 선택 패널 ── */
          <div className="p-5">
            <button
              onClick={() => setPickedDay(null)}
              className="flex items-center gap-2 text-indigo-500 text-sm mb-4"
            >
              ← 달력으로
            </button>

            <div className="bg-indigo-50 rounded-2xl p-4 mb-5">
              <p className="text-indigo-400 text-xs font-semibold">복습할 날</p>
              <p className="text-2xl font-bold text-indigo-700 mt-0.5">
                Day {pickedDay.dayNum}
              </p>
              <p className="text-sm text-indigo-500 mt-0.5">{lesson?.theme}</p>
              <p className="text-xs text-indigo-400 mt-1">
                {pickedDay.dateObj.getFullYear()}년{" "}
                {pickedDay.dateObj.getMonth() + 1}월{" "}
                {pickedDay.dateObj.getDate()}일
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-500 mb-3">어떤 걸 복습할까요?</p>
            <div className="flex flex-col gap-2">
              {Object.entries(TASK_META).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => handleTaskPick(key)}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl active:scale-95 transition-all text-left"
                >
                  <span className="text-2xl w-9 text-center shrink-0">{meta.icon}</span>
                  <span className="font-medium text-gray-700">{meta.label}</span>
                  <span className="ml-auto text-gray-400">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
