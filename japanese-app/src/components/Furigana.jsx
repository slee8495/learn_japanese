import { hasKanji, normalizeReading, segmentFurigana } from "../utils/japaneseReading";

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
