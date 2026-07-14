import { gateway, generateSpeech } from "ai";

// 챗봇 답변 전체를 읽어줄 때만 쓰는 신경망 TTS(OpenAI tts-1-hd, Vercel AI Gateway 경유).
// 단어/문장 단위 발음 버튼은 브라우저 기본 TTS(utils/speak.js)를 그대로 씀 — 짧은
// 일본어 단어는 그쪽이 더 낫다는 사용자 피드백 반영.
export default async function handler(req, res) {
  const text = String(req.query?.text || "").trim().slice(0, 1000);
  if (!text) {
    res.status(400).json({ error: "text가 필요합니다." });
    return;
  }

  try {
    const { audio } = await generateSpeech({
      model: gateway.speech("openai/tts-1-hd"),
      text,
      voice: "nova",
      outputFormat: "mp3",
    });

    res.setHeader("Content-Type", audio.mediaType || "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).send(Buffer.from(audio.uint8Array));
  } catch (err) {
    res.status(500).json({ error: "TTS 요청 중 오류가 발생했습니다.", detail: String(err?.message || err) });
  }
}
