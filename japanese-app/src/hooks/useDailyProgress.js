import { useState, useEffect } from "react";
import { getCaliforniaToday, getDayNumber } from "../data/curriculum";

const PROFILE_KEY = "jp_profile";

export function getStoredProfile() {
  return localStorage.getItem(PROFILE_KEY) || null;
}

export function setStoredProfile(name) {
  localStorage.setItem(PROFILE_KEY, name);
}

function dailyKey(profileName) {
  return `jp_daily_${profileName}`;
}

function startKeyStorageKey(profileName) {
  return `jp_start_${profileName}`;
}

function load(profileName) {
  try { return JSON.parse(localStorage.getItem(dailyKey(profileName))) || {}; }
  catch { return {}; }
}

// 이 프로필이 학습을 시작한 날짜(YYYY-MM-DD)를 반환. 처음 보는 프로필이면
// 지금까지 기록된 학습 이력 중 가장 이른 날짜(없으면 오늘)로 한 번만 정해서 저장한다.
// 이렇게 해야 프로필마다 "Day 몇째" 번호가 실제 진도에 맞게 서로 달라진다.
function ensureStartKey(profileName, daily) {
  const key = startKeyStorageKey(profileName);
  let stored = localStorage.getItem(key);
  if (!stored) {
    const recordedDates = Object.keys(daily).sort();
    stored = recordedDates[0] || dateKey();
    localStorage.setItem(key, stored);
  }
  return stored;
}

// 캘리포니아(LA) 기준 "YYYY-MM-DD" 키. date 인자 없으면 오늘(CA) 반환
function dateKey(date = null) {
  const d = date || getCaliforniaToday();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useDailyProgress(profileName) {
  const [daily, setDaily] = useState(() => load(profileName));
  const [startKey] = useState(() => ensureStartKey(profileName, load(profileName)));
  const dayNum = getDayNumber(startKey);

  useEffect(() => {
    localStorage.setItem(dailyKey(profileName), JSON.stringify(daily));
  }, [daily, profileName]);

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
    const today = getCaliforniaToday();
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
    const today = getCaliforniaToday();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = dateKey(d);
      const done = daily[key] || {};
      const count = Object.values(done).filter(Boolean).length;
      return { date: d, key, count, isToday: i === 6 };
    });
  }

  return { markTask, getTodayDone, getDayDone, getStreak, getWeekStatus, dateKey, daily, dayNum, startKey };
}
