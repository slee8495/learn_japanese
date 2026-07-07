import { useState, useEffect } from "react";
import { getCaliforniaToday, getDayNumber, dayNumToDateKey } from "../data/curriculum";

const PROFILE_KEY = "jp_profile";
const TASK_KEYS = ["kana", "words", "grammar", "sentence"];

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

function dayProgressKey(profileName) {
  return `jp_dayprogress_${profileName}`;
}

function load(profileName) {
  try { return JSON.parse(localStorage.getItem(dailyKey(profileName))) || {}; }
  catch { return {}; }
}

function isDayComplete(dayDone) {
  return TASK_KEYS.every((t) => dayDone?.[t]);
}

// Day 번호별 완료 기록을 반환. 예전에는 완료 여부를 실제 날짜로만 저장했으므로,
// 처음 호출될 때는 그 프로필의 시작일 기준 "자연스러운 날짜"에 남아있는 완료 기록을
// Day 번호별 기록으로 한 번 옮겨온다(마이그레이션). 이후로는 이 기록이 진도의 기준이 된다.
function ensureDayProgress(profileName, daily, startKey) {
  const key = dayProgressKey(profileName);
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* 파싱 실패 시 재구성 */ }
  }
  const rebuilt = {};
  const calendarDayNum = getDayNumber(startKey);
  for (let d = 1; d <= calendarDayNum; d++) {
    const naturalKey = dayNumToDateKey(d, startKey);
    if (daily[naturalKey]) rebuilt[d] = daily[naturalKey];
  }
  localStorage.setItem(key, JSON.stringify(rebuilt));
  return rebuilt;
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
  const [dayProgress, setDayProgress] = useState(() => ensureDayProgress(profileName, load(profileName), startKey));

  useEffect(() => {
    localStorage.setItem(dailyKey(profileName), JSON.stringify(daily));
  }, [daily, profileName]);

  useEffect(() => {
    localStorage.setItem(dayProgressKey(profileName), JSON.stringify(dayProgress));
  }, [dayProgress, profileName]);

  // 실제 캘린더 날짜와 상관없이 "아직 다 못 끝낸 가장 이른 Day"가 현재 Day.
  // 어제 걸 다 못 끝냈으면 오늘이 와도 그대로 남아있고, 오늘 걸 다 끝내면 실제 날짜와 상관없이
  // 바로 다음 Day가 열려서 하루에 여러 Day를 이어서 할 수 있다.
  const maxKnownDay = Object.keys(dayProgress).reduce((max, k) => Math.max(max, Number(k)), 0);
  let dayNum = maxKnownDay + 1;
  for (let d = 1; d <= maxKnownDay + 1; d++) {
    if (!isDayComplete(dayProgress[d])) { dayNum = d; break; }
  }

  function markTask(task, dayKey = dateKey()) {
    setDaily(prev => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || {}), [task]: true },
    }));
  }

  // Day 번호 기준 완료 기록 — 실제로 어느 날짜에 했든 상관없이 "그 Day를 끝냈는지"만 추적
  function markDayTask(dayNumToMark, task) {
    setDayProgress(prev => ({
      ...prev,
      [dayNumToMark]: { ...(prev[dayNumToMark] || {}), [task]: true },
    }));
  }

  function getTodayDone() {
    return dayProgress[dayNum] || {};
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

  return { markTask, markDayTask, getTodayDone, getDayDone, getStreak, getWeekStatus, dateKey, daily, dayNum, startKey };
}
