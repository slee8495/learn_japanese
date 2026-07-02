// 로마자 → 히라가나 변환기
// "ryouri" → "りょうり", "gakkou" → "がっこう"

const TABLE = [
  // 4자 먼저
  ['tchi','っち'],
  // 3자
  ['sha','しゃ'],['shi','し'],['shu','しゅ'],['sho','しょ'],
  ['chi','ち'],['cha','ちゃ'],['chu','ちゅ'],['cho','ちょ'],
  ['tsu','つ'],
  ['kya','きゃ'],['kyu','きゅ'],['kyo','きょ'],
  ['nya','にゃ'],['nyu','にゅ'],['nyo','にょ'],
  ['hya','ひゃ'],['hyu','ひゅ'],['hyo','ひょ'],
  ['mya','みゃ'],['myu','みゅ'],['myo','みょ'],
  ['rya','りゃ'],['ryu','りゅ'],['ryo','りょ'],
  ['gya','ぎゃ'],['gyu','ぎゅ'],['gyo','ぎょ'],
  ['bya','びゃ'],['byu','びゅ'],['byo','びょ'],
  ['pya','ぴゃ'],['pyu','ぴゅ'],['pyo','ぴょ'],
  // 2자
  ['ka','か'],['ki','き'],['ku','く'],['ke','け'],['ko','こ'],
  ['sa','さ'],['si','し'],['su','す'],['se','せ'],['so','そ'],
  ['ta','た'],['ti','ち'],['tu','つ'],['te','て'],['to','と'],
  ['na','な'],['ni','に'],['nu','ぬ'],['ne','ね'],['no','の'],
  ['ha','は'],['hi','ひ'],['fu','ふ'],['hu','ふ'],['he','へ'],['ho','ほ'],
  ['ma','ま'],['mi','み'],['mu','む'],['me','め'],['mo','も'],
  ['ya','や'],['yu','ゆ'],['yo','よ'],
  ['ra','ら'],['ri','り'],['ru','る'],['re','れ'],['ro','ろ'],
  ['wa','わ'],['wo','を'],
  ['ga','が'],['gi','ぎ'],['gu','ぐ'],['ge','げ'],['go','ご'],
  ['za','ざ'],['zi','じ'],['zu','ず'],['ze','ぜ'],['zo','ぞ'],
  ['ja','じゃ'],['ji','じ'],['ju','じゅ'],['jo','じょ'],
  ['da','だ'],['di','ぢ'],['du','づ'],['de','で'],['do','ど'],
  ['ba','ば'],['bi','び'],['bu','ぶ'],['be','べ'],['bo','ぼ'],
  ['pa','ぱ'],['pi','ぴ'],['pu','ぷ'],['pe','ぺ'],['po','ぽ'],
  // 1자
  ['a','あ'],['i','い'],['u','う'],['e','え'],['o','お'],
];

export function romajiToHiragana(romaji) {
  if (!romaji) return '';
  const s = romaji.toLowerCase();
  let result = '';
  let i = 0;

  while (i < s.length) {
    const c = s[i];

    // 공백·숫자·구두점은 그대로
    if (c === ' ' || c === '　' || /[0-9.,!?、。！？\-]/.test(c)) {
      result += c; i++; continue;
    }

    // 'n' 처리: 뒤에 모음/y 없으면 ん
    if (c === 'n' && (i + 1 >= s.length || !/[aiueoy]/.test(s[i + 1]))) {
      result += 'ん'; i++; continue;
    }

    // 겹자음 → っ (nn 제외)
    if (c !== 'n' && i + 1 < s.length && c === s[i + 1] && /[a-z]/.test(c)) {
      result += 'っ'; i++; continue;
    }

    // 테이블에서 가장 긴 것부터 매칭
    let matched = false;
    for (const [rom, hira] of TABLE) {
      if (s.startsWith(rom, i)) {
        result += hira;
        i += rom.length;
        matched = true;
        break;
      }
    }

    if (!matched) { result += c; i++; }
  }

  return result;
}
