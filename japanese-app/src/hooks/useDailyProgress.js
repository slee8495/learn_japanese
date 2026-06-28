import { useState, useEffect } from "react";

const KEY = "jp_daily";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

// 로컬 시간 기준 "2026-06-27" 형태 키 — toISOString()은 UTC라 timezone 버그 있음
function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useDailyProgress() {
  const [daily, setDaily] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(daily));
  }, [daily]);

  function markTask(task, dayKey = dateKey()) {
    setDaily(prev => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || {}), [task]: true },
    }));
  }

  function getTodayDone() {
    return daily[dateKey()] || {};
  }

  function getDayDone(dayKey) {
    return daily[dayKey] || {};
  }

  function getStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const done = daily[key] || {};
      const count = Object.values(done).filter(Boolean).length;
      if (count > 0) streak++;
      else if (i > 0) break;
    }
    return streak;
  }

  function getWeekStatus() {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = dateKey(d);
      const done = daily[key] || {};
      const count = Object.values(done).filter(Boolean).length;
      return { date: d, key, count, isToday: i === 6 };
    });
  }

  return { markTask, getTodayDone, getDayDone, getStreak, getWeekStatus, dateKey, daily };
}
