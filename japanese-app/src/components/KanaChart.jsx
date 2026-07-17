import { useState } from "react";

function speak(text) {
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ja-JP";
  utt.rate = 0.85;
  speechSynthesis.speak(utt);
}

// 오십음도 행 데이터 [히라가나, 카타카나, 로마자]
const ROWS = [
  { label: "あ/ア", chars: [["あ","ア","a"],["い","イ","i"],["う","ウ","u"],["え","エ","e"],["お","オ","o"]] },
  { label: "か/カ", chars: [["か","カ","ka"],["き","キ","ki"],["く","ク","ku"],["け","ケ","ke"],["こ","コ","ko"]] },
  { label: "さ/サ", chars: [["さ","サ","sa"],["し","シ","shi"],["す","ス","su"],["せ","セ","se"],["そ","ソ","so"]] },
  { label: "た/タ", chars: [["た","タ","ta"],["ち","チ","chi"],["つ","ツ","tsu"],["て","テ","te"],["と","ト","to"]] },
  { label: "な/ナ", chars: [["な","ナ","na"],["に","ニ","ni"],["ぬ","ヌ","nu"],["ね","ネ","ne"],["の","ノ","no"]] },
  { label: "は/ハ", chars: [["は","ハ","ha"],["ひ","ヒ","hi"],["ふ","フ","fu"],["へ","ヘ","he"],["ほ","ホ","ho"]] },
  { label: "ま/マ", chars: [["ま","マ","ma"],["み","ミ","mi"],["む","ム","mu"],["め","メ","me"],["も","モ","mo"]] },
  { label: "や/ヤ", chars: [["や","ヤ","ya"],[null,null,null],["ゆ","ユ","yu"],[null,null,null],["よ","ヨ","yo"]] },
  { label: "ら/ラ", chars: [["ら","ラ","ra"],["り","リ","ri"],["る","ル","ru"],["れ","レ","re"],["ろ","ロ","ro"]] },
  { label: "わ/ワ", chars: [["わ","ワ","wa"],[null,null,null],[null,null,null],[null,null,null],["を","ヲ","wo"]] },
  { label: "ん/ン", chars: [["ん","ン","n"],[null,null,null],[null,null,null],[null,null,null],[null,null,null]] },
];

const VOICED = [
  { label: "が/ガ", chars: [["が","ガ","ga"],["ぎ","ギ","gi"],["ぐ","グ","gu"],["げ","ゲ","ge"],["ご","ゴ","go"]] },
  { label: "ざ/ザ", chars: [["ざ","ザ","za"],["じ","ジ","ji"],["ず","ズ","zu"],["ぜ","ゼ","ze"],["ぞ","ゾ","zo"]] },
  { label: "だ/ダ", chars: [["だ","ダ","da"],["ぢ","ヂ","ji"],["づ","ヅ","zu"],["で","デ","de"],["ど","ド","do"]] },
  { label: "ば/バ", chars: [["ば","バ","ba"],["び","ビ","bi"],["ぶ","ブ","bu"],["べ","ベ","be"],["ぼ","ボ","bo"]] },
  { label: "ぱ/パ", chars: [["ぱ","パ","pa"],["ぴ","ピ","pi"],["ぷ","プ","pu"],["ぺ","ペ","pe"],["ぽ","ポ","po"]] },
];

const COL_LABELS = ["a", "i", "u", "e", "o"];

function CharCell({ hira, kata, romaji, mode }) {
  if (!hira) return <div className="w-full h-full" />;
  const char = mode === "hira" ? hira : kata;
  return (
    <button
      onClick={() => speak(char)}
      className="flex flex-col items-center justify-center bg-white border border-sumi-100 rounded-xl py-1.5 active:bg-ai-50 active:border-ai-200 transition-colors w-full"
    >
      <span className="text-xl font-medium text-sumi-800">{char}</span>
      <span className="text-sumi-400" style={{ fontSize: "0.6rem" }}>{romaji}</span>
    </button>
  );
}

function Table({ rows, mode }) {
  return (
    <div className="flex flex-col gap-1">
      {/* 열 레이블 */}
      <div className="grid gap-1" style={{ gridTemplateColumns: "2.2rem repeat(5, 1fr)" }}>
        <div />
        {COL_LABELS.map(c => (
          <div key={c} className="text-center text-xs text-sumi-400 font-medium py-0.5">{c}</div>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1" style={{ gridTemplateColumns: "2.2rem repeat(5, 1fr)" }}>
          <div className="flex items-center justify-center text-xs text-sumi-400 font-medium"
            style={{ fontSize: "0.6rem", lineHeight: 1.1 }}>
            {row.label}
          </div>
          {row.chars.map(([h, k, r], i) => (
            <CharCell key={i} hira={h} kata={k} romaji={r} mode={mode} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function KanaChart() {
  const [mode, setMode] = useState("hira"); // "hira" | "kata"
  const [showVoiced, setShowVoiced] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 px-3 max-w-lg mx-auto">

      {/* 히라가나 / 카타카나 전환 */}
      <div className="flex gap-2 bg-sumi-100 rounded-2xl p-1">
        {[{ id: "hira", label: "히라가나 あ" }, { id: "kata", label: "카타카나 ア" }].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              mode === m.id ? "bg-white text-ai-600 shadow-sm" : "text-sumi-500"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-center text-sumi-300">🔊</p>

      {/* 기본 오십음도 */}
      <div className="bg-sumi-50 rounded-2xl p-3">
        <p className="text-xs font-semibold text-sumi-500 mb-2">기본 오십음도</p>
        <Table rows={ROWS} mode={mode} />
      </div>

      {/* 탁음 / 반탁음 */}
      <button
        onClick={() => setShowVoiced(v => !v)}
        className="flex items-center justify-between bg-sumi-50 rounded-2xl px-4 py-3 text-sm font-semibold text-sumi-600"
      >
        <span>탁음 · 반탁음 (が/ざ/だ/ば/ぱ행)</span>
        <span>{showVoiced ? "▲" : "▼"}</span>
      </button>

      {showVoiced && (
        <div className="bg-sumi-50 rounded-2xl p-3">
          <Table rows={VOICED} mode={mode} />
        </div>
      )}
    </div>
  );
}
