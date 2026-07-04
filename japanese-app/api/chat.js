function buildSystemPrompt(context = {}) {
  const { profile, dayNum, screenLabel, lesson } = context;

  const kanaText =
    lesson?.kana?.map((k) => `${k.char}(${k.romaji})`).join(" ") || "없음";
  const readingWordsText =
    lesson?.readingWords?.map((w) => `${w.japanese}(${w.reading}, ${w.meaning})`).join(", ") ||
    "없음";
  const wordsText =
    lesson?.words?.map((w) => `${w.japanese}(${w.reading}, ${w.meaning})`).join(", ") || "없음";
  const grammarText = lesson?.grammar
    ? `${lesson.grammar.title} — ${lesson.grammar.rule}\n예문: ${
        lesson.grammar.examples?.map((e) => `${e.j}(${e.r}, ${e.m})`).join(" / ") || ""
      }`
    : "없음";
  const sentencesText =
    lesson?.sentences?.map((s) => `${s.japanese}(${s.meaning})`).join(" / ") || "없음";

  return `당신은 "일본어 학습" 앱 안에 내장된 친절한 일본어 튜터 챗봇입니다.
사용자 이름: ${profile || "학습자"}
현재 학습 Day: ${dayNum ?? "?"}
사용자가 지금 보고 있는 화면: ${screenLabel || "홈"}

오늘(Day ${dayNum ?? "?"})의 학습 내용:
- 글자(가나): ${kanaText}
- 글자 읽기 연습 단어: ${readingWordsText}
- 오늘의 단어: ${wordsText}
- 오늘의 문법: ${grammarText}
- 오늘의 문장: ${sentencesText}

규칙:
1. 사용자는 한국어 원어민이고 일본어를 기초부터 차근차근 배우는 중입니다. 답변은 한국어 위주로, 짧고 친근하게(3~5문장 이내) 하세요.
2. 일본어 단어나 문장을 언급할 때는 반드시 「」로 감싸서 쓰세요. 예: 「ありがとう」. 앱이 이 기호를 인식해서 발음 버튼을 자동으로 붙여줍니다.
3. 사용자가 질문하면 오늘 배운 내용과 연결해서 설명하고, 비슷한 예문을 1~2개 추가로 제시하세요.
4. 가끔 오늘 배운 단어나 문법을 사용해서 짧은 대화 연습을 먼저 제안하세요.
5. 이모지를 적당히 섞어서 다정한 선생님처럼 대화하세요.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." });
    return;
  }

  const { messages, context } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages가 필요합니다." });
    return;
  }

  const trimmedMessages = messages.slice(-16).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 2000),
  }));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: buildSystemPrompt(context),
        messages: trimmedMessages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || "Claude API 오류" });
      return;
    }

    const reply = data.content?.map((c) => c.text || "").join("") || "";
    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "채팅 요청 중 오류가 발생했습니다." });
  }
}
