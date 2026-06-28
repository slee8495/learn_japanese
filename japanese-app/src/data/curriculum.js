import { hiragana, katakana } from "./kana";
import tateobaSentences from "./tatoeba-sentences.json";

// ── 문장 데이터 ───────────────────────────────────────────────
const sentences = [
  { japanese: "おはようございます", reading: "ohayou gozaimasu", meaning: "좋은 아침입니다" },
  { japanese: "こんにちは、げんきですか", reading: "konnichiwa, genki desu ka", meaning: "안녕하세요, 잘 지내세요?" },
  { japanese: "はい、げんきです。ありがとう", reading: "hai, genki desu. arigatou", meaning: "네, 잘 지내요. 고마워요" },
  { japanese: "わたしはがくせいです", reading: "watashi wa gakusei desu", meaning: "저는 학생이에요" },
  { japanese: "わたしはかんこくじんです", reading: "watashi wa kankokujin desu", meaning: "저는 한국인이에요" },
  { japanese: "きょうはなんにちですか", reading: "kyou wa nan nichi desu ka", meaning: "오늘은 며칠이에요?" },
  { japanese: "いま、なんじですか", reading: "ima, nanji desu ka", meaning: "지금 몇 시예요?" },
  { japanese: "さんじはんです", reading: "sanji han desu", meaning: "3시 반이에요" },
  { japanese: "トイレはどこですか", reading: "toire wa doko desu ka", meaning: "화장실이 어디예요?" },
  { japanese: "えきはこのちかくにありますか", reading: "eki wa kono chikaku ni arimasu ka", meaning: "역이 이 근처에 있어요?" },
  { japanese: "まっすぐいってください", reading: "massugu itte kudasai", meaning: "똑바로 가 주세요" },
  { japanese: "これはいくらですか", reading: "kore wa ikura desu ka", meaning: "이건 얼마예요?" },
  { japanese: "すこしやすくしてください", reading: "sukoshi yasuku shite kudasai", meaning: "조금 싸게 해 주세요" },
  { japanese: "これをひとつください", reading: "kore wo hitotsu kudasai", meaning: "이거 하나 주세요" },
  { japanese: "メニューをみせてください", reading: "menyuu wo misete kudasai", meaning: "메뉴 보여 주세요" },
  { japanese: "おすすめはなんですか", reading: "osusume wa nan desu ka", meaning: "추천 메뉴가 뭐예요?" },
  { japanese: "からくないですか", reading: "karakunai desu ka", meaning: "안 매워요?" },
  { japanese: "おかいけいをおねがいします", reading: "okaikei wo onegaishimasu", meaning: "계산 부탁드려요" },
  { japanese: "このでんしゃはしんじゅくにとまりますか", reading: "kono densha wa shinjuku ni tomarimasu ka", meaning: "이 전철은 신주쿠에 서요?" },
  { japanese: "つぎのえきでおります", reading: "tsugi no eki de orimasu", meaning: "다음 역에서 내려요" },
  { japanese: "すみません、えいごがわかりますか", reading: "sumimasen, eigo ga wakarimasu ka", meaning: "저기요, 영어를 아세요?" },
  { japanese: "もういちどいってください", reading: "mou ichido itte kudasai", meaning: "한 번 더 말해 주세요" },
  { japanese: "にほんごがすこしわかります", reading: "nihongo ga sukoshi wakarimasu", meaning: "일본어를 조금 알아요" },
  { japanese: "たのしかったです！またあいましょう", reading: "tanoshikatta desu! mata aimashou", meaning: "즐거웠어요! 또 만나요" },
  { japanese: "それはすごいですね", reading: "sore wa sugoi desu ne", meaning: "그건 대단하네요" },
  { japanese: "ほんとうにたのしいです", reading: "hontou ni tanoshii desu", meaning: "정말 즐거워요" },
  { japanese: "すこしつかれました", reading: "sukoshi tsukaremashita", meaning: "조금 피곤해요" },
  { japanese: "もっとべんきょうしなければなりません", reading: "motto benkyou shinakereba narimasen", meaning: "더 공부해야 해요" },
  { japanese: "にほんごがだんだんわかってきました", reading: "nihongo ga dandan wakatte kimashita", meaning: "일본어를 점점 알게 됐어요" },
  { japanese: "もしよかったら、いっしょにいきませんか", reading: "moshi yokattara, issho ni ikimasen ka", meaning: "괜찮으면 같이 안 갈래요?" },
  { japanese: "そのことについてどうおもいますか", reading: "sono koto ni tsuite dou omoimasu ka", meaning: "그것에 대해 어떻게 생각해요?" },
  { japanese: "やってみなければわかりません", reading: "yatte minakereba wakarimasen", meaning: "해보지 않으면 몰라요" },
  { japanese: "むずかしいけど、たのしいとおもいます", reading: "muzukashii kedo, tanoshii to omoimasu", meaning: "어렵지만 즐겁다고 생각해요" },
  { japanese: "にほんにいったことがありますか", reading: "nihon ni itta koto ga arimasu ka", meaning: "일본에 간 적 있어요?" },
  { japanese: "すしをたべたことがあります", reading: "sushi wo tabeta koto ga arimasu", meaning: "초밥을 먹어 본 적 있어요" },
  { japanese: "まいにちすこしずつれんしゅうすれば、かならずうまくなります", reading: "mainichi sukoshi zutsu renshuu sureba, kanarazu umaku narimasu", meaning: "매일 조금씩 연습하면 반드시 잘하게 돼요" },
  { japanese: "じかんがあれば、いっしょにえいがをみませんか", reading: "jikan ga areba, issho ni eiga wo mimasen ka", meaning: "시간 있으면 같이 영화 안 볼래요?" },
  { japanese: "かれはにほんごがじょうずなわけだ、10ねんべんきょうしたから", reading: "kare wa nihongo ga jouzu na wake da, juu nen benkyou shita kara", meaning: "그가 일본어를 잘하는 건 당연해, 10년 공부했으니까" },
  { japanese: "このケーキはおいしそうですね", reading: "kono keeki wa oishisou desu ne", meaning: "이 케이크 맛있어 보이죠?" },
  { japanese: "てんきよほうによると、あしたはゆきがふるそうです", reading: "tenki yohou ni yoru to, ashita wa yuki ga furu sou desu", meaning: "일기예보에 의하면 내일은 눈이 온답니다" },
  { japanese: "わすれないように、てちょうにかいておきました", reading: "wasurenai you ni, techou ni kaite okimashita", meaning: "잊지 않도록 수첩에 써뒀어요" },
  { japanese: "にほんごをはなせるようになりたいです", reading: "nihongo wo hanaseru you ni naritai desu", meaning: "일본어를 말할 수 있게 되고 싶어요" },
  { japanese: "さいふをわすれてきてしまいました", reading: "saifu wo wasurete kite shimaimashita", meaning: "지갑을 놓고 와버렸어요" },
  { japanese: "おんがくをききながら、べんきょうするのがすきです", reading: "ongaku wo kikinagara, benkyou suru no ga suki desu", meaning: "음악을 들으면서 공부하는 것을 좋아해요" },
];

// Tatoeba 문장을 기존 형식으로 변환해 합치기
const tateobaBeginner = (tateobaSentences.beginner || []).map((s) => ({
  japanese: s.japanese,
  reading: "",
  meaning: s.english,
}));
const tateobaIntermediate = (tateobaSentences.intermediate || []).map((s) => ({
  japanese: s.japanese,
  reading: "",
  meaning: s.english,
}));
const tateobaAdvanced = (tateobaSentences.advanced || []).map((s) => ({
  japanese: s.japanese,
  reading: "",
  meaning: s.english,
}));

// 레벨에 따라 문장 풀 선택 (dayNum 기준으로 getDayLesson에서 사용)
function getSentencePool(dayNum) {
  if (dayNum <= 60) return [...sentences, ...tateobaBeginner];
  if (dayNum <= 180) return [...sentences, ...tateobaBeginner, ...tateobaIntermediate];
  return [...sentences, ...tateobaBeginner, ...tateobaIntermediate, ...tateobaAdvanced];
}

// ── 단어 풀 (450개+, N5+N4, 히라가나/카타카나/한자 골고루) ──────────
const vocabPool = [
  // 인사
  { japanese: "おはよう", reading: "ohayou", meaning: "좋은 아침" },
  { japanese: "こんにちは", reading: "konnichiwa", meaning: "안녕하세요" },
  { japanese: "こんばんは", reading: "konbanwa", meaning: "안녕하세요(저녁)" },
  { japanese: "ありがとう", reading: "arigatou", meaning: "고마워" },
  { japanese: "すみません", reading: "sumimasen", meaning: "실례합니다" },
  { japanese: "ごめんなさい", reading: "gomen nasai", meaning: "미안해요" },
  { japanese: "はい", reading: "hai", meaning: "네" },
  { japanese: "いいえ", reading: "iie", meaning: "아니요" },
  { japanese: "さようなら", reading: "sayounara", meaning: "안녕히 가세요" },
  { japanese: "おやすみ", reading: "oyasumi", meaning: "잘 자" },
  { japanese: "いただきます", reading: "itadakimasu", meaning: "잘 먹겠습니다" },
  { japanese: "ごちそうさま", reading: "gochisousama", meaning: "잘 먹었습니다" },
  { japanese: "はじめまして", reading: "hajimemashite", meaning: "처음 뵙겠습니다" },
  { japanese: "よろしく", reading: "yoroshiku", meaning: "잘 부탁해요" },
  // 숫자
  { japanese: "いち", reading: "ichi", meaning: "1" },
  { japanese: "に", reading: "ni", meaning: "2" },
  { japanese: "さん", reading: "san", meaning: "3" },
  { japanese: "よん", reading: "yon", meaning: "4" },
  { japanese: "ご", reading: "go", meaning: "5" },
  { japanese: "ろく", reading: "roku", meaning: "6" },
  { japanese: "なな", reading: "nana", meaning: "7" },
  { japanese: "はち", reading: "hachi", meaning: "8" },
  { japanese: "きゅう", reading: "kyuu", meaning: "9" },
  { japanese: "じゅう", reading: "juu", meaning: "10" },
  { japanese: "ひゃく", reading: "hyaku", meaning: "100" },
  { japanese: "せん", reading: "sen", meaning: "1000" },
  // 색깔
  { japanese: "あか", reading: "aka", meaning: "빨강" },
  { japanese: "あお", reading: "ao", meaning: "파랑" },
  { japanese: "きいろ", reading: "kiiro", meaning: "노랑" },
  { japanese: "しろ", reading: "shiro", meaning: "하양" },
  { japanese: "くろ", reading: "kuro", meaning: "검정" },
  { japanese: "みどり", reading: "midori", meaning: "초록" },
  { japanese: "ピンク", reading: "pinku", meaning: "분홍" },
  { japanese: "むらさき", reading: "murasaki", meaning: "보라" },
  { japanese: "オレンジ", reading: "orenji", meaning: "주황" },
  { japanese: "ちゃいろ", reading: "chairo", meaning: "갈색" },
  // 동물
  { japanese: "いぬ", reading: "inu", meaning: "개" },
  { japanese: "ねこ", reading: "neko", meaning: "고양이" },
  { japanese: "とり", reading: "tori", meaning: "새" },
  { japanese: "さかな", reading: "sakana", meaning: "물고기" },
  { japanese: "うさぎ", reading: "usagi", meaning: "토끼" },
  { japanese: "くま", reading: "kuma", meaning: "곰" },
  { japanese: "ぞう", reading: "zou", meaning: "코끼리" },
  { japanese: "さる", reading: "saru", meaning: "원숭이" },
  { japanese: "うし", reading: "ushi", meaning: "소" },
  { japanese: "ぶた", reading: "buta", meaning: "돼지" },
  { japanese: "うま", reading: "uma", meaning: "말" },
  { japanese: "へび", reading: "hebi", meaning: "뱀" },
  { japanese: "とら", reading: "tora", meaning: "호랑이" },
  // 음식 기초
  { japanese: "ごはん", reading: "gohan", meaning: "밥" },
  { japanese: "みず", reading: "mizu", meaning: "물" },
  { japanese: "パン", reading: "pan", meaning: "빵" },
  { japanese: "たまご", reading: "tamago", meaning: "달걀" },
  { japanese: "にく", reading: "niku", meaning: "고기" },
  { japanese: "やさい", reading: "yasai", meaning: "채소" },
  { japanese: "くだもの", reading: "kudamono", meaning: "과일" },
  { japanese: "ジュース", reading: "juusu", meaning: "주스" },
  { japanese: "おちゃ", reading: "ocha", meaning: "차(녹차)" },
  { japanese: "コーヒー", reading: "koohii", meaning: "커피" },
  { japanese: "りんご", reading: "ringo", meaning: "사과" },
  { japanese: "バナナ", reading: "banana", meaning: "바나나" },
  { japanese: "いちご", reading: "ichigo", meaning: "딸기" },
  { japanese: "みかん", reading: "mikan", meaning: "귤" },
  { japanese: "とうもろこし", reading: "toumorokoshi", meaning: "옥수수" },
  { japanese: "お菓子", reading: "okashi", meaning: "과자" },
  { japanese: "ケーキ", reading: "keeki", meaning: "케이크" },
  { japanese: "アイスクリーム", reading: "aisukuriimu", meaning: "아이스크림" },
  { japanese: "チョコレート", reading: "chokoreeto", meaning: "초콜릿" },
  { japanese: "料理", reading: "ryouri", meaning: "요리" },
  { japanese: "味", reading: "aji", meaning: "맛" },
  { japanese: "辛い", reading: "karai", meaning: "맵다" },
  { japanese: "甘い", reading: "amai", meaning: "달다" },
  { japanese: "すっぱい", reading: "suppai", meaning: "시다" },
  { japanese: "塩", reading: "shio", meaning: "소금" },
  { japanese: "砂糖", reading: "satou", meaning: "설탕" },
  // 신체
  { japanese: "あたま", reading: "atama", meaning: "머리" },
  { japanese: "め", reading: "me", meaning: "눈" },
  { japanese: "はな", reading: "hana", meaning: "코" },
  { japanese: "くち", reading: "kuchi", meaning: "입" },
  { japanese: "て", reading: "te", meaning: "손" },
  { japanese: "あし", reading: "ashi", meaning: "발/다리" },
  { japanese: "みみ", reading: "mimi", meaning: "귀" },
  { japanese: "は", reading: "ha", meaning: "이(치아)" },
  { japanese: "かお", reading: "kao", meaning: "얼굴" },
  { japanese: "せなか", reading: "senaka", meaning: "등" },
  { japanese: "ゆび", reading: "yubi", meaning: "손가락" },
  { japanese: "かた", reading: "kata", meaning: "어깨" },
  { japanese: "むね", reading: "mune", meaning: "가슴" },
  { japanese: "おなか", reading: "onaka", meaning: "배" },
  { japanese: "こし", reading: "koshi", meaning: "허리" },
  { japanese: "ひざ", reading: "hiza", meaning: "무릎" },
  { japanese: "うで", reading: "ude", meaning: "팔" },
  // 가족/사람
  { japanese: "おかあさん", reading: "okaasan", meaning: "어머니" },
  { japanese: "おとうさん", reading: "otousan", meaning: "아버지" },
  { japanese: "おにいさん", reading: "oniisan", meaning: "형/오빠" },
  { japanese: "おねえさん", reading: "oneesan", meaning: "누나/언니" },
  { japanese: "おとうと", reading: "otouto", meaning: "남동생" },
  { japanese: "いもうと", reading: "imouto", meaning: "여동생" },
  { japanese: "そふ", reading: "sofu", meaning: "할아버지" },
  { japanese: "そぼ", reading: "sobo", meaning: "할머니" },
  { japanese: "ともだち", reading: "tomodachi", meaning: "친구" },
  { japanese: "せんせい", reading: "sensei", meaning: "선생님" },
  { japanese: "がくせい", reading: "gakusei", meaning: "학생" },
  { japanese: "かいしゃいん", reading: "kaishain", meaning: "회사원" },
  { japanese: "医者", reading: "isha", meaning: "의사" },
  { japanese: "先輩", reading: "senpai", meaning: "선배" },
  { japanese: "後輩", reading: "kouhai", meaning: "후배" },
  { japanese: "同僚", reading: "douryou", meaning: "동료" },
  // 기초 동사
  { japanese: "たべる", reading: "taberu", meaning: "먹다" },
  { japanese: "のむ", reading: "nomu", meaning: "마시다" },
  { japanese: "みる", reading: "miru", meaning: "보다" },
  { japanese: "きく", reading: "kiku", meaning: "듣다" },
  { japanese: "いく", reading: "iku", meaning: "가다" },
  { japanese: "くる", reading: "kuru", meaning: "오다" },
  { japanese: "かえる", reading: "kaeru", meaning: "돌아가다" },
  { japanese: "ねる", reading: "neru", meaning: "자다" },
  { japanese: "おきる", reading: "okiru", meaning: "일어나다" },
  { japanese: "よむ", reading: "yomu", meaning: "읽다" },
  { japanese: "かく", reading: "kaku", meaning: "쓰다" },
  { japanese: "はなす", reading: "hanasu", meaning: "말하다" },
  { japanese: "わかる", reading: "wakaru", meaning: "이해하다" },
  { japanese: "する", reading: "suru", meaning: "하다" },
  { japanese: "ある", reading: "aru", meaning: "있다(사물)" },
  { japanese: "いる", reading: "iru", meaning: "있다(사람/동물)" },
  { japanese: "かう", reading: "kau", meaning: "사다" },
  { japanese: "つかう", reading: "tsukau", meaning: "사용하다" },
  { japanese: "あるく", reading: "aruku", meaning: "걷다" },
  { japanese: "はしる", reading: "hashiru", meaning: "달리다" },
  // N4 동사
  { japanese: "覚える", reading: "oboeru", meaning: "기억하다/외우다" },
  { japanese: "忘れる", reading: "wasureru", meaning: "잊다" },
  { japanese: "始める", reading: "hajimeru", meaning: "시작하다" },
  { japanese: "終わる", reading: "owaru", meaning: "끝나다" },
  { japanese: "作る", reading: "tsukuru", meaning: "만들다" },
  { japanese: "教える", reading: "oshieru", meaning: "가르치다" },
  { japanese: "習う", reading: "narau", meaning: "배우다" },
  { japanese: "考える", reading: "kangaeru", meaning: "생각하다" },
  { japanese: "決める", reading: "kimeru", meaning: "결정하다" },
  { japanese: "選ぶ", reading: "erabu", meaning: "고르다/선택하다" },
  { japanese: "探す", reading: "sagasu", meaning: "찾다" },
  { japanese: "見つける", reading: "mitsukeru", meaning: "발견하다" },
  { japanese: "送る", reading: "okuru", meaning: "보내다" },
  { japanese: "貸す", reading: "kasu", meaning: "빌려주다" },
  { japanese: "借りる", reading: "kariru", meaning: "빌리다" },
  { japanese: "着る", reading: "kiru", meaning: "입다" },
  { japanese: "脱ぐ", reading: "nugu", meaning: "벗다" },
  { japanese: "洗う", reading: "arau", meaning: "씻다" },
  { japanese: "払う", reading: "harau", meaning: "지불하다" },
  { japanese: "待つ", reading: "matsu", meaning: "기다리다" },
  { japanese: "会う", reading: "au", meaning: "만나다" },
  { japanese: "働く", reading: "hataraku", meaning: "일하다" },
  { japanese: "疲れる", reading: "tsukareru", meaning: "피곤하다" },
  { japanese: "直す", reading: "naosu", meaning: "고치다" },
  { japanese: "泳ぐ", reading: "oyogu", meaning: "수영하다" },
  { japanese: "飛ぶ", reading: "tobu", meaning: "날다" },
  { japanese: "訪ねる", reading: "tazuneru", meaning: "방문하다" },
  { japanese: "泣く", reading: "naku", meaning: "울다" },
  { japanese: "笑う", reading: "warau", meaning: "웃다" },
  { japanese: "怒る", reading: "okoru", meaning: "화내다" },
  { japanese: "喜ぶ", reading: "yorokobu", meaning: "기뻐하다" },
  { japanese: "驚く", reading: "odoroku", meaning: "놀라다" },
  { japanese: "困る", reading: "komaru", meaning: "곤란하다" },
  { japanese: "感じる", reading: "kanjiru", meaning: "느끼다" },
  { japanese: "見せる", reading: "miseru", meaning: "보여주다" },
  { japanese: "頼む", reading: "tanomu", meaning: "부탁하다" },
  { japanese: "断る", reading: "kotowaru", meaning: "거절하다" },
  { japanese: "約束する", reading: "yakusoku suru", meaning: "약속하다" },
  { japanese: "準備する", reading: "junbi suru", meaning: "준비하다" },
  { japanese: "練習する", reading: "renshuu suru", meaning: "연습하다" },
  { japanese: "説明する", reading: "setsumei suru", meaning: "설명하다" },
  { japanese: "連絡する", reading: "renraku suru", meaning: "연락하다" },
  { japanese: "確認する", reading: "kakunin suru", meaning: "확인하다" },
  { japanese: "心配する", reading: "shinpai suru", meaning: "걱정하다" },
  { japanese: "相談する", reading: "soudan suru", meaning: "상담하다" },
  // い형용사
  { japanese: "おおきい", reading: "ookii", meaning: "크다" },
  { japanese: "ちいさい", reading: "chiisai", meaning: "작다" },
  { japanese: "あたらしい", reading: "atarashii", meaning: "새롭다" },
  { japanese: "ふるい", reading: "furui", meaning: "오래되다" },
  { japanese: "たかい", reading: "takai", meaning: "비싸다/높다" },
  { japanese: "やすい", reading: "yasui", meaning: "싸다" },
  { japanese: "おいしい", reading: "oishii", meaning: "맛있다" },
  { japanese: "かわいい", reading: "kawaii", meaning: "귀엽다" },
  { japanese: "たのしい", reading: "tanoshii", meaning: "즐겁다" },
  { japanese: "むずかしい", reading: "muzukashii", meaning: "어렵다" },
  { japanese: "やさしい", reading: "yasashii", meaning: "쉽다/친절하다" },
  { japanese: "あつい", reading: "atsui", meaning: "덥다" },
  { japanese: "さむい", reading: "samui", meaning: "춥다" },
  { japanese: "いそがしい", reading: "isogashii", meaning: "바쁘다" },
  { japanese: "正しい", reading: "tadashii", meaning: "맞다/올바르다" },
  { japanese: "危ない", reading: "abunai", meaning: "위험하다" },
  { japanese: "痛い", reading: "itai", meaning: "아프다" },
  { japanese: "重い", reading: "omoi", meaning: "무겁다" },
  { japanese: "軽い", reading: "karui", meaning: "가볍다" },
  { japanese: "長い", reading: "nagai", meaning: "길다" },
  { japanese: "短い", reading: "mijikai", meaning: "짧다" },
  { japanese: "暗い", reading: "kurai", meaning: "어둡다" },
  { japanese: "明るい", reading: "akarui", meaning: "밝다" },
  { japanese: "強い", reading: "tsuyoi", meaning: "강하다" },
  { japanese: "弱い", reading: "yowai", meaning: "약하다" },
  { japanese: "早い", reading: "hayai", meaning: "빠르다" },
  { japanese: "遅い", reading: "osoi", meaning: "느리다/늦다" },
  { japanese: "うれしい", reading: "ureshii", meaning: "기쁘다" },
  { japanese: "かなしい", reading: "kanashii", meaning: "슬프다" },
  { japanese: "こわい", reading: "kowai", meaning: "무섭다" },
  { japanese: "はずかしい", reading: "hazukashii", meaning: "부끄럽다" },
  { japanese: "さびしい", reading: "sabishii", meaning: "외롭다" },
  // な형용사
  { japanese: "親切", reading: "shinsetsu", meaning: "친절하다" },
  { japanese: "丁寧", reading: "teinei", meaning: "정중하다" },
  { japanese: "大切", reading: "taisetsu", meaning: "소중하다" },
  { japanese: "便利", reading: "benri", meaning: "편리하다" },
  { japanese: "不便", reading: "fuben", meaning: "불편하다" },
  { japanese: "安全", reading: "anzen", meaning: "안전하다" },
  { japanese: "危険", reading: "kiken", meaning: "위험하다" },
  { japanese: "有名", reading: "yuumei", meaning: "유명하다" },
  { japanese: "特別", reading: "tokubetsu", meaning: "특별하다" },
  { japanese: "普通", reading: "futsuu", meaning: "보통이다" },
  { japanese: "上手", reading: "jouzu", meaning: "잘하다" },
  { japanese: "下手", reading: "heta", meaning: "못하다" },
  { japanese: "大丈夫", reading: "daijoubu", meaning: "괜찮다" },
  { japanese: "好き", reading: "suki", meaning: "좋아하다" },
  { japanese: "嫌い", reading: "kirai", meaning: "싫어하다" },
  { japanese: "元気", reading: "genki", meaning: "건강하다/활기차다" },
  { japanese: "真面目", reading: "majime", meaning: "성실하다" },
  { japanese: "丈夫", reading: "joubu", meaning: "튼튼하다" },
  // 장소
  { japanese: "がっこう", reading: "gakkou", meaning: "학교" },
  { japanese: "うち", reading: "uchi", meaning: "집" },
  { japanese: "えき", reading: "eki", meaning: "역" },
  { japanese: "びょういん", reading: "byouin", meaning: "병원" },
  { japanese: "としょかん", reading: "toshokan", meaning: "도서관" },
  { japanese: "こうえん", reading: "kouen", meaning: "공원" },
  { japanese: "スーパー", reading: "suupaa", meaning: "슈퍼마켓" },
  { japanese: "レストラン", reading: "resutoran", meaning: "레스토랑" },
  { japanese: "ホテル", reading: "hoteru", meaning: "호텔" },
  { japanese: "くうこう", reading: "kuukou", meaning: "공항" },
  { japanese: "建物", reading: "tatemono", meaning: "건물" },
  { japanese: "道", reading: "michi", meaning: "길" },
  { japanese: "橋", reading: "hashi", meaning: "다리" },
  { japanese: "地図", reading: "chizu", meaning: "지도" },
  { japanese: "住所", reading: "juusho", meaning: "주소" },
  { japanese: "国", reading: "kuni", meaning: "나라" },
  { japanese: "首都", reading: "shuto", meaning: "수도" },
  { japanese: "観光", reading: "kankou", meaning: "관광" },
  // 시간
  { japanese: "きょう", reading: "kyou", meaning: "오늘" },
  { japanese: "きのう", reading: "kinou", meaning: "어제" },
  { japanese: "あした", reading: "ashita", meaning: "내일" },
  { japanese: "あさ", reading: "asa", meaning: "아침" },
  { japanese: "ひる", reading: "hiru", meaning: "낮/점심" },
  { japanese: "よる", reading: "yoru", meaning: "저녁/밤" },
  { japanese: "まいにち", reading: "mainichi", meaning: "매일" },
  { japanese: "こんしゅう", reading: "konshuu", meaning: "이번주" },
  { japanese: "らいしゅう", reading: "raishuu", meaning: "다음주" },
  { japanese: "いつも", reading: "itsumo", meaning: "항상" },
  { japanese: "時間", reading: "jikan", meaning: "시간" },
  { japanese: "先月", reading: "sengetsu", meaning: "지난달" },
  { japanese: "来月", reading: "raigetsu", meaning: "다음달" },
  { japanese: "今年", reading: "kotoshi", meaning: "올해" },
  { japanese: "去年", reading: "kyonen", meaning: "작년" },
  { japanese: "来年", reading: "rainen", meaning: "내년" },
  { japanese: "毎週", reading: "maishuu", meaning: "매주" },
  { japanese: "午前", reading: "gozen", meaning: "오전" },
  { japanese: "午後", reading: "gogo", meaning: "오후" },
  // 감정
  { japanese: "しんぱい", reading: "shinpai", meaning: "걱정" },
  { japanese: "びっくり", reading: "bikkuri", meaning: "깜짝 놀람" },
  { japanese: "たいへん", reading: "taihen", meaning: "힘들다/큰일" },
  // 날씨
  { japanese: "はれ", reading: "hare", meaning: "맑음" },
  { japanese: "くもり", reading: "kumori", meaning: "흐림" },
  { japanese: "あめ", reading: "ame", meaning: "비" },
  { japanese: "ゆき", reading: "yuki", meaning: "눈" },
  { japanese: "かぜ", reading: "kaze", meaning: "바람" },
  { japanese: "てんき", reading: "tenki", meaning: "날씨" },
  { japanese: "あたたかい", reading: "atatakai", meaning: "따뜻하다" },
  { japanese: "すずしい", reading: "suzushii", meaning: "시원하다" },
  { japanese: "雲", reading: "kumo", meaning: "구름" },
  { japanese: "虹", reading: "niji", meaning: "무지개" },
  // 교통
  { japanese: "でんしゃ", reading: "densha", meaning: "전철" },
  { japanese: "バス", reading: "basu", meaning: "버스" },
  { japanese: "タクシー", reading: "takushii", meaning: "택시" },
  { japanese: "ひこうき", reading: "hikouki", meaning: "비행기" },
  { japanese: "じてんしゃ", reading: "jitensha", meaning: "자전거" },
  { japanese: "のる", reading: "noru", meaning: "타다" },
  { japanese: "おりる", reading: "oriru", meaning: "내리다" },
  { japanese: "のりかえ", reading: "norikae", meaning: "환승" },
  { japanese: "きっぷ", reading: "kippu", meaning: "표/티켓" },
  { japanese: "くるま", reading: "kuruma", meaning: "자동차" },
  { japanese: "ふね", reading: "fune", meaning: "배(선박)" },
  // 집/생활
  { japanese: "部屋", reading: "heya", meaning: "방" },
  { japanese: "窓", reading: "mado", meaning: "창문" },
  { japanese: "ドア", reading: "doa", meaning: "문" },
  { japanese: "電気", reading: "denki", meaning: "전기/불" },
  { japanese: "鍵", reading: "kagi", meaning: "열쇠" },
  { japanese: "掃除", reading: "souji", meaning: "청소" },
  { japanese: "洗濯", reading: "sentaku", meaning: "빨래" },
  { japanese: "台所", reading: "daidokoro", meaning: "부엌" },
  { japanese: "冷蔵庫", reading: "reizouko", meaning: "냉장고" },
  // 학교/공부
  { japanese: "勉強", reading: "benkyou", meaning: "공부" },
  { japanese: "宿題", reading: "shukudai", meaning: "숙제" },
  { japanese: "試験", reading: "shiken", meaning: "시험" },
  { japanese: "授業", reading: "jugyou", meaning: "수업" },
  { japanese: "教室", reading: "kyoushitsu", meaning: "교실" },
  { japanese: "教科書", reading: "kyoukasho", meaning: "교과서" },
  { japanese: "辞書", reading: "jisho", meaning: "사전" },
  { japanese: "鉛筆", reading: "enpitsu", meaning: "연필" },
  { japanese: "ボールペン", reading: "boorupen", meaning: "볼펜" },
  { japanese: "卒業", reading: "sotsugyou", meaning: "졸업" },
  // 건강
  { japanese: "薬", reading: "kusuri", meaning: "약" },
  { japanese: "病気", reading: "byouki", meaning: "병" },
  { japanese: "怪我", reading: "kega", meaning: "부상/다침" },
  { japanese: "熱", reading: "netsu", meaning: "열" },
  { japanese: "頭痛", reading: "zutsuu", meaning: "두통" },
  { japanese: "運動", reading: "undou", meaning: "운동" },
  { japanese: "休む", reading: "yasumu", meaning: "쉬다" },
  // 회사/일
  { japanese: "会社", reading: "kaisha", meaning: "회사" },
  { japanese: "仕事", reading: "shigoto", meaning: "일/직업" },
  { japanese: "会議", reading: "kaigi", meaning: "회의" },
  { japanese: "給料", reading: "kyuuryou", meaning: "급료/월급" },
  { japanese: "残業", reading: "zangyou", meaning: "잔업/초과근무" },
  { japanese: "休憩", reading: "kyuukei", meaning: "휴식" },
  // 기술/미디어
  { japanese: "電話", reading: "denwa", meaning: "전화" },
  { japanese: "スマホ", reading: "sumaho", meaning: "스마트폰" },
  { japanese: "パソコン", reading: "pasokon", meaning: "컴퓨터" },
  { japanese: "テレビ", reading: "terebi", meaning: "TV" },
  { japanese: "インターネット", reading: "intaanetto", meaning: "인터넷" },
  { japanese: "メール", reading: "meeru", meaning: "이메일" },
  { japanese: "写真", reading: "shashin", meaning: "사진" },
  { japanese: "音楽", reading: "ongaku", meaning: "음악" },
  { japanese: "映画", reading: "eiga", meaning: "영화" },
  // 옷/패션
  { japanese: "服", reading: "fuku", meaning: "옷" },
  { japanese: "シャツ", reading: "shatsu", meaning: "셔츠" },
  { japanese: "ズボン", reading: "zubon", meaning: "바지" },
  { japanese: "スカート", reading: "sukaato", meaning: "치마" },
  { japanese: "コート", reading: "kooto", meaning: "코트" },
  { japanese: "帽子", reading: "boushi", meaning: "모자" },
  { japanese: "靴", reading: "kutsu", meaning: "신발" },
  { japanese: "靴下", reading: "kutsushita", meaning: "양말" },
  { japanese: "眼鏡", reading: "megane", meaning: "안경" },
  { japanese: "財布", reading: "saifu", meaning: "지갑" },
  { japanese: "かばん", reading: "kaban", meaning: "가방" },
  { japanese: "時計", reading: "tokei", meaning: "시계" },
  // 자연
  { japanese: "空", reading: "sora", meaning: "하늘" },
  { japanese: "海", reading: "umi", meaning: "바다" },
  { japanese: "川", reading: "kawa", meaning: "강" },
  { japanese: "山", reading: "yama", meaning: "산" },
  { japanese: "森", reading: "mori", meaning: "숲" },
  { japanese: "花", reading: "hana", meaning: "꽃" },
  { japanese: "木", reading: "ki", meaning: "나무" },
  { japanese: "星", reading: "hoshi", meaning: "별" },
  { japanese: "月", reading: "tsuki", meaning: "달" },
  { japanese: "太陽", reading: "taiyou", meaning: "태양" },
  { japanese: "桜", reading: "sakura", meaning: "벚꽃" },
  // 음식점/쇼핑
  { japanese: "メニュー", reading: "menyuu", meaning: "메뉴" },
  { japanese: "注文", reading: "chuumon", meaning: "주문" },
  { japanese: "飲み物", reading: "nomimono", meaning: "음료" },
  { japanese: "お釣り", reading: "otsuri", meaning: "거스름돈" },
  { japanese: "値段", reading: "nedan", meaning: "가격" },
  { japanese: "セール", reading: "seeru", meaning: "세일" },
  { japanese: "割引", reading: "waribiki", meaning: "할인" },
  { japanese: "現金", reading: "genkin", meaning: "현금" },
  { japanese: "お金", reading: "okane", meaning: "돈" },
  // 취미/여가
  { japanese: "旅行", reading: "ryokou", meaning: "여행" },
  { japanese: "スポーツ", reading: "supootsu", meaning: "스포츠" },
  { japanese: "ゲーム", reading: "geemu", meaning: "게임" },
  { japanese: "読書", reading: "dokusho", meaning: "독서" },
  { japanese: "料理", reading: "ryouri", meaning: "요리" },
  // 부사/접속사
  { japanese: "まず", reading: "mazu", meaning: "우선/먼저" },
  { japanese: "やっと", reading: "yatto", meaning: "겨우/드디어" },
  { japanese: "ずっと", reading: "zutto", meaning: "쭉/계속" },
  { japanese: "もちろん", reading: "mochiron", meaning: "물론" },
  { japanese: "たぶん", reading: "tabun", meaning: "아마" },
  { japanese: "きっと", reading: "kitto", meaning: "반드시" },
  { japanese: "ぜんぜん", reading: "zenzen", meaning: "전혀(부정)" },
  { japanese: "だいたい", reading: "daitai", meaning: "대략" },
  { japanese: "ほとんど", reading: "hotondo", meaning: "거의" },
  { japanese: "やはり", reading: "yahari", meaning: "역시" },
  { japanese: "特に", reading: "toku ni", meaning: "특히" },
  { japanese: "例えば", reading: "tatoeba", meaning: "예를 들면" },
  { japanese: "つまり", reading: "tsumari", meaning: "즉/다시 말해서" },
  { japanese: "しかし", reading: "shikashi", meaning: "그러나" },
  { japanese: "それから", reading: "sorekara", meaning: "그리고/그 다음에" },
  { japanese: "それで", reading: "sorede", meaning: "그래서" },
  { japanese: "ところで", reading: "tokorode", meaning: "그런데" },
  { japanese: "なかなか", reading: "nakanaka", meaning: "꽤/좀처럼" },
];

// ── 문법 레슨 풀 (30개, N5+N4) ────────────────────────────────
const grammarPool = [
  { title: "です — ~이에요/입니다", level: "N5",
    rule: "명사/형용사 + です → 정중한 문장",
    examples: [
      { j: "がくせいです", r: "gakusei desu", m: "학생이에요" },
      { j: "にほんごはたのしいです", r: "nihongo wa tanoshii desu", m: "일본어는 즐거워요" },
    ], tip: "부정은 ではありません. 과거는 でした." },
  { title: "は — 주제 표시 (~은/는)", level: "N5",
    rule: "주제 + は + 서술 → '~은/는 ~이에요'",
    examples: [
      { j: "わたしはかんこくじんです", r: "watashi wa kankokujin desu", m: "저는 한국인이에요" },
      { j: "これはほんです", r: "kore wa hon desu", m: "이것은 책이에요" },
    ], tip: "は는 'wa'로 읽어요. 문자는 は(ha)지만 발음은 wa." },
  { title: "が — 주어 강조 (~이/가)", level: "N5",
    rule: "새 정보나 특정 대상을 강조할 때 が를 써요",
    examples: [
      { j: "どれがいいですか", r: "dore ga ii desu ka", m: "어느 것이 좋아요?" },
      { j: "あのひとがせんせいです", r: "ano hito ga sensei desu", m: "저 분이 선생님이에요" },
    ], tip: "처음엔 は만 써도 돼요. が는 점차 감이 생겨요." },
  { title: "を — 목적어 (~을/를)", level: "N5",
    rule: "동작의 대상 앞에 를 붙여요",
    examples: [
      { j: "ごはんをたべます", r: "gohan wo tabemasu", m: "밥을 먹어요" },
      { j: "にほんごをべんきょうします", r: "nihongo wo benkyou shimasu", m: "일본어를 공부해요" },
    ], tip: "を는 'wo'로 읽지만 실제 발음은 'o'에 가까워요." },
  { title: "に — 방향/장소 (~에/에게)", level: "N5",
    rule: "목적지, 존재 장소, 시간 앞에 に를 써요",
    examples: [
      { j: "がっこうにいきます", r: "gakkou ni ikimasu", m: "학교에 가요" },
      { j: "へやにいます", r: "heya ni imasu", m: "방에 있어요" },
    ], tip: "で는 행동 장소, に는 존재/도착 장소." },
  { title: "で — 장소/수단 (~에서/로)", level: "N5",
    rule: "행동이 일어나는 장소, 또는 이동 수단 앞에 で를 써요",
    examples: [
      { j: "としょかんでよみます", r: "toshokan de yomimasu", m: "도서관에서 읽어요" },
      { j: "でんしゃでいきます", r: "densha de ikimasu", m: "전철로 가요" },
    ], tip: "수단·방법에도 써요: にほんごではなしましょう" },
  { title: "~ます — 정중한 동사 활용", level: "N5",
    rule: "동사 기본형 → ます형: たべる→たべます, いく→いきます",
    examples: [
      { j: "まいにちべんきょうします", r: "mainichi benkyou shimasu", m: "매일 공부해요" },
      { j: "あしたいきます", r: "ashita ikimasu", m: "내일 가요" },
    ], tip: "부정: ~ません. 과거: ~ました. 과거부정: ~ませんでした" },
  { title: "~て形 — 동작 연결", level: "N5",
    rule: "동사를 て형으로 바꿔서 연결하거나 부탁을 표현해요",
    examples: [
      { j: "みてください", r: "mite kudasai", m: "봐 주세요" },
      { j: "たべてからいきます", r: "tabete kara ikimasu", m: "먹고 나서 가요" },
      { j: "たべています", r: "tabete imasu", m: "먹고 있어요" },
    ], tip: "~てください = 부탁, ~ています = 진행중, ~てから = 순서" },
  { title: "~たい — 하고 싶다", level: "N5",
    rule: "ます형에서 ます를 제거하고 たい를 붙여요",
    examples: [
      { j: "にほんにいきたいです", r: "nihon ni ikitai desu", m: "일본에 가고 싶어요" },
      { j: "すしをたべたい", r: "sushi wo tabetai", m: "초밥을 먹고 싶어요" },
    ], tip: "부정: ~たくない. たい는 형용사처럼 활용해요." },
  { title: "~ない形 — 부정", level: "N5",
    rule: "동사를 부정형으로 바꾸는 방법",
    examples: [
      { j: "たべない", r: "tabenai", m: "먹지 않아" },
      { j: "いかない", r: "ikanai", m: "가지 않아" },
      { j: "しない", r: "shinai", m: "하지 않아" },
    ], tip: "2그룹: る→ない. 1그룹: う단→あ단+ない. 불규칙: する→しない, くる→こない" },
  { title: "~ましょう — 함께 해요", level: "N5",
    rule: "동사 ます형 + ましょう → 제안/권유",
    examples: [
      { j: "いっしょにたべましょう", r: "issho ni tabemashou", m: "같이 먹어요" },
      { j: "はじめましょうか", r: "hajimemashou ka", m: "시작할까요?" },
    ], tip: "~ましょうか로 물으면 더 공손한 제안이 돼요." },
  { title: "~てもいい — 해도 돼요", level: "N5",
    rule: "て형 + もいい → 허가 표현",
    examples: [
      { j: "ここですわってもいいですか", r: "koko de suwatte mo ii desu ka", m: "여기 앉아도 돼요?" },
      { j: "つかってもいいですよ", r: "tsukatte mo ii desu yo", m: "사용해도 돼요" },
    ], tip: "~てはいけない가 반대: '하면 안 돼요'" },
  { title: "~てはいけない — 금지", level: "N5",
    rule: "て형 + はいけない → ~하면 안 돼요",
    examples: [
      { j: "ここでたばこをすってはいけません", r: "koko de tabako wo sutte wa ikemasen", m: "여기서 담배 피우면 안 돼요" },
      { j: "ちこくしてはいけません", r: "chikoku shite wa ikemasen", m: "지각하면 안 돼요" },
    ], tip: "규칙, 표지판, 경고에 자주 나와요." },
  { title: "~なくてもいい — 안 해도 돼요", level: "N5",
    rule: "ない형 → なくてもいい → 불필요 표현",
    examples: [
      { j: "むりしなくてもいいです", r: "muri shinakute mo ii desu", m: "무리하지 않아도 돼요" },
      { j: "きなくてもいいですよ", r: "konakute mo ii desu yo", m: "안 와도 돼요" },
    ], tip: "영어의 'don't have to'와 같아요." },
  { title: "いる/ある — 존재 표현", level: "N5",
    rule: "いる(사람/동물) vs ある(사물/식물)",
    examples: [
      { j: "ねこがいます", r: "neko ga imasu", m: "고양이가 있어요" },
      { j: "へやにほんがあります", r: "heya ni hon ga arimasu", m: "방에 책이 있어요" },
    ], tip: "에 있다 = に + いる/ある" },
  // N4
  { title: "~から — 이유 (~이기 때문에)", level: "N4",
    rule: "이유를 직접적으로 말할 때 문장 끝에 から를 붙여요",
    examples: [
      { j: "さむいから、まどをしめた", r: "samui kara, mado wo shimeta", m: "추워서 창문을 닫았어" },
      { j: "すきだからべんきょうします", r: "suki dakara benkyou shimasu", m: "좋아서 공부해요" },
    ], tip: "ので는 から보다 공손해요. 공식 자리엔 ので가 더 자연스러워요." },
  { title: "~と思います — ~라고 생각해요", level: "N4",
    rule: "자신의 생각/의견을 부드럽게 전달할 때 써요",
    examples: [
      { j: "むずかしいとおもいます", r: "muzukashii to omoimasu", m: "어렵다고 생각해요" },
      { j: "かれはもうきたとおもいます", r: "kare wa mou kita to omoimasu", m: "그는 이미 왔다고 생각해요" },
    ], tip: "단정짓는 것보다 부드러운 인상을 줘서 일본어 회화에서 많이 써요." },
  { title: "~たことがある — 경험", level: "N4",
    rule: "과거에 경험한 것을 말할 때 써요",
    examples: [
      { j: "にほんにいったことがあります", r: "nihon ni itta koto ga arimasu", m: "일본에 간 적 있어요" },
      { j: "すしをたべたことがない", r: "sushi wo tabeta koto ga nai", m: "초밥을 먹어본 적 없어요" },
    ], tip: "동사 た형 + ことがある/ない." },
  { title: "~かもしれない — ~일지도 몰라", level: "N4",
    rule: "확실하지 않은 추측을 표현할 때 써요",
    examples: [
      { j: "あめがふるかもしれません", r: "ame ga furu kamo shiremasen", m: "비가 올지도 몰라요" },
      { j: "もうおそいかも", r: "mou osoi kamo", m: "이미 늦었을지도 몰라" },
    ], tip: "정중체: かもしれません. 캐주얼: かも." },
  { title: "~てみる — 해보다", level: "N4",
    rule: "무언가를 시도해볼 때 써요",
    examples: [
      { j: "やってみます", r: "yatte mimasu", m: "해볼게요" },
      { j: "たべてみてください", r: "tabete mite kudasai", m: "먹어 보세요" },
    ], tip: "~てみる는 '시도/경험'의 뉘앙스." },
  { title: "~なければならない — 해야 해요", level: "N4",
    rule: "의무나 필요성을 나타내는 표현이에요",
    examples: [
      { j: "もっとべんきょうしなければなりません", r: "motto benkyou shinakereba narimasen", m: "더 공부해야 해요" },
      { j: "はやくいかなきゃ", r: "hayaku ikanakya", m: "빨리 가야 해(구어)" },
    ], tip: "구어체: ~なきゃ (나키야)" },
  { title: "~そうだ (양태) — ~인 것 같아요", level: "N4",
    rule: "직접 보거나 느껴서 '~인 것 같다'고 표현해요",
    examples: [
      { j: "このケーキはおいしそうです", r: "kono keeki wa oishisou desu", m: "이 케이크 맛있어 보여요" },
      { j: "あめがふりそうです", r: "ame ga furisou desu", m: "비가 올 것 같아요" },
    ], tip: "い형용사는 어간+そう. 동사는 ます형+そう." },
  { title: "~でしょう — ~이겠죠", level: "N4",
    rule: "어느 정도 확신이 있는 추측을 표현해요",
    examples: [
      { j: "あしたはいいてんきでしょう", r: "ashita wa ii tenki deshou", m: "내일은 날씨가 좋겠죠" },
      { j: "たいへんだったでしょう", r: "taihen datta deshou", m: "힘들었겠죠" },
    ], tip: "캐주얼: ~だろう" },
  { title: "~ば — ~하면 (가정)", level: "N4",
    rule: "조건을 나타내는 표현이에요",
    examples: [
      { j: "れんしゅうすれば、じょうずになります", r: "renshuu sureba, jouzu ni narimasu", m: "연습하면 잘하게 돼요" },
      { j: "はやくおきれば、まにあいます", r: "hayaku okireba, maniarimasu", m: "일찍 일어나면 시간에 맞아요" },
    ], tip: "일반적 조건이나 충고에 자주 써요." },
  { title: "~たら — ~하면/~했더니", level: "N4",
    rule: "た형 + ら → 가정/완료 후 상황",
    examples: [
      { j: "うちにかえったら、でんわしてね", r: "uchi ni kaettara, denwa shite ne", m: "집에 돌아가면 전화해" },
      { j: "そとにでたら、さむかったです", r: "soto ni detara, samukatta desu", m: "밖에 나갔더니 추웠어요" },
    ], tip: "ば보다 더 일상적으로 쓰여요." },
  { title: "~ながら — ~하면서", level: "N4",
    rule: "동사 ます형 + ながら → 동시 동작",
    examples: [
      { j: "おんがくをききながら、べんきょうします", r: "ongaku wo kikinagara, benkyou shimasu", m: "음악을 들으면서 공부해요" },
      { j: "あるきながら、はなしましょう", r: "aruki nagara, hanashimashou", m: "걸으면서 이야기해요" },
    ], tip: "주어가 같을 때만 써요." },
  { title: "~ために — ~을 위해서", level: "N4",
    rule: "목적을 나타내요",
    examples: [
      { j: "にほんごをおぼえるために、まいにちべんきょうします", r: "nihongo wo oboeru tame ni, mainichi benkyou shimasu", m: "일본어를 배우기 위해 매일 공부해요" },
      { j: "けんこうのために、うんどうしています", r: "kenkou no tame ni, undou shite imasu", m: "건강을 위해 운동하고 있어요" },
    ], tip: "명사 + のために, 동사 기본형 + ために" },
  { title: "~ように — ~하도록", level: "N4",
    rule: "목적이나 바람, 또는 비유를 나타내요",
    examples: [
      { j: "わすれないように、メモしました", r: "wasurenai you ni, memo shimashita", m: "잊지 않도록 메모했어요" },
      { j: "まるでゆめのようです", r: "marude yume no you desu", m: "마치 꿈 같아요" },
    ], tip: "~ように祈る = ~하도록 기도하다" },
  { title: "~ことにする — ~하기로 하다", level: "N4",
    rule: "자신의 결심/결정을 표현해요",
    examples: [
      { j: "まいにちべんきょうすることにしました", r: "mainichi benkyou suru koto ni shimashita", m: "매일 공부하기로 했어요" },
      { j: "タバコをやめることにしました", r: "tabako wo yameru koto ni shimashita", m: "담배를 끊기로 했어요" },
    ], tip: "~ことになる = (상황에 의해) ~하게 되다" },
  { title: "~ようになる — ~하게 되다", level: "N4",
    rule: "능력이나 상태의 변화를 나타내요",
    examples: [
      { j: "にほんごがはなせるようになりました", r: "nihongo ga hanaseru you ni narimashita", m: "일본어를 말할 수 있게 됐어요" },
      { j: "たべられなかったものがたべられるようになった", r: "taberarenakatta mono ga taberareru you ni natta", m: "못 먹던 게 먹을 수 있게 됐어요" },
    ], tip: "점진적 변화를 나타내요." },
];

// ── 히라가나/카타카나 행별 ─────────────────────────────────────
const rowNames = ["あ/ア","か/カ","さ/サ","た/タ","な/ナ","は/ハ","ま/マ","や/ヤ","ら/ラ","わ/ワ"];
const hRows = [
  hiragana.slice(0,5), hiragana.slice(5,10), hiragana.slice(10,15),
  hiragana.slice(15,20), hiragana.slice(20,25), hiragana.slice(25,30),
  hiragana.slice(30,35), hiragana.slice(35,38), hiragana.slice(38,43), hiragana.slice(43),
];
const kRows = [
  katakana.slice(0,5), katakana.slice(5,10), katakana.slice(10,15),
  katakana.slice(15,20), katakana.slice(20,25), katakana.slice(25,30),
  katakana.slice(30,35), katakana.slice(35,38), katakana.slice(38,43), katakana.slice(43),
];

// 각 행별 읽기 단어 풀 (12개씩) — 매일 랜덤 5개 출제
// 각 행: 히라가나 6개 + 카타카나 6개 (앞 6개 = 히라가나, 뒤 6개 = 카타카나)
const kanaReadingWords = [
  // あ/ア행
  {
    hira: [
      { japanese: "あお", reading: "ao", meaning: "파랑" },
      { japanese: "いえ", reading: "ie", meaning: "집" },
      { japanese: "うみ", reading: "umi", meaning: "바다" },
      { japanese: "えき", reading: "eki", meaning: "역" },
      { japanese: "おかし", reading: "okashi", meaning: "과자" },
      { japanese: "あさ", reading: "asa", meaning: "아침" },
    ],
    kata: [
      { japanese: "アイス", reading: "aisu", meaning: "아이스크림" },
      { japanese: "エアコン", reading: "eakon", meaning: "에어컨" },
      { japanese: "アニメ", reading: "anime", meaning: "애니메이션" },
      { japanese: "オレンジ", reading: "orenji", meaning: "오렌지" },
      { japanese: "イチゴ", reading: "ichigo", meaning: "딸기" },
      { japanese: "アルバム", reading: "arubamu", meaning: "앨범" },
    ],
  },
  // か/カ행
  {
    hira: [
      { japanese: "かわ", reading: "kawa", meaning: "강" },
      { japanese: "きのう", reading: "kinou", meaning: "어제" },
      { japanese: "くるま", reading: "kuruma", meaning: "자동차" },
      { japanese: "けが", reading: "kega", meaning: "부상" },
      { japanese: "こえ", reading: "koe", meaning: "목소리" },
      { japanese: "かさ", reading: "kasa", meaning: "우산" },
    ],
    kata: [
      { japanese: "カメラ", reading: "kamera", meaning: "카메라" },
      { japanese: "キッチン", reading: "kicchin", meaning: "주방" },
      { japanese: "クッキー", reading: "kukkii", meaning: "쿠키" },
      { japanese: "コーヒー", reading: "koohii", meaning: "커피" },
      { japanese: "カード", reading: "kaado", meaning: "카드" },
      { japanese: "コップ", reading: "koppu", meaning: "컵" },
    ],
  },
  // さ/サ행
  {
    hira: [
      { japanese: "さかな", reading: "sakana", meaning: "물고기" },
      { japanese: "すし", reading: "sushi", meaning: "초밥" },
      { japanese: "さくら", reading: "sakura", meaning: "벚꽃" },
      { japanese: "しごと", reading: "shigoto", meaning: "일/직업" },
      { japanese: "すいか", reading: "suika", meaning: "수박" },
      { japanese: "そら", reading: "sora", meaning: "하늘" },
    ],
    kata: [
      { japanese: "サラダ", reading: "sarada", meaning: "샐러드" },
      { japanese: "シャワー", reading: "shawaa", meaning: "샤워" },
      { japanese: "スーパー", reading: "suupaa", meaning: "슈퍼마켓" },
      { japanese: "サッカー", reading: "sakkaa", meaning: "축구" },
      { japanese: "スポーツ", reading: "supootsu", meaning: "스포츠" },
      { japanese: "ソファ", reading: "sofa", meaning: "소파" },
    ],
  },
  // た/タ행
  {
    hira: [
      { japanese: "たまご", reading: "tamago", meaning: "달걀" },
      { japanese: "てがみ", reading: "tegami", meaning: "편지" },
      { japanese: "たいよう", reading: "taiyou", meaning: "태양" },
      { japanese: "ちかてつ", reading: "chikatetsu", meaning: "지하철" },
      { japanese: "つき", reading: "tsuki", meaning: "달" },
      { japanese: "とけい", reading: "tokei", meaning: "시계" },
    ],
    kata: [
      { japanese: "タクシー", reading: "takushii", meaning: "택시" },
      { japanese: "タオル", reading: "taoru", meaning: "수건" },
      { japanese: "テレビ", reading: "terebi", meaning: "TV" },
      { japanese: "トマト", reading: "tomato", meaning: "토마토" },
      { japanese: "チケット", reading: "chiketto", meaning: "티켓" },
      { japanese: "テスト", reading: "tesuto", meaning: "시험" },
    ],
  },
  // な/ナ행
  {
    hira: [
      { japanese: "にく", reading: "niku", meaning: "고기" },
      { japanese: "ねこ", reading: "neko", meaning: "고양이" },
      { japanese: "なまえ", reading: "namae", meaning: "이름" },
      { japanese: "にほん", reading: "nihon", meaning: "일본" },
      { japanese: "のみもの", reading: "nomimono", meaning: "음료" },
      { japanese: "なつ", reading: "natsu", meaning: "여름" },
    ],
    kata: [
      { japanese: "ナイフ", reading: "naifu", meaning: "나이프" },
      { japanese: "ニュース", reading: "nyuusu", meaning: "뉴스" },
      { japanese: "ノート", reading: "nooto", meaning: "노트" },
      { japanese: "ネット", reading: "netto", meaning: "인터넷" },
      { japanese: "ナース", reading: "naasuु", meaning: "간호사" },
      { japanese: "ナンバー", reading: "nanbaa", meaning: "번호" },
    ],
  },
  // は/ハ행
  {
    hira: [
      { japanese: "はな", reading: "hana", meaning: "꽃" },
      { japanese: "ほし", reading: "hoshi", meaning: "별" },
      { japanese: "はし", reading: "hashi", meaning: "젓가락" },
      { japanese: "ひこうき", reading: "hikouki", meaning: "비행기" },
      { japanese: "ふね", reading: "fune", meaning: "배(선박)" },
      { japanese: "へや", reading: "heya", meaning: "방" },
    ],
    kata: [
      { japanese: "ハート", reading: "haato", meaning: "하트" },
      { japanese: "ヒーター", reading: "hiitaa", meaning: "히터" },
      { japanese: "フォーク", reading: "fooku", meaning: "포크" },
      { japanese: "ハンバーガー", reading: "hanbaagaa", meaning: "햄버거" },
      { japanese: "ホテル", reading: "hoteru", meaning: "호텔" },
      { japanese: "バス", reading: "basu", meaning: "버스" },
    ],
  },
  // ま/マ행
  {
    hira: [
      { japanese: "まち", reading: "machi", meaning: "도시" },
      { japanese: "みず", reading: "mizu", meaning: "물" },
      { japanese: "めがね", reading: "megane", meaning: "안경" },
      { japanese: "もり", reading: "mori", meaning: "숲" },
      { japanese: "まいにち", reading: "mainichi", meaning: "매일" },
      { japanese: "むすこ", reading: "musuko", meaning: "아들" },
    ],
    kata: [
      { japanese: "マスク", reading: "masuku", meaning: "마스크" },
      { japanese: "ミルク", reading: "miruku", meaning: "우유" },
      { japanese: "メモ", reading: "memo", meaning: "메모" },
      { japanese: "マップ", reading: "mappu", meaning: "지도" },
      { japanese: "ミュージック", reading: "myuujikku", meaning: "음악" },
      { japanese: "モデル", reading: "moderu", meaning: "모델" },
    ],
  },
  // や/ヤ행
  {
    hira: [
      { japanese: "やま", reading: "yama", meaning: "산" },
      { japanese: "ゆき", reading: "yuki", meaning: "눈" },
      { japanese: "やすみ", reading: "yasumi", meaning: "휴가/방학" },
      { japanese: "よる", reading: "yoru", meaning: "밤" },
      { japanese: "やさい", reading: "yasai", meaning: "채소" },
      { japanese: "ゆめ", reading: "yume", meaning: "꿈" },
    ],
    kata: [
      { japanese: "ヨーグルト", reading: "yooguruto", meaning: "요거트" },
      { japanese: "ユニフォーム", reading: "yunifo-mu", meaning: "유니폼" },
      { japanese: "ヤシ", reading: "yashi", meaning: "야자수" },
      { japanese: "ヨット", reading: "yotto", meaning: "요트" },
      { japanese: "ユーチューブ", reading: "yuuchuubu", meaning: "유튜브" },
      { japanese: "ヤード", reading: "yaado", meaning: "야드" },
    ],
  },
  // ら/ラ행
  {
    hira: [
      { japanese: "らいねん", reading: "rainen", meaning: "내년" },
      { japanese: "りんご", reading: "ringo", meaning: "사과" },
      { japanese: "らいしゅう", reading: "raishuu", meaning: "다음주" },
      { japanese: "りょこう", reading: "ryokou", meaning: "여행" },
      { japanese: "れんしゅう", reading: "renshuu", meaning: "연습" },
      { japanese: "ろうか", reading: "rouka", meaning: "복도" },
    ],
    kata: [
      { japanese: "ラーメン", reading: "raamen", meaning: "라면" },
      { japanese: "リモコン", reading: "rimokon", meaning: "리모컨" },
      { japanese: "レモン", reading: "remon", meaning: "레몬" },
      { japanese: "ロボット", reading: "robotto", meaning: "로봇" },
      { japanese: "ランチ", reading: "ranchi", meaning: "점심" },
      { japanese: "レストラン", reading: "resutoran", meaning: "레스토랑" },
    ],
  },
  // わ/ワ행 + ん
  {
    hira: [
      { japanese: "わたし", reading: "watashi", meaning: "나/저" },
      { japanese: "でんわ", reading: "denwa", meaning: "전화" },
      { japanese: "おんがく", reading: "ongaku", meaning: "음악" },
      { japanese: "えんぴつ", reading: "enpitsu", meaning: "연필" },
      { japanese: "みんな", reading: "minna", meaning: "모두" },
      { japanese: "ほんや", reading: "hon'ya", meaning: "서점" },
    ],
    kata: [
      { japanese: "ワイン", reading: "wain", meaning: "와인" },
      { japanese: "ワンピース", reading: "wanpiisu", meaning: "원피스" },
      { japanese: "パソコン", reading: "pasokon", meaning: "컴퓨터" },
      { japanese: "パン", reading: "pan", meaning: "빵" },
      { japanese: "ワールド", reading: "waarudo", meaning: "세계" },
      { japanese: "ウィーク", reading: "wiiku", meaning: "주(week)" },
    ],
  },
];

// ── 시드 기반 셔플 (같은 날/행 = 항상 같은 조합) ─────────────────
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = (seed >>> 0) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const j = (s >>> 0) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── 날짜 → Day 번호 (로컬 시간 기준) ────────────────────────────
const START = { y: 2026, m: 6, d: 27 };

export function getDayNumber() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(START.y, START.m - 1, START.d);
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}

export function dayNumToDateKey(dayNum) {
  const start = new Date(START.y, START.m - 1, START.d);
  const d = new Date(start);
  d.setDate(d.getDate() + dayNum - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── 하루 레슨 생성 ──────────────────────────────────────────────
export function getDayLesson(dayNum) {
  const d = dayNum - 1;

  // 글자 파트: 히라가나 + 카타카나 같은 행 (10일 주기)
  const rowIdx = d % 10;
  const hiraRow = hRows[rowIdx];
  const kataRow = kRows[rowIdx];
  const kanaLabel = `${rowNames[rowIdx]}행`;
  const kana = [...hiraRow, ...kataRow];

  // 읽기 단어: 히라가나 3개 + 카타카나 2개, 매일 다른 조합
  const wordPool = kanaReadingWords[rowIdx];
  const hiraWords = seededShuffle(wordPool.hira, dayNum * 137 + rowIdx * 31).slice(0, 3);
  const kataWords = seededShuffle(wordPool.kata, dayNum * 211 + rowIdx * 53).slice(0, 2);
  const readingWords = seededShuffle([...hiraWords, ...kataWords], dayNum * 97 + rowIdx * 13);

  // 단어 파트 (하루 5개)
  const wordStart = (d * 5) % vocabPool.length;
  const words = Array.from({ length: 5 }, (_, i) => vocabPool[(wordStart + i) % vocabPool.length]);

  // 문법 파트 (4일마다 새 레슨)
  const grammarIdx = Math.floor(d / 4) % grammarPool.length;
  const grammar = grammarPool[grammarIdx];
  const isNewGrammar = d % 4 === 0;

  // 문장 파트 (하루 3문장, 레벨에 맞는 풀에서)
  const sentPool = getSentencePool(dayNum);
  const sentStart = (d * 3) % sentPool.length;
  const todaySentences = Array.from({ length: 3 }, (_, i) => sentPool[(sentStart + i) % sentPool.length]);

  const baseThemes = ["あ/ア행","か/カ행","さ/サ행","た/タ행","な/ナ행","は/ハ행","ま/マ행","や/ヤ행","ら/ラ행","わ/ワ행"];
  const phase = d < 20 ? "기초 글자" : d < 60 ? "N5 기초" : d < 120 ? "N5 심화" : d < 240 ? "N4 일상" : "N4 심화";
  const theme = `${phase} — ${baseThemes[rowIdx]}`;

  return { kana, kanaLabel, readingWords, words, grammar, isNewGrammar, sentences: todaySentences, theme };
}

export { sentences, vocabPool, grammarPool };
