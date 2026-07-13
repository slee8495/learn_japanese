// 히라가나/가타카나 → 로마자(영어 발음 표기) 변환기.
// 촉음(っ/ッ), 장음(ー), 요음(きゃ 등), ん의 아포스트로피 처리 포함.
const YOON = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo",
  うぃ: "wi", うぇ: "we", うぉ: "wo",
  てぃ: "ti", でぃ: "di", とぅ: "tu", どぅ: "du",
  ちぇ: "che", じぇ: "je", しぇ: "she",
  ゔぁ: "va", ゔぃ: "vi", ゔぇ: "ve", ゔぉ: "vo",
};

const BASE = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "i", ゑ: "e", を: "o", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ゔ: "vu",
};

function toHiraganaEquivalent(ch) {
  const code = ch.codePointAt(0);
  if (code >= 0x30a1 && code <= 0x30f6) return String.fromCharCode(code - 0x60);
  return ch;
}

function romajiForNext(chars, i) {
  const pair = (chars[i] || "") + (chars[i + 1] || "");
  return YOON[pair] || BASE[chars[i]] || "";
}

export function kanaToRomaji(text) {
  if (!text) return "";
  const chars = Array.from(text).map(toHiraganaEquivalent);
  let out = "";
  let lastVowel = "";
  let i = 0;

  while (i < chars.length) {
    const c = chars[i];

    if (c === "ー") { out += lastVowel; i++; continue; }

    if (c === "っ") {
      const next = romajiForNext(chars, i + 1);
      if (next) out += next[0];
      i++;
      continue;
    }

    const pair = c + (chars[i + 1] || "");
    if (YOON[pair]) {
      out += YOON[pair];
      lastVowel = YOON[pair].slice(-1);
      i += 2;
      continue;
    }

    if (c === "ん") {
      const next = romajiForNext(chars, i + 1);
      out += "n" + (/^[aiueoy]/.test(next) ? "'" : "");
      i++;
      continue;
    }

    const r = BASE[c];
    if (r !== undefined) {
      out += r;
      lastVowel = r.slice(-1) || lastVowel;
      i++;
      continue;
    }

    out += c;
    i++;
  }

  return out;
}
