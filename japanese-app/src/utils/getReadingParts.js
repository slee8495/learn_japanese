import { hasKanji, normalizeReading } from "./japaneseReading";
import { kanaToRomaji } from "./kanaToRomaji";

// 데이터마다 reading 필드가 히라가나로도, 로마자로도 뒤섞여 저장돼 있어서
// (예: "きょう" vs "ohayou") 화면에 보여줄 히라가나·로마자를 여기서 항상
// 일관되게 다시 만들어낸다. 한자가 없는 단어는 원문 자체가 곧 히라가나/
// 가타카나이므로 reading 필드를 아예 쓰지 않고 원문에서 바로 변환한다.
export function getReadingParts(japanese, reading) {
  if (!japanese) return { hiragana: "", romaji: "" };
  const hiragana = hasKanji(japanese) ? (normalizeReading(reading) || japanese) : japanese;
  return { hiragana, romaji: kanaToRomaji(hiragana) };
}
