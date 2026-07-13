// 실제 달력이 아니라 "Day 1, Day 2, ..." 그리드. Day는 프로필별 진도 속도에
// 따라 정해지므로(달력 날짜와 무관) 요일/월 개념의 달력은 더 이상 의미가 없다.
export default function CalendarView({ dayProgress, todayDayNum, unlockedDayNum, onSelectDay, onClose }) {
  const days = Array.from({ length: unlockedDayNum ?? todayDayNum }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg pb-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <p className="font-bold text-gray-800 text-lg mb-4">지금까지의 모든 Day</p>

          <div className="grid grid-cols-5 gap-2 max-h-[60vh] overflow-y-auto">
            {days.map((day) => {
              const done = dayProgress[day] || {};
              const doneCount = Object.values(done).filter(Boolean).length;
              const isReview = day % 5 === 0;
              const isToday = day === todayDayNum;
              const isComplete = isReview ? doneCount >= 1 : doneCount >= 4;

              let style = "bg-white border border-gray-100 text-gray-600";
              if (isToday) style = "bg-indigo-600 text-white font-bold";
              else if (isComplete) style = "bg-green-400 text-white";
              else if (doneCount > 0) style = "bg-yellow-100 border border-yellow-300 text-yellow-700";

              return (
                <button
                  key={day}
                  onClick={() => onSelectDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-90 ${style}`}
                >
                  {isReview && <span className="text-sm leading-none">🎯</span>}
                  <span>{day}</span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 완료</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-200 border border-yellow-300 inline-block" /> 일부</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> 오늘</span>
            <span className="flex items-center gap-1">🎯 복습일</span>
          </div>

          <button onClick={onClose} className="mt-4 w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-medium">닫기</button>
        </div>
      </div>
    </div>
  );
}
