import { itemKey } from "./reviewFlags";
import { schedulePush } from "./progressSync";

// 단기 복습("아직이에요"/"외웠어요")과는 별개로, 한 번 "외웠어요"를 확인한
// 단어/문장을 아주 잊어버리지 않도록 먼 미래에 한 번씩 랜덤하게 다시
// 띄워주는 장기 분산 복습 큐. 5번 연속 성공하면 완전히 졸업(큐에서 제거)한다.
function queueKey(profile) {
  return `jp_longterm_${profile}`;
}

function loadQueue(profile) {
  try {
    return JSON.parse(localStorage.getItem(queueKey(profile))) || [];
  } catch {
    return [];
  }
}

function saveQueue(profile, queue) {
  localStorage.setItem(queueKey(profile), JSON.stringify(queue));
  schedulePush(profile, { longtermQueue: queue });
}

// 성공 횟수(1~4)별 다음 등장까지의 최소/최대 일수. 갈수록 간격이 넓어진다.
const STAGE_RANGES = [
  [7, 20],
  [20, 40],
  [40, 70],
  [70, 100],
];
const GRADUATE_AT = 5;

function randomInterval(successCount) {
  const [min, max] = STAGE_RANGES[Math.min(successCount, STAGE_RANGES.length) - 1];
  return min + Math.floor(Math.random() * (max - min + 1));
}

// remembered=true: 성공 기록을 남기고 다음 등장일을 더 멀리 재예약한다
// (5번째 성공이면 큐에서 완전히 제거 = 졸업).
// remembered=false: 장기 큐에서 내려가고, 단기 복습("아직이에요")으로 넘어간다.
export function recordLongTermResult(profile, item, remembered, currentDay) {
  const queue = loadQueue(profile);
  const key = itemKey(item);
  const idx = queue.findIndex((q) => q.key === key);

  if (!remembered) {
    if (idx !== -1) queue.splice(idx, 1);
    saveQueue(profile, queue);
    return;
  }

  const successCount = (idx !== -1 ? queue[idx].successCount : 0) + 1;
  if (successCount >= GRADUATE_AT) {
    if (idx !== -1) queue.splice(idx, 1);
    saveQueue(profile, queue);
    return;
  }

  const entry = {
    key,
    japanese: item.japanese,
    reading: item.reading,
    meaning: item.meaning,
    successCount,
    dueDay: currentDay + randomInterval(successCount),
  };
  if (idx !== -1) queue[idx] = entry;
  else queue.push(entry);
  saveQueue(profile, queue);
}

// 오늘(dayNum) 기준으로 이미 예정일이 지났거나 도래한 것 중, 가장 오래
// 기다린 것부터 최대 maxCount개만 뽑는다. 나머지는 큐에 그대로 남아 다음
// 날 다시 후보가 되므로, 한꺼번에 몰리더라도 자연스럽게 여러 날로 나뉜다.
export function getDueLongTermItems(profile, dayNum, maxCount = 3) {
  const queue = loadQueue(profile);
  return queue
    .filter((q) => q.dueDay <= dayNum)
    .sort((a, b) => a.dueDay - b.dueDay)
    .slice(0, maxCount)
    .map((q) => ({ japanese: q.japanese, reading: q.reading, meaning: q.meaning }));
}
