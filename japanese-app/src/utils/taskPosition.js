// 학습 도중(카드 몇 번째, 퀴즈 몇 번째 등) 위치를 localStorage에 저장해서,
// 폰을 껐다 켜거나 앱이 백그라운드에서 새로고침돼도 처음부터 다시 하지 않고
// 멈췄던 자리에서 이어갈 수 있게 한다.
function positionKey(profile, dayNum, task) {
  return `jp_taskpos_${profile}_${dayNum}_${task}`;
}

export function loadTaskPosition(profile, dayNum, task) {
  try {
    const raw = localStorage.getItem(positionKey(profile, dayNum, task));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTaskPosition(profile, dayNum, task, position) {
  localStorage.setItem(positionKey(profile, dayNum, task), JSON.stringify(position));
}

export function clearTaskPosition(profile, dayNum, task) {
  localStorage.removeItem(positionKey(profile, dayNum, task));
}

export function clampIndex(idx, length) {
  if (!length || length <= 0) return 0;
  return Math.min(Math.max(idx || 0, 0), length - 1);
}
