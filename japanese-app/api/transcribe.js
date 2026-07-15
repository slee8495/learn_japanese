import { gateway, transcribe } from "ai";

// 챗봇 마이크 입력용 음성 인식(STT). speak.js의 TTS와 같은 Vercel AI Gateway 경유,
// OpenAI gpt-4o-mini-transcribe 사용. 브라우저 MediaRecorder가 만든 오디오 blob을
// base64로 감싸 JSON body로 보냄(멀티파트 파서 없이 처리하기 위함).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { audio } = req.body || {};
  if (!audio) {
    res.status(400).json({ error: "audio가 필요합니다." });
    return;
  }

  try {
    const bytes = Buffer.from(audio, "base64");
    if (bytes.length === 0) {
      res.status(400).json({ error: "audio가 비어있습니다." });
      return;
    }

    const { text } = await transcribe({
      model: gateway.transcription("openai/gpt-4o-mini-transcribe"),
      audio: new Uint8Array(bytes),
    });

    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "음성 인식 중 오류가 발생했습니다.", detail: String(err?.message || err) });
  }
}
