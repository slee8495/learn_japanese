// 로컬(localStorage)이 항상 우선이고, 서버(Redis)는 백업/복원용이다.
// 이 기기의 로컬 데이터가 통째로 사라졌을 때(사파리가 사이트 데이터를
// 정리했거나, 앱을 지웠다 다시 깐 경우)만 서버에서 되살리고, 평소에는
// 변경이 생길 때마다 조용히 서버로 백업만 한다.

const DAY_PROGRESS_KEY = (profile) => `jp_dayprogress_${profile}`;
const PINNED_KEY = (profile) => `jp_pinned_${profile}`;
const LONGTERM_KEY = (profile) => `jp_longterm_${profile}`;
const REVIEWFLAGS_KEY = (profile) => `jp_reviewflags_${profile}`;

const pending = new Map(); // profile -> 누적된 변경 조각
const timers = new Map();
const DEBOUNCE_MS = 1500;

function readLocalSnapshot(profile) {
  const snap = {};
  const dp = localStorage.getItem(DAY_PROGRESS_KEY(profile));
  if (dp) snap.dayProgress = JSON.parse(dp);
  const pin = localStorage.getItem(PINNED_KEY(profile));
  if (pin != null) snap.pinnedDayNum = Number(pin);
  const lt = localStorage.getItem(LONGTERM_KEY(profile));
  if (lt) snap.longtermQueue = JSON.parse(lt);
  const rf = localStorage.getItem(REVIEWFLAGS_KEY(profile));
  if (rf) snap.reviewFlags = JSON.parse(rf);
  return snap;
}

// 앱을 켤 때마다 한 번 호출한다.
// - 이 기기에 로컬 기록이 없으면(=지워졌거나 처음 쓰는 기기) 서버에서 복원한다.
// - 로컬 기록이 이미 있으면(평소의 경우) 그걸 그대로 서버로 백업해 둔다 —
//   그래야 "지금까지 로컬에만 있던" 기존 진행 기록도 이 업데이트 이후
//   첫 실행 한 번으로 서버에 안전하게 올라간다.
export async function bootstrapProfileSync(profile) {
  const hasLocal = localStorage.getItem(DAY_PROGRESS_KEY(profile)) !== null;

  if (hasLocal) {
    const snap = readLocalSnapshot(profile);
    if (Object.keys(snap).length > 0) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, ...snap }),
      }).catch(() => {});
    }
    return { restored: false };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`/api/progress?profile=${encodeURIComponent(profile)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { restored: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    if (!data) return { restored: false, error: "서버에 저장된 기록 없음" };

    if (data.dayProgress) localStorage.setItem(DAY_PROGRESS_KEY(profile), JSON.stringify(data.dayProgress));
    if (data.pinnedDayNum != null) localStorage.setItem(PINNED_KEY(profile), String(data.pinnedDayNum));
    if (data.longtermQueue) localStorage.setItem(LONGTERM_KEY(profile), JSON.stringify(data.longtermQueue));
    if (data.reviewFlags) localStorage.setItem(REVIEWFLAGS_KEY(profile), JSON.stringify(data.reviewFlags));
    return { restored: true };
  } catch (err) {
    // 오프라인이거나 서버 응답이 없으면 그냥 빈 상태로 시작한다.
    return { restored: false, error: err?.name === "AbortError" ? "시간 초과" : String(err?.message || err) };
  }
}

export function schedulePush(profile, partial) {
  pending.set(profile, { ...(pending.get(profile) || {}), ...partial });
  clearTimeout(timers.get(profile));
  timers.set(profile, setTimeout(() => flush(profile), DEBOUNCE_MS));
}

function flush(profile, useBeacon = false) {
  const data = pending.get(profile);
  timers.delete(profile);
  pending.delete(profile);
  if (!data) return;

  const body = JSON.stringify({ profile, ...data });
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon("/api/progress", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {
    // 실패해도 로컬스토리지가 이번 세션의 정답이므로 조용히 무시한다.
  });
}

function flushAllPending() {
  for (const profile of pending.keys()) flush(profile, true);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAllPending();
  });
  window.addEventListener("pagehide", flushAllPending);
}
