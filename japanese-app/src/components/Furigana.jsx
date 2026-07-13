import { hasKanji, normalizeReading } from "../utils/japaneseReading";

const isKanjiChar = hasKanji;

// 한자 구간/비한자 구간으로 분리하고 각각에 읽기를 배분
function segmentFurigana(japanese, reading) {
  // 1단계: 한자 연속 구간과 그 외 구간으로 분리
  const segments = [];
  let i = 0;
  while (i < japanese.length) {
    if (isKanjiChar(japanese[i])) {
      let start = i;
      while (i < japanese.length && isKanjiChar(japanese[i])) i++;
      segments.push({ text: japanese.slice(start, i), isKanji: true });
    } else {
      let start = i;
      while (i < japanese.length && !isKanjiChar(japanese[i])) i++;
      segments.push({ text: japanese.slice(start, i), isKanji: false });
    }
  }

  // 2단계: 읽기 문자열에서 각 구간에 해당하는 부분을 추출
  let r = 0;
  const result = [];

  for (let si = 0; si < segments.length; si++) {
    const seg = segments[si];

    if (!seg.isKanji) {
      // 비한자(히라가나·카타카나·부호 등): 읽기와 1:1 대응, 그대로 소비
      r += seg.text.length;
      result.push({ text: seg.text, ruby: null });
    } else {
      // 한자 구간: 다음 비한자 구간의 첫 글자를 앵커로 삼아 읽기 범위 결정
      const nextSeg = segments[si + 1];
      let readingEnd;

      if (!nextSeg) {
        // 마지막 구간이면 나머지 읽기 전부
        readingEnd = reading.length;
      } else {
        // 다음 비한자 첫 글자를 읽기 문자열에서 찾는다
        // r+1부터 탐색해야 한자 읽기가 최소 1글자 이상 보장됨
        const anchor = nextSeg.text[0];
        readingEnd = reading.indexOf(anchor, r + 1);
        if (readingEnd === -1) readingEnd = reading.length;
      }

      result.push({ text: seg.text, ruby: reading.slice(r, readingEnd) });
      r = readingEnd;
    }
  }

  return result;
}

export default function Furigana({ japanese, reading, className = "" }) {
  if (!japanese) return null;

  if (!hasKanji(japanese)) {
    return <span className={className}>{japanese}</span>;
  }

  const hiraganaReading = normalizeReading(reading);
  if (!hiraganaReading) {
    return <span className={className}>{japanese}</span>;
  }

  const segments = segmentFurigana(japanese, hiraganaReading);

  return (
    <span className={className} style={{ lineHeight: "2.2" }}>
      {segments.map((seg, i) =>
        seg.ruby ? (
          <ruby key={i} style={{ rubyAlign: "center" }}>
            {seg.text}
            <rt style={{ fontSize: "0.5em", letterSpacing: "0.05em", color: "#818cf8" }}>
              {seg.ruby}
            </rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
