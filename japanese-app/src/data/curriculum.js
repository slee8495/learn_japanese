import { hiragana, katakana } from "./kana";

// ── 문장 데이터 ───────────────────────────────────────────────
const sentences = [
  { japanese: "おはようございます", reading: "おはようございます", meaning: "좋은 아침입니다" },
  { japanese: "こんにちは、元気ですか", reading: "こんにちは、げんきですか", meaning: "안녕하세요, 잘 지내세요?" },
  { japanese: "はい、元気です。ありがとう", reading: "はい、げんきです。ありがとう", meaning: "네, 잘 지내요. 고마워요" },
  { japanese: "私は学生です", reading: "わたしはがくせいです", meaning: "저는 학생이에요" },
  { japanese: "私は韓国人です", reading: "わたしはかんこくじんです", meaning: "저는 한국인이에요" },
  { japanese: "今日は何日ですか", reading: "きょうはなんにちですか", meaning: "오늘은 며칠이에요?" },
  { japanese: "今、何時ですか", reading: "いま、なんじですか", meaning: "지금 몇 시예요?" },
  { japanese: "3時半です", reading: "さんじはんです", meaning: "3시 반이에요" },
  { japanese: "トイレはどこですか", reading: "トイレはどこですか", meaning: "화장실이 어디예요?" },
  { japanese: "駅はこの近くにありますか", reading: "えきはこのちかくにありますか", meaning: "역이 이 근처에 있어요?" },
  { japanese: "まっすぐ行ってください", reading: "まっすぐいってください", meaning: "똑바로 가 주세요" },
  { japanese: "これはいくらですか", reading: "これはいくらですか", meaning: "이건 얼마예요?" },
  { japanese: "少し安くしてください", reading: "すこしやすくしてください", meaning: "조금 싸게 해 주세요" },
  { japanese: "これを一つください", reading: "これをひとつください", meaning: "이거 하나 주세요" },
  { japanese: "メニューを見せてください", reading: "メニューをみせてください", meaning: "메뉴 보여 주세요" },
  { japanese: "おすすめは何ですか", reading: "おすすめはなんですか", meaning: "추천 메뉴가 뭐예요?" },
  { japanese: "辛くないですか", reading: "からくないですか", meaning: "안 매워요?" },
  { japanese: "お会計をお願いします", reading: "おかいけいをおねがいします", meaning: "계산 부탁드려요" },
  { japanese: "この電車は新宿に止まりますか", reading: "このでんしゃはしんじゅくにとまりますか", meaning: "이 전철은 신주쿠에 서요?" },
  { japanese: "次の駅で降ります", reading: "つぎのえきでおります", meaning: "다음 역에서 내려요" },
  { japanese: "すみません、英語が分かりますか", reading: "すみません、えいごがわかりますか", meaning: "저기요, 영어를 아세요?" },
  { japanese: "もう一度言ってください", reading: "もういちどいってください", meaning: "한 번 더 말해 주세요" },
  { japanese: "日本語が少し分かります", reading: "にほんごがすこしわかります", meaning: "일본어를 조금 알아요" },
  { japanese: "楽しかったです！また会いましょう", reading: "たのしかったです！またあいましょう", meaning: "즐거웠어요! 또 만나요" },
  { japanese: "それはすごいですね", reading: "それはすごいですね", meaning: "그건 대단하네요" },
  { japanese: "本当に楽しいです", reading: "ほんとうにたのしいです", meaning: "정말 즐거워요" },
  { japanese: "少し疲れました", reading: "すこしつかれました", meaning: "조금 피곤해요" },
  { japanese: "もっと勉強しなければなりません", reading: "もっとべんきょうしなければなりません", meaning: "더 공부해야 해요" },
  { japanese: "日本語がだんだん分かってきました", reading: "にほんごがだんだんわかってきました", meaning: "일본어를 점점 알게 됐어요" },
  { japanese: "もしよかったら、一緒に行きませんか", reading: "もしよかったら、いっしょにいきませんか", meaning: "괜찮으면 같이 안 갈래요?" },
  { japanese: "そのことについてどう思いますか", reading: "そのことについてどうおもいますか", meaning: "그것에 대해 어떻게 생각해요?" },
  { japanese: "やってみなければ分かりません", reading: "やってみなければわかりません", meaning: "해보지 않으면 몰라요" },
  { japanese: "難しいけど、楽しいと思います", reading: "むずかしいけど、たのしいとおもいます", meaning: "어렵지만 즐겁다고 생각해요" },
  { japanese: "日本に行ったことがありますか", reading: "にほんにいったことがありますか", meaning: "일본에 간 적 있어요?" },
  { japanese: "寿司を食べたことがあります", reading: "すしをたべたことがあります", meaning: "초밥을 먹어 본 적 있어요" },
  { japanese: "毎日少しずつ練習すれば、必ずうまくなります", reading: "まいにちすこしずつれんしゅうすれば、かならずうまくなります", meaning: "매일 조금씩 연습하면 반드시 잘하게 돼요" },
  { japanese: "時間があれば、一緒に映画を見ませんか", reading: "じかんがあれば、いっしょにえいがをみませんか", meaning: "시간 있으면 같이 영화 안 볼래요?" },
  { japanese: "彼は日本語が上手なわけだ、10年勉強したから", reading: "かれはにほんごがじょうずなわけだ、じゅうねんべんきょうしたから", meaning: "그가 일본어를 잘하는 건 당연해, 10년 공부했으니까" },
  { japanese: "このケーキはおいしそうですね", reading: "このケーキはおいしそうですね", meaning: "이 케이크 맛있어 보이죠?" },
  { japanese: "天気予報によると、明日は雪が降るそうです", reading: "てんきよほうによると、あしたはゆきがふるそうです", meaning: "일기예보에 의하면 내일은 눈이 온답니다" },
  { japanese: "忘れないように、手帳に書いておきました", reading: "わすれないように、てちょうにかいておきました", meaning: "잊지 않도록 수첩에 써뒀어요" },
  { japanese: "日本語を話せるようになりたいです", reading: "にほんごをはなせるようになりたいです", meaning: "일본어를 말할 수 있게 되고 싶어요" },
  { japanese: "財布を忘れてきてしまいました", reading: "さいふをわすれてきてしまいました", meaning: "지갑을 놓고 와버렸어요" },
  { japanese: "音楽を聴きながら、勉強するのが好きです", reading: "おんがくをききながら、べんきょうするのがすきです", meaning: "음악을 들으면서 공부하는 것을 좋아해요" },
];

// sentences 배열은 이미 쉬운 순서로 정렬돼 있음. 그 중 정말 기초적인 앞부분만
// "아주 쉬운 문장" 풀로 써서, 오늘의 문법 예문(4개)과 함께 매일 1개씩 등장시킨다.
// (뒷부분은 이미 grammarPool 예문과 겹치거나 난이도가 갑자기 올라가서 제외)
const easySentences = sentences.slice(0, 26);

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
  { japanese: "お菓子", reading: "おかし", meaning: "과자" },
  { japanese: "ケーキ", reading: "keeki", meaning: "케이크" },
  { japanese: "アイスクリーム", reading: "aisukuriimu", meaning: "아이스크림" },
  { japanese: "チョコレート", reading: "chokoreeto", meaning: "초콜릿" },
  { japanese: "料理", reading: "りょうり", meaning: "요리" },
  { japanese: "味", reading: "あじ", meaning: "맛" },
  { japanese: "辛い", reading: "からい", meaning: "맵다" },
  { japanese: "甘い", reading: "あまい", meaning: "달다" },
  { japanese: "すっぱい", reading: "suppai", meaning: "시다" },
  { japanese: "塩", reading: "しお", meaning: "소금" },
  { japanese: "砂糖", reading: "さとう", meaning: "설탕" },
  // 신체
  { japanese: "あたま", reading: "atama", meaning: "머리" },
  { japanese: "め", reading: "me", meaning: "눈" },
  { japanese: "はな", reading: "はな", meaning: "코" },
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
  { japanese: "医者", reading: "いしゃ", meaning: "의사" },
  { japanese: "先輩", reading: "せんぱい", meaning: "선배" },
  { japanese: "後輩", reading: "こうはい", meaning: "후배" },
  { japanese: "同僚", reading: "どうりょう", meaning: "동료" },
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
  { japanese: "覚える", reading: "おぼえる", meaning: "기억하다/외우다" },
  { japanese: "忘れる", reading: "わすれる", meaning: "잊다" },
  { japanese: "始める", reading: "はじめる", meaning: "시작하다" },
  { japanese: "終わる", reading: "おわる", meaning: "끝나다" },
  { japanese: "作る", reading: "つくる", meaning: "만들다" },
  { japanese: "教える", reading: "おしえる", meaning: "가르치다" },
  { japanese: "習う", reading: "ならう", meaning: "배우다" },
  { japanese: "考える", reading: "かんがえる", meaning: "생각하다" },
  { japanese: "決める", reading: "きめる", meaning: "결정하다" },
  { japanese: "選ぶ", reading: "えらぶ", meaning: "고르다/선택하다" },
  { japanese: "探す", reading: "さがす", meaning: "찾다" },
  { japanese: "見つける", reading: "みつける", meaning: "발견하다" },
  { japanese: "送る", reading: "おくる", meaning: "보내다" },
  { japanese: "貸す", reading: "かす", meaning: "빌려주다" },
  { japanese: "借りる", reading: "かりる", meaning: "빌리다" },
  { japanese: "着る", reading: "きる", meaning: "입다" },
  { japanese: "脱ぐ", reading: "ぬぐ", meaning: "벗다" },
  { japanese: "洗う", reading: "あらう", meaning: "씻다" },
  { japanese: "払う", reading: "はらう", meaning: "지불하다" },
  { japanese: "待つ", reading: "まつ", meaning: "기다리다" },
  { japanese: "会う", reading: "あう", meaning: "만나다" },
  { japanese: "働く", reading: "はたらく", meaning: "일하다" },
  { japanese: "疲れる", reading: "つかれる", meaning: "피곤하다" },
  { japanese: "直す", reading: "なおす", meaning: "고치다" },
  { japanese: "泳ぐ", reading: "およぐ", meaning: "수영하다" },
  { japanese: "飛ぶ", reading: "とぶ", meaning: "날다" },
  { japanese: "訪ねる", reading: "たずねる", meaning: "방문하다" },
  { japanese: "泣く", reading: "なく", meaning: "울다" },
  { japanese: "笑う", reading: "わらう", meaning: "웃다" },
  { japanese: "怒る", reading: "おこる", meaning: "화내다" },
  { japanese: "喜ぶ", reading: "よろこぶ", meaning: "기뻐하다" },
  { japanese: "驚く", reading: "おどろく", meaning: "놀라다" },
  { japanese: "困る", reading: "こまる", meaning: "곤란하다" },
  { japanese: "感じる", reading: "かんじる", meaning: "느끼다" },
  { japanese: "見せる", reading: "みせる", meaning: "보여주다" },
  { japanese: "頼む", reading: "たのむ", meaning: "부탁하다" },
  { japanese: "断る", reading: "ことわる", meaning: "거절하다" },
  { japanese: "約束する", reading: "やくそくする", meaning: "약속하다" },
  { japanese: "準備する", reading: "じゅんびする", meaning: "준비하다" },
  { japanese: "練習する", reading: "れんしゅうする", meaning: "연습하다" },
  { japanese: "説明する", reading: "せつめいする", meaning: "설명하다" },
  { japanese: "連絡する", reading: "れんらくする", meaning: "연락하다" },
  { japanese: "確認する", reading: "かくにんする", meaning: "확인하다" },
  { japanese: "心配する", reading: "しんぱいする", meaning: "걱정하다" },
  { japanese: "相談する", reading: "そうだんする", meaning: "상담하다" },
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
  { japanese: "正しい", reading: "ただしい", meaning: "맞다/올바르다" },
  { japanese: "危ない", reading: "あぶない", meaning: "위험하다" },
  { japanese: "痛い", reading: "いたい", meaning: "아프다" },
  { japanese: "重い", reading: "おもい", meaning: "무겁다" },
  { japanese: "軽い", reading: "かるい", meaning: "가볍다" },
  { japanese: "長い", reading: "ながい", meaning: "길다" },
  { japanese: "短い", reading: "みじかい", meaning: "짧다" },
  { japanese: "暗い", reading: "くらい", meaning: "어둡다" },
  { japanese: "明るい", reading: "あかるい", meaning: "밝다" },
  { japanese: "強い", reading: "つよい", meaning: "강하다" },
  { japanese: "弱い", reading: "よわい", meaning: "약하다" },
  { japanese: "早い", reading: "はやい", meaning: "빠르다" },
  { japanese: "遅い", reading: "おそい", meaning: "느리다/늦다" },
  { japanese: "うれしい", reading: "ureshii", meaning: "기쁘다" },
  { japanese: "かなしい", reading: "kanashii", meaning: "슬프다" },
  { japanese: "こわい", reading: "kowai", meaning: "무섭다" },
  { japanese: "はずかしい", reading: "hazukashii", meaning: "부끄럽다" },
  { japanese: "さびしい", reading: "sabishii", meaning: "외롭다" },
  // な형용사
  { japanese: "親切", reading: "しんせつ", meaning: "친절하다" },
  { japanese: "丁寧", reading: "ていねい", meaning: "정중하다" },
  { japanese: "大切", reading: "たいせつ", meaning: "소중하다" },
  { japanese: "便利", reading: "べんり", meaning: "편리하다" },
  { japanese: "不便", reading: "ふべん", meaning: "불편하다" },
  { japanese: "安全", reading: "あんぜん", meaning: "안전하다" },
  { japanese: "危険", reading: "きけん", meaning: "위험하다" },
  { japanese: "有名", reading: "ゆうめい", meaning: "유명하다" },
  { japanese: "特別", reading: "とくべつ", meaning: "특별하다" },
  { japanese: "普通", reading: "ふつう", meaning: "보통이다" },
  { japanese: "上手", reading: "じょうず", meaning: "잘하다" },
  { japanese: "下手", reading: "へた", meaning: "못하다" },
  { japanese: "大丈夫", reading: "だいじょうぶ", meaning: "괜찮다" },
  { japanese: "好き", reading: "すき", meaning: "좋아하다" },
  { japanese: "嫌い", reading: "きらい", meaning: "싫어하다" },
  { japanese: "元気", reading: "げんき", meaning: "건강하다/활기차다" },
  { japanese: "真面目", reading: "まじめ", meaning: "성실하다" },
  { japanese: "丈夫", reading: "じょうぶ", meaning: "튼튼하다" },
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
  { japanese: "建物", reading: "たてもの", meaning: "건물" },
  { japanese: "道", reading: "みち", meaning: "길" },
  { japanese: "橋", reading: "はし", meaning: "다리" },
  { japanese: "地図", reading: "ちず", meaning: "지도" },
  { japanese: "住所", reading: "じゅうしょ", meaning: "주소" },
  { japanese: "国", reading: "くに", meaning: "나라" },
  { japanese: "首都", reading: "しゅと", meaning: "수도" },
  { japanese: "観光", reading: "かんこう", meaning: "관광" },
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
  { japanese: "時間", reading: "じかん", meaning: "시간" },
  { japanese: "先月", reading: "せんげつ", meaning: "지난달" },
  { japanese: "来月", reading: "らいげつ", meaning: "다음달" },
  { japanese: "今年", reading: "ことし", meaning: "올해" },
  { japanese: "去年", reading: "きょねん", meaning: "작년" },
  { japanese: "来年", reading: "らいねん", meaning: "내년" },
  { japanese: "毎週", reading: "まいしゅう", meaning: "매주" },
  { japanese: "午前", reading: "ごぜん", meaning: "오전" },
  { japanese: "午後", reading: "ごご", meaning: "오후" },
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
  { japanese: "雲", reading: "くも", meaning: "구름" },
  { japanese: "虹", reading: "にじ", meaning: "무지개" },
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
  { japanese: "部屋", reading: "へや", meaning: "방" },
  { japanese: "窓", reading: "まど", meaning: "창문" },
  { japanese: "ドア", reading: "doa", meaning: "문" },
  { japanese: "電気", reading: "でんき", meaning: "전기/불" },
  { japanese: "鍵", reading: "かぎ", meaning: "열쇠" },
  { japanese: "掃除", reading: "そうじ", meaning: "청소" },
  { japanese: "洗濯", reading: "せんたく", meaning: "빨래" },
  { japanese: "台所", reading: "だいどころ", meaning: "부엌" },
  { japanese: "冷蔵庫", reading: "れいぞうこ", meaning: "냉장고" },
  // 학교/공부
  { japanese: "勉強", reading: "べんきょう", meaning: "공부" },
  { japanese: "宿題", reading: "しゅくだい", meaning: "숙제" },
  { japanese: "試験", reading: "しけん", meaning: "시험" },
  { japanese: "授業", reading: "じゅぎょう", meaning: "수업" },
  { japanese: "教室", reading: "きょうしつ", meaning: "교실" },
  { japanese: "教科書", reading: "きょうかしょ", meaning: "교과서" },
  { japanese: "辞書", reading: "じしょ", meaning: "사전" },
  { japanese: "鉛筆", reading: "えんぴつ", meaning: "연필" },
  { japanese: "ボールペン", reading: "boorupen", meaning: "볼펜" },
  { japanese: "卒業", reading: "そつぎょう", meaning: "졸업" },
  // 건강
  { japanese: "薬", reading: "くすり", meaning: "약" },
  { japanese: "病気", reading: "びょうき", meaning: "병" },
  { japanese: "怪我", reading: "けが", meaning: "부상/다침" },
  { japanese: "熱", reading: "ねつ", meaning: "열" },
  { japanese: "頭痛", reading: "ずつう", meaning: "두통" },
  { japanese: "運動", reading: "うんどう", meaning: "운동" },
  { japanese: "休む", reading: "やすむ", meaning: "쉬다" },
  // 회사/일
  { japanese: "会社", reading: "かいしゃ", meaning: "회사" },
  { japanese: "仕事", reading: "しごと", meaning: "일/직업" },
  { japanese: "会議", reading: "かいぎ", meaning: "회의" },
  { japanese: "給料", reading: "きゅうりょう", meaning: "급료/월급" },
  { japanese: "残業", reading: "ざんぎょう", meaning: "잔업/초과근무" },
  { japanese: "休憩", reading: "きゅうけい", meaning: "휴식" },
  // 기술/미디어
  { japanese: "電話", reading: "でんわ", meaning: "전화" },
  { japanese: "スマホ", reading: "sumaho", meaning: "스마트폰" },
  { japanese: "パソコン", reading: "pasokon", meaning: "컴퓨터" },
  { japanese: "テレビ", reading: "terebi", meaning: "TV" },
  { japanese: "インターネット", reading: "intaanetto", meaning: "인터넷" },
  { japanese: "メール", reading: "meeru", meaning: "이메일" },
  { japanese: "写真", reading: "しゃしん", meaning: "사진" },
  { japanese: "音楽", reading: "おんがく", meaning: "음악" },
  { japanese: "映画", reading: "えいが", meaning: "영화" },
  // 옷/패션
  { japanese: "服", reading: "ふく", meaning: "옷" },
  { japanese: "シャツ", reading: "shatsu", meaning: "셔츠" },
  { japanese: "ズボン", reading: "zubon", meaning: "바지" },
  { japanese: "スカート", reading: "sukaato", meaning: "치마" },
  { japanese: "コート", reading: "kooto", meaning: "코트" },
  { japanese: "帽子", reading: "ぼうし", meaning: "모자" },
  { japanese: "靴", reading: "くつ", meaning: "신발" },
  { japanese: "靴下", reading: "くつした", meaning: "양말" },
  { japanese: "眼鏡", reading: "めがね", meaning: "안경" },
  { japanese: "財布", reading: "さいふ", meaning: "지갑" },
  { japanese: "かばん", reading: "kaban", meaning: "가방" },
  { japanese: "時計", reading: "とけい", meaning: "시계" },
  // 자연
  { japanese: "空", reading: "そら", meaning: "하늘" },
  { japanese: "海", reading: "うみ", meaning: "바다" },
  { japanese: "川", reading: "かわ", meaning: "강" },
  { japanese: "山", reading: "やま", meaning: "산" },
  { japanese: "森", reading: "もり", meaning: "숲" },
  { japanese: "花", reading: "はな", meaning: "꽃" },
  { japanese: "木", reading: "き", meaning: "나무" },
  { japanese: "星", reading: "ほし", meaning: "별" },
  { japanese: "月", reading: "つき", meaning: "달" },
  { japanese: "太陽", reading: "たいよう", meaning: "태양" },
  { japanese: "桜", reading: "さくら", meaning: "벚꽃" },
  // 음식점/쇼핑
  { japanese: "メニュー", reading: "menyuu", meaning: "메뉴" },
  { japanese: "注文", reading: "ちゅうもん", meaning: "주문" },
  { japanese: "飲み物", reading: "のみもの", meaning: "음료" },
  { japanese: "お釣り", reading: "おつり", meaning: "거스름돈" },
  { japanese: "値段", reading: "ねだん", meaning: "가격" },
  { japanese: "セール", reading: "seeru", meaning: "세일" },
  { japanese: "割引", reading: "わりびき", meaning: "할인" },
  { japanese: "現金", reading: "げんきん", meaning: "현금" },
  { japanese: "お金", reading: "おかね", meaning: "돈" },
  // 취미/여가
  { japanese: "旅行", reading: "りょこう", meaning: "여행" },
  { japanese: "スポーツ", reading: "supootsu", meaning: "스포츠" },
  { japanese: "ゲーム", reading: "geemu", meaning: "게임" },
  { japanese: "読書", reading: "どくしょ", meaning: "독서" },
  { japanese: "料理", reading: "りょうり", meaning: "요리" },
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
  { japanese: "特に", reading: "とくに", meaning: "특히" },
  { japanese: "例えば", reading: "たとえば", meaning: "예를 들면" },
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
      { j: "学生です", r: "がくせいです", m: "학생이에요" },
      { j: "日本語は楽しいです", r: "にほんごはたのしいです", m: "일본어는 즐거워요" },
      { j: "これはペンです", r: "これはペンです", m: "이것은 펜이에요" },
      { j: "今日は月曜日です", r: "きょうはげつようびです", m: "오늘은 월요일이에요" },
    ],
    practice: [
      { j: "先生です", r: "せんせいです", m: "선생님이에요" },
      { j: "猫はかわいいです", r: "ねこはかわいいです", m: "고양이는 귀여워요" },
      { j: "明日は休みです", r: "あしたはやすみです", m: "내일은 휴일이에요" },
      { j: "あの人は医者です", r: "あのひとはいしゃです", m: "저 사람은 의사예요" },
    ], tip: "부정은 ではありません. 과거는 でした." },
  { title: "は — 주제 표시 (~은/는)", level: "N5",
    rule: "주제 + は + 서술 → '~은/는 ~이에요'",
    examples: [
      { j: "私は韓国人です", r: "わたしはかんこくじんです", m: "저는 한국인이에요" },
      { j: "これは本です", r: "これはほんです", m: "이것은 책이에요" },
      { j: "彼は先生です", r: "かれはせんせいです", m: "그는 선생님이에요" },
      { j: "今日は暑いです", r: "きょうはあついです", m: "오늘은 더워요" },
    ],
    practice: [
      { j: "母は料理が上手です", r: "はははりょうりがじょうずです", m: "엄마는 요리를 잘해요" },
      { j: "この店はおいしいです", r: "このみせはおいしいです", m: "이 가게는 맛있어요" },
      { j: "弟は高校生です", r: "おとうとはこうこうせいです", m: "남동생은 고등학생이에요" },
      { j: "東京は大きい町です", r: "とうきょうはおおきいまちです", m: "도쿄는 큰 도시예요" },
    ], tip: "は는 'wa'로 읽어요. 문자는 は(ha)지만 발음은 wa." },
  { title: "が — 주어 강조 (~이/가)", level: "N5",
    rule: "새 정보나 특정 대상을 강조할 때 が를 써요",
    examples: [
      { j: "どれがいいですか", r: "どれがいいですか", m: "어느 것이 좋아요?" },
      { j: "あの人が先生です", r: "あのひとがせんせいです", m: "저 분이 선생님이에요" },
      { j: "猫が好きです", r: "ねこがすきです", m: "고양이를 좋아해요" },
      { j: "誰が来ますか", r: "だれがきますか", m: "누가 와요?" },
    ],
    practice: [
      { j: "雨が降っています", r: "あめがふっています", m: "비가 내리고 있어요" },
      { j: "どこが痛いですか", r: "どこがいたいですか", m: "어디가 아파요?" },
      { j: "田中さんが来ました", r: "たなかさんがきました", m: "다나카 씨가 왔어요" },
      { j: "音楽が好きです", r: "おんがくがすきです", m: "음악을 좋아해요" },
    ], tip: "처음엔 は만 써도 돼요. が는 점차 감이 생겨요." },
  { title: "を — 목적어 (~을/를)", level: "N5",
    rule: "동작의 대상 앞에 를 붙여요",
    examples: [
      { j: "ご飯を食べます", r: "ごはんをたべます", m: "밥을 먹어요" },
      { j: "日本語を勉強します", r: "にほんごをべんきょうします", m: "일본어를 공부해요" },
      { j: "水を飲みます", r: "みずをのみます", m: "물을 마셔요" },
      { j: "テレビを見ます", r: "テレビをみます", m: "TV를 봐요" },
    ],
    practice: [
      { j: "手紙を書きます", r: "てがみをかきます", m: "편지를 써요" },
      { j: "音楽を聴きます", r: "おんがくをききます", m: "음악을 들어요" },
      { j: "窓を閉めます", r: "まどをしめます", m: "창문을 닫아요" },
      { j: "新聞を読みます", r: "しんぶんをよみます", m: "신문을 읽어요" },
    ], tip: "を는 'wo'로 읽지만 실제 발음은 'o'에 가까워요." },
  { title: "に — 방향/장소 (~에/에게)", level: "N5",
    rule: "목적지, 존재 장소, 시간 앞에 に를 써요",
    examples: [
      { j: "学校に行きます", r: "がっこうにいきます", m: "학교에 가요" },
      { j: "部屋にいます", r: "へやにいます", m: "방에 있어요" },
      { j: "友達に会います", r: "ともだちにあいます", m: "친구를 만나요" },
      { j: "7時に起きます", r: "しちじにおきます", m: "7시에 일어나요" },
    ],
    practice: [
      { j: "病院に行きます", r: "びょういんにいきます", m: "병원에 가요" },
      { j: "机の上に猫がいます", r: "つくえのうえにねこがいます", m: "책상 위에 고양이가 있어요" },
      { j: "8時に寝ます", r: "はちじにねます", m: "8시에 자요" },
      { j: "先生に聞きます", r: "せんせいにききます", m: "선생님에게 물어봐요" },
    ], tip: "で는 행동 장소, に는 존재/도착 장소." },
  { title: "で — 장소/수단 (~에서/로)", level: "N5",
    rule: "행동이 일어나는 장소, 또는 이동 수단 앞에 で를 써요",
    examples: [
      { j: "図書館で読みます", r: "としょかんでよみます", m: "도서관에서 읽어요" },
      { j: "電車で行きます", r: "でんしゃでいきます", m: "전철로 가요" },
      { j: "公園で遊びます", r: "こうえんであそびます", m: "공원에서 놀아요" },
      { j: "箸で食べます", r: "はしでたべます", m: "젓가락으로 먹어요" },
    ],
    practice: [
      { j: "会社で働きます", r: "かいしゃではたらきます", m: "회사에서 일해요" },
      { j: "日本語で話します", r: "にほんごではなします", m: "일본어로 이야기해요" },
      { j: "家でご飯を食べます", r: "いえでごはんをたべます", m: "집에서 밥을 먹어요" },
      { j: "バスで学校に行きます", r: "バスでがっこうにいきます", m: "버스로 학교에 가요" },
    ], tip: "수단·방법에도 써요: 日本語で話しましょう" },
  { title: "~ます — 정중한 동사 활용", level: "N5",
    rule: "동사 기본형 → ます형: たべる→たべます, いく→いきます",
    examples: [
      { j: "毎日勉強します", r: "まいにちべんきょうします", m: "매일 공부해요" },
      { j: "明日行きます", r: "あしたいきます", m: "내일 가요" },
      { j: "毎朝コーヒーを飲みます", r: "まいあさコーヒーをのみます", m: "매일 아침 커피를 마셔요" },
      { j: "週末は働きません", r: "しゅうまつははたらきません", m: "주말에는 일하지 않아요" },
    ],
    practice: [
      { j: "毎週土曜日に掃除します", r: "まいしゅうどようびにそうじします", m: "매주 토요일에 청소해요" },
      { j: "夜遅く帰ります", r: "よるおそくかえります", m: "밤 늦게 돌아가요" },
      { j: "友達と映画を見ます", r: "ともだちとえいがをみます", m: "친구랑 영화를 봐요" },
      { j: "朝ごはんを食べません", r: "あさごはんをたべません", m: "아침밥을 안 먹어요" },
    ], tip: "부정: ~ません. 과거: ~ました. 과거부정: ~ませんでした" },
  { title: "~て形 — 동작 연결", level: "N5",
    rule: "동사를 て형으로 바꿔서 연결하거나 부탁을 표현해요",
    examples: [
      { j: "見てください", r: "みてください", m: "봐 주세요" },
      { j: "食べてから行きます", r: "たべてからいきます", m: "먹고 나서 가요" },
      { j: "食べています", r: "たべています", m: "먹고 있어요" },
      { j: "窓を開けて掃除します", r: "まどをあけてそうじします", m: "창문을 열고 청소해요" },
    ],
    practice: [
      { j: "手を洗ってください", r: "てをあらってください", m: "손을 씻어 주세요" },
      { j: "宿題をしてから寝ます", r: "しゅくだいをしてからねます", m: "숙제를 하고 나서 자요" },
      { j: "音楽を聴いています", r: "おんがくをきいています", m: "음악을 듣고 있어요" },
      { j: "テレビを消して勉強します", r: "テレビをけしてべんきょうします", m: "TV를 끄고 공부해요" },
    ], tip: "~てください = 부탁, ~ています = 진행중, ~てから = 순서" },
  { title: "~たい — 하고 싶다", level: "N5",
    rule: "ます형에서 ます를 제거하고 たい를 붙여요",
    examples: [
      { j: "日本に行きたいです", r: "にほんにいきたいです", m: "일본에 가고 싶어요" },
      { j: "寿司を食べたい", r: "すしをたべたい", m: "초밥을 먹고 싶어요" },
      { j: "新しい靴が買いたいです", r: "あたらしいくつがかいたいです", m: "새 신발을 사고 싶어요" },
      { j: "早く休みたいです", r: "はやくやすみたいです", m: "빨리 쉬고 싶어요" },
    ],
    practice: [
      { j: "海で泳ぎたいです", r: "うみでおよぎたいです", m: "바다에서 수영하고 싶어요" },
      { j: "友達に会いたいです", r: "ともだちにあいたいです", m: "친구를 만나고 싶어요" },
      { j: "新しい本が読みたいです", r: "あたらしいほんがよみたいです", m: "새 책을 읽고 싶어요" },
      { j: "早く帰りたいです", r: "はやくかえりたいです", m: "빨리 집에 가고 싶어요" },
    ], tip: "부정: ~たくない. たい는 형용사처럼 활용해요." },
  { title: "~ない形 — 부정", level: "N5",
    rule: "동사를 부정형으로 바꾸는 방법",
    examples: [
      { j: "食べない", r: "たべない", m: "먹지 않아" },
      { j: "行かない", r: "いかない", m: "가지 않아" },
      { j: "しない", r: "しない", m: "하지 않아" },
      { j: "分からない", r: "わからない", m: "모르겠어" },
    ],
    practice: [
      { j: "見ない", r: "みない", m: "보지 않아" },
      { j: "飲まない", r: "のまない", m: "마시지 않아" },
      { j: "来ない", r: "こない", m: "오지 않아" },
      { j: "買わない", r: "かわない", m: "사지 않아" },
    ], tip: "2그룹: る→ない. 1그룹: う단→あ단+ない. 불규칙: する→しない, くる→こない" },
  { title: "~ましょう — 함께 해요", level: "N5",
    rule: "동사 ます형 + ましょう → 제안/권유",
    examples: [
      { j: "一緒に食べましょう", r: "いっしょにたべましょう", m: "같이 먹어요" },
      { j: "始めましょうか", r: "はじめましょうか", m: "시작할까요?" },
      { j: "少し休みましょう", r: "すこしやすみましょう", m: "잠깐 쉬어요" },
      { j: "写真を撮りましょう", r: "しゃしんをとりましょう", m: "사진을 찍어요" },
    ],
    practice: [
      { j: "一緒に勉強しましょう", r: "いっしょにべんきょうしましょう", m: "같이 공부해요" },
      { j: "そろそろ帰りましょう", r: "そろそろかえりましょう", m: "슬슬 돌아가요" },
      { j: "少し歩きましょうか", r: "すこしあるきましょうか", m: "좀 걸을까요?" },
      { j: "明日また会いましょう", r: "あしたまたあいましょう", m: "내일 또 만나요" },
    ], tip: "~ましょうか로 물으면 더 공손한 제안이 돼요." },
  { title: "~てもいい — 해도 돼요", level: "N5",
    rule: "て형 + もいい → 허가 표현",
    examples: [
      { j: "ここで座ってもいいですか", r: "ここですわってもいいですか", m: "여기 앉아도 돼요?" },
      { j: "使ってもいいですよ", r: "つかってもいいですよ", m: "사용해도 돼요" },
      { j: "ここで写真を撮ってもいいですか", r: "ここでしゃしんをとってもいいですか", m: "여기서 사진 찍어도 돼요?" },
      { j: "先に帰ってもいいですよ", r: "さきにかえってもいいですよ", m: "먼저 가도 돼요" },
    ],
    practice: [
      { j: "窓を開けてもいいですか", r: "まどをあけてもいいですか", m: "창문을 열어도 돼요?" },
      { j: "ここに荷物を置いてもいいですか", r: "ここににもつをおいてもいいですか", m: "여기에 짐을 놓아도 돼요?" },
      { j: "もう一つ食べてもいいですよ", r: "もうひとつたべてもいいですよ", m: "하나 더 먹어도 돼요" },
      { j: "少し休んでもいいですか", r: "すこしやすんでもいいですか", m: "잠깐 쉬어도 돼요?" },
    ], tip: "~てはいけない가 반대: '하면 안 돼요'" },
  { title: "~てはいけない — 금지", level: "N5",
    rule: "て형 + はいけない → ~하면 안 돼요",
    examples: [
      { j: "ここでタバコを吸ってはいけません", r: "ここでタバコをすってはいけません", m: "여기서 담배 피우면 안 돼요" },
      { j: "遅刻してはいけません", r: "ちこくしてはいけません", m: "지각하면 안 돼요" },
      { j: "ここに車を止めてはいけません", r: "ここにくるまをとめてはいけません", m: "여기에 차를 세우면 안 돼요" },
      { j: "授業中に寝てはいけません", r: "じゅぎょうちゅうにねてはいけません", m: "수업 중에 자면 안 돼요" },
    ],
    practice: [
      { j: "ここで写真を撮ってはいけません", r: "ここでしゃしんをとってはいけません", m: "여기서 사진 찍으면 안 돼요" },
      { j: "図書館で騒いではいけません", r: "としょかんでさわいではいけません", m: "도서관에서 떠들면 안 돼요" },
      { j: "嘘をついてはいけません", r: "うそをついてはいけません", m: "거짓말하면 안 돼요" },
      { j: "芝生に入ってはいけません", r: "しばふにはいってはいけません", m: "잔디밭에 들어가면 안 돼요" },
    ], tip: "규칙, 표지판, 경고에 자주 나와요." },
  { title: "~なくてもいい — 안 해도 돼요", level: "N5",
    rule: "ない형 → なくてもいい → 불필요 표현",
    examples: [
      { j: "無理しなくてもいいです", r: "むりしなくてもいいです", m: "무리하지 않아도 돼요" },
      { j: "来なくてもいいですよ", r: "こなくてもいいですよ", m: "안 와도 돼요" },
      { j: "今日は勉強しなくてもいいです", r: "きょうはべんきょうしなくてもいいです", m: "오늘은 공부하지 않아도 돼요" },
      { j: "心配しなくてもいいですよ", r: "しんぱいしなくてもいいですよ", m: "걱정하지 않아도 돼요" },
    ],
    practice: [
      { j: "急がなくてもいいですよ", r: "いそがなくてもいいですよ", m: "서두르지 않아도 돼요" },
      { j: "全部食べなくてもいいです", r: "ぜんぶたべなくてもいいです", m: "다 안 먹어도 돼요" },
      { j: "今日は残業しなくてもいいです", r: "きょうはざんぎょうしなくてもいいです", m: "오늘은 잔업하지 않아도 돼요" },
      { j: "説明しなくてもいいですよ", r: "せつめいしなくてもいいですよ", m: "설명하지 않아도 돼요" },
    ], tip: "영어의 'don't have to'와 같아요." },
  { title: "いる/ある — 존재 표현", level: "N5",
    rule: "いる(사람/동물) vs ある(사물/식물)",
    examples: [
      { j: "猫がいます", r: "ねこがいます", m: "고양이가 있어요" },
      { j: "部屋に本があります", r: "へやにほんがあります", m: "방에 책이 있어요" },
      { j: "公園に子供がいます", r: "こうえんにこどもがいます", m: "공원에 아이가 있어요" },
      { j: "机の上にペンがあります", r: "つくえのうえにペンがあります", m: "책상 위에 펜이 있어요" },
    ],
    practice: [
      { j: "庭に犬がいます", r: "にわにいぬがいます", m: "마당에 개가 있어요" },
      { j: "冷蔵庫に卵があります", r: "れいぞうこにたまごがあります", m: "냉장고에 달걀이 있어요" },
      { j: "教室に学生がいます", r: "きょうしつにがくせいがいます", m: "교실에 학생이 있어요" },
      { j: "かばんの中に財布があります", r: "かばんのなかにさいふがあります", m: "가방 안에 지갑이 있어요" },
    ], tip: "에 있다 = に + いる/ある" },
  // N4
  { title: "~から — 이유 (~이기 때문에)", level: "N4",
    rule: "이유를 직접적으로 말할 때 문장 끝에 から를 붙여요",
    examples: [
      { j: "寒いから、窓を閉めた", r: "さむいから、まどをしめた", m: "추워서 창문을 닫았어" },
      { j: "好きだから勉強します", r: "すきだからべんきょうします", m: "좋아서 공부해요" },
      { j: "眠いから、早く寝ます", r: "ねむいから、はやくねます", m: "졸려서 일찍 자요" },
      { j: "雨だから、傘を持って行きます", r: "あめだから、かさをもっていきます", m: "비가 와서 우산을 가지고 가요" },
    ],
    practice: [
      { j: "疲れたから、早く帰ります", r: "つかれたから、はやくかえります", m: "피곤해서 일찍 집에 가요" },
      { j: "安いから、これにします", r: "やすいから、これにします", m: "싸서 이걸로 할게요" },
      { j: "危ないから、気をつけてください", r: "あぶないから、きをつけてください", m: "위험하니까 조심하세요" },
      { j: "暇だから、映画を見ました", r: "ひまだから、えいがをみました", m: "한가해서 영화를 봤어요" },
    ], tip: "ので는 から보다 공손해요. 공식 자리엔 ので가 더 자연스러워요." },
  { title: "~と思います — ~라고 생각해요", level: "N4",
    rule: "자신의 생각/의견을 부드럽게 전달할 때 써요",
    examples: [
      { j: "難しいと思います", r: "むずかしいとおもいます", m: "어렵다고 생각해요" },
      { j: "彼はもう来たと思います", r: "かれはもうきたとおもいます", m: "그는 이미 왔다고 생각해요" },
      { j: "明日は晴れると思います", r: "あしたははれるとおもいます", m: "내일은 맑을 거라고 생각해요" },
      { j: "このドラマは面白いと思います", r: "このドラマはおもしろいとおもいます", m: "이 드라마는 재미있다고 생각해요" },
    ],
    practice: [
      { j: "彼女は忙しいと思います", r: "かのじょはいそがしいとおもいます", m: "그녀는 바쁘다고 생각해요" },
      { j: "明日は雨だと思います", r: "あしたはあめだとおもいます", m: "내일은 비가 올 거라고 생각해요" },
      { j: "これはいい考えだと思います", r: "これはいいかんがえだとおもいます", m: "이건 좋은 생각이라고 생각해요" },
      { j: "彼は正しいと思います", r: "かれはただしいとおもいます", m: "그가 맞다고 생각해요" },
    ], tip: "단정짓는 것보다 부드러운 인상을 줘서 일본어 회화에서 많이 써요." },
  { title: "~たことがある — 경험", level: "N4",
    rule: "과거에 경험한 것을 말할 때 써요",
    examples: [
      { j: "日本に行ったことがあります", r: "にほんにいったことがあります", m: "일본에 간 적 있어요" },
      { j: "寿司を食べたことがない", r: "すしをたべたことがない", m: "초밥을 먹어본 적 없어요" },
      { j: "富士山に登ったことがあります", r: "ふじさんにのぼったことがあります", m: "후지산에 오른 적이 있어요" },
      { j: "一度も会ったことがない", r: "いちどもあったことがない", m: "한 번도 만난 적이 없어요" },
    ],
    practice: [
      { j: "韓国に来たことがありますか", r: "かんこくにきたことがありますか", m: "한국에 온 적 있어요?" },
      { j: "着物を着たことがあります", r: "きものをきたことがあります", m: "기모노를 입어 본 적 있어요" },
      { j: "この映画を見たことがない", r: "このえいがをみたことがない", m: "이 영화를 본 적 없어요" },
      { j: "飛行機に乗ったことがあります", r: "ひこうきにのったことがあります", m: "비행기를 타 본 적 있어요" },
    ], tip: "동사 た형 + ことがある/ない." },
  { title: "~かもしれない — ~일지도 몰라", level: "N4",
    rule: "확실하지 않은 추측을 표현할 때 써요",
    examples: [
      { j: "雨が降るかもしれません", r: "あめがふるかもしれません", m: "비가 올지도 몰라요" },
      { j: "もう遅いかも", r: "もうおそいかも", m: "이미 늦었을지도 몰라" },
      { j: "彼は忙しいかもしれません", r: "かれはいそがしいかもしれません", m: "그는 바쁠지도 몰라요" },
      { j: "今日は誰も来ないかもしれない", r: "きょうはだれもこないかもしれない", m: "오늘은 아무도 안 올지도 몰라" },
    ],
    practice: [
      { j: "明日は雪が降るかもしれません", r: "あしたはゆきがふるかもしれません", m: "내일은 눈이 올지도 몰라요" },
      { j: "彼女はもう寝ているかもしれません", r: "かのじょはもうねているかもしれません", m: "그녀는 이미 자고 있을지도 몰라요" },
      { j: "このテストは難しいかもしれない", r: "このテストはむずかしいかもしれない", m: "이 시험은 어려울지도 몰라" },
      { j: "忘れたかもしれません", r: "わすれたかもしれません", m: "잊어버렸을지도 몰라요" },
    ], tip: "정중체: かもしれません. 캐주얼: かも." },
  { title: "~てみる — 해보다", level: "N4",
    rule: "무언가를 시도해볼 때 써요",
    examples: [
      { j: "やってみます", r: "やってみます", m: "해볼게요" },
      { j: "食べてみてください", r: "たべてみてください", m: "먹어 보세요" },
      { j: "この服を着てみてください", r: "このふくをきてみてください", m: "이 옷을 입어 보세요" },
      { j: "一度聞いてみます", r: "いちどきいてみます", m: "한번 물어볼게요" },
    ],
    practice: [
      { j: "この本を読んでみます", r: "このほんをよんでみます", m: "이 책을 읽어 볼게요" },
      { j: "新しい料理を作ってみました", r: "あたらしいりょうりをつくってみました", m: "새 요리를 만들어 봤어요" },
      { j: "一度使ってみてください", r: "いちどつかってみてください", m: "한번 사용해 보세요" },
      { j: "日本語で話してみます", r: "にほんごではなしてみます", m: "일본어로 이야기해 볼게요" },
    ], tip: "~てみる는 '시도/경험'의 뉘앙스." },
  { title: "~なければならない — 해야 해요", level: "N4",
    rule: "의무나 필요성을 나타내는 표현이에요",
    examples: [
      { j: "もっと勉強しなければなりません", r: "もっとべんきょうしなければなりません", m: "더 공부해야 해요" },
      { j: "早く行かなきゃ", r: "はやくいかなきゃ", m: "빨리 가야 해(구어)" },
      { j: "薬を飲まなければなりません", r: "くすりをのまなければなりません", m: "약을 먹어야 해요" },
      { j: "明日までに終わらせなければならない", r: "あしたまでにおわらせなければならない", m: "내일까지 끝내야 해" },
    ],
    practice: [
      { j: "毎日運動しなければなりません", r: "まいにちうんどうしなければなりません", m: "매일 운동해야 해요" },
      { j: "もう帰らなければなりません", r: "もうかえらなければなりません", m: "이제 돌아가야 해요" },
      { j: "宿題を出さなければなりません", r: "しゅくだいをださなければなりません", m: "숙제를 내야 해요" },
      { j: "早く寝なきゃ", r: "はやくねなきゃ", m: "빨리 자야 해(구어)" },
    ], tip: "구어체: ~なきゃ (나키야)" },
  { title: "~そうだ (양태) — ~인 것 같아요", level: "N4",
    rule: "직접 보거나 느껴서 '~인 것 같다'고 표현해요",
    examples: [
      { j: "このケーキはおいしそうです", r: "このケーキはおいしそうです", m: "이 케이크 맛있어 보여요" },
      { j: "雨が降りそうです", r: "あめがふりそうです", m: "비가 올 것 같아요" },
      { j: "この本は難しそうです", r: "このほんはむずかしそうです", m: "이 책은 어려워 보여요" },
      { j: "彼は元気そうですね", r: "かれはげんきそうですね", m: "그는 건강해 보이네요" },
    ],
    practice: [
      { j: "この荷物は重そうです", r: "このにもつはおもそうです", m: "이 짐은 무거워 보여요" },
      { j: "彼女は嬉しそうです", r: "かのじょはうれしそうです", m: "그녀는 기뻐 보여요" },
      { j: "雪が降りそうです", r: "ゆきがふりそうです", m: "눈이 올 것 같아요" },
      { j: "このパンはおいしそうです", r: "このパンはおいしそうです", m: "이 빵 맛있어 보여요" },
    ], tip: "い형용사는 어간+そう. 동사는 ます형+そう." },
  { title: "~でしょう — ~이겠죠", level: "N4",
    rule: "어느 정도 확신이 있는 추측을 표현해요",
    examples: [
      { j: "明日はいい天気でしょう", r: "あしたはいいてんきでしょう", m: "내일은 날씨가 좋겠죠" },
      { j: "大変だったでしょう", r: "たいへんだったでしょう", m: "힘들었겠죠" },
      { j: "彼はもう寝ているでしょう", r: "かれはもうねているでしょう", m: "그는 이미 자고 있겠죠" },
      { j: "週末は混むでしょう", r: "しゅうまつはこむでしょう", m: "주말은 붐비겠죠" },
    ],
    practice: [
      { j: "明日は寒いでしょう", r: "あしたはさむいでしょう", m: "내일은 춥겠죠" },
      { j: "彼女はきっと合格するでしょう", r: "かのじょはきっとごうかくするでしょう", m: "그녀는 분명 합격하겠죠" },
      { j: "疲れたでしょう", r: "つかれたでしょう", m: "피곤했겠죠" },
      { j: "この道の方が早いでしょう", r: "このみちのほうがはやいでしょう", m: "이 길이 더 빠르겠죠" },
    ], tip: "캐주얼: ~だろう" },
  { title: "~ば — ~하면 (가정)", level: "N4",
    rule: "조건을 나타내는 표현이에요",
    examples: [
      { j: "練習すれば、上手になります", r: "れんしゅうすれば、じょうずになります", m: "연습하면 잘하게 돼요" },
      { j: "早く起きれば、間に合います", r: "はやくおきれば、まにあいます", m: "일찍 일어나면 시간에 맞아요" },
      { j: "毎日少しずつ練習すれば、必ずうまくなります", r: "まいにちすこしずつれんしゅうすれば、かならずうまくなります", m: "매일 조금씩 연습하면 반드시 잘하게 돼요" },
      { j: "時間があれば、一緒に映画を見ませんか", r: "じかんがあれば、いっしょにえいがをみませんか", m: "시간 있으면 같이 영화 안 볼래요?" },
    ],
    practice: [
      { j: "お金があれば、旅行に行きます", r: "おかねがあれば、りょこうにいきます", m: "돈이 있으면 여행을 가요" },
      { j: "薬を飲めば、よくなります", r: "くすりをのめば、よくなります", m: "약을 먹으면 나아져요" },
      { j: "押せば、開きます", r: "おせば、ひらきます", m: "누르면 열려요" },
      { j: "天気がよければ、出かけましょう", r: "てんきがよければ、でかけましょう", m: "날씨가 좋으면 나가요" },
    ], tip: "일반적 조건이나 충고에 자주 써요." },
  { title: "~たら — ~하면/~했더니", level: "N4",
    rule: "た형 + ら → 가정/완료 후 상황",
    examples: [
      { j: "家に帰ったら、電話してね", r: "いえにかえったら、でんわしてね", m: "집에 돌아가면 전화해" },
      { j: "外に出たら、寒かったです", r: "そとにでたら、さむかったです", m: "밖에 나갔더니 추웠어요" },
      { j: "駅に着いたら、電話します", r: "えきについたら、でんわします", m: "역에 도착하면 전화할게요" },
      { j: "お金があったら、旅行に行きたいです", r: "おかねがあったら、りょこうにいきたいです", m: "돈이 있으면 여행을 가고 싶어요" },
    ],
    practice: [
      { j: "大人になったら、医者になりたいです", r: "おとなになったら、いしゃになりたいです", m: "어른이 되면 의사가 되고 싶어요" },
      { j: "宿題が終わったら、遊びに行きます", r: "しゅくだいがおわったら、あそびにいきます", m: "숙제가 끝나면 놀러 가요" },
      { j: "ボタンを押したら、音が鳴りました", r: "ボタンをおしたら、おとがなりました", m: "버튼을 눌렀더니 소리가 났어요" },
      { j: "雨が止んだら、出かけましょう", r: "あめがやんだら、でかけましょう", m: "비가 그치면 나가요" },
    ], tip: "ば보다 더 일상적으로 쓰여요." },
  { title: "~ながら — ~하면서", level: "N4",
    rule: "동사 ます형 + ながら → 동시 동작",
    examples: [
      { j: "音楽を聴きながら、勉強します", r: "おんがくをききながら、べんきょうします", m: "음악을 들으면서 공부해요" },
      { j: "歩きながら、話しましょう", r: "あるきながら、はなしましょう", m: "걸으면서 이야기해요" },
      { j: "テレビを見ながら、ご飯を食べます", r: "テレビをみながら、ごはんをたべます", m: "TV를 보면서 밥을 먹어요" },
      { j: "コーヒーを飲みながら、本を読みます", r: "コーヒーをのみながら、ほんをよみます", m: "커피를 마시면서 책을 읽어요" },
    ],
    practice: [
      { j: "歌を歌いながら、料理します", r: "うたをうたいながら、りょうりします", m: "노래를 부르면서 요리해요" },
      { j: "スマホを見ながら、歩くのは危ないです", r: "スマホをみながら、あるくのはあぶないです", m: "스마트폰을 보면서 걷는 건 위험해요" },
      { j: "働きながら、大学に通っています", r: "はたらきながら、だいがくにかよっています", m: "일하면서 대학교에 다니고 있어요" },
      { j: "電話しながら、運転してはいけません", r: "でんわしながら、うんてんしてはいけません", m: "전화하면서 운전하면 안 돼요" },
    ], tip: "주어가 같을 때만 써요." },
  { title: "~ために — ~을 위해서", level: "N4",
    rule: "목적을 나타내요",
    examples: [
      { j: "日本語を覚えるために、毎日勉強します", r: "にほんごをおぼえるために、まいにちべんきょうします", m: "일본어를 배우기 위해 매일 공부해요" },
      { j: "健康のために、運動しています", r: "けんこうのために、うんどうしています", m: "건강을 위해 운동하고 있어요" },
      { j: "試験に合格するために、頑張っています", r: "しけんにごうかくするために、がんばっています", m: "시험에 합격하기 위해 열심히 하고 있어요" },
      { j: "家族のために、働きます", r: "かぞくのために、はたらきます", m: "가족을 위해 일해요" },
    ],
    practice: [
      { j: "将来のために、お金を貯めています", r: "しょうらいのために、おかねをためています", m: "장래를 위해 돈을 모으고 있어요" },
      { j: "夢を叶えるために、努力します", r: "ゆめをかなえるために、どりょくします", m: "꿈을 이루기 위해 노력해요" },
      { j: "子供のために、早く帰ります", r: "こどものために、はやくかえります", m: "아이를 위해 일찍 집에 가요" },
      { j: "日本に留学するために、お金を貯めています", r: "にほんにりゅうがくするために、おかねをためています", m: "일본에 유학 가기 위해 돈을 모으고 있어요" },
    ], tip: "명사 + のために, 동사 기본형 + ために" },
  { title: "~ように — ~하도록", level: "N4",
    rule: "목적이나 바람, 또는 비유를 나타내요",
    examples: [
      { j: "忘れないように、メモしました", r: "わすれないように、めもしました", m: "잊지 않도록 메모했어요" },
      { j: "まるで夢のようです", r: "まるでゆめのようです", m: "마치 꿈 같아요" },
      { j: "電車に遅れないように、早く家を出ます", r: "でんしゃにおくれないように、はやくいえをでます", m: "전철을 놓치지 않도록 일찍 집을 나서요" },
      { j: "よく聞こえるように、大きい声で話してください", r: "よくきこえるように、おおきいこえではなしてください", m: "잘 들리도록 큰 소리로 말해 주세요" },
    ],
    practice: [
      { j: "風邪をひかないように、気をつけてください", r: "かぜをひかないように、きをつけてください", m: "감기 걸리지 않도록 조심하세요" },
      { j: "皆に分かるように、説明しました", r: "みんなにわかるように、せつめいしました", m: "모두가 알 수 있도록 설명했어요" },
      { j: "遅れないように、早く出かけましょう", r: "おくれないように、はやくでかけましょう", m: "늦지 않도록 일찍 나가요" },
      { j: "子供でも読めるように、易しく書きました", r: "こどもでもよめるように、やさしくかきました", m: "아이도 읽을 수 있도록 쉽게 썼어요" },
    ], tip: "~ように祈る = ~하도록 기도하다" },
  { title: "~ことにする — ~하기로 하다", level: "N4",
    rule: "자신의 결심/결정을 표현해요",
    examples: [
      { j: "毎日勉強することにしました", r: "まいにちべんきょうすることにしました", m: "매일 공부하기로 했어요" },
      { j: "タバコをやめることにしました", r: "タバコをやめることにしました", m: "담배를 끊기로 했어요" },
      { j: "来年、日本へ留学することにしました", r: "らいねん、にほんへりゅうがくすることにしました", m: "내년에 일본으로 유학 가기로 했어요" },
      { j: "週末は家でゆっくりすることにしました", r: "しゅうまつはいえでゆっくりすることにしました", m: "주말에는 집에서 푹 쉬기로 했어요" },
    ],
    practice: [
      { j: "明日から早起きすることにしました", r: "あしたからはやおきすることにしました", m: "내일부터 일찍 일어나기로 했어요" },
      { j: "お酒をやめることにしました", r: "おさけをやめることにしました", m: "술을 끊기로 했어요" },
      { j: "新しい仕事を始めることにしました", r: "あたらしいしごとをはじめることにしました", m: "새 일을 시작하기로 했어요" },
      { j: "彼と別れることにしました", r: "かれとわかれることにしました", m: "그와 헤어지기로 했어요" },
    ], tip: "~ことになる = (상황에 의해) ~하게 되다" },
  { title: "~ようになる — ~하게 되다", level: "N4",
    rule: "능력이나 상태의 변화를 나타내요",
    examples: [
      { j: "日本語が話せるようになりました", r: "にほんごがはなせるようになりました", m: "일본어를 말할 수 있게 됐어요" },
      { j: "食べられなかったものが食べられるようになった", r: "たべられなかったものがたべられるようになった", m: "못 먹던 게 먹을 수 있게 됐어요" },
      { j: "日本語を話せるようになりたいです", r: "にほんごをはなせるようになりたいです", m: "일본어를 말할 수 있게 되고 싶어요" },
      { j: "一人で料理ができるようになりました", r: "ひとりでりょうりができるようになりました", m: "혼자 요리를 할 수 있게 됐어요" },
    ],
    practice: [
      { j: "漢字が読めるようになりました", r: "かんじがよめるようになりました", m: "한자를 읽을 수 있게 됐어요" },
      { j: "早く起きられるようになりました", r: "はやくおきられるようになりました", m: "일찍 일어날 수 있게 됐어요" },
      { j: "ピアノが弾けるようになりたいです", r: "ピアノがひけるようになりたいです", m: "피아노를 칠 수 있게 되고 싶어요" },
      { j: "泳げるようになりました", r: "およげるようになりました", m: "수영할 수 있게 됐어요" },
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
      { japanese: "うみ", reading: "うみ", meaning: "바다" },
      { japanese: "えき", reading: "eki", meaning: "역" },
      { japanese: "おかし", reading: "おかし", meaning: "과자" },
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
      { japanese: "かわ", reading: "かわ", meaning: "강" },
      { japanese: "きのう", reading: "kinou", meaning: "어제" },
      { japanese: "くるま", reading: "kuruma", meaning: "자동차" },
      { japanese: "けが", reading: "けが", meaning: "부상" },
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
      { japanese: "さくら", reading: "さくら", meaning: "벚꽃" },
      { japanese: "しごと", reading: "しごと", meaning: "일/직업" },
      { japanese: "すいか", reading: "suika", meaning: "수박" },
      { japanese: "そら", reading: "そら", meaning: "하늘" },
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
      { japanese: "たいよう", reading: "たいよう", meaning: "태양" },
      { japanese: "ちかてつ", reading: "chikatetsu", meaning: "지하철" },
      { japanese: "つき", reading: "つき", meaning: "달" },
      { japanese: "とけい", reading: "とけい", meaning: "시계" },
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
      { japanese: "のみもの", reading: "のみもの", meaning: "음료" },
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
      { japanese: "はな", reading: "はな", meaning: "꽃" },
      { japanese: "ほし", reading: "ほし", meaning: "별" },
      { japanese: "はし", reading: "はし", meaning: "젓가락" },
      { japanese: "ひこうき", reading: "hikouki", meaning: "비행기" },
      { japanese: "ふね", reading: "fune", meaning: "배(선박)" },
      { japanese: "へや", reading: "へや", meaning: "방" },
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
      { japanese: "めがね", reading: "めがね", meaning: "안경" },
      { japanese: "もり", reading: "もり", meaning: "숲" },
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
      { japanese: "やま", reading: "やま", meaning: "산" },
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
      { japanese: "らいねん", reading: "らいねん", meaning: "내년" },
      { japanese: "りんご", reading: "ringo", meaning: "사과" },
      { japanese: "らいしゅう", reading: "raishuu", meaning: "다음주" },
      { japanese: "りょこう", reading: "りょこう", meaning: "여행" },
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
      { japanese: "でんわ", reading: "でんわ", meaning: "전화" },
      { japanese: "おんがく", reading: "おんがく", meaning: "음악" },
      { japanese: "えんぴつ", reading: "えんぴつ", meaning: "연필" },
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

// ── Day 시스템 ───────────────────────────────────────────────
// 실제 달력 날짜가 아니라 "그 프로필이 며칠째 진도를 나갔는지"를 기준으로 Day
// 번호가 매겨진다(useDailyProgress.js에서 계산). 5일마다(5, 10, 15...) 새 진도
// 없이 복습 퀴즈만 하는 날이 끼어들고, 새 학습 내용은 나머지 날에만 채워진다.
const REVIEW_INTERVAL = 5;

export function isReviewDay(dayNum) {
  return dayNum % REVIEW_INTERVAL === 0;
}

// dayNum(복습일 제외) → 실제 컨텐츠가 몇 번째인지(0부터 시작). 복습일 개수만큼
// 빼주면 된다.
function contentIndexForDay(dayNum) {
  return (dayNum - 1) - Math.floor((dayNum - 1) / REVIEW_INTERVAL);
}

// ── 하루 레슨 생성 (새 진도가 있는 날) ────────────────────────────
function buildContentLesson(d) {
  // 글자 파트: 히라가나 + 카타카나 같은 행 (10일 주기)
  const rowIdx = d % 10;
  const hiraRow = hRows[rowIdx];
  const kataRow = kRows[rowIdx];
  const kanaLabel = `${rowNames[rowIdx]}행`;
  const kana = [...hiraRow, ...kataRow];

  // 읽기 단어: 히라가나 3개 + 카타카나 2개, 매일 다른 조합
  const wordPool = kanaReadingWords[rowIdx];
  const hiraWords = seededShuffle(wordPool.hira, d * 137 + rowIdx * 31).slice(0, 3);
  const kataWords = seededShuffle(wordPool.kata, d * 211 + rowIdx * 53).slice(0, 2);
  const readingWords = seededShuffle([...hiraWords, ...kataWords], d * 97 + rowIdx * 13);

  // 단어 파트 (하루 5개)
  const wordStart = (d * 5) % vocabPool.length;
  const words = Array.from({ length: 5 }, (_, i) => vocabPool[(wordStart + i) % vocabPool.length]);

  // 문법 파트 (매일 새 레슨 1개)
  const grammarIdx = d % grammarPool.length;
  const grammar = grammarPool[grammarIdx];
  const isNewGrammar = true;

  // 문장 파트: 아주 쉬운 문장 1개 + 오늘 배운 문법을 활용한 새 문장 4개.
  // (문법 학습 탭의 예문과는 다른 문장이라 그냥 복습이 아니라 실제 응용 연습이 된다)
  // 문장 난이도가 그날 문법 수준(N5→N4로 서서히 올라감)과 항상 같이 움직이므로
  // 갑자기 어려운 문장이 튀어나오지 않는다.
  const easy = easySentences[d % easySentences.length];
  const grammarSentences = grammar.practice.map((ex) => ({
    japanese: ex.j, reading: ex.r, meaning: ex.m,
  }));
  const todaySentences = [easy, ...grammarSentences];

  const baseThemes = ["あ/ア행","か/カ행","さ/サ행","た/タ행","な/ナ행","は/ハ행","ま/マ행","や/ヤ행","ら/ラ행","わ/ワ행"];
  const phase = d < 20 ? "기초 글자" : d < 60 ? "N5 기초" : d < 120 ? "N5 심화" : d < 240 ? "N4 일상" : "N4 심화";
  const theme = `${phase} — ${baseThemes[rowIdx]}`;

  return { kana, kanaLabel, readingWords, words, grammar, isNewGrammar, sentences: todaySentences, theme };
}

// ── 복습 퀴즈 데이 (5일마다) ──────────────────────────────────────
// 4개 보기 객관식 문제를 만든다. 정답 1개 + vocabPool에서 뽑은 오답 3개.
function buildQuizItems(pool, seed, count) {
  const items = seededShuffle(pool.filter((item) => item?.japanese && item?.meaning), seed).slice(
    0, Math.min(count, pool.length)
  );
  const meaningPool = vocabPool.map((w) => w.meaning);
  return items.map((item, i) => {
    const distractorSource = meaningPool.filter((m) => m !== item.meaning);
    const distractors = seededShuffle(distractorSource, seed + i * 17 + 3).slice(0, 3);
    const choices = seededShuffle([item.meaning, ...distractors], seed + i * 29 + 5);
    return { japanese: item.japanese, reading: item.reading, correct: item.meaning, choices };
  });
}

function buildReviewLesson(dayNum) {
  // 이 복습일 바로 앞의 4개 컨텐츠 데이를 복습 대상으로 삼는다.
  const coveredDays = [dayNum - 4, dayNum - 3, dayNum - 2, dayNum - 1];
  const lessons = coveredDays.map((d) => buildContentLesson(contentIndexForDay(d)));

  const words = lessons.flatMap((l) => l.words);
  const sentences = lessons.flatMap((l) => l.sentences);
  const grammarPoints = lessons.map((l) => l.grammar);

  const flashcards = seededShuffle([...words, ...sentences], dayNum * 71 + 11);
  const quizItems = buildQuizItems([...words, ...sentences], dayNum * 131 + 13, 10);

  return {
    isReview: true,
    dayNum,
    coveredDays,
    words,
    sentences,
    grammarPoints,
    flashcards,
    quizItems,
    theme: `${dayNum}일 복습 퀴즈`,
  };
}

export function getDayLesson(dayNum) {
  if (isReviewDay(dayNum)) return buildReviewLesson(dayNum);
  return { ...buildContentLesson(contentIndexForDay(dayNum)), isReview: false, dayNum };
}

// ── 매일 뜨는 "전날 복습" (5일 복습 퀴즈와는 별개, 글자연습 바로 위에 뜬다) ──
// 5일 복습 퀴즈가 끼는 날(dayNum이 REVIEW_INTERVAL의 배수)은 새 컨텐츠가 없으니
// 건너뛰고, 그 앞의 실제 컨텐츠 데이 2개(전날, 전전날)까지만 거슬러 올라간다.
function getPrecedingContentDays(dayNum, count) {
  const days = [];
  let d = dayNum - 1;
  while (d >= 1 && days.length < count) {
    if (!isReviewDay(d)) days.push(d);
    d--;
  }
  return days.reverse(); // 오래된 날 → 최근 날 순
}

export function hasDailyReview(dayNum) {
  return getPrecedingContentDays(dayNum, 1).length > 0;
}

export function getDailyReviewLesson(dayNum) {
  const coveredDays = getPrecedingContentDays(dayNum, 2);
  const lessons = coveredDays.map((d) => buildContentLesson(contentIndexForDay(d)));

  // 글자연습 때 나왔던 단어 + 단어학습 단어 + 문법학습 예문(문장) + 문장 익히기 문장
  const kanaWords = lessons.flatMap((l) => l.readingWords);
  const words = lessons.flatMap((l) => l.words);
  const grammarSentences = lessons.flatMap((l) =>
    l.grammar.examples.map((ex) => ({ japanese: ex.j, reading: ex.r, meaning: ex.m }))
  );
  const sentences = lessons.flatMap((l) => l.sentences);

  const flashcards = seededShuffle(
    [...kanaWords, ...words, ...grammarSentences, ...sentences],
    dayNum * 53 + 7
  );

  return {
    isDailyReview: true,
    dayNum,
    coveredDays,
    flashcards,
    theme: `Day ${coveredDays.join(", ")} 복습`,
  };
}

export { sentences, vocabPool, grammarPool };
