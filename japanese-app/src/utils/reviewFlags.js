// 복습 중 "아직 못 외웠어요"를 누른 단어/문장은 다음 복습(다음날 복습, 다음
// 5일 복습 퀴즈)에도 계속 다시 나온다. "외웠어요"를 누르면 그제서야 빠진다.
function flagsKey(profile) {
  return `jp_reviewflags_${profile}`;
}

export function itemKey(item) {
  return item.japanese;
}

export function loadFlaggedItems(profile) {
  try {
    return JSON.parse(localStorage.getItem(flagsKey(profile))) || [];
  } catch {
    return [];
  }
}

export function flagItem(profile, item) {
  const flags = loadFlaggedItems(profile);
  const key = itemKey(item);
  if (flags.some((f) => f.key === key)) return;
  flags.push({ key, japanese: item.japanese, reading: item.reading, meaning: item.meaning });
  localStorage.setItem(flagsKey(profile), JSON.stringify(flags));
}

export function unflagItem(profile, item) {
  const key = itemKey(item);
  const flags = loadFlaggedItems(profile).filter((f) => f.key !== key);
  localStorage.setItem(flagsKey(profile), JSON.stringify(flags));
}

// 자연스럽게 뽑힌 카드 목록 앞에, 아직 안 외운 걸로 표시된 단어/문장들을
// 중복 없이 얹어서 이번 복습 세션의 고정된 카드 목록을 만든다.
export function mergeFlaggedCards(profile, naturalCards) {
  const flagged = loadFlaggedItems(profile);
  const naturalKeys = new Set(naturalCards.map(itemKey));
  const extra = flagged.filter((f) => !naturalKeys.has(f.key));
  return [...extra, ...naturalCards];
}
