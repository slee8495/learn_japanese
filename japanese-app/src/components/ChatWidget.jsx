import { useEffect, useRef, useState } from "react";
import { speak } from "../utils/speak";
import { speakNatural } from "../utils/speakNatural";

// 메시지 전체(한국어+일본어 섞인 문장)를 통째로 읽어줄 때는 「」 기호를 떼고 읽어야 자연스러움
function speakWholeMessage(text) {
  speakNatural(text.replace(/「([^」]*)」/g, "$1"));
}

const RECORDING_MIME_TYPES = ["audio/webm", "audio/mp4", "audio/ogg"];

function pickRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return undefined;
  return RECORDING_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 「...」로 감싸진 일본어 구간에 발음 버튼을 붙여서 렌더링
function MessageText({ text }) {
  const parts = text.split(/(「[^」]*」)/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) => {
        const match = part.match(/^「([^」]*)」$/);
        if (!match) return <span key={i}>{part}</span>;
        const jp = match[1];
        return (
          <span
            key={i}
            onClick={() => speak(jp)}
            className="inline-flex items-center gap-1 bg-ai-50 text-ai-700 rounded-lg px-1.5 py-0.5 mx-0.5 cursor-pointer"
          >
            {jp}
            <span className="text-xs">🔊</span>
          </span>
        );
      })}
    </p>
  );
}

export default function ChatWidget({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `안녕하세요, ${context?.profile || "학습자"}님! 지금 「${context?.screenLabel || "홈"}」 화면 보고 계시네요. Day ${context?.dayNum ?? ""} 학습 내용에 대해 궁금한 거 있으면 편하게 물어보세요 😊`,
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "요청 실패");
      setMessages((cur) => [...cur, { role: "assistant", content: data.reply }]);
    } catch {
      setError("답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecordingMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
        setTranscribing(true);
        try {
          const audio = await blobToBase64(blob);
          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio }),
          });
          if (!res.ok) throw new Error("transcription failed");
          const { text } = await res.json();
          if (text?.trim()) handleSend(text.trim());
        } catch {
          setError("음성을 인식하지 못했어요. 다시 시도하거나 직접 입력해주세요.");
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("마이크 권한이 필요해요. 브라우저 설정을 확인해주세요.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="AI 튜터와 대화하기"
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-ai-600 text-white text-2xl shadow-lg flex items-center justify-center active:scale-95"
      >
        ✨
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative bg-sumi-50 rounded-t-3xl shadow-2xl w-full max-w-lg mx-auto h-[75vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-sumi-200 bg-white rounded-t-3xl">
          <div>
            <p className="font-bold text-sumi-800">✨ AI 튜터</p>
            <p className="text-xs text-sumi-400">{context?.screenLabel || "홈"} 기준으로 대화 중</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-sumi-400 text-2xl leading-none px-2">
            ×
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "bg-ai-600 text-white"
                    : "bg-white border border-sumi-100 shadow-sm text-sumi-800"
                }`}
              >
                <MessageText text={m.content} />
                <button
                  onClick={() => speakWholeMessage(m.content)}
                  aria-label="이 메시지 전체 읽어주기"
                  className={`mt-1 text-xs ${
                    m.role === "user" ? "text-ai-100" : "text-sumi-400"
                  }`}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-sumi-100 shadow-sm rounded-2xl px-3 py-2 text-sumi-400 text-sm">
                생각 중...
              </div>
            </div>
          )}
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>

        <div className="p-3 border-t border-sumi-200 bg-white flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={recording || transcribing}
            placeholder={
              recording ? "듣고 있어요..." : transcribing ? "음성 인식 중..." : "궁금한 걸 물어보세요..."
            }
            className="flex-1 px-4 py-2.5 rounded-full bg-sumi-100 text-sm focus:outline-none focus:ring-2 focus:ring-ai-300 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => (recording ? stopRecording() : startRecording())}
            disabled={loading || transcribing}
            aria-pressed={recording}
            aria-label={recording ? "녹음 중지" : "음성으로 질문하기"}
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center disabled:opacity-40 ${
              recording ? "bg-red-500 text-white animate-pulse" : "bg-sumi-100 text-sumi-600"
            }`}
          >
            {recording ? "⏹" : "🎤"}
          </button>
          <button
            onClick={() => handleSend()}
            disabled={loading || recording || transcribing || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-full bg-ai-600 text-white flex items-center justify-center disabled:opacity-40"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
