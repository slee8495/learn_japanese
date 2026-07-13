import { useState, useEffect } from "react";
import { isReviewDay, hasDailyReview } from "../data/curriculum";

const PROFILE_KEY = "jp_profile";
const TASK_KEYS = ["kana", "words", "grammar", "sentence"];

export function getStoredProfile() {
  return localStorage.getItem(PROFILE_KEY) || null;
}

export function setStoredProfile(name) {
  localStorage.setItem(PROFILE_KEY, name);
}

function dayProgressKey(profileName) {
  return `jp_dayprogress_${profileName}`;
}

function pinnedDayKey(profileName) {
  return `jp_pinned_${profileName}`;
}

// Day 번호는 실제 달력 날짜가 아니라 "그 Day의 할 일을 다 끝냈는지"로만 진행된다.
// 복습일(5일마다)은 태스크가 "review" 하나뿐이고, 그 외 날은 4개 모두 끝내야 한다.
function requiredTasks(dayNum) {
  if (isReviewDay(dayNum)) return ["review"];
  return hasDailyReview(dayNum) ? ["dailyReview", ...TASK_KEYS] : TASK_KEYS;
}

function isDayComplete(dayNum, dayDone) {
  return requiredTasks(dayNum).every((t) => dayDone?.[t]);
}

function loadDayProgress(profileName) {
  try { return JSON.parse(localStorage.getItem(dayProgressKey(profileName))) || {}; }
  catch { return {}; }
}

// 완료 기록만 보고 계산하는 "가장 이른 미완료 Day" — 이 Day까지는 이미
// 잠금 해제된 상태다(달력에서 볼 수 있음). 화면에 실제로 보여주는 Day와는 별개.
function earliestIncompleteDay(dayProgress) {
  const maxKnownDay = Object.keys(dayProgress).reduce((max, k) => Math.max(max, Number(k)), 0);
  for (let d = 1; d <= maxKnownDay + 1; d++) {
    if (!isDayComplete(d, dayProgress[d])) return d;
  }
  return maxKnownDay + 1;
}

function loadPinnedDayNum(profileName, dayProgress) {
  const raw = localStorage.getItem(pinnedDayKey(profileName));
  if (raw !== null) {
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  }
  // 처음 저장하는 경우(마이그레이션 포함) — 지금까지의 진행 기록 기준 "오늘"로 시작
  const initial = earliestIncompleteDay(dayProgress);
  localStorage.setItem(pinnedDayKey(profileName), String(initial));
  return initial;
}

export function useDailyProgress(profileName) {
  const [dayProgress, setDayProgress] = useState(() => loadDayProgress(profileName));
  const [pinnedDayNum, setPinnedDayNum] = useState(() => loadPinnedDayNum(profileName, loadDayProgress(profileName)));

  useEffect(() => {
    localStorage.setItem(dayProgressKey(profileName), JSON.stringify(dayProgress));
  }, [dayProgress, profileName]);

  useEffect(() => {
    localStorage.setItem(pinnedDayKey(profileName), String(pinnedDayNum));
  }, [pinnedDayNum, profileName]);

  // 오늘 할 일을 다 끝내면 다음 Day는 조용히 잠금 해제되지만(unlockedDayNum),
  // 홈 화면은 사용자가 달력에서 직접 다음 Day를 고르기 전까지 그대로 오늘에 머문다.
  const dayNum = pinnedDayNum;
  const unlockedDayNum = Math.max(dayNum, earliestIncompleteDay(dayProgress));

  // Day 번호 기준 완료 기록 — 실제로 언제 했든 상관없이 "그 Day를 끝냈는지"만 추적
  function markDayTask(dayNumToMark, task) {
    setDayProgress((prev) => ({
      ...prev,
      [dayNumToMark]: { ...(prev[dayNumToMark] || {}), [task]: true },
    }));
  }

  // 달력에서 아직 안 가본 Day를 고르면, 그 Day를 새로운 "오늘"로 확정한다.
  function setHomeDay(d) {
    setPinnedDayNum(d);
  }

  // Day 번호로 그 Day의 완료 현황을 조회 (지난 Day를 볼 때 사용)
  function getDayProgress(dayNumToCheck) {
    return dayProgress[dayNumToCheck] || {};
  }

  // 현재 Day 바로 전날부터 거슬러 올라가며 연속으로 끝낸 Day 수
  function getStreak() {
    let streak = 0;
    let d = dayNum - 1;
    while (d >= 1 && isDayComplete(d, dayProgress[d])) {
      streak++;
      d--;
    }
    return streak;
  }

  // 최근 n개 Day(현재 Day 포함)의 진행 현황 — 홈 화면의 "최근 Day" 스트립에 사용
  function getRecentStatus(n = 7) {
    const start = Math.max(1, dayNum - n + 1);
    const days = [];
    for (let d = start; d <= dayNum; d++) {
      const done = dayProgress[d] || {};
      const total = requiredTasks(d).length;
      const count = requiredTasks(d).filter((t) => done[t]).length;
      days.push({ day: d, count, total, done: count === total, isReview: isReviewDay(d), isToday: d === dayNum });
    }
    return days;
  }

  return { markDayTask, getDayProgress, getStreak, getRecentStatus, dayProgress, dayNum, unlockedDayNum, setHomeDay };
}
