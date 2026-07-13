import { hasKanji, normalizeReading, segmentFurigana } from "./japaneseReading";
import { kanaToRomaji } from "./kanaToRomaji";

// 데이터마다 reading 필드가 히라가나로도, 로마자로도 뒤섞여 저장돼 있어서
// (예: "きょう" vs "ohayou") 화면에 보여줄 히라가나·로마자를 여기서 항상
// 일관되게 다시 만들어낸다. 한자가 없는 단어는 원문 자체가 곧 히라가나/
// 가타카나이므로 reading 필드를 아예 쓰지 않고 원문에서 바로 변환한다.
//
// 로마자는 한자/비한자 구간(Furigana와 동일한 경계) 단위로 따로 변환한 뒤
// 띄어쓰기로 이어붙인다. 진짜 단어 경계는 아니지만(조사가 붙는 위치와는
// 다를 수 있음) 문장 전체가 한 덩어리로 붙어 나오는 것보다는 훨씬 읽기
// 쉽고, 단어 하나짜리 항목(한자 없음)은 애초에 나눌 구간이 없어 안전하다.
export function getReadingParts(japanese, reading) {
  if (!japanese) return { hiragana: "", romaji: "" };

  if (!hasKanji(japanese)) {
    return { hiragana: japanese, romaji: kanaToRomaji(japanese) };
  }

  const hiragana = normalizeReading(reading) || japanese;
  const segments = segmentFurigana(japanese, hiragana);
  const romaji = segments
    .map((seg) => kanaToRomaji(seg.ruby ?? seg.text))
    .filter(Boolean)
    .join(" ");

  return { hiragana, romaji };
}
