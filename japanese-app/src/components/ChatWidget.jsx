import { useEffect, useRef, useState } from "react";
import { speak } from "../utils/speak";
import { speakNatural } from "../utils/speakNatural";

// 메시지 전체(한국어+일본어 섞인 문장)를 통째로 읽어줄 때는 「」 기호를 떼고 읽어야 자연스러움
function speakWholeMessage(text) {
  speakNatural(text.replace(/「([^」]*)」/g, "$1"));
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
            className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 rounded-lg px-1.5 py-0.5 mx-0.5 cursor-pointer"
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
  const scrollRef = useRef(null);

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

  async function handleSend() {
    const text = input.trim();
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="AI 튜터와 대화하기"
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-indigo-600 text-white text-2xl shadow-lg flex items-center justify-center active:scale-95"
      >
        ✨
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative bg-gray-50 rounded-t-3xl shadow-2xl w-full max-w-lg mx-auto h-[75vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-3xl">
          <div>
            <p className="font-bold text-gray-800">✨ AI 튜터</p>
            <p className="text-xs text-gray-400">{context?.screenLabel || "홈"} 기준으로 대화 중</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 text-2xl leading-none px-2">
            ×
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-100 shadow-sm text-gray-800"
                }`}
              >
                <MessageText text={m.content} />
                <button
                  onClick={() => speakWholeMessage(m.content)}
                  aria-label="이 메시지 전체 읽어주기"
                  className={`mt-1 text-xs ${
                    m.role === "user" ? "text-indigo-100" : "text-gray-400"
                  }`}
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-3 py-2 text-gray-400 text-sm">
                생각 중...
              </div>
            </div>
          )}
          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="궁금한 걸 물어보세요..."
            className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-40"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
