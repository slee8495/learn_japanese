import { romajiToHiragana } from "./romajiToHiragana";

export function hasKanji(text) {
  return /[一-龯㐀-䶿]/.test(text);
}

function hasHiragana(text) {
  return /[ぁ-ゖ]/.test(text);
}

// 데이터마다 reading 필드가 히라가나("きょう")로도, 로마자("kyou")로도
// 뒤섞여 저장돼 있어서, 어느 쪽이든 히라가나로 통일해서 돌려준다.
export function normalizeReading(reading) {
  if (!reading) return "";
  if (hasHiragana(reading)) return reading;
  return romajiToHiragana(reading);
}
