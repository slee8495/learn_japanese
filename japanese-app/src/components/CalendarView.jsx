import { useState } from "react";
import { getDayNumber } from "../data/curriculum";

const DAYS = ["일","월","화","수","목","금","토"];

// 날짜 → Day 번호 변환
const START = new Date(2026, 5, 27); // 2026-06-27 로컬
function dateToDay(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((d - START) / 86400000) + 1;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export default function CalendarView({ daily, onSelectDay, onClose }) {
  const today = new Date();
  const todayDay = getDayNumber();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  // 이 달의 날짜 배열 생성
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=일
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 6주로 패딩
  while (cells.length % 7 !== 0) cells.push(null);

  const monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg p-5 pb-8"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">‹</button>
          <p className="font-bold text-gray-800 text-lg">{viewYear}년 {monthNames[viewMonth]}</p>
          <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg">›</button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <p key={d} className={`text-center text-xs font-semibold ${d==="일"?"text-red-400":d==="토"?"text-blue-400":"text-gray-400"}`}>{d}</p>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;

            const date = new Date(viewYear, viewMonth, day);
            const key = dateKey(date);
            const dayNum = dateToDay(date);
            const isToday = key === dateKey(today);
            const isFuture = date > today;
            const isBeforeStart = dayNum < 1;
            const done = daily[key] || {};
            const doneCount = Object.values(done).filter(Boolean).length;
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            let bgStyle = "bg-white border border-gray-100 text-gray-400";
            if (isBeforeStart) bgStyle = "text-gray-200";
            else if (isToday) bgStyle = "bg-indigo-600 text-white font-bold";
            else if (isFuture) bgStyle = "text-gray-300";
            else if (doneCount >= 4) bgStyle = "bg-green-400 text-white";
            else if (doneCount > 0) bgStyle = "bg-yellow-100 border border-yellow-300 text-yellow-700";
            else bgStyle = "bg-white border border-gray-100 text-gray-600";

            const clickable = !isBeforeStart && !isFuture;

            return (
              <button
                key={day}
                disabled={!clickable}
                onClick={() => clickable && onSelectDay(dayNum)}
                className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${bgStyle} ${clickable ? "active:scale-90" : "cursor-default"} ${isWeekend && !isToday && !isFuture && !isBeforeStart ? "font-medium" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex gap-4 justify-center mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 완료</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-300 inline-block" /> 일부</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> 오늘</span>
        </div>

        <button onClick={onClose} className="mt-4 w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium">닫기</button>
      </div>
    </div>
  );
}
