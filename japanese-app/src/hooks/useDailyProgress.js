import { useState, useEffect } from "react";
import { isReviewDay } from "../data/curriculum";

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

// Day 번호는 실제 달력 날짜가 아니라 "그 Day의 할 일을 다 끝냈는지"로만 진행된다.
// 복습일(5일마다)은 태스크가 "review" 하나뿐이고, 그 외 날은 4개 모두 끝내야 한다.
function requiredTasks(dayNum) {
  return isReviewDay(dayNum) ? ["review"] : TASK_KEYS;
}

function isDayComplete(dayNum, dayDone) {
  return requiredTasks(dayNum).every((t) => dayDone?.[t]);
}

function loadDayProgress(profileName) {
  try { return JSON.parse(localStorage.getItem(dayProgressKey(profileName))) || {}; }
  catch { return {}; }
}

export function useDailyProgress(profileName) {
  const [dayProgress, setDayProgress] = useState(() => loadDayProgress(profileName));

  useEffect(() => {
    localStorage.setItem(dayProgressKey(profileName), JSON.stringify(dayProgress));
  }, [dayProgress, profileName]);

  // 실제 날짜와 상관없이 "아직 다 못 끝낸 가장 이른 Day"가 현재 Day.
  // 오늘 걸 다 끝내면 바로 다음 Day가 열려서 하루에 여러 Day를 이어서 할 수 있다.
  const maxKnownDay = Object.keys(dayProgress).reduce((max, k) => Math.max(max, Number(k)), 0);
  let dayNum = maxKnownDay + 1;
  for (let d = 1; d <= maxKnownDay + 1; d++) {
    if (!isDayComplete(d, dayProgress[d])) { dayNum = d; break; }
  }

  // Day 번호 기준 완료 기록 — 실제로 언제 했든 상관없이 "그 Day를 끝냈는지"만 추적
  function markDayTask(dayNumToMark, task) {
    setDayProgress((prev) => ({
      ...prev,
      [dayNumToMark]: { ...(prev[dayNumToMark] || {}), [task]: true },
    }));
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

  return { markDayTask, getDayProgress, getStreak, getRecentStatus, dayProgress, dayNum };
}
